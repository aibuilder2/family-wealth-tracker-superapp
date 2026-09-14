"use client";

import { ArrowRightLeft } from "lucide-react";

interface InvestmentCompareProps {
  assetA: { name: string; returns: string; risk: string; liquidity: string };
  assetB: { name: string; returns: string; risk: string; liquidity: string };
}

export default function InvestmentCompare({ assetA, assetB }: InvestmentCompareProps) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6 flex flex-col md:flex-row items-center gap-6 justify-center">
      <div className="flex-1 bg-[#0B0F19] p-5 rounded-lg border w-full text-center">
        <h3 className="font-bold text-lg text-white mb-2">{assetA.name}</h3>
        <div className="text-sm text-slate-400 space-y-1">
          <p>Returns: <strong className="text-white">{assetA.returns}</strong></p><p>Risk: <strong className="text-white">{assetA.risk}</strong></p><p>Liquidity: <strong className="text-white">{assetA.liquidity}</strong></p>
        </div>
      </div>
      <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0"><ArrowRightLeft className="h-6 w-6" /></div>
      <div className="flex-1 bg-[#0B0F19] p-5 rounded-lg border w-full text-center">
        <h3 className="font-bold text-lg text-white mb-2">{assetB.name}</h3>
        <div className="text-sm text-slate-400 space-y-1">
          <p>Returns: <strong className="text-white">{assetB.returns}</strong></p><p>Risk: <strong className="text-white">{assetB.risk}</strong></p><p>Liquidity: <strong className="text-white">{assetB.liquidity}</strong></p>
        </div>
      </div>
    </div>
  );
}