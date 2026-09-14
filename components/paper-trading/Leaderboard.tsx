"use client";

import { Trophy, Medal, Award } from "lucide-react";

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "Rahul S.", pnl: "+₹45,200", winRate: "68%" },
    { rank: 2, name: "Priya M.", pnl: "+₹38,150", winRate: "62%" },
    { rank: 3, name: "Amit K.", pnl: "+₹31,000", winRate: "59%" },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden w-full">
      <div className="bg-yellow-50 border-b border-yellow-100 p-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-600" />
        <h3 className="font-bold text-yellow-900">Top Traders (This Week)</h3>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0B0F19] border-b">
          <tr><th className="px-4 py-3 text-slate-400">Rank</th><th className="px-4 py-3 text-slate-400">Trader</th><th className="px-4 py-3 text-slate-400 text-right">P&L</th></tr>
        </thead>
        <tbody className="divide-y">
          {leaders.map((l) => (
            <tr key={l.rank} className="hover:bg-[#0B0F19]">
              <td className="px-4 py-3 text-center w-12">
                {l.rank === 1 ? <Medal className="h-5 w-5 text-yellow-500 mx-auto"/> : l.rank === 2 ? <Award className="h-5 w-5 text-gray-400 mx-auto"/> : <Award className="h-5 w-5 text-amber-700 mx-auto"/>}
              </td>
              <td className="px-4 py-3 font-bold text-white">{l.name}</td>
              <td className="px-4 py-3 text-right font-bold text-green-600">{l.pnl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}