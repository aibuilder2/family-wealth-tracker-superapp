"use client";

import { Target, TrendingUp, History } from "lucide-react";

export default function AccuracyTracker() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Win Rate</p>
        <div className="text-4xl font-extrabold text-indigo-600">68.5%</div>
        <p className="text-xs text-gray-400 mt-2">Last 90 Days</p>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Predictions</p>
        <div className="text-4xl font-extrabold text-white flex items-center gap-2"><History className="h-6 w-6 text-gray-400"/> 145</div>
      </div>
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Average Return</p>
        <div className="text-4xl font-extrabold text-green-600 flex items-center gap-2"><TrendingUp className="h-6 w-6"/> +2.4%</div>
        <p className="text-xs text-gray-400 mt-2">Per successful trade</p>
      </div>
    </div>
  );
}