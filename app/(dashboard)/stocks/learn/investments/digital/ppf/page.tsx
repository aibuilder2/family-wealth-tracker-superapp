"use client";

import { AlertTriangle, Landmark, ShieldCheck, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnPPFPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Public Provident Fund (PPF)</h1>
        <p className="text-green-100 text-lg max-w-3xl">
          A government-backed savings scheme in India offering risk-free returns and maximum tax benefits. It is one of the most favored instruments for long-term safe wealth creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldCheck className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">100% Sovereign Guarantee</h3>
          <p className="text-slate-400 text-sm">Your principal and interest are backed by the Government of India. It is completely immune to market volatility.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Landmark className="h-8 w-8 text-teal-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">EEE Tax Status</h3>
          <p className="text-slate-400 text-sm">Exempt-Exempt-Exempt: Deposit is tax deductible, Interest earned is tax-free, and Maturity amount is entirely tax-free.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of PPF</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> The best risk-free, post-tax return among debt instruments.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> PPF corpus cannot be attached by courts or creditors to pay off debts.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Can be extended in blocks of 5 years indefinitely post maturity.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of PPF</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Long lock-in period of 15 years (partial withdrawals allowed after 7th yr).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Maximum investment capped at ₹1.5 Lakhs per financial year.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Interest rate is not fixed; it is revised quarterly by the Govt.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">₹500 per year (to keep account active).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Interest Calculation</th>
              <td className="p-4 text-white">Calculated on the lowest balance between the 5th and last day of every month. (Tip: Deposit before 5th).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Conservative investors, parents saving for children's education, and anyone maximizing 80C.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Most major banks (SBI, HDFC, ICICI) allow instant online PPF account opening via NetBanking.</li>
          <li>Alternatively, visit a Post Office or Bank branch with your KYC documents.</li>
          <li>Set up a standing instruction to deposit money before the 5th of every month.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. PPF is highly illiquid. Do not put your emergency funds in PPF.
        </p>
      </div>
    </div>
  );
}