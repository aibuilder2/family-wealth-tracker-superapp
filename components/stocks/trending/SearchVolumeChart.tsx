"use client";

import { BarChart2 } from "lucide-react";

export default function SearchVolumeChart() {
  const data = [10, 15, 25, 20, 45, 80, 100]; // Mock search surge data

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 w-full">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b pb-2"><BarChart2 className="h-5 w-5 text-orange-500"/> 7-Day Search Trend</h3>
      <div className="h-32 flex items-end gap-2 pt-4">
        {data.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${h > 70 ? "bg-orange-500" : "bg-orange-200"}`} 
              style={{ height: `${h}%` }}
            ></div>
            <span className="text-[8px] text-gray-400 font-medium">D-{7-i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}