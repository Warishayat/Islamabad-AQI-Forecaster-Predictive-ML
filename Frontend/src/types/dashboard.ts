export interface CurrentData {
  temperature: number;
  humidity: number;
  pm2_5: number;
  pm10: number;
  wind_speed: number;
  pressure: number;
  precipitation: number;
}

export interface Predictions {
  forecast_3h: number;
  forecast_6h: number;
  forecast_12h: number;
  forecast_24h: number;
}

export interface ApiResponse {
  status: string;
  city: string;
  timestamp: string;
  current_data: CurrentData;
  predictions: Predictions;
}
