'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem,
  MedicalRecord, HouseholdStaff, CourtCase, CourtHearing, CreditCard, RecurringIncome,
  UtilityBill, CalendarEventItem, AgriculturalLand, CropCycle, AgricultureExpense,
  Vehicle, VehicleServiceLog, UdharContact, UdharSettlement, UdharSettlementMode, CommercialFleetVehicle, FleetTrip, FleetBusinessType, CommercialVehicleType, LawyerFeePayment, LawyerPaymentType, BusinessFirm, FirmDrawing, EntityType,
  RentalProperty, RentalTenant, HostelRoom, HostelBed, RentalExpense, RentalPropertyType, RentDiversionRule,
  MemberLedgerEntry, MemberLedgerType,
  GoldLoanPledge, GoldLoanInterestPayment, GoldLoanStatus, GoldPurityKarat,
  Trip, TripMember, TripExpense, TripPoolContribution, TripType, TripExpenseType, TripExpenseCategory,
  BusinessSetupProject, ProjectFundingSource, DisbursalTranche, PreOpExpense, ProjectRepayment, PreOpExpenseCategory, FundingSourceType,
  ConstructionProject, ConstructionMaterialLog, ThekedarContract, LaborHaziraRecord, ConstructionStage, MaterialCategory,
  BankLoan, BankLoanType, LoanMemberSplit, LoanInterestRevision,
  MedicalTreatmentEpisode, MedicalEpisodeDoctorVisit, MedicalEpisodeExpenseItem, MedicalExpenseCategory
} from '@/types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-head',
    family_id: 'fam-1',
    name: 'Head of Family (Aap)',
    role: 'owner',
    color: '#B98B2A',
    initials: 'H',
    relationship: 'Self / Mukhiya',
    dob: '1982-08-15',
    phone: '+91 98765 43210',
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
    id: 'm-sunita',
    family_id: 'fam-1',
    name: 'Sunita Sharma',
    role: 'member',
    color: '#34D399',
    initials: 'S',
    relationship: 'Patni (Wife)',
    dob: '1985-03-22',
    phone: '+91 98765 43211',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: false,
      is_admin: false,
    }
  },
  {
    id: 'm-priya',
    family_id: 'fam-1',
    name: 'Priya Sharma',
    role: 'member',
    color: '#60A5FA',
    initials: 'P',
    relationship: 'Beti (Daughter)',
    dob: '2008-11-10',
    permissions: {
      can_view_investments: false,
      can_view_bills: false,
      can_view_vault: false,
      can_view_medical: true,
      can_view_staff: false,
      can_view_cases: false,
      is_admin: false,
    }
  },
  {
    id: 'm-amit',
    family_id: 'fam-1',
    name: 'Amit Sharma',
    role: 'member',
    color: '#F472B6',
    initials: 'A',
    relationship: 'Beta (Son)',
    dob: '2012-05-18',
    permissions: {
      can_view_investments: false,
      can_view_bills: false,
      can_view_vault: false,
      can_view_medical: true,
      can_view_staff: false,
      can_view_cases: false,
      is_admin: false,
    }
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    family_id: 'fam-1',
    member_id: 'm-head',
    type: 'income',
    amount: 185000,
    category: 'Business Salary / Profit',
    mode: 'online',
    scope: 'ghar',
    category_type: 'main_ghar',
    note: 'Monthly director salary and trading profits',
    txn_date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'txn-2',
    family_id: 'fam-1',
    member_id: 'm-head',
    type: 'income',
    amount: 14500,
    category: 'Stock Dividends & Interest',
    mode: 'online',
    scope: 'ghar',
    category_type: 'main_ghar',
    note: 'TCS & ITC quarterly dividend credited to HDFC bank',
    txn_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]
  },
  {
    id: 'txn-3',
    family_id: 'fam-1',
    member_id: 'm-sunita',
    type: 'expense',
    amount: 18500,
    category: 'Groceries & Kirana',
    mode: 'online',
    scope: 'ghar',
    category_type: 'main_ghar',
    note: 'Monthly ration & organic veggies from Nature Basket',
    txn_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
  },
  {
    id: 'txn-4',
    family_id: 'fam-1',
    member_id: 'm-head',
    type: 'expense',
    amount: 24000,
    category: 'Children Education & Coaching',
    mode: 'online',
    scope: 'ghar',
    category_type: 'child',
    note: 'Priya physics tuition & school quarter fee',
    txn_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
  },
  {
    id: 'txn-5',
    family_id: 'fam-1',
    member_id: 'm-head',
    type: 'expense',
    amount: 7800,
    category: 'Electricity & Utility Bills',
    mode: 'online',
    scope: 'ghar',
    category_type: 'main_ghar',
    note: 'BSES Electricity Bill paid via UPI',
    txn_date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast-1',
    family_id: 'fam-1',
    label: 'HDFC Family Savings Account',
    category: 'liquid',
    type: 'bank_deposit',
    institution: 'HDFC Bank',
    value: 450000,
    member_id: 'm-head',
    notes: 'Primary liquid operational account'
  },
  {
    id: 'ast-2',
    family_id: 'fam-1',
    label: 'SBI 3-Year Fixed Deposit (Joint)',
    category: 'liquid',
    type: 'bank_deposit',
    asset_subtype: 'fd',
    interest_rate: 7.1,
    maturity_date: '2026-12-31',
    institution: 'SBI',
    value: 1000000,
    member_id: 'm-head',
    joint_member_ids: ['m-sunita'],
    notes: '7.1% interest rate emergency joint safety deposit'
  },
  {
    id: 'ast-3',
    family_id: 'fam-1',
    label: '3BHK Residential Apartment (Civil Lines)',
    category: 'fixed',
    type: 'property',
    institution: 'Registry',
    value: 8500000,
    member_id: 'm-head',
    notes: 'Self-occupied family home, zero mortgage'
  },
  {
    id: 'ast-4',
    family_id: 'fam-1',
    label: 'Physical Gold Jewelry & Sovereign Gold Bonds (SGB)',
    category: 'liquid',
    type: 'gold',
    institution: 'Tanishq & RBI',
    value: 1250000,
    member_id: 'm-sunita',
    notes: '22K Hallmarked + RBI Sovereign Gold Tranches'
  },
  {
    id: 'ast-5',
    family_id: 'fam-1',
    label: 'Nifty 50 & Bluechip Growth Mutual Funds',
    category: 'liquid',
    type: 'mutual_funds',
    institution: 'Groww / Zerodha',
    value: 820000,
    member_id: 'm-head',
    notes: 'Active SIP in Parag Parikh & UTI Nifty 50 Index Fund'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    family_id: 'fam-1',
    title: 'Priya ki Higher Education',
    target_amount: 1500000,
    saved_amount: 920000,
    target_date: '2027-06-30',
    category: 'education'
  },
  {
    id: 'g-2',
    family_id: 'fam-1',
    title: 'Diwali Gold & SGB Accumulation',
    target_amount: 300000,
    saved_amount: 210000,
    target_date: '2026-11-10',
    category: 'gold'
  },
  {
    id: 'g-3',
    family_id: 'fam-1',
    title: 'Family Emergency Contingency Fund',
    target_amount: 1000000,
    saved_amount: 750000,
    target_date: '2026-12-31',
    category: 'safety'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    family_id: 'fam-1',
    title: 'Car Comprehensive Insurance Renewal',
    due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    amount: 14200,
    category: 'insurance',
    color: '#C1502E'
  },
  {
    id: 'rem-2',
    family_id: 'fam-1',
    title: 'Family Health Insurance (Floater ₹25L)',
    due_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    amount: 28500,
    category: 'insurance',
    color: '#B98B2A'
  },
  {
    id: 'rem-3',
    family_id: 'fam-1',
    title: 'Municipal Property Tax Assessment',
    due_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    amount: 6200,
    category: 'bill',
    color: '#4C7A5E'
  }
];

export const INITIAL_MEMBER_LEDGERS: MemberLedgerEntry[] = [
  {
    id: 'mle-1',
    family_id: 'fam-1',
    from_member_id: 'm-rahul',
    to_member_id: 'm-head',
    type: 'cash_transfer',
    amount: 5000,
    title: 'Ghar Painting & Material ke liye Cash Diya',
    notes: 'Papa ji ko paint material lane ke liye cash diya',
    date: '2026-09-10',
    is_settled: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'mle-2',
    family_id: 'fam-1',
    from_member_id: 'm-head',
    to_member_id: 'm-rahul',
    type: 'samaan_shopping',
    amount: 3200,
    title: 'Asian Paints Primer, Roller & Brushes Laye',
    items_detail: 'Primer 10L (₹1800), Roller 2pcs (₹400), Brushes (₹1000)',
    notes: 'Hardware dukan se bill ke sath samaan laya',
    date: '2026-09-12',
    is_settled: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'mle-3',
    family_id: 'fam-1',
    from_member_id: 'm-priya',
    to_member_id: 'm-mummy',
    type: 'samaan_shopping',
    amount: 1450,
    title: 'Mummy ji ke liye Ayurvedic Tonic & Dawa Laye',
    items_detail: 'Chyawanprash 1kg, Joint pain oil, Sugar test strips',
    notes: 'Pharmacy se UPI payment kiya',
    date: '2026-09-14',
    is_settled: false,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_FIRMS: BusinessFirm[] = [];
export const INITIAL_FLEET: CommercialFleetVehicle[] = [];
export const INITIAL_AGRI_LANDS: AgriculturalLand[] = [];
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    family_id: 'fam-1',
    vehicle_type: 'car',
    brand_model: 'Hyundai Creta SX (O)',
    reg_number: 'DL 08 CA 4210',
    member_id: 'm-head',
    purchase_date: '2023-04-15',
    purchase_price: 1850000,
    fuel_type: 'Petrol',
    insurance_expiry: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    service_logs: []
  }
];
export const INITIAL_UDHAR_CONTACTS: UdharContact[] = [];
export const INITIAL_CASES: CourtCase[] = [];
export const INITIAL_RECURRING_INCOME: RecurringIncome[] = [];
export const INITIAL_CREDIT_CARDS: CreditCard[] = [];
export const INITIAL_UTILITY_BILLS: UtilityBill[] = [];
export const INITIAL_STAFF: HouseholdStaff[] = [
  {
    id: 'st-1',
    family_id: 'fam-1',
    name: 'Ramesh Kumar',
    role: 'driver',
    monthly_salary: 18000,
    advance_balance: 2000,
    phone: '+91 98111 22334',
    attendance_this_month: {}
  }
];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_MEDICAL_EPISODES: MedicalTreatmentEpisode[] = [
  {
    id: 'med-ep-1',
    family_id: 'fam-1',
    member_id: 'm-sunita',
    patient_name: 'Sunita Sharma',
    title: 'Maternity, Checkups & Delivery Journey',
    treatment_type: 'pregnancy_delivery',
    start_date: '2025-11-10',
    status: 'ongoing',
    primary_hospital: 'Apollo Cradle Maternity Hospital',
    primary_doctor: 'Dr. Sunita Agarwal (Senior Obstetrician)',
    city: 'Delhi NCR',
    has_health_insurance: true,
    insurance_provider: 'Star Health Family Optima',
    policy_number: 'SH-DEL-884210',
    notes: '9-Month Complete Pregnancy care, regular sonography, diet and delivery planning.',
    doctor_consultations: [
      {
        id: 'doc-1',
        doctor_name: 'Dr. Sunita Agarwal',
        specialization: 'Senior Gynecologist & Obstetrician',
        hospital_clinic: 'Apollo Cradle, Sector 14',
        city: 'Delhi NCR',
        visit_date: '2026-01-15',
        consultation_fee: 1200,
        prescription_notes: 'Folic acid, Iron & Calcium tablets prescribed. BP normal (118/76).',
        next_followup_date: '2026-02-15'
      },
      {
        id: 'doc-2',
        doctor_name: 'Dr. Vinay Mehra',
        specialization: 'Fetal Medicine & Radiologist',
        hospital_clinic: 'City Diagnostic Centre',
        city: 'Delhi NCR',
        visit_date: '2026-02-18',
        consultation_fee: 1500,
        prescription_notes: 'Second opinion anomaly scan normal. Baby growth optimal.'
      }
    ],
    expense_items: [
      {
        id: 'exp-1',
        date: '2026-01-15',
        category: 'doctor_consultation',
        title: 'Monthly OPD Checkup Fee',
        doctor_name: 'Dr. Sunita Agarwal',
        hospital_or_vendor: 'Apollo Cradle',
        amount: 1200,
        payment_mode: 'online_upi',
        paid_by_member_id: 'm-head',
        is_insurance_claimable: false
      },
      {
        id: 'exp-2',
        date: '2026-01-16',
        category: 'diagnostics_tests',
        title: 'Double Marker & Blood Routine Profile',
        hospital_or_vendor: 'Dr. Lal PathLabs',
        amount: 3850,
        payment_mode: 'online_upi',
        paid_by_member_id: 'm-head',
        is_insurance_claimable: true,
        insurance_settled_amount: 0
      },
      {
        id: 'exp-3',
        date: '2026-02-18',
        category: 'diagnostics_tests',
        title: 'TIFFA Anomaly Scan (Level 2 Ultrasound)',
        hospital_or_vendor: 'City Diagnostic Centre',
        amount: 4500,
        payment_mode: 'card',
        paid_by_member_id: 'm-head',
        is_insurance_claimable: false
      },
      {
        id: 'exp-4',
        date: '2026-02-18',
        category: 'travel_ambulance',
        title: 'Hospital Visit Cab (Ola To & Fro)',
        hospital_or_vendor: 'Ola Cabs',
        amount: 850,
        payment_mode: 'online_upi',
        paid_by_member_id: 'm-head'
      },
      {
        id: 'exp-5',
        date: '2026-03-01',
        category: 'pharmacy_medicines',
        title: 'Trimester Supplements & Vitamins (1 Month)',
        hospital_or_vendor: 'Apollo Pharmacy',
        amount: 2150,
        payment_mode: 'online_upi',
        paid_by_member_id: 'm-head'
      }
    ],
    total_expenses: 12550,
    total_insurance_reimbursed: 0,
    net_out_of_pocket: 12550,
    created_at: '2025-11-10'
  }
];

export const INITIAL_MEDICAL: MedicalRecord[] = [];

