'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem, MedicalRecord } from '@/types';
import { initUserScopedStorage, getActiveUser } from '@/lib/storage/userScopedStorage';

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
      const saved = localStorage.getItem('fwa_family_profile');
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
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = (g: Omit<Goal, 'id' | 'family_id'>) => {
    const newG: Goal = { ...g, id: 'g-' + Date.now(), family_id: family.id };
    const updated = [...goals, newG];
    setGoals(updated);
    try { localStorage.setItem('fwa_goals', JSON.stringify(updated)); } catch (e) {}
  };

  const addReminder = (r: Omit<Reminder, 'id' | 'family_id'>) => {
    const newR: Reminder = { ...r, id: 'r-' + Date.now(), family_id: family.id };
    const updated = [...reminders, newR];
    setReminders(updated);
    try { localStorage.setItem('fwa_reminders', JSON.stringify(updated)); } catch (e) {}
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    const updated = [...assets, newA];
    setAssets(updated);
    try { localStorage.setItem('fwa_assets', JSON.stringify(updated)); } catch (e) {}
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    const updated = [...members, newM];
    setMembers(updated);
    try { localStorage.setItem('fwa_members', JSON.stringify(updated)); } catch (e) {}
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
