import { useState, useCallback } from "react";

export interface PortfolioHolding {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPct: number;
}

export const usePortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);

  const fetchHoldings = useCallback(async (): Promise<PortfolioHolding[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/portfolio/analyze");
      if (!response.ok) throw new Error("Failed to fetch portfolio");
      const data = await response.json();
      setHoldings(data.holdings);
      return data.holdings;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addManualHolding = useCallback(async (symbol: string, qty: number, price: number) => {
    try {
      const response = await fetch("/api/portfolio/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, quantity: qty, avgPrice: price }),
      });
      if (response.ok) {
        await fetchHoldings();
      }
      return response.ok;
    } catch (err) {
      return false;
    }
  }, [fetchHoldings]);

  const deleteHolding = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/manual?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchHoldings();
      }
      return response.ok;
    } catch (err) {
      return false;
    }
  }, [fetchHoldings]);

  const fetchPnL = useCallback(async () => {
    try {
      const response = await fetch("/api/portfolio/analyze");
      return response.ok ? await response.json() : null;
    } catch (err) {
      return null;
    }
  }, []);

  const connectBroker = useCallback(async (broker: string, credentials: any) => {
    try {
      const response = await fetch("/api/portfolio/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broker, credentials }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  return { loading, holdings, fetchHoldings, addManualHolding, deleteHolding, fetchPnL, connectBroker };
};
