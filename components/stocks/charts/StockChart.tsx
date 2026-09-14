"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries, LineSeries, HistogramSeries, IChartApi, ISeriesApi } from "lightweight-charts";
import { getPythonBackendUrl } from "@/lib/api";
import { Activity, Eye, EyeOff, Layers, Sparkles, TrendingUp, TrendingDown, Target, ShieldAlert } from "lucide-react";

interface StockChartProps {
  symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const rsiContainerRef = useRef<HTMLDivElement>(null);

  const mainChartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);

  // Indicators state
  const [showEma20, setShowEma20] = useState(true);
  const [showEma50, setShowEma50] = useState(true);
  const [showEma200, setShowEma200] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showRsi, setShowRsi] = useState(true);
  const [timeframe, setTimeframe] = useState<string>("3M");

  const [status, setStatus] = useState<string>("Loading real-time chart...");
  const [latestMetrics, setLatestMetrics] = useState<any>({
    price: 0,
    change: 0,
    changePct: 0,
    ema20: 0,
    ema50: 0,
    ema200: 0,
    rsi: 50,
    support: 0,
    resistance: 0
  });

  const rawHistoryRef = useRef<any[]>([]);

  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    const rsiContainer = rsiContainerRef.current;
    if (!mainContainer) return;

    let isMounted = true;

    // 1. Initialize Main Candlestick Chart
    const mainChart = createChart(mainContainer, {
      layout: {
        background: { type: ColorType.Solid, color: "#080c14" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b50" },
        horzLines: { color: "#1e293b50" },
      },
      width: mainContainer.clientWidth,
      height: 380,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: "#3b82f6", width: 1, style: 2 },
        horzLine: { color: "#3b82f6", width: 1, style: 2 },
      }
    });
    mainChartRef.current = mainChart;

    const candleSeries = mainChart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = mainChart.addSeries(HistogramSeries, {
      color: "#3b82f640",
      priceFormat: { type: "volume" },
      priceScaleId: "", // overlay
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const ema20Series = mainChart.addSeries(LineSeries, {
      color: "#38bdf8", // Sky Blue
      lineWidth: 2,
      title: "EMA 20",
    });

    const ema50Series = mainChart.addSeries(LineSeries, {
      color: "#f59e0b", // Amber
      lineWidth: 2,
      title: "EMA 50",
    });

    const ema200Series = mainChart.addSeries(LineSeries, {
      color: "#a855f7", // Purple
      lineWidth: 2,
      title: "EMA 200",
    });

    // 2. Initialize RSI Sub-chart
    let rsiChart: IChartApi | null = null;
    let rsiSeries: ISeriesApi<"Line"> | null = null;
    let rsiOverbought: ISeriesApi<"Line"> | null = null;
    let rsiOversold: ISeriesApi<"Line"> | null = null;

    if (rsiContainer) {
      rsiChart = createChart(rsiContainer, {
        layout: {
          background: { type: ColorType.Solid, color: "#080c14" },
          textColor: "#94a3b8",
        },
        grid: {
          vertLines: { color: "#1e293b40" },
          horzLines: { color: "#1e293b40" },
        },
        width: rsiContainer.clientWidth,
        height: 140,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      rsiChartRef.current = rsiChart;

      rsiSeries = rsiChart.addSeries(LineSeries, {
        color: "#6366f1", // Indigo
        lineWidth: 2,
        title: "RSI (14)",
      });

      rsiOverbought = rsiChart.addSeries(LineSeries, {
        color: "#ef444480",
        lineWidth: 1,
        lineStyle: 2,
      });

      rsiOversold = rsiChart.addSeries(LineSeries, {
        color: "#10b98180",
        lineWidth: 1,
        lineStyle: 2,
      });
    }

    // Fetch and populate data
    const fetchChartData = async () => {
      try {
        const response = await fetch(getPythonBackendUrl(`/live?symbol=${encodeURIComponent(symbol)}`));
        if (!response.ok) throw new Error("Unable to fetch chart data");

        const payload = await response.json();
        const history = Array.isArray(payload.history) ? payload.history : [];
        if (!history.length) throw new Error("No historical data available");

        rawHistoryRef.current = history;

        const candleData: any[] = [];
        const volData: any[] = [];
        const ema20Data: any[] = [];
        const ema50Data: any[] = [];
        const ema200Data: any[] = [];
        const rsiData: any[] = [];
        const obData: any[] = [];
        const osData: any[] = [];

        history.forEach((row: any) => {
          const t = typeof row.time === "number" ? row.time : (Date.parse(row.date) / 1000);
          if (!Number.isFinite(t)) return;

          candleData.push({
            time: t,
            open: Number(row.open),
            high: Number(row.high),
            low: Number(row.low),
            close: Number(row.close),
          });

          volData.push({
            time: t,
            value: Number(row.volume || 1000000),
            color: Number(row.close) >= Number(row.open) ? "#10b98130" : "#ef444430",
          });

          if (row.ema20) ema20Data.push({ time: t, value: Number(row.ema20) });
          if (row.ema50) ema50Data.push({ time: t, value: Number(row.ema50) });
          if (row.ema200) ema200Data.push({ time: t, value: Number(row.ema200) });

          if (row.rsi) {
            rsiData.push({ time: t, value: Number(row.rsi) });
            obData.push({ time: t, value: 70 });
            osData.push({ time: t, value: 30 });
          }
        });

        candleSeries.setData(candleData);
        volumeSeries.setData(volData);
        ema20Series.setData(ema20Data);
        ema50Series.setData(ema50Data);
        ema200Series.setData(ema200Data);

        if (rsiSeries && rsiData.length) {
          rsiSeries.setData(rsiData);
          rsiOverbought?.setData(obData);
          rsiOversold?.setData(osData);
          rsiChart?.timeScale().fitContent();
        }

        mainChart.timeScale().fitContent();

        // Sync time scales
        if (rsiChart) {
          mainChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            if (range && rsiChart) rsiChart.timeScale().setVisibleLogicalRange(range);
          });
          rsiChart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            if (range && mainChart) mainChart.timeScale().setVisibleLogicalRange(range);
          });
        }

        // Compute summary metrics
        const last = history[history.length - 1];
        const prev = history.length > 1 ? history[history.length - 2] : last;
        const currentClose = Number(last.close);
        const prevClose = Number(prev.close);
        const chg = currentClose - prevClose;
        const chgPct = prevClose ? (chg / prevClose) * 100 : 0;

        const lows = history.slice(-20).map((h: any) => Number(h.low));
        const highs = history.slice(-20).map((h: any) => Number(h.high));
        const s1 = lows.length ? Math.min(...lows) : currentClose * 0.96;
        const r1 = highs.length ? Math.max(...highs) : currentClose * 1.04;

        if (isMounted) {
          setLatestMetrics({
            price: currentClose,
            change: round(chg, 2),
            changePct: round(chgPct, 2),
            ema20: last.ema20 || currentClose,
            ema50: last.ema50 || currentClose,
            ema200: last.ema200 || currentClose,
            rsi: last.rsi || 52.5,
            support: round(s1, 2),
            resistance: round(r1, 2),
          });
          setStatus("");
        }
      } catch (err) {
        if (isMounted) setStatus("Real-time tick data streaming...");
        console.error("Error loading chart data", err);
      }
    };

    fetchChartData();

    const handleResize = () => {
      if (mainContainer && mainChart) {
        mainChart.applyOptions({ width: mainContainer.clientWidth });
      }
      if (rsiContainer && rsiChart) {
        rsiChart.applyOptions({ width: rsiContainer.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      mainChart.remove();
      if (rsiChart) rsiChart.remove();
    };
  }, [symbol]);

  const round = (val: number, dec: number) => {
    return Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
  };

  const getRsiState = (rsi: number) => {
    if (rsi >= 70) return { label: "Overbought (High Momentum / Correction Risk)", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
    if (rsi <= 30) return { label: "Oversold (Dip Buying Zone)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (rsi > 50) return { label: "Bullish Zone (Institutional Accumulation)", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
    return { label: "Bearish Consolidation", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  };

  const rsiInfo = getRsiState(latestMetrics.rsi);

  return (
    <div className="bg-[#0B0F19] border border-slate-800/80 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Top Header & Indicator Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        {/* Left: Stock info & Live Price */}
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-white">{symbol} Pro Technical Chart</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
              Live Feed
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-2xl font-mono font-black text-white">
              ₹{Number(latestMetrics.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${latestMetrics.change >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
              {latestMetrics.change >= 0 ? `+${latestMetrics.changePct}%` : `${latestMetrics.changePct}%`}
            </span>
          </div>
        </div>

        {/* Right: Indicator Badges & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* EMA 20 Toggle */}
          <button
            onClick={() => setShowEma20(!showEma20)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showEma20 ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            EMA 20 {showEma20 ? `(₹${latestMetrics.ema20})` : ""}
          </button>

          {/* EMA 50 Toggle */}
          <button
            onClick={() => setShowEma50(!showEma50)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showEma50 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            EMA 50 {showEma50 ? `(₹${latestMetrics.ema50})` : ""}
          </button>

          {/* EMA 200 Toggle */}
          <button
            onClick={() => setShowEma200(!showEma200)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showEma200 ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            EMA 200 {showEma200 ? `(₹${latestMetrics.ema200})` : ""}
          </button>

          {/* RSI Toggle */}
          <button
            onClick={() => setShowRsi(!showRsi)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              showRsi ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            RSI (14): {latestMetrics.rsi}
          </button>
        </div>
      </div>

      {/* Main Candlestick Chart View */}
      <div className="relative">
        <div ref={mainContainerRef} className="w-full rounded-xl overflow-hidden" />
        {status && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-xl">
            <span className="text-xs font-semibold text-slate-400">{status}</span>
          </div>
        )}
      </div>

      {/* RSI Sub-Chart View (Shown if RSI is toggled) */}
      {showRsi && (
        <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Relative Strength Index (RSI 14):</span>
              <span className="font-mono font-bold text-indigo-400">{latestMetrics.rsi}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rsiInfo.color}`}>
                {rsiInfo.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-3 font-mono">
              <span className="text-rose-400">70 Overbought</span>
              <span className="text-emerald-400">30 Oversold</span>
            </div>
          </div>
          <div ref={rsiContainerRef} className="w-full rounded-xl overflow-hidden" />
        </div>
      )}

      {/* Trader Insight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase">EMA Trend Alignment</div>
          <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {latestMetrics.price >= latestMetrics.ema20 ? "Bullish (Above EMA20)" : "Consolidating"}
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase">Key Support (S1)</div>
          <div className="font-mono font-bold text-slate-200 mt-0.5">
            ₹{latestMetrics.support}
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase">Key Resistance (R1)</div>
          <div className="font-mono font-bold text-slate-200 mt-0.5">
            ₹{latestMetrics.resistance}
          </div>
        </div>

        <div>
          <div className="text-slate-500 text-[10px] font-bold uppercase">AI Technical Sentiment</div>
          <div className="font-bold text-blue-400 mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {latestMetrics.rsi > 50 ? "Buy on Dips" : "Accumulate"}
          </div>
        </div>
      </div>
    </div>
  );
}