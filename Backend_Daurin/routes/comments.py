from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Comment

comments_bp = Blueprint("comments", __name__)

@comments_bp.post("/")
@jwt_required()
def add_comment():
    data = request.json
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    comment = Comment(
        content=data["content"],
        post_id=data["post_id"],
        user_id=user_id
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({
        "id": comment.id,
        "content": comment.content,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "username": comment.author.username if comment.author else "Unknown",
        "created_at": comment.created_at.isoformat()
    }), 201

@comments_bp.get("/<int:post_id>")
def list_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc())
    return jsonify([
        {
            "id": c.id,
            "content": c.content,
            "user_id": c.user_id,
            "username": c.author.username if c.author else "Unknown",
            "created_at": c.created_at.isoformat()
        } for c in comments
    ])

@comments_bp.delete("/<int:comment_id>")
@jwt_required()
def delete_comment(comment_id):
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    comment = Comment.query.get_or_404(comment_id)
    if comment.user_id != user_id:
        return jsonify({"message": "Forbidden"}), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Deleted"})
