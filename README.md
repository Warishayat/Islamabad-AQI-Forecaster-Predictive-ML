# Islamabad AQI & Weather Forecaster 🌫️

An end-to-end, full-stack environmental monitoring and predictive dashboard designed to track, forecast, and analyze Air Quality Index (AQI) and weather conditions in Islamabad. 

This system integrates real-time meteorological data, Machine Learning models (Random Forest/XGBoost) for short-term and long-term AQI forecasting, and a Generative AI pipeline (Groq + LangChain) to provide dynamic, context-aware health advisories.

---

## 🚀 Key Features

- **Real-Time Data Pipeline**: Automatically fetches live weather and air quality metrics (PM2.5, PM10, Ozone, CO, etc.) using scheduled cron jobs and stores them securely in a Neon serverless PostgreSQL database.
- **Machine Learning Forecasting**: Deploys pre-trained `.pkl` models to predict AQI across 4 specific horizons: `3h`, `6h`, `12h`, and `24h`.
- **Generative AI Advisories**: Analyzes the predicted forecast trends via LangChain and Groq LLMs to generate professional, conversational health advisories for citizens (e.g., outdoor activity safety warnings).
- **Interactive UI**: A highly responsive, glassmorphism-inspired Next.js frontend featuring dynamic Recharts line graphs for comparing past 24-hour actual data with the predicted 24-hour trend.
- **Memory-Optimized Backend (Render)**: The FastAPI server utilizes advanced Lazy Loading and explicit garbage collection (`gc.collect()`) to handle heavy data science dependencies (`pandas`, `scikit-learn`, `joblib`) without breaching Render's strict 512MB RAM cap.

---

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: UI Components, Lucide React (Icons)
- **Data Visualization**: Recharts (Dynamic continuous/comparative graphs)
- **Language**: TypeScript

### Backend (Server-Side)
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: SQLAlchemy
- **Machine Learning**: Scikit-Learn, XGBoost, Numpy, Pandas, Joblib, RandomForest
- **Generative AI**: LangChain, Groq API (gpt-oss-20b)

---

## 📂 Project Structure

```text
Islamabad-AQI-Forecaster/
│
├── Backend/                 # Python FastAPI Backend
│   ├── app/                 # Application Logic
│   │   ├── api/             # API Routers (predict, summary)
│   │   ├── core/            # Core logic (engine, feature_engineering, models)
│   ├── config/              # Database configurations (Neon DB)
│   ├── cron/                # Automated CRON jobs for data fetching
│   ├── models/              # Saved ML models (.pkl files)
│   ├── main.py              # FastAPI Application Entry Point
│   └── requirements.txt     # Python Dependencies
│
└── Frontend/                # Next.js React Frontend
    ├── src/
    │   ├── app/             # Next.js App Router (page.tsx, layout.tsx)
    │   ├── components/      # React Components (Dashboard, ForecastGraph, TopStats)
    │   ├── types/           # TypeScript Type Definitions
    ├── public/              # Static Assets
    ├── package.json         # Node Dependencies
    └── tailwind.config.js   # Tailwind Configuration
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Islamabad-AQI-Forecaster.git
cd Islamabad-AQI-Forecaster
```

### 2. Backend Setup
```bash
cd Backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment Variables (.env)
# Create a .env file in the Backend directory and add the following:
DATABASE_URL=postgresql://user:password@ep-cold-shadow-12345.region.aws.neon.tech/dbname
GOOGLE_API_KEY=your_groq_or_google_api_key

# Run the server
uvicorn main:app --reload --port 8000
```
*Note: The backend implements Lazy Loading. The first prediction/summary request might take 2-4 seconds to load heavy ML models into memory.*

### 3. Frontend Setup
```bash
cd ../Frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

---

## 🧠 Memory Optimization Details

To deploy a complex ML/LLM application on Render's free tier (512MB RAM), the backend architecture heavily utilizes **Lazy Loading**:
- `pandas` is only imported inside the feature engineering function.
- `.pkl` model binaries and `joblib` are loaded locally inside the inference engine (`make_prediction`) rather than during global startup.
- `gc.collect()` is explicitly called after every prediction to aggressively wipe the loaded models from RAM, preventing Out of Memory (OOM) crashes.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License
This project is licensed under the MIT License.
