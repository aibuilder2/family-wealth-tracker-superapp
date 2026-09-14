"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function HoldingsTable() {
  const holdings = [
    { symbol: "RELIANCE", qty: 50, avgPrice: 2450.00, ltp: 2850.50, pnl: 20025.00, pnlPct: 16.3 },
    { symbol: "TCS", qty: 25, avgPrice: 3800.00, ltp: 3750.20, pnl: -1245.00, pnlPct: -1.3 },
    { symbol: "HDFCBANK", qty: 100, avgPrice: 1550.00, ltp: 1680.00, pnl: 13000.00, pnlPct: 8.4 },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden w-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0B0F19] border-b">
          <tr>
            <th className="px-4 py-3 font-bold text-slate-400">Symbol</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">Qty</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">Avg. Price</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">LTP</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">P&L</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {holdings.map((h, i) => (
            <tr key={i} className="hover:bg-[#0B0F19]">
              <td className="px-4 py-3 font-bold text-white">{h.symbol}</td>
              <td className="px-4 py-3 text-right">{h.qty}</td>
              <td className="px-4 py-3 text-right">₹{h.avgPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">₹{h.ltp.toFixed(2)}</td>
              <td className={`px-4 py-3 text-right font-bold ${h.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                {h.pnl >= 0 ? "+" : ""}₹{h.pnl.toFixed(2)} <span className="block text-[10px] opacity-80">{h.pnl >= 0 ? "+" : ""}{h.pnlPct}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}