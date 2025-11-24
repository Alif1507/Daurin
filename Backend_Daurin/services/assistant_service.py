# services/assistant_service.py

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

def generate_idea_and_steps(variant: str, trash_items: str) -> tuple[str, list[str]]:
    """
    Here you would call an LLM (OpenAI, etc). For now it's hard-coded.
    """
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
    Call your image generation API here.
    For now, return dummy URL.
    """
    # prompt_example = f"Eco-friendly {product_name} made from {trash_items}, 3D render, clean background"
    # response = call_image_api(prompt_example)
    # return response.image_url

    return "https://example.com/generated-images/demo-product.png"

