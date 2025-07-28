from utils import connect


def main():
    
    with connect() as conn:
        cur = conn.cursor()
        #cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
        cur.execute(f"Select * FROM products LIMIT 10;")
        print(cur.fetchall())


if __name__ == "__main__":
    main()
