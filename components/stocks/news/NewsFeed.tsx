"use client";

import { useState, useEffect } from "react";
import NewsCard from "./NewsCard";

interface NewsFeedProps {
  category?: string;
  stockSymbol?: string;
}

export default function NewsFeed({ category = "all", stockSymbol }: NewsFeedProps) {
  const [activeTab, setActiveTab] = useState(category);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);

  const tabs = ["All", "Results", "SEBI Orders", "BSE Announcements"];

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setNews([
        { id: 1, title: "Reliance Industries reports Q4 profit surge of 15%", summary: "The company reported a massive surge in its Q4 profits, beating Dalal street estimates...", source: "MoneyControl", sourceUrl: "#", publishedAt: new Date().toISOString(), stockSymbols: ["RELIANCE", "NIFTY50"], sentiment: "positive" },
        { id: 2, title: "SEBI bans 5 individuals in front-running case", summary: "Market regulator SEBI has passed an interim order barring 5 entities from capital markets...", source: "SEBI Official", sourceUrl: "#", publishedAt: new Date().toISOString(), stockSymbols: [], sentiment: "negative" },
      ]);
      setLoading(false);
    }, 1000);
  }, [activeTab, stockSymbol]);

  return (
    <div className="w-full">
      {!stockSymbol && (
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${activeTab === tab ? "bg-gray-900 text-white" : "bg-slate-800/50 text-slate-400 hover:bg-gray-200"}`}>{tab}</button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-40 bg-slate-800/50 rounded-lg animate-pulse"></div>)
        ) : (
          news.map((item) => <NewsCard key={item.id} {...item} />)
        )}
      </div>
    </div>
  );
}
