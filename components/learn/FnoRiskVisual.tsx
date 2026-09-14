"use client";

import { AlertOctagon } from "lucide-react";

export default function FnoRiskVisual() {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6">
      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-red-500"/> F&O Risk Profile</h3>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-300">Option Buying</span>
            <span className="text-red-600">Risk: Limited to Premium</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-800/50">
            <div className="bg-green-500 w-1/4 flex items-center justify-center text-[10px] text-white font-bold">Win (33%)</div>
            <div className="bg-red-500 w-3/4 flex items-center justify-center text-[10px] text-white font-bold">Lose Premium (67%)</div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Low probability of winning, but maximum loss is limited to the money you invested.</p>
        </div>

        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-300">Option Selling (Writing)</span>
            <span className="text-red-600">Risk: Unlimited</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-slate-800/50">
            <div className="bg-green-500 w-2/3 flex items-center justify-center text-[10px] text-white font-bold">Win Small (67%)</div>
            <div className="bg-red-700 w-1/3 flex items-center justify-center text-[10px] text-white font-bold">Infinite Loss (33%)</div>
          </div>
          <p className="text-xs text-slate-400 mt-2">High probability of winning small amounts, but one wrong trade can wipe out your entire capital.</p>
        </div>
      </div>

    </div>
  );
}