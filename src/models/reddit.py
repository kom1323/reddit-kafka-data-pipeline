from pydantic import BaseModel
from datetime import datetime


class RedditComment(BaseModel):
    id: str
    created_utc: datetime
    subreddit: str
    score: int
    author: str
    parent_id: str
    is_submitter: bool
    total_awards_received: int
    body: str
    body_html: str