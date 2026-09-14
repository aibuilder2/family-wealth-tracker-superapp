"use client";

import { Layers } from "lucide-react";

export default function SupportResistanceCard() {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 w-full">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b pb-2"><Layers className="h-5 w-5 text-indigo-500"/> Key S/R Levels</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">Resistance Zones</p>
          <div className="flex gap-2"><span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-100">R2: ₹3100</span><span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-100">R1: ₹2950</span></div>
        </div>
        <div className="flex items-center gap-2 w-full my-2">
          <div className="h-px bg-gray-300 flex-1 border-dashed border-b"></div><span className="text-xs font-bold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">CMP: ₹2850</span><div className="h-px bg-gray-300 flex-1 border-dashed border-b"></div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1">Support Zones</p>
          <div className="flex gap-2"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">S1: ₹2780</span><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-100">S2: ₹2650</span></div>
        </div>
      </div>
    </div>
  );
}