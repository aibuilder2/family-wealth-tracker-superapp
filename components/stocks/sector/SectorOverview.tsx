"use client";

import { PieChart } from "lucide-react";

export default function SectorOverview({ sectorName = "Information Technology" }: { sectorName?: string }) {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400"><PieChart className="h-5 w-5" /></div>
        <h2 className="text-xl font-bold text-blue-400">{sectorName}</h2>
      </div>
      <p className="text-sm text-slate-300 mb-6">This sector comprises companies involved in software development, IT consulting, and business process outsourcing.</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0B0F19] rounded-lg p-3 shadow-sm border border-blue-500/20">
          <p className="text-xs text-slate-400 mb-1">Market Cap</p><p className="font-bold text-white">₹35.4L Cr</p>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 shadow-sm border border-blue-500/20">
          <p className="text-xs text-slate-400 mb-1">1Y Return</p><p className="font-bold text-green-400">+18.5%</p>
        </div>
        <div className="bg-[#0B0F19] rounded-lg p-3 shadow-sm border border-blue-500/20">
          <p className="text-xs text-slate-400 mb-1">Nifty Weight</p><p className="font-bold text-white">14.2%</p>
        </div>
      </div>
    </div>
  );
}