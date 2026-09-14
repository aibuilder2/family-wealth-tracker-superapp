"use client";

import { BarChart3 } from "lucide-react";
import IndicatorOverlay from "@/components/charts/IndicatorOverlay";
import SupportResistanceLine from "@/components/charts/SupportResistanceLine";
import BreakoutMarker from "@/components/charts/BreakoutMarker";

export default function CandlestickChart({ symbol }: { symbol?: string }) {
  return (
    <div className="w-full bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b flex justify-between items-center bg-[#0B0F19]">
        <h3 className="font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" /> 
          {symbol ? `${symbol} Interactive Chart` : "Interactive Chart"}
        </h3>
        <div className="flex gap-2">
          <select className="text-xs border rounded p-1 outline-none"><option>1D</option><option>1W</option><option>1M</option></select>
          <select className="text-xs border rounded p-1 outline-none"><option>Candles</option><option>Line</option></select>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 relative">
        {/* Placeholder for Lightweight Charts / TradingView widget */}
        <IndicatorOverlay name="EMA (20)" value="₹145.20" />
        <div className="flex gap-1 items-end h-32 opacity-20">
          <div className="w-4 bg-green-500 h-16"></div><div className="w-4 bg-red-500 h-24"></div><div className="w-4 bg-green-500 h-12"></div><div className="w-4 bg-green-500 h-20"></div><div className="w-4 bg-red-500 h-10"></div>
          <div className="absolute bottom-10 left-1/2">
            <BreakoutMarker type="up" />
          </div>
        </div>
        <div className="w-full absolute bottom-10 px-4">
           <SupportResistanceLine label="Support" type="support" />
        </div>
        <p className="text-sm font-medium text-slate-400 mt-4 absolute">Chart library will render here</p>
      </div>
    </div>
  );
}