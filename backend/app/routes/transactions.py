from flask import request,Blueprint,jsonify, session
from sqlalchemy import select
from app.models.models import Transactions
from config_db import db

transactions_bp = Blueprint("transactions",__name__,url_prefix="/api")    

@transactions_bp.route("/transactions", methods=['GET'])
def get_transactions():
    query = select(Transactions).order_by(Transactions.transaction_date.desc())
    rows = db.session.scalars(query).all()
    result = []
    for t in rows:
        result.append({
            "id": t.id,
            "user_id": t.user_id,
            "amount": t.amount,
            "type" : t.type,
            "category" : t.category,
            "description": t.description,
            "date": t.transaction_date.isoformat()
        })
    return jsonify(result)