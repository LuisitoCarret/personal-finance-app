from datetime import date, datetime
from flask import request,Blueprint,jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import extract, func, select
from app.models.models import Transactions
from app.validators.validations_transac import validate_date, validate_dict, validate_transaction_id, validate_fields,validate_pages,validate_year
from config_db import db
import math

transactions_bp = Blueprint("transactions",__name__,url_prefix="/api")    

@transactions_bp.route("/transactions", methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = int(get_jwt_identity())
    page = request.args.get('page',1,type=int)
    per_page = request.args.get('per_page',10,type=int)

    errors_pages = validate_pages(page,per_page)

    if errors_pages:
        return jsonify({"message":errors_pages}),400

    offset_value = (page - 1) * per_page

    month_param = request.args.get('month')

    if validate_date(month_param):
       date_normal = datetime.strptime(month_param,"%Y-%m")
       month = date_normal.month
       year = date_normal.year
    else:
       today = datetime.now()
       month = today.month
       year = today.year

    start_month = date(year,month,1)
 
    if month == 12:
        end_month = date(year + 1,1,1)
    else:
        end_month = date(year,month + 1,1)
    
    query = (select(Transactions).where(
       Transactions.transaction_date >= start_month,
       Transactions.transaction_date < end_month,
       Transactions.user_id == user_id
    )
    .order_by(Transactions.transaction_date.desc()))

    paginated_query = query.offset(offset_value).limit(per_page)
    rows = db.session.scalars(paginated_query).all()
    rows_total = db.session.scalars(query).all()
    total_items = len(rows_total)
    total_pages = math.ceil(total_items/per_page) if total_items > 0 else 0

    query_expense = (select(func.sum(Transactions.amount)).where(
       Transactions.transaction_date >= start_month,
       Transactions.transaction_date < end_month,
       Transactions.user_id == user_id
    ))
    
    total_amount = db.session.scalar(query_expense)

    if total_amount is None:
        total_amount = 0.0
    else:
        total_amount = float(total_amount)
    
    result = []

    for t in rows:
        result.append({
            "id": t.id,
            "user_id": user_id,
            "amount": t.amount,
            "category" : t.category,
            "description": t.description,
            "date": t.transaction_date.isoformat()
        })

    return jsonify({
        "items": result,
        "total_amount":total_amount,
        "total_items": total_items,
        "per_page": per_page,
        "current_page": page,
        "total_pages": total_pages
    }),200

@transactions_bp.route("/transactions/<int:transac_id>", methods=['GET'])
@jwt_required()
def get_one_transaction(transac_id):
    user_id = int(get_jwt_identity())
    errors = validate_transaction_id(transac_id)

    if errors:
        return jsonify({"message":errors}),400
    
    query = select(Transactions).where(Transactions.id == transac_id,Transactions.user_id == user_id)
    transaction = db.session.scalar(query)

    if transaction is None:
       return jsonify({"message":"Transaction not found"}),404
    
    result = {
        "id": transaction.id,
        "user_id": user_id,
        "amount": transaction.amount,
        "category" : transaction.category,
        "description": transaction.description,
        "date": transaction.transaction_date.isoformat(),
    }

    return jsonify(result),200

@transactions_bp.route("/add/transactions",methods=['POST'])
@jwt_required()
def create_transaction():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    errors = validate_dict(data)

    if errors:
        return jsonify({"message":errors}),400
    
    errors_data = validate_fields(data)

    if errors_data:
        return jsonify({"message":errors_data}),400

    new_item = Transactions(
        user_id = user_id,
        amount = data['amount'],
        description = data['description'],
        category = data['category'],
    )

    try:
        db.session.add(new_item)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"message":"Something went wrong.Please try again later"}),500

    return jsonify({"message":"Transaction added successfully"}),201

@transactions_bp.route("/update/transactions/<int:transac_id>", methods=['PUT'])
@jwt_required()
def update_transaction(transac_id):
    user_id = int(get_jwt_identity())
    query = select(Transactions).where(Transactions.id == transac_id,Transactions.user_id == user_id)
    item = db.session.scalar(query)
    data = request.get_json(silent=True)
    errors_id = validate_transaction_id(transac_id)

    if errors_id:
        return jsonify({"message":errors_id}),400
    
    if item is None:
        return jsonify({"message":"Transaction not found"}),404
    
    errors = validate_dict(data)
    
    if errors:
        return jsonify({"message":errors}),400
    
    errors_fields = validate_fields(data)

    if errors_fields:
        return jsonify({"message":errors_fields}),400

    item.amount = data.get("amount",item.amount)
    item.description = data.get("description",item.description)
    item.category = data.get("category",item.category)

    try:
       db.session.commit()
    except Exception:
       db.session.rollback()
       return jsonify({"message":"Something went wrong.Please try again later"}),500

    return jsonify({"message":"Transaction updated successfully"}),200

@transactions_bp.route("/delete/transactions/<int:transac_id>", methods=['DELETE'])
@jwt_required()
def delete_transaction(transac_id):
    user_id = int(get_jwt_identity())
    errors = validate_transaction_id(transac_id)

    if errors:
        return jsonify({"message":errors}),400
    
    query = select(Transactions).where(Transactions.id == transac_id,Transactions.user_id == user_id)
    item = db.session.scalar(query)

    if item is None:
        return jsonify({"message":"Transaction not found"}),404

    try:
      db.session.delete(item)
      db.session.commit()
    except Exception:
      db.session.rollback()
      return jsonify({"message":"Something went wrong.Please try again later"}),500

    return jsonify({"message":"Transaction deleted successfully"}),200

@transactions_bp.route("/transactions/stats/by-category",methods=['GET'])
@jwt_required()
def stats_category():
    user_id = int(get_jwt_identity())
    year_param = request.args.get('year')

    if validate_year(year_param):
       date_normal = datetime.strptime(year_param,"%Y")
       year = date_normal.year
    else:
       today = datetime.now()
       year = today.year

    start_year = date(year, 1, 1)
    end_year = date(year + 1, 1, 1)
    
    query_category = (select(Transactions.category,func.sum(Transactions.amount)).where(
        Transactions.transaction_date >= start_year,
        Transactions.transaction_date < end_year,
        Transactions.user_id == user_id
    ).group_by(Transactions.category))

    rows = db.session.execute(query_category)
    result = []

    for category,amount in rows:
        result.append({
            "category":category,
            "amount":amount
        })

    return jsonify(result),200

@transactions_bp.route("/transactions/stats/by-month",methods=['GET'])
@jwt_required()
def stats_month():
    user_id = int(get_jwt_identity())
    year_param = request.args.get('year')

    if validate_year(year_param):
       date_normal = datetime.strptime(year_param,"%Y")
       year = date_normal.year
    else:
       today = datetime.now()
       year = today.year

    start_year = date(year, 1, 1)
    end_year = date(year + 1, 1, 1)

    query_category = (select(extract('month',Transactions.transaction_date),func.sum(Transactions.amount)).where(
            Transactions.transaction_date >= start_year,
            Transactions.user_id == user_id < end_year
        ).group_by(extract('month',Transactions.transaction_date)))

    rows = db.session.execute(query_category)

    totals = {}
    result = []

    for month,amount in rows:
       totals[month] = amount

    for month in range(1,13):
     month_amount = totals.get(month,0)
     result.append({
         "month":month,
         "amount":month_amount
     })

    return jsonify(result),200