-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 1: VENDOR UNIQUE IDENTITY
-- Migration: 20260923000001_create_udhar_vendors.sql
-- Strictly isolated to "udhar_" module. No existing tables modified.
-- ============================================================================

-- Create udhar_vendors table
create table if not exists udhar_vendors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references families(id) on delete cascade not null,
  vendor_name text not null,
  contact_person text, -- Optional father/manager name
  
  -- Mandatory 10-digit Indian mobile number
  phone_number varchar(10) not null check (phone_number ~ '^[6-9][0-9]{9}$'),
  
  -- Optional 15-character GSTIN format
  gst_number varchar(15) check (
    gst_number is null or 
    gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
  ),
  
  address text,
  city text,
  credit_limit numeric(12,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Unique constraint: A business cannot have duplicate vendors with the same phone number
  constraint udhar_vendors_unique_phone unique (business_id, phone_number)
);

-- Partial unique index: A business cannot have duplicate vendors with the same GSTIN
create unique index if not exists idx_udhar_vendors_business_gst 
  on udhar_vendors (business_id, gst_number) 
  where gst_number is not null;

-- Search performance indexes
create index if not exists idx_udhar_vendors_phone on udhar_vendors (phone_number);
create index if not exists idx_udhar_vendors_gst on udhar_vendors (gst_number);
create index if not exists idx_udhar_vendors_name on udhar_vendors (vendor_name);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table udhar_vendors enable row level security;

-- Policy: Businesses/Families can only read their own vendors
create policy "Vendors viewable by own business" on udhar_vendors
  for select using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

-- Policy: Businesses can insert/update their own vendors
create policy "Vendors insertable by own business" on udhar_vendors
  for insert with check (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Vendors updatable by own business" on udhar_vendors
  for update using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Vendors deletable by own business" on udhar_vendors
  for delete using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );
