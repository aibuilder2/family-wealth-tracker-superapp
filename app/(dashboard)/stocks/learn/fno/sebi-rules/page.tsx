"use client";

import { Scale, AlertCircle, FileText, ShieldCheck, BookOpen } from "lucide-react";

export default function SebiRulesPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> F&O Module
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">SEBI Rules & Regulations</h1>
        <p className="text-blue-100 text-lg max-w-3xl">
          The Securities and Exchange Board of India (SEBI) has implemented strict rules to protect retail investors from extreme leverage and risks in the F&O segment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2"><Scale className="h-6 w-6 text-blue-600"/> 100% Peak Margin Rule</h3>
          <p className="text-slate-400 text-sm mb-4">
            Earlier, brokers used to provide 10x to 50x leverage for intraday trading. Now, SEBI mandates brokers to collect 100% of the required margin upfront. 
            If your account falls short during the day, a heavy margin penalty is levied.
          </p>
        </div>

        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2"><FileText className="h-6 w-6 text-purple-600"/> Physical Settlement</h3>
          <p className="text-slate-400 text-sm mb-4">
            If you hold stock futures or In-The-Money (ITM) options until expiry, you MUST take or give physical delivery of the actual shares. 
            This requires huge capital. Always square off your positions before expiry to avoid this.
          </p>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-green-600"/> Margin Pledge</h2>
        <p className="text-slate-400 text-sm mb-4">
          You don't need cash to trade F&O. You can pledge your existing stocks, Mutual Funds, or SGBs to get collateral margin. 
          However, SEBI requires that at least 50% of the margin must come from cash or cash-equivalents (like Liquid Funds or FDs).
        </p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl shadow-lg border border-slate-800 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-red-900 text-lg mb-2">Ban Period (F&O Ban)</h3>
          <p className="text-red-800 text-sm leading-relaxed">
            When the open interest (OI) of a stock crosses 95% of the market-wide position limit (MWPL), the exchange puts the stock in the "F&O Ban" list. 
            <br/><br/>
            <strong>Rule:</strong> You cannot open any NEW positions in that stock. You can only square off existing positions. 
            If you violate this, the exchange imposes a penalty of ₹5,000 per contract (up to ₹1 Lakh).
          </p>
        </div>
      </div>

      <div className="text-center text-sm text-slate-400 mt-8">
        Rules are updated dynamically based on SEBI circulars. Always check with your broker for the latest margin requirements.
      </div>
    </div>
  );
}
