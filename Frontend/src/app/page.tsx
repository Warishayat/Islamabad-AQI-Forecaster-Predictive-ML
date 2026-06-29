"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ApiResponse } from "@/types/dashboard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAqiData() {
      try {
        const res = await fetch("https://slamabad-aqi-forecaster.onrender.com/api/v1/predict-all", {
          cache: "no-store",
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch AQI data from backend");
        }
        
        const jsonData = await res.json();
        setData(jsonData);
        setError(null);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    // Fetch immediately on mount
    fetchAqiData();

    // Auto-refresh every 1.5 hours (90 * 60 * 1000 ms)
    const intervalId = setInterval(fetchAqiData, 90 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-medium animate-pulse">Establishing secure connection to FastAPI engine...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-50 p-8 flex items-center justify-center">
        <div className="text-center space-y-4 bg-zinc-900/50 p-8 rounded-2xl border border-rose-500/30 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-rose-500">Backend Connection Error</h1>
          <p className="text-slate-400">Could not connect to the FastAPI backend. Ensure uvicorn is running on port 8000.</p>
          <div className="mt-4 p-4 bg-black/50 rounded-lg border border-white/5 text-left text-sm text-rose-400 font-mono break-words max-w-xl overflow-auto">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Dashboard data={data} />
    </main>
  );
}
