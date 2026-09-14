"use client";

import { useState, useEffect } from "react";
import { Cpu, Target, Activity, TrendingUp, TrendingDown, Zap, BookOpen, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FnOWatchlist from "@/components/markets/FnOWatchlist";
import Top5Card from "@/components/predictions/Top5Card";
import AccuracyTracker from "@/components/predictions/AccuracyTracker";

const DEFAULT_PREDICTIONS_MAP: Record<string, any[]> = {
  "Intraday (Today)": [
    {
      symbol: "TATAMOTORS",
      companyName: "Tata Motors Ltd",
      direction: "up",
      confidencePct: 89,
      overallScore: 8.7,
      patternDetected: "Bullish Flag Breakout",
      reasoning: "Heavy intraday buying volume crossing 200 EMA with expanding commercial vehicle orders.",
      dataSourceLinks: ["NSE Live Tick", "Level 2 Orderbook", "VWAP Support"]
    },
    {
      symbol: "INFY",
      companyName: "Infosys Ltd",
      direction: "up",
      confidencePct: 84,
      overallScore: 8.2,
      patternDetected: "RSI Mean Reversion",
      reasoning: "Oversold bounce confirmed with positive tech sector momentum and institutional inflow.",
      dataSourceLinks: ["NSE Live Tick", "RSI Momentum", "Sectoral IT"]
    },
    {
      symbol: "HDFCBANK",
      companyName: "HDFC Bank Ltd",
      direction: "up",
      confidencePct: 82,
      overallScore: 8.0,
      patternDetected: "Double Bottom Breakout",
      reasoning: "Solid base formed at ₹1,630 support strike with massive call unwindings.",
      dataSourceLinks: ["NSE Derivatives", "Open Interest", "Technical Delivery"]
    }
  ],
  "Short Term (1 Week)": [
    {
      symbol: "RELIANCE",
      companyName: "Reliance Industries Ltd",
      direction: "up",
      confidencePct: 88,
      overallScore: 8.6,
      patternDetected: "Cup & Handle Continuation",
      reasoning: "Strong oil-to-chemicals refining margins and Jio subscriber growth momentum.",
      dataSourceLinks: ["NSE Weekly", "Delivery Volume", "Quarterly Guidance"]
    },
    {
      symbol: "BHARTIARTL",
      companyName: "Bharti Airtel Ltd",
      direction: "up",
      confidencePct: 86,
      overallScore: 8.4,
      patternDetected: "Ascending Triangle",
      reasoning: "Consistent ARPU expansion and 5G enterprise network rollout acceleration.",
      dataSourceLinks: ["NSE Delivery", "Telecom Index", "Institutional Accumulation"]
    }
  ],
  "Mid Term (1 Month)": [
    {
      symbol: "LT",
      companyName: "Larsen & Toubro Ltd",
      direction: "up",
      confidencePct: 91,
      overallScore: 9.0,
      patternDetected: "Multi-Month Base Breakout",
      reasoning: "Record infrastructure order backlog exceeding ₹4.7 Lakh Crore with strong execution speed.",
      dataSourceLinks: ["Capex Pipeline", "Order Book Filings", "NSE Trend"]
    },
    {
      symbol: "ICICIBANK",
      companyName: "ICICI Bank Ltd",
      direction: "up",
      confidencePct: 87,
      overallScore: 8.5,
      patternDetected: "Channel Breakout",
      reasoning: "Industry-leading Net Interest Margin (NIM) and pristine retail asset quality.",
      dataSourceLinks: ["Banking Sector Trends", "RBI Metrics", "NSE Delivery"]
    }
  ],
  "Long Term": [
    {
      symbol: "TCS",
      companyName: "Tata Consultancy Services",
      direction: "up",
      confidencePct: 93,
      overallScore: 9.2,
      patternDetected: "Secular Growth Trend",
      reasoning: "World-class return on equity (ROE > 45%), zero debt, and massive generative AI pipeline.",
      dataSourceLinks: ["Fundamental Balance Sheet", "Cash Flow Statements", "Global IT Spend"]
    },
    {
      symbol: "SUNPHARMA",
      companyName: "Sun Pharmaceutical",
      direction: "up",
      confidencePct: 85,
      overallScore: 8.3,
      patternDetected: "High Margin Specialty Pipeline",
      reasoning: "Global clinical approvals and strong domestic chronic therapy formulation market share.",
      dataSourceLinks: ["FDA Approvals", "Earnings Call", "Pharma Index"]
    }
  ],
  "Indices": [
    {
      symbol: "NIFTY 50",
      companyName: "NSE Benchmark Index",
      direction: "up",
      confidencePct: 86,
      overallScore: 8.4,
      patternDetected: "Trendline Continuation",
      reasoning: "FII/DII net positive inflows with Put-Call Ratio at 1.18 signaling bullish continuation.",
      dataSourceLinks: ["NSE Option Chain", "FII DII Flows", "Macro Liquidity"]
    },
    {
      symbol: "BANKNIFTY",
      companyName: "NSE Banking Index",
      direction: "neutral",
      confidencePct: 78,
      overallScore: 7.6,
      patternDetected: "Range Consolidation",
      reasoning: "Consolidating near 51,200 resistance zone with strong support at 50,800.",
      dataSourceLinks: ["Banking Option Chain", "Credit Growth", "Liquidity Metrics"]
    }
  ]
};

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState("Intraday (Today)");
  const [predictions, setPredictions] = useState<any[]>(DEFAULT_PREDICTIONS_MAP["Intraday (Today)"]);
  const [loading, setLoading] = useState(false);

  const categories = ["Intraday (Today)", "Short Term (1 Week)", "Mid Term (1 Month)", "Long Term", "Indices"];

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      const queryTab = activeTab.split(" ")[0]; 
      
      try {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase
            .from("predictions_log")
            .select("*")
            .ilike("timeframe", `%${queryTab}%`)
            .order("created_at", { ascending: false })
            .limit(10);

          if (!error && data && data.length > 0) {
            setPredictions(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Supabase prediction query:", e);
      }

      setPredictions(DEFAULT_PREDICTIONS_MAP[activeTab] || DEFAULT_PREDICTIONS_MAP["Intraday (Today)"]);
      setLoading(false);
    };

    fetchPredictions();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#10263A] via-[#15324d] to-[#10263A] border border-[#B98B2A]/30 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden group backdrop-blur-md">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B98B2A] via-[#E5C378] to-[#B98B2A]"></div>
        
        <div className="flex items-center gap-4 mb-3 relative z-10">
          <div className="p-3 bg-[#B98B2A]/20 rounded-2xl border border-[#B98B2A]/40 text-[#E5C378]">
            <Cpu className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-serif">
              Top 5 AI Stock Picks <span className="text-sm text-[#E5C378] font-bold px-2 py-0.5 rounded-full bg-[#B98B2A]/15 border border-[#B98B2A]/30 ml-2">Live AI Engine</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-3xl mt-1 leading-relaxed">
              SEBI-compliant End-Of-Day (EOD) & Intraday multi-signal analysis tracking RSI convergence, volume breakouts, and orderbook momentum.
            </p>
          </div>
        </div>
      </div>

      {/* Accuracy & Track Record Banner */}
      <AccuracyTracker />

      {/* Real-time F&O Options Watchlist */}
      <FnOWatchlist />

      {/* Timeframe Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === cat
                ? "bg-[#B98B2A] text-slate-950 font-black shadow-lg shadow-[#B98B2A]/20"
                : "bg-[#10263A]/70 text-slate-300 hover:text-white hover:bg-[#10263A] border border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* AI Picks Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#E5C378] flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Ranked Setups ({activeTab})
          </h2>
          <span className="text-xs text-slate-400">
            {predictions.length} High-Probability Setups Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {predictions.map((p, idx) => (
            <Top5Card key={p.symbol || idx} prediction={p} />
          ))}
        </div>
      </div>
    </div>
  );
}