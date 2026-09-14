"use client";

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
}

export default function ScoreBar({ label, score, maxScore }: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  let colorClass = "bg-green-500";
  if (percentage < 40) colorClass = "bg-red-500";
  else if (percentage < 60) colorClass = "bg-yellow-500";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-slate-300">{label}</span>
        <span className="text-white font-bold">{score} / {maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"><div className={`h-2 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }}></div></div>
    </div>
  );
}