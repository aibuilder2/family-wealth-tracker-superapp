"use client";

import { Activity } from "lucide-react";

export default function PnLTracker() {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">P&L Performance</h3>
        <select className="text-xs border rounded p-1 outline-none"><option>This Week</option><option>This Month</option></select>
      </div>
      
      <div className="h-48 bg-[#0B0F19] rounded-lg flex items-center justify-center border border-dashed relative overflow-hidden">
        <Activity className="h-8 w-8 text-gray-300 absolute" />
        <div className="absolute inset-0 flex items-end opacity-40 px-2 gap-1 pb-2">
          {/* Mock chart bars */}
          {[20, 35, 25, 45, 60, 40, 75, 55, 80, 95].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-slate-400">Net Profit</span>
        <span className="font-bold text-green-600">+₹12,450.00</span>
      </div>
    </div>
  );
}