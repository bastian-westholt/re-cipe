import os
from flask import Flask, render_template, redirect, request, url_for
from models import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/test-db')
def test_db():
  db.session.execute(db.text('SELECT 1'))
  return 'DB connected!'


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print(f' * Datenbank initialisiert.')
    app.run('0.0.0.0', 5001, debug=True)
