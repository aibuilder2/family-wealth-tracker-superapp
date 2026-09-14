"use client";

import { AlertOctagon, TrendingUp, ShieldAlert, ArrowRight, Skull } from "lucide-react";
import Link from "next/link";
import WealthRealitySimulator from "@/components/learn/WealthRealitySimulator";

export default function FnoOverviewPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <AlertOctagon className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/50">
            Advanced Trading Module
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Futures & Options (F&O)</h1>
          <p className="text-red-100 text-lg max-w-2xl">
            Derivatives trading is the most complex, highly leveraged, and riskiest segment of the stock market. Learn how it works, and more importantly, why most people should stay away.
          </p>
        </div>
      </div>

      {/* SEBI Warning Banner */}
      <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-lg border border-slate-800 flex items-start gap-4">
        <Skull className="h-8 w-8 text-red-600 shrink-0" />
        <div>
          <h3 className="font-bold text-red-900 text-lg mb-1">Official SEBI Warning</h3>
          <p className="text-red-800 font-medium">9 out of 10 individual traders in equity Futures and Options Segment incur net losses.</p>
          <p className="text-sm text-red-700 mt-2">On average, loss makers register net trading losses close to ₹50,000. Over and above these net trading losses, traders incur an additional 28% of net trading losses as transaction costs.</p>
        </div>
      </div>

      <WealthRealitySimulator />

      {/* What are Derivatives */}
      <div className="bg-[#111827] border rounded-xl p-6 md:p-8 shadow-lg border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-4">What are Derivatives?</h2>
        <p className="text-slate-400 mb-6 leading-relaxed">
          A derivative is a financial contract whose value is derived from the performance of underlying assets (like a stock, index, or commodity). In F&O, you don't buy the actual share; you buy a contract to buy/sell the share at a future date.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B0F19] border rounded-lg p-5 border-l-4 border-l-blue-500">
            <h3 className="font-bold text-lg mb-2">Futures</h3>
            <p className="text-sm text-slate-400 mb-4">An obligation to buy or sell an asset at a predetermined price at a specified time in the future.</p>
            <Link href="/learn/fno/futures" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">Learn Futures <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="bg-[#0B0F19] border rounded-lg p-5 border-l-4 border-l-purple-500">
            <h3 className="font-bold text-lg mb-2">Options</h3>
            <p className="text-sm text-slate-400 mb-4">The right, but not the obligation, to buy (Call) or sell (Put) an asset at a specific price on/before a certain date.</p>
            <Link href="/learn/fno/options" className="text-purple-600 font-bold text-sm hover:underline flex items-center gap-1">Learn Options <ArrowRight className="h-4 w-4"/></Link>
          </div>
        </div>
      </div>

      {/* Why do people trade it? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><TrendingUp className="h-6 w-6 text-green-500"/> Why People Trade F&O</h3>
          <ul className="space-y-4">
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Leverage:</strong> Control ₹5 Lakhs worth of shares with just ₹1 Lakh margin.</p></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Short Selling:</strong> Easily profit from falling markets by holding short positions overnight.</p></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Hedging:</strong> Protect a large long-term portfolio against short-term crashes.</p></li>
          </ul>
        </div>
        
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><ShieldAlert className="h-6 w-6 text-red-500"/> The Hidden Dangers</h3>
          <ul className="space-y-4">
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Time Decay:</strong> Options lose value every day simply because time passes (Theta decay).</p></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Unlimited Risk:</strong> Option sellers (writers) face theoretically infinite loss potential.</p></li>
            <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div><p className="text-sm text-slate-300"><strong>Zero-Sum Game:</strong> For every ₹1 you win, someone else loses ₹1 (minus broker fees).</p></li>
          </ul>
        </div>
      </div>

      {/* Navigation to modules */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/learn/fno/risks" className="flex-1 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold flex items-center justify-between transition">
          Read Detailed Risk Analysis <ArrowRight className="h-5 w-5" />
        </Link>
        <Link href="/paper-trading" className="flex-1 bg-gray-900 hover:bg-black text-white p-4 rounded-xl font-bold flex items-center justify-between transition">
          Practice safely in Paper Trading <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

    </div>
  );
}