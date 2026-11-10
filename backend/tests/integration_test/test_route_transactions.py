from datetime import date
from unittest.mock import patch

from sqlalchemy import select

from app.models.models import Transactions,Users
from config_db import db


def register_user(client):
    user_data ={
        "first_name": "Test",
        "last_name": "User",
        "email": "usertest@gmail.com",
        "username": "testUser",
        "password": "Password123."
    }
    client.post("/api/users/register",json=user_data)
    client.post("/api/users/login",json={"username":"testUser","password":"Password123."})

def test_get_transactions_success(client,app):
    register_user(client)

    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food"
        )
        transac2 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal"
        )
        db.session.add_all([transac1,transac2])
        db.session.commit()
        db.session.remove()

    response = client.get("/api/transactions")
    assert response.status_code == 200
    data = response.get_json()
    assert "items" in data
    assert data["total_amount"] == 1700.00
    assert data["total_items"] == 2
    assert data["per_page"] == 10
    assert data["current_page"] == 1
    assert data["total_pages"] == 1
    assert data["items"][0]["category"] == "Personal"

def test_get_transaction_by_month(client,app):
    register_user(client)
    
    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)
    
        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food",
            transaction_date = date(2026,11,9)
        )
        transac2 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal",
            transaction_date = date(2026,9,12)
        )
        db.session.add_all([transac1,transac2])
        db.session.commit()
        db.session.remove()

    response = client.get("/api/transactions?month=2026-11")
    assert response.status_code == 200
    data = response.get_json()
    assert "items" in data
    assert data["items"][0]["description"] == "Buy a coffee"
    assert data["total_amount"] == 200.00
    assert data["total_items"] == 1
    assert data["per_page"] == 10
    assert data["current_page"] == 1
    assert data["total_pages"] == 1


def test_get_transaction_unauthorized(client):
    response = client.get("/api/transactions")
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"


def test_get_transaction_by_id_error(client):
    register_user(client)
    response = client.get("/api/transactions/50")
    assert response.status_code == 404
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Transaction not found"

