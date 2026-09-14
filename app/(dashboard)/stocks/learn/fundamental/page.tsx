"use client";

import { BookOpen, PieChart, Building, CheckCircle2 } from "lucide-react";

export default function LearnFundamentalPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827]/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen className="h-4 w-4" /> Deep Dive Module
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Fundamental Analysis</h1>
        <p className="text-orange-100 text-lg max-w-3xl">
          Learn how to evaluate a company's intrinsic value by examining related economic, financial, and other qualitative and quantitative factors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2"><Building className="h-6 w-6 text-orange-600"/> Qualitative Factors</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0"/> <strong>Management Quality:</strong> Is the leadership trustworthy and experienced?</li>
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0"/> <strong>Competitive Advantage (Moat):</strong> Brand value, patents, or network effects.</li>
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-green-500 shrink-0"/> <strong>Corporate Governance:</strong> How transparent is the company with its shareholders?</li>
          </ul>
        </div>

        <div className="bg-[#111827] border rounded-xl p-6 shadow-lg border border-slate-800">
          <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2"><PieChart className="h-6 w-6 text-blue-600"/> Quantitative Factors</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> <strong>Balance Sheet:</strong> Assets vs Liabilities. Is the debt manageable?</li>
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> <strong>Income Statement:</strong> Revenue growth, Operating Margins, and Net Profit.</li>
            <li className="flex gap-2 text-sm text-slate-300"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> <strong>Cash Flow Statement:</strong> Is the company actually generating cash?</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827] border rounded-xl overflow-hidden shadow-lg border border-slate-800">
        <div className="bg-[#0B0F19] border-b p-4"><h3 className="font-bold text-white">Key Financial Ratios Every Investor Must Know</h3></div>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y">
            <tr>
              <th className="w-1/3 p-4 text-white font-bold">P/E Ratio (Price to Earnings)</th>
              <td className="p-4 text-slate-300">How much you are paying for ₹1 of company's profit. Lower is generally better, but must be compared with industry peers.</td>
            </tr>
            <tr>
              <th className="w-1/3 p-4 text-white font-bold">ROE (Return on Equity)</th>
              <td className="p-4 text-slate-300">How effectively management is using shareholders' capital to generate profits. &gt;15% is considered good.</td>
            </tr>
            <tr>
              <th className="w-1/3 p-4 text-white font-bold">Debt to Equity</th>
              <td className="p-4 text-slate-300">Total debt divided by total equity. A ratio &lt; 1 means the company relies less on debt. Avoid highly leveraged companies.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}