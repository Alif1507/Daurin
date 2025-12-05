from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User

bcrypt = Bcrypt()
auth_bp = Blueprint("auth", __name__)

@auth_bp.record_once
def on_load(state):
    bcrypt.init_app(state.app)

@auth_bp.post("/register")
def register():
    data = request.json
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(username=data["username"], email=data["email"], password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@auth_bp.post("/login")
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }})

@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })


@auth_bp.put("/me")
@jwt_required()
def update_me():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    user = User.query.get_or_404(user_id)
    data = request.json or {}

    new_username = data.get("username")
    new_email = data.get("email")
    new_password = data.get("password")

    if new_username:
        existing = User.query.filter(User.username == new_username, User.id != user_id).first()
        if existing:
            return jsonify({"message": "Username already taken"}), 400
        user.username = new_username

    if new_email:
        existing = User.query.filter(User.email == new_email, User.id != user_id).first()
        if existing:
            return jsonify({"message": "Email already taken"}), 400
        user.email = new_email

    if new_password:
        user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    db.session.commit()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })
