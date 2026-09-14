import type { Commodity } from "@/types/commodity";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function CommodityCard({ commodity }: { commodity: Commodity }) {
  const isPos = commodity.change >= 0;
  return (
    <div className="bg-[#111827] border rounded-lg p-4 shadow-lg border border-slate-800 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-white">{commodity.name}</h4><span className="text-[10px] bg-slate-800/50 text-slate-400 px-1.5 py-0.5 rounded font-bold">{commodity.exchange}</span></div>
        <div className="text-xs text-slate-400">{commodity.unit}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-white">₹{commodity.price.toLocaleString("en-IN")}</div>
        <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isPos ? "text-green-600" : "text-red-600"}`}>
          {isPos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {Math.abs(commodity.changePct)}%
        </div>
      </div>
    </div>
  );
}
