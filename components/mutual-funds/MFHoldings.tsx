"use client";

import { PieChart } from "lucide-react";
import type { MFHolding } from "@/types/mutual-fund";

interface MFHoldingsProps {
  schemeCode: string;
  holdings?: MFHolding[];
}

export default function MFHoldings({ schemeCode, holdings = [] }: MFHoldingsProps) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-[#0B0F19]">
        <h3 className="font-bold text-white flex items-center gap-2"><PieChart className="h-5 w-5 text-blue-600"/> Top 10 Holdings</h3>
        <span className="text-xs text-slate-400">Updated Recently</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] text-slate-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Stock / Company</th>
              <th className="px-4 py-3 text-right">Holding (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {holdings.map((h, i) => (
              <tr key={i} className="hover:bg-[#0B0F19]">
                <td className="px-4 py-3 font-medium text-white">{h.companyName} <span className="text-[10px] text-slate-400 bg-slate-800/50 px-1 rounded ml-1">{h.stockSymbol}</span></td>
                <td className="px-4 py-3 text-right font-bold">{h.holdingPct}%</td>
              </tr>
            ))}
            {holdings.length === 0 && <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400">No holdings data available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}