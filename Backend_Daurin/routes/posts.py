import os
from uuid import uuid4
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Post

posts_bp = Blueprint("posts", __name__)

@posts_bp.get("/")
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    result = []
    for p in posts:
        result.append({
            "id": p.id,
            "caption": p.caption,
            "image_url": p.image_url,
            "user_id": p.user_id,
            "created_at": p.created_at.isoformat(),
            "likes_count": len(p.likes),
            "comments_count": len(p.comments),
        })
    return jsonify(result)

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
        image_url=f"/static/uploads/{filename}",  # or just filename if you serve it directly
        user_id=user_id
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({"id": post.id}), 201

@posts_bp.delete("/<int:post_id>")
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if post.user_id != user_id:
        return jsonify({"message": "Forbidden"}), 403
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Deleted"})
