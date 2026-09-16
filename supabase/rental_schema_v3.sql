-- ============================================================================
-- SUPABASE MIGRATION V3: COMPREHENSIVE RENTAL, TENANTS, SHOPS & HOSTEL SCHEMA
-- Includes: Billing Cycles, Advance Deposits, Indian Legal Tenancy Rules,
-- Maintenance Adjustments, Damage Recovery, and OTP Verification.
-- ============================================================================

-- 1. EXTEND OR CREATE RENTAL PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.rental_properties (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    title TEXT NOT NULL,
    property_type TEXT NOT NULL DEFAULT 'residential_flat', -- 'commercial_shop' | 'residential_flat' | 'independent_house' | 'warehouse_godown' | 'pg_hostel'
    address TEXT,
    city TEXT DEFAULT 'Delhi NCR',
    landlord_name TEXT DEFAULT 'Makan Malik (Self)',
    landlord_phone TEXT,
    landlord_pan TEXT,
    landlord_upi TEXT,
    total_units_or_rooms INTEGER DEFAULT 1,
    total_capacity_beds INTEGER DEFAULT 1,
    has_hostel_model BOOLEAN DEFAULT false,
    monthly_target_revenue NUMERIC DEFAULT 0,
    security_deposit_holding NUMERIC DEFAULT 0,
    default_rules TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all new columns exist if table already exists
ALTER TABLE public.rental_properties ADD COLUMN IF NOT EXISTS landlord_name TEXT DEFAULT 'Makan Malik (Self)';
ALTER TABLE public.rental_properties ADD COLUMN IF NOT EXISTS landlord_phone TEXT;
ALTER TABLE public.rental_properties ADD COLUMN IF NOT EXISTS landlord_pan TEXT;
ALTER TABLE public.rental_properties ADD COLUMN IF NOT EXISTS landlord_upi TEXT;
ALTER TABLE public.rental_properties ADD COLUMN IF NOT EXISTS default_rules TEXT;

-- 2. EXTEND OR CREATE RENTAL TENANTS TABLE
CREATE TABLE IF NOT EXISTS public.rental_tenants (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
    room_id TEXT,
    room_number TEXT,
    bed_id TEXT,
    bed_number TEXT,
    name TEXT NOT NULL,
    father_or_spouse_name TEXT,
    phone TEXT,
    alternate_phone TEXT,
    aadhaar_no TEXT,
    permanent_address TEXT,
    current_address TEXT,
    occupation TEXT,
    
    -- Billing Cycle & Month Dates
    joining_date DATE DEFAULT CURRENT_DATE,
    cycle_start_day INTEGER DEFAULT 5,
    cycle_end_day INTEGER DEFAULT 4,
    rent_due_day INTEGER DEFAULT 5,
    
    -- Financials & Advance
    monthly_rent NUMERIC DEFAULT 0,
    security_deposit NUMERIC DEFAULT 0,
    advance_payment_date DATE,
    advance_payment_mode TEXT DEFAULT 'upi', -- 'upi' | 'bank_transfer' | 'cash' | 'cheque'
    advance_status TEXT DEFAULT 'held', -- 'held' | 'partially_adjusted' | 'refunded'
    
    -- Damage & Maintenance Adjustments
    damage_deduction_amount NUMERIC DEFAULT 0,
    damage_notes TEXT,
    maintenance_deduction_amount NUMERIC DEFAULT 0,
    maintenance_deduction_notes TEXT,
    
    -- Agreement, Lock-in & Terms (Niyam & Sharte)
    agreement_duration_months INTEGER DEFAULT 11,
    agreement_start_date DATE,
    agreement_end_date DATE,
    lock_in_period_months INTEGER DEFAULT 6,
    notice_period_days INTEGER DEFAULT 30,
    early_exit_penalty TEXT DEFAULT '1 mahine ka rent kata jayega agar lock-in se pehle khali kiya',
    special_terms TEXT,
    
    -- OTP & Digital Verification
    otp_verification_code TEXT,
    is_otp_verified BOOLEAN DEFAULT false,
    otp_verified_at TIMESTAMPTZ,
    
    -- Rent Status & Last Payment Info
    food_included BOOLEAN DEFAULT false,
    electricity_due NUMERIC DEFAULT 0,
    rent_status TEXT DEFAULT 'paid', -- 'paid' | 'pending' | 'overdue'
    last_paid_date DATE,
    last_paid_amount NUMERIC,
    last_payment_mode TEXT DEFAULT 'upi',
    last_transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alter columns for existing installations
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS father_or_spouse_name TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS alternate_phone TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS aadhaar_no TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS permanent_address TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS current_address TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS cycle_start_day INTEGER DEFAULT 5;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS cycle_end_day INTEGER DEFAULT 4;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS advance_payment_date DATE;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS advance_payment_mode TEXT DEFAULT 'upi';
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS advance_status TEXT DEFAULT 'held';
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS damage_deduction_amount NUMERIC DEFAULT 0;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS damage_notes TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS maintenance_deduction_amount NUMERIC DEFAULT 0;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS maintenance_deduction_notes TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS agreement_duration_months INTEGER DEFAULT 11;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS agreement_start_date DATE;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS agreement_end_date DATE;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS lock_in_period_months INTEGER DEFAULT 6;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS notice_period_days INTEGER DEFAULT 30;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS early_exit_penalty TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS special_terms TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS otp_verification_code TEXT;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS is_otp_verified BOOLEAN DEFAULT false;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS otp_verified_at TIMESTAMPTZ;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS last_paid_amount NUMERIC;
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS last_payment_mode TEXT DEFAULT 'upi';
ALTER TABLE public.rental_tenants ADD COLUMN IF NOT EXISTS last_transaction_id TEXT;

-- 3. RENTAL EXPENSES & MAINTENANCE LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.rental_expenses (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
    tenant_id TEXT,
    category TEXT NOT NULL, -- 'maintenance' | 'damage_repair' | 'electricity_main' | 'water_supply' | 'maid_cleaning' | 'cook_salary' | 'property_tax' | 'other'
    amount NUMERIC NOT NULL DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    paid_by TEXT DEFAULT 'owner', -- 'owner' | 'tenant'
    is_adjusted_in_rent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RENT SLIPS & OFFICIAL RECEIPTS LOG
CREATE TABLE IF NOT EXISTS public.rent_receipts (
    id TEXT PRIMARY KEY,
    receipt_no TEXT NOT NULL UNIQUE,
    property_id TEXT NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL REFERENCES public.rental_tenants(id) ON DELETE CASCADE,
    cycle_start_date DATE,
    cycle_end_date DATE,
    base_rent NUMERIC NOT NULL,
    electricity_units NUMERIC DEFAULT 0,
    electricity_rate NUMERIC DEFAULT 0,
    electricity_amount NUMERIC DEFAULT 0,
    maintenance_deduction NUMERIC DEFAULT 0,
    net_amount_paid NUMERIC NOT NULL,
    payment_mode TEXT DEFAULT 'upi',
    transaction_ref TEXT,
    payment_date DATE DEFAULT CURRENT_DATE,
    otp_auth_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_receipts ENABLE ROW LEVEL SECURITY;

-- Default permissive policies for authenticated users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to rental_properties') THEN
        CREATE POLICY "Allow public access to rental_properties" ON public.rental_properties FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to rental_tenants') THEN
        CREATE POLICY "Allow public access to rental_tenants" ON public.rental_tenants FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to rental_expenses') THEN
        CREATE POLICY "Allow public access to rental_expenses" ON public.rental_expenses FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access to rent_receipts') THEN
        CREATE POLICY "Allow public access to rent_receipts" ON public.rent_receipts FOR ALL USING (true);
    END IF;
END $$;
