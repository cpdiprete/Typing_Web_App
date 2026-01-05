import sqlite3

# lesson Id: [chars_total, right_total, wrong_total, total time typing]
# create_table = '<create_table_statement>'
def init_db():
    create_table = """CREATE TABLE IF NOT EXISTS Lessons
                    (id INTEGER PRIMARY KEY, 
                    title text NOT NULL, 
                    total_typed_chars Integer, 
                    total_wrong Integer
                    );"""
    try:
        with sqlite3.connect("typing.db") as typing_db:
            cursor = typing_db.cursor()
            cursor.execute(create_table)
    except sqlite3.OperationalError as e:
        print("Failed to open database:", e)

def retrieve_stats(id: int):
    query = """
        SELECT total_typed_chars, total_wrong
        FROM Lessons
        WHERE id = ?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (id,))   # <-- tuple is REQUIRED
        result = cursor.fetchone()
        print(result)
    # print(result)
    return result
def add_lesson(id, title):
    query = """
        INSERT OR IGNORE INTO Lessons (id, title)
        VALUES (?, ?)
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (id, title))
def store_stats(id, char_count):
    query = """
        UPDATE Lessons 
        SET total_typed_chars = total_typed_chars + ?
        WHERE id = ?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (char_count, id))
def view_whole_db():
    # print(typing_db)
    query = """SELECT * FROM Lessons"""
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        print("whole db outpout: " + str(result))