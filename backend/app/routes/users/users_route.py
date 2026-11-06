from flask import Blueprint, jsonify, request
from sqlalchemy import select
from app.models.models import Users
from config_db import db
from app.validators.validations_user import validation_fields_register,validate_dict,validation_login
from app.extensions._init_ import bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required,set_access_cookies, unset_jwt_cookies

user_bp = Blueprint("users",__name__,url_prefix="/api")    

@user_bp.route("/users/register",methods=['POST'])
def register_users():
    data = request.get_json(silent=True)
    errors_data = validate_dict(data)
    errors = validation_fields_register(data)

    if errors_data:
        return jsonify({"message":errors_data}),400
   
    if errors:
        return jsonify({"message":errors}),400

    query_email = select(Users.id).where(Users.email  == data['email'])
    result_email = db.session.scalar(query_email)

    if not result_email is None:
        return jsonify({"message":"The email already exist.Enter a new one"}),409

    query_username = select(Users.id).where(Users.username == data['username'])
    result_username = db.session.scalar(query_username)

    if not result_username is None:
        return jsonify({"message":"The username already exist.Enter a new one"}),409
    
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = Users(
       first_name = data['first_name'],
       last_name = data['last_name'],
       email = data['email'],
       username = data['username'],
       password_hash = password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"message":"Something went wrong.Please try again later"}),500

    return jsonify({"message":"User created successfully"}),201

@user_bp.route("/users/login",methods=['POST'])
def login_users():
    data = request.get_json()
    errors_data = validate_dict(data)
    errors_login = validation_login(data)

    if errors_data:
        return jsonify({"message":errors_data})

    if errors_login:
        return jsonify({"message":errors_login})

    query_username = select(Users.id,Users.username,Users.password_hash).where(Users.username == data["username"])

    result_username = db.session.execute(query_username).first()

    if result_username is None:
        return jsonify({"message":"Invalid credentials"}),401

    is_valid = bcrypt.check_password_hash(result_username[2],data["password"])
    response = jsonify({"message":"Login successful"})
    access_token = create_access_token(identity=str(result_username[0]))
    set_access_cookies(response,access_token)

    if is_valid is True:
        return response
    else:
        return jsonify({"message":"Invalid credentials"}),401

@user_bp.route("/users/logout",methods=['POST'])
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response

@user_bp.route("/user/identity",methods=['GET'])
@jwt_required()
def optional_protected():
    current_identity = get_jwt_identity()
    if current_identity:
        return jsonify(logged_in_as=current_identity)
    else:
        return jsonify(logged_in_as="anonymous user")
