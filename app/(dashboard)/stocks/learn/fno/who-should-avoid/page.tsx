"use client";

import { ShieldAlert, CheckSquare, XSquare, HandHeart, BookOpen } from "lucide-react";
import Link from "next/link";

export default function WhoShouldAvoidFnoPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <div className="bg-red-600 rounded-2xl p-8 text-white shadow-lg text-center">
        <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-red-200" />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Who Should AVOID F&O Trading?</h1>
        <p className="text-red-100 text-lg max-w-2xl mx-auto">
          F&O is not for everyone. If you tick any of the boxes below, we strongly recommend you stay away from Futures and Options and focus on cash equity or mutual funds.
        </p>
      </div>

      <div className="bg-[#111827] border-2 border-red-100 rounded-xl p-6 shadow-lg border border-slate-800 max-w-3xl mx-auto">
        <h3 className="font-bold text-xl text-white mb-6 border-b pb-4">Checklist: Stay Away If You...</h3>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <XSquare className="h-6 w-6 text-red-500 shrink-0" />
            <div><strong className="text-white block">Are trading with borrowed money</strong><span className="text-sm text-slate-400">Trading with loans or credit cards guarantees emotional stress and terrible decisions.</span></div>
          </li>
          <li className="flex items-start gap-3">
            <XSquare className="h-6 w-6 text-red-500 shrink-0" />
            <div><strong className="text-white block">Don't understand Greeks (Theta, Delta)</strong><span className="text-sm text-slate-400">If you don't know why an option premium falls when the market stays flat, you will lose money.</span></div>
          </li>
          <li className="flex items-start gap-3">
            <XSquare className="h-6 w-6 text-red-500 shrink-0" />
            <div><strong className="text-white block">Can't handle seeing a -50% loss</strong><span className="text-sm text-slate-400">Options can lose half their value in an hour. If you panic sell, F&O is not for you.</span></div>
          </li>
          <li className="flex items-start gap-3">
            <XSquare className="h-6 w-6 text-red-500 shrink-0" />
            <div><strong className="text-white block">Don't have a strict Stop-Loss system</strong><span className="text-sm text-slate-400">Hope is not a strategy in F&O. If you hold losing positions hoping they recover, you will blow your account.</span></div>
          </li>
          <li className="flex items-start gap-3">
            <XSquare className="h-6 w-6 text-red-500 shrink-0" />
            <div><strong className="text-white block">Are looking to get rich quick</strong><span className="text-sm text-slate-400">F&O is sold as a lottery ticket by finfluencers. In reality, it is a highly disciplined business.</span></div>
          </li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg border border-slate-800 max-w-3xl mx-auto text-center">
        <HandHeart className="h-10 w-10 mx-auto text-green-600 mb-3" />
        <h3 className="font-bold text-xl text-green-900 mb-2">What should you do instead?</h3>
        <p className="text-green-800 text-sm mb-6">
          Wealth is built slowly. Start with Mutual Funds (SIPs), move to large-cap stocks (Delivery), and focus on increasing your primary source of income.
        </p>
        <Link href="/learn/investments/digital/mutual-funds" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition">
          Learn about Mutual Funds
        </Link>
      </div>

    </div>
  );
}