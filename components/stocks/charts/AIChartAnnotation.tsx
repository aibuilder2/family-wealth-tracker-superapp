"use client";

import { Sparkles } from "lucide-react";

interface AIChartAnnotationProps {
  label: string;
  explanation: string;
  type?: "bullish" | "bearish" | "neutral";
}

export default function AIChartAnnotation({ label, explanation, type = "neutral" }: AIChartAnnotationProps) {
  const colorClass = type === "bullish" ? "bg-green-100 text-green-800 border-green-300" : type === "bearish" ? "bg-red-100 text-red-800 border-red-300" : "bg-blue-100 text-blue-800 border-blue-300";
  
  return (
    <div className={`absolute z-10 p-3 rounded-lg border shadow-lg max-w-xs ${colorClass}`}>
      <div className="flex items-center gap-1 font-bold text-sm mb-1"><Sparkles className="h-4 w-4" /> {label}</div>
      <p className="text-xs opacity-90">{explanation}</p>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b border-r bg-inherit"></div>
    </div>
  );
}