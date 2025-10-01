from fastapi import APIRouter, HTTPException, Query
from src.db.connections import connect_psycorpg
from src.db.data_loader import check_subreddits_exists
from src.stream.reddit_extractor import extract
from src.utils.logging_config import get_logger
from typing import Annotated
import time
logger = get_logger(__name__)
router = APIRouter()

COMMENT_COLUMNS_SHORT = ['id', 'body', 'created_utc', 'subreddit', 'score', 'author']
COMMENT_COLUMNS_LONG = ['id', 'body', 'body_html', 'created_utc', 'subreddit', 'score', 'author', 'parent_id', 'is_submitter', 'total_awards_received']


@router.get("/")
async def get_comments(limit: Annotated[int | None, Query(le=100)] = None, 
                        offset: Annotated[int | None, Query(ge=0)] = None ):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()

            if not limit:
                limit = 10
            if not offset:
                offset = 0


            query = f"""
                    SELECT {', '.join(COMMENT_COLUMNS_SHORT)}
                    FROM reddit_comments
                    ORDER BY created_utc
                    DESC
                    LIMIT %s
                    OFFSET %s;
                    """

            cur.execute(query, (limit, offset))
            rows = cur.fetchall()
            comments = [dict(zip(COMMENT_COLUMNS_SHORT, row)) for row in rows]
            return {"comments": comments, "count": len(comments)}

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Database error")

@router.get("/search")
async def search_comments(  q: Annotated[str, Query(min_length=1,max_length=50)],
                            subreddits: Annotated[list[str], Query()],
                            limit: Annotated[int | None, Query(ge=1, le=100)]=20):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()

            subs_to_add = check_subreddits_exists(cur, conn, subreddits)
            if subs_to_add:
                await extract(subs_to_add)
                

            placeholders = ", ".join(["%s"] * len(subreddits))
            query = f"""
                    SELECT id, body, subreddit, score, author, created_utc
                    FROM reddit_comments
                    WHERE body ILIKE %s AND subreddit IN ({placeholders})
                    ORDER BY created_utc DESC
                    LIMIT %s
                    """
            params = [f"%{q}%"] + subreddits + [limit]
            cur.execute(query, params)

            results = [
                {
                    "id": entry[0],
                    "body": entry[1],
                    "subreddit": entry[2],
                    "score": entry[3],
                    "author": entry[4],
                    "created_utc": entry[5]
                } 
                for entry in cur.fetchall()
            ]
            
            return {
                "query": q,
                "count": len(results),
                "results": results
                
            }


    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Database error")

@router.get("/{comment_id}")
async def get_comment(comment_id: str):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()

            query = f"""
                    SELECT {', '.join(COMMENT_COLUMNS_LONG)} 
                    FROM reddit_comments
                    WHERE id = %s
                    """ 
            cur.execute(query, (comment_id,))
            data = cur.fetchone()
            if not data:
                raise HTTPException(status_code=404, detail="Comment not found")

            return dict(zip(COMMENT_COLUMNS_LONG, data))

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Database error")
