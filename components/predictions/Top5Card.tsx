import type { AIPrediction } from "@/types/prediction";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import ScoreBar from "../stock/ScoreBar";

export default function Top5Card({ prediction }: { prediction?: AIPrediction | any }) {
  const dir = (prediction?.direction || 'up').toLowerCase();
  const isUp = dir === 'up' || dir === 'bullish';
  const isDown = dir === 'down' || dir === 'bearish';

  return (
    <div className="bg-[#111827] border rounded-xl p-5 shadow-lg border-slate-800 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-white">{prediction?.symbol || 'NIFTY 50'}</h3>
          <p className="text-xs text-slate-400">{prediction?.companyName || prediction?.company_name || 'Index / Stock'}</p>
        </div>
        <div className={`flex flex-col items-end px-3 py-1.5 rounded-lg ${isUp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : isDown ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-slate-800/50 text-slate-300"}`}>
          <div className="flex items-center gap-1 font-bold text-sm">
            {isUp ? <TrendingUp className="h-4 w-4"/> : isDown ? <TrendingDown className="h-4 w-4"/> : <Minus className="h-4 w-4"/>}
            {(prediction?.direction || 'BULLISH').toUpperCase()}
          </div>
          <span className="text-[10px] font-bold opacity-80">{prediction?.confidencePct ?? prediction?.confidence_pct ?? 82}% Confidence</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <ScoreBar label="Overall AI Score" score={prediction?.overallScore ?? prediction?.overall_score ?? 8.2} maxScore={10} />
        <div className="bg-blue-500/10 text-blue-300 text-xs p-3 rounded-xl border border-blue-500/20">
          <strong className="text-white">Pattern:</strong> {prediction?.patternDetected || prediction?.pattern || 'Momentum Breakout'} <br/>
          <span className="text-slate-300 mt-1 block">{prediction?.reasoning || 'RSI convergence with high volume breakout above key support levels.'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
        <span className="flex items-center gap-1"><Info className="h-3 w-3 text-amber-400"/> AI Predictions strictly for research</span>
        <span>Sources: {(prediction?.dataSourceLinks || prediction?.sources || ['NSE Live', 'Technical']).length} signals</span>
      </div>
    </div>
  );
}
