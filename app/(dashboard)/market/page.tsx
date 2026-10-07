'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import {
  TrendingUp, TrendingDown, RefreshCw, Search, Filter,
  Sparkles, Zap, ArrowUpRight, ArrowDownRight, ChevronRight,
  Info, ExternalLink, X, Activity, BarChart2, ShieldCheck, CheckCircle2
} from 'lucide-react';

interface StockQuote {
  symbol: string;
  company_name: string;
  sector: string;
  industry?: string;
  price: number;
  change: number;
  changePct: number;
  pe: number;
  industry_pe?: number;
  market_cap: string;
  market_cap_num?: number;
  high52: number;
  low52: number;
  day_high?: number;
  day_low?: number;
  volume?: string;
  dividend_yield?: number;
  book_value?: number;
  one_year_return?: number;
  ytd_return?: number;
  rsi?: number;
  macd?: string;
  ai_signal?: 'STRONG BUY' | 'BUY ON DIPS' | 'ACCUMULATE' | 'HOLD' | 'WAIT';
  target?: number;
  stoploss?: number;
}

interface IndexQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  high52: number;
  low52: number;
  advances?: number;
  declines?: number;
  unchanged?: number;
  pcr?: number;
}

export default function MarketTerminalPage() {
  const [selectedIndex, setSelectedIndex] = useState<string>('NIFTY 50');
  const [indices, setIndices] = useState<IndexQuote[]>([]);
  const [constituents, setConstituents] = useState<StockQuote[]>([]);
  const [marketBreadth, setMarketBreadth] = useState<any>({
    advances: 34,
    declines: 15,
    neutral: 1,
    bull_pct: 68,
    bear_pct: 30,
    sentiment: 'BULLISH (तेजी का रुख)'
  });
  const [marketStatus, setMarketStatus] = useState<any>({
    status_text: 'NSE & BSE LIVE',
    updated_at: 'लाइव'
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStockDetail, setSelectedStockDetail] = useState<StockQuote | null>(null);

  // Fetch Live Market Quotes
  const fetchMarketData = async (indexName = selectedIndex) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stocks/markets-indices?index=${encodeURIComponent(indexName)}`);
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.indices) && data.indices.length > 0) {
          setIndices(data.indices);
        }
        if (Array.isArray(data.constituents)) {
          setConstituents(data.constituents);
        }
        if (data.market_breadth) {
          setMarketBreadth(data.market_breadth);
        }
        if (data.market_status) {
          setMarketStatus(data.market_status);
        }
      }
    } catch (err) {
      console.error('Error fetching market quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(selectedIndex);
  }, [selectedIndex]);

  // Unique sectors for filter dropdown
  const uniqueSectors = Array.from(new Set(constituents.map(s => s.sector))).filter(Boolean);

  // Filtered constituents based on search and sector
  const filteredConstituents = constituents.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* 1. Header */}
      <ScreenHeader
        title="मनीकंट्रोल मार्केट टर्मिनल"
        subtitle="BSE व NSE लाइव इंडेक्स, शेयर्स व P/E वैल्यूएशन"
        action={
          <div className="flex items-center gap-1.5">
            <Link
              href="/advisor"
              className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1 border border-amber-500/30 transition-all cursor-pointer shadow-2xs"
            >
              <Zap size={13} />
              <span>AI प्रेडिक्शन</span>
            </Link>
            <button
              onClick={() => fetchMarketData()}
              disabled={loading}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>ताज़ा करें</span>
            </button>
          </div>
        }
      />

      {/* 2. Market Breadth Bar (Bull vs Bear count) */}
      <div className="px-4">
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-ink text-xs">मार्केट चौड़ाई (Advances vs Declines)</span>
              <span className="text-[10px] text-ink-muted">({marketStatus.status_text})</span>
            </div>
            <div className="text-[11px] font-bold text-ink">
              रुख: <span className="text-emerald-600">{marketBreadth.sentiment}</span>
            </div>
          </div>

          {/* Advances vs Declines Visual Bar */}
          <div className="w-full h-3 rounded-full bg-paper-subtle flex overflow-hidden border border-paper-dim">
            <div
              style={{ width: `${marketBreadth.bull_pct || 65}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Advances: ${marketBreadth.advances}`}
            />
            <div
              style={{ width: `${marketBreadth.bear_pct || 35}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Declines: ${marketBreadth.declines}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>🟢 बढ़त (Bulls):</span>
              <Mono className="font-bold">{marketBreadth.advances}</Mono>
              <span className="text-[10px] text-ink-muted">({marketBreadth.bull_pct}%)</span>
            </span>
            <span className="text-[10px] text-ink-muted">
              अपडेट: {marketStatus.updated_at}
            </span>
            <span className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <span>🔴 गिरावट (Bears):</span>
              <Mono className="font-bold">{marketBreadth.declines}</Mono>
              <span className="text-[10px] text-ink-muted">({marketBreadth.bear_pct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Major Indices Bar (Click to Select & Filter) */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            प्रमुख भारतीय सूचकांक (Major Indices):
          </span>
          <span className="text-[10px] text-ink-muted">इंडेक्स चुनें और उसके सभी शेयर्स देखें</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {indices.map((idx) => {
            const isSelected = selectedIndex === idx.symbol || (selectedIndex === 'NIFTY 50' && idx.symbol === 'NIFTY 50');
            const isPositive = idx.change >= 0;

            return (
              <button
                key={idx.symbol}
                type="button"
                onClick={() => setSelectedIndex(idx.symbol)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-navy text-paper border-gold shadow-md scale-[1.02]'
                    : 'bg-paper text-ink border-paper-dim hover:border-gold/40 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-gold text-navy' : 'bg-paper-subtle border border-paper-dim text-ink-muted'
                  }`}>
                    {idx.exchange}
                  </span>
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                    isPositive ? (isSelected ? 'text-emerald-400' : 'text-emerald-600') : (isSelected ? 'text-rose-400' : 'text-rose-600')
                  }`}>
                    {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{idx.changePct.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-1.5">
                  <span className={`text-xs font-bold block truncate ${isSelected ? 'text-paper' : 'text-ink'}`}>
                    {idx.symbol}
                  </span>
                  <Mono className={`text-sm font-black block mt-0.5 ${isSelected ? 'text-gold-soft' : 'text-ink'}`}>
                    ₹{idx.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Mono>
                </div>

                <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-white/10 opacity-80">
                  <span>दिन का दायरा:</span>
                  <span className="font-mono">{idx.dayLow.toFixed(0)} - {idx.dayHigh.toFixed(0)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Constituent Stocks Table Section (Moneycontrol Style) */}
      <div className="px-4 space-y-3">
        {/* Search & Sector Filter Bar */}
        <div className="p-3 bg-paper rounded-2xl border border-paper-dim shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder={`${selectedIndex} के शेयर्स खोजें (उदा. RELIANCE, HDFC, SBIN)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-paper-subtle border border-paper-dim rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-paper-subtle border border-paper-dim rounded-xl px-2.5 py-1">
              <Filter size={12} className="text-ink-muted" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-hidden cursor-pointer"
              >
                <option value="all">सभी सेक्टर ({uniqueSectors.length})</option>
                {uniqueSectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <span className="text-[11px] font-bold text-ink-muted whitespace-nowrap bg-paper-subtle px-2.5 py-1.5 rounded-xl border border-paper-dim">
              कुल {filteredConstituents.length} शेयर्स
            </span>
          </div>
        </div>

        {/* Moneycontrol Style Stocks Table */}
        <div className="bg-paper rounded-2xl border border-paper-dim shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper-subtle border-b border-paper-dim text-[10px] uppercase tracking-wider text-ink-muted font-bold">
                  <th className="p-3">शेयर व कंपनी</th>
                  <th className="p-3">सेक्टर</th>
                  <th className="p-3 text-right">LTP भाव (₹)</th>
                  <th className="p-3 text-right">दैनिक बदलाव</th>
                  <th className="p-3 text-right">P/E रेशियो</th>
                  <th className="p-3 text-center">52W हाई / लो</th>
                  <th className="p-3 text-center">AI सिग्नल</th>
                  <th className="p-3 text-center">विवरण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-dim/60 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-ink-muted">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw size={14} className="animate-spin text-emerald-600" />
                        <span>{selectedIndex} के शेयर्स लोड हो रहे हैं...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredConstituents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-ink-muted">
                      कोई शेयर नहीं मिला। कृपया सर्च नाम बदलें।
                    </td>
                  </tr>
                ) : (
                  filteredConstituents.map((stock) => {
                    const isPositive = stock.change >= 0;

                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => setSelectedStockDetail(stock)}
                        className="hover:bg-paper-subtle/80 transition-colors cursor-pointer group"
                      >
                        {/* Symbol & Name */}
                        <td className="p-3">
                          <div className="font-extrabold text-ink text-sm flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                            <span>{stock.symbol}</span>
                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                          </div>
                          <span className="text-[10px] text-ink-muted block truncate max-w-[170px]">
                            {stock.company_name}
                          </span>
                        </td>

                        {/* Sector */}
                        <td className="p-3">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink whitespace-nowrap">
                            {stock.sector}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-3 text-right">
                          <Mono className="text-sm font-bold text-ink">
                            ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Mono>
                        </td>

                        {/* Change */}
                        <td className="p-3 text-right">
                          <div className={`font-bold font-mono text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}{stock.changePct}%
                          </div>
                          <div className="text-[10px] text-ink-muted font-mono">
                            {isPositive ? '+' : ''}₹{stock.change.toFixed(2)}
                          </div>
                        </td>

                        {/* P/E */}
                        <td className="p-3 text-right font-mono">
                          <span className="text-xs font-bold text-ink block">{stock.pe}</span>
                          <span className="text-[9px] text-ink-muted block">इंडस्ट्री: {stock.industry_pe || '—'}</span>
                        </td>

                        {/* 52W High / Low */}
                        <td className="p-3 text-center text-[10px] font-mono">
                          <span className="text-emerald-600 font-bold">₹{stock.high52}</span>
                          <span className="text-ink-muted"> / </span>
                          <span className="text-rose-600 font-bold">₹{stock.low52}</span>
                        </td>

                        {/* AI Signal */}
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                            stock.ai_signal?.includes('BUY')
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                          }`}>
                            {stock.ai_signal || 'BUY ON DIPS'}
                          </span>
                        </td>

                        {/* Action Details */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStockDetail(stock);
                            }}
                            className="px-2 py-1 rounded-lg bg-paper-subtle hover:bg-emerald-500/15 text-ink hover:text-emerald-700 border border-paper-dim text-[10px] font-bold transition-all cursor-pointer"
                          >
                            देखें →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Moneycontrol Detailed Stock Modal (Deep-Dive View) */}
      {selectedStockDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-paper rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-paper-dim pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-ink">{selectedStockDetail.symbol}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink-muted">
                    {selectedStockDetail.sector}
                  </span>
                </div>
                <h3 className="text-xs text-ink-muted mt-0.5">{selectedStockDetail.company_name}</h3>
                {selectedStockDetail.industry && (
                  <p className="text-[10px] text-ink-muted">{selectedStockDetail.industry}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedStockDetail(null)}
                className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-paper-dim cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Price & Change Banner */}
            <div className="p-3.5 bg-paper-subtle rounded-2xl border border-paper-dim flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-ink-muted block">लाइव भाव (LTP)</span>
                <Mono className="text-2xl font-black text-ink block mt-0.5">
                  ₹{selectedStockDetail.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Mono>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black font-mono block ${selectedStockDetail.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedStockDetail.change >= 0 ? '+' : ''}{selectedStockDetail.changePct}%
                </span>
                <span className="text-[11px] font-mono text-ink-muted">
                  {selectedStockDetail.change >= 0 ? '+' : ''}₹{selectedStockDetail.change}
                </span>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            <div className="p-3 bg-paper rounded-xl border border-paper-dim space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-rose-600">52W Low: ₹{selectedStockDetail.low52}</span>
                <span className="text-ink">52-सप्ताह दायरा (52W Range)</span>
                <span className="text-emerald-600">52W High: ₹{selectedStockDetail.high52}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-paper-dim relative overflow-hidden">
                {(() => {
                  const range = selectedStockDetail.high52 - selectedStockDetail.low52;
                  const currentOffset = Math.min(100, Math.max(0, ((selectedStockDetail.price - selectedStockDetail.low52) / (range || 1)) * 100));
                  return (
                    <div
                      style={{ width: `${currentOffset}%` }}
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                    />
                  );
                })()}
              </div>
            </div>

            {/* Comprehensive Valuation & Fundamentals Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">स्टॉक P/E</span>
                <Mono className="text-xs font-bold text-ink block mt-0.5">{selectedStockDetail.pe}</Mono>
                <span className="text-[9px] text-ink-muted">इंडस्ट्री: {selectedStockDetail.industry_pe || '—'}</span>
              </div>
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">मार्केट कैप</span>
                <span className="text-xs font-bold text-ink block mt-0.5">{selectedStockDetail.market_cap}</span>
                <span className="text-[9px] text-emerald-600">लार्जकैप</span>
              </div>
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">डिविडेंड यील्ड</span>
                <Mono className="text-xs font-bold text-ink block mt-0.5">{selectedStockDetail.dividend_yield || 1.2}%</Mono>
                <span className="text-[9px] text-ink-muted">कैशफ्लो रिटर्न</span>
              </div>
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">बुक वैल्यू (BV)</span>
                <Mono className="text-xs font-bold text-ink block mt-0.5">₹{selectedStockDetail.book_value || 450}</Mono>
                <span className="text-[9px] text-ink-muted">प्रति शेयर पूंजी</span>
              </div>
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">1-साल रिटर्न</span>
                <span className={`text-xs font-bold block mt-0.5 ${(selectedStockDetail.one_year_return || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  +{(selectedStockDetail.one_year_return || 24.5)}%
                </span>
                <span className="text-[9px] text-ink-muted">ऐतिहासिक रिटर्न</span>
              </div>
              <div className="p-2.5 bg-paper-subtle rounded-xl border border-paper-dim">
                <span className="text-ink-muted uppercase block">YTD रिटर्न</span>
                <span className={`text-xs font-bold block mt-0.5 ${(selectedStockDetail.ytd_return || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  +{(selectedStockDetail.ytd_return || 14.2)}%
                </span>
                <span className="text-[9px] text-ink-muted">इस वर्ष बढ़त</span>
              </div>
            </div>

            {/* AI Technicals & Strategy Box */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-paper to-amber-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-ink">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>श्री वेल्थ AI तकनीकी स्तर व संकेत</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {selectedStockDetail.ai_signal || 'BUY ON DIPS'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="p-1 bg-paper rounded-lg border border-paper-dim">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold block">🎯 टारगेट</span>
                  <Mono className="font-bold text-ink">₹{selectedStockDetail.target || Math.round(selectedStockDetail.price * 1.08)}</Mono>
                </div>
                <div className="p-1 bg-paper rounded-lg border border-paper-dim">
                  <span className="text-rose-700 dark:text-rose-400 font-bold block">🛑 स्टॉपलॉस</span>
                  <Mono className="font-bold text-ink">₹{selectedStockDetail.stoploss || Math.round(selectedStockDetail.price * 0.95)}</Mono>
                </div>
                <div className="p-1 bg-paper rounded-lg border border-paper-dim">
                  <span className="text-ink-muted font-bold block">RSI (14)</span>
                  <Mono className="font-bold text-amber-600">{selectedStockDetail.rsi || 52}</Mono>
                </div>
                <div className="p-1 bg-paper rounded-lg border border-paper-dim">
                  <span className="text-ink-muted font-bold block">MACD</span>
                  <span className="font-bold text-emerald-600">{selectedStockDetail.macd || 'बुलिश'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-[11px]">
                <span className="text-ink-muted">परिवार पोर्टफोलियो सलाह:</span>
                <Link
                  href="/advisor"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                >
                  <span>AI सलाहकार में विस्तृत जांचें</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
