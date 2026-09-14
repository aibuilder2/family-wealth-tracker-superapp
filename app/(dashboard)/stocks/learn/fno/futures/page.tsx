"use client";

import { AlertTriangle, Clock, TrendingUp, CheckCircle2, XCircle, ShieldAlert, BookOpen } from "lucide-react";
import FnoRiskGate from "@/components/learn/FnoRiskGate";

export default function LearnFuturesPage() {
  return (
    <FnoRiskGate>
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> F&O Module
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Futures Trading</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          A Futures contract is an agreement to buy or sell an underlying asset (like a stock or index) at a predetermined price at a specified time in the future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Clock className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Expiry Date</h3>
          <p className="text-slate-400 text-sm">Contracts have a fixed lifespan. In India, stock futures expire on the last Thursday of every month.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">High Leverage</h3>
          <p className="text-slate-400 text-sm">You only pay a fraction of the total contract value (Margin) upfront, amplifying both profits and losses.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldAlert className="h-8 w-8 text-red-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Obligation</h3>
          <p className="text-slate-400 text-sm">Unlike Options, Futures carry a strict obligation to settle the contract on the expiry date.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Futures</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Linear Payoff: Easy to understand compared to Options (no Time Decay/Theta).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> High Leverage allows holding large positions with less capital.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Ability to short-sell and hold positions overnight.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Futures</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Unlimited risk. You can lose more than your initial margin.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Margin Calls (Mark-to-Market): If trade goes against you, broker demands more cash immediately.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Requires very high capital (₹1-2 Lakhs per lot minimum).</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Lot Size</th>
              <td className="p-4 font-medium text-white">Futures cannot be bought in single shares. They are traded in fixed lots (e.g., Nifty lot is 50, Reliance lot is 250).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Mark to Market (MTM)</th>
              <td className="p-4 text-white">Profits and losses are settled in your trading account at the end of every trading day.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Experienced institutional traders, hedgers, and well-capitalized active swing traders.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How does a trade work? (Example)</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>You expect Nifty to go up from 22,000.</li>
          <li>You buy 1 Lot of Nifty Futures (50 units). Contract Value = ₹11,00,000.</li>
          <li>You don't pay 11L. You only pay ~₹1.1L (10% Margin).</li>
          <li>If Nifty goes to 22,100 (+100 points). Profit = 100 x 50 = ₹5,000.</li>
          <li>If Nifty drops to 21,900 (-100 points). Loss = -₹5,000.</li>
          <li>This loss is deducted from your ₹1.1L margin immediately.</li>
        </ol>
      </div>

      <div className="bg-red-100 p-4 rounded-lg border border-red-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800 leading-relaxed">
          <strong>Severe Risk Warning:</strong> Futures are highly leveraged. A 10% move against your position can wipe out 100% of your capital. 
          Never trade futures without a strict stop-loss.
        </p>
      </div>
    </div>
    </FnoRiskGate>
  );
}