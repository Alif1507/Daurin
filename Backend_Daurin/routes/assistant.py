from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.assistant_service import suggest_product

assistant_bp = Blueprint("assistant", __name__)

@assistant_bp.post("/suggest")
@jwt_required()
def suggest():
    data = request.json
    trash_items = data.get("trash_items", "")
    result = suggest_product(trash_items)
    return jsonify(result)