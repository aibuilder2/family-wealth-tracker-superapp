"use client";

export default function FundamentalsTable() {
  const data = [
    { label: "Market Cap", value: "₹ 19,50,000 Cr" },
    { label: "P/E Ratio", value: "28.5" },
    { label: "Industry P/E", value: "24.2" },
    { label: "ROCE", value: "12.4%" },
    { label: "ROE", value: "10.8%" },
    { label: "Debt to Equity", value: "0.34" },
    { label: "Dividend Yield", value: "0.85%" },
    { label: "Book Value", value: "₹ 1,240" },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 p-6">
      <h3 className="font-bold text-white mb-4 border-b pb-2">Key Fundamentals</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium mb-1">{item.label}</span>
            <span className="text-sm font-bold text-white">{item.value}</span>
            <div className="h-px w-full bg-slate-800/50 mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}