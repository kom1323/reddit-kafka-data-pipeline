from confluent_kafka import Consumer
from src.utils.logging_config import get_logger
from pydantic_core import from_json
from src.models.reddit import RedditComment
from src.db.connections import connect_psycorpg
from src.db.data_loader import create_reddit_comments_table, insert_reddit_comment
logger = get_logger(__name__)

def setup_kafka_consumer():
    config = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
    }
    return Consumer(config)

def msg_to_postgres(msg, cur, conn):

    offset = msg.offset()
    partition = msg.partition()
    topic = msg.topic()

    logger.info(f"Processing message | Topic: {topic} | Partition: {partition} | Offset: {offset}")

    try:
        message_value = msg.value().decode('utf-8')
        reddit_comment = RedditComment.model_validate_json(message_value)
    except ValidationError as e:
        logger.error(f"Pydantic validation error: {e}")
        return
    
    insert_reddit_comment(reddit_comment, cur, conn)
    



def consume_comments():
    consumer = setup_kafka_consumer()
    topic_name = "reddit-comments"
    
    with connect_psycorpg() as conn:
        cur = conn.cursor()
        create_reddit_comments_table(cur, conn)
    
        consumer.subscribe([topic_name])

        logger.info(f"Consuming messages from {topic_name}...")
        try:
            while True:
                msg = consumer.poll(timeout=1.0)
                if msg is None:
                    continue
                if msg.error():
                    logger.error(f"Kafka error: {msg.error()}")
                    continue
                msg_to_postgres(msg, cur, conn)

        except KeyboardInterrupt:
            pass
        finally:
            logger.info(f"Done consuming.")
            consumer.close()


if __name__ == "__main__":
    consume_comments()