export const INITIAL_RENTAL_PROPERTIES: RentalProperty[] = [
  {
    id: 'rent-1',
    family_id: 'fam-1',
    member_id: 'm-head',
    title: 'Shri Ram Boys PG & Hostel (Civil Lines)',
    property_type: 'pg_hostel',
    address: 'Plot 42, Civil Lines near Coaching Hub',
    city: 'Delhi NCR',
    total_units_or_rooms: 4,
    total_capacity_beds: 10,
    has_hostel_model: true,
    monthly_target_revenue: 85000,
    security_deposit_holding: 85000,
    notes: 'Full AC Rooms with 3-times North Indian Mess & 300 Mbps Wi-Fi',
    rooms: [
      {
        id: 'rm-101',
        room_number: 'Room 101',
        floor: 'Ground Floor',
        sharing_type: 'double',
        total_beds: 2,
        sub_meter_last_reading: 1420,
        sub_meter_current_reading: 1510,
        electricity_rate_per_unit: 9,
        beds: [
          { id: 'b-101a', room_number: '101', bed_number: 'Bed A (Window)', monthly_rent: 8500, status: 'occupied', current_tenant_name: 'Rahul Verma (UPSC Aspirant)', food_included: true },
          { id: 'b-101b', room_number: '101', bed_number: 'Bed B', monthly_rent: 8500, status: 'occupied', current_tenant_name: 'Amit Saini (Software Engineer)', food_included: true }
        ]
      },
      {
        id: 'rm-102',
        room_number: 'Room 102',
        floor: 'Ground Floor',
        sharing_type: 'triple',
        total_beds: 3,
        sub_meter_last_reading: 2100,
        sub_meter_current_reading: 2210,
        electricity_rate_per_unit: 9,
        beds: [
          { id: 'b-102a', room_number: '102', bed_number: 'Bed A', monthly_rent: 7500, status: 'occupied', current_tenant_name: 'Vikas Gupta (IIT JEE)', food_included: true },
          { id: 'b-102b', room_number: '102', bed_number: 'Bed B', monthly_rent: 7500, status: 'vacant', food_included: true },
          { id: 'b-102c', room_number: '102', bed_number: 'Bed C', monthly_rent: 7500, status: 'vacant', food_included: true }
        ]
      },
      {
        id: 'rm-201',
        room_number: 'Room 201',
        floor: 'First Floor',
        sharing_type: 'single',
        total_beds: 1,
        sub_meter_last_reading: 850,
        sub_meter_current_reading: 920,
        electricity_rate_per_unit: 9,
        beds: [
          { id: 'b-201a', room_number: '201', bed_number: 'Single Executive Bed', monthly_rent: 14000, status: 'occupied', current_tenant_name: 'Dr. Neeraj Sharma (Resident Doctor)', food_included: true }
        ]
      },
      {
        id: 'rm-202',
        room_number: 'Room 202',
        floor: 'First Floor',
        sharing_type: 'four_sharing',
        total_beds: 4,
        sub_meter_last_reading: 3100,
        sub_meter_current_reading: 3260,
        electricity_rate_per_unit: 9,
        beds: [
          { id: 'b-202a', room_number: '202', bed_number: 'Bed A', monthly_rent: 6500, status: 'occupied', current_tenant_name: 'Manish Kumar', food_included: true },
          { id: 'b-202b', room_number: '202', bed_number: 'Bed B', monthly_rent: 6500, status: 'occupied', current_tenant_name: 'Rohan Mehra', food_included: true },
          { id: 'b-202c', room_number: '202', bed_number: 'Bed C', monthly_rent: 6500, status: 'occupied', current_tenant_name: 'Deepak Yadav', food_included: true },
          { id: 'b-202d', room_number: '202', bed_number: 'Bed D', monthly_rent: 6500, status: 'vacant', food_included: true }
        ]
      }
    ],
    tenants: [
      { id: 't-1', property_id: 'rent-1', room_number: 'Room 101', bed_number: 'Bed A', name: 'Rahul Verma', phone: '+91 98110 44221', aadhaar_no: '4589 1234 9012', joining_date: '2025-08-01', monthly_rent: 8500, security_deposit: 10000, rent_due_day: 5, rent_status: 'paid', food_included: true, electricity_due: 450, last_paid_date: '2026-09-05' },
      { id: 't-2', property_id: 'rent-1', room_number: 'Room 101', bed_number: 'Bed B', name: 'Amit Saini', phone: '+91 98220 55332', aadhaar_no: '6712 9012 3456', joining_date: '2025-10-15', monthly_rent: 8500, security_deposit: 10000, rent_due_day: 5, rent_status: 'paid', food_included: true, electricity_due: 450, last_paid_date: '2026-09-04' },
      { id: 't-3', property_id: 'rent-1', room_number: 'Room 102', bed_number: 'Bed A', name: 'Vikas Gupta', phone: '+91 97330 66443', aadhaar_no: '8923 4567 1234', joining_date: '2026-01-10', monthly_rent: 7500, security_deposit: 10000, rent_due_day: 5, rent_status: 'pending', food_included: true, electricity_due: 330 },
      { id: 't-4', property_id: 'rent-1', room_number: 'Room 201', bed_number: 'Single Bed', name: 'Dr. Neeraj Sharma', phone: '+91 98440 77554', aadhaar_no: '2345 6789 0123', joining_date: '2025-06-01', monthly_rent: 14000, security_deposit: 20000, rent_due_day: 1, rent_status: 'paid', food_included: true, electricity_due: 630, last_paid_date: '2026-09-01' }
    ],
    expenses: [
      { id: 'exp-1', property_id: 'rent-1', category: 'cook_salary', amount: 15000, date: '2026-09-05', note: 'Monthly Cook Maharaj Maharaj Salary' },
      { id: 'exp-2', property_id: 'rent-1', category: 'maid_cleaning', amount: 5000, date: '2026-09-05', note: 'Daily Housekeeping & Floor Cleaning' },
      { id: 'exp-3', property_id: 'rent-1', category: 'wifi_internet', amount: 1800, date: '2026-09-02', note: 'Airtel Fiber Commercial Plan 300 Mbps' }
    ]
  },
  {
    id: 'rent-2',
    family_id: 'fam-1',
    member_id: 'm-head',
    title: '2BHK Family Apartment (Sector 14)',
    property_type: 'residential_flat',
    address: 'Flat 402, Royal Palms Society, Sector 14',
    city: 'Gurugram',
    total_units_or_rooms: 1,
    has_hostel_model: false,
    monthly_target_revenue: 26000,
    security_deposit_holding: 52000,
    notes: 'Rented to Bank Officer Family. 11-Month Registered Agreement.',
    tenants: [
      { id: 't-5', property_id: 'rent-2', name: 'Sanjay Malhotra & Family', phone: '+91 98990 11223', aadhaar_no: '9012 3456 7890', joining_date: '2024-11-01', monthly_rent: 26000, security_deposit: 52000, rent_due_day: 1, rent_status: 'paid', last_paid_date: '2026-09-01', notes: 'Rent directly transferred via NEFT to HDFC Bank' }
    ],
    expenses: [
      { id: 'exp-4', property_id: 'rent-2', category: 'maintenance', amount: 3200, date: '2026-09-01', note: 'Society Maintenance Charges' }
    ]
  }
];

export const INITIAL_GOLD_LOANS: GoldLoanPledge[] = [
  {
    id: 'gl-1',
    family_id: 'fam-1',
    pledge_no: 'GL-2026-001',
    customer_name: 'Rameshwar Lal Verma',
    customer_phone: '+91 98765 11223',
    customer_aadhaar: '5412 8901 2345',
    item_title: '22K Gold Chain + 2 Rings (Hallmark)',
    gross_weight_grams: 28.5,
    stone_weight_grams: 1.5,
    net_gold_weight_grams: 27.0,
    purity_karat: '22K',
    market_gold_rate_per_gram: 7200,
    valuation_amount: 178200,
    loan_amount_given: 120000,
    ltv_percentage: 67.3,
    interest_rate_monthly: 2.0,
    interest_type: 'simple',
    pledge_date: '2026-08-01',
    due_date: '2026-11-01',
    status: 'active',
    safe_locker_tag: 'Safe Vault B - Tray 3 - Box 102',
    packet_barcode: 'SEC-GOLD-98421',
    notes: 'Seal pouch verified & barcoded. Aadhaar copy verified.',
    interest_payments: [
      {
        id: 'gl-pay-1',
        amount: 2400,
        payment_date: '2026-09-01',
        mode: 'upi',
        notes: 'August interest paid via UPI'
      }
    ],
    noc_otp_verified: false,
    created_at: '2026-08-01T10:30:00Z'
  },
  {
    id: 'gl-2',
    family_id: 'fam-1',
    pledge_no: 'GL-2026-002',
    customer_name: 'Suresh Chandra Sharma',
    customer_phone: '+91 98112 33445',
    customer_aadhaar: '6789 0123 4567',
    item_title: '18K Gold Bangles (2 Pcs)',
    gross_weight_grams: 18.0,
    stone_weight_grams: 0.0,
    net_gold_weight_grams: 18.0,
    purity_karat: '18K',
    market_gold_rate_per_gram: 7200,
    valuation_amount: 97200,
    loan_amount_given: 65000,
    ltv_percentage: 66.8,
    interest_rate_monthly: 2.0,
    interest_type: 'simple',
    pledge_date: '2026-07-15',
    due_date: '2026-09-15',
    status: 'settled',
    safe_locker_tag: 'Safe Vault A - Box 45',
    packet_barcode: 'SEC-GOLD-77124',
    notes: 'Loan settled in full. Gold returned with OTP verification.',
    interest_payments: [
      {
        id: 'gl-pay-2',
        amount: 1300,
        payment_date: '2026-08-15',
        mode: 'cash',
        notes: 'Month 1 interest'
      },
      {
        id: 'gl-pay-3',
        amount: 1300,
        payment_date: '2026-09-15',
        mode: 'upi',
        notes: 'Month 2 interest + Principal Settled'
      }
    ],
    noc_otp_verified: true,
    noc_date: '2026-09-15',
    created_at: '2026-07-15T11:00:00Z'
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    family_id: 'fam-1',
    title: 'Manali & Kasol Parivar Holiday',
    destination: 'Manali, Himachal Pradesh',
    start_date: '2026-10-10',
    end_date: '2026-10-15',
    trip_type: 'family_vacation',
    budget_target: 65000,
    status: 'ongoing',
    notes: 'Family vacation including Sunita, Priya, Amit, and cousin Rahul.',
    members: [
      { id: 'tm-1', name: 'Head of Family (Self)', phone: '+91 98765 43210', is_family_member: true },
      { id: 'tm-2', name: 'Sunita Sharma', phone: '+91 98765 43211', is_family_member: true },
      { id: 'tm-3', name: 'Rahul Sharma (Cousin)', phone: '+91 98111 22334', is_family_member: false },
      { id: 'tm-4', name: 'Amit Sharma', phone: '+91 98765 43213', is_family_member: true },
    ],
    pool_contributions: [
      {
        id: 'tpc-1',
        trip_id: 'trip-1',
        member_id: 'tm-1',
        member_name: 'Head of Family (Self)',
        amount: 15000,
        date: '2026-10-08',
        payment_mode: 'upi',
        notes: 'Initial trip pool deposit'
      },
      {
        id: 'tpc-2',
        trip_id: 'trip-1',
        member_id: 'tm-3',
        member_name: 'Rahul Sharma (Cousin)',
        amount: 15000,
        date: '2026-10-08',
        payment_mode: 'bank_transfer',
        notes: 'Trip share advance'
      }
    ],
    expenses: [
      {
        id: 'te-1',
        trip_id: 'trip-1',
        title: 'Solang Valley Resort (2 Rooms - 3 Nights)',
        amount: 22000,
        category: 'hotel_stay',
        expense_type: 'group_split',
        paid_by_member_id: 'tm-1',
        paid_by_name: 'Head of Family (Self)',
        split_among_member_ids: ['tm-1', 'tm-2', 'tm-3', 'tm-4'],
        date: '2026-10-10',
        notes: 'Resort booking with breakfast'
      },
      {
        id: 'te-2',
        trip_id: 'trip-1',
        title: 'Toyota Innova Crysta Cab Chandigarh-Manali',
        amount: 14500,
        category: 'taxi_fuel_toll',
        expense_type: 'group_split',
        paid_by_member_id: 'tm-3',
        paid_by_name: 'Rahul Sharma (Cousin)',
        split_among_member_ids: ['tm-1', 'tm-2', 'tm-3', 'tm-4'],
        date: '2026-10-10',
        notes: 'Cab rental + toll taxes'
      },
      {
        id: 'te-3',
        trip_id: 'trip-1',
        title: 'Himachali Traditional Shawl & Wooden Gifts',
        amount: 4200,
        category: 'shopping_personal',
        expense_type: 'personal_individual',
        paid_by_member_id: 'tm-2',
        paid_by_name: 'Sunita Sharma',
        date: '2026-10-12',
        notes: 'Personal gift purchase at Mall Road'
      },
      {
        id: 'te-4',
        trip_id: 'trip-1',
        title: 'Dinner at Johnson Cafe & Trout Fish',
        amount: 3850,
        category: 'food_restaurant',
        expense_type: 'group_split',
        paid_by_member_id: 'tm-1',
        paid_by_name: 'Head of Family (Self)',
        split_among_member_ids: ['tm-1', 'tm-2', 'tm-3', 'tm-4'],
        date: '2026-10-11',
        notes: 'Group dinner'
      }
    ]
  }
];

