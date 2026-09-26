'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem, MedicalRecord, RentalProperty, RentalTenant } from '@/types';
import { initUserScopedStorage, getActiveUser } from '@/lib/storage/userScopedStorage';
import { createClient } from '@/lib/supabase/client';

// Ensure storage scoping is initialized before initial state reads
if (typeof window !== 'undefined') {
  initUserScopedStorage();
}

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-ankush',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Ankush kesharwani',
    relationship: 'Mukhiya (Self)',
    role: 'owner',
    color: '#B98B2A',
    initials: 'A',
    phone: '9425574230',
    permissions: {
      is_admin: true,
      can_view_bills: true,
      can_view_investments: true,
      can_view_medical: true,
      can_view_vault: true,
    },
  },
  {
    id: 'm-1789566304528',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Ganesh Prasad kesharwani',
    relationship: 'Pita (Father)',
    role: 'member',
    color: '#34D399',
    initials: 'G',
    phone: '9425574230',
    dob: '1955-07-01',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
  {
    id: 'm-1789566394503',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Neeta kesharwani',
    relationship: 'Mata (Mother)',
    role: 'member',
    color: '#60A5FA',
    initials: 'N',
    phone: '79873 54040',
    dob: '1966-09-19',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
  {
    id: 'm-1789566826735',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Neha kesharwani',
    relationship: 'Patni (Wife)',
    role: 'member',
    color: '#F472B6',
    initials: 'N',
    phone: '99815 57740',
    dob: '1990-05-27',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
  {
    id: 'm-1789566934699',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Akshay kesharwani',
    relationship: 'Bhai (Brother)',
    role: 'member',
    color: '#FB923C',
    initials: 'A',
    phone: '70009 66921',
    dob: '1990-04-29',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
  {
    id: 'm-1789577732303',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Rupal kesharwani',
    relationship: 'Behen (Sister)',
    role: 'member',
    color: '#34D399',
    initials: 'R',
    phone: '963-094-5896',
    dob: '1985-05-01',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
  {
    id: 'm-1789566869149',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    name: 'Arvi kesharwani',
    relationship: 'Beti (Daughter)',
    role: 'member',
    color: '#A78BFA',
    initials: 'A',
    dob: '2018-03-24',
    permissions: { is_admin: false, can_view_bills: true, can_view_medical: true, can_view_investments: true },
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_REMINDERS: Reminder[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_MEDICAL: MedicalRecord[] = [];

const isDummyMember = (m: any) => {
  if (!m) return true;
  const id = String(m.id || '');
  if (['m-1', 'm-2', 'm-3', 'm-4', 'm-self', 'm-rohan', 'm-priya', 'm-papa', 'm-mummy'].includes(id)) return true;
  const lower = String(m.name || '').toLowerCase().trim();
  if (
    lower === 'rohan' || lower.startsWith('rohan ') ||
    lower === 'priya' || lower.startsWith('priya ') ||
    lower === 'papa' || lower.startsWith('papa ') ||
    lower === 'mummy' || lower.startsWith('mummy ') ||
    lower === 'self (me)'
  ) {
    return true;
  }
  return false;
};

interface FamilyContextType {
  family: Family;
  members: Member[];
  transactions: Transaction[];
  assets: Asset[];
  goals: Goal[];
  reminders: Reminder[];
  documents: DocumentItem[];
  medicalRecords: MedicalRecord[];
  rentalProperties: RentalProperty[];
  rentalTenants: RentalTenant[];
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
  addRentalProperty: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'created_at'>) => void;
  addRentalTenant: (tenant: Omit<RentalTenant, 'id' | 'created_at'>) => void;
  toggleTenantRentStatus: (tenantId: string) => void;
  deleteRentalTenant: (tenantId: string) => void;
  // Computed
  totalWealth: number;
  liquidWealth: number;
  fixedWealth: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalUdharGiven: number;
  totalUdharTaken: number;
  totalRentalIncomePerMonth: number;
  totalSecurityDepositHeld: number;
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
        try {
          const p = JSON.parse(saved);
          if (p && p.name && p.name !== 'Mera Parivar Vault' && p.name !== 'My Family') {
            return p;
          }
        } catch (e) {}
      }
    }
    return {
      id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
      name: 'Ankush Kesharwani Family',
      currency: 'INR',
      invite_code: 'KESHARWANI1',
    };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_members');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter(m => !isDummyMember(m));
            if (cleaned.length > 0) return cleaned;
          }
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

  const [rentalProperties, setRentalProperties] = useState<RentalProperty[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_rental_properties');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: 'prop-kesharwani-1',
        family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
        name: 'पुश्तैनी संपत्ति / हॉस्टल व किराये के फ्लैट',
        type: 'residential_flat',
        address: 'Kesharwani Bhawan',
        total_units: 4,
        monthly_target_rent: 0,
        collected_rent: 0,
        pending_rent: 0,
      }
    ];
  });

  const [rentalTenants, setRentalTenants] = useState<RentalTenant[]>(() => {
    if (typeof window !== 'undefined') {
      // Check both fwa_rental_tenants and fwa_hostel_tenants_v1
      const saved = localStorage.getItem('fwa_rental_tenants') || localStorage.getItem('fwa_hostel_tenants_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter(t => !['ten-1', 'ten-2', 'ten-3'].includes(t.id))
              .map((t: any) => ({
                id: t.id || 'ten-' + Math.random().toString(36).substring(7),
                property_id: t.property_id || 'prop-kesharwani-1',
                room_id: t.room_id || t.roomNumber || 'Room 101',
                bed_number: t.bed_number,
                name: t.name || t.tenantName || 'किरायेदार',
                phone: t.phone || t.tenantPhone || '',
                monthly_rent: Number(t.monthly_rent || t.monthlyRent || 0),
                security_deposit: Number(t.security_deposit || t.securityDeposit || 0),
                joining_date: t.joining_date || t.joiningDate || new Date().toISOString().split('T')[0],
                rent_status: (t.rent_status === 'due' || t.paymentStatus === 'DUE') ? 'due' : 'paid',
                electricity_due: Number(t.electricity_due || t.dueAmount || 0),
                food_included: t.food_included || false,
              }));
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
      const isPurged = localStorage.getItem('fwa_dummy_purged_v8');
      if (!isPurged) {
        const dummyIds = ['m-1', 'm-2', 'm-3', 'm-4', 'm-rohan', 'm-priya', 'm-papa', 'm-mummy', 'm-self'];
        
        // Deep clean any dummy entries in localStorage across all prefixes
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes('member') || k.includes('transactions') || k.includes('assets') || k.includes('goals') || k.includes('hisab'))) {
            try {
              const raw = localStorage.getItem(k);
              if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) {
                  const cleaned = list.filter((item: any) => !isDummyMember(item) && !dummyIds.includes(item?.id));
                  localStorage.setItem(k, JSON.stringify(cleaned));
                }
              }
            } catch (e) {}
          }
        }

        const cleanKey = (key: string, dummyList: string[]) => {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                const cleaned = list.filter((item: any) => !dummyList.includes(item?.id) && !isDummyMember(item));
                localStorage.setItem(key, JSON.stringify(cleaned));
              }
            } catch (e) {}
          }
        };

        cleanKey('fwa_members', dummyIds);
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

        // Explicit clean for family hisab to remove any old dummy entries
        const hisabRaw = localStorage.getItem('fwa_family_hisab_v1');
        if (hisabRaw) {
          try {
            const list = JSON.parse(hisabRaw);
            if (Array.isArray(list)) {
              const cleaned = list.filter((item: any) => {
                const f = String(item?.fromMember || '').toLowerCase();
                const t = String(item?.toMember || '').toLowerCase();
                if (f.includes('rohan') || f.includes('priya') || f.includes('karan') ||
                    t.includes('rohan') || t.includes('priya') || t.includes('karan') ||
                    ['mle-1', 'mle-2', 'mle-3'].includes(item?.id)) {
                  return false;
                }
                return true;
              });
              localStorage.setItem('fwa_family_hisab_v1', JSON.stringify(cleaned));
            }
          } catch (e) {}
        }

        // Remove dummy project if matches proj-1
        const setup = localStorage.getItem('fwa_biz_setup_v1');
        if (setup) {
          try {
            const p = JSON.parse(setup);
            if (p?.id === 'proj-1') localStorage.removeItem('fwa_biz_setup_v1');
          } catch (e) {}
        }

        // Set Ankush Kesharwani Family profile
        const famProfile = {
          id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
          name: 'Ankush Kesharwani Family',
          currency: 'INR',
          invite_code: 'KESHARWANI1',
        };
        localStorage.setItem('fwa_family_profile', JSON.stringify(famProfile));
        localStorage.setItem('fwa_family', JSON.stringify(famProfile));

        localStorage.setItem('fwa_dummy_purged_v8', 'true');
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
            name: m.name,
            relationship: m.relationship || 'Sadasya',
            role: m.role === 'owner' ? 'owner' : 'member',
            color: m.color || '#34D399',
            initials: m.initials || m.name.charAt(0).toUpperCase(),
            phone: m.phone || undefined,
            dob: m.dob || undefined,
            permissions: m.permissions || {
              is_admin: m.role === 'owner',
              can_view_bills: true,
              can_view_investments: true,
              can_view_medical: true,
              can_view_vault: true,
            },
          }));

          // Ensure Ankush kesharwani (Mukhiya) is present at the head
          const hasAnkush = mapped.some((m) => m.name.toLowerCase().includes('ankush'));
          const completeMemberList: Member[] = hasAnkush
            ? mapped
            : [
                {
                  id: 'm-ankush',
                  family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
                  name: 'Ankush kesharwani',
                  relationship: 'Mukhiya (Self)',
                  role: 'owner',
                  color: '#B98B2A',
                  initials: 'A',
                  phone: '9425574230',
                  permissions: {
                    is_admin: true,
                    can_view_bills: true,
                    can_view_investments: true,
                    can_view_medical: true,
                    can_view_vault: true,
                  },
                },
                ...mapped,
              ];

          setMembers(completeMemberList);
          try {
            localStorage.setItem('fwa_members', JSON.stringify(completeMemberList));
          } catch (e) {}

          // Automatically set Family Profile to Ankush Kesharwani Family
          setFamily((prev) => {
            const updated = {
              ...prev,
              id: supaMembers[0]?.family_id || prev.id,
              name: 'Ankush Kesharwani Family',
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

        // 5. Fetch Rental Properties from Supabase
        const { data: supaProps, error: pErr } = await supabase.from('rental_properties').select('*');
        if (!pErr && supaProps && supaProps.length > 0) {
          setRentalProperties((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const p of supaProps) {
              if (!ids.has(p.id)) {
                merged.push({
                  id: p.id,
                  family_id: p.family_id || 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
                  name: p.name || 'पुश्तैनी संपत्ति',
                  type: p.type || 'residential_flat',
                  address: p.address || '',
                  total_floors: p.total_floors,
                  total_units: p.total_units || 1,
                  total_beds: p.total_beds,
                  monthly_target_rent: Number(p.monthly_target_rent || 0),
                  collected_rent: Number(p.collected_rent || 0),
                  pending_rent: Number(p.pending_rent || 0),
                  created_at: p.created_at,
                });
              }
            }
            try { localStorage.setItem('fwa_rental_properties', JSON.stringify(merged)); } catch (e) {}
            return merged;
          });
        }

        // 6. Fetch Rental Tenants from Supabase
        const { data: supaTenants, error: tnErr } = await supabase.from('rental_tenants').select('*');
        if (!tnErr && supaTenants && supaTenants.length > 0) {
          setRentalTenants((prev) => {
            const ids = new Set(prev.map((t) => t.id));
            const merged = [...prev];
            for (const t of supaTenants) {
              if (!ids.has(t.id)) {
                merged.push({
                  id: t.id,
                  property_id: t.property_id || 'prop-kesharwani-1',
                  room_id: t.room_id || 'Room 101',
                  bed_number: t.bed_number,
                  name: t.name,
                  phone: t.phone || '',
                  monthly_rent: Number(t.monthly_rent || 0),
                  security_deposit: Number(t.security_deposit || 0),
                  joining_date: t.joining_date,
                  food_included: t.food_included || false,
                  rent_status: t.rent_status === 'due' ? 'due' : 'paid',
                  electricity_due: Number(t.electricity_due || 0),
                  created_at: t.created_at,
                });
              }
            }
            try {
              localStorage.setItem('fwa_rental_tenants', JSON.stringify(merged));
              localStorage.setItem('fwa_hostel_tenants_v1', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }

        // 7. Auto-push local tenants to Supabase if not yet in Supabase
        if (typeof window !== 'undefined') {
          const localHostel = localStorage.getItem('fwa_rental_tenants') || localStorage.getItem('fwa_hostel_tenants_v1');
          if (localHostel) {
            try {
              const parsed = JSON.parse(localHostel);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const existingSupaIds = new Set((supaTenants || []).map((t: any) => t.id));
                for (const t of parsed) {
                  if (!['ten-1', 'ten-2', 'ten-3'].includes(t.id) && !existingSupaIds.has(t.id)) {
                    supabase.from('rental_tenants').insert({
                      id: t.id,
                      property_id: t.property_id || 'prop-kesharwani-1',
                      room_id: t.room_id || t.roomNumber || 'Room 101',
                      name: t.name || t.tenantName || 'किरायेदार',
                      phone: t.phone || t.tenantPhone || null,
                      monthly_rent: Number(t.monthly_rent || t.monthlyRent || 0),
                      security_deposit: Number(t.security_deposit || t.securityDeposit || 0),
                      joining_date: t.joining_date || t.joiningDate || new Date().toISOString().split('T')[0],
                      rent_status: (t.rent_status === 'due' || t.paymentStatus === 'DUE') ? 'due' : 'paid',
                    }).then();
                  }
                }
              }
            } catch (e) {}
          }
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

  const addRentalProperty = (p: Omit<RentalProperty, 'id' | 'family_id' | 'created_at'>) => {
    const newP: RentalProperty = {
      ...p,
      id: 'prop-' + Date.now(),
      family_id: family.id,
      created_at: new Date().toISOString(),
    };
    const updated = [newP, ...rentalProperties];
    setRentalProperties(updated);
    try { localStorage.setItem('fwa_rental_properties', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('rental_properties').insert({
        id: newP.id,
        family_id: newP.family_id,
        name: newP.name,
        type: newP.type,
        address: newP.address,
        total_units: newP.total_units || 1,
        monthly_target_rent: newP.monthly_target_rent || 0,
      }).then();
    }
  };

  const addRentalTenant = (t: Omit<RentalTenant, 'id' | 'created_at'>) => {
    const newT: RentalTenant = {
      ...t,
      id: 'ten-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newT, ...rentalTenants];
    setRentalTenants(updated);
    try {
      localStorage.setItem('fwa_rental_tenants', JSON.stringify(updated));
      localStorage.setItem('fwa_hostel_tenants_v1', JSON.stringify(updated.map(item => ({
        id: item.id,
        roomNumber: item.room_id,
        tenantName: item.name,
        tenantPhone: item.phone || '',
        monthlyRent: item.monthly_rent,
        securityDeposit: item.security_deposit,
        dueDayOfMonth: 5,
        paymentStatus: item.rent_status === 'paid' ? 'PAID' : 'DUE',
        dueAmount: item.rent_status === 'due' ? item.monthly_rent : 0,
        joiningDate: item.joining_date || new Date().toISOString().split('T')[0],
      }))));
    } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('rental_tenants').insert({
        id: newT.id,
        property_id: newT.property_id || 'prop-kesharwani-1',
        room_id: newT.room_id,
        name: newT.name,
        phone: newT.phone || null,
        monthly_rent: newT.monthly_rent,
        security_deposit: newT.security_deposit,
        joining_date: newT.joining_date || new Date().toISOString().split('T')[0],
        food_included: newT.food_included || false,
        rent_status: newT.rent_status,
        electricity_due: newT.electricity_due || 0,
      }).then();
    }
  };

  const toggleTenantRentStatus = (tenantId: string) => {
    const updated = rentalTenants.map(t => {
      if (t.id === tenantId) {
        const nextStatus: 'paid' | 'due' = t.rent_status === 'paid' ? 'due' : 'paid';
        return { ...t, rent_status: nextStatus };
      }
      return t;
    });
    setRentalTenants(updated);
    try {
      localStorage.setItem('fwa_rental_tenants', JSON.stringify(updated));
      localStorage.setItem('fwa_hostel_tenants_v1', JSON.stringify(updated.map(item => ({
        id: item.id,
        roomNumber: item.room_id,
        tenantName: item.name,
        tenantPhone: item.phone || '',
        monthlyRent: item.monthly_rent,
        securityDeposit: item.security_deposit,
        dueDayOfMonth: 5,
        paymentStatus: item.rent_status === 'paid' ? 'PAID' : 'DUE',
        dueAmount: item.rent_status === 'due' ? item.monthly_rent : 0,
        joiningDate: item.joining_date || new Date().toISOString().split('T')[0],
      }))));
    } catch (e) {}

    const target = updated.find(t => t.id === tenantId);
    if (target) {
      const supabase = createClient();
      if (supabase) {
        supabase.from('rental_tenants').update({
          rent_status: target.rent_status,
        }).eq('id', tenantId).then();
      }
    }
  };

  const deleteRentalTenant = (tenantId: string) => {
    const updated = rentalTenants.filter(t => t.id !== tenantId);
    setRentalTenants(updated);
    try {
      localStorage.setItem('fwa_rental_tenants', JSON.stringify(updated));
      localStorage.setItem('fwa_hostel_tenants_v1', JSON.stringify(updated));
    } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('rental_tenants').delete().eq('id', tenantId).then();
    }
  };

  // Computations
  const liquidWealth = assets
    .filter(a => a.category === 'liquid')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const fixedWealth = assets
    .filter(a => a.category === 'fixed')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const totalRentalIncomePerMonth = rentalTenants.reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);
  const totalSecurityDepositHeld = rentalTenants.reduce((sum, t) => sum + Number(t.security_deposit || 0), 0);

  const totalWealth = liquidWealth + fixedWealth + totalSecurityDepositHeld;

  const totalIncomeThisMonth = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0) + totalRentalIncomePerMonth;

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
        rentalProperties,
        rentalTenants,
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
        addRentalProperty,
        addRentalTenant,
        toggleTenantRentStatus,
        deleteRentalTenant,
        totalWealth,
        liquidWealth,
        fixedWealth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalUdharGiven,
        totalUdharTaken,
        totalRentalIncomePerMonth,
        totalSecurityDepositHeld,
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
