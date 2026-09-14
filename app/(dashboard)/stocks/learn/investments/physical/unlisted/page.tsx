"use client";

import { AlertTriangle, Ghost, Rocket, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnUnlistedPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Physical/Alternative
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Unlisted Shares (Pre-IPO)</h1>
        <p className="text-gray-300 text-lg max-w-3xl">
          Buying shares of a company before it goes public and lists on the stock exchanges (BSE/NSE). These are mostly startups or large private entities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Rocket className="h-8 w-8 text-indigo-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Massive Growth Potential</h3>
          <p className="text-slate-400 text-sm">Getting in early on a successful company can yield astronomical returns when they finally launch an IPO.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Ghost className="h-8 w-8 text-red-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Hidden & Opaque</h3>
          <p className="text-slate-400 text-sm">Private companies are not mandated by SEBI to disclose financials publicly, making research very difficult.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Unlisted Shares</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Opportunity to grab multi-baggers before the retail crowd.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Access to exciting sectors (like new-age tech startups).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> High listing gains if the IPO is heavily oversubscribed.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Unlisted Shares</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> High risk of total capital loss if the startup fails.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Extremely illiquid. You cannot easily find a buyer to exit.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> 6-month lock-in period after the IPO listing.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">Usually high. Brokers require a minimum ticket size of ₹25,000 to ₹5 Lakhs.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment</th>
              <td className="p-4 text-white">LTCG applies after 24 months (unlisted equity rules apply, which are taxed at 20% with indexation).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">HNIs, Angel Investors, and experienced traders who understand venture capital risks.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>You cannot buy them on Zerodha or Upstox.</li>
          <li>You must use specialized unlisted share brokers or platforms (e.g., Altius, UnlistedZone).</li>
          <li>Complete KYC and transfer funds. The broker transfers shares directly to your Demat account (Off-market transfer).</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Warning:</strong> Pre-IPO grey markets are unregulated by SEBI. Scams are prevalent where brokers take money but do not transfer shares. Proceed with extreme caution.
        </p>
      </div>
    </div>
  );
}