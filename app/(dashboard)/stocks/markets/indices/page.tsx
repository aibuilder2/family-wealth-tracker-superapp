"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Globe2, 
  Building2, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  Flame,
  LineChart
} from "lucide-react";
import Link from "next/link";
import FnOWatchlist from "@/components/markets/FnOWatchlist";

interface IndexItem {
  id: string;
  name: string;
  category: "Broad Market" | "Sectoral" | "Global";
  value: number;
  change: number;
  changePct: number;
  desc?: string;
}

interface ConstituentStock {
  symbol: string;
  company_name: string;
  sector: string;
  pe: number;
  market_cap: string;
  price: number;
  change: number;
  changePct: number;
  high52?: number;
  low52?: number;
}

export default function IndicesPage() {
  const [allIndices, setAllIndices] = useState<IndexItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY 50");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [constituents, setConstituents] = useState<ConstituentStock[]>([]);
  const [loadingConstituents, setLoadingConstituents] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [marketStatus, setMarketStatus] = useState<any>(null);

  // 1. Fetch All Indices via internal resilient Next.js API
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch("/api/stocks/markets-indices?type=all_indices");
        if (res.ok) {
          const data = await res.json();
          if (data.all && Array.isArray(data.all)) {
            setAllIndices(data.all);
          } else if (Array.isArray(data)) {
            setAllIndices(data);
          }
          if (data.market_status) {
            setMarketStatus(data.market_status);
          }
        }
      } catch (err) {
        console.error("Error fetching indices:", err);
      }
    };
    fetchIndices();
    const interval = setInterval(fetchIndices, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Constituents for Selected Index
  useEffect(() => {
    const fetchConstituents = async () => {
      setLoadingConstituents(true);
      try {
        const res = await fetch(`/api/stocks/markets-indices?type=constituents&index=${encodeURIComponent(selectedIndex)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.constituents && Array.isArray(data.constituents)) {
            setConstituents(data.constituents);
          } else if (Array.isArray(data)) {
            setConstituents(data);
          }
        }
      } catch (err) {
        console.error("Error fetching constituents:", err);
      } finally {
        setLoadingConstituents(false);
      }
    };
    fetchConstituents();
  }, [selectedIndex]);

  // Filter indices by category
  const filteredIndices = useMemo(() => {
    if (activeCategory === "all") return allIndices;
    if (activeCategory === "broad") return allIndices.filter(i => i.category === "Broad Market");
    if (activeCategory === "sectoral") return allIndices.filter(i => i.category === "Sectoral");
    if (activeCategory === "global") return allIndices.filter(i => i.category === "Global");
    return allIndices;
  }, [allIndices, activeCategory]);

  // Extract unique sectors for filter dropdown
  const uniqueSectors = useMemo(() => {
    const sectors = new Set<string>();
    constituents.forEach(c => {
      if (c.sector) sectors.add(c.sector);
    });
    return Array.from(sectors);
  }, [constituents]);

  // Filter constituents by search and sector
  const filteredConstituents = useMemo(() => {
    return constituents.filter(item => {
      const matchesSearch = 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === "all" || item.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [constituents, searchQuery, selectedSector]);

  // Current active index item
  const activeIndexMeta = useMemo(() => {
    return allIndices.find(i => i.name.toUpperCase() === selectedIndex.toUpperCase()) || {
      name: selectedIndex,
      value: 24852.30,
      change: 142.60,
      changePct: 0.58,
      category: "Broad Market",
      desc: `Premier benchmark constituent stocks of ${selectedIndex} listed on NSE/BSE.`
    };
  }, [allIndices, selectedIndex]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#B98B2A]/20 text-[#E5C378] border border-[#B98B2A]/30">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                Market Indices & Constituents
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Live NSE & BSE Benchmarks, Sectoral Segments, 52-Week Highs/Lows and F&O Derivatives Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Market Status Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#10263A]/85 border border-[#B98B2A]/30 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${marketStatus?.is_open ? "bg-emerald-400 animate-pulse" : "bg-emerald-400"}`} />
          <div className="text-xs">
            <span className="font-bold text-white">
              {marketStatus?.status_text || "LIVE NSE / BSE SESSIONS"}
            </span>
            <span className="text-[#E5C378] ml-2 font-mono text-[11px]">
              {marketStatus?.current_time || "NSE Live Feed Active"}
            </span>
          </div>
        </div>
      </div>

      {/* Live F&O Derivatives Watchlist */}
      <FnOWatchlist />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { key: "all", label: "🌟 All Indices", count: allIndices.length || 18 },
          { key: "broad", label: "🏢 Broad Market (Nifty / Sensex)", count: allIndices.filter(i => i.category === "Broad Market").length || 7 },
          { key: "sectoral", label: "⚡ Sectoral Indices (Bank, IT, Auto...)", count: allIndices.filter(i => i.category === "Sectoral").length || 7 },
          { key: "global", label: "🌍 Global Markets", count: allIndices.filter(i => i.category === "Global").length || 4 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === tab.key
                ? "bg-[#B98B2A] text-slate-950 shadow-lg shadow-[#B98B2A]/20 font-extrabold"
                : "bg-[#10263A]/70 text-slate-300 hover:text-white hover:bg-[#10263A] border border-white/10"
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${activeCategory === tab.key ? "bg-black/20 text-slate-950" : "bg-white/10 text-slate-300"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Index Cards Grid (Interactive Selection) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#E5C378] flex items-center gap-2">
            <Zap className="w-4 h-4" /> Select an Index to View Individual Stocks
          </h2>
          <span className="text-xs text-slate-400">
            Click any index card below to inspect its constituent stocks & PE ratios
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredIndices.map((idx) => {
            const isSelected = selectedIndex.toUpperCase() === idx.name.toUpperCase();
            const isPositive = idx.change >= 0;

            return (
              <div
                key={idx.id || idx.name}
                onClick={() => setSelectedIndex(idx.name)}
                className={`cursor-pointer rounded-2xl p-4 transition-all relative overflow-hidden border ${
                  isSelected
                    ? "bg-[#10263A] border-[#B98B2A] shadow-xl shadow-[#B98B2A]/15 ring-2 ring-[#B98B2A]/40"
                    : "bg-[#081522]/90 border-white/5 hover:border-[#B98B2A]/30 hover:bg-[#10263A]/60"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-[#B98B2A] text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">
                    ACTIVE
                  </div>
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
                  {idx.name}
                </div>
                <div className="text-base font-black font-mono text-white mt-1.5">
                  ₹{Number(idx.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-xs font-bold font-mono mt-1 flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPositive ? `+${idx.changePct}%` : `${idx.changePct}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Index Active Banner & AI Summary */}
      <div className="bg-gradient-to-r from-[#10263A] via-[#0D1F30] to-[#10263A] border border-[#B98B2A]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#B98B2A]/20 text-[#E5C378] text-xs font-bold border border-[#B98B2A]/40">
                {activeIndexMeta.category || "Selected Benchmark"}
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {constituents.length} Premier Constituent Stocks
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl font-black text-white">
                {selectedIndex}
              </h2>
              <span className="text-2xl font-mono font-black text-[#E5C378]">
                ₹{Number(activeIndexMeta.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                activeIndexMeta.change >= 0 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}>
                {activeIndexMeta.change >= 0 ? `+${activeIndexMeta.changePct}% (+₹${activeIndexMeta.change})` : `${activeIndexMeta.changePct}% (-₹${Math.abs(activeIndexMeta.change)})`}
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {activeIndexMeta.desc || `Viewing all major stock components, sector breakdown and live market cap weightings for ${selectedIndex}. Click any stock to view deep AI Predictions.`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Link
              href={`/stocks/predictions`}
              className="px-5 py-2.5 rounded-xl bg-[#B98B2A] hover:bg-[#c59a35] text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#B98B2A]/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Predictions for {selectedIndex}
            </Link>
          </div>
        </div>
      </div>

      {/* Constituent Stocks Table Section */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#10263A]/80 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E5C378]" />
            <input
              type="text"
              placeholder={`Search ${selectedIndex} stocks by symbol or company name...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#081522]/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B98B2A] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {uniqueSectors.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-[#081522] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#B98B2A]"
                >
                  <option value="all">All Sectors ({uniqueSectors.length})</option>
                  {uniqueSectors.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            )}
            <span className="text-xs font-bold text-white whitespace-nowrap bg-[#081522] px-3.5 py-2.5 rounded-xl border border-white/10 font-mono">
              Showing {filteredConstituents.length} stocks
            </span>
          </div>
        </div>

        {/* Table of Constituent Stocks - MoneyControl Style */}
        <div className="bg-[#10263A]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#081522]/90 border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-4 text-slate-300">Stock & Company</th>
                  <th className="p-4 text-slate-300">Sector</th>
                  <th className="p-4 text-slate-300">Market Cap</th>
                  <th className="p-4 text-right text-slate-300">P/E Ratio</th>
                  <th className="p-4 text-right text-slate-300">LTP (₹)</th>
                  <th className="p-4 text-right text-slate-300">Day Change</th>
                  <th className="p-4 text-center text-slate-300">52W High / Low</th>
                  <th className="p-4 text-center text-slate-300">AI Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {loadingConstituents ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-300">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-[#B98B2A] border-t-transparent rounded-full animate-spin" />
                        Loading constituent stocks for {selectedIndex}...
                      </div>
                    </td>
                  </tr>
                ) : filteredConstituents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      No stocks found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredConstituents.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr
                        key={stock.symbol}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                      >
                        <td className="p-4">
                          <Link href={`/stocks/predictions`} className="block group-hover:text-[#E5C378] transition-colors">
                            <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                              {stock.symbol}
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#E5C378]" />
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{stock.company_name}</div>
                          </Link>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-300">
                          <span className="px-2 py-0.5 rounded-md bg-black/30 border border-white/5 text-slate-300">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono font-medium text-slate-300">
                          {stock.market_cap}
                        </td>
                        <td className="p-4 text-right text-xs font-mono font-bold text-slate-300">
                          {stock.pe ? stock.pe.toFixed(1) : "—"}
                        </td>
                        <td className="p-4 text-right text-sm font-black font-mono text-white">
                          ₹{Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right">
                          <div className={`font-bold font-mono text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                            {isPositive ? `+${stock.changePct}%` : `${stock.changePct}%`}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {isPositive ? `+₹${stock.change}` : `₹${stock.change}`}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {stock.high52 && stock.low52 ? (
                            <div className="text-[11px] font-mono text-slate-300">
                              <span className="text-emerald-400 font-bold">₹{stock.high52}</span> / <span className="text-rose-400 font-bold">₹{stock.low52}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs">—</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/stocks/predictions`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B98B2A]/15 hover:bg-[#B98B2A] text-[#E5C378] hover:text-slate-950 border border-[#B98B2A]/30 text-xs font-bold transition-all shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> AI Target
                          </Link>
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
    </div>
  );
}