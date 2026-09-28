'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Users, Plus, Calendar, CheckCircle2, AlertCircle, 
  Clock, DollarSign, Smartphone, Banknote, CreditCard, ChevronDown, 
  ChevronUp, Trash2, ArrowRightLeft, ShieldCheck, Sun, Store, 
  Landmark, Wheat, Sparkles, History, Check, Share2, TrendingUp,
  Coins, PieChart, ShoppingBag, Receipt, ArrowUpRight, ArrowDownRight,
  Filter, Tag, Briefcase, Percent
} from 'lucide-react';
import { Mono } from '@/components/ui/Mono';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Member, AssetType } from '@/types';

// ==========================================
// 1. DATA TYPES (SaaS-GRADE DYNAMIC SCHEMAS)
// ==========================================

export type IncomeSourceType = 'rental_link' | 'business_profit' | 'interest_returns' | 'salary' | 'agri_mandi' | 'other';

export interface MemberIncomeStream {
  id: string;
  type: IncomeSourceType;
  title: string;
  monthlyAmount: number;
  linkedPropertyId?: string; // If linked to a rental property in the SaaS
  frequency: 'monthly' | 'quarterly' | 'annual';
  notes?: string;
  isActive: boolean;
}

export interface RecurringCommitmentPayment {
  id: string;
  commitmentId: string;
  month: string; // YYYY-MM
  date: string; // YYYY-MM-DD
  amount: number;
  paidByMemberId: string; // Dynamic member ID who actually disbursed money
  paymentMode: 'cash' | 'upi' | 'bank_transfer';
  referenceNo?: string;
  reimbursed: boolean; // Has the fund custodian reimbursed this payer?
  reimbursedDate?: string;
  reimbursedMode?: 'cash' | 'upi';
  notes?: string;
}

export interface RecurringCommitment {
  id: string;
  title: string;
  category: 'emi_loan' | 'commercial_rent' | 'utility_tax' | 'staff_salary' | 'insurance_sip' | 'household' | 'other';
  amount: number;
  dueDay: number; // Day of month (1-31)
  defaultPayerMemberId: string; // Dynamic member ID who usually pays
  notes?: string;
  isActive: boolean;
  payments: RecurringCommitmentPayment[];
}

export interface VariableExpense {
  id: string;
  title: string;
  category: 'ration_grocery' | 'repair_maintenance' | 'medical_health' | 'shopping' | 'travel' | 'contingency' | 'other';
  amount: number;
  date: string;
  paidByMemberId: string;
  paymentMode: 'cash' | 'upi' | 'card';
  notes?: string;
}

export interface MemberInvestmentLog {
  id: string;
  title: string;
  investmentType: AssetType; // 'mutual_funds' | 'gold' | 'bank_deposit' | 'shares' | 'property' | 'other'
  amount: number;
  date: string;
  institution?: string;
  notes?: string;
  syncedToWealthVault: boolean;
}

export interface MemberFinancialProfile {
  memberId: string; // Dynamic ID from members list
  isFamilyCentralPool: boolean; // Flag if this profile acts as central family pool
  incomeStreams: MemberIncomeStream[];
  commitments: RecurringCommitment[];
  variableExpenses: VariableExpense[];
  investments: MemberInvestmentLog[];
}

// Storage Key
const STORAGE_KEY = 'fwa_dynamic_member_cashflows_v2';

export function PapaFamilyFundModule() {
  const { members, rentalProperties, addAsset, addTransaction } = useFamilyStore();

  // Current Month (YYYY-MM)
  const currentMonth = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${mm}`;
  }, []);

  // 1. Identify primary members dynamically (No hardcoded names!)
  const ownerMember = useMemo(() => {
    return members.find(m => m.role === 'owner') || members[0] || { id: 'm-default', name: 'मुख्य सदस्य' };
  }, [members]);

  const seniorOrFatherMember = useMemo(() => {
    return members.find(m => 
      m.relationship?.toLowerCase().includes('father') || 
      m.relationship?.toLowerCase().includes('pita') ||
      m.name.toLowerCase().includes('ganesh')
    ) || members.find(m => m.id !== ownerMember.id) || ownerMember;
  }, [members, ownerMember]);

  // 2. Selected Active Member in the Cashflow Hub
  const [selectedMemberId, setSelectedMemberId] = useState<string>(() => {
    return seniorOrFatherMember.id;
  });

  // Ensure selected member is valid
  useEffect(() => {
    if (members.length > 0 && !members.some(m => m.id === selectedMemberId)) {
      setSelectedMemberId(seniorOrFatherMember.id);
    }
  }, [members, selectedMemberId, seniorOrFatherMember]);

  const activeMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || ownerMember;
  }, [members, selectedMemberId, ownerMember]);

  // 3. Main Profiles State
  const [profiles, setProfiles] = useState<Record<string, MemberFinancialProfile>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') return parsed;
        } catch (e) {}
      }
    }
    return {};
  });

  // Save on state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(profiles).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      } catch (e) {}
    }
  }, [profiles]);

  // 4. Default Seed Generator for any member if empty
  const currentProfile = useMemo((): MemberFinancialProfile => {
    if (profiles[selectedMemberId]) {
      return profiles[selectedMemberId];
    }

    // Default Inflow streams dynamically derived from available rental properties
    const defaultIncomeStreams: MemberIncomeStream[] = [];
    
    // If this is senior/central pool member and rental properties exist, link them dynamically
    if (rentalProperties && rentalProperties.length > 0) {
      rentalProperties.forEach((p, idx) => {
        const propRent = (p.tenants || []).reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0) || p.monthly_target_revenue || 0;
        defaultIncomeStreams.push({
          id: `inc-prop-${p.id || idx}`,
          type: 'rental_link',
          title: `किराया: ${p.title || p.name || `संपत्ति ${idx + 1}`}`,
          monthlyAmount: propRent,
          linkedPropertyId: p.id,
          frequency: 'monthly',
          notes: `${p.address || ''} से प्राप्त मासिक किराया`,
          isActive: true
        });
      });
    } else {
      defaultIncomeStreams.push({
        id: 'inc-default-rent',
        type: 'rental_link',
        title: 'समस्त संपत्तियों का किराया पूल',
        monthlyAmount: 67000,
        frequency: 'monthly',
        notes: 'मासिक रेंटल आवक',
        isActive: true
      });
    }

    // Add Shop/Business Profit & Interest stream
    defaultIncomeStreams.push({
      id: 'inc-shop-profit',
      type: 'business_profit',
      title: 'पारिवारिक व्यापार / मुख्य दुकान का लाभ',
      monthlyAmount: 25000,
      frequency: 'monthly',
      notes: 'दुकान से आने वाला मासिक व्यावसायिक लाभ',
      isActive: true
    });

    defaultIncomeStreams.push({
      id: 'inc-interest-fd',
      type: 'interest_returns',
      title: 'बैंक जमा / FD ब्याज व डिविडेंड',
      monthlyAmount: 3500,
      frequency: 'monthly',
      notes: 'मासिक ब्याज आवक (Interest Earnings)',
      isActive: true
    });

    // Default Commitments (EMIs, Rents, Staff)
    const defaultCommitments: RecurringCommitment[] = [
      {
        id: 'com-solar',
        title: 'सोलर पैनल लोन / किश्त (Solar EMI)',
        category: 'emi_loan',
        amount: 4500,
        dueDay: 10,
        defaultPayerMemberId: ownerMember.id,
        notes: 'रूफटॉप सोलर पैनल की मासिक बैंक किश्त',
        isActive: true,
        payments: []
      },
      {
        id: 'com-shop-emi',
        title: 'दुकान / कमर्शियल लोन EMI',
        category: 'emi_loan',
        amount: 8000,
        dueDay: 5,
        defaultPayerMemberId: ownerMember.id,
        notes: 'मुख्य व्यावसायिक दुकान की मासिक बैंक किश्त',
        isActive: true,
        payments: []
      },
      {
        id: 'com-mandi',
        title: 'मंडी दुकान / शेड का किराया',
        category: 'commercial_rent',
        amount: 2500,
        dueDay: 7,
        defaultPayerMemberId: ownerMember.id,
        notes: 'मंडी समिति व्यवसायिक शेड का मासिक किराया',
        isActive: true,
        payments: []
      },
      {
        id: 'com-nagar-palika',
        title: 'नगर पालिका कमर्शियल दुकान किराया',
        category: 'commercial_rent',
        amount: 1800,
        dueDay: 10,
        defaultPayerMemberId: ownerMember.id,
        notes: 'नगर पालिका परिषद स्वामित्व दुकान का शासकीय किराया',
        isActive: true,
        payments: []
      },
      {
        id: 'com-staff',
        title: 'घरेलू कर्मचारी व मेड वेतन (Staff Salary)',
        category: 'staff_salary',
        amount: 5000,
        dueDay: 5,
        defaultPayerMemberId: ownerMember.id,
        notes: 'घर की मेड व सहायकों का मासिक वेतन पूल',
        isActive: true,
        payments: []
      }
    ];

    return {
      memberId: selectedMemberId,
      isFamilyCentralPool: selectedMemberId === seniorOrFatherMember.id,
      incomeStreams: defaultIncomeStreams,
      commitments: defaultCommitments,
      variableExpenses: [],
      investments: []
    };
  }, [profiles, selectedMemberId, rentalProperties, ownerMember, seniorOrFatherMember]);

  // Helper to update current member's profile
  const updateCurrentProfile = (updater: (prev: MemberFinancialProfile) => MemberFinancialProfile) => {
    setProfiles(prev => {
      const base = prev[selectedMemberId] || currentProfile;
      const updated = updater(base);
      return {
        ...prev,
        [selectedMemberId]: updated
      };
    });
  };

  // -------------------------------------------------------------
  // DYNAMIC CALCULATIONS & METRICS FOR SELECTED MEMBER
  // -------------------------------------------------------------

  // 1. Total Inflow (Live dynamic sum)
  const totalMonthlyInflow = useMemo(() => {
    return (currentProfile.incomeStreams || [])
      .filter(s => s.isActive)
      .reduce((sum, s) => {
        // If rental_link with linkedPropertyId, check if live property has updated tenant rents
        if (s.type === 'rental_link' && s.linkedPropertyId) {
          const prop = rentalProperties.find(p => p.id === s.linkedPropertyId);
          if (prop) {
            const liveRent = (prop.tenants || []).reduce((tSum, t) => tSum + (Number(t.monthly_rent) || 0), 0);
            if (liveRent > 0) return sum + liveRent;
          }
        }
        return sum + Number(s.monthlyAmount || 0);
      }, 0);
  }, [currentProfile.incomeStreams, rentalProperties]);

  // 2. Fixed Commitments Budget & Paid
  const totalCommitmentBudget = useMemo(() => {
    return (currentProfile.commitments || [])
      .filter(c => c.isActive)
      .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  }, [currentProfile.commitments]);

  const currentMonthFixedPaid = useMemo(() => {
    let total = 0;
    (currentProfile.commitments || []).forEach(c => {
      (c.payments || []).forEach(p => {
        if (p.month === currentMonth) {
          total += Number(p.amount || 0);
        }
      });
    });
    return total;
  }, [currentProfile.commitments, currentMonth]);

  // 3. Variable Expenses This Month
  const currentMonthVariableExpenses = useMemo(() => {
    return (currentProfile.variableExpenses || [])
      .filter(v => (v.date || '').startsWith(currentMonth))
      .reduce((sum, v) => sum + Number(v.amount || 0), 0);
  }, [currentProfile.variableExpenses, currentMonth]);

  // 4. Investments This Month
  const currentMonthInvestments = useMemo(() => {
    return (currentProfile.investments || [])
      .filter(inv => (inv.date || '').startsWith(currentMonth))
      .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  }, [currentProfile.investments, currentMonth]);

  // 5. Net Monthly Surplus / Savings
  const netMonthlySurplus = useMemo(() => {
    return totalMonthlyInflow - currentMonthFixedPaid - currentMonthVariableExpenses - currentMonthInvestments;
  }, [totalMonthlyInflow, currentMonthFixedPaid, currentMonthVariableExpenses, currentMonthInvestments]);

  // 6. Inter-Member Pending Reimbursements
  // If someone paid on behalf of this member's pool and it's not reimbursed yet
  const pendingReimbursements = useMemo(() => {
    const pendingList: { payment: RecurringCommitmentPayment; commitmentTitle: string }[] = [];
    (currentProfile.commitments || []).forEach(c => {
      (c.payments || []).forEach(p => {
        if (p.month === currentMonth && !p.reimbursed && p.paidByMemberId !== selectedMemberId) {
          pendingList.push({ payment: p, commitmentTitle: c.title });
        }
      });
    });
    return pendingList;
  }, [currentProfile.commitments, currentMonth, selectedMemberId]);

  const totalPendingToReimburse = useMemo(() => {
    return pendingReimbursements.reduce((sum, item) => sum + Number(item.payment.amount || 0), 0);
  }, [pendingReimbursements]);

  // -------------------------------------------------------------
  // MODAL STATES
  // -------------------------------------------------------------
  
  // Modal 1: Add Custom Income Stream
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incTitle, setIncTitle] = useState('');
  const [incType, setIncType] = useState<IncomeSourceType>('business_profit');
  const [incAmount, setIncAmount] = useState<number | ''>('');
  const [incPropertyId, setIncPropertyId] = useState<string>('');
  const [incNotes, setIncNotes] = useState('');

  // Modal 2: Add Recurring Commitment
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [comTitle, setComTitle] = useState('');
  const [comCategory, setComCategory] = useState<RecurringCommitment['category']>('emi_loan');
  const [comAmount, setComAmount] = useState<number | ''>('');
  const [comDueDay, setComDueDay] = useState<number>(10);
  const [comDefaultPayer, setComDefaultPayer] = useState<string>(ownerMember.id);
  const [comNotes, setComNotes] = useState('');

  // Modal 3: Record Payment for a Commitment
  const [payingCommitment, setPayingCommitment] = useState<RecurringCommitment | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payDate, setPayDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [payByMemberId, setPayByMemberId] = useState<string>(ownerMember.id);
  const [payMode, setPayMode] = useState<'cash' | 'upi' | 'bank_transfer'>('upi');
  const [payRefNo, setPayRefNo] = useState('');
  const [payReimbursedNow, setPayReimbursedNow] = useState<boolean>(false);
  const [payNotes, setPayNotes] = useState('');

  // Modal 4: History Modal
  const [historyCommitment, setHistoryCommitment] = useState<RecurringCommitment | null>(null);

  // Modal 5: Add Variable Expense
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<VariableExpense['category']>('ration_grocery');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expDate, setExpDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [expPayerId, setExpPayerId] = useState<string>(selectedMemberId);
  const [expMode, setExpMode] = useState<'cash' | 'upi' | 'card'>('upi');
  const [expNotes, setExpNotes] = useState('');

  // Modal 6: Add Investment from Surplus
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [invTitle, setInvTitle] = useState('');
  const [invType, setInvType] = useState<AssetType>('mutual_funds');
  const [invAmount, setInvAmount] = useState<number | ''>('');
  const [invInstitution, setInvInstitution] = useState('');
  const [invDate, setInvDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [invNotes, setInvNotes] = useState('');

  // -------------------------------------------------------------
  // ACTIONS & HANDLERS
  // -------------------------------------------------------------

  // 1. Submit New Income Stream
  const handleAddIncomeStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle.trim() || !incAmount) return;

    const newStream: MemberIncomeStream = {
      id: `inc-${Date.now()}`,
      type: incType,
      title: incTitle.trim(),
      monthlyAmount: Number(incAmount),
      linkedPropertyId: incType === 'rental_link' && incPropertyId ? incPropertyId : undefined,
      frequency: 'monthly',
      notes: incNotes.trim() || undefined,
      isActive: true
    };

    updateCurrentProfile(prev => ({
      ...prev,
      incomeStreams: [newStream, ...(prev.incomeStreams || [])]
    }));

    // Reset & Close
    setIncTitle('');
    setIncAmount('');
    setIncPropertyId('');
    setIncNotes('');
    setIsIncomeModalOpen(false);
  };

  const handleDeleteIncomeStream = (streamId: string) => {
    updateCurrentProfile(prev => ({
      ...prev,
      incomeStreams: (prev.incomeStreams || []).filter(s => s.id !== streamId)
    }));
  };

  // 2. Submit New Recurring Commitment
  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comTitle.trim() || !comAmount) return;

    const newCom: RecurringCommitment = {
      id: `com-${Date.now()}`,
      title: comTitle.trim(),
      category: comCategory,
      amount: Number(comAmount),
      dueDay: Number(comDueDay) || 10,
      defaultPayerMemberId: comDefaultPayer,
      notes: comNotes.trim() || undefined,
      isActive: true,
      payments: []
    };

    updateCurrentProfile(prev => ({
      ...prev,
      commitments: [...(prev.commitments || []), newCom]
    }));

    // Reset & Close
    setComTitle('');
    setComAmount('');
    setComNotes('');
    setIsCommitmentModalOpen(false);
  };

  const handleDeleteCommitment = (comId: string) => {
    if (!confirm('क्या आप इस कमिटमेंट को हटाना चाहते हैं?')) return;
    updateCurrentProfile(prev => ({
      ...prev,
      commitments: (prev.commitments || []).filter(c => c.id !== comId)
    }));
  };

  // 3. Open Payment Modal
  const openPaymentModal = (com: RecurringCommitment) => {
    setPayingCommitment(com);
    setPayAmount(com.amount);
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayByMemberId(com.defaultPayerMemberId || ownerMember.id);
    setPayMode('upi');
    setPayRefNo('');
    // If payer is the pool custodian himself, reimbursed is automatically true
    setPayReimbursedNow(com.defaultPayerMemberId === selectedMemberId);
    setPayNotes('');
  };

  // Submit Payment for Commitment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingCommitment || !payAmount) return;

    const payment: RecurringCommitmentPayment = {
      id: `pay-${Date.now()}`,
      commitmentId: payingCommitment.id,
      month: currentMonth,
      date: payDate,
      amount: Number(payAmount),
      paidByMemberId: payByMemberId,
      paymentMode: payMode,
      referenceNo: payRefNo.trim() || undefined,
      reimbursed: payByMemberId === selectedMemberId ? true : payReimbursedNow,
      reimbursedDate: (payByMemberId === selectedMemberId || payReimbursedNow) ? payDate : undefined,
      reimbursedMode: (payByMemberId === selectedMemberId || payReimbursedNow) ? (payMode === 'cash' ? 'cash' : 'upi') : undefined,
      notes: payNotes.trim() || undefined
    };

    updateCurrentProfile(prev => ({
      ...prev,
      commitments: (prev.commitments || []).map(c => {
        if (c.id === payingCommitment.id) {
          // Replace or append payment for this month
          const filtered = (c.payments || []).filter(p => p.month !== currentMonth);
          return {
            ...c,
            payments: [payment, ...filtered]
          };
        }
        return c;
      })
    }));

    setPayingCommitment(null);
  };

  // 4. Mark Reimbursement as Settled
  const handleMarkReimbursed = (commitmentId: string, paymentId: string, mode: 'cash' | 'upi' = 'cash') => {
    const today = new Date().toISOString().split('T')[0];
    updateCurrentProfile(prev => ({
      ...prev,
      commitments: (prev.commitments || []).map(c => {
        if (c.id === commitmentId) {
          return {
            ...c,
            payments: (c.payments || []).map(p => {
              if (p.id === paymentId) {
                return {
                  ...p,
                  reimbursed: true,
                  reimbursedDate: today,
                  reimbursedMode: mode
                };
              }
              return p;
            })
          };
        }
        return c;
      })
    }));
  };

  // 5. Submit Variable Expense
  const handleAddVariableExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    const newExpense: VariableExpense = {
      id: `vexp-${Date.now()}`,
      title: expTitle.trim(),
      category: expCategory,
      amount: Number(expAmount),
      date: expDate,
      paidByMemberId: expPayerId,
      paymentMode: expMode,
      notes: expNotes.trim() || undefined
    };

    updateCurrentProfile(prev => ({
      ...prev,
      variableExpenses: [newExpense, ...(prev.variableExpenses || [])]
    }));

    // Auto-record to general family transaction stream
    try {
      addTransaction({
        type: 'expense',
        amount: Number(expAmount),
        category: expCategory,
        mode: expMode === 'cash' ? 'offline' : 'online',
        note: `[${activeMember.name} फंड] ${expTitle.trim()}`,
        txn_date: expDate,
        member_id: expPayerId
      });
    } catch (e) {}

    // Reset & Close
    setExpTitle('');
    setExpAmount('');
    setExpNotes('');
    setIsExpenseModalOpen(false);
  };

  const handleDeleteVariableExpense = (expId: string) => {
    updateCurrentProfile(prev => ({
      ...prev,
      variableExpenses: (prev.variableExpenses || []).filter(v => v.id !== expId)
    }));
  };

  // 6. Submit Investment from Surplus (Directly to Family Wealth Store!)
  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invTitle.trim() || !invAmount) return;

    const newInvestment: MemberInvestmentLog = {
      id: `inv-${Date.now()}`,
      title: invTitle.trim(),
      investmentType: invType,
      amount: Number(invAmount),
      date: invDate,
      institution: invInstitution.trim() || undefined,
      notes: invNotes.trim() || undefined,
      syncedToWealthVault: true
    };

    updateCurrentProfile(prev => ({
      ...prev,
      investments: [newInvestment, ...(prev.investments || [])]
    }));

    // Direct Integration with FamilyStore Wealth Portfolio Assets!
    try {
      addAsset({
        category: ['shares', 'mutual_funds', 'gold', 'silver', 'bank_deposit'].includes(invType) ? 'liquid' : 'fixed',
        type: invType,
        label: invTitle.trim(),
        institution: invInstitution.trim() || undefined,
        value: Number(invAmount),
        member_id: selectedMemberId,
        notes: `मासिक बचत से निवेश - ${activeMember.name} (${invDate}) ${invNotes.trim()}`
      });
    } catch (err) {
      console.error('Failed to sync asset to store', err);
    }

    // Reset & Close
    setInvTitle('');
    setInvAmount('');
    setInvInstitution('');
    setInvNotes('');
    setIsInvestModalOpen(false);
  };

  // Helper for Member name by ID
  const getMemberName = (id?: string) => {
    if (!id) return 'अज्ञात सदस्य';
    const found = members.find(m => m.id === id);
    return found ? found.name : 'सदस्य';
  };

  // Category Icon & Label Helpers
  const getIncomeIcon = (type: IncomeSourceType) => {
    switch (type) {
      case 'rental_link': return <Building2 size={16} className="text-amber-500" />;
      case 'business_profit': return <Store size={16} className="text-emerald-500" />;
      case 'interest_returns': return <Percent size={16} className="text-blue-500" />;
      case 'salary': return <Briefcase size={16} className="text-purple-500" />;
      case 'agri_mandi': return <Wheat size={16} className="text-orange-500" />;
      default: return <Coins size={16} className="text-gold" />;
    }
  };

  const getIncomeLabel = (type: IncomeSourceType) => {
    switch (type) {
      case 'rental_link': return 'रेंटल किराया';
      case 'business_profit': return 'दुकान/व्यापार लाभ';
      case 'interest_returns': return 'ब्याज व रिटर्न';
      case 'salary': return 'वेतन / सैलरी';
      case 'agri_mandi': return 'मंडी / कृषि';
      default: return 'अन्य आय स्रोत';
    }
  };

  const getCommitmentIcon = (cat: RecurringCommitment['category']) => {
    switch (cat) {
      case 'emi_loan': return <Sun size={17} className="text-amber-500" />;
      case 'commercial_rent': return <Store size={17} className="text-blue-500" />;
      case 'staff_salary': return <Users size={17} className="text-emerald-500" />;
      case 'utility_tax': return <Landmark size={17} className="text-indigo-500" />;
      case 'insurance_sip': return <TrendingUp size={17} className="text-purple-500" />;
      default: return <CreditCard size={17} className="text-ink-muted" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* ======================================================== */}
      {/* 1. DYNAMIC MEMBER SELECTOR (SAAS MULTI-TENANT PROFILES) */}
      {/* ======================================================== */}
      <div className="bg-paper rounded-2xl border border-paper-dim p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-paper-dim/60 pb-2.5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 block">
              SaaS Cashflow Hub • पारिवारिक फंड व सदस्य कैशफ्लो
            </span>
            <h2 className="text-base font-serif font-black text-ink flex items-center gap-2">
              <Landmark size={18} className="text-amber-500" />
              {activeMember.name} का वित्तीय केंद्र
              {activeMember.id === seniorOrFatherMember.id && (
                <span className="text-[10px] font-sans font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  🏛️ केंद्रीय पारिवारिक पूल
                </span>
              )}
            </h2>
          </div>

          {/* Member Switcher Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-ink-muted font-bold shrink-0">सदस्य बदलें:</span>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-xl bg-paper-dim/60 border border-paper-dim text-ink focus:outline-none focus:border-amber-500"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  👤 {m.name} {m.relationship ? `(${m.relationship})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Avatar Quick Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {members.map(m => {
            const isSelected = m.id === selectedMemberId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMemberId(m.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black scale-102'
                    : 'bg-paper-dim/40 text-ink-muted border-transparent hover:bg-paper-dim/80'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: m.color || '#B98B2A' }}
                >
                  {m.initials || m.name.charAt(0)}
                </div>
                <span className="truncate max-w-[120px]">{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. REIMBURSEMENT WARNING BANNER (INTER-MEMBER LEDGER)    */}
      {/* ======================================================== */}
      {totalPendingToReimburse > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 shadow-sm flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-ink">
                ⚠️ {activeMember.name} के फंड से प्रतिपूर्ति (Reimbursement) बाकी है
              </h4>
              <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">
                परिवार के अन्य सदस्यों ने अपनी जेब से <Mono className="font-black text-amber-500">₹{totalPendingToReimburse.toLocaleString('en-IN')}</Mono> का भुगतान किया है, जिसे इस फंड से लौटाना है।
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {pendingReimbursements.map(({ payment, commitmentTitle }) => (
                  <div key={payment.id} className="text-[10px] bg-paper px-2 py-1 rounded-lg border border-paper-dim flex items-center gap-1.5">
                    <span className="font-bold text-ink">{commitmentTitle}:</span>
                    <span className="text-amber-500 font-mono font-bold">₹{payment.amount.toLocaleString('en-IN')}</span>
                    <span className="text-ink-muted">({getMemberName(payment.paidByMemberId)} को देय)</span>
                    <button
                      type="button"
                      onClick={() => handleMarkReimbursed(payment.commitmentId, payment.id, 'cash')}
                      className="ml-1 text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded hover:bg-emerald-500"
                    >
                      ✓ चुकाया (Cash)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FINANCIAL KPI SUMMARY CARDS (LIVE 4 METRICS)         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* KPI 1: Inflow */}
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">कुल मासिक आवक</span>
            <ArrowUpRight size={15} className="text-emerald-500" />
          </div>
          <div className="text-lg font-mono font-black text-emerald-600">
            ₹{totalMonthlyInflow.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted truncate">
            {currentProfile.incomeStreams?.length || 0} स्रोत (रेंटल, लाभ, ब्याज)
          </p>
        </div>

        {/* KPI 2: Fixed Outflows */}
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">फिक्स्ड कमिटमेंट्स</span>
            <Clock size={15} className="text-blue-500" />
          </div>
          <div className="text-lg font-mono font-black text-ink">
            ₹{currentMonthFixedPaid.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-ink-muted ml-1">/ ₹{totalCommitmentBudget.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-ink-muted">
            {currentProfile.commitments?.length || 0} मासिक तय दायित्व
          </p>
        </div>

        {/* KPI 3: Variable Expenses + Investments */}
        <div className="p-3.5 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[10px] font-bold uppercase tracking-wider">खर्च व निवेश</span>
            <TrendingUp size={15} className="text-purple-500" />
          </div>
          <div className="text-lg font-mono font-black text-purple-600">
            ₹{(currentMonthVariableExpenses + currentMonthInvestments).toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted truncate">
            खर्च: ₹{currentMonthVariableExpenses.toLocaleString('en-IN')} • निवेश: ₹{currentMonthInvestments.toLocaleString('en-IN')}
          </p>
        </div>

        {/* KPI 4: Net Surplus */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-paper to-paper border border-amber-500/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] font-black uppercase tracking-wider">शुद्ध मासिक बचत</span>
            <ShieldCheck size={16} />
          </div>
          <div className="text-lg font-mono font-black text-amber-500">
            ₹{netMonthlySurplus.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-ink-muted">
            {activeMember.name} के पास शेष फंड
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. PILLAR 1: DYNAMIC INCOME STREAMS & SOURCES           */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Coins size={16} className="text-emerald-500" />
              1. मासिक आय व लाभ के स्रोत (Income Streams)
            </h3>
            <p className="text-[11px] text-ink-muted">
              रेंटल प्रॉपर्टी, व्यापारिक मुनाफा, बैंक ब्याज व अन्य आवक
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsIncomeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
          >
            <Plus size={14} /> नया स्रोत जोड़ें
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {currentProfile.incomeStreams?.map(stream => {
            // Live rent check
            let displayAmount = stream.monthlyAmount;
            if (stream.type === 'rental_link' && stream.linkedPropertyId) {
              const prop = rentalProperties.find(p => p.id === stream.linkedPropertyId);
              if (prop) {
                const live = (prop.tenants || []).reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0);
                if (live > 0) displayAmount = live;
              }
            }

            return (
              <div
                key={stream.id}
                className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim hover:border-paper-dim/80 transition-all flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-paper border border-paper-dim shadow-2xs shrink-0 mt-0.5">
                    {getIncomeIcon(stream.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-ink-muted tracking-wider block">
                      {getIncomeLabel(stream.type)}
                    </span>
                    <h4 className="text-xs font-bold text-ink truncate">{stream.title}</h4>
                    {stream.notes && (
                      <p className="text-[10px] text-ink-muted truncate mt-0.5">{stream.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-xs text-emerald-600 block">
                    +₹{displayAmount.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteIncomeStream(stream.id)}
                    className="text-ink-muted hover:text-red-500 text-[10px] mt-1 p-0.5"
                    title="हटाएं"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. PILLAR 2: FIXED RECURRING COMMITMENTS (EMIs/RENTS)   */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              2. तय मासिक दायित्व व लोन EMIs (Fixed Commitments)
            </h3>
            <p className="text-[11px] text-ink-muted">
              सोलर, दुकान लोन, मंडी किराया, नगर पालिका - हर माह स्वतः रोलओवर
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCommitmentModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm hover:bg-amber-400 transition-all self-start sm:self-auto active:scale-95"
          >
            <Plus size={14} /> + नया कमिटमेंट जोड़ें
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {currentProfile.commitments?.map(com => {
            const thisMonthPayment = (com.payments || []).find(p => p.month === currentMonth);
            const isPaid = !!thisMonthPayment;
            const isReimbursed = isPaid ? thisMonthPayment.reimbursed : false;
            const payerMemberName = thisMonthPayment ? getMemberName(thisMonthPayment.paidByMemberId) : getMemberName(com.defaultPayerMemberId);

            return (
              <div
                key={com.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isPaid
                    ? 'bg-paper-dim/20 border-paper-dim'
                    : 'bg-paper border-paper-dim shadow-xs hover:border-amber-500/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left Info */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-paper border border-paper-dim shrink-0 shadow-2xs">
                      {getCommitmentIcon(com.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-ink">{com.title}</h4>
                        {isPaid ? (
                          <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> इस माह चुकता ({thisMonthPayment.date})
                          </span>
                        ) : (
                          <span className="text-[9px] font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock size={11} /> {com.dueDay} तारीख तक देय
                          </span>
                        )}

                        {/* Reimbursement Badge */}
                        {isPaid && !isReimbursed && thisMonthPayment.paidByMemberId !== selectedMemberId && (
                          <span className="text-[9px] font-black bg-rose-500/15 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded-full">
                            ⚠️ {payerMemberName} को ₹{thisMonthPayment.amount} लौटाना बाकी
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-ink-muted mt-0.5">
                        तय राशि: <Mono className="font-bold text-ink">₹{com.amount.toLocaleString('en-IN')}</Mono> • 
                        भुगतानकर्ता: <span className="font-semibold text-ink">{payerMemberName}</span> • 
                        {com.notes || 'मासिक फिक्स्ड दायित्व'}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setHistoryCommitment(com)}
                      className="px-2.5 py-1.5 rounded-xl bg-paper border border-paper-dim text-[11px] font-bold text-ink-muted hover:text-ink hover:bg-paper-dim flex items-center gap-1 transition-all"
                      title="पिछला इतिहास देखें"
                    >
                      <History size={13} /> इतिहास
                    </button>

                    {isPaid ? (
                      <div className="flex items-center gap-1.5">
                        {!isReimbursed && thisMonthPayment.paidByMemberId !== selectedMemberId && (
                          <button
                            type="button"
                            onClick={() => handleMarkReimbursed(com.id, thisMonthPayment.id, 'cash')}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 shadow-sm flex items-center gap-1"
                          >
                            ✓ प्रतिपूर्ति हुई
                          </button>
                        )}
                        <span className="text-xs font-mono font-bold text-emerald-600 px-2">
                          ₹{thisMonthPayment.amount.toLocaleString('en-IN')} ✓
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openPaymentModal(com)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-sm transition-all flex items-center gap-1 active:scale-95"
                      >
                        ✓ भुगतान दर्ज करें
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteCommitment(com.id)}
                      className="text-ink-muted hover:text-red-500 p-1 rounded-lg"
                      title="हटाएं"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. PILLARS 3 & 4: VARIABLE EXPENSES & DIRECT INVESTMENTS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Variable Expenses */}
        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <ShoppingBag size={16} className="text-rose-500" />
                3. परिवर्तनशील / तत्काल खर्च
              </h3>
              <p className="text-[11px] text-ink-muted">
                राशन, मरम्मत, दवाइयाँ, आकस्मिक खर्च
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-paper border border-paper-dim text-xs font-bold text-ink hover:bg-paper-dim flex items-center gap-1"
            >
              <Plus size={13} /> खर्च जोड़ें
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {currentProfile.variableExpenses && currentProfile.variableExpenses.length > 0 ? (
              currentProfile.variableExpenses.map(exp => (
                <div
                  key={exp.id}
                  className="p-2.5 rounded-xl bg-paper-dim/30 border border-paper-dim flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-ink">{exp.title}</h5>
                    <p className="text-[10px] text-ink-muted">
                      {exp.date} • {getMemberName(exp.paidByMemberId)} • {exp.paymentMode.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-500">-₹{exp.amount.toLocaleString('en-IN')}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteVariableExpense(exp.id)}
                      className="text-ink-muted hover:text-red-500 p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-ink-muted text-xs bg-paper-dim/20 rounded-xl">
                इस माह कोई आकस्मिक खर्च दर्ज नहीं है।
              </div>
            )}
          </div>
        </div>

        {/* Right: Direct Investments from Surplus */}
        <div className="p-4 rounded-2xl bg-paper border border-paper-dim shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-500" />
                4. बचत से सीधे निवेश (Wealth Vault)
              </h3>
              <p className="text-[11px] text-ink-muted">
                SIP, सोना, FD, शेयर - सीधे वेल्थ पोर्टफोलियो में सिंक
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsInvestModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 flex items-center gap-1 shadow-sm"
            >
              <Plus size={13} /> + निवेश करें
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {currentProfile.investments && currentProfile.investments.length > 0 ? (
              currentProfile.investments.map(inv => (
                <div
                  key={inv.id}
                  className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-ink flex items-center gap-1.5">
                      <Sparkles size={12} className="text-purple-500" />
                      {inv.title}
                    </h5>
                    <p className="text-[10px] text-ink-muted">
                      {inv.date} • {inv.institution || 'स्वतंत्र निवेश'} • {inv.investmentType.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-purple-600">₹{inv.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] block text-emerald-600 font-bold">✓ तिजोरी में दर्ज</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-ink-muted text-xs bg-paper-dim/20 rounded-xl">
                इस माह की बचत से कोई नया निवेश दर्ज नहीं हुआ है।
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD INCOME STREAM                               */}
      {/* ======================================================== */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Coins size={16} className="text-emerald-500" />
                {activeMember.name} हेतु नया आय स्रोत जोड़ें
              </h3>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleAddIncomeStream} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">स्रोत का प्रकार (Type)</label>
                <select
                  value={incType}
                  onChange={(e) => setIncType(e.target.value as IncomeSourceType)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  <option value="rental_link">🏢 रेंटल संपत्ति से लिंक (Rental Property)</option>
                  <option value="business_profit">🏪 व्यापार / दुकान का मुनाफा (Business Profit)</option>
                  <option value="interest_returns">📈 बैंक ब्याज / FD रिटर्न (Interest / Dividends)</option>
                  <option value="salary">💼 वेतन / सैलरी / पेंशन (Salary)</option>
                  <option value="agri_mandi">🌾 मंडी / कृषि आवक (Mandi / Agriculture)</option>
                  <option value="other">🪙 अन्य आय स्रोत (Other Inflow)</option>
                </select>
              </div>

              {incType === 'rental_link' && rentalProperties.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">संपत्ति चुनें (Select Rental Property)</label>
                  <select
                    value={incPropertyId}
                    onChange={(e) => {
                      const propId = e.target.value;
                      setIncPropertyId(propId);
                      const prop = rentalProperties.find(p => p.id === propId);
                      if (prop) {
                        setIncTitle(`किराया: ${prop.title || prop.name}`);
                        const liveRent = (prop.tenants || []).reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0) || prop.monthly_target_revenue;
                        if (liveRent) setIncAmount(liveRent);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="">-- संपत्ति चुनें --</option>
                    {rentalProperties.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.name} (अनुमानित किराया: ₹{p.monthly_target_revenue || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">स्रोत का शीर्षक / नाम (Title)</label>
                <input
                  type="text"
                  placeholder="e.g. मुख्य दुकान का मुनाफा या SBI FD ब्याज"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक अनुमानित राशि (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">विवरण / नोट (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. हर महीने की 1 तारीख को प्राप्त"
                  value={incNotes}
                  onChange={(e) => setIncNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-sm"
                >
                  ✓ स्रोत जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD RECURRING COMMITMENT                        */}
      {/* ======================================================== */}
      {isCommitmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                नया फिक्स्ड कमिटमेंट / EMI जोड़ें
              </h3>
              <button onClick={() => setIsCommitmentModalOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleAddCommitment} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">कमिटमेंट का नाम (Title)</label>
                <input
                  type="text"
                  placeholder="e.g. कार लोन EMI, बच्चों की फीस, या गोदाम किराया"
                  value={comTitle}
                  onChange={(e) => setComTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">कैटेगरी (Category)</label>
                  <select
                    value={comCategory}
                    onChange={(e) => setComCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="emi_loan">लोन किश्त (EMI)</option>
                    <option value="commercial_rent">दुकान / शेड किराया</option>
                    <option value="utility_tax">नगर पालिका / टैक्स</option>
                    <option value="staff_salary">स्टाफ / मेड वेतन</option>
                    <option value="insurance_sip">बीमा / SIP किश्त</option>
                    <option value="household">घरेलू नियमित खर्च</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक राशि (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={comAmount}
                    onChange={(e) => setComAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">मासिक देय तारीख (Due Day)</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={comDueDay}
                    onChange={(e) => setComDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">प्रायः भुगतानकर्ता (Payer)</label>
                  <select
                    value={comDefaultPayer}
                    onChange={(e) => setComDefaultPayer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">विवरण / नोट (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. बैंक खाता नंबर या चालान विवरण"
                  value={comNotes}
                  onChange={(e) => setComNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCommitmentModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-sm"
                >
                  ✓ कमिटमेंट जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: RECORD PAYMENT FOR A COMMITMENT                 */}
      {/* ======================================================== */}
      {payingCommitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink">
                  {payingCommitment.title} का भुगतान दर्ज करें
                </h3>
                <p className="text-[11px] text-ink-muted">
                  माह: {currentMonth} • देय राशि: ₹{payingCommitment.amount}
                </p>
              </div>
              <button onClick={() => setPayingCommitment(null)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">भुगतान की गई राशि (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">भुगतान की तारीख (Date)</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">किस सदस्य ने दिया?</label>
                  <select
                    value={payByMemberId}
                    onChange={(e) => setPayByMemberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.id === selectedMemberId ? `(फंड संरक्षक)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">माध्यम (Mode)</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="upi">UPI (PhonePe/GPay)</option>
                    <option value="cash">नकद (Cash)</option>
                    <option value="bank_transfer">बैंक ट्रांसफर (NEFT/RTGS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">रिफरेंस / UTR नंबर (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI 4321..."
                    value={payRefNo}
                    onChange={(e) => setPayRefNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono"
                  />
                </div>
              </div>

              {/* Reimbursement Checkbox (if paid by someone else) */}
              {payByMemberId !== selectedMemberId && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-ink">
                    <input
                      type="checkbox"
                      checked={payReimbursedNow}
                      onChange={(e) => setPayReimbursedNow(e.target.checked)}
                      className="rounded text-amber-500"
                    />
                    <span>{activeMember.name} से उसी समय पैसे ले लिए गए हैं</span>
                  </label>
                  <p className="text-[10px] text-ink-muted leading-relaxed">
                    यदि टिक नहीं करेंगे, तो यह सिस्टम में "{getMemberName(payByMemberId)} को प्रतिपूर्ति देय" के रूप में दर्ज रहेगा।
                  </p>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">नोट्स (Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. रसीद पर्ची सुरक्षित है"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingCommitment(null)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-sm"
                >
                  ✓ भुगतान सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: PAYMENT HISTORY TIMELINE                        */}
      {/* ======================================================== */}
      {historyCommitment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <History size={16} className="text-amber-500" />
                  {historyCommitment.title} - भुगतान इतिहास
                </h3>
                <p className="text-[11px] text-ink-muted">
                  तय मासिक राशि: ₹{historyCommitment.amount} • हर माह {historyCommitment.dueDay} तारीख
                </p>
              </div>
              <button onClick={() => setHistoryCommitment(null)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {historyCommitment.payments && historyCommitment.payments.length > 0 ? (
                historyCommitment.payments.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 rounded-xl bg-paper-dim/30 border border-paper-dim flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-ink">माह: {p.month}</span>
                        <span className="text-[10px] text-ink-muted">({p.date})</span>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-0.5">
                        भुगतानकर्ता: <span className="font-semibold text-ink">{getMemberName(p.paidByMemberId)}</span> • 
                        माध्यम: <span className="uppercase font-semibold">{p.paymentMode}</span>
                        {p.referenceNo && ` • UTR: ${p.referenceNo}`}
                      </p>
                      {p.paidByMemberId !== selectedMemberId && (
                        <div className="mt-1">
                          {p.reimbursed ? (
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              ✓ {p.reimbursedDate} को फंड से प्रतिपूर्ति हो गई
                            </span>
                          ) : (
                            <span className="text-[9px] text-rose-500 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                              ⚠️ प्रतिपूर्ति लेना बाकी है
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-emerald-600">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-ink-muted text-xs bg-paper-dim/20 rounded-xl">
                  अभी तक कोई पिछला भुगतान रिकॉर्ड दर्ज नहीं है।
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setHistoryCommitment(null)}
              className="w-full py-2.5 rounded-xl bg-paper-dim text-ink font-bold text-xs"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD VARIABLE EXPENSE                            */}
      {/* ======================================================== */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <ShoppingBag size={16} className="text-rose-500" />
                {activeMember.name} हेतु तत्काल / परिवर्तनशील खर्च जोड़ें
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleAddVariableExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">खर्च का विवरण (Title)</label>
                <input
                  type="text"
                  placeholder="e.g. मासिक राशन, बिजली बिल, या डॉक्टर फीस"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">कैटेगरी (Category)</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="ration_grocery">राशन व किराना</option>
                    <option value="repair_maintenance">मरम्मत व रखरखाव</option>
                    <option value="medical_health">दवाइयाँ व स्वास्थ्य</option>
                    <option value="shopping">कपड़े व खरीदारी</option>
                    <option value="travel">यात्रा व ईंधन</option>
                    <option value="contingency">आकस्मिक खर्च</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">राशि (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">तारीख (Date)</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">माध्यम (Mode)</label>
                  <select
                    value={expMode}
                    onChange={(e) => setExpMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  >
                    <option value="upi">UPI (PhonePe/GPay)</option>
                    <option value="cash">नकद (Cash)</option>
                    <option value="card">कार्ड / अन्य</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">भुगतानकर्ता (Paid By)</label>
                <select
                  value={expPayerId}
                  onChange={(e) => setExpPayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 shadow-sm"
                >
                  ✓ खर्च जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ADD INVESTMENT FROM SURPLUS (WEALTH VAULT SYNC) */}
      {/* ======================================================== */}
      {isInvestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-5 border border-paper-dim space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-500" />
                  बचत से सीधे निवेश करें (Wealth Vault)
                </h3>
                <p className="text-[11px] text-ink-muted">
                  यह निवेश सीधे आपकी पारिवारिक तिजोरी (Assets) में दर्ज होगा
                </p>
              </div>
              <button onClick={() => setIsInvestModalOpen(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>

            <form onSubmit={handleAddInvestment} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">निवेश का प्रकार (Investment Type)</label>
                <select
                  value={invType}
                  onChange={(e) => setInvType(e.target.value as AssetType)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                >
                  <option value="mutual_funds">📈 म्यूचुअल फंड / SIP (Mutual Funds)</option>
                  <option value="gold">🟡 भौतिक सोना / सॉवरेन गोल्ड (Gold)</option>
                  <option value="bank_deposit">🏦 बैंक एफडी / आरडी (Fixed Deposit / RD)</option>
                  <option value="shares">📊 शेयर बाजार / स्टॉक्स (Stocks / Shares)</option>
                  <option value="property">🏢 जमीन / संपत्ति किश्त (Property / Land)</option>
                  <option value="other">🪙 अन्य निवेश (Other)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">स्कीम / निवेश का नाम (Title)</label>
                <input
                  type="text"
                  placeholder="e.g. Parag Parikh Flexi Cap SIP या Post Office FD"
                  value={invTitle}
                  onChange={(e) => setInvTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">निवेश राशि (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink-muted block mb-1">संस्थान / बैंक (Institution)</label>
                  <input
                    type="text"
                    placeholder="e.g. SBI, HDFC, Zerodha"
                    value={invInstitution}
                    onChange={(e) => setInvInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">तारीख (Date)</label>
                <input
                  type="date"
                  value={invDate}
                  onChange={(e) => setInvDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-muted block mb-1">नोट्स (Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. फोलियो नंबर या स्कीम कोड"
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-dim/40 border border-paper-dim text-ink"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInvestModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-paper-dim text-ink font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-500 shadow-sm"
                >
                  ✓ वेल्थ में दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
