import { useState, useCallback } from "react";
import type { Subscription } from "@/types/user";

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const fetchSubscription = useCallback(async (): Promise<Subscription | null> => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/subscription"); // Assumes user endpoint exists
      if (!response.ok) throw new Error("Failed to fetch subscription");
      const data = await response.json();
      setSubscription(data);
      return data;
    } catch (err) {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkScanLimit = useCallback((): boolean => {
    if (!subscription) return false;
    return subscription.scansUsedToday < subscription.scansLimit;
  }, [subscription]);

  const upgradePlan = useCallback(async (plan: "free" | "pro") => {
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      return response.ok ? await response.json() : null;
    } catch (err) {
      return null;
    }
  }, []);

  return { loading, subscription, fetchSubscription, checkScanLimit, upgradePlan };
};
