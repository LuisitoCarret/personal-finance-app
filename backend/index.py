from flask import Flask
from config_db import db, init_db
from sqlalchemy import func, select, text
from app.models.models import Users
from app.routes.transactions import transactions_bp

app = Flask(__name__)
init_db(app)
app.json.sort_keys = False
app.register_blueprint(transactions_bp)

@app.route('/')
def home():
    return "<h1>Hello Flask!</h1>"

if __name__ == "__main__":
    app.run(debug=True)