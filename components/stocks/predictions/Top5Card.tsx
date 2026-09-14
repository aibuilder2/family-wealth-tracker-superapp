import type { AIPrediction } from "@/types/prediction";
import { TrendingUp, TrendingDown, Minus, Info, Sparkles } from "lucide-react";
import ScoreBar from "../stock/ScoreBar";

export default function Top5Card({ prediction }: { prediction?: AIPrediction | any }) {
  const dir = (prediction?.direction || 'up').toLowerCase();
  const isUp = dir === 'up' || dir === 'bullish';
  const isDown = dir === 'down' || dir === 'bearish';

  return (
    <div className="bg-[#10263A]/85 backdrop-blur-md border border-[#B98B2A]/20 hover:border-[#B98B2A]/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#B98B2A]/5 rounded-full blur-2xl group-hover:bg-[#B98B2A]/10 transition-colors pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-xl text-white tracking-wide">{prediction?.symbol || 'NIFTY 50'}</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#B98B2A]/15 text-[#E5C378] text-[10px] font-bold border border-[#B98B2A]/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> AI Pick
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium mt-0.5">{prediction?.companyName || prediction?.company_name || 'Index / Stock'}</p>
        </div>
        <div className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${
          isUp 
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" 
            : isDown 
            ? "bg-rose-500/15 text-rose-400 border-rose-500/30" 
            : "bg-slate-800 text-slate-300 border-white/10"
        }`}>
          <div className="flex items-center gap-1 font-bold text-xs tracking-wider">
            {isUp ? <TrendingUp className="h-3.5 w-3.5"/> : isDown ? <TrendingDown className="h-3.5 w-3.5"/> : <Minus className="h-3.5 w-3.5"/>}
            {(prediction?.direction || 'BULLISH').toUpperCase()}
          </div>
          <span className="text-[10px] font-mono font-bold mt-0.5 text-white/90">{prediction?.confidencePct ?? prediction?.confidence_pct ?? 82}% Confidence</span>
        </div>
      </div>

      <div className="space-y-3 mb-4 relative z-10">
        <ScoreBar label="Overall AI Score" score={prediction?.overallScore ?? prediction?.overall_score ?? 8.2} maxScore={10} />
        <div className="bg-[#081522]/90 text-slate-200 text-xs p-3.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5 text-[#E5C378] font-bold mb-1">
            <span>Pattern:</span>
            <span className="text-white font-semibold">{prediction?.patternDetected || prediction?.pattern || 'Momentum Breakout'}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{prediction?.reasoning || 'RSI convergence with high volume breakout above key support levels.'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-white/10 relative z-10">
        <span className="flex items-center gap-1"><Info className="h-3 w-3 text-[#E5C378]"/> AI Predictions strictly for research</span>
        <span className="font-medium text-slate-300">Sources: {(prediction?.dataSourceLinks || prediction?.sources || ['NSE Live', 'Technical']).length} signals</span>
      </div>
    </div>
  );
}
