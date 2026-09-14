import { useState, useCallback } from "react";

export interface TrendingStock {
  symbol: string;
  companyName: string;
  searchVolume: number;
  priceChangePct: number;
}

export interface SurgeAlert {
  symbol: string;
  surgePercentage: number;
  timestamp: string;
}

export interface SearchHistory {
  query: string;
  searchedAt: string;
}

export const useTrending = () => {
  const [loading, setLoading] = useState(false);

  const fetchTrending = useCallback(async (): Promise<TrendingStock[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/trending/stocks");
      return response.ok ? await response.json() : [];
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearchSurge = useCallback(async (): Promise<SurgeAlert[]> => {
    const response = await fetch("/api/trending/surge");
    return response.ok ? await response.json() : [];
  }, []);

  const fetchUserHistory = useCallback(async (): Promise<SearchHistory[]> => {
    const response = await fetch("/api/trending/history");
    return response.ok ? await response.json() : [];
  }, []);

  return { loading, fetchTrending, fetchSearchSurge, fetchUserHistory };
};
