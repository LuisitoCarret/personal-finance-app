from flask import request,Blueprint,jsonify, session
from sqlalchemy import func, insert, select
from app.models.models import Transactions
from app.validations.validdators import validate_transaction_id
from config_db import db
import math

transactions_bp = Blueprint("transactions",__name__,url_prefix="/api")    

@transactions_bp.route("/transactions", methods=['GET'])
def get_transactions():
    page = request.args.get('page',1,type=int)
    per_page = request.args.get('per_page',10,type=int)
    offset_value = (page - 1) * per_page
    query = select(Transactions).order_by(Transactions.transaction_date.desc())
    paginated_query = query.offset(offset_value).limit(per_page)
    rows = db.session.scalars(paginated_query).all()
    total = db.session.query(func.count(Transactions.id)).scalar()
    total_pages = math.ceil(total/per_page) if total > 0 else 0
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

    return jsonify({
        "items": result,
        "total_items": total,
        "per_page": per_page,
        "current_page": page,
        "total_pages": total_pages
    }),200

@transactions_bp.route("/transactions/<int:transac_id>", methods=['GET'])
def get_one_transaction(transac_id):
    errors = validate_transaction_id(transac_id)

    if errors:
        return jsonify({"message":errors}),400
    
    query = select(Transactions).where(Transactions.id == transac_id)
    transaction = db.session.scalar(query)

    if transaction is None:
       return jsonify({"message":"Transaction not found"}),400
    
    result = {
        "id": transaction.id,
        "user_id": transaction.user_id,
        "amount": transaction.amount,
        "type" : transaction.type,
        "category" : transaction.category,
        "description": transaction.description,
        "date": transaction.transaction_date.isoformat(),
    }

    return jsonify(result),200

@transactions_bp.route("/add/transactions",methods=['POST'])
def create_transaction():
    data = request.get_json(silent=True)
    new_item = Transactions(
        user_id = data['user_id'],
        amount = data['amount'],
        description = data['description'],
        type = data['type'],
        category = data['category'],
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message":"Transaction added successfully"}),201

@transactions_bp.route("/update/transactions/<int:transac_id>", methods=['PUT'])
def update_transaction(transac_id):
    query = select(Transactions).where(Transactions.id == transac_id)
    item = db.session.scalar(query)
    data = request.get_json(silent=True)
    item.user_id = data.get("user_id",item.user_id)
    item.amount = data.get("amount",item.amount)
    item.description = data.get("description",item.description)
    item.type = data.get("type",item.type)
    item.category = data.get("category",item.category)

    db.session.commit()

    return jsonify({"message":"Transaction updated successfully"}),200

@transactions_bp.route("/delete/transactions/<int:transac_id>", methods=['DELETE'])
def delete_transaction(transac_id):
    errors = validate_transaction_id(transac_id)

    if errors:
        return jsonify({"message":errors}),400
    
    query = select(Transactions).where(Transactions.id == transac_id)
    item = db.session.scalar(query)

    if item is None:
        return jsonify({"message":"Transaction does not exist"}),400
    
    db.session.delete(item)
    db.session.commit()

    return jsonify({"message":"Transaction deleted successfully"}),200