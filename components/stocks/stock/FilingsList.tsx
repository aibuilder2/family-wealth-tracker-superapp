"use client";

import { FileText, Download } from "lucide-react";

export default function FilingsList({ symbol }: { symbol: string }) {
  const filings = [
    { id: 1, type: "Financial Results", title: "Quarterly Results for Q4", date: "2024-05-10" },
    { id: 2, type: "Board Meeting", title: "Intimation of Board Meeting for Dividend", date: "2024-05-02" },
    { id: 3, type: "Corporate Action", title: "Declaration of Final Dividend", date: "2024-04-20" },
  ];

  return (
    <div className="space-y-4 w-full">
      {filings.map((filing) => (
        <div key={filing.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-[#111827] shadow-lg border border-slate-800 hover:shadow-md transition gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{filing.type}</span>
              <span className="text-xs text-slate-400">{filing.date}</span>
            </div>
            <div className="text-sm font-semibold text-slate-100">{filing.title}</div>
          </div>
          <div className="shrink-0">
            <button className="flex items-center gap-1 text-sm bg-[#0B0F19] border px-3 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 font-medium transition">
              <Download className="h-4 w-4 text-slate-400" /> PDF
            </button>
          </div>
        </div>
      ))}
      <button className="w-full py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition">Load More Filings</button>
    </div>
  );
}