"use client";

import { Settings, Zap, RotateCcw } from "lucide-react";

export default function PaperTradingSetupPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <Settings className="h-6 w-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Paper Trading Setup</h1>
          <p className="text-sm text-slate-400">Manage your virtual account and margins.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border-2 border-slate-800 rounded-xl p-6 relative">
          <h3 className="text-xl font-bold text-white mb-2">Free Tier</h3>
          <p className="text-sm text-slate-400 mb-4 h-10">Start practicing with ₹1,00,000 virtual cash. Basic analytics included.</p>
          <div className="text-2xl font-extrabold text-white mb-6">₹0 <span className="text-sm text-slate-400 font-medium">/ forever</span></div>
          <button className="w-full bg-slate-800/50 text-slate-400 font-bold py-3 rounded-lg cursor-not-allowed">Current Plan</button>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-blue-500 rounded-xl p-6 relative shadow-md">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1"><Zap className="h-3 w-3"/> Recommended</div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">Pro Simulator</h3>
          <p className="text-sm text-blue-700 mb-4 h-10">₹10,00,000 virtual cash + Options Chain + Advanced P&L Analytics.</p>
          <div className="text-2xl font-extrabold text-blue-900 mb-6">₹49 <span className="text-sm text-blue-600 font-medium">/ month</span></div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg border border-slate-800">Upgrade to Pro</button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-red-900 flex items-center gap-2 mb-1"><RotateCcw className="h-5 w-5" /> Reset Virtual Account</h3>
          <p className="text-sm text-red-700">This will delete all your paper trade history, P&L, and reset your balance to the starting margin. This action cannot be undone.</p>
        </div>
        <button className="shrink-0 bg-[#111827] border border-red-300 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition">
          Reset Account
        </button>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-400">
        <strong>Note:</strong> Paper trading execution uses slight delays (1-3 seconds) to simulate real market conditions and slippage.
      </div>

    </div>
  );
}