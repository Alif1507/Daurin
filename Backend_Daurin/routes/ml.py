import os
from uuid import uuid4
from flask import Blueprint, request, jsonify, current_app
from services.trash_classifier import classifier

ml_bp = Blueprint("ml", __name__)

@ml_bp.post("/detect-trash")
def detect_trash():
    file = request.files.get("image")
    if not file:
        return jsonify({"message": "Image is required"}), 400

    filename = f"trash_{uuid4().hex}_{file.filename}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    path = os.path.join(upload_folder, filename)
    file.save(path)

    result = classifier.predict(path)
    primary = result.get("primary", {})
    return jsonify({
        "trash_type": primary.get("label"),
        "confidence": primary.get("confidence"),
        "reason": primary.get("reason"),
        "top": result.get("top", [])
    })
