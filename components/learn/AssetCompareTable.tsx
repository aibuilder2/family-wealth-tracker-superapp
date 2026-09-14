"use client";

import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

export default function AssetCompareTable() {
  const assets = [
    { name: "Stocks", risk: "High", return: "12-15%", liquidity: "High", tax: "Moderate" },
    { name: "Mutual Funds", risk: "Moderate", return: "10-12%", liquidity: "High", tax: "Moderate" },
    { name: "Fixed Deposit", risk: "Low", return: "6-7%", liquidity: "High", tax: "High" },
    { name: "Gold", risk: "Low", return: "8-9%", liquidity: "High", tax: "Moderate" },
    { name: "Real Estate", risk: "Moderate", return: "7-10%", liquidity: "Low", tax: "High" },
  ];

  const renderRisk = (risk: string) => {
    if (risk === "High") return <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">High</span>;
    if (risk === "Moderate") return <span className="text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded text-xs">Moderate</span>;
    return <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">Low</span>;
  };

  const renderLiquidity = (liq: string) => {
    if (liq === "High") return <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />;
    if (liq === "Moderate") return <MinusCircle className="h-5 w-5 text-yellow-500 mx-auto" />;
    return <XCircle className="h-5 w-5 text-red-500 mx-auto" />;
  };

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#0B0F19] border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-300">Asset Class</th>
              <th className="px-6 py-4 font-bold text-slate-300">Risk Profile</th>
              <th className="px-6 py-4 font-bold text-slate-300">Avg. Historical Return</th>
              <th className="px-6 py-4 font-bold text-slate-300 text-center">Liquidity</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assets.map((asset, idx) => (
              <tr key={idx} className="hover:bg-[#0B0F19] transition">
                <td className="px-6 py-4 font-bold text-white">{asset.name}</td>
                <td className="px-6 py-4">{renderRisk(asset.risk)}</td>
                <td className="px-6 py-4 font-medium text-slate-300">{asset.return}</td>
                <td className="px-6 py-4 text-center">{renderLiquidity(asset.liquidity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}