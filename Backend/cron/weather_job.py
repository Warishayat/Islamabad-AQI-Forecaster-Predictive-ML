import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))
import requests
from datetime import datetime,timezone
from sqlalchemy.orm import Session
from config.database import SessionLocal
from app.core.models import AQIReading
import os
from pathlib import Path
from dotenv import load_dotenv


env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)


def fetch_and_save_islamabad_data():
    lat, lon = 33.6844, 73.0479
    weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,pressure_msl,wind_speed_10m"
    aqi_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi"
    
    db = None
    try:
        w_res = requests.get(weather_url, timeout=15).json()["current"]
        a_res = requests.get(aqi_url, timeout=15).json()["current"]
        
        db = SessionLocal()
        
        reading = AQIReading(
            time=datetime.utcnow(),
            pm2_5=float(a_res["pm2_5"]),
            pm10=float(a_res["pm10"]),
            carbon_monoxide=float(a_res["carbon_monoxide"]),
            nitrogen_dioxide=float(a_res["nitrogen_dioxide"]),
            sulphur_dioxide=float(a_res["sulphur_dioxide"]),
            ozone=float(a_res["ozone"]),
            european_aqi=float(a_res["european_aqi"]),
            temperature_2m=float(w_res["temperature_2m"]),
            relative_humidity_2m=float(w_res["relative_humidity_2m"]),
            wind_speed_10m=float(w_res["wind_speed_10m"]),
            pressure_msl=float(w_res["pressure_msl"]),
            precipitation=float(w_res["precipitation"])
        )
        
        db.add(reading)
        db.commit()
        db.refresh(reading)
        return True
        
    except Exception as e:
        if db:
            db.rollback() 
        print(f"Error fetching real-time data: {e}")
        return False
        
    finally:
        if db:
            db.close() 



if __name__ == "__main__":
    fetch_and_save_islamabad_data()