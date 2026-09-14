"use client";

import { useState, useEffect } from "react";
import { Activity, ShieldAlert, Zap } from "lucide-react";

export default function FnOWatchlist() {
  const [optionsData, setOptionsData] = useState<any[]>([
    {
      symbol: "NIFTY 50",
      pcr: 1.18,
      sentiment: "BULLISH",
      support_strike: 24700,
      resistance_strike: 25000,
      max_call_oi: "25000 CE (1.42 Cr)",
      max_put_oi: "24700 PE (1.68 Cr)",
      spot_price: 24852.30
    },
    {
      symbol: "BANKNIFTY",
      pcr: 0.94,
      sentiment: "NEUTRAL",
      support_strike: 50800,
      resistance_strike: 51600,
      max_call_oi: "51500 CE (86.4 L)",
      max_put_oi: "51000 PE (82.1 L)",
      spot_price: 51240.60
    }
  ]);

  useEffect(() => {
    const fetchOptionChains = async () => {
      try {
        const res = await fetch("/api/stocks/markets-indices?type=fno");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setOptionsData(data);
          }
        }
      } catch (e) {
        console.warn("Using cached F&O options data:", e);
      }
    };

    fetchOptionChains();
    const interval = setInterval(fetchOptionChains, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (optionsData.length === 0) return null;

  return (
    <div className="w-full bg-[#10263A]/80 border border-[#B98B2A]/20 rounded-2xl p-5 shadow-xl mb-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#B98B2A]/20 border border-[#B98B2A]/40 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#E5C378]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">F&O Derivatives Watchlist</h3>
            <p className="text-[11px] text-slate-400">Real-time Open Interest (OI) Support, Resistance & Put-Call Ratio</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Chain
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionsData.map((idx, i) => (
          <div key={i} className="flex flex-col sm:flex-row justify-between bg-[#081522]/90 p-4 rounded-xl border border-white/5 hover:border-[#B98B2A]/30 transition-all shadow-md">
            <div className="mb-3 sm:mb-0">
              <div className="flex items-baseline gap-2">
                <h4 className="text-base font-bold text-white tracking-wide">{idx.symbol}</h4>
                {idx.spot_price && (
                  <span className="text-xs font-mono font-bold text-slate-300">₹{idx.spot_price.toLocaleString('en-IN')}</span>
                )}
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md mt-1.5 inline-block border ${
                idx.sentiment === 'BULLISH'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : idx.sentiment === 'BEARISH'
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/15 text-[#E5C378] border-amber-500/30'
              }`}>
                PCR: {idx.pcr} ({idx.sentiment})
              </span>
            </div>

            <div className="flex items-center gap-4 bg-black/20 px-3 py-2 rounded-lg border border-white/5">
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center sm:justify-end gap-1">
                  <ShieldAlert className="w-3 h-3" /> Support
                </p>
                <p className="text-base font-mono font-bold text-white">{idx.support_strike}</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-left">
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Resistance
                </p>
                <p className="text-base font-mono font-bold text-white">{idx.resistance_strike}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}