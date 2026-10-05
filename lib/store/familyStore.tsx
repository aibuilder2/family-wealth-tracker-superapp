'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem, MedicalRecord,
  RentalProperty, RentalTenant, HostelRoom, HostelBed, RentalExpense, RentDiversionRule,
  HouseholdStaff, LoanLiability, LoanDocument
} from '@/types';
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

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-prop-1',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 1: मुख्य कमर्शियल दुकान 1',
    value: 3000000,
    notes: 'rent-prop-1 | मासिक किराया: ₹17,000/माह',
  },
  {
    id: 'ast-prop-2',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 2: कमर्शियल दुकान / ऑफिस 2',
    value: 2400000,
    notes: 'rent-prop-2 | मासिक किराया: ₹12,000/माह',
  },
  {
    id: 'ast-prop-3',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 3: आवासीय पोर्शन / फ्लैट 1',
    value: 2000000,
    notes: 'rent-prop-3 | मासिक किराया: ₹10,000/माह',
  },
  {
    id: 'ast-prop-4',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 4: आवासीय पोर्शन / फ्लैट 2',
    value: 2000000,
    notes: 'rent-prop-4 | मासिक किराया: ₹10,000/माह',
  },
  {
    id: 'ast-prop-5',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 5: हॉस्टल रूम्स / रेंटल सेट',
    value: 1800000,
    notes: 'rent-prop-5 | मासिक किराया: ₹9,000/माह',
  },
  {
    id: 'ast-prop-6',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    category: 'fixed',
    type: 'property',
    label: 'संपत्ति 6: गोदाम / स्वतंत्र स्पेस',
    value: 1800000,
    notes: 'rent-prop-6 | मासिक किराया: ₹9,000/माह (मूल ₹8,000 + ₹1,000)',
  },
];

