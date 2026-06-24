"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ApiResponse } from "@/types/dashboard";

interface ForecastGraphProps {
  data: ApiResponse;
}

export function ForecastGraph({ data }: ForecastGraphProps) {
  const chartData = useMemo(() => {
    return [
      {
        time: "Current",
        aqi: data.current_data.pm2_5,
      },
      {
        time: "3 Hours",
        aqi: data.predictions.forecast_3h,
      },
      {
        time: "6 Hours",
        aqi: data.predictions.forecast_6h,
      },
      {
        time: "12 Hours",
        aqi: data.predictions.forecast_12h,
      },
      {
        time: "24 Hours",
        aqi: data.predictions.forecast_24h,
      },
    ];
  }, [data]);

  // Dynamic gradient colors based on max AQI
  const maxAqi = Math.max(...chartData.map(d => d.aqi));
  const gradientColor = maxAqi > 35 ? "#fbbf24" : "#34d399"; // Amber if moderate/unhealthy, else emerald

  return (
    <Card className="col-span-full overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-sm font-semibold tracking-wider text-slate-300 uppercase">AQI Forecast Trend (PM2.5)</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="h-[320px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ffffff" opacity={0.05} />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                dy={15}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                domain={['dataMin - 5', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(10, 15, 28, 0.8)", 
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5)"
                }}
                itemStyle={{ color: gradientColor, fontWeight: "900", fontSize: "16px" }}
                labelStyle={{ color: "#94a3b8", marginBottom: "6px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="aqi" 
                name="AQI (PM2.5)"
                stroke={gradientColor} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorAqi)" 
                activeDot={{ r: 6, fill: gradientColor, stroke: "#030712", strokeWidth: 3, style: { filter: `drop-shadow(0px 0px 8px ${gradientColor})` } }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
