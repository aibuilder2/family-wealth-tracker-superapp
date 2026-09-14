"use client";

import { BookOpen, MonitorPlay, Box } from "lucide-react";
import Link from "next/link";

export default function InvestmentsIndexPage() {
  const digital = [
    { name: "Stocks", path: "stocks" },
    { name: "Mutual Funds", path: "mutual-funds" },
    { name: "ETFs", path: "etf" },
    { name: "Bonds", path: "bonds" },
    { name: "FD & RD", path: "fd-rd" },
    { name: "NPS", path: "nps" },
    { name: "PPF", path: "ppf" },
    { name: "REITs", path: "reits" },
    { name: "Crypto", path: "crypto" },
  ];

  const physical = [
    { name: "Gold & Silver", path: "gold-silver" },
    { name: "Real Estate", path: "real-estate" },
    { name: "Unlisted Shares", path: "unlisted" },
    { name: "Commodities", path: "commodities" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <div className="text-center py-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl border">
        <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-white mb-2">Asset Classes Explorer</h1>
        <p className="text-slate-400">Select an investment type to understand its pros, cons, and taxation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b pb-3"><MonitorPlay className="h-5 w-5 text-blue-500"/> Digital Investments</h2>
          <div className="grid grid-cols-2 gap-3">
            {digital.map((item) => <Link key={item.path} href={`/learn/investments/digital/${item.path}`} className="p-3 border rounded-lg hover:border-blue-500 hover:text-blue-700 font-medium text-sm transition bg-[#0B0F19] hover:bg-blue-50">{item.name}</Link>)}
          </div>
        </div>
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b pb-3"><Box className="h-5 w-5 text-amber-600"/> Physical / Alternative</h2>
          <div className="grid grid-cols-2 gap-3">
            {physical.map((item) => <Link key={item.path} href={`/learn/investments/physical/${item.path}`} className="p-3 border rounded-lg hover:border-amber-500 hover:text-amber-700 font-medium text-sm transition bg-[#0B0F19] hover:bg-amber-50">{item.name}</Link>)}
          </div>
        </div>
      </div>
    </div>
  );
}