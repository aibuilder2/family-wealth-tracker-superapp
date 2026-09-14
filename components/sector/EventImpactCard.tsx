"use client";

import { Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface EventImpactCardProps {
  title: string;
  date: string;
  impacts: { name?: string; sector?: string; effect: "Positive" | "Negative" | "Neutral"; description?: string }[];
}

export default function EventImpactCard({ title, date, impacts }: EventImpactCardProps) {
  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-5 hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2 text-indigo-600">
        <Zap className="h-5 w-5" />
        <span className="text-xs font-bold uppercase tracking-wider">{date}</span>
      </div>
      <h3 className="font-bold text-white mb-4 leading-tight">{title}</h3>
      <div className="space-y-2">
        {impacts.map((impact, idx) => {
          const label = impact.name || impact.sector || "Sector";
          const isPos = impact.effect === "Positive";
          const isNeg = impact.effect === "Negative";
          const badgeClass = isPos ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" : isNeg ? "bg-red-950/60 text-red-400 border border-red-800/40" : "bg-slate-800/60 text-slate-300 border border-slate-700/40";
          return (
            <div key={idx} className={`flex justify-between items-center p-2.5 rounded-lg text-sm font-medium ${badgeClass}`}>
              <div>
                <span>{label}</span>
                {impact.description && <p className="text-xs opacity-75 font-normal">{impact.description}</p>}
              </div>
              <span className="flex items-center gap-1">{isPos ? <ArrowUpRight className="h-4 w-4"/> : isNeg ? <ArrowDownRight className="h-4 w-4"/> : null}{impact.effect}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}