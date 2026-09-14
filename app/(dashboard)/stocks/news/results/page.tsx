"use client";

import ResultsCalendar from "@/components/news/ResultsCalendar";
import { CalendarDays } from "lucide-react";

export default function ResultsPage() {
  const upcomingResults = [
    { symbol: "RELIANCE", companyName: "Reliance Industries Ltd", resultDate: new Date(Date.now() + 86400000 * 2).toISOString(), isConfirmed: true },
    { symbol: "INFY", companyName: "Infosys Ltd", resultDate: new Date(Date.now() + 86400000 * 5).toISOString(), isConfirmed: true },
    { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd", resultDate: new Date(Date.now() + 86400000 * 12).toISOString(), isConfirmed: false },
    { symbol: "ITC", companyName: "ITC Ltd", resultDate: new Date(Date.now() + 86400000 * 15).toISOString(), isConfirmed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <CalendarDays className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Q-Results Calendar</h1>
          <p className="text-sm text-slate-400">Track upcoming quarterly earnings dates.</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#0B0F19] p-4 border rounded-xl mb-4 text-sm text-slate-400">
        <span>Showing results for NIFTY 500 stocks</span>
        <select className="bg-[#111827] border rounded px-2 py-1 outline-none"><option>Upcoming 30 Days</option><option>Past 7 Days</option></select>
      </div>

      <ResultsCalendar results={upcomingResults} />
    </div>
  );
}