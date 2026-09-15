-- =========================================================================
-- MASTER SUPABASE SQL SCHEMA (V2) - ALL MODULES & TABLES
-- Copy & Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dylqygcccgrarerfgupe/sql
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FAMILY MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.family_members (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    color TEXT DEFAULT '#B98B2A',
    initials TEXT DEFAULT 'M',
    relationship TEXT DEFAULT 'Family Member',
    dob DATE,
    phone TEXT,
    permissions JSONB DEFAULT '{"is_admin": false, "can_view_investments": true, "can_view_vault": true, "can_view_medical": true}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    member_id TEXT,
    type TEXT NOT NULL, -- 'income' | 'expense' | 'udhar_given' | 'udhar_taken'
    amount NUMERIC NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    category_type TEXT DEFAULT 'main_ghar',
    payment_method TEXT DEFAULT 'upi',
    mode TEXT DEFAULT 'online',
    scope TEXT DEFAULT 'ghar',
    description TEXT,
    note TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_stamp TEXT,
    is_recurring BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.assets (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'liquid' | 'fixed'
    sub_category TEXT,
    type TEXT,
    value NUMERIC NOT NULL DEFAULT 0,
    purchase_price NUMERIC,
    owner_member_id TEXT,
    notes TEXT,
    color TEXT DEFAULT '#B98B2A',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GOALS TABLE
CREATE TABLE IF NOT EXISTS public.goals (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    title TEXT NOT NULL,
    target_amount NUMERIC NOT NULL DEFAULT 0,
    saved_amount NUMERIC NOT NULL DEFAULT 0,
    target_date DATE,
    category TEXT DEFAULT 'education',
    monthly_contribution NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    member_id TEXT,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC,
    category TEXT DEFAULT 'general',
    color TEXT DEFAULT '#B98B2A',
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RENTAL PROPERTIES & PG / HOSTEL TABLE
CREATE TABLE IF NOT EXISTS public.rental_properties (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'residential_flat' | 'commercial_shop' | 'godown' | 'pg_hostel' | 'hostel_boys' | 'hostel_girls'
    address TEXT,
    total_floors INTEGER DEFAULT 1,
    total_units INTEGER DEFAULT 1,
    total_beds INTEGER,
    monthly_target_rent NUMERIC DEFAULT 0,
    collected_rent NUMERIC DEFAULT 0,
    pending_rent NUMERIC DEFAULT 0,
    security_deposit_in_hand NUMERIC DEFAULT 0,
    occupancy_percent INTEGER DEFAULT 100,
    has_mess_facility BOOLEAN DEFAULT false,
    sub_meter_rate_per_unit NUMERIC DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HOSTEL ROOMS & BED MATRIX TABLE
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    room_number TEXT NOT NULL,
    floor INTEGER DEFAULT 1,
    sharing_type TEXT DEFAULT 'double', -- 'single' | 'double' | 'triple' | 'four'
    is_ac BOOLEAN DEFAULT false,
    monthly_rent_per_bed NUMERIC DEFAULT 6000,
    sub_meter_prev_reading NUMERIC DEFAULT 0,
    sub_meter_curr_reading NUMERIC DEFAULT 0,
    beds JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RENTAL TENANTS TABLE
CREATE TABLE IF NOT EXISTS public.rental_tenants (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    room_id TEXT,
    bed_id TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    aadhaar_number TEXT,
    monthly_rent NUMERIC NOT NULL DEFAULT 0,
    security_deposit NUMERIC DEFAULT 0,
    move_in_date DATE DEFAULT CURRENT_DATE,
    rent_due_day INTEGER DEFAULT 1,
    payment_status TEXT DEFAULT 'pending', -- 'paid' | 'pending' | 'overdue'
    last_payment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BUSINESS FIRMS TABLE
CREATE TABLE IF NOT EXISTS public.business_firms (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    firm_name TEXT NOT NULL,
    firm_type TEXT DEFAULT 'proprietorship', -- 'partnership' | 'pvt_ltd' | 'llp'
    gstin TEXT,
    pan TEXT,
    current_year_turnover NUMERIC DEFAULT 0,
    cash_in_bank NUMERIC DEFAULT 0,
    gst_due_date DATE,
    gst_due_amount NUMERIC DEFAULT 0,
    tds_payable NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FLEET & TRANSPORT BUSINESS TABLE
CREATE TABLE IF NOT EXISTS public.fleet_vehicles (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    reg_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL, -- 'truck_10_wheel' | 'truck_16_wheel' | 'mini_truck' | 'school_bus' | 'commercial_cab' | 'tractor'
    model_name TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    diesel_monthly_expense NUMERIC DEFAULT 0,
    toll_monthly_expense NUMERIC DEFAULT 0,
    monthly_revenue NUMERIC DEFAULT 0,
    insurance_expiry DATE,
    national_permit_expiry DATE,
    fitness_expiry DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AGRICULTURAL LAND & CROPS TABLE
CREATE TABLE IF NOT EXISTS public.agricultural_lands (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    location TEXT NOT NULL,
    area_bigha NUMERIC NOT NULL DEFAULT 0,
    soil_type TEXT DEFAULT 'alluvial',
    water_source TEXT DEFAULT 'tubewell',
    lease_type TEXT DEFAULT 'own', -- 'theka' | 'adhiya'
    theka_annual_rent NUMERIC DEFAULT 0,
    active_crop TEXT,
    season TEXT DEFAULT 'rabi', -- 'kharif' | 'zaid'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DOCUMENT VAULT TABLE
CREATE TABLE IF NOT EXISTS public.vault_documents (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'property' | 'vehicle' | 'id_proof' | 'insurance' | 'tax' | 'medical'
    doc_number TEXT,
    file_url TEXT,
    expiry_date DATE,
    is_verified BOOLEAN DEFAULT false,
    is_sensitive BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. UDHAR KHATA (LEND / BORROW) TABLE
CREATE TABLE IF NOT EXISTS public.udhar_contacts (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    name TEXT NOT NULL,
    phone TEXT,
    type TEXT NOT NULL, -- 'given' | 'taken'
    balance NUMERIC NOT NULL DEFAULT 0,
    due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.medical_records (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL,
    blood_group TEXT DEFAULT 'O+ Positive',
    allergies JSONB DEFAULT '[]',
    chronic_conditions JSONB DEFAULT '[]',
    regular_medicines JSONB DEFAULT '[]',
    emergency_contact JSONB DEFAULT '{"name": "Family Head", "phone": "+91 9876543210"}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. STOCK ACADEMY & AI PREDICTIONS
CREATE TABLE IF NOT EXISTS public.learn_chapters (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'zero-to-hero',
    category TEXT DEFAULT '0 Se Seekho',
    content TEXT NOT NULL,
    quiz_data JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.predictions_log (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    symbol TEXT NOT NULL,
    company_name TEXT,
    direction TEXT NOT NULL DEFAULT 'up',
    timeframe TEXT NOT NULL DEFAULT 'Intraday',
    confidence_pct INTEGER DEFAULT 85,
    overall_score NUMERIC DEFAULT 8.5,
    pattern_detected TEXT,
    target_price NUMERIC,
    stop_loss NUMERIC,
    reasoning TEXT,
    sources JSONB DEFAULT '["NSE Live", "Technical Volume"]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for seamless client operations
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_firms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_lands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.udhar_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.learn_chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions_log DISABLE ROW LEVEL SECURITY;
