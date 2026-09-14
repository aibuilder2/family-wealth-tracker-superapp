"use client";

import { BookOpen, LineChart, Activity, Crosshair } from "lucide-react";

export default function LearnTechnicalPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Deep Dive Module
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Technical Analysis</h1>
        <p className="text-purple-100 text-lg max-w-3xl">
          The art of reading price charts, understanding market psychology, and identifying trends using historical price and volume data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <LineChart className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Price Action</h3>
          <p className="text-slate-400 text-sm">Focusing purely on raw price movements, support/resistance zones, and trendlines without using indicators.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Activity className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Indicators</h3>
          <p className="text-slate-400 text-sm">Mathematical calculations like RSI, MACD, and Moving Averages used to confirm trends and momentum.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Crosshair className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Chart Patterns</h3>
          <p className="text-slate-400 text-sm">Recognizing psychological setups like Head & Shoulders, Triangles, and Double Bottoms for trade entries.</p>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 border-b pb-4">The 3 Core Principles of Technical Analysis</h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-white text-lg">1. Market discounts everything</h4>
            <p className="text-slate-400 mt-1 text-sm">All fundamental information, news, and market psychology are already reflected in the stock's current price.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">2. Prices move in trends</h4>
            <p className="text-slate-400 mt-1 text-sm">A stock price in motion is more likely to continue in that same direction (Uptrend, Downtrend, or Sideways) than to reverse.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">3. History tends to repeat itself</h4>
            <p className="text-slate-400 mt-1 text-sm">Because human psychology (fear and greed) remains constant, price patterns seen in the past often repeat in the future.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border text-sm text-slate-400">
        <strong>Pro Tip:</strong> Technical analysis tells you <span className="text-blue-600 font-bold">WHEN</span> to buy or sell, 
        while Fundamental analysis tells you <span className="text-blue-600 font-bold">WHAT</span> to buy. Using both gives you the highest edge in the market.
      </div>

    </div>
  );
}