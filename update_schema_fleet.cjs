const fs = require('fs');

let schema = fs.readFileSync('supabase/schema.sql', 'utf8');

const fleetSQL = `
-- ============================================================================
-- 14. COMMERCIAL FLEET & TRANSPORT BUSINESS (Trucks, Buses, Cabs, Rentals)
-- ============================================================================
create table if not exists commercial_fleet_vehicles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  vehicle_type text not null,
  title_model text not null,
  reg_number text not null,
  business_model text not null,
  purchase_date date not null,
  purchase_cost numeric(14,2) not null,
  body_building_cost numeric(12,2) default 0,
  total_acquisition_cost numeric(14,2) not null,
  has_loan boolean default false,
  monthly_emi numeric(10,2) default 0,
  loan_tenure_months integer,
  loan_balance numeric(14,2) default 0,
  financier_name text,
  annual_depreciation_percent numeric(5,2) default 15.00,
  current_depreciated_value numeric(14,2) not null,
  resale_date date,
  resale_amount numeric(14,2),
  status text check (status in ('active', 'under_maintenance', 'sold')) default 'active',
  default_driver_name text not null,
  default_driver_phone text,
  default_conductor_name text,
  odometer_km integer default 0,
  permit_expiry date,
  fitness_expiry date,
  national_tax_expiry date,
  created_at timestamptz default now()
);

create table if not exists fleet_trips (
  id uuid primary key default gen_random_uuid(),
  fleet_vehicle_id uuid references commercial_fleet_vehicles(id) on delete cascade not null,
  trip_type text not null,
  trip_title text not null,
  start_date date not null,
  end_date date,
  assigned_driver text not null,
  driver_phone text,
  assigned_conductor text,
  customer_party_name text not null,
  customer_phone text,
  billing_mode text not null,
  rate numeric(10,2) not null,
  quantity numeric(10,2) default 1,
  gross_revenue numeric(12,2) not null,
  advance_received numeric(12,2) default 0,
  pending_payment numeric(12,2) default 0,
  diesel_liters numeric(8,2) default 0,
  diesel_cost numeric(10,2) default 0,
  toll_fastag_cost numeric(10,2) default 0,
  driver_bhata numeric(10,2) default 0,
  conductor_bhata numeric(10,2) default 0,
  chalan_cost numeric(10,2) default 0,
  other_repair_cost numeric(10,2) default 0,
  total_trip_expense numeric(12,2) not null,
  net_trip_profit numeric(12,2) not null,
  status text check (status in ('running', 'completed', 'cancelled')) default 'completed',
  created_at timestamptz default now()
);

create table if not exists lawyer_fee_payments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references court_cases(id) on delete cascade not null,
  date date not null,
  amount numeric(10,2) not null,
  payment_type text not null,
  note text
);

alter table commercial_fleet_vehicles enable row level security;
alter table fleet_trips enable row level security;
alter table lawyer_fee_payments enable row level security;
`;

if (!schema.includes('commercial_fleet_vehicles')) {
  fs.writeFileSync('supabase/schema.sql', schema.trim() + '\n' + fleetSQL.trim() + '\n', 'utf8');
  console.log('Appended Commercial Fleet & Lawyer fee tables to schema.sql');
}
