"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, HelpCircle, CheckCircle2, XCircle, ChevronRight,
  AlertTriangle, Star, List, ThumbsUp, Share2, Trophy,
  ArrowRight, ArrowLeft, RotateCcw, Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";
import FnoRiskVisual from "@/components/learn/FnoRiskVisual";
import LossStatistics from "@/components/learn/LossStatistics";
import AssetCompareTable from "@/components/learn/AssetCompareTable";
import InvestmentCompare from "@/components/learn/InvestmentCompare";
import LessonCard from "@/components/learn/LessonCard";
import WealthRealitySimulator from "@/components/learn/WealthRealitySimulator";
import OptionsSecretsVisual from "@/components/learn/OptionsSecretsVisual";
import NismCareerRoadmap from "@/components/learn/NismCareerRoadmap";

const ALL_CATEGORY_CHAPTERS: { [key: string]: any[] } = {
  "0 Se Seekho": [
    {
      id: "l-1",
      lesson_number: 1,
      title: "Share Market Basic: Share Kya Hota Hai?",
      content: "Jab aap kisi company ka ek share khareedte hain, to aap us company ke chote hissedar (part-owner) ban jaate hain. Company jab profit kamati hai to aapko dividend aur capital appreciation milta hai.\n\n• Share = Hissedari\n• Jab company grow karti hai to aapki daulat (wealth) grow karti hai.\n• Long-term me ache business me invest karna compounding ka sabse bada zariya hai.",
      quiz_data: [
        { question: "Share khareedne par aap kya bante hain?", options: ["Company ke Malik / Part-Owner", "Bank Manager", "Auditor"], correct: 0 }
      ]
    },
    {
      id: "l-2",
      lesson_number: 2,
      title: "NSE, BSE aur SEBI: Market Kaise Kaam Karta Hai?",
      content: "NSE (National Stock Exchange) aur BSE (Bombay Stock Exchange) India ke do main exchanges hain jahan shares trade hote hain. \n\nSEBI (Securities & Exchange Board of India) market ka regulator hai jo har retail investor ko protect karta hai aur fraud/manipulation ko rokta hai.",
      quiz_data: [
        { question: "India me Stock Market ka regulator kaun hai?", options: ["RBI", "SEBI", "IRDAI"], correct: 1 }
      ]
    },
    {
      id: "l-3",
      lesson_number: 3,
      title: "Candlestick Patterns & Technical Analysis",
      content: "Har Green candle buyers ki strength aur Red candle sellers ki pressure show karti hai.\n\n• Bullish Engulfing: Sellers ko buyers ne poori tarah daba diya (Upar jaane ka signal).\n• Hammer: Neeche se strong buying rejection aayi.\n• Doji: Market me indecision hai, trend reverse ho sakta hai.",
      quiz_data: [
        { question: "Green candle ka matlab kya hota hai?", options: ["Price Open se upar Close hua (Buyers)", "Price gira", "Market closed"], correct: 0 }
      ]
    },
    {
      id: "l-4",
      lesson_number: 4,
      title: "Risk Management: 1% Rule & Stop Loss",
      content: "Kabhi bhi ek single trade me apni total capital ka 1-2% se jyada risk mat lein. Stop loss lagana har trade me anivarya (mandatory) hai.\n\n• Agar aapka capital ₹1,00,000 hai, to kisi bhi ek trade me loss ₹1,000 se ₹2,000 se jyada nahi hona chahiye.\n• Risk-to-Reward ratio hamesha kam se kam 1:2 hona chahiye.",
      quiz_data: [
        { question: "Ek trade me maximum kitna risk lena chahiye?", options: ["1% se 2%", "50%", "100%"], correct: 0 }
      ]
    },
    {
      id: "l-5",
      lesson_number: 5,
      title: "Futures & Options (F&O) Reality Check",
      content: "SEBI ke mutabik 90%+ retail F&O traders loss karte hain. Options tabhi trade karein jab aapke paas complete hedging aur data analysis ho.\n\n• Naked Option buying me time decay (Theta) har second buyer ka paisa galata hai.\n• Bina deep knowledge ke Hero-Zero ya lottery trading se bachein.",
      quiz_data: [
        { question: "SEBI report ke mutabik kitne % retail F&O traders loss karte hain?", options: ["90% se jyada", "10%", "5%"], correct: 0 }
      ]
    }
  ],
  "NISM & SEBI Exams": [
    {
      id: "nism-1",
      lesson_number: 1,
      title: "NISM Series V-A: Mutual Fund Distributor (MFD / ARN) Kaise Banein?",
      content: "NISM Series V-A एग्जाम पास करने के बाद आपको AMFI से ARN नंबर मिलता है। इसके बाद आप ऑथराइज्ड म्यूचुअल फंड डिस्ट्रीब्यूटर बन जाते हैं। \n\n• एग्जाम फीस: ₹1,500 + GST\n• पासिंग मार्क्स: 50% (कोई नेगेटिव मार्किंग नहीं)\n• सिलेबस: म्यूचुअल फंड स्ट्रक्चर, NAV, TER, लिक्विड/इक्विटी/डेट फंड्स और टैक्सेशन।\n• कमाई का मॉडल: क्लाइंट्स के निवेश पर 0.75% से 1.2% का लाइफटाइम ट्रेल कमीशन। 10 करोड़ AUM पर ~₹70,000/माह पैसिव इनकम!",
      quiz_data: [
        { question: "NISM Series V-A पास करने के बाद कौन सा नंबर मिलता है?", options: ["ARN (AMFI Registration Number)", "PAN Card", "GST Number", "FSSAI License"], correct: 0 },
        { question: "MFD को किस प्रकार की कमीशन लाइफटाइम मिलती है?", options: ["Trail Commission", "Daily Salary", "Bank Interest", "Bonus Point"], correct: 0 }
      ]
    },
    {
      id: "nism-2",
      lesson_number: 2,
      title: "NISM Series XV: SEBI Research Analyst (RA) Kaise Banein?",
      content: "SEBI के तहत कानूनी रूप से स्टॉक टिप्स, टारगेट, स्टॉप लॉस और रिसर्च रिपोर्ट देने के लिए NISM Series XV पास करना अनिवार्य है।\n\n• एग्जाम फीस: ₹3,000 + GST\n• पासिंग मार्क्स: 60% (25% नेगेटिव मार्किंग)\n• सिलेबस: फंडामेंटल एनालिसिस (P/E, Balance Sheet, Cash Flow), टेक्निकल एनालिसिस, इकोनॉमिक इंडिकेटर्स और SEBI RA रेगुलेशंस 2014।\n• करियर: खुद की पेड रिसर्च सर्विस, ब्रोकिंग हाउस में इक्विटी रिसर्च जॉब (₹10-25 लाख पैकेज)।",
      quiz_data: [
        { question: "SEBI लीगल स्टॉक रिकमेंडेशन देने के लिए कौन सा NISM एग्जाम जरूरी है?", options: ["NISM Series XV (Research Analyst)", "NISM Series I", "Driving Test", "CA Final"], correct: 0 }
      ]
    },
    {
      id: "nism-3",
      lesson_number: 3,
      title: "NISM Series X-A & X-B: SEBI Registered Investment Adviser (RIA)",
      content: "RIA भारत में सबसे निष्पक्ष वित्तीय सलाहकार माने जाते हैं। ये किसी भी फंड या शेयर से कमीशन नहीं ले सकते, केवल क्लाइंट से सीधे फाइनेंशियल प्लानिंग फीस (जैसे ₹25,000/साल) लेते हैं।\n\n• योग्यता: फाइनेंस में पोस्ट ग्रेजुएशन / CA / MBA + 5 साल का अनुभव।\n• अवसर: HNIs और बड़े उद्योगपति परिवारों के फैमिली ऑफिस और वेल्थ पोर्टफोलियो को मैनेज करना।",
      quiz_data: [
        { question: "SEBI RIA (Investment Adviser) की कमाई का मुख्य जरिया क्या है?", options: ["Direct Client Advisory Fee (Fee-Only)", "Broker Commission", "Insurance Kickback"], correct: 0 }
      ]
    }
  ],
  "Options के सारे राज़": [
    {
      id: "opt-1",
      lesson_number: 1,
      title: "IV (Implied Volatility) Crush: बजट या इवेंट के बाद 80% नुकसान क्यों?",
      content: "ऑप्शन की कीमत में 'डर/अनिश्चितता' की कीमत जुड़ी होती है जिसे IV कहते हैं। बजट या नतीजों से पहले IV 45+ पहुंच जाता है जिससे ऑप्शन बहुत महंगा हो जाता है।\n\nजैसे ही इवेंट खत्म होता है, अनिश्चितता खत्म होने से IV तुरंत 15 पर आ जाता है — इसे IV Crush कहते हैं। इस समय निफ्टी भले ही ऊपर चला जाए, फिर भी Call ऑप्शन का भाव ₹350 से गिरकर ₹80 रह जाता है।\n\nनियम: बड़े इवेंट्स से ठीक पहले नेकेड ऑप्शन कभी BUY मत करो!",
      quiz_data: [
        { question: "बजट या चुनाव नतीजों के तुरंत बाद ऑप्शन प्रीमियम अचानक क्यों घटता है?", options: ["IV Crush (घबराहट खत्म होने से)", "मार्केट बंद होने से", "ब्रोकरेज चार्ज कटने से"], correct: 0 }
      ]
    },
    {
      id: "opt-2",
      lesson_number: 2,
      title: "Theta (Time Decay): बिना हिले भी ऑप्शन जीरो क्यों हो जाता है?",
      content: "ऑप्शन धूप में रखी बर्फ की तरह है। हर दिन, हर घंटा गुजरने के साथ इसका Time Value शून्य की ओर पिघलता है।\n\n• अगर निफ्टी पूरे हफ्ते 24,000 पर स्थिर रहा, तो 24,000 की Call और Put दोनों एक्सपायरी के 3:30 बजे ₹0 हो जाएंगी।\n• खरीदार (Buyer) का हर सेकंड नुकसान होता है, जबकि सेलर (Seller) का हर सेकंड प्रॉफिट बढ़ता है।",
      quiz_data: [
        { question: "Time Decay (Theta) का फायदा सबसे ज्यादा किसे मिलता है?", options: ["Option Seller (Writer)", "Option Buyer", "Bank Manager"], correct: 0 }
      ]
    },
    {
      id: "opt-3",
      lesson_number: 3,
      title: "मार्केट स्थिर (Sideways) रहे तो भी ऑप्शंस से कमाई (Short Straddle & Iron Condor)",
      content: "जब निफ्टी एक दायरे (Range) में फंसा होता है, तो प्रो-ट्रेडर्स ऑप्शन बाय करने के बजाय Option Selling करते हैं।\n\n1. Short Straddle: ATM Call और ATM Put दोनों एक साथ बेचना।\n2. Iron Condor: सुरक्षित दायरा बनाकर दूर की Call/Put बेचना और रिस्क हेज करना।\nमार्केट स्थिर रहने पर टाइम डिके के कारण दोनों तरफ का प्रीमियम सेलर की जेब में आता है।",
      quiz_data: [
        { question: "साइडवेज (स्थिर) मार्केट में कौन सी रणनीति से प्रीमियम कमाया जाता है?", options: ["Iron Condor / Short Straddle (Option Selling)", "Out-of-the-Money Call Buying", "Intraday Hero Zero"], correct: 0 }
      ]
    }
  ]
};

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("0 Se Seekho");
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [dbChapters, setDbChapters] = useState<any[]>(ALL_CATEGORY_CHAPTERS["0 Se Seekho"]);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const BEGINNER_TAB = "0 Se Seekho";

  // Load saved completed chapters on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fwa_learn_completed_lessons");
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Fetch chapters for active tab
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);

      try {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase
            .from("learn_chapters")
            .select("*")
            .eq(activeTab === BEGINNER_TAB ? "segment" : "category", activeTab === BEGINNER_TAB ? "zero-to-hero" : activeTab)
            .order("lesson_number", { ascending: true });

          if (!error && data && data.length > 0) {
            setDbChapters(data);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to local rich curriculum
      }

      setDbChapters(ALL_CATEGORY_CHAPTERS[activeTab] || ALL_CATEGORY_CHAPTERS["0 Se Seekho"] || []);
      setLoading(false);
    };

    fetchChapters();
  }, [activeTab]);

  const activeChapterContent = {
    title: selectedChapter?.title || "",
    content: selectedChapter?.content || "",
    quiz: selectedChapter?.quiz_data || selectedChapter?.quiz || []
  };

  // Chapter Navigation Calculations
  const currentIndex = dbChapters.findIndex(
    ch => (ch.id && selectedChapter?.id && ch.id === selectedChapter.id) ||
          ch.lesson_number === selectedChapter?.lesson_number
  );
  const prevChapter = currentIndex > 0 ? dbChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < dbChapters.length - 1 ? dbChapters[currentIndex + 1] : null;

  const goToChapter = (chapter: any) => {
    setSelectedChapter(chapter);
    setShowTest(false);
    setSelectedAns(null);
    setCurrentQ(0);
    setQuizPassed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getChapterKey = (ch: any) => ch.id || `${activeTab}-${ch.lesson_number}`;

  // Handle Quiz Answer Selection
  const handleAnswer = (index: number) => {
    setSelectedAns(index);
    const isCorrect = index === activeChapterContent.quiz[currentQ]?.correct;

    // If correct and it's the last question (or only question)
    if (isCorrect && currentQ === activeChapterContent.quiz.length - 1) {
      const chapterKey = getChapterKey(selectedChapter);
      setCompletedLessons(prev => {
        const next = prev.includes(chapterKey) ? prev : [...prev, chapterKey];
        try {
          localStorage.setItem("fwa_learn_completed_lessons", JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      setQuizPassed(true);
      try {
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  // Completed count for current category
  const categoryCompletedCount = dbChapters.filter(ch =>
    completedLessons.includes(getChapterKey(ch))
  ).length;
  const progressPercent = dbChapters.length > 0
    ? Math.round((categoryCompletedCount / dbChapters.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-amber-400" /> Academy &amp; Testing
        </h1>
        <p className="text-sm text-slate-400">
          Share Market Basics, NISM/SEBI Exams aur Options Secrets sikhein aur quiz pass karke agle lesson me badhein.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
        {[
          BEGINNER_TAB,
          "NISM & SEBI Exams",
          "Options के सारे राज़",
          "Investment Reality",
          "Technical Analysis",
          "Comparisons",
          "Options",
          "SIP & SWP"
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedChapter(null);
              setShowTest(false);
              setSelectedAns(null);
              setCurrentQ(0);
              setQuizPassed(false);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SEBI Hardcoded Warning */}
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-200">
          <strong>SEBI Guideline:</strong> 9 out of 10 individual traders in equity Futures and Options Segment incurred net losses. Risk management aur chapter quiz pass karke hi aage badhein.
        </p>
      </div>

      {/* NISM Career Roadmap Visual */}
      {activeTab === "NISM & SEBI Exams" && !selectedChapter && (
        <div className="mb-8">
          <NismCareerRoadmap />
        </div>
      )}

      {/* Options Secrets Visual */}
      {(activeTab === "Options के सारे राज़" || activeTab === "Options") && !selectedChapter && (
        <div className="mb-8">
          <OptionsSecretsVisual />
        </div>
      )}

      {/* Chapter List OR Content Area */}
      {!selectedChapter ? (
        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <List className="w-5 h-5 text-blue-400" /> {activeTab} - Chapters
            </h2>

            {/* Category Progress Stats */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-slate-400">Pragati:</span>
              <span className="font-bold text-amber-400">
                {categoryCompletedCount} / {dbChapters.length} Passed ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Chapters List */}
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500 animate-pulse">Loading modules...</p>
            ) : dbChapters.length === 0 ? (
              <p className="text-sm text-slate-500">No chapters available for this category yet.</p>
            ) : (
              dbChapters.map((ch, idx) => {
                const isCompleted = completedLessons.includes(getChapterKey(ch));

                return (
                  <div
                    key={ch.id || idx}
                    onClick={() => goToChapter(ch)}
                    className={`flex items-center justify-between p-4 bg-[#0B0F19] border rounded-xl hover:border-amber-500/60 cursor-pointer transition-all ${
                      isCompleted ? "border-emerald-500/40 bg-emerald-950/10" : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-slate-800 border-slate-700 text-amber-400"
                        }`}
                      >
                        {isCompleted ? <Check size={16} /> : ch.lesson_number || idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm truncate">{ch.title}</h4>
                          {isCompleted && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ✓ Padh Liya
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ch.content}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 shrink-0 ml-2" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Selected Chapter Content */
        <div className="bg-[#111827] rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedChapter(null)}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              ← Sabhi Chapters ki List
            </button>

            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Lesson {selectedChapter?.lesson_number} of {dbChapters.length}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {activeChapterContent.title}
          </h2>

          <div className="bg-[#0B0F19] p-5 sm:p-6 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {activeChapterContent.content}
          </div>

          {/* Chapter Bottom Navigation (Prev / Next) */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {prevChapter ? (
              <button
                onClick={() => goToChapter(prevChapter)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft size={14} /> Lesson {prevChapter.lesson_number}
              </button>
            ) : <div />}

            {nextChapter && (
              <button
                onClick={() => goToChapter(nextChapter)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                Lesson {nextChapter.lesson_number} <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Test / Quiz Button */}
          {activeChapterContent.quiz && activeChapterContent.quiz.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              {!showTest ? (
                <button
                  onClick={() => {
                    setShowTest(true);
                    setCurrentQ(0);
                    setSelectedAns(null);
                    setQuizPassed(false);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <HelpCircle className="w-4 h-4" /> Start Chapter Test (Practical Quiz)
                </button>
              ) : quizPassed ? (
                /* QUIZ PASSED CELEBRATION BOX */
                <div className="bg-emerald-500/15 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Shaabaash! Aapne Chapter {selectedChapter?.lesson_number} Pass Kar Liya!
                    </h3>
                    <p className="text-xs text-emerald-300 mt-1">
                      Sahi uttar! Yeh lesson aapki learning profile me complete mark ho gaya hai.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {nextChapter ? (
                      <button
                        onClick={() => goToChapter(nextChapter)}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        🚀 Agla Chapter Padhein: Lesson {nextChapter.lesson_number} →
                      </button>
                    ) : (
                      <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/30">
                        🎉 Badhaai ho! Is category ke sabhi chapters complete ho gaye!
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedChapter(null);
                        setShowTest(false);
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
                    >
                      ← Sabhi Chapters ki List
                    </button>
                  </div>
                </div>
              ) : (
                /* QUIZ QUESTION AREA */
                <div className="bg-[#0B0F19] p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Question {currentQ + 1} of {activeChapterContent.quiz.length}
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      Sahi option chunein
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-white">
                    {activeChapterContent.quiz[currentQ]?.question}
                  </p>

                  <div className="space-y-2.5">
                    {activeChapterContent.quiz[currentQ]?.options.map((opt: string, optIdx: number) => {
                      const isSelected = selectedAns === optIdx;
                      const isCorrect = optIdx === activeChapterContent.quiz[currentQ]?.correct;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswer(optIdx)}
                          className={`w-full p-3.5 rounded-xl text-left text-xs font-bold border transition-all flex items-center justify-between ${
                            selectedAns !== null
                              ? isCorrect
                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                : isSelected
                                ? "bg-rose-500/20 border-rose-500 text-rose-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                              : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedAns !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {selectedAns !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback or Retry */}
                  {selectedAns !== null && selectedAns !== activeChapterContent.quiz[currentQ]?.correct && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2">
                      <span className="text-xs text-rose-300 font-semibold">
                        ❌ Galat uttar! Kripya dobara prayas karein.
                      </span>
                      <button
                        onClick={() => setSelectedAns(null)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Retry
                      </button>
                    </div>
                  )}

                  {/* Multi-question Next */}
                  {selectedAns !== null &&
                    selectedAns === activeChapterContent.quiz[currentQ]?.correct &&
                    currentQ < activeChapterContent.quiz.length - 1 && (
                      <button
                        onClick={() => {
                          setCurrentQ(currentQ + 1);
                          setSelectedAns(null);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl mt-2 flex items-center gap-1.5"
                      >
                        Agla Question →
                      </button>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}