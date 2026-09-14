import { ExternalLink, Clock } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  stockSymbols: string[];
  sentiment: "positive" | "negative" | "neutral";
}

export default function NewsCard({ title, summary, source, sourceUrl, publishedAt, stockSymbols, sentiment }: NewsCardProps) {
  const sentimentColors = {
    positive: "bg-green-100 text-green-800 border-green-200",
    negative: "bg-red-100 text-red-800 border-red-200",
    neutral: "bg-slate-800/50 text-slate-100 border-slate-800"
  };

  return (
    <div className="bg-[#111827] rounded-lg border p-4 shadow-lg border border-slate-800 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{source}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(publishedAt).toLocaleDateString()}</span>
        </div>
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${sentimentColors[sentiment]}`}>{sentiment}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{summary}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {stockSymbols.map((sym) => (<span key={sym} className="text-xs bg-slate-800/50 border text-slate-400 px-2 py-1 rounded-md">{sym}</span>))}
        </div>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">Read Full <ExternalLink className="h-4 w-4" /></a>
      </div>
    </div>
  );
}
