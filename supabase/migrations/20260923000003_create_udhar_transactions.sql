-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2.5, 2.6, 2.7: TRANSACTIONS & BILL PROOF
-- Migration: 20260923000003_create_udhar_transactions.sql
-- Strictly isolated to "udhar_" module.
-- ============================================================================

create table if not exists udhar_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references families(id) on delete cascade not null,
  vendor_id uuid references udhar_vendors(id) on delete restrict,
  linked_member_name text,

  type text check (type in ('given', 'taken')) not null,
  original_amount numeric(12,2) not null check (original_amount > 0),
  remaining_balance numeric(12,2) not null check (remaining_balance >= 0),
  payment_mode text check (payment_mode in ('cash', 'bank_transfer', 'upi', 'cheque')) default 'cash',
  
  -- Tenure & Dates
  tenure_days integer not null check (tenure_days > 0),
  start_date date default current_date not null,
  due_date date not null,
  actual_settled_date date,
  
  -- Task 2: Immutable Terms & Conditions Snapshot
  terms_and_conditions text,
  terms_template_id uuid references udhar_tc_templates(id) on delete set null,

  -- Task 2.5: Mandatory Bill Proof (Option A: File OR Option B: Manual Details)
  bill_proof_type text check (bill_proof_type in ('file', 'manual', 'both')),
  bill_proof_url text,
  bill_proof_filename text,
  bill_proof_size integer,
  bill_number text,
  bill_date date,
  bill_amount numeric(12,2),
  
  -- Task 2.6: Delivery Type (transport vs hand_to_hand)
  delivery_type text check (delivery_type in ('transport', 'hand_to_hand')) default 'hand_to_hand',
  
  -- Task 2.7: Quotation, Dispatch, Transit, Confirmation Pipeline
  status text check (status in ('quotation', 'dispatched', 'in_transit', 'confirmed', 'disputed', 'settled')) default 'confirmed',
  estimated_amount numeric(12,2),
  material_description text,
  quotation_date date,
  
  -- Dispatch Details
  bilty_number text,
  transport_name text,
  dispatch_date timestamptz,
  expected_arrival_date date,
  actual_arrival_date date,
  
  -- Verification & Security
  dispatch_otp varchar(6),
  is_dispatch_otp_verified boolean default false,
  delivery_otp varchar(6),
  is_delivery_otp_verified boolean default false,
  otp_code varchar(6),
  is_otp_verified boolean default false,
  delivery_feedback text check (delivery_feedback in ('all_ok', 'discrepancy_reported')),
  dispute_note text,

  sync_to_family_wealth boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance & duplicate bill warnings
create index if not exists idx_udhar_txn_business on udhar_transactions(business_id);
create index if not exists idx_udhar_txn_vendor on udhar_transactions(vendor_id);
create index if not exists idx_udhar_txn_bill_number on udhar_transactions(business_id, bill_number) where bill_number is not null;
create index if not exists idx_udhar_txn_status on udhar_transactions(status);

-- RLS
alter table udhar_transactions enable row level security;

create policy "Txn viewable by own business" on udhar_transactions
  for select using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Txn insertable by own business" on udhar_transactions
  for insert with check (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Txn updatable by own business" on udhar_transactions
  for update using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Txn deletable by own business" on udhar_transactions
  for delete using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );
