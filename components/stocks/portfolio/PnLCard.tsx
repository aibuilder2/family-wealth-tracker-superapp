"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PnLCardProps {
  title: string;
  amount: number;
  isRealized?: boolean;
}

export default function PnLCard({ title, amount, isRealized = false }: PnLCardProps) {
  const isPositive = amount >= 0;
  
  return (
    <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">{title}</h3>
      <div className={`text-2xl font-extrabold flex items-center gap-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "+" : "-"}₹{Math.abs(amount).toLocaleString("en-IN")} 
        {isPositive ? <ArrowUpRight className="h-5 w-5"/> : <ArrowDownRight className="h-5 w-5"/>}
      </div>
      <p className="text-xs text-slate-400 mt-2">{isRealized ? "Profits booked from closed positions." : "Notional profits from open positions."}</p>
    </div>
  );
}