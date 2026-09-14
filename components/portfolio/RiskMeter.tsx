"use client";

import { ShieldCheck } from "lucide-react";

export default function RiskMeter({ score = 65 }: { score?: number }) {
  return (
    <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-500"/> Portfolio Risk Profile</h3>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3 relative">
        <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 h-3 rounded-full" style={{ width: '100%' }}></div>
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#111827] border-2 border-gray-900 rounded-full shadow transition-all" 
          style={{ left: `calc(${score}% - 8px)` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs font-bold text-slate-400">
        <span>Conservative</span>
        <span>Balanced</span>
        <span className="text-red-600">Aggressive</span>
      </div>
    </div>
  );
}