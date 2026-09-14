"use client";

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
}

export default function ScoreBar({ label, score, maxScore }: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  let colorClass = "from-emerald-500 to-teal-400";
  let textBadgeClass = "text-emerald-400";
  if (percentage < 40) {
    colorClass = "from-rose-500 to-red-600";
    textBadgeClass = "text-rose-400";
  } else if (percentage < 60) {
    colorClass = "from-amber-400 to-[#E5C378]";
    textBadgeClass = "text-[#E5C378]";
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
        <span className="text-slate-300 tracking-wide">{label}</span>
        <span className={`font-mono font-bold ${textBadgeClass}`}>
          {score} <span className="text-slate-500">/ {maxScore}</span>
        </span>
      </div>
      <div className="w-full bg-slate-900/80 border border-white/10 rounded-full h-2 overflow-hidden p-[1px]">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-500 shadow-sm`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}