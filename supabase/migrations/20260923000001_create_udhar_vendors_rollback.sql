-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 1: ROLLBACK SCRIPT
-- Migration: 20260923000001_create_udhar_vendors_rollback.sql
-- Safely reverts the creation of udhar_vendors table and its policies.
-- ============================================================================

drop policy if exists "Vendors deletable by own business" on udhar_vendors;
drop policy if exists "Vendors updatable by own business" on udhar_vendors;
drop policy if exists "Vendors insertable by own business" on udhar_vendors;
drop policy if exists "Vendors viewable by own business" on udhar_vendors;

drop index if exists idx_udhar_vendors_name;
drop index if exists idx_udhar_vendors_gst;
drop index if exists idx_udhar_vendors_phone;
drop index if exists idx_udhar_vendors_business_gst;

drop table if exists udhar_vendors cascade;
