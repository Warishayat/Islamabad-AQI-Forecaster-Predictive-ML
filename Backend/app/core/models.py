from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from config.database import Base

class AQIReading(Base):
    __tablename__ = "aqi_readings"

    id = Column(Integer, primary_key=True, index=True)
    time = Column(DateTime, default=datetime.utcnow, index=True) 
    pm2_5 = Column(Float, nullable=False)
    pm10 = Column(Float, nullable=False)
    carbon_monoxide = Column(Float, nullable=False)
    nitrogen_dioxide = Column(Float, nullable=False)
    sulphur_dioxide = Column(Float, nullable=False)
    ozone = Column(Float, nullable=False)
    european_aqi = Column(Float, nullable=True) 
    temperature_2m = Column(Float, nullable=False)
    relative_humidity_2m = Column(Float, nullable=False)
    wind_speed_10m = Column(Float, nullable=False)
    pressure_msl = Column(Float, nullable=False)
    precipitation = Column(Float, default=0.0)