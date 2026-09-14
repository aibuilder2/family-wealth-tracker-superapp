"use client";

import { AlertTriangle, Briefcase, TrendingUp, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnNPSPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-sky-600 to-cyan-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">National Pension System (NPS)</h1>
        <p className="text-sky-100 text-lg max-w-3xl">
          A voluntary, long-term retirement savings scheme managed by PFRDA (Govt. of India). It invests your money in a mix of equity, corporate bonds, and govt securities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <TrendingUp className="h-8 w-8 text-sky-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Market Linked Returns</h3>
          <p className="text-slate-400 text-sm">Unlike EPF/PPF, NPS returns are market-linked. You can allocate up to 75% to Equity (Active choice) for higher growth.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Briefcase className="h-8 w-8 text-cyan-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Retirement Focus</h3>
          <p className="text-slate-400 text-sm">Designed specifically to build a retirement corpus and provide a monthly pension (annuity) after age 60.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of NPS</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Extra ₹50,000 tax deduction under Sec 80CCD(1B), over and above 80C's 1.5L.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Ultra-low fund management charges (~0.01%), cheapest in the world.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Enforces strict discipline due to lock-in rules.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of NPS</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Hard lock-in until age 60. Very rigid premature withdrawal rules.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Mandatory to use 40% of maturity corpus to buy an Annuity (pension), which has low returns.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Annuity income received post-retirement is fully taxable.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Account Types</th>
              <td className="p-4 text-white">
                <strong>Tier 1:</strong> Mandatory, locked till 60, gives tax benefits.<br/>
                <strong>Tier 2:</strong> Voluntary, no lock-in, no tax benefits.
              </td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Maturity (At Age 60)</th>
              <td className="p-4 font-medium text-white">60% lumpsum withdrawal (Tax Free). 40% compulsory annuity purchase.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">People in high tax brackets looking for extra tax savings and disciplined retirement planning.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Visit the official NSDL/CRA eNPS portal.</li>
          <li>Register using Aadhaar/PAN to generate your PRAN (Permanent Retirement Account Number).</li>
          <li>Choose a Pension Fund Manager (e.g., HDFC, SBI, LIC).</li>
          <li>Select 'Auto Choice' (Age-based) or 'Active Choice' (Define your own equity %).</li>
          <li>Make the initial contribution to activate the account.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. NPS locks your money for decades. Ensure you have adequate liquid emergency funds before heavily committing to NPS.
        </p>
      </div>
    </div>
  );
}