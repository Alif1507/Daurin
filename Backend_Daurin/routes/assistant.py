from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.assistant_service import suggest_product, load_history, update_history_item

assistant_bp = Blueprint("assistant", __name__)

@assistant_bp.post("/suggest")
@jwt_required(optional=True)
def suggest():
    data = request.get_json(silent=True) or {}
    trash_items = data.get("trash_items", "")
    variant = data.get("variant")  # optional: "A" or "B"
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id) if user_id is not None else None
    except (TypeError, ValueError):
        user_id = None
    result = suggest_product(trash_items, requested_variant=variant, user_id=user_id)
    return jsonify(result)


@assistant_bp.get("/history")
@jwt_required()
def history():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401
    limit = request.args.get("limit", 20, type=int)
    return jsonify(load_history(limit, user_id=user_id))


@assistant_bp.put("/history")
@jwt_required()
def update_history():
    try:
        user_id = int(get_jwt_identity())
    except (TypeError, ValueError):
        return jsonify({"message": "Invalid token"}), 401

    data = request.get_json(silent=True) or {}
    ts = data.get("timestamp")
    checked = data.get("checked")
    delete_flag = data.get("delete", False)

    if not ts:
        return jsonify({"message": "timestamp required"}), 400

    payload = {}
    if checked is not None:
        payload["checked"] = checked
    if delete_flag:
        payload["delete"] = True

    ok = update_history_item(user_id, ts, payload)
    if not ok:
        return jsonify({"message": "Item not found"}), 404
    return jsonify({"message": "Updated"})
