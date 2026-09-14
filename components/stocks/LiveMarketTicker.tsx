"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingDown, TrendingUp, Activity } from "lucide-react";

export default function LiveMarketTicker() {
  const [marketData, setMarketData] = useState<Record<string, any>>({});
  const previousData = useRef<Record<string, any>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1. Initial snapshot fetch for instant ticker display
    const fetchInitialSnapshot = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/markets/indices");
        if (res.ok) {
          const json = await res.json();
          if (mounted && json) {
            const formatted: Record<string, any> = {};
            if (json.indian && Array.isArray(json.indian)) {
              json.indian.forEach((idx: any) => {
                formatted[idx.name] = {
                  symbol: idx.name,
                  price: idx.value,
                  change: idx.change,
                  pChange: idx.changePct,
                };
              });
            }
            if (json.global && Array.isArray(json.global)) {
              json.global.forEach((idx: any) => {
                formatted[idx.name] = {
                  symbol: idx.name,
                  price: idx.value,
                  change: idx.change,
                  pChange: idx.changePct,
                };
              });
            }
            if (Object.keys(formatted).length > 0) {
              setMarketData(formatted);
            }
          }
        }
      } catch (e) {
        // Silently fallback to WebSocket stream
      }
    };

    fetchInitialSnapshot();

    // 2. Real-time WebSocket connection
    const connect = () => {
      if (!mounted) return;
      const host = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `ws://${host}:8000/live/ws`;
      
      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.debug("LiveMarketTicker: WebSocket connected", wsUrl);
        };

        ws.onmessage = (event) => {
          try {
            const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            setMarketData((prev) => {
              previousData.current = prev || {};
              return data && typeof data === "object" ? data : {};
            });
          } catch (err) {
            console.debug("LiveMarketTicker: failed to parse websocket message", err);
          }
        };

        ws.onerror = (ev) => {
          // Graceful debug log to prevent Next.js dev overlay interruption
          console.debug("LiveMarketTicker: WebSocket reconnecting...", ev);
        };

        ws.onclose = () => {
          if (mounted) {
            if (reconnectRef.current) window.clearTimeout(reconnectRef.current);
            reconnectRef.current = window.setTimeout(() => connect(), 4000);
          }
        };

        wsRef.current = ws;
      } catch (err) {
        console.debug("LiveMarketTicker: failed to connect websocket", err);
        if (mounted) {
          reconnectRef.current = window.setTimeout(() => connect(), 4000);
        }
      }
    };

    connect();

    return () => {
      mounted = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) window.clearTimeout(reconnectRef.current);
    };
  }, []);

  const renderTickerItem = (item: any, prevItem: any) => {
    if (!item) return null;

    let colorClass = "text-slate-300";
    let bgBlink = "";

    if (prevItem && typeof item.price === "number" && typeof prevItem.price === "number") {
      if (item.price > prevItem.price) {
        colorClass = "text-emerald-400";
        bgBlink = "bg-emerald-500/20";
      } else if (item.price < prevItem.price) {
        colorClass = "text-rose-400";
        bgBlink = "bg-rose-500/20";
      }
    }

    const isPositive = typeof item.change === "number" ? item.change >= 0 : true;

    return (
      <div key={item.symbol || Math.random()} className={`flex items-center gap-3 px-6 py-2 border-r border-slate-700/50 transition-colors duration-300 ${bgBlink}`}>
        <span className="text-xs font-bold text-slate-400 tracking-wider whitespace-nowrap">{item.symbol}</span>
        <span className={`font-mono font-bold text-sm transition-colors duration-300 ${colorClass}`}>
          {typeof item.price === "number" ? item.price.toFixed(2) : String(item.price)}
        </span>
        <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {typeof item.pChange === "number" ? Math.abs(item.pChange).toFixed(2) : (item.pChange || "0")}%
        </span>
      </div>
    );
  };

  const keys = Object.keys(marketData || {});

  return (
    <div className="w-full bg-[#0B0F19] border-y border-slate-800 flex overflow-hidden hide-scrollbar shadow-md h-12">
      <div className="flex bg-blue-600/10 px-4 items-center justify-center border-r border-slate-700/50 shrink-0 gap-2">
        <Activity className="w-4 h-4 text-blue-400 animate-pulse" /> <span className="text-xs font-bold text-blue-400">LIVE</span>
      </div>
      <div className="flex animate-marquee whitespace-nowrap">
        {keys.length === 0 ? (
          <div className="text-slate-400 px-4">Connecting to live feed...</div>
        ) : (
          keys.map((key) => renderTickerItem(marketData[key], previousData.current?.[key]))
        )}
      </div>
    </div>
  );
}