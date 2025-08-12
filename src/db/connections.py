import psycopg
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, exc, text
import sqlalchemy
from src.utils.logging_config import get_logger
# Load env variables for db from .env.app
load_dotenv(dotenv_path="secrets/.env.app")

logger = get_logger(__name__)

# Loading .env configs
DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")

def connect_psycorpg() -> psycopg.Connection:
    """
    Start a psycorpg3 connection to the postgres database.
    """
    conn = None
    try:
        conn = psycopg.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
            )
    except psycopg.DatabaseError as error:
        logger.error(f"Connection failed: {error}")
        sys.exit(1)
    
    logger.info("All good, Connection successful!")
    return conn
            
def connect_sqlalchemy() -> sqlalchemy.Engine:
    try:
        logger.info("Connecting to postgres database...")
        engine = create_engine(f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}") 
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    
    except exc.SQLAlchemyError as error:
        logger.error(f"Connection failed: {error}")
        sys.exit(1)
    logger.info("All good, Connection successful!")
    return engine
