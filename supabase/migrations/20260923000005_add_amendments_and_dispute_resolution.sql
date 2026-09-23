-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2: BILL & DISPUTE IMMUTABILITY (AMENDED VERSIONING)
-- Migration: 20260923000005_add_amendments_and_dispute_resolution.sql
-- Strictly isolated to "udhar_" module. No existing core tables touched.
-- ============================================================================

-- Add amendment and dispute-resolution tracking columns to udhar_transactions
alter table udhar_transactions 
  add column if not exists amended_from_id uuid references udhar_transactions(id) on delete set null,
  add column if not exists amendment_version integer default 1,
  add column if not exists amendment_reason text,
  add column if not exists is_amended boolean default false,
  add column if not exists is_dispute_resolved boolean default false,
  add column if not exists dispute_resolved_at timestamptz,
  add column if not exists dispute_resolution_note text;

-- Index for amendment ancestry tree queries
create index if not exists idx_udhar_transactions_amended_from 
  on udhar_transactions (amended_from_id);

-- Index for dispute resolution queries
create index if not exists idx_udhar_transactions_dispute_resolved 
  on udhar_transactions (is_dispute_resolved);
