"use client";

import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface BreakoutMarkerProps {
  type: "up" | "down";
}

export default function BreakoutMarker({ type }: BreakoutMarkerProps) {
  return (
    <div className="relative group inline-block cursor-pointer animate-bounce">
      {type === "up" ? <ArrowUpCircle className="h-6 w-6 text-green-500 fill-green-100" /> : <ArrowDownCircle className="h-6 w-6 text-red-500 fill-red-100" />}
      <span className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">Breakout Detected</span>
    </div>
  );
}