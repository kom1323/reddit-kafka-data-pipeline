from confluent_kafka import Consumer, Message
from src.utils.logging_config import get_logger
from pydantic_core import from_json
from pydantic import ValidationError
from src.models.reddit import RedditComment
from src.db.connections import connect_psycorpg
from psycopg import Connection, Cursor
from src.db.data_loader import create_reddit_comments_table, insert_reddit_comment
from transformers import pipeline
from transformers.pipelines import Pipeline
import threading

logger = get_logger(__name__)

def setup_kafka_consumer() -> Consumer:
    config = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
    }
    return Consumer(config)

def msg_to_postgres(msg: Message, sentiment_pipeline: Pipeline, cur: Cursor, conn: Connection) -> None:

    offset = msg.offset()
    partition = msg.partition()
    topic = msg.topic()

    logger.info(f"Processing message | Topic: {topic} | Partition: {partition} | Offset: {offset}")

    try:
        message_value = msg.value().decode('utf-8')
        reddit_comment = RedditComment.model_validate_json(message_value)
        sentiment = sentiment_pipeline(reddit_comment.body)
        reddit_comment.sentiment_label = sentiment[0]['label']
        reddit_comment.sentiment_score = sentiment[0]['score']
    except ValidationError as e:
        logger.error(f"Pydantic validation error: {e}")
        return
    
    insert_reddit_comment(reddit_comment, cur, conn)
    



def consume_comments(api_exit_event: threading.Event) -> None:
    consumer = setup_kafka_consumer()
    TOPIC_NAME = "reddit-comments"
    sentiment_pipeline = pipeline("sentiment-analysis")

    with connect_psycorpg() as conn:
        cur = conn.cursor()
        create_reddit_comments_table(cur, conn)
    
        consumer.subscribe([TOPIC_NAME])

        logger.info(f"Consuming messages from {TOPIC_NAME}...")
        try:
            while True:
                if api_exit_event.is_set():
                    break
                msg = consumer.poll(timeout=1.0)
                if msg is None:
                    continue
                if msg.error():
                    logger.error(f"Kafka error: {msg.error()}")
                    continue
                msg_to_postgres(msg, sentiment_pipeline, cur, conn)

        except KeyboardInterrupt:
            pass
        finally:
            logger.info(f"Done consuming.")
            consumer.close()


if __name__ == "__main__":
    consume_comments()
