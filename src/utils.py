import psycopg
import os
import sys
from dotenv import load_dotenv
# Load env variables for db from .env.app
load_dotenv(dotenv_path="secrets/.env.app")


def connect():
    # Loading .env configs
    db_name = os.getenv("POSTGRES_DB")
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    host = os.getenv("POSTGRES_HOST")
    port = os.getenv("POSTGRES_PORT")

    conn = None
    try:
        conn = psycopg.connect(
            dbname=db_name,
            user=user,
            password=password,
            host=host,
            port=port
            )
    except(Exception, psycopg.DatabaseError) as error:
        print(error)
        sys.exit(1)
    
    print("All good, Connection successful!")
    return conn
            