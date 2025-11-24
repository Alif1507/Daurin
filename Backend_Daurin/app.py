from flask import Flask
from flask_cors import CORS
from models import db
from extensions import jwt
from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.comments import comments_bp
from routes.likes import likes_bp
from routes.ml import ml_bp
from routes.assistant import assistant_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["JWT_SECRET_KEY"] = "super-secret-change-me"
    app.config["UPLOAD_FOLDER"] = "uploads"

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(comments_bp, url_prefix="/api/comments")
    app.register_blueprint(likes_bp, url_prefix="/api/likes")
    app.register_blueprint(ml_bp, url_prefix="/api/ml")
    app.register_blueprint(assistant_bp, url_prefix="/api/assistant")

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
