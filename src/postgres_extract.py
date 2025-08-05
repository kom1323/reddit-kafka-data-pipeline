import pandas as pd
from sqlalchemy import create_engine
from db.connections import connect_sqlalchemy





def main():

    engine = connect_sqlalchemy()
    query = "Select * from products LIMIT 10;"

    df = pd.read_sql_query(query, engine)

if __name__ == "__main__":
    main()
