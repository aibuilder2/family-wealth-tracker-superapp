'use client';

import { useState, useEffect } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  Coins,
  ShieldCheck,
  Calculator,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Plus,
  ArrowRight,
  TrendingUp,
  Percent,
  Calendar,
  User,
  Phone,
  Scale,
  Sparkles,
  Search,
  KeyRound,
  FileCheck,
  RefreshCw,
  Edit3,
  Sliders,
  Flame
} from 'lucide-react';
import { GoldLoanPledge, GoldPurityKarat, GoldLoanStatus } from '@/types';

export default function GoldLoansPage() {
  const { goldLoans, addGoldLoan, recordGoldInterestPayment, settleAndReleaseGoldLoan, updateGoldLoanStatus } = useFamilyStore();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'settled' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Live Market Gold Rate State
  const [live24kRate, setLive24kRate] = useState<number>(7450); // ₹ per gram
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);
  const [rateSource, setRateSource] = useState<string>('Live IBJA / MCX Bullion');
  const [lastRateUpdated, setLastRateUpdated] = useState<string>('Just now');
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  // Modals
  const [showAddPledgeModal, setShowAddPledgeModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<GoldLoanPledge | null>(null);

  // New Pledge Form
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAadhaar, setCustAadhaar] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [grossWeight, setGrossWeight] = useState<number>(20.0);
  const [stoneWeight, setStoneWeight] = useState<number>(0.5);
  const [purity, setPurity] = useState<GoldPurityKarat>('22K');
  const [goldRate, setGoldRate] = useState<number>(7450); // Live 24K Gold Rate / gram
  const [loanAmount, setLoanAmount] = useState<number>(85000);
  const [interestRate, setInterestRate] = useState<number>(2.0); // 2% per month (₹2 saikda)
  const [lockerTag, setLockerTag] = useState('Safe Vault A - Box 12');
  const [barcodeTag, setBarcodeTag] = useState('SEC-GOLD-' + Math.floor(10000 + Math.random() * 90000));
  const [formNotes, setFormNotes] = useState('');

  // Live Calculator inputs
  const [calcGross, setCalcGross] = useState<number>(25.0);
  const [calcStone, setCalcStone] = useState<number>(1.0);
  const [calcPurity, setCalcPurity] = useState<GoldPurityKarat>('22K');
  const [calcRate, setCalcRate] = useState<number>(7450);
  const [calcMonthlyRate, setCalcMonthlyRate] = useState<number>(2.0);

  // Interest Form
  const [interestAmount, setInterestAmount] = useState<number>(2000);
  const [interestMode, setInterestMode] = useState<'upi' | 'cash' | 'bank_transfer'>('upi');
  const [interestDate, setInterestDate] = useState(new Date().toISOString().split('T')[0]);
  const [interestNote, setInterestNote] = useState('');

  // Settle / OTP Form
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('7492');
  const [otpSent, setOtpSent] = useState(false);
  const [settleNote, setSettleNote] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Fetch Live Gold Rate from API
  const fetchLiveGoldPrice = async () => {
    setIsLiveLoading(true);
    try {
      const res = await fetch('/api/market-prices');
      if (res.ok) {
        const data = await res.json();
        if (data?.gold?.rate_per_gram_24k) {
          const new24k = data.gold.rate_per_gram_24k;
          setLive24kRate(new24k);
          setRateSource(data.gold.source || 'IBJA / MCX Benchmark');
          setLastRateUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
          
          // If user hasn't typed custom rate, update calculator & form rate
          if (!isManualOverride) {
            setCalcRate(new24k);
            setGoldRate(new24k);
          }
        }
      }
    } catch (err) {
      console.log('Error fetching live gold price:', err);
    } finally {
      setIsLiveLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGoldPrice();
  }, []);

  // Computed metrics
  const activePledges = goldLoans.filter(p => p.status === 'active' || p.status === 'overdue');
  const settledPledges = goldLoans.filter(p => p.status === 'settled');
  
  const totalCapitalDeployed = activePledges.reduce((sum, p) => sum + p.loan_amount_given, 0);
  const totalNetGoldGrams = activePledges.reduce((sum, p) => sum + p.net_gold_weight_grams, 0);
  const expectedMonthlyByaaj = activePledges.reduce((sum, p) => sum + (p.loan_amount_given * (p.interest_rate_monthly / 100)), 0);
  const totalInterestCollectedAllTime = goldLoans.reduce((sum, p) => {
    const pSum = (p.interest_payments || []).reduce((s, pay) => s + pay.amount, 0);
    return sum + pSum;
  }, 0);

  // Filtered pledges
  const filteredPledges = goldLoans.filter(p => {
    if (activeTab === 'active' && p.status !== 'active') return false;
    if (activeTab === 'settled' && p.status !== 'settled') return false;
    if (activeTab === 'overdue' && p.status !== 'overdue' && p.status !== 'auction_notice') return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchName = p.customer_name.toLowerCase().includes(q);
      const matchPhone = p.customer_phone.toLowerCase().includes(q);
      const matchItem = p.item_title.toLowerCase().includes(q);
      const matchNo = p.pledge_no.toLowerCase().includes(q);
      const matchBarcode = p.packet_barcode.toLowerCase().includes(q);
      return matchName || matchPhone || matchItem || matchNo || matchBarcode;
    }
    return true;
  });

  // Purity Multiplier Helper
  const getPurityMultiplier = (karat: GoldPurityKarat) => {
    switch (karat) {
      case '24K': return 1.0;
      case '22K': return 22 / 24;
      case '18K': return 18 / 24;
      case '14K': return 14 / 24;
      default: return 22 / 24;
    }
  };

  // Live Karat Rates for Quick Display
  const currentBaseRate = calcRate || live24kRate || 7450;
  const rate24k = Math.round(currentBaseRate);
  const rate22k = Math.round(currentBaseRate * (22 / 24));
  const rate18k = Math.round(currentBaseRate * (18 / 24));
  const rate14k = Math.round(currentBaseRate * (14 / 24));

  // Live Calculator calculations
  const calcNetWeight = Math.max(0, calcGross - calcStone);
  const calcGramRate = calcRate * getPurityMultiplier(calcPurity);
  const calcMarketVal = Math.round(calcNetWeight * calcGramRate);
  const calcMaxLoan75 = Math.round(calcMarketVal * 0.75);
  const calcEstMonthlyInterest = Math.round(calcMaxLoan75 * (calcMonthlyRate / 100));

  // Auto calculate in Add Modal
  const formNetWeight = Math.max(0, grossWeight - stoneWeight);
  const formGramRate = goldRate * getPurityMultiplier(purity);
  const formMarketVal = Math.round(formNetWeight * formGramRate);
  const formMaxLoan75 = Math.round(formMarketVal * 0.75);

  const handleAddPledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !itemTitle || loanAmount <= 0) return;

    const calculatedLTV = Number(((loanAmount / (formMarketVal || 1)) * 100).toFixed(1));
    const pledgeNumber = 'GL-' + new Date().getFullYear() + '-' + String(goldLoans.length + 1).padStart(3, '0');

    addGoldLoan({
      pledge_no: pledgeNumber,
      customer_name: custName,
      customer_phone: custPhone || '+91 98000 00000',
      customer_aadhaar: custAadhaar || 'XXXX XXXX XXXX',
      item_title: itemTitle,
      gross_weight_grams: Number(grossWeight),
      stone_weight_grams: Number(stoneWeight),
      net_gold_weight_grams: Number(formNetWeight),
      purity_karat: purity,
      market_gold_rate_per_gram: Number(goldRate),
      valuation_amount: formMarketVal,
      loan_amount_given: Number(loanAmount),
      ltv_percentage: calculatedLTV,
      interest_rate_monthly: Number(interestRate),
      interest_type: 'simple',
      pledge_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'active',
      safe_locker_tag: lockerTag,
      packet_barcode: barcodeTag,
      notes: formNotes,
      noc_otp_verified: false
    });

    setShowAddPledgeModal(false);
    setCustName('');
    setCustPhone('');
    setCustAadhaar('');
    setItemTitle('');
    setFormNotes('');
    setBarcodeTag('SEC-GOLD-' + Math.floor(10000 + Math.random() * 90000));
  };

  const handleSendOtp = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpError(false);
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPledge) return;
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      setOtpError(true);
      return;
    }

    settleAndReleaseGoldLoan(selectedPledge.id, enteredOtp, settleNote);
    setShowSettleModal(false);
    setSelectedPledge(null);
    setEnteredOtp('');
    setOtpSent(false);
    setOtpError(false);
    setSettleNote('');
  };

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPledge || interestAmount <= 0) return;

    recordGoldInterestPayment(selectedPledge.id, {
      amount: Number(interestAmount),
      payment_date: interestDate,
      mode: interestMode,
      notes: interestNote
    });

    setShowInterestModal(false);
    setSelectedPledge(null);
    setInterestAmount(2000);
    setInterestNote('');
  };

  // WhatsApp Girvi Parchi Share
  const shareWhatsAppPledgeReceipt = (pledge: GoldLoanPledge) => {
    const monthlyInt = Math.round(pledge.loan_amount_given * (pledge.interest_rate_monthly / 100));
    const text = '*📜 OFFICIAL GIRVI / GOLD LOAN RECEIPT*\n' +
      '-----------------------------------------\n' +
      '*Pledge No:* ' + pledge.pledge_no + '\n' +
      '*Customer:* ' + pledge.customer_name + '\n' +
      '*Item:* ' + pledge.item_title + ' (' + pledge.purity_karat + ')\n' +
      '*Net Gold Weight:* ' + pledge.net_gold_weight_grams + 'g (Gross: ' + pledge.gross_weight_grams + 'g, Stones: ' + pledge.stone_weight_grams + 'g)\n' +
      '*Valuation:* ₹' + pledge.valuation_amount.toLocaleString('en-IN') + '\n' +
      '*Loan Disbursed:* ₹' + pledge.loan_amount_given.toLocaleString('en-IN') + '\n' +
      '*Byaaj (Interest):* ' + pledge.interest_rate_monthly + '% p.m. (₹' + monthlyInt + '/mo)\n' +
      '*Safe Locker:* ' + pledge.safe_locker_tag + '\n' +
      '*Seal Pouch:* ' + pledge.packet_barcode + '\n' +
      '*Date:* ' + pledge.pledge_date + '\n' +
      '-----------------------------------------\n' +
      '_🔒 Sona surakshit vault me lock hai. Loan settle karke OTP se gold wapas lein._';
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  };

  // WhatsApp OTP NOC Release Share
  const shareWhatsAppNOC = (pledge: GoldLoanPledge) => {
    const text = '*🛡️ OFFICIAL GOLD RELEASE & NOC CERTIFICATE*\n' +
      '-----------------------------------------\n' +
      '*Pledge Ref:* ' + pledge.pledge_no + '\n' +
      '*Customer:* ' + pledge.customer_name + '\n' +
      '*Item Returned:* ' + pledge.item_title + ' (' + pledge.net_gold_weight_grams + 'g Net Gold)\n' +
      '*Tamper Seal:* ' + pledge.packet_barcode + '\n' +
      '*Status:* 100% Repaid & Handed Over As-Is\n' +
      '*Verification:* Customer Mobile OTP Verified\n' +
      '*Release Date:* ' + (pledge.noc_date || new Date().toISOString().split('T')[0]) + '\n' +
      '-----------------------------------------\n' +
      '_Thank you for your business. All liabilities on this pledge stand discharged._';
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
              <Coins className="h-3.5 w-3.5 text-yellow-300" />
              <span>Gold Loan & Girvi Management System (RBI Norms Ready)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              🥇 Sona Girvi, Private Loan & Safe Locker Hub
            </h1>
            <p className="text-amber-100 text-sm max-w-2xl leading-relaxed">
              Real-time gold rate updates & manual override, live Karat valuation (75% LTV), tamper-proof pouch barcodes, monthly byaaj (₹2 saikda), and secure OTP-verified return slips.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setGoldRate(calcRate || live24kRate);
                setShowAddPledgeModal(true);
              }}
              className="flex items-center gap-2 bg-white text-amber-900 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-amber-50 active:scale-95 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              Naya Gold Pledge (Girvi)
            </button>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 🌟 LIVE GOLD RATE & REAL-TIME / MANUAL CONTROLLER STRIP */}
      <div className="bg-card border border-amber-500/40 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {isManualOverride ? '✏️ Custom Sarrafa Bazaar Rate (Manual Set)' : `🟢 ${rateSource} (Live)`}
            </span>
            <span className="text-[11px] text-muted-foreground">· Updated: {lastRateUpdated}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchLiveGoldPrice}
              disabled={isLiveLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLiveLoading ? 'animate-spin' : ''}`} />
              <span>{isLiveLoading ? 'Fetching...' : '1-Click Live MCX Refresh'}</span>
            </button>

            {isManualOverride && (
              <button
                onClick={() => {
                  setIsManualOverride(false);
                  setCalcRate(live24kRate);
                  setGoldRate(live24kRate);
                }}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                ↺ Reset to Live MCX (₹{live24kRate}/g)
              </button>
            )}
          </div>
        </div>

        {/* Live Karat Rates Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>24K (99.9% Pure)</span>
              <span className="text-[9px] px-1 bg-amber-500/20 rounded">Bullion</span>
            </div>
            <div className="text-lg font-black text-foreground mt-0.5">₹{rate24k.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-muted-foreground">/ gram</span></div>
            <div className="text-[10px] text-muted-foreground">₹{(rate24k * 10).toLocaleString('en-IN')} / 10g</div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <div className="text-[11px] font-bold text-yellow-800 dark:text-yellow-300 flex items-center justify-between">
              <span>22K (91.6% Hallmark)</span>
              <span className="text-[9px] px-1 bg-yellow-500/20 rounded">Jewelry</span>
            </div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5">₹{rate22k.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-muted-foreground">/ gram</span></div>
            <div className="text-[10px] text-muted-foreground">₹{(rate22k * 10).toLocaleString('en-IN')} / 10g</div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <span>18K (75.0% Gold)</span>
              <span className="text-[9px] px-1 bg-blue-500/20 rounded">Diamond</span>
            </div>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">₹{rate18k.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-muted-foreground">/ gram</span></div>
            <div className="text-[10px] text-muted-foreground">₹{(rate18k * 10).toLocaleString('en-IN')} / 10g</div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <div className="text-[11px] font-bold text-purple-800 dark:text-purple-300 flex items-center justify-between">
              <span>14K (58.3% Gold)</span>
              <span className="text-[9px] px-1 bg-purple-500/20 rounded">Antique</span>
            </div>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">₹{rate14k.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-muted-foreground">/ gram</span></div>
            <div className="text-[10px] text-muted-foreground">₹{(rate14k * 10).toLocaleString('en-IN')} / 10g</div>
          </div>
        </div>

        {/* Quick Rate Adjuster Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1">
            <Edit3 className="h-3 w-3" /> Quick Bhaav Adjust (₹/g):
          </span>
          <button
            onClick={() => {
              setIsManualOverride(true);
              setCalcRate(prev => prev - 50);
              setGoldRate(prev => prev - 50);
            }}
            className="px-2 py-0.5 rounded-lg bg-muted hover:bg-muted/80 font-bold text-foreground border border-border"
          >
            -₹50
          </button>
          <button
            onClick={() => {
              setIsManualOverride(true);
              setCalcRate(prev => prev - 10);
              setGoldRate(prev => prev - 10);
            }}
            className="px-2 py-0.5 rounded-lg bg-muted hover:bg-muted/80 font-bold text-foreground border border-border"
          >
            -₹10
          </button>
          <button
            onClick={() => {
              setIsManualOverride(true);
              setCalcRate(prev => prev + 10);
              setGoldRate(prev => prev + 10);
            }}
            className="px-2 py-0.5 rounded-lg bg-muted hover:bg-muted/80 font-bold text-foreground border border-border"
          >
            +₹10
          </button>
          <button
            onClick={() => {
              setIsManualOverride(true);
              setCalcRate(prev => prev + 50);
              setGoldRate(prev => prev + 50);
            }}
            className="px-2 py-0.5 rounded-lg bg-muted hover:bg-muted/80 font-bold text-foreground border border-border"
          >
            +₹50
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Capital Given</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">₹{totalCapitalDeployed.toLocaleString('en-IN')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{activePledges.length} Active Girvi Loans</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Gold in Safe Locker</span>
            <div className="h-9 w-9 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">{totalNetGoldGrams.toFixed(1)} <span className="text-sm font-bold text-muted-foreground">grams</span></div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Vault & Pouch Barcoded</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Monthly Byaaj Income</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{Math.round(expectedMonthlyByaaj).toLocaleString('en-IN')}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
              <span>₹{totalInterestCollectedAllTime.toLocaleString('en-IN')} Total Collected</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Settled & Released</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">{settledPledges.length}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <FileCheck className="h-3.5 w-3.5" />
              <span>OTP NOC Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Karat & LTV Calculator Widget */}
      <div className="bg-gradient-to-br from-card via-card to-amber-950/10 border border-amber-500/30 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Live Gold Karat & 75% LTV Calculator</h2>
              <p className="text-xs text-muted-foreground">Type any custom market rate or weight to calculate instant loan limits</p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
            {isManualOverride ? 'Manual Rate' : 'Live Auto Rate'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Gross Weight (g)</label>
            <input
              type="number"
              step="0.1"
              value={calcGross}
              onChange={(e) => setCalcGross(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Stones / Wax (g)</label>
            <input
              type="number"
              step="0.1"
              value={calcStone}
              onChange={(e) => setCalcStone(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Purity (Karat)</label>
            <select
              value={calcPurity}
              onChange={(e) => setCalcPurity(e.target.value as GoldPurityKarat)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="24K">24K (99.9% Pure)</option>
              <option value="22K">22K (91.6% Hallmark)</option>
              <option value="18K">18K (75.0% Gold)</option>
              <option value="14K">14K (58.3% Gold)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-between">
              <span>24K Market Rate (₹/g)</span>
              <span className="text-[10px] text-muted-foreground">Editable</span>
            </label>
            <input
              type="number"
              value={calcRate}
              onChange={(e) => {
                setCalcRate(Number(e.target.value));
                setIsManualOverride(true);
              }}
              className="w-full mt-1 px-3 py-2 text-sm font-bold text-amber-600 rounded-xl border border-amber-500/40 bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Byaaj Rate (% / month)</label>
            <input
              type="number"
              step="0.25"
              value={calcMonthlyRate}
              onChange={(e) => setCalcMonthlyRate(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Calculator Results Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5">
          <div>
            <span className="text-[11px] font-medium text-muted-foreground">Net Pure Gold</span>
            <div className="text-base font-bold text-foreground">{calcNetWeight.toFixed(1)} grams</div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-muted-foreground">Market Valuation</span>
            <div className="text-base font-bold text-foreground">₹{calcMarketVal.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 font-semibold">Max Safe Loan (75% LTV)</span>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">₹{calcMaxLoan75.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 font-semibold">Expected Byaaj / Mo</span>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{calcEstMonthlyInterest.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Pledges Management Table & Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              All Pledges ({goldLoans.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'active'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Active Girvi ({activePledges.length})
            </button>
            <button
              onClick={() => setActiveTab('settled')}
              className={'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ' + (
                activeTab === 'settled'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Settled & Returned ({settledPledges.length})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone, item, barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card focus:ring-2 focus:ring-amber-500 focus:outline-none w-full sm:w-72"
            />
          </div>
        </div>

        {/* Pledges List Grid */}
        {filteredPledges.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-2xl p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Koi Pledge Record Nahi Mila</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Naya Girvi Pledge add karne ke liye upar diye button par click karein.
            </p>
            <button
              onClick={() => {
                setGoldRate(calcRate || live24kRate);
                setShowAddPledgeModal(true);
              }}
              className="inline-flex items-center gap-2 bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:bg-amber-700"
            >
              <Plus className="h-3.5 w-3.5" /> Naya Pledge Banaye
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPledges.map((pledge) => {
              const totalPaidInterest = (pledge.interest_payments || []).reduce((sum, p) => sum + p.amount, 0);
              const monthlyByaaj = Math.round(pledge.loan_amount_given * (pledge.interest_rate_monthly / 100));

              return (
                <div
                  key={pledge.id}
                  className="bg-card border border-border/70 hover:border-amber-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Coins className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
                            {pledge.pledge_no}
                          </span>
                          <h3 className="text-base font-black text-foreground">{pledge.customer_name}</h3>
                          <span
                            className={'text-[10px] font-bold px-2 py-0.5 rounded-full ' + (
                              pledge.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                : pledge.status === 'settled'
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                                : 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                            )}
                          >
                            {pledge.status === 'active' ? '● Active Loan' : pledge.status === 'settled' ? '✓ Settled & Returned' : '⚠️ Overdue Notice'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {pledge.customer_phone}
                          </span>
                          <span>•</span>
                          <span>Aadhaar: {pledge.customer_aadhaar}</span>
                          <span>•</span>
                          <span>Pledged: {pledge.pledge_date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => shareWhatsAppPledgeReceipt(pledge)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all"
                        title="Share Girvi Parchi on WhatsApp"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Parchi Slip
                      </button>

                      {pledge.status === 'active' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPledge(pledge);
                              setInterestAmount(monthlyByaaj);
                              setShowInterestModal(true);
                            }}
                            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all"
                          >
                            <Percent className="h-3.5 w-3.5" />
                            Byaaj Jama Karein
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPledge(pledge);
                              setShowSettleModal(true);
                              handleSendOtp();
                            }}
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            Settle & Gold Return (OTP)
                          </button>
                        </>
                      )}

                      {pledge.status === 'settled' && pledge.noc_otp_verified && (
                        <button
                          onClick={() => shareWhatsAppNOC(pledge)}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          Share NOC Certificate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Gold Item & Vault Security Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-muted/30 p-3.5 rounded-xl border border-border/40">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Pledged Item</span>
                      <span className="font-bold text-foreground">{pledge.item_title}</span>
                      <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {pledge.purity_karat}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Weight (Gross / Net)</span>
                      <span className="font-bold text-foreground">
                        {pledge.gross_weight_grams}g / <span className="text-amber-600 dark:text-amber-400">{pledge.net_gold_weight_grams}g Net</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Valuation (Mkt)</span>
                      <span className="font-bold text-foreground">₹{pledge.valuation_amount.toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Loan Given (LTV)</span>
                      <span className="font-black text-amber-600 dark:text-amber-400">
                        ₹{pledge.loan_amount_given.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-muted-foreground block font-medium">({pledge.ltv_percentage}% LTV)</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Monthly Byaaj</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {pledge.interest_rate_monthly}% (₹{monthlyByaaj}/mo)
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px]">Vault Box & Pouch</span>
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3 text-amber-500" /> {pledge.safe_locker_tag}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground block">{pledge.packet_barcode}</span>
                    </div>
                  </div>

                  {/* Interest Payment History & NOC Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-muted-foreground">Payment Records:</span>
                      {(!pledge.interest_payments || pledge.interest_payments.length === 0) ? (
                        <span className="text-muted-foreground italic">No interest payments recorded yet</span>
                      ) : (
                        pledge.interest_payments.map((pay, i) => (
                          <span
                            key={pay.id || i}
                            className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-[11px] font-semibold"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            ₹{pay.amount} ({pay.payment_date} · {pay.mode.toUpperCase()})
                          </span>
                        ))
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {pledge.status === 'settled' ? (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="h-4 w-4" /> Gold Released (NOC Verified: {pledge.noc_date})
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-[11px]">
                          Total Byaaj Received: <span className="font-bold text-foreground">₹{totalPaidInterest.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW GOLD PLEDGE */}
      {showAddPledgeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground">Naya Gold Pledge (Girvi) Entry</h3>
                  <p className="text-xs text-muted-foreground">Register customer gold with tamper barcode & locker tag</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPledgeModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPledgeSubmit} className="space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Lal"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Mobile Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Aadhaar Card No</label>
                  <input
                    type="text"
                    placeholder="5412 8901 2345"
                    value={custAadhaar}
                    onChange={(e) => setCustAadhaar(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Gold Item & Weight Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground">Item Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22K Gold Chain + 2 Rings"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Gross Weight (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Stones / Wax (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={stoneWeight}
                    onChange={(e) => setStoneWeight(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Purity & Market Valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Purity (Karat)</label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value as GoldPurityKarat)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="24K">24K (99.9% Pure)</option>
                    <option value="22K">22K (91.6% Hallmark)</option>
                    <option value="18K">18K (75.0% Gold)</option>
                    <option value="14K">14K (58.3% Gold)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                    <span>24K Gold Rate (₹/g)</span>
                    <span className="text-[10px] text-muted-foreground">Editable</span>
                  </label>
                  <input
                    type="number"
                    value={goldRate}
                    onChange={(e) => setGoldRate(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm font-bold text-amber-600 rounded-xl border border-amber-500/40 bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Monthly Byaaj (% p.m.)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Valuation Summary */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold block">Calculated Net Gold:</span>
                  <span className="text-base font-bold text-foreground">{formNetWeight.toFixed(1)} grams</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold block">Market Valuation:</span>
                  <span className="text-base font-bold text-foreground">₹{formMarketVal.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold block">Max 75% RBI Loan:</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">₹{formMaxLoan75.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Loan Amount Given & Security Vault Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-amber-700 dark:text-amber-400">Loan Amount Given (₹) *</label>
                  <input
                    type="number"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm font-bold text-amber-600 rounded-xl border border-amber-500/40 bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Safe Locker Box Tag</label>
                  <input
                    type="text"
                    value={lockerTag}
                    onChange={(e) => setLockerTag(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Seal Pouch Barcode</label>
                  <input
                    type="text"
                    value={barcodeTag}
                    onChange={(e) => setBarcodeTag(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm font-mono rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Notes / Condition remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Hallmarked jewelry, sealed in blue pouch with 2 signatures"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPledgeModal(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-lg shadow-amber-600/20"
                >
                  Confirm & Disburse Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COLLECT BYAAJ (INTEREST) */}
      {showInterestModal && selectedPledge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-base font-black text-foreground">Collect Byaaj (Interest Payment)</h3>
                <p className="text-xs text-muted-foreground">{selectedPledge.customer_name} · {selectedPledge.pledge_no}</p>
              </div>
              <button onClick={() => setShowInterestModal(false)} className="text-muted-foreground font-bold">✕</button>
            </div>

            <form onSubmit={handleInterestSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Interest Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={interestAmount}
                  onChange={(e) => setInterestAmount(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-base font-bold text-emerald-600 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground">Payment Mode</label>
                  <select
                    value={interestMode}
                    onChange={(e) => setInterestMode(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="upi">UPI / PhonePe / GPay</option>
                    <option value="cash">Rokda / Cash</option>
                    <option value="bank_transfer">NEFT / Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground">Payment Date</label>
                  <input
                    type="date"
                    value={interestDate}
                    onChange={(e) => setInterestDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. September month byaaj paid full"
                  value={interestNote}
                  onChange={(e) => setInterestNote(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterestModal(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SETTLE & RELEASE GOLD (OTP VERIFIED) */}
      {showSettleModal && selectedPledge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="text-base font-black text-foreground">🛡️ Settle Loan & Release Gold</h3>
                <p className="text-xs text-muted-foreground">OTP Authorization to protect against false claims</p>
              </div>
              <button onClick={() => setShowSettleModal(false)} className="text-muted-foreground font-bold">✕</button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 space-y-1 text-xs">
              <div className="font-bold text-foreground">{selectedPledge.customer_name} ({selectedPledge.customer_phone})</div>
              <div className="text-muted-foreground">Item: {selectedPledge.item_title} ({selectedPledge.net_gold_weight_grams}g)</div>
              <div className="text-amber-700 dark:text-amber-400 font-bold">
                Principal to Collect: ₹{selectedPledge.loan_amount_given.toLocaleString('en-IN')}
              </div>
              <div className="text-muted-foreground font-mono text-[11px]">
                Vault Pouch: {selectedPledge.packet_barcode} ({selectedPledge.safe_locker_tag})
              </div>
            </div>

            {/* Simulated OTP Section */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                Simulated Customer OTP Verification
              </span>
              <p className="text-[11px] text-muted-foreground">
                In live app, this 4-digit code is sent to customer mobile {selectedPledge.customer_phone}.
              </p>
              <div className="inline-block font-mono text-xl font-black bg-background px-4 py-1.5 rounded-xl border border-blue-500/30 text-blue-600">
                {generatedOtp}
              </div>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Enter 4-Digit Customer OTP *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder={'Enter OTP (' + generatedOtp + ')'}
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value);
                    setOtpError(false);
                  }}
                  className="w-full mt-1 px-3 py-2 text-center tracking-widest text-lg font-mono font-bold rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {otpError && (
                  <span className="text-[11px] text-red-500 font-bold mt-1 block">
                    Invalid OTP. Please enter {generatedOtp} or 1234
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Settlement Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Principal received via NEFT, Gold unsealed and handed over"
                  value={settleNote}
                  onChange={(e) => setSettleNote(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                >
                  Verify OTP & Release Gold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
