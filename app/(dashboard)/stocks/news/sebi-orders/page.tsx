"use client";

import SebiOrderCard from "@/components/news/SebiOrderCard";
import { Scale } from "lucide-react";

export default function SebiOrdersPage() {
  const orders = [
    { companyName: "Brightcom Group Ltd", type: "Interim Order", date: new Date().toISOString(), title: "Order in the matter of Brightcom Group Limited regarding accounting irregularities.", link: "#" },
    { companyName: "Various Entities", type: "Adjudication", date: new Date(Date.now() - 86400000 * 3).toISOString(), title: "Adjudication order in respect of 5 entities in the matter of front running.", link: "#" },
    { companyName: "Eros International", type: "Final Order", date: new Date(Date.now() - 86400000 * 10).toISOString(), title: "Final order in the matter of Eros International Media Ltd.", link: "#" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-lg">
          <Scale className="h-6 w-6 text-red-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">SEBI Orders & Actions</h1>
          <p className="text-sm text-slate-400">Stay updated with regulatory actions and bans.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order, idx) => <SebiOrderCard key={idx} order={order} />)}
      </div>
    </div>
  );
}