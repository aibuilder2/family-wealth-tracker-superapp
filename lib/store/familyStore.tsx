'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Family, Member, Transaction, Asset, Goal, Reminder, DocumentItem,
  MedicalRecord, HouseholdStaff, CourtCase, CourtHearing, CreditCard, RecurringIncome,
  UtilityBill, CalendarEventItem, AgriculturalLand, CropCycle, AgricultureExpense,
  Vehicle, VehicleServiceLog, UdharContact, UdharSettlement, UdharSettlementMode, CommercialFleetVehicle, FleetTrip, FleetBusinessType, CommercialVehicleType, LawyerFeePayment, LawyerPaymentType, BusinessFirm, FirmDrawing, EntityType,
  RentalProperty, RentalTenant, HostelRoom, HostelBed, RentalExpense, RentalPropertyType,
  MemberLedgerEntry, MemberLedgerType,
  GoldLoanPledge, GoldLoanInterestPayment, GoldLoanStatus, GoldPurityKarat,
  Trip, TripMember, TripExpense, TripPoolContribution, TripType, TripExpenseType, TripExpenseCategory
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
    label: 'SBI 3-Year Fixed Deposit',
    category: 'liquid',
    type: 'bank_deposit',
    institution: 'SBI',
    value: 1000000,
    member_id: 'm-head',
    notes: '7.1% interest rate emergency safety deposit'
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
  addRentalProperty: (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>) => void;
  updateRentalProperty: (propertyId: string, updates: Partial<RentalProperty>) => void;
  deleteRentalProperty: (propertyId: string) => void;
  addHostelRoom: (propertyId: string, room: Omit<HostelRoom, 'id'>) => void;
  addRentalTenant: (propertyId: string, tenant: Omit<RentalTenant, 'id' | 'property_id'>) => void;
  updateRentalTenant: (propertyId: string, tenantId: string, updates: Partial<RentalTenant>) => void;
  deleteRentalTenant: (propertyId: string, tenantId: string) => void;
  collectRentPayment: (propertyId: string, tenantId: string, amount: number, isPaid: boolean, details?: { payment_mode?: 'upi' | 'cash' | 'bank_transfer' | 'cheque'; transaction_id?: string; maintenance_deduction?: number; damage_deduction?: number; notes?: string }) => void;
  addRentalExpense: (propertyId: string, expense: Omit<RentalExpense, 'id' | 'property_id'>) => void;
  deleteRentalExpense: (propertyId: string, expenseId: string) => void;
  addBusinessFirm: (firm: Omit<BusinessFirm, 'id' | 'family_id' | 'total_revenue' | 'total_expenses' | 'total_gst_collected' | 'total_tds_deducted' | 'current_firm_balance' | 'total_drawings_paid' | 'drawings'>) => void;
  recordFirmDrawingToFamily: (firmId: string, drawing: { amount: number; drawing_type: 'partner_salary' | 'profit_dividend' | 'director_remuneration'; credited_to_member_id: string; note: string }) => void;

  addFleetVehicle: (vehicle: Omit<CommercialFleetVehicle, 'id' | 'family_id' | 'trips' | 'lifetime_revenue' | 'lifetime_expenses' | 'lifetime_net_profit' | 'total_acquisition_cost' | 'current_depreciated_value'>) => void;
  addFleetTrip: (vehicleId: string, trip: Omit<FleetTrip, 'id' | 'fleet_vehicle_id' | 'total_trip_expense' | 'net_trip_profit'>) => void;
  recordLawyerFeePayment: (caseId: string, payment: { amount: number; payment_type: LawyerPaymentType; note: string }) => void;

  addUdharContact: (udhar: Omit<UdharContact, 'id' | 'family_id' | 'settlements' | 'created_at'>) => void;
  recordUdharSettlement: (contactId: string, settlement: { amount: number; mode: UdharSettlementMode; note: string }) => void;

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

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income' | 'udhar'>('expense');

  // Demo record sanitizer
  const isDemoRecord = (id?: string) => {
    if (!id) return false;
    return (
      id.startsWith('txn-') ||
      id === 'fam-1' ||
      id === 'm-sunita' || id === 'm-priya' || id === 'm-amit' ||
      id.startsWith('a-') ||
      id.startsWith('g-') ||
      id.startsWith('gl-') ||
      id.startsWith('rent-') ||
      id.startsWith('fleet-') ||
      id.startsWith('firm-') ||
      id.startsWith('staff-') ||
      id.startsWith('case-') ||
      id.startsWith('veh-') ||
      id.startsWith('agri-') ||
      id.startsWith('udh-') ||
      id.startsWith('ledg-') ||
      id.startsWith('trip-') ||
      id.startsWith('tm-') ||
      id.startsWith('te-') ||
      id.startsWith('tpc-')
    );
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
    setMembers([...members, newM]);
    if (supabase) {
      supabase.from('family_members').insert(newM).then();
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

  const addRentalProperty = (prop: Omit<RentalProperty, 'id' | 'family_id' | 'tenants' | 'expenses'>) => {
    const newProp: RentalProperty = {
      ...prop,
      id: `rent-${Date.now()}`,
      family_id: family.id,
      tenants: [],
      expenses: []
    };
    setRentalProperties(prev => [newProp, ...prev]);
  };

  const updateRentalProperty = (propertyId: string, updates: Partial<RentalProperty>) => {
    setRentalProperties(prev => prev.map(p => p.id === propertyId ? { ...p, ...updates } : p));
  };

  const deleteRentalProperty = (propertyId: string) => {
    setRentalProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const addHostelRoom = (propertyId: string, room: Omit<HostelRoom, 'id'>) => {
    setRentalProperties(prev => prev.map(p => {
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
    setRentalProperties(prev => prev.map(p => {
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
    }));
  };

  const updateRentalTenant = (propertyId: string, tenantId: string, updates: Partial<RentalTenant>) => {
    setRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        tenants: p.tenants.map(t => t.id === tenantId ? { ...t, ...updates } : t)
      };
    }));
  };

  const deleteRentalTenant = (propertyId: string, tenantId: string) => {
    setRentalProperties(prev => prev.map(p => {
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
    }));
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
    setRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        tenants: p.tenants.map(t => {
          if (t.id !== tenantId) return t;
          return {
            ...t,
            rent_status: isPaid ? 'paid' : 'pending',
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
    }));

    if (isPaid && amount > 0) {
      addTransaction({
        member_id: currentUserId,
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
    setRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: [...p.expenses, newExp]
      };
    }));

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

  const deleteRentalExpense = (propertyId: string, expenseId: string) => {
    setRentalProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        expenses: p.expenses.filter(e => e.id !== expenseId)
      };
    }));
  };

  const addGoldLoan = (pledge: Omit<GoldLoanPledge, 'id' | 'family_id' | 'created_at' | 'interest_payments'>) => {
    const newPledge: GoldLoanPledge = {
      ...pledge,
      id: `gl-${Date.now()}`,
      family_id: family.id,
      created_at: new Date().toISOString(),
      interest_payments: []
    };
    setGoldLoans(prev => [newPledge, ...prev]);

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
    setGoldLoans(prev => prev.map(p => {
      if (p.id !== pledgeId) return p;
      return {
        ...p,
        interest_payments: [...(p.interest_payments || []), newPay]
      };
    }));

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
    setGoldLoans(prev => prev.map(p => {
      if (p.id !== pledgeId) return p;
      return {
        ...p,
        status: 'settled',
        noc_otp_verified: true,
        noc_date: new Date().toISOString().split('T')[0],
        notes: note ? `${p.notes || ''} | Settle note: ${note} (OTP: ${otpCode})` : p.notes
      };
    }));

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
    setGoldLoans(prev => prev.map(p => p.id === pledgeId ? { ...p, status } : p));
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
        udharContacts,
        addUdharContact,
        recordUdharSettlement,
        fleetVehicles,
        addFleetVehicle,
        addFleetTrip,
        businessFirms,
        addBusinessFirm,
        recordFirmDrawingToFamily,
        recordLawyerFeePayment,
        rentalProperties,
        addRentalProperty,
        updateRentalProperty,
        deleteRentalProperty,
        addHostelRoom,
        addRentalTenant,
        updateRentalTenant,
        deleteRentalTenant,
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
