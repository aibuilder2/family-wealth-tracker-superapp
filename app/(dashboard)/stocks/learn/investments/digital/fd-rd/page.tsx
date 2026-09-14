"use client";

import { AlertTriangle, PiggyBank, ShieldCheck, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnFDRDPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Fixed & Recurring Deposits (FD/RD)</h1>
        <p className="text-orange-100 text-lg max-w-3xl">
          The traditional and most popular saving instruments in India. You deposit money with a bank for a fixed tenure at a guaranteed interest rate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <PiggyBank className="h-8 w-8 text-orange-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Fixed Deposit (FD)</h3>
          <p className="text-slate-400 text-sm">Lumpsum amount deposited once for a specific period (7 days to 10 years). Interest is compounded quarterly.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <PiggyBank className="h-8 w-8 text-red-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Recurring Deposit (RD)</h3>
          <p className="text-slate-400 text-sm">Deposit a fixed amount every month for a specific period. Ideal for salaried employees building a corpus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of FD/RD</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Zero market risk. Returns are 100% guaranteed.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Insured up to ₹5 Lakhs per bank by DICGC (RBI).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Highly liquid. Premature withdrawal is easily allowed (with minor penalty).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Senior citizens get ~0.5% extra interest.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of FD/RD</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Barely beats inflation. Real returns are often negative.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Interest is fully taxable at your income tax slab rate.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> TDS is deducted by banks if interest exceeds ₹40,000/yr.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Interest Rates</th>
              <td className="p-4 font-medium text-white">Typically ranges from 5% to 8% depending on the bank and tenure.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Saving FD</th>
              <td className="p-4 text-white">5-year lock-in FDs offer Section 80C tax deduction (up to ₹1.5L). Cannot be broken early.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Emergency funds, senior citizens, and short-term goals (1-3 years).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Login to your Bank's NetBanking or Mobile App.</li>
          <li>Go to Deposits section and choose 'Open FD' or 'Open RD'.</li>
          <li>Enter the amount, select the tenure.</li>
          <li>Nominate a beneficiary and confirm.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. While FDs are safe, relying solely on them for long-term goals like retirement may lead to a shortfall due to inflation.
        </p>
      </div>
    </div>
  );
}