export const INITIAL_RENTAL_PROPERTIES: RentalProperty[] = [
  {
    id: 'rent-prop-1',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 1: मुख्य कमर्शियल दुकान 1',
    name: 'संपत्ति 1: मुख्य कमर्शियल दुकान 1',
    property_type: 'commercial_shop',
    type: 'commercial_shop',
    address: 'दुकान नंबर 1, मुख्य बाजार',
    city: 'City Center',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    property_size: 450,
    size_unit: 'sqft',
    estimated_market_value: 3000000,
    purchase_price: 1800000,
    purchase_date: '2019-04-10',
    registration_deed_no: 'REG/MAIN/SHOP1',
    annual_appreciation_rate: 10,
    monthly_target_revenue: 17000,
    monthly_target_rent: 17000,
    collected_rent: 17000,
    pending_rent: 0,
    security_deposit_holding: 34000,
    notes: 'मुख्य कमर्शियल दुकान - रजिस्टर्ड रेंट एग्रीमेंट',
    tenants: [
      {
        id: 't-prop-1',
        property_id: 'rent-prop-1',
        room_id: 'संपत्ति 1 (कमर्शियल दुकान 1)',
        room_number: 'दुकान 1',
        name: 'किरायेदार 1 (दुकान 1)',
        phone: '',
        monthly_rent: 17000,
        security_deposit: 34000,
        rent_due_day: 5,
        rent_status: 'paid',
        joining_date: '2026-01-01',
        agreement_duration_months: 11
      }
    ],
    expenses: [],
    rent_diversions: [
      {
        id: 'rdiv-p1-1',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'percentage',
        split_value: 50,
        purpose: 'बैंक RD बचत निवेश (Bank RD)',
        allocation_target: 'fd_rd_investment',
        payment_mode: 'bank_transfer'
      },
      {
        id: 'rdiv-p1-2',
        target_member_id: 'm-1789566869148',
        target_member_name: 'Pooja kesharwani',
        split_type: 'percentage',
        split_value: 50,
        purpose: 'घर का राशन व मासिक खर्च (Ghar Ration)',
        allocation_target: 'ghar_ration_expense',
        payment_mode: 'upi'
      }
    ]
  },
  {
    id: 'rent-prop-2',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 2: कमर्शियल दुकान / ऑफिस 2',
    name: 'संपत्ति 2: कमर्शियल दुकान / ऑफिस 2',
    property_type: 'commercial_shop',
    type: 'commercial_shop',
    address: 'दुकान/ऑफिस 2, प्रथम तल',
    city: 'City Center',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    property_size: 380,
    size_unit: 'sqft',
    estimated_market_value: 2400000,
    purchase_price: 1500000,
    purchase_date: '2020-08-15',
    registration_deed_no: 'REG/MAIN/SHOP2',
    annual_appreciation_rate: 10,
    monthly_target_revenue: 12000,
    monthly_target_rent: 12000,
    collected_rent: 12000,
    pending_rent: 0,
    security_deposit_holding: 24000,
    notes: 'कमर्शियल ऑफिस स्पेस',
    tenants: [
      {
        id: 't-prop-2',
        property_id: 'rent-prop-2',
        room_id: 'संपत्ति 2 (कमर्शियल दुकान / ऑफिस 2)',
        room_number: 'दुकान 2',
        name: 'किरायेदार 2 (ऑफिस 2)',
        phone: '',
        monthly_rent: 12000,
        security_deposit: 24000,
        rent_due_day: 5,
        rent_status: 'paid',
        joining_date: '2026-01-01',
        agreement_duration_months: 11
      }
    ],
    expenses: [],
    rent_diversions: [
      {
        id: 'rdiv-p2-1',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'fixed_amount',
        split_value: 12000,
        purpose: 'व्यापारिक री-इन्वेस्टमेंट व कैपिटल फंड',
        allocation_target: 'member_personal',
        payment_mode: 'bank_transfer'
      }
    ]
  },
  {
    id: 'rent-prop-3',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 3: आवासीय पोर्शन / फ्लैट 1',
    name: 'संपत्ति 3: आवासीय पोर्शन / फ्लैट 1',
    property_type: 'residential_flat',
    type: 'residential_flat',
    address: 'फ्लैट 1, आवासीय विंग',
    city: 'City Center',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    property_size: 850,
    size_unit: 'sqft',
    estimated_market_value: 2000000,
    purchase_price: 1200000,
    purchase_date: '2021-03-20',
    registration_deed_no: 'REG/FLAT/01',
    annual_appreciation_rate: 8,
    monthly_target_revenue: 10000,
    monthly_target_rent: 10000,
    collected_rent: 10000,
    pending_rent: 0,
    security_deposit_holding: 20000,
    notes: 'पारिवारिक 2BHK फ्लैट',
    tenants: [
      {
        id: 't-prop-3',
        property_id: 'rent-prop-3',
        room_id: 'संपत्ति 3 (आवासीय पोर्शन / फ्लैट 1)',
        room_number: 'फ्लैट 1',
        name: 'किरायेदार 3 (फ्लैट 1)',
        phone: '',
        monthly_rent: 10000,
        security_deposit: 20000,
        rent_due_day: 5,
        rent_status: 'paid',
        joining_date: '2026-01-01',
        agreement_duration_months: 11
      }
    ],
    expenses: [],
    rent_diversions: [
      {
        id: 'rdiv-p3-1',
        target_member_id: 'm-1789566869148',
        target_member_name: 'Pooja kesharwani',
        split_type: 'fixed_amount',
        split_value: 10000,
        purpose: 'घरेलू बचत व बेटी (Arvi) एजुकेशन फंड',
        allocation_target: 'fd_rd_investment',
        payment_mode: 'bank_transfer'
      }
    ]
  },
  {
    id: 'rent-prop-4',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 4: आवासीय पोर्शन / फ्लैट 2',
    name: 'संपत्ति 4: आवासीय पोर्शन / फ्लैट 2',
    property_type: 'residential_flat',
    type: 'residential_flat',
    address: 'फ्लैट 2, आवासीय विंग',
    city: 'City Center',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    property_size: 850,
    size_unit: 'sqft',
    estimated_market_value: 2000000,
    purchase_price: 1200000,
    purchase_date: '2021-03-20',
    registration_deed_no: 'REG/FLAT/02',
    annual_appreciation_rate: 8,
    monthly_target_revenue: 10000,
    monthly_target_rent: 10000,
    collected_rent: 10000,
    pending_rent: 0,
    security_deposit_holding: 20000,
    notes: 'पारिवारिक 2BHK फ्लैट',
    tenants: [
      {
        id: 't-prop-4',
        property_id: 'rent-prop-4',
        room_id: 'संपत्ति 4 (आवासीय पोर्शन / फ्लैट 2)',
        room_number: 'फ्लैट 2',
        name: 'किरायेदार 4 (फ्लैट 2)',
        phone: '',
        monthly_rent: 10000,
        security_deposit: 20000,
        rent_due_day: 5,
        rent_status: 'paid',
        joining_date: '2026-01-01',
        agreement_duration_months: 11
      }
    ],
    expenses: [],
    rent_diversions: [
      {
        id: 'rdiv-p4-1',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'fixed_amount',
        split_value: 10000,
        purpose: 'पारिवारिक मेडिकल व इमरजेंसी फंड',
        allocation_target: 'member_personal',
        payment_mode: 'bank_transfer'
      }
    ]
  },
  {
    id: 'rent-prop-5',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 5: हॉस्टल रूम्स / रेंटल सेट',
    name: 'संपत्ति 5: हॉस्टल रूम्स / रेंटल सेट',
    property_type: 'pg_hostel',
    type: 'pg_hostel',
    address: 'हॉस्टल विंग, प्रथम तल',
    city: 'City Center',
    total_units_or_rooms: 1,
    total_capacity_beds: 2,
    has_hostel_model: true,
    property_size: 800,
    size_unit: 'sqft',
    estimated_market_value: 1800000,
    purchase_price: 900000,
    purchase_date: '2021-06-01',
    annual_appreciation_rate: 10,
    monthly_target_revenue: 9000,
    monthly_target_rent: 9000,
    collected_rent: 9000,
    pending_rent: 0,
    security_deposit_holding: 18000,
    notes: 'हॉस्टल रूम्स व बेड मॉडल (मेस व सब-मीटर बिजली सहित)',
    rooms: [
      {
        id: 'rm-101',
        room_number: 'Room 101',
        floor: '1st Floor',
        sharing_type: 'double',
        total_beds: 2,
        sub_meter_last_reading: 240,
        sub_meter_current_reading: 290,
        electricity_rate_per_unit: 9,
        beds: [
          { id: 'b-101a', room_number: '101', bed_number: 'Bed A', monthly_rent: 4500, status: 'occupied', current_tenant_name: 'किरायेदार छात्र 1', food_included: true },
          { id: 'b-101b', room_number: '101', bed_number: 'Bed B', monthly_rent: 4500, status: 'occupied', current_tenant_name: 'किरायेदार छात्र 2', food_included: true }
        ]
      }
    ],
    tenants: [
      {
        id: 't-prop-5a',
        property_id: 'rent-prop-5',
        room_id: 'संपत्ति 5: हॉस्टल रूम्स / रेंटल सेट (Bed A)',
        room_number: 'Room 101',
        bed_number: 'Bed A',
        name: 'किरायेदार 5A (छात्र 1)',
        phone: '',
        monthly_rent: 4500,
        security_deposit: 9000,
        rent_due_day: 5,
        rent_status: 'paid',
        food_included: true,
        electricity_due: 225,
        joining_date: '2026-01-01'
      },
      {
        id: 't-prop-5b',
        property_id: 'rent-prop-5',
        room_id: 'संपत्ति 5: हॉस्टल रूम्स / रेंटल सेट (Bed B)',
        room_number: 'Room 101',
        bed_number: 'Bed B',
        name: 'किरायेदार 5B (छात्र 2)',
        phone: '',
        monthly_rent: 4500,
        security_deposit: 9000,
        rent_due_day: 5,
        rent_status: 'paid',
        food_included: true,
        electricity_due: 225,
        joining_date: '2026-01-01'
      }
    ],
    expenses: [
      { id: 'exp-h1', property_id: 'rent-prop-5', category: 'wifi_internet', amount: 800, date: '2026-09-01', note: 'Wi-Fi Plan' }
    ],
    rent_diversions: [
      {
        id: 'rdiv-p5-1',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'fixed_amount',
        split_value: 5000,
        purpose: 'मेस राशन व हॉस्टल बिजली मेंटेनेंस',
        allocation_target: 'ghar_ration_expense',
        payment_mode: 'cash'
      },
      {
        id: 'rdiv-p5-2',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'fixed_amount',
        split_value: 4000,
        purpose: 'हॉस्टल शुद्ध व्यावसायिक मुनाफा',
        allocation_target: 'member_personal',
        payment_mode: 'bank_transfer'
      }
    ]
  },
  {
    id: 'rent-prop-6',
    family_id: 'fam-d9c05204-02ae-4aed-9637-a13391f4c02a',
    owner_member_name: 'Ankush kesharwani',
    title: 'संपत्ति 6: गोदाम / स्वतंत्र स्पेस',
    name: 'संपत्ति 6: गोदाम / स्वतंत्र स्पेस',
    property_type: 'warehouse_godown',
    type: 'warehouse_godown',
    address: 'गोदाम स्पेस, ग्राउंड फ्लोर रियर',
    city: 'City Center',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    property_size: 1100,
    size_unit: 'sqft',
    estimated_market_value: 1800000,
    purchase_price: 1000000,
    purchase_date: '2022-01-15',
    registration_deed_no: 'REG/GDN/01',
    annual_appreciation_rate: 9,
    monthly_target_revenue: 9000,
    monthly_target_rent: 9000,
    collected_rent: 9000,
    pending_rent: 0,
    security_deposit_holding: 18000,
    notes: 'स्वतंत्र स्टोरेज/गोदाम स्पेस (मूल ₹8,000 + ₹1,000 अतिरिक्त)',
    tenants: [
      {
        id: 't-prop-6',
        property_id: 'rent-prop-6',
        room_id: 'संपत्ति 6: गोदाम / स्वतंत्र स्पेस',
        room_number: 'गोदाम',
        name: 'किरायेदार 6 (गोदाम)',
        phone: '',
        monthly_rent: 9000,
        security_deposit: 18000,
        rent_due_day: 5,
        rent_status: 'paid',
        joining_date: '2026-01-01',
        agreement_duration_months: 11
      }
    ],
    expenses: [],
    rent_diversions: [
      {
        id: 'rdiv-p6-1',
        target_member_id: 'm-1789566869147',
        target_member_name: 'Ankush kesharwani',
        split_type: 'fixed_amount',
        split_value: 9000,
        purpose: 'प्रॉपर्टी निर्माण व संचय फंड',
        allocation_target: 'fd_rd_investment',
        payment_mode: 'bank_transfer'
      }
    ]
  },
];

