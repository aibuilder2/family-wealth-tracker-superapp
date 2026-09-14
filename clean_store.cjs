const fs = require('fs');

const storeCode = `'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem,
  MedicalRecord, HouseholdStaff, CourtCase, CourtHearing, CreditCard, RecurringIncome,
  UtilityBill, CalendarEventItem, AgriculturalLand, CropCycle, AgricultureExpense,
  Vehicle, VehicleServiceLog
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

export const INITIAL_AGRI_LANDS: AgriculturalLand[] = [
  {
    id: 'ag-1',
    family_id: 'fam-1',
    member_id: 'm-papa',
    title: 'Nahar Wala Khet (Khet No. 12)',
    location: 'Gram Rampur, Tehsil Sadar',
    area: 5,
    area_unit: 'Bigha',
    farming_type: 'khud',
    current_crop: 'Gehu (Wheat) + Sarson',
    active_cycle: {
      id: 'cc-1',
      land_id: 'ag-1',
      season: 'Rabi (Gehu/Sarson)',
      year: 2026,
      crop_name: 'Sharbati Gehu & Peeli Sarson',
      expenses: [
        { id: 'ae-1', category: 'beej', amount: 4500, date: '2026-05-10', note: 'Certified Wheat seeds' },
        { id: 'ae-2', category: 'khaad', amount: 6200, date: '2026-05-25', note: 'DAP & Urea bags' },
        { id: 'ae-3', category: 'diesel_water', amount: 5400, date: '2026-06-15', note: 'Tube-well electricity & diesel' },
        { id: 'ae-4', category: 'labor', amount: 8000, date: '2026-07-02', note: 'Nirai & spraying labor' }
      ],
      total_expense: 24100,
      crop_yield_quintals: 45,
      mandi_rate_per_quintal: 2350,
      crop_sale_income: 105750,
      govt_bonus_amount: 5000,
      total_income: 110750,
      net_profit: 86650,
      status: 'active'
    }
  },
  {
    id: 'ag-2',
    family_id: 'fam-1',
    member_id: 'm-papa',
    title: 'Gaon Wala Bada Khet (Highway Road)',
    location: 'Gram Shivpur, Main Road',
    area: 8,
    area_unit: 'Acre',
    farming_type: 'theka',
    partner_name: 'Mahender Yadav (Thekedaar)',
    partner_phone: '+91 98765 44332',
    yearly_theka_amount: 160000,
    current_crop: 'Dhaan (Basmati Rice)'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    family_id: 'fam-1',
    member_id: 'm-papa',
    member_name: 'Papa',
    vehicle_type: 'car',
    brand_model: 'Hyundai Creta SX (O)',
    reg_number: 'DL 03 CA 4421',
    purchase_date: '2022-03-15',
    purchase_price: 1650000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'HDFC-ERGO-99410',
    insurance_expiry: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    puc_expiry: new Date(Date.now() + 65 * 86400000).toISOString().split('T')[0],
    service_due_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    notes: 'Family car',
    service_logs: [
      { id: 'sl-1', service_date: '2026-03-10', odometer_km: 24500, cost: 7800, garage_name: 'Hyundai Service Center', details: 'Periodic service + oil change' }
    ]
  },
  {
    id: 'v-2',
    family_id: 'fam-1',
    member_id: 'm-rohan',
    member_name: 'Rohan',
    vehicle_type: 'bike',
    brand_model: 'Royal Enfield Classic 350',
    reg_number: 'DL 08 BK 9021',
    purchase_date: '2023-08-10',
    purchase_price: 225000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'ICICI-LOMBARD-8812',
    insurance_expiry: new Date(Date.now() + 140 * 86400000).toISOString().split('T')[0],
    puc_expiry: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    service_due_date: new Date(Date.now() + 80 * 86400000).toISOString().split('T')[0],
    notes: 'Rohan college bike'
  },
  {
    id: 'v-3',
    family_id: 'fam-1',
    member_id: 'm-mummy',
    member_name: 'Mummy',
    vehicle_type: 'scooter',
    brand_model: 'Honda Activa 6G',
    reg_number: 'DL 04 AB 8812',
    purchase_date: '2021-10-20',
    purchase_price: 85000,
    fuel_type: 'Petrol',
    insurance_policy_no: 'ORIENTAL-INS-3321',
    insurance_expiry: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    notes: 'Market scooty'
  }
];

export const INITIAL_RECURRING_INCOME: RecurringIncome[] = [
  { id: 'rec-1', family_id: 'fam-1', member_id: 'm-papa', title: 'Main Market Shop Rent', gross_amount: 22000, expected_day: 5, linked_liability_title: 'Nagar Palika Tax & Maintenance', linked_liability_amount: 2500, net_amount: 19500, frequency: 'monthly' },
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
  { id: 'a-3', family_id: 'fam-1', category: 'liquid', type: 'shares', label: 'Shares & MFs (Reliance, Tata)', symbol: 'RELIANCE', quantity: 50, purchase_price: 2400, value: 458600, color: '#4C7A5E' },
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
    summary: 'Purani zameen ke hisse aur boundary verification ka case.',
    hearings: [
      {
        id: 'h-1',
        case_id: 'cs-1',
        hearing_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
        result_notes: 'Patwari report submit hui.',
        next_hearing_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
        documents_filed: ['Registry Copy', 'Revenue Map']
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  { id: 'd-1', family_id: 'fam-1', title: 'Car Insurance (HDFC Ergo)', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0], policy_number: 'POL-9938210', provider: 'HDFC ERGO', premium_amount: 14500, nominee: 'Mummy', notes: '12 din me expire', alert: true },
  { id: 'd-2', family_id: 'fam-1', title: 'Health Insurance — Family Floater', category: 'insurance', file_url: '#', expiry_date: new Date(Date.now() + 240 * 86400000).toISOString().split('T')[0], policy_number: 'STAR-HEALTH-441', provider: 'Star Health', premium_amount: 28000, nominee: 'Papa', notes: 'Valid', alert: false },
  { id: 'd-3', family_id: 'fam-1', title: 'Land Documents & Registry', category: 'property', file_url: '#', notes: '4 files verified', alert: false },
  { id: 'd-4', family_id: 'fam-1', title: 'Driving Licence — Rohan', category: 'id_proof', file_url: '#', expiry_date: '2035-08-10', notes: 'Valid', alert: false },
];

export const INITIAL_MEDICAL: MedicalRecord[] = [
  { id: 'med-1', family_id: 'fam-1', member_id: 'm-papa', member_name: 'Papa', blood_group: 'B+', condition: 'Blood Pressure', medicine_name: 'Telmisartan 40mg', medicine_time: 'Subah khane ke baad (8:30 AM)', notes: 'Regular BP checkup', is_verified: true, verified_by: 'Doctor Report', entered_by: 'Papa' },
  { id: 'med-2', family_id: 'fam-1', member_id: 'm-mummy', member_name: 'Mummy', blood_group: 'O+', condition: 'Thyroid', medicine_name: 'Thyronorm 50mcg', medicine_time: 'Khali pet subah (7:00 AM)', notes: 'Har 3 mahine me TSH test', is_verified: true, verified_by: 'Dr Lal Pathlabs', entered_by: 'Mummy' },
  { id: 'med-3', family_id: 'fam-1', member_id: 'm-rohan', member_name: 'Rohan', blood_group: 'B+', condition: 'Dust Allergy', medicine_name: 'Levocetirizine', medicine_time: 'Jab zaroorat ho', notes: 'Anti-dust mask', is_verified: false, entered_by: 'Mummy' },
  { id: 'med-4', family_id: 'fam-1', member_id: 'm-priya', member_name: 'Priya', blood_group: 'A+', condition: 'None', medicine_name: 'Vitamin D3 & Calcium', medicine_time: 'Hafte me 1 baar', notes: 'General wellness', is_verified: true, verified_by: 'Health Checkup', entered_by: 'Papa' },
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
  agriculturalLands: AgriculturalLand[];
  vehicles: Vehicle[];
  activeMemberId: string | null;
  currentUserId: string;
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
  addAgriLand: (land: Omit<AgriculturalLand, 'id' | 'family_id'>) => void;
  addAgriExpense: (landId: string, expense: Omit<AgricultureExpense, 'id'>) => void;
  recordCropHarvest: (landId: string, harvestData: { yield_quintals: number; rate: number; bonus: number; addToIncome: boolean }) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'family_id'>) => void;
  addVehicleServiceLog: (vehicleId: string, log: Omit<VehicleServiceLog, 'id'>) => void;

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

  // Quick Add Modal
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
  const [currentUserId, setCurrentUserId] = useState<string>('m-papa');
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
  const [agriculturalLands, setAgriculturalLands] = useState<AgriculturalLand[]>(INITIAL_AGRI_LANDS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

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
          return { ...st, advance_balance: Math.max(0, st.advance_balance - 1000) };
        }
      }
      return st;
    }));

    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount,
      category: 'Household Staff',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: 'Staff payment (' + type + ')',
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
    const msg = '🚨 EMERGENCY SOS: ' + currentUser.name + ' ne emergency alert bheja hai! Current location & Medical info broadcast kar di gayi hai.';
    return { success: true, message: msg };
  };

  const addAgriLand = (land: Omit<AgriculturalLand, 'id' | 'family_id'>) => {
    const newLand: AgriculturalLand = {
      ...land,
      id: 'ag-' + Date.now(),
      family_id: family.id
    };
    setAgriculturalLands([...agriculturalLands, newLand]);
  };

  const addAgriExpense = (landId: string, expense: Omit<AgricultureExpense, 'id'>) => {
    setAgriculturalLands(agriculturalLands.map(l => {
      if (l.id === landId && l.active_cycle) {
        const newExp: AgricultureExpense = { ...expense, id: 'ae-' + Date.now() };
        const updatedExpenses = [...(l.active_cycle.expenses || []), newExp];
        const totalExp = updatedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const net = (l.active_cycle.total_income || 0) - totalExp;
        return {
          ...l,
          active_cycle: {
            ...l.active_cycle,
            expenses: updatedExpenses,
            total_expense: totalExp,
            net_profit: net
          }
        };
      }
      return l;
    }));
  };

  const recordCropHarvest = (landId: string, harvestData: { yield_quintals: number; rate: number; bonus: number; addToIncome: boolean }) => {
    setAgriculturalLands(agriculturalLands.map(l => {
      if (l.id === landId && l.active_cycle) {
        const cropIncome = harvestData.yield_quintals * harvestData.rate;
        const totalInc = cropIncome + harvestData.bonus;
        const netProf = totalInc - (l.active_cycle.total_expense || 0);

        if (harvestData.addToIncome) {
          addTransaction({
            member_id: l.member_id || currentUserId,
            type: 'income',
            amount: totalInc,
            category: 'Agriculture',
            mode: 'online',
            scope: 'ghar',
            note: 'Fasal Bikri & Bonus (' + l.title + ' - ' + l.active_cycle.crop_name + ')',
            txn_date: new Date().toISOString().split('T')[0]
          });
        }

        return {
          ...l,
          active_cycle: {
            ...l.active_cycle,
            crop_yield_quintals: harvestData.yield_quintals,
            mandi_rate_per_quintal: harvestData.rate,
            crop_sale_income: cropIncome,
            govt_bonus_amount: harvestData.bonus,
            total_income: totalInc,
            net_profit: netProf,
            status: 'completed'
          }
        };
      }
      return l;
    }));
  };

  const addVehicle = (veh: Omit<Vehicle, 'id' | 'family_id'>) => {
    const newVeh: Vehicle = {
      ...veh,
      id: 'v-' + Date.now(),
      family_id: family.id
    };
    setVehicles([...vehicles, newVeh]);
  };

  const addVehicleServiceLog = (vehicleId: string, log: Omit<VehicleServiceLog, 'id'>) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicleId) {
        const newLog: VehicleServiceLog = { ...log, id: 'sl-' + Date.now() };
        return {
          ...v,
          service_logs: [newLog, ...(v.service_logs || [])]
        };
      }
      return v;
    }));

    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount: log.cost,
      category: 'Vehicle Maintenance',
      category_type: 'long_term',
      mode: 'online',
      scope: 'ghar',
      note: 'Vehicle Service (' + log.details + ')',
      txn_date: log.service_date || new Date().toISOString().split('T')[0]
    });
  };

  const openQuickAdd = (type: 'expense' | 'income' | 'udhar' = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const closeQuickAdd = () => {
    setIsQuickAddOpen(false);
  };

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

  const allCalendarEvents: CalendarEventItem[] = [
    ...transactions.map(t => ({
      id: 'cal-tx-' + t.id,
      title: t.note || t.category,
      date: t.txn_date,
      time: t.time_stamp || '12:00 PM',
      type: (t.type === 'income' ? 'income' : 'expense') as any,
      amount: t.amount,
      color: t.type === 'income' ? '#4C7A5E' : '#C1502E',
      member_name: members.find(m => m.id === t.member_id)?.name,
      details: t.category + ' · ' + (t.mode || 'Online')
    })),
    ...reminders.map(r => ({
      id: 'cal-rem-' + r.id,
      title: r.title,
      date: r.due_date,
      type: 'reminder' as any,
      color: r.color || '#B98B2A',
      details: 'Reminder (' + r.category + ')'
    })),
    ...courtCases.map(cs => ({
      id: 'cal-case-' + cs.id,
      title: 'Hearing: ' + cs.case_title,
      date: cs.next_hearing_date,
      time: '10:30 AM',
      type: 'hearing' as any,
      color: '#8A5A6B',
      details: cs.court_name + ' (' + cs.case_number + ')'
    })),
    ...creditCards.map(cc => ({
      id: 'cal-cc-' + cc.id,
      title: 'Card Bill: ' + cc.bank_name + ' (' + cc.last4 + ')',
      date: cc.due_date,
      type: 'bill' as any,
      amount: cc.current_due,
      color: '#C1502E',
      details: 'Credit limit ₹' + cc.credit_limit.toLocaleString('en-IN')
    })),
    ...vehicles.filter(v => v.insurance_expiry).map(v => ({
      id: 'cal-v-ins-' + v.id,
      title: '🛡️ Car/Bike Insurance: ' + v.brand_model,
      date: v.insurance_expiry!,
      type: 'reminder' as any,
      color: '#C1502E',
      details: 'Plate: ' + v.reg_number
    })),
    ...members.filter(m => m.dob).map(m => ({
      id: 'cal-bday-' + m.id,
      title: '🎂 ' + m.name + ' ka Janamdin (Birthday)',
      date: new Date().getFullYear() + '-' + (m.dob ? m.dob.slice(5) : '01-01'),
      type: 'birthday' as any,
      color: '#B98B2A',
      details: 'Parivar member: ' + (m.relationship || m.name)
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
        agriculturalLands,
        vehicles,
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
        addAgriLand,
        addAgriExpense,
        recordCropHarvest,
        addVehicle,
        addVehicleServiceLog,
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
`;

fs.writeFileSync('lib/store/familyStore.tsx', storeCode.trim() + '\n', 'utf8');
console.log('Cleaned and saved lib/store/familyStore.tsx');
