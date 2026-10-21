'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Milk, Plus, Calendar, Check, X, Clock, Trash2, 
  Banknote, Smartphone, CheckCircle2, History, AlertCircle, Phone,
  CreditCard, ChevronLeft, ChevronRight, FileText,
  Sparkles, Coffee, ShoppingBag, Copy, Share2, Edit3, Settings
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

export interface ExtraDairyItem {
  id: string;
  name: string;
  quantity?: string;
  amount: number;
}

export interface DayMilkRecord {
  litres: number;
  isSkipped?: boolean;
  note?: string;
  extraItems?: ExtraDairyItem[];
}

export interface MilkPaymentRecord {
  id: string;
  vendorId: string;
  periodLabel: string;
  date: string;
  amount: number;
  paymentMode: 'cash' | 'upi';
  referenceNo?: string;
  notes?: string;
}

export interface MilkVendor {
  id: string;
  name: string;
  phone?: string;
  defaultDailyLitres: number;
  ratePerLitre: number;
  milkType: 'cow' | 'buffalo' | 'mixed';
  billingCycle: 'monthly' | 'weekly';
  monthlyLogs: {
    [month: string]: {
      [day: number]: DayMilkRecord;
    };
  };
  payments: MilkPaymentRecord[];
}

const DEFAULT_VENDORS: MilkVendor[] = [
  {
    id: 'mv-default',
    name: 'यादव जी (डेयरी / दूधवाला)',
    phone: '9876543210',
    defaultDailyLitres: 2.0,
    ratePerLitre: 64,
    milkType: 'buffalo',
    billingCycle: 'monthly',
    monthlyLogs: {},
    payments: []
  }
];

