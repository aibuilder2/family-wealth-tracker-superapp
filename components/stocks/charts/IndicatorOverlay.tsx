"use client";

export default function IndicatorOverlay({ name, value }: { name: string, value: string | number }) {
  return (
    <div className="absolute top-4 left-4 flex gap-2">
      <div className="bg-[#111827]/80 backdrop-blur border shadow-lg border border-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-300 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div> {name}: <span className="text-purple-700">{value}</span>
      </div>
    </div>
  );
}