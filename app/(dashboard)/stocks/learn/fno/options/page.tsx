"use client";

import { AlertTriangle, Tag, Zap, CheckCircle2, XCircle, HelpCircle, BookOpen } from "lucide-react";
import FnoRiskGate from "@/components/learn/FnoRiskGate";

export default function LearnOptionsPage() {
  return (
    <FnoRiskGate>
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> F&O Module
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Options Trading</h1>
        <p className="text-purple-100 text-lg max-w-3xl">
          An Option contract gives you the right, but not the obligation, to buy (Call) or sell (Put) an underlying asset at a specific price on a specific date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800 border-l-4 border-l-green-500">
          <TrendingUpIcon className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Call Option (CE)</h3>
          <p className="text-slate-400 text-sm">You buy a CE when you expect the market/stock to go <strong>UP</strong>. It gives you the right to buy at a locked price.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800 border-l-4 border-l-red-500">
          <TrendingDownIcon className="h-8 w-8 text-red-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Put Option (PE)</h3>
          <p className="text-slate-400 text-sm">You buy a PE when you expect the market/stock to go <strong>DOWN</strong>. It gives you the right to sell at a locked price.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Options Buying</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Risk is strictly limited to the Premium paid.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Potential for unlimited profits (100% to 1000%+ returns on premium).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Requires very low capital to start (sometimes just ₹2,000 - ₹5,000).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Options Buying</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Time Decay (Theta) eats the premium every day.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Very low probability of winning (~33%). If market stays flat, you lose.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Highly addictive and often treated like gambling by retailers.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Option Buying vs Selling</th>
              <td className="p-4 text-white">
                <strong>Buyers</strong> pay premium, have limited risk, low win probability.<br/>
                <strong>Sellers (Writers)</strong> collect premium, have unlimited risk, high win probability.
              </td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">The Greeks</th>
              <td className="p-4 text-white">Options pricing depends on Delta (Price), Theta (Time), Vega (Volatility), and Gamma.</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Strictly for experts. 9 out of 10 beginners lose their entire capital in options buying.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-red-100 p-4 rounded-lg border border-red-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <p className="text-xs text-red-800 leading-relaxed">
          <strong>Zero-Sum Game Warning:</strong> Options trading is a zero-sum game. The money you lose goes directly to the institutional Option Sellers who have algorithms, faster execution, and millions in capital. Please use our Paper Trading simulator before risking real money.
        </p>
      </div>
    </div>
    </FnoRiskGate>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function TrendingDownIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}