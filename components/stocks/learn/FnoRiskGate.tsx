"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Lock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Fixed, hand-written quiz — not AI-generated — because this gate exists to
// make sure the SEBI numbers actually register before anyone reads "how to
// trade options", not to test general knowledge.
const RISK_QUIZ = [
  {
    question: "SEBI ke study ke mutabik, F&O (equity derivatives) me trade karne wale individual traders me se kitne log net loss me rehte hain?",
    options: ["Lagbhag 1 me se 10", "Lagbhag 5 me se 10 (aadhe)", "Lagbhag 9 me se 10", "Koi bhi loss me nahi rehta"],
    correct: 2,
    explanation: "SEBI ke data ke mutabik ~9 out of 10 individual F&O traders net loss me rehte hain, average loss ~₹50,000 ke aas-paas.",
  },
  {
    question: "Cash/stocks me long-term investing aur F&O me sabse bada fark kya hai?",
    options: [
      "F&O me bhi utna hi time hota hai jitna stocks me",
      "F&O contracts expire hote hain — time aapke against kaam karta hai (theta decay), stocks me time aapke favor me kaam kar sakta hai",
      "Dono me koi fark nahi",
      "F&O hamesha stocks se safe hota hai",
    ],
    correct: 1,
    explanation: "Options/futures ek fixed expiry date ke saath aate hain. Agar price sahi direction me na jaye time rehte, poora premium zero ho sakta hai — isiliye 'time' yahan dushman hai, jabki stocks me patience se hi gains milte hain.",
  },
  {
    question: "Agar aapke paas ₹50,000 hain aur aap F&O me trade karna chahte hain, sabse zyada zimmedar approach kya hogi?",
    options: [
      "Poore ₹50,000 ek hi trade me lagana taaki bada profit ho",
      "Pehle bina paise ke seekhna (paper trading), risk management samajhna, aur ye maan kar chalna ki ye paisa poora doob sakta hai",
      "Udhaar leke aur paisa lagana taaki position badi ho",
      "Kisi Telegram tip follow karna",
    ],
    correct: 1,
    explanation: "F&O me sirf utna hi risk karo jitna doobne par bhi aapki zindagi par asar na pade — aur pehle bina real paise ke practice karo.",
  },
];

const PASS_THRESHOLD = RISK_QUIZ.length; // sabhi sahi hone chahiye — ye ek awareness gate hai, general trivia nahi

export default function FnoRiskGate({ children }: { children: React.ReactNode }) {
  const supabase: any = createClient();
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        const { data } = await supabase
          .from("fno_risk_gate_completions")
          .select("passed")
          .eq("user_id", uid)
          .maybeSingle();
        if ((data as any)?.passed) setUnlocked(true);
      }
      setLoading(false);
    };
    check();
  }, [supabase]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === RISK_QUIZ[current].correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = async () => {
    if (current + 1 < RISK_QUIZ.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      return;
    }

    const finalCorrect = correctCount + (selected === RISK_QUIZ[current].correct ? 0 : 0); // already counted in handleAnswer
    const passed = finalCorrect >= PASS_THRESHOLD;
    setResult(passed ? "pass" : "fail");

    if (userId) {
      await supabase.from("fno_risk_gate_completions").upsert({
        user_id: userId,
        score: finalCorrect,
        total_questions: RISK_QUIZ.length,
        passed,
      } as any);
    }
    if (passed) setUnlocked(true);
  };

  const retry = () => {
    setCurrent(0);
    setSelected(null);
    setCorrectCount(0);
    setResult(null);
  };

  if (loading) return <div className="text-slate-400 p-6 text-center animate-pulse">Loading...</div>;
  if (unlocked) return <>{children}</>;

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-[#111827] border border-red-500/30 rounded-2xl p-8 text-center">
          <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Aage badhne se pehle — 3 sawaal</h2>
          <p className="text-slate-400 mb-6">
            F&O ka "how to trade" section kholne se pehle, humein pakka karna hai ki aapne SEBI ke
            real risk data ko samajh liya hai. Ye koi rok-tok nahi hai, sirf ek awareness check hai —
            saare 3 sawaal sahi karne par section unlock ho jayega, aap jitni baar chahein try kar sakte hain.
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            Quiz Shuru Karo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (result === "fail") {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-[#111827] border border-amber-500/30 rounded-2xl p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Koi baat nahi — pehle risk pages padho</h2>
          <p className="text-slate-400 mb-6">
            Aapka score {correctCount}/{RISK_QUIZ.length} raha. F&O shuru karne se pehle
            SEBI ke risk data ko achi tarah samajhna zaroori hai.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="/learn/fno/risks" className="text-sm text-blue-400 hover:underline">Risks page padho</a>
            <button onClick={retry} className="bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl">
              Dobara Try Karo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = RISK_QUIZ[current];
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Risk Awareness Check
          </h3>
          <span className="text-sm text-slate-500 font-bold">{current + 1} / {RISK_QUIZ.length}</span>
        </div>
        <p className="text-slate-200 mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSel = selected === idx;
            const isCorrect = idx === q.correct;
            const showCorrect = selected !== null && isCorrect;
            const showWrong = selected !== null && isSel && !isCorrect;
            return (
              <button
                key={idx}
                disabled={selected !== null}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  showCorrect ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" :
                  showWrong ? "bg-red-500/10 border-red-500/50 text-red-400" :
                  "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300"
                }`}
              >
                <span>{opt}</span>
                {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                {showWrong && <XCircle className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="mt-6 p-4 rounded-xl bg-slate-800 text-sm text-slate-300">{q.explanation}</div>
        )}
        {selected !== null && (
          <div className="mt-6 flex justify-end">
            <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl">
              {current + 1 < RISK_QUIZ.length ? "Agla Sawaal" : "Result Dekho"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
