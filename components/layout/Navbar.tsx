import { Bell, Search, User, Crown } from "lucide-react";
import Link from "next/link";
import LiveMarketTicker from "@/components/LiveMarketTicker";

export default function Navbar() {
  return (
    <header className="flex flex-col border-b border-slate-800 bg-[#0B0F19] z-40 sticky top-0 font-sans">
      
      {/* Tier 1: Ticker Tape & Global Alerts */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 text-xs font-medium tracking-wide tabular-nums overflow-hidden">
        <div className="flex items-center gap-2 pr-6 border-r border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-300">MARKET OPEN</span>
        </div>
        <div className="flex-1 flex items-center pl-6 text-slate-300">
          Live market snapshots from your WebSocket feed are available below.
        </div>
      </div>

      {/* Tier 1.5: Live Ticker Feed */}
      <div className="border-b border-slate-800">
        <LiveMarketTicker />
      </div>

      {/* Tier 2: Main Search & Branding */}
      <div className="h-14 flex items-center justify-between px-4 md:px-6 pl-14">
        <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded px-3 py-1.5 w-48 sm:w-80 md:w-96 focus-within:border-blue-500 transition-colors shadow-inner">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search Quotes, NAV, News, Companies..." 
            className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button className="hidden md:flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-3 py-1.5 rounded uppercase tracking-wider hover:opacity-90 transition-opacity">
            <Crown className="w-3.5 h-3.5" /> Go Pro
          </button>
          <button className="text-slate-400 hover:text-slate-100 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F19]"></span>
          </button>
          <button className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 hover:text-white transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tier 3: Sub Navigation */}
      <div className="h-10 border-t border-slate-800 flex items-center px-4 md:px-6 gap-6 text-[13px] font-semibold text-slate-400 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <Link href="/dashboard" className="text-blue-400 border-b-2 border-blue-500 h-full flex items-center">Markets Dashboard</Link>
        <Link href="/screener" className="hover:text-slate-200 transition-colors h-full flex items-center">Screener</Link>
        <Link href="/predictions" className="hover:text-slate-200 transition-colors h-full flex items-center flex items-center gap-1.5"><span className="text-amber-400">⚡ AI Ideas</span></Link>
        <Link href="/mutual-funds" className="hover:text-slate-200 transition-colors h-full flex items-center">Mutual Funds</Link>
        <Link href="/fno" className="hover:text-slate-200 transition-colors h-full flex items-center">F&O</Link>
        <Link href="/crypto" className="hover:text-slate-200 transition-colors h-full flex items-center">Crypto</Link>
        <Link href="/portfolio" className="hover:text-slate-200 transition-colors h-full flex items-center border-l border-slate-700 pl-6">Portfolio</Link>
      </div>
    </header>
  );
}