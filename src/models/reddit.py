from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RedditComment(BaseModel):
    id: str
    created_utc: datetime
    subreddit: str
    score: int
    author: Optional[str]
    parent_id: str
    is_submitter: bool
    total_awards_received: int
    body: str
    body_html: str
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[str] = None