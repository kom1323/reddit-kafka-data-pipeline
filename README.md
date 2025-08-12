# Reddit Kafka Data Pipeline

This repository contains a real-time streaming data pipeline that extracts Reddit comments, processes them through Apache Kafka, and stores them in PostgreSQL. The project demonstrates modern data engineering practices including stream processing, message queuing, data validation, and observability.

## Pipeline Architecture

The Reddit Kafka Data Pipeline follows a modern streaming architecture:

**Data Flow**
```
Reddit API (PRAW) → Kafka Producer → Kafka Topics → Kafka Consumer → PostgreSQL
```

**Key Components:**
- **Reddit Extractor**: Fetches comments from specified subreddits using PRAW
- **Kafka Producer**: Streams Reddit comments to Kafka topics with subreddit-based partitioning
- **Kafka Consumer**: Processes messages with Pydantic validation and stores in PostgreSQL
- **Database Layer**: PostgreSQL with connection pooling and duplicate handling
- **Observability**: Structured logging with Kafka metadata tracking

## Running the Pipeline

### Prerequisites

1. **Clone this repository**
2. **Set up Python environment** with conda/virtualenv and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment variables** by copying and editing the example files:
   ```bash
   cp .env.app.example secrets/.env.app
   cp .env.reddit.example secrets/.env.reddit
   ```
4. **Start infrastructure services** using Docker Compose:
   ```bash
   docker compose up -d
   ```

### Running the Data Pipeline

1. **Create Kafka topic** (one-time setup):
   ```bash
   python -m src.stream.kafka_admin
   ```

2. **Start the Kafka consumer** (in one terminal):
   ```bash
   python -m src.stream.kafka_consumer
   ```

3. **Run the Reddit extractor** (in another terminal):
   ```bash
   python -m src.stream.reddit_extractor
   ```

4. **Verify data storage** by querying PostgreSQL:
   ```bash
   python -m src.db.postgres_extract
   ```

## Implementation Details

### Data Extraction and Validation

Reddit comments are extracted using the **PRAW** library and validated with **Pydantic** models to ensure data quality and type safety.

### Stream Processing Architecture

The pipeline implements **Apache Kafka** for reliable message streaming with:
- **Producer**: Publishes Reddit comments with subreddit-based partitioning
- **Consumer Groups**: Enables horizontal scaling of message processing
- **Offset Management**: Ensures exactly-once processing semantics
- **Error Handling**: Graceful failure recovery and logging

### Database Design

PostgreSQL storage with professional practices:
- **Parameterized queries** for SQL injection prevention
- **Idempotent inserts** using `ON CONFLICT DO NOTHING`
- **Connection management** with proper resource cleanup
- **Schema validation** with dynamic table creation

## Technology Stack

The pipeline is built with Python 3.9+ and relies on the following technologies:

**Core Infrastructure**
* **Apache Kafka** - distributed streaming platform for real-time data processing
* **PostgreSQL** - relational database for persistent storage
* **Docker & Docker Compose** - containerized infrastructure management

**Python Libraries**

**Data Processing & Validation**
* [*praw*](https://praw.readthedocs.io/) - Reddit API wrapper for data extraction
* [*pydantic*](https://pydantic-docs.helpmanual.io/) - data validation and serialization using type hints
* [*confluent-kafka*](https://docs.confluent.io/kafka-clients/python/current/overview.html) - high-performance Kafka client for Python

**Database & Connectivity**
* [*psycopg*](https://www.psycopg.org/psycopg3/) - PostgreSQL adapter with modern async support
* [*sqlalchemy*](https://www.sqlalchemy.org/) - SQL toolkit and ORM for database operations
* [*pandas*](https://pandas.pydata.org/) - data analysis and manipulation for querying

**Configuration & Utilities**
* [*python-dotenv*](https://github.com/theskumar/python-dotenv) - environment variable management
* **logging** - structured logging with configurable levels and formatting

## Code Quality and Development

The project follows professional development practices:

**Project Structure**
```
src/
├── stream/          # Kafka producers, consumers, and admin utilities
├── db/             # Database connections, schema, and data loading
├── utils/          # Logging configuration and shared utilities
└── models/         # Pydantic data models for validation
```

**Key Design Patterns**
* **Dependency injection** with environment-based configuration
* **Connection pooling** for efficient database resource management
* **Structured logging** with correlation IDs and metadata
* **Error handling** with graceful degradation and retry logic
* **Type safety** using Python type hints throughout

## Observability and Monitoring

The pipeline includes comprehensive observability features:

* **Structured logging** with timestamps, log levels, and source identification
* **Kafka metadata tracking** including topics, partitions, and offsets
* **Database operation logging** with insert success/failure tracking
* **Performance metrics** for throughput and latency monitoring
* **Error tracking** with detailed exception logging and context

## Future Enhancements

**Planned Features**
- [ ] **FastAPI REST API** for querying stored Reddit data
- [ ] **React Dashboard** with real-time data visualizations
- [ ] **Apache Airflow** for ETL job orchestration
- [ ] **dbt** for data transformation and analytics
- [ ] **Prometheus/Grafana** for metrics and monitoring
- [ ] **CI/CD Pipeline** with GitHub Actions
- [ ] **Cloud Deployment** on AWS/GCP with Kubernetes

## Contributing

This project is part of a data engineering portfolio demonstration. While contributions are not actively sought, the codebase serves as a reference for modern streaming data pipeline implementation.

## License

This project is for educational purposes.
