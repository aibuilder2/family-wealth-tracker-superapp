"use client";

import { PieChart, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function PaperPortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <PieChart className="h-6 w-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Virtual Holdings</h1>
          <p className="text-sm text-slate-400">Track your open positions and paper trading returns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400 font-medium mb-1">Available Margin</p>
          <h3 className="text-2xl font-bold text-white">₹5,00,000.00</h3>
        </div>
        <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800">
          <p className="text-sm text-slate-400 font-medium mb-1">Used Margin</p>
          <h3 className="text-2xl font-bold text-white">₹0.00</h3>
        </div>
        <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800 border-l-4 border-l-gray-400">
          <p className="text-sm text-slate-400 font-medium mb-1">Unrealized P&L</p>
          <h3 className="text-2xl font-bold text-gray-400">₹0.00</h3>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-400">Instrument</th>
              <th className="px-6 py-3 font-medium text-slate-400">Qty</th>
              <th className="px-6 py-3 font-medium text-slate-400">Avg. Price</th>
              <th className="px-6 py-3 font-medium text-slate-400">LTP</th>
              <th className="px-6 py-3 font-medium text-slate-400 text-right">P&L</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No open positions. <Link href="/paper-trading/trade" className="text-indigo-600 font-bold hover:underline">Place a trade</Link> to see it here.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}