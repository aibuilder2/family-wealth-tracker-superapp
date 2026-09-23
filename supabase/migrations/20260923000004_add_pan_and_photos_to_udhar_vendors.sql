-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 1: CUSTOMER PROFILE UPGRADE (PAN & PHOTOS)
-- Migration: 20260923000004_add_pan_and_photos_to_udhar_vendors.sql
-- Strictly isolated to "udhar_" module. No existing tables modified.
-- ============================================================================

-- Add pan_number (10-character statutory Indian PAN format)
alter table udhar_vendors 
  add column if not exists pan_number varchar(10) check (
    pan_number is null or 
    pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
  );

-- Add photo_urls (JSON array storing customer face/ID photos captured on 1st transaction)
alter table udhar_vendors 
  add column if not exists photo_urls jsonb default '[]'::jsonb;

-- Partial unique index: A business cannot have duplicate customers with the same PAN
create unique index if not exists idx_udhar_vendors_business_pan 
  on udhar_vendors (business_id, pan_number) 
  where pan_number is not null;

-- Search performance index on PAN
create index if not exists idx_udhar_vendors_pan 
  on udhar_vendors (pan_number);
