"use client";

import { Target, TrendingUp, History } from "lucide-react";

export default function AccuracyTracker() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="bg-[#10263A]/85 backdrop-blur-md border border-[#B98B2A]/25 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B98B2A]/5 rounded-full blur-2xl group-hover:bg-[#B98B2A]/10 transition-colors pointer-events-none"></div>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-[#E5C378]" />
          Overall Win Rate
        </p>
        <div className="text-4xl font-black text-[#E5C378] font-mono tracking-tight">68.5%</div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">Last 90 Days Track Record</p>
      </div>

      <div className="bg-[#10263A]/85 backdrop-blur-md border border-white/10 hover:border-[#B98B2A]/30 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden transition-colors">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-400" />
          Total Predictions
        </p>
        <div className="text-4xl font-black text-white font-mono tracking-tight">145</div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">AI Algorithm Signals</p>
      </div>

      <div className="bg-[#10263A]/85 backdrop-blur-md border border-emerald-500/25 rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Average Return
        </p>
        <div className="text-4xl font-black text-emerald-400 font-mono tracking-tight">+2.4%</div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">Per successful trade target</p>
      </div>
    </div>
  );
}