"use client";

import CurrencyWidget from "@/components/markets/CurrencyWidget";
import { DollarSign, LineChart } from "lucide-react";

export default function CurrencyPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-green-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Forex & Currency Markets</h1>
          <p className="text-sm text-slate-400">Track USD, EUR, and GBP against INR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencyWidget />
        
        <div className="bg-[#0B0F19] border border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <LineChart className="h-12 w-12 mb-3 opacity-20" />
          <p className="font-medium">Advanced Forex Charting</p>
          <p className="text-sm mt-1">Select a currency pair from the widget to view historical trends here.</p>
        </div>
      </div>
    </div>
  );
}