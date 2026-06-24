import { Predictions } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/Card";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PredictionsTimelineProps {
  currentAqi: number;
  predictions: Predictions;
}

export function PredictionsTimeline({ currentAqi, predictions }: PredictionsTimelineProps) {
  const steps = [
    { label: "+3 Hours Later", value: predictions.forecast_3h, note: "(Peak)" },
    { label: "+6 Hours Later", value: predictions.forecast_6h, note: "" },
    { label: "+12 Hours Later", value: predictions.forecast_12h, note: "(Drop)" },
    { label: "+24 Hours Later", value: predictions.forecast_24h, note: "(Baseline)" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step, index) => {
        const diff = step.value - currentAqi;
        let TrendIcon = Minus;
        let trendColor = "text-slate-400";
        
        if (diff > 5) {
          TrendIcon = TrendingUp;
          trendColor = "text-rose-400";
        } else if (diff < -5) {
          TrendIcon = TrendingDown;
          trendColor = "text-emerald-400";
        }

        return (
          <Card key={index} className="relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-5 flex flex-col justify-between h-full min-h-[120px] relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                  <Clock className="w-3.5 h-3.5 text-indigo-400/70 group-hover:text-indigo-400 transition-colors" />
                  {step.label}
                </span>
                <div className={`p-1.5 rounded-full bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.06] transition-colors`}>
                  <TrendIcon className={`w-4 h-4 ${trendColor} transition-transform duration-500 group-hover:scale-110`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter">{step.value.toFixed(1)}</span>
                {step.note && (
                  <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">{step.note}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
