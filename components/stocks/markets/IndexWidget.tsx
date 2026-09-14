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
    <div className="bg-[#10263A]/85 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#B98B2A]/20 hover:border-[#B98B2A]/50 hover:shadow-xl transition-all relative overflow-hidden group">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#B98B2A]/5 rounded-full blur-2xl group-hover:bg-[#B98B2A]/10 transition-colors pointer-events-none"></div>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C378]">{indexName}</h4>
        {value > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
            </span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-wider">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="text-2xl font-black text-white tracking-tight mb-1.5 relative z-10 font-mono">
        {value ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
      </div>
      
      <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md relative z-10 ${
        isNeutral 
          ? "bg-slate-800 text-slate-300" 
          : isPositive 
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
          : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
      }`}>
        {!isNeutral && (isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />)}
        <span>
          {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
