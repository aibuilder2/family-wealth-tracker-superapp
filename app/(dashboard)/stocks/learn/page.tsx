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

const DEFAULT_ZERO_TO_HERO = [
  {
    id: "l-1",
    lesson_number: 1,
    title: "Share Market Basic: Share Kya Hota Hai?",
    segment: "zero-to-hero",
    content: "Jab aap kisi company ka ek share khareedte hain, to aap us company ke chote hissedar (part-owner) ban jaate hain. Company jab profit kamati hai to aapko dividend aur capital appreciation milta hai.",
    quiz_data: [
      { question: "Share khareedne par aap kya bante hain?", options: ["Company ke Malik/Part-Owner", "Bank Manager", "Auditor"], correct: 0 }
    ]
  },
  {
    id: "l-2",
    lesson_number: 2,
    title: "NSE, BSE aur SEBI: Market Kaise Kaam Karta Hai?",
    segment: "zero-to-hero",
    content: "NSE (National Stock Exchange) aur BSE (Bombay Stock Exchange) India ke do main exchanges hain jahan shares trade hote hain. SEBI (Securities & Exchange Board of India) market ka regulator hai jo investors ko protect karta hai.",
    quiz_data: [
      { question: "India me Stock Market ka regulator kaun hai?", options: ["RBI", "SEBI", "IRDAI"], correct: 1 }
    ]
  },
  {
    id: "l-3",
    lesson_number: 3,
    title: "Candlestick Patterns & Technical Analysis",
    segment: "zero-to-hero",
    content: "Har Green candle buyers ki strength aur Red candle sellers ki pressure show karti hai. Bullish Engulfing, Hammer, aur Doji key reversal patterns hain.",
    quiz_data: [
      { question: "Green candle ka matlab kya hota hai?", options: ["Price Open se upar Close hua (Buyers)", "Price gira", "Market closed"], correct: 0 }
    ]
  },
  {
    id: "l-4",
    lesson_number: 4,
    title: "Risk Management: 1% Rule & Stop Loss",
    segment: "zero-to-hero",
    content: "Kabhi bhi ek single trade me apni total capital ka 1-2% se jyada risk mat lein. Stop loss lagana har trade me anivarya (mandatory) hai.",
    quiz_data: [
      { question: "Ek trade me maximum kitna risk lena chahiye?", options: ["1% se 2%", "50%", "100%"], correct: 0 }
    ]
  },
  {
    id: "l-5",
    lesson_number: 5,
    title: "Futures & Options (F&O) Reality Check",
    segment: "zero-to-hero",
    content: "SEBI ke mutabik 90%+ retail F&O traders loss karte hain. Options tabhi trade karein jab aapke paas complete hedging aur data analysis ho.",
    quiz_data: [
      { question: "SEBI report ke mutabik kitne % retail F&O traders loss karte hain?", options: ["90% se jyada", "10%", "5%"], correct: 0 }
    ]
  }
];

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
  const [dbChapters, setDbChapters] = useState<any[]>(DEFAULT_ZERO_TO_HERO);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const BEGINNER_TAB = "0 Se Seekho";
  const isBeginnerTab = activeTab === BEGINNER_TAB;

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);

      try {
        const supabase = createClient();
        if (supabase) {
          if (isBeginnerTab) {
            const { data, error } = await supabase
              .from("learn_chapters")
              .select("*")
              .eq("segment", "zero-to-hero")
              .order("lesson_number", { ascending: true });
            
            if (!error && data && data.length > 0) {
              setDbChapters(data);
              setLoading(false);
              return;
            }
          } else {
            const { data, error } = await supabase
              .from("learn_chapters")
              .select("*")
              .eq("category", activeTab)
              .order("created_at", { ascending: true });
            
            if (!error && data && data.length > 0) {
              setDbChapters(data);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Fallback silently
      }

      setDbChapters(isBeginnerTab ? DEFAULT_ZERO_TO_HERO : []);
      setLoading(false);
    };

    fetchChapters();
  }, [activeTab, isBeginnerTab]);

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
        <p className="text-sm text-slate-400">Master concepts of Options, Futures, Stocks, Mutual Funds & more with AI-generated chapters and real-life tests.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
        {[BEGINNER_TAB, "Investment Reality", "Technical Analysis", "Comparisons", "Options", "Stocks", "SIP & SWP", "All Investments"].map((tab) => (
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