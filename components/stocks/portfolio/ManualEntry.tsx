"use client";

import { Plus } from "lucide-react";

export default function ManualEntry() {
  return (
    <form className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6 space-y-4">
      <h3 className="font-bold text-white mb-2 border-b pb-2">Add Manual Trade</h3>
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">Stock Symbol</label>
        <input type="text" placeholder="e.g. TCS" className="w-full border rounded-lg p-2 uppercase text-sm focus:ring-2 outline-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Quantity</label>
          <input type="number" placeholder="10" className="w-full border rounded-lg p-2 text-sm focus:ring-2 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Buy Price</label>
          <input type="number" placeholder="3500" className="w-full border rounded-lg p-2 text-sm focus:ring-2 outline-none" />
        </div>
      </div>
      <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-2">
        <Plus className="h-4 w-4" /> Add to Portfolio
      </button>
    </form>
  );
}