"use client";

import { Building2, Briefcase } from "lucide-react";

export default function SubsidiaryCard({ name, ownership, business, revenue }: { name: string, ownership: string, business: string, revenue: string }) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Building2 className="h-5 w-5"/></div>
          <div>
            <h4 className="font-bold text-white">{name}</h4>
            <p className="text-xs text-slate-400">{business}</p>
          </div>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">{ownership}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-300 bg-[#0B0F19] p-2 rounded-lg border">
        <Briefcase className="h-4 w-4 text-slate-400"/>
        Revenue Contribution: <strong className="text-white">{revenue}</strong>
      </div>
    </div>
  );
}
