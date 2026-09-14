"use client";

import { AlertTriangle, Bitcoin, ShieldAlert, CheckCircle2, XCircle, BookOpen } from "lucide-react";

export default function LearnCryptoPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-zinc-800 to-black rounded-2xl p-8 text-white shadow-lg border border-zinc-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-zinc-600">
          <BookOpen className="h-4 w-4" /> Digital / Alternative
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-yellow-500">Cryptocurrency</h1>
        <p className="text-gray-300 text-lg max-w-3xl">
          Decentralized digital assets based on blockchain technology. The most volatile and high-risk asset class available to retail investors today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Bitcoin className="h-8 w-8 text-yellow-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Decentralization</h3>
          <p className="text-slate-400 text-sm">Not controlled by any central bank or government. Value is determined purely by supply and market demand.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldAlert className="h-8 w-8 text-red-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Extreme Volatility</h3>
          <p className="text-slate-400 text-sm">It is common for cryptocurrencies to drop 50% to 80% in a bear market, or surge 1000% in a bull run.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Crypto</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> 24/7 Market. You can trade anytime, anywhere in the world.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Unmatched historical returns (e.g., Bitcoin's growth over the last decade).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Complete self-custody if you use hardware wallets (No bank can freeze it).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons & Risks</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Punishing Tax in India (Flat 30% tax on profits + 1% TDS. Losses cannot be set off).</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Regulatory uncertainty. Governments can restrict or ban usage anytime.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Extremely high risk of scams, hacks, and rug pulls in altcoins.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">Can buy fractions. Start with as low as ₹100.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Storage / Custody</th>
              <td className="p-4 text-white">Centralized Exchanges (Binance, CoinDCX) or Decentralized Hardware Wallets (Ledger, Trezor).</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Only for high-risk investors. Allocate max 1-5% of your total portfolio here.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
        <p className="text-sm text-red-800 leading-relaxed">
          <strong>Strict Warning:</strong> 99% of new crypto coins (Altcoins/Meme coins) fail or are outright scams. 
          If you must invest, stick to the absolute blue chips (Bitcoin and Ethereum). 
          <br className="mb-2"/>
          <em>"Not your keys, not your coins."</em> If an exchange goes bankrupt (like FTX), your money is gone forever.
        </p>
      </div>
    </div>
  );
}