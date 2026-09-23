'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem, MedicalRecord } from '@/types';

export const INITIAL_MEMBERS: Member[] = [
  { id: 'm-papa', family_id: 'fam-1', name: 'Papa', role: 'owner', color: '#B98B2A', initials: 'P' },
  { id: 'm-mummy', family_id: 'fam-1', name: 'Mummy', role: 'member', color: '#8A5A6B', initials: 'M' },
  { id: 'm-rohan', family_id: 'fam-1', name: 'Rohan', role: 'member', color: '#3E6E8E', initials: 'R' },
  { id: 'm-priya', family_id: 'fam-1', name: 'Priya', role: 'member', color: '#5C8A6B', initials: 'Pr' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't-1', family_id: 'fam-1', member_id: 'm-mummy', type: 'expense', amount: 840, category: 'Ghar kharch', mode: 'offline', scope: 'ghar', note: 'Sabzi Mandi', txn_date: new Date().toISOString().split('T')[0] },
  { id: 't-2', family_id: 'fam-1', member_id: 'm-rohan', type: 'expense', amount: 1200, category: 'Bahar kharch', mode: 'offline', scope: 'bahar', note: 'Petrol', txn_date: new Date().toISOString().split('T')[0] },
  { id: 't-3', family_id: 'fam-1', member_id: 'm-papa', type: 'income', amount: 85000, category: 'Salary', mode: 'online', scope: 'ghar', note: 'Salary credited', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-4', family_id: 'fam-1', member_id: 'm-priya', type: 'expense', amount: 3500, category: 'Education', mode: 'online', scope: 'ghar', note: 'Tuition fee', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-5', family_id: 'fam-1', member_id: 'm-priya', type: 'expense', amount: 1450, category: 'Shopping', mode: 'online', scope: 'bahar', note: 'Amazon order', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-6', family_id: 'fam-1', member_id: 'm-papa', type: 'udhar_given', amount: 5000, category: 'Udhar', mode: 'online', scope: 'bahar', note: 'Udhar diya — Chacha ji', udhar_person: 'Chacha ji', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
];

export const INITIAL_ASSETS: Asset[] = [
  { id: 'a-1', family_id: 'fam-1', category: 'liquid', type: 'bank_deposit', label: 'Bank Deposits', value: 840000, color: '#3E6E8E' },
  { id: 'a-2', family_id: 'fam-1', category: 'fixed', type: 'gold', label: 'Gold & Silver', value: 620000, color: '#B98B2A' },
  { id: 'a-3', family_id: 'fam-1', category: 'liquid', type: 'shares', label: 'Shares', value: 458600, color: '#4C7A5E' },
  { id: 'a-4', family_id: 'fam-1', category: 'fixed', type: 'land', label: 'Land / Property', value: 2300000, color: '#8A5A6B' },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g-1', family_id: 'fam-1', title: 'Priya ki Education', target_amount: 500000, saved_amount: 310000, category: 'education' },
  { id: 'g-2', family_id: 'fam-1', title: 'Naya Car', target_amount: 800000, saved_amount: 240000, category: 'vehicle' },
];

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r-1', family_id: 'fam-1', title: 'Car servicing due', category: 'service', due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], color: '#C1502E' },
  { id: 'r-2', family_id: 'fam-1', title: 'Car insurance renewal', category: 'insurance', due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], color: '#B98B2A' },
  { id: 'r-3', family_id: 'fam-1', title: 'Dentist appointment — Mummy', category: 'appointment', due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], color: '#6B7A80' },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'd-1', family_id: 'fam-1', title: 'Car Insurance', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], notes: '12 din me expire', alert: true },
  { id: 'd-2', family_id: 'fam-1', title: 'Health Insurance — Papa', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 240 * 86400000).toISOString().split('T')[0], notes: 'Valid', alert: false },
  { id: 'd-3', family_id: 'fam-1', title: 'Land Documents', category: 'property', file_url: '#', notes: '4 files', alert: false },
  { id: 'd-4', family_id: 'fam-1', title: 'Driving Licence — Rohan', category: 'id_proof', file_url: '#', notes: 'Valid', alert: false },
];

export const INITIAL_MEDICAL: MedicalRecord[] = [
  { id: 'med-1', family_id: 'fam-1', member_id: 'm-papa', member_name: 'Papa', blood_group: 'B+', condition: 'Blood Pressure', medicine_name: 'Telmisartan 40mg', medicine_time: 'Subah khane ke baad (8:30 AM)', notes: 'Regular BP checkup har 2 hafte me' },
  { id: 'med-2', family_id: 'fam-1', member_id: 'm-mummy', member_name: 'Mummy', blood_group: 'O+', condition: 'Thyroid', medicine_name: 'Thyronorm 50mcg', medicine_time: 'Khali pet subah (7:00 AM)', notes: 'Har 3 mahine me TSH test karwayein' },
  { id: 'med-3', family_id: 'fam-1', member_id: 'm-rohan', member_name: 'Rohan', blood_group: 'B+', condition: 'Dust Allergy', medicine_name: 'Levocetirizine', medicine_time: 'Jab zaroorat ho (Raat me)', notes: 'Inhaler / Anti-dust mask' },
  { id: 'med-4', family_id: 'fam-1', member_id: 'm-priya', member_name: 'Priya', blood_group: 'A+', condition: 'None', medicine_name: 'Vitamin D3 & Calcium', medicine_time: 'Hafte me 1 baar (Sunday)', notes: 'General wellness' },
];

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

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  // Quick Add modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Load from localStorage on client side
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem('fwa_transactions');
      if (savedTx) setTransactions(JSON.parse(savedTx));
      const savedAssets = localStorage.getItem('fwa_assets');
      if (savedAssets) setAssets(JSON.parse(savedAssets));
      const savedGoals = localStorage.getItem('fwa_goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      const savedDocs = localStorage.getItem('fwa_documents');
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
    } catch (e) {
      console.warn('LocalStorage load warning', e);
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
    setReminders([...reminders, newR]);
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    const updated = [...assets, newA];
    setAssets(updated);
    try { localStorage.setItem('fwa_assets', JSON.stringify(updated)); } catch (e) {}
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    setMembers([...members, newM]);
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
