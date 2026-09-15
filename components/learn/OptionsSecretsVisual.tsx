"use client";

import { useState } from "react";
import { Zap, Clock, TrendingUp, AlertTriangle, ShieldCheck, Flame, Layers, DollarSign, Activity } from "lucide-react";

export default function OptionsSecretsVisual() {
  const [activeSecret, setActiveSecret] = useState<"iv_crush" | "theta_decay" | "sideways_earning" | "greeks">("iv_crush");
  const [daysToExpiry, setDaysToExpiry] = useState<number>(7);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> Secret Mechanics of Options
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            ऑप्शंस के गहरे राज़: IV Crush, Theta Decay & Sideways Market से कमाई
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            समझिए कि ऑप्शंस का भाव बिना स्टॉक हिले भी अचानक क्यों घटता/बढ़ता है और साइडवेज मार्केट में पैसे कैसे बनते हैं।
          </p>
        </div>
      </div>

      {/* Secret Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveSecret("iv_crush")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeSecret === "iv_crush"
              ? "bg-rose-500/15 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
            <Flame className="w-4 h-4 text-rose-400" /> IV Crush का धोखा
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2">इवेंट/बजट के बाद प्रीमियम 80% क्यों गिर जाता है?</p>
        </button>

        <button
          onClick={() => setActiveSecret("theta_decay")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeSecret === "theta_decay"
              ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
            <Clock className="w-4 h-4 text-amber-400" /> Theta (Time Decay)
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2">बर्फ की तरह पिघलता हुआ प्रीमियम (खरीदार का दुश्मन)</p>
        </button>

        <button
          onClick={() => setActiveSecret("sideways_earning")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeSecret === "sideways_earning"
              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" /> स्थिर मार्केट में कमाई
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2">जब मार्केट कहीं न हिले तब Option Selling से प्रॉफिट</p>
        </button>

        <button
          onClick={() => setActiveSecret("greeks")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeSecret === "greeks"
              ? "bg-blue-500/15 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
            <Activity className="w-4 h-4 text-blue-400" /> 4 Option Greeks
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2">Delta, Gamma, Theta, Vega का असली काम</p>
        </button>
      </div>

      {/* Dynamic Content Area */}
      {activeSecret === "iv_crush" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">IV (Implied Volatility) क्या है और 'IV Crush' से नुकसान क्यों होता है?</h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
                जब मार्केट में कोई बड़ा इवेंट होने वाला होता है (जैसे: <span className="text-amber-400 font-semibold">Union Budget, Election Result, या Reliance/TCS की Earnings</span>), तो अनिश्चितता की वजह से <strong>IV 15 से बढ़कर 40-50</strong> हो जाता है। लोग घबराहट में महंगे प्रीमियम खरीदते हैं।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">घटना से पहले (High IV):</span>
              <p className="text-xs text-slate-300">Nifty 24,000 Call का भाव: <span className="text-white font-black text-sm">₹380</span> (जिसमें ₹250 सिर्फ 'डर और हवा' यानी Time & Volatility Value है)।</p>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">इवेंट के ठीक 1 मिनट बाद (IV Crush):</span>
              <p className="text-xs text-slate-300">रिजल्ट आते ही डर खत्म हुआ, IV 45 से गिरकर 15 हो गया। Nifty भले 50 प्वाइंट ऊपर गया, फिर भी Call का भाव ₹380 से गिरकर <span className="text-rose-400 font-black text-sm">₹90</span> रह गया!</p>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>गोल्डन रूल:</strong> बजट या बड़ी खबर के ठीक पहले ऑप्शंस <strong>Buy</strong> करना 95% मामलों में भारी नुकसान कराता है क्योंकि IV Crush आपके प्रीमियम को गला देता है। बड़े प्रो ट्रेडर्स ऐसे समय <strong>Option Selling / Hedged Spreads</strong> अपनाते हैं।
            </div>
          </div>
        </div>
      )}

      {activeSecret === "theta_decay" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Theta (Time Decay): धूप में रखी बर्फ की तरह पिघलता प्रीमियम</h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
                हर ऑप्शन की एक एक्सपायरी डेट होती है (जैसे हर गुरुवार)। ऑप्शन का प्रीमियम दो चीजों से बना होता है: <strong>Intrinsic Value (वास्तविक कीमत) + Extrinsic / Time Value (समय की कीमत)</strong>। जैसे-जैसे एक्सपायरी पास आती है, Time Value शून्य की तरफ भागती है।
              </p>
            </div>
          </div>

          {/* Interactive Slider Demo */}
          <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">एक्सपायरी तक बचे दिन (Days to Expiry):</label>
              <span className="text-sm font-black text-amber-400">{daysToExpiry} दिन बाकी</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={1}
              value={daysToExpiry}
              onChange={(e) => setDaysToExpiry(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0 दिन (Expiry Day 3:30 PM = ₹0)</span>
              <span>7 दिन (तेज गलन)</span>
              <span>15 दिन (धीमी गलन)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400">OTM Call प्रीमियम का शेष मूल्य:</span>
                <div className="text-xl font-black text-white mt-1">₹{Math.round(daysToExpiry * 18.5)}</div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Option Seller का कमाया हुआ Time Decay:</span>
                <div className="text-xl font-black text-emerald-400 mt-1">₹{Math.round((15 - daysToExpiry) * 18.5)} / share</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSecret === "sideways_earning" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">मार्केट स्थिर (Sideways) रहे तो भी ऑप्शंस से कैसे कमाया जाता है?</h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
                शेयर खरीदने वाले को प्रॉफिट तभी होता है जब शेयर ऊपर भागे। लेकिन <strong>Option Sellers</strong> तब सबसे ज्यादा पैसा कमाते हैं जब मार्केट <strong>कहीं भी नहीं जाता और एक छोटी रेंज में अटका रहता है</strong>।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4" /> 1. Short Straddle / Strangle
              </div>
              <p className="text-xs text-slate-300">
                वर्तमान स्ट्राइक (जैसे Nifty 24,000) का <strong>Call और Put दोनों बेच (Sell) देना</strong>। अगर निफ्टी 23,850 से 24,150 के बीच बंद हुआ तो दोनों का प्रीमियम गलकर जीरो हो जाएगा और पूरा पैसा सेलर का!
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                <Layers className="w-4 h-4" /> 2. Iron Condor (सुरक्षित)
              </div>
              <p className="text-xs text-slate-300">
                दूर का Call और Put बेचना + साथ में और दूर का OTM खरीदकर रिस्क को फिक्स करना। इसमें नुकसान सीमित (Defined Risk) होता है और साइडवेज मार्केट में नियमित कैशफ्लो बनता है।
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                <TrendingUp className="w-4 h-4" /> 3. Covered Call (पोर्टफोलियो पर)
              </div>
              <p className="text-xs text-slate-300">
                अगर आपके डिमैट में 100 Reliance शेयर्स हैं, तो ऊपर का Call बेचकर हर महीने बिना शेयर बेचे ₹5,000-₹10,000 की एक्स्ट्रा मंथली रेंट (कमाई) लेना।
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSecret === "greeks" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">4 ऑप्शंस ग्रीक्स (Option Greeks) जो कीमत तय करते हैं</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-blue-400 font-bold text-sm">Δ Delta (दिशा का असर):</div>
              <p className="text-xs text-slate-300">
                निफ्टी ₹100 बढ़ने पर ऑप्शन का भाव कितने रुपए बढ़ेगा। ATM ऑप्शन का Delta लगभग 0.5 होता है (यानी ₹100 निफ्टी बढ़ने पर ₹50 प्रीमियम बढ़ेगा)।
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold text-sm">Θ Theta (समय का चोर):</div>
              <p className="text-xs text-slate-300">
                हर दिन बिना मार्केट हिले ऑप्शन का भाव कितने रुपए खुद-ब-खुद घट जाएगा।
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-rose-400 font-bold text-sm">ν Vega (घबराहट/IV का मीटर):</div>
              <p className="text-xs text-slate-300">
                मार्केट में डर/IV 1% बढ़ने पर ऑप्शन की कीमत में होने वाली बढ़ोतरी।
              </p>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-purple-400 font-bold text-sm">Γ Gamma (Hero-Zero का इंजन):</div>
              <p className="text-xs text-slate-300">
                एक्सपायरी के दिन डेल्टा कितनी तेजी से बदलता है। यही ₹10 के ऑप्शन को 10 मिनट में ₹150 बना देता है या ₹0 कर देता है।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
