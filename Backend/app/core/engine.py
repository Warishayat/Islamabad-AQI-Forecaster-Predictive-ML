import os
import numpy as np

def make_prediction(input_features, models):
    intervals = ["3h", "6h", "12h", "24h"]
    results = {}
    
    final_features = np.array(input_features).flatten().reshape(1, -1)
    
    for interval in intervals:
        model_key = interval
        if model_key in models:
            try:
                pred = models[model_key].predict(final_features)
                results[f"forecast_{interval}"] = round(float(pred[0]), 2)
            except Exception as e:
                results[f"error_{interval}"] = f"Inference Error: {str(e)}"
        else:
            results[f"error_{interval}"] = "Model not found in memory"
            
    return results