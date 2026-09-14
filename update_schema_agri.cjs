const fs = require('fs');

let schema = fs.readFileSync('supabase/schema.sql', 'utf8');

const agriAndVehicleSQL = `
-- ============================================================================
-- 12. AGRICULTURAL LAND & CROP MANAGEMENT (Kheti, Theka, Adhiya)
-- ============================================================================
create table if not exists agricultural_lands (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  title text not null,
  location text not null,
  area numeric(8,2) not null,
  area_unit text check (area_unit in ('Bigha', 'Acre', 'Killa', 'Hectare')) default 'Bigha',
  farming_type text check (farming_type in ('khud', 'theka', 'adhiya')) default 'khud',
  partner_name text,
  partner_phone text,
  yearly_theka_amount numeric(12,2),
  current_crop text,
  created_at timestamptz default now()
);

create table if not exists agriculture_crop_cycles (
  id uuid primary key default gen_random_uuid(),
  land_id uuid references agricultural_lands(id) on delete cascade not null,
  season text not null,
  year integer not null,
  crop_name text not null,
  total_expense numeric(12,2) default 0,
  crop_yield_quintals numeric(8,2),
  mandi_rate_per_quintal numeric(10,2),
  crop_sale_income numeric(12,2) default 0,
  govt_bonus_amount numeric(10,2) default 0,
  total_income numeric(12,2) default 0,
  net_profit numeric(12,2) default 0,
  status text check (status in ('active', 'harvested', 'completed')) default 'active',
  created_at timestamptz default now()
);

create table if not exists agriculture_expenses (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid references agriculture_crop_cycles(id) on delete cascade not null,
  category text check (category in ('beej', 'khaad', 'pesticide', 'diesel_water', 'labor', 'harvesting', 'other')) not null,
  amount numeric(10,2) not null,
  date date default current_date,
  note text
);

-- ============================================================================
-- 13. VEHICLES & CAR/BIKE LOGS
-- ============================================================================
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families(id) on delete cascade not null,
  member_id uuid references members(id) on delete set null,
  vehicle_type text check (vehicle_type in ('car', 'bike', 'scooter', 'tractor', 'other')) not null,
  brand_model text not null,
  reg_number text not null,
  purchase_date date not null,
  purchase_price numeric(12,2) not null,
  fuel_type text check (fuel_type in ('Petrol', 'Diesel', 'CNG', 'EV', 'Hybrid')) not null,
  rc_expiry date,
  insurance_policy_no text,
  insurance_expiry date,
  puc_expiry date,
  service_due_date date,
  fastag_bank text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists vehicle_service_logs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  service_date date not null,
  odometer_km integer not null,
  cost numeric(10,2) not null,
  garage_name text,
  details text
);

alter table agricultural_lands enable row level security;
alter table agriculture_crop_cycles enable row level security;
alter table agriculture_expenses enable row level security;
alter table vehicles enable row level security;
alter table vehicle_service_logs enable row level security;
`;

if (!schema.includes('agricultural_lands')) {
  fs.writeFileSync('supabase/schema.sql', schema.trim() + '\n' + agriAndVehicleSQL.trim() + '\n', 'utf8');
  console.log('Appended Agri & Vehicle SQL tables to schema.sql');
}
