import { CurrentData } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Thermometer, Droplets, Wind, Gauge, Activity } from "lucide-react";

interface TopStatsGridProps {
  data: CurrentData;
}

export function TopStatsGrid({ data }: TopStatsGridProps) {
  // Determine AQI status and color based on PM2.5 (simplified logic)
  const getAqiStatus = (pm25: number) => {
    if (pm25 <= 12) return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]" };
    if (pm25 <= 35.4) return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", shadow: "shadow-[0_0_20px_rgba(251,191,36,0.2)]" };
    return { label: "Unhealthy", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]" };
  };

  const aqi = getAqiStatus(data.pm2_5);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
      {/* Hero Card - Spans 2 cols & 2 rows in bento grid */}
      <Card className={`col-span-2 row-span-2 flex flex-col justify-between overflow-hidden relative group border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent ${aqi.shadow}`}>
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[80px] opacity-40 transition-opacity duration-700 group-hover:opacity-70 ${aqi.bg.replace('/10', '')}`} />
        
        <CardHeader className="relative z-10 pb-0">
          <CardTitle className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            Current AQI
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 mt-auto pt-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-7xl font-black tracking-tighter text-white mb-3">
                {Math.round(data.aqi)}
              </div>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${aqi.color} ${aqi.bg} ${aqi.border}`}>
                {aqi.label}
              </span>
            </div>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${aqi.bg} ${aqi.border} border backdrop-blur-xl rotate-3 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
              <Activity className={`w-10 h-10 ${aqi.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Card */}
      <Card className="flex flex-col justify-center">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">{data.temperature.toFixed(1)}<span className="text-xl text-slate-500 font-normal ml-1">°C</span></div>
        </CardContent>
      </Card>

      {/* Humidity Card */}
      <Card className="flex flex-col justify-center">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            Humidity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">{data.humidity}<span className="text-xl text-slate-500 font-normal ml-1">%</span></div>
        </CardContent>
      </Card>

      {/* Wind Speed Card */}
      <Card className="flex flex-col justify-center">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400" />
            Wind
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">{data.wind_speed.toFixed(1)} <span className="text-sm text-slate-500 font-normal tracking-wide">km/h</span></div>
        </CardContent>
      </Card>

      {/* Pressure Card */}
      <Card className="flex flex-col justify-center">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" />
            Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">{data.pressure.toFixed(1)} <span className="text-sm text-slate-500 font-normal tracking-wide">hPa</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
