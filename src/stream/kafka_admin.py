from confluent_kafka.admin import AdminClient, NewTopic
from src.utils.logging_config import get_logger

logger = get_logger(__name__)

def create_admin_client():
    config = {
        'bootstrap.servers': 'localhost:9092'
    }
    return AdminClient(config)

if __name__ == "__main__":
    topic_name = "reddit-comments"
    topic_partitions = 3
    topic_replication_factor = 1

    logger.info("Connecting to Kafka and creating topic...")
    admin_client = create_admin_client()
    topic = NewTopic(topic_name, num_partitions=topic_partitions, replication_factor=topic_replication_factor)
    futures = admin_client.create_topics([topic])
    
    for topic_name, future in futures.items():
        try:
            future.result()
            logger.info(f"Topic '{topic_name}' created successfully")
        except Exception as e:
            if "already exists" in str(e):
                logger.info(f"Topic '{topic_name}' already exists - skipping")
            else:
                logger.error(f"Error creating topic: {e}")
    
    # List current topics
    metadata = admin_client.list_topics(timeout=10)
    logger.info(f"Current topics: {list(metadata.topics.keys())}")