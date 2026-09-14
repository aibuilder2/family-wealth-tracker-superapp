"use client";

import { CheckCircle2, ShieldQuestion } from "lucide-react";

export default function NewsVerifier() {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6 w-full">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldQuestion className="h-5 w-5 text-blue-500"/> AI News Verifier</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0B0F19] p-4 rounded-lg border">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Media Rumor</span>
          <p className="text-sm font-medium text-white">"Company XYZ to acquire Startup ABC for $1B."</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2 block flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Verified via SEBI Filing</span>
          <p className="text-sm text-green-900">Official Exchange filing confirms the acquisition at $950M. Rumor is largely accurate.</p>
        </div>
      </div>
    </div>
  );
}