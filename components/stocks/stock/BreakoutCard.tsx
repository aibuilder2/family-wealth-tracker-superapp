"use client";

import { Rocket } from "lucide-react";

export default function BreakoutCard({ type = "bullish", target = 0 }) {
  const isBull = type === "bullish";
  return (
    <div className={`border rounded-xl p-5 shadow-lg border border-slate-800 flex items-start gap-4 ${isBull ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <div className={`p-3 rounded-full ${isBull ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
        <Rocket className={`h-6 w-6 ${isBull ? "" : "rotate-180"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-lg mb-1 ${isBull ? "text-green-900" : "text-red-900"}`}>
          {isBull ? "Bullish Breakout Detected" : "Bearish Breakdown Detected"}
        </h3>
        <p className={`text-sm ${isBull ? "text-green-800" : "text-red-800"}`}>Price has crossed key resistance levels with high volume.</p>
        {target > 0 && <div className={`mt-3 inline-block px-3 py-1 rounded font-bold text-xs ${isBull ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>Estimated Target: ₹{target}</div>}
      </div>
    </div>
  );
}