const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

// 1. types/index.ts
save('types/index.ts', `export type MemberRole = 'owner' | 'member';

export interface MemberPermissions {
  can_view_investments: boolean;
  can_view_bills: boolean;
  can_view_vault: boolean;
  can_view_medical: boolean;
  can_view_staff: boolean;
  can_view_cases: boolean;
  is_admin: boolean;
}

export interface Family {
  id: string;
  name: string;
  currency: string;
  invite_code: string;
  created_at?: string;
}

export interface Member {
  id: string;
  family_id: string;
  user_id?: string;
  name: string;
  role: MemberRole;
  color: string;
  initials: string;
  avatar_url?: string;
  phone?: string;
  dob?: string;
  relationship?: string;
  anniversary?: string;
  permissions?: MemberPermissions;
}

export type TransactionType = 'income' | 'expense' | 'udhar_given' | 'udhar_taken';
export type PaymentMode = 'online' | 'offline';
export type ExpenseScope = 'ghar' | 'bahar';
export type ExpenseCategoryType = 'main_ghar' | 'personal' | 'child' | 'long_term' | 'trip' | 'event';

export interface Transaction {
  id: string;
  family_id: string;
  member_id: string;
  member?: Member;
  type: TransactionType;
  amount: number;
  category: string;
  category_type?: ExpenseCategoryType;
  mode: PaymentMode;
  scope?: ExpenseScope;
  note: string;
  time_stamp?: string; // e.g. "10:30 AM", "05:15 PM"
  udhar_person?: string;
  is_settled?: boolean;
  txn_date: string;
  created_at?: string;
}

export interface RecurringIncome {
  id: string;
  family_id: string;
  member_id: string;
  title: string;
  gross_amount: number;
  expected_day: number; // e.g. 5 (5th of every month)
  linked_liability_title?: string;
  linked_liability_amount?: number;
  net_amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface CreditCard {
  id: string;
  family_id: string;
  member_id: string;
  bank_name: string;
  card_name: string;
  last4: string;
  credit_limit: number;
  current_due: number;
  due_date: string;
  late_penalty_history?: { date: string; amount: number; reason: string }[];
}

export interface UtilityBill {
  id: string;
  family_id: string;
  bill_type: 'electricity' | 'water' | 'gas' | 'internet' | 'mobile' | 'other';
  provider: string;
  consumer_no?: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
}

export type AssetCategory = 'liquid' | 'fixed';
export type AssetType = 
  | 'bank_deposit' 
  | 'gold' 
  | 'silver' 
  | 'shares' 
  | 'mutual_funds' 
  | 'land' 
  | 'property' 
  | 'vehicle' 
  | 'other';

export interface Asset {
  id: string;
  family_id: string;
  member_id?: string;
  category: AssetCategory;
  type: AssetType;
  label: string;
  institution?: string;
  symbol?: string; // for live shares (e.g. RELIANCE, TCS)
  quantity?: number;
  purchase_price?: number;
  value: number;
  notes?: string;
  color?: string;
  updated_at?: string;
}

export interface Goal {
  id: string;
  family_id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  category?: string;
  monthly_contribution?: number;
}

export type ReminderCategory = 'insurance' | 'service' | 'appointment' | 'emi' | 'bill' | 'hearing' | 'birthday' | 'other';

export interface Reminder {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  category: ReminderCategory;
  due_date: string;
  time?: string;
  amount?: number;
  notify_1_month?: boolean;
  notify_1_week?: boolean;
  is_completed?: boolean;
  color?: string;
}

export interface HouseholdStaff {
  id: string;
  family_id: string;
  name: string;
  role: 'maid' | 'driver' | 'cook' | 'gardener' | 'guard' | 'other';
  monthly_salary: number;
  advance_balance: number;
  phone?: string;
  joining_date?: string;
  attendance_this_month?: { [day: number]: 'present' | 'absent' | 'half_day' | 'leave' };
}

export interface StaffPayment {
  id: string;
  staff_id: string;
  amount: number;
  type: 'salary' | 'advance' | 'bonus';
  date: string;
  note?: string;
}

export interface CourtHearing {
  id: string;
  case_id: string;
  hearing_date: string;
  result_notes: string;
  next_hearing_date?: string;
  documents_filed?: string[];
}

export interface CourtCase {
  id: string;
  family_id: string;
  case_title: string;
  case_number: string;
  court_name: string;
  judge_advocate_name?: string;
  current_status: string;
  next_hearing_date: string;
  summary: string;
  hearings: CourtHearing[];
}

export type DocumentCategory = 'insurance' | 'vehicle' | 'property' | 'id_proof' | 'tax' | 'other';

export interface DocumentItem {
  id: string;
  family_id: string;
  member_id?: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_type?: string;
  file_size?: string;
  expiry_date?: string;
  notes?: string;
  alert?: boolean;
  policy_number?: string;
  provider?: string;
  premium_amount?: number;
  nominee?: string;
  agent_contact?: string;
}

export interface FamilyTreeNode {
  id: string;
  family_id: string;
  member_id?: string;
  name: string;
  relation: string;
  photo_url?: string;
  parent_node_id?: string;
  generation: number;
  birth_year?: number;
}

export interface MedicalRecord {
  id: string;
  family_id: string;
  member_id: string;
  member_name?: string;
  blood_group: string;
  condition: string;
  medicine_name: string;
  medicine_time: string;
  allergies?: string;
  doctor_name?: string;
  doctor_phone?: string;
  notes?: string;
  is_verified: boolean;
  verified_by?: string;
  entered_by?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'expense' | 'income' | 'reminder' | 'hearing' | 'birthday' | 'bill' | 'emi';
  amount?: number;
  color?: string;
  member_name?: string;
  details?: string;
}
`);

