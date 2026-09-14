"use client";

import { ArrowRight } from "lucide-react";

export default function BeforeAfterChart({ title = "Market Share Impact" }: { title?: string }) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 w-full">
      <h3 className="font-bold text-white mb-4">{title}</h3>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold text-slate-400 text-center">BEFORE ACQUISITION</p>
          <div className="h-40 bg-slate-800/50 rounded-lg flex flex-col justify-end overflow-hidden relative">
            <div className="bg-blue-300 w-full flex items-center justify-center text-xs font-bold text-blue-900 transition-all duration-500" style={{ height: '30%' }}>30%</div>
            <div className="bg-blue-600 w-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500" style={{ height: '70%' }}>70%</div>
          </div>
        </div>
        <ArrowRight className="h-6 w-6 text-gray-300 shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold text-green-600 text-center">AFTER ACQUISITION</p>
          <div className="h-40 bg-slate-800/50 rounded-lg flex flex-col justify-end overflow-hidden relative">
            <div className="bg-blue-300 w-full flex items-center justify-center text-xs font-bold text-blue-900 transition-all duration-500" style={{ height: '15%' }}>15%</div>
            <div className="bg-blue-600 w-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500" style={{ height: '85%' }}>85%</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> Target Company</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-300 rounded-full"></div> Competitors</span>
      </div>
    </div>
  );
}