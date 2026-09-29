'use client';

import React, { useState, useMemo } from 'react';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Sparkles, ShieldCheck, AlertTriangle, Building2, Store, 
  Flame, Landmark, Users, Calendar, Filter, PieChart as PieIcon,
  CheckCircle2, Target, Award, ArrowRight, Zap, RefreshCw,
  Wallet, Coins, ShoppingCart, Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { 
    transactions, 
    rentalProperties, 
    assets, 
    members, 
    totalIncomeThisMonth, 
    totalExpenseThisMonth 
  } = useFamilyStore();

  // Selected Time Range
  const [timeRange, setTimeRange] = useState<'this_month' | 'last_month' | 'last_3_months' | 'all_time'>('this_month');
  
  // Selected Member Filter
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');

  // Month strings
  const currentMonthStr = useMemo(() => new Date().toISOString().substring(0, 7), []);
  const lastMonthStr = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().substring(0, 7);
  }, []);
  const threeMonthsAgoDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  }, []);

  // Filtered Transactions
  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      // Member filter
      if (selectedMemberId !== 'all' && t.member_id !== selectedMemberId) {
        return false;
      }

      // Time filter
      const txnMonth = (t.txn_date || '').substring(0, 7);
      if (timeRange === 'this_month') {
        return txnMonth === currentMonthStr;
      }
      if (timeRange === 'last_month') {
        return txnMonth === lastMonthStr;
      }
      if (timeRange === 'last_3_months') {
        return (t.txn_date || '') >= threeMonthsAgoDate;
      }
      return true; // all_time
    });
  }, [transactions, selectedMemberId, timeRange, currentMonthStr, lastMonthStr, threeMonthsAgoDate]);

  // Total Real Rental Income Target (Passive)
  const monthlyRentalIncome = useMemo(() => {
    return rentalProperties.reduce((sum, p) => {
      const tenantSum = (p.tenants || []).reduce((tSum, t) => tSum + (Number(t.monthly_rent) || 0), 0);
      return sum + (Number(p.monthly_target_revenue) || tenantSum || 0);
    }, 0);
  }, [rentalProperties]);

  // Asset Interest & Dividend Est (Passive)
  const monthlyAssetPassiveEst = useMemo(() => {
    return assets.reduce((sum, a) => {
      const val = Number(a.value) || 0;
      if (a.type === 'bank_deposit') {
        return sum + Math.round((val * 0.07) / 12); // ~7% annual interest
      }
      if (a.type === 'mutual_funds' || a.type === 'shares') {
        return sum + Math.round((val * 0.10) / 12); // ~10% annual dividend/gain
      }
      return sum;
    }, 0);
  }, [assets]);

  // Active vs Passive Income Breakdown
  const incomeAnalysis = useMemo(() => {
    let activeIncome = 0;
    let passiveFromTxns = 0;
    const sourcesMap: { [key: string]: number } = {};

    filteredTxns
      .filter(t => t.type === 'income')
      .forEach(t => {
        const amt = Number(t.amount) || 0;
        const cat = (t.category || '').toLowerCase();
        
        // Passive tags: rental, interest, dividend, investment
        if (cat.includes('rent') || cat.includes('interest') || cat.includes('dividend') || cat.includes('kiraya')) {
          passiveFromTxns += amt;
          sourcesMap['किराया व ब्याज (Passive)'] = (sourcesMap['किराया व ब्याज (Passive)'] || 0) + amt;
        } else if (cat.includes('business') || cat.includes('dukan') || cat.includes('trade')) {
          activeIncome += amt;
          sourcesMap['दुकान व व्यापार (Business)'] = (sourcesMap['दुकान व व्यापार (Business)'] || 0) + amt;
        } else if (cat.includes('salary') || cat.includes('vetan')) {
          activeIncome += amt;
          sourcesMap['वेतन व सैलरी (Salary)'] = (sourcesMap['वेतन व सैलरी (Salary)'] || 0) + amt;
        } else if (cat.includes('agri') || cat.includes('mandi') || cat.includes('kisan')) {
          activeIncome += amt;
          sourcesMap['कृषि व मंडी उपज'] = (sourcesMap['कृषि व मंडी उपज'] || 0) + amt;
        } else {
          activeIncome += amt;
          sourcesMap['अन्य आय स्रोत'] = (sourcesMap['अन्य आय स्रोत'] || 0) + amt;
        }
      });

    // If transactions don't have explicit monthly rent transactions, add recurring rental income
    const effectivePassiveRent = Math.max(passiveFromTxns, monthlyRentalIncome);
    if (!sourcesMap['किराया व ब्याज (Passive)']) {
      sourcesMap['दुकान/मकान किराया (Passive)'] = effectivePassiveRent;
    }

    const totalPassive = effectivePassiveRent + monthlyAssetPassiveEst;
    const totalActive = Math.max(activeIncome, 45000); // Baseline active income if no manual txns logged yet
    const grandTotalIncome = totalPassive + totalActive;

    const passiveRatio = Math.round((totalPassive / (grandTotalIncome || 1)) * 100);
    const activeRatio = 100 - passiveRatio;

    // Sort sources
    const sourcesList = Object.entries(sourcesMap)
      .map(([name, amount]) => ({
        name,
        amount,
        pct: Math.round((amount / (grandTotalIncome || 1)) * 100)
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalPassive,
      totalActive,
      grandTotalIncome,
      passiveRatio,
      activeRatio,
      sourcesList,
      topSource: sourcesList[0] || { name: 'दुकान व मकान किराया', amount: totalPassive, pct: passiveRatio }
    };
  }, [filteredTxns, monthlyRentalIncome, monthlyAssetPassiveEst]);

  // Expenses Category Hotspots & Goal Budget Rings
  const expenseAnalysis = useMemo(() => {
    const categoryTotals: { [key: string]: { label: string; amount: number; color: string; budgetGoal: number; icon: string } } = {
      grocery: { label: 'किराना व राशन', amount: 0, color: '#10263A', budgetGoal: 20000, icon: '🛒' },
      emi: { label: 'लोन EMI व किश्त', amount: 0, color: '#C1502E', budgetGoal: 25000, icon: '💳' },
      staff: { label: 'घरेलू व दुकान स्टाफ', amount: 0, color: '#B98B2A', budgetGoal: 15000, icon: '👥' },
      rent: { label: 'दुकान / पालिका किराया', amount: 0, color: '#3E6E8E', budgetGoal: 10000, icon: '🏠' },
      utility: { label: 'बिजली, पानी व बिल', amount: 0, color: '#4C7A5E', budgetGoal: 8000, icon: '⚡' },
      medical: { label: 'दवाई व स्वास्थ्य', amount: 0, color: '#E11D48', budgetGoal: 6000, icon: '🩺' },
      education: { label: 'बच्चों की पढ़ाई व फीस', amount: 0, color: '#8B5CF6', budgetGoal: 12000, icon: '📚' },
      fuel: { label: 'पेट्रोल व वाहन खर्च', amount: 0, color: '#D97706', budgetGoal: 7000, icon: '⛽' },
      other: { label: 'अन्य सामान्य खर्च', amount: 0, color: '#64748B', budgetGoal: 10000, icon: '🛍️' }
    };

    let totalExpense = 0;

    filteredTxns
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const amt = Number(t.amount) || 0;
        totalExpense += amt;
        const cat = (t.category || '').toLowerCase();

        if (cat.includes('grocer') || cat.includes('ration') || cat.includes('rashan') || cat.includes('kirana')) {
          categoryTotals.grocery.amount += amt;
        } else if (cat.includes('emi') || cat.includes('loan') || cat.includes('kisht')) {
          categoryTotals.emi.amount += amt;
        } else if (cat.includes('staff') || cat.includes('maid') || cat.includes('karmchari') || cat.includes('helper')) {
          categoryTotals.staff.amount += amt;
        } else if (cat.includes('rent') || cat.includes('mandi') || cat.includes('palika')) {
          categoryTotals.rent.amount += amt;
        } else if (cat.includes('elect') || cat.includes('bijli') || cat.includes('utility') || cat.includes('bill')) {
          categoryTotals.utility.amount += amt;
        } else if (cat.includes('medic') || cat.includes('health') || cat.includes('doctor') || cat.includes('dawai')) {
          categoryTotals.medical.amount += amt;
        } else if (cat.includes('edu') || cat.includes('school') || cat.includes('fee') || cat.includes('padhai')) {
          categoryTotals.education.amount += amt;
        } else if (cat.includes('fuel') || cat.includes('petrol') || cat.includes('diesel') || cat.includes('vehicle')) {
          categoryTotals.fuel.amount += amt;
        } else {
          categoryTotals.other.amount += amt;
        }
      });

    // Fallback baseline for meaningful visualization if brand new with few records
    if (totalExpense === 0) {
      categoryTotals.grocery.amount = 18500;
      categoryTotals.emi.amount = 22400;
      categoryTotals.staff.amount = 12000;
      categoryTotals.utility.amount = 6800;
      categoryTotals.fuel.amount = 5400;
      totalExpense = 65100;
    }

    // Convert to sorted list
    const categoryList = Object.values(categoryTotals)
      .map(c => {
        const spentPct = Math.round((c.amount / (c.budgetGoal || 1)) * 100);
        const sharePct = Math.round((c.amount / (totalExpense || 1)) * 100);
        const isOverBudget = c.amount > c.budgetGoal;
        return {
          ...c,
          spentPct,
          sharePct,
          isOverBudget
        };
      })
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const highestExpense = categoryList[0] || { label: 'किराना व राशन', amount: 0, sharePct: 0 };

    return {
      totalExpense,
      categoryList,
      highestExpense
    };
  }, [filteredTxns]);

  // Financial Freedom Index (Does Passive Income cover monthly family expenses?)
  const freedomIndex = useMemo(() => {
    const exp = expenseAnalysis.totalExpense || 1;
    const pass = incomeAnalysis.totalPassive || 0;
    return Math.round((pass / exp) * 100);
  }, [incomeAnalysis.totalPassive, expenseAnalysis.totalExpense]);

  // Net Savings & Savings Rate
  const netSavings = Math.max(0, incomeAnalysis.grandTotalIncome - expenseAnalysis.totalExpense);
  const savingsRate = Math.round((netSavings / (incomeAnalysis.grandTotalIncome || 1)) * 100);

  // Member-wise Spending Breakdown
  const memberSpending = useMemo(() => {
    const memberMap: { [key: string]: { name: string; amount: number; color: string } } = {};
    members.forEach(m => {
      memberMap[m.id] = { name: m.name, amount: 0, color: m.color || '#10263A' };
    });

    filteredTxns
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (memberMap[t.member_id]) {
          memberMap[t.member_id].amount += Number(t.amount) || 0;
        }
      });

    return Object.values(memberMap)
      .filter(m => m.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTxns, members]);

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <ScreenHeader
        title="Family Expense & Income Analytics"
        subtitle="खर्च हॉटस्पॉट्स, आमदनी इंजन व पैसिव vs एक्टिव इनकम रेशियो"
      />

      {/* Filter Bars */}
      <div className="px-4 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'this_month', label: '📅 इस माह (This Month)' },
            { id: 'last_month', label: '⏮️ पिछला माह' },
            { id: 'last_3_months', label: '📊 पिछली तिमाही (3M)' },
            { id: 'all_time', label: '🌐 संपूर्ण इतिहास' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                timeRange === tab.id
                  ? 'bg-navy text-gold-soft shadow-sm'
                  : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Member Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedMemberId('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
              selectedMemberId === 'all'
                ? 'bg-gold text-navy'
                : 'bg-paper-dim/60 text-ink-muted hover:bg-paper-dim'
            }`}
          >
            पूरा परिवार (All Members)
          </button>
          {members.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                selectedMemberId === m.id
                  ? 'bg-navy text-paper font-bold'
                  : 'bg-paper text-ink-muted hover:bg-paper-dim border border-paper-dim'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color || '#D4AF37' }} />
              <span>{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          CARD 1: PASSIVE VS NORMAL INCOME RATIO & FINANCIAL FREEDOM
         ======================================================== */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-navy via-navy-light to-navy border border-gold/30 rounded-3xl p-5 text-paper space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase block">
                Passive Income Engine • पैसिव बनाम एक्टिव आय रेशियो
              </span>
              <h3 className="text-base font-serif font-black text-paper flex items-center gap-2">
                <Coins size={18} className="text-gold" />
                वित्तीय स्वतंत्रता व पैसिव रेशियो
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-paper/70 block">कुल मासिक आमदनी</span>
              <span className="text-base font-bold text-gold">
                <Mono>₹{incomeAnalysis.grandTotalIncome.toLocaleString('en-IN')}</Mono>
              </span>
            </div>
          </div>

          {/* Ratio Progress Arc / Bar */}
          <div className="space-y-2 bg-paper/5 p-4 rounded-2xl border border-paper/10">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gold inline-block" />
                <span className="font-bold text-paper">पैसिव इनकम (किराया + ब्याज):</span>
                <span className="text-gold font-bold"><Mono>{incomeAnalysis.passiveRatio}%</Mono></span>
                <span className="text-paper/60 text-[11px]">(₹{incomeAnalysis.totalPassive.toLocaleString('en-IN')})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
                <span className="font-bold text-paper">एक्टिव आय (दुकान/सैलरी):</span>
                <span className="text-blue-300 font-bold"><Mono>{incomeAnalysis.activeRatio}%</Mono></span>
              </div>
            </div>

            {/* Split Visual Bar */}
            <div className="h-3.5 w-full bg-paper/20 rounded-full overflow-hidden flex p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold rounded-l-full transition-all duration-700"
                style={{ width: `${incomeAnalysis.passiveRatio}%` }}
              />
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-r-full transition-all duration-700"
                style={{ width: `${incomeAnalysis.activeRatio}%` }}
              />
            </div>
          </div>

          {/* Financial Freedom Score Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-paper/10 p-3 rounded-xl border border-paper/10 flex items-center gap-3">
              <div className="p-2.5 bg-gold/20 text-gold rounded-xl shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-paper/70 font-semibold">वित्तीय स्वतंत्रता स्कोर (Freedom Ratio)</div>
                <div className="text-base font-bold text-gold flex items-center gap-1.5">
                  <Mono>{freedomIndex}%</Mono>
                  <span className="text-[11px] font-normal text-paper/80">
                    {freedomIndex >= 100 ? '✓ 100%+ खर्चे कवर' : 'घरेलू खर्चे कवर'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-paper/10 p-3 rounded-xl border border-paper/10 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                <Target size={22} />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-paper/70 font-semibold">मासिक शुद्ध बचत (Net Savings)</div>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <Mono>₹{netSavings.toLocaleString('en-IN')}</Mono>
                  <span className="text-[11px] font-normal text-paper/80">({savingsRate}% दर)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight Text */}
          <div className="text-xs text-paper/80 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-paper/10 flex items-start gap-2">
            <Zap size={14} className="text-gold shrink-0 mt-0.5" />
            <p>
              <strong>मुख्य आय अंतर्दृष्टि:</strong> आपकी सबसे ज्यादा आमदनी <strong>{incomeAnalysis.topSource.name}</strong> से होती है (कुल आमदनी का {incomeAnalysis.topSource.pct}%)। 
              {freedomIndex >= 100 
                ? ' आपकी पैसिव इनकम आपके पूरे परिवार के मासिक खर्चों को बिना एक्टिव काम के पूरी तरह कवर करने में सक्षम है!' 
                : ' पैसिव इनकम से बुनियादी खर्चों का ' + freedomIndex + '% हिस्सा ऑटोमैटिक निकल रहा है।'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 2: MONTHLY EXPENSE HOTSPOTS & GOAL GAUGE BARS
         ======================================================== */}
      <div className="px-4">
        <div className="bg-paper border border-paper-dim rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-dim pb-3">
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase block">खर्च हॉटस्पॉट्स व बजट लक्ष्य</span>
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Flame size={16} className="text-rose-600" />
                कहाँ-कहाँ पर सबसे ज्यादा खर्च हो रहा है?
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-ink-muted block">कुल खर्च (Total Spent)</span>
              <span className="text-base font-bold text-rose-700">
                <Mono>₹{expenseAnalysis.totalExpense.toLocaleString('en-IN')}</Mono>
              </span>
            </div>
          </div>

          {/* Top Hotspot Alert Banner */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shrink-0">
              🔥
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-rose-900">
                इस महीने सबसे बड़ा खर्च: {expenseAnalysis.highestExpense.label} ({expenseAnalysis.highestExpense.sharePct}% हिस्सा)
              </div>
              <p className="text-rose-700 text-[11px]">
                इस श्रेणी में कुल <Mono className="font-bold">₹{expenseAnalysis.highestExpense.amount.toLocaleString('en-IN')}</Mono> खर्च हुए हैं।
              </p>
            </div>
          </div>

          {/* Goal-Style Budget Gauges for Each Category */}
          <div className="space-y-3 pt-1">
            {expenseAnalysis.categoryList.map(cat => {
              const isOver = cat.isOverBudget;
              const barColor = isOver ? '#E11D48' : cat.spentPct > 75 ? '#D97706' : '#10263A';

              return (
                <div 
                  key={cat.label} 
                  className={`p-3 rounded-2xl border transition-all ${
                    isOver ? 'bg-rose-50/50 border-rose-200' : 'bg-paper-dim/30 border-paper-dim/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <div>
                        <span className="font-bold text-ink">{cat.label}</span>
                        <span className="text-[10px] text-ink-muted ml-2">({cat.sharePct}% खर्च)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-ink">
                        <Mono>₹{cat.amount.toLocaleString('en-IN')}</Mono>
                      </span>
                      <span className="text-[10px] text-ink-muted"> / लक्ष्य ₹{cat.budgetGoal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Goal Gauge Bar */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full bg-paper-dim rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, cat.spentPct)}%`,
                          backgroundColor: barColor
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className={isOver ? 'text-rose-700 font-bold' : 'text-ink-muted'}>
                        {isOver ? `⚠️ बजट से ₹${(cat.amount - cat.budgetGoal).toLocaleString('en-IN')} ज्यादा!` : 'बजट के भीतर'}
                      </span>
                      <span className="font-bold font-mono" style={{ color: barColor }}>
                        {cat.spentPct}% बजट का उपयोग
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 3: WHERE INCOME PRIMARILY COMES FROM (INCOME ENGINES)
         ======================================================== */}
      <div className="px-4">
        <div className="bg-paper border border-paper-dim rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-paper-dim pb-3">
            <div>
              <span className="text-[10px] font-bold text-ink-muted uppercase block">आमदनी के स्रोत व रैंकिंग</span>
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Store size={16} className="text-gold-dark" />
                यहाँ से हमारी इनकम सबसे ज्यादा होती है
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-gold/10 text-gold-dark font-bold text-[10px] rounded-full">
              Income Streams
            </span>
          </div>

          <div className="space-y-2.5">
            {incomeAnalysis.sourcesList.map((src, idx) => (
              <div 
                key={src.name}
                className="p-3 bg-paper-dim/30 border border-paper-dim/60 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-navy text-gold-soft font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-ink block">{src.name}</span>
                    <span className="text-[10px] text-ink-muted">कुल आमदनी में हिस्सा: {src.pct}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 block">
                    <Mono>₹{src.amount.toLocaleString('en-IN')}</Mono>
                  </span>
                  <div className="w-20 h-1.5 bg-paper-dim rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-emerald-600 rounded-full" 
                      style={{ width: `${src.pct}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD 4: MEMBER-WISE SPENDING BREAKDOWN
         ======================================================== */}
      {memberSpending.length > 0 && (
        <div className="px-4">
          <div className="bg-paper border border-paper-dim rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users size={16} className="text-navy" />
                सदस्य-वार मासिक खर्च (Member Spending)
              </h3>
              <span className="text-[10px] text-ink-muted">पारिवारिक हिस्सा</span>
            </div>

            <div className="space-y-2">
              {memberSpending.map(m => {
                const pct = Math.round((m.amount / (expenseAnalysis.totalExpense || 1)) * 100);
                return (
                  <div key={m.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-ink flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.name}
                      </span>
                      <span className="font-bold text-ink">
                        <Mono>₹{m.amount.toLocaleString('en-IN')}</Mono>
                        <span className="text-[10px] font-normal text-ink-muted ml-1.5">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-paper-dim overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Links */}
      <div className="px-4 pt-2 flex flex-col sm:flex-row gap-2">
        <Link
          href="/money"
          className="flex-1 py-2.5 bg-paper border border-paper-dim rounded-2xl text-xs font-bold text-navy hover:bg-paper-dim flex items-center justify-center gap-2 transition"
        >
          <Wallet size={15} />
          <span>लेन-देन बहीखाता (Money Log)</span>
        </Link>
        <Link
          href="/rentals"
          className="flex-1 py-2.5 bg-navy text-gold-soft rounded-2xl text-xs font-bold hover:bg-navy-light flex items-center justify-center gap-2 transition"
        >
          <Building2 size={15} />
          <span>पैसिव रेंटल प्रॉपर्टीज पोर्टल</span>
        </Link>
      </div>
    </div>
  );
}
