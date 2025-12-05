import os
import urllib.parse
import json
from datetime import datetime
from typing import Optional, List
# services/assistant_service.py

# --- TEXT LLM (Gemini 2.x / 2.5) ---

try:
    import google.generativeai as genai  # type: ignore
except ImportError:
    genai = None


def choose_product_variant(trash_items: str) -> str:
    """
    Decide Product A / Product B based on user trash description.
    For now it's rule-based; later you can replace with an LLM call.
    """
    text = trash_items.lower()

    # Example: plastic & metal => Product A, paper/cardboard => Product B
    if any(word in text for word in ["bottle", "botol", "plastic", "plastik", "kaleng", "can", "metal"]):
        return "A"
    else:
        return "B"


def call_llm(trash_items: str, variant: str):
    """
    Optional: Call a Gemini model to get product ideas.
    Set GOOGLE_API_KEY env var and install google-generativeai to activate.
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key or not genai:
        print("[assistant_service] LLM skipped: google-generativeai not installed or GOOGLE_API_KEY missing")
        return None

    genai.configure(api_key=api_key)

    # Prompt "Resep Kerajinan": baris 1 = nama produk, baris 2–6 = langkah
    prompt = f"""
Kamu adalah asisten daur ulang kreatif untuk pelajar SMP/SMA.

Dari deskripsi sampah berikut: "{trash_items}"
dan gaya Produk {variant} (Produk A = desain sederhana dan mudah dibuat, Produk B = desain lebih estetik dan sedikit lebih rumit),

tugasmu adalah:
1. Menentukan satu ide produk kerajinan yang menarik, fungsional, dan relevan dengan jenis sampah tersebut.
2. Menjelaskan langkah-langkah cara membuatnya dengan jelas dan aman.

Format jawaban HARUS seperti ini:
- Baris pertama: hanya NAMA PRODUK, tanpa awalan "Nama produk:", tanpa nomor, tanpa tanda bullet.
- Baris berikutnya: MAKSIMAL 5 langkah, masing-masing 1–2 kalimat, langsung mulai dengan kalimat (tidak perlu nomor atau bullet).
- Jangan menulis teks lain selain nama produk dan langkah-langkah tersebut.
- Jangan menulis penutup, jangan menulis tips terpisah, jangan menambah heading.

Contoh struktur (hanya struktur, bukan isi yang wajib kamu tiru):

Organizer Meja dari Botol Plastik
Potong bagian atas beberapa botol plastik sesuai tinggi organizer yang diinginkan lalu bersihkan hingga kering.
Tempelkan botol-botol tersebut pada selembar karton tebal sebagai alas menggunakan lem yang kuat.
Hias bagian luar botol dan alas karton dengan cat atau kertas kado agar terlihat lebih rapi dan menarik.
Biarkan lem dan cat mengering sebelum organizer digunakan untuk menyimpan alat tulis.

Sekarang buat ide produk kerajinan terbaikmu untuk sampah: {trash_items}
Jawab dalam bahasa Indonesia dengan mengikuti format di atas secara ketat.
""".strip()

    # Bisa override pakai env: GEMINI_MODEL=gemini-2.5-flash, dll
    env_model = os.getenv("GEMINI_MODEL")

    # PAKAI MODEL GENERASI BARU (2.x / 2.5), 1.x & 1.5 sudah retired → 404
    raw_candidates = [
        env_model,
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-pro",
    ]
    # filter None / string kosong
    model_candidates = [m for m in raw_candidates if m]

    errors: List[str] = []

    for model_name in model_candidates:
        try:
            print(f"[assistant_service] Trying Gemini model: {model_name}")
            model = genai.GenerativeModel(model_name)
            result = model.generate_content(prompt, generation_config={"temperature": 0.6})

            content = (result.text or "").strip()
            if not content:
                continue

            lines = [line.strip("- •") for line in content.splitlines() if line.strip()]
            if not lines:
                continue

            product_name = lines[0]
            steps = lines[1:6] if len(lines) > 1 else []
            print(f"[assistant_service] Using Gemini model '{model_name}' successfully")
            return product_name, steps

        except Exception as exc:
            errors.append(f"{model_name}: {exc}")
            continue

    if errors:
        print("[assistant_service] Gemini calls failed, falling back. Tried -> " + " | ".join(errors))
    return None


def generate_idea_and_steps(variant: str, trash_items: str) -> tuple[str, List[str]]:
    """
    Here you would call an LLM (Gemini, etc). Falls back to hard-coded samples.
    """
    llm_result = call_llm(trash_items, variant)
    if llm_result:
        return llm_result

    # Fallback kalau LLM gagal
    if variant == "A":
        product_name = "DIY Desk Pen Holder from Plastic Bottles"
        steps = [
            "Bersihkan botol plastik sampai kering.",
            "Potong botol setinggi kira-kira 10–12 cm.",
            "Haluskan bagian tepi potongan dengan amplas.",
            "Cat atau hias bagian luar botol sesuai selera.",
            "Susun beberapa botol di atas karton tebal dan rekatkan dengan lem panas."
        ]
    else:
        product_name = "Foldable Storage Box from Cardboard"
        steps = [
            "Pilih kardus yang masih kaku dan tidak lembek.",
            "Potong kardus menjadi bentuk persegi panjang sesuai ukuran box.",
            "Lipat sisi-sisinya dan rekatkan dengan lem atau lakban.",
            "Lapisi bagian luar dengan kertas kado atau koran agar lebih rapi.",
            "Tambahkan label di depan box untuk menandai isi."
        ]

    return product_name, steps


def generate_product_image(product_name: str, trash_items: str, variant: str) -> str:
    """
    Generate preview visual sebagai SVG inline.
    Tidak memanggil API image generation berbayar.
    """
    safe_title = product_name.replace('"', "")
    svg = f"""
