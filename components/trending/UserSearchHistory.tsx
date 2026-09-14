"use client";

import { History, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function UserSearchHistory() {
  const history = ["TATASTEEL", "ZOMATO", "RELIANCE"];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white flex items-center gap-2"><History className="h-4 w-4 text-slate-400"/> Your Recent Searches</h3>
        <button className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition"><Trash2 className="h-3 w-3"/> Clear</button>
      </div>
      <div className="space-y-2">
        {history.map((symbol) => (
          <div key={symbol} className="flex items-center justify-between p-2 rounded hover:bg-[#0B0F19] border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-2">
              <Search className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium text-slate-300">{symbol}</span>
            </div>
            <Link href={`/stock/${symbol}`} className="text-xs text-blue-600 hover:underline font-medium">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
