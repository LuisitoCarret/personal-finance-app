from unittest.mock import patch
from sqlalchemy import select
from config_db import db
from app.models.models import Users

def valid_user():
    return {
        "first_name": "Candance",
        "last_name": "Williams",
        "email": "candance@gmail.com",
        "username": "CANDANCE21",
        "password": "SuperPass123."
    }

def valid_login():
    return {
        "username":"Joel213",
        "password":"123REdasd."
    }

def invalid_password():
    return {
        "username":"CANDANCE21",
        "password":"SuperPass12.3"
    }

def valid_password():
    return{
        "username":"CANDANCE21",
        "password":"SuperPass123."
    }

def test_post_user(client,app):
    response = client.post("/api/users/register", json=valid_user())
    assert response.status_code == 201
    with app.app_context():
        user = db.session.scalar(select(Users).where(Users.first_name == "Candance"))
        db.session.remove()

    data = response.get_json()
    assert user is not None
    assert user.password_hash != "SuperPass123."
    assert "message" in data
    assert data["message"] == "User created successfully"

def test_post_user_already_email_exist(client,app):
    client.post("/api/users/register",json=valid_user())
    response = client.post("/api/users/register",json=valid_user())
    assert response.status_code == 409
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "The email already exist.Enter a new one"

def test_post_user_already_username_exist(client,app):
    client.post("/api/users/register",json=valid_user())
    user_copy = valid_user().copy()
    user_copy["email"]= "williams@gmail.com" 
    response = client.post("/api/users/register",json=user_copy)
    assert response.status_code == 409
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "The username already exist.Enter a new one"

def test_post_user_exception(client):
    with patch('config_db.db.session.commit',side_effect=Exception("Failed to connect a database")):
     response = client.post("/api/users/register",json=valid_user())
    assert response.status_code == 500
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Something went wrong.Please try again later"


def test_post_login_user_not_exist(client,app):
    with app.app_context():
        existing_user = Users(
            first_name= "Ellie",
            last_name= "Williams",
            email= "ellie@gmail.com",
            username= "CANDANCE21",
            password_hash= "SuperPass123."
        )
        db.session.add(existing_user)
        db.session.commit()
        db.session.remove()
    response = client.post("/api/users/login",json=valid_login())
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Invalid credentials"

def test_post_login_user_incorrect_password(client,app):
        client.post("/api/users/register",json=valid_user())
        response_login = client.post("/api/users/login",json=invalid_password())
        assert response_login.status_code == 401
        data = response_login.get_json()
        assert "message" in data
        assert data["message"] == "Invalid credentials"

def test_post_login_user_success(client):
         client.post("/api/users/register",json=valid_user())
         response_login = client.post("/api/users/login",json=valid_password())
         assert response_login.status_code == 200
         data = response_login.get_json()
         assert "message" in data
         assert data["message"] == "Login successfully"

def test_post_logout_exit(client):
    client.post("/api/users/login",json=valid_password())
    response_logout = client.post("/api/users/logout")
    assert response_logout.status_code == 200
    data = response_logout.get_json()
    assert "message" in data
    assert data["message"] == "Logout successfully"