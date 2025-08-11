import pandas as pd
from sqlalchemy import create_engine
from src.db.connections import connect_sqlalchemy





def main():

    engine = connect_sqlalchemy()
    query = "Select * from reddit_comments LIMIT 10;"

    df = pd.read_sql_query(query, engine)
    print(df)

if __name__ == "__main__":
    main()
