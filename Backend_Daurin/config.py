import os
from pathlib import Path


def _default_upload_dir() -> str:
    base_dir = Path(__file__).resolve().parent
    return str(base_dir / "uploads")


class BaseConfig:
    """Shared configuration loaded from environment variables."""

    def __init__(self):
        self.ENV = os.getenv("FLASK_ENV", os.getenv("ENVIRONMENT", "development")).lower()
        self.SQLALCHEMY_DATABASE_URI = os.getenv(
            "DATABASE_URL",
            "mysql+pymysql://daurin:daurinpass@mysql:3306/daurin",
        )
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-change-me")
        self.UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", _default_upload_dir())
        self.FRONTEND_ORIGINS = os.getenv(
            "FRONTEND_ORIGINS",
            "http://localhost:5173,http://localhost:4173",
        )


class DevelopmentConfig(BaseConfig):
    def __init__(self):
        super().__init__()
        self.DEBUG = True
        self.TESTING = False


class ProductionConfig(BaseConfig):
    def __init__(self):
        super().__init__()
        self.DEBUG = False
        self.TESTING = False


def get_config():
    env = os.getenv("FLASK_ENV", os.getenv("ENVIRONMENT", "development")).lower()
    if env == "production":
        return ProductionConfig()
    return DevelopmentConfig()
