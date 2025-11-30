import os
import json
import numpy as np
from typing import Dict, List, Optional

try:
    import google.generativeai as genai  # type: ignore
except ImportError:
    genai = None

try:
    from ultralytics import YOLO  # type: ignore
except ImportError:
    YOLO = None

try:
    from PIL import Image  # type: ignore
except ImportError:
    Image = None


class TrashClassifier:
    """
    Priority: YOLO -> Gemini -> heuristic fallback.

    - If YOLO_MODEL_PATH is set and ultralytics is installed, use YOLO.
    - Else: try Gemini multimodal (image) via google-generativeai.
    - Else: fallback heuristic based on filename, size, dan brightness.
    """

    LABELS = ["plastic", "paper", "metal", "glass", "organic", "other"]

    def __init__(self):
        self.yolo = None

        # Optional YOLO model (kalau kamu punya)
        yolo_path = os.getenv("YOLO_MODEL_PATH")
        if YOLO and yolo_path and os.path.exists(yolo_path):
            try:
                self.yolo = YOLO(yolo_path)
            except Exception as exc:
                print(f"[TrashClassifier] Failed to load YOLO model: {exc}")
                self.yolo = None

    # ---------- YOLO ----------
    def _predict_yolo(self, image_path: str) -> Optional[List[Dict[str, str]]]:
        if not self.yolo:
            return None
        try:
            results = self.yolo.predict(source=image_path, imgsz=640, verbose=False)
            if not results:
                return None
            res = results[0]
            names = res.names
            probs = res.probs
            # If classification model: use probs; if detection model: use boxes/conf
            if probs is not None and probs.data is not None:
                data = probs.data.cpu().numpy().astype(float)
                ranked = sorted(
                    [
                        {"label": names.get(idx, str(idx)), "confidence": float(conf), "reason": "Prediksi YOLO"}
                        for idx, conf in enumerate(data)
                    ],
                    key=lambda x: x["confidence"],
                    reverse=True,
                )
            else:
                boxes = res.boxes
                if not boxes or boxes.conf is None or boxes.cls is None:
                    return None
                # Aggregate by class: take max confidence per class
                cls_ids = boxes.cls.cpu().numpy().astype(int)
                confs = boxes.conf.cpu().numpy().astype(float)
                best_per_class = {}
                for cid, conf in zip(cls_ids, confs):
                    label = names.get(int(cid), str(cid))
                    best_per_class[label] = max(best_per_class.get(label, 0), conf)
                ranked = sorted(
                    [{"label": k, "confidence": v, "reason": "Deteksi YOLO"} for k, v in best_per_class.items()],
                    key=lambda x: x["confidence"],
                    reverse=True,
                )
            # Map ke label umum kalau bisa
            mapped = []
            for item in ranked:
                label_lower = item["label"].lower()
                mapped_label = next((lbl for lbl in self.LABELS if lbl in label_lower), "other")
                mapped.append({**item, "label": mapped_label})
            return mapped
        except Exception as exc:
            print(f"[TrashClassifier] YOLO inference failed: {exc}")
            return None

    # ---------- GEMINI MULTIMODAL (VISION) ----------
    def _predict_gemini(self, image_path: str) -> Optional[List[Dict[str, str]]]:
        """
        Pakai Gemini (multimodal) untuk klasifikasi 1 gambar ke salah satu label:
        plastic, paper, metal, glass, organic, other.
        """
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key or not genai or not Image:
            print("[TrashClassifier] Gemini skipped: missing API key / google-generativeai / PIL")
            return None

        try:
            genai.configure(api_key=api_key)

            model_name = os.getenv("GEMINI_VISION_MODEL") or "gemini-2.5-flash"
            model = genai.GenerativeModel(model_name)

            img = Image.open(image_path).convert("RGB")

            prompt = """
Kamu adalah model klasifikasi sampah untuk daur ulang.

TUGAS:
- Lihat gambar sampah yang diberikan.
- Tentukan jenis sampah UTAMA yang paling terlihat di gambar.
- Pilih PERSIS satu label utama dari daftar berikut:
  ["plastic", "paper", "metal", "glass", "organic", "other"].

- Jika kamu ragu di antara dua jenis, pilih yang paling masuk akal secara umum.
- Tulis juga alternatif lain jika ada, dengan tingkat keyakinan yang lebih rendah.

FORMAT JAWABAN (WAJIB JSON, tanpa teks lain di luar JSON):

{
  "primary": {
    "label": "<satu dari: plastic/paper/metal/glass/organic/other>",
    "confidence": <angka antara 0 dan 1>,
    "reason": "<penjelasan singkat dalam bahasa Indonesia>"
  },
  "alternatives": [
    {
      "label": "<label lain>",
      "confidence": <angka antara 0 dan 1>,
      "reason": "<penjelasan singkat>"
    }
  ]
}

Gunakan label dalam huruf kecil bahasa Inggris, dan reason dalam bahasa Indonesia.
""".strip()

            result = model.generate_content([prompt, img])
            content = (result.text or "").strip()
            # Coba parse JSON
            data = json.loads(content)

            primary = data.get("primary")
            alts = data.get("alternatives") or []

            ranked: List[Dict[str, str]] = []
            if primary:
                ranked.append(
                    {
                        "label": primary.get("label", "other"),
                        "confidence": float(primary.get("confidence", 0.7)),
                        "reason": primary.get("reason", "Prediksi Gemini"),
                    }
                )
            for alt in alts:
                ranked.append(
                    {
                        "label": alt.get("label", "other"),
                        "confidence": float(alt.get("confidence", 0.3)),
                        "reason": alt.get("reason", "Alternatif Gemini"),
                    }
                )

            # filter & sort sedikit, just in case
            ranked = [
                r
                for r in ranked
                if isinstance(r.get("label"), str)
                and r["label"] in self.LABELS
            ]
            ranked = sorted(ranked, key=lambda x: x["confidence"], reverse=True)

            return ranked or None
        except Exception as exc:
            print(f"[TrashClassifier] Gemini vision inference failed: {exc}")
            return None

    # ---------- FALLBACK HEURISTIC ----------
    def _image_stats(self, image_path: str):
        if not Image:
            return None
        try:
            with Image.open(image_path) as img:
                img = img.convert("RGB")
                width, height = img.size
                pixels = list(img.getdata())
                avg = tuple(sum(c[i] for c in pixels) / len(pixels) for i in range(3))
                brightness = sum(avg) / 3 / 255
                return {"width": width, "height": height, "brightness": brightness}
        except Exception:
            return None

    def _score_fallback(self, image_path: str) -> List[Dict[str, str]]:
        filename = os.path.basename(image_path).lower()
        size_kb = os.path.getsize(image_path) / 1024
        stats = self._image_stats(image_path) or {}

        scores = {label: 0.15 for label in self.LABELS}  # base prior

        keyword_map = {
            "plastic": ["plastik", "plastic", "pet", "cup", "bottle"],
            "paper": ["paper", "kertas", "karton", "cardboard", "box"],
            "metal": ["metal", "kaleng", "can", "aluminum", "besi"],
            "glass": ["glass", "botol", "kaca", "jar"],
            "organic": ["organic", "food", "buah", "sayur", "daun"],
        }

        for label, words in keyword_map.items():
            if any(word in filename for word in words):
                scores[label] += 0.5

        # Size-based hints
        if size_kb > 2000:
            scores["metal"] += 0.15
            scores["glass"] += 0.05
        if size_kb < 200:
            scores["paper"] += 0.1
            scores["plastic"] += 0.05

        # Brightness hint: darker images may be organic/metal
        brightness = stats.get("brightness")
        if brightness is not None:
            if brightness < 0.35:
                scores["metal"] += 0.1
                scores["organic"] += 0.1
            elif brightness > 0.7:
                scores["plastic"] += 0.1
                scores["glass"] += 0.05

        # Normalize and craft reasons
        total = sum(scores.values())
        ranked = sorted(
            [
                {
                    "label": label,
                    "confidence": round(score / total, 3),
                    "reason": self._reason(label, filename, size_kb, brightness),
                }
                for label, score in scores.items()
            ],
            key=lambda x: x["confidence"],
            reverse=True,
        )
        return ranked

    def _reason(self, label: str, filename: str, size_kb: float, brightness):
        if label == "plastic":
            return "Kata kunci botol/plastik terdeteksi di nama file" if "plast" in filename or "bottle" in filename else "Cocok dengan pola plastik umum"
        if label == "paper":
            return "Kata kunci kertas/karton terdeteksi" if "paper" in filename or "karton" in filename else "Ukuran kecil cocok untuk kertas ringan"
        if label == "metal":
            return "Kata kunci kaleng/metal terdeteksi" if "kaleng" in filename or "metal" in filename else "File besar/cahaya rendah cenderung metal"
        if label == "glass":
            return "Kata kunci kaca/botol terdeteksi" if "glass" in filename or "kaca" in filename else "Cahaya terang cenderung kaca"
        if label == "organic":
            return "Kata kunci makanan/daun terdeteksi" if any(k in filename for k in ["food", "buah", "sayur", "daun"]) else "Cahaya rendah cenderung organik"
        return "Kategori lain/kurang bukti"

    # ---------- PUBLIC API ----------
    def predict(self, image_path: str) -> Dict[str, object]:
        # 1) YOLO (kalau ada)
        ranked = self._predict_yolo(image_path)
        # 2) Gemini multimodal
        if ranked is None or len(ranked) == 0:
            ranked = self._predict_gemini(image_path)
        # 3) Heuristic fallback
        if ranked is None or len(ranked) == 0:
            ranked = self._score_fallback(image_path)

        primary = ranked[0] if ranked else {"label": "other", "confidence": 0.2, "reason": "Tidak yakin"}
        return {"top": ranked[:3], "primary": primary}


classifier = TrashClassifier()
