-- ============================================================================
-- FAMILY WEALTH APP — COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Phase 1 to Phase 6 + Row Level Security (RLS) + Seed Data
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. FAMILIES
-- ============================================================================
create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text default 'INR',
  invite_code text unique default substring(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_at timestamptz default now()
);

-- ============================================================================
-- 2. MEMBERS
-- ============================================================================
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
  created_at timestamptz default now()
);

-- ============================================================================
-- 3. TRANSACTIONS (Phase 1)
-- ============================================================================
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete cascade not null,
  type text check (type in ('income', 'expense', 'udhar_given', 'udhar_taken')) not null,
  amount numeric(12,2) not null check (amount > 0),
  category text not null,
  mode text check (mode in ('online', 'offline')) default 'online',
  scope text check (scope in ('ghar', 'bahar')) default 'ghar',
  note text,
  udhar_person text, -- Person name if type is udhar_given or udhar_taken
  is_settled boolean default false,
  txn_date date default current_date not null,
  created_at timestamptz default now()
);

-- ============================================================================
-- 4. ASSETS (Phase 2: Liquid vs Fixed Wealth)
-- ============================================================================
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  category text check (category in ('liquid', 'fixed')) not null,
  type text check (type in ('bank_deposit', 'gold', 'silver', 'shares', 'mutual_funds', 'land', 'property', 'vehicle', 'other')) not null,
  label text not null,
  institution text,
  value numeric(14,2) not null default 0,
  notes text,
  updated_at timestamptz default now()
);

-- ============================================================================
-- 5. GOALS (Phase 4)
-- ============================================================================
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  title text not null,
  target_amount numeric(12,2) not null,
  saved_amount numeric(12,2) default 0,
  target_date date,
  category text default 'general',
  created_at timestamptz default now()
);

-- ============================================================================
-- 6. REMINDERS (Phase 4)
-- ============================================================================
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  title text not null,
  category text check (category in ('insurance', 'service', 'appointment', 'emi', 'other')) not null,
  due_date date not null,
  amount numeric(10,2),
  notify_1_month boolean default true,
  notify_1_week boolean default true,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- ============================================================================
-- 7. DOCUMENTS VAULT (Phase 5)
-- ============================================================================
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
  notes text,
  created_at timestamptz default now()
);

-- ============================================================================
-- 8. FAMILY TREE & MEDICAL (Phase 6)
-- ============================================================================
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
  updated_at timestamptz default now()
);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table families enable row level security;
alter table members enable row level security;
alter table transactions enable row level security;
alter table assets enable row level security;
alter table goals enable row level security;
alter table reminders enable row level security;
alter table documents enable row level security;
alter table family_tree_nodes enable row level security;
alter table medical_records enable row level security;

-- Helper function: get family_id for current authenticated user
create or replace function get_auth_family_id()
returns uuid as $$
  select family_id from members where user_id = auth.uid() limit 1;
$$ language sql security definer;

-- Policies for family-scoped tables
create policy "Family members can view their family data" on families
  for select using (id = get_auth_family_id());

create policy "Family members can view members" on members
  for all using (family_id = get_auth_family_id());

create policy "Family members can view & insert transactions" on transactions
  for all using (family_id = get_auth_family_id());

create policy "Family members can manage assets" on assets
  for all using (family_id = get_auth_family_id());

create policy "Family members can manage goals" on goals
  for all using (family_id = get_auth_family_id());

create policy "Family members can manage reminders" on reminders
  for all using (family_id = get_auth_family_id());

create policy "Family members can manage documents" on documents
  for all using (family_id = get_auth_family_id());

create policy "Family members can manage tree nodes" on family_tree_nodes
  for all using (family_id = get_auth_family_id());

create policy "Family members can view medical records" on medical_records
  for all using (family_id = get_auth_family_id());

