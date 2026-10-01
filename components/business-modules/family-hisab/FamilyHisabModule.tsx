'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, 
  MessageSquare, CheckCircle2, ShoppingBag, Banknote, Smartphone, 
  CreditCard, Share2, Filter, ChevronDown, ChevronUp, Check, ArrowRightLeft, 
  Clock, DollarSign, FileText, Sparkles, Zap, Layers, Receipt,
  Copy, ExternalLink, X, Lock, Archive, RotateCcw, AlertTriangle,
  FolderArchive, History, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';

export interface MemberLedgerEntry {
  id: string;
  fromMember: string; // kisne diya / kharch kiya
  toMember: string; // kiske liye kharch kiya / kisko diya
  amount: number;
  type: 'bought_item' | 'online_bill' | 'cash_transfer' | 'payment_received' | 'advance_payment';
  category?: 'expense' | 'advance' | 'repayment'; // Expense (saman/kaam), Advance (pehle mila), Repayment (baad me chukta)
  paymentMode: 'cash' | 'upi' | 'bank_transfer';
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  referenceNo?: string; // UPI txn id or receipt note
  notes?: string;
  isSettled: boolean;
}

export interface LedgerCycle {
  id: string;
  partnerName: string;
  mukhiyaName: string;
  title: string;
  closedAt: string;
  startDate: string;
  endDate: string;
  totalSpent: number;
  totalPaid: number;
  closingNetBalance: number;
  settlementType: 'fully_settled' | 'carried_forward';
  carriedForwardAmount: number;
  closingNote?: string;
  entries: MemberLedgerEntry[];
}

const DEFAULT_ENTRIES: MemberLedgerEntry[] = [];

