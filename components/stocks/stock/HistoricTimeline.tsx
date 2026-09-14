"use client";

import { Calendar } from "lucide-react";

export default function HistoricTimeline() {
  const events = [
    { year: "2023", desc: "Acquired major subsidiary for ₹5,000 Cr." },
    { year: "2021", desc: "Crossed ₹10 Lakh Crore Market Cap." },
    { year: "2017", desc: "1:1 Bonus Share issue." },
    { year: "2010", desc: "Listed on NSE/BSE." },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6">
      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Calendar className="h-5 w-5 text-indigo-500"/> Corporate History</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
        {events.map((e, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white text-[10px] font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg border border-slate-800 z-10">{e.year}</div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0B0F19] p-4 rounded-xl border shadow-lg border border-slate-800">
              <p className="text-sm text-slate-300">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}