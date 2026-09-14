import { Zap } from "lucide-react";

interface SearchSurgeCardProps {
  symbol: string;
  todayCount: number;
  avgCount: number;
  reason: string;
}

export default function SearchSurgeCard({ symbol, todayCount, avgCount, reason }: SearchSurgeCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 shadow-lg border border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-5 w-5 text-purple-600 fill-purple-600" />
        <h3 className="font-bold text-purple-900">{symbol} Alert</h3>
      </div>
      <div className="text-xl font-bold text-white mb-2">
        {todayCount.toLocaleString()} searches today
      </div>
      <p className="text-xs text-slate-400 mb-4">(vs average {avgCount.toLocaleString()} daily)</p>
      <div className="bg-[#111827]/80 p-3 rounded text-sm text-purple-800 border border-purple-100 font-medium mb-3">
        <strong>AI Insights:</strong> {reason}
      </div>
    </div>
  );
}
