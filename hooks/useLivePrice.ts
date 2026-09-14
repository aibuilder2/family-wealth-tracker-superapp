import { useState, useEffect, useRef, useCallback } from "react";
import type { StockQuote } from "@/types/stock";

export const useLivePrice = () => {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSymbolsRef = useRef<string[]>([]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    // Use local dev WebSocket endpoint by default, with optional override via env.
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/live/ws";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Live price WebSocket connected");
      if (activeSymbolsRef.current.length > 0) {
        ws.send(JSON.stringify({ action: "subscribe", symbols: activeSymbolsRef.current }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "quote_update" && Array.isArray(data.quotes)) {
          setQuotes((prev: Record<string, StockQuote>) => {
            const newQuotes = { ...prev };
            data.quotes.forEach((q: StockQuote) => {
              newQuotes[q.symbol] = q;
            });
            return newQuotes;
          });
        }
      } catch (err) {
        console.error("Error parsing websocket message", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected, attempting reconnect...");
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket]);

  const subscribeToSymbols = useCallback((symbols: string[]) => {
    activeSymbolsRef.current = Array.from(new Set([...activeSymbolsRef.current, ...symbols]));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", symbols }));
    }
  }, []);

  const unsubscribe = useCallback((symbols: string[]) => {
    activeSymbolsRef.current = activeSymbolsRef.current.filter((s: string) => !symbols.includes(s));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "unsubscribe", symbols }));
    }
  }, []);

  return { quotes, subscribeToSymbols, unsubscribe };
};
