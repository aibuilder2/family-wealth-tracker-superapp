import { useState, useCallback } from "react";
import type { ScreenerFilter, ScreenerResult, SavedScreen } from "@/types/screener";

export const useScreener = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScreenerResult[]>([]);

  const runScreener = useCallback(async (filters: ScreenerFilter): Promise<ScreenerResult[]> => {
    setLoading(true);
    setError(null);
    console.log("[useScreener Hook] 🚀 Frontend se API call start hui... Filters:", filters);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    try {
      const response = await fetch("/api/screener/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log("[useScreener Hook] 📡 Next.js API se response status aaya:", response.status);
      if (!response.ok) throw new Error("Failed to run screener");
      const data = await response.json();
      console.log("[useScreener Hook] ✅ Data successfully receive hua:", data);
      setResults(data);
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') err.message = "Request timed out. Backend is slow.";
      console.error("[useScreener Hook] ❌ Error aagaya:", err.message);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScreen = useCallback(async (filter: ScreenerFilter): Promise<boolean> => {
    try {
      const response = await fetch("/api/screener/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });
      return response.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const getSavedScreens = useCallback(async (): Promise<SavedScreen[]> => {
    try {
      const response = await fetch("/api/screener/saved");
      if (!response.ok) throw new Error("Failed to fetch saved screens");
      return await response.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  return {
    results,
    loading,
    error,
    runScreener,
    saveScreen,
    getSavedScreens,
  };
};
