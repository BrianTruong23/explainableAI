from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

router = APIRouter()

class TextInput(BaseModel):
    text: str

@router.post("/predict-text")
def predict_text(data: TextInput):
    # Simulate model prediction
    return {"prediction": "Positive", "explanation": [0.1, 0.9, 0.2, 0.8]}

@router.post("/predict-image")
def predict_image(file: UploadFile = File(...)):
    # Simulate image prediction
    return {"prediction": "Cat", "heatmap_url": "https://example.com/heatmap.jpg"}