def test_get_transaction_by_id_success(client,app):
    register_user(client)
    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food"
        )
        transac2 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal"
        )
        db.session.add_all([transac1,transac2])
        db.session.commit()

        query_transac = select(Transactions.id).where(Transactions.category == "Personal")
        result_transact = db.session.scalar(query_transac)
        db.session.remove()

    response = client.get(f"api/transactions/{result_transact}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["description"] == "Buy a game"
    assert float(data["amount"]) == 1500

def test_get_transaction_by_id_unauthorized(client):
    response = client.get("/api/transactions/5")
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"

def test_post_transaction_success(client,app):
    register_user(client)
    with app.app_context():
         query = select(Users.id).where(Users.username == "testUser")
         result = db.session.scalar(query)
         db.session.remove()
    response = client.post("/api/add/transactions",json={
                "user_id" :result,
                "amount" : 200,
                "description" : "Buy a coffee",
                "category" : "Food"
               })
    assert response.status_code == 201
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Transaction added successfully"
    with app.app_context():
        user = db.session.scalar(select(Transactions).where(Transactions.description == "Buy a coffee"))
        db.session.remove()
    assert user is not None
    assert user.amount == 200.00
    assert user.category == "Food"

def test_post_transaction_exception(client,app):
        register_user(client)
        with app.app_context():
         query = select(Users.id).where(Users.username == "testUser")
         result = db.session.scalar(query)
         db.session.remove()

        with patch('config_db.db.session.commit',side_effect=Exception("Failed to connect a database")):
            response = client.post("/api/add/transactions",json={
                "user_id" :result,
                "amount" : 200,
                "description" : "Buy a coffee",
                "category" : "Food"
            })
        assert response.status_code == 500
        data = response.get_json()
        assert "message" in data
        assert data["message"] == "Something went wrong.Please try again later"

def test_post_transaction_unauthorized(client):
    response = client.post("/api/add/transactions",json={
        "amount" : 200,
        "description" : "Buy a coffee",
        "category" : "Food"
    })
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"

def test_update_transaction_success(client,app):
    register_user(client)
    with app.app_context():
            query = select(Users.id).where(Users.username == "testUser")
            result = db.session.scalar(query)
    
            transac1 = Transactions(
                user_id = result,
                amount = 200,
                description = "Buy a coffee",
                category = "Food"
            )
            transac2 = Transactions(
                user_id = result,
                amount = 1500,
                description = "Buy a game",
                category = "Personal"
            )
            db.session.add_all([transac1,transac2])
            db.session.commit()
    
            query_transac = select(Transactions.id).where(Transactions.category == "Personal")
            result_transact = db.session.scalar(query_transac)
            db.session.remove()
    
    response = client.get(f"api/transactions/{result_transact}")
    assert response.status_code == 200

    response_update = client.put(f"/api/update/transactions/{result_transact}",json={
        "amount": 1499,
        "description": "Buy a Jedi Survivor game",
        "category": "Personal"
    })
    assert response_update.status_code == 200
    data = response_update.get_json()
    assert "message" in data
    assert data["message"] == "Transaction updated successfully"

    with app.app_context():
        query_updated = select(Transactions).where(Transactions.description == "Buy a Jedi Survivor game")
        result_updated = db.session.scalar(query_updated)
        db.session.remove()
    assert result_updated is not None
    assert result_updated.amount == 1499.00
    assert result_updated.category == "Personal"

def test_update_transaction_exception(client,app):
    register_user(client)
    with app.app_context():
            query = select(Users.id).where(Users.username == "testUser")
            result = db.session.scalar(query)
    
            transac1 = Transactions(
                user_id = result,
                amount = 200,
                description = "Buy a coffee",
                category = "Food"
            )
            transac2 = Transactions(
                user_id = result,
                amount = 1500,
                description = "Buy a game",
                category = "Personal"
            )
            db.session.add_all([transac1,transac2])
            db.session.commit()
    
            query_transac = select(Transactions.id).where(Transactions.category == "Personal")
            result_transact = db.session.scalar(query_transac)
            db.session.remove()
    
    response = client.get(f"api/transactions/{result_transact}")
    assert response.status_code == 200

    with patch('config_db.db.session.commit',side_effect=Exception("Failed to connect a database")):
        response_update = client.put(f"/api/update/transactions/{result_transact}",json={
            "amount": 1499,
            "description": "Buy a Jedi Survivor game",
            "category": "Personal"
        })
    assert response_update.status_code == 500
    data = response_update.get_json()
    assert "message" in data
    assert data["message"] == "Something went wrong.Please try again later"


def test_update_transaction_not_found(client,app):
     register_user(client)
     with app.app_context():
                query = select(Users.id).where(Users.username == "testUser")
                result = db.session.scalar(query)
        
                transac1 = Transactions(
                    user_id = result,
                    amount = 200,
                    description = "Buy a coffee",
                    category = "Food"
                )
                transac2 = Transactions(
                    user_id = result,
                    amount = 1500,
                    description = "Buy a game",
                    category = "Personal"
                )
                db.session.add_all([transac1,transac2])
                db.session.commit()
                db.session.remove()
        
     response = client.get(f"api/transactions/50")
     assert response.status_code == 404
     data = response.get_json()
     assert "message" in data
     assert data["message"] == "Transaction not found"

def test_update_transaction_unauthorized(client):
    response = client.put("/api/update/transactions/50",json={
        "amount" : 200,
        "description" : "Buy a coffee",
        "category" : "Food"
    })
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"

def test_delete_transaction_success(client,app):
      register_user(client)
      with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food"
        )
        transac2 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal"
        )
        db.session.add_all([transac1,transac2])
        db.session.commit()

        query_transac = select(Transactions.id).where(Transactions.category == "Personal")
        result_transact = db.session.scalar(query_transac)
        db.session.remove()
         
      response = client.delete(f"api/delete/transactions/{result_transact}")
      assert response.status_code == 200

      with app.app_context():
           transac_delete = select(Transactions.id).where(Transactions.category == "Personal")
           result_delete = db.session.scalar(transac_delete)
           db.session.remove()

      assert result_delete is None
      data = response.get_json()
      assert "message" in data
      assert data["message"] == "Transaction deleted successfully"

def test_delete_transaction_exception(client,app):
    register_user(client)
    with app.app_context():
            query = select(Users.id).where(Users.username == "testUser")
            result = db.session.scalar(query)
    
            transac1 = Transactions(
                user_id = result,
                amount = 200,
                description = "Buy a coffee",
                category = "Food"
            )
            transac2 = Transactions(
                user_id = result,
                amount = 1500,
                description = "Buy a game",
                category = "Personal"
            )
            db.session.add_all([transac1,transac2])
            db.session.commit()
    
            query_transac = select(Transactions.id).where(Transactions.category == "Personal")
            result_transact = db.session.scalar(query_transac)
            db.session.remove()

    with patch('config_db.db.session.commit',side_effect=Exception("Failed to connect a database")):
     response = client.delete(f"api/delete/transactions/{result_transact}")

    assert response.status_code == 500
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "Something went wrong.Please try again later"

