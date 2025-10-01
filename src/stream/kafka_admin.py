from confluent_kafka.admin import AdminClient, NewTopic
from src.utils.logging_config import get_logger

logger = get_logger(__name__)

def create_admin_client() -> AdminClient:
    config = {
        'bootstrap.servers': 'localhost:9092'
    }
    return AdminClient(config)


def setup_topic():
    TOPIC_NAME = "reddit-comments"
    TOPIC_PARTITIONS = 3
    TOPIC_REPLICATION_FACTOR = 1

    logger.info("Connecting to Kafka and creating topic...")
    admin_client = create_admin_client()
    topic = NewTopic(TOPIC_NAME, num_partitions=TOPIC_PARTITIONS, replication_factor=TOPIC_REPLICATION_FACTOR)
    futures = admin_client.create_topics([topic])
    
    for TOPIC_NAME, future in futures.items():
        try:
            future.result()
            logger.info(f"Topic '{TOPIC_NAME}' created successfully")
        except Exception as e:
            if "already exists" in str(e):
                logger.info(f"Topic '{TOPIC_NAME}' already exists - skipping")
            else:
                logger.error(f"Error creating topic: {e}")
    
    # List current topics
    metadata = admin_client.list_topics(timeout=10)
    logger.debug(f"Current topics: {list(metadata.topics.keys())}")


if __name__ == "__main__":
    TOPIC_NAME = "reddit-comments"
    TOPIC_PARTITIONS = 3
    TOPIC_REPLICATION_FACTOR = 1

    logger.info("Connecting to Kafka and creating topic...")
    admin_client = create_admin_client()
    topic = NewTopic(TOPIC_NAME, num_partitions=TOPIC_PARTITIONS, replication_factor=TOPIC_REPLICATION_FACTOR)
    futures = admin_client.create_topics([topic])
    
    for TOPIC_NAME, future in futures.items():
        try:
            future.result()
            logger.info(f"Topic '{TOPIC_NAME}' created successfully")
        except Exception as e:
            if "already exists" in str(e):
                logger.info(f"Topic '{TOPIC_NAME}' already exists - skipping")
            else:
                logger.error(f"Error creating topic: {e}")
    
    # List current topics
    metadata = admin_client.list_topics(timeout=10)
    logger.debug(f"Current topics: {list(metadata.topics.keys())}")