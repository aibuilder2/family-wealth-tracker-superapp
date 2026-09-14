const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. lib/hooks/useVoiceInput.ts
save('lib/hooks/useVoiceInput.ts', `'use client';

import { useState, useEffect, useCallback } from 'react';

interface ParsedVoiceExpense {
  amount?: number;
  category?: string;
  note?: string;
  member_name?: string;
}

export function useVoiceInput(onParsed?: (data: ParsedVoiceExpense) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true);
    }
  }, []);

  const parseVoiceText = (text: string): ParsedVoiceExpense => {
    const lower = text.toLowerCase();
    const result: ParsedVoiceExpense = { note: text };

    // 1. Extract amount (look for numbers or "rupaye" / "rupees" / "₹")
    const matchAmt = lower.match(/(?:rupaye|rs|inr|₹|\s|^)(\d+(?:,\d+)*(?:\.\d+)?)/i) || lower.match(/(\d+)/);
    if (matchAmt && matchAmt[1]) {
      result.amount = parseFloat(matchAmt[1].replace(/,/g, ''));
    }

    // 2. Extract Category
    if (lower.includes('sabzi') || lower.includes('ration') || lower.includes('grocery')) {
      result.category = 'Sabzi/Ration';
    } else if (lower.includes('petrol') || lower.includes('fuel') || lower.includes('diesel')) {
      result.category = 'Petrol/Fuel';
    } else if (lower.includes('bill') || lower.includes('bijli') || lower.includes('recharge')) {
      result.category = 'Bills & Recharge';
    } else if (lower.includes('shopping') || lower.includes('kapde') || lower.includes('amazon')) {
      result.category = 'Shopping';
    } else if (lower.includes('dawai') || lower.includes('medicine') || lower.includes('doctor')) {
      result.category = 'Health/Medicine';
    } else if (lower.includes('fees') || lower.includes('tuition') || lower.includes('school') || lower.includes('college')) {
      result.category = 'Education';
    } else if (lower.includes('salary') || lower.includes('kamai')) {
      result.category = 'Salary';
    }

    // 3. Extract Member Name
    if (lower.includes('papa')) result.member_name = 'Papa';
    else if (lower.includes('mummy')) result.member_name = 'Mummy';
    else if (lower.includes('rohan')) result.member_name = 'Rohan';
    else if (lower.includes('priya')) result.member_name = 'Priya';

    return result;
  };

  const startListening = useCallback(() => {
    if (!isSupported) {
      alert('Aapke browser me Voice Speech Recognition support nahi hai. Chrome ya Edge use karein.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Hindi (India) & English mix
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const parsed = parseVoiceText(text);
        if (onParsed) onParsed(parsed);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }, [isSupported, onParsed]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    parseVoiceText,
  };
}
`);

