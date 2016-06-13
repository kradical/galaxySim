import csv
import psycopg2
from dbConfig import *



##
# Creates and populate a database of star information from a csvfile.
# See https://github.com/astronexus/HYG-Database
##
def main():
    conn = psycopg2.connect("dbname=" + DB_NAME + " user=" + DB_USER + " host=" + DB_HOST + " password=" + DB_PASSWORD)
    cur = conn.cursor()

    # cur.execute("CREATE TABLE IF NOT EXISTS " + DB_TABLE_NAME +
    #     """
    #     (
    #     id INTEGER,
    #     hip INTEGER,
    #     hd INTEGER,
    #     hr INTEGER,
    #     gl TEXT,
    #     bf TEXT,
    #     proper TEXT,
    #     ra DOUBLE PRECISION,
    #     dec DOUBLE PRECISION,
    #     dist DOUBLE PRECISION,
    #     pmra DOUBLE PRECISION,
    #     pmdec DOUBLE PRECISION,
    #     rv DOUBLE PRECISION,
    #     mag DOUBLE PRECISION,
    #     absmag DOUBLE PRECISION,
    #     spect TEXT,
    #     ci DOUBLE PRECISION,
    #     x DOUBLE PRECISION,
    #     y DOUBLE PRECISION,
    #     z DOUBLE PRECISION,
    #     vx DOUBLE PRECISION,
    #     vy DOUBLE PRECISION,
    #     vz DOUBLE PRECISION,
    #     rarad DOUBLE PRECISION,
    #     decrad DOUBLE PRECISION,
    #     pmrarad DOUBLE PRECISION,
    #     pmdecrad DOUBLE PRECISION,
    #     bayer TEXT,
    #     flam INTEGER,
    #     con TEXT,
    #     comp INTEGER,
    #     comp_primary INTEGER,
    #     base TEXT,
    #     lum DOUBLE PRECISION,
    #     var TEXT,
    #     var_min DOUBLE PRECISION,
    #     var_max DOUBLE PRECISION
    #     )""")

    # with open(CSV_FILENAME, 'r') as csv_file:
    #     csv_reader = csv.reader(csv_file)
    #     next(csv_reader)
    #     for ndx, row in enumerate(csv_reader):
    #         cur.execute('INSERT INTO stardata VALUES(%s' + ',%s'*36 + ')', [None if cell == '' else cell for cell in row])

    # conn.commit()
    cur.execute('select id from stardata')
    print(cur.fetchall())
    conn.close()

if __name__ == '__main__':
    main()