import { TrendingUp, TrendingDown } from "lucide-react";

interface IndexWidgetProps {
  indexName: string;
  value?: number;
  change?: number;
  changePct?: number;
}

export default function IndexWidget({ indexName, value = 0, change = 0, changePct = 0 }: IndexWidgetProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  
  return (
    <div className="bg-[#111827] rounded-lg p-4 shadow-lg border border-slate-800 hover:border-slate-600 hover:shadow-md transition-all relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h4 className="text-sm font-bold text-slate-400">{indexName}</h4>
        {value > 0 && (
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1 relative z-10">
        {value ? value.toLocaleString("en-IN") : "---"}
      </div>
      
      <div className={`flex items-center gap-1 text-sm font-medium relative z-10 ${isNeutral ? "text-slate-400" : isPositive ? "text-green-500" : "text-red-500"}`}>
        {!isNeutral && (isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />)}
        <span>
          {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