export function MilkDairyHisabModule() {
  const { addTransaction, members } = useFamilyStore();

  const [vendors, setVendors] = useState<MilkVendor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_milk_dairy_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return DEFAULT_VENDORS;
  });

  const [selectedVendorId, setSelectedVendorId] = useState<string>(() => vendors[0]?.id || 'mv-default');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().substring(0, 7));
  const [viewFilter, setViewFilter] = useState<'all' | 'w1' | 'w2' | 'w3' | 'w4'>('all');

  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [targetDayForExtra, setTargetDayForExtra] = useState<number | null>(null);
  const [extraItemName, setExtraItemName] = useState('पनीर');
  const [extraItemQty, setExtraItemQty] = useState('500g');
  const [extraItemPrice, setExtraItemPrice] = useState<number | ''>(180);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payMode, setPayMode] = useState<'cash' | 'upi'>('upi');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [syncToExpenses, setSyncToExpenses] = useState(true);

  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorRate, setVendorRate] = useState<number | ''>(64);
  const [vendorDefaultQty, setVendorDefaultQty] = useState<number | ''>(2);
  const [vendorType, setVendorType] = useState<MilkVendor['milkType']>('buffalo');

  const [copiedMessage, setCopiedMessage] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('fwa_milk_dairy_v1', JSON.stringify(vendors));
  }, [vendors]);

  const activeVendor = useMemo(() => {
    return vendors.find(v => v.id === selectedVendorId) || vendors[0];
  }, [vendors, selectedVendorId]);

  // Total days in selected month
  const totalDaysInMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const formatMonthLabel = (m: string) => {
    const [year, month] = m.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const prev = new Date(year, month - 2, 1);
    setSelectedMonth(prev.toISOString().substring(0, 7));
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month, 1);
    setSelectedMonth(next.toISOString().substring(0, 7));
  };

  // Helper to get record of a day
  const getDayRecord = (day: number): DayMilkRecord => {
    const monthLogs = activeVendor.monthlyLogs?.[selectedMonth] || {};
    if (monthLogs[day]) return monthLogs[day];
    // Default fallback: regular daily quantity unless in future
    const [y, m] = selectedMonth.split('-').map(Number);
    const dayDate = new Date(y, m - 1, day);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    // If future date, default to 0, otherwise default to vendor standard
    const isFuture = dayDate > today;
    return {
      litres: isFuture ? 0 : activeVendor.defaultDailyLitres,
      isSkipped: isFuture ? false : false,
      extraItems: []
    };
  };

  // Set Milk Litres for a day (including 0L skip)
  const setDayLitres = (day: number, litres: number, isSkipped = false) => {
    setVendors(prev => prev.map(v => {
      if (v.id !== activeVendor.id) return v;
      const currentMonthLogs = { ...(v.monthlyLogs?.[selectedMonth] || {}) };
      const currentDay = currentMonthLogs[day] || getDayRecord(day);

      currentMonthLogs[day] = {
        ...currentDay,
        litres: litres,
        isSkipped: isSkipped || litres === 0
      };

      return {
        ...v,
        monthlyLogs: {
          ...(v.monthlyLogs || {}),
          [selectedMonth]: currentMonthLogs
        }
      };
    }));
  };

  // Add extra dairy item to a day
  const handleSaveExtraItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetDayForExtra === null || !extraItemPrice || !extraItemName) return;

    const newItem: ExtraDairyItem = {
      id: `edi-${Date.now()}`,
      name: extraItemName.trim(),
      quantity: extraItemQty.trim() || undefined,
      amount: Number(extraItemPrice)
    };

    setVendors(prev => prev.map(v => {
      if (v.id !== activeVendor.id) return v;
      const currentMonthLogs = { ...(v.monthlyLogs?.[selectedMonth] || {}) };
      const currentDay = currentMonthLogs[targetDayForExtra] || getDayRecord(targetDayForExtra);

      currentMonthLogs[targetDayForExtra] = {
        ...currentDay,
        extraItems: [...(currentDay.extraItems || []), newItem]
      };

      return {
        ...v,
        monthlyLogs: {
          ...(v.monthlyLogs || {}),
          [selectedMonth]: currentMonthLogs
        }
      };
    }));

    setIsAddItemModalOpen(false);
    setTargetDayForExtra(null);
  };

  // Remove extra item
  const handleRemoveExtraItem = (day: number, itemId: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id !== activeVendor.id) return v;
      const currentMonthLogs = { ...(v.monthlyLogs?.[selectedMonth] || {}) };
      const currentDay = currentMonthLogs[day];
      if (!currentDay || !currentDay.extraItems) return v;

      currentMonthLogs[day] = {
        ...currentDay,
        extraItems: currentDay.extraItems.filter(item => item.id !== itemId)
      };

      return {
        ...v,
        monthlyLogs: {
          ...(v.monthlyLogs || {}),
          [selectedMonth]: currentMonthLogs
        }
      };
    }));
  };

  // Calculations for current month
  const monthlyCalculations = useMemo(() => {
    let totalLitres = 0;
    let extraItemsTotal = 0;
    let skippedDaysCount = 0;
    const allExtraItemsList: { day: number; item: ExtraDairyItem }[] = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const rec = getDayRecord(day);
      if (rec.isSkipped || rec.litres === 0) {
        skippedDaysCount++;
      } else {
        totalLitres += rec.litres;
      }

      if (rec.extraItems && rec.extraItems.length > 0) {
        rec.extraItems.forEach(item => {
          extraItemsTotal += item.amount;
          allExtraItemsList.push({ day, item });
        });
      }
    }

    const milkCost = Math.round(totalLitres * activeVendor.ratePerLitre);
    const grossTotal = milkCost + extraItemsTotal;

    // Payments in this month
    const paymentsThisMonth = (activeVendor.payments || []).filter(p => 
      p.date.startsWith(selectedMonth)
    );
    const totalPaid = paymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
    const pendingDue = Math.max(0, grossTotal - totalPaid);

    return {
      totalLitres,
      milkCost,
      extraItemsTotal,
      grossTotal,
      totalPaid,
      pendingDue,
      skippedDaysCount,
      allExtraItemsList,
      paymentsThisMonth
    };
  }, [activeVendor, selectedMonth, totalDaysInMonth]);

  // Open Pay Modal
  const handleOpenPayModal = () => {
    setPayAmount(monthlyCalculations.pendingDue > 0 ? monthlyCalculations.pendingDue : monthlyCalculations.grossTotal);
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayMode('upi');
    setPayRef('');
    setPayNotes(`माह ${formatMonthLabel(selectedMonth)} दूध व डेयरी बिल भुगतान`);
    setSyncToExpenses(true);
    setIsPayModalOpen(true);
  };

  // Save Payment & Auto-sync into Family Expenses
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;

    const amt = Number(payAmount);
    const newPayment: MilkPaymentRecord = {
      id: `mp-${Date.now()}`,
      vendorId: activeVendor.id,
      periodLabel: formatMonthLabel(selectedMonth),
      date: payDate,
      amount: amt,
      paymentMode: payMode,
      referenceNo: payRef.trim() || undefined,
      notes: payNotes.trim() || undefined
    };

    setVendors(prev => prev.map(v => {
      if (v.id !== activeVendor.id) return v;
      return {
        ...v,
        payments: [newPayment, ...(v.payments || [])]
      };
    }));

    // Auto-Sync into Family Expenses!
    if (syncToExpenses) {
      try {
        addTransaction({
          type: 'expense',
          category: 'household',
          amount: amt,
          mode: payMode === 'cash' ? 'offline' : 'online',
          note: `[दूध व डेयरी भुगतान] ${activeVendor.name} - ${formatMonthLabel(selectedMonth)} (${payMode.toUpperCase()})`,
          txn_date: payDate,
          member_id: members[0]?.id || 'm-ankush'
        });
      } catch (err) {
        console.error('Error auto-syncing milk bill to expense', err);
      }
    }

    setIsPayModalOpen(false);
  };

  // Open Edit Vendor Modal
  const handleOpenEditVendor = () => {
    setVendorName(activeVendor.name);
    setVendorPhone(activeVendor.phone || '');
    setVendorRate(activeVendor.ratePerLitre);
    setVendorDefaultQty(activeVendor.defaultDailyLitres);
    setVendorType(activeVendor.milkType);
    setIsEditVendorOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !vendorRate || !vendorDefaultQty) return;

    setVendors(prev => prev.map(v => {
      if (v.id !== activeVendor.id) return v;
      return {
        ...v,
        name: vendorName.trim(),
        phone: vendorPhone.trim() || undefined,
        ratePerLitre: Number(vendorRate),
        defaultDailyLitres: Number(vendorDefaultQty),
        milkType: vendorType
      };
    }));

    setIsEditVendorOpen(false);
  };

  // Copy WhatsApp Summary Bill
  const handleCopyWhatsAppSummary = () => {
    let msg = `🥛 *दूध व डेयरी हिसाब पर्ची*\n`;
    msg += `📅 अवधि: ${formatMonthLabel(selectedMonth)}\n`;
    msg += `डेयरी / विक्रेता: ${activeVendor.name}\n`;
    msg += `------------------------------\n`;
    msg += `• कुल दूध: ${monthlyCalculations.totalLitres.toFixed(1)} लीटर (@ ₹${activeVendor.ratePerLitre}/L) = ₹${monthlyCalculations.milkCost.toLocaleString('en-IN')}\n`;
    msg += `• नो-दूध / स्किप दिन: ${monthlyCalculations.skippedDaysCount} दिन\n`;

    if (monthlyCalculations.allExtraItemsList.length > 0) {
      msg += `\n📦 *अतिरिक्त डेयरी सामान:*\n`;
      monthlyCalculations.allExtraItemsList.forEach(({ day, item }) => {
        msg += `  ${day} तारीख: ${item.name} ${item.quantity ? `(${item.quantity})` : ''} - ₹${item.amount}\n`;
      });
      msg += `• कुल अतिरिक्त सामान: ₹${monthlyCalculations.extraItemsTotal.toLocaleString('en-IN')}\n`;
    }

    msg += `------------------------------\n`;
    msg += `💰 *कुल देय राशि: ₹${monthlyCalculations.grossTotal.toLocaleString('en-IN')}*\n`;
    msg += `✅ चुकाई गई राशि: ₹${monthlyCalculations.totalPaid.toLocaleString('en-IN')}\n`;
    msg += `⚠️ शेष बकाया: ₹${monthlyCalculations.pendingDue.toLocaleString('en-IN')}\n`;
    msg += `\n(श्री वेल्थ फैमिली ऐप द्वारा जनरेटेड)`;

    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Days list filter by week
  const daysToDisplay = useMemo(() => {
    const all = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
    if (viewFilter === 'w1') return all.filter(d => d >= 1 && d <= 7);
    if (viewFilter === 'w2') return all.filter(d => d >= 8 && d <= 14);
    if (viewFilter === 'w3') return all.filter(d => d >= 15 && d <= 21);
    if (viewFilter === 'w4') return all.filter(d => d >= 22);
    return all;
  }, [totalDaysInMonth, viewFilter]);

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-navy rounded-3xl p-4 sm:p-5 text-paper border border-white/10 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black text-paper flex items-center gap-2">
              <Milk size={20} className="text-gold" />
              दैनिक दूध व डेयरी हिसाब (Milk & Dairy Ledger)
            </h2>
            <p className="text-xs text-paper-dim/80 mt-0.5">
              रोजाना दूध मात्रा (कम/ज्यादा या 0L स्किप), पनीर-खोवा एंट्री व ऑटो-सिंक पारिवारिक खर्च
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyWhatsAppSummary}
              className="px-3 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy size={14} />
              <span>{copiedMessage ? 'पर्ची कॉपी हो गई ✓' : 'WhatsApp पर्ची कॉपी करें'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenEditVendor}
              className="px-3 py-2 bg-navy-light/60 hover:bg-navy-light border border-gold/30 text-gold text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Settings size={14} />
              <span>डेयरी रेट / सेटिंग्स</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPayModal}
              className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <CreditCard size={15} /> भुगतान करें (Pay Bill)
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between bg-navy-light/40 p-2.5 rounded-2xl border border-navy-light/60">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl bg-navy/60 hover:bg-navy text-paper transition-all flex items-center gap-1 text-xs cursor-pointer"
          >
            <ChevronLeft size={16} /> पिछला माह
          </button>

          <div className="text-center">
            <span className="text-xs font-serif font-black text-gold">
              📅 {formatMonthLabel(selectedMonth)}
            </span>
            <span className="text-[10px] text-paper-dim/70 block">
              {activeVendor.name} • भाव: ₹{activeVendor.ratePerLitre}/लीटर (तय: {activeVendor.defaultDailyLitres}L/दिन)
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl bg-navy/60 hover:bg-navy text-paper transition-all flex items-center gap-1 text-xs cursor-pointer"
          >
            अगला माह <ChevronRight size={16} />
          </button>
        </div>

        {/* 4 Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block uppercase">कुल दूध (Litres)</span>
            <span className="text-base font-mono font-black text-paper">
              {monthlyCalculations.totalLitres.toFixed(1)} L
            </span>
            <span className="text-[9px] text-emerald-400 block mt-0.5">
              ₹{monthlyCalculations.milkCost.toLocaleString('en-IN')} दूध बिल
            </span>
          </div>

          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block uppercase">अतिरिक्त सामान (पनीर/खोवा)</span>
            <span className="text-base font-mono font-black text-gold">
              ₹{monthlyCalculations.extraItemsTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-paper-dim block mt-0.5">
              {monthlyCalculations.allExtraItemsList.length} सामान रिकॉर्ड
            </span>
          </div>

          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block uppercase">कुल देय राशि</span>
            <span className="text-base font-mono font-black text-paper">
              ₹{monthlyCalculations.grossTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-emerald-300 block mt-0.5">
              (दूध + पनीर + खोवा)
            </span>
          </div>

          <div className="bg-navy/70 border border-navy-light p-2.5 rounded-2xl">
            <span className="text-[10px] text-paper-dim font-bold block uppercase">बकाया / चुकता स्थिति</span>
            <span className={`text-base font-mono font-black ${monthlyCalculations.pendingDue > 0 ? 'text-coral' : 'text-emerald-400'}`}>
              ₹{monthlyCalculations.pendingDue.toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] text-paper-dim block mt-0.5">
              {monthlyCalculations.pendingDue === 0 ? 'पूर्ण चुकता ✓' : `भुगतान: ₹${monthlyCalculations.totalPaid}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Week Filter Switcher */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted mr-1">देखें:</span>
          {[
            { id: 'all', label: 'पूरा महीना (1-31)' },
            { id: 'w1', label: 'हफ्ता 1 (1-7)' },
            { id: 'w2', label: 'हफ्ता 2 (8-14)' },
            { id: 'w3', label: 'हफ्ता 3 (15-21)' },
            { id: 'w4', label: 'हफ्ता 4 (22+)' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                viewFilter === tab.id
                  ? 'bg-navy text-white shadow-xs'
                  : 'bg-paper text-ink-muted hover:text-ink border border-paper-dim'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-ink-muted">
          💡 <strong>0L (स्किप):</strong> जिस दिन दूध न लिया हो उस दिन 0L बटन दबाएं।
        </div>
      </div>

      {/* 3. Daily Milk Logging Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {daysToDisplay.map(day => {
          const record = getDayRecord(day);
          const isZero = record.isSkipped || record.litres === 0;
          const dayMilkCost = Math.round(record.litres * activeVendor.ratePerLitre);
          const dayExtraTotal = (record.extraItems || []).reduce((sum, item) => sum + item.amount, 0);
          const dayTotalCost = dayMilkCost + dayExtraTotal;

          const [y, m] = selectedMonth.split('-').map(Number);
          const dateObj = new Date(y, m - 1, day);
          const dayName = dateObj.toLocaleDateString('hi-IN', { weekday: 'short' });

          return (
            <div
              key={day}
              className={`p-3 rounded-2xl border transition-all space-y-2 ${
                isZero
                  ? 'bg-rose-500/5 border-rose-500/20'
                  : record.extraItems && record.extraItems.length > 0
                  ? 'bg-amber-500/5 border-amber-500/30'
                  : 'bg-paper border-paper-dim hover:border-gold/30'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-paper-dim/60 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-xl bg-navy text-gold text-xs font-black flex items-center justify-center shrink-0">
                    {day}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-ink block">{dayName}</span>
                    <span className="text-[9px] text-ink-muted">{day} {formatMonthLabel(selectedMonth).split(' ')[0]}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-black text-ink block">
                    ₹{dayTotalCost}
                  </span>
                  <span className="text-[9px] text-ink-muted">
                    {isZero ? 'नो-मिल्क (0L)' : `${record.litres}L (@ ₹${activeVendor.ratePerLitre})`}
                  </span>
                </div>
              </div>

              {/* Quantity Selector: 1-Click Buttons + Direct Custom Number Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-ink-muted uppercase">दूध मात्रा (लीटर):</span>
                  {/* Direct Custom Editable Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-ink-muted">सीधा लिखें:</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="100"
                      value={record.isSkipped ? 0 : record.litres}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setDayLitres(day, isNaN(val) ? 0 : val, isNaN(val) || val === 0);
                      }}
                      className="w-14 px-1.5 py-0.5 rounded-lg border border-paper-dim bg-paper text-xs font-mono font-bold text-ink text-center focus:outline-none focus:border-gold shadow-2xs"
                      placeholder="0.0"
                    />
                    <span className="text-[10px] font-bold text-ink">L</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1 text-[10px] font-bold">
                  {/* 0 L (Skip Day) */}
                  <button
                    type="button"
                    onClick={() => setDayLitres(day, 0, true)}
                    className={`py-1 rounded-lg border transition-all cursor-pointer text-center ${
                      isZero
                        ? 'bg-rose-600 text-white border-rose-600 font-black shadow-xs'
                        : 'bg-paper text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                    }`}
                    title="आज दूध नहीं लिया (छुट्टी / Skip)"
                  >
                    0L (स्किप)
                  </button>

                  {[1, 1.5, 2, 3].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setDayLitres(day, qty, false)}
                      className={`py-1 rounded-lg border transition-all cursor-pointer text-center ${
                        !isZero && record.litres === qty
                          ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs'
                          : 'bg-paper text-ink-muted border-paper-dim hover:bg-paper-dim/50'
                      }`}
                    >
                      {qty}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Items List for this Day */}
              {record.extraItems && record.extraItems.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-paper-dim/50">
                  <span className="text-[9px] font-bold text-amber-600 block uppercase">अतिरिक्त सामान:</span>
                  <div className="space-y-1">
                    {record.extraItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-amber-500/10 px-2 py-1 rounded-lg text-[10px] text-ink"
                      >
                        <span className="font-semibold">
                          📦 {item.name} {item.quantity ? `(${item.quantity})` : ''}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                            +₹{item.amount}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraItem(day, item.id)}
                            className="text-ink-muted hover:text-coral transition-colors cursor-pointer"
                            title="हटाएं"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Extra Item Button */}
              <button
                type="button"
                onClick={() => {
                  setTargetDayForExtra(day);
                  setExtraItemName('पनीर');
                  setExtraItemQty('500g');
                  setExtraItemPrice(180);
                  setIsAddItemModalOpen(true);
                }}
                className="w-full py-1 px-2 rounded-xl border border-dashed border-paper-dim hover:border-gold/50 text-[10px] font-bold text-ink-muted hover:text-ink flex items-center justify-center gap-1 transition-all cursor-pointer bg-paper-dim/15"
              >
                <Plus size={11} className="text-gold" />
                <span>पनीर / खोवा / दही जोड़ें</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. Payment History Section */}
      <div className="p-4 bg-paper rounded-2xl border border-paper-dim space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-gold" />
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
              दूध व डेयरी भुगतान इतिहास (Payment Records)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleOpenPayModal}
            className="text-[11px] font-bold text-gold hover:underline cursor-pointer"
          >
            + नया भुगतान दर्ज करें
          </button>
        </div>

        {activeVendor.payments && activeVendor.payments.length > 0 ? (
          <div className="divide-y divide-paper-dim/60">
            {activeVendor.payments.map(pmt => (
              <div key={pmt.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green/15 text-green flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">{pmt.periodLabel}</span>
                    <span className="text-[10px] text-ink-muted">
                      तारीख: {pmt.date} • मोड: {pmt.paymentMode.toUpperCase()}
                      {pmt.referenceNo ? ` • UTR: ${pmt.referenceNo}` : ''}
                    </span>
                    {pmt.notes && (
                      <p className="text-[10px] text-ink-muted/80 italic mt-0.5">{pmt.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Mono className="text-sm font-bold text-green block">₹{pmt.amount.toLocaleString('en-IN')}</Mono>
                  <span className="text-[9px] text-ink-muted">चुकता किया गया</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-ink-muted">
            इस महीने कोई भुगतान दर्ज नहीं है। 'भुगतान करें' बटन दबाकर साप्ताहिक या मासिक बिल का भुगतान दर्ज करें।
          </div>
        )}
      </div>

      {/* MODAL 1: Add Extra Item (पनीर, खोवा, दही, घी आदि) */}
      {isAddItemModalOpen && targetDayForExtra !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-paper p-5 border border-paper-dim shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <ShoppingBag size={16} className="text-gold" />
                  अतिरिक्त डेयरी सामान जोड़ें
                </h3>
                <span className="text-[11px] text-ink-muted">
                  {targetDayForExtra} तारीख ({formatMonthLabel(selectedMonth)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveExtraItem} className="space-y-3">
              {/* Quick Preset Buttons */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-ink-muted uppercase block">त्वरित चयन (Preset):</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { name: 'पनीर', qty: '500g', price: 180 },
                    { name: 'पनीर', qty: '250g', price: 90 },
                    { name: 'खोवा (मावा)', qty: '250g', price: 120 },
                    { name: 'दही', qty: '1 kg', price: 70 },
                    { name: 'घी', qty: '500g', price: 320 },
                    { name: 'मक्खन', qty: '200g', price: 110 }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setExtraItemName(p.name);
                        setExtraItemQty(p.qty);
                        setExtraItemPrice(p.price);
                      }}
                      className="p-1.5 rounded-lg border border-paper-dim bg-paper-dim/20 hover:border-gold/50 text-[10px] font-semibold text-ink text-center cursor-pointer transition-colors"
                    >
                      {p.name} ({p.qty})
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">सामान का नाम:</label>
                <input
                  type="text"
                  required
                  value={extraItemName}
                  onChange={e => setExtraItemName(e.target.value)}
                  placeholder="उदा. पनीर, खोवा, मलाई"
                  className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">मात्रा / वजन:</label>
                  <input
                    type="text"
                    value={extraItemQty}
                    onChange={e => setExtraItemQty(e.target.value)}
                    placeholder="उदा. 500g या 1 kg"
                    className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">रुपये (₹ कीमत):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={extraItemPrice}
                    onChange={e => setExtraItemPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="180"
                    className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gold text-navy font-bold text-xs shadow-sm hover:bg-gold-light cursor-pointer"
                >
                  जोड़ें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Pay Bill (साप्ताहिक या मासिक भुगतान) */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-paper p-5 border border-paper-dim shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <CreditCard size={16} className="text-gold" />
                  दूध व डेयरी बिल भुगतान (Pay Bill)
                </h3>
                <span className="text-[11px] text-ink-muted">
                  विक्रेता: {activeVendor.name} • {formatMonthLabel(selectedMonth)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              {/* Due Summary */}
              <div className="p-3 bg-paper-dim/30 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>कुल दूध ({monthlyCalculations.totalLitres}L):</span>
                  <span className="font-mono font-bold text-ink">₹{monthlyCalculations.milkCost}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>अतिरिक्त सामान (पनीर/खोवा):</span>
                  <span className="font-mono font-bold text-ink">₹{monthlyCalculations.extraItemsTotal}</span>
                </div>
                <div className="flex justify-between text-ink font-bold pt-1 border-t border-paper-dim/60">
                  <span>कुल बकाया राशि (Pending Due):</span>
                  <span className="font-mono font-black text-coral">₹{monthlyCalculations.pendingDue}</span>
                </div>
              </div>

              {/* Amount to Pay */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">भुगतान की जाने वाली राशि (₹):</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-sm text-ink font-mono font-black focus:outline-none focus:border-gold"
                />
              </div>

              {/* Date & Mode */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">भुगतान तारीख:</label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">भुगतान मोड:</label>
                  <div className="grid grid-cols-2 gap-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPayMode('upi')}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        payMode === 'upi'
                          ? 'bg-navy text-white border-navy font-black'
                          : 'bg-paper text-ink-muted border-paper-dim'
                      }`}
                    >
                      UPI / ऑनलाइन
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayMode('cash')}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        payMode === 'cash'
                          ? 'bg-navy text-white border-navy font-black'
                          : 'bg-paper text-ink-muted border-paper-dim'
                      }`}
                    >
                      नकद (Cash)
                    </button>
                  </div>
                </div>
              </div>

              {/* Reference / UTR */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">नोट्स / UTR नंबर (वैकल्पिक):</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="उदा. PhonePe से दिया / Google Pay"
                  className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold"
                />
              </div>

              {/* Auto-Sync with Family Expenses Checkbox */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="syncMilkToExpense"
                  checked={syncToExpenses}
                  onChange={e => setSyncToExpenses(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="syncMilkToExpense" className="text-[11px] text-ink font-medium cursor-pointer">
                  <strong className="text-emerald-700 dark:text-emerald-300 block">पारिवारिक खर्च में स्वतः जोड़ें (Auto-Sync)</strong>
                  भुगतान दर्ज होते ही यह राशि आपके घर के मुख्य दैनिक खर्च (Groceries / Household) में जुड़ जाएगी।
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gold text-navy font-black text-xs shadow-sm hover:bg-gold-light cursor-pointer"
                >
                  भुगतान संपन्न करें (Pay ₹{payAmount || 0})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Vendor / Settings */}
      {isEditVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-paper p-5 border border-paper-dim shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-2.5">
              <h3 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <Settings size={16} className="text-gold" />
                डेयरी व दूधवाला सेटिंग्स
              </h3>
              <button
                type="button"
                onClick={() => setIsEditVendorOpen(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">डेयरी / दूधवाले का नाम:</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ink">मोबाइल नंबर:</label>
                <input
                  type="tel"
                  value={vendorPhone}
                  onChange={e => setVendorPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">भाव प्रति लीटर (₹):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={vendorRate}
                    onChange={e => setVendorRate(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ink">रोजाना तय दूध (L):</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    min="0.5"
                    value={vendorDefaultQty}
                    onChange={e => setVendorDefaultQty(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-paper-dim bg-paper text-xs text-ink focus:outline-none focus:border-gold font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditVendorOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-paper-dim text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gold text-navy font-bold text-xs shadow-sm hover:bg-gold-light cursor-pointer"
                >
                  सुरक्षित करें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
