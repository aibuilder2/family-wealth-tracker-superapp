import { Coins } from "lucide-react";

export default function GoldSilverWidget() {
  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-yellow-500 flex items-center gap-2"><Coins className="h-5 w-5 text-yellow-500"/> Precious Metals</h3>
        <select className="text-xs border-yellow-500/30 rounded bg-[#111827] text-yellow-200 p-1 outline-none">
          <option>Mumbai</option><option>Delhi</option><option>Chennai</option>
        </select>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div><p className="text-xs text-yellow-200/70 font-medium mb-1">Gold 24K (10g)</p><p className="text-xl font-bold text-white">₹72,450</p></div>
          <div className="text-sm font-bold text-green-400 bg-green-500/20 border border-green-500/30 px-2 py-1 rounded">+0.3%</div>
        </div>
        <div className="h-px bg-yellow-500/20 w-full"></div>
        <div className="flex justify-between items-end">
          <div><p className="text-xs text-slate-400 font-medium mb-1">Silver (1kg)</p><p className="text-xl font-bold text-white">₹85,200</p></div>
          <div className="text-sm font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded">-0.1%</div>
        </div>
      </div>
      <div className="mt-4 text-[10px] text-slate-400 text-right">Last updated: Today 10:30 AM</div>
    </div>
  );
}