def test_delete_transaction_not_found(client,app):
     register_user(client)
     with app.app_context():
                query = select(Users.id).where(Users.username == "testUser")
                result = db.session.scalar(query)
        
                transac1 = Transactions(
                    user_id = result,
                    amount = 200,
                    description = "Buy a coffee",
                    category = "Food"
                )
                transac2 = Transactions(
                    user_id = result,
                    amount = 1500,
                    description = "Buy a game",
                    category = "Personal"
                )
                db.session.add_all([transac1,transac2])
                db.session.commit()
                db.session.remove()
        
     response = client.delete(f"api/delete/transactions/50")
     assert response.status_code == 404
     data = response.get_json()
     assert "message" in data
     assert data["message"] == "Transaction not found"

def test_delete_transaction_unauthorized(client):
    response = client.delete("/api/delete/transactions/7")
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"

def test_stats_by_category_sums_category(client, app):
    register_user(client)
    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food",
            transaction_date = date(2025, 1, 15)
        )
        transac2 = Transactions(
            user_id = result,
            amount = 300,
            description = "Buy lunch",
            category = "Food",
            transaction_date = date(2025, 2, 1)
        )
        transac3 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal",
            transaction_date = date(2025, 5, 5)
        )
        transac4 = Transactions(
            user_id = result,
            amount = 999,
            description = "Other year",
            category = "Others",
            transaction_date = date(2026, 1, 1)
        )
        db.session.add_all([transac1,transac2,transac3,transac4])
        db.session.commit()
        db.session.remove()

    response = client.get("/api/transactions/stats/by-category?year=2025")
    assert response.status_code == 200
    data = response.get_json()

    totals = {}
    for item in data:
        totals[item["category"]] = float(item["amount"])

    assert len(data) == 2
    assert totals["Food"] == 500
    assert totals["Personal"] == 1500
    assert "Others" not in totals

def test_stats_by_category_unauthorized(client):
    response = client.get("/api/transactions/stats/by-category?year=2025")
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"

def test_stats_by_month_returns_12_months(client, app):
    register_user(client)
    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy a coffee",
            category = "Food",
            transaction_date = date(2026, 1, 15)
        )
        transac2 = Transactions(
            user_id = result,
            amount = 300,
            description = "Buy lunch",
            category = "Food",
            transaction_date = date(2026, 1, 20)
        )
        transac3 = Transactions(
            user_id = result,
            amount = 1500,
            description = "Buy a game",
            category = "Personal",
            transaction_date = date(2026, 10, 5)
        )
        db.session.add_all([transac1,transac2,transac3])
        db.session.commit()
        db.session.remove()

    response = client.get("/api/transactions/stats/by-month?year=2026")
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 12
    assert data[0]["month"] == 1
    assert data[11]["month"] == 12
    assert float(data[0]["amount"]) == 500
    assert float(data[9]["amount"]) == 1500
    assert float(data[1]["amount"]) == 0


def test_stats_by_month_ignores_other_years(client, app):
    register_user(client)
    with app.app_context():
        query = select(Users.id).where(Users.username == "testUser")
        result = db.session.scalar(query)

        transac1 = Transactions(
            user_id = result,
            amount = 200,
            description = "Buy an apple",
            category = "Food",
            transaction_date = date(2025, 3, 10)
        )
        transac2 = Transactions(
            user_id = result,
            amount = 999,
            description = "Buy a new book",
            category = "Personal",
            transaction_date = date(2026, 3, 10)
        )
        transac3 = Transactions(
            user_id = result,
            amount = 888,
            description = "Buy a airpods",
            category = "Others",
            transaction_date = date(2024, 3, 10)
        )
        db.session.add_all([transac1,transac2,transac3])
        db.session.commit()
        db.session.remove()

    response = client.get("/api/transactions/stats/by-month?year=2025")
    data = response.get_json()
    assert response.status_code == 200
    assert float(data[2]["amount"]) == 200

def test_stats_by_month_unauthorized(client):
    response = client.get("/api/transactions/stats/by-month?year=2025")
    assert response.status_code == 401
    data = response.get_json()
    assert "message" in data
    assert data["message"] == "You are not logged in or your session has expired.Please log in again"