import os
try:
    from dotenv import load_dotenv  # type: ignore
except ImportError:
    load_dotenv = None
from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db
from extensions import jwt
from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.comments import comments_bp
from routes.likes import likes_bp
from routes.ml import ml_bp
from routes.assistant import assistant_bp
from routes.follows import follows_bp

def create_app():
    if load_dotenv:
        load_dotenv()
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["JWT_SECRET_KEY"] = "super-secret-change-me"
    app.config["UPLOAD_FOLDER"] = os.path.join(basedir, "uploads")

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(comments_bp, url_prefix="/api/comments")
    app.register_blueprint(likes_bp, url_prefix="/api/likes")
    app.register_blueprint(ml_bp, url_prefix="/api/ml")
    app.register_blueprint(assistant_bp, url_prefix="/api/assistant")
    app.register_blueprint(follows_bp, url_prefix="/api/follows")

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
