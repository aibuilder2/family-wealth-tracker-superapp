"use client";

import { TrendingDown, Users, AlertTriangle } from "lucide-react";

export default function LossStatistics() {
  return (
    <div className="bg-[#111827] border border-red-100 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
      <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
        <AlertTriangle className="h-8 w-8 text-red-600 shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold text-red-900 mb-2">SEBI Official Study (2023)</h2>
          <p className="text-red-800 text-sm leading-relaxed">
            The Securities and Exchange Board of India (SEBI) analyzed individual traders in the Equity F&O segment. The reality is harsh for retail traders.
          </p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center p-6 bg-[#0B0F19] rounded-xl border text-center">
          <div className="relative w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-red-600 absolute opacity-20" />
            <span className="text-3xl font-extrabold text-red-700">89%</span>
          </div>
          <h3 className="font-bold text-white mb-1">Loss Makers</h3>
          <p className="text-xs text-slate-400">9 out of 10 individual retail traders incur net losses in the F&O segment.</p>
        </div>
        
        <div className="flex flex-col items-center justify-center p-6 bg-[#0B0F19] rounded-xl border text-center">
          <div className="relative w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <TrendingDown className="h-10 w-10 text-orange-600 absolute opacity-20" />
            <span className="text-xl font-extrabold text-orange-700">₹50K</span>
          </div>
          <h3 className="font-bold text-white mb-1">Average Loss</h3>
          <p className="text-xs text-slate-400">The average loss-maker registers net trading losses of close to ₹50,000.</p>
        </div>
      </div>
      
      <div className="bg-[#0B0F19] px-6 py-4 text-xs text-slate-400 text-center border-t">
        * Over and above these net trading losses, traders incur an additional 28% of net trading losses as transaction costs.
      </div>
    </div>
  );
}