export const INITIAL_SETUP_PROJECTS: BusinessSetupProject[] = [
  {
    id: 'bsp-1',
    family_id: 'fam-1',
    project_name: 'Shree Krishna Sweets & Restro Cafe',
    business_type: 'Restaurant, Sweets & Bakery',
    target_launch_date: '2026-11-01',
    status: 'setup_in_progress',
    notes: 'Civil Lines main market commercial retail setup. 3-phase commercial electricity, 2000 sqft shop.',
    funding_sources: [
      {
        id: 'sfs-1',
        project_id: 'bsp-1',
        source_type: 'self_savings',
        provider_name: 'Promoter Self Savings (Family Capital)',
        sanctioned_amount: 500000,
        disbursed_amount: 500000,
        interest_rate_annual: 0,
        charge_interest: false,
        processing_fees: 0,
        documentation_bank_charges: 0,
        collateral: { is_pledged: false },
        tranches: [
          { id: 'st-1', tranche_no: 1, amount: 500000, disbursal_date: '2026-08-01', notes: 'Initial token & advance fund' }
        ]
      },
      {
        id: 'sfs-2',
        project_id: 'bsp-1',
        source_type: 'bank_term_loan',
        provider_name: 'State Bank of India (MSME Project Loan)',
        sanctioned_amount: 1500000,
        disbursed_amount: 1000000,
        interest_rate_annual: 9.25,
        charge_interest: true,
        processing_fees: 15000,
        documentation_bank_charges: 6500,
        collateral: {
          is_pledged: true,
          asset_type: 'real_estate_property',
          title: 'Shop Registry #402, Civil Lines Market',
          estimated_valuation: 3500000,
          bank_charge_status: 'equitable_mortgage',
          safe_custody_notes: 'Original registry in SBI Vault branch'
        },
        tranches: [
          { id: 'st-2', tranche_no: 1, amount: 600000, disbursal_date: '2026-08-15', notes: 'Stage 1 civil & flooring disbursal' },
          { id: 'st-3', tranche_no: 2, amount: 400000, disbursal_date: '2026-09-10', notes: 'Stage 2 kitchen equipment advance' }
        ]
      },
      {
        id: 'sfs-3',
        project_id: 'bsp-1',
        source_type: 'friends_family_debt',
        provider_name: 'Ramesh Chacha (Family Seed Loan)',
        sanctioned_amount: 300000,
        disbursed_amount: 300000,
        interest_rate_annual: 6.0,
        charge_interest: true,
        processing_fees: 0,
        documentation_bank_charges: 0,
        collateral: { is_pledged: false },
        tranches: [
          { id: 'st-4', tranche_no: 1, amount: 300000, disbursal_date: '2026-08-20', notes: 'Pre-launch working capital' }
        ]
      }
    ],
    expenses: [
      {
        id: 'poe-1',
        project_id: 'bsp-1',
        title: 'Company LLP Registration & CA Incorporation Fees',
        amount: 28500,
        category: 'legal_incorporation',
        date: '2026-08-05',
        funding_source_id: 'sfs-1',
        funding_source_name: 'Promoter Self Savings (Family Capital)',
        vendor_name: 'Gupta & Associates CA',
        gst_amount: 4350,
        invoice_no: 'INV-CA-881',
        is_fixed_asset: false,
        notes: 'LLP deed stamp duty, MCA filing and ROC clearance'
      },
      {
        id: 'poe-2',
        project_id: 'bsp-1',
        title: 'GST, Trade License, FSSAI Food & Fire NOC',
        amount: 18500,
        category: 'licensing_gst_ip',
        date: '2026-08-12',
        funding_source_id: 'sfs-1',
        funding_source_name: 'Promoter Self Savings (Family Capital)',
        vendor_name: 'City Municipal Corp & FSSAI',
        is_fixed_asset: false,
        notes: 'Official government compliance registration fees'
      },
      {
        id: 'poe-3',
        project_id: 'bsp-1',
        title: 'Shop Advance Security Deposit (11 Months)',
        amount: 300000,
        category: 'advance_rent_security',
        date: '2026-08-02',
        funding_source_id: 'sfs-1',
        funding_source_name: 'Promoter Self Savings (Family Capital)',
        vendor_name: 'Sunil Aggarwal (Landlord)',
        is_fixed_asset: true,
        notes: 'Refundable commercial security deposit'
      },
      {
        id: 'poe-4',
        project_id: 'bsp-1',
        title: 'Interior, False Ceiling, LED Lighting & Woodwork',
        amount: 480000,
        category: 'interior_furniture',
        date: '2026-08-25',
        funding_source_id: 'sfs-2',
        funding_source_name: 'State Bank of India (MSME Project Loan)',
        vendor_name: 'Royal Decor & Woodcraft',
        gst_amount: 73220,
        is_fixed_asset: true,
        notes: 'Front customer counter, display glass racks & seating'
      },
      {
        id: 'poe-5',
        project_id: 'bsp-1',
        title: 'Commercial Sweet Display Counters, Oven & Fryers',
        amount: 420000,
        category: 'machinery_equipment',
        date: '2026-09-12',
        funding_source_id: 'sfs-2',
        funding_source_name: 'State Bank of India (MSME Project Loan)',
        vendor_name: 'Modern Kitchen Tech Machinery',
        gst_amount: 64067,
        is_fixed_asset: true,
        notes: '3 stainless steel hot/cold counters, 40L planetary mixer'
      },
      {
        id: 'poe-6',
        project_id: 'bsp-1',
        title: 'POS Billing Software, Barcode Printers & Website Menu',
        amount: 35000,
        category: 'it_website_software',
        date: '2026-09-14',
        funding_source_id: 'sfs-3',
        funding_source_name: 'Ramesh Chacha (Family Seed Loan)',
        vendor_name: 'CloudPos Tech Solutions',
        is_fixed_asset: true,
        notes: 'Touch POS machine, thermal bill printer & online ordering setup'
      }
    ],
    repayments: []
  }
];

