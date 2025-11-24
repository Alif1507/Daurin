from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Comment

comments_bp = Blueprint("comments", __name__)

@comments_bp.post("/")
@jwt_required()
def add_comment():
    data = request.json
    user_id = get_jwt_identity()
    comment = Comment(
        content=data["content"],
        post_id=data["post_id"],
        user_id=user_id
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"id": comment.id}), 201

@comments_bp.get("/<int:post_id>")
def list_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc())
    return jsonify([
        {
            "id": c.id,
            "content": c.content,
            "user_id": c.user_id,
            "created_at": c.created_at.isoformat()
        } for c in comments
    ])
