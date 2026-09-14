"use client";

import CommodityCard from "@/components/markets/CommodityCard";
import GoldSilverWidget from "@/components/markets/GoldSilverWidget";
import { Database } from "lucide-react";
import type { Commodity } from "@/types/commodity";

export default function CommoditiesPage() {
  const metals: Commodity[] = [
    { symbol: "COPPER", name: "Copper", price: 850.50, change: 12.30, changePct: 1.45, unit: "1 Kg", exchange: "MCX", category: "base_metals", updatedAt: "" },
    { symbol: "ZINC", name: "Zinc", price: 245.20, change: -1.50, changePct: -0.60, unit: "1 Kg", exchange: "MCX", category: "base_metals", updatedAt: "" },
    { symbol: "LEAD", name: "Lead", price: 185.00, change: 0.50, changePct: 0.27, unit: "1 Kg", exchange: "MCX", category: "base_metals", updatedAt: "" },
  ];

  const energy: Commodity[] = [
    { symbol: "CRUDEOIL", name: "Crude Oil", price: 6850.00, change: -120.00, changePct: -1.72, unit: "1 Barrel", exchange: "MCX", category: "energy", updatedAt: "" },
    { symbol: "NATGAS", name: "Natural Gas", price: 145.50, change: 4.50, changePct: 3.15, unit: "1 mmBtu", exchange: "MCX", category: "energy", updatedAt: "" },
  ];

  const agri: Commodity[] = [
    { symbol: "COTTON", name: "Cotton", price: 58000.00, change: 200.00, changePct: 0.35, unit: "1 Candy", exchange: "MCX", category: "agri", updatedAt: "" },
    { symbol: "MENTHAOIL", name: "Mentha Oil", price: 920.00, change: -5.00, changePct: -0.54, unit: "1 Kg", exchange: "MCX", category: "agri", updatedAt: "" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Database className="h-6 w-6 text-yellow-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Commodities Market (MCX)</h1>
          <p className="text-sm text-slate-400">Live prices of Metals, Energy, and Agriculture.</p>
        </div>
      </div>

      <div className="mb-8 max-w-2xl">
        <GoldSilverWidget />
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-100 mb-4 border-b pb-2">Energy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {energy.map((cmd) => <CommodityCard key={cmd.symbol} commodity={cmd} />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-100 mb-4 border-b pb-2">Base Metals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metals.map((cmd) => <CommodityCard key={cmd.symbol} commodity={cmd} />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-100 mb-4 border-b pb-2">Agriculture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agri.map((cmd) => <CommodityCard key={cmd.symbol} commodity={cmd} />)}
        </div>
      </section>
    </div>
  );
}