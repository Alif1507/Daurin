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
from config import get_config


def _ensure_production_requirements(config):
    if config.get("ENV") != "production":
        return

    problems = []
    jwt_secret = config.get("JWT_SECRET_KEY")
    if not jwt_secret or jwt_secret == "dev-change-me":
        problems.append("JWT_SECRET_KEY must be set to a strong secret in production.")

    db_uri = config.get("SQLALCHEMY_DATABASE_URI", "")
    if not db_uri or db_uri.startswith("sqlite"):
        problems.append("DATABASE_URL must point to a production-grade database (non-SQLite).")

    if problems:
        raise RuntimeError(
            "Invalid production configuration:\n- " + "\n- ".join(problems)
        )


def create_app():
    if load_dotenv:
        load_dotenv()
    app = Flask(__name__)
    config_obj = get_config()
    app.config.from_object(config_obj)
    _ensure_production_requirements(app.config)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    origins_env = app.config.get("FRONTEND_ORIGINS", "")
    allowed_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]
    CORS(app, origins=allowed_origins or ["http://localhost:5173"], supports_credentials=True)

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
    if app.config.get("ENV") != "production":
        with app.app_context():
            db.create_all()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=bool(app.config.get("DEBUG")))
