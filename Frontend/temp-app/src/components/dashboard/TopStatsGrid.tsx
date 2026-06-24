import { CurrentData } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Thermometer, Droplets, Wind, Gauge, Activity } from "lucide-react";

interface TopStatsGridProps {
  data: CurrentData;
}

export function TopStatsGrid({ data }: TopStatsGridProps) {
  
  const getAqiStatus = (pm25: number) => {
    if (pm25 <= 12) return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
    if (pm25 <= 35.4) return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" };
    return { label: "Unhealthy", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" };
  };

  const aqi = getAqiStatus(data.pm2_5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Hero Card - Spans 2 columns on large screens to emphasize it */}
      <Card className="lg:col-span-2 bg-zinc-900/80 border-slate-700/50 relative overflow-hidden group">
        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-zinc-900/50 z-0 transition-opacity duration-500`} />
        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Current AQI (PM2.5)
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-5xl font-bold tracking-tight text-white mb-2">
                {data.pm2_5.toFixed(1)}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${aqi.color} ${aqi.bg} ${aqi.border}`}>
                {aqi.label}
              </span>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${aqi.bg} ${aqi.border} border`}>
              <Activity className={`w-8 h-8 ${aqi.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.temperature.toFixed(1)}°C</div>
        </CardContent>
      </Card>

      {/* Humidity Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            Relative Humidity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.humidity}%</div>
        </CardContent>
      </Card>

      {/* Wind Speed Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400" />
            Wind Speed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.wind_speed.toFixed(1)} <span className="text-lg text-slate-500 font-normal">km/h</span></div>
        </CardContent>
      </Card>

      {/* Pressure Card (Moves to next row on lg, or can be adjusted depending on columns) */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-400" />
            Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.pressure.toFixed(1)} <span className="text-lg text-slate-500 font-normal">hPa</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
