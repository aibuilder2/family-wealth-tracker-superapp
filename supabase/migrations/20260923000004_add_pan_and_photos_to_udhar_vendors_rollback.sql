-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 1: ROLLBACK SCRIPT
-- Migration Rollback: 20260923000004_add_pan_and_photos_to_udhar_vendors_rollback.sql
-- ============================================================================

drop index if exists idx_udhar_vendors_pan;
drop index if exists idx_udhar_vendors_business_pan;

alter table udhar_vendors 
  drop column if exists photo_urls,
  drop column if exists pan_number;
