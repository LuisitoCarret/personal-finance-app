import os
from sqlalchemy import delete
from app.factory import create_app
from dotenv import load_dotenv
import pytest
from config_db import db
from app.models.models import Users,Transactions

load_dotenv()

def build_test_uri():
    host = os.environ.get("MYSQL_DATABASE_HOST","localhost")
    user = os.environ.get("MYSQL_DATABASE_USER")
    password = os.environ.get("MYSQL_DATABASE_PASSWORD")
    database = os.environ.get("MYSQL_DATABASE_DB_TEST")

    return f'mysql+pymysql://{user}:{password}@{host}/{database}'

@pytest.fixture
def app():
    return create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": build_test_uri(),
        "JWT_SECRET_KEY": os.environ.get("JWT_SECRET_KEY_TEST"),
        "JWT_COOKIE_CSRF_PROTECT": False
    })

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(autouse=True)
def clear_db(app):
    with app.app_context():
        try:
            db.session.execute(delete(Transactions))
            db.session.execute(delete(Users))
            db.session.commit()
        except Exception:
            db.session.rollback()
        finally:
            db.session.remove()
    yield