"use client";

import { useState, useEffect } from "react";
import { BookOpen, HelpCircle, CheckCircle2, XCircle, ChevronRight, AlertTriangle, Star, List, ThumbsUp, Share2 } from "lucide-react";
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
      content: "Jab aap kisi company ka ek share khareedte hain, to aap us company ke chote hissedar (part-owner) ban jaate hain. Company jab profit kamati hai to aapko dividend aur capital appreciation milta hai.",
      quiz_data: [
        { question: "Share khareedne par aap kya bante hain?", options: ["Company ke Malik/Part-Owner", "Bank Manager", "Auditor"], correct: 0 }
      ]
    },
    {
      id: "l-2",
      lesson_number: 2,
      title: "NSE, BSE aur SEBI: Market Kaise Kaam Karta Hai?",
      content: "NSE (National Stock Exchange) aur BSE (Bombay Stock Exchange) India ke do main exchanges hain jahan shares trade hote hain. SEBI (Securities & Exchange Board of India) market ka regulator hai jo investors ko protect karta hai.",
      quiz_data: [
        { question: "India me Stock Market ka regulator kaun hai?", options: ["RBI", "SEBI", "IRDAI"], correct: 1 }
      ]
    },
    {
      id: "l-3",
      lesson_number: 3,
      title: "Candlestick Patterns & Technical Analysis",
      content: "Har Green candle buyers ki strength aur Red candle sellers ki pressure show karti hai. Bullish Engulfing, Hammer, aur Doji key reversal patterns hain.",
      quiz_data: [
        { question: "Green candle ka matlab kya hota hai?", options: ["Price Open se upar Close hua (Buyers)", "Price gira", "Market closed"], correct: 0 }
      ]
    },
    {
      id: "l-4",
      lesson_number: 4,
      title: "Risk Management: 1% Rule & Stop Loss",
      content: "Kabhi bhi ek single trade me apni total capital ka 1-2% se jyada risk mat lein. Stop loss lagana har trade me anivarya (mandatory) hai.",
      quiz_data: [
        { question: "Ek trade me maximum kitna risk lena chahiye?", options: ["1% se 2%", "50%", "100%"], correct: 0 }
      ]
    },
    {
      id: "l-5",
      lesson_number: 5,
      title: "Futures & Options (F&O) Reality Check",
      content: "SEBI ke mutabik 90%+ retail F&O traders loss karte hain. Options tabhi trade karein jab aapke paas complete hedging aur data analysis ho.",
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
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [dbChapters, setDbChapters] = useState<any[]>(ALL_CATEGORY_CHAPTERS["0 Se Seekho"]);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const BEGINNER_TAB = "0 Se Seekho";

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

  const handleAnswer = (index: number) => {
    setSelectedAns(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'StockScan Learning', text: `Check out this amazing chapter on ${activeChapterContent.title}!`, url: window.location.href });
    } else {
      alert("Chapter link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-amber-400" /> Academy & Testing
        </h1>
        <p className="text-sm text-slate-400">
          Master concepts of NISM/SEBI Exams, Options Secrets (Greeks & IV Crush), Stocks, Mutual Funds with interactive tools and chapter tests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
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
            onClick={() => { setActiveTab(tab); setSelectedChapter(null); setShowTest(false); setSelectedAns(null); setRatingSubmitted(false); setRating(0); setIsLiked(false); }}
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

      {/* RBI/SEBI Hardcoded Warning */}
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <p className="text-xs text-red-200">
          <strong>SEBI Guideline:</strong> 9 out of 10 individual traders in equity Futures and Options Segment, incurred net losses. On an average, loss makers registered net trading loss close to ₹ 50,000. Trading F&O requires heavy risk management.
        </p>
      </div>

      {/* NISM & SEBI Career Hub Visual */}
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

      {/* Added Visuals for Specific Tabs */}
      {(activeTab === "Options" || activeTab === "Investment Reality") && !selectedChapter && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FnoRiskVisual />
          <LossStatistics />
        </div>
      )}

      {activeTab === "Investment Reality" && !selectedChapter && (
        <div className="mb-8">
          <WealthRealitySimulator />
        </div>
      )}

      {activeTab === "Comparisons" && !selectedChapter && (
        <div className="mb-8 space-y-6">
          <AssetCompareTable />
          <InvestmentCompare 
            assetA={{ name: "Options Trading", returns: "Highly Variable", risk: "Very High", liquidity: "High" }} 
            assetB={{ name: "Equity Investing", returns: "12-15% Avg", risk: "Moderate", liquidity: "High" }} 
          />
        </div>
      )}

      {/* Chapter List OR Content Area */}
      {!selectedChapter ? (
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><List className="w-5 h-5 text-blue-400"/> {activeTab} - Chapters</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500 animate-pulse">Loading modules...</p>
            ) : dbChapters.length === 0 ? (
              <p className="text-sm text-slate-500">No chapters available for this category yet.</p>
            ) : (
              dbChapters.map((ch, idx) => (
                <div 
                  key={ch.id || idx}
                  onClick={() => { setSelectedChapter(ch); setShowTest(false); setSelectedAns(null); setCurrentQ(0); setRatingSubmitted(false); setRating(0); setIsLiked(false); }}
                  className="flex items-center justify-between p-4 bg-[#0B0F19] border border-slate-800 rounded-xl hover:border-blue-500/50 cursor-pointer transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">
                      {ch.lesson_number || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{ch.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ch.content}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Selected Chapter Content */
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6 space-y-6">
          <button 
            onClick={() => setSelectedChapter(null)}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 mb-2"
          >
            ← Back to All Chapters
          </button>

          <h2 className="text-2xl font-black text-white">{activeChapterContent.title}</h2>

          <div className="bg-[#0B0F19] p-6 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {activeChapterContent.content}
          </div>

          {/* Test / Quiz Button */}
          {activeChapterContent.quiz && activeChapterContent.quiz.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              {!showTest ? (
                <button
                  onClick={() => setShowTest(true)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <HelpCircle className="w-4 h-4" /> Start Chapter Test (Practical Quiz)
                </button>
              ) : (
                /* Quiz Area */
                <div className="bg-[#0B0F19] p-6 rounded-xl border border-amber-500/30 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    Question {currentQ + 1} of {activeChapterContent.quiz.length}
                  </h3>
                  <p className="text-base font-bold text-white">
                    {activeChapterContent.quiz[currentQ]?.question}
                  </p>

                  <div className="space-y-2">
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
                          {selectedAns !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {selectedAns !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAns !== null && currentQ < activeChapterContent.quiz.length - 1 && (
                    <button
                      onClick={() => { setCurrentQ(currentQ + 1); setSelectedAns(null); }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg mt-2"
                    >
                      Next Question →
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