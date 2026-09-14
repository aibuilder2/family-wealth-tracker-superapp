"use client";

import AnnouncementCard from "@/components/news/AnnouncementCard";
import { Megaphone } from "lucide-react";

export default function AnnouncementsPage() {
  const announcements = [
    { stockSymbol: "RELIANCE", announcement: { title: "Outcome of Board Meeting - Dividend Declaration", date: new Date().toISOString(), type: "Corporate Action", sourceUrl: "#", pdfUrl: "#" } },
    { stockSymbol: "TCS", announcement: { title: "Press Release - Q4 Results", date: new Date(Date.now() - 86400000).toISOString(), type: "Results", sourceUrl: "#" } },
    { stockSymbol: "HDFCBANK", announcement: { title: "Change in Directorate", date: new Date(Date.now() - 172800000).toISOString(), type: "Management", sourceUrl: "#", pdfUrl: "#" } },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Megaphone className="h-6 w-6 text-purple-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">BSE/NSE Announcements</h1>
          <p className="text-sm text-slate-400">Official corporate filings directly from the exchanges.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full">All Filings</button>
        <button className="px-4 py-1.5 bg-slate-800/50 text-slate-400 hover:bg-gray-200 text-sm font-medium rounded-full transition">Board Meetings</button>
        <button className="px-4 py-1.5 bg-slate-800/50 text-slate-400 hover:bg-gray-200 text-sm font-medium rounded-full transition">Dividends</button>
      </div>

      <div className="space-y-4">
        {announcements.map((item, index) => <AnnouncementCard key={index} stockSymbol={item.stockSymbol} announcement={item.announcement} />)}
      </div>
    </div>
  );
}