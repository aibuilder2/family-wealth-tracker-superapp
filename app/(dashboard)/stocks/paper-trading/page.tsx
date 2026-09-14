"use client";

import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import VirtualPortfolio from "@/components/paper-trading/VirtualPortfolio";
import TradePanel from "@/components/paper-trading/TradePanel";
import PnLTracker from "@/components/paper-trading/PnLTracker";
import SetupModal from "@/components/paper-trading/SetupModal";
import Leaderboard from "@/components/paper-trading/Leaderboard";

export default function PaperTradingPage() {
  const { 
    account,
    holdings, 
    loading, 
    placeTrade,
    fetchAccount,
    fetchHoldings,
  } = usePaperTrading();

  const [isSetupOpen, setIsSetupOpen] = useState(false);

  useEffect(() => {
    fetchAccount();
    fetchHoldings();
  }, [fetchAccount, fetchHoldings]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 text-slate-50 font-sans">
      {/* Hero Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-green-600" /> Paper Trading Simulator
          </h1>
        </div>
        <button 
          onClick={() => setIsSetupOpen(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-lg border border-slate-700 transition"
        >
          Reset / Setup
        </button>
      </div>
      <p className="text-slate-400 text-sm">Practice trading with virtual money without any real risk.</p>

      {/* Portfolio Summary Cards */}
      <PnLTracker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Trade Form */}
        <div className="lg:col-span-1 h-fit">
          <TradePanel onTrade={placeTrade} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <VirtualPortfolio 
            holdings={holdings} 
          />
          <Leaderboard />
        </div>
      </div>

      <SetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
    </div>
  );
}