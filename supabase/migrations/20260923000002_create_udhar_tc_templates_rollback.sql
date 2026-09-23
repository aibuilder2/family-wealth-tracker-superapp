-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2: ROLLBACK SCRIPT
-- Migration: 20260923000002_create_udhar_tc_templates_rollback.sql
-- ============================================================================

drop policy if exists "Templates deletable by own business" on udhar_tc_templates;
drop policy if exists "Templates updatable by own business" on udhar_tc_templates;
drop policy if exists "Templates insertable by own business" on udhar_tc_templates;
drop policy if exists "Templates viewable by own business" on udhar_tc_templates;

drop index if exists idx_udhar_tc_templates_business;
drop table if exists udhar_tc_templates cascade;
