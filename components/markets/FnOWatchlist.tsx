"use client";

import { useState, useEffect } from "react";
import { Activity, ShieldAlert, Zap } from "lucide-react";

export default function FnOWatchlist() {
  const [optionsData, setOptionsData] = useState<any[]>([]);
  const indices = ["NIFTY", "BANKNIFTY"];

  useEffect(() => {
    const fetchOptionChains = async () => {
      const dataList = [];
      for (let idx of indices) {
        try {
          const res = await fetch(`http://localhost:8000/options/chain/${idx}`);
          const data = await res.json();
          if (!data.error) dataList.push(data);
        } catch (e) {
          console.error(e);
        }
      }
      setOptionsData(dataList);
    };

    fetchOptionChains();
    const interval = setInterval(fetchOptionChains, 5 * 60 * 1000); // Refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  if (optionsData.length === 0) return null;

  return (
    <div className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-4 shadow-lg mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">F&O Options Live Watchlist</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionsData.map((idx, i) => (
          <div key={i} className="flex flex-col sm:flex-row justify-between bg-[#0B0F19] p-4 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="mb-3 sm:mb-0">
              <h4 className="text-lg font-black text-white">{idx.symbol}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${idx.sentiment === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400' : idx.sentiment === 'BEARISH' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                PCR: {idx.pcr} ({idx.sentiment})
              </span>
            </div>
            <div className="flex gap-4">
              <div className="text-center sm:text-right">
                <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1 flex items-center justify-center sm:justify-end gap-1"><ShieldAlert className="w-3 h-3"/> Support</p>
                <p className="text-lg font-mono font-bold text-white">{idx.support_strike}</p>
              </div>
              <div className="w-px bg-slate-800"></div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-rose-400 font-bold uppercase mb-1 flex items-center justify-center sm:justify-start gap-1"><Activity className="w-3 h-3"/> Resistance</p>
                <p className="text-lg font-mono font-bold text-white">{idx.resistance_strike}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}