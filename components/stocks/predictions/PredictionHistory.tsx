import { CheckCircle2, XCircle } from "lucide-react";

export default function PredictionHistory() {
  // Mock Data
  const history = [
    { id: 1, symbol: "RELIANCE", date: "2024-05-01", predicted: "up", actual: "up", change: 2.4, correct: true },
    { id: 2, symbol: "HDFCBANK", date: "2024-05-02", predicted: "down", actual: "up", change: 1.1, correct: false },
    { id: 3, symbol: "TCS", date: "2024-05-03", predicted: "neutral", actual: "neutral", change: 0.1, correct: true },
  ];

  return (
    <div className="bg-[#111827] border rounded-xl shadow-lg border border-slate-800 overflow-hidden">
      <div className="p-4 border-b bg-[#0B0F19] flex justify-between items-center">
        <h3 className="font-bold text-white">Recent Accuracy History</h3>
        <select className="text-xs border rounded p-1"><option>Last 7 Days</option><option>Last 30 Days</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#111827] text-slate-400 text-xs border-b">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">AI Prediction</th>
              <th className="px-4 py-3">Actual Move</th>
              <th className="px-4 py-3 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-[#0B0F19]">
                <td className="px-4 py-3 text-slate-400 text-xs">{item.date}</td>
                <td className="px-4 py-3 font-bold text-white">{item.symbol}</td>
                <td className="px-4 py-3 capitalize text-slate-400">{item.predicted}</td>
                <td className="px-4 py-3 font-medium">{item.change > 0 ? "+" : ""}{item.change}%</td>
                <td className="px-4 py-3 text-right flex justify-end">{item.correct ? <CheckCircle2 className="h-5 w-5 text-green-500"/> : <XCircle className="h-5 w-5 text-red-500"/>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
