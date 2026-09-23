-- ============================================================================
-- VENDOR UDHAR SYSTEM — TASK 2: TERMS & CONDITIONS TEMPLATES
-- Migration: 20260923000002_create_udhar_tc_templates.sql
-- Strictly isolated to "udhar_" module.
-- ============================================================================

create table if not exists udhar_tc_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references families(id) on delete cascade not null,
  title text not null,
  content text not null,
  is_default boolean default false,
  usage_count integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Search index
create index if not exists idx_udhar_tc_templates_business on udhar_tc_templates(business_id);

-- RLS
alter table udhar_tc_templates enable row level security;

create policy "Templates viewable by own business" on udhar_tc_templates
  for select using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Templates insertable by own business" on udhar_tc_templates
  for insert with check (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Templates updatable by own business" on udhar_tc_templates
  for update using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );

create policy "Templates deletable by own business" on udhar_tc_templates
  for delete using (
    business_id = get_auth_family_id() or 
    auth.role() = 'service_role'
  );
