"use client";

import { AlertTriangle, Wheat, Droplet, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnCommoditiesPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Physical / Derivatives
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Commodities Trading</h1>
        <p className="text-yellow-100 text-lg max-w-3xl">
          Trading in raw materials or primary agricultural products like Crude Oil, Natural Gas, Cotton, Mentha Oil, and Base Metals (Copper, Zinc).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Droplet className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Energy & Metals (MCX)</h3>
          <p className="text-slate-400 text-sm">Highly volatile markets driven by global geopolitics, OPEC decisions, and global supply chains.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Wheat className="h-8 w-8 text-yellow-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Agricultural (NCDEX)</h3>
          <p className="text-slate-400 text-sm">Prices depend heavily on weather conditions, monsoons, and government export/import policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Commodities</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> High leverage available (trade big quantities with less margin).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Portfolio diversification (commodities don't always move with equities).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Trading hours are longer (MCX is open till 11:30 PM).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Commodities</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Extremely volatile and risky. Margin calls can wipe out accounts quickly.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Complex factors to track (Global weather, wars, USD exchange rates).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Futures contracts expire, meaning you cannot "hold forever".</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">How it's traded</th>
              <td className="p-4 font-medium text-white">Mostly through Futures and Options (F&O) contracts. You don't take physical delivery of Crude Oil!</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Exchanges</th>
              <td className="p-4 text-white">MCX (Multi Commodity Exchange) & NCDEX (National Commodity & Derivatives Exchange).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Active day traders, speculators, and commercial hedgers (like farmers or jewelers).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Enable the "Commodities" segment in your Demat/Trading account.</li>
          <li>Submit income proof (ITR, Bank Statement) to activate derivative trading.</li>
          <li>Add funds (Margin) to your account.</li>
          <li>Trade Crude Oil or Gold futures on the MCX.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Educational Disclaimer:</strong> Commodities trading via derivatives carries extreme risk. Only trade with money you are fully prepared to lose.
        </p>
      </div>
    </div>
  );
}