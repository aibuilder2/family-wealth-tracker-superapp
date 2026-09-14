import { useState, useCallback } from "react";
import type { Commodity, GoldPrice, CommodityHistory } from "@/types/commodity";

export const useCommodity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Commodity[]>([]);

  const fetchCommodities = useCallback(async (): Promise<Commodity[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/markets/commodities");
      if (!response.ok) throw new Error("Failed to fetch commodities");
      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGoldPrice = useCallback(async (): Promise<GoldPrice | null> => {
    try {
      const response = await fetch("/api/markets/commodities/gold");
      if (!response.ok) throw new Error("Failed to fetch gold prices");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const fetchCommodityHistory = useCallback(async (symbol: string, days: number = 30): Promise<CommodityHistory[]> => {
    try {
      const response = await fetch(`/api/markets/commodities/${symbol}/history?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch commodity history");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchCommodities,
    fetchGoldPrice,
    fetchCommodityHistory,
  };
};
