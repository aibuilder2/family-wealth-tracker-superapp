import { DollarSign } from "lucide-react";

export default function CurrencyWidget() {
  const rates = [
    { pair: "USD / INR", value: 83.45, change: -0.12 },
    { pair: "EUR / INR", value: 89.20, change: 0.45 },
    { pair: "GBP / INR", value: 104.50, change: 0.23 },
  ];

  return (
    <div className="bg-[#111827] border rounded-lg p-4 shadow-lg border border-slate-800">
      <h3 className="font-bold text-white flex items-center gap-2 mb-4"><DollarSign className="h-5 w-5 text-green-600" /> Currency Exchange</h3>
      <div className="divide-y">
        {rates.map((rate) => (
          <div key={rate.pair} className="flex justify-between items-center py-3">
            <div className="font-medium text-slate-300">{rate.pair}</div>
            <div className="text-right">
              <div className="font-bold text-white">₹{rate.value.toFixed(2)}</div>
              <div className={`text-xs font-medium ${rate.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {rate.change >= 0 ? "+" : ""}{rate.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-gray-400 bg-[#0B0F19] p-2 rounded">
        * Indicative RBI reference rates. Not for trading.
      </div>
    </div>
  );
}
