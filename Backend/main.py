from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import warnings
from sqlalchemy.orm import Session
from config.database import engine, Base, get_db
from cron.weather_job import fetch_and_save_islamabad_data
from app.api import summary
from app.api import predict

warnings.filterwarnings("ignore", category=UserWarning)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Only initialize database tables at startup to keep memory low
    Base.metadata.create_all(bind=engine)
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