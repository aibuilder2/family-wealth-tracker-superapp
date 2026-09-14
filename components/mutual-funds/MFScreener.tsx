"use client";

import { Filter, Search } from "lucide-react";
import { useScreener } from "@/hooks/useScreener";
import * as cnUtils from "@/lib/utils/cn";
import * as formatUtils from "@/lib/utils/formatters";

export default function MFScreener() {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="font-bold text-white flex items-center gap-2"><Filter className="h-5 w-5 text-teal-600"/> Fund Screener</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select className="border rounded-lg p-2 text-sm outline-none bg-[#0B0F19] focus:border-teal-500">
          <option>Equity - Large Cap</option><option>Equity - Mid Cap</option><option>Debt - Liquid</option>
        </select>
        <select className="border rounded-lg p-2 text-sm outline-none bg-[#0B0F19] focus:border-teal-500">
          <option>High Risk</option><option>Moderate Risk</option><option>Low Risk</option>
        </select>
        <select className="border rounded-lg p-2 text-sm outline-none bg-[#0B0F19] focus:border-teal-500">
          <option>Returns &gt; 15%</option><option>Returns &gt; 10%</option><option>Returns &gt; 5%</option>
        </select>
      </div>
      <button className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-700 transition">
        <Search className="h-4 w-4" /> Filter Funds
      </button>
    </div>
  );
}