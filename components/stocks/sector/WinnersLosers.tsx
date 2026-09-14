"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function WinnersLosers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800">
        <h3 className="font-bold text-green-700 flex items-center gap-2 mb-4 border-b pb-2"><TrendingUp className="h-5 w-5"/> Top Gainers</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center"><span className="font-bold text-white">TCS</span><span className="text-green-600 font-medium">+3.4%</span></div>
          <div className="flex justify-between items-center"><span className="font-bold text-white">INFY</span><span className="text-green-600 font-medium">+2.1%</span></div>
        </div>
      </div>
      <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800">
        <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4 border-b pb-2"><TrendingDown className="h-5 w-5"/> Top Losers</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center"><span className="font-bold text-white">WIPRO</span><span className="text-red-600 font-medium">-1.8%</span></div>
          <div className="flex justify-between items-center"><span className="font-bold text-white">HCLTECH</span><span className="text-red-600 font-medium">-0.9%</span></div>
        </div>
      </div>
    </div>
  );
}