export const INITIAL_RENTAL_TENANTS: RentalTenant[] = INITIAL_RENTAL_PROPERTIES.flatMap(p => p.tenants || []);

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
  loans: LoanLiability[];
  activeMemberId: string | null;
  setActiveMemberId: (id: string | null) => void;
  // Actions
  updateFamilyName: (newName: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'family_id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'family_id'>) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'family_id'>) => void;
  addMember: (member: Omit<Member, 'id' | 'family_id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'family_id'>) => void;
  deleteDocument: (id: string) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  addLoan: (loan: Omit<LoanLiability, 'id' | 'family_id' | 'created_at'>) => void;
  updateLoan: (id: string, updates: Partial<LoanLiability>) => void;
  deleteLoan: (id: string) => void;
  closeLoan: (id: string, closureData: { closed_date: string; closure_notes?: string; documents?: LoanDocument[] }) => void;
  reopenLoan: (id: string, outstandingBalance?: number) => void;
  addLoanDocument: (loanId: string, doc: Omit<LoanDocument, 'id' | 'uploaded_at'>) => void;
  deleteLoanDocument: (loanId: string, docId: string) => void;
  currentUserId: string;
  staff: HouseholdStaff[];

  // Rental & Hostel ERP Methods
  addRentalProperty: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'created_at' | 'tenants' | 'expenses'> & { tenants?: RentalTenant[]; expenses?: RentalExpense[] }) => RentalProperty;
  addRentalPropertyWithTenant: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>, tenant?: Omit<RentalTenant, 'id' | 'property_id'>) => RentalProperty;
  updateRentalProperty: (propertyId: string, updates: Partial<RentalProperty>) => void;
  deleteRentalProperty: (propertyId: string) => void;
  transferRentalProperty: (propertyId: string, toMemberId: string, details: { transfer_date: string; notes?: string }) => void;
  sellRentalProperty: (propertyId: string, details: { sold_to_name: string; sold_price: number; sold_date: string; capital_gain?: number; notes?: string }) => void;
  addHostelRoom: (propertyId: string, room: Omit<HostelRoom, 'id'>) => void;
  addRentalTenant: (propertyIdOrTenant: string | Omit<RentalTenant, 'id' | 'created_at'>, tenant?: Omit<RentalTenant, 'id' | 'property_id'>) => void;
  updateRentalTenant: (propertyIdOrTenant: string | RentalTenant, tenantId?: string, updates?: Partial<RentalTenant>) => void;
  deleteRentalTenant: (propertyIdOrTenantId: string, tenantId?: string) => void;
  toggleTenantRentStatus: (tenantId: string) => void;
  vacateAndSettleTenant: (propertyId: string, tenantId: string, settlement: { final_meter_reading: number; final_electricity_charge: number; final_damage_deduction: number; final_advance_refunded: number; vacate_date: string; reason?: string; notes?: string }) => void;
  collectRentPayment: (propertyId: string, tenantId: string, amount: number, isPaid: boolean, details?: { payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque'; payment_date?: string; payment_time?: string; transaction_id?: string; maintenance_deduction?: number; damage_deduction?: number; notes?: string }) => void;
  addRentalExpense: (propertyId: string, expense: Omit<RentalExpense, 'id' | 'property_id'>) => void;
  deleteRentalExpense: (propertyId: string, expenseId: string) => void;
  addRentDiversion: (propertyId: string, rule: Omit<RentDiversionRule, 'id'>) => void;
  updateRentDiversion: (propertyId: string, ruleId: string, updates: Partial<RentDiversionRule>) => void;
  deleteRentDiversion: (propertyId: string, ruleId: string) => void;
  executeRentDiversion: (propertyId: string, ruleId: string, customAmount?: number) => { success: boolean; message: string };
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
  totalLoansOutstanding: number;
  totalMonthlyEmi: number;
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
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return INITIAL_ASSETS;
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

  const [loans, setLoans] = useState<LoanLiability[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_loans_liabilities_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
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

  const [staff, setStaff] = useState<HouseholdStaff[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fwa_staff_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
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
          if (Array.isArray(parsed) && parsed.length >= 6) {
            const hasDiversions = parsed.some((p: any) => p.rent_diversions && p.rent_diversions.length > 0);
            if (hasDiversions) return parsed;
          }
        } catch (e) {}
      }
    }
    return INITIAL_RENTAL_PROPERTIES;
  });

  const [rentalTenants, setRentalTenants] = useState<RentalTenant[]>(() => {
    if (typeof window !== 'undefined') {
      // Check both fwa_rental_tenants and fwa_hostel_tenants_v1
      const saved = localStorage.getItem('fwa_rental_tenants') || localStorage.getItem('fwa_hostel_tenants_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 6) {
            return parsed.map((t: any) => ({
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
    return INITIAL_RENTAL_TENANTS;
  });

  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  // Quick Add modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Automatic one-time cleanup of legacy demo/dummy data across all modules
  useEffect(() => {
    try {
      const isPurged = localStorage.getItem('fwa_dummy_purged_v18');
      if (!isPurged) {
        const dummyIds = ['m-1', 'm-2', 'm-3', 'm-4', 'm-rohan', 'm-priya', 'm-papa', 'm-mummy', 'm-self'];
        
        // Deep clean any dummy member entries in localStorage across all prefixes
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.includes('member') || k.includes('transactions') || k.includes('hisab'))) {
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
        // Check if rental tenants match the 6 properties
        const curTenantsRaw = localStorage.getItem('fwa_rental_tenants') || localStorage.getItem('fwa_hostel_tenants_v1');
        let needs6Properties = true;
        if (curTenantsRaw) {
          try {
            const list = JSON.parse(curTenantsRaw);
            const totalRent = list.reduce((s: number, t: any) => s + Number(t.monthly_rent || 0), 0);
            if ((totalRent === 67000 || totalRent === 66000) && list.length === 6) {
              needs6Properties = false;
            }
          } catch (e) {}
        }
        localStorage.setItem('fwa_rental_properties', JSON.stringify(INITIAL_RENTAL_PROPERTIES));
        localStorage.setItem('fwa_rentals_v1', JSON.stringify(INITIAL_RENTAL_PROPERTIES));
        setRentalProperties(INITIAL_RENTAL_PROPERTIES);
        localStorage.setItem('fwa_rental_tenants', JSON.stringify(INITIAL_RENTAL_TENANTS));
        localStorage.setItem('fwa_hostel_tenants_v1', JSON.stringify(INITIAL_RENTAL_TENANTS));
        setRentalTenants(INITIAL_RENTAL_TENANTS);

        // Also update assets to the 6 properties
        localStorage.setItem('fwa_assets', JSON.stringify(INITIAL_ASSETS));
        setAssets(INITIAL_ASSETS);

        localStorage.setItem('fwa_dummy_purged_v18', 'true');
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
                  title: p.title || p.name || 'पुश्तैनी संपत्ति',
                  name: p.name || p.title || 'पुश्तैनी संपत्ति',
                  property_type: p.property_type || p.type || 'residential',
                  type: p.type || p.property_type || 'residential',
                  address: p.address || '',
                  has_hostel_model: Boolean(p.has_hostel_model || p.type === 'hostel_pg'),
                  total_floors: p.total_floors,
                  total_units: p.total_units || 1,
                  total_beds: p.total_beds,
                  monthly_target_rent: Number(p.monthly_target_rent || p.target_rent || 0),
                  collected_rent: Number(p.collected_rent || 0),
                  pending_rent: Number(p.pending_rent || 0),
                  tenants: p.tenants || [],
                  expenses: p.expenses || [],
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
                    supabase.from('rental_tenants').upsert({
                      id: t.id,
                      property_id: t.property_id || 'prop-kesharwani-1',
                      room_id: t.room_id || t.roomNumber || 'Room 101',
                      name: t.name || t.tenantName || 'किरायेदार',
                      phone: t.phone || t.tenantPhone || null,
                      monthly_rent: Number(t.monthly_rent || t.monthlyRent || 0),
                      security_deposit: Number(t.security_deposit || t.securityDeposit || 0),
                      joining_date: t.joining_date || t.joiningDate || new Date().toISOString().split('T')[0],
                      rent_status: (t.rent_status === 'due' || t.paymentStatus === 'DUE') ? 'due' : 'paid',
                    }, { onConflict: 'id' }).then(() => {}, () => {});
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

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTransactions(updated);
    const supabase = createClient();
    if (supabase) {
      supabase.from('transactions').update(updates).eq('id', id).then();
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

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g);
    setGoals(updated);
    try { localStorage.setItem('fwa_goals', JSON.stringify(updated)); } catch (e) {}
    const supabase = createClient();
    if (supabase) {
      supabase.from('goals').update(updates).eq('id', id).then();
    }
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    try { localStorage.setItem('fwa_goals', JSON.stringify(updated)); } catch (e) {}
    const supabase = createClient();
    if (supabase) {
      supabase.from('goals').delete().eq('id', id).then();
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

  const calculateNextEmiDueDate = (dueDay: number): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const todayDate = now.getDate();

    let targetYear = year;
    let targetMonth = month;

    if (todayDate > dueDay) {
      targetMonth += 1;
      if (targetMonth > 11) {
        targetMonth = 0;
        targetYear += 1;
      }
    }

    const maxDays = new Date(targetYear, targetMonth + 1, 0).getDate();
    const validDay = Math.min(Math.max(1, dueDay), maxDays);
    const formattedMonth = String(targetMonth + 1).padStart(2, '0');
    const formattedDay = String(validDay).padStart(2, '0');
    return `${targetYear}-${formattedMonth}-${formattedDay}`;
  };

  const addLoan = (loanData: Omit<LoanLiability, 'id' | 'family_id' | 'created_at'>) => {
    const newId = 'loan-' + Date.now();
    const newLoan: LoanLiability = {
      ...loanData,
      id: newId,
      family_id: family.id,
      created_at: new Date().toISOString(),
    };
    const updated = [newLoan, ...loans];
    setLoans(updated);
    try { localStorage.setItem('fwa_loans_liabilities_v1', JSON.stringify(updated)); } catch (e) {}

    // Auto-sync EMI reminder if enabled
    if (newLoan.auto_reminder && Number(newLoan.monthly_emi_amount) > 0 && newLoan.emi_due_day) {
      const dueDate = calculateNextEmiDueDate(Number(newLoan.emi_due_day));
      const reminderItem: Reminder = {
        id: 'rem-loan-' + newId,
        family_id: family.id,
        member_id: newLoan.borrower_member_id,
        member_name: newLoan.borrower_member_name,
        title: `${newLoan.title} - मासिक EMI (किश्त)`,
        category: 'emi',
        due_date: dueDate,
        amount: Number(newLoan.monthly_emi_amount),
        linked_loan_id: newId,
        color: '#C1502E',
      };
      setReminders(prev => {
        const next = [...prev.filter(r => r.linked_loan_id !== newId), reminderItem];
        try { localStorage.setItem('fwa_reminders', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    }
  };

  const updateLoan = (id: string, updates: Partial<LoanLiability>) => {
    const updated = loans.map(l => l.id === id ? { ...l, ...updates } : l);
    setLoans(updated);
    try { localStorage.setItem('fwa_loans_liabilities_v1', JSON.stringify(updated)); } catch (e) {}

    const cur = updated.find(l => l.id === id);
    if (cur) {
      if (cur.status !== 'closed' && cur.auto_reminder && Number(cur.monthly_emi_amount) > 0 && cur.emi_due_day) {
        const dueDate = calculateNextEmiDueDate(Number(cur.emi_due_day));
        const reminderItem: Reminder = {
          id: 'rem-loan-' + cur.id,
          family_id: family.id,
          member_id: cur.borrower_member_id,
          member_name: cur.borrower_member_name,
          title: `${cur.title} - मासिक EMI (किश्त)`,
          category: 'emi',
          due_date: dueDate,
          amount: Number(cur.monthly_emi_amount),
          linked_loan_id: cur.id,
          color: '#C1502E',
        };
        setReminders(prev => {
          const next = [...prev.filter(r => r.linked_loan_id !== cur.id), reminderItem];
          try { localStorage.setItem('fwa_reminders', JSON.stringify(next)); } catch (e) {}
          return next;
        });
      } else {
        setReminders(prev => {
          const next = prev.filter(r => r.linked_loan_id !== cur.id);
          try { localStorage.setItem('fwa_reminders', JSON.stringify(next)); } catch (e) {}
          return next;
        });
      }
    }
  };

  const deleteLoan = (id: string) => {
    const updated = loans.filter(l => l.id !== id);
    setLoans(updated);
    try { localStorage.setItem('fwa_loans_liabilities_v1', JSON.stringify(updated)); } catch (e) {}
    setReminders(prev => {
      const next = prev.filter(r => r.linked_loan_id !== id);
      try { localStorage.setItem('fwa_reminders', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const closeLoan = (
    id: string,
    closureData: { closed_date: string; closure_notes?: string; documents?: LoanDocument[] }
  ) => {
    const target = loans.find(l => l.id === id);
    if (!target) return;
    const existingDocs = target.documents || [];
    const newDocs = closureData.documents || [];
    const mergedDocs = [...existingDocs, ...newDocs];

    updateLoan(id, {
      status: 'closed',
      outstanding_balance: 0,
      closed_date: closureData.closed_date,
      closure_notes: closureData.closure_notes,
      documents: mergedDocs,
      auto_reminder: false,
    });
  };

  const reopenLoan = (id: string, outstandingBalance?: number) => {
    const target = loans.find(l => l.id === id);
    if (!target) return;
    updateLoan(id, {
      status: 'active',
      outstanding_balance: outstandingBalance !== undefined ? outstandingBalance : target.total_loan_amount,
      auto_reminder: true,
    });
  };

  const addLoanDocument = (loanId: string, doc: Omit<LoanDocument, 'id' | 'uploaded_at'>) => {
    const target = loans.find(l => l.id === loanId);
    if (!target) return;
    const newDoc: LoanDocument = {
      ...doc,
      id: 'doc-loan-' + Date.now(),
      uploaded_at: new Date().toISOString(),
    };
    const updatedDocs = [newDoc, ...(target.documents || [])];
    updateLoan(loanId, { documents: updatedDocs });
  };

  const deleteLoanDocument = (loanId: string, docId: string) => {
    const target = loans.find(l => l.id === loanId);
    if (!target) return;
    const updatedDocs = (target.documents || []).filter(d => d.id !== docId);
    updateLoan(loanId, { documents: updatedDocs });
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

  const updateMember = (id: string, updates: Partial<Member>) => {
    const updated = members.map(m => m.id === id ? { ...m, ...updates } : m);
    setMembers(updated);
    try { localStorage.setItem('fwa_members', JSON.stringify(updated)); } catch (e) {}

    const supabase = createClient();
    if (supabase) {
      supabase.from('members').update(updates).eq('id', id).then();
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

  const currentUserId = members[0]?.id || 'm-ankush';

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const updated = assets.map(a => a.id === id ? { ...a, ...updates } : a);
    setAssets(updated);
    try { localStorage.setItem('fwa_assets', JSON.stringify(updated)); } catch (e) {}
    const supabase = createClient();
    if (supabase) {
      supabase.from('assets').update(updates).eq('id', id).then();
    }
  };

  const saveRentalProperties = (updater: RentalProperty[] | ((prev: RentalProperty[]) => RentalProperty[])) => {
    setRentalProperties(prev => {
      const currentList = Array.isArray(updater) ? updater : updater(prev);
      try {
        localStorage.setItem('fwa_rental_properties', JSON.stringify(currentList));
        localStorage.setItem('fwa_rentals_v1', JSON.stringify(currentList));
        const allTenants = currentList.flatMap(p => p.tenants || []);
        localStorage.setItem('fwa_rental_tenants', JSON.stringify(allTenants));
        setRentalTenants(allTenants);
      } catch (e) {}
      return currentList;
    });
  };

  const addRentalProperty = (prop: Omit<RentalProperty, 'id' | 'family_id' | 'created_at' | 'tenants' | 'expenses'> & { tenants?: RentalTenant[]; expenses?: RentalExpense[] }): RentalProperty => {
    const newProp: RentalProperty = {
      ...prop,
      id: `rent-${Date.now()}`,
      family_id: family.id,
      title: prop.title || prop.name || 'नई संपत्ति',
      name: prop.name || prop.title || 'नई संपत्ति',
      property_type: prop.property_type || (prop.type as any) || 'residential_flat',
      address: prop.address || '',
      has_hostel_model: prop.has_hostel_model ?? false,
      monthly_target_revenue: prop.monthly_target_revenue || prop.monthly_target_rent || 0,
      monthly_target_rent: prop.monthly_target_revenue || prop.monthly_target_rent || 0,
      collected_rent: prop.collected_rent || 0,
      pending_rent: prop.pending_rent || 0,
      tenants: prop.tenants || [],
      past_tenants: prop.past_tenants || [],
      expenses: prop.expenses || [],
      ownership_status: 'owned'
    };
    saveRentalProperties(prev => [newProp, ...prev]);

    // Auto-sync property market valuation to Family Wealth Assets
    if (prop.estimated_market_value && prop.estimated_market_value > 0) {
      addAsset({
        category: 'fixed',
        type: 'property',
        label: `${newProp.title}`,
        value: Number(prop.estimated_market_value),
        notes: `रेंटल संपत्ति - आकार: ${prop.property_size || ''} ${prop.size_unit || 'sqft'}, पता: ${prop.address || ''}`
      });
    }

    return newProp;
  };

  const addRentalPropertyWithTenant = (
    prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>,
    tenant?: Omit<RentalTenant, 'id' | 'property_id'>
  ): RentalProperty => {
    const propId = `rent-${Date.now()}`;
    let newTenantList: RentalTenant[] = [];

    if (tenant && tenant.name && tenant.name.trim().length > 0) {
      const newTenant: RentalTenant = {
        ...tenant,
        id: `t-${Date.now()}`,
        property_id: propId,
        cycle_start_day: tenant.cycle_start_day || 1,
        cycle_end_day: tenant.cycle_end_day || 30,
        rent_due_day: tenant.rent_due_day || 5,
        security_deposit: tenant.security_deposit || 0,
        monthly_rent: tenant.monthly_rent || 0,
        rent_status: tenant.rent_status || 'paid'
      };
      newTenantList = [newTenant];
    }

    const newProp: RentalProperty = {
      ...prop,
      id: propId,
      family_id: family.id,
      title: prop.title || prop.name || 'नई संपत्ति',
      name: prop.name || prop.title || 'नई संपत्ति',
      property_type: prop.property_type || (prop.type as any) || 'residential_flat',
      address: prop.address || '',
      has_hostel_model: prop.has_hostel_model ?? false,
      monthly_target_revenue: prop.monthly_target_revenue || prop.monthly_target_rent || 0,
      monthly_target_rent: prop.monthly_target_revenue || prop.monthly_target_rent || 0,
      collected_rent: prop.collected_rent || 0,
      pending_rent: prop.pending_rent || 0,
      tenants: newTenantList,
      past_tenants: [],
      expenses: [],
      security_deposit_holding: newTenantList[0]?.security_deposit || 0,
      ownership_status: 'owned'
    };

    saveRentalProperties(prev => [newProp, ...prev]);

    if (prop.estimated_market_value && prop.estimated_market_value > 0) {
      addAsset({
        category: 'fixed',
        type: 'property',
        label: `${newProp.title}`,
        value: Number(prop.estimated_market_value),
        notes: `रेंटल संपत्ति - आकार: ${prop.property_size || ''} ${prop.size_unit || 'sqft'}, पता: ${prop.address || ''}`
      });
    }

    return newProp;
  };

  const updateRentalProperty = (propertyId: string, updates: Partial<RentalProperty>) => {
    saveRentalProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
    if (updates.estimated_market_value !== undefined) {
      setAssets(prev => prev.map(a => {
        if (a.notes?.includes(propertyId) || (updates.title && a.label === updates.title)) {
          return { ...a, value: Number(updates.estimated_market_value) };
        }
        return a;
      }));
    }
  };

  const deleteRentalProperty = (propertyId: string) => {
    saveRentalProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const transferRentalProperty = (
    propertyId: string,
    toMemberId: string,
    details: { transfer_date: string; notes?: string }
  ) => {
    const toMember = members.find(m => m.id === toMemberId);
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        owner_member_id: toMemberId,
        owner_member_name: toMember?.name || 'Family Member',
        ownership_status: 'transferred' as const,
        transfer_details: {
          transferred_to_member_id: toMemberId,
          transferred_to_name: toMember?.name || 'Family Member',
          transfer_date: details.transfer_date,
          notes: details.notes
        }
      };
    }));
  };

  const sellRentalProperty = (
    propertyId: string,
    details: { sold_to_name: string; sold_price: number; sold_date: string; capital_gain?: number; notes?: string }
  ) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        ownership_status: 'sold' as const,
        sold_details: details
      };
    }));

    if (details.sold_price > 0) {
      addTransaction({
        member_id: currentUserId,
        type: 'income',
        amount: details.sold_price,
        category: 'Property Sale (Capital Gain)',
        mode: 'online',
        scope: 'ghar',
        note: `Property Sold: #${propertyId} to ${details.sold_to_name} for ₹${details.sold_price.toLocaleString('en-IN')}`,
        txn_date: details.sold_date || new Date().toISOString().split('T')[0]
      });
    }
  };

  const addHostelRoom = (propertyId: string, room: Omit<HostelRoom, 'id'>) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const newRoom: HostelRoom = {
        ...room,
        id: `rm-${Date.now()}`
      };
      const updatedRooms = [...(p.rooms || []), newRoom];
      const totalBeds = updatedRooms.reduce((acc, r) => acc + (r.total_beds || 0), 0);
      return {
        ...p,
        rooms: updatedRooms,
        total_capacity_beds: totalBeds,
        total_units_or_rooms: updatedRooms.length
      };
    }));
  };

  const addRentalTenant = (
    propertyIdOrTenant: string | Omit<RentalTenant, 'id' | 'created_at'>,
    tenantParam?: Omit<RentalTenant, 'id' | 'property_id'>
  ) => {
    if (typeof propertyIdOrTenant === 'object') {
      const tenant = propertyIdOrTenant;
      const propId = tenant.property_id || rentalProperties[0]?.id || 'rent-prop-1';
      const newT: RentalTenant = {
        ...tenant,
        id: 't-' + Date.now(),
        property_id: propId,
        created_at: new Date().toISOString()
      };
      saveRentalProperties(prev => prev.map(p => {
        if (p.id !== propId) return p;
        return {
          ...p,
          tenants: [...p.tenants, newT],
          security_deposit_holding: (p.security_deposit_holding || 0) + (newT.security_deposit || 0)
        };
      }));
      return;
    }
    const propertyId = propertyIdOrTenant;
    const tenant = tenantParam!;
    const newTenant: RentalTenant = {
      ...tenant,
      id: `t-${Date.now()}`,
      property_id: propertyId,
      cycle_start_day: tenant.cycle_start_day || 1,
      cycle_end_day: tenant.cycle_end_day || 30,
      rent_due_day: tenant.rent_due_day || 5,
      security_deposit: tenant.security_deposit || 0,
      monthly_rent: tenant.monthly_rent || 0,
      rent_status: tenant.rent_status || 'paid'
    };
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      let updatedRooms = p.rooms;
      if (p.rooms && tenant.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          beds: rm.beds.map(b => b.id === tenant.bed_id ? { ...b, status: 'occupied' as const, current_tenant_id: newTenant.id, current_tenant_name: newTenant.name } : b)
        }));
      }
      return {
        ...p,
        rooms: updatedRooms,
        tenants: [...p.tenants, newTenant],
        security_deposit_holding: (p.security_deposit_holding || 0) + (tenant.security_deposit || 0)
      };
    }));
  };

  const updateRentalTenant = (
    propIdOrTenant: string | RentalTenant,
    tenantIdParam?: string,
    updates?: Partial<RentalTenant>
  ) => {
    if (typeof propIdOrTenant === 'object') {
      const updatedTenant = propIdOrTenant;
      saveRentalProperties(prev => prev.map(p => {
        const hasTenant = p.tenants.some(t => t.id === updatedTenant.id);
        if (!hasTenant) return p;
        const newTenants = p.tenants.map(t => t.id === updatedTenant.id ? updatedTenant : t);
        const totalHolding = newTenants.reduce((sum, t) => sum + (Number(t.security_deposit) || 0), 0);
        const totalTenantRent = newTenants.reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0);
        return {
          ...p,
          tenants: newTenants,
          security_deposit_holding: totalHolding,
          monthly_target_revenue: totalTenantRent,
          monthly_target_rent: totalTenantRent,
        };
      }));
      return;
    }
    const propertyId = propIdOrTenant;
    const tenantId = tenantIdParam!;
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const newTenants = p.tenants.map(t => t.id === tenantId ? { ...t, ...updates } : t);
      const totalHolding = newTenants.reduce((sum, t) => sum + (Number(t.security_deposit) || 0), 0);
      const totalTenantRent = newTenants.reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0);
      return {
        ...p,
        tenants: newTenants,
        security_deposit_holding: totalHolding,
        monthly_target_revenue: totalTenantRent,
        monthly_target_rent: totalTenantRent,
      };
    }));
  };

  const deleteRentalTenant = (propIdOrTenantId: string, tenantIdParam?: string) => {
    const tenantId = tenantIdParam || propIdOrTenantId;
    saveRentalProperties(prev => prev.map(p => {
      const target = p.tenants.find(t => t.id === tenantId);
      if (!target && tenantIdParam && p.id !== propIdOrTenantId) return p;
      let updatedRooms = p.rooms;
      if (p.rooms && target?.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          beds: rm.beds.map(b => b.id === target.bed_id ? { ...b, status: 'vacant' as const, current_tenant_id: undefined, current_tenant_name: undefined } : b)
        }));
      }
      return {
        ...p,
        rooms: updatedRooms,
        tenants: p.tenants.filter(t => t.id !== tenantId),
        security_deposit_holding: Math.max(0, (p.security_deposit_holding || 0) - (target?.security_deposit || 0))
      };
    }));
  };

  const toggleTenantRentStatus = (tenantId: string) => {
    saveRentalProperties(prev => prev.map(p => {
      return {
        ...p,
        tenants: p.tenants.map(t => {
          if (t.id !== tenantId) return t;
          const nextStatus: 'paid' | 'due' = (t.rent_status === 'paid' ? 'due' : 'paid');
          return { ...t, rent_status: nextStatus };
        })
      };
    }));
  };

  const vacateAndSettleTenant = (
    propertyId: string,
    tenantId: string,
    settlement: {
      final_meter_reading: number;
      final_electricity_charge: number;
      final_damage_deduction: number;
      final_advance_refunded: number;
      vacate_date: string;
      reason?: string;
      notes?: string;
    }
  ) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      const target = p.tenants.find(t => t.id === tenantId);
      if (!target) return p;

      const vacatedTenant: RentalTenant = {
        ...target,
        tenant_status: 'vacated',
        vacate_date: settlement.vacate_date,
        final_meter_reading: settlement.final_meter_reading,
        final_electricity_charge: settlement.final_electricity_charge,
        final_damage_deduction: settlement.final_damage_deduction,
        final_advance_refunded: settlement.final_advance_refunded,
        settlement_summary: settlement.notes || `Vacated on ${settlement.vacate_date}`
      };

      let updatedRooms = p.rooms;
      if (p.rooms && target.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          sub_meter_last_reading: settlement.final_meter_reading || rm.sub_meter_last_reading,
          beds: rm.beds.map(b => b.id === target.bed_id ? { ...b, status: 'vacant' as const, current_tenant_id: undefined, current_tenant_name: undefined } : b)
        }));
      }

      return {
        ...p,
        rooms: updatedRooms,
        tenants: p.tenants.filter(t => t.id !== tenantId),
        past_tenants: [vacatedTenant, ...(p.past_tenants || [])],
        security_deposit_holding: Math.max(0, (p.security_deposit_holding || 0) - (target.security_deposit || 0))
      };
    }));
  };

  const collectRentPayment = (
    propertyId: string,
    tenantId: string,
    amount: number,
    isPaid: boolean,
    details?: {
      payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque';
      payment_date?: string;
      payment_time?: string;
      transaction_id?: string;
      maintenance_deduction?: number;
      damage_deduction?: number;
      notes?: string;
    }
  ) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        tenants: p.tenants.map(t => {
          if (t.id !== tenantId) return t;
          return {
            ...t,
            rent_status: (isPaid ? 'paid' : 'pending') as 'paid' | 'pending',
            last_paid_date: isPaid ? (details?.payment_date || new Date().toISOString().split('T')[0]) : t.last_paid_date,
            last_paid_amount: isPaid ? amount : t.last_paid_amount,
            last_payment_mode: details?.payment_mode || t.last_payment_mode || 'upi',
            last_transaction_id: details?.transaction_id || t.last_transaction_id,
            maintenance_deduction_amount: details?.maintenance_deduction !== undefined ? details.maintenance_deduction : t.maintenance_deduction_amount,
            damage_deduction_amount: details?.damage_deduction !== undefined ? details.damage_deduction : t.damage_deduction_amount,
            notes: details?.notes || t.notes
          };
        })
      };
    }));

    if (isPaid && amount > 0) {
      addTransaction({
        member_id: currentUserId,
        type: 'income',
        amount: amount,
        category: 'Rental Property Income',
        mode: 'online',
        scope: 'ghar',
        note: `Rent collected (₹${amount}) for property #${propertyId} ${details?.notes ? ` - ${details.notes}` : ''}`,
        txn_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const addRentalExpense = (propertyId: string, expense: Omit<RentalExpense, 'id' | 'property_id'>) => {
    const newExp: RentalExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
      property_id: propertyId
    };
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: [...p.expenses, newExp]
      };
    }));

    if (expense.paid_by !== 'tenant' || !expense.is_adjusted_in_rent) {
      addTransaction({
        member_id: currentUserId,
        type: 'expense',
        amount: expense.amount,
        category: 'Property Maintenance & Staff',
        mode: 'online',
        scope: 'ghar',
        note: `Rental expense: ${expense.note}`,
        txn_date: expense.date || new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteRentalExpense = (propertyId: string, expenseId: string) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: p.expenses.filter(e => e.id !== expenseId)
      };
    }));
  };

  const addRentDiversion = (propertyId: string, rule: Omit<RentDiversionRule, 'id'>) => {
    const newRule: RentDiversionRule = {
      ...rule,
      id: 'rdiv-' + Date.now()
    };
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: [...(p.rent_diversions || []), newRule]
      };
    }));
  };

  const updateRentDiversion = (propertyId: string, ruleId: string, updates: Partial<RentDiversionRule>) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: (p.rent_diversions || []).map(r => r.id === ruleId ? { ...r, ...updates } : r)
      };
    }));
  };

  const deleteRentDiversion = (propertyId: string, ruleId: string) => {
    saveRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: (p.rent_diversions || []).filter(r => r.id !== ruleId)
      };
    }));
  };

  const executeRentDiversion = (
    propertyId: string,
    ruleId: string,
    customAmount?: number
  ): { success: boolean; message: string } => {
    const prop = rentalProperties.find(p => p.id === propertyId);
    if (!prop) return { success: false, message: 'Property nahi mili' };

    const rule = (prop.rent_diversions || []).find(r => r.id === ruleId);
    if (!rule) return { success: false, message: 'Diversion rule nahi mila' };

    const gross = prop.monthly_target_revenue || prop.monthly_target_rent || 0;
    const amount = customAmount || (rule.split_type === 'percentage' ? Math.round((gross * rule.split_value) / 100) : rule.split_value);

    if (amount <= 0) return { success: false, message: 'Amount 0 se bada hona chahiye' };

    const today = new Date().toISOString().split('T')[0];

    if (rule.allocation_target === 'loan_emi') {
      if (rule.linked_loan_id) {
        const targetLoan = loans.find(l => l.id === rule.linked_loan_id);
        if (targetLoan) {
          const newBal = Math.max(0, Number(targetLoan.outstanding_balance || 0) - amount);
          updateLoan(targetLoan.id, {
            outstanding_balance: newBal,
            status: newBal === 0 ? 'closed' : targetLoan.status,
            notes: `${targetLoan.notes || ''} (किराया ${prop.title} से ₹${amount.toLocaleString('en-IN')} चुकता - ${today})`.trim()
          });
          addTransaction({
            member_id: rule.target_member_id || targetLoan.borrower_member_id || currentUserId,
            type: 'expense',
            amount: amount,
            category: 'Loan EMI Repayment',
            mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
            scope: 'bahar',
            note: `किराया (${prop.title}) से लोन EMI चुकता: ${targetLoan.title} (${targetLoan.lender_bank})`,
            txn_date: today
          });
        }
      } else {
        addTransaction({
          member_id: rule.target_member_id || currentUserId,
          type: 'expense',
          amount: amount,
          category: 'Loan EMI Repayment',
          mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
          scope: 'bahar',
          note: `किराया (${prop.title}) से लोन EMI: ${rule.purpose}`,
          txn_date: today
        });
      }
    } else if (rule.allocation_target === 'fd_rd_investment') {
      if (rule.linked_asset_id) {
        const targetAsset = assets.find(a => a.id === rule.linked_asset_id);
        if (targetAsset) {
          updateAsset(targetAsset.id, {
            value: Number(targetAsset.value || 0) + amount,
            notes: (targetAsset.notes || '') + ` (Kiraye se ₹${amount} jama hua taarikh ${today})`
          });
        }
      } else {
        addAsset({
          category: 'liquid',
          type: 'bank_deposit',
          label: `${rule.target_member_name} - Rent RD (${prop.title})`,
          value: amount,
          notes: `Rental income diversion of ${prop.title}`
        });
      }
    } else if (rule.allocation_target === 'ghar_ration_expense') {
      addTransaction({
        member_id: rule.target_member_id || currentUserId,
        type: 'expense',
        amount: amount,
        category: 'Ghar Ration & Groceries',
        mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
        scope: 'ghar',
        note: `Rent Diversion for Ration: ${prop.title}`,
        txn_date: today
      });
    } else if (rule.allocation_target === 'member_personal') {
      addTransaction({
        member_id: rule.target_member_id || currentUserId,
        type: 'income',
        amount: amount,
        category: 'Rental Income Share',
        mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
        scope: 'bahar',
        note: `किराया हिस्सा (${prop.title}): ${rule.target_member_name} (${rule.purpose})`,
        txn_date: today
      });
    } else if (rule.allocation_target === 'staff_payment') {
      addTransaction({
        member_id: rule.target_member_id || currentUserId,
        type: 'expense',
        amount: amount,
        category: 'Staff Salary',
        mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
        scope: 'ghar',
        note: `किराया से स्टाफ भुगतान: ${prop.title} - ${rule.purpose}`,
        txn_date: today
      });
    } else if (rule.allocation_target === 'other') {
      addTransaction({
        member_id: rule.target_member_id || currentUserId,
        type: 'expense',
        amount: amount,
        category: rule.custom_other_purpose || 'Other Rent Allocation',
        mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
        scope: 'bahar',
        note: `किराया (${prop.title}) से: ${rule.custom_other_purpose || rule.purpose}`,
        txn_date: today
      });
    }

    updateRentDiversion(propertyId, ruleId, {
      last_executed_date: today,
      last_executed_amount: amount,
    });

    return {
      success: true,
      message: `₹${amount.toLocaleString('en-IN')} safaltapoorvak divert kar diya gaya (${rule.purpose})`
    };
  };

  // Computations
  const liquidWealth = assets
    .filter(a => a.category === 'liquid')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);

  const propertyWealthFromRentals = rentalProperties.reduce((sum, p) => sum + (Number(p.estimated_market_value) || 0), 0);
  const otherFixedWealth = assets
    .filter(a => a.category === 'fixed' && a.type !== 'property')
    .reduce((sum, a) => sum + Number(a.value || 0), 0);
  const fixedWealth = propertyWealthFromRentals + otherFixedWealth;

  const totalRentalIncomePerMonth = rentalProperties.flatMap(p => p.tenants || []).reduce((sum, t) => sum + Number(t.monthly_rent || 0), 0);
  const totalSecurityDepositHeld = rentalProperties.flatMap(p => p.tenants || []).reduce((sum, t) => sum + Number(t.security_deposit || 0), 0);

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

  const totalLoansOutstanding = loans
    .filter(l => l.status !== 'closed')
    .reduce((sum, l) => sum + Number(l.outstanding_balance || 0), 0);
  const totalMonthlyEmi = loans
    .filter(l => l.status !== 'closed')
    .reduce((sum, l) => sum + Number(l.monthly_emi_amount || 0), 0);

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
        loans,
        currentUserId,
        staff,
        updateAsset,
        addLoan,
        updateLoan,
        deleteLoan,
        closeLoan,
        reopenLoan,
        addLoanDocument,
        deleteLoanDocument,
        activeMemberId,
        setActiveMemberId,
        updateFamilyName,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        addReminder,
        addAsset,
        addMember,
        updateMember,
        addDocument,
        deleteDocument,
        addRentalProperty,
        addRentalPropertyWithTenant,
        updateRentalProperty,
        deleteRentalProperty,
        transferRentalProperty,
        sellRentalProperty,
        addHostelRoom,
        addRentalTenant,
        updateRentalTenant,
        deleteRentalTenant,
        toggleTenantRentStatus,
        vacateAndSettleTenant,
        collectRentPayment,
        addRentalExpense,
        deleteRentalExpense,
        addRentDiversion,
        updateRentDiversion,
        deleteRentDiversion,
        executeRentDiversion,
        totalWealth,
        liquidWealth,
        fixedWealth,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        totalUdharGiven,
        totalUdharTaken,
        totalRentalIncomePerMonth,
        totalSecurityDepositHeld,
        totalLoansOutstanding,
        totalMonthlyEmi,
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
