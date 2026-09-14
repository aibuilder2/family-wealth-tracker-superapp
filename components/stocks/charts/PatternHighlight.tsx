"use client";

export default function PatternHighlight({ label }: { label: string }) {
  return (
    <div className="relative border-2 border-dashed border-indigo-400 bg-indigo-100/30 rounded-lg flex items-center justify-center min-h-[100px] min-w-[150px]">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
        {label}
      </div>
      {/* Area to overlay on top of actual chart graphics */}
    </div>
  );
}