import os
import gc

MODEL_PATHS = {
    "3h": "models/random_forest_3hrsaqi_forecaster.pkl",
    "6h": "models/random_forest_6hrsaqi_forecaster.pkl",
    "12h": "models/random_forest_12hrsaqi_forecaster.pkl",
    "24h": "models/random_forest_24hrsaqi_forecaster.pkl",
}

def make_prediction(input_features):
    # Lazy imports to save memory at startup
    import numpy as np
    import joblib

    intervals = ["3h", "6h", "12h", "24h"]
    results = {}
    
    final_features = np.array(input_features).flatten().reshape(1, -1)
    
    for interval in intervals:
        path = MODEL_PATHS.get(interval)
        if path and os.path.exists(path):
            try:
                model = joblib.load(path)
                pred = model.predict(final_features)
                results[f"forecast_{interval}"] = round(float(pred[0]), 2)
                
                # Free memory immediately
                del model
            except Exception as e:
                results[f"error_{interval}"] = f"Inference Error: {str(e)}"
        else:
            results[f"error_{interval}"] = "Model file not found on disk"
            
    # Force garbage collection to reclaim memory used by loaded models
    gc.collect()
    
    return results