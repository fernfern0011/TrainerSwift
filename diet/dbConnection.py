import psycopg2
from config import load_config

def get_db_connection(config):
    """ Connect to the PostgreSQL database server """
    try:
         # connecting to the PostgreSQL server
         with psycopg2.connect(**config) as con:
            print('Connected to the PostgreSQL server.')
            return con
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)
    
if __name__ == '__main__':
    config = load_config()
    get_db_connection(config)