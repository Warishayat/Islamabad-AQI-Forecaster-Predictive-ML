import { ApiResponse } from "@/types/dashboard";
import { TopStatsGrid } from "./TopStatsGrid";
import { ForecastGraph } from "./ForecastGraph";
import { PredictionsTimeline } from "./PredictionsTimeline";
import { HealthAdvisoryPanel } from "./HealthAdvisoryPanel";
import { MapPin, CalendarClock } from "lucide-react";

interface DashboardProps {
  data: ApiResponse;
}

export function Dashboard({ data }: DashboardProps) {
  const formattedDate = new Date(data.timestamp).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#030712] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-slate-50 p-4 md:p-8 lg:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        
        {/* Glow behind the header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 flex items-center gap-3">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-indigo-400 shrink-0" />
              {data.city} Air Quality
            </h1>
            <p className="text-slate-400 text-sm md:text-base flex items-center gap-2 pl-1 font-medium">
              <CalendarClock className="w-4 h-4 text-slate-500" />
              Last updated: {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Feed Active
          </div>
        </header>

        {/* Predictions Timeline Grid (Moved above Graph) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Predictions Timeline</h2>
          <PredictionsTimeline currentAqi={data.current_data.pm2_5} predictions={data.predictions} />
        </section>

        {/* Middle Section: Graph */}
        <section className="w-full">
          <ForecastGraph data={data} />
        </section>

        {/* Top Metrics Bento Grid (Live Data - Moved below Graph) */}
        <section className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Current Live Data</h2>
          <TopStatsGrid data={data.current_data} />
        </section>

        {/* AI Advisory Panel */}
        <section>
          <HealthAdvisoryPanel data={data} />
        </section>

      </div>
    </div>
  );
}
