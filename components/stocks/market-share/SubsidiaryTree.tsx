"use client";

import { Network } from "lucide-react";

export default function SubsidiaryTree({ symbol }: { symbol: string }) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5">
      <div className="flex items-center gap-2 border-b pb-3 mb-4">
        <Network className="h-5 w-5 text-indigo-600" />
        <h3 className="font-bold text-white">Corporate Structure & Subsidiaries</h3>
      </div>
      
      <div className="relative p-4 border rounded-lg bg-[#0B0F19] flex flex-col items-center">
        <div className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg border border-slate-800 z-10">{symbol} (Parent)</div>
        <div className="w-px h-6 bg-indigo-300"></div>
        <div className="w-64 h-px bg-indigo-300"></div>
        <div className="flex justify-between w-72 mt-0">
          <div className="w-px h-4 bg-indigo-300"></div>
          <div className="w-px h-4 bg-indigo-300"></div>
        </div>
        <div className="flex justify-between w-80 gap-4 mt-0">
          <div className="flex-1 bg-[#111827] border border-indigo-100 text-center text-sm font-bold p-3 rounded-lg shadow-lg border border-slate-800 text-slate-100">Subsidiary A <br/><span className="text-[10px] font-normal text-slate-400">100% Owned</span></div>
          <div className="flex-1 bg-[#111827] border border-indigo-100 text-center text-sm font-bold p-3 rounded-lg shadow-lg border border-slate-800 text-slate-100">Subsidiary B <br/><span className="text-[10px] font-normal text-slate-400">75% Owned</span></div>
        </div>
      </div>
    </div>
  );
}