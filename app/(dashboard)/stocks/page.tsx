'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Sparkles, BookOpen, Layers, ShieldCheck, 
  BarChart3, RefreshCw, Award, ArrowUpRight, ArrowDownRight, 
  Zap, Compass, PlayCircle, Lock, CheckCircle2, ChevronRight
} from 'lucide-react';
import Top5Card from '@/components/predictions/Top5Card';
import AccuracyTracker from '@/components/predictions/AccuracyTracker';
import FnOWatchlist from '@/components/markets/FnOWatchlist';

export default function StocksMasterHubPage() {
  const samplePrediction = {
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd',
    direction: 'up' as const,
    confidencePct: 88,
    overallScore: 8.5,
    patternDetected: 'Bullish Flag Breakout',
    reasoning: 'Strong volume breakout above 200 EMA with bullish RSI convergence.',
    dataSourceLinks: ['NSE', 'Quarterly Filings', 'Technical Momentum']
  };

  return (
    <div className="space-y-6 pb-20 p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#10263A] via-[#1a3854] to-[#10263A] border border-[#B98B2A]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B98B2A]/10 border border-[#B98B2A]/30 text-[#E5C378] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B98B2A]" /> AI Market Intelligence & Academy
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-serif">
              Stock Trading & AI Wealth Hub
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              SEBI-compliant AI End-Of-Day predictions, F&O heatmaps, virtual paper trading sandbox, aur 11-lesson zero-to-hero trading academy.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link 
              href="/stocks/predictions"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#B98B2A] to-[#D4AF37] hover:from-[#A87B1A] hover:to-[#C39E27] text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Zap className="w-4 h-4" /> AI Top 5 Predictions
            </Link>
            <Link 
              href="/stocks/learn"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#B98B2A]" /> 11-Lesson Academy
            </Link>
            <Link 
              href="/stocks/paper-trading"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              <Award className="w-4 h-4 text-emerald-400" /> Paper Trading
            </Link>
          </div>
        </div>
      </div>

      {/* SEBI Compliance Advisory */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 uppercase tracking-wide">SEBI Research Advisory: </span>
          All AI algorithmic scores, target estimations, and pattern predictions are strictly for educational research & risk analysis. Futures & Options involve high capital risk.
        </div>
      </div>

      {/* Quick Nav Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link 
          href="/stocks/predictions"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#B98B2A]/50 hover:bg-slate-800/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#E5C378]">AI Top 5 EOD Picks</h3>
          <p className="text-xs text-slate-400 mt-0.5">High-probability momentum & breakout signals</p>
        </Link>

        <Link 
          href="/stocks/learn"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#B98B2A]/50 hover:bg-slate-800/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#E5C378]">11-Lesson Academy</h3>
          <p className="text-xs text-slate-400 mt-0.5">Zero-to-Hero chapters & interactive tests</p>
        </Link>

        <Link 
          href="/stocks/markets"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#B98B2A]/50 hover:bg-slate-800/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#E5C378]">F&O Sector Power</h3>
          <p className="text-xs text-slate-400 mt-0.5">Option chain & sector strength heatmap</p>
        </Link>

        <Link 
          href="/stocks/paper-trading"
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-[#B98B2A]/50 hover:bg-slate-800/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#E5C378]">Paper Trading</h3>
          <p className="text-xs text-slate-400 mt-0.5">₹10 Lakh virtual portfolio risk-free trading</p>
        </Link>
      </div>

      {/* Main Grid: AI Predictions + Live Market Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Predictions & Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B98B2A]" /> Live AI Predictions Spotlight
            </h2>
            <Link href="/stocks/predictions" className="text-xs text-[#E5C378] hover:underline flex items-center gap-1">
              View All 50+ Tracked <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Top5Card prediction={samplePrediction as any} />

          <AccuracyTracker />
        </div>

        {/* Right 1 Col: F&O Watchlist & Academy Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> F&O Power Meter
            </h2>
            <Link href="/stocks/markets" className="text-xs text-[#E5C378] hover:underline flex items-center gap-1">
              Open Heatmap <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FnOWatchlist />

          {/* Academy Teaser Card */}
          <div className="bg-gradient-to-br from-[#10263A] to-slate-900 border border-[#B98B2A]/20 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#B98B2A]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">11-Lesson Trading Academy</h3>
                <p className="text-xs text-slate-400">Learn Stocks, Options, Risk Management</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Har chapter ke baad ek practical test hai jisko pass karke aap agle level par jaate hain aur apna certificate unlock karte hain.
            </p>

            <Link
              href="/stocks/learn"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-[#E5C378] text-xs font-bold rounded-lg border border-[#B98B2A]/30 transition-all"
            >
              Start Learning (0 Se Seekho) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
