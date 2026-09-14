"use client";

import { AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2, XCircle, Info, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LearnStocksPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Direct Equity (Stocks)</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          When you buy a stock, you are buying a small piece of ownership in a publicly traded company. 
          It offers the highest potential returns among traditional asset classes but comes with significant volatility.
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">High Returns</h3>
          <p className="text-slate-400 text-sm">Historically, stocks have beaten inflation and FD returns over a 10+ year horizon.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldAlert className="h-8 w-8 text-red-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">High Risk</h3>
          <p className="text-slate-400 text-sm">Prices fluctuate daily based on market sentiment, company performance, and global news.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Info className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Dividends & Growth</h3>
          <p className="text-slate-400 text-sm">Earn through capital appreciation (price going up) and regular dividend payouts.</p>
        </div>
      </div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Stocks</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Highly liquid (can be sold instantly during market hours).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Potential for multi-bagger (100%+) returns.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Ownership and voting rights in large corporations.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Stocks</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> High volatility; capital can be wiped out in bad companies.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Requires time, research, and emotional control.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Subject to market manipulation in smaller caps.</li>
          </ul>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">Price of 1 share (can be as low as ₹10)</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Lock-in Period</th>
              <td className="p-4 font-medium text-white">None (T+1 settlement for withdrawal)</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment (India)</th>
              <td className="p-4 text-white">
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>STCG</strong> (Sold &lt; 1 yr): 20% on profits</li>
                  <li><strong>LTCG</strong> (Sold &gt; 1 yr): 12.5% on profits over ₹1.25 Lakh</li>
                  <li><strong>Dividends</strong>: Taxed as per your income slab</li>
                </ul>
              </td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Aggressive investors with a 5+ year horizon who can digest daily price drops.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* How to Start */}
      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start Investing in Stocks?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Open a Demat and Trading account with a SEBI-registered broker (e.g., Zerodha, Groww, Upstox).</li>
          <li>Complete your KYC using PAN and Aadhaar.</li>
          <li>Add funds from your linked bank account.</li>
          <li>Research companies using our <Link href="/screener" className="text-blue-600 hover:underline">Screener tool</Link>.</li>
          <li>Place a "Delivery" (CNC) buy order.</li>
        </ol>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> The information provided on this page is strictly for educational purposes. 
          We do not provide investment advice. Investing in stocks is subject to market risks. Please consult a SEBI-registered 
          financial advisor before making any investment decisions.
        </p>
      </div>
    </div>
  );
}