from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Follow, User

follows_bp = Blueprint("follows", __name__)


@follows_bp.post("/")
@jwt_required()
def follow_user():
    try:
        follower_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401

    target_id = request.json.get("user_id")
    if not target_id or target_id == follower_id:
        return jsonify({"message": "Invalid target"}), 400

    exists = Follow.query.filter_by(follower_id=follower_id, following_id=target_id).first()
    if exists:
        return jsonify({"message": "Already following"}), 400

    follow = Follow(follower_id=follower_id, following_id=target_id)
    db.session.add(follow)
    db.session.commit()
    return jsonify({"message": "Followed"}), 201


@follows_bp.delete("/")
@jwt_required()
def unfollow_user():
    try:
        follower_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401

    target_id = request.json.get("user_id")
    follow = Follow.query.filter_by(follower_id=follower_id, following_id=target_id).first()
    if not follow:
        return jsonify({"message": "Not following"}), 400
    db.session.delete(follow)
    db.session.commit()
    return jsonify({"message": "Unfollowed"})


@follows_bp.get("/stats")
def follow_stats():
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"message": "user_id required"}), 400

    followers_count = Follow.query.filter_by(following_id=user_id).count()
    following_count = Follow.query.filter_by(follower_id=user_id).count()

    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

        verify_jwt_in_request(optional=True)
        current_id = get_jwt_identity()
        is_following = bool(
            current_id and Follow.query.filter_by(follower_id=current_id, following_id=user_id).first()
        )
    except Exception:
        is_following = False

    user = User.query.get(user_id)
    return jsonify({
        "user": {"id": user.id if user else user_id, "username": user.username if user else "Unknown"},
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
    })
