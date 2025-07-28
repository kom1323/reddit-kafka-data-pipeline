from utils import DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USER
import pandas as pd
from sqlalchemy import create_engine





def main():

    engine = create_engine(f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")
    query = "Select * from products LIMIT 10;"

    df = pd.read_sql_query(query, engine)

if __name__ == "__main__":
    main()
