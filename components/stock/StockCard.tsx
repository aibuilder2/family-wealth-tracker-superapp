"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

export default function StockCard({ symbol = "RELIANCE", price = 2850.50, change = 25.4, changePct = 1.2 }) {
  const isPos = change >= 0;
  
  return (
    <Link href={`/stock/${symbol}`} className="block bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-4 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-white text-lg">{symbol}</h4>
        <div className="p-1.5 bg-[#0B0F19] rounded text-gray-400 hover:text-white transition">View</div>
      </div>
      <div className="text-xl font-extrabold text-white mb-1">₹{price.toFixed(2)}</div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPos ? "text-green-600" : "text-red-600"}`}>
        {isPos ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
        {isPos ? "+" : ""}{change.toFixed(2)} ({changePct.toFixed(2)}%)
      </div>
    </Link>
  );
}