import { Card, CardContent } from "@/components/ui/Card";
import { Sparkles, AlertTriangle, Info } from "lucide-react";
import { ApiResponse } from "@/types/dashboard";

interface HealthAdvisoryPanelProps {
  data: ApiResponse;
}

export function HealthAdvisoryPanel({ data }: HealthAdvisoryPanelProps) {
  const peakAqi = Math.max(
    data.current_data.pm2_5,
    data.predictions.forecast_3h,
    data.predictions.forecast_6h,
    data.predictions.forecast_12h,
    data.predictions.forecast_24h
  );

  const isHighTemp = data.current_data.temperature > 35;
  const isHighPollution = peakAqi > 50;

  return (
    <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-zinc-900/80 mt-6 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <CardContent className="p-6 relative z-10 flex flex-col md:flex-row gap-5 items-start">
        <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30 shrink-0">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-semibold text-indigo-300 tracking-wide uppercase flex items-center gap-2">
            AI Health & Context Advisory
          </h4>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            Air quality is expected to peak at <strong>{peakAqi.toFixed(1)}</strong> PM2.5 in the coming hours. 
            {isHighTemp && isHighPollution ? (
              <span> Sensitive groups should avoid extended outdoor activities around {data.city} during high-temperature windows, as {data.current_data.temperature}°C heat exacerbates pollution effects.</span>
            ) : (
              <span> Conditions are generally stable, but standard precautions are advised for sensitive individuals in {data.city}.</span>
            )}
          </p>
        </div>

        {isHighTemp && (
          <div className="hidden lg:flex shrink-0 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-md items-center gap-2 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            Extreme Heat Alert
          </div>
        )}
      </CardContent>
    </Card>
  );
}
