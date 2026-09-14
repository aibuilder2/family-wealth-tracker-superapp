"use client";

export default function SectorComparison() {
  const sectors = [
    { name: "IT", pe: 28.4, pb: 7.2, divYield: 1.5 },
    { name: "Banking", pe: 14.2, pb: 2.1, divYield: 2.1 },
    { name: "FMCG", pe: 45.6, pb: 12.4, divYield: 1.8 },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden w-full">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0B0F19] border-b">
          <tr><th className="px-4 py-3 text-slate-400">Sector</th><th className="px-4 py-3 text-slate-400">Avg P/E</th><th className="px-4 py-3 text-slate-400">Avg P/B</th><th className="px-4 py-3 text-slate-400">Div. Yield</th></tr>
        </thead>
        <tbody className="divide-y">
          {sectors.map((s) => (
            <tr key={s.name} className="hover:bg-[#0B0F19]"><td className="px-4 py-3 font-bold">{s.name}</td><td className="px-4 py-3">{s.pe}</td><td className="px-4 py-3">{s.pb}</td><td className="px-4 py-3">{s.divYield}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}