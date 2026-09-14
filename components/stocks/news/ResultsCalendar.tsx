import { Calendar } from "lucide-react";
import Link from "next/link";

interface ResultCalendar {
  symbol: string;
  companyName: string;
  resultDate: string;
  isConfirmed: boolean;
}

export default function ResultsCalendar({ results }: { results: ResultCalendar[] }) {
  return (
    <div className="bg-[#111827] rounded-lg border overflow-hidden">
      <div className="bg-[#0B0F19] px-4 py-3 border-b flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-600" /><h3 className="font-bold text-white">Upcoming Q-Results</h3></div>
      <div className="divide-y max-h-96 overflow-y-auto">
        {results.map((res, i) => (
          <Link key={i} href={`/stock/${res.symbol}`} className="flex items-center justify-between p-4 hover:bg-[#0B0F19] transition">
            <div>
              <div className="font-semibold text-white">{res.symbol}</div>
              <div className="text-xs text-slate-400">{res.companyName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-white">{new Date(res.resultDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</div>
              <div className={`text-[10px] uppercase font-bold ${res.isConfirmed ? "text-green-600" : "text-yellow-600"}`}>{res.isConfirmed ? "Confirmed" : "Estimated"}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
