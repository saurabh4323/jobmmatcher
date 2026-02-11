from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification
import pandas as pd
from typing import List, Optional

app = FastAPI(title="Job Matcher ML Service")

# Model state (in a real app, you'd save/load this with joblib or pickle)
class MLModel:
    def __init__(self):
        self.model = LogisticRegression()
        self.is_trained = False
        self.feature_names = ["Skill Score", "Experience Years", "Interview Performance", "Education Level"]

    def train(self):
        # Create a synthetic dataset
        X, y = make_classification(n_samples=100, n_features=4, random_state=42)
        self.model.fit(X, y)
        self.is_trained = True
        return "Model trained successfully on synthetic dataset."

ml_service = MLModel()

class PredictionInput(BaseModel):
    features: List[float]

class TrainingData(BaseModel):
    samples: List[List[float]]
    labels: List[int]

@app.get("/")
async def root():
    return {"message": "Welcome to the Job Matcher Scikit-Learn API", "status": "online"}

@app.post("/train")
async def train_model():
    try:
        msg = ml_service.train()
        return {"message": msg, "trained": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(data: PredictionInput):
    if not ml_service.is_trained:
        # Auto-train if not trained
        ml_service.train()
    
    try:
        input_data = np.array([data.features])
        prediction = ml_service.model.predict(input_data)
        probability = ml_service.model.predict_proba(input_data)
        
        return {
            "prediction": int(prediction[0]),
            "confidence": float(np.max(probability)),
            "features_used": ml_service.feature_names
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def get_info():
    return {
        "model_type": "LogisticRegression",
        "trained": ml_service.is_trained,
        "features": ml_service.feature_names
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
