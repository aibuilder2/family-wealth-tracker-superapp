"use client";

import { Target, History, CheckCircle2, TrendingUp } from "lucide-react";
import PredictionHistory from "@/components/predictions/PredictionHistory";

export default function AccuracyTrackerPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Target className="h-6 w-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Accuracy Tracker</h1>
          <p className="text-sm text-slate-400">100% Transparent track record of our machine learning models.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Win Rate</p>
          <div className="text-4xl font-extrabold text-indigo-600 flex items-center gap-2">68.5%</div>
          <p className="text-xs text-gray-400 mt-2">Last 90 Days</p>
        </div>
        
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Predictions</p>
          <div className="text-4xl font-extrabold text-white flex items-center gap-2"><History className="h-6 w-6 text-gray-400"/> 145</div>
          <p className="text-xs text-gray-400 mt-2">Equities Only</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-lg border border-slate-800 flex flex-col justify-center items-center text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Average Return</p>
          <div className="text-4xl font-extrabold text-green-600 flex items-center gap-2"><TrendingUp className="h-6 w-6"/> +2.4%</div>
          <p className="text-xs text-gray-400 mt-2">Per successful trade</p>
        </div>
      </div>

      <div className="bg-[#0B0F19] p-4 rounded-lg border text-sm text-slate-400 mb-8">
        <strong>How we calculate:</strong> A prediction is marked <CheckCircle2 className="inline h-4 w-4 text-green-500 mx-1"/> correct if the stock moves in the predicted direction by at least 1% within the next 3 trading sessions without hitting the predicted support (stop-loss) level first.
      </div>

      {/* History Table */}
      <PredictionHistory />
    </div>
  );
}