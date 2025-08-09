from confluent_kafka import Consumer
from src.utils.logging_config import get_logger
from pydantic_core import from_json
from src.models.reddit import RedditComment

logger = get_logger(__name__)

def setup_kafka_consumer():
    config = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
    }
    return Consumer(config)

def msg_to_postgres(msg):
    try:
        message_value = msg.value().decode('utf-8')
        
        
        reddit_comment = RedditComment(from_json(msg, allow_partial=False))
    except ValueError as e:
        logger.error("Consumer error processing kafka msg.")
    




    #> EOF while parsing a string at line 1 column 15

def consume_comments():
    consumer = setup_kafka_consumer()
    topic_name = "reddit-comments"
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
            msg_to_postgres(msg)
    except KeyboardInterrupt:
        pass
    finally:
        logger.info(f"Done consuming.")
        consumer.close()


if __name__ == "__main__":
    consume_comments()
