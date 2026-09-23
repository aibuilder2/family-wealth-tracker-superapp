-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2 ROLLBACK
-- Migration: 20260923000005_add_amendments_and_dispute_resolution_rollback.sql
-- ============================================================================

drop index if exists idx_udhar_transactions_dispute_resolved;
drop index if exists idx_udhar_transactions_amended_from;

alter table udhar_transactions 
  drop column if exists dispute_resolution_note,
  drop column if exists dispute_resolved_at,
  drop column if exists is_dispute_resolved,
  drop column if exists is_amended,
  drop column if exists amendment_reason,
  drop column if exists amendment_version,
  drop column if exists amended_from_id;
