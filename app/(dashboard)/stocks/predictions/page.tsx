"use client";

import { useState, useEffect } from "react";
import { Cpu, Target, Activity, TrendingUp, TrendingDown, Zap, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FnOWatchlist from "@/components/markets/FnOWatchlist";
import Top5Card from "@/components/predictions/Top5Card";
import AccuracyTracker from "@/components/predictions/AccuracyTracker";


export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState("Intraday (Today)");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize Supabase Client
  const supabase: any = createClient();

  // Tabs Categories
  const categories = ["Intraday (Today)", "Short Term (1 Week)", "Mid Term (1 Month)", "Long Term", "Indices"];

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      // Extract the base timeframe word for querying (e.g. "Intraday", "Short", "Mid", "Long", "Indices")
      const queryTab = activeTab.split(" ")[0]; 
      
      const { data, error } = await supabase
        .from("predictions_log")
        .select("*")
        .ilike("timeframe", `%${queryTab}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setPredictions(data);
      }
      setLoading(false);
    };

    fetchPredictions();
  }, [activeTab, supabase]);

  const displayData = loading && predictions.length === 0 
    ? Array(3).fill({}) // Empty skeleton objects for loading state
    : predictions;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-slate-50 font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-[#111827] border border-slate-800 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
        
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="p-3.5 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Cpu className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Top 5 AI Picks <span className="text-xl text-slate-500 font-semibold ml-1">(EOD)</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl mt-2 leading-relaxed font-medium">
              Hamara Python AI model daily End-Of-Day (EOD) data analyze karke Intraday, 1 Week, aur 1 Month ke liye high-probability setups nikalta hai.
            </p>
          </div>
        </div>
      </div>

      {/* Top F&O Watchlist & Indices Section (Placed at the very front as requested) */}
      <div className="mt-4">
        <FnOWatchlist />
      </div>

      {/* AI Accuracy & Top Picks Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {displayData.slice(0, 5).map((pred, idx) => (
              <Top5Card key={idx} prediction={pred} />
            ))}
          </div>
        </div>
        <div>
          <AccuracyTracker />
        </div>
      </div>

      {/* Filters / Categories */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide whitespace-nowrap transition-all ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* AI Content Area */}
      <div className="relative mt-8">

        {/* Waiting Overlay - Glassmorphism (Only shows if loading) */}
        {loading && (
          <div className="absolute inset-0 z-20 backdrop-blur-md bg-[#0B0F19]/80 flex flex-col items-center justify-center rounded-3xl border border-slate-800/80 shadow-2xl">
            <div className="p-5 bg-[#111827] rounded-full border border-slate-700 shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6">
              <Activity className="h-12 w-12 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">Waiting for Live Data...</h3>
            <p className="text-slate-300 font-medium max-w-md text-center text-sm md:text-base leading-relaxed">
              Fetching the latest {activeTab} AI Predictions from database...
            </p>
          </div>
        )}

        {/* Skeleton / Demo Cards behind the overlay */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${loading ? 'opacity-30 select-none' : ''}`}>
          {displayData.map((stock, i) => (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white tracking-wide">{stock.ticker || stock.symbol}</h4>
                  <p className="text-slate-400 text-sm mt-1">{stock.price || "Live LTP"}</p>
                </div>
                {stock.signal || stock.direction ? (
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 
                    ${(stock.signal || stock.direction)?.toLowerCase() === 'buy' || (stock.signal || stock.direction)?.toLowerCase() === 'up' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                    (stock.signal || stock.direction)?.toLowerCase() === 'sell' || (stock.signal || stock.direction)?.toLowerCase() === 'down' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                    'bg-slate-700/50 text-slate-300 border border-slate-600'}`}
                  >
                    {((stock.signal || stock.direction)?.toLowerCase() === 'buy' || (stock.signal || stock.direction)?.toLowerCase() === 'up') && <TrendingUp className="w-3 h-3" />}
                    {((stock.signal || stock.direction)?.toLowerCase() === 'sell' || (stock.signal || stock.direction)?.toLowerCase() === 'down') && <TrendingDown className="w-3 h-3" />}
                    {((stock.signal || stock.direction)?.toLowerCase() === 'neutral') && <Activity className="w-3 h-3 text-slate-400" />}
                    {String(stock.signal || stock.direction || "").toUpperCase()}
                  </div>
                ) : null}
              </div>
              
              {/* Stoploss & Target Display */}
              <div className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-800 mb-4">
                <div className="text-center w-full border-r border-slate-700"><p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Target</p><p className="text-sm font-black text-emerald-400">₹{stock.target_price || "N/A"}</p></div>
                <div className="text-center w-full"><p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Stoploss</p><p className="text-sm font-black text-rose-400">₹{stock.stop_loss || "N/A"}</p></div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-400">AI Confidence</span>
                  <span className="text-white">{stock.confidence || stock.confidencePct || stock.confidence_pct || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: `${stock.confidence || stock.confidencePct || stock.confidence_pct || 0}%` }}></div>
                </div>
              </div>
              <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Logic</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{stock.reason || stock.reasoning || "Loading reasoning..."}</p>
                
                {/* Educational Learning Point */}
                {(stock.breakout || stock.breakout_data) && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Learning Point</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                      <span className="font-bold text-emerald-300">Breakout at {(stock.breakout || stock.breakout_data).pricePoint}:</span> {(stock.breakout || stock.breakout_data).educationalReasoning}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}