"use client";

import { BellRing, Plus, Trash2 } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <BellRing className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Price & Pattern Alerts</h1>
            <p className="text-sm text-slate-400">Get notified when your conditions are met.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          <Plus className="h-4 w-4" /> Create Alert
        </button>
      </div>

      <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-400">Stock</th>
              <th className="px-6 py-3 font-medium text-slate-400">Condition</th>
              <th className="px-6 py-3 font-medium text-slate-400">Status</th>
              <th className="px-6 py-3 font-medium text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-[#0B0F19]">
              <td className="px-6 py-4 font-bold text-white">RELIANCE</td>
              <td className="px-6 py-4 text-slate-400">Price crosses above ₹3,000</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
              <td className="px-6 py-4 text-right"><button className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="h-4 w-4"/></button></td>
            </tr>
            <tr className="hover:bg-[#0B0F19]">
              <td className="px-6 py-4 font-bold text-white">HDFCBANK</td>
              <td className="px-6 py-4 text-slate-400">AI Detects 'Double Bottom' pattern</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></td>
              <td className="px-6 py-4 text-right"><button className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="h-4 w-4"/></button></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}