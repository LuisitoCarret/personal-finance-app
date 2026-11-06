from flask import jsonify


def init_errors_jwt(jwt):
    @jwt.unauthorized_loader
    def token_faltante_callback(error_string):
        print(f"Error detected: {error_string}")
        return jsonify({
            "message": "You are not logged in or your session has expired.Please log in again"
        }), 401