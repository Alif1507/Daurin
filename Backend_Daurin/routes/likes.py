from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Like

likes_bp = Blueprint("likes", __name__)

@likes_bp.post("/")
@jwt_required()
def like_post():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    post_id = request.json["post_id"]

    like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if like:
        return jsonify({"message": "Already liked"}), 400

    like = Like(user_id=user_id, post_id=post_id)
    db.session.add(like)
    db.session.commit()
    return jsonify({"message": "Liked"}), 201

@likes_bp.delete("/")
@jwt_required()
def unlike_post():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    post_id = request.json["post_id"]
    like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not like:
        return jsonify({"message": "Not liked"}), 400
    db.session.delete(like)
    db.session.commit()
    return jsonify({"message": "Unliked"})
