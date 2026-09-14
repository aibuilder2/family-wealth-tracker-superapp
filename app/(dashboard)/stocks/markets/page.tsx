"use client";

import { useState, useEffect } from "react";
import IndexWidget from "@/components/markets/IndexWidget";
import GoldSilverWidget from "@/components/markets/GoldSilverWidget";
import CurrencyWidget from "@/components/markets/CurrencyWidget";
import Link from "next/link";
import { ArrowRight, Globe2, TrendingUp, TrendingDown, Minus, Coins, Activity } from "lucide-react";

function getPythonBackendUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
  return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function MarketsOverviewPage() {
  const [marketPower, setMarketPower] = useState<any>(null);
  const [loadingPower, setLoadingPower] = useState(true);
  const [indices, setIndices] = useState<any>(null);
  const [loadingIndices, setLoadingIndices] = useState(true);

  useEffect(() => {
    const fetchMarketPower = async () => {
      try {
        const res = await fetch(getPythonBackendUrl("/api/market-power"));
        const data = await res.json();
        setMarketPower(data);
      } catch (err) {
        console.error("Failed to fetch NSE Live Data", err);
      } finally {
        setLoadingPower(false);
      }
    };

    const fetchIndices = async () => {
      try {
        const res = await fetch(getPythonBackendUrl("/markets/indices"));
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();
        setIndices(data);
      } catch (err) {
        console.error("Failed to fetch live market indices", err);
      } finally {
        setLoadingIndices(false);
      }
    };

    fetchMarketPower();
    fetchIndices();
    
    // Auto-refresh data every 5 seconds to make it truly LIVE!
    const interval = setInterval(() => {
      fetchMarketPower();
      fetchIndices();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 text-slate-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-[#111827] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400"></div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="p-3.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Globe2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Markets Overview
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mt-2 leading-relaxed font-medium">
              Live snapshot of Indian and Global markets.
            </p>
          </div>
        </div>
      </div>

      {/* Live Market Breadth (Merged from NSE page) */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">NSE Market Breadth</h2>
        </div>
        
        {loadingPower ? (
          <div className="h-24 flex items-center justify-center text-slate-400 animate-pulse border border-slate-800 rounded-xl bg-[#0B0F19]">
            Connecting to Live Python Backend...
          </div>
        ) : marketPower?.error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            Could not fetch live NSE data: {marketPower.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-emerald-400 mb-1" />
              <div className="text-3xl font-bold text-emerald-400">{marketPower?.advances}</div>
              <div className="text-xs font-bold text-emerald-500/50 mt-1 uppercase tracking-wider">Advances</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex flex-col items-center justify-center shadow-lg">
              <TrendingDown className="h-6 w-6 text-red-400 mb-1" />
              <div className="text-3xl font-bold text-red-400">{marketPower?.declines}</div>
              <div className="text-xs font-bold text-red-500/50 mt-1 uppercase tracking-wider">Declines</div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-2xl flex flex-col items-center justify-center shadow-lg">
              <Minus className="h-6 w-6 text-slate-400 mb-1" />
              <div className="text-3xl font-bold text-slate-300">{marketPower?.unchanged}</div>
              <div className="text-xs font-bold text-slate-500/50 mt-1 uppercase tracking-wider">Unchanged</div>
            </div>
          </div>
        )}
      </section>

      {/* Indices Section */}
      <section>
        <div className="flex justify-between items-end mb-6 group">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
            <TrendingUp className="w-6 h-6 text-emerald-400" /> Key Indices
          </h2>
          <Link href="/markets/indices" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-all group-hover:translate-x-1">
            View All <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
        {loadingIndices ? (
          <div className="h-24 flex items-center justify-center text-slate-400 animate-pulse border border-slate-800 rounded-xl bg-[#0B0F19]">
            Connecting to Live Index Backend...
          </div>
        ) : !indices ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
            Could not fetch live market indices data.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <IndexWidget indexName={indices?.nifty?.symbol || "NIFTY 50"} value={indices?.nifty?.ltp || 0} change={indices?.nifty?.change || 0} changePct={indices?.nifty?.change_pct || 0} />
            <IndexWidget indexName={indices?.sensex?.symbol || "SENSEX"} value={indices?.sensex?.ltp || 0} change={indices?.sensex?.change || 0} changePct={indices?.sensex?.change_pct || 0} />
            <IndexWidget indexName={indices?.banknifty?.symbol || "BANK NIFTY"} value={indices?.banknifty?.ltp || 0} change={indices?.banknifty?.change || 0} changePct={indices?.banknifty?.change_pct || 0} />
            <IndexWidget indexName={indices?.niftyit?.symbol || "NIFTY IT"} value={indices?.niftyit?.ltp || 0} change={indices?.niftyit?.change || 0} changePct={indices?.niftyit?.change_pct || 0} />
          </div>
        )}
      </section>

      {/* Commodities & Currency Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-end mb-6 group">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              <Coins className="w-6 h-6 text-amber-400" /> Precious Metals
            </h2>
            <Link href="/markets/commodities" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all group-hover:translate-x-1">
              MCX Data <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
          <GoldSilverWidget />
        </div>
        <div>
          <div className="flex justify-between items-end mb-6 group">
            <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2 tracking-tight">
              <Globe2 className="w-6 h-6 text-blue-400" /> Currency Exchange
            </h2>
            <Link href="/markets/currency" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-all group-hover:translate-x-1">
              Forex Rates <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
          <CurrencyWidget />
        </div>
      </section>
    </div>
  );
}