"use client";

import { AlertTriangle, PieChart, ShieldCheck, Clock, CheckCircle2, XCircle, Info, BookOpen } from "lucide-react";
import Link from "next/link";

export default function LearnMutualFundsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Digital Investment
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Mutual Funds</h1>
        <p className="text-teal-100 text-lg max-w-3xl">
          A mutual fund pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities, managed by professional fund managers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <PieChart className="h-8 w-8 text-teal-600 mb-3" />
          <h3 className="font-bold text-lg mb-2">Instant Diversification</h3>
          <p className="text-slate-400 text-sm">One mutual fund unit gives you exposure to 30-50 different companies, reducing stock-specific risk.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <ShieldCheck className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">Professionally Managed</h3>
          <p className="text-slate-400 text-sm">Expert fund managers analyze markets and rebalance the portfolio so you don't have to.</p>
        </div>
        <div className="bg-[#111827] p-5 border rounded-xl shadow-lg border border-slate-800">
          <Clock className="h-8 w-8 text-orange-500 mb-3" />
          <h3 className="font-bold text-lg mb-2">SIP Flexibility</h3>
          <p className="text-slate-400 text-sm">Invest small amounts regularly (Systematic Investment Plan) to benefit from Rupee Cost Averaging.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-100 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5"/> Pros of Mutual Funds</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Highly regulated by SEBI (very safe from fraud).</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> Start with as little as ₹100 or ₹500 per month.</li>
            <li className="flex gap-2 text-sm text-green-800"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> No Demat account required (can invest directly via AMC).</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2"><XCircle className="h-5 w-5"/> Cons of Mutual Funds</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Expense Ratio (fees) cuts into your overall returns.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Over-diversification can lead to average market returns.</li>
            <li className="flex gap-2 text-sm text-red-800"><XCircle className="h-4 w-4 shrink-0 mt-0.5"/> Exit loads apply if you withdraw money too early (usually &lt; 1 year).</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Minimum Investment</th>
              <td className="p-4 font-medium text-white">₹100 for SIP / ₹1,000 for Lumpsum</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Lock-in Period</th>
              <td className="p-4 font-medium text-white">None (except ELSS which has a 3-year lock-in)</td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Tax Treatment (Equity Funds)</th>
              <td className="p-4 text-white">
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>STCG</strong> (&lt; 1 yr): 20% on profits</li>
                  <li><strong>LTCG</strong> (&gt; 1 yr): 12.5% on profits over ₹1.25 Lakh</li>
                </ul>
              </td>
            </tr>
            <tr>
              <th className="w-1/3 bg-[#0B0F19] p-4 text-slate-300">Good For Whom?</th>
              <td className="p-4 font-medium text-white">Everyone! Ideal for busy professionals who want market returns without daily tracking.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
        <h3 className="font-bold text-xl mb-4">How to Start?</h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li>Complete your mutual fund KYC online (CAMS/KRA).</li>
          <li>Use an investment platform (Groww, Coin, Kuvera) or AMC website.</li>
          <li>Compare funds using our <Link href="/screener/mutual-funds" className="text-blue-600 hover:underline">MF Screener</Link>.</li>
          <li>Select 'Direct Plan' to save on commission fees.</li>
          <li>Set up an auto-pay mandate for your monthly SIP.</li>
        </ol>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Disclaimer:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The Net Asset Value (NAV) of schemes fluctuates based on market conditions and the underlying securities.
        </p>
      </div>
    </div>
  );
}