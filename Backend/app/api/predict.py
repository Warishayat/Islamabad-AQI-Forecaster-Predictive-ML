import numpy as np
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from config.database import get_db
from app.core.models import AQIReading

try:
    from app.core.feature_engineering import get_engineered_features
    from app.core.engine import make_prediction
except ModuleNotFoundError:
    from core.feature_engineering import get_engineered_features
    from core.engine import make_prediction

router = APIRouter(prefix="/api/v1", tags=["AQI Forecasting"])

@router.get("/predict-all")
def predict_islamabad_aqi(request: Request, db: Session = Depends(get_db)):
    try:
        models = request.app.state.models if hasattr(request.app.state, "models") else {}
        
        if not models:
            raise HTTPException(status_code=500, detail="ML Models memory mein loaded nahi hain.")

        latest_record = db.query(AQIReading).order_by(AQIReading.time.desc()).first()
        if not latest_record:
            raise HTTPException(status_code=404, detail="Neon Database mein koi data point nahi mila.")
        
        current_reading = {
            "pm2_5": float(latest_record.pm2_5),
            "pm10": float(latest_record.pm10),
            "carbon_monoxide": float(latest_record.carbon_monoxide),
            "nitrogen_dioxide": float(latest_record.nitrogen_dioxide),
            "sulphur_dioxide": float(latest_record.sulphur_dioxide),
            "ozone": float(latest_record.ozone),
            "temperature_2m": float(latest_record.temperature_2m),
            "relative_humidity_2m": float(latest_record.relative_humidity_2m),
            "wind_speed_10m": float(latest_record.wind_speed_10m),
            "pressure_msl": float(latest_record.pressure_msl),
            "precipitation": float(latest_record.precipitation)
        }
        
        features_sequence = get_engineered_features(current_reading, db)
        input_features = np.array(features_sequence).flatten().reshape(1, -1)
        
        predictions = make_prediction(input_features, models)
    
        return {
            "status": "success",
            "city": "Islamabad",
            "timestamp": latest_record.time.isoformat() + "Z",
            "current_data": {
                "temperature": current_reading["temperature_2m"],
                "humidity": current_reading["relative_humidity_2m"],
                "pm2_5": current_reading["pm2_5"],
                "aqi": float(latest_record.european_aqi) if latest_record.european_aqi is not None else 0.0,
                "pm10": current_reading["pm10"],
                "wind_speed": current_reading["wind_speed_10m"],
                "pressure": current_reading["pressure_msl"],
                "precipitation": current_reading["precipitation"]
            },
            "predictions": predictions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Route Error: {str(e)}")