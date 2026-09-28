'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, 
  MessageSquare, CheckCircle2, ShoppingBag, Banknote, Smartphone, 
  CreditCard, Share2, Filter, ChevronDown, Check, ArrowRightLeft, 
  Clock, DollarSign, FileText, Sparkles
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

export interface MemberLedgerEntry {
  id: string;
  fromMember: string; // kisne diya / kharch kiya
  toMember: string; // kiske liye kharch kiya / kisko diya
  amount: number;
  type: 'cash_transfer' | 'bought_item' | 'online_bill' | 'payment_received';
  paymentMode: 'cash' | 'upi' | 'bank_transfer';
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  referenceNo?: string; // UPI txn id or receipt note
  notes?: string;
  isSettled: boolean;
}

const DEFAULT_ENTRIES: MemberLedgerEntry[] = [];

type TimeFilter = 'all' | 'this_month' | 'this_week' | 'this_year' | 'custom';

export function FamilyHisabModule() {
  const { members } = useFamilyStore();

  // Mukhiya (Ankush) & Family Partners
  const mukhiya = members.find(m => m.role === 'owner') || members[0] || { name: 'Ankush kesharwani' };
  const partnerMembers = members.filter(m => m.name !== mukhiya.name);

  const isDummyPerson = (name: string) => {
    const lower = String(name || '').toLowerCase().trim();
    return (
      lower.includes('rohan') ||
      lower.includes('priya') ||
      lower.includes('karan') ||
      lower.includes('अमित भैया') ||
      lower === 'papa' ||
      lower === 'mummy' ||
      lower === 'पापा' ||
      lower === 'मम्मी'
    );
  };

  const [entries, setEntries] = useState<MemberLedgerEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_family_hisab_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter((e: any) => 
                !['mle-1', 'mle-2', 'mle-3'].includes(e?.id) &&
                !isDummyPerson(e?.fromMember) &&
                !isDummyPerson(e?.toMember)
              )
              .map((e: any) => ({
                id: e.id || `mle-${Math.random().toString(36).substring(7)}`,
                fromMember: e.fromMember || mukhiya.name,
                toMember: e.toMember || 'Ganesh Prasad kesharwani',
                amount: Number(e.amount || 0),
                type: e.type || 'bought_item',
                paymentMode: e.paymentMode || (e.type === 'online_bill' ? 'upi' : 'cash'),
                title: e.title || 'सामान',
                date: e.date || new Date().toISOString().split('T')[0],
                time: e.time || '',
                referenceNo: e.referenceNo || '',
                notes: e.notes || '',
                isSettled: Boolean(e.isSettled)
              }));
          }
        } catch (e) {}
      }
    }
    return DEFAULT_ENTRIES;
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<string>(() => {
    return partnerMembers[0]?.name || 'Ganesh Prasad kesharwani';
  });

  // Time & Date Filter State
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Keep activePartner updated when members load
  useEffect(() => {
    if (partnerMembers.length > 0 && !partnerMembers.some(p => p.name === activePartner)) {
      setActivePartner(partnerMembers[0].name);
    }
  }, [members]);

  // Form State for New Transaction
  const [fromMember, setFromMember] = useState<string>(mukhiya.name);
  const [toMember, setToMember] = useState<string>(activePartner);
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<MemberLedgerEntry['type']>('bought_item');
  const [paymentMode, setPaymentMode] = useState<MemberLedgerEntry['paymentMode']>('cash');
  const [title, setTitle] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  // Form State for Quick Payment / Settlement Modal
  const [payFromMember, setPayFromMember] = useState<string>(activePartner);
  const [payToMember, setPayToMember] = useState<string>(mukhiya.name);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payMode, setPayMode] = useState<MemberLedgerEntry['paymentMode']>('upi');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('हिसाब चुकता / रीपेमेंट');

  // Sync form defaults when active partner changes
  useEffect(() => {
    setFromMember(mukhiya.name);
    setToMember(activePartner);
    setPayFromMember(activePartner);
    setPayToMember(mukhiya.name);
  }, [activePartner, mukhiya.name]);

  useEffect(() => {
    localStorage.setItem('fwa_family_hisab_v1', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || fromMember === toMember) {
      if (fromMember === toMember) alert('दोनों सदस्य एक ही नहीं हो सकते!');
      return;
    }

    const newEntry: MemberLedgerEntry = {
      id: `mle-${Date.now()}`,
      fromMember,
      toMember,
      amount: Number(amount),
      type,
      paymentMode,
      title,
      date: txDate || new Date().toISOString().split('T')[0],
      referenceNo: referenceNo.trim() || undefined,
      notes: notes.trim() || undefined,
      isSettled: false
    };

    setEntries([newEntry, ...entries]);
    setIsAddOpen(false);
    setTitle('');
    setAmount('');
    setReferenceNo('');
    setNotes('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || payFromMember === payToMember) {
      if (payFromMember === payToMember) alert('देने वाला और पाने वाला एक नहीं हो सकते!');
      return;
    }

    const paymentEntry: MemberLedgerEntry = {
      id: `mle-${Date.now()}`,
      fromMember: payFromMember,
      toMember: payToMember,
      amount: Number(payAmount),
      type: 'payment_received',
      paymentMode: payMode,
      title: payNotes || 'भुगतान मिला (Payment Received)',
      date: payDate || new Date().toISOString().split('T')[0],
      referenceNo: payRef.trim() || undefined,
      notes: `भुगतान माध्यम: ${payMode === 'upi' ? 'UPI' : payMode === 'cash' ? 'कैश' : 'बैंक'}`,
      isSettled: true
    };

    setEntries([paymentEntry, ...entries]);
    setIsPaymentOpen(false);
    setPayAmount('');
    setPayRef('');
    setPayNotes('हिसाब चुकता / रीपेमेंट');
  };

  const toggleSettle = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, isSettled: !e.isSettled } : e));
  };

  const handleDelete = (id: string) => {
    if (confirm('क्या आप इस प्रविष्टि को हटाना चाहते हैं?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  // Filter entries for active pair
  const activePairEntries = useMemo(() => {
    return entries.filter(
      e => (e.fromMember === mukhiya.name && e.toMember === activePartner) ||
           (e.fromMember === activePartner && e.toMember === mukhiya.name)
    );
  }, [entries, mukhiya.name, activePartner]);

  // Apply Time Filter
  const filteredEntries = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return activePairEntries.filter(entry => {
      if (timeFilter === 'all') return true;

      const entryDate = new Date(entry.date);
      if (isNaN(entryDate.getTime())) return true;

      if (timeFilter === 'this_month') {
        return (
          entryDate.getFullYear() === today.getFullYear() &&
          entryDate.getMonth() === today.getMonth()
        );
      }

      if (timeFilter === 'this_week') {
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return entryDate >= firstDayOfWeek;
      }

      if (timeFilter === 'this_year') {
        return entryDate.getFullYear() === today.getFullYear();
      }

      if (timeFilter === 'custom') {
        if (customStartDate && entry.date < customStartDate) return false;
        if (customEndDate && entry.date > customEndDate) return false;
        return true;
      }

      return true;
    });
  }, [activePairEntries, timeFilter, customStartDate, customEndDate]);

  // Overall Running Balance Calculation across all pair entries (not time bounded)
  // When Mukhiya spends on partner (bought_item, online_bill, cash_transfer): Mukhiya should RECEIVE
  // When Partner repays Mukhiya (payment_received, cash_transfer): Mukhiya RECEIVED
  // When Partner spends on Mukhiya: Mukhiya owes Partner
  const mukhiyaSpentForPartner = activePairEntries
    .filter(e => e.fromMember === mukhiya.name && e.toMember === activePartner && e.type !== 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerSpentForMukhiya = activePairEntries
    .filter(e => e.fromMember === activePartner && e.toMember === mukhiya.name && e.type !== 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerRepaidToMukhiya = activePairEntries
    .filter(e => e.fromMember === activePartner && e.toMember === mukhiya.name && e.type === 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  const mukhiyaRepaidToPartner = activePairEntries
    .filter(e => e.fromMember === mukhiya.name && e.toMember === activePartner && e.type === 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  // Net Balance:
  // Mukhiya should receive = (Mukhiya spent for partner) - (Partner repaid to mukhiya) - (Partner spent for mukhiya) + (Mukhiya repaid to partner)
  const netBalance = (mukhiyaSpentForPartner - partnerRepaidToMukhiya) - (partnerSpentForMukhiya - mukhiyaRepaidToPartner);

  // Filtered period stats
  const periodSpent = filteredEntries
    .filter(e => e.type !== 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  const periodPaidBack = filteredEntries
    .filter(e => e.type === 'payment_received')
    .reduce((sum, e) => sum + e.amount, 0);

  const mukhiyaShort = mukhiya.name.split(' ')[0];
  const partnerShort = activePartner.split(' ')[0];

  // WhatsApp Share Message Generator
  const handleShareWhatsApp = () => {
    let msg = `📋 *पारिवारिक आपसी हिसाब स्टेटमेंट*\n`;
    msg += `👥 *${mukhiya.name} ⇄ ${activePartner}*\n`;
    msg += `📅 तारीख: ${new Date().toLocaleDateString('hi-IN')}\n\n`;
    msg += `─────────────────\n`;
    msg += `🛒 *कुल सामान / खर्च:* ₹${mukhiyaSpentForPartner.toLocaleString('en-IN')}\n`;
    msg += `💵 *कुल रीपेमेंट मिला:* ₹${partnerRepaidToMukhiya.toLocaleString('en-IN')}\n`;
    msg += `─────────────────\n`;
    if (netBalance > 0) {
      msg += `📌 *बकाया हिसाब:* ${mukhiyaShort} को ${partnerShort} से *₹${netBalance.toLocaleString('en-IN')} लेना है*।\n\n`;
    } else if (netBalance < 0) {
      msg += `📌 *बकाया हिसाब:* ${mukhiyaShort} को ${partnerShort} को *₹${Math.abs(netBalance).toLocaleString('en-IN')} देना है*।\n\n`;
    } else {
      msg += `✅ *हिसाब पूरी तरह चुकता है (₹0 बाकी)*।\n\n`;
    }

    msg += `*हालिया लेन-देन सूची:*\n`;
    filteredEntries.slice(0, 8).forEach((e, idx) => {
      const modeIcon = e.paymentMode === 'upi' ? '📱 UPI' : e.paymentMode === 'cash' ? '💵 Cash' : '🏦 Bank';
      const typeStr = e.type === 'payment_received' ? '✅ भुगतान मिला' : e.type === 'bought_item' ? '🛍️ सामान' : e.type === 'online_bill' ? '⚡ बिल' : '💸 कैश';
      msg += `${idx + 1}. ${e.date} | ${e.title} : ₹${e.amount.toLocaleString('en-IN')} (${typeStr} - ${modeIcon})\n`;
    });

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Balance Card */}
      <div className="bg-navy text-paper p-4 md:p-5 rounded-3xl shadow-lg border border-navy-light/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gold/20 text-gold rounded-2xl shrink-0">
              <Users size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold font-serif text-white">Member Aapsi Hisab</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30">
                  लाइव लेजर
                </span>
              </div>
              <p className="text-xs text-paper-dim/80">परिवार के सदस्यों का खर्च, सामान लाना, तारीख अनुसार हिसाब व रनिंग बैलेंस</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Banknote size={15} /> + पेमेंट मिला दर्ज करें
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Plus size={15} /> + सामान / खर्च जोड़ें
            </button>
          </div>
        </div>

        {/* Member Partner Selector Pills */}
        <div>
          <span className="text-[10px] text-paper-dim/70 uppercase tracking-wider font-bold block mb-1.5">
            आपसी खाता चुनें (Member Ledger Partner):
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {partnerMembers.map(partner => {
              const isSelected = activePartner === partner.name;
              const pShort = partner.name.split(' ')[0];
              return (
                <button
                  key={partner.id}
                  onClick={() => setActivePartner(partner.name)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected ? 'bg-gold text-navy shadow-md scale-102' : 'bg-navy-light/50 text-paper-dim hover:bg-navy-light hover:text-white'
                  }`}
                >
                  <span>👤 {mukhiyaShort} ⇄ {pShort}</span>
                  <span className="text-[10px] opacity-80">({partner.relationship || 'सदस्य'})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Net Running Balance Hero Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-light/80 via-navy/90 to-navy-light/80 border border-white/10 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-paper-dim font-medium uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft size={13} className="text-gold" /> शुद्ध रनिंग बैलेंस ({mukhiyaShort} ⇄ {partnerShort}):
            </span>
            <h3 className="text-lg md:text-xl font-black text-paper">
              {netBalance > 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ArrowDownLeft size={20} className="text-emerald-400" />
                  {mukhiyaShort} को {partnerShort} से ₹{netBalance.toLocaleString('en-IN')} लेना है
                </span>
              ) : netBalance < 0 ? (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <ArrowUpRight size={20} className="text-rose-400" />
                  {mukhiyaShort} को {partnerShort} को ₹{Math.abs(netBalance).toLocaleString('en-IN')} देना है
                </span>
              ) : (
                <span className="text-gold font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={20} className="text-gold" />
                  हिसाब पूरी तरह चुकता व बराबर है (₹0)
                </span>
              )}
            </h3>
            <p className="text-[11px] text-paper-dim/70">
              सामान व खर्चे में से मिला हुआ रीपेमेंट घटाकर यह शुद्ध बैलेंस है।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="WhatsApp पर हिसाब विवरण भेजें"
            >
              <Share2 size={14} /> WhatsApp पर भेजें
            </button>
            <div className="text-right px-4 py-2 bg-black/30 rounded-xl border border-white/10 min-w-[130px]">
              <span className="text-[10px] text-paper-dim uppercase block font-bold">शुद्ध बैलेंस</span>
              <Mono className={`text-xl font-black ${netBalance > 0 ? 'text-emerald-400' : netBalance < 0 ? 'text-rose-400' : 'text-gold'}`}>
                ₹{Math.abs(netBalance).toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>

        {/* 3 Quick Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><ShoppingBag size={12} className="text-amber-400" /> कुल सामान व काम</span>
              <span className="text-[10px] text-slate-500">लाइफटाइम</span>
            </div>
            <div className="text-base font-black text-amber-300 mt-1 font-mono">
              ₹{mukhiyaSpentForPartner.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{mukhiyaShort} द्वारा खर्च</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Banknote size={12} className="text-emerald-400" /> रीपेमेंट / पेमेंट मिला</span>
              <span className="text-[10px] text-slate-500">कुल जमा</span>
            </div>
            <div className="text-base font-black text-emerald-400 mt-1 font-mono">
              ₹{partnerRepaidToMukhiya.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{partnerShort} ने चुकता किया</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Calendar size={12} className="text-cyan-400" /> इस फिल्टर अवधि में</span>
              <span className="text-[10px] text-slate-500">{filteredEntries.length} लेन-देन</span>
            </div>
            <div className="text-base font-black text-cyan-300 mt-1 font-mono">
              ₹{periodSpent.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">खर्च | ₹{periodPaidBack.toLocaleString('en-IN')} रीपेमेंट</p>
          </div>
        </div>
      </div>

      {/* Date & Timeframe Filter Bar */}
      <div className="bg-paper border border-paper-dim rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
            <Calendar size={14} className="text-gold" />
            <span>तारीख व समय अनुसार हिसाब (Statement Period):</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'all' ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              लाइफटाइम (All)
            </button>
            <button
              onClick={() => setTimeFilter('this_month')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'this_month' ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              इस महीने (Monthly)
            </button>
            <button
              onClick={() => setTimeFilter('this_week')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'this_week' ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              इस हफ्ते (Weekly)
            </button>
            <button
              onClick={() => setTimeFilter('this_year')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'this_year' ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              इस साल (Yearly)
            </button>
            <button
              onClick={() => setTimeFilter('custom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeFilter === 'custom' ? 'bg-navy text-paper shadow-sm' : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              कस्टम तारीख
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {timeFilter === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-paper-dim text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ink-muted text-[11px] whitespace-nowrap">शुरुआती तारीख:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-paper-dim border border-paper-dim font-bold text-ink text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ink-muted text-[11px] whitespace-nowrap">अंतिम तारीख:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-paper-dim border border-paper-dim font-bold text-ink text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Entries Ledger List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-gold" />
            <span>लेन-देन पासबुक खाता: {mukhiyaShort} ⇄ {partnerShort} ({filteredEntries.length} प्रविष्टियां)</span>
          </h3>
          <span className="text-[11px] text-ink-muted">
            {timeFilter === 'all' ? 'सभी समय' : timeFilter === 'this_month' ? 'चालू माह' : timeFilter === 'this_week' ? 'चालू सप्ताह' : 'फ़िल्टर लागू'}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 bg-paper border border-dashed border-paper-dim rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">इस अवधि में {mukhiyaShort} और {partnerShort} के बीच कोई लेन-देन दर्ज नहीं है</p>
              <p className="text-[11px] text-ink-muted mt-0.5">नया सामान, खर्च या मिला हुआ रीपेमेंट दर्ज करने के लिए ऊपर दिए गए बटनों का उपयोग करें।</p>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setIsAddOpen(true)}
                className="px-3 py-1.5 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light"
              >
                + सामान / खर्च दर्ज करें
              </button>
              <button
                onClick={() => setIsPaymentOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-500"
              >
                + पेमेंट मिला दर्ज करें
              </button>
            </div>
          </div>
        ) : (
          filteredEntries.map(e => {
            const isPayment = e.type === 'payment_received';
            const isFromMukhiya = e.fromMember === mukhiya.name;
            const formattedDate = new Date(e.date).toLocaleDateString('hi-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={e.id} 
                className={`bg-paper border rounded-2xl p-4 shadow-sm space-y-2.5 transition-all hover:border-gold/50 ${
                  isPayment ? 'border-emerald-500/30 bg-emerald-50/10' : 'border-paper-dim'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                        isPayment 
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : isFromMukhiya 
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20' 
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                      }`}>
                        {isPayment ? '💰 रीपेमेंट / पेमेंट मिला' : `${e.fromMember.split(' ')[0]} ने दिया → ${e.toMember.split(' ')[0]} को`}
                      </span>

                      {/* Payment Mode Badge */}
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-paper-dim text-ink flex items-center gap-1">
                        {e.paymentMode === 'upi' ? (
                          <>
                            <Smartphone size={11} className="text-purple-600" />
                            <span>UPI / GPay</span>
                          </>
                        ) : e.paymentMode === 'bank_transfer' ? (
                          <>
                            <CreditCard size={11} className="text-blue-600" />
                            <span>बैंक ट्रांसफर</span>
                          </>
                        ) : (
                          <>
                            <Banknote size={11} className="text-emerald-600" />
                            <span>कैश (Cash)</span>
                          </>
                        )}
                      </span>

                      {/* Type Badge */}
                      {!isPayment && (
                        <span className="text-[10px] text-ink-muted">
                          {e.type === 'bought_item' ? '🛍️ सामान खरीद' : e.type === 'online_bill' ? '⚡ ऑनलाइन बिल' : '💵 नकद दिया'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-ink flex items-center gap-1.5 mt-0.5">
                      {isPayment && <CheckCircle2 size={15} className="text-emerald-500" />}
                      <span>{e.title}</span>
                    </h4>

                    {(e.referenceNo || e.notes) && (
                      <p className="text-[11px] text-ink-muted">
                        {e.referenceNo && <span className="font-mono font-semibold text-ink-muted">Ref/Txn: {e.referenceNo} </span>}
                        {e.notes && <span>• {e.notes}</span>}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <Mono className={`text-base md:text-lg font-black ${
                      isPayment ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'
                    }`}>
                      {isPayment ? '+' : ''}₹{e.amount.toLocaleString('en-IN')}
                    </Mono>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-ink-muted mt-0.5">
                      <Calendar size={11} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-paper-dim text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSettle(e.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        e.isSettled 
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold' 
                          : 'bg-paper-dim text-ink-muted hover:text-ink hover:bg-paper-dim/80'
                      }`}
                    >
                      <CheckCircle2 size={13} className={e.isSettled ? 'text-emerald-600' : 'text-ink-muted'} />
                      <span>{e.isSettled ? '✓ चुकता / पूर्ण (Settled)' : 'बकाया (पेंडिंग)'}</span>
                    </button>

                    {!isPayment && !e.isSettled && (
                      <button
                        onClick={() => {
                          setPayFromMember(e.toMember);
                          setPayToMember(e.fromMember);
                          setPayAmount(e.amount);
                          setPayNotes(`${e.title} का चुकता भुगतान`);
                          setIsPaymentOpen(true);
                        }}
                        className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-1 border border-emerald-500/30"
                      >
                        <Banknote size={11} /> पेमेंट मिला?
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-all"
                    title="प्रविष्टि हटाएं"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: नया सामान / खर्च जोड़ें */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <ShoppingBag size={18} className="text-gold" /> नया पारिवारिक खर्च या सामान जोड़ें
                </h3>
                <p className="text-xs text-ink-muted">सामान का विवरण, तारीख, माध्यम और रकम दर्ज करें</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">किसने दिया/ख़र्च किया?</label>
                  <select
                    value={fromMember}
                    onChange={e => setFromMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} {m.relationship ? `(${m.relationship})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">किसके लिए खर्च किया?</label>
                  <select
                    value={toMember}
                    onChange={e => setToMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} {m.relationship ? `(${m.relationship})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-gold" /> तारीख (Date) *
                  </label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={e => setTxDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink text-xs"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <DollarSign size={13} className="text-emerald-500" /> रकम / Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={amount}
                    onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-black text-sm text-ink"
                  />
                </div>
              </div>

              {/* Type and Payment Mode */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">खर्च का प्रकार</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                  >
                    <option value="bought_item">🛍️ सामान खरीद कर लाया</option>
                    <option value="online_bill">⚡ ऑनलाइन बिल / रिचार्ज भरा</option>
                    <option value="cash_transfer">💸 कैश दिया (Cash given)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink-muted font-bold mb-1">भुगतान माध्यम (Mode)</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                  >
                    <option value="cash">💵 नकद (Cash)</option>
                    <option value="upi">📱 UPI (GPay / PhonePe / Paytm)</option>
                    <option value="bank_transfer">🏦 बैंक ट्रांसफर / NEFT</option>
                  </select>
                </div>
              </div>

              {/* Title & Notes */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">विवरण / सामान क्या आया? *</label>
                <input
                  type="text"
                  placeholder="उदा. घर का राशन, दवाई, बिजली बिल, सब्ज़ी"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted mb-1">UPI Ref / रसीद नं. (ऐच्छिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. 439201948291"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">अतिरिक्त नोट (ऐच्छिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. आधा पैसा बाकी"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink text-[11px]"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold text-navy font-black hover:bg-gold-light shadow-md"
                >
                  ✓ हिसाब सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: पेमेंट मिला / रीपेमेंट दर्ज करें */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-emerald-500/30 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Banknote size={20} className="text-emerald-500" /> पेमेंट मिला दर्ज करें (Record Repayment)
                </h3>
                <p className="text-xs text-ink-muted">किसने किसको पैसे दिए, कब मिले और माध्यम क्या था</p>
              </div>
              <button 
                onClick={() => setIsPaymentOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1">किसने पैसे दिए? (Payer)</label>
                  <select
                    value={payFromMember}
                    onChange={e => setPayFromMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} {m.relationship ? `(${m.relationship})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1">किसको मिले? (Receiver)</label>
                  <select
                    value={payToMember}
                    onChange={e => setPayToMember(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>
                        {m.name} {m.relationship ? `(${m.relationship})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-emerald-600 font-bold mb-1 flex items-center gap-1">
                    <DollarSign size={13} className="text-emerald-500" /> कितना मिला? (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-emerald-500/40 font-black text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-gold" /> कब मिला? (तारीख) *
                  </label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink text-xs"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">भुगतान माध्यम (Payment Mode) *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMode('cash')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'cash' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Banknote size={16} />
                    <span>💵 नकद (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('upi')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'upi' 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Smartphone size={16} />
                    <span>📱 UPI (GPay)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('bank_transfer')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'bank_transfer' 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>🏦 बैंक ट्रांसफर</span>
                  </button>
                </div>
              </div>

              {/* Reference & Notes */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">विवरण / नोट</label>
                <input
                  type="text"
                  placeholder="उदा. राशन का पैसा वापस दिया / हिसाब चुकता"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">UPI Txn ID / रसीद नंबर (ऐच्छिक)</label>
                <input
                  type="text"
                  placeholder="उदा. UPI-492049102"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-mono text-[11px] text-ink"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold hover:bg-paper-dim/80"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-md"
                >
                  ✓ रीपेमेंट सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
