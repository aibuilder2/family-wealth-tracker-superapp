"use client";

import type { MutualFund } from "@/types/mutual-fund";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MFCard({ fund }: { fund: MutualFund }) {
  const riskColors = {
    low: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white text-lg leading-tight mb-1">{fund.schemeName}</h3>
          <p className="text-xs font-medium text-slate-400">{fund.fundHouse} • {fund.category}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${riskColors[fund.riskLevel]}`}>{fund.riskLevel} RISK</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-5 border-y py-3">
        <div><p className="text-xs text-slate-400 mb-1">NAV</p><p className="font-bold">₹{fund.nav.toFixed(2)}</p></div>
        <div><p className="text-xs text-slate-400 mb-1">3Y Return</p><p className="font-bold text-green-600">+{fund.returns3y.toFixed(2)}%</p></div>
        <div><p className="text-xs text-slate-400 mb-1">AUM</p><p className="font-bold">₹{fund.aum}Cr</p></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">Exp. Ratio: <span className="font-semibold text-white">{fund.expenseRatio}%</span></div>
        <Link href={`/mutual-funds/${fund.schemeCode}`} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition">Analyze <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}