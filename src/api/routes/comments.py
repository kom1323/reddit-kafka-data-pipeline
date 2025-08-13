from fastapi import APIRouter, HTTPException, Query
from src.db.connections import connect_psycorpg
from src.utils.logging_config import get_logger
from typing import Annotated
logger = get_logger(__name__)
router = APIRouter()

COMMENT_COLUMNS = ['id', 'body', 'created_utc', 'subreddit', 'score', 'author']

@router.get("/")
async def get_comments(limit: Annotated[int | None, Query()] = None, 
                        offset: Annotated[int | None, Query()] = None ):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()

            if not limit:
                limit = 10
            if not offset:
                offset = 0


            query = f"""
                    SELECT {', '.join(COMMENT_COLUMNS)}
                    FROM reddit_comments
                    ORDER BY created_utc
                    DESC
                    LIMIT %s
                    OFFSET %s;
                    """

            cur.execute(query, (limit, offset))
            rows = cur.fetchall()
            comments = [dict(zip(columns, row)) for row in rows]
            return {"comments": comments, "count": len(comments)}

    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")


@router.get("/{comment_id}")
async def get_comment(comment_id):
    pass