-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2.5, 2.6, 2.7: ROLLBACK SCRIPT
-- Migration: 20260923000003_create_udhar_transactions_rollback.sql
-- ============================================================================

drop policy if exists "Txn deletable by own business" on udhar_transactions;
drop policy if exists "Txn updatable by own business" on udhar_transactions;
drop policy if exists "Txn insertable by own business" on udhar_transactions;
drop policy if exists "Txn viewable by own business" on udhar_transactions;

drop index if exists idx_udhar_txn_status;
drop index if exists idx_udhar_txn_bill_number;
drop index if exists idx_udhar_txn_vendor;
drop index if exists idx_udhar_txn_business;

drop table if exists udhar_transactions cascade;
