from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email    = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    posts    = db.relationship("Post", backref="author", lazy=True)

class Post(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    caption    = db.Column(db.Text, nullable=True)
    image_url  = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    comments   = db.relationship("Comment", backref="post", lazy=True)
    likes      = db.relationship("Like", backref="post", lazy=True)

class Comment(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    content    = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    post_id    = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)

class Like(db.Model):
    id      = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("post.id"), nullable=False)
    __table_args__ = (db.UniqueConstraint('user_id', 'post_id',
                                          name='unique_user_post_like'),)
