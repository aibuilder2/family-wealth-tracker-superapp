"use client";

import { Link as LinkIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BrokerConnect() {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 text-center">
      <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <LinkIcon className="h-6 w-6" />
      </div>
      <h3 className="font-bold text-lg text-white mb-2">Connect Your Broker</h3>
      <p className="text-sm text-slate-400 mb-4">Sync your Zerodha or Groww account to automate portfolio tracking.</p>
      <Link href="/portfolio/connect" className="inline-block bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition">
        Connect Now
      </Link>
      <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
        <ShieldCheck className="h-3 w-3" /> 256-bit secure encryption
      </div>
    </div>
  );
}