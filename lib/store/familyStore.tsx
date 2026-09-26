'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem, MedicalRecord } from '@/types';
import { initUserScopedStorage, getActiveUser } from '@/lib/storage/userScopedStorage';
import { createClient } from '@/lib/supabase/client';

// Ensure storage scoping is initialized before initial state reads
if (typeof window !== 'undefined') {
  initUserScopedStorage();
}

export const INITIAL_MEMBERS: Member[] = [
  { id: 'm-self', family_id: 'fam-1', name: 'Self (Me)', role: 'owner', color: '#B98B2A', initials: 'S' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_REMINDERS: Reminder[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_MEDICAL: MedicalRecord[] = [];

interface FamilyContextType {
  family: Family;
  members: Member[];
  transactions: Transaction[];
  assets: Asset[];
  goals: Goal[];
  reminders: Reminder[];
  documents: DocumentItem[];
  medicalRecords: MedicalRecord[];
  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
  // Actions
  updateFamilyName: (newName: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'family_id'>) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'family_id'>) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'family_id'>) => void;
  addMember: (member: Omit<Member, 'id' | 'family_id'>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'family_id'>) => void;
  deleteDocument: (id: string) => void;
  // Computed
  totalWealth: number;
  liquidWealth: number;
  fixedWealth: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalUdharGiven: number;
  totalUdharTaken: number;
  // Quick Add Modal Trigger
  isQuickAddOpen: boolean;
  quickAddType: 'expense' | 'income' | 'udhar';
  openQuickAdd: (type?: 'expense' | 'income' | 'udhar') => void;
  closeQuickAdd: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_family_profile') || localStorage.getItem('fwa_family');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      id: 'fam-1',
      name: 'Mera Parivar Vault',
      currency: 'INR',
      invite_code: 'PARIVAR1',
    };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_members');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return INITIAL_MEMBERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_transactions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out old dummy transactions (t-1 to t-6)
            return parsed.filter(t => !['t-1', 't-2', 't-3', 't-4', 't-5', 't-6'].includes(t.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_assets');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(a => !['a-1', 'a-2', 'a-3', 'a-4'].includes(a.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_goals');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(g => !['g-1', 'g-2'].includes(g.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_reminders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(r => !['r-1', 'r-2', 'r-3'].includes(r.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_documents');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(d => !['d-1', 'd-2', 'd-3', 'd-4'].includes(d.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_medical_records');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter(m => !['med-1', 'med-2', 'med-3', 'med-4'].includes(m.id));
          }
        } catch (e) {}
      }
    }
    return [];
  });

  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  // Quick Add modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Automatic one-time cleanup of legacy demo/dummy data across all modules
  useEffect(() => {
    try {
      const isPurged = localStorage.getItem('fwa_dummy_purged_v3');
      if (!isPurged) {
        const cleanKey = (key: string, dummyIds: string[]) => {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                const cleaned = list.filter((item: any) => !dummyIds.includes(item?.id));
                localStorage.setItem(key, JSON.stringify(cleaned));
              }
            } catch (e) {}
          }
        };

        cleanKey('fwa_members', ['m-1', 'm-2', 'm-3', 'm-4']);
        cleanKey('fwa_transactions', ['t-1', 't-2', 't-3', 't-4', 't-5', 't-6']);
        cleanKey('fwa_assets', ['a-1', 'a-2', 'a-3', 'a-4']);
        cleanKey('fwa_goals', ['g-1', 'g-2']);
        cleanKey('fwa_reminders', ['r-1', 'r-2', 'r-3']);
        cleanKey('fwa_documents', ['d-1', 'd-2', 'd-3', 'd-4']);
        cleanKey('fwa_medical_records', ['med-1', 'med-2', 'med-3', 'med-4']);
        cleanKey('fwa_bank_loans_v1', ['loan-1', 'loan-2']);
        cleanKey('fwa_investments_v1', ['inv-1', 'inv-2', 'inv-3', 'inv-4']);
        cleanKey('fwa_garage_vehicles_v1', ['veh-1', 'veh-2']);
        cleanKey('fwa_biz_firms_v1', ['firm-1', 'firm-2']);
        cleanKey('fwa_court_cases_v1', ['case-1']);
        cleanKey('fwa_family_hisab_v1', ['mle-1', 'mle-2', 'mle-3']);
        cleanKey('fwa_hospital_episodes_v1', ['ep-1']);
        cleanKey('fwa_trips_v1', ['trip-1']);
        cleanKey('fwa_staff_v1', ['st-1', 'st-2']);
        cleanKey('fwa_agri_v1', ['land-1', 'land-2']);
        cleanKey('fwa_gold_loans_v2', ['g-1', 'g-2']);
        cleanKey('fwa_kitchen_records_v2', ['k-1']);
        cleanKey('fwa_tiffin_customers_v2', ['tif-1', 'tif-2', 'tif-3']);
        cleanKey('fwa_petrol_shifts_v1', ['pmp-1']);
        cleanKey('fwa_hostel_tenants_v1', ['ten-1', 'ten-2', 'ten-3']);
        cleanKey('fwa_crm_leads_v1', ['ld-1', 'ld-2']);
        cleanKey('fwa_transport_vehicles_v2', ['v-1', 'v-2', 'v-3']);
        cleanKey('fwa_transport_trips_v2', ['t-1', 't-2', 't-3', 'trip-1']);
        cleanKey('fwa_udhar_b2b_retail_v6', ['u-1', 'u-2', 'u-3', 'u-4', 'u-5']);
        cleanKey('fwa_const_stages', ['c-1', 'c-2', 'c-3']);
        cleanKey('fwa_const_materials', ['mat-1', 'mat-2', 'mat-3', 'm-1', 'm-2']);
        cleanKey('fwa_const_labour', ['lab-1', 'l-1']);
        cleanKey('fwa_retail_khata_v1', ['s-1', 's-2']);
        cleanKey('fwa_events_shagun_v1', ['sh-1', 'sh-2']);

        // Remove dummy project if matches proj-1
        const setup = localStorage.getItem('fwa_biz_setup_v1');
        if (setup) {
          try {
            const p = JSON.parse(setup);
            if (p?.id === 'proj-1') localStorage.removeItem('fwa_biz_setup_v1');
          } catch (e) {}
        }

        localStorage.setItem('fwa_dummy_purged_v3', 'true');
      }
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
  }, []);

  // Real-time Supabase Fetch and Sync for Live Data
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const loadSupabaseData = async () => {
      try {
        // 1. Fetch real Family Members from Supabase
        const { data: supaMembers, error: mErr } = await supabase
          .from('family_members')
          .select('*');

        if (!mErr && supaMembers && supaMembers.length > 0) {
          const mapped: Member[] = supaMembers.map((m: any) => ({
            id: m.id,
            family_id: m.family_id || 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
            name: m.name + (m.relationship ? ` (${m.relationship})` : ''),
            role: m.role === 'owner' ? 'owner' : 'member',
            color: m.color || '#34D399',
            initials: m.initials || m.name.charAt(0).toUpperCase(),
            phone: m.phone || undefined,
          }));
          setMembers(mapped);
          try {
            localStorage.setItem('fwa_members', JSON.stringify(mapped));
          } catch (e) {}

          // Automatically set Family Profile
          setFamily((prev) => {
            const hasKesharwani = mapped.some((m) => m.name.toLowerCase().includes('kesharwani'));
            const familyName = hasKesharwani ? 'Kesharwani Parivar' : prev.name !== 'Mera Parivar Vault' ? prev.name : 'Kesharwani Parivar';
            const updated = {
              ...prev,
              id: supaMembers[0]?.family_id || prev.id,
              name: familyName,
            };
            try {
              localStorage.setItem('fwa_family_profile', JSON.stringify(updated));
              localStorage.setItem('fwa_family', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }

        // 2. Fetch real Transactions from Supabase
        const { data: supaTx, error: tErr } = await supabase
          .from('transactions')
          .select('*')
          .order('txn_date', { ascending: false });

        if (!tErr && supaTx && supaTx.length > 0) {
          const mappedTx: Transaction[] = supaTx.map((t: any) => ({
            id: t.id,
            family_id: t.family_id || 'fam-1',
            member_id: t.member_id || '',
            type: t.type || 'expense',
            amount: Number(t.amount || 0),
            category: t.category || 'General',
            mode: t.mode || 'online',
            scope: t.scope || 'ghar',
            note: t.note || t.description || t.category || '',
            udhar_person: t.udhar_person || undefined,
            is_settled: t.is_settled || false,
            txn_date: t.txn_date || new Date().toISOString().split('T')[0],
          }));

          setTransactions((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const tx of mappedTx) {
              if (!ids.has(tx.id)) merged.push(tx);
            }
            try {
              localStorage.setItem('fwa_transactions', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        // 3. Fetch Assets from Supabase
        const { data: supaAssets, error: aErr } = await supabase.from('assets').select('*');
        if (!aErr && supaAssets && supaAssets.length > 0) {
          setAssets((prev) => {
            const ids = new Set(prev.map((a) => a.id));
            const merged = [...prev];
            for (const a of supaAssets) {
              if (!ids.has(a.id)) {
                merged.push({
                  id: a.id,
                  family_id: a.family_id || 'fam-1',
                  member_id: a.member_id,
                  category: a.category || 'fixed',
                  type: a.type || 'property',
                  label: a.label || a.name || 'Property',
                  value: Number(a.value || 0),
                  notes: a.notes,
                });
              }
            }
            try {
              localStorage.setItem('fwa_assets', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        // 4. Fetch Goals from Supabase
        const { data: supaGoals, error: gErr } = await supabase.from('goals').select('*');
        if (!gErr && supaGoals && supaGoals.length > 0) {
          setGoals((prev) => {
            const ids = new Set(prev.map((g) => g.id));
            const merged = [...prev];
            for (const g of supaGoals) {
              if (!ids.has(g.id)) {
                merged.push({
                  id: g.id,
                  family_id: g.family_id || 'fam-1',
                  title: g.title,
                  target_amount: Number(g.target_amount || 0),
                  saved_amount: Number(g.saved_amount || 0),
                  target_date: g.target_date,
                  category: g.category,
                });
              }
            }
            try {
              localStorage.setItem('fwa_goals', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      } catch (err) {
        console.warn('Supabase initial fetch info:', err);
      }
    };

    loadSupabaseData();
  }, []);

  // Save changes
  const saveTransactions = (newTx: Transaction[]) => {
    setTransactions(newTx);
    try {
      localStorage.setItem('fwa_transactions', JSON.stringify(newTx));
    } catch (e) {}
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      family_id: family.id,
      created_at: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);

    const supabase = createClient();
    if (supabase) {
      supabase.from('transactions').insert({
        id: newTx.id,
        family_id: newTx.family_id,
        member_id: newTx.member_id,
        type: newTx.type,
        amount: newTx.amount,
        category: newTx.category,
        mode: newTx.mode,
        scope: newTx.scope,
        note: newTx.note,
        udhar_person: newTx.udhar_person,
        txn_date: newTx.txn_date,
      }).then();
    }
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
    const supabase = createClient();
    if (supabase) {
      supabase.from('transactions').delete().eq('id', id).then();
    }
  };

  const addGoal = (g: Omit<Goal, 'id' | 'family_id'>) => {
    const newG: Goal = { ...g, id: 'g-' + Date.now(), family_id: family.id };
    const updated = [...goals, newG];
    setGoals(updated);
    try { localStorage.setItem('fwa_goals', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('goals').insert({
        id: newG.id,
        family_id: newG.family_id,
        title: newG.title,
        target_amount: newG.target_amount,
        saved_amount: newG.saved_amount,
        target_date: newG.target_date || null,
        category: newG.category || 'general',
      }).then();
    }
  };

  const addReminder = (r: Omit<Reminder, 'id' | 'family_id'>) => {
    const newR: Reminder = { ...r, id: 'r-' + Date.now(), family_id: family.id };
    const updated = [...reminders, newR];
    setReminders(updated);
    try { localStorage.setItem('fwa_reminders', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('reminders').insert({
        id: newR.id,
        family_id: newR.family_id,
        title: newR.title,
        category: newR.category,
        due_date: newR.due_date,
        amount: newR.amount || null,
      }).then();
    }
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    const updated = [...assets, newA];
    setAssets(updated);
    try { localStorage.setItem('fwa_assets', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('assets').insert({
        id: newA.id,
        family_id: newA.family_id,
        category: newA.category,
        type: newA.type,
        label: newA.label,
        value: newA.value,
        notes: newA.notes || null,
      }).then();
    }
  };

  const updateFamilyName = (newName: string) => {
    const updated: Family = { ...family, name: newName };
    setFamily(updated);
    try {
      localStorage.setItem('fwa_family_profile', JSON.stringify(updated));
      localStorage.setItem('fwa_family', JSON.stringify(updated));
    } catch (e) {}
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    const updated = [...members, newM];
    setMembers(updated);
    try { localStorage.setItem('fwa_members', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('family_members').insert({
        id: newM.id,
        family_id: newM.family_id,
        name: m.name,
        role: m.role,
        color: m.color,
        initials: m.initials,
        phone: m.phone || null,
      }).then();
    }
  };

  const addDocument = (d: Omit<DocumentItem, 'id' | 'family_id'>) => {
    const newD: DocumentItem = { ...d, id: 'doc-' + Date.now(), family_id: family.id };
    const updated = [newD, ...documents];
    setDocuments(updated);
    try { localStorage.setItem('fwa_documents', JSON.stringify(updated)); } catch (e) {}
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    try { localStorage.setItem('fwa_documents', JSON.stringify(updated)); } catch (e) {}
  };

  const openQuickAdd = (type: 'expense' | 'income' | 'udhar' = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const closeQuickAdd = () => {
    setIsQuickAddOpen(false);
  };

  // Computations
  const liquidWealth = assets
    .filter(a => a.category === 'liquid')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const fixedWealth = assets
    .filter(a => a.category === 'fixed')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const totalWealth = liquidWealth + fixedWealth;

  const totalIncomeThisMonth = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenseThisMonth = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalUdharGiven = transactions
    .filter(t => t.type === 'udhar_given')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalUdharTaken = transactions
    .filter(t => t.type === 'udhar_taken')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <FamilyContext.Provider
      value={{
        family,
        members,
        transactions,
        assets,
        goals,
        reminders,
        documents,
        medicalRecords,
        activeMemberId,
        setActiveMemberId,
        updateFamilyName,
        addTransaction,
        deleteTransaction,
        addGoal,
        addReminder,
        addAsset,
        addMember,
        addDocument,
        deleteDocument,
        totalWealth,
        liquidWealth,
        fixedWealth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalUdharGiven,
        totalUdharTaken,
        isQuickAddOpen,
        quickAddType,
        openQuickAdd,
        closeQuickAdd,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamilyStore() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error('useFamilyStore must be used within a FamilyProvider');
  }
  return ctx;
}
