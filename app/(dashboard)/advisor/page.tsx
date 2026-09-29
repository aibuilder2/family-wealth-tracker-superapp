'use client';

import React, { useState, useEffect } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  Sparkles, RefreshCw, TrendingUp, Home, Landmark,
  Send, Bot, CheckCircle2, ChevronRight, Lightbulb, PieChart,
  Search, ShieldAlert, ArrowUpRight, BarChart2, Zap
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';

interface StockScanItem {
  ticker: string;
  name: string;
  category: string;
  signal: string;
  valuation: string;
  confidence: string;
  targetAllocation: string;
  rationale: string;
  riskLevel: string;
}

interface InsightItem {
  title: string;
  desc: string;
  tag: string;
  domain?: 'stocks' | 'family' | 'general';
  color?: string;
}

const AI_NAMES = [
  { id: 'chanakya', name: 'चाणक्य AI (Chanakya Wealth)', tag: 'सर्वश्रेष्ठ रणनीतिकार (Top Recommended)' },
  { id: 'kuber', name: 'कुबेर AI (Kuber Wealth)', tag: 'कोष व संचित पूंजी रक्षक' },
  { id: 'dhansetu', name: 'धनसेतु AI (DhanSetu)', tag: 'कैशफ्लो से स्टॉक मार्केट का सेतु' },
  { id: 'lakshmi', name: 'लक्ष्मी AI (Lakshmi Wealth)', tag: 'समृद्धि व शुभ वित्तीय सुरक्षा' },
  { id: 'artha', name: 'अर्थ AI (Artha Shastra)', tag: 'अनुशासित लक्ष्य-आधारित निवेश' },
];

const SUGGESTED_QUESTIONS = [
  "क्या मुझे दुकान का लोन पहले चुकाना चाहिए या स्टॉक्स में SIP बढ़ानी चाहिए?",
  "मेरे परिवार के लिए कितने महीने का लिक्विड इमरजेंसी फंड सुरक्षित है?",
  "दुकान और हॉस्टल से आने वाले रेंटल कैशफ्लो को कैसे री-इन्वेस्ट करें?",
  "Nifty 50 और मिडकैप फंड्स में परिवार का कितना प्रतिशत निवेश होना चाहिए?",
];

const POPULAR_STOCKS_TO_SCAN = [
  "NIFTY 50", "TATA MOTORS", "RELIANCE", "ITC", "HDFC BANK", "TCS", "INFY"
];

export default function AdvisorPage() {
  const {
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    totalWealth,
    liquidWealth,
    fixedWealth,
    assets,
    rentalProperties,
    goals,
    transactions,
  } = useFamilyStore();

  const [selectedAi, setSelectedAi] = useState(AI_NAMES[0]);
  const [activeTab, setActiveTab] = useState<'all' | 'stocks' | 'family'>('stocks');
  const [questionInput, setQuestionInput] = useState('');
  const [stockSearchInput, setStockSearchInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string>('OpenAI (gpt-4o-mini ready)');
  const [healthScore, setHealthScore] = useState<number>(85);
  const [marketTrend, setMarketTrend] = useState<string>('Healthy Bullish Accumulation Zone');

  const [stockScans, setStockScans] = useState<StockScanItem[]>([
    {
      ticker: "NIFTY 50 ETF (NIPPON / SBI)",
      name: "निफ्टी 50 इंडेक्स ईटीएफ",
      category: "Largecap Core Index",
      signal: "STRONG BUY (SIP)",
      valuation: "Fair Value (P/E ~22.5)",
      confidence: "95%",
      targetAllocation: "35% of monthly surplus",
      rationale: "परिवार के लिए सबसे सुरक्षित वेल्थ कंपाउंडिंग इंजन। मासिक बचत का 35% इसमें लगाना 12-14% लंबी अवधि की रिटर्न क्षमता देता है।",
      riskLevel: "Low-Moderate"
    },
    {
      ticker: "ITC / DIVIDEND LEADER",
      name: "आईटीसी / भारत इलेक्ट्रॉनिक्स (BEL)",
      category: "High Dividend Yield & FMCG",
      signal: "ACCUMULATE FOR CASHFLOW",
      valuation: "Undervalued / Attractive",
      confidence: "89%",
      targetAllocation: "20% of monthly surplus",
      rationale: "दुकान और मकान के किराए की तरह 3-4% का नियमित डिविडेंड पेआउट देता है, जो परिवार के कैशफ्लो को मज़बूती देता है।",
      riskLevel: "Low"
    },
    {
      ticker: "RELIANCE / HDFC BANK",
      name: "रिलायंस इंडस्ट्रीज / एचडीएफसी बैंक",
      category: "Mega Bluechip Pillar",
      signal: "ACCUMULATE ON DIPS",
      valuation: "Near Strong Support Zone",
      confidence: "91%",
      targetAllocation: "25% of monthly surplus",
      rationale: "भारत की अर्थव्यवस्था की रीढ़। जब भी बाजार में 2-3% की गिरावट आए, अतिरिक्त बचत से इसमें चरणबद्ध निवेश बढ़ाएं।",
      riskLevel: "Moderate"
    },
    {
      ticker: "NIFTY MIDCAP 150",
      name: "निफ्टी मिडकैप 150 इंडेक्स फंड",
      category: "High Alpha Compounding",
      signal: "SYSTEMATIC SIP ONLY",
      valuation: "Growth Premium",
      confidence: "84%",
      targetAllocation: "20% of monthly surplus",
      rationale: "लॉन्ग-टर्म पारिवारिक लक्ष्यों (बच्चों की उच्च शिक्षा, नया वाहन) को तेजी से पूरा करने हेतु 14-16% संभावित सीएजीआर।",
      riskLevel: "Moderate-High"
    }
  ]);

  const [insights, setInsights] = useState<InsightItem[]>([
    {
      title: "शेयर बाज़ार: Nifty 50 व लार्जकैप इंडेक्स SIP",
      desc: "परिवार के पास मासिक बचत उपलब्ध है। ₹10,000 - ₹15,000/माह अनुशासित SIP में लगाने से लंबी अवधि में 12-14% CAGR कंपाउंडिंग प्राप्त हो सकती है।",
      tag: "Stock Strategy",
      domain: "stocks",
      color: "gold",
    },
    {
      title: "इमरजेंसी लिक्विडिटी रनवे (6+ महीने)",
      desc: "वर्तमान लिक्विड वेल्थ आपातकालीन परिस्थितियों के लिए सुरक्षित है। इसे हाई-यील्ड बैंक एफडी या लिक्विड फंड में ऑटो-स्वीप रखें।",
      tag: "Risk Buffer",
      domain: "family",
      color: "green",
    },
    {
      title: "पैसिव रेंटल कैशफ्लो से EMI कवरेज",
      desc: "दुकान और हॉस्टल से आने वाली मासिक रेंटल आय सीधे बैंक लोन EMI को पूरी तरह ऑफसेट कर रही है, जिससे मुख्य व्यापारिक कैशफ्लो सुरक्षित रहता है।",
      tag: "Family Cashflow",
      domain: "family",
      color: "navy",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  // Financial Health Metrics
  const monthlySurplus = totalIncomeThisMonth - totalExpenseThisMonth;
  const emergencyMonths = totalExpenseThisMonth > 0 ? (liquidWealth / totalExpenseThisMonth).toFixed(1) : '12+';
  const liquidPercent = totalWealth > 0 ? Math.round((liquidWealth / totalWealth) * 100) : 40;
  const totalRentalCashflow = rentalProperties.reduce(
    (sum, p) => sum + (Number(p.monthly_target_revenue || p.monthly_target_rent || 0)),
    0
  );

  const handleFetchAi = async (customQuestion?: string, stockToScanName?: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalIncome: totalIncomeThisMonth,
          totalExpense: totalExpenseThisMonth,
          totalWealth,
          liquidWealth,
          fixedWealth,
          assets,
          rentalProperties,
          goals,
          recentTransactions: transactions.slice(0, 8),
          question: customQuestion || questionInput,
          domain: activeTab,
          aiName: selectedAi.name,
          stockToScan: stockToScanName || stockSearchInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.insights) && data.insights.length > 0) {
          setInsights(data.insights);
        }
        if (Array.isArray(data.stockScans) && data.stockScans.length > 0) {
          setStockScans(data.stockScans);
        }
        if (data.marketTrend) {
          setMarketTrend(data.marketTrend);
        }
        if (data.advisorReply) {
          setAiAnswer(data.advisorReply);
        }
        if (data.provider) {
          setActiveProvider(data.provider);
        }
        if (data.healthScore) {
          setHealthScore(data.healthScore);
        }
        setLastRefreshed(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching AI advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    handleFetchAi(questionInput);
  };

  const handleStockScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSearchInput.trim()) return;
    handleFetchAi(undefined, stockSearchInput);
  };

  const getSignalBadge = (signal: string) => {
    if (signal.includes('BUY')) {
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    }
    if (signal.includes('ACCUMULATE')) {
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'green':
        return { tag: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', border: 'border-emerald-200 dark:border-emerald-900/60' };
      case 'coral':
        return { tag: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', border: 'border-amber-200 dark:border-amber-900/60' };
      case 'navy':
        return { tag: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800', border: 'border-blue-200 dark:border-blue-900/60' };
      case 'gold':
      default:
        return { tag: 'text-amber-800 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700', border: 'border-amber-300 dark:border-amber-800/60' };
    }
  };

  const filteredInsights = insights.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'stocks') return item.domain === 'stocks' || item.tag?.toLowerCase().includes('stock') || item.tag?.toLowerCase().includes('asset');
    if (activeTab === 'family') return item.domain === 'family' || item.tag?.toLowerCase().includes('family') || item.tag?.toLowerCase().includes('cashflow') || item.tag?.toLowerCase().includes('risk');
    return true;
  });

  return (
    <div className="space-y-4 pt-2 pb-16 max-w-4xl mx-auto">
      <ScreenHeader
        title={selectedAi.name}
        subtitle="स्टॉक मार्केट निवेश व पारिवारिक धन प्रबंधन का दोहरा सुपर-इंटेलिजेंस"
      />

      {/* Top Banner & AI Engine Selector */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 dark:from-amber-950/40 dark:via-neutral-900 dark:to-emerald-950/40 p-4 rounded-2xl border border-amber-500/20 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Bot size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">{selectedAi.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={10} /> GPT-4o-Mini Active
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  द्वैत विशेषज्ञता: 📈 <strong className="text-ink">स्टॉक मार्केट (SIP, इक्विटी, हेजिंग)</strong> + 🏠 <strong className="text-ink">फैमिली वेल्थ (किराया, EMI, गोल्ड)</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFetchAi()}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-navy font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'AI गणना जारी है...' : 'ताज़ा विश्लेषण लें'}</span>
              </button>
            </div>
          </div>

          {/* AI Name Dropdown Switcher */}
          <div className="pt-2 border-t border-paper-dim flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">AI सलाहकार का नाम:</span>
            {AI_NAMES.map((ai) => (
              <button
                key={ai.id}
                onClick={() => setSelectedAi(ai)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                  selectedAi.id === ai.id
                    ? 'bg-amber-500 text-navy font-bold shadow-sm'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                }`}
              >
                {ai.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Domain Filter Tabs */}
      <div className="px-4">
        <div className="flex p-1 bg-paper-subtle rounded-xl border border-paper-dim">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'stocks'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <TrendingUp size={14} className="text-emerald-500" />
            <span>📈 शेयर बाज़ार व AI स्कैनर</span>
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'family'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Home size={14} className="text-blue-500" />
            <span>🏠 पारिवारिक नकदी व रेंटल</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>🌟 समग्र (All-in-One)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AI STOCK SCANNER RADAR (WHEN STOCKS OR ALL IS ACTIVE) */}
      {(activeTab === 'stocks' || activeTab === 'all') && (
        <div className="px-4 space-y-3">
          {/* Scanner Header Box */}
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Zap size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-ink">AI लाइव स्टॉक स्कैनर (Live Stock Radar)</h3>
                  <p className="text-[10px] text-ink-muted">बाज़ार स्थिति: <strong className="text-emerald-600">{marketTrend}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-bold border border-emerald-500/20 animate-pulse">
                  ● ऑटो-स्कैनर लाइव
                </span>
                <button
                  onClick={() => handleFetchAi()}
                  disabled={loading}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-paper-subtle hover:bg-paper text-ink border border-paper-dim flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                  <span>पुनः स्कैन करें</span>
                </button>
              </div>
            </div>

            {/* Custom Stock Search Bar */}
            <form onSubmit={handleStockScanSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-2.5 text-ink-muted" />
                <input
                  type="text"
                  value={stockSearchInput}
                  onChange={(e) => setStockSearchInput(e.target.value)}
                  placeholder="कोई भी शेयर तुरंत स्कैन करें (उदा. TATA MOTORS, RELIANCE, ITC)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-ink placeholder:text-ink-muted"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !stockSearchInput.trim()}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>स्कैन करें</span>
              </button>
            </form>

            {/* Quick Stock Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-ink-muted font-medium">लोकप्रिय स्टॉक्स:</span>
              {POPULAR_STOCKS_TO_SCAN.map((stk, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStockSearchInput(stk);
                    handleFetchAi(undefined, stk);
                  }}
                  className="text-[10px] font-medium text-ink-muted hover:text-ink bg-paper-subtle hover:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-paper-dim transition-all"
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* Scanned Stock Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stockScans.map((stock, i) => (
              <div
                key={i}
                className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-2.5 hover:border-emerald-500/40 hover:shadow-md transition-all animate-fade-in"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                      {stock.category}
                    </span>
                    <h4 className="text-sm font-bold text-ink flex items-center gap-1">
                      {stock.ticker}
                    </h4>
                    <span className="text-[11px] text-ink-muted">{stock.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSignalBadge(stock.signal)}`}>
                    {stock.signal}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-paper-subtle rounded-xl text-[10px]">
                  <div>
                    <span className="text-ink-muted block">वैल्यूएशन</span>
                    <span className="font-semibold text-ink">{stock.valuation}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block">विश्वसनीयता</span>
                    <span className="font-semibold text-emerald-600">{stock.confidence}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block">बजट आवंटन</span>
                    <span className="font-semibold text-ink">{stock.targetAllocation}</span>
                  </div>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed">
                  <strong className="text-ink font-semibold">AI विश्लेषण:</strong> {stock.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: INTERACTIVE AI QUERY BOX (CHAT WITH AI) */}
      <div className="px-4">
        <div className="bg-paper p-4 rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-ink">
              {selectedAi.name.split(' ')[0]} से सलाह लें (Ask Stock, SIP or Family Wealth Question)
            </span>
          </div>

          <form onSubmit={handleAsk} className="flex gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="उदा. क्या मुझे अभी Nifty 50 में SIP बढ़ानी चाहिए या दुकान का लोन चुकाना चाहिए?"
              className="flex-1 px-3.5 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-ink placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={loading || !questionInput.trim()}
              className="px-4 py-2 bg-navy text-white hover:bg-neutral-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send size={12} />
              <span>पूछें</span>
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-ink-muted font-medium">सुझाव:</span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestionInput(q);
                  handleFetchAi(q);
                }}
                className="text-[10px] text-ink-muted hover:text-ink bg-paper-subtle hover:bg-amber-500/10 px-2 py-1 rounded-md border border-paper-dim transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* AI Response Bubble */}
          {aiAnswer && (
            <div className="p-3.5 bg-amber-500/10 dark:bg-amber-950/30 rounded-xl border border-amber-500/20 space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <Bot size={12} /> {selectedAi.name} का उत्तर
                </span>
                <span className="text-[9px] text-ink-muted">लाइव विश्लेषण</span>
              </div>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-line font-medium">
                {aiAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: HEALTH SCORE & KEY FINANCIAL METRICS */}
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs">
            <div className="flex items-center gap-1.5 text-ink-muted mb-1">
              <Sparkles size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">वेल्थ हेल्थ स्कोर</span>
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {healthScore} <span className="text-[11px] text-ink-muted font-normal">/ 100</span>
            </div>
            <span className="text-[10px] text-ink-muted block mt-0.5">उत्कृष्ट वित्तीय अनुशासन</span>
          </div>

          <div className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs">
            <div className="flex items-center gap-1.5 text-ink-muted mb-1">
              <Landmark size={12} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">इमरजेंसी रनवे</span>
            </div>
            <div className="text-lg font-bold text-ink">
              {emergencyMonths} <span className="text-[11px] text-ink-muted font-normal">महीने</span>
            </div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">आपातकाल हेतु सुरक्षित</span>
          </div>

          <div className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs">
            <div className="flex items-center gap-1.5 text-ink-muted mb-1">
              <TrendingUp size={12} className="text-amber-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">तरल (Liquid) अनुपात</span>
            </div>
            <div className="text-lg font-bold text-ink">
              {liquidPercent}% <span className="text-[11px] text-ink-muted font-normal">शेयर/कैश</span>
            </div>
            <span className="text-[10px] text-ink-muted block mt-0.5">{100 - liquidPercent}% अचल/प्रॉपर्टी</span>
          </div>

          <div className="p-3 bg-paper rounded-xl border border-paper-dim shadow-xs">
            <div className="flex items-center gap-1.5 text-ink-muted mb-1">
              <Home size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">मासिक रेंटल आमदनी</span>
            </div>
            <Mono className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ₹{totalRentalCashflow.toLocaleString('en-IN')}
            </Mono>
            <span className="text-[10px] text-ink-muted block mt-0.5">नियमित पैसिव कैशफ्लो</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: STRATEGIC INSIGHTS LIST */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-bold text-ink uppercase tracking-wider px-1">रणनीतिक सिफारिशें (Strategic Actions)</h3>
        {filteredInsights.map((item, i) => {
          const colors = getColorClasses(item.color);
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl bg-paper border ${colors.border} shadow-xs space-y-2 animate-fade-in hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.tag}`}>
                  {item.tag}
                </span>
                <span className="text-[10px] text-ink-muted flex items-center gap-1">
                  {item.domain === 'stocks' ? '📈 स्टॉक मार्केट' : item.domain === 'family' ? '🏠 फैमिली वेल्थ' : '🌟 रणनीतिक'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {lastRefreshed && (
        <div className="px-4 text-right">
          <span className="text-[10px] text-ink-muted">
            अंतिम अपडेट: {lastRefreshed} • पावर्ड बाय: <strong className="text-ink">{activeProvider}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
