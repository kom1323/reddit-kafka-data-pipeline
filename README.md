# Reddit Comment Dashboard

A modern web dashboard for searching and analyzing Reddit comments, powered by a real-time streaming data pipeline using React, FastAPI, Apache Kafka, and PostgreSQL with integrated sentiment analysis.


## Pipeline Architecture

The Reddit Kafka Data Pipeline follows a modern streaming architecture:

**High-Level Architecture**
```
React Dashboard → FastAPI REST API
                       ↓
Reddit API (PRAW) → Kafka → PostgreSQL
```

**Detailed Data Flow**
```
Reddit API (PRAW) → Kafka Producer → Kafka Topics → Kafka Consumer → PostgreSQL
     ↑                    ↑              ↓              ↑              ↓
Host Machine        Host Machine   Docker Container  Host Machine  Docker Container
```

**Key Components:**
- **React Dashboard**: Modern web interface for searching and analyzing Reddit data
- **FastAPI Backend**: REST API with automatic data collection for missing subreddits
- **Reddit Extractor**: Fetches comments from specified subreddits using PRAW
- **Kafka Producer**: Streams Reddit comments to Kafka topics with subreddit-based partitioning
- **Kafka Consumer**: Processes messages with Pydantic validation, sentiment analysis, and PostgreSQL storage
- **Database Layer**: PostgreSQL with connection pooling and duplicate handling
- **Observability**: Structured logging with Kafka metadata tracking

### Running the Complete System

### Prerequisites

1. **Clone this repository**
2. **Install Docker and Docker Compose** for running Kafka and PostgreSQL containers
3. **Set up Python environment** with conda/virtualenv and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure environment variables** by copying and editing the example files:
   ```bash
   cp .env.app.example secrets/.env.app
   cp .env.reddit.example secrets/.env.reddit
   ```
5. **Start containerized services** using Docker Compose:
   ```bash
   docker compose up -d
   ```
   This will start:
   - **Kafka broker** container on `localhost:9092`
   - **PostgreSQL database** container on `localhost:5432`

### Running the Data Pipeline

1. **Start the FastAPI backend** (in one terminal):
   ```bash
   fastapi dev src/api/main.py
   ```

2. **Start the React dashboard** (in another terminal):
   ```bash
   cd reddit-dashboard
   npm install  # First time only
   npm run dev
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

**Frontend Technologies**
* **React + TypeScript** - Modern frontend framework with type safety
* **Vite** - Fast build tool and development server
* **TailwindCSS** - Utility-first CSS framework
* **React Router** - Client-side routing for navigation

**Backend Web Framework**
* **FastAPI** - Modern, fast web framework with automatic API documentation
* **uvicorn** - ASGI server for running FastAPI applications

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

## Development

**Project Structure**
```
reddit-dashboard/ # React frontend application
└──src/ 
   ├── components/ # React components (SearchInterface, Dashboard, etc.)
   ├── services/ # API client and HTTP requests
   └── assets/ # Static assets and styling



src/
├── api/ # FastAPI backend with REST endpoints
├── stream/ # Kafka producers, consumers, and admin utilities 
├── db/ # Database connections, schema, and data loading
├── utils/ # Logging configuration and shared utilities
└── models/ # Pydantic data models for validation
```

**Completed Features**
- ✅ **FastAPI REST API** for querying stored Reddit data
- ✅ **React Dashboard** with data search and visualization
- ✅ **Sentiment Analysis** integrated into the data pipeline
- ✅ **Automatic Data Collection** for missing subreddits


## Future Enhancements
- [ ] **Real-time WebSocket Updates** for live data streaming
- [ ] **Advanced Analytics Dashboard** with charts and graphs
- [ ] **Apache Airflow** for ETL job orchestration
- [ ] **dbt** for data transformation and analytics
- [ ] **Prometheus/Grafana** for metrics and monitoring
- [ ] **CI/CD Pipeline** with GitHub Actions
- [ ] **Cloud Deployment** on AWS/GCP with Kubernetes
- [ ] **User Authentication** and personalized dashboards
- [ ] **Data Export** functionality (CSV, JSON)
- [ ] **Reddit Submission Analysis** (not just comments)

## Contributing

This project is part of a data engineering portfolio demonstration. While contributions are not actively sought, the codebase serves as a reference for modern streaming data pipeline implementation.

## License

This project is for educational purposes.
