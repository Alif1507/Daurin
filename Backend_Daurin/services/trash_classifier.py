class TrashClassifier:
    def __init__(self):
        # Load your real model here
        # e.g. self.model = torch.load("trash_model.pt")
        pass

    def predict(self, image_path: str) -> str:
        # Run inference here; return class label
        # Dummy:
        return "plastic"

classifier = TrashClassifier()
