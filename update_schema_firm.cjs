const fs = require('fs');

let schema = fs.readFileSync('supabase/schema.sql', 'utf8');

const firmSQL = `
-- ============================================================================
-- 15. REGISTERED BUSINESS FIRMS, GST & PARTNER DRAWINGS
-- ============================================================================
create table if not exists business_firms (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  firm_name text not null,
  entity_type text check (entity_type in ('Proprietorship', 'Partnership_Firm', 'Pvt_Ltd', 'LLP', 'Individual_Unregistered')) not null,
  gstin text,
  pan text,
  bank_current_acc text,
  total_revenue numeric(14,2) default 0,
  total_expenses numeric(14,2) default 0,
  total_gst_collected numeric(12,2) default 0,
  total_tds_deducted numeric(12,2) default 0,
  current_firm_balance numeric(14,2) default 0,
  total_drawings_paid numeric(14,2) default 0,
  created_at timestamptz default now()
);

create table if not exists firm_drawings (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references business_firms(id) on delete cascade not null,
  date date not null,
  amount numeric(12,2) not null,
  drawing_type text check (drawing_type in ('partner_salary', 'profit_dividend', 'director_remuneration')) not null,
  credited_to_member_id uuid references members(id) on delete set null,
  note text
);

alter table business_firms enable row level security;
alter table firm_drawings enable row level security;
`;

if (!schema.includes('business_firms')) {
  fs.writeFileSync('supabase/schema.sql', schema.trim() + '\n' + firmSQL.trim() + '\n', 'utf8');
  console.log('Appended BusinessFirm SQL tables to schema.sql');
}
