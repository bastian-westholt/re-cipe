import os
from flask import Flask, render_template, redirect, request, url_for
from models import db
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    # with app.app_context():
        # db.create_all()
        # print(f' * Datenbank initialisiert.')
    app.run('0.0.0.0', 5001, debug=True)
