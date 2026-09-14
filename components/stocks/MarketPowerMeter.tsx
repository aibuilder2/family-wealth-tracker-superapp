"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getPythonBackendUrl } from "@/lib/api";

export default function MarketPowerMeter() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const normalizedData = useMemo(() => {
    if (!data) return null;

    const advances = Number(data.advances ?? 0);
    const declines = Number(data.declines ?? 0);
    const unchanged = Number(data.unchanged ?? 0);
    const total = Math.max(advances + declines + unchanged, 1);

    const bullPower = data.bullPower ?? Math.round((advances / total) * 100);
    const bearPower = data.bearPower ?? Math.round((declines / total) * 100);

    return {
      ...data,
      advances,
      declines,
      unchanged,
      bullPower,
      bearPower,
      shiftSignal:
        data.shiftSignal ?? `${advances} adv / ${declines} decl / ${unchanged} unchanged`,
      trendStatus:
        data.trendStatus ??
        (bullPower > bearPower ? "Bullish" : bullPower < bearPower ? "Bearish" : "Neutral"),
      pullers:
        Array.isArray(data.pullers) && data.pullers.length > 0
          ? data.pullers
          : [
              { symbol: "ADV", change: advances },
              { symbol: "UNCH", change: unchanged },
            ],
      draggers:
        Array.isArray(data.draggers) && data.draggers.length > 0
          ? data.draggers
          : [{ symbol: "DECL", change: declines }],
    };
  }, [data]);

  useEffect(() => {
    // Yahan hum aage chalkar apne Python backend (FastAPI) ka real-time endpoint dalenge.
    // For now, we simulate the fetch response for the UI.
    const fetchMarketPower = async () => {
      try {
        const response = await fetch(getPythonBackendUrl("/api/market-power"));
        if (!response.ok) throw new Error("Backend connection failed");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load market power", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPower();
    // Har 3 minute mein refresh karne ke liye interval set kar sakte hain
    const interval = setInterval(fetchMarketPower, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !normalizedData) {
    return (
      <div className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 animate-pulse shadow-xl">
        <div className="h-6 w-48 bg-slate-700 rounded mb-6"></div>
        <div className="h-8 w-full bg-slate-700 rounded-full mb-6"></div>
        <div className="h-20 w-full bg-slate-700 rounded-xl mb-4"></div>
        <div className="h-20 w-full bg-slate-700 rounded-xl"></div>
      </div>
    );
  }

  const displayData = normalizedData;

  return (
    <div className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group">
      {/* Dynamic Background Glow based on Dominance */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[90px] opacity-20 pointer-events-none transition-all duration-1000 ${displayData.bullPower > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 relative z-10 gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            <Activity className="w-5 h-5 text-blue-400" />
            Bull vs Bear Power
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">{displayData.shiftSignal}</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold border tracking-wider uppercase ${displayData.bullPower > 50 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]'}`}>
          {displayData.trendStatus}
        </div>
      </div>

      {/* The Power Meter Bar */}
      <div className="relative h-10 w-full bg-[#0B0F19] rounded-full overflow-hidden flex mb-8 border border-slate-700/60 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 flex items-center pl-4 transition-all duration-1000 ease-out"
          style={{ width: `${displayData.bullPower}%` }}
        >
          <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">PULLERS {displayData.bullPower}%</span>
        </div>
        
        {/* Center Divider indicator */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/20 z-10 -translate-x-1/2 rounded-full"></div>
        
        <div 
          className="h-full bg-gradient-to-l from-rose-600 to-rose-400 flex items-center justify-end pr-4 transition-all duration-1000 ease-out"
          style={{ width: `${displayData.bearPower}%` }}
        >
          <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">{displayData.bearPower}% DRAGGERS</span>
        </div>
      </div>

      {/* Pullers & Draggers Section */}
      <div className="space-y-6 relative z-10">
        {/* PULLERS (Gainers) Row */}
        <div className="bg-[#0B0F19]/50 p-4 rounded-2xl border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Puller Indices (Driving Market Up)</h3>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-1">
            {displayData.pullers.map((stock: any, i: number) => (
              <div key={i} className="flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex flex-col items-center justify-center min-w-[110px] hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm">
                <span className="text-sm font-extrabold text-white mb-0.5">{stock.symbol}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{stock.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DRAGGERS (Losers) Row */}
        <div className="bg-[#0B0F19]/50 p-4 rounded-2xl border border-rose-500/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-rose-500/20 rounded-lg text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Dragger Indices (Pulling Market Down)</h3>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-1">
            {displayData.draggers.map((stock: any, i: number) => (
              <div key={i} className="flex-shrink-0 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2.5 flex flex-col items-center justify-center min-w-[110px] hover:bg-rose-500/20 transition-all cursor-pointer shadow-sm">
                <span className="text-sm font-extrabold text-white mb-0.5">{stock.symbol}</span>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">{stock.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}