import psycopg2
from dbConfig import *
from flask import Flask, render_template, g, jsonify
app = Flask(__name__)



@app.route("/")
def main():
    return render_template('index.html')

@app.route("/stardata/")
def ajax_all_star_data():
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT x, y, z, absmag FROM stardata where dist <> 100000 order by dist')
    return jsonify([{'x': tup[0], 'y': tup[1], 'z': tup[2], 'absmag': tup[3]} for tup in cur.fetchmany(1000)])

def get_db():
    if not hasattr(g, 'star_db'):
        g.star_db = connect_db()
    return g.star_db

def connect_db():
    conn = psycopg2.connect("dbname=" + DB_NAME + " user=" + DB_USER + " host=" + DB_HOST + " password=" + DB_PASSWORD)
    return conn

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'star_db'):
        g.star_db.close()


if __name__ == "__main__":
    app.run()