// 2. lib/store/familyStore.tsx
save('lib/store/familyStore.tsx', `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem,
  MedicalRecord, HouseholdStaff, CourtCase, CreditCard, RecurringIncome,
  UtilityBill, CalendarEventItem
} from '@/types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-papa',
    family_id: 'fam-1',
    name: 'Papa',
    role: 'owner',
    color: '#B98B2A',
    initials: 'P',
    dob: '1974-06-15',
    relationship: 'Head of Family',
    anniversary: '1998-11-20',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: true,
      is_admin: true,
    }
  },
  {
    id: 'm-mummy',
    family_id: 'fam-1',
    name: 'Mummy',
    role: 'member',
    color: '#8A5A6B',
    initials: 'M',
    dob: '1978-09-22',
    relationship: 'Mother',
    anniversary: '1998-11-20',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: true,
      is_admin: true,
    }
  },
  {
    id: 'm-rohan',
    family_id: 'fam-1',
    name: 'Rohan',
    role: 'member',
    color: '#3E6E8E',
    initials: 'R',
    dob: '2001-04-10',
    relationship: 'Son',
    permissions: {
      can_view_investments: false,
      can_view_bills: true,
      can_view_vault: false,
      can_view_medical: true,
      can_view_staff: false,
      can_view_cases: false,
      is_admin: false,
    }
  },
  {
    id: 'm-priya',
    family_id: 'fam-1',
    name: 'Priya',
    role: 'member',
    color: '#5C8A6B',
    initials: 'Pr',
    dob: '2005-12-05',
    relationship: 'Daughter',
    permissions: {
      can_view_investments: false,
      can_view_bills: true,
      can_view_vault: false,
      can_view_medical: true,
      can_view_staff: false,
      can_view_cases: false,
      is_admin: false,
    }
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't-1', family_id: 'fam-1', member_id: 'm-mummy', type: 'expense', amount: 840, category: 'Ghar kharch', category_type: 'main_ghar', mode: 'offline', scope: 'ghar', note: 'Sabzi Mandi', time_stamp: '10:15 AM', txn_date: new Date().toISOString().split('T')[0] },
  { id: 't-2', family_id: 'fam-1', member_id: 'm-rohan', type: 'expense', amount: 1200, category: 'Bahar kharch', category_type: 'personal', mode: 'offline', scope: 'bahar', note: 'Petrol', time_stamp: '05:30 PM', txn_date: new Date().toISOString().split('T')[0] },
  { id: 't-3', family_id: 'fam-1', member_id: 'm-papa', type: 'income', amount: 85000, category: 'Salary', mode: 'online', scope: 'ghar', note: 'Salary credited', time_stamp: '09:00 AM', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-4', family_id: 'fam-1', member_id: 'm-priya', type: 'expense', amount: 3500, category: 'Education', category_type: 'child', mode: 'online', scope: 'ghar', note: 'Tuition fee', time_stamp: '04:00 PM', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-5', family_id: 'fam-1', member_id: 'm-priya', type: 'expense', amount: 1450, category: 'Shopping', category_type: 'personal', mode: 'online', scope: 'bahar', note: 'Amazon order', time_stamp: '07:45 PM', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
  { id: 't-6', family_id: 'fam-1', member_id: 'm-papa', type: 'udhar_given', amount: 5000, category: 'Udhar', mode: 'online', scope: 'bahar', note: 'Udhar diya — Chacha ji', udhar_person: 'Chacha ji', time_stamp: '02:30 PM', txn_date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
];

export const INITIAL_RECURRING_INCOME: RecurringIncome[] = [
  { id: 'rec-1', family_id: 'fam-1', member_id: 'm-papa', title: 'Main Market Shop Rent', gross_amount: 22000, expected_day: 5, linked_liability_title: 'Nagar Palika Property Tax & Maintenance', linked_liability_amount: 2500, net_amount: 19500, frequency: 'monthly' },
  { id: 'rec-2', family_id: 'fam-1', member_id: 'm-papa', title: 'Monthly Salary (TCS)', gross_amount: 85000, expected_day: 1, net_amount: 85000, frequency: 'monthly' }
];

export const INITIAL_CREDIT_CARDS: CreditCard[] = [
  { id: 'cc-1', family_id: 'fam-1', member_id: 'm-papa', bank_name: 'HDFC Bank', card_name: 'Regalia Gold', last4: '4192', credit_limit: 300000, current_due: 14200, due_date: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0] },
  { id: 'cc-2', family_id: 'fam-1', member_id: 'm-rohan', bank_name: 'ICICI Bank', card_name: 'Amazon Pay', last4: '8831', credit_limit: 75000, current_due: 3450, due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] }
];

export const INITIAL_UTILITY_BILLS: UtilityBill[] = [
  { id: 'ub-1', family_id: 'fam-1', bill_type: 'electricity', provider: 'State Electricity Board', consumer_no: 'CA-9938210', amount: 3200, due_date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0], is_paid: false },
  { id: 'ub-2', family_id: 'fam-1', bill_type: 'internet', provider: 'Airtel Xstream Fiber', consumer_no: 'AIR-554109', amount: 999, due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], is_paid: false }
];

export const INITIAL_ASSETS: Asset[] = [
  { id: 'a-1', family_id: 'fam-1', category: 'liquid', type: 'bank_deposit', label: 'Bank Deposits (HDFC & SBI)', value: 840000, color: '#3E6E8E' },
  { id: 'a-2', family_id: 'fam-1', category: 'fixed', type: 'gold', label: 'Gold & Silver (Locker)', value: 620000, color: '#B98B2A' },
  { id: 'a-3', family_id: 'fam-1', category: 'liquid', type: 'shares', label: 'Shares & MFs (Reliance, Tata, Nifty)', symbol: 'RELIANCE', quantity: 50, purchase_price: 2400, value: 458600, color: '#4C7A5E' },
  { id: 'a-4', family_id: 'fam-1', category: 'fixed', type: 'land', label: 'Land / Property (Sector 14 House)', value: 2300000, color: '#8A5A6B' },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g-1', family_id: 'fam-1', title: 'Priya ki Education (2032)', target_amount: 1500000, saved_amount: 410000, target_date: '2032-06-30', monthly_contribution: 15000, category: 'education' },
  { id: 'g-2', family_id: 'fam-1', title: 'Naya Car Fund', target_amount: 800000, saved_amount: 240000, target_date: '2027-12-31', monthly_contribution: 20000, category: 'vehicle' },
];

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r-1', family_id: 'fam-1', title: 'Car servicing due', category: 'service', due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], color: '#C1502E' },
  { id: 'r-2', family_id: 'fam-1', title: 'Car insurance renewal', category: 'insurance', due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], color: '#B98B2A' },
  { id: 'r-3', family_id: 'fam-1', title: 'Dentist appointment — Mummy', category: 'appointment', due_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], color: '#6B7A80' },
  { id: 'r-4', family_id: 'fam-1', title: 'Papa & Mummy Anniversary', category: 'birthday', due_date: '2026-11-20', color: '#8A5A6B' }
];

export const INITIAL_STAFF: HouseholdStaff[] = [
  {
    id: 'st-1',
    family_id: 'fam-1',
    name: 'Ramesh Singh',
    role: 'driver',
    monthly_salary: 16000,
    advance_balance: 2000,
    phone: '+91 98765 11223',
    joining_date: '2023-01-10',
    attendance_this_month: { 1: 'present', 2: 'present', 3: 'present', 4: 'absent', 5: 'present' }
  },
  {
    id: 'st-2',
    family_id: 'fam-1',
    name: 'Sunita Bai',
    role: 'maid',
    monthly_salary: 6000,
    advance_balance: 500,
    phone: '+91 98112 33445',
    joining_date: '2022-06-15',
    attendance_this_month: { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present' }
  }
];

export const INITIAL_CASES: CourtCase[] = [
  {
    id: 'cs-1',
    family_id: 'fam-1',
    case_title: 'Ancestral Land Boundary Dispute — Plot 42',
    case_number: 'CS/2024/8891',
    court_name: 'District & Sessions Court, Delhi',
    judge_advocate_name: 'Adv. S. K. Gupta',
    current_status: 'Evidence Stage',
    next_hearing_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    summary: 'Purani ancestral zameen ke hisse aur boundary verification ka case.',
    hearings: [
      {
        id: 'h-1',
        case_id: 'cs-1',
        hearing_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
        result_notes: 'Patwari report submit hui. Agli date par witness statement record hoga.',
        next_hearing_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
        documents_filed: ['Registry Copy', 'Revenue Map 1982']
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'd-1', family_id: 'fam-1', title: 'Car Insurance (HDFC Ergo)', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], policy_number: 'POL-9938210', provider: 'HDFC ERGO', premium_amount: 14500, nominee: 'Mummy', agent_contact: '+91 98765 00000', notes: '12 din me expire', alert: true },
  { id: 'd-2', family_id: 'fam-1', title: 'Health Insurance — Family Floater', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 240 * 86400000).toISOString().split('T')[0], policy_number: 'STAR-HEALTH-441', provider: 'Star Health', premium_amount: 28000, nominee: 'Papa', notes: 'Valid', alert: false },
  { id: 'd-3', family_id: 'fam-1', title: 'Land Documents & Registry', category: 'property', file_url: '#', notes: '4 files verified', alert: false },
  { id: 'd-4', family_id: 'fam-1', title: 'Driving Licence — Rohan', category: 'id_proof', file_url: '#', expiry_date: '2035-08-10', notes: 'Valid', alert: false },
];

export const INITIAL_MEDICAL: MedicalRecord[] = [
  { id: 'med-1', family_id: 'fam-1', member_id: 'm-papa', member_name: 'Papa', blood_group: 'B+', condition: 'Blood Pressure', medicine_name: 'Telmisartan 40mg', medicine_time: 'Subah khane ke baad (8:30 AM)', notes: 'Regular BP checkup har 2 hafte me', is_verified: true, verified_by: 'Doctor Report', entered_by: 'Papa' },
  { id: 'med-2', family_id: 'fam-1', member_id: 'm-mummy', member_name: 'Mummy', blood_group: 'O+', condition: 'Thyroid', medicine_name: 'Thyronorm 50mcg', medicine_time: 'Khali pet subah (7:00 AM)', notes: 'Har 3 mahine me TSH test karwayein', is_verified: true, verified_by: 'Dr Lal Pathlabs', entered_by: 'Mummy' },
  { id: 'med-3', family_id: 'fam-1', member_id: 'm-rohan', member_name: 'Rohan', blood_group: 'B+', condition: 'Dust Allergy', medicine_name: 'Levocetirizine', medicine_time: 'Jab zaroorat ho (Raat me)', notes: 'Inhaler / Anti-dust mask', is_verified: false, entered_by: 'Mummy' },
  { id: 'med-4', family_id: 'fam-1', member_id: 'm-priya', member_name: 'Priya', blood_group: 'A+', condition: 'None', medicine_name: 'Vitamin D3 & Calcium', medicine_time: 'Hafte me 1 baar (Sunday)', notes: 'General wellness', is_verified: true, verified_by: 'Health Checkup', entered_by: 'Papa' },
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
  staff: HouseholdStaff[];
  courtCases: CourtCase[];
  creditCards: CreditCard[];
  recurringIncomes: RecurringIncome[];
  utilityBills: UtilityBill[];
  activeMemberId: string | null;
  currentUserId: string; // for simulating admin vs member role
  setCurrentUserId: (id: string) => void;
  setActiveMemberId: (id: string | null) => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'family_id'>) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'family_id'>) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'family_id'>) => void;
  addMember: (member: Omit<Member, 'id' | 'family_id'>) => void;
  updateMemberPermissions: (memberId: string, perms: Partial<Member['permissions']>) => void;
  markStaffAttendance: (staffId: string, day: number, status: 'present' | 'absent' | 'half_day' | 'leave') => void;
  addStaffPayment: (staffId: string, amount: number, type: 'salary' | 'advance' | 'bonus') => void;
  addCourtCase: (c: Omit<CourtCase, 'id' | 'family_id' | 'hearings'>) => void;
  addCourtHearing: (caseId: string, hearing: Omit<CourtHearing, 'id' | 'case_id'>) => void;
  toggleMedicalVerification: (id: string) => void;
  triggerEmergencySOS: () => { success: boolean; message: string };

  // Computed
  totalWealth: number;
  liquidWealth: number;
  fixedWealth: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalUdharGiven: number;
  totalUdharTaken: number;
  totalCreditCardDue: number;
  allCalendarEvents: CalendarEventItem[];
  currentUser: Member;
  isAdmin: boolean;

  // Quick Add Modal Trigger
  isQuickAddOpen: boolean;
  quickAddType: 'expense' | 'income' | 'udhar';
  openQuickAdd: (type?: 'expense' | 'income' | 'udhar') => void;
  closeQuickAdd: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family>({
    id: 'fam-1',
    name: 'Sharma Parivar',
    currency: 'INR',
    invite_code: 'SHARMA77',
  });

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [currentUserId, setCurrentUserId] = useState<string>('m-papa'); // Papa = Admin
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL);
  const [staff, setStaff] = useState<HouseholdStaff[]>(INITIAL_STAFF);
  const [courtCases, setCourtCases] = useState<CourtCase[]>(INITIAL_CASES);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(INITIAL_CREDIT_CARDS);
  const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>(INITIAL_RECURRING_INCOME);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>(INITIAL_UTILITY_BILLS);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Load from localStorage
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem('fwa_transactions_v2');
      if (savedTx) setTransactions(JSON.parse(savedTx));
      const savedStaff = localStorage.getItem('fwa_staff');
      if (savedStaff) setStaff(JSON.parse(savedStaff));
      const savedCases = localStorage.getItem('fwa_cases');
      if (savedCases) setCourtCases(JSON.parse(savedCases));
    } catch (e) {}
  }, []);

  const saveTransactions = (newTx: Transaction[]) => {
    setTransactions(newTx);
    try { localStorage.setItem('fwa_transactions_v2', JSON.stringify(newTx)); } catch (e) {}
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      family_id: family.id,
      time_stamp: txData.time_stamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
    };
    saveTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = (g: Omit<Goal, 'id' | 'family_id'>) => {
    const newG: Goal = { ...g, id: 'g-' + Date.now(), family_id: family.id };
    setGoals([...goals, newG]);
  };

  const addReminder = (r: Omit<Reminder, 'id' | 'family_id'>) => {
    const newR: Reminder = { ...r, id: 'r-' + Date.now(), family_id: family.id };
    setReminders([...reminders, newR]);
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    setAssets([...assets, newA]);
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    setMembers([...members, newM]);
  };

  const updateMemberPermissions = (memberId: string, perms: Partial<Member['permissions']>) => {
    setMembers(members.map(m => {
      if (m.id === memberId) {
        return { ...m, permissions: { ...m.permissions, ...perms } as any };
      }
      return m;
    }));
  };

  const markStaffAttendance = (staffId: string, day: number, status: 'present' | 'absent' | 'half_day' | 'leave') => {
    const updated = staff.map(st => {
      if (st.id === staffId) {
        const att = { ...(st.attendance_this_month || {}), [day]: status };
        return { ...st, attendance_this_month: att };
      }
      return st;
    });
    setStaff(updated);
    try { localStorage.setItem('fwa_staff', JSON.stringify(updated)); } catch (e) {}
  };

  const addStaffPayment = (staffId: string, amount: number, type: 'salary' | 'advance' | 'bonus') => {
    setStaff(staff.map(st => {
      if (st.id === staffId) {
        if (type === 'advance') {
          return { ...st, advance_balance: st.advance_balance + amount };
        }
        if (type === 'salary') {
          // auto deduct advance if any
          return { ...st, advance_balance: Math.max(0, st.advance_balance - 1000) };
        }
      }
      return st;
    }));

    // Record as family expense
    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount,
      category: 'Household Staff',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: `Staff payment (${type})`,
      txn_date: new Date().toISOString().split('T')[0],
    });
  };

  const addCourtCase = (c: Omit<CourtCase, 'id' | 'family_id' | 'hearings'>) => {
    const newCase: CourtCase = {
      ...c,
      id: 'cs-' + Date.now(),
      family_id: family.id,
      hearings: []
    };
    const updated = [...courtCases, newCase];
    setCourtCases(updated);
    try { localStorage.setItem('fwa_cases', JSON.stringify(updated)); } catch (e) {}
  };

  const addCourtHearing = (caseId: string, h: Omit<CourtHearing, 'id' | 'case_id'>) => {
    setCourtCases(courtCases.map(cs => {
      if (cs.id === caseId) {
        const newH: CourtHearing = { ...h, id: 'h-' + Date.now(), case_id: caseId };
        return {
          ...cs,
          next_hearing_date: h.next_hearing_date || cs.next_hearing_date,
          hearings: [newH, ...cs.hearings]
        };
      }
      return cs;
    }));
  };

  const toggleMedicalVerification = (id: string) => {
    setMedicalRecords(medicalRecords.map(rec => {
      if (rec.id === id) {
        return { ...rec, is_verified: !rec.is_verified, verified_by: !rec.is_verified ? 'Doctor / Lab Report' : undefined };
      }
      return rec;
    }));
  };

  const triggerEmergencySOS = () => {
    // Simulate GPS Broadcast
    const msg = `🚨 EMERGENCY SOS: ${currentUser.name} ne emergency alert bheja hai! Current location & Medical info sabhi family members ko broadcast kar di gayi hai.`;
    return { success: true, message: msg };
  };

  const openQuickAdd = (type: 'expense' | 'income' | 'udhar' = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const closeQuickAdd = () => {
    setIsQuickAddOpen(false);
  };

  // Computations
  const currentUser = members.find(m => m.id === currentUserId) || members[0];
  const isAdmin = currentUser.role === 'owner' || currentUser.permissions?.is_admin === true;

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

  const totalCreditCardDue = creditCards.reduce((sum, cc) => sum + Number(cc.current_due || 0), 0);

  // Calendar Aggregation Engine (combines all events)
  const allCalendarEvents: CalendarEventItem[] = [
    // 1. Transactions with timestamps
    ...transactions.map(t => ({
      id: 'cal-tx-' + t.id,
      title: t.note || t.category,
      date: t.txn_date,
      time: t.time_stamp || '12:00 PM',
      type: (t.type === 'income' ? 'income' : 'expense') as any,
      amount: t.amount,
      color: t.type === 'income' ? '#4C7A5E' : '#C1502E',
      member_name: members.find(m => m.id === t.member_id)?.name,
      details: `${t.category} · ${t.mode || 'Online'}`
    })),
    // 2. Reminders
    ...reminders.map(r => ({
      id: 'cal-rem-' + r.id,
      title: r.title,
      date: r.due_date,
      type: 'reminder' as any,
      color: r.color || '#B98B2A',
      details: `Reminder (${r.category})`
    })),
    // 3. Court Hearings
    ...courtCases.map(cs => ({
      id: 'cal-case-' + cs.id,
      title: `Hearing: ${cs.case_title}`,
      date: cs.next_hearing_date,
      time: '10:30 AM',
      type: 'hearing' as any,
      color: '#8A5A6B',
      details: `${cs.court_name} (${cs.case_number})`
    })),
    // 4. Credit Card Dues
    ...creditCards.map(cc => ({
      id: 'cal-cc-' + cc.id,
      title: `Card Bill: ${cc.bank_name} (${cc.last4})`,
      date: cc.due_date,
      type: 'bill' as any,
      amount: cc.current_due,
      color: '#C1502E',
      details: `Credit limit ₹${cc.credit_limit.toLocaleString('en-IN')}`
    })),
    // 5. Member Birthdays
    ...members.filter(m => m.dob).map(m => ({
      id: 'cal-bday-' + m.id,
      title: `🎂 ${m.name} ka Janamdin (Birthday)`,
      date: `${new Date().getFullYear()}-${m.dob?.slice(5)}`,
      type: 'birthday' as any,
      color: '#B98B2A',
      details: `Parivar member: ${m.relationship || m.name}`
    }))
  ];

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
        staff,
        courtCases,
        creditCards,
        recurringIncomes,
        utilityBills,
        activeMemberId,
        currentUserId,
        setCurrentUserId,
        setActiveMemberId,
        addTransaction,
        deleteTransaction,
        addGoal,
        addReminder,
        addAsset,
        addMember,
        updateMemberPermissions,
        markStaffAttendance,
        addStaffPayment,
        addCourtCase,
        addCourtHearing,
        toggleMedicalVerification,
        triggerEmergencySOS,
        totalWealth,
        liquidWealth,
        fixedWealth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalUdharGiven,
        totalUdharTaken,
        totalCreditCardDue,
        allCalendarEvents,
        currentUser,
        isAdmin,
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
`);

console.log('Voice Hook and Updated Family Store written.');
