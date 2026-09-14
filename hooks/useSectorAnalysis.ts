import { useState, useCallback } from "react";

export interface Sector {
  name: string;
  marketCap: number;
  peRatio: number;
  performance1y: number;
}

export interface EventImpact {
  eventId: string;
  eventName: string;
  impactedSectors: string[];
  description: string;
}

export const useSectorAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [events, setEvents] = useState<EventImpact[]>([]);

  const fetchSectors = useCallback(async (): Promise<Sector[]> => {
    setLoading(true);
    try {
      const response = await fetch("/api/sector/list");
      const data = response.ok ? await response.json() : [];
      setSectors(data);
      return data;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSectorDetail = useCallback(async (sectorName: string) => {
    const response = await fetch(`/api/sector/${encodeURIComponent(sectorName)}`);
    return response.ok ? await response.json() : null;
  }, []);

  const fetchEventImpact = useCallback(async (eventId: string): Promise<EventImpact | null> => {
    const response = await fetch(`/api/sector/event-impact?id=${eventId}`);
    const data = response.ok ? await response.json() : null;
    if (data) setEvents((prev: EventImpact[]) => [...prev.filter((e: EventImpact) => e.eventId !== eventId), data]);
    return data;
  }, []);

  return { loading, sectors, events, fetchSectors, fetchSectorDetail, fetchEventImpact };
};
