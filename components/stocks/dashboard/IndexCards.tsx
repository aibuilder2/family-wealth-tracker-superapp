"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getPythonBackendUrl } from "@/lib/api";

interface IndexData {
  name: string;
  ltp: number;
  change: number;
  change_pct: number;
  link?: string;
}

function IndexCard({ data, isMarketOpen }: { data: IndexData; isMarketOpen: boolean }) {
  const isPositive = data.change >= 0;
  const linkHref = data.link || "/markets/indices";

  return (
    <Link
      href={linkHref}
      className="group bg-[#0B0F19] hover:bg-slate-800/60 border border-slate-800 hover:border-blue-500/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-wider">{data.name}</p>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isMarketOpen ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
          {isMarketOpen ? "LIVE" : "CLOSED"}
        </span>
      </div>
      <div className="my-1">
        <p className="text-xl md:text-2xl font-bold text-white font-mono">
          {data.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? "+" : ""}{data.change.toFixed(2)} ({isPositive ? "+" : ""}{data.change_pct.toFixed(2)}%)</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function IndexCards() {
  const [indices, setIndices] = useState<IndexData[]>([
    { name: "NIFTY 50", ltp: 24252.00, change: 20.15, change_pct: 0.08, link: "/markets/indices" },
    { name: "SENSEX", ltp: 77540.83, change: 3.11, change_pct: 0.00, link: "/markets/indices" },
    { name: "BANK NIFTY", ltp: 57761.95, change: 266.05, change_pct: 0.46, link: "/markets/indices" },
    { name: "NIFTY IT", ltp: 30532.25, change: -140.80, change_pct: -0.46, link: "/markets/indices" },
    { name: "INDIA VIX", ltp: 11.20, change: 0.44, change_pct: 4.09, link: "/markets/indices" },
  ]);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIndices() {
      try {
        const res = await fetch(getPythonBackendUrl("/markets/indices"));
        if (!res.ok) return;

        const data = await res.json();
        const list: IndexData[] = [];

        if (Array.isArray(data.indian)) {
          data.indian.forEach((item: any) => {
            list.push({
              name: item.name,
              ltp: Number(item.value) || 0,
              change: Number(item.change) || 0,
              change_pct: Number(item.changePct) || 0,
              link: "/markets/indices"
            });
          });
        }

        if (list.length === 0 && data.nifty) {
          list.push({
            name: data.nifty.symbol || "NIFTY 50",
            ltp: data.nifty.ltp,
            change: data.nifty.change,
            change_pct: data.nifty.change_pct,
            link: "/markets/indices"
          });
          if (data.sensex) {
            list.push({
              name: data.sensex.symbol || "SENSEX",
              ltp: data.sensex.ltp,
              change: data.sensex.change,
              change_pct: data.sensex.change_pct,
              link: "/markets/indices"
            });
          }
          if (data.banknifty) {
            list.push({
              name: data.banknifty.symbol || "BANK NIFTY",
              ltp: data.banknifty.ltp,
              change: data.banknifty.change,
              change_pct: data.banknifty.change_pct,
              link: "/markets/indices"
            });
          }
        }

        if (list.length > 0) {
          setIndices(list.slice(0, 5));
        }

        if (data.market_status) {
          setIsMarketOpen(Boolean(data.market_status.is_open));
        }
      } catch (error) {
        // Silently keep default valid indices
      }
    }

    fetchIndices();
    const interval = setInterval(fetchIndices, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" /> 
          {isMarketOpen ? "Market Open (Live Updates)" : "Market Closed (Showing Last Session Close)"}
        </span>
        <Link href="/markets/indices" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
          View All Indices & Constituents <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {indices.map((index) => (
          <IndexCard key={index.name} data={index} isMarketOpen={isMarketOpen} />
        ))}
      </div>
    </div>
  );
}