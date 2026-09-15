"use client";

import { useState } from "react";
import { Award, Briefcase, TrendingUp, CheckCircle, ExternalLink, Calculator, BookOpen, UserCheck, DollarSign } from "lucide-react";

export default function NismCareerRoadmap() {
  const [selectedExam, setSelectedExam] = useState<"mfd" | "ra" | "ria" | "fno">("mfd");
  const [aumInCrores, setAumInCrores] = useState<number>(10); // ₹10 Cr AUM for MFD
  const [raClients, setRaClients] = useState<number>(50); // 50 paid subscribers for RA

  const mfdAnnualCommission = aumInCrores * 10000000 * 0.0085; // ~0.85% trail commission
  const mfdMonthlyEarnings = Math.round(mfdAnnualCommission / 12);

  const raMonthlyFee = 3500; // ₹3,500/month per subscriber
  const raMonthlyEarnings = raClients * raMonthlyFee;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> SEBI & NISM Certifications & Career Hub
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            NISM / SEBI सर्टिफिकेशन्स और करियर के बड़े अवसर (MFD, RA, RIA)
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            जानिए MFD (म्यूचुअल फंड डिस्ट्रीब्यूटर), SEBI Research Analyst (RA), और Investment Adviser कैसे बनते हैं और इनके कमाई के मॉडल क्या हैं।
          </p>
        </div>
      </div>

      {/* Certification Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => setSelectedExam("mfd")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            selectedExam === "mfd"
              ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-lg shadow-amber-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="font-bold text-xs uppercase mb-0.5">NISM Series V-A</div>
          <div className="text-sm font-bold text-white">MFD (Mutual Fund Distributor)</div>
          <p className="text-[11px] text-slate-500 mt-1">Life-time Trail Commission Model</p>
        </button>

        <button
          onClick={() => setSelectedExam("ra")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            selectedExam === "ra"
              ? "bg-blue-500/15 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="font-bold text-xs uppercase mb-0.5">NISM Series XV</div>
          <div className="text-sm font-bold text-white">Research Analyst (SEBI RA)</div>
          <p className="text-[11px] text-slate-500 mt-1">Stock Tips & Research Subscription</p>
        </button>

        <button
          onClick={() => setSelectedExam("ria")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            selectedExam === "ria"
              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="font-bold text-xs uppercase mb-0.5">NISM Series X-A & X-B</div>
          <div className="text-sm font-bold text-white">Investment Adviser (SEBI RIA)</div>
          <p className="text-[11px] text-slate-500 mt-1">Fee-Only Financial Planner</p>
        </button>

        <button
          onClick={() => setSelectedExam("fno")}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            selectedExam === "fno"
              ? "bg-purple-500/15 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10"
              : "bg-[#0B0F19] border-slate-800 text-slate-400 hover:border-slate-700"
          }`}
        >
          <div className="font-bold text-xs uppercase mb-0.5">NISM Series VIII</div>
          <div className="text-sm font-bold text-white">Equity Derivatives (F&O)</div>
          <p className="text-[11px] text-slate-500 mt-1">Prop Trading & Brokerage Dealer</p>
        </button>
      </div>

      {/* Dynamic Detail Card */}
      {selectedExam === "mfd" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-full uppercase">
                AMFI / ARN Licensed
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-2">
                NISM Series V-A: Mutual Fund Distributors Certification
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                यह एग्जाम पास करने के बाद आपको AMFI से <strong>ARN (AMFI Registration Number)</strong> मिलता है, जिसके बाद आप किसी भी व्यक्ति का म्यूचुअल फंड और SIP शुरू करवा सकते हैं।
              </p>
            </div>
            <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl text-center shrink-0">
              <div className="text-xs text-slate-400">Exam Fee / Marks</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">₹1,500 + GST</div>
              <div className="text-[11px] text-slate-500">50% Passing (No Negative Marking)</div>
            </div>
          </div>

          {/* Syllabus Covered */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> इस एग्जाम में क्या पढ़ाया जाता है?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Mutual Fund Structure & AMC Operations
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> NAV Calculation, Expense Ratio (TER), Exit Load
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Equity, Debt, Hybrid & Liquid Fund Scheme Categories
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Taxation: LTCG, STCG, Indexation & SEBI Code of Conduct
              </div>
            </div>
          </div>

          {/* Earning Potential & Career Calculator */}
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Calculator className="w-4 h-4" /> MFD Trail Commission & Passive Income Simulator
            </div>
            <p className="text-xs text-slate-300">
              MFD को क्लाइंट के पैसे पर हर साल <strong>0.75% से 1.2% Trail Commission</strong> लाइफटाइम मिलता है जब तक क्लाइंट का पैसा इन्वेस्टेड रहता है।
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>कुल मैनेज्ड एसेट्स (Client AUM): ₹{aumInCrores} करोड़</span>
                <span className="text-amber-400 font-black text-sm">लगभग ₹{mfdMonthlyEarnings.toLocaleString('en-IN')}/महीना पैसिव इनकम</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={aumInCrores}
                onChange={(e) => setAumInCrores(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>₹1 Cr AUM (~₹7,000/mo)</span>
                <span>₹10 Cr AUM (~₹70,000/mo)</span>
                <span>₹50 Cr AUM (~₹3.5 Lakh/mo)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedExam === "ra" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 font-bold text-[10px] rounded-full uppercase">
                SEBI Registered
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-2">
                NISM Series XV: Research Analyst (RA) Certification
              </h3>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                SEBI के तहत <strong>लीगल स्टॉक रिकमेंडेशन, टारगेट, स्टॉप लॉस और रिसर्च रिपोर्ट्स</strong> देने के लिए यह सर्टिफिकेशन अनिवार्य है। बिना इसके स्टॉक एडवाइज देना गैर-कानूनी (Illegal) है।
              </p>
            </div>
            <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl text-center shrink-0">
              <div className="text-xs text-slate-400">Exam Fee / Marks</div>
              <div className="text-lg font-black text-blue-400 mt-0.5">₹3,000 + GST</div>
              <div className="text-[11px] text-slate-500">60% Passing (25% Negative Marking)</div>
            </div>
          </div>

          {/* Syllabus Covered */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" /> इस एग्जाम में क्या पढ़ाया जाता है?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Fundamental Analysis (P/E, DCF, Balance Sheet & Cash Flows)
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Technical Analysis (Price Action, Moving Averages, RSI, Volumes)
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Micro & Macro Economic Indicators (GDP, Inflation, Interest Rates)
              </div>
              <div className="p-3 bg-[#111827] rounded-lg border border-slate-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> SEBI (Research Analysts) Regulations 2014 & Code of Conduct
              </div>
            </div>
          </div>

          {/* RA Business Model */}
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Briefcase className="w-4 h-4" /> SEBI RA करियर और कमाई के तरीके
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <div className="font-bold text-white mb-1">1. पेड रिसर्च सब्सक्रिप्शन</div>
                <p className="text-slate-400">ट्रेडर्स और इन्वेस्टर्स को अपनी रिसर्च/मॉडल पोर्टफोलियो मंथली/क्वार्टरली फीस पर देना।</p>
              </div>
              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <div className="font-bold text-white mb-1">2. ब्रोकरेज और वेल्थ फर्म में जॉब</div>
                <p className="text-slate-400">Motilal Oswal, ICICI Direct, HDFC Securities में ₹8L - ₹25L+ पैकेज पर Equity Research Analyst बनना।</p>
              </div>
              <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
                <div className="font-bold text-white mb-1">3. फिनटेक प्लेटफॉर्म्स</div>
                <p className="text-slate-400">Smallcase, TradingView, या अपनी खुद की वेबसाइट पर SEBI कंप्लायंट स्ट्रेटेजी पब्लिश करना।</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedExam === "ria" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-4">
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] rounded-full uppercase">
            Pure Advisory
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            NISM Series X-A & X-B: Investment Adviser (SEBI RIA)
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            RIA केवल फीस लेकर निष्पक्ष (Unbiased) वित्तीय सलाह देता है। यह किसी भी प्रोडक्ट (म्यूचुअल फंड या शेयर) से कमीशन नहीं ले सकता, केवल क्लाइंट से फिक्स्ड कंसल्टिंग फीस (जैसे ₹25,000/वर्ष) चार्ज करता है।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">योग्यता:</span>
              <p className="text-slate-300 mt-1">Post Graduation (Finance / MBA / CA / CFP) + 5 साल का रिलेवेंट एक्सपीरियंस जरूरी।</p>
            </div>
            <div className="bg-[#111827] p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">अवसर:</span>
              <p className="text-slate-300 mt-1">High-Net-Worth Individuals (HNIs) और परिवारों की समग्र वेल्थ प्लानिंग और फैमिली ऑफिस मैनेजमेंट।</p>
            </div>
          </div>
        </div>
      )}

      {selectedExam === "fno" && (
        <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-6 space-y-4">
          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-bold text-[10px] rounded-full uppercase">
            Derivatives Trader
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            NISM Series VIII: Equity Derivatives Certification
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            स्टॉक ब्रोकरेज में F&O डीलर बनने, प्रॉप-डेस्क (Prop Trading Desk) पर एल्गो ट्रेडिंग चलाने, और फ्यूचर्स एवं ऑप्शंस कॉन्ट्रैक्ट्स के टेक्निकल सेटलमेंट के लिए यह सर्टिफिकेशन जरूरी होता है।
          </p>
        </div>
      )}
    </div>
  );
}
