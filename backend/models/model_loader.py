from typing import Dict, Any
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from PIL import Image
import torchvision.transforms as transforms

class ModelLoader:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.tokenizers: Dict[str, Any] = {}
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def load_text_model(self, model_name: str = "bert-base-uncased"):
        """Load a text classification model"""
        if model_name not in self.models:
            self.models[model_name] = AutoModelForSequenceClassification.from_pretrained(model_name)
            self.tokenizers[model_name] = AutoTokenizer.from_pretrained(model_name)
        return self.models[model_name], self.tokenizers[model_name]

    def load_image_model(self, model_name: str = "vit-tiny"):
        """Load a vision model"""
        if model_name not in self.models:
            self.models[model_name] = torch.hub.load('facebookresearch/deit:main', 
                                                   model_name, 
                                                   pretrained=True)
        return self.models[model_name]

    def preprocess_text(self, text: str, model_name: str = "bert-base-uncased"):
        """Preprocess text input"""
        tokenizer = self.tokenizers.get(model_name)
        if not tokenizer:
            _, tokenizer = self.load_text_model(model_name)
        return tokenizer(text, return_tensors="pt", padding=True, truncation=True)

    def preprocess_image(self, image: Image.Image):
        """Preprocess image input"""
        return self.transform(image).unsqueeze(0) 