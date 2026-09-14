"use client";

import { Lightbulb, AlertTriangle } from "lucide-react";

export default function PortfolioAIAnalysis() {
  return (
    <div className="space-y-4 w-full">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-lg border border-slate-800">
        <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> AI Warnings</h3>
        <ul className="space-y-2">
          <li className="text-sm text-orange-800 bg-[#111827]/60 p-2 rounded border border-orange-100"><strong>Sector Risk:</strong> You have 45% exposure to IT. Diversify to reduce risk.</li>
          <li className="text-sm text-orange-800 bg-[#111827]/60 p-2 rounded border border-orange-100"><strong>Overvaluation:</strong> 2 of your holdings have P/E &gt; 80.</li>
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-lg border border-slate-800">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><Lightbulb className="h-5 w-5"/> AI Suggestions</h3>
        <ul className="space-y-2">
          <li className="text-sm text-blue-800 bg-[#111827]/60 p-2 rounded border border-blue-100">Consider adding FMCG or Pharma stocks for defensive balance.</li>
          <li className="text-sm text-blue-800 bg-[#111827]/60 p-2 rounded border border-blue-100">Adding 5% to Sovereign Gold Bonds could provide inflation hedge.</li>
        </ul>
      </div>
    </div>
  );
}