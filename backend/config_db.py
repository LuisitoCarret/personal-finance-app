import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()
db = SQLAlchemy()

def init_db(app):
    host = os.environ.get("MYSQL_DATABASE_HOST","localhost")
    user = os.environ.get("MYSQL_DATABASE_USER")
    password = os.environ.get("MYSQL_DATABASE_PASSWORD")
    database = os.environ.get("MYSQL_DATABASE_DB")

    app.config.setdefault('SQLALCHEMY_DATABASE_URI',f'mysql+pymysql://{user}:{password}@{host}/{database}')

    db.init_app(app)