-- ============================================================================
-- 10. SEED DATA (Sharma Parivar Demo Data)
-- ============================================================================
do $$
declare
  fam_id uuid := 'a0000000-0000-0000-0000-000000000001';
  m_papa uuid := 'b0000000-0000-0000-0000-000000000001';
  m_mummy uuid := 'b0000000-0000-0000-0000-000000000002';
  m_rohan uuid := 'b0000000-0000-0000-0000-000000000003';
  m_priya uuid := 'b0000000-0000-0000-0000-000000000004';
begin
  insert into families (id, name, currency, invite_code)
  values (fam_id, 'Sharma Parivar', 'INR', 'SHARMA77')
  on conflict (id) do nothing;

  insert into members (id, family_id, name, role, color, initials)
  values
    (m_papa, fam_id, 'Papa', 'owner', '#B98B2A', 'P'),
    (m_mummy, fam_id, 'Mummy', 'member', '#8A5A6B', 'M'),
    (m_rohan, fam_id, 'Rohan', 'member', '#3E6E8E', 'R'),
    (m_priya, fam_id, 'Priya', 'member', '#5C8A6B', 'Pr')
  on conflict (id) do nothing;

  insert into transactions (family_id, member_id, type, amount, category, mode, scope, note, txn_date)
  values
    (fam_id, m_mummy, 'expense', 840, 'Ghar kharch', 'offline', 'ghar', 'Sabzi Mandi', current_date),
    (fam_id, m_rohan, 'expense', 1200, 'Bahar kharch', 'offline', 'bahar', 'Petrol', current_date),
    (fam_id, m_papa, 'income', 85000, 'Income', 'online', 'ghar', 'Salary credited', current_date - interval '1 day'),
    (fam_id, m_priya, 'expense', 3500, 'Education', 'online', 'ghar', 'Tuition fee', current_date - interval '1 day'),
    (fam_id, m_priya, 'expense', 1450, 'Shopping', 'online', 'bahar', 'Amazon order', current_date - interval '1 day'),
    (fam_id, m_papa, 'udhar_given', 5000, 'Udhar', 'online', 'bahar', 'Udhar diya', current_date - interval '1 day')
  on conflict do nothing;

  insert into assets (family_id, category, type, label, value)
  values
    (fam_id, 'liquid', 'bank_deposit', 'Bank Deposits', 840000),
    (fam_id, 'fixed', 'gold', 'Gold & Silver', 620000),
    (fam_id, 'liquid', 'shares', 'Shares & MFs', 458600),
    (fam_id, 'fixed', 'land', 'Land / Property', 2300000)
  on conflict do nothing;

  insert into goals (family_id, title, target_amount, saved_amount, target_date, category)
  values
    (fam_id, 'Priya ki Education', 500000, 310000, current_date + interval '1 year', 'education'),
    (fam_id, 'Naya Car', 800000, 240000, current_date + interval '18 months', 'vehicle')
  on conflict do nothing;

  insert into reminders (family_id, title, category, due_date)
  values
    (fam_id, 'Car servicing due', 'service', current_date + interval '5 days'),
    (fam_id, 'Car insurance renewal', 'insurance', current_date + interval '12 days'),
    (fam_id, 'Dentist appointment — Mummy', 'appointment', current_date + interval '20 days')
  on conflict do nothing;

  insert into documents (family_id, title, category, file_url, expiry_date, notes)
  values
    (fam_id, 'Car Insurance', 'insurance', '/docs/car_insurance.pdf', current_date + interval '12 days', '12 din me expire'),
    (fam_id, 'Health Insurance — Papa', 'insurance', '/docs/health_papa.pdf', current_date + interval '240 days', 'Valid'),
    (fam_id, 'Land Documents', 'property', '/docs/land_registry.pdf', null, '4 files verified'),
    (fam_id, 'Driving Licence — Rohan', 'id_proof', '/docs/dl_rohan.pdf', current_date + interval '600 days', 'Valid')
  on conflict do nothing;
end $$;
