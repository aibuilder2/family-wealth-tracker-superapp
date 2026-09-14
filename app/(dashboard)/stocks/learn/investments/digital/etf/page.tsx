"use client";

import { AlertTriangle, BarChart, Zap, CheckCircle2, XCircle, Info, BookOpen } from "lucide-react";

export default function LearnETFPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Exchange Traded Funds (ETFs)</h1>
        <p className="text-purple-100 text-lg max-w-3xl">
          ETFs are baskets of securities that track an underlying index (like Nifty 50 or Gold) but are traded on stock exchanges just like regular shares.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <BarChart className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Index Tracking</h3>
          <p className="text-slate-400 text-sm">Most ETFs passively track an index, guaranteeing that you earn exactly the market average returns.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Zap className="h-8 w-8 text-yellow-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Real-time Trading</h3>
          <p className="text-slate-400 text-sm">Unlike Mutual Funds (end-of-day NAV), ETFs can be bought and sold instantly during market hours.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Info className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Ultra-Low Costs</h3>
          <p className="text-slate-400 text-sm">Because they are passively managed, ETFs have expense ratios as low as 0.05%.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of ETFs</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Extremely low expense ratio compared to Mutual Funds.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Complete transparency (you always know exact holdings).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> No lock-in period or exit loads.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of ETFs</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Demat and trading account is mandatory.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Liquidity issues in some obscure ETFs (low trading volume).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Brokerage and STT charges apply on every buy/sell.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">Price of 1 ETF unit (e.g., NIFTYBEES is ~₹250)</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Risk Level</th>
              <td className="p-4 font-medium text-white">Moderate to High (Market-linked)</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment</th>
              <td className="p-4 text-white">Same as stocks (STCG 20%, LTCG 12.5% for equity ETFs). Gold/Debt ETFs have different taxation.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Passive investors who want index returns with lowest possible fees.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Log into your stock broker app (Zerodha, Upstox, etc).</li>
          <li>Search for popular ETFs like "NIFTYBEES" (Nifty 50) or "GOLDBEES" (Gold).</li>
          <li>Check the market depth (liquidity) before buying.</li>
          <li>Place a buy order just like you buy normal shares.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. ETFs carry market risks. Always check tracking error and liquidity before investing.
        </p>
      </div>
    </div>
  );
}