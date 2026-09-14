"use client";

import { BrainCircuit, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function MFAIAnalysis({ schemeCode }: { schemeCode: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-[#111827] border border-indigo-500/20 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="h-5 w-5 text-indigo-400" />
        <h3 className="font-bold text-indigo-400">AI Fund Analysis</h3>
      </div>

      <div className="space-y-3">
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-indigo-500/20 flex gap-3 items-start">
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300"><strong>Consistent Outperformer:</strong> This fund has beaten its benchmark index in 4 out of the last 5 years.</p>
        </div>
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-indigo-500/20 flex gap-3 items-start">
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300"><strong>Low Expense Ratio:</strong> At 0.45%, it is cheaper than 80% of funds in its category.</p>
        </div>
        <div className="bg-[#0B0F19] p-3 rounded-lg border border-indigo-500/20 flex gap-3 items-start">
          <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300"><strong>High Sector Concentration:</strong> 35% of the AUM is heavily invested in the Financial sector.</p>
        </div>
      </div>
    </div>
  );
}