"use client";

import { useEffect, useState } from "react";
import { AlertOctagon } from "lucide-react";
import { getPythonBackendUrl } from "@/lib/api";

interface Signal {
  signal: string;
  value: string;
  description: string;
}

export default function ManipulationAlert({ symbol }: { symbol: string }) {
  const [data, setData] = useState<{ is_suspicious: boolean; suspicion_score: number; signals: Signal[] } | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const controller = new AbortController();
    const check = async () => {
      try {
        const res = await fetch(getPythonBackendUrl(`/patterns/manipulation/${encodeURIComponent(symbol)}`), { signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        setData(json);
      } catch {
        // Fail silently — this is a supplementary risk flag, not core page content.
      }
    };
    check();
    return () => controller.abort();
  }, [symbol]);

  if (!data || !data.is_suspicious || !data.signals?.length) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-xl shadow-lg border border-slate-800 flex items-start gap-4 animate-pulse">
      <AlertOctagon className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-red-900 text-lg mb-1">Unusual Activity Detected (Suspicion Score: {data.suspicion_score}/100)</h3>
        <p className="text-red-800 text-sm mb-3">
          Ye ek automated pattern check hai, confirmation nahi — SEBI filings khud verify karo trade karne se pehle.
        </p>
        <div className="bg-[#111827]/60 p-3 rounded border border-red-100 space-y-1">
          <p className="text-xs font-bold text-red-900">Signals Found:</p>
          <ul className="text-xs text-red-800 list-disc pl-4 space-y-1">
            {data.signals.map((s, i) => (
              <li key={i}>{s.description} ({s.value})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
