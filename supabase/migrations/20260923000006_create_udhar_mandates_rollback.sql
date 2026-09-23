-- ============================================================================
-- ROLLBACK: 20260923000006_create_udhar_mandates_rollback.sql
-- DESCRIPTION: Revert Task 5 Sub-task A: udhar_mandates & udhar_mandate_logs
-- ============================================================================

DROP TABLE IF EXISTS udhar_mandate_logs CASCADE;
DROP TABLE IF EXISTS udhar_mandates CASCADE;
