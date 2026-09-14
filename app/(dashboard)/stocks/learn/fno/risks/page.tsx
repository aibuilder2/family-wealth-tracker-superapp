"use client";

import { AlertTriangle, TrendingDown, Skull, Percent, Info } from "lucide-react";

export default function FnoRisksPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-red-50 border-l-4 border-red-600 p-6 md:p-8 rounded-r-xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-3 mb-4 text-red-700">
          <Skull className="h-8 w-8" />
          <h1 className="text-3xl font-extrabold">The Reality of F&O Risks</h1>
        </div>
        <p className="text-red-900 text-lg font-medium leading-relaxed">
          Derivatives are not investments; they are highly leveraged speculative instruments. Before deploying a single rupee, understand the math of ruin.
        </p>
      </div>

      {/* The SEBI Report Breakdown */}
      <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <div className="bg-[#0B0F19] border-b p-5">
          <h2 className="text-xl font-bold text-white">Decoding the SEBI Report</h2>
          <p className="text-sm text-slate-400 mt-1">Based on SEBI's study of individual traders in the Equity F&O segment.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="font-extrabold text-red-600 text-xl">89%</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Traders Lose Money</h3>
              <p className="text-slate-400 text-sm mt-1">9 out of 10 retail traders incur net losses. Only 11% manage to make a profit.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Average Loss: ₹50,000</h3>
              <p className="text-slate-400 text-sm mt-1">The average lossmaker loses around ₹50,000. Many lose their entire life savings chasing quick gains.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Transaction Costs Eat Profits</h3>
              <p className="text-slate-400 text-sm mt-1">Even the 11% who make profits pay 15% to 50% of their profits in Brokerage, STT, Exchange Fees, and Taxes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Reasons for Failure */}
      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-6">Why Do 90% Fail?</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-[#0B0F19]">
            <h4 className="font-bold text-white mb-2">1. Naked Option Buying (Hero or Zero)</h4>
            <p className="text-sm text-slate-400">Retailers love buying cheap Out-of-The-Money (OTM) options hoping for a lottery. Because of "Time Decay" (Theta), these options almost always expire worthless (at ₹0).</p>
          </div>
          <div className="p-4 border rounded-lg bg-[#0B0F19]">
            <h4 className="font-bold text-white mb-2">2. Revenge Trading</h4>
            <p className="text-sm text-slate-400">Losing a trade leads to emotional decisions. Traders double their bet size to recover losses, leading to account blowouts in a single day.</p>
          </div>
          <div className="p-4 border rounded-lg bg-[#0B0F19]">
            <h4 className="font-bold text-white mb-2">3. Not Understanding Greeks</h4>
            <p className="text-sm text-slate-400">In options, direction is not enough. You must get the direction right, AND the timing right, AND volatility must be in your favor. If a stock moves sideways, the option buyer loses.</p>
          </div>
        </div>
      </div>

    </div>
  );
}