import { useState, useCallback } from "react";

export interface Subsidiary {
  name: string;
  ownershipPct: number;
  revenueContribution: number;
}

export const useMarketShare = () => {
  const [loading, setLoading] = useState(false);
  const [marketShare, setMarketShare] = useState<any>(null);
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);

  const fetchMarketShare = useCallback(async (symbol: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/market-share/${symbol}`);
      if (!response.ok) throw new Error("Failed to fetch market share");
      const data = await response.json();
      setMarketShare(data);
      return data;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubsidiaries = useCallback(async (symbol: string): Promise<Subsidiary[]> => {
    try {
      const response = await fetch(`/api/market-share/subsidiaries?symbol=${symbol}`);
      const data = response.ok ? await response.json() : [];
      setSubsidiaries(data);
      return data;
    } catch (err) {
      return [];
    }
  }, []);

  return { loading, marketShare, subsidiaries, fetchMarketShare, fetchSubsidiaries };
};
