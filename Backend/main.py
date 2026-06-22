from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib
import numpy as np
import os

MODEL_PATHS = {
    "3h": "models/random_forest_3hrsaqi_forecaster.pkl",
    "6h": "models/random_forest_6hrsaqi_forecaster.pkl",
    "12h": "models/random_forest_12hrsaqi_forecaster.pkl",
    "24h": "models/random_forest_24hrsaqi_forecaster.pkl",
    "xgb": "models/xgboost_aqi_model.pkl"
}

models = {}

def load_all_models():
    print("Loading models into memory...")
    for horizon, path in MODEL_PATHS.items():
        if os.path.exists(path):
            try:
                models[horizon] = joblib.load(path)
                print(f"{horizon} model loaded")
            except Exception as e:
                print(f"Failed loading {horizon}: {e}")
        else:
            print(f"Missing file: {path}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_all_models()
    yield

app = FastAPI(title="Islamabad Weather Forecaster", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is working"}

@app.post("/predict/{horizon}")
def predict(horizon: str, data: dict):

    if horizon not in models:
        return {"error": "Model not loaded"}

    model = models[horizon]

    features = np.array([
        data["pm25"],
        data["pm10"],
        data["temperature"],
        data["humidity"]
    ]).reshape(1, -1)

    prediction = model.predict(features)[0]

    return {
        "horizon": horizon,
        "predicted_aqi": float(prediction)
    }