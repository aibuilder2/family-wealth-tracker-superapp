"use client";

import { AlertTriangle, Coins, TrendingUp, CheckCircle2, XCircle, ShieldCheck, BookOpen } from "lucide-react";

export default function LearnGoldSilverPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Physical Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Gold & Silver</h1>
        <p className="text-yellow-50 text-lg max-w-3xl">
          The oldest forms of money and wealth preservation. In modern times, they act as a primary hedge against inflation and currency depreciation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldCheck className="h-8 w-8 text-yellow-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Inflation Hedge</h3>
          <p className="text-slate-400 text-sm">Gold has historically maintained its purchasing power, protecting wealth when fiat currencies lose value.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Coins className="h-8 w-8 text-amber-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">High Liquidity</h3>
          <p className="text-slate-400 text-sm">Physical gold, digital gold, and gold ETFs can be easily sold for cash almost anywhere in the world.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-orange-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Portfolio Diversifier</h3>
          <p className="text-slate-400 text-sm">Gold typically has a low or negative correlation with stocks, stabilizing your portfolio during market crashes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Gold/Silver</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Safe haven asset during economic crises or geopolitical tensions.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Sovereign Gold Bonds (SGBs) offer extra 2.5% annual interest.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Tangible asset that you can physically hold (if buying coins/jewelry).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Gold/Silver</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Physical gold incurs making charges, GST, and storage/security risks.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Does not produce passive income (unlike stocks or real estate).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Long periods of stagnation where prices do not move.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Ways to Invest</th>
              <td className="p-4 text-white">Physical (Coins/Bars), Digital Gold (Apps), Gold ETFs/Mutual Funds, Sovereign Gold Bonds (SGBs).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment</th>
              <td className="p-4 text-white">Physical/Digital Gold: Added to your income slab. SGBs: Capital gains are tax-free if held till maturity (8 years).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Everyone. Experts recommend keeping 5% to 15% of your total portfolio in Gold.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start (Best Methods)</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li><strong>SGBs (Best for Investment):</strong> Buy through your bank or Demat account when RBI opens a tranche.</li>
          <li><strong>Gold ETFs:</strong> Buy 'GOLDBEES' or similar ETFs via your stock broker for high liquidity.</li>
          <li><strong>Digital Gold:</strong> Buy fractions of gold (even for ₹10) via trusted UPI apps, backed by physical vaults.</li>
          <li><strong>Physical Gold:</strong> Buy 24K coins or bars from reputed jewelers (avoid jewelry for investment due to making charges).</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. Market prices of precious metals fluctuate. Assess purity and certification (Hallmark) before buying physical metals.
        </p>
      </div>
    </div>
  );
}