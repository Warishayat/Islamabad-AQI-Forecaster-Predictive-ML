import { Dashboard } from "@/components/dashboard/Dashboard";
import { AutoRefresh } from "@/components/dashboard/AutoRefresh";
import { ApiResponse } from "@/types/dashboard";

async function getAqiData(): Promise<ApiResponse> {
  // Fetch live data from the FastAPI backend running locally
  // We use cache: 'no-store' to ensure we always get the freshest predictions
  const res = await fetch("http://127.0.0.1:8000/api/v1/predict-all", {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch AQI data from backend");
  }
  
  return res.json();
}

export default async function Home() {
  try {
    const data = await getAqiData();
    return (
      <main>
        <AutoRefresh intervalMs={90 * 60 * 1000} /> {/* 1.5 hours in milliseconds */}
        <Dashboard data={data} />
      </main>
    );
  } catch (error: any) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-50 p-8 flex items-center justify-center">
        <div className="text-center space-y-4 bg-zinc-900/50 p-8 rounded-2xl border border-rose-500/30 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-rose-500">Backend Connection Error</h1>
          <p className="text-slate-400">Could not connect to the FastAPI backend. Ensure uvicorn is running on port 8000.</p>
          <div className="mt-4 p-4 bg-black/50 rounded-lg border border-white/5 text-left text-sm text-rose-400 font-mono break-words max-w-xl overflow-auto">
            {error?.message || String(error)}
          </div>
        </div>
      </main>
    );
  }
}
