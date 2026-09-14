"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

const ANNUAL_RETURN_ASSUMPTION = 0.12; // long-term average equity return used for illustration
const FNO_AVG_LOSS = 50000; // SEBI: average net trading loss per loss-making F&O trader
const FNO_EXTRA_COST_PCT = 0.28; // SEBI: additional ~28% of losses as transaction costs

function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function sipFutureValue(monthly: number, years: number, annualRate: number) {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export default function WealthRealitySimulator() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);

  const { invested, futureValue, gains } = useMemo(() => {
    const investedTotal = monthly * 12 * years;
    const fv = sipFutureValue(monthly, years, ANNUAL_RETURN_ASSUMPTION);
    return { invested: investedTotal, futureValue: fv, gains: fv - investedTotal };
  }, [monthly, years]);

  const fnoTotalLoss = FNO_AVG_LOSS * (1 + FNO_EXTRA_COST_PCT);
  const maxBar = Math.max(futureValue, fnoTotalLoss * 4); // keep F&O bar visually small but real, stocks bar dominant

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" /> Wealth Reality Simulator
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        Ye same paisa do alag raaston par kya karta hai — dheeraj wala stocks/SIP investing,
        vs F&O trading ka SEBI-reported average outcome.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly SIP Amount</label>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-500"
          />
          <div className="text-white font-bold mt-1">{formatINR(monthly)} / month</div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Period</label>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full mt-2 accent-emerald-500"
          />
          <div className="text-white font-bold mt-1">{years} saal</div>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Stocks / SIP me {years} saal invest karne par
            </span>
            <span className="text-white font-bold">{formatINR(futureValue)}</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (futureValue / maxBar) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Aapne daale: {formatINR(invested)} · Gains (~{Math.round(ANNUAL_RETURN_ASSUMPTION * 100)}% avg return assume karke): {formatINR(gains)}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold text-red-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> Average F&O trader ka outcome (SEBI data)
            </span>
            <span className="text-red-400 font-bold">-{formatINR(fnoTotalLoss)}</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (fnoTotalLoss / maxBar) * 100)}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            SEBI ke mutabik ~9 out of 10 individual F&O traders net loss me rehte hain — average net loss ~{formatINR(FNO_AVG_LOSS)},
            plus ~{Math.round(FNO_EXTRA_COST_PCT * 100)}% transaction costs alag se. Ye time-period se independent hai — F&O me loss saalon saal try karne par bhi kam nahi hota.
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Ye illustration hai, guarantee nahi — stock market me returns ghat-badh sakte hain aur negative bhi ho sakte hain.
          Lekin farak dekho: stocks/SIP wale side me time aapke favor me kaam karta hai (jitna zyada time, utna zyada compounding),
          jabki F&O wale side me average outcome loss hi rehta hai, chahe kitna bhi time lagao.
        </p>
      </div>
    </div>
  );
}
