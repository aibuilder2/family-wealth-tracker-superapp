'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  Sparkles, RefreshCw, TrendingUp, Home, Landmark,
  Send, Bot, CheckCircle2, ChevronRight, Lightbulb, PieChart,
  Search, ShieldAlert, ArrowUpRight, ArrowDownRight, BarChart2, Zap,
  Target, AlertTriangle, CheckCircle, Clock, Plus, X, Award, LineChart
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { StockPrediction, IndexScanResult } from '@/types';
import { 
  MAJOR_INDEX_DEFINITIONS, 
  CONSTITUENT_STOCKS_DATABASE, 
  ConstituentStockScan, 
  generateCustomStockScan 
} from '@/lib/services/stockScannerService';
import { TradingViewWidget } from '@/components/stocks/TradingViewWidget';
import { TechnicalBenchmarksCard } from '@/components/stocks/TechnicalBenchmarksCard';

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

const AI_CONFIG = {
  id: 'shree-wealth',
  name: 'श्री वेल्थ AI (Shree Wealth Intelligence)',
  tag: 'पारिवारिक वेल्थ वॉल्ट व स्टॉक मार्केट सुपर-इंटेलिजेंस',
};

const SUGGESTED_QUESTIONS = [
  "क्या मुझे दुकान का लोन पहले चुकाना चाहिए या स्टॉक्स में SIP बढ़ानी चाहिए?",
  "मेरे परिवार के लिए कितने महीने का लिक्विड इमरजेंसी फंड सुरक्षित है?",
  "दुकान और हॉस्टल से आने वाले रेंटल कैशफ्लो को कैसे री-इन्वेस्ट करें?",
  "Nifty 50 और मिडकैप फंड्स में परिवार का कितना प्रतिशत निवेश होना चाहिए?",
];

const POPULAR_STOCKS_TO_SCAN = [
  "NIFTY 50", "TATA MOTORS", "RELIANCE", "ITC", "HDFC BANK", "TCS", "INFY"
];

const INITIAL_PREDICTIONS: StockPrediction[] = [
  {
    id: "pred-rel-1",
    ticker: "RELIANCE",
    name: "Reliance Industries",
    prediction_date: "2026-09-17",
    entry_price: 2880,
    target_price: 3020,
    stoploss_price: 2810,
    current_price: 3035,
    timeframe: "Short Term (7-15 Days)",
    status: "TARGET_HIT",
    technicals: {
      rsi: 42.5,
      macd_signal: "Bullish Crossover",
      pe_ratio: 24.2,
      dma_200_status: "Above 200 DMA",
      yearly_high_low: "₹3,024 / ₹2,220"
    },
    ai_reason: "200 DMA पर हैमर कैंडलस्टिक व RSI 42 से बाउंस बैक। 1:2.3 रिस्क-रिवॉर्ड सेटअप।",
    post_mortem: "टारगेट 6 दिनों में सफल रहा। 200 DMA सपोर्ट पर बाउंस और रिफाइनरी मार्जिन में सुधार से स्टॉक ने ₹3,020 का स्तर तोड़ा।",
    pnl_percent: 4.86,
    resolved_date: "2026-09-23"
  },
  {
    id: "pred-tat-2",
    ticker: "TATAMOTORS",
    name: "Tata Motors Ltd",
    prediction_date: "2026-09-11",
    entry_price: 995,
    target_price: 1070,
    stoploss_price: 960,
    current_price: 955,
    timeframe: "Short Term (7-15 Days)",
    status: "STOPLOSS_HIT",
    technicals: {
      rsi: 58.0,
      macd_signal: "Bearish Divergence",
      pe_ratio: 11.5,
      dma_200_status: "Near 200 DMA Support",
      yearly_high_low: "₹1,179 / ₹600"
    },
    ai_reason: "कम P/E व कमर्शियल व्हीकल ग्रोथ के आधार पर स्विंग ट्रेड।",
    post_mortem: "स्टॉपलॉस ₹960 पर कटा। JLR के यूके मार्जिन में दबाव और ऑटो सेक्टर में भारी प्रॉफिट बुकिंग से सपोर्ट टूटा। समय पर स्टॉपलॉस ने बड़ी पूंजी सुरक्षित रखी।",
    pnl_percent: -3.52,
    resolved_date: "2026-09-19"
  },
  {
    id: "pred-nif-3",
    ticker: "NIFTYBEES",
    name: "Nippon Nifty 50 ETF",
    prediction_date: "2026-09-24",
    entry_price: 262,
    target_price: 274,
    stoploss_price: 256,
    current_price: 270,
    timeframe: "Medium Term (1-3 Months)",
    status: "ACTIVE",
    technicals: {
      rsi: 51.2,
      macd_signal: "Bullish Crossover",
      pe_ratio: 22.1,
      dma_200_status: "Above 200 DMA",
      yearly_high_low: "₹272 / ₹215"
    },
    ai_reason: "निफ्टी का 20 DMA री-टेस्ट व बैंकिंग सेक्टर की रिकवरी। परिवार के लिक्विड फंड्स हेतु सुरक्षित ट्रेड।",
    post_mortem: "सक्रिय ट्रेड: वर्तमान भाव ₹270 (+3.05%)। टारगेट ₹274 की ओर अग्रसर। स्टॉपलॉस को ट्रेल करके कॉस्ट (₹262) पर ले आएं।",
    pnl_percent: 3.05
  },
  {
    id: "pred-itc-4",
    ticker: "ITC",
    name: "ITC Limited",
    prediction_date: "2026-09-15",
    entry_price: 485,
    target_price: 510,
    stoploss_price: 470,
    current_price: 512,
    timeframe: "Short Term (7-15 Days)",
    status: "TARGET_HIT",
    technicals: {
      rsi: 36.4,
      macd_signal: "Bullish Crossover",
      pe_ratio: 26.8,
      dma_200_status: "Above 200 DMA",
      yearly_high_low: "₹520 / ₹399"
    },
    ai_reason: "RSI 36 ओवरसोल्ड जोन व होटल बिजनेस डीमर्जर डेट के चलते रिवर्सल सेटअप।",
    post_mortem: "टारगेट 11 दिनों में पूरा हुआ। होटल डीमर्जर की खबरों और 3.5% डिविडेंड यील्ड सपोर्ट से मजबूत संस्थागत खरीदारी आई।",
    pnl_percent: 5.15,
    resolved_date: "2026-09-26"
  },
  {
    id: "pred-hdfc-5",
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd",
    prediction_date: "2026-09-26",
    entry_price: 1640,
    target_price: 1730,
    stoploss_price: 1595,
    current_price: 1668,
    timeframe: "Medium Term (1-3 Months)",
    status: "ACTIVE",
    technicals: {
      rsi: 48.0,
      macd_signal: "Bullish Crossover",
      pe_ratio: 18.9,
      dma_200_status: "Above 200 DMA",
      yearly_high_low: "₹1,794 / ₹1,363"
    },
    ai_reason: "क्रेडिट-टू-डिपॉजिट (CD) रेशियो में सुधार और 10-साल के सबसे कम P/B वैल्यूएशन पर ट्रेड।",
    post_mortem: "सक्रिय ट्रेड: वर्तमान भाव ₹1,668 (+1.71%)। FIIs की लगातार खरीदारी का समर्थन।",
    pnl_percent: 1.71
  }
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

  const [selectedAi] = useState(AI_CONFIG);
  const [activeTab, setActiveTab] = useState<'stocks' | 'predictions' | 'family' | 'all'>('stocks');
  const [questionInput, setQuestionInput] = useState('');
  const [stockSearchInput, setStockSearchInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string>('OpenAI (gpt-4o-mini ready)');
  const [healthScore, setHealthScore] = useState<number>(85);
  const [marketTrend, setMarketTrend] = useState<string>('Healthy Bullish Accumulation Zone');

  // AI Stock & Index Scanner State
  const [indexScans, setIndexScans] = useState<IndexScanResult[]>(MAJOR_INDEX_DEFINITIONS);
  const [constituentStocks, setConstituentStocks] = useState<ConstituentStockScan[]>(CONSTITUENT_STOCKS_DATABASE);
  const [customScannedStock, setCustomScannedStock] = useState<ConstituentStockScan | null>(null);
  const [selectedIndexFilter, setSelectedIndexFilter] = useState<'ALL' | 'NIFTY 50' | 'BANKNIFTY' | 'SENSEX' | 'BANKEX'>('ALL');
  const [activeChartSymbol, setActiveChartSymbol] = useState<string>('NSE:NIFTY');
  const [showChart, setShowChart] = useState<boolean>(true);

  // Auto-sync live quotes on mount
  useEffect(() => {
    const syncLiveQuotes = async () => {
      try {
        const res = await fetch('/api/stocks/markets-indices?index=NIFTY 50');
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.indices) && data.indices.length > 0) {
            setIndexScans(prev => prev.map(p => {
              const found = data.indices.find((l: any) => l.symbol === p.symbol || (p.symbol === 'BANKNIFTY' && l.symbol === 'NIFTY BANK'));
              if (found) {
                return {
                  ...p,
                  current_price: found.price,
                  change_points: found.change,
                  change_percent: found.changePct,
                  support_1: Math.round(found.price * 0.988),
                  support_2: Math.round(found.price * 0.98),
                  resistance_1: Math.round(found.price * 1.012),
                  resistance_2: Math.round(found.price * 1.02),
                  target_1: Math.round(found.price * 1.025),
                  target_2: Math.round(found.price * 1.04),
                  stoploss: Math.round(found.price * 0.975),
                };
              }
              return p;
            }));
          }
          if (Array.isArray(data.stocks) && data.stocks.length > 0) {
            setConstituentStocks(prev => prev.map(stock => {
              const found = data.stocks.find((s: any) => s.symbol === stock.ticker);
              if (found && found.price) {
                return {
                  ...stock,
                  currentPrice: found.price,
                  changePercent: found.changePct,
                  targetPrice: Math.round(found.price * 1.09),
                  stoplossPrice: Math.round(found.price * 0.94),
                  lastScannedAt: 'Live Yahoo Finance'
                };
              }
              return stock;
            }));
          }
        }
      } catch (e) {
        console.warn('Initial live quote sync error:', e);
      }
    };
    syncLiveQuotes();
  }, []);

  // Predictions state
  const [predictions, setPredictions] = useState<StockPrediction[]>(INITIAL_PREDICTIONS);
  const [predFilter, setPredFilter] = useState<'all' | 'ACTIVE' | 'TARGET_HIT' | 'STOPLOSS_HIT'>('all');
  const [isAddPredModalOpen, setIsAddPredModalOpen] = useState(false);
  const [newPredTicker, setNewPredTicker] = useState('');
  const [newPredName, setNewPredName] = useState('');
  const [newPredEntry, setNewPredEntry] = useState('');
  const [newPredTarget, setNewPredTarget] = useState('');
  const [newPredStoploss, setNewPredStoploss] = useState('');
  const [newPredRsi, setNewPredRsi] = useState('45');
  const [newPredPe, setNewPredPe] = useState('22');
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

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

  // Prediction Stats & Win Rate
  const resolvedPredictions = predictions.filter(p => p.status === 'TARGET_HIT' || p.status === 'STOPLOSS_HIT');
  const targetHitCount = predictions.filter(p => p.status === 'TARGET_HIT').length;
  const stoplossHitCount = predictions.filter(p => p.status === 'STOPLOSS_HIT').length;
  const activePredCount = predictions.filter(p => p.status === 'ACTIVE').length;
  const winRatePercent = resolvedPredictions.length > 0 
    ? Math.round((targetHitCount / resolvedPredictions.length) * 100) 
    : 75;
  const netCumulativePnL = predictions.reduce((sum, p) => sum + (p.pnl_percent || 0), 0);

  const handleFetchAi = async (customQuestion?: string, stockToScanName?: string) => {
    try {
      setLoading(true);
      const targetStock = stockToScanName !== undefined ? stockToScanName : stockSearchInput;
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
          stockToScan: targetStock,
        }),
      });

      if (targetStock && targetStock.trim()) {
        const clean = targetStock.trim().toUpperCase();
        if (clean.includes('NIFTY 50') || clean === 'NIFTY') setActiveChartSymbol('NSE:NIFTY');
        else if (clean.includes('SENSEX')) setActiveChartSymbol('BSE:SENSEX');
        else if (clean.includes('BANKNIFTY') || clean.includes('BANK NIFTY')) setActiveChartSymbol('NSE:BANKNIFTY');
        else if (clean.includes('BANKEX')) setActiveChartSymbol('BSE:BANKEX');
        else if (clean.includes('ZOMATO') || clean.includes('ETERNAL')) setActiveChartSymbol('NSE:ETERNAL');
        else if (clean.includes('TATA') && clean.includes('MOT')) setActiveChartSymbol('NSE:TATAMOTORS');
        else if (clean.includes('HDFC') && clean.includes('BANK')) setActiveChartSymbol('NSE:HDFCBANK');
        else setActiveChartSymbol(`NSE:${clean.replace(/\s+/g, '')}`);
      }

      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.indexScans) && data.indexScans.length > 0) {
          setIndexScans(data.indexScans);
        }
        if (Array.isArray(data.stockScans) && data.stockScans.length > 0) {
          setConstituentStocks(data.stockScans);
        }
        if (data.customScan) {
          setCustomScannedStock(data.customScan);
        } else if (targetStock && targetStock.trim()) {
          setCustomScannedStock(generateCustomStockScan(targetStock));
        }
        if (Array.isArray(data.insights) && data.insights.length > 0) {
          setInsights(data.insights);
        }
        if (Array.isArray(data.predictions) && data.predictions.length > 0) {
          setPredictions(data.predictions);
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

      // Sync fresh live market quotes in parallel
      try {
        const liveRes = await fetch('/api/stocks/markets-indices?index=NIFTY 50');
        const liveData = await liveRes.json();
        if (liveData.success && Array.isArray(liveData.indices) && liveData.indices.length > 0) {
          setIndexScans(prev => prev.map(p => {
            const found = liveData.indices.find((l: any) => l.symbol === p.symbol || (p.symbol === 'BANKNIFTY' && l.symbol === 'NIFTY BANK'));
            if (found) {
              return {
                ...p,
                current_price: found.price,
                change_points: found.change,
                change_percent: found.changePct,
                support_1: Math.round(found.price * 0.988),
                support_2: Math.round(found.price * 0.98),
                resistance_1: Math.round(found.price * 1.012),
                resistance_2: Math.round(found.price * 1.02),
                target_1: Math.round(found.price * 1.025),
                target_2: Math.round(found.price * 1.04),
                stoploss: Math.round(found.price * 0.975),
              };
            }
            return p;
          }));
        }
      } catch (e) {
        console.warn('Live quote sync error:', e);
      }
    } catch (err) {
      console.error('Error fetching AI advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = () => {
    // Check Target and Stoploss triggers against current prices
    let hitCount = 0;
    let slCount = 0;
    const updated = predictions.map(p => {
      if (p.status !== 'ACTIVE') return p;
      if (p.current_price >= p.target_price) {
        hitCount++;
        return {
          ...p,
          status: 'TARGET_HIT' as const,
          pnl_percent: Number((((p.target_price - p.entry_price) / p.entry_price) * 100).toFixed(2)),
          resolved_date: new Date().toISOString().split('T')[0],
          post_mortem: `🎯 टारगेट हिट: लाइव भाव (₹${p.current_price}) ने लक्ष्य ₹${p.target_price} को पार किया। RSI मोमेंटम व वॉल्यूम ब्रेकआउट सफल रहा।`
        };
      }
      if (p.current_price <= p.stoploss_price) {
        slCount++;
        return {
          ...p,
          status: 'STOPLOSS_HIT' as const,
          pnl_percent: Number((((p.stoploss_price - p.entry_price) / p.entry_price) * 100).toFixed(2)),
          resolved_date: new Date().toISOString().split('T')[0],
          post_mortem: `🛑 स्टॉपलॉस ट्रिगर: भाव गिरकर ₹${p.stoploss_price} पर आया। अनुशासित एग्जिट से बड़ी हानि टल गई।`
        };
      }
      return p;
    });

    setPredictions(updated);
    setAuditMessage(`ऑडिट पूरा: सभी एक्टिव कॉल्स का मूल्यांकन संपन्न हुआ। ${hitCount} नए टारगेट हिट, ${slCount} स्टॉपलॉस ट्रिगर।`);
    setTimeout(() => setAuditMessage(null), 5000);
  };

  const handleAddManualPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPredTicker.trim() || !newPredEntry || !newPredTarget || !newPredStoploss) return;

    const entry = Number(newPredEntry);
    const target = Number(newPredTarget);
    const stoploss = Number(newPredStoploss);
    const pnl = Number((((entry - entry) / entry) * 100).toFixed(2));

    const newPred: StockPrediction = {
      id: `pred-user-${Date.now()}`,
      ticker: newPredTicker.trim().toUpperCase(),
      name: newPredName.trim() || newPredTicker.trim().toUpperCase(),
      prediction_date: new Date().toISOString().split('T')[0],
      entry_price: entry,
      target_price: target,
      stoploss_price: stoploss,
      current_price: entry,
      timeframe: 'Short Term (7-15 Days)',
      status: 'ACTIVE',
      technicals: {
        rsi: Number(newPredRsi) || 45,
        macd_signal: 'Bullish Crossover',
        pe_ratio: Number(newPredPe) || 22,
        dma_200_status: 'Above 200 DMA',
        yearly_high_low: `₹${Math.round(target * 1.1)} / ₹${Math.round(stoploss * 0.9)}`
      },
      ai_reason: `RSI ${newPredRsi} व P/E ${newPredPe} के आधार पर नया सेटअप। लक्ष्य: ₹${target} (+${Math.round(((target-entry)/entry)*100)}%), स्टॉपलॉस: ₹${stoploss} (-${Math.round(((entry-stoploss)/entry)*100)}%)।`,
      post_mortem: 'सक्रिय ट्रेड: दैनिक मार्केट क्लोजिंग पर ऑटो-ऑडिट जारी रहेगा।',
      pnl_percent: pnl
    };

    setPredictions([newPred, ...predictions]);
    setIsAddPredModalOpen(false);
    setNewPredTicker('');
    setNewPredName('');
    setNewPredEntry('');
    setNewPredTarget('');
    setNewPredStoploss('');
  };

  const filteredPredictions = predictions.filter(p => {
    if (predFilter === 'all') return true;
    return p.status === predFilter;
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
                    <CheckCircle2 size={10} /> पारिवारिक वेल्थ AI सक्रिय
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

          {/* Quick Nav to Dedicated Market Terminal */}
          <div className="pt-2 border-t border-paper-dim flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-ink-muted flex items-center gap-1.5 font-medium">
              ✨ <strong className="text-ink">श्री वेल्थ AI</strong> — संपूर्ण भारतीय मार्केट (Nifty, Sensex, BankNifty) व फैमिली कैशफ्लो हेतु प्रशिक्षित।
            </span>
            <Link
              href="/market"
              className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/25 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <BarChart2 size={13} className="text-blue-500" />
              <span>📊 मनीकंट्रोल लाइव मार्केट टर्मिनल खोलें &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="px-4">
        <div className="flex p-1 bg-paper-subtle rounded-xl border border-paper-dim overflow-x-auto">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 min-w-[120px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'stocks'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <TrendingUp size={14} className="text-emerald-500" />
            <span>📈 स्टॉक स्कैनर</span>
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex-1 min-w-[150px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'predictions'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Target size={14} className="text-amber-500" />
            <span>🎯 प्रेडिक्शन जर्नल & ऑडिट</span>
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 min-w-[130px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'family'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Home size={14} className="text-blue-500" />
            <span>🏠 पारिवारिक वेल्थ</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 min-w-[100px] py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-paper text-ink shadow-xs border border-paper-dim'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>🌟 समग्र</span>
          </button>
        </div>
      </div>

      {/* SECTION: PREDICTION JOURNAL & AUTO-AUDIT (TARGET VS STOPLOSS) */}
      {activeTab === 'predictions' && (
        <div className="px-4 space-y-3">
          {/* Win Rate & Accuracy Scorecard */}
          <div className="p-4 bg-gradient-to-r from-navy via-slate-900 to-navy text-paper rounded-2xl border border-paper-dim shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-paper">AI प्रेडिक्शन ट्रैकर व ऑटो-ऑडिट स्कोरबोर्ड</h3>
                  <p className="text-[11px] text-paper-dim">PE, RSI, MACD व 200 DMA के आधार पर टार्गेट व स्टॉपलॉस की ट्रैकिंग</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAudit}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>🔄 लाइव ऑडिट रन करें</span>
                </button>
                <button
                  onClick={() => setIsAddPredModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-paper font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus size={12} />
                  <span>+ नया ट्रेड</span>
                </button>
              </div>
            </div>

            {auditMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-fade-in flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>{auditMessage}</span>
              </div>
            )}

            {/* KPI Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-paper-dim uppercase block">सफलता दर (Win Rate)</span>
                <span className="text-xl font-black text-amber-400 block mt-0.5">{winRatePercent}%</span>
                <span className="text-[9px] text-paper-dim">{targetHitCount} सफल / {resolvedPredictions.length} पूर्ण</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-paper-dim uppercase block">टारगेट हिट (Pass 🎯)</span>
                <span className="text-xl font-black text-emerald-400 block mt-0.5">{targetHitCount}</span>
                <span className="text-[9px] text-emerald-400/80">सफलतापूर्वक पूर्ण</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-paper-dim uppercase block">स्टॉपलॉस ट्रिगर (🛑)</span>
                <span className="text-xl font-black text-rose-400 block mt-0.5">{stoplossHitCount}</span>
                <span className="text-[9px] text-paper-dim">पूंजी सुरक्षित की</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-paper-dim uppercase block">सक्रिय ट्रेड्स (⏳)</span>
                <span className="text-xl font-black text-blue-400 block mt-0.5">{activePredCount}</span>
                <span className="text-[9px] text-paper-dim">दैनिक ट्रैक पर</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-paper-dim uppercase block">नेट संचयी लाभ</span>
                <span className={`text-xl font-black block mt-0.5 ${netCumulativePnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netCumulativePnL >= 0 ? '+' : ''}{netCumulativePnL.toFixed(1)}%
                </span>
                <span className="text-[9px] text-paper-dim">औसत मुनाफा</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setPredFilter('all')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                  predFilter === 'all'
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                }`}
              >
                सभी कॉल्स ({predictions.length})
              </button>
              <button
                onClick={() => setPredFilter('ACTIVE')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                  predFilter === 'ACTIVE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                }`}
              >
                सक्रिय (⏳ {activePredCount})
              </button>
              <button
                onClick={() => setPredFilter('TARGET_HIT')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                  predFilter === 'TARGET_HIT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                }`}
              >
                टारगेट हिट (🎯 {targetHitCount})
              </button>
              <button
                onClick={() => setPredFilter('STOPLOSS_HIT')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                  predFilter === 'STOPLOSS_HIT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                }`}
              >
                स्टॉपलॉस कटा (🛑 {stoplossHitCount})
              </button>
            </div>

            <button
              onClick={() => handleFetchAi("Generate fresh quantitative stock prediction with RSI and MACD")}
              disabled={loading}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
            >
              <Zap size={12} />
              <span>AI से नया प्रेडिक्शन</span>
            </button>
          </div>

          {/* Prediction Cards List */}
          <div className="space-y-3">
            {filteredPredictions.map((pred) => {
              const isTargetHit = pred.status === 'TARGET_HIT';
              const isSlHit = pred.status === 'STOPLOSS_HIT';
              const targetGainPct = Math.round(((pred.target_price - pred.entry_price) / pred.entry_price) * 100);
              const slRiskPct = Math.round(((pred.entry_price - pred.stoploss_price) / pred.entry_price) * 100);

              return (
                <div
                  key={pred.id}
                  className={`p-4 rounded-2xl bg-paper border shadow-xs space-y-3 animate-fade-in transition-all ${
                    isTargetHit
                      ? 'border-emerald-500/40 bg-emerald-500/[0.02]'
                      : isSlHit
                      ? 'border-rose-500/40 bg-rose-500/[0.02]'
                      : 'border-blue-500/30'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-ink">{pred.ticker}</h4>
                        <span className="text-[10px] text-ink-muted">({pred.name})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink-muted">
                          {pred.timeframe}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-muted block mt-0.5">
                        तारीख: {pred.prediction_date} {pred.resolved_date ? `• पूरा हुआ: ${pred.resolved_date}` : ''}
                      </span>
                    </div>

                    <div>
                      {isTargetHit && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={12} /> TARGET HIT (+{pred.pnl_percent}%)
                        </span>
                      )}
                      {isSlHit && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle size={12} /> STOPLOSS HIT ({pred.pnl_percent}%)
                        </span>
                      )}
                      {pred.status === 'ACTIVE' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1 animate-pulse">
                          <Clock size={12} /> ACTIVE (वर्तमान: ₹{pred.current_price})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantitative Trade Levels Strip */}
                  <div className="grid grid-cols-4 gap-2 p-2.5 bg-paper-subtle rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">प्रवेश (Entry)</span>
                      <Mono className="text-xs font-bold text-ink block mt-0.5">₹{pred.entry_price}</Mono>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold block">टारगेट (Target)</span>
                      <Mono className="text-xs font-bold text-emerald-600 block mt-0.5">
                        ₹{pred.target_price} <span className="text-[10px] font-normal">(+{targetGainPct}%)</span>
                      </Mono>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold block">स्टॉपलॉस (SL)</span>
                      <Mono className="text-xs font-bold text-rose-600 block mt-0.5">
                        ₹{pred.stoploss_price} <span className="text-[10px] font-normal">(-{slRiskPct}%)</span>
                      </Mono>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted uppercase block">लाइव भाव</span>
                      <Mono className="text-xs font-bold text-ink block mt-0.5">₹{pred.current_price}</Mono>
                    </div>
                  </div>

                  {/* Math Indicators Ribbon (RSI, MACD, PE, 200 DMA) */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim font-medium text-ink">
                      RSI (14): <strong className="text-amber-600">{pred.technicals.rsi}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim font-medium text-ink">
                      MACD: <strong className="text-emerald-600">{pred.technicals.macd_signal}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim font-medium text-ink">
                      P/E रेशियो: <strong className="text-blue-600">{pred.technicals.pe_ratio}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim font-medium text-ink">
                      200 DMA: <strong className="text-indigo-600">{pred.technicals.dma_200_status}</strong>
                    </span>
                    {pred.technicals.yearly_high_low && (
                      <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim font-medium text-ink-muted">
                        52W High/Low: {pred.technicals.yearly_high_low}
                      </span>
                    )}
                  </div>

                  {/* AI Post-Mortem & Reasoning Box */}
                  <div className="p-3 rounded-xl bg-paper-subtle border border-paper-dim text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-ink text-[11px]">
                      <Bot size={13} className="text-amber-500" />
                      <span>चाणक्य AI पोस्ट-मॉर्टम व कारण:</span>
                    </div>
                    <p className="text-ink-muted leading-relaxed">
                      <strong className="text-ink">ट्रेड तर्क:</strong> {pred.ai_reason}
                    </p>
                    {pred.post_mortem && (
                      <p className="text-ink leading-relaxed font-medium pt-1 border-t border-paper-dim/60">
                        <strong className="text-amber-700 dark:text-amber-300">ऑटो-ऑडिट विश्लेषण:</strong> {pred.post_mortem}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION: AI STOCK & INDEX SCANNER (WHEN STOCKS OR ALL IS ACTIVE) */}
      {(activeTab === 'stocks' || activeTab === 'all') && (
        <div className="px-4 space-y-4">
          {/* 1. Main Scanner Control Panel */}
          <div className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">AI इंडेक्स व स्टॉक स्कैनर (Live Market Radar)</h3>
                  <p className="text-[11px] text-ink-muted">
                    बाज़ार स्थिति: <strong className="text-emerald-600 font-bold">{marketTrend}</strong> • {activeProvider}
                  </p>
                </div>
              </div>

              {/* Top Big Action Scan Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFetchAi()}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>{loading ? 'AI स्कैन गणना जारी है...' : '⚡ AI स्कैन रन करें (Scan Now)'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-ink-muted pt-0.5">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ऑन-डिमांड बटन सिस्टम: केवल आपके क्लिक करने पर स्कैन होता है</span>
              </span>
              <span className="font-mono bg-paper-subtle px-2 py-0.5 rounded-md border border-paper-dim">
                🕒 अंतिम स्कैन: {lastRefreshed || 'आज शाम लाइव'}
              </span>
            </div>

            {/* Custom Stock Search Bar */}
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (stockSearchInput.trim()) {
                  handleFetchAi(undefined, stockSearchInput.trim());
                }
              }} 
              className="flex gap-2 pt-1"
            >
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-ink-muted" />
                <input
                  type="text"
                  value={stockSearchInput}
                  onChange={(e) => setStockSearchInput(e.target.value)}
                  placeholder="कोई भी अन्य शेयर नाम / कोड डालें (उदा. TATA MOTORS, ZOMATO, SUZLON, HAL, ADANI)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-paper-subtle border border-paper-dim rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-ink placeholder:text-ink-muted"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !stockSearchInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Search size={12} />
                <span>शेयर स्कैन करें</span>
              </button>
            </form>

            {/* Quick Stock Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-ink-muted font-medium">त्वरित सर्च:</span>
              {['NIFTY 50', 'BANKNIFTY', 'SENSEX', 'BANKEX', 'HDFC BANK', 'RELIANCE', 'TATA MOTORS', 'ZOMATO', 'SUZLON', 'ITC'].map((stk, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStockSearchInput(stk);
                    handleFetchAi(undefined, stk);
                  }}
                  className="text-[10px] font-medium text-ink-muted hover:text-ink bg-paper-subtle hover:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-paper-dim transition-all cursor-pointer"
                >
                  {stk}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Custom Searched Stock Spotlight (If User Searched Any Stock) */}
          {customScannedStock && (
            <div className="p-4 bg-gradient-to-br from-amber-500/10 via-paper to-emerald-500/10 rounded-2xl border-2 border-amber-500/40 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-start justify-between gap-2 border-b border-paper-dim pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-500 text-navy uppercase">
                      🔍 सर्च किया गया शेयर
                    </span>
                    <span className="text-[11px] font-bold text-ink-muted">({customScannedStock.category})</span>
                  </div>
                  <h3 className="text-base font-bold text-ink mt-1 flex items-center gap-2">
                    <span>{customScannedStock.ticker}</span>
                    <span className="text-xs font-normal text-ink-muted">— {customScannedStock.name}</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border inline-block ${
                    customScannedStock.signal.includes('BUY')
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/40'
                  }`}>
                    {customScannedStock.signal}
                  </span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">विश्वसनीयता: {customScannedStock.confidence}</span>
                </div>
              </div>

              {/* Levels & Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-paper rounded-xl border border-paper-dim text-center">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">वर्तमान भाव</span>
                  <Mono className="text-sm font-bold text-ink block mt-0.5">₹{customScannedStock.currentPrice}</Mono>
                  <span className="text-[10px] text-emerald-600 font-semibold">+{customScannedStock.changePercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold block">🎯 लक्ष्य (Target)</span>
                  <Mono className="text-sm font-bold text-emerald-600 block mt-0.5">₹{customScannedStock.targetPrice}</Mono>
                  <span className="text-[10px] text-emerald-600">
                    +{Math.round(((customScannedStock.targetPrice - customScannedStock.currentPrice) / customScannedStock.currentPrice) * 100)}% अपसाइड
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold block">🛑 स्टॉपलॉस (SL)</span>
                  <Mono className="text-sm font-bold text-rose-600 block mt-0.5">₹{customScannedStock.stoplossPrice}</Mono>
                  <span className="text-[10px] text-rose-600">सुरक्षा स्तर</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block">परिवार आवंटन</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">{customScannedStock.targetAllocation}</span>
                  <span className="text-[10px] text-ink-muted">{customScannedStock.valuation}</span>
                </div>
              </div>

              {/* Indicators Strip */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-paper border border-paper-dim font-medium text-ink">
                  RSI (14): <strong className="text-amber-600">{customScannedStock.rsi}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-paper border border-paper-dim font-medium text-ink">
                  MACD: <strong className="text-emerald-600">{customScannedStock.macd}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-paper border border-paper-dim font-medium text-ink">
                  200 DMA: <strong className="text-blue-600">{customScannedStock.dma200}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-paper border border-paper-dim font-medium text-ink">
                  P/E रेशियो: <strong className="text-purple-600">{customScannedStock.peRatio}</strong>
                </span>
              </div>

              {/* Quantitative Technical Benchmarks for Searched Stock */}
              <TechnicalBenchmarksCard
                data={{
                  currentPrice: customScannedStock.currentPrice,
                  pe: customScannedStock.peRatio,
                  industryPe: 22.0,
                  rsi: customScannedStock.rsi,
                  macd: customScannedStock.macd,
                  ema20: Math.round(customScannedStock.currentPrice * 1.005),
                  ema50: Math.round(customScannedStock.currentPrice * 1.001),
                  ema200: Math.round(customScannedStock.currentPrice * 0.98),
                  fibonacciLevels: {
                    fib236: Math.round(customScannedStock.currentPrice * 1.01),
                    fib382: Math.round(customScannedStock.currentPrice * 1.004),
                    fib500: Math.round(customScannedStock.currentPrice * 0.998),
                    fib618: Math.round(customScannedStock.currentPrice * 0.992),
                    fib786: Math.round(customScannedStock.currentPrice * 0.985),
                  },
                  breakoutLine: customScannedStock.targetPrice,
                  support: customScannedStock.stoplossPrice
                }}
              />

              {/* AI Analysis */}
              <div className="p-3 rounded-xl bg-paper/80 border border-paper-dim text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-ink text-[11px]">
                  <Bot size={13} className="text-emerald-600" />
                  <span>AI विस्तृत विश्लेषण व रणनीति:</span>
                </div>
                <p className="text-ink-muted leading-relaxed">{customScannedStock.rationale}</p>
              </div>

              {/* Dedicated Live Interactive Chart for Searched Stock */}
              <div className="pt-2">
                <TradingViewWidget
                  symbol={activeChartSymbol}
                  height={420}
                  aiBreakout={{
                    breakoutResistance: customScannedStock.targetPrice,
                    demandSupport: customScannedStock.stoplossPrice,
                    target1: customScannedStock.targetPrice,
                    target2: Math.round(customScannedStock.targetPrice * 1.03),
                    fibGoldenZone: Math.round(customScannedStock.currentPrice * 0.992),
                    currentPrice: customScannedStock.currentPrice,
                    signal: customScannedStock.signal,
                    verdict: `${customScannedStock.ticker} — ${customScannedStock.valuation} (लाइव रडार)`
                  }}
                />
              </div>
            </div>
          )}

          {/* Interactive Live Candlestick & Technical Tools Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  लाइव कैंडलस्टिक चार्ट व ड्रॉइंग टूल्स (TradingView Live Radar)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowChart(!showChart)}
                className="text-[11px] font-bold text-gold hover:underline cursor-pointer"
              >
                {showChart ? 'चार्ट छिपाएं ▲' : 'चार्ट दिखाएं ▼'}
              </button>
            </div>

            {showChart && (() => {
              const currentIdx = indexScans.find(i => activeChartSymbol.includes(i.symbol)) || indexScans[0];
              const breakoutData = customScannedStock ? {
                breakoutResistance: customScannedStock.targetPrice,
                demandSupport: customScannedStock.stoplossPrice,
                target1: customScannedStock.targetPrice,
                target2: Math.round(customScannedStock.targetPrice * 1.03),
                fibGoldenZone: Math.round(customScannedStock.currentPrice * 0.992),
                currentPrice: customScannedStock.currentPrice,
                signal: customScannedStock.signal,
                verdict: `${customScannedStock.ticker} - ${customScannedStock.valuation}`
              } : {
                breakoutResistance: currentIdx?.breakout_line || currentIdx?.resistance_1 || Math.round((currentIdx?.current_price || 22362) * 1.01),
                demandSupport: currentIdx?.stoploss || currentIdx?.support_1 || Math.round((currentIdx?.current_price || 22362) * 0.99),
                target1: currentIdx?.target_1 || Math.round((currentIdx?.current_price || 22362) * 1.015),
                target2: currentIdx?.target_2 || Math.round((currentIdx?.current_price || 22362) * 1.03),
                fibGoldenZone: currentIdx?.fibonacci_levels?.fib_618 || Math.round((currentIdx?.current_price || 22362) * 0.994),
                currentPrice: currentIdx?.current_price || 22362,
                signal: currentIdx?.trend || 'BUY / ACCUMULATE',
                verdict: currentIdx?.ai_prediction_summary || 'गोल्डन 200 EMA के ऊपर मजबूत आधार'
              };

              return (
                <TradingViewWidget
                  symbol={activeChartSymbol}
                  height={450}
                  aiBreakout={breakoutData}
                />
              );
            })()}
          </div>

          {/* 3. Major Indian Indexes Section (NIFTY 50, SENSEX, BANKNIFTY, BANKEX) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇮🇳 प्रमुख भारतीय इंडेक्स (Major Indexes Scan)</span>
                  <span className="text-[10px] font-normal text-ink-muted">({indexScans.length} इंडेक्स मॉनिटरिंग)</span>
                </h4>
                <p className="text-[10px] text-ink-muted">निफ्टी 50, सेंसेक्स, बैंकनिफ्टी और बैंकेक्स के लाइव तकनीकी स्तर व AI प्रेडिक्शन</p>
              </div>

              {/* Index Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'NIFTY 50', 'BANKNIFTY', 'SENSEX', 'BANKEX'] as const).map((idxName) => (
                  <button
                    key={idxName}
                    onClick={() => setSelectedIndexFilter(idxName)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedIndexFilter === idxName
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
                    }`}
                  >
                    {idxName === 'ALL' ? 'सभी 4 इंडेक्स' : idxName}
                  </button>
                ))}
              </div>
            </div>

            {/* Index Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {indexScans
                .filter(idx => selectedIndexFilter === 'ALL' || idx.symbol === selectedIndexFilter)
                .map((idx) => {
                  const isBullish = idx.trend === 'BULLISH';
                  const isBearish = idx.trend === 'BEARISH';

                  return (
                    <div
                      key={idx.symbol}
                      className="p-4 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-3 hover:border-emerald-500/40 hover:shadow-md transition-all animate-fade-in"
                    >
                      {/* Top Row: Symbol, Exchange, Price, Change */}
                      <div className="flex items-start justify-between gap-2 border-b border-paper-dim pb-2.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-ink">{idx.symbol}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink-muted">
                              {idx.exchange}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5">{idx.name}</p>
                        </div>

                        <div className="text-right">
                          <Mono className="text-base font-black text-ink block">
                            ₹{idx.current_price.toLocaleString('en-IN')}
                          </Mono>
                          <span className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${
                            idx.change_points >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {idx.change_points >= 0 ? '+' : ''}{idx.change_points.toFixed(2)} ({idx.change_points >= 0 ? '+' : ''}{idx.change_percent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      {/* AI Prediction Badge & Confidence */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                          isBullish
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : isBearish
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                        }`}>
                          <span>{isBullish ? '📈' : isBearish ? '📉' : '↔️'}</span>
                          <span>{idx.trend_label}</span>
                        </span>

                        <span className="text-[10px] font-bold text-ink-muted bg-paper-subtle px-2 py-0.5 rounded-md border border-paper-dim">
                          ⭐ {idx.confidence_score}% AI सटीकता स्कोर
                        </span>
                      </div>

                      {/* Key Technical Levels Grid */}
                      <div className="grid grid-cols-4 gap-1.5 p-2 bg-paper-subtle rounded-xl text-center">
                        <div className="p-1">
                          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">टारगेट 1</span>
                          <Mono className="text-xs font-bold text-ink block mt-0.5">₹{idx.target_1.toLocaleString('en-IN')}</Mono>
                        </div>
                        <div className="p-1">
                          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">टारगेट 2</span>
                          <Mono className="text-xs font-bold text-ink block mt-0.5">₹{idx.target_2.toLocaleString('en-IN')}</Mono>
                        </div>
                        <div className="p-1">
                          <span className="text-[9px] text-rose-700 dark:text-rose-400 font-bold uppercase block">स्टॉपलॉस</span>
                          <Mono className="text-xs font-bold text-rose-600 block mt-0.5">₹{idx.stoploss.toLocaleString('en-IN')}</Mono>
                        </div>
                        <div className="p-1">
                          <span className="text-[9px] text-ink-muted font-bold uppercase block">सपोर्ट S1</span>
                          <Mono className="text-xs font-bold text-ink block mt-0.5">₹{idx.support_1.toLocaleString('en-IN')}</Mono>
                        </div>
                      </div>

                      {/* Math Indicators Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink">
                          RSI: <strong className="text-amber-600">{idx.rsi}</strong> ({idx.rsi_signal})
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink">
                          MACD: <strong className="text-emerald-600">{idx.macd_signal}</strong>
                        </span>
                        {idx.pcr_ratio && (
                          <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink">
                            PCR: <strong className="text-blue-600">{idx.pcr_ratio}</strong>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-paper-subtle border border-paper-dim text-ink-muted">
                          {idx.dma_200_status}
                        </span>
                      </div>

                      {/* AI Prediction Summary & Trading Strategy */}
                      <div className="p-2.5 rounded-xl bg-paper-subtle border border-paper-dim text-xs space-y-1.5">
                        <p className="text-ink-muted leading-relaxed">
                          <strong className="text-ink font-semibold">AI प्रेडिक्शन:</strong> {idx.ai_prediction_summary}
                        </p>
                        <p className="text-ink leading-relaxed font-medium pt-1 border-t border-paper-dim/60">
                          <strong className="text-emerald-700 dark:text-emerald-400">💡 रणनीति:</strong> {idx.trading_strategy}
                        </p>
                      </div>

                      {/* Chart Switch Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-paper-dim">
                        <span className="text-[10px] text-ink-muted font-medium">लाइव चार्ट देखें:</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx.symbol === 'NIFTY 50') setActiveChartSymbol('NSE:NIFTY');
                            else if (idx.symbol === 'BANKNIFTY') setActiveChartSymbol('NSE:BANKNIFTY');
                            else if (idx.symbol === 'SENSEX') setActiveChartSymbol('BSE:SENSEX');
                            else if (idx.symbol === 'BANKEX') setActiveChartSymbol('BSE:BANKEX');
                            else setActiveChartSymbol(`NSE:${idx.symbol}`);
                            setShowChart(true);
                          }}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <LineChart size={12} />
                          <span>{idx.symbol} कैंडलस्टिक चार्ट लोड करें</span>
                        </button>
                      </div>

                      {/* Key Catalysts & Top Movers */}
                      {idx.top_movers && idx.top_movers.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[9px] text-ink-muted uppercase font-bold block mb-1">
                            इस इंडेक्स के मुख्य चालक शेयर्स:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {idx.top_movers.map((m, mi) => (
                              <button
                                key={mi}
                                type="button"
                                onClick={() => {
                                  setStockSearchInput(m.ticker);
                                  handleFetchAi(undefined, m.ticker);
                                }}
                                className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-paper hover:bg-emerald-500/10 border border-paper-dim text-ink transition-colors cursor-pointer"
                              >
                                {m.ticker} (+{m.change_pct}%) • {m.signal}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 4. Constituent Heavyweight Stocks of the Indexes */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <span>📊 इंडेक्स के प्रमुख शेयर्स (Index Constituent Stocks)</span>
                  <span className="text-[10px] font-normal text-ink-muted">
                    ({constituentStocks.filter(s => selectedIndexFilter === 'ALL' || s.indexAffiliation === selectedIndexFilter).length} स्टॉक्स)
                  </span>
                </h4>
                <p className="text-[10px] text-ink-muted">
                  NIFTY 50, SENSEX, BANKNIFTY और BANKEX के शीर्ष ब्लूचिप व हाई-वेल्थ शेयर्स
                </p>
              </div>
            </div>

            {/* Constituent Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {constituentStocks
                .filter(s => selectedIndexFilter === 'ALL' || s.indexAffiliation === selectedIndexFilter)
                .map((stock, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-paper rounded-2xl border border-paper-dim shadow-xs space-y-2.5 hover:border-emerald-500/40 hover:shadow-md transition-all animate-fade-in"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-paper-subtle border border-paper-dim text-ink-muted">
                            {stock.indexAffiliation}
                          </span>
                          <span className="text-[10px] font-bold text-ink-muted">{stock.category}</span>
                        </div>
                        <h4 className="text-sm font-bold text-ink mt-0.5 flex items-center gap-1">
                          {stock.ticker}
                        </h4>
                        <span className="text-[11px] text-ink-muted">{stock.name}</span>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                          stock.signal.includes('BUY') 
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                        }`}>
                          {stock.signal}
                        </span>
                        <div className="mt-1">
                          <Mono className="text-xs font-bold text-ink">₹{stock.currentPrice}</Mono>
                          <span className="text-[10px] text-emerald-600 block">+{stock.changePercent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 py-1.5 px-2 bg-paper-subtle rounded-xl text-[10px] text-center">
                      <div>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">🎯 लक्ष्य</span>
                        <Mono className="font-bold text-ink">₹{stock.targetPrice}</Mono>
                      </div>
                      <div>
                        <span className="text-rose-700 dark:text-rose-400 font-semibold block">🛑 स्टॉपलॉस</span>
                        <Mono className="font-bold text-ink">₹{stock.stoplossPrice}</Mono>
                      </div>
                      <div>
                        <span className="text-ink-muted block">P/E व RSI</span>
                        <span className="font-semibold text-ink">{stock.peRatio} / {stock.rsi}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed">
                      <strong className="text-ink font-semibold">AI विश्लेषण:</strong> {stock.rationale}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-paper-dim text-[10px] text-ink-muted">
                      <span>बजट आवंटन: <strong className="text-ink">{stock.targetAllocation}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setStockSearchInput(stock.ticker);
                          handleFetchAi(undefined, stock.ticker);
                        }}
                        className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        विस्तृत स्कैन →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: INTERACTIVE AI QUERY BOX (CHAT WITH AI) */}
      <div className="px-4">
        <div className="bg-paper p-4 rounded-2xl border border-paper-dim shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-ink">
              श्री वेल्थ AI से सलाह लें (Ask Stock, SIP or Family Wealth Question)
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (questionInput.trim()) handleFetchAi(questionInput); }} className="flex gap-2">
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

      {/* SECTION: HEALTH SCORE & KEY FINANCIAL METRICS */}
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

      {lastRefreshed && (
        <div className="px-4 text-right">
          <span className="text-[10px] text-ink-muted">
            अंतिम अपडेट: {lastRefreshed} • पावर्ड बाय: <strong className="text-ink">{activeProvider}</strong>
          </span>
        </div>
      )}

      {/* MODAL: ADD MANUAL PREDICTION / TRADE */}
      {isAddPredModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-ink">नया स्टॉक प्रेडिक्शन / ट्रेड जोड़ें</h3>
              </div>
              <button
                onClick={() => setIsAddPredModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualPrediction} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">स्टॉक टिकर *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. RELIANCE"
                    value={newPredTicker}
                    onChange={(e) => setNewPredTicker(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl font-bold uppercase text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">कंपनी का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. Reliance Ind."
                    value={newPredName}
                    onChange={(e) => setNewPredName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">प्रवेश भाव (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2880"
                    value={newPredEntry}
                    onChange={(e) => setNewPredEntry(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl font-mono text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">टारगेट (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3020"
                    value={newPredTarget}
                    onChange={(e) => setNewPredTarget(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-emerald-500/30 rounded-xl font-mono text-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-rose-600 block mb-1">स्टॉपलॉस (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2810"
                    value={newPredStoploss}
                    onChange={(e) => setNewPredStoploss(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-rose-500/30 rounded-xl font-mono text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">RSI (14)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={newPredRsi}
                    onChange={(e) => setNewPredRsi(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-ink-muted block mb-1">P/E रेशियो</label>
                  <input
                    type="number"
                    placeholder="22"
                    value={newPredPe}
                    onChange={(e) => setNewPredPe(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-paper-subtle border border-paper-dim rounded-xl text-ink"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-paper-dim">
                <button
                  type="button"
                  onClick={() => setIsAddPredModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-navy font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  + प्रेडिक्शन ट्रैक पर डालें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
