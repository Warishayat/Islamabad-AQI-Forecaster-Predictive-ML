import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.core.models import AQIReading

def get_engineered_features(current_reading: dict, db: Session):
    history = db.query(AQIReading).order_by(AQIReading.time.desc()).limit(24).all()
    if not history:
        history_df = pd.DataFrame([current_reading])
    else:
        data_list = []
        for r in reversed(history): 
            data_list.append({
                "pm2_5": r.pm2_5, "pm10": r.pm10, "carbon_monoxide": r.carbon_monoxide,
                "nitrogen_dioxide": r.nitrogen_dioxide, "sulphur_dioxide": r.sulphur_dioxide,
                "ozone": r.ozone, "temperature_2m": r.temperature_2m, 
                "relative_humidity_2m": r.relative_humidity_2m, "wind_speed_10m": r.wind_speed_10m,
                "pressure_msl": r.pressure_msl, "precipitation": r.precipitation
            })
        data_list.append(current_reading)
        history_df = pd.DataFrame(data_list)

    history_df['pm2_5_roll_3h'] = history_df['pm2_5'].rolling(window=3, min_periods=1).mean()
    history_df['pm2_5_std_3h'] = history_df['pm2_5'].rolling(window=3, min_periods=1).std().fillna(0)
    
    history_df['pm2_5_roll_6h'] = history_df['pm2_5'].rolling(window=6, min_periods=1).mean()
    history_df['pm2_5_std_6h'] = history_df['pm2_5'].rolling(window=6, min_periods=1).std().fillna(0)
    
    history_df['pm2_5_roll_24h'] = history_df['pm2_5'].rolling(window=24, min_periods=1).mean()
    history_df['pm2_5_std_24h'] = history_df['pm2_5'].rolling(window=24, min_periods=1).std().fillna(0)

    latest = history_df.iloc[-1]
    
    features_sequence = [
        float(latest['pm2_5']),
        float(latest['pm10']),
        float(latest['carbon_monoxide']),
        float(latest['nitrogen_dioxide']),
        float(latest['sulphur_dioxide']),
        float(latest['ozone']),
        float(latest['temperature_2m']),
        float(latest['relative_humidity_2m']),
        float(latest['wind_speed_10m']),
        float(latest['pressure_msl']),
        float(latest['precipitation']),
        
        float(latest['pm2_5_roll_3h']),
        float(latest['pm2_5_std_3h']),
        float(latest['pm2_5_roll_6h']),
        float(latest['pm2_5_std_6h']),
        float(latest['pm2_5_roll_24h']),
        float(latest['pm2_5_std_24h'])
    ]
    
    return [float(x) for x in features_sequence]