import psycopg


with psycopg.connect(
    dbname="instacart",
    user="omer",
    password="password",
    host="localhost",
    port=5432
) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT version();")
        print(cur.fetchone())