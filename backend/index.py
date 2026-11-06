import os
from flask import Flask
from config_db import init_db
from app.routes.transactions.transactions_route import transactions_bp
from app.routes.users.users_route import user_bp
from app.extensions._init_ import init_extension
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()
init_db(app)
init_extension(app)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.json.sort_keys = False
app.register_blueprint(user_bp)
app.register_blueprint(transactions_bp)

@app.route('/')
def home():
    return "<h1>Hello Flask!</h1>"

if __name__ == "__main__":
    app.run(debug=True)