"use client";

import { Trophy, Medal, Award } from "lucide-react";

export default function LeaderboardPage() {
  const leaders = [
    { rank: 1, name: "Rahul S.", pnl: "+₹45,200", pnlPct: "+45.2%", trades: 142 },
    { rank: 2, name: "Priya M.", pnl: "+₹38,150", pnlPct: "+38.1%", trades: 89 },
    { rank: 3, name: "Amit K.", pnl: "+₹31,000", pnlPct: "+31.0%", trades: 56 },
    { rank: 4, name: "Sneha V.", pnl: "+₹25,800", pnlPct: "+25.8%", trades: 112 },
    { rank: 5, name: "Vikram R.", pnl: "+₹22,400", pnlPct: "+22.4%", trades: 45 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Top Virtual Traders</h1>
          <p className="text-sm text-slate-400">Global leaderboard for the current month.</p>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-400 text-center">Rank</th>
              <th className="px-6 py-4 font-bold text-slate-400">Trader</th>
              <th className="px-6 py-4 font-bold text-slate-400 text-right">Total P&L</th>
              <th className="px-6 py-4 font-bold text-slate-400 text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaders.map((l) => (
              <tr key={l.rank} className={l.rank === 1 ? "bg-yellow-50/50" : "hover:bg-[#0B0F19]"}>
                <td className="px-6 py-4 text-center">{l.rank === 1 ? <Medal className="h-6 w-6 text-yellow-500 mx-auto"/> : l.rank === 2 ? <Award className="h-6 w-6 text-gray-400 mx-auto"/> : l.rank === 3 ? <Award className="h-6 w-6 text-amber-700 mx-auto"/> : <span className="font-bold text-slate-400">#{l.rank}</span>}</td>
                <td className="px-6 py-4 font-bold text-white">{l.name} <span className="block text-xs font-normal text-slate-400">{l.trades} Trades</span></td>
                <td className="px-6 py-4 text-right font-bold text-green-600">{l.pnl} <span className="block text-xs font-medium text-green-700 bg-green-100 w-fit ml-auto px-1.5 rounded">{l.pnlPct}</span></td>
                <td className="px-6 py-4 text-right text-slate-300 font-medium">~65%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}