from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from app.extensions.jwt_errors import init_errors_jwt

bcrypt = Bcrypt()
jwt = JWTManager()

def init_extension(app):
  bcrypt.init_app(app)
  jwt.init_app(app)
  init_errors_jwt(jwt)