// 2. Update supabase/schema.sql
save('supabase/schema.sql', `-- ============================================================================
-- FAMILY WEALTH APP — FINAL COMPLETE POSTGRESQL SCHEMA (WITH ALL MODULES)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- 1. FAMILIES
create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text default 'INR',
  invite_code text unique default substring(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_at timestamptz default now()
);

-- 2. MEMBERS & PERMISSIONS
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role text check (role in ('owner', 'member')) default 'member',
  color text default '#B98B2A',
  initials text not null,
  avatar_url text,
  phone text,
  dob date,
  relationship text,
  anniversary date,
  created_at timestamptz default now()
);

create table if not exists member_permissions (
  member_id uuid primary key references members(id) on delete cascade,
  can_view_investments boolean default true,
  can_view_bills boolean default true,
  can_view_vault boolean default true,
  can_view_medical boolean default true,
  can_view_staff boolean default true,
  can_view_cases boolean default true,
  is_admin boolean default false
);

-- 3. TRANSACTIONS
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  type text check (type in ('income', 'expense', 'udhar_given', 'udhar_taken')) not null,
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  category_type text check (category_type in ('main_ghar', 'personal', 'child', 'long_term', 'trip', 'event')) default 'main_ghar',
  mode text check (mode in ('online', 'offline')) default 'online',
  scope text check (scope in ('ghar', 'bahar')) default 'ghar',
  note text,
  time_stamp text,
  udhar_person text,
  is_settled boolean default false,
  txn_date date default current_date not null,
  created_at timestamptz default now()
);

-- 4. RECURRING INCOMES & LIABILITIES
create table if not exists recurring_incomes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  title text not null,
  gross_amount numeric(12,2) not null,
  expected_day integer check (expected_day between 1 and 31),
  linked_liability_title text,
  linked_liability_amount numeric(12,2) default 0,
  net_amount numeric(12,2) generated always as (gross_amount - coalesce(linked_liability_amount, 0)) stored,
  frequency text default 'monthly'
);

-- 5. CREDIT CARDS & UTILITY BILLS
create table if not exists credit_cards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  bank_name text not null,
  card_name text not null,
  last4 text not null,
  credit_limit numeric(12,2),
  current_due numeric(12,2) default 0,
  due_date date not null
);

create table if not exists utility_bills (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  bill_type text not null,
  provider text not null,
  consumer_no text,
  amount numeric(10,2) not null,
  due_date date not null,
  is_paid boolean default false
);

-- 6. ASSETS & LIVE SHARES
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  category text check (category in ('liquid', 'fixed')) not null,
  type text check (type in ('bank_deposit', 'gold', 'silver', 'shares', 'mutual_funds', 'land', 'property', 'vehicle', 'other')) not null,
  label text not null,
  institution text,
  symbol text,
  quantity numeric(10,4),
  purchase_price numeric(12,2),
  value numeric(14,2) not null default 0,
  notes text,
  updated_at timestamptz default now()
);

-- 7. GOALS & REMINDERS
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  title text not null,
  target_amount numeric(12,2) not null,
  saved_amount numeric(12,2) default 0,
  target_date date,
  category text default 'general',
  monthly_contribution numeric(12,2) default 0,
  created_at timestamptz default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  title text not null,
  category text check (category in ('insurance', 'service', 'appointment', 'emi', 'bill', 'hearing', 'birthday', 'other')) not null,
  due_date date not null,
  time text,
  amount numeric(10,2),
  notify_1_month boolean default true,
  notify_1_week boolean default true,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- 8. HOUSEHOLD STAFF MANAGEMENT
create table if not exists household_staff (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  name text not null,
  role text check (role in ('maid', 'driver', 'cook', 'gardener', 'guard', 'other')) not null,
  monthly_salary numeric(10,2) not null,
  advance_balance numeric(10,2) default 0,
  phone text,
  joining_date date default current_date
);

create table if not exists staff_attendance (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references household_staff(id) on delete cascade not null,
  date date not null,
  status text check (status in ('present', 'absent', 'half_day', 'leave')) default 'present',
  notes text,
  unique (staff_id, date)
);

create table if not exists staff_payments (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references household_staff(id) on delete cascade not null,
  amount numeric(10,2) not null,
  type text check (type in ('salary', 'advance', 'bonus')) not null,
  payment_date date default current_date,
  note text
);

-- 9. COURT CASE TRACKER
create table if not exists court_cases (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  case_title text not null,
  case_number text not null,
  court_name text not null,
  judge_advocate_name text,
  current_status text default 'Active',
  next_hearing_date date not null,
  summary text,
  created_at timestamptz default now()
);

create table if not exists court_hearings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references court_cases(id) on delete cascade not null,
  hearing_date date not null,
  result_notes text not null,
  next_hearing_date date,
  documents_filed text[]
);

-- 10. DOCUMENTS VAULT
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  title text not null,
  category text check (category in ('insurance', 'vehicle', 'property', 'id_proof', 'tax', 'other')) not null,
  file_url text not null,
  file_type text default 'pdf',
  file_size text,
  expiry_date date,
  policy_number text,
  provider text,
  premium_amount numeric(10,2),
  nominee text,
  agent_contact text,
  notes text,
  created_at timestamptz default now()
);

-- 11. FAMILY TREE & MEDICAL RECORDS
create table if not exists family_tree_nodes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  name text not null,
  relation text not null,
  photo_url text,
  parent_node_id uuid references family_tree_nodes(id) on delete set null,
  generation integer default 1,
  birth_year integer
);

create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  condition text,
  medicine_name text,
  medicine_time text,
  allergies text,
  doctor_name text,
  doctor_phone text,
  notes text,
  is_verified boolean default false,
  verified_by_member_id uuid references members(id),
  entered_by_member_id uuid references members(id),
  updated_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table families enable row level security;
alter table members enable row level security;
alter table transactions enable row level security;
alter table assets enable row level security;
alter table goals enable row level security;
alter table reminders enable row level security;
alter table household_staff enable row level security;
alter table court_cases enable row level security;
alter table documents enable row level security;
alter table medical_records enable row level security;
`);

console.log('Types & Schema updated.');
