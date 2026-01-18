import sqlite3
def wpm_calculator(correct, incorrect, millis):
    wpm = (correct + incorrect) / 5
    seconds = millis / 1000
    mins = seconds / 60
    if (mins == 0):
        return wpm
    else:
        wpm = wpm / mins
    return wpm
def init_db():
    create_Lessons_table = """CREATE TABLE IF NOT EXISTS Lessons
                    (id INTEGER PRIMARY KEY, 
                    title text NOT NULL, 
                    text_data text NOT NULL,
                    total_typed_chars Integer, 
                    total_correct_chars Integer,
                    total_wrong_chars Integer,
                    milliseconds Integer
                    );"""
    create_wpm_table = """
        CREATE TABLE IF NOT EXISTS wpms_table
        (id INTEGER PRIMARY_KEY,
        lessonid INTEGER NOT NULL,
        wpm REAL NOT NULL,
        accuracy REAL NOT NULL
        )
        """
    try:
        with sqlite3.connect("typing.db") as typing_db:
            cursor = typing_db.cursor()
            cursor.execute(create_Lessons_table)
            cursor.execute(create_wpm_table)
    except sqlite3.OperationalError as e:
        print("Failed to open database:", e)
# I want the ability to plot accuracy and wpm values.
def get_wpm_plot(id):
    query = """
    SELECT 
        wpm,
        accuracy
    FROM wpms_table
    WHERE lessonid = ?
    ORDER BY id ASC
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (id,))
        values = cursor.fetchall()
        print(f"db.py wpm_plot() values: {values}")
        return values
        
def drop_db():
    query = """DROP TABLE IF EXISTS Lessons"""
    drop_wpm_plot = """
    DROP TABLE IF EXISTS wpms_table"""
    try:
        with sqlite3.connect("typing.db") as typing_db:
            cursor = typing_db.cursor()
            cursor.execute(query)
            cursor.execute(drop_wpm_plot)
    except sqlite3.OperationalError as e:
        print("Failed to delete database:", e)
def get_next_valid_card_id():
    query = """
    SELECT id
    FROM Lessons
    ORDER BY id DESC
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        fetched_row = cursor.fetchone()
        if (fetched_row is None):
            return 0
        (row_id,) = fetched_row ## it comes as a tuple containing a single integer
        print(f"one output: {row_id}")
        next_id = row_id + 1
        return next_id
    
def get_next_valid_wpm_table_id(card_id):
    query = """
    SELECT id
    FROM wpms_table
    WHERE lessonid = ?
    ORDER BY id DESC
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (card_id,))
        next_valid_id = cursor.fetchone()
        if (next_valid_id is None) or (next_valid_id[0] is None):
            print("prev ids are NONE")
            return 0
        else:
            return (next_valid_id[0] + 1)
    
def add_lesson(title, text_data):
    new_id = get_next_valid_card_id()
    query = """
        INSERT OR IGNORE INTO Lessons (id, title, text_data, total_typed_chars, total_correct_chars, total_wrong_chars, milliseconds)
        VALUES (?, ?, ?, 0, 0, 0, 0)
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        # cursor.execute(query, (id, title, text_data))
        cursor.execute(query, (new_id, title, text_data))
        
def view_whole_db():
    query = """SELECT * FROM Lessons"""
    wpm_plot_query = """SELECT * FROM wpms_table"""
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        print("Lessons db outpout: " + str(result))
        
        cursor.execute(wpm_plot_query)
        result = cursor.fetchall()
        print("wpm_plot db outpout: " + str(result))
    

def retrieve_all_db_entries():
    query = """
    SELECT id, title, total_correct_chars, total_wrong_chars, text_data
    FROM Lessons
    """
    entries_dict = dict()
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        for i in range(len(result)):
            id = result[i][0]
            title = result[i][1]
            correct = result[i][2]
            wrong = result[i][3]
            text = result[i][4]
            entries_dict[id] = (title, correct, wrong, text)
        return entries_dict
        
def update_chars_and_seconds(card_id, correct, incorrect, seconds):
    query = """
    UPDATE Lessons
    SET total_correct_chars = total_correct_chars + ?,
    total_wrong_chars = total_wrong_chars + ?,
    milliseconds = milliseconds + ?
    WHERE id=?
    """
    wpm = wpm_calculator(correct, incorrect, seconds)
    accuracy = 100 * round((correct - incorrect) / correct, 3)
    add_wpm_entry_query = """
    INSERT INTO wpms_table (id, lessonid, wpm, accuracy)
    VALUES (?, ?, ?, ?)
    """
    next_valid_wpm_id = get_next_valid_wpm_table_id(card_id)
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (correct, incorrect, seconds, card_id))
        cursor.execute(add_wpm_entry_query, (next_valid_wpm_id, card_id, wpm, accuracy))
        
def get_total_accuracy(card_id):
    query = """
    SELECT total_correct_chars,
    total_wrong_chars
    FROM Lessons
    WHERE id=?
    """
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (card_id,))
        outputs= cursor.fetchone()
    # print("Wrong count fetched: " + str(wrong_count))
    right_count = outputs[0]
    wrong_count = outputs[1]
    
    if (right_count == 0):
        return 0
    accuracy = round((right_count - wrong_count) / right_count, 2)
    
    print("Wrong count fetched: " + str(wrong_count))
    print("Accuracy " + str(accuracy))
    return accuracy

def get_total_wpm(card_id):
    query = """
    SELECT total_correct_chars,
    total_wrong_chars,
    milliseconds
    FROM Lessons
    WHERE id=?"""
    with sqlite3.connect("typing.db") as typing_db:
        cursor = typing_db.cursor()
        cursor.execute(query, (card_id,))
        result = cursor.fetchone()
        correct, wrong, milliseconds = result
        wpm = wpm_calculator(correct, wrong, milliseconds)
        return wpm
    # __________________________________________________________________________________________________________________________
##                          __________________ Testing database methods section __________________
# ______________________________________________________________________________________________________________________________
def testing_refresh_db():
    drop_db() 
    init_db()
    
def testing_lesson_additions():
    add_lesson("Calvins test", "This is calvin testing his shit")
    add_lesson("other one", "This is one more test for me to do")
    add_lesson("nother", "bullshlsh fjj ")
    add_lesson("one another", "budfddf")
    # add_lesson(4, "one another", "budfddf")
    update_chars_and_seconds(0, 20, 10, 1000)
    update_chars_and_seconds(1, 10, 15, 10000)
    
def test_incrementing_lesson():
    next_id = get_next_valid_card_id()
    add_lesson(next_id, f"title... {str(next_id)}", f"text... {str(next_id)}")
def test_wpm_plot():
    drop_db()
    init_db()
    
    add_lesson("Calvins test", "This is calvin testing his shit")
    update_chars_and_seconds(0, 20, 10, 5000)
    update_chars_and_seconds(0, 25, 0, 5000)
    update_chars_and_seconds(0, 30, 0, 5000)
    
    add_lesson("other one", "This is one more test for me to do")
    update_chars_and_seconds(1, 30, 0, 1000)
    get_wpm_plot(0)

if __name__ == "__main__":
    # test_wpm_plot()
    
    testing_refresh_db()
    # view_whole_db()
    
    # testing_lesson_additions()
    # print(retrieve_all_db_entries())
    # test_incrementing_lesson()
    
    # get_total_accuracy(0)
    # print(get_total_wpm(0))

