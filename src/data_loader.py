import glob
import csv
from typing import TextIO
from psycopg import Cursor, Connection, sql
from utils import connect_psycorpg

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
 

def create_table(table_name: str,f: TextIO, cur: Cursor, conn: Connection) -> None:
    """
    Checking each column type, then creating the table (without values) in postgres using an sql query.
    """
    print("Creating table:",table_name)
    table_reader = csv.reader(f, delimiter=',', quotechar='"')
    
    columns = next(table_reader)
    print(columns)

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
    print(f"Table {table_name} was created!") 


def load_entries(table_name: str, f: TextIO, cur: Cursor, conn: Connection) -> None:
    """
    Inserts values from a csv file into the appropriate table.
    """
    print("Creating table:",table_name)
    f.seek(0)
    table_reader = csv.reader(f, delimiter=',', quotechar='"')
    # Skipping column names
    next(table_reader)
    print(f"Copying entries from {f.name} to table {table_name}")
    cur.execute( 
        sql.SQL("COPY {table_name} FROM {file_path} WITH (FORMAT CSV, HEADER TRUE)").format(
            table_name=sql.Identifier(table_name),
            file_path=sql.Literal('/' + f.name.replace("\\", "/"))
            )
        )
    print("DONE!")
    print("Showing 10 first entries:")
    cur.execute(f"Select * FROM {table_name} LIMIT 10;")   
    print(cur.fetchall())        
    

        

def load_csv_data(cur: Cursor, conn: Connection) -> None:
    """
    Loads all the tables in form of csv files into postgres database.
    """
    # First test connection
    cur.execute("SELECT version();")
    print(cur.fetchone())

    directory = 'datasets'
    for filename in glob.iglob(f'{directory}/*.csv'):
        with open(filename, newline='') as f:
            table_name = filename[len(directory) + 1:-4]
            create_table(table_name, f, cur, conn)
            load_entries(table_name, f, cur, conn)


def main():
    
    with connect_psycorpg() as conn:
        cur = conn.cursor()
        load_csv_data(cur, conn)
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
        print("Showing the tables")
        print(cur.fetchall())

if __name__ == "__main__":
    main()
