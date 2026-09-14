"use client";

import { PieChart as PieIcon } from "lucide-react";

export default function MarketSharePie({ data }: { data?: any }) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 flex flex-col items-center justify-center h-full min-h-[250px]">
      <h3 className="font-bold text-white mb-6 self-start w-full border-b pb-2">Market Share Breakdown</h3>
      <div className="relative w-40 h-40 rounded-full border-[16px] border-blue-500 border-r-gray-200 border-b-blue-300 flex items-center justify-center">
        <PieIcon className="h-8 w-8 text-gray-400 absolute" />
      </div>
      <div className="flex gap-4 mt-6 text-sm">
        <div className="flex items-center gap-1 text-slate-300 font-medium">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> Company (45%)
        </div>
        <div className="flex items-center gap-1 text-slate-300 font-medium">
          <div className="w-3 h-3 rounded-full bg-gray-200"></div> Competitors (55%)
        </div>
      </div>
    </div>
  );
}