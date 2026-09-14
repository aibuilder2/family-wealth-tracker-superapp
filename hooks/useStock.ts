import { useState, useCallback } from "react";
import type { StockQuote, StockSearchResult } from "@/types/stock";

export const useStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StockQuote | null>(null);

  const fetchStock = useCallback(async (symbol: string): Promise<StockQuote | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock/${symbol}`);
      if (!response.ok) throw new Error("Failed to fetch stock data");
      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStockHistory = useCallback(async (symbol: string, days: number = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock/${symbol}/historical?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch stock history");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchStocks = useCallback(async (query: string): Promise<StockSearchResult[]> => {
    if (!query) return [];
    try {
      const response = await fetch(`/api/stock/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      return await response.json();
    } catch (err: any) {
      console.error(err);
      return [];
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchStock,
    fetchStockHistory,
    searchStocks,
  };
};
