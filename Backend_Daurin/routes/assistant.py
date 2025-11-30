from flask import Blueprint, request, jsonify
from services.assistant_service import suggest_product, load_history

assistant_bp = Blueprint("assistant", __name__)

@assistant_bp.post("/suggest")
def suggest():
    data = request.get_json(silent=True) or {}
    trash_items = data.get("trash_items", "")
    variant = data.get("variant")  # optional: "A" or "B"
    result = suggest_product(trash_items, requested_variant=variant)
    return jsonify(result)


@assistant_bp.get("/history")
def history():
    limit = request.args.get("limit", 20, type=int)
    return jsonify(load_history(limit))
