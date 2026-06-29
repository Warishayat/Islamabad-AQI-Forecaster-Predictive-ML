import { Card, CardContent } from "@/components/ui/Card";
import { Sparkles, AlertTriangle } from "lucide-react";
import { ApiResponse } from "@/types/dashboard";

interface HealthAdvisoryPanelProps {
  data: ApiResponse;
}

export async function HealthAdvisoryPanel({ data }: HealthAdvisoryPanelProps) {
  const isHighTemp = data.current_data.temperature > 35;
  
  let summaryText = "Analyzing real-time meteorological conditions...";
  
  try {
    const res = await fetch("https://slamabad-aqi-forecaster.onrender.com/api/v1/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data.predictions),
      cache: "no-store"
    });
    
    if (res.ok) {
      const json = await res.json();
      summaryText = json.summary;
    }
  } catch (error) {
    console.error("Failed to generate AI summary", error);
    summaryText = "Failed to communicate with AI Summary service. Displaying fallback data.";
  }

  return (
    <Card className="border-indigo-500/50 bg-gradient-to-br from-indigo-950/40 via-[#0a0f1c] to-black mt-6 relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.15)] group">
      {/* Decorative gradient orb */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-1000" />
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-400 via-purple-400 to-transparent opacity-80" />
      
      <CardContent className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 items-start">
        <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/30 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
        </div>
        
        <div className="space-y-3 flex-1">
          <h4 className="text-xs font-bold text-indigo-300 tracking-widest uppercase flex items-center gap-2">
            AI Health & Context Advisory
          </h4>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base font-medium">
            {summaryText}
          </p>
        </div>

        {isHighTemp && (
          <div className="hidden lg:flex shrink-0 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-lg items-center gap-2.5 text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Extreme Heat Alert
          </div>
        )}
      </CardContent>
    </Card>
  );
}
