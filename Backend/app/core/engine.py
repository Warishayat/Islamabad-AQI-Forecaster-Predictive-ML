import numpy as np
import pandas as pd

def make_prediction(features_list, loaded_models):
    features = np.array([features_list])
    predictions = {}
    
    for horizon, model in loaded_models.items():
        try:
            if horizon == "xgb":
                column_names = [
                    "PM2.5", "PM10", "Carbon_Monoxide_CO", "Nitrogen_Dioxide_NO2", 
                    "Sulphur_Dioxide_SO2", "Ozone_O3", "Temperature", "Humidity", 
                    "Wind_Speed", "Air_Pressure", "Rainfall", "PM2.5_3h_Mean", 
                    "PM2.5_3h_Std", "PM2.5_6h_Mean", "PM2.5_6h_Std", "PM2.5_24h_Mean", 
                    "PM2.5_24h_Std"
                ]
                features_df = pd.DataFrame([features_list], columns=column_names)
                pred_value = model.predict(features_df)
                predictions["current_aqi_xgb"] = max(0.0, round(float(pred_value[0]), 2))
            else:
                pred_value = model.predict(features)[0]
                predictions[f"forecast_{horizon}"] = max(0.0, round(float(pred_value), 2))
        except Exception as e:
            predictions[f"error_{horizon}"] = f"Inference Error: {str(e)}"
            
    return predictions