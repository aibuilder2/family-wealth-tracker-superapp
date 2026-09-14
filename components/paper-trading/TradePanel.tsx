"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";

interface TradePanelProps {
  onTrade?: (symbol: string, type: "buy" | "sell", qty: number, price: number) => Promise<any>;
}

export default function TradePanel({ onTrade }: TradePanelProps) {
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(100);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!symbol) return;
    if (onTrade) {
      setSubmitting(true);
      try {
        await onTrade(symbol.toUpperCase(), type.toLowerCase() as "buy" | "sell", qty, price);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <ArrowRightLeft className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-white">Virtual Order Entry</h3>
      </div>

      <div className="flex bg-slate-800/50 p-1 rounded-lg mb-4">
        <button onClick={() => setType("BUY")} className={`flex-1 py-1.5 text-sm font-bold rounded transition ${type === "BUY" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>BUY</button>
        <button onClick={() => setType("SELL")} className={`flex-1 py-1.5 text-sm font-bold rounded transition ${type === "SELL" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>SELL</button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Symbol</label>
          <input 
            type="text" 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)} 
            placeholder="e.g. RELIANCE" 
            className="w-full border rounded-lg p-2 uppercase text-sm outline-none focus:border-blue-500 bg-[#0B0F19]" 
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Quantity</label>
            <input 
              type="number" 
              value={qty} 
              onChange={(e) => setQty(Number(e.target.value))} 
              className="w-full border rounded-lg p-2 text-sm outline-none focus:border-blue-500 bg-[#0B0F19]" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Order Type</label>
            <select className="w-full border rounded-lg p-2 text-sm outline-none bg-[#0B0F19] focus:border-blue-500">
              <option>Market</option>
              <option>Limit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#0B0F19] p-3 rounded-lg mb-4 text-xs flex justify-between text-slate-400 border">
        <span>Est. Value:</span> <strong className="text-white">₹{(qty * price).toLocaleString("en-IN")}</strong>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={submitting || !symbol}
        className={`w-full py-3 rounded-lg font-bold text-white transition ${type === "BUY" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} disabled:opacity-50`}
      >
        {submitting ? "Placing..." : `${type} ORDER`}
      </button>
    </div>
  );
}