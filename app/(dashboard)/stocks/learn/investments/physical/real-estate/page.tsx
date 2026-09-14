"use client";

import { AlertTriangle, Building, Home, CheckCircle2, XCircle, TrendingUp, BookOpen } from "lucide-react";

export default function LearnRealEstatePage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-stone-600 to-stone-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Physical Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Real Estate</h1>
        <p className="text-stone-100 text-lg max-w-3xl">
          Investing in physical property (residential, commercial, or land) to generate rental income and benefit from capital appreciation over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Building className="h-8 w-8 text-stone-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Tangible Asset</h3>
          <p className="text-slate-400 text-sm">A physical asset you can see and touch, which gives many investors a psychological sense of security.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Home className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Passive Income</h3>
          <p className="text-slate-400 text-sm">Generates regular monthly cash flow through residential or commercial rents.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Leverage</h3>
          <p className="text-slate-400 text-sm">You can buy a property using a bank loan (mortgage), meaning you can control a large asset with a small down payment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Real Estate</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Dual returns: Capital appreciation + Rental yield.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Excellent tax benefits on home loans (Sec 80C and Sec 24).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Strong hedge against long-term inflation.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Real Estate</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Highly illiquid. It can take months or years to sell at the right price.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> High entry barrier (requires huge capital or taking on heavy debt).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Maintenance costs, tenant management, and legal/registration hassles.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Types of Real Estate</th>
              <td className="p-4 font-medium text-white">Residential (Flats/Villas), Commercial (Offices/Shops), Agricultural Land, Plots.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Average Rental Yield (India)</th>
              <td className="p-4 text-white">Residential: 2% to 3% annually.<br/>Commercial: 6% to 9% annually.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">HNIs, individuals with stable high income who can service EMIs, and those seeking long-term legacy wealth.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li><strong>Direct Ownership:</strong> Research locations, arrange a 20% downpayment, secure a mortgage, and buy the property.</li>
          <li><strong>Fractional Real Estate:</strong> Platforms allow you to co-own commercial properties with ₹10 Lakhs - ₹25 Lakhs.</li>
          <li><strong>REITs (Digital):</strong> Buy Real Estate Investment Trusts on the stock market for as little as ₹300 (See our REITs module).</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. Real estate involves heavy capital commitment and legal due diligence. Always verify title deeds and RERA approvals before paying token advances.
        </p>
      </div>
    </div>
  );
}