type TimeFilter = 'all' | 'this_month' | 'this_week' | 'this_year' | 'custom';
type ViewCategory = 'all' | 'expenses' | 'payments';

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
              .map((e: any) => {
                const isPmt = e.type === 'payment_received' || e.type === 'advance_payment';
                const isAdv = e.type === 'advance_payment' || (e.title && e.title.includes('एडवांस'));
                return {
                  id: e.id || `mle-${Math.random().toString(36).substring(7)}`,
                  fromMember: e.fromMember || mukhiya.name,
                  toMember: e.toMember || 'Ganesh Prasad kesharwani',
                  amount: Number(e.amount || 0),
                  type: e.type || 'bought_item',
                  category: e.category || (isAdv ? 'advance' : isPmt ? 'repayment' : 'expense'),
                  paymentMode: e.paymentMode || (e.type === 'online_bill' ? 'upi' : 'cash'),
                  title: e.title || 'सामान',
                  date: e.date || new Date().toISOString().split('T')[0],
                  time: e.time || '',
                  referenceNo: e.referenceNo || '',
                  notes: e.notes || '',
                  isSettled: Boolean(e.isSettled)
                };
              });
          }
        } catch (e) {}
      }
    }
    return DEFAULT_ENTRIES;
  });

  const searchParams = useSearchParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareMode, setShareMode] = useState<'full' | 'compact' | 'link_only'>('full');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Cycle and Settlement States
  const [cycles, setCycles] = useState<LedgerCycle[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_family_hisab_cycles_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return [];
  });
  const [selectedCycleId, setSelectedCycleId] = useState<string>('active');
  const [isCloseCycleOpen, setIsCloseCycleOpen] = useState(false);
  const [closeSettlementType, setCloseSettlementType] = useState<'carried_forward' | 'fully_settled'>('carried_forward');
  const [closeCycleTitle, setCloseCycleTitle] = useState('');
  const [closeCycleNote, setCloseCycleNote] = useState('');

  // View Grouping State: 'flat' (continuous list) or 'monthly' (collapsible month folders)
  const [viewGrouping, setViewGrouping] = useState<'flat' | 'monthly'>('flat');
  const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});

  const [activePartner, setActivePartner] = useState<string>(() => {
    return partnerMembers[0]?.name || 'Ganesh Prasad kesharwani';
  });

  // Filters State
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [viewCategory, setViewCategory] = useState<ViewCategory>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Keep activePartner updated when members load
  useEffect(() => {
    if (partnerMembers.length > 0 && !partnerMembers.some(p => p.name === activePartner)) {
      setActivePartner(partnerMembers[0].name);
    }
  }, [members]);

  // When active partner changes, reset selected cycle to 'active'
  useEffect(() => {
    setSelectedCycleId('active');
  }, [activePartner]);

  // Sync active partner from URL if provided (?partner=Name)
  useEffect(() => {
    const partnerFromUrl = searchParams.get('partner');
    if (partnerFromUrl) {
      const match = partnerMembers.find(m => m.name.toLowerCase() === partnerFromUrl.toLowerCase());
      if (match) {
        setActivePartner(match.name);
      } else {
        setActivePartner(partnerFromUrl);
      }
    }
    const cycleFromUrl = searchParams.get('cycle');
    if (cycleFromUrl) {
      setSelectedCycleId(cycleFromUrl);
    }
  }, [searchParams, partnerMembers]);

  // Form State 1: New Shopping / Expense Slip (सामान की पर्ची)
  const [fromMember, setFromMember] = useState<string>(mukhiya.name);
  const [toMember, setToMember] = useState<string>(activePartner);
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<MemberLedgerEntry['type']>('bought_item');
  const [paymentMode, setPaymentMode] = useState<MemberLedgerEntry['paymentMode']>('cash');
  const [title, setTitle] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');

  // Form State 2: Money Received / Advance Modal (पैसा मिला / एडवांस पर्ची)
  const [payCategory, setPayCategory] = useState<'advance' | 'repayment'>('repayment');
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
    localStorage.setItem('fwa_family_hisab_cycles_v1', JSON.stringify(cycles));
  }, [entries, cycles]);

  // On mount and page visit: Keep local and cloud fully synchronized
  // If Ankush enters a new transaction later, any member opening/refreshing the link will see it immediately!
  useEffect(() => {
    fetch('/api/family/hisab')
      .then(res => res.json())
      .then(data => {
        const cloudEntries: MemberLedgerEntry[] = data?.allEntries || data?.entries;
        if (Array.isArray(cloudEntries) && cloudEntries.length > 0) {
          setEntries(currentLocal => {
            if (currentLocal.length === 0 || cloudEntries.length > currentLocal.length) {
              return cloudEntries;
            }
            return currentLocal;
          });
        }
        const cloudCycles: LedgerCycle[] = data?.allCycles || data?.cycles;
        if (Array.isArray(cloudCycles) && cloudCycles.length > 0) {
          setCycles(currentLocalCycles => {
            if (currentLocalCycles.length === 0 || cloudCycles.length > currentLocalCycles.length) {
              return cloudCycles;
            }
            return currentLocalCycles;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Submit Shopping / Expense Slip
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
      category: 'expense',
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

  // Submit Money Received / Advance Entry
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || payFromMember === payToMember) {
      if (payFromMember === payToMember) alert('देने वाला और पाने वाला एक नहीं हो सकते!');
      return;
    }

    const isAdvance = payCategory === 'advance';
    const defaultTitle = isAdvance 
      ? '⚡ काम के लिए एडवांस पैसा मिला' 
      : '✅ सामान के बाद हिसाब चुकता मिला';

    const paymentEntry: MemberLedgerEntry = {
      id: `mle-${Date.now()}`,
      fromMember: payFromMember,
      toMember: payToMember,
      amount: Number(payAmount),
      type: isAdvance ? 'advance_payment' : 'payment_received',
      category: isAdvance ? 'advance' : 'repayment',
      paymentMode: payMode,
      title: payNotes ? payNotes : defaultTitle,
      date: payDate || new Date().toISOString().split('T')[0],
      referenceNo: payRef.trim() || undefined,
      notes: `${isAdvance ? 'काम से पहले अग्रिम (Advance)' : 'काम के बाद चुकता'} • माध्यम: ${payMode === 'upi' ? 'UPI' : payMode === 'cash' ? 'कैश' : 'बैंक'}`,
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

  // Filter entries for active pair in active ledger
  const activePairEntries = useMemo(() => {
    return entries.filter(
      e => (e.fromMember === mukhiya.name && e.toMember === activePartner) ||
           (e.fromMember === activePartner && e.toMember === mukhiya.name)
    );
  }, [entries, mukhiya.name, activePartner]);

  // Archived cycles for active pair
  const partnerCycles = useMemo(() => {
    return cycles.filter(c =>
      (c.mukhiyaName === mukhiya.name && c.partnerName === activePartner) ||
      (c.mukhiyaName === activePartner && c.partnerName === mukhiya.name) ||
      c.partnerName === activePartner
    );
  }, [cycles, mukhiya.name, activePartner]);

  // Selected cycle if archived mode
  const selectedArchivedCycle = useMemo(() => {
    if (selectedCycleId === 'active') return null;
    return cycles.find(c => c.id === selectedCycleId) || null;
  }, [cycles, selectedCycleId]);

  const isArchivedMode = Boolean(selectedArchivedCycle);

  // Overall Running Balance for active pair
  const mukhiyaSpentForPartner = activePairEntries
    .filter(e => e.fromMember === mukhiya.name && e.toMember === activePartner && e.category === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerSpentForMukhiya = activePairEntries
    .filter(e => e.fromMember === activePartner && e.toMember === mukhiya.name && e.category === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const partnerPaidToMukhiya = activePairEntries
    .filter(e => e.fromMember === activePartner && e.toMember === mukhiya.name && (e.category === 'repayment' || e.category === 'advance' || e.type === 'payment_received' || e.type === 'advance_payment'))
    .reduce((sum, e) => sum + e.amount, 0);

  const mukhiyaPaidToPartner = activePairEntries
    .filter(e => e.fromMember === mukhiya.name && e.toMember === activePartner && (e.category === 'repayment' || e.category === 'advance' || e.type === 'payment_received' || e.type === 'advance_payment'))
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = (mukhiyaSpentForPartner - partnerPaidToMukhiya) - (partnerSpentForMukhiya - mukhiyaPaidToPartner);

  // Display stats depending on active vs archived cycle
  const currentPairEntries = useMemo(() => {
    if (selectedArchivedCycle) {
      return selectedArchivedCycle.entries;
    }
    return activePairEntries;
  }, [selectedArchivedCycle, activePairEntries]);

  const displayMukhiyaSpent = selectedArchivedCycle ? selectedArchivedCycle.totalSpent : mukhiyaSpentForPartner;
  const displayPartnerPaid = selectedArchivedCycle ? selectedArchivedCycle.totalPaid : partnerPaidToMukhiya;
  const displayNetBalance = selectedArchivedCycle ? selectedArchivedCycle.closingNetBalance : netBalance;

  // Apply Time and Category Filters
  const filteredEntries = useMemo(() => {
    const today = new Date();

    const list = currentPairEntries.filter(entry => {
      // 1. Category Filter (All vs Shopping vs Payments)
      const isPaymentOrAdvance = entry.category === 'advance' || entry.category === 'repayment' || entry.type === 'payment_received' || entry.type === 'advance_payment';
      if (viewCategory === 'expenses' && isPaymentOrAdvance) return false;
      if (viewCategory === 'payments' && !isPaymentOrAdvance) return false;

      // 2. Time Filter
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

    // Sort newest first for chronological clarity
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });
  }, [currentPairEntries, viewCategory, timeFilter, customStartDate, customEndDate]);

  // Monthly Groups for collapsible accordion view
  const monthlyGroups = useMemo(() => {
    const map = new Map<string, {
      monthKey: string;
      monthLabel: string;
      entries: MemberLedgerEntry[];
      totalSpent: number;
      totalPaid: number;
    }>();

    filteredEntries.forEach(entry => {
      const monthKey = entry.date ? entry.date.slice(0, 7) : 'अन्य';
      if (!map.has(monthKey)) {
        let label = monthKey;
        try {
          const [y, m] = monthKey.split('-');
          const d = new Date(Number(y), Number(m) - 1, 1);
          label = d.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
        } catch {}

        map.set(monthKey, {
          monthKey,
          monthLabel: label,
          entries: [],
          totalSpent: 0,
          totalPaid: 0
        });
      }

      const g = map.get(monthKey)!;
      g.entries.push(entry);

      const isAdvOrPmt = entry.category === 'advance' || entry.category === 'repayment' || entry.type === 'payment_received' || entry.type === 'advance_payment';
      if (isAdvOrPmt) {
        g.totalPaid += entry.amount;
      } else {
        g.totalSpent += entry.amount;
      }
    });

    return Array.from(map.values());
  }, [filteredEntries]);

  const toggleMonthCollapse = (monthKey: string) => {
    setCollapsedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
  };

  // Handlers for closing and reopening cycles
  const handleOpenCloseCycle = () => {
    if (activePairEntries.length === 0) {
      alert('इस चालू खाते में क्लोज़ करने के लिए कोई लेन-देन नहीं है!');
      return;
    }
    const cycleNum = partnerCycles.length + 1;
    const nowMonth = new Date().toLocaleDateString('hi-IN', { month: 'short', year: 'numeric' });
    setCloseCycleTitle(`साइकिल ${cycleNum} (${nowMonth})`);
    setCloseCycleNote('');
    setCloseSettlementType('carried_forward');
    setIsCloseCycleOpen(true);
  };

  const handleConfirmCloseCycle = () => {
    if (activePairEntries.length === 0) return;

    const sorted = [...activePairEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const startDate = sorted[0]?.date || new Date().toISOString().split('T')[0];
    const endDate = sorted[sorted.length - 1]?.date || new Date().toISOString().split('T')[0];

    const cycleId = `cycle-${Date.now()}`;
    const finalTitle = closeCycleTitle.trim() || `साइकिल ${partnerCycles.length + 1} (${startDate} से ${endDate})`;

    const newCycle: LedgerCycle = {
      id: cycleId,
      partnerName: activePartner,
      mukhiyaName: mukhiya.name,
      title: finalTitle,
      closedAt: new Date().toISOString(),
      startDate,
      endDate,
      totalSpent: mukhiyaSpentForPartner,
      totalPaid: partnerPaidToMukhiya,
      closingNetBalance: netBalance,
      settlementType: closeSettlementType,
      carriedForwardAmount: closeSettlementType === 'carried_forward' ? netBalance : 0,
      closingNote: closeCycleNote.trim() || undefined,
      entries: [...activePairEntries]
    };

    const updatedCycles = [newCycle, ...cycles];
    setCycles(updatedCycles);
    localStorage.setItem('fwa_family_hisab_cycles_v1', JSON.stringify(updatedCycles));

    // Remove activePairEntries from entries
    const remainingEntries = entries.filter(e => !activePairEntries.some(ape => ape.id === e.id));

    let nextEntries = remainingEntries;
    if (closeSettlementType === 'carried_forward' && netBalance !== 0) {
      const openingEntry: MemberLedgerEntry = {
        id: `mle-open-${Date.now()}`,
        fromMember: netBalance > 0 ? mukhiya.name : activePartner,
        toMember: netBalance > 0 ? activePartner : mukhiya.name,
        amount: Math.abs(netBalance),
        type: 'bought_item',
        category: 'expense',
        paymentMode: 'cash',
        title: `📌 पिछला शेष कैरी-फ़ॉरवर्ड (${finalTitle})`,
        date: new Date().toISOString().split('T')[0],
        notes: `पुराने सुरक्षित खाते (${finalTitle}) का बाकी शेष नए पन्ने पर ओपनिंग बैलेंस के रूप में लाया गया।`,
        isSettled: false
      };
      nextEntries = [openingEntry, ...remainingEntries];
    }

    setEntries(nextEntries);
    localStorage.setItem('fwa_family_hisab_v1', JSON.stringify(nextEntries));

    // Cloud sync
    fetch('/api/family/hisab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries: nextEntries, cycles: updatedCycles })
    }).catch(() => {});

    setIsCloseCycleOpen(false);
    setSelectedCycleId('active');
  };

  const handleReopenCycle = (cycle: LedgerCycle) => {
    if (confirm(`क्या आप "${cycle.title}" को पुनः चालू (Re-open) करना चाहते हैं? इसके लेन-देन वापस चालू खाते में जुड़ जाएंगे।`)) {
      const cleanedEntries = entries.filter(e => !e.title?.includes(cycle.title));
      const restoredEntries = [...cycle.entries, ...cleanedEntries];
      const updatedCycles = cycles.filter(c => c.id !== cycle.id);

      setEntries(restoredEntries);
      setCycles(updatedCycles);
      localStorage.setItem('fwa_family_hisab_v1', JSON.stringify(restoredEntries));
      localStorage.setItem('fwa_family_hisab_cycles_v1', JSON.stringify(updatedCycles));

      fetch('/api/family/hisab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: restoredEntries, cycles: updatedCycles })
      }).catch(() => {});

      setSelectedCycleId('active');
    }
  };

  const handleDeleteCycle = (cycleId: string) => {
    if (confirm('क्या आप इस सुरक्षित आर्काइव खाते को हटाना चाहते हैं?')) {
      const updatedCycles = cycles.filter(c => c.id !== cycleId);
      setCycles(updatedCycles);
      localStorage.setItem('fwa_family_hisab_cycles_v1', JSON.stringify(updatedCycles));
      fetch('/api/family/hisab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, cycles: updatedCycles })
      }).catch(() => {});
      setSelectedCycleId('active');
    }
  };

  // Counts for tabs
  const allCount = currentPairEntries.length;
  const expenseCount = currentPairEntries.filter(e => e.category === 'expense' || (!e.category && e.type !== 'payment_received' && e.type !== 'advance_payment')).length;
  const paymentCount = currentPairEntries.filter(e => e.category === 'advance' || e.category === 'repayment' || e.type === 'payment_received' || e.type === 'advance_payment').length;

  const mukhiyaShort = mukhiya.name.split(' ')[0];
  const partnerShort = activePartner.split(' ')[0];

  // Smart WhatsApp Message Generator (Supports 60-100 entries + Direct Passbook Link)
  const generateShareMessage = (mode: 'full' | 'compact' | 'link_only' = shareMode) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const onlineUrl = `${origin}/family/hisab?tab=aapsi&partner=${encodeURIComponent(activePartner)}${isArchivedMode && selectedArchivedCycle ? `&cycle=${encodeURIComponent(selectedArchivedCycle.id)}` : ''}`;

    let msg = `📋 *पारिवारिक आपसी हिसाब पासबुक${isArchivedMode && selectedArchivedCycle ? ` (${selectedArchivedCycle.title} - सुरक्षित आर्काइव)` : ''}*\n`;
    msg += `👥 *${mukhiya.name} ⇄ ${activePartner}*\n`;
    msg += `📅 तारीख: ${new Date().toLocaleDateString('hi-IN')}\n\n`;
    msg += `─────────────────────────\n`;
    msg += `🛒 *कुल सामान / काम खर्च:* ₹${displayMukhiyaSpent.toLocaleString('en-IN')}\n`;
    msg += `💵 *कुल मिला पैसा / एडवांस:* ₹${displayPartnerPaid.toLocaleString('en-IN')}\n`;
    msg += `─────────────────────────\n`;

    if (displayNetBalance > 0) {
      msg += `📌 *बकाया हिसाब:* ${mukhiyaShort} को ${partnerShort} से *₹${displayNetBalance.toLocaleString('en-IN')} लेना है*।\n\n`;
    } else if (displayNetBalance < 0) {
      msg += `📌 *बकाया हिसाब:* ${mukhiyaShort} को ${partnerShort} को *₹${Math.abs(displayNetBalance).toLocaleString('en-IN')} देना है*।\n\n`;
    } else {
      msg += `✅ *हिसाब पूरी तरह चुकता व बराबर है (₹0 बाकी)*।\n\n`;
    }

    if (isArchivedMode && selectedArchivedCycle) {
      msg += `🔒 *आर्काइव क्लोजिंग:* ${selectedArchivedCycle.settlementType === 'carried_forward' ? `₹${Math.abs(selectedArchivedCycle.carriedForwardAmount).toLocaleString('en-IN')} कैरी-फ़ॉरवर्ड` : 'पूर्ण चुकता (₹0)'}\n\n`;
    }

    msg += `🌐 *ऑनलाइन पूरी पासबुक यहाँ खोलें:*\n👉 ${onlineUrl}\n\n`;

    if (mode === 'link_only') {
      msg += `_(सभी ${filteredEntries.length} प्रविष्टियों की लाइव पासबुक, रसीदें व विवरण देखने के लिए ऊपर दिए गए लिंक को खोलें।)_`;
      return msg;
    }

    // Full mode supports up to 85-90 entries compactly (well within WhatsApp URL limits)
    const limit = mode === 'compact' ? 15 : Math.min(filteredEntries.length, 90);
    const entriesToSend = filteredEntries.slice(0, limit);

    msg += `📑 *लेन-देन सूची (${filteredEntries.length} में से ${entriesToSend.length} प्रविष्टियां):*\n`;
    msg += `─────────────────────────\n`;

    entriesToSend.forEach((e, idx) => {
      let dateStr = e.date;
      try {
        const parts = e.date.split('-');
        if (parts.length === 3) dateStr = `${parts[2]}/${parts[1]}`;
      } catch {}

      const isAdv = e.category === 'advance' || e.type === 'advance_payment' || (e.title && e.title.includes('एडवांस'));
      const isRepay = !isAdv && (e.category === 'repayment' || e.type === 'payment_received');
      const badge = isAdv ? '⚡एडवांस' : isRepay ? '✅चुकता' : '🛍️सामान';
      const payMode = e.paymentMode === 'upi' ? 'UPI' : e.paymentMode === 'cash' ? 'कैश' : 'बैंक';
      const shortTitle = e.title.length > 20 ? e.title.slice(0, 19) + '…' : e.title;

      msg += `${idx + 1}. ${dateStr} | ${shortTitle} : ₹${e.amount.toLocaleString('en-IN')} [${badge}•${payMode}]\n`;
    });

    if (filteredEntries.length > limit) {
      const remaining = filteredEntries.length - limit;
      msg += `─────────────────────────\n`;
      msg += `➕ ...और बाकी *${remaining} लेन-देन* देखने के लिए ऊपर दिए गए ऑनलाइन लिंक पर क्लिक करें।\n`;
    }

    return msg;
  };

  const handleShareWhatsApp = (mode: 'full' | 'compact' | 'link_only' = shareMode) => {
    // Ensure cloud sync is up-to-date before sharing
    if (entries.length > 0) {
      fetch('/api/family/hisab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      }).catch(() => {});
    }
    const msg = generateShareMessage(mode);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = (mode: 'full' | 'compact' | 'link_only' = shareMode) => {
    const text = generateShareMessage(mode);
    navigator.clipboard.writeText(text);
    setCopiedStatus('statement');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const onlineUrl = `${origin}/family/hisab?tab=aapsi&partner=${encodeURIComponent(activePartner)}${isArchivedMode && selectedArchivedCycle ? `&cycle=${encodeURIComponent(selectedArchivedCycle.id)}` : ''}`;
    navigator.clipboard.writeText(onlineUrl);
    setCopiedStatus('link');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const renderEntryCard = (e: MemberLedgerEntry, isArchived: boolean = false) => {
    const isAdvance = e.category === 'advance' || e.type === 'advance_payment' || (e.title && e.title.includes('एडवांस'));
    const isPayment = !isAdvance && (e.category === 'repayment' || e.type === 'payment_received');
    const isExpense = !isAdvance && !isPayment;
    const isOpeningCarry = e.title && e.title.includes('कैरी-फ़ॉरवर्ड');
    const formattedDate = new Date(e.date).toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return (
      <div 
        key={e.id} 
        className={`bg-paper border rounded-2xl p-4 shadow-sm space-y-2.5 transition-all hover:border-gold/50 ${
          isOpeningCarry
            ? 'border-gold/60 bg-gold/10'
            : isAdvance 
            ? 'border-purple-500/40 bg-purple-50/15 dark:bg-purple-950/10'
            : isPayment 
            ? 'border-emerald-500/40 bg-emerald-50/15 dark:bg-emerald-950/10' 
            : 'border-paper-dim'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* CARD TYPE BADGE */}
              {isOpeningCarry ? (
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider bg-gold/25 text-gold-darker dark:text-gold border border-gold/40 flex items-center gap-1">
                  <Sparkles size={11} className="text-gold" />
                  <span>📌 ओपनिंग बैलेंस (पिछला शेष)</span>
                </span>
              ) : isAdvance ? (
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Zap size={11} className="text-purple-600" />
                  <span>⚡ काम के लिए एडवांस पैसा</span>
                </span>
              ) : isPayment ? (
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  <span>✅ बाद में हिसाब चुकता</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShoppingBag size={11} className="text-amber-600" />
                  <span>🛍️ सामान / काम का खर्च</span>
                </span>
              )}

              {/* Direction: Who paid to Whom */}
              <span className="text-[10px] font-bold text-ink-muted">
                ({e.fromMember.split(' ')[0]} → {e.toMember.split(' ')[0]})
              </span>

              {/* Payment Mode Badge */}
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-paper-dim text-ink flex items-center gap-1">
                {e.paymentMode === 'upi' ? (
                  <>
                    <Smartphone size={11} className="text-purple-600" />
                    <span>UPI (GPay/PhonePe)</span>
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
            </div>

            <h4 className="text-sm font-bold text-ink flex items-center gap-1.5 mt-0.5">
              <span>{e.title}</span>
            </h4>

            {(e.referenceNo || e.notes) && (
              <p className="text-[11px] text-ink-muted">
                {e.referenceNo && <span className="font-mono font-semibold text-ink-muted">Txn Ref: {e.referenceNo} </span>}
                {e.notes && <span>• {e.notes}</span>}
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <Mono className={`text-base md:text-lg font-black ${
              isOpeningCarry ? 'text-gold' : isAdvance ? 'text-purple-600 dark:text-purple-400' : isPayment ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink'
            }`}>
              {isAdvance || isPayment ? '+' : ''}₹{e.amount.toLocaleString('en-IN')}
            </Mono>
            <div className="flex items-center justify-end gap-1 text-[10px] text-ink-muted mt-0.5">
              <Calendar size={11} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-paper-dim text-xs">
          {isArchived ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 flex items-center gap-1">
              <Lock size={12} /> सुरक्षित आर्काइव रिकॉर्ड (Read-Only)
            </span>
          ) : (
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
                <span>{e.isSettled ? '✓ हिसाब दर्ज / चुकता' : 'बकाया (पेंडिंग)'}</span>
              </button>

              {isExpense && !e.isSettled && (
                <button
                  onClick={() => {
                    setPayCategory('repayment');
                    setPayFromMember(e.toMember);
                    setPayToMember(e.fromMember);
                    setPayAmount(e.amount);
                    setPayNotes(`${e.title} का चुकता भुगतान`);
                    setIsPaymentOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-600 hover:bg-emerald-500/10 flex items-center gap-1 border border-emerald-500/30"
                >
                  <Banknote size={12} /> बाद में पैसा मिला?
                </button>
              )}
            </div>
          )}

          {!isArchived && (
            <button
              onClick={() => handleDelete(e.id)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-all"
              title="प्रविष्टि हटाएं"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
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
                  सामान व एडवांस लेजर
                </span>
              </div>
              <p className="text-xs text-paper-dim/80">सामान लाने की पर्ची अलग, और एडवांस या बाद में मिले पैसे का हिसाब अलग दर्ज करें</p>
            </div>
          </div>

          {/* TWO DEDICATED SEPARATE BUTTONS + CLOSE CYCLE */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setPayCategory('advance');
                setIsPaymentOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Banknote size={15} /> + पैसा मिला / एडवांस लिखें
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <ShoppingBag size={15} /> + सामान / काम का खर्च लिखें
            </button>
            {!isArchivedMode && (
              <button
                onClick={handleOpenCloseCycle}
                className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                title="वर्तमान खाता बंद कर सुरक्षित आर्काइव करें और नया पन्ना शुरू करें"
              >
                <Lock size={14} className="text-amber-400" /> 🔒 खाता क्लोज़ करें
              </button>
            )}
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

        {/* Ledger Cycle History Switcher Bar */}
        <div className="pt-1 border-t border-white/5">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] text-paper-dim/70 uppercase tracking-wider font-bold flex items-center gap-1">
              <History size={12} className="text-gold" /> खाता चक्र / साइकिल चुनें (Active vs Archived Cycles):
            </span>
            {partnerCycles.length > 0 && (
              <span className="text-[10px] text-amber-300/80 font-bold">
                {partnerCycles.length} पुराने खाते सुरक्षित आर्काइव में हैं
              </span>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCycleId('active')}
              className={`px-3 py-2 rounded-xl font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCycleId === 'active'
                  ? 'bg-emerald-500 text-slate-950 shadow-md scale-102 ring-2 ring-emerald-400/50'
                  : 'bg-navy-light/60 text-paper-dim hover:bg-navy-light hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>🟢 वर्तमान चालू खाता</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
                {activePairEntries.length}
              </span>
            </button>

            {partnerCycles.map(cycle => {
              const isSelected = selectedCycleId === cycle.id;
              const formattedClose = new Date(cycle.closedAt).toLocaleDateString('hi-IN', {
                month: 'short',
                year: 'numeric'
              });
              return (
                <button
                  key={cycle.id}
                  onClick={() => setSelectedCycleId(cycle.id)}
                  className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-navy shadow-md scale-102 ring-2 ring-amber-300/50'
                      : 'bg-navy-light/60 text-paper-dim hover:bg-navy-light hover:text-white'
                  }`}
                >
                  <FolderArchive size={13} className={isSelected ? 'text-navy' : 'text-amber-400'} />
                  <span>{cycle.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">({formattedClose})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Archived Banner Notice (if an archived cycle is selected) */}
        {isArchivedMode && selectedArchivedCycle && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <FolderArchive size={20} />
              </span>
              <div>
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <span>📁 सुरक्षित पुराना खाता: {selectedArchivedCycle.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Read-Only (सुरक्षित)
                  </span>
                </h4>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  अवधि: {selectedArchivedCycle.startDate} से {selectedArchivedCycle.endDate} • {selectedArchivedCycle.settlementType === 'carried_forward' ? `₹${Math.abs(selectedArchivedCycle.carriedForwardAmount).toLocaleString('en-IN')} कैरी-फ़ॉरवर्ड शेष` : 'पूर्ण चुकता (₹0)'} {selectedArchivedCycle.closingNote ? `• ${selectedArchivedCycle.closingNote}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCycleId('active')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-navy font-black rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                ← वर्तमान चालू खाते पर लौटें
              </button>
              <button
                type="button"
                onClick={() => handleReopenCycle(selectedArchivedCycle)}
                className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-amber-500/40 transition-all"
                title="इस पुराने खाते को पुनः चालू खाते में जोड़ें"
              >
                <RotateCcw size={12} /> पुनः चालू करें
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCycle(selectedArchivedCycle.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl transition-all"
                title="यह आर्काइव हटाएं"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Net Running Balance Hero Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-light/80 via-navy/90 to-navy-light/80 border border-white/10 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-paper-dim font-medium uppercase tracking-wider flex items-center gap-1.5">
              {isArchivedMode ? (
                <>
                  <FolderArchive size={13} className="text-amber-400" />
                  <span>आर्काइव क्लोजिंग बैलेंस ({selectedArchivedCycle?.title}):</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft size={13} className="text-gold" />
                  <span>शुद्ध रनिंग बैलेंस ({mukhiyaShort} ⇄ {partnerShort}):</span>
                </>
              )}
            </span>
            <h3 className="text-lg md:text-xl font-black text-paper">
              {displayNetBalance > 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ArrowDownLeft size={20} className="text-emerald-400" />
                  {mukhiyaShort} को {partnerShort} से ₹{displayNetBalance.toLocaleString('en-IN')} लेना है
                </span>
              ) : displayNetBalance < 0 ? (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <ArrowUpRight size={20} className="text-rose-400" />
                  {mukhiyaShort} को {partnerShort} को ₹{Math.abs(displayNetBalance).toLocaleString('en-IN')} देना है
                </span>
              ) : (
                <span className="text-gold font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={20} className="text-gold" />
                  हिसाब पूरी तरह चुकता व बराबर है (₹0)
                </span>
              )}
            </h3>
            <p className="text-[11px] text-paper-dim/70">
              {isArchivedMode
                ? 'यह सुरक्षित रूप से बंद किया गया खाता है। इसका बैलेंस फ्रीज है।'
                : 'लाए गए सामान में से पहले मिला एडवांस या बाद का रीपेमेंट घटाकर यह शुद्ध हिसाब है।'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="WhatsApp पर पूरी पासबुक / हिसाब विवरण भेजें"
            >
              <Share2 size={14} /> 📲 WhatsApp शेयर
            </button>
            <div className="text-right px-4 py-2 bg-black/30 rounded-xl border border-white/10 min-w-[130px]">
              <span className="text-[10px] text-paper-dim uppercase block font-bold">
                {isArchivedMode ? 'क्लोजिंग बैलेंस' : 'शुद्ध बैलेंस'}
              </span>
              <Mono className={`text-xl font-black ${displayNetBalance > 0 ? 'text-emerald-400' : displayNetBalance < 0 ? 'text-rose-400' : 'text-gold'}`}>
                ₹{Math.abs(displayNetBalance).toLocaleString('en-IN')}
              </Mono>
            </div>
          </div>
        </div>

        {/* 3 Quick Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><ShoppingBag size={12} className="text-amber-400" /> कुल सामान व काम</span>
              <span className="text-[10px] text-slate-500">{expenseCount} पर्चियां</span>
            </div>
            <div className="text-base font-black text-amber-300 mt-1 font-mono">
              ₹{displayMukhiyaSpent.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{mukhiyaShort} द्वारा सामान/खर्च</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Banknote size={12} className="text-emerald-400" /> कुल पैसा मिला / एडवांस</span>
              <span className="text-[10px] text-slate-500">{paymentCount} भुगतान</span>
            </div>
            <div className="text-base font-black text-emerald-400 mt-1 font-mono">
              ₹{displayPartnerPaid.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{partnerShort} ने एडवांस या बाद में दिया</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-light/40 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1"><Receipt size={12} className="text-cyan-400" /> इस फिल्टर अवधि में</span>
              <span className="text-[10px] text-slate-500">{filteredEntries.length} प्रविष्टियां</span>
            </div>
            <div className="text-base font-black text-cyan-300 mt-1 font-mono">
              {displayNetBalance > 0 ? `+₹${displayNetBalance.toLocaleString('en-IN')}` : `₹${Math.abs(displayNetBalance).toLocaleString('en-IN')}`}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {displayNetBalance > 0 ? `${mukhiyaShort} को लेना है` : displayNetBalance < 0 ? `${mukhiyaShort} को देना है` : 'हिसाब बराबर'}
            </p>
          </div>
        </div>
      </div>

      {/* DISTINCT CATEGORY VIEW TABS (Shopping vs Advance vs All) + GROUPING TOGGLE */}
      <div className="bg-paper border border-paper-dim rounded-2xl p-2 shadow-sm space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setViewCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewCategory === 'all' 
                  ? 'bg-navy text-paper shadow-md' 
                  : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              <Layers size={14} />
              <span>📋 पूरा पासबुक ({allCount})</span>
            </button>

            <button
              onClick={() => setViewCategory('expenses')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewCategory === 'expenses' 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              <ShoppingBag size={14} />
              <span>🛍️ सिर्फ सामान व खर्च ({expenseCount})</span>
            </button>

            <button
              onClick={() => setViewCategory('payments')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewCategory === 'payments' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-paper-dim text-ink-muted hover:text-ink'
              }`}
            >
              <Banknote size={14} />
              <span>💵 सिर्फ पैसा मिला / एडवांस ({paymentCount})</span>
            </button>
          </div>

          {/* Grouping View Switcher: Flat List vs Monthly Folders */}
          <div className="flex items-center gap-1 bg-paper-dim p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewGrouping('flat')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewGrouping === 'flat' ? 'bg-navy text-paper shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
              title="सीधी लगातार सूची"
            >
              <FileText size={13} />
              <span>सीधी सूची</span>
            </button>
            <button
              type="button"
              onClick={() => setViewGrouping('monthly')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewGrouping === 'monthly' ? 'bg-navy text-paper shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
              title="महीने अनुसार फ़ोल्डर्स में समेटें"
            >
              <FolderArchive size={13} />
              <span>महीने अनुसार फ़ोल्डर्स</span>
            </button>
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
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={14} className="text-gold" />
            <span>
              {isArchivedMode ? `📁 आर्काइव: ${selectedArchivedCycle?.title}` : (viewCategory === 'expenses' ? '🛍️ सामान व खर्च पर्चियां' : viewCategory === 'payments' ? '💵 पैसा मिला व एडवांस कार्ड' : '📑 संयुक्त पासबुक')}: {mukhiyaShort} ⇄ {partnerShort} ({filteredEntries.length} प्रविष्टियां)
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Share2 size={12} /> WhatsApp पासबुक भेजें
            </button>
            <span className="text-[11px] text-ink-muted font-mono">
              {timeFilter === 'all' ? 'सभी समय' : timeFilter === 'this_month' ? 'चालू माह' : timeFilter === 'this_week' ? 'चालू सप्ताह' : 'फ़िल्टर लागू'}
            </span>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-8 bg-paper border border-dashed border-paper-dim rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">इस फिल्टर में कोई प्रविष्टि नहीं मिली</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                {isArchivedMode 
                  ? 'इस सुरक्षित आर्काइव खाते में चुने गए फिल्टर के अनुसार कोई प्रविष्टि नहीं है।' 
                  : 'नया सामान लिखने या मिला हुआ एडवांस/पैसा दर्ज करने के लिए ऊपर दिए गए बटनों का उपयोग करें।'}
              </p>
            </div>
            {!isArchivedMode && (
              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="px-3.5 py-2 bg-gold text-navy text-xs font-bold rounded-xl shadow-sm hover:bg-gold-light"
                >
                  + सामान / काम का खर्च लिखें
                </button>
                <button
                  onClick={() => {
                    setPayCategory('advance');
                    setIsPaymentOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-500"
                >
                  + पैसा मिला / एडवांस लिखें
                </button>
              </div>
            )}
          </div>
        ) : viewGrouping === 'monthly' ? (
          <div className="space-y-3">
            {monthlyGroups.map((group, idx) => {
              const isCollapsed = collapsedMonths[group.monthKey] ?? (idx > 0);
              return (
                <div key={group.monthKey} className="bg-paper border border-paper-dim rounded-2xl overflow-hidden shadow-sm transition-all">
                  <button
                    type="button"
                    onClick={() => toggleMonthCollapse(group.monthKey)}
                    className="w-full p-3.5 bg-paper-dim/40 hover:bg-paper-dim/70 flex items-center justify-between text-left transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-gold/20 text-gold shrink-0">
                        <Calendar size={16} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-ink">{group.monthLabel}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper font-bold text-ink border border-paper-dim">
                            {group.entries.length} प्रविष्टियां
                          </span>
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-2 font-mono">
                          <span>🛍️ खर्च: ₹{group.totalSpent.toLocaleString('en-IN')}</span>
                          <span>•</span>
                          <span>💵 भुगतान: ₹{group.totalPaid.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg bg-paper border border-paper-dim text-ink-muted shrink-0">
                      {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div className="p-3 space-y-2.5 border-t border-paper-dim">
                      {group.entries.map(e => renderEntryCard(e, isArchivedMode))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredEntries.map(e => renderEntryCard(e, isArchivedMode))}
          </div>
        )}
      </div>

      {/* Modal 1: 🛍️ सामान / काम का खर्च लिखें (Shopping Slip Modal) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-paper-dim space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-500" /> सामान / काम का खर्च लिखें
                </h3>
                <p className="text-xs text-ink-muted">घर या दुकान के लिए क्या सामान आया, कितने का था व तारीख</p>
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
                  <label className="block text-ink-muted font-bold mb-1">किसने सामान खरीदा/खर्च किया?</label>
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
                  <label className="block text-ink-muted font-bold mb-1">किसके लिए सामान आया?</label>
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

              {/* Date & Amount */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted font-bold mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-gold" /> सामान कब आया? (तारीख) *
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
                    <DollarSign size={13} className="text-emerald-500" /> कुल खर्च / रकम (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="उदा. 2500"
                    value={amount}
                    onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-black text-sm text-ink"
                  />
                </div>
              </div>

              {/* Title: What item/work */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">सामान क्या आया / काम क्या हुआ? *</label>
                <input
                  type="text"
                  placeholder="उदा. राशन, दवाई, बिजली का तार, पेंट, दुकान मरम्मत"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-bold text-ink"
                />
              </div>

              {/* Payment Mode */}
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
                    <option value="cash_transfer">💸 कैश दिया</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink-muted font-bold mb-1">दुकान पर कैसे चुकाया?</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                  >
                    <option value="cash">💵 नकद (Cash)</option>
                    <option value="upi">📱 UPI (GPay/PhonePe)</option>
                    <option value="bank_transfer">🏦 बैंक ट्रांसफर</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-ink-muted mb-1">बिल / रसीद नं. (ऐच्छिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. बिल #104"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim text-ink font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-ink-muted mb-1">अतिरिक्त नोट (ऐच्छिक)</label>
                  <input
                    type="text"
                    placeholder="उदा. 5kg आटा, 2L तेल"
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
                  ✓ सामान पर्ची सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: 💵 पैसा मिला / एडवांस लिखें (Money Received & Advance Modal) */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper rounded-3xl shadow-2xl p-5 md:p-6 border border-emerald-500/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Banknote size={20} className="text-emerald-500" /> पैसा मिला / एडवांस लिखें
                </h3>
                <p className="text-xs text-ink-muted">काम के लिए पहले एडवांस लिया या बाद में हिसाब चुकता हुआ</p>
              </div>
              <button 
                onClick={() => setIsPaymentOpen(false)}
                className="w-8 h-8 rounded-full bg-paper-dim text-ink font-bold hover:bg-paper-dim/80 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              {/* ADVANCE VS REPAYMENT RADIO SELECTOR */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">यह पैसा किस प्रकार का है?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayCategory('advance');
                      setPayNotes('काम के लिए पहले एडवांस मिला');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payCategory === 'advance' 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300 shadow-sm ring-1 ring-purple-500' 
                        : 'bg-paper border-paper-dim text-ink-muted hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs">
                      <Zap size={15} className="text-purple-600" />
                      <span>⚡ पहले एडवांस मिला</span>
                    </div>
                    <p className="text-[10px] text-ink-muted mt-0.5">सामान लाने या काम से पहले</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPayCategory('repayment');
                      setPayNotes('सामान के बाद हिसाब चुकता मिला');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payCategory === 'repayment' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500' 
                        : 'bg-paper border-paper-dim text-ink-muted hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>✅ बाद में चुकता मिला</span>
                    </div>
                    <p className="text-[10px] text-ink-muted mt-0.5">सामान लाने के बाद हिसाब</p>
                  </button>
                </div>
              </div>

              {/* Members */}
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
                    <DollarSign size={13} className="text-emerald-500" /> कितना पैसा मिला? (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="उदा. 5000"
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

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">भुगतान माध्यम (Cash / UPI / Bank) *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMode('cash')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'cash' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Banknote size={16} />
                    <span>💵 नकद Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('upi')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'upi' 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <Smartphone size={16} />
                    <span>📱 UPI GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('bank_transfer')}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                      payMode === 'bank_transfer' 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300 shadow-sm' 
                        : 'bg-paper border-paper-dim text-ink-muted'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>🏦 बैंक ट्रांसफर</span>
                  </button>
                </div>
              </div>

              {/* Purpose / Notes */}
              <div>
                <label className="block text-ink-muted font-bold mb-1">किस काम या मकसद के लिए? (विवरण)</label>
                <input
                  type="text"
                  placeholder={payCategory === 'advance' ? "उदा. घर की पुताई / राशन लाने के लिए एडवांस" : "उदा. पिछले सामान का पूरा हिसाब चुकता"}
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-paper-dim font-medium text-ink"
                />
              </div>

              <div>
                <label className="block text-ink-muted mb-1">UPI Ref / रसीद नं. (ऐच्छिक)</label>
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
                  ✓ {payCategory === 'advance' ? 'एडवांस दर्ज करें' : 'चुकता दर्ज करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Statement Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-paper border border-paper-dim rounded-3xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-emerald-500/15 text-emerald-500 rounded-xl">
                  <Share2 size={20} />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-ink">पारिवारिक पासबुक WhatsApp शेयर</h3>
                  <p className="text-[11px] text-ink-muted">
                    {mukhiyaShort} ⇄ {partnerShort} • कुल {filteredEntries.length} प्रविष्टियां
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-paper-dim text-ink-muted hover:text-ink transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3.5 pr-1 text-xs">
              {/* Net Balance Status */}
              <div className="p-3 rounded-2xl bg-paper-dim/60 border border-paper-dim flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted block uppercase font-bold">शुद्ध बैलेंस स्थिति</span>
                  <span className={`font-black text-sm ${netBalance > 0 ? 'text-emerald-500' : netBalance < 0 ? 'text-rose-500' : 'text-gold'}`}>
                    {netBalance > 0 ? `${mukhiyaShort} को ₹${netBalance.toLocaleString('en-IN')} लेना है` : netBalance < 0 ? `${mukhiyaShort} को ₹${Math.abs(netBalance).toLocaleString('en-IN')} देना है` : '₹0 हिसाब चुकता है'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ink-muted block uppercase font-bold">सामान खर्च / मिला पैसा</span>
                  <span className="font-mono text-ink font-bold text-xs">
                    ₹{mukhiyaSpentForPartner.toLocaleString('en-IN')} / ₹{partnerPaidToMukhiya.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Direct Online Passbook Link Strip */}
              <div className="p-3 rounded-2xl bg-gold/10 border border-gold/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5 text-xs">
                    <ExternalLink size={13} className="text-gold" />
                    <span>डायरेक्ट ऑनलाइन पासबुक लिंक</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded-lg bg-gold text-navy text-[10px] font-black hover:bg-gold-light flex items-center gap-1 transition-all shadow-sm"
                  >
                    {copiedStatus === 'link' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedStatus === 'link' ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  इस लिंक को भेजकर परिवार का कोई भी सदस्य बिना किसी ऐप को खोजे, सीधे 1-क्लिक में पूरी {filteredEntries.length} प्रविष्टियों की लाइव पासबुक देख सकता है।
                </p>
              </div>

              {/* Format Selection (Options) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider block">
                  स्टेटमेंट भेजने का विकल्प चुनें:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShareMode('full')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      shareMode === 'full'
                        ? 'border-emerald-500 bg-emerald-500/10 text-ink shadow-sm ring-1 ring-emerald-500'
                        : 'border-paper-dim bg-paper hover:bg-paper-dim/40 text-ink-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-ink">📋 पूरी पासबुक</span>
                      {shareMode === 'full' && <Check size={14} className="text-emerald-500" />}
                    </div>
                    <span className="text-[10px] opacity-80 leading-snug">
                      60-100 प्रविष्टियां + ऑनलाइन लिंक
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareMode('compact')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      shareMode === 'compact'
                        ? 'border-amber-500 bg-amber-500/10 text-ink shadow-sm ring-1 ring-amber-500'
                        : 'border-paper-dim bg-paper hover:bg-paper-dim/40 text-ink-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-ink">⚡ संक्षिप्त</span>
                      {shareMode === 'compact' && <Check size={14} className="text-amber-500" />}
                    </div>
                    <span className="text-[10px] opacity-80 leading-snug">
                      हालिया 15 प्रविष्टियां + ऑनलाइन लिंक
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareMode('link_only')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      shareMode === 'link_only'
                        ? 'border-blue-500 bg-blue-500/10 text-ink shadow-sm ring-1 ring-blue-500'
                        : 'border-paper-dim bg-paper hover:bg-paper-dim/40 text-ink-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-ink">🔗 केवल लिंक</span>
                      {shareMode === 'link_only' && <Check size={14} className="text-blue-500" />}
                    </div>
                    <span className="text-[10px] opacity-80 leading-snug">
                      बैलेंस समरी + डायरेक्ट पासबुक लिंक
                    </span>
                  </button>
                </div>
              </div>

              {/* Message Live Preview */}
              <div className="space-y-1">
                <span className="text-[10px] text-ink-muted uppercase font-bold flex items-center justify-between">
                  <span>मैसेज प्रीव्यू (WhatsApp Text Preview):</span>
                  <span className="font-mono text-[10px] text-emerald-500">
                    {shareMode === 'full' ? `${Math.min(filteredEntries.length, 90)} प्रविष्टियां शामिल` : shareMode === 'compact' ? `${Math.min(filteredEntries.length, 15)} प्रविष्टियां` : 'केवल लिंक'}
                  </span>
                </span>
                <pre className="p-3 bg-black/40 rounded-xl text-[11px] font-mono text-paper-dim/90 max-h-36 overflow-y-auto whitespace-pre-wrap border border-white/10 leading-relaxed no-scrollbar select-all">
                  {generateShareMessage(shareMode)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-paper-dim shrink-0">
              <button
                type="button"
                onClick={() => handleShareWhatsApp(shareMode)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Share2 size={16} /> WhatsApp पर भेजें
              </button>

              <button
                type="button"
                onClick={() => handleCopyText(shareMode)}
                className="py-3 px-4 rounded-xl bg-paper-dim hover:bg-paper-dim/80 text-ink font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedStatus === 'statement' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copiedStatus === 'statement' ? 'टेक्स्ट कॉपी हो गया!' : 'पूरा टेक्स्ट कॉपी करें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 🔒 खाता क्लोज़ व नया पन्ना शुरू करें */}
      {isCloseCycleOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 shadow-2xl space-y-4 no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-paper-dim">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-amber-500/20 text-amber-500 rounded-2xl">
                  <Lock size={20} />
                </span>
                <div>
                  <h3 className="text-base font-black text-ink">खाता क्लोज़ व नया पन्ना शुरू करें</h3>
                  <p className="text-xs text-ink-muted">{mukhiyaShort} ⇄ {partnerShort} का रनिंग हिसाब सेटलमेंट</p>
                </div>
              </div>
              <button
                onClick={() => setIsCloseCycleOpen(false)}
                className="p-1.5 rounded-full hover:bg-paper-dim text-ink-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cycle Summary Box */}
            <div className="p-3.5 rounded-2xl bg-navy text-paper space-y-2">
              <div className="flex items-center justify-between text-xs text-paper-dim">
                <span>कुल सक्रिय प्रविष्टियां:</span>
                <span className="font-bold text-paper">{activePairEntries.length} प्रविष्टियां</span>
              </div>
              <div className="flex items-center justify-between text-xs text-paper-dim">
                <span>कुल सामान / काम खर्च ({mukhiyaShort}):</span>
                <span className="font-bold text-amber-300 font-mono">₹{mukhiyaSpentForPartner.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-paper-dim">
                <span>कुल मिला पैसा / एडवांस ({partnerShort}):</span>
                <span className="font-bold text-emerald-400 font-mono">₹{partnerPaidToMukhiya.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">वर्तमान शुद्ध शेष (Net Balance):</span>
                <Mono className={`text-base font-black ${netBalance > 0 ? 'text-emerald-400' : netBalance < 0 ? 'text-rose-400' : 'text-gold'}`}>
                  {netBalance > 0 ? `+₹${netBalance.toLocaleString('en-IN')} (लेना है)` : netBalance < 0 ? `-₹${Math.abs(netBalance).toLocaleString('en-IN')} (देना है)` : '₹0 (बराबर)'}
                </Mono>
              </div>
            </div>

            {/* Settlement Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                क्लोजिंग व सेटलमेंट मोड चुनें:
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCloseSettlementType('carried_forward')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    closeSettlementType === 'carried_forward'
                      ? 'border-gold bg-gold/10 text-ink ring-2 ring-gold/40'
                      : 'border-paper-dim bg-paper text-ink-muted hover:bg-paper-dim/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-ink flex items-center gap-1.5 flex-wrap">
                      <span>📌 बाकी शेष को नए पन्ने पर कैरी-फ़ॉरवर्ड करें</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gold text-navy">अनुशंसित (Recommended)</span>
                    </span>
                    {closeSettlementType === 'carried_forward' && <Check size={16} className="text-gold shrink-0" />}
                  </div>
                  <p className="text-[11px] text-ink-muted mt-1 leading-snug">
                    वर्तमान {activePairEntries.length} पर्चियां सुरक्षित आर्काइव में लॉक हो जाएंगी, और बाकी ₹{Math.abs(netBalance).toLocaleString('en-IN')} नए पन्ने की पहली पर्ची (ओपनिंग बैलेंस) बन जाएगी। इससे स्क्रीन बिल्कुल साफ़ हो जाएगी।
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCloseSettlementType('fully_settled')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    closeSettlementType === 'fully_settled'
                      ? 'border-emerald-500 bg-emerald-500/10 text-ink ring-2 ring-emerald-500/40'
                      : 'border-paper-dim bg-paper text-ink-muted hover:bg-paper-dim/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-ink flex items-center gap-1.5">
                      <span>✅ पूर्ण चुकता हिसाब (Full ₹0 Settlement)</span>
                    </span>
                    {closeSettlementType === 'fully_settled' && <Check size={16} className="text-emerald-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-ink-muted mt-1 leading-snug">
                    दोनों पक्षों के बीच पूरा लेन-देन चुकता व बराबर मानकर पुराना खाता सुरक्षित लॉक किया जाएगा और नया खाता ₹0 शेष से शुरू होगा।
                  </p>
                </button>
              </div>
            </div>

            {/* Cycle Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">
                इस सुरक्षित साइकिल / खाते का नाम:
              </label>
              <input
                type="text"
                value={closeCycleTitle}
                onChange={e => setCloseCycleTitle(e.target.value)}
                placeholder={`उदा. साइकिल ${partnerCycles.length + 1}`}
                className="w-full px-3 py-2 rounded-xl bg-paper-dim border border-paper-dim text-xs font-bold text-ink focus:outline-none focus:border-gold"
              />
            </div>

            {/* Closing Note Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">
                क्लोजिंग नोट / टिप्पणी (वैकल्पिक):
              </label>
              <input
                type="text"
                value={closeCycleNote}
                onChange={e => setCloseCycleNote(e.target.value)}
                placeholder="उदा. दीवाली से पहले का हिसाब चुकता किया गया"
                className="w-full px-3 py-2 rounded-xl bg-paper-dim border border-paper-dim text-xs text-ink focus:outline-none focus:border-gold"
              />
            </div>

            {/* Zero Data Loss Guarantee Notice */}
            <div className="p-3 rounded-xl bg-blue-50/20 dark:bg-blue-950/20 border border-blue-500/30 flex items-start gap-2 text-xs">
              <ShieldCheck size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-ink-muted leading-relaxed">
                <strong className="text-blue-500">100% सुरक्षित डेटा (0% Loss):</strong> आपका कोई भी पुराना लेन-देन कभी डिलीट नहीं होगा। आप ऊपर दिए गए 'खाता चक्र' बटन से इस साइकिल की पूरी पर्चियां, रसीदें कभी भी देख सकते हैं और WhatsApp पर शेयर भी कर सकते हैं।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-paper-dim">
              <button
                type="button"
                onClick={() => setIsCloseCycleOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-paper-dim hover:bg-paper-dim/80 text-xs font-bold text-ink transition-all"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleConfirmCloseCycle}
                className="flex-1 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Lock size={14} /> खाता क्लोज़ करें व नया पन्ना बनाएं
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
