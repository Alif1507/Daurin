import os
from uuid import uuid4
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
)
from models import db, Post

posts_bp = Blueprint("posts", __name__)

def serialize_post(post, current_user_id=None):
    return {
        "id": post.id,
        "caption": post.caption,
        "image_url": post.image_url,
        "user_id": post.user_id,
        "author": {
            "id": post.author.id if post.author else None,
            "username": post.author.username if post.author else "Unknown",
        },
        "created_at": post.created_at.isoformat(),
        "likes_count": len(post.likes),
        "comments_count": len(post.comments),
        "liked_by_me": bool(
            current_user_id
            and any(l.user_id == current_user_id for l in post.likes)
        ),
        "can_edit": current_user_id == post.user_id if current_user_id else False,
    }

def remove_old_image(image_url):
    if not image_url:
        return
    filename = image_url.split("/")[-1]
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    filepath = os.path.join(upload_folder, filename)
    if os.path.exists(filepath):
        os.remove(filepath)

@posts_bp.get("/")
def list_posts():
    try:
        verify_jwt_in_request(optional=True)
        current_user_id = get_jwt_identity()
    except Exception:
        current_user_id = None

    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([serialize_post(p, current_user_id) for p in posts])

@posts_bp.get("/<int:post_id>")
def get_post(post_id):
    try:
        verify_jwt_in_request(optional=True)
        current_user_id = get_jwt_identity()
    except Exception:
        current_user_id = None

    post = Post.query.get_or_404(post_id)
    return jsonify(serialize_post(post, current_user_id))

@posts_bp.post("/")
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    caption = request.form.get("caption")
    file = request.files.get("image")

    if not file:
        return jsonify({"message": "Image is required"}), 400

    # Save image
    filename = f"{uuid4().hex}_{file.filename}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    post = Post(
        caption=caption,
        image_url=f"/uploads/{filename}",
        user_id=user_id
    )
    db.session.add(post)
    db.session.commit()
    return jsonify(serialize_post(post, user_id)), 201

@posts_bp.put("/<int:post_id>")
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if post.user_id != user_id:
        return jsonify({"message": "Forbidden"}), 403

    caption = request.form.get("caption", post.caption)
    file = request.files.get("image")

    if file:
        # replace image
        filename = f"{uuid4().hex}_{file.filename}"
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        remove_old_image(post.image_url)
        post.image_url = f"/uploads/{filename}"

    post.caption = caption
    db.session.commit()
    return jsonify(serialize_post(post, user_id))

@posts_bp.delete("/<int:post_id>")
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if post.user_id != user_id:
        return jsonify({"message": "Forbidden"}), 403

    remove_old_image(post.image_url)
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Deleted"})
