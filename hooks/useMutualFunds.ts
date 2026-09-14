import { useState, useCallback } from "react";
import type { MutualFund, MFHolding, MFScreenerFilter, MFComparison } from "@/types/mutual-fund";
import { getPythonBackendUrl } from "@/lib/api";

export const useMutualFunds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMFList = useCallback(async (filters?: MFScreenerFilter): Promise<MutualFund[]> => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = filters ? `?${new URLSearchParams(filters as any).toString()}` : "";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(getPythonBackendUrl(`/mutual-funds/list${queryParams}`), { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Failed to fetch mutual funds");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMFDetail = useCallback(async (schemeCode: string): Promise<MutualFund | null> => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(getPythonBackendUrl(`/mutual-funds/${schemeCode}`), { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Failed to fetch fund details");
      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMFHoldings = useCallback(async (schemeCode: string): Promise<MFHolding[]> => {
    try {
      const response = await fetch(getPythonBackendUrl(`/mutual-funds/${schemeCode}/holdings`));
      if (!response.ok) throw new Error("Failed to fetch holdings");
      return await response.json();
    } catch (err) {
      return [];
    }
  }, []);

  const compareMFs = useCallback(async (schemeCodes: string[]): Promise<MFComparison | null> => {
    try {
      const response = await fetch(getPythonBackendUrl(`/mutual-funds/compare?schemes=${schemeCodes.join(",")}`));
      if (!response.ok) throw new Error("Failed to compare funds");
      return await response.json();
    } catch (err) {
      return null;
    }
  }, []);

  return { loading, error, fetchMFList, fetchMFDetail, fetchMFHoldings, compareMFs };
};
