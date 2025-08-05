import pandas as pd
import praw
import os
from typing import Dict
from datetime import datetime, timezone
from models.reddit import RedditComment
from dotenv import load_dotenv
load_dotenv(dotenv_path="../secrets/.env.app")

CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
USER_AGENT = os.getenv("REDDIT_USER_AGENT")


def extract_comment_data(comment) -> Dict[str, any]:
    return {
        'id': comment.id,
        'body': comment.body,
        'created_utc': datetime.fromtimestamp(comment.created_utc, tz=timezone.utc),
        'subreddit': comment.subreddit.display_name,
        'score': comment.score,
        'author': comment.author.name if comment.author else None,
        'parent_id': comment.parent_id,
        'is_submitter': comment.is_submitter,
        'body_html': comment.body_html,
        'total_awards_received': comment.total_awards_received
    }

def extract():
    reddit = praw.Reddit(
       client_id=CLIENT_ID,
       client_secret=CLIENT_SECRET,
       user_agent=USER_AGENT
    )

    subreddit = reddit.subreddit("datascience")
    for submission in subreddit.new(limit=1):
        
        print(submission.title)
        print("#############################") 
        print("#############################") 
        for comment in submission.comments.list():
            
            comment_data = extract_comment_data(comment)
            reddit_comment = RedditComment(**comment_data)


            print(reddit_comment)

            print("-----------------------------") 
            break

if __name__ == "__main__":
    extract()