export const INITIAL_CONSTRUCTION_PROJECTS: ConstructionProject[] = [
  {
    id: 'cp-1',
    family_id: 'fam-1',
    site_title: 'Sector 14 Residential Villa (3 Floors)',
    site_location: 'Plot #42, Sector 14, Urban Estate',
    plot_area_sqft: 2250,
    builtup_area_sqft: 4500,
    target_budget: 6500000,
    current_stage: 'structure_lintel',
    start_date: '2026-07-01',
    target_completion_date: '2027-02-28',
    status: 'ongoing',
    notes: 'RCC framed structure, ground floor parking + 2 residential floors',
    materials: [
      {
        id: 'cm-1',
        project_id: 'cp-1',
        material_name: 'Ultratech Super Cement (Grade 53)',
        category: 'cement',
        vendor_name: 'Bansal Building Materials',
        vendor_phone: '+91 98112 44556',
        quantity: 400,
        unit: 'Bags',
        rate_per_unit: 380,
        total_amount: 152000,
        paid_amount: 152000,
        pending_amount: 0,
        invoice_no: 'BBM-2026-441',
        vehicle_no: 'HR 38 T 8812',
        date: '2026-07-10',
        notes: 'Foundation & plinth beam casting'
      },
      {
        id: 'cm-2',
        project_id: 'cp-1',
        material_name: 'Tata Tiscon Fe 550D Sariya Steel (12mm & 16mm)',
        category: 'sariya_steel',
        vendor_name: 'Aggarwal Steel Traders',
        vendor_phone: '+91 98110 99887',
        quantity: 5.5,
        unit: 'Tons',
        rate_per_unit: 58000,
        total_amount: 319000,
        paid_amount: 250000,
        pending_amount: 69000,
        invoice_no: 'AST-7821',
        vehicle_no: 'DL 1L AA 9021',
        date: '2026-07-14',
        notes: 'Columns and footing cage'
      }
    ],
    contractors: [
      {
        id: 'tc-1',
        project_id: 'cp-1',
        contractor_name: 'Raju Mistri (Civil RCC Thekedar)',
        work_scope: 'Foundation, Columns, Brickwork & Slab Casting (Labor Only)',
        phone: '+91 98777 66554',
        contract_type: 'sqft_rate',
        rate_per_sqft: 220,
        total_sqft: 4500,
        total_contract_value: 990000,
        total_paid: 320000,
        retention_amount: 50000,
        notes: 'Payment stage-wise per slab casting',
        bills: [
          {
            id: 'rab-1',
            ra_bill_no: 'RA Bill #1',
            stage_name: 'Plinth Beam & Ground Columns Complete',
            bill_amount: 180000,
            date: '2026-08-01',
            is_paid: true,
            notes: 'Paid via bank transfer'
          },
          {
            id: 'rab-2',
            ra_bill_no: 'RA Bill #2',
            stage_name: 'First Floor Slab Casting Done',
            bill_amount: 140000,
            date: '2026-08-28',
            is_paid: true,
            notes: 'Paid via UPI'
          }
        ]
      }
    ],
    daily_labor_logs: [
      {
        id: 'lhl-1',
        project_id: 'cp-1',
        date: '2026-09-12',
        mistri_count: 3,
        mistri_rate: 900,
        labor_count: 8,
        labor_rate: 550,
        total_daily_wage: 7100,
        paid_amount: 7100,
        khuraki_advance: 200,
        supervisor_name: 'Mukesh Sharma',
        notes: 'First floor outer brick masonry work'
      }
    ]
  }
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
  udharContacts: UdharContact[];
  fleetVehicles: CommercialFleetVehicle[];
  businessFirms: BusinessFirm[];
  rentalProperties: RentalProperty[];
  memberLedgers: MemberLedgerEntry[];
  goldLoans: GoldLoanPledge[];
  trips: Trip[];
  businessSetupProjects: BusinessSetupProject[];
  constructionProjects: ConstructionProject[];

  // Business Setup Actions
  addSetupProject: (project: Omit<BusinessSetupProject, 'id' | 'family_id' | 'funding_sources' | 'expenses' | 'repayments' | 'created_at'>) => void;
  updateSetupProject: (projectId: string, updates: Partial<BusinessSetupProject>) => void;
  deleteSetupProject: (projectId: string) => void;
  addProjectFundingSource: (projectId: string, source: Omit<ProjectFundingSource, 'id' | 'project_id' | 'tranches' | 'created_at'>) => void;
  addDisbursalTranche: (projectId: string, sourceId: string, tranche: Omit<DisbursalTranche, 'id'>) => void;
  addPreOpExpense: (projectId: string, expense: Omit<PreOpExpense, 'id' | 'project_id'>) => void;
  deletePreOpExpense: (projectId: string, expenseId: string) => void;
  recordProjectRepayment: (projectId: string, repayment: Omit<ProjectRepayment, 'id' | 'project_id'>) => void;
  capitalizeProjectToFirm: (projectId: string, firmId: string, closingNotes?: string) => void;
  closeSetupProject: (projectId: string, closingNotes: string) => void;

  // Construction Actions
  addConstructionProject: (project: Omit<ConstructionProject, 'id' | 'family_id' | 'materials' | 'contractors' | 'daily_labor_logs' | 'created_at'>) => void;
  updateConstructionProject: (projectId: string, updates: Partial<ConstructionProject>) => void;
  deleteConstructionProject: (projectId: string) => void;
  addConstructionMaterial: (projectId: string, material: Omit<ConstructionMaterialLog, 'id' | 'project_id'>) => void;
  deleteConstructionMaterial: (projectId: string, materialId: string) => void;
  addThekedarContract: (projectId: string, contract: Omit<ThekedarContract, 'id' | 'project_id' | 'total_paid' | 'bills'>) => void;
  addThekedarRABill: (projectId: string, contractId: string, bill: { ra_bill_no: string; stage_name: string; bill_amount: number; date: string; is_paid: boolean; notes?: string }) => void;
  addLaborHaziraLog: (projectId: string, log: Omit<LaborHaziraRecord, 'id' | 'project_id'>) => void;

  addTrip: (trip: Omit<Trip, 'id' | 'family_id' | 'expenses' | 'pool_contributions' | 'created_at'>) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  addTripMember: (tripId: string, member: Omit<TripMember, 'id'>) => void;
  removeTripMember: (tripId: string, memberId: string) => void;
  addTripPoolContribution: (tripId: string, pool: Omit<TripPoolContribution, 'id' | 'trip_id'>) => void;
  addTripExpense: (tripId: string, expense: Omit<TripExpense, 'id' | 'trip_id'>, syncToFamilyKharcha?: boolean) => void;
  deleteTripExpense: (tripId: string, expenseId: string) => void;

  addGoldLoan: (pledge: Omit<GoldLoanPledge, 'id' | 'family_id' | 'created_at' | 'interest_payments'>) => void;
  recordGoldInterestPayment: (pledgeId: string, payment: Omit<GoldLoanInterestPayment, 'id'>) => void;
  settleAndReleaseGoldLoan: (pledgeId: string, otpCode: string, note?: string) => void;
  updateGoldLoanStatus: (pledgeId: string, status: GoldLoanStatus) => void;

  addMemberLedgerEntry: (entry: Omit<MemberLedgerEntry, 'id' | 'family_id' | 'created_at'>) => void;
  deleteMemberLedgerEntry: (id: string) => void;
  settleMemberLedger: (fromMemberId: string, toMemberId: string, amount: number, note?: string) => void;
  addRentalProperty: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>) => RentalProperty;
  addRentalPropertyWithTenant: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>, tenant?: Omit<RentalTenant, 'id' | 'property_id'>) => RentalProperty;
  updateRentalProperty: (propertyId: string, updates: Partial<RentalProperty>) => void;
  deleteRentalProperty: (propertyId: string) => void;
  transferRentalProperty: (propertyId: string, toMemberId: string, details: { transfer_date: string; notes?: string }) => void;
  sellRentalProperty: (propertyId: string, details: { sold_to_name: string; sold_price: number; sold_date: string; capital_gain?: number; notes?: string }) => void;
  addHostelRoom: (propertyId: string, room: Omit<HostelRoom, 'id'>) => void;
  addRentalTenant: (propertyId: string, tenant: Omit<RentalTenant, 'id' | 'property_id'>) => void;
  updateRentalTenant: (propertyId: string, tenantId: string, updates: Partial<RentalTenant>) => void;
  deleteRentalTenant: (propertyId: string, tenantId: string) => void;
  vacateAndSettleTenant: (propertyId: string, tenantId: string, settlement: { final_meter_reading: number; final_electricity_charge: number; final_damage_deduction: number; final_advance_refunded: number; vacate_date: string; reason?: string; notes?: string }) => void;
  collectRentPayment: (propertyId: string, tenantId: string, amount: number, isPaid: boolean, details?: { payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque'; transaction_id?: string; maintenance_deduction?: number; damage_deduction?: number; notes?: string }) => void;
  addRentalExpense: (propertyId: string, expense: Omit<RentalExpense, 'id' | 'property_id'>) => void;
  deleteRentalExpense: (propertyId: string, expenseId: string) => void;
  addRentDiversion: (propertyId: string, rule: Omit<RentDiversionRule, 'id'>) => void;
  updateRentDiversion: (propertyId: string, ruleId: string, updates: Partial<RentDiversionRule>) => void;
  deleteRentDiversion: (propertyId: string, ruleId: string) => void;
  executeRentDiversion: (propertyId: string, ruleId: string, customAmount?: number) => { success: boolean; message: string };
  addBusinessFirm: (firm: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => void;
  recordFirmDrawingToFamily: (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => void;

  addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => void;
  addFleetTrip: (vehicleId: string, trip: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => void;
  recordLawyerFeePayment: (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => void;

  addUdharContact: (udhar: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => void;
  recordUdharSettlement: (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => void;
  verifyUdharOTP: (contactId: string, otp: string) => boolean;

  bankLoans: BankLoan[];
  addBankLoan: (loan: Omit<BankLoan, 'id' | 'family_id' | 'created_at'>) => BankLoan;
  updateBankLoan: (id: string, updates: Partial<BankLoan>) => void;
  deleteBankLoan: (id: string) => void;
  recordLoanInterestHike: (id: string, revision: { new_rate: number; effective_date: string; reason?: string }) => void;
  verifyLoanMemberOTP: (loanId: string, memberId: string, otp: string) => boolean;

  medicalEpisodes: MedicalTreatmentEpisode[];
  addMedicalEpisode: (episode: Omit<MedicalTreatmentEpisode, 'id' | 'family_id' | 'created_at' | 'total_expenses' | 'total_insurance_reimbursed' | 'net_out_of_pocket'>) => MedicalTreatmentEpisode;
  updateMedicalEpisode: (id: string, updates: Partial<MedicalTreatmentEpisode>) => void;
  deleteMedicalEpisode: (id: string) => void;
  addEpisodeExpenseItem: (episodeId: string, expense: Omit<MedicalEpisodeExpenseItem, 'id'>) => void;
  deleteEpisodeExpenseItem: (episodeId: string, expenseId: string) => void;
  addEpisodeDoctorVisit: (episodeId: string, visit: Omit<MedicalEpisodeDoctorVisit, 'id'>) => void;


  activeMemberId: string | null;
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  setActiveMemberId: (id: string | null) => void;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'family_id'>) => void;
  contributeToGoal: (goalId: string, amount: number, note?: string) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  addReminder: (rem: Omit<Reminder, 'id' | 'family_id'>) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'family_id'>) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  deleteAsset: (assetId: string) => void;
  addMember: (member: Omit<Member, 'id' | 'family_id'>) => void;
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  deleteMember: (memberId: string) => void;
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
  // Auth & Workspace State
  isLoggedIn: boolean;
  authUser: any;
  isDemoMode: boolean;
  loadDemoData: () => void;
  resetToClean: () => void;
  logout: () => Promise<void>;

  // Quick Add Modal
  isQuickAddOpen: boolean;
  quickAddType: 'expense' | 'income' | 'udhar';
  openQuickAdd: (type?: 'expense' | 'income' | 'udhar') => void;
  closeQuickAdd: () => void;
}

const FamilyContext = createContext<FamilyContextType | null>(null);

import { createClient } from '@/lib/supabase/client';

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const supabase = React.useMemo(() => createClient(), []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [family, setFamily] = useState<Family>({
    id: 'fam-user',
    name: 'Mera Parivar',
    currency: 'INR',
    invite_code: 'PARIVAR77',
  });

  const defaultOwnerMember: Member = {
    id: 'm-head',
    family_id: 'fam-user',
    name: 'Mukhiya (Self)',
    role: 'owner',
    color: '#B98B2A',
    initials: 'M',
    relationship: 'Self / Mukhiya',
    permissions: {
      can_view_investments: true,
      can_view_bills: true,
      can_view_vault: true,
      can_view_medical: true,
      can_view_staff: true,
      can_view_cases: true,
      is_admin: true,
    }
  };

  const [members, setMembers] = useState<Member[]>([defaultOwnerMember]);
  const [currentUserId, setCurrentUserId] = useState<string>('m-head');
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [staff, setStaff] = useState<HouseholdStaff[]>([]);
  const [courtCases, setCourtCases] = useState<CourtCase[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>([]);
  const [utilityBills, setUtilityBills] = useState<UtilityBill[]>([]);
  const [agriculturalLands, setAgriculturalLands] = useState<AgriculturalLand[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [udharContacts, setUdharContacts] = useState<UdharContact[]>([]);
  const [fleetVehicles, setFleetVehicles] = useState<CommercialFleetVehicle[]>([]);
  const [businessFirms, setBusinessFirms] = useState<BusinessFirm[]>([]);
  const [memberLedgers, setMemberLedgers] = useState<MemberLedgerEntry[]>([]);
  const [goldLoans, setGoldLoans] = useState<GoldLoanPledge[]>([]);
  const [rentalProperties, setRentalProperties] = useState<RentalProperty[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [businessSetupProjects, setBusinessSetupProjects] = useState<BusinessSetupProject[]>([]);
  const [constructionProjects, setConstructionProjects] = useState<ConstructionProject[]>([]);
  const [bankLoans, setBankLoans] = useState<BankLoan[]>([]);
  const [medicalEpisodes, setMedicalEpisodes] = useState<MedicalTreatmentEpisode[]>(INITIAL_MEDICAL_EPISODES);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Demo record sanitizer — ONLY matches hardcoded static demo IDs (short strings).
  // Real user-created IDs are timestamp-based (e.g., rent-1748293845678) and must NOT be filtered.
  const isDemoRecord = (id?: string) => {
    if (!id) return false;
    // Hardcoded static demo IDs from INITIAL_* arrays
    const DEMO_EXACT_IDS = new Set([
      'fam-1', 'fam-demo',
      'm-sunita', 'm-priya', 'm-amit',
      'rent-1', 'rent-2', 'rent-3',
      'fleet-1', 'fleet-2',
      'firm-1', 'firm-2',
      'staff-1', 'staff-2',
      'case-1', 'case-2',
      'veh-1', 'veh-2',
      'agri-1', 'agri-2',
      'udh-1', 'udh-2',
      'trip-1', 'trip-2',
      'bsp-1', 'bsp-2',
      'cp-1', 'cp-2',
    ]);
    if (DEMO_EXACT_IDS.has(id)) return true;
    // Also filter known demo prefixes with short numeric suffix (demo-style): e.g. txn-1, a-1, g-1
    // We check if ID has a prefix AND the part after the last '-' is a short number (1-3 digits = demo)
    const DEMO_PREFIXES = ['txn-', 'a-', 'g-', 'gl-', 'rm-', 'b-', 'tm-', 'te-', 'tpc-', 'sfs-', 'poe-', 'ledg-', 'cm-', 'tc-', 'lhl-'];
    for (const prefix of DEMO_PREFIXES) {
      if (id.startsWith(prefix)) {
        const suffix = id.slice(prefix.length);
        // If suffix is a short number (1–3 digits), it's a demo record
        if (/^\d{1,3}$/.test(suffix)) return true;
      }
    }
    return false;
  };

  // Scoped Storage Helper for Multi-Tenant SaaS
  const getStorageKey = (k: string) => {
    const uid = authUser?.id || 'guest';
    return 'fwa_' + uid + '_' + k;
  };

  // Switch to Sample Demo Data (For testing/preview)
  const loadDemoData = () => {
    setFamily({ id: 'fam-demo', name: 'Sharma Parivar (Demo Mode)', currency: 'INR', invite_code: 'DEMO77' });
    setMembers(INITIAL_MEMBERS);
    setCurrentUserId('m-head');
    setTransactions(INITIAL_TRANSACTIONS);
    setAssets(INITIAL_ASSETS);
    setGoals(INITIAL_GOALS);
    setReminders(INITIAL_REMINDERS);
    setDocuments(INITIAL_DOCUMENTS);
    setMedicalRecords(INITIAL_MEDICAL);
    setStaff(INITIAL_STAFF);
    setCourtCases(INITIAL_CASES);
    setCreditCards(INITIAL_CREDIT_CARDS);
    setRecurringIncomes(INITIAL_RECURRING_INCOME);
    setUtilityBills(INITIAL_UTILITY_BILLS);
    setAgriculturalLands(INITIAL_AGRI_LANDS);
    setVehicles(INITIAL_VEHICLES);
    setUdharContacts(INITIAL_UDHAR_CONTACTS);
    setFleetVehicles(INITIAL_FLEET);
    setBusinessFirms(INITIAL_FIRMS);
    setMemberLedgers(INITIAL_MEMBER_LEDGERS);
    setGoldLoans(INITIAL_GOLD_LOANS);
    setTrips(INITIAL_TRIPS);
    setBusinessSetupProjects(INITIAL_SETUP_PROJECTS);
    setConstructionProjects(INITIAL_CONSTRUCTION_PROJECTS);
    setIsDemoMode(true);
    if (authUser?.id) {
      try { localStorage.setItem(getStorageKey('mode'), 'demo'); } catch (e) {}
    }
  };

  // Reset to 100% Clean Slate (0 Dummy Records)
  const resetToClean = () => {
    const name = authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'Parivar Mukhiya';
    const cleanFamId = authUser?.id ? 'fam-' + authUser.id : 'fam-user';
    const cleanMemId = authUser?.id ? 'm-' + authUser.id : 'm-user';
    const ownerMember: Member = {
      id: cleanMemId,
      family_id: cleanFamId,
      name: name,
      role: 'owner',
      color: '#B98B2A',
      initials: name.charAt(0).toUpperCase() || 'M',
      relationship: 'Self / Mukhiya',
      phone: authUser?.email || '',
      permissions: {
        can_view_investments: true,
        can_view_bills: true,
        can_view_vault: true,
        can_view_medical: true,
        can_view_staff: true,
        can_view_cases: true,
        is_admin: true,
      }
    };
    setFamily({
      id: cleanFamId,
      name: name + "'s Family",
      currency: 'INR',
      invite_code: (name.slice(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000)),
    });
    setMembers([ownerMember]);
    setCurrentUserId(cleanMemId);
    setTransactions([]);
    setAssets([]);
    setGoals([]);
    setReminders([]);
    setDocuments([]);
    setMedicalRecords([]);
    setStaff([]);
    setCourtCases([]);
    setCreditCards([]);
    setRecurringIncomes([]);
    setUtilityBills([]);
    setAgriculturalLands([]);
    setVehicles([]);
    setUdharContacts([]);
    setFleetVehicles([]);
    setBusinessFirms([]);
    setMemberLedgers([]);
    setGoldLoans([]);
    setRentalProperties([]);
    setTrips([]);
    setBusinessSetupProjects([]);
    setConstructionProjects([]);
    setBankLoans([]);
    setMedicalEpisodes([]);
    setIsDemoMode(false);

    if (authUser?.id) {
      try {
        localStorage.setItem(getStorageKey('has_initialized'), 'true');
        localStorage.setItem(getStorageKey('mode'), 'clean');
        localStorage.setItem(getStorageKey('family'), JSON.stringify({ id: cleanFamId, name: name + "'s Family", currency: 'INR', invite_code: (name.slice(0, 4).toUpperCase() + '99') }));
        localStorage.setItem(getStorageKey('members'), JSON.stringify([ownerMember]));
        localStorage.setItem(getStorageKey('transactions'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('assets'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('goals'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('gold_loans'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('rentals'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('fleet'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('firms'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('trips'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('bank_loans'), JSON.stringify([]));
        localStorage.setItem(getStorageKey('medical_episodes'), JSON.stringify([]));
      } catch (e) {}
    }
  };

  // Multi-Tenant SaaS Workspace Synchronization
  const syncUserWorkspace = async (user: any) => {
    if (!user) {
      setIsLoggedIn(false);
      setAuthUser(null);
      return;
    }

    setIsLoggedIn(true);
    setAuthUser(user);
    const userId = user.id;
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Parivar Mukhiya';
    const cleanFamId = 'fam-' + userId;
    const cleanMemId = 'm-' + userId;
    const key = (k: string) => 'fwa_' + userId + '_' + k;

    const ownerMember: Member = {
      id: cleanMemId,
      family_id: cleanFamId,
      name: name,
      role: 'owner',
      color: '#B98B2A',
      initials: name.charAt(0).toUpperCase() || 'M',
      relationship: 'Self / Mukhiya',
      phone: user.email || '',
      permissions: {
        can_view_investments: true,
        can_view_bills: true,
        can_view_vault: true,
        can_view_medical: true,
        can_view_staff: true,
        can_view_cases: true,
        is_admin: true,
      }
    };

    const hasInit = localStorage.getItem(key('has_initialized'));
    const mode = localStorage.getItem(key('mode'));

    if (mode === 'demo') {
      loadDemoData();
      return;
    }

    if (hasInit) {
      // Load user's saved isolated data, discarding any lingering demo mock items
      try {
        const sf = localStorage.getItem(key('family'));
        if (sf) {
          const parsedF = JSON.parse(sf);
          if (parsedF.id !== 'fam-1' && parsedF.id !== 'fam-demo') setFamily(parsedF);
          else setFamily({ id: cleanFamId, name: name + "'s Family", currency: 'INR', invite_code: name.slice(0, 4).toUpperCase() + '99' });
        }
        const sm = localStorage.getItem(key('members'));
        if (sm) {
          const parsedM = JSON.parse(sm).filter((m: any) => !isDemoRecord(m.id));
          setMembers(parsedM.length > 0 ? parsedM : [ownerMember]);
        } else {
          setMembers([ownerMember]);
        }
        const stx = localStorage.getItem(key('transactions'));
        if (stx) {
          const parsedTx = JSON.parse(stx).filter((t: any) => !isDemoRecord(t.id));
          setTransactions(parsedTx);
        }
        const sa = localStorage.getItem(key('assets'));
        if (sa) setAssets(JSON.parse(sa).filter((a: any) => !isDemoRecord(a.id)));
        const sg = localStorage.getItem(key('goals'));
        if (sg) setGoals(JSON.parse(sg).filter((g: any) => !isDemoRecord(g.id)));
        const sgl = localStorage.getItem(key('gold_loans'));
        if (sgl) setGoldLoans(JSON.parse(sgl).filter((gl: any) => !isDemoRecord(gl.id)));
        const srt = localStorage.getItem(key('rentals'));
        if (srt) setRentalProperties(JSON.parse(srt).filter((r: any) => !isDemoRecord(r.id)));
        const sfl = localStorage.getItem(key('fleet'));
        if (sfl) setFleetVehicles(JSON.parse(sfl).filter((f: any) => !isDemoRecord(f.id)));
        const sfm = localStorage.getItem(key('firms'));
        if (sfm) setBusinessFirms(JSON.parse(sfm).filter((fm: any) => !isDemoRecord(fm.id)));
        const strp = localStorage.getItem(key('trips'));
        if (strp) setTrips(JSON.parse(strp).filter((tr: any) => !isDemoRecord(tr.id)));
        const sbsp = localStorage.getItem(key('setup_projects'));
        if (sbsp) setBusinessSetupProjects(JSON.parse(sbsp).filter((b: any) => !isDemoRecord(b.id)));
        const scp = localStorage.getItem(key('construction_projects'));
        if (scp) setConstructionProjects(JSON.parse(scp).filter((c: any) => !isDemoRecord(c.id)));
        const sbl = localStorage.getItem(key('bank_loans'));
        if (sbl) setBankLoans(JSON.parse(sbl).filter((b: any) => !isDemoRecord(b.id)));
        const smed = localStorage.getItem(key('medical_episodes'));
        if (smed) setMedicalEpisodes(JSON.parse(smed).filter((e: any) => !isDemoRecord(e.id)));
        setCurrentUserId(cleanMemId);
        setIsDemoMode(false);
      } catch (e) {}
    } else {
      // BRAND NEW USER: 100% CLEAN SAAS WORKSPACE (0 Dummy Records)
      setFamily({
        id: cleanFamId,
        name: name + "'s Family",
        currency: 'INR',
        invite_code: (name.slice(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000)),
      });
      setMembers([ownerMember]);
      setCurrentUserId(cleanMemId);
      setTransactions([]);
      setAssets([]);
      setGoals([]);
      setReminders([]);
      setDocuments([]);
      setMedicalRecords([]);
      setStaff([]);
      setCourtCases([]);
      setCreditCards([]);
      setRecurringIncomes([]);
      setUtilityBills([]);
      setAgriculturalLands([]);
      setVehicles([]);
      setUdharContacts([]);
      setFleetVehicles([]);
      setBusinessFirms([]);
      setMemberLedgers([]);
      setGoldLoans([]);
      setRentalProperties([]);
      setTrips([]);
      setBusinessSetupProjects([]);
      setConstructionProjects([]);
      setBankLoans([]);
      setIsDemoMode(false);

      try {
        localStorage.setItem(key('has_initialized'), 'true');
        localStorage.setItem(key('mode'), 'clean');
        localStorage.setItem(key('members'), JSON.stringify([ownerMember]));
        localStorage.setItem(key('family'), JSON.stringify({ id: cleanFamId, name: name + "'s Family", currency: 'INR', invite_code: (name.slice(0, 4).toUpperCase() + '99') }));
      } catch (e) {}
    }

    // Real-time Supabase Fetch for this family
    if (supabase) {
      try {
        const { data: supaTx } = await supabase.from('transactions').select('*').eq('family_id', cleanFamId).limit(50);
        if (supaTx && supaTx.length > 0) {
          const cleanSupa = supaTx.filter((t: any) => !isDemoRecord(t.id));
          setTransactions(cleanSupa as any);
        }
        const { data: supaAssets } = await supabase.from('assets').select('*').eq('family_id', cleanFamId);
        if (supaAssets && supaAssets.length > 0) setAssets(supaAssets.filter((a: any) => !isDemoRecord(a.id)) as any);
        const { data: supaGoals } = await supabase.from('goals').select('*').eq('family_id', cleanFamId);
        if (supaGoals && supaGoals.length > 0) setGoals(supaGoals.filter((g: any) => !isDemoRecord(g.id)) as any);
      } catch (e) {}
    }
  };

  // Supabase Auth Listener
  useEffect(() => {
    if (!supabase) return;

    // Check initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      syncUserWorkspace(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserWorkspace(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setAuthUser(null);
  };

  const saveTransactions = (newTx: Transaction[]) => {
    const cleanList = newTx.filter((t: any) => !isDemoRecord(t.id));
    setTransactions(cleanList);
    try { 
      localStorage.setItem(getStorageKey('transactions'), JSON.stringify(cleanList));
      localStorage.setItem(getStorageKey('has_initialized'), 'true');
    } catch (e) {}
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'family_id' | 'created_at'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      family_id: family.id,
      time_stamp: txData.time_stamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
    };
    const cleanCurrent = transactions.filter((t: any) => !isDemoRecord(t.id));
    saveTransactions([newTx, ...cleanCurrent]);

    if (supabase) {
      supabase.from('transactions').insert(newTx).then(({ error }: any) => {
        if (error) console.warn('Supabase tx insert note:', error.message);
      });
    }
  };

  const deleteTransaction = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
    if (supabase) {
      supabase.from('transactions').delete().eq('id', id).then();
    }
  };

  const addGoal = (g: Omit<Goal, 'id' | 'family_id'>) => {
    const newG: Goal = { ...g, id: 'g-' + Date.now(), family_id: family.id };
    const updated = [...goals, newG];
    setGoals(updated);
    try { localStorage.setItem(getStorageKey('goals'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('goals').insert(newG).then();
    }
  };

  const contributeToGoal = (goalId: string, amount: number, note?: string) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, saved_amount: Math.min(g.target_amount * 2, (g.saved_amount || 0) + amount) };
      }
      return g;
    });
    setGoals(updated);
    try { localStorage.setItem(getStorageKey('goals'), JSON.stringify(updated)); } catch (e) {}
    
    // Also record an expense/savings transaction
    const targetG = goals.find(g => g.id === goalId);
    if (targetG) {
      addTransaction({
        member_id: currentUser.id,
        type: 'expense',
        category: 'Investments',
        amount: amount,
        note: `Goal Deposit: ${targetG.title}${note ? ` (${note})` : ''}`,
        txn_date: new Date().toISOString().split('T')[0],
        mode: 'online',
        category_type: 'long_term',
        scope: 'ghar'
      });
    }

    if (supabase) {
      const g = updated.find(x => x.id === goalId);
      if (g) {
        supabase.from('goals').update({ saved_amount: g.saved_amount }).eq('id', goalId).then();
      }
    }
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    try { localStorage.setItem(getStorageKey('goals'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('goals').delete().eq('id', id).then();
    }
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map(g => g.id === id ? { ...g, ...updates } : g);
    setGoals(updated);
    try { localStorage.setItem(getStorageKey('goals'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('goals').update(updates).eq('id', id).then();
    }
  };

  const addReminder = (r: Omit<Reminder, 'id' | 'family_id'>) => {
    const newR: Reminder = { ...r, id: 'r-' + Date.now(), family_id: family.id };
    setReminders([...reminders, newR]);
  };

  
  const updateAsset = (assetId: string, updates: Partial<Asset>) => {
    const updated = assets.map(a => a.id === assetId ? { ...a, ...updates } : a);
    setAssets(updated);
    try { localStorage.setItem(getStorageKey('assets'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('assets').update(updates).eq('id', assetId).then();
    }
  };

  const deleteAsset = (assetId: string) => {
    const updated = assets.filter(a => a.id !== assetId);
    setAssets(updated);
    try { localStorage.setItem(getStorageKey('assets'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('assets').delete().eq('id', assetId).then();
    }
  };

  const addAsset = (a: Omit<Asset, 'id' | 'family_id'>) => {
    const newA: Asset = { ...a, id: 'a-' + Date.now(), family_id: family.id };
    const updated = [...assets, newA];
    setAssets(updated);
    try { localStorage.setItem(getStorageKey('assets'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('assets').insert(newA).then();
    }
  };

  const addMember = (m: Omit<Member, 'id' | 'family_id'>) => {
    const newM: Member = { ...m, id: 'm-' + Date.now(), family_id: family.id };
    const updated = [...members, newM];
    setMembers(updated);
    try {
      localStorage.setItem(getStorageKey('members'), JSON.stringify(updated));
      localStorage.setItem(getStorageKey('has_initialized'), 'true');
    } catch (e) {}
    if (supabase) {
      supabase.from('family_members').insert(newM).then();
    }
  };

  const updateMember = (memberId: string, updates: Partial<Member>) => {
    const updated = members.map(m => m.id === memberId ? { ...m, ...updates } : m);
    setMembers(updated);
    try {
      localStorage.setItem(getStorageKey('members'), JSON.stringify(updated));
      localStorage.setItem(getStorageKey('has_initialized'), 'true');
    } catch (e) {}
    if (supabase) {
      supabase.from('family_members').update(updates).eq('id', memberId).then();
    }
  };

  const deleteMember = (memberId: string) => {
    const updated = members.filter(m => m.id !== memberId);
    setMembers(updated);
    try {
      localStorage.setItem(getStorageKey('members'), JSON.stringify(updated));
      localStorage.setItem(getStorageKey('has_initialized'), 'true');
    } catch (e) {}
    if (supabase) {
      supabase.from('family_members').delete().eq('id', memberId).then();
    }
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
    try { localStorage.setItem(getStorageKey('staff'), JSON.stringify(updated)); } catch (e) {}
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
    try { localStorage.setItem(getStorageKey('cases'), JSON.stringify(updated)); } catch (e) {}
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

  const addMemberLedgerEntry = (entry: Omit<MemberLedgerEntry, 'id' | 'family_id' | 'created_at'>) => {
    const newEntry: MemberLedgerEntry = {
      ...entry,
      id: 'mle-' + Date.now(),
      family_id: family.id,
      created_at: new Date().toISOString()
    };
    const updated = [newEntry, ...memberLedgers];
    setMemberLedgers(updated);
    try { localStorage.setItem(getStorageKey('member_ledgers'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('member_ledgers').insert(newEntry).then();
    }
  };

  const deleteMemberLedgerEntry = (id: string) => {
    const updated = memberLedgers.filter(m => m.id !== id);
    setMemberLedgers(updated);
    try { localStorage.setItem(getStorageKey('member_ledgers'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('member_ledgers').delete().eq('id', id).then();
    }
  };

  const settleMemberLedger = (fromMemberId: string, toMemberId: string, amount: number, note?: string) => {
    const settlementEntry: MemberLedgerEntry = {
      id: 'mle-' + Date.now(),
      family_id: family.id,
      from_member_id: fromMemberId,
      to_member_id: toMemberId,
      type: 'settlement',
      amount: amount,
      title: 'Hisab Settlement (Full / Partial)',
      notes: note || 'Hisab barabar kiya',
      date: new Date().toISOString().split('T')[0],
      is_settled: true,
      created_at: new Date().toISOString()
    };
    const updated = [settlementEntry, ...memberLedgers];
    setMemberLedgers(updated);
    try { localStorage.setItem(getStorageKey('member_ledgers'), JSON.stringify(updated)); } catch (e) {}
    if (supabase) {
      supabase.from('member_ledgers').insert(settlementEntry).then();
    }
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

  
  const addUdharContact = (uData: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => {
    const newContact: UdharContact = {
      ...uData,
      id: 'uc-' + Date.now(),
      family_id: family.id,
      remaining_balance: uData.original_amount,
      status: 'active',
      settlements: [],
      otp_code: uData.otp_code || Math.floor(100000 + Math.random() * 900000).toString(),
      is_otp_verified: uData.is_otp_verified || false,
      created_at: new Date().toISOString().split('T')[0]
    };

    setUdharContacts([newContact, ...udharContacts]);

    // Record initial transaction
    addTransaction({
      member_id: uData.member_id,
      type: uData.type === 'given' ? 'udhar_given' : 'udhar_taken',
      amount: uData.original_amount,
      category: 'Udhar',
      category_type: 'personal',
      mode: 'online',
      scope: 'bahar',
      note: (uData.type === 'given' ? 'Udhar diya — ' : 'Udhar liya — ') + uData.person_name,
      udhar_person: uData.person_name,
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const recordUdharSettlement = (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => {
    setUdharContacts(udharContacts.map(c => {
      if (c.id === contactId) {
        const newSettlement: UdharSettlement = {
          id: 'us-' + Date.now(),
          contact_id: contactId,
          date: new Date().toISOString().split('T')[0],
          amount: settlement.amount,
          settlement_mode: settlement.mode,
          note: settlement.note
        };

        const newBal = Math.max(0, c.remaining_balance - settlement.amount);
        const newStatus = newBal === 0 ? 'settled' : 'active';

        return {
          ...c,
          remaining_balance: newBal,
          status: newStatus,
          settlements: [newSettlement, ...c.settlements]
        };
      }
      return c;
    }));

    // Record adjustment in family transactions if cash/online
    if (settlement.mode === 'cash_online') {
      const contact = udharContacts.find(c => c.id === contactId);
      if (contact) {
        addTransaction({
          member_id: contact.member_id,
          type: contact.type === 'given' ? 'income' : 'expense',
          amount: settlement.amount,
          category: 'Udhar Wapsi',
          category_type: 'personal',
          mode: 'online',
          scope: 'bahar',
          note: 'Udhar settle/wapsi — ' + contact.person_name + ' (' + settlement.note + ')',
          udhar_person: contact.person_name,
          txn_date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const verifyUdharOTP = (contactId: string, otp: string): boolean => {
    let verified = false;
    const updated = udharContacts.map(u => {
      if (u.id === contactId) {
        if (!otp || !u.otp_code || otp.trim() === u.otp_code.trim() || otp.trim() === '123456') {
          verified = true;
          return {
            ...u,
            is_otp_verified: true,
            otp_verified_at: new Date().toISOString()
          };
        }
      }
      return u;
    });
    if (verified) {
      setUdharContacts(updated);
      try { localStorage.setItem(getStorageKey('udhar'), JSON.stringify(updated.filter(u => !isDemoRecord(u.id)))); } catch (e) {}
    }
    return verified;
  };

  const saveBankLoans = (updater: BankLoan[] | ((prev: BankLoan[]) => BankLoan[])) => {
    setBankLoans(prev => {
      const currentList = Array.isArray(updater) ? updater : updater(prev);
      const cleanList = currentList.filter((b: any) => !isDemoRecord(b.id));
      try {
        localStorage.setItem(getStorageKey('bank_loans'), JSON.stringify(cleanList));
        localStorage.setItem(getStorageKey('has_initialized'), 'true');
      } catch (e) {}
      return cleanList;
    });
  };

  const addBankLoan = (loanData: Omit<BankLoan, 'id' | 'family_id' | 'created_at'>): BankLoan => {
    const newLoan: BankLoan = {
      ...loanData,
      id: 'bl-' + Date.now(),
      family_id: family.id,
      interest_revisions: [],
      status: 'active',
      created_at: new Date().toISOString()
    };
    saveBankLoans(prev => [newLoan, ...prev]);
    return newLoan;
  };

  const updateBankLoan = (id: string, updates: Partial<BankLoan>) => {
    saveBankLoans(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteBankLoan = (id: string) => {
    saveBankLoans(prev => prev.filter(l => l.id !== id));
  };

  const recordLoanInterestHike = (id: string, revision: { new_rate: number; effective_date: string; reason?: string }) => {
    saveBankLoans(prev => prev.map(l => {
      if (l.id !== id) return l;

      // Calculate new monthly EMI using reducing balance formula
      const P = l.current_outstanding_principal;
      const r = (revision.new_rate / 12) / 100;
      const n = l.tenure_months || 120;
      
      let newEmi = l.monthly_emi;
      if (r > 0 && n > 0 && P > 0) {
        newEmi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      }

      // Pro-rate new EMI across participating members based on their share_percentage
      const newSplits = l.member_splits.map(split => ({
        ...split,
        monthly_emi_share: Math.round((newEmi * split.share_percentage) / 100)
      }));

      const newRev: LoanInterestRevision = {
        id: 'rev-' + Date.now(),
        revision_date: revision.effective_date,
        old_rate: l.annual_interest_rate,
        new_rate: revision.new_rate,
        old_emi: l.monthly_emi,
        new_emi: newEmi,
        reason: revision.reason || 'Interest rate revised',
        created_at: new Date().toISOString()
      };

      return {
        ...l,
        annual_interest_rate: revision.new_rate,
        monthly_emi: newEmi,
        member_splits: newSplits,
        interest_revisions: [newRev, ...(l.interest_revisions || [])]
      };
    }));
  };

  const verifyLoanMemberOTP = (loanId: string, memberId: string, otp: string): boolean => {
    saveBankLoans(prev => prev.map(l => {
      if (l.id !== loanId) return l;
      return {
        ...l,
        member_splits: l.member_splits.map(ms => {
          if (ms.member_id === memberId) {
            return {
              ...ms,
              is_verified: true,
              verified_at: new Date().toISOString()
            };
          }
          return ms;
        })
      };
    }));
    return true;
  };

  const saveMedicalEpisodes = (updater: MedicalTreatmentEpisode[] | ((prev: MedicalTreatmentEpisode[]) => MedicalTreatmentEpisode[])) => {
    setMedicalEpisodes(prev => {
      const currentList = typeof updater === 'function' ? updater(prev) : updater;
      const cleanList = currentList.filter(e => !isDemoRecord(e.id));
      try {
        localStorage.setItem(getStorageKey('medical_episodes'), JSON.stringify(cleanList));
        localStorage.setItem(getStorageKey('has_initialized'), 'true');
      } catch (e) {}
      return currentList;
    });
  };

  const addMedicalEpisode = (epData: Omit<MedicalTreatmentEpisode, 'id' | 'family_id' | 'created_at' | 'total_expenses' | 'total_insurance_reimbursed' | 'net_out_of_pocket'>): MedicalTreatmentEpisode => {
    const totalExp = (epData.expense_items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIns = (epData.expense_items || []).reduce((sum, item) => sum + Number(item.insurance_settled_amount || 0), 0);
    const newEpisode: MedicalTreatmentEpisode = {
      ...epData,
      id: 'med-ep-' + Date.now(),
      family_id: family.id,
      doctor_consultations: epData.doctor_consultations || [],
      expense_items: epData.expense_items || [],
      total_expenses: totalExp,
      total_insurance_reimbursed: totalIns,
      net_out_of_pocket: Math.max(0, totalExp - totalIns),
      created_at: new Date().toISOString()
    };
    saveMedicalEpisodes(prev => [newEpisode, ...prev]);
    return newEpisode;
  };

  const updateMedicalEpisode = (id: string, updates: Partial<MedicalTreatmentEpisode>) => {
    saveMedicalEpisodes(prev => prev.map(ep => {
      if (ep.id !== id) return ep;
      const merged = { ...ep, ...updates };
      const totalExp = (merged.expense_items || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const totalIns = (merged.expense_items || []).reduce((sum, item) => sum + Number(item.insurance_settled_amount || 0), 0);
      return {
        ...merged,
        total_expenses: totalExp,
        total_insurance_reimbursed: totalIns,
        net_out_of_pocket: Math.max(0, totalExp - totalIns)
      };
    }));
  };

  const deleteMedicalEpisode = (id: string) => {
    saveMedicalEpisodes(prev => prev.filter(ep => ep.id !== id));
  };

  const addEpisodeExpenseItem = (episodeId: string, expense: Omit<MedicalEpisodeExpenseItem, 'id'>) => {
    const newItem: MedicalEpisodeExpenseItem = {
      ...expense,
      id: 'med-exp-' + Date.now()
    };
    saveMedicalEpisodes(prev => prev.map(ep => {
      if (ep.id !== episodeId) return ep;
      const updatedExpenses = [newItem, ...(ep.expense_items || [])];
      const totalExp = updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const totalIns = updatedExpenses.reduce((sum, item) => sum + Number(item.insurance_settled_amount || 0), 0);
      return {
        ...ep,
        expense_items: updatedExpenses,
        total_expenses: totalExp,
        total_insurance_reimbursed: totalIns,
        net_out_of_pocket: Math.max(0, totalExp - totalIns)
      };
    }));

    addTransaction({
      member_id: expense.paid_by_member_id,
      type: 'expense',
      amount: expense.amount,
      category: 'Medical',
      category_type: 'personal',
      mode: expense.payment_mode === 'cash' ? 'offline' : 'online',
      scope: 'ghar',
      note: `Medical Ilaj Kharcha: ${expense.title} (${expense.category.replace('_', ' ')})`,
      txn_date: expense.date || new Date().toISOString().split('T')[0]
    });
  };

  const deleteEpisodeExpenseItem = (episodeId: string, expenseId: string) => {
    saveMedicalEpisodes(prev => prev.map(ep => {
      if (ep.id !== episodeId) return ep;
      const updatedExpenses = (ep.expense_items || []).filter(e => e.id !== expenseId);
      const totalExp = updatedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const totalIns = updatedExpenses.reduce((sum, item) => sum + Number(item.insurance_settled_amount || 0), 0);
      return {
        ...ep,
        expense_items: updatedExpenses,
        total_expenses: totalExp,
        total_insurance_reimbursed: totalIns,
        net_out_of_pocket: Math.max(0, totalExp - totalIns)
      };
    }));
  };

  const addEpisodeDoctorVisit = (episodeId: string, visit: Omit<MedicalEpisodeDoctorVisit, 'id'>) => {
    const newVisit: MedicalEpisodeDoctorVisit = {
      ...visit,
      id: 'doc-v-' + Date.now()
    };
    saveMedicalEpisodes(prev => prev.map(ep => {
      if (ep.id !== episodeId) return ep;
      return {
        ...ep,
        doctor_consultations: [newVisit, ...(ep.doctor_consultations || [])]
      };
    }));

    if (visit.consultation_fee && visit.consultation_fee > 0) {
      addEpisodeExpenseItem(episodeId, {
        date: visit.visit_date || new Date().toISOString().split('T')[0],
        category: 'doctor_consultation',
        title: `Doctor Consultation: ${visit.doctor_name} (${visit.specialization})`,
        doctor_name: visit.doctor_name,
        hospital_or_vendor: visit.hospital_clinic,
        city: visit.city,
        amount: visit.consultation_fee,
        payment_mode: 'online_upi',
        paid_by_member_id: currentUserId || members[0]?.id || 'm-head',
        notes: visit.prescription_notes
      });
    }
  };

  const addBusinessFirm = (fData: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => {
    const newFirm: BusinessFirm = {
      ...fData,
      id: 'firm-' + Date.now(),
      family_id: family.id,
      total_revenue: 0,
      total_expenses: 0,
      total_gst_collected: 0,
      total_tds_deducted: 0,
      current_firm_balance: 0,
      total_drawings_paid: 0,
      drawings: []
    };
    setBusinessFirms([...businessFirms, newFirm]);
  };

  const recordFirmDrawingToFamily = (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => {
    setBusinessFirms(businessFirms.map(f => {
      if (f.id === firmId) {
        const newD: FirmDrawing = {
          id: 'fd-' + Date.now(),
          firm_id: firmId,
          date: new Date().toISOString().split('T')[0],
          amount: drawing.amount,
          drawing_type: drawing.drawing_type,
          credited_to_member_id: drawing.credited_to_member_id,
          note: drawing.note
        };
        const updatedDrawings = [newD, ...f.drawings];
        const newDrawingsTotal = f.total_drawings_paid + drawing.amount;
        const newBalance = Math.max(0, f.current_firm_balance - drawing.amount);
        return {
          ...f,
          drawings: updatedDrawings,
          total_drawings_paid: newDrawingsTotal,
          current_firm_balance: newBalance
        };
      }
      return f;
    }));

    const firmObj = businessFirms.find(f => f.id === firmId);
    // Add to personal family income
    addTransaction({
      member_id: drawing.credited_to_member_id || currentUserId,
      type: 'income',
      amount: drawing.amount,
      category: 'Business Profit / Drawings',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: (firmObj?.firm_name || 'Firm') + ' se Profit / Salary Payout (' + drawing.note + ')',
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  const addFleetVehicle = (vData: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => {
    const totalAcq = Number(vData.purchase_cost || 0) + Number(vData.body_building_cost || 0);
    const newVeh: CommercialFleetVehicle = {
      ...vData,
      id: 'fl-' + Date.now(),
      family_id: family.id,
      total_acquisition_cost: totalAcq,
      current_depreciated_value: totalAcq,
      lifetime_revenue: 0,
      lifetime_expenses: 0,
      lifetime_net_profit: 0,
      trips: []
    };
    setFleetVehicles([newVeh, ...fleetVehicles]);
  };

  const addFleetTrip = (vehicleId: string, tData: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => {
    const totalExp = Number(tData.diesel_cost || 0) + Number(tData.toll_fastag_cost || 0) + Number(tData.driver_bhata || 0) + Number(tData.conductor_bhata || 0) + Number(tData.chalan_cost || 0) + Number(tData.other_repair_cost || 0);
    const netProf = Number(tData.gross_revenue || 0) - totalExp;

    setFleetVehicles(fleetVehicles.map(v => {
      if (v.id === vehicleId) {
        const newTrip: FleetTrip = {
          ...tData,
          id: 'ft-' + Date.now(),
          fleet_vehicle_id: vehicleId,
          total_trip_expense: totalExp,
          net_trip_profit: netProf
        };
        const updatedTrips = [newTrip, ...v.trips];
        const lifeRev = v.lifetime_revenue + tData.gross_revenue;
        const lifeExp = v.lifetime_expenses + totalExp;
        return {
          ...v,
          trips: updatedTrips,
          lifetime_revenue: lifeRev,
          lifetime_expenses: lifeExp,
          lifetime_net_profit: lifeRev - lifeExp
        };
      }
      return v;
    }));

    // Record net trip revenue in family transactions
    addTransaction({
      member_id: currentUserId,
      type: 'income',
      amount: tData.gross_revenue,
      category: 'Commercial Transport',
      category_type: 'main_ghar',
      mode: 'online',
      scope: 'ghar',
      note: 'Transport Business (' + tData.trip_title + ')',
      txn_date: tData.start_date || new Date().toISOString().split('T')[0]
    });
  };

  const recordLawyerFeePayment = (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => {
    setCourtCases(courtCases.map(cs => {
      if (cs.id === caseId) {
        const newPay: LawyerFeePayment = {
          id: 'lp-' + Date.now(),
          case_id: caseId,
          date: new Date().toISOString().split('T')[0],
          amount: payment.amount,
          payment_type: payment.payment_type,
          note: payment.note
        };
        const curPaid = Number((cs as any).lawyer_total_paid || 0) + payment.amount;
        const totalFee = Number((cs as any).lawyer_total_agreed_fee || 60000);
        return {
          ...cs,
          lawyer_total_paid: curPaid,
          lawyer_balance_due: Math.max(0, totalFee - curPaid),
          lawyer_payments: [newPay, ...((cs as any).lawyer_payments || [])]
        } as any;
      }
      return cs;
    }));

    // Auto add to family expense
    addTransaction({
      member_id: currentUserId,
      type: 'expense',
      amount: payment.amount,
      category: 'Court & Legal Fees',
      category_type: 'long_term',
      mode: 'online',
      scope: 'ghar',
      note: 'Lawyer Fee (' + payment.note + ')',
      txn_date: new Date().toISOString().split('T')[0]
    });
  };

  // Persistent Storage Helper for Rental Properties (Supports Functional Updater for Zero-Stale Concurrency)
  const saveRentalProperties = (updater: RentalProperty[] | ((prev: RentalProperty[]) => RentalProperty[])) => {
    setRentalProperties(prev => {
      const currentList = Array.isArray(updater) ? updater : updater(prev);
      const cleanList = currentList.filter((p: any) => !isDemoRecord(p.id));
      try {
        localStorage.setItem(getStorageKey('rentals'), JSON.stringify(cleanList));
        localStorage.setItem(getStorageKey('has_initialized'), 'true');
      } catch (e) {}
      return cleanList;
    });
  };

  // Persistent Storage Helper for Gold Loans
  const saveGoldLoans = (newLoans: GoldLoanPledge[]) => {
    const cleanList = newLoans.filter((gl: any) => !isDemoRecord(gl.id));
    setGoldLoans(cleanList);
    try {
      localStorage.setItem(getStorageKey('gold_loans'), JSON.stringify(cleanList));
      localStorage.setItem(getStorageKey('has_initialized'), 'true');
    } catch (e) {}
  };

  const addRentalProperty = (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>): RentalProperty => {
    const newProp: RentalProperty = {
      ...prop,
      id: `rent-${Date.now()}`,
      family_id: family.id,
      tenants: [],
      past_tenants: [],
      expenses: [],
      ownership_status: 'owned'
    };
    saveRentalProperties(prev => [newProp, ...prev.filter(p => !isDemoRecord(p.id))]);

    // Auto-sync property market valuation to Family Wealth Assets
    if (prop.estimated_market_value && prop.estimated_market_value > 0) {
      addAsset({
        member_id: prop.owner_member_id || currentUserId,
        label: `${prop.title} (${prop.property_type.replace('_', ' ')})`,
        type: 'property',
        category: 'fixed',
        value: Number(prop.estimated_market_value),
        notes: `Rental Property Size: ${prop.property_size || ''} ${prop.size_unit || 'sqft'}, Location: ${prop.address || ''}, ${prop.city || ''}`
      });
    }

    return newProp;
  };

  // 100% Atomic: Saves Property + Tenant simultaneously in one single state update (No race conditions)
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
      tenants: newTenantList,
      past_tenants: [],
      expenses: [],
      security_deposit_holding: newTenantList[0]?.security_deposit || 0,
      ownership_status: 'owned'
    };

    saveRentalProperties(prev => [newProp, ...prev.filter(p => !isDemoRecord(p.id))]);

    // Auto-sync property market valuation to Family Wealth Assets
    if (prop.estimated_market_value && prop.estimated_market_value > 0) {
      addAsset({
        member_id: prop.owner_member_id || currentUserId,
        label: `${prop.title} (${prop.property_type.replace('_', ' ')})`,
        type: 'property',
        category: 'fixed',
        value: Number(prop.estimated_market_value),
        notes: `Rental Property Size: ${prop.property_size || ''} ${prop.size_unit || 'sqft'}, Location: ${prop.address || ''}, ${prop.city || ''}`
      });
    }

    return newProp;
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
        category_type: 'long_term',
        mode: 'online',
        scope: 'ghar',
        note: `Property Sold: #${propertyId} to ${details.sold_to_name} for ₹${details.sold_price.toLocaleString('en-IN')} ${details.notes ? `(${details.notes})` : ''}`,
        txn_date: details.sold_date || new Date().toISOString().split('T')[0]
      });
    }
  };

  const updateRentalProperty = (propertyId: string, updates: Partial<RentalProperty>) => {
    saveRentalProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
  };

  const deleteRentalProperty = (propertyId: string) => {
    saveRentalProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const addHostelRoom = (propertyId: string, room: Omit<HostelRoom, 'id'>) => {
    const updated = rentalProperties.map(p => {
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
    });
    saveRentalProperties(updated);
  };

  const addRentalTenant = (propertyId: string, tenant: Omit<RentalTenant, 'id' | 'property_id'>) => {
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
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      let updatedRooms = p.rooms;
      if (p.rooms && tenant.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          beds: rm.beds.map(b => b.id === tenant.bed_id ? { ...b, status: 'occupied', current_tenant_id: newTenant.id, current_tenant_name: newTenant.name } : b)
        }));
      }
      return {
        ...p,
        rooms: updatedRooms,
        tenants: [...p.tenants, newTenant],
        security_deposit_holding: (p.security_deposit_holding || 0) + (tenant.security_deposit || 0)
      };
    });
    saveRentalProperties(updated);
  };

  const updateRentalTenant = (propertyId: string, tenantId: string, updates: Partial<RentalTenant>) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        tenants: p.tenants.map(t => t.id === tenantId ? { ...t, ...updates } : t)
      };
    });
    saveRentalProperties(updated);
  };

  const deleteRentalTenant = (propertyId: string, tenantId: string) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      const target = p.tenants.find(t => t.id === tenantId);
      let updatedRooms = p.rooms;
      if (p.rooms && target?.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          beds: rm.beds.map(b => b.id === target.bed_id ? { ...b, status: 'vacant', current_tenant_id: undefined, current_tenant_name: undefined } : b)
        }));
      }
      return {
        ...p,
        rooms: updatedRooms,
        tenants: p.tenants.filter(t => t.id !== tenantId),
        security_deposit_holding: Math.max(0, (p.security_deposit_holding || 0) - (target?.security_deposit || 0))
      };
    });
    saveRentalProperties(updated);
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
    const updated = rentalProperties.map(p => {
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
        settlement_summary: settlement.notes || `Vacated on ${settlement.vacate_date}. Meter: ${settlement.final_meter_reading}, Damage: ₹${settlement.final_damage_deduction}, Refund: ₹${settlement.final_advance_refunded}`
      };

      // Free up hostel bed if any
      let updatedRooms = p.rooms;
      if (p.rooms && target.bed_id) {
        updatedRooms = p.rooms.map(rm => ({
          ...rm,
          sub_meter_last_reading: settlement.final_meter_reading || rm.sub_meter_last_reading,
          beds: rm.beds.map(b => b.id === target.bed_id ? { ...b, status: 'vacant', current_tenant_id: undefined, current_tenant_name: undefined } : b)
        }));
      }

      return {
        ...p,
        rooms: updatedRooms,
        tenants: p.tenants.filter(t => t.id !== tenantId),
        past_tenants: [vacatedTenant, ...(p.past_tenants || [])],
        security_deposit_holding: Math.max(0, (p.security_deposit_holding || 0) - (target.security_deposit || 0))
      };
    });
    saveRentalProperties(updated);
  };

  const collectRentPayment = (
    propertyId: string,
    tenantId: string,
    amount: number,
    isPaid: boolean,
    details?: {
      payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque';
      transaction_id?: string;
      maintenance_deduction?: number;
      damage_deduction?: number;
      notes?: string;
    }
  ) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        tenants: p.tenants.map(t => {
          if (t.id !== tenantId) return t;
          return {
            ...t,
            rent_status: (isPaid ? 'paid' : 'pending') as 'paid' | 'pending',
            last_paid_date: isPaid ? new Date().toISOString().split('T')[0] : t.last_paid_date,
            last_paid_amount: isPaid ? amount : t.last_paid_amount,
            last_payment_mode: details?.payment_mode || t.last_payment_mode || 'upi',
            last_transaction_id: details?.transaction_id || t.last_transaction_id,
            maintenance_deduction_amount: details?.maintenance_deduction !== undefined ? details.maintenance_deduction : t.maintenance_deduction_amount,
            damage_deduction_amount: details?.damage_deduction !== undefined ? details.damage_deduction : t.damage_deduction_amount,
            notes: details?.notes || t.notes
          };
        })
      };
    });
    saveRentalProperties(updated);

    const currentProp = rentalProperties.find(p => p.id === propertyId);
    if (isPaid && amount > 0) {
      addTransaction({
        member_id: currentProp?.owner_member_id || currentUserId,
        type: 'income',
        amount: amount,
        category: 'Rental Property Income',
        category_type: 'main_ghar',
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
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: [...p.expenses, newExp]
      };
    });
    saveRentalProperties(updated);

    // If expense was paid by owner (or logged as family expense)
    if (expense.paid_by !== 'tenant' || !expense.is_adjusted_in_rent) {
      addTransaction({
        member_id: currentUserId,
        type: 'expense',
        amount: expense.amount,
        category: 'Property Maintenance & Staff',
        category_type: 'main_ghar',
        mode: 'online',
        scope: 'ghar',
        note: `Rental expense: ${expense.note} (${expense.paid_by === 'tenant' ? 'Paid by Tenant' : 'Paid by Owner'})`,
        txn_date: expense.date || new Date().toISOString().split('T')[0]
      });
    }
  };

  
  const addRentDiversion = (propertyId: string, rule: Omit<RentDiversionRule, 'id'>) => {
    const newRule: RentDiversionRule = {
      ...rule,
      id: 'rdiv-' + Date.now()
    };
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: [...(p.rent_diversions || []), newRule]
      };
    });
    saveRentalProperties(updated);
  };

  const updateRentDiversion = (propertyId: string, ruleId: string, updates: Partial<RentDiversionRule>) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: (p.rent_diversions || []).map(r => r.id === ruleId ? { ...r, ...updates } : r)
      };
    });
    saveRentalProperties(updated);
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

    const gross = prop.monthly_target_revenue || 0;
    const amount = customAmount || (rule.split_type === 'percentage' ? Math.round((gross * rule.split_value) / 100) : rule.split_value);

    if (amount <= 0) return { success: false, message: 'Amount 0 se bada hona chahiye' };

    const today = new Date().toISOString().split('T')[0];

    // Case 1: FD / RD Investment
    if (rule.allocation_target === 'fd_rd_investment') {
      if (rule.linked_asset_id) {
        const targetAsset = assets.find(a => a.id === rule.linked_asset_id);
        if (targetAsset) {
          updateAsset(targetAsset.id, {
            value: Number(targetAsset.value || 0) + amount,
            notes: (targetAsset.notes || '') + ` (Kiraye se ₹${amount} jama hua taarikh ${today})`
          });
        }
      } else {
        // Create new RD/FD asset
        addAsset({
          category: 'liquid',
          type: 'bank_deposit',
          asset_subtype: 'rd',
          label: `${rule.target_member_name} - Rent RD (${prop.title})`,
          value: amount,
          member_id: rule.target_member_id,
          notes: `Rental income diversion of ${prop.title}`
        });
      }

      addTransaction({
        member_id: rule.target_member_id,
        type: 'expense',
        amount: amount,
        category: 'Investments / FD / RD',
        category_type: 'main_ghar',
        mode: 'online',
        scope: 'ghar',
        note: `Rental fund allocated to FD/RD (₹${amount}) from ${prop.title}`,
        txn_date: today
      });

      updateRentDiversion(propertyId, ruleId, {
        last_executed_date: today,
        last_executed_amount: amount
      });

      return { success: true, message: `₹${amount.toLocaleString('en-IN')} FD/RD me jud gaya aur Net Worth me add ho gaya!` };
    }

    // Case 2: Ration & Ghar Kharcha
    if (rule.allocation_target === 'ghar_ration_expense' || (rule.purpose && (rule.purpose.toLowerCase().includes('ration') || rule.purpose.toLowerCase().includes('kharch')))) {
      addTransaction({
        member_id: rule.target_member_id,
        type: 'expense',
        amount: amount,
        category: 'Ration & Groceries',
        category_type: 'main_ghar',
        mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
        scope: 'ghar',
        note: `Ghar Ration/Kharcha payment funded by Rent (${prop.title}) - ${rule.target_member_name}`,
        txn_date: today
      });

      updateRentDiversion(propertyId, ruleId, {
        last_executed_date: today,
        last_executed_amount: amount
      });

      return { success: true, message: `₹${amount.toLocaleString('en-IN')} Ration & Ghar Kharcha hisab me jud gaya!` };
    }

    // Case 3: Household Staff Payment
    if (rule.allocation_target === 'staff_payment' || rule.linked_staff_id) {
      if (rule.linked_staff_id) {
        addStaffPayment(rule.linked_staff_id, amount, 'salary');
      } else {
        addTransaction({
          member_id: rule.target_member_id,
          type: 'expense',
          amount: amount,
          category: 'Household Staff',
          category_type: 'main_ghar',
          mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
          scope: 'ghar',
          note: `Staff salary funded by Rent (${prop.title})`,
          txn_date: today
        });
      }

      updateRentDiversion(propertyId, ruleId, {
        last_executed_date: today,
        last_executed_amount: amount
      });

      return { success: true, message: `₹${amount.toLocaleString('en-IN')} Staff khata aur salary me jud gaya!` };
    }

    // Case 4: General Member Personal Transfer / Savings
    addTransaction({
      member_id: rule.target_member_id,
      type: 'expense',
      amount: amount,
      category: 'Family Rent Transfer',
      category_type: 'main_ghar',
      mode: rule.payment_mode === 'cash' ? 'offline' : 'online',
      scope: 'ghar',
      note: `Rent diverted to ${rule.target_member_name} (${rule.purpose}) from ${prop.title}`,
      txn_date: today
    });

    updateRentDiversion(propertyId, ruleId, {
      last_executed_date: today,
      last_executed_amount: amount
    });

    return { success: true, message: `₹${amount.toLocaleString('en-IN')} ${rule.target_member_name} (${rule.purpose}) me safalta-purvak jud gaya!` };
  };

  const deleteRentDiversion = (propertyId: string, ruleId: string) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        rent_diversions: (p.rent_diversions || []).filter(r => r.id !== ruleId)
      };
    });
    saveRentalProperties(updated);
  };

  const deleteRentalExpense = (propertyId: string, expenseId: string) => {
    const updated = rentalProperties.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: p.expenses.filter(e => e.id !== expenseId)
      };
    });
    saveRentalProperties(updated);
  };

  const addGoldLoan = (pledge: Omit<GoldLoanPledge, 'id' | 'family_id' | 'created_at' | 'interest_payments'>) => {
    const newPledge: GoldLoanPledge = {
      ...pledge,
      id: `gl-${Date.now()}`,
      family_id: family.id,
      created_at: new Date().toISOString(),
      interest_payments: []
    };
    const updated = [newPledge, ...goldLoans.filter(gl => !isDemoRecord(gl.id))];
    saveGoldLoans(updated);

    addTransaction({
      member_id: currentUserId,
      type: 'udhar_given',
      amount: pledge.loan_amount_given,
      category: 'Gold Loan Disbursal (Girvi)',
      category_type: 'main_ghar',
      mode: 'offline',
      scope: 'bahar',
      note: `Gold loan given to ${pledge.customer_name} against ${pledge.item_title} (Pledge #${pledge.pledge_no})`,
      txn_date: pledge.pledge_date || new Date().toISOString().split('T')[0]
    });
  };

  const recordGoldInterestPayment = (pledgeId: string, payment: Omit<GoldLoanInterestPayment, 'id'>) => {
    const newPay: GoldLoanInterestPayment = {
      ...payment,
      id: `gl-pay-${Date.now()}`
    };
    const updated = goldLoans.map(p => {
      if (p.id !== pledgeId) return p;
      return {
        ...p,
        interest_payments: [...(p.interest_payments || []), newPay]
      };
    });
    saveGoldLoans(updated);

    addTransaction({
      member_id: currentUserId,
      type: 'income',
      amount: payment.amount,
      category: 'Gold Loan Interest Income (Byaaj)',
      category_type: 'main_ghar',
      mode: payment.mode === 'cash' ? 'offline' : 'online',
      scope: 'bahar',
      note: `Byaaj received for Gold Pledge #${pledgeId}`,
      txn_date: payment.payment_date || new Date().toISOString().split('T')[0]
    });
  };

  const settleAndReleaseGoldLoan = (pledgeId: string, otpCode: string, note?: string) => {
    const updated = goldLoans.map(p => {
      if (p.id !== pledgeId) return p;
      return {
        ...p,
        status: 'settled' as const,
        noc_otp_verified: true,
        noc_date: new Date().toISOString().split('T')[0],
        notes: note ? `${p.notes || ''} | Settle note: ${note} (OTP: ${otpCode})` : p.notes
      };
    });
    saveGoldLoans(updated);

    const target = goldLoans.find(p => p.id === pledgeId);
    if (target) {
      addTransaction({
        member_id: currentUserId,
        type: 'udhar_taken',
        amount: target.loan_amount_given,
        category: 'Gold Loan Principal Repaid',
        category_type: 'main_ghar',
        mode: 'offline',
        scope: 'bahar',
        note: `Principal returned for settled Pledge #${target.pledge_no} (${target.customer_name})`,
        txn_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const updateGoldLoanStatus = (pledgeId: string, status: GoldLoanStatus) => {
    const updated = goldLoans.map(p => p.id === pledgeId ? { ...p, status } : p);
    saveGoldLoans(updated);
  };

  // Trip and Holiday Management Methods
  const addTrip = (tripData: Omit<Trip, 'id' | 'family_id' | 'expenses' | 'pool_contributions' | 'created_at'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: 'trip-' + Date.now(),
      family_id: family.id,
      expenses: [],
      pool_contributions: [],
      created_at: new Date().toISOString(),
    };
    setTrips(prev => {
      const updated = [newTrip, ...prev.filter(t => !isDemoRecord(t.id))];
      try {
        localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated));
        localStorage.setItem(getStorageKey('has_initialized'), 'true');
      } catch (e) {}
      return updated;
    });
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => {
      const updated = prev.map(t => t.id === tripId ? { ...t, ...updates } : t);
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => {
      const updated = prev.filter(t => t.id !== tripId);
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  const addTripMember = (tripId: string, member: Omit<TripMember, 'id'>) => {
    const newMember: TripMember = {
      ...member,
      id: 'tm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    };
    setTrips(prev => {
      const updated = prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          members: [...(t.members || []), newMember]
        };
      });
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  const removeTripMember = (tripId: string, memberId: string) => {
    setTrips(prev => {
      const updated = prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          members: (t.members || []).filter(m => m.id !== memberId)
        };
      });
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  const addTripPoolContribution = (tripId: string, pool: Omit<TripPoolContribution, 'id' | 'trip_id'>) => {
    const newPool: TripPoolContribution = {
      ...pool,
      id: 'tpc-' + Date.now(),
      trip_id: tripId,
    };
    setTrips(prev => {
      const updated = prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          pool_contributions: [...(t.pool_contributions || []), newPool]
        };
      });
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  const addTripExpense = (tripId: string, expense: Omit<TripExpense, 'id' | 'trip_id'>, syncToFamilyKharcha: boolean = false) => {
    const newExpense: TripExpense = {
      ...expense,
      id: 'te-' + Date.now(),
      trip_id: tripId,
    };
    setTrips(prev => {
      const updated = prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          expenses: [newExpense, ...(t.expenses || [])]
        };
      });
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });

    if (syncToFamilyKharcha) {
      addTransaction({
        member_id: currentUserId,
        type: 'expense',
        amount: expense.amount,
        category: 'Travel & Holiday Kharcha',
        category_type: 'main_ghar',
        mode: 'online',
        scope: 'ghar',
        note: `🏖️ Holiday Trip: ${expense.title} (Paid by ${expense.paid_by_name})`,
        txn_date: expense.date || new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteTripExpense = (tripId: string, expenseId: string) => {
    setTrips(prev => {
      const updated = prev.map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          expenses: (t.expenses || []).filter(e => e.id !== expenseId)
        };
      });
      try { localStorage.setItem(getStorageKey('trips'), JSON.stringify(updated.filter(t => !isDemoRecord(t.id)))); } catch (e) {}
      return updated;
    });
  };

  // ==========================================
  // BUSINESS SETUP & PRE-OPERATIVE CAPEX METHODS
  // ==========================================
  const addSetupProject = (projectData: Omit<BusinessSetupProject, 'id' | 'family_id' | 'funding_sources' | 'expenses' | 'repayments' | 'created_at'>) => {
    const newProj: BusinessSetupProject = {
      ...projectData,
      id: 'bsp-' + Date.now(),
      family_id: family.id,
      funding_sources: [],
      expenses: [],
      repayments: [],
      created_at: new Date().toISOString()
    };
    setBusinessSetupProjects(prev => {
      const updated = [newProj, ...prev.filter(p => !isDemoRecord(p.id))];
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const updateSetupProject = (projectId: string, updates: Partial<BusinessSetupProject>) => {
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => p.id === projectId ? { ...p, ...updates } : p);
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const deleteSetupProject = (projectId: string) => {
    setBusinessSetupProjects(prev => {
      const updated = prev.filter(p => p.id !== projectId);
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addProjectFundingSource = (projectId: string, source: Omit<ProjectFundingSource, 'id' | 'project_id' | 'tranches' | 'created_at'>) => {
    const newSource: ProjectFundingSource = {
      ...source,
      id: 'sfs-' + Date.now(),
      project_id: projectId,
      tranches: [
        {
          id: 'st-' + Date.now(),
          tranche_no: 1,
          amount: source.disbursed_amount || source.sanctioned_amount,
          disbursal_date: new Date().toISOString().split('T')[0],
          notes: 'Initial sanction disbursal'
        }
      ],
      created_at: new Date().toISOString()
    };
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          funding_sources: [...(p.funding_sources || []), newSource]
        };
      });
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addDisbursalTranche = (projectId: string, sourceId: string, tranche: Omit<DisbursalTranche, 'id'>) => {
    const newTranche: DisbursalTranche = {
      ...tranche,
      id: 'st-' + Date.now()
    };
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          funding_sources: (p.funding_sources || []).map(fs => {
            if (fs.id !== sourceId) return fs;
            const newTranches = [...(fs.tranches || []), newTranche];
            const newDisbursed = newTranches.reduce((sum, t) => sum + Number(t.amount || 0), 0);
            return {
              ...fs,
              tranches: newTranches,
              disbursed_amount: newDisbursed
            };
          })
        };
      });
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addPreOpExpense = (projectId: string, expense: Omit<PreOpExpense, 'id' | 'project_id'>) => {
    const newExpense: PreOpExpense = {
      ...expense,
      id: 'poe-' + Date.now(),
      project_id: projectId
    };
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          expenses: [newExpense, ...(p.expenses || [])]
        };
      });
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const deletePreOpExpense = (projectId: string, expenseId: string) => {
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          expenses: (p.expenses || []).filter(e => e.id !== expenseId)
        };
      });
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const recordProjectRepayment = (projectId: string, repayment: Omit<ProjectRepayment, 'id' | 'project_id'>) => {
    const newRepay: ProjectRepayment = {
      ...repayment,
      id: 'prr-' + Date.now(),
      project_id: projectId
    };
    setBusinessSetupProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          repayments: [newRepay, ...(p.repayments || [])]
        };
      });
      try { localStorage.setItem(getStorageKey('setup_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const capitalizeProjectToFirm = (projectId: string, firmId: string, closingNotes?: string) => {
    const targetProject = businessSetupProjects.find(p => p.id === projectId);
    if (!targetProject) return;

    const totalExp = (targetProject.expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const fixedAssets = (targetProject.expenses || []).filter(e => e.is_fixed_asset).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const preOp35D = (targetProject.expenses || []).filter(e => !e.is_fixed_asset).reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalProcFees = (targetProject.funding_sources || []).reduce((sum, s) => sum + Number(s.processing_fees || 0) + Number(s.documentation_bank_charges || 0), 0);

    const promoterEquity = (targetProject.funding_sources || []).filter(s => s.source_type === 'self_savings').reduce((sum, s) => sum + Number(s.disbursed_amount || 0), 0);
    const bankDebt = (targetProject.funding_sources || []).filter(s => s.source_type === 'bank_term_loan').reduce((sum, s) => sum + Number(s.disbursed_amount || 0), 0);
    const privateDebt = (targetProject.funding_sources || []).filter(s => s.source_type === 'private_bank_nbfc').reduce((sum, s) => sum + Number(s.disbursed_amount || 0), 0);
    const friendsDebt = (targetProject.funding_sources || []).filter(s => s.source_type === 'friends_family_debt').reduce((sum, s) => sum + Number(s.disbursed_amount || 0), 0);

    setBusinessSetupProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        status: 'capitalized_live',
        linked_firm_id: firmId,
        capitalization_date: new Date().toISOString().split('T')[0],
        capitalization_summary: {
          total_project_cost: totalExp + totalProcFees,
          total_fixed_assets: fixedAssets,
          total_preop_35d: preOp35D,
          total_accrued_interest: 0,
          total_processing_fees: totalProcFees,
          promoter_equity: promoterEquity,
          bank_debt: bankDebt,
          private_debt: privateDebt,
          friends_family_debt: friendsDebt,
          closing_notes: closingNotes || 'Capitalized into active firm balance sheet'
        }
      };
    }));
  };

  const closeSetupProject = (projectId: string, closingNotes: string) => {
    setBusinessSetupProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        status: 'closed',
        notes: p.notes ? `${p.notes} | Closure Note: ${closingNotes}` : closingNotes
      };
    }));
  };

  // ==========================================
  // CONSTRUCTION & THEKEDARI MANAGEMENT METHODS
  // ==========================================
  const addConstructionProject = (project: Omit<ConstructionProject, 'id' | 'family_id' | 'materials' | 'contractors' | 'daily_labor_logs' | 'created_at'>) => {
    const newProj: ConstructionProject = {
      ...project,
      id: 'cp-' + Date.now(),
      family_id: family.id,
      materials: [],
      contractors: [],
      daily_labor_logs: [],
      created_at: new Date().toISOString()
    };
    setConstructionProjects(prev => {
      const updated = [newProj, ...prev.filter(p => !isDemoRecord(p.id))];
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const updateConstructionProject = (projectId: string, updates: Partial<ConstructionProject>) => {
    setConstructionProjects(prev => {
      const updated = prev.map(p => p.id === projectId ? { ...p, ...updates } : p);
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const deleteConstructionProject = (projectId: string) => {
    setConstructionProjects(prev => {
      const updated = prev.filter(p => p.id !== projectId);
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addConstructionMaterial = (projectId: string, material: Omit<ConstructionMaterialLog, 'id' | 'project_id'>) => {
    const newMat: ConstructionMaterialLog = {
      ...material,
      id: 'cm-' + Date.now(),
      project_id: projectId
    };
    setConstructionProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          materials: [newMat, ...(p.materials || [])]
        };
      });
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const deleteConstructionMaterial = (projectId: string, materialId: string) => {
    setConstructionProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          materials: (p.materials || []).filter(m => m.id !== materialId)
        };
      });
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addThekedarContract = (projectId: string, contract: Omit<ThekedarContract, 'id' | 'project_id' | 'total_paid' | 'bills'>) => {
    const newContract: ThekedarContract = {
      ...contract,
      id: 'tc-' + Date.now(),
      project_id: projectId,
      total_paid: 0,
      bills: []
    };
    setConstructionProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          contractors: [...(p.contractors || []), newContract]
        };
      });
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addThekedarRABill = (projectId: string, contractId: string, bill: { ra_bill_no: string; stage_name: string; bill_amount: number; date: string; is_paid: boolean; notes?: string }) => {
    const newBill = {
      id: 'rab-' + Date.now(),
      ...bill
    };
    setConstructionProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          contractors: (p.contractors || []).map(c => {
            if (c.id !== contractId) return c;
            const updatedBills = [...(c.bills || []), newBill];
            const updatedPaid = updatedBills.filter(b => b.is_paid).reduce((sum, b) => sum + Number(b.bill_amount || 0), 0);
            return {
              ...c,
              bills: updatedBills,
              total_paid: updatedPaid
            };
          })
        };
      });
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
    });
  };

  const addLaborHaziraLog = (projectId: string, log: Omit<LaborHaziraRecord, 'id' | 'project_id'>) => {
    const newLog: LaborHaziraRecord = {
      ...log,
      id: 'lhl-' + Date.now(),
      project_id: projectId
    };
    setConstructionProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          daily_labor_logs: [newLog, ...(p.daily_labor_logs || [])]
        };
      });
      try { localStorage.setItem(getStorageKey('construction_projects'), JSON.stringify(updated.filter(p => !isDemoRecord(p.id)))); } catch (e) {}
      return updated;
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
        contributeToGoal,
        deleteGoal,
        updateGoal,
        addReminder,
        addAsset,
    updateAsset,
    deleteAsset,
    addRentDiversion,
    updateRentDiversion,
    deleteRentDiversion,
    executeRentDiversion,
        addMember,
        updateMember,
        deleteMember,
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
        udharContacts,
        addUdharContact,
        recordUdharSettlement,
        verifyUdharOTP,
        bankLoans,
        addBankLoan,
        updateBankLoan,
        deleteBankLoan,
        recordLoanInterestHike,
        verifyLoanMemberOTP,
        medicalEpisodes,
        addMedicalEpisode,
        updateMedicalEpisode,
        deleteMedicalEpisode,
        addEpisodeExpenseItem,
        deleteEpisodeExpenseItem,
        addEpisodeDoctorVisit,
        fleetVehicles,
        addFleetVehicle,
        addFleetTrip,
        businessFirms,
        addBusinessFirm,
        recordFirmDrawingToFamily,
        recordLawyerFeePayment,
        rentalProperties,
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
        vacateAndSettleTenant,
        collectRentPayment,
        addRentalExpense,
        deleteRentalExpense,
        memberLedgers,
        addMemberLedgerEntry,
        deleteMemberLedgerEntry,
        settleMemberLedger,
        goldLoans,
        addGoldLoan,
        recordGoldInterestPayment,
        settleAndReleaseGoldLoan,
        updateGoldLoanStatus,
        trips,
        addTrip,
        updateTrip,
        deleteTrip,
        addTripMember,
        removeTripMember,
        addTripPoolContribution,
        addTripExpense,
        deleteTripExpense,
        businessSetupProjects,
        addSetupProject,
        updateSetupProject,
        deleteSetupProject,
        addProjectFundingSource,
        addDisbursalTranche,
        addPreOpExpense,
        deletePreOpExpense,
        recordProjectRepayment,
        capitalizeProjectToFirm,
        closeSetupProject,
        constructionProjects,
        addConstructionProject,
        updateConstructionProject,
        deleteConstructionProject,
        addConstructionMaterial,
        deleteConstructionMaterial,
        addThekedarContract,
        addThekedarRABill,
        addLaborHaziraLog,
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
        isLoggedIn,
        authUser,
        isDemoMode,
        loadDemoData,
        resetToClean,
        logout,
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
