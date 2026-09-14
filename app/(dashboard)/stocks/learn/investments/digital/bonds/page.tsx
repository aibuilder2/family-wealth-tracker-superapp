"use client";

import { AlertTriangle, Landmark, Shield, CheckCircle2, XCircle, Info, BookOpen } from "lucide-react";

export default function LearnBondsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-slate-600 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Bonds & Debentures</h1>
        <p className="text-gray-200 text-lg max-w-3xl">
          When you buy a bond, you are essentially lending money to the government or a corporation. In return, they promise to pay you regular interest (coupon) and return the principal upon maturity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Shield className="h-8 w-8 text-slate-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Capital Preservation</h3>
          <p className="text-slate-400 text-sm">Bonds (especially Government bonds) are generally much safer than stocks, protecting your initial capital.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Landmark className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Fixed Income</h3>
          <p className="text-slate-400 text-sm">You receive a predictable, fixed rate of interest (coupon payments) annually or semi-annually.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Info className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Portfolio Hedge</h3>
          <p className="text-slate-400 text-sm">Bonds often move inversely to stocks, providing stability to your portfolio during stock market crashes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Bonds</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Predictable and stable cash flow.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Sovereign bonds (G-Secs) have virtually zero default risk.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Often offer higher interest rates than Bank FDs.</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Bonds</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Corporate bonds carry credit/default risk.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Interest rate risk (Bond prices fall when repo rates rise).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Less liquid than stocks; hard to sell before maturity.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Types of Bonds</th>
              <td className="p-4 font-medium text-white">G-Secs, State Govt Bonds (SDL), Corporate Bonds, Sovereign Gold Bonds (SGB).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Risk Level</th>
              <td className="p-4 font-medium text-white">Low (G-Secs) to Moderate (Corporate).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment</th>
              <td className="p-4 text-white">Interest is taxed as per your income tax slab. Capital gains apply if traded on exchange. SGB maturity is tax-free.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Retirees, conservative investors, or anyone looking to balance a high-equity portfolio.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>You can buy G-Secs directly via RBI Retail Direct portal.</li>
          <li>Many stock brokers (Zerodha Coin, NSE goBID) allow buying bonds easily.</li>
          <li>Check the Credit Rating (CRISIL, ICRA) before buying corporate bonds (Look for AAA or AA+).</li>
          <li>Alternatively, invest via Debt Mutual Funds for easier management.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Not an investment advice. High-yield corporate bonds carry significant risk of default. Always verify credit ratings.
        </p>
      </div>
    </div>
  );
}