"use client";

import { PieChart, TrendingUp, TrendingDown } from "lucide-react";
import type { PaperHolding } from "@/types/paper-trading";

interface VirtualPortfolioProps {
  holdings: PaperHolding[];
}

export default function VirtualPortfolio({ holdings }: VirtualPortfolioProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-[#0B0F19] border border-dashed rounded-xl p-8 text-center text-slate-400">
        <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No active virtual positions. Start trading to build your portfolio!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden w-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0B0F19] border-b">
          <tr>
            <th className="px-4 py-3 font-bold text-slate-400">Symbol</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">Qty</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">Avg Price</th>
            <th className="px-4 py-3 font-bold text-slate-400 text-right">P&L</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {holdings.map((h, i) => (
            <tr key={i} className="hover:bg-[#0B0F19]">
              <td className="px-4 py-3 font-bold text-white">{h.symbol}</td>
              <td className="px-4 py-3 text-right">{h.quantity}</td>
              <td className="px-4 py-3 text-right">₹{h.avgPrice?.toFixed(2)}</td>
              <td className={`px-4 py-3 text-right font-bold flex items-center justify-end gap-1 ${h.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>{h.pnl >= 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>} ₹{h.pnl.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
