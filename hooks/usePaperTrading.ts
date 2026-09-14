import { useState, useCallback } from "react";
import type { PaperAccount, PaperTrade, PaperHolding, LeaderboardEntry } from "@/types/paper-trading";

export const usePaperTrading = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<PaperAccount | null>(null);
  const [holdings, setHoldings] = useState<PaperHolding[]>([]);

  const fetchAccount = useCallback(async (): Promise<PaperAccount | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/paper-trading/portfolio");
      if (!response.ok) throw new Error("Failed to fetch account");
      const data = await response.json();
      setAccount(data.account);
      return data.account;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHoldings = useCallback(async (): Promise<PaperHolding[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/paper-trading/portfolio");
      if (!response.ok) throw new Error("Failed to fetch holdings");
      const data = await response.json();
      setHoldings(data.holdings);
      return data.holdings;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const placeTrade = useCallback(async (symbol: string, type: "buy" | "sell", qty: number, price: number): Promise<PaperTrade | null> => {
    try {
      const response = await fetch("/api/paper-trading/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, type, qty, price }),
      });
      if (!response.ok) throw new Error("Trade failed");
      return await response.json();
    } catch (err) {
      return null;
    }
  }, []);

  const fetchLeaderboard = useCallback(async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await fetch("/api/paper-trading/leaderboard");
      return response.ok ? await response.json() : [];
    } catch (err) {
      return [];
    }
  }, []);

  return { loading, account, holdings, fetchAccount, fetchHoldings, placeTrade, fetchLeaderboard };
};
