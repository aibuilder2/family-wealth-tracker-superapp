"use client";

import type { MutualFund } from "@/types/mutual-fund";
import { CheckCircle2 } from "lucide-react";

export default function MFComparison({ funds }: { funds: MutualFund[] }) {
  if (!funds || funds.length === 0) return null;

  const bestReturns = Math.max(...funds.map(f => f.returns3y));
  const lowestExpense = Math.min(...funds.map(f => f.expenseRatio));

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[600px]">
          <thead className="bg-[#0B0F19]">
            <tr>
              <th className="px-4 py-4 text-slate-400 font-medium">Compare Features</th>
              {funds.map(f => (
                <th key={f.schemeCode} className="px-4 py-4 font-bold text-white w-64">{f.schemeName}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-3 text-slate-400">Fund House</td>
              {funds.map(f => <td key={f.schemeCode} className="px-4 py-3">{f.fundHouse}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-400">3Y Returns</td>
              {funds.map(f => (
                <td key={f.schemeCode} className={`px-4 py-3 font-bold ${f.returns3y === bestReturns ? "text-green-600 bg-green-50" : ""}`}>
                  {f.returns3y}% {f.returns3y === bestReturns && <CheckCircle2 className="inline h-4 w-4 ml-1"/>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-400">Expense Ratio</td>
              {funds.map(f => (
                <td key={f.schemeCode} className={`px-4 py-3 ${f.expenseRatio === lowestExpense ? "font-bold text-blue-600 bg-blue-50" : ""}`}>
                  {f.expenseRatio}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}