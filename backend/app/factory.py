import os
from flask import Flask
from config_db import init_db
from app.routes.transactions.transactions_route import transactions_bp
from app.routes.users.users_route import user_bp
from app.extensions.config_extensions import init_extension
from dotenv import load_dotenv
from flask_cors import CORS

def create_app(test_config=None):
    load_dotenv()
    app = Flask(__name__)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
    app.json.sort_keys = False

    if test_config:
        app.config.update(test_config)

    init_db(app)
    init_extension(app)

    app.register_blueprint(user_bp)
    app.register_blueprint(transactions_bp)

    origins = os.environ.get("CORS_ORIGINS")
    CORS(
       app,
       resources={r"/api/*":{"origins":origins}},
       supports_credentials=True,
    )
    
    @app.route('/')
    def home():
     return "<h1>Hello Flask!</h1>"

    return app