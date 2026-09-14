"use client";

import { ArrowRightLeft, Activity } from "lucide-react";
import { useState } from "react";

export default function TradeExecutionPage() {
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-900 rounded-lg">
          <ArrowRightLeft className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Virtual Order Entry</h1>
          <p className="text-sm text-slate-400">Execute paper trades instantly with live market data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2 bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">Search Instrument (Equity / F&O)</label>
            <input type="text" placeholder="e.g. RELIANCE, NIFTY 23MAY 22500 CE" className="w-full border border-slate-700 rounded-lg p-3 uppercase focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-lg mb-6">
            <button onClick={() => setTradeType("BUY")} className={`flex-1 py-2 text-sm font-bold rounded-md transition ${tradeType === "BUY" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>BUY</button>
            <button onClick={() => setTradeType("SELL")} className={`flex-1 py-2 text-sm font-bold rounded-md transition ${tradeType === "SELL" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>SELL</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Quantity</label>
              <input type="number" defaultValue="1" className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Order Type</label>
              <select value={orderType} onChange={(e) => setOrderType(e.target.value as any)} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-[#111827]">
                <option value="MARKET">Market</option>
                <option value="LIMIT">Limit</option>
              </select>
            </div>
          </div>

          <button className={`w-full text-white font-bold py-4 rounded-lg text-lg transition shadow-md ${tradeType === "BUY" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}>
            {tradeType} ORDER
          </button>
        </div>

        {/* Market Data Panel */}
        <div className="bg-[#0B0F19] border rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Activity className="h-10 w-10 text-gray-400 mb-3" />
          <h3 className="font-bold text-white">Live Quote</h3>
          <p className="text-sm text-slate-400 mt-2">Search for a stock on the left to see live bid/ask prices and margin requirements here.</p>
        </div>

      </div>
    </div>
  );
}