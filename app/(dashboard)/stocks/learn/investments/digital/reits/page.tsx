"use client";

import { AlertTriangle, Building2, TrendingUp, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnREITsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-blue-800 to-slate-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">REITs (Real Estate Investment Trusts)</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          REITs allow you to invest in large-scale, income-producing commercial real estate (like tech parks and malls) without having to buy physical properties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Building2 className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Commercial Real Estate</h3>
          <p className="text-slate-400 text-sm">Gives retail investors exposure to Grade-A office spaces leased to MNCs, which was previously only for the ultra-rich.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Regular Yield</h3>
          <p className="text-slate-400 text-sm">By law, REITs must distribute 90% of their rental income to unit holders as dividends and interest.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of REITs</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> High liquidity compared to physical real estate. Trade them like stocks.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Start investing in real estate with just ₹300-₹400.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Generates steady cash flow (dividends) plus capital appreciation.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of REITs</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Highly sensitive to rising interest rates.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Very complex taxation structure (Distributions are split into Dividend, Interest, and Repayment of Debt).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Growth is usually slower than high-growth equity stocks.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Indian REITs</th>
              <td className="p-4 font-medium text-white">Embassy Office Parks, Mindspace Business Parks, Brookfield India, Nexus Select Trust.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">1 Unit (Traded on NSE/BSE between ₹100 - ₹400).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Investors seeking regular passive income and real estate diversification without buying physical property.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Open a Demat and Trading account.</li>
          <li>Search for the REIT symbol (e.g., EMBASSY, MINDSPACE) in your broker app.</li>
          <li>Buy the units like you buy regular shares.</li>
          <li>Wait for quarterly distributions directly into your bank account.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. Please consult your CA regarding the complex tax implications of REIT distributions before investing.
        </p>
      </div>
    </div>
  );
}