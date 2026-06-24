from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib
import numpy as np
import os
import warnings
from sqlalchemy.orm import Session
from config.database import engine, Base, get_db
from app.core.feature_engineering import get_engineered_features
from app.core.engine import make_prediction
from cron.weather_job import fetch_and_save_islamabad_data
from app.api import summary
from app.api import predict

warnings.filterwarnings("ignore", category=UserWarning)

MODEL_PATHS = {
    "3h": "models/random_forest_3hrsaqi_forecaster.pkl",
    "6h": "models/random_forest_6hrsaqi_forecaster.pkl",
    "12h": "models/random_forest_12hrsaqi_forecaster.pkl",
    "24h": "models/random_forest_24hrsaqi_forecaster.pkl",
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
    Base.metadata.create_all(bind=engine)
    load_all_models()
    app.state.models = models
    yield

app = FastAPI(title="Islamabad Weather Forecaster", lifespan=lifespan, version="0.01")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is working smoothly"}

@app.get("/api/v1/fetch-live-data")
def trigger_live_fetch():
    success = fetch_and_save_islamabad_data()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to fetch data from Open-Meteo")
    return {"status": "success", "message": "Real-time Islamabad data saved to PostgreSQL."}

app.include_router(summary.router, prefix="/api/v1", tags=["AI Summary"])
app.include_router(predict.router)