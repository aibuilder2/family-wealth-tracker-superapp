-- ============================================================================
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
-- ============================================================================
-- 12. AGRICULTURAL LAND & CROP MANAGEMENT (Kheti, Theka, Adhiya)
-- ============================================================================
create table if not exists agricultural_lands (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  title text not null,
  location text not null,
  area numeric(8,2) not null,
  area_unit text check (area_unit in ('Bigha', 'Acre', 'Killa', 'Hectare')) default 'Bigha',
  farming_type text check (farming_type in ('khud', 'theka', 'adhiya')) default 'khud',
  partner_name text,
  partner_phone text,
  yearly_theka_amount numeric(12,2),
  current_crop text,
  created_at timestamptz default now()
);

create table if not exists agriculture_crop_cycles (
  id uuid primary key default gen_random_uuid(),
  land_id uuid references agricultural_lands(id) on delete cascade not null,
  season text not null,
  year integer not null,
  crop_name text not null,
  total_expense numeric(12,2) default 0,
  crop_yield_quintals numeric(8,2),
  mandi_rate_per_quintal numeric(10,2),
  crop_sale_income numeric(12,2) default 0,
  govt_bonus_amount numeric(10,2) default 0,
  total_income numeric(12,2) default 0,
  net_profit numeric(12,2) default 0,
  status text check (status in ('active', 'harvested', 'completed')) default 'active',
  created_at timestamptz default now()
);

create table if not exists agriculture_expenses (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references agriculture_crop_cycles(id) on delete cascade not null,
  category text check (category in ('beej', 'khaad', 'pesticide', 'diesel_water', 'labor', 'harvesting', 'other')) not null,
  amount numeric(10,2) not null,
  date date default current_date,
  note text
);

-- ============================================================================
-- 13. VEHICLES & CAR/BIKE LOGS
-- ============================================================================
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  vehicle_type text check (vehicle_type in ('car', 'bike', 'scooter', 'tractor', 'other')) not null,
  brand_model text not null,
  reg_number text not null,
  purchase_date date not null,
  purchase_price numeric(12,2) not null,
  fuel_type text check (fuel_type in ('Petrol', 'Diesel', 'CNG', 'EV', 'Hybrid')) not null,
  rc_expiry date,
  insurance_policy_no text,
  insurance_expiry date,
  puc_expiry date,
  service_due_date date,
  fastag_bank text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists vehicle_service_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  service_date date not null,
  odometer_km integer not null,
  cost numeric(10,2) not null,
  garage_name text,
  details text
);

alter table agricultural_lands enable row level security;
alter table agriculture_crop_cycles enable row level security;
alter table agriculture_expenses enable row level security;
alter table vehicles enable row level security;
alter table vehicle_service_logs enable row level security;
-- ============================================================================
-- 14. COMMERCIAL FLEET & TRANSPORT BUSINESS (Trucks, Buses, Cabs, Rentals)
-- ============================================================================
create table if not exists commercial_fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  vehicle_type text not null,
  title_model text not null,
  reg_number text not null,
  business_model text not null,
  purchase_date date not null,
  purchase_cost numeric(14,2) not null,
  body_building_cost numeric(12,2) default 0,
  total_acquisition_cost numeric(14,2) not null,
  has_loan boolean default false,
  monthly_emi numeric(10,2) default 0,
  loan_tenure_months integer,
  loan_balance numeric(14,2) default 0,
  financier_name text,
  annual_depreciation_percent numeric(5,2) default 15.00,
  current_depreciated_value numeric(14,2) not null,
  resale_date date,
  resale_amount numeric(14,2),
  status text check (status in ('active', 'under_maintenance', 'sold')) default 'active',
  default_driver_name text not null,
  default_driver_phone text,
  default_conductor_name text,
  odometer_km integer default 0,
  permit_expiry date,
  fitness_expiry date,
  national_tax_expiry date,
  created_at timestamptz default now()
);

create table if not exists fleet_trips (
  id uuid primary key default gen_random_uuid(),
  fleet_vehicle_id uuid references commercial_fleet_vehicles(id) on delete cascade not null,
  trip_type text not null,
  trip_title text not null,
  start_date date not null,
  end_date date,
  assigned_driver text not null,
  driver_phone text,
  assigned_conductor text,
  customer_party_name text not null,
  customer_phone text,
  billing_mode text not null,
  rate numeric(10,2) not null,
  quantity numeric(10,2) default 1,
  gross_revenue numeric(12,2) not null,
  advance_received numeric(12,2) default 0,
  pending_payment numeric(12,2) default 0,
  diesel_liters numeric(8,2) default 0,
  diesel_cost numeric(10,2) default 0,
  toll_fastag_cost numeric(10,2) default 0,
  driver_bhata numeric(10,2) default 0,
  conductor_bhata numeric(10,2) default 0,
  chalan_cost numeric(10,2) default 0,
  other_repair_cost numeric(10,2) default 0,
  total_trip_expense numeric(12,2) not null,
  net_trip_profit numeric(12,2) not null,
  status text check (status in ('running', 'completed', 'cancelled')) default 'completed',
  created_at timestamptz default now()
);

create table if not exists lawyer_fee_payments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references court_cases(id) on delete cascade not null,
  date date not null,
  amount numeric(10,2) not null,
  payment_type text not null,
  note text
);

alter table commercial_fleet_vehicles enable row level security;
alter table fleet_trips enable row level security;
alter table lawyer_fee_payments enable row level security;
-- ============================================================================
-- 15. REGISTERED BUSINESS FIRMS, GST & PARTNER DRAWINGS
-- ============================================================================
create table if not exists business_firms (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  firm_name text not null,
  entity_type text check (entity_type in ('Proprietorship', 'Partnership_Firm', 'Pvt_Ltd', 'LLP', 'Individual_Unregistered')) not null,
  gstin text,
  pan text,
  bank_current_acc text,
  total_revenue numeric(14,2) default 0,
  total_expenses numeric(14,2) default 0,
  total_gst_collected numeric(12,2) default 0,
  total_tds_deducted numeric(12,2) default 0,
  current_firm_balance numeric(14,2) default 0,
  total_drawings_paid numeric(14,2) default 0,
  created_at timestamptz default now()
);

create table if not exists firm_drawings (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references business_firms(id) on delete cascade not null,
  date date not null,
  amount numeric(12,2) not null,
  drawing_type text check (drawing_type in ('partner_salary', 'profit_dividend', 'director_remuneration')) not null,
  credited_to_member_id uuid references members(id) on delete set null,
  note text
);

alter table business_firms enable row level security;
alter table firm_drawings enable row level security;
