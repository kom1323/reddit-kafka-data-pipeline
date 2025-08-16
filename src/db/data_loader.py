import glob
import csv
from typing import TextIO
from psycopg import Cursor, Connection, sql
from src.db.connections import connect_psycorpg
from src.models.reddit import RedditComment
from src.utils.logging_config import get_logger

logger = get_logger(__name__)



# For data sampling to determine the data type of each column
UNKNOWN_COLUMN = -1
STR_COLUMN = 0
INT_COLUMN = 1
FLOAT_COLUMN = 2


def is_float(element: any) -> bool:
    if element is None: 
        return False
    try:
        float(element)
        return True
    except ValueError:
        return False
    
def is_int(element: any) -> bool:
    if element is None: 
        return False
    try:
        int(element)
        return True
    except ValueError:
        return False
 

def create_postgres_table_from_csv(table_name: str,f: TextIO, cur: Cursor, conn: Connection) -> None:
    """
    Checking each column type, then creating the table (without values) in postgres using an sql query.
    """
    logger.info(f"Creating table: {table_name}")
    table_reader = csv.reader(f, delimiter=',', quotechar='"')
    
    columns = next(table_reader)

    # Check for columns types
    columns_types = ["VARCHAR(255)"] * len(columns)
    str_type_column_flags = [UNKNOWN_COLUMN] * len(columns)
    max_samples = 50
    current_sample = 0
    for row in table_reader:
        for i, value in enumerate(row):
            # Already decided to be str
            if str_type_column_flags[i] == STR_COLUMN:
                continue
            if is_int(value):
                str_type_column_flags[i] = INT_COLUMN
            elif is_float(value):
                str_type_column_flags[i] = FLOAT_COLUMN
        current_sample += 1
        if current_sample >= max_samples:
            break
    for i in range(len(str_type_column_flags)):
        if str_type_column_flags[i] == INT_COLUMN:
            columns_types[i] = "INT"
        elif str_type_column_flags[i] == FLOAT_COLUMN:
            columns_types[i] = "FLOAT8"


    # Create the table
    sql_query_create_table = 'DROP TABLE IF EXISTS '+ table_name + ";\n"
    sql_query_create_table += 'CREATE TABLE '+ table_name + " (\n"
    for i, column in enumerate(columns):
        sql_query_create_table += column + " " + columns_types[i]
        if i < len(columns) - 1:
            sql_query_create_table += ","
        sql_query_create_table += "\n"

    sql_query_create_table += ");"
    cur.execute(sql_query_create_table) 
    conn.commit()
    logger.info(f"Table {table_name} was created!") 


def load_postgres_entries_from_csv(table_name: str, f: TextIO, cur: Cursor, conn: Connection) -> None:
    """
    Inserts values from a csv file into the appropriate table.
    """
    logger.info(f"Loading table - {table_name} - from csv")
    f.seek(0)
    table_reader = csv.reader(f, delimiter=',', quotechar='"')
    # Skipping column names
    next(table_reader)
    logger.info(f"Copying entries from {f.name} to table {table_name}")
    cur.execute( 
        sql.SQL("COPY {table_name} FROM {file_path} WITH (FORMAT CSV, HEADER TRUE)").format(
            table_name=sql.Identifier(table_name),
            file_path=sql.Literal('/' + f.name.replace("\\", "/"))
            )
        )
    logger.info("DONE!")
    logger.debug("Showing 10 first entries:")
    cur.execute(f"Select * FROM {table_name} LIMIT 10;")   
    logger.debug(cur.fetchall())        
    
def create_reddit_comments_table(cur: Cursor, conn: Connection) -> None:
    """Create table specifically for Reddit comments with proper schema"""

    table_name = "reddit_comments"
    logger.info(f"Creating table {table_name}...")
    schema = {
        'id': 'VARCHAR(20) PRIMARY KEY',
        'body': 'TEXT',
        'body_html': 'TEXT', 
        'created_utc': 'TIMESTAMP WITH TIME ZONE',
        'subreddit': 'VARCHAR(50)',
        'score': 'INTEGER',
        'author': 'VARCHAR(50) NULL',
        'parent_id': 'VARCHAR(20)',
        'is_submitter': 'BOOLEAN',
        'total_awards_received': 'INTEGER'
    }

    columns_sql = ',\n    '.join([f"{col} {dtype}" for col, dtype in schema.items()])
    
    sql_query = f"""
                DROP TABLE IF EXISTS {table_name};
                CREATE TABLE {table_name} (
                    {columns_sql}
                );
                """
    
    cur.execute(sql_query)
    conn.commit()
    logger.info(f"Table {table_name} created successfully")

    
def insert_reddit_comment(reddit_comment: RedditComment, cur: Cursor, conn: Connection) -> None:
    """Insert a single RedditComment object into the database"""
    comment_dict = reddit_comment.model_dump()
    
    columns = list(comment_dict.keys())
    column_names = ', '.join(columns) 
    placeholders = ', '.join([f'%({col})s' for col in columns])
    insert_sql = f"""
                    INSERT INTO reddit_comments ({column_names})
                    VALUES ({placeholders})
                    ON CONFLICT (id) DO NOTHING    
                """

    cur.execute(insert_sql, comment_dict)
    conn.commit()

    # Check if row was actually inserted
    if cur.rowcount <= 0:
        logger.debug(f"Duplicate comment {comment_dict['id']} skipped")

def load_csv_data(cur: Cursor, conn: Connection, directory: str) -> None:
    """
    Loads all the tables in form of csv files into postgres database.
    """
    # First test connection
    cur.execute("SELECT version();")
    logger.info(cur.fetchone())

    
    for filename in glob.iglob(f'{directory}/*.csv'):
        with open(filename, newline='') as f:
            table_name = filename[len(directory) + 1:-4]
            create_table(table_name, f, cur, conn)
            load_entries(table_name, f, cur, conn)


def main():
    directory = 'data'
    with connect_psycorpg() as conn:
        cur = conn.cursor()
        load_csv_data(cur, conn, directory)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
        logger.debug("Showing the tables")
        logger.debug(cur.fetchall())

if __name__ == "__main__":
    main()
