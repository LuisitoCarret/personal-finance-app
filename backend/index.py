from flask import Flask
from config_db import db, init_db
from sqlalchemy import func, select, text
from app.models.models import Users
from app.routes.transactions import transactions_bp

app = Flask(__name__)
init_db(app)
app.register_blueprint(transactions_bp)

@app.route('/')
def home():
    return "<h1>Hello Flask!</h1>"

@app.route('/testdb')
def testing_db():
  total = db.session.execute(text("SELECT COUNT(*) FROM users")).scalar()
  return {"users":total}

@app.route('/testmodels')
def test_models():
    total = db.session.scalar(select(func.count()).select_from(Users))
    return {"users": total}
   

if __name__ == "__main__":
    app.run(debug=True)