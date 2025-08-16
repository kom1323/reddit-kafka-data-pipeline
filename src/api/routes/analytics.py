from turtle import ht
from fastapi import APIRouter, HTTPException, Query
from src.db.connections import connect_psycorpg
from src.utils.logging_config import get_logger
from typing import Annotated
logger = get_logger(__name__)
router = APIRouter()



@router.get("/summary")
async def get_summary():

    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()
            
            analytics = {}

            query_count = """
                    SELECT COUNT(*)
                    FROM reddit_comments
                    """

            query_count_per_subreddit = """
                                        SELECT subreddit, COUNT(*)
                                        FROM reddit_comments
                                        GROUP BY subreddit
                                        ORDER BY COUNT(*) DESC 
                                        """
            
            
            query_top10_authors = """
                                  SELECT author, COUNT(*), AVG(score)
                                  FROM reddit_comments
                                  WHERE author IS NOT NULL
                                  GROUP BY author
                                  ORDER BY COUNT(*) DESC
                                  LIMIT 10
                                  """

            cur.execute(query_count)
            analytics['total_comments'] = cur.fetchone()[0]
            cur.execute(query_count_per_subreddit)
            analytics['subreddit_breakdown'] = [{'subreddit': entry[0], 'count': entry[1]} for entry in cur.fetchall() ]
            cur.execute(query_top10_authors)
            analytics['top_authors'] = [{'author': entry[0], 'comment_count': entry[1], 'avg_score': float(entry[2]) if entry[2] else 0} for entry in cur.fetchall()]
           
            return analytics
        
    except Exception as e:
        logger.error(f"Error retrieving analytics summary: {e}")
        raise HTTPException(status_code=500, detail="Database error")




@router.get('/trending')
async def get_trending(limit: Annotated[int | None, Query(ge=1, le=50)] = 10):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()

            query = """
                    SELECT id, body, subreddit, score, author, created_utc
                    FROM reddit_comments
                    WHERE score > 0
                    ORDER BY score DESC
                    LIMIT %s
            
                    """
            cur.execute(query, (limit,))
            return {
                "trending_comments": [
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
            }

    except Exception as e:
        logger.error(f"Error retrieving analytics trending: {e}")
        raise HTTPException(status_code=500, detail="Database error")



@router.get("/subreddits/{subreddit_name}")
async def get_subreddit_stats(subreddit_name: str):
    try:
        with connect_psycorpg() as conn:
            cur = conn.cursor()
    
            query_basic_stats = """
                                SELECT COUNT(*), AVG(score), MAX(score), COUNT(DISTINCT author)
                                FROM reddit_comments
                                WHERE subreddit = %s
                                """
            query_recent_comments = """
                                    SELECT id, body, score, author, created_utc
                                    FROM reddit_comments
                                    WHERE subreddit = %s
                                    ORDER BY created_utc DESC
                                    LIMIT 10
                                    """

            cur.execute(query_basic_stats, (subreddit_name,))
            basic_stats = cur.fetchone()
            cur.execute(query_recent_comments, (subreddit_name,))
            recent_comments = cur.fetchall()

            if basic_stats[0] == 0:
                logger.debug(f"Subreddit {subreddit_name} not found")
                raise HTTPException(status_code=404, detail="Subreddit not found")

            return {
                "subreddit": subreddit_name,
                "total_comments": basic_stats[0],
                "avg_score": float(basic_stats[1]) if basic_stats[1] else 0,
                "max_score": basic_stats[2],
                "unique_authors": basic_stats[3],
                "recent_comments": [
                    {
                        "id": entry[0],
                        "body": entry[1],
                        "score": entry[2],
                        "author": entry[3],
                        "created_utc": entry[4]
                    }
                        for entry in recent_comments
                ]
            }

    except Exception as e:
        logger.error(f"Error retrieving subreddit stats: {e}")
        raise HTTPException(status_code=500, detail="Database error")