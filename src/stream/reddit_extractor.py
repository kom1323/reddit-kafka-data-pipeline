import pandas as pd
import praw
import os
from typing import Dict
from datetime import datetime, timezone
from src.models.reddit import RedditComment
from confluent_kafka import Producer
from src.utils.logging_config import get_logger
from dotenv import load_dotenv
load_dotenv(dotenv_path="secrets/.env.app")

CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
USER_AGENT = os.getenv("REDDIT_USER_AGENT")

logger = get_logger(__name__)



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


def setup_kafka_producer():
    config = {
        'bootstrap.servers': 'localhost:9092',
        'acks': 'all',
        'retries': 3,
        'batch.size': 16384,
        'linger.ms': 10
    }
    return Producer(config)

def delivery_report(err, msg):
    """Callback function for Kafka message delivery reports."""
    if err is not None:
        logger.error(f"Message delivery failed: {err} | Key: {msg.key()}")
    else:
        logger.info(f"Message delivered | Key: {msg.key()} | Partition: {msg.partition()} | Offset: {msg.offset()}")


def extract():
    reddit = praw.Reddit(
       client_id=CLIENT_ID,
       client_secret=CLIENT_SECRET,
       user_agent=USER_AGENT
    )
    kafka_producer = setup_kafka_producer()
    topic_name = "reddit-comments"
    submission_limit = 3
    comments_per_submission_limit = 3

    subreddit = reddit.subreddit("datascience")
    for submission in subreddit.new(limit=submission_limit):
        
        print(submission.title)
        print("#############################") 
        for comment in submission.comments.list()[:comments_per_submission_limit]:
            
            comment_data = extract_comment_data(comment)
            reddit_comment = RedditComment(**comment_data)
            kafka_producer.produce(topic_name,
                                    value=reddit_comment.model_dump_json(),
                                    key=comment_data['subreddit'],
                                    callback=delivery_report)


            print(reddit_comment.body)

            print("#############################")  
            break
    kafka_producer.flush()

if __name__ == "__main__":
    extract()






