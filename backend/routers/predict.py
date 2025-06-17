from fastapi import FastAPI
from pydantic import BaseModel
from model_loader import ModelLoader
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model_loader = ModelLoader()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/predict-text")
def predict_text(request: TextRequest):

    text = request.text
    prediction, probabilities = model_loader.predict_text(text)
    print(f"Input: {text}")
    print(f"Prediction: {prediction}, Probabilities: {probabilities}")

    return {
        "prediction": str(prediction),
        "probabilities": probabilities,
        "explanation": "Token attribution coming soon"
    }


@app.post("/predict-image")
def predict_image(file: UploadFile = File(...)):
    # Simulate image prediction
    return {"prediction": "Cat", "heatmap_url": "https://example.com/heatmap.jpg"}
