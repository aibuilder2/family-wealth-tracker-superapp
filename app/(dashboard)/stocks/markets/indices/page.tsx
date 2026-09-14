"use client";

import { useState, useEffect, useMemo } from "react";

function getPythonBackendUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://127.0.0.1:8000";
  return `${base.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
import { 
  BarChart3, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search, 
  Layers, 
  Filter, 
  Globe2, 
  Building2, 
  Zap, 
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

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
  last_trade_date?: string;
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

  // 1. Fetch All Indices
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch(getPythonBackendUrl("/markets/indices"));
        if (!res.ok) throw new Error("Indices fetch failed");
        const data = await res.json();
        
        if (data.all && Array.isArray(data.all)) {
          setAllIndices(data.all);
        } else if (data.indian && Array.isArray(data.indian)) {
          setAllIndices([
            ...data.indian.map((i: any) => ({ ...i, id: i.name.toLowerCase().replace(/\s+/g, ''), category: i.name.includes("NIFTY") || i.name.includes("SENSEX") ? "Broad Market" : "Sectoral" })),
            ...(data.global || []).map((g: any) => ({ ...g, id: g.name.toLowerCase().replace(/\s+/g, ''), category: "Global" }))
          ]);
        }
        if (data.market_status) {
          setMarketStatus(data.market_status);
        }
      } catch (err) {
        console.error("Error fetching indices:", err);
      }
    };
    fetchIndices();
  }, []);

  // 2. Fetch Constituents for Selected Index
  useEffect(() => {
    const fetchConstituents = async () => {
      setLoadingConstituents(true);
      try {
        const res = await fetch(getPythonBackendUrl(`/markets/constituents?index=${encodeURIComponent(selectedIndex)}`));
        if (!res.ok) throw new Error("Constituents fetch failed");
        const data = await res.json();
        if (data.constituents && Array.isArray(data.constituents)) {
          setConstituents(data.constituents);
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
      value: 24252.00,
      change: 20.15,
      changePct: 0.08,
      category: "Broad Market",
      desc: `Constituent stocks of ${selectedIndex}`
    };
  }, [allIndices, selectedIndex]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <BarChart3 className="w-7 h-7" />
              </span>
              Market Indices & Constituents
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Real-time tracking of Benchmark Indices, Sectoral Segments, and Individual Constituent Stocks with AI Smart Analysis.
          </p>
        </div>

        {/* Market Status Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl">
          <span className={`w-2.5 h-2.5 rounded-full ${marketStatus?.is_open ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">
              {marketStatus?.status_text || "MARKET CLOSED (Weekend)"}
            </span>
            <span className="text-slate-400 ml-2">
              {marketStatus?.current_time || "22 Aug 2026, Last Session Close"}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3">
        {[
          { key: "all", label: "🌟 All Indices", count: allIndices.length || 18 },
          { key: "broad", label: "🏢 Broad Market (Nifty / Sensex)", count: allIndices.filter(i => i.category === "Broad Market").length || 8 },
          { key: "sectoral", label: "⚡ Sectoral Indices (Bank, IT, Auto...)", count: allIndices.filter(i => i.category === "Sectoral").length || 7 },
          { key: "global", label: "🌍 Global Markets", count: allIndices.filter(i => i.category === "Global").length || 3 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === tab.key
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeCategory === tab.key ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Index Cards Grid (Interactive Selection) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Select an Index to View Its Stocks
          </h2>
          <span className="text-xs text-slate-500">
            Click any index card below to inspect its individual stocks
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
                className={`cursor-pointer rounded-xl p-3.5 transition-all relative overflow-hidden border ${
                  isSelected
                    ? "bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/30"
                    : "bg-[#0B0F19] border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl">
                    ACTIVE
                  </div>
                )}
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  {idx.name}
                </div>
                <div className="text-base font-black font-mono text-white mt-1">
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
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/30 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                {activeIndexMeta.category || "Selected Index"}
              </span>
              <span className="text-xs text-slate-400">
                {constituents.length} Constituent Stocks
              </span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              {selectedIndex}
              <span className="text-xl font-mono font-bold text-slate-200">
                ₹{Number(activeIndexMeta.value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${activeIndexMeta.change >= 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                {activeIndexMeta.change >= 0 ? `+${activeIndexMeta.changePct}%` : `${activeIndexMeta.changePct}%`}
              </span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              {activeIndexMeta.desc || `Viewing all major stock components and weightings for ${selectedIndex}. Click any stock to perform deep AI Smart Analysis.`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Link
              href={`/screener?index=${encodeURIComponent(selectedIndex)}`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Screener for {selectedIndex}
            </Link>
          </div>
        </div>
      </div>

      {/* Constituent Stocks Table Section */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0B0F19] p-4 rounded-xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${selectedIndex} stocks by symbol or company name...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {uniqueSectors.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Sectors ({uniqueSectors.length})</option>
                  {uniqueSectors.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            )}
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              Showing {filteredConstituents.length} stocks
            </span>
          </div>
        </div>

        {/* Table of Constituent Stocks */}
        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="p-4">Stock & Company</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4">Market Cap</th>
                  <th className="p-4 text-right">P/E Ratio</th>
                  <th className="p-4 text-right">LTP (₹)</th>
                  <th className="p-4 text-right">Day Change</th>
                  <th className="p-4 text-center">AI Smart Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loadingConstituents ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading constituent stocks for {selectedIndex}...
                      </div>
                    </td>
                  </tr>
                ) : filteredConstituents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400">
                      No stocks found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredConstituents.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr
                        key={stock.symbol}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      >
                        <td className="p-4">
                          <Link href={`/stock/${stock.symbol}`} className="block group-hover:text-blue-400 transition-colors">
                            <div className="font-bold text-white text-base flex items-center gap-1.5">
                              {stock.symbol}
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                            </div>
                            <div className="text-xs text-slate-400">{stock.company_name}</div>
                          </Link>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800">
                            {stock.market_cap}
                          </span>
                        </td>
                        <td className="p-4 text-right text-xs font-mono font-bold text-slate-300">
                          {stock.pe ? stock.pe.toFixed(1) : "—"}
                        </td>
                        <td className="p-4 text-right text-base font-bold font-mono text-white">
                          ₹{Number(stock.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-right">
                          <div className={`font-bold font-mono text-sm ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                            {isPositive ? `+${stock.changePct}%` : `${stock.changePct}%`}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {isPositive ? `+${stock.change}` : stock.change}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Link
                            href={`/stock/${stock.symbol}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all shadow-sm group-hover:border-blue-500"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Prediction
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