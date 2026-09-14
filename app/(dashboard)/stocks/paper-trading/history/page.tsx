"use client";

import { History, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TradeHistoryPage() {
  const history = [
    { id: "TRD-101", date: "2024-05-15 10:30", symbol: "RELIANCE", type: "BUY", qty: 50, price: 2850.50, status: "EXECUTED" },
    { id: "TRD-102", date: "2024-05-14 14:15", symbol: "HDFCBANK", type: "SELL", qty: 100, price: 1450.00, status: "EXECUTED" },
    { id: "TRD-103", date: "2024-05-12 09:16", symbol: "INFY", type: "BUY", qty: 25, price: 1420.25, status: "CANCELLED" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <History className="h-6 w-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Order & Trade History</h1>
          <p className="text-sm text-slate-400">Record of your paper trading execution.</p>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-400">Time</th>
              <th className="px-6 py-3 font-medium text-slate-400">Instrument</th>
              <th className="px-6 py-3 font-medium text-slate-400">Type</th>
              <th className="px-6 py-3 font-medium text-slate-400 text-right">Qty & Price</th>
              <th className="px-6 py-3 font-medium text-slate-400 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {history.map((t) => (
              <tr key={t.id} className="hover:bg-[#0B0F19]">
                <td className="px-6 py-4 text-slate-400 text-xs">{t.date}</td>
                <td className="px-6 py-4 font-bold text-white">{t.symbol}</td>
                <td className="px-6 py-4 font-bold"><span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs ${t.type === "BUY" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{t.type === "BUY" ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownRight className="h-3 w-3"/>}{t.type}</span></td>
                <td className="px-6 py-4 text-right font-medium text-white">{t.qty} @ ₹{t.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right"><span className={`text-xs font-bold px-2 py-1 rounded ${t.status === "EXECUTED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}