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
  const [dbChapters, setDbChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const BEGINNER_TAB = "0 Se Seekho";
  const isBeginnerTab = activeTab === BEGINNER_TAB;

  const supabase: any = createClient();

  useEffect(() => {
    (supabase as any)?.auth?.getUser().then((res: any) => setUserId(res?.data?.user?.id ?? null));
  }, [supabase]);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);

      if (isBeginnerTab) {
        const { data, error } = await supabase
          .from("learn_chapters")
          .select("*")
          .eq("segment", "zero-to-hero")
          .order("lesson_number", { ascending: true });
        setDbChapters(!error && data ? data : []);

        if (userId) {
          const { data: completions } = await supabase
            .from("lesson_completions")
            .select("lesson_number")
            .eq("user_id", userId)
            .eq("segment", "zero-to-hero");
          setCompletedLessons((completions || []).map((c: any) => c.lesson_number));
        }
      } else {
        const { data, error } = await supabase
          .from("learn_chapters")
          .select("*")
          .eq("category", activeTab)
          .order("created_at", { ascending: true });
        setDbChapters(!error && data ? data : []);
      }

      setLoading(false);
    };
    fetchChapters();
  }, [activeTab, supabase, userId, isBeginnerTab]);

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
              <div className="text-slate-400 p-4 text-center animate-pulse border border-slate-800 rounded-xl">Loading AI generated chapters...</div>
            ) : dbChapters.length === 0 ? (
              <div className="text-slate-400 p-4 text-center border border-dashed border-slate-700 rounded-xl">
                {isBeginnerTab
                  ? "Beginner path abhi generate nahi hua — Admin Panel se /seed-beginner-path call karo (ek hi baar karna hai)."
                  : `No chapters generated for ${activeTab} yet. Use Admin Panel to generate.`}
              </div>
            ) : isBeginnerTab ? (
              dbChapters.map((ch: any, idx: number) => {
                const isCompleted = completedLessons.includes(ch.lesson_number);
                const isNextUnlocked = idx === 0 || completedLessons.includes(dbChapters[idx - 1]?.lesson_number);
                const isLocked = !isCompleted && !isNextUnlocked;
                return (
                  <LessonCard
                    key={ch.id}
                    title={`${ch.lesson_number}. ${ch.title || ch.topic_name}`}
                    description={isLocked ? "Pehle pichla lesson complete karo" : (ch.summary || `Learn about ${ch.category}`)}
                    duration="15 mins"
                    isCompleted={isCompleted}
                    onClick={isLocked ? undefined : () => setSelectedChapter(ch)}
                  />
                );
              })
            ) : (
              dbChapters.map((ch: any) => (
                <LessonCard
                  key={ch.id}
                  title={ch.title || ch.topic_name || "Untitled Lesson"}
                  description={`Learn about ${ch.category || activeTab}`}
                  duration="15 mins"
                  isCompleted={false}
                  onClick={() => setSelectedChapter(ch)}
                />
              ))
            )}
          </div>
        </div>
      ) : !showTest ? (
        <div className="bg-[#111827] rounded-xl border border-slate-800 p-6 md:p-8">
          <button onClick={() => setSelectedChapter(null)} className="text-sm text-blue-400 mb-6 hover:underline flex items-center">
            &larr; Back to Chapters
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">{activeChapterContent.title}</h2>
          <div 
            className="prose prose-invert prose-amber max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: activeChapterContent.content }}
          />
          
          <div className="border-t border-slate-800 pt-6 flex justify-end">
            <button 
              onClick={() => setShowTest(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Take Chapter Test <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Area */
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#111827] rounded-xl border border-slate-800 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <HelpCircle className="w-5 h-5 text-blue-400" /> Knowledge Test
              </h2>
              <span className="text-sm font-bold text-slate-500">Question {currentQ + 1} of {activeChapterContent.quiz.length}</span>
            </div>

            <h3 className="text-lg text-slate-200 mb-6">{activeChapterContent.quiz[currentQ].question}</h3>

            <div className="space-y-3">
              {activeChapterContent.quiz[currentQ].options.map((opt: string, idx: number) => {
                const isSelected = selectedAns === idx;
                const isCorrect = idx === activeChapterContent.quiz[currentQ].correct_index;
                const showCorrect = selectedAns !== null && isCorrect;
                const showWrong = selectedAns !== null && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={selectedAns !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      showCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" :
                      showWrong ? "bg-red-500/10 border-red-500/50 text-red-400" :
                      "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <span>{opt}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>

            {selectedAns !== null && (
              <div className={`mt-6 p-4 rounded-xl text-sm font-medium ${selectedAns === activeChapterContent.quiz[currentQ].correct_index ? "bg-emerald-500/10 text-emerald-200" : "bg-slate-800 text-slate-300"}`}>
                <strong className="text-white block mb-1">AI Explanation:</strong>
                {activeChapterContent.quiz[currentQ].explanation}
              </div>
            )}

            {/* AI Feedback & Rating System */}
            {selectedAns !== null && !ratingSubmitted && (
              <div className="mt-8 p-6 bg-slate-800/40 rounded-xl border border-slate-700 text-center animate-in fade-in duration-300">
                <h4 className="text-white font-bold mb-2">AI Feedback: Aapko ye learning kaisa laga?</h4>
                <p className="text-xs text-slate-400 mb-4">Aapki rating mujhe (AI) aur platform ko aur behtar / aasaan sikhane me madad karegi.</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                    onClick={async () => { 
                      setRating(star); 
                      setRatingSubmitted(true); 
                      await (supabase as any)?.from("quiz_ratings").insert({
                        chapter_id: selectedChapter?.id,
                        rating: star,
                        liked: isLiked,
                        topic_name: selectedChapter?.title || selectedChapter?.topic_name
                      } as any);
                    }}
                    >
                      <Star className={`w-8 h-8 transition-all duration-200 ${star <= (hoveredStar || rating) ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-500'}`} />
                    </button>
                  ))}
                </div>
                
                {/* Like & Share Actions */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-700/50">
                  <button 
                    onClick={() => setIsLiked(!isLiked)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isLiked ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-400' : ''}`} /> {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 rounded-full text-sm font-medium transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            )}
            
            {ratingSubmitted && (
              <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-in fade-in duration-300">
                <p className="text-emerald-400 font-bold text-sm">⭐ Thank you! AI is rating ko use karke agli baar aur behtar questions/chapters banayega.</p>
              </div>
            )}

            {selectedAns !== null && ratingSubmitted && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={async () => {
                    if (isBeginnerTab && userId && selectedChapter?.lesson_number) {
                      await (supabase as any)?.from("lesson_completions").upsert({
                        user_id: userId,
                        segment: "zero-to-hero",
                        lesson_number: selectedChapter.lesson_number,
                      } as any);
                      await (supabase as any)?.from("quiz_results").insert({
                        user_id: userId,
                        segment: "zero-to-hero",
                        lesson_number: selectedChapter.lesson_number,
                        score: selectedAns === activeChapterContent.quiz[currentQ].correct_index ? 1 : 0,
                        total_questions: activeChapterContent.quiz.length,
                      } as any);
                      setCompletedLessons((prev) => Array.from(new Set([...prev, selectedChapter.lesson_number])));
                    }
                    setShowTest(false);
                    setSelectedAns(null);
                  }}
                  className="bg-amber-500 text-slate-900 font-bold px-6 py-2 rounded-lg"
                >
                  Finish & Back to Chapter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}