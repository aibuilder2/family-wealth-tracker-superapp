'use client';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import {
  Trip, TripMember, TripExpense, TripPoolContribution,
  TripType, TripExpenseType, TripExpenseCategory
} from '@/types';
import {
  Compass, Plus, Users, Wallet, CreditCard, ArrowRightLeft,
  Share2, CheckCircle2, DollarSign, Calendar, MapPin,
  Palmtree, AlertCircle, Trash2, ArrowUpRight, ArrowDownLeft,
  Receipt, ShoppingBag, Utensils, Hotel, Car, Plane, Info, Phone
} from 'lucide-react';

export default function TripsPage() {
  const {
    trips,
    members: familyMembers,
    addTrip,
    updateTrip,
    deleteTrip,
    addTripMember,
    removeTripMember,
    addTripPoolContribution,
    addTripExpense,
    deleteTripExpense
  } = useFamilyStore();

  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'expenses' | 'settlement' | 'pool' | 'members'>('settlement');

  // Modals
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddPoolOpen, setIsAddPoolOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New Trip Form State
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDestination, setNewTripDestination] = useState('');
  const [newTripStartDate, setNewTripStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTripEndDate, setNewTripEndDate] = useState(new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]);
  const [newTripType, setNewTripType] = useState<TripType>('family_vacation');
  const [newTripBudget, setNewTripBudget] = useState<number>(50000);
  const [newTripNotes, setNewTripNotes] = useState('');

  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseCategory, setExpenseCategory] = useState<TripExpenseCategory>('food_restaurant');
  const [expenseType, setExpenseType] = useState<TripExpenseType>('group_split');
  const [expensePaidBy, setExpensePaidBy] = useState<string>('');
  const [expenseSplitAmong, setExpenseSplitAmong] = useState<string[]>([]);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');
  const [syncToFamilyLedger, setSyncToFamilyLedger] = useState(true);

  // New Pool Contribution State
  const [poolMemberId, setPoolMemberId] = useState('');
  const [poolAmount, setPoolAmount] = useState<number | ''>('');
  const [poolMode, setPoolMode] = useState<'upi' | 'cash' | 'bank_transfer'>('upi');
  const [poolDate, setPoolDate] = useState(new Date().toISOString().split('T')[0]);
  const [poolNotes, setPoolNotes] = useState('');

  // New Member State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [isFamilyBadge, setIsFamilyBadge] = useState(false);

  // Active Trip resolution
  const activeTrip = useMemo(() => {
    if (!trips.length) return null;
    const found = trips.find(t => t.id === selectedTripId);
    return found || trips[0];
  }, [trips, selectedTripId]);

  // Calculations
  const tripMetrics = useMemo(() => {
    if (!activeTrip) {
      return {
        totalExpenses: 0,
        groupExpenses: 0,
        personalExpenses: 0,
        totalPoolCollected: 0,
        poolRemaining: 0,
        budgetRemaining: 0,
        budgetPct: 0
      };
    }

    const expenses = activeTrip.expenses || [];
    const pool = activeTrip.pool_contributions || [];

    const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const groupExpenses = expenses
      .filter(e => e.expense_type === 'group_split')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const personalExpenses = expenses
      .filter(e => e.expense_type === 'personal_individual')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    
    const totalPoolCollected = pool.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const poolRemaining = Math.max(0, totalPoolCollected - groupExpenses);
    
    const budget = activeTrip.budget_target || 0;
    const budgetRemaining = budget > 0 ? budget - totalExpenses : 0;
    const budgetPct = budget > 0 ? Math.min(100, Math.round((totalExpenses / budget) * 100)) : 0;

    return {
      totalExpenses,
      groupExpenses,
      personalExpenses,
      totalPoolCollected,
      poolRemaining,
      budgetRemaining,
      budgetPct
    };
  }, [activeTrip]);

  // Member Balance & Settlement Algorithm
  const memberBalances = useMemo(() => {
    if (!activeTrip || !activeTrip.members?.length) return [];

    const members = activeTrip.members;
    const expenses = activeTrip.expenses || [];
    const pool = activeTrip.pool_contributions || [];

    return members.map(member => {
      // 1. Total paid out of pocket for any expense
      const paidExpenses = expenses
        .filter(e => e.paid_by_member_id === member.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      // 2. Total contributed to common pool
      const poolContributed = pool
        .filter(p => p.member_id === member.id)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      // 3. Share of group split expenses
      let shareOfGroupExpenses = 0;
      expenses
        .filter(e => e.expense_type === 'group_split')
        .forEach(e => {
          const splitList = e.split_among_member_ids?.length ? e.split_among_member_ids : members.map(m => m.id);
          if (splitList.includes(member.id)) {
            shareOfGroupExpenses += Number(e.amount) / splitList.length;
          }
        });

      // 4. Personal individual expenses of this member
      const personalExpenses = expenses
        .filter(e => e.expense_type === 'personal_individual' && e.paid_by_member_id === member.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      // Total paid by member = Expenses paid + Pool deposits
      const totalPaid = paidExpenses + poolContributed;
      
      // Total fair obligation = Share of group expenses + Personal expenses
      const totalObligation = shareOfGroupExpenses + personalExpenses;

      // Net Balance = (Total Paid) - (Total Obligation)
      // Positive (+) => Member should RECEIVE money (Lene hain)
      // Negative (-) => Member OWES money (Dene hain)
      const netBalance = Math.round(totalPaid - totalObligation);

      return {
        member,
        paidExpenses,
        poolContributed,
        totalPaid,
        shareOfGroupExpenses: Math.round(shareOfGroupExpenses),
        personalExpenses,
        totalObligation: Math.round(totalObligation),
        netBalance
      };
    });
  }, [activeTrip]);

  // Debt Simplification Matrix ("Who owes whom")
  const settlements = useMemo(() => {
    if (!memberBalances.length) return [];

    // Separate into debtors (owes money / negative) and creditors (gets money / positive)
    const debtors = memberBalances
      .filter(m => m.netBalance < -1)
      .map(m => ({ ...m, remaining: Math.abs(m.netBalance) }))
      .sort((a, b) => b.remaining - a.remaining);

    const creditors = memberBalances
      .filter(m => m.netBalance > 1)
      .map(m => ({ ...m, remaining: m.netBalance }))
      .sort((a, b) => b.remaining - a.remaining);

    const result: Array<{
      fromName: string;
      fromPhone?: string;
      toName: string;
      toPhone?: string;
      amount: number;
    }> = [];

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const settleAmount = Math.min(debtor.remaining, creditor.remaining);

      if (settleAmount > 1) {
        result.push({
          fromName: debtor.member.name,
          fromPhone: debtor.member.phone,
          toName: creditor.member.name,
          toPhone: creditor.member.phone,
          amount: Math.round(settleAmount)
        });
      }

      debtor.remaining -= settleAmount;
      creditor.remaining -= settleAmount;

      if (debtor.remaining <= 1) dIdx++;
      if (creditor.remaining <= 1) cIdx++;
    }

    return result;
  }, [memberBalances]);

  // Generate WhatsApp Message
  const generateWhatsAppSummary = () => {
    if (!activeTrip) return '';

    let text = `🏖️ *${activeTrip.title.toUpperCase()}* - HISAB-KITAB SUMMARY\n`;
    text += `📍 Destination: ${activeTrip.destination}\n`;
    text += `📅 Dates: ${activeTrip.start_date} se ${activeTrip.end_date}\n`;
    text += `💰 Total Trip Kharcha: ₹${tripMetrics.totalExpenses.toLocaleString('en-IN')}\n`;
    text += `👥 Milkar Group Kharcha: ₹${tripMetrics.groupExpenses.toLocaleString('en-IN')}\n`;
    if (tripMetrics.personalExpenses > 0) {
      text += `🛍️ Niji (Personal) Kharcha: ₹${tripMetrics.personalExpenses.toLocaleString('en-IN')}\n`;
    }
    if (tripMetrics.totalPoolCollected > 0) {
      text += `🏦 Advance Pool Jama: ₹${tripMetrics.totalPoolCollected.toLocaleString('en-IN')}\n`;
    }
    text += `\n---------------------------------\n`;
    text += `📊 *MEMBER-WISE BREAKDOWN:*\n`;

    memberBalances.forEach(mb => {
      text += `• *${mb.member.name}*:\n`;
      text += `   - Diye (Paid): ₹${mb.totalPaid.toLocaleString('en-IN')} (Expenses: ₹${mb.paidExpenses} + Pool: ₹${mb.poolContributed})\n`;
      text += `   - Banega Hisab (Share): ₹${mb.totalObligation.toLocaleString('en-IN')}\n`;
      if (mb.netBalance > 0) {
        text += `   👉 *Lene Hain (To Receive): +₹${mb.netBalance.toLocaleString('en-IN')}*\n`;
      } else if (mb.netBalance < 0) {
        text += `   👉 *Dene Hain (To Pay): -₹${Math.abs(mb.netBalance).toLocaleString('en-IN')}*\n`;
      } else {
        text += `   👉 *Hisab Barabar (Settled)*\n`;
      }
    });

    text += `\n---------------------------------\n`;
    text += `🤝 *SETTLEMENT MATRIX (Kisne Kisko Dena Hai):*\n`;

    if (settlements.length === 0) {
      text += `Sabka hisab barabar hai! Koi len-den baki nahi hai.\n`;
    } else {
      settlements.forEach((s, idx) => {
        text += `${idx + 1}. *${s.fromName}* ➡️ *${s.toName}*: ₹${s.amount.toLocaleString('en-IN')}\n`;
      });
    }

    text += `\n_Generated via Parivar SuperApp Holiday Splitter_ ✨`;
    return text;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppSummary();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppSummary());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Handlers
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;

    // Default initial members: Add family members or Mukhiya
    const initialMembers: TripMember[] = familyMembers.map(m => ({
      id: 'tm-' + m.id,
      name: m.name,
      phone: m.phone || '',
      is_family_member: true
    }));

    addTrip({
      title: newTripTitle,
      destination: newTripDestination || 'India Tour',
      start_date: newTripStartDate,
      end_date: newTripEndDate,
      trip_type: newTripType,
      budget_target: Number(newTripBudget) || 0,
      status: 'ongoing',
      members: initialMembers.length ? initialMembers : [{ id: 'tm-1', name: 'Self / Mukhiya', is_family_member: true }],
      notes: newTripNotes
    });

    setIsAddTripOpen(false);
    setNewTripTitle('');
    setNewTripDestination('');
    setNewTripNotes('');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !expenseTitle.trim() || !expenseAmount) return;

    const payer = activeTrip.members.find(m => m.id === expensePaidBy) || activeTrip.members[0];
    const splitList = expenseType === 'group_split'
      ? (expenseSplitAmong.length ? expenseSplitAmong : activeTrip.members.map(m => m.id))
      : [payer.id];

    addTripExpense(
      activeTrip.id,
      {
        title: expenseTitle,
        amount: Number(expenseAmount),
        category: expenseCategory,
        expense_type: expenseType,
        paid_by_member_id: payer.id,
        paid_by_name: payer.name,
        split_among_member_ids: splitList,
        date: expenseDate,
        notes: expenseNotes
      },
      syncToFamilyLedger
    );

    setIsAddExpenseOpen(false);
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNotes('');
  };

  const handleAddPoolDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !poolAmount || !poolMemberId) return;

    const member = activeTrip.members.find(m => m.id === poolMemberId);
    if (!member) return;

    addTripPoolContribution(activeTrip.id, {
      member_id: member.id,
      member_name: member.name,
      amount: Number(poolAmount),
      date: poolDate,
      payment_mode: poolMode,
      notes: poolNotes
    });

    setIsAddPoolOpen(false);
    setPoolAmount('');
    setPoolNotes('');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip || !newMemberName.trim()) return;

    addTripMember(activeTrip.id, {
      name: newMemberName.trim(),
      phone: newMemberPhone.trim() || undefined,
      is_family_member: isFamilyBadge
    });

    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberPhone('');
  };

  const getCategoryIcon = (category: TripExpenseCategory) => {
    switch (category) {
      case 'hotel_stay': return <Hotel className="w-4 h-4 text-purple-400" />;
      case 'flight_train_bus': return <Plane className="w-4 h-4 text-blue-400" />;
      case 'taxi_fuel_toll': return <Car className="w-4 h-4 text-amber-400" />;
      case 'food_restaurant': return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'shopping_personal': return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      default: return <Receipt className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Holiday & Vacation Expense Splitter</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              🏖️ Parivar & Friends Trip Hisab
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Advance common pool funds, milkar group kharcha, personal niji kharcha aur WhatsApp settlement slips—sab ek jagah.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Naya Trip Banayein
            </button>
          </div>
        </div>

        {/* Trips Switcher Bar */}
        {trips.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Aapke Trips:</span>
            {trips.map(t => {
              const isSelected = activeTrip?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTripId(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{t.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">({t.destination})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!activeTrip ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Palmtree className="w-16 h-16 text-blue-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">Koi Trip Active Nahi Hai</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Aapne abhi tak koi holiday ya tour add nahi kiya hai. Apne pehle trip ka budget aur hisab shuru karein!
          </p>
          <button
            onClick={() => setIsAddTripOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Pehla Trip Banayein
          </button>
        </div>
      ) : (
        <>
          {/* Trip KPI Snapshot Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Total Spend */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Kul Kharcha (Total Spend)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{tripMetrics.totalExpenses.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">₹{tripMetrics.groupExpenses.toLocaleString('en-IN')}</span> Group +
                <span className="text-pink-400 font-bold">₹{tripMetrics.personalExpenses.toLocaleString('en-IN')}</span> Niji
              </div>
            </div>

            {/* 2. Advance Pool Fund */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Advance Pool Jama</span>
                <Wallet className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-400">
                ₹{tripMetrics.totalPoolCollected.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {activeTrip.pool_contributions?.length || 0} Pool Jama entries
              </div>
            </div>

            {/* 3. Budget Target */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Trip Budget Target</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                ₹{activeTrip.budget_target ? activeTrip.budget_target.toLocaleString('en-IN') : 'N/A'}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {activeTrip.budget_target ? `${tripMetrics.budgetPct}% kharch hua` : 'Budget set nahi hai'}
              </div>
            </div>

            {/* 4. Travelers / Members */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>Yatri (Members)</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {activeTrip.members?.length || 0} Log
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {activeTrip.destination} ({activeTrip.start_date.slice(5)} to {activeTrip.end_date.slice(5)})
              </div>
            </div>
          </div>

          {/* Action Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('settlement')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'settlement'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Hisab & Settlements</span>
              </button>

              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'expenses'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Kharcha Suchi ({activeTrip.expenses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('pool')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'pool'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Advance Pool ({activeTrip.pool_contributions?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'members'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Yatri Log ({activeTrip.members?.length || 0})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Kharcha Likhein
              </button>
              <button
                onClick={() => setIsAddPoolOpen(true)}
                className="px-3.5 py-2 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Pool Jama
              </button>
            </div>
          </div>

          {/* TAB 1: SETTLEMENT & MEMBER BALANCES */}
          {activeTab === 'settlement' && (
            <div className="space-y-6">
              {/* WhatsApp Share Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-900/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Share2 className="w-4 h-4" /> 1-Click WhatsApp Trip Settlement Slip
                  </div>
                  <p className="text-xs text-slate-400">
                    Pure trip ka member-wise hisab aur "Kisne kisko kitna dena hai" WhatsApp group par bhejne ke liye taiyar hai.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleCopyWhatsApp}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                  >
                    {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Receipt className="w-4 h-4" />}
                    <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> WhatsApp Send Karein
                  </button>
                </div>
              </div>

              {/* Simplified Debt Resolution ("Kisne Kisko Dena Hai") */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                  Direct Settlement Matrix (Kisne Kisko Kitna Dena Hai)
                </h3>

                {settlements.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm bg-slate-800/40 rounded-xl">
                    🎉 Sabka hisab barabar hai! Koi len-den baki nahi hai.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {settlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-slate-600 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="text-xs text-rose-400 font-bold flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" /> {s.fromName} dega
                          </div>
                          <div className="text-sm font-semibold text-slate-200">
                            ➡️ <span className="text-emerald-400">{s.toName}</span> ko
                          </div>
                          {s.toPhone && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Phone/UPI: {s.toPhone}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-black text-amber-400">
                            ₹{s.amount.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Due
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Member-by-Member Detailed Balance Cards */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Har Member Ka Detailed Trip Hisab
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memberBalances.map((mb) => {
                    const isPositive = mb.netBalance > 0;
                    const isZero = mb.netBalance === 0;

                    return (
                      <div
                        key={mb.member.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              {mb.member.name}
                              {mb.member.is_family_member && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                                  Family
                                </span>
                              )}
                            </h4>
                            {mb.member.phone && (
                              <p className="text-xs text-slate-400 font-mono mt-0.5">{mb.member.phone}</p>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Balance</span>
                            <span className={`text-base sm:text-lg font-black ${
                              isZero ? 'text-slate-400' : isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {isZero ? '₹0 (Clear)' : isPositive ? `+₹${mb.netBalance.toLocaleString('en-IN')}` : `-₹${Math.abs(mb.netBalance).toLocaleString('en-IN')}`}
                            </span>
                          </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/50 p-3 rounded-xl">
                          <div>
                            <span className="text-slate-400 block">Kharch Kiya (Paid):</span>
                            <span className="font-bold text-slate-200">₹{mb.totalPaid.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-400 block">
                              (Exp: ₹{mb.paidExpenses} | Pool: ₹{mb.poolContributed})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Inka Hisab (Share):</span>
                            <span className="font-bold text-slate-200">₹{mb.totalObligation.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-400 block">
                              (Group: ₹{mb.shareOfGroupExpenses} | Niji: ₹{mb.personalExpenses})
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="text-xs">
                          {isPositive && (
                            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                              <span>Inhe doosron se <strong>₹{mb.netBalance.toLocaleString('en-IN')}</strong> wapas lene hain.</span>
                            </div>
                          )}
                          {!isPositive && !isZero && (
                            <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                              <span>Inhe group me <strong>₹{Math.abs(mb.netBalance).toLocaleString('en-IN')}</strong> jama karne hain.</span>
                            </div>
                          )}
                          {isZero && (
                            <div className="p-2.5 bg-slate-800/40 border border-slate-700/40 rounded-xl text-slate-400 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-400" />
                              <span>Hisab poori tarah barabar hai.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPENSES LOG */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  Trip Kharcha Suchi ({activeTrip.expenses?.length || 0} Entries)
                </h3>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Naya Kharcha Likhein
                </button>
              </div>

              {(!activeTrip.expenses || activeTrip.expenses.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Receipt className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak koi kharcha darj nahi kiya gaya hai.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeTrip.expenses.map((exp) => {
                    const isGroup = exp.expense_type === 'group_split';
                    return (
                      <div
                        key={exp.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 mt-0.5">
                            {getCategoryIcon(exp.category)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                isGroup
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              }`}>
                                {isGroup ? '👥 Group Split' : '🛍️ Personal Niji'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Paid by <strong className="text-slate-200">{exp.paid_by_name}</strong> · {exp.date}
                            </p>
                            {exp.notes && (
                              <p className="text-[11px] text-slate-500 italic">{exp.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                          <div className="text-left sm:text-right">
                            <div className="text-base sm:text-lg font-black text-white">
                              ₹{Number(exp.amount).toLocaleString('en-IN')}
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              {isGroup
                                ? `Split among ${exp.split_among_member_ids?.length || activeTrip.members.length} members`
                                : 'Solo expense'}
                            </span>
                          </div>

                          <button
                            onClick={() => deleteTripExpense(activeTrip.id, exp.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADVANCE POOL FUND */}
          {activeTab === 'pool' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    Advance Common Pool Jama ({activeTrip.pool_contributions?.length || 0} Records)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trip shuru hone se pehle sabhi members jo advance rashi jama karte hain.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPoolOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Pool Me Jama Karein
                </button>
              </div>

              {(!activeTrip.pool_contributions || activeTrip.pool_contributions.length === 0) ? (
                <div className="p-10 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-2">
                  <Wallet className="w-10 h-10 mx-auto text-slate-600" />
                  <p>Abhi tak kisi ne advance pool fund jama nahi kiya hai.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeTrip.pool_contributions.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{p.member_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded uppercase font-mono font-bold bg-blue-500/20 text-blue-300">
                          {p.payment_mode || 'UPI'}
                        </span>
                      </div>
                      <div className="text-xl font-black text-blue-400">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                        <span>{p.date}</span>
                        {p.notes && <span className="italic text-slate-500 truncate max-w-[120px]">{p.notes}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Yatri Log & Travelers ({activeTrip.members?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trip me shamil sabhi parivar sadasya aur dost.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Naya Member Jodein
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeTrip.members?.map((m) => (
                  <div
                    key={m.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{m.name}</span>
                        {m.is_family_member && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                            Family
                          </span>
                        )}
                      </div>
                      {m.phone && (
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {m.phone}
                        </p>
                      )}
                    </div>

                    {activeTrip.members.length > 1 && (
                      <button
                        onClick={() => removeTripMember(activeTrip.id, m.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD NEW TRIP */}
      {isAddTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-blue-400" /> Naya Holiday / Trip Banayein
              </h3>
              <button onClick={() => setIsAddTripOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Trip Ka Naam (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali Family Holiday, Goa Friends Tour"
                  value={newTripTitle}
                  onChange={e => setNewTripTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Destination / Sthan</label>
                  <input
                    type="text"
                    placeholder="e.g. Manali, Goa, Tirupati"
                    value={newTripDestination}
                    onChange={e => setNewTripDestination(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Trip Type</label>
                  <select
                    value={newTripType}
                    onChange={e => setNewTripType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="family_vacation">👨‍👩‍👧‍👦 Family Vacation</option>
                    <option value="friends_tour">🏖️ Friends Tour</option>
                    <option value="pilgrimage_yatra">🛕 Tirth / Yatra</option>
                    <option value="couple_solo">✈️ Couple / Solo</option>
                    <option value="business_trip">💼 Business Trip</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTripStartDate}
                    onChange={e => setNewTripStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={newTripEndDate}
                    onChange={e => setNewTripEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target Budget (₹)</label>
                <input
                  type="number"
                  value={newTripBudget || ''}
                  onChange={e => setNewTripBudget(Number(e.target.value))}
                  placeholder="50000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes / Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newTripNotes}
                  onChange={e => setNewTripNotes(e.target.value)}
                  placeholder="Hotel details, travel itinerary, flight details etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddTripOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  Trip Save Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW EXPENSE */}
      {isAddExpenseOpen && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" /> Naya Kharcha Darj Karein
              </h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Kharcha Kiska Hai (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resort Booking, Cab Fuel, Dinner, Shopping"
                  value={expenseTitle}
                  onChange={e => setExpenseTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Rashi (Amount ₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="2500"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={e => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="hotel_stay">🏨 Hotel / Stay</option>
                    <option value="flight_train_bus">✈️ Flight / Train / Bus</option>
                    <option value="taxi_fuel_toll">🚕 Cab / Fuel / Toll</option>
                    <option value="food_restaurant">🍽️ Food / Restaurant</option>
                    <option value="sightseeing_entry">🎟️ Sightseeing / Tickets</option>
                    <option value="shopping_personal">🛍️ Shopping / Personal</option>
                    <option value="activities_sports">🏄 Activities / Sports</option>
                    <option value="emergency_medical">💊 Medical / Emergency</option>
                    <option value="other">📝 Other Kharcha</option>
                  </select>
                </div>
              </div>

              {/* Expense Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 block">Kharcha Ka Prakaar (Type) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExpenseType('group_split')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      expenseType === 'group_split'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block">👥 Milkar Kharcha (Group Split)</span>
                    <span className="text-[10px] opacity-75">Hotel, Gaadi, Khana sabme batega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpenseType('personal_individual')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      expenseType === 'personal_individual'
                        ? 'bg-pink-600/20 border-pink-500 text-white'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block">🛍️ Niji Kharcha (Personal)</span>
                    <span className="text-[10px] opacity-75">Kapde, Gift, Solo tickets (No Split)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Kisne Diye (Paid By) *</label>
                  <select
                    value={expensePaidBy || activeTrip.members[0]?.id}
                    onChange={e => setExpensePaidBy(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    {activeTrip.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Multi-member Split selector if group_split */}
              {expenseType === 'group_split' && (
                <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                  <label className="text-xs font-bold text-slate-300 block">Kisme Batna Hai (Split Among):</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {activeTrip.members.map(m => {
                      const isSelected = expenseSplitAmong.length === 0 || expenseSplitAmong.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExpenseSplitAmong(prev => [...prev, m.id]);
                              } else {
                                const curr = expenseSplitAmong.length === 0 ? activeTrip.members.map(x => x.id) : expenseSplitAmong;
                                setExpenseSplitAmong(curr.filter(id => id !== m.id));
                              }
                            }}
                            className="rounded border-slate-700 text-blue-600 focus:ring-0"
                          />
                          <span>{m.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sync with Family Ledger Toggle */}
              <label className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncToFamilyLedger}
                  onChange={e => setSyncToFamilyLedger(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-200 block">Main Parivar Kharcha me bhi jodein (/money)</span>
                  <span className="text-slate-400">Ye rashi family ledger me Travel Kharcha ke roop me add ho jayegi</span>
                </div>
              </label>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Receipt number or specific note"
                  value={expenseNotes}
                  onChange={e => setExpenseNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
                >
                  Kharcha Add Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD ADVANCE POOL DEPOSIT */}
      {isAddPoolOpen && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" /> Advance Common Pool Deposit
              </h3>
              <button onClick={() => setIsAddPoolOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddPoolDeposit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Member (Kisne Pool me Jama Kiya) *</label>
                <select
                  value={poolMemberId || activeTrip.members[0]?.id}
                  onChange={e => setPoolMemberId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                >
                  {activeTrip.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Rashi (Amount ₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5000"
                    value={poolAmount}
                    onChange={e => setPoolAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={poolMode}
                    onChange={e => setPoolMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                  >
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="cash">Cash (Nagad)</option>
                    <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={poolDate}
                  onChange={e => setPoolDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Initial pool deposit"
                  value={poolNotes}
                  onChange={e => setPoolNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddPoolOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                >
                  Pool Jama Record Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW MEMBER */}
      {isAddMemberOpen && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" /> Naya Member / Yatri Jodein
              </h3>
              <button onClick={() => setIsAddMemberOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Yatri Ka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma, Priya"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Mobile / WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newMemberPhone}
                  onChange={e => setNewMemberPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isFamilyBadge}
                  onChange={e => setIsFamilyBadge(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300 font-semibold">Parivar Sadasya (Family Member)</span>
              </label>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
                >
                  Member Jodein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