<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
  <defs>
    <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#0ea5e9'/>
      <stop offset='100%' stop-color='#10b981'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='#0b1120'/>
  <rect x='24' y='24' width='592' height='312' rx='24' fill='url(#g)' opacity='0.35'/>
  <text x='50%' y='42%' text-anchor='middle' font-family='Poppins, Arial' font-size='20' fill='#a7f3d0'>
    Produk {variant}
  </text>
  <text x='50%' y='55%' text-anchor='middle' font-family='Poppins, Arial' font-size='18' fill='#e0f2fe'>
    {safe_title}
  </text>
  <text x='50%' y='68%' text-anchor='middle' font-family='Poppins, Arial' font-size='14' fill='#bae6fd'>
    Bahan: {trash_items}
  </text>
</svg>
"""
    encoded = urllib.parse.quote(svg.strip())
    return "data:image/svg+xml," + encoded


def save_choice(record: dict):
    """
    Append the chosen product to a local JSONL file for simple history.
    """
    history_path = os.path.join(os.path.dirname(__file__), "..", "assistant_history.jsonl")
    try:
        with open(history_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception as exc:
        print(f"[assistant_service] Failed to save choice: {exc}")


def load_history(limit: int = 20, user_id: Optional[int] = None):
    """
    Read the last N entries from the JSONL history file.
    """
    history_path = os.path.join(os.path.dirname(__file__), "..", "assistant_history.jsonl")
    if not os.path.exists(history_path):
        return []
    records = []
    try:
        with open(history_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    parsed = json.loads(line)
                    if user_id is None or parsed.get("user_id") == user_id:
                        records.append(parsed)
                except json.JSONDecodeError:
                    continue
        return list(reversed(records))[:limit]
    except Exception as exc:
        print(f"[assistant_service] Failed to load history: {exc}")
        return []


def update_history_item(user_id: int, timestamp: str, payload: dict) -> bool:
    """
    Update a specific history item by user_id and timestamp.
    payload may include 'checked' (list of ints) or 'delete' (bool).
    """
    history_path = os.path.join(os.path.dirname(__file__), "..", "assistant_history.jsonl")
    if not os.path.exists(history_path):
        return False

    updated = False
    try:
        with open(history_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        new_lines = []
        for line in lines:
            line = line.strip()
            if not line:
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue

            if item.get("user_id") == user_id and item.get("timestamp") == timestamp:
                if payload.get("delete"):
                    updated = True
                    continue  # skip writing -> delete
                if "checked" in payload:
                    item["checked_steps"] = payload["checked"]
                    updated = True
            new_lines.append(json.dumps(item, ensure_ascii=False))

        with open(history_path, "w", encoding="utf-8") as f:
            for nl in new_lines:
                f.write(nl + "\n")

    except Exception as exc:
        print(f"[assistant_service] Failed to update history: {exc}")
        return False

    return updated


def suggest_product(trash_items: str, requested_variant: Optional[str] = None, user_id: Optional[int] = None) -> dict:
    """
    Public function used by the API layer.
    Supports two flows:
    1) No variant provided -> return options for A and B so user can pick.
    2) Variant provided   -> return steps for that variant.
    """
    cleaned = (trash_items or "").strip()
    if not cleaned:
        return {
            "variant": None,
            "product_name": "",
            "steps": [],
            "image_url": "",
            "choose_variant": False,
        }

    def option_for_variant(var_id: str):
        name, steps = generate_idea_and_steps(var_id, cleaned)
        return {
            "variant": var_id,
            "product_name": name,
            "preview_steps": steps[:2],
        }

    # If caller did not specify variant, return both options to choose
    # Caller can then POST again with chosen variant.
    env_forced_variant = os.getenv("ASSISTANT_FORCE_VARIANT")  # optional override
    selected_variant = requested_variant or env_forced_variant

    if not selected_variant:
        return {
            "choose_variant": True,
            "options": [option_for_variant("A"), option_for_variant("B")],
        }

    variant = selected_variant if selected_variant in ["A", "B"] else choose_product_variant(cleaned)
    product_name, steps = generate_idea_and_steps(variant, cleaned)
    image_url = generate_product_image(product_name, cleaned, variant)

    save_choice({
        "timestamp": datetime.utcnow().isoformat(),
        "trash_items": cleaned,
        "variant": variant,
        "product_name": product_name,
        "steps": steps,
        "image_url": image_url,
        "user_id": user_id,
    })

    return {
        "variant": variant,
        "product_name": product_name,
        "steps": steps,
        "image_url": image_url,
        "choose_variant": False,
    }
