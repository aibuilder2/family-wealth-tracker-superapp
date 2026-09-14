"use client";

import { Crosshair } from "lucide-react";

export default function PatternCard({ pattern = "Double Bottom", type = "bullish" }) {
  const isBull = type === "bullish";
  
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 w-full flex items-start gap-4">
      <div className={`p-3 rounded-lg ${isBull ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        <Crosshair className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-white">{pattern} Detected</h3>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isBull ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{type}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">This pattern usually indicates a strong trend reversal. Historical accuracy for this stock is 68%.</p>
      </div>
    </div>
  );
}