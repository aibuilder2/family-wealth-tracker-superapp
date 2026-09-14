"use client";

import { useEffect, useState } from "react";
import { Flame, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPythonBackendUrl } from "@/lib/api";

export default function TrendingList() {
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(getPythonBackendUrl('/trending/stocks'));
        if (res.ok) {
          const data = await res.json();
          // Format API response into expected format
          setTrending(data?.slice(0, 5) || []);
        }
      } catch (error) {
        console.error("Failed to fetch trending stocks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-4">
      <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Flame className="h-5 w-5 text-orange-500"/> Top Trending Searches</h3>
      <div className="space-y-1">
        {loading ? <div className="p-3 text-slate-400 animate-pulse">Fetching trending data...</div> : 
         trending.map((item, index) => (
          <Link key={item.symbol || item.name || index} href={`/stock/${item.symbol || item.name}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#0B0F19] transition group">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold w-6 text-center ${index === 0 ? "text-orange-500" : "text-gray-400"}`}>#{index + 1}</span>
              <span className="font-bold text-white">{item.symbol || item.name} {index < 2 && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded ml-1">HOT</span>}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              {item.searches || "Live"} <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
