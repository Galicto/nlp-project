import sqlite3
import json
from sqlite3 import Error

DB_FILE = "resume_parser.db"

def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(DB_FILE)
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
    return conn

def init_db():
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            # Table for resumes
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS resumes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    score REAL,
                    raw_text TEXT,
                    parsed_data TEXT
                );
            ''')
            conn.commit()
        except Error as e:
            print(f"Error initializing DB: {e}")
        finally:
            conn.close()

init_db()
