-- =========================================================================
-- BUSINESS SETUP, PRE-OPERATIVE CAPEX & CONSTRUCTION SCHEMA MIGRATION
-- =========================================================================

-- 1. BUSINESS SETUP PROJECTS
CREATE TABLE IF NOT EXISTS public.business_setup_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    target_launch_date DATE NOT NULL,
    actual_launch_date DATE,
    status TEXT NOT NULL DEFAULT 'setup_in_progress', -- 'setup_in_progress', 'capitalized_live', 'closed'
    linked_firm_id TEXT,
    capitalization_date DATE,
    capitalization_summary JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SETUP FUNDING SOURCES (Multi-source: Savings, Bank Loans, NBFC, Private, Friends)
CREATE TABLE IF NOT EXISTS public.setup_funding_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.business_setup_projects(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'self_savings', 'bank_term_loan', 'private_bank_nbfc', 'friends_family_debt', 'investor_seed_equity'
    provider_name TEXT NOT NULL,
    sanctioned_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    disbursed_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    interest_rate_annual NUMERIC(5,2) NOT NULL DEFAULT 0,
    charge_interest BOOLEAN NOT NULL DEFAULT true,
    processing_fees NUMERIC(12,2) NOT NULL DEFAULT 0,
    documentation_bank_charges NUMERIC(12,2) NOT NULL DEFAULT 0,
    collateral JSONB DEFAULT '{"is_pledged": false}'::jsonb,
    tranches JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRE-OPERATIVE SETUP EXPENSES (GST, Furniture, IT, Machinery, Pre-commencement)
CREATE TABLE IF NOT EXISTS public.preop_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.business_setup_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    category TEXT NOT NULL, -- 'legal_incorporation', 'licensing_gst_ip', 'interior_furniture', 'it_website_software', etc.
    expense_date DATE NOT NULL,
    funding_source_id UUID REFERENCES public.setup_funding_sources(id) ON DELETE SET NULL,
    funding_source_name TEXT,
    vendor_name TEXT,
    gst_amount NUMERIC(12,2) DEFAULT 0,
    invoice_no TEXT,
    is_fixed_asset BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    bill_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SETUP LOAN REPAYMENTS & EQUITY REFUNDS
CREATE TABLE IF NOT EXISTS public.setup_project_repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.business_setup_projects(id) ON DELETE CASCADE,
    funding_source_id UUID NOT NULL REFERENCES public.setup_funding_sources(id) ON DELETE CASCADE,
    funding_source_name TEXT NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    repayment_date DATE NOT NULL,
    payment_mode TEXT NOT NULL DEFAULT 'bank',
    principal_portion NUMERIC(15,2) NOT NULL DEFAULT 0,
    interest_portion NUMERIC(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONSTRUCTION & THEKEDAR PROJECTS
CREATE TABLE IF NOT EXISTS public.construction_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id TEXT NOT NULL,
    site_title TEXT NOT NULL,
    site_location TEXT NOT NULL,
    plot_area_sqft NUMERIC(10,2),
    builtup_area_sqft NUMERIC(10,2),
    target_budget NUMERIC(15,2) NOT NULL DEFAULT 0,
    current_stage TEXT NOT NULL DEFAULT 'planning_sanction',
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ongoing',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONSTRUCTION MATERIAL LOGS (Cement, Sariya, Rodi, Bricks, Tiles)
CREATE TABLE IF NOT EXISTS public.construction_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.construction_projects(id) ON DELETE CASCADE,
    material_name TEXT NOT NULL,
    category TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    vendor_phone TEXT,
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    rate_per_unit NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    pending_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    invoice_no TEXT,
    vehicle_no TEXT,
    purchase_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. THEKEDAR CONTRACTS & RA BILLS (Civil, Dhalai Machine, Chokhat, Shuttering)
CREATE TABLE IF NOT EXISTS public.thekedar_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.construction_projects(id) ON DELETE CASCADE,
    contractor_name TEXT NOT NULL,
    contractor_category TEXT DEFAULT 'civil_structure', -- 'civil_structure', 'dhalai_slab_machine', 'chokhat_doors', 'shuttering', 'plaster_masonry', 'tiles_flooring', etc.
    work_scope TEXT NOT NULL,
    phone TEXT,
    contract_type TEXT NOT NULL DEFAULT 'sqft_rate', -- 'sqft_rate', 'item_rate', 'lump_sum_theka'
    unit_basis TEXT DEFAULT 'sqft', -- 'sqft', 'sqmtr', 'rft', 'lump_sum', 'item_rate'
    rate_per_unit NUMERIC(10,2),
    total_units NUMERIC(10,2),
    rate_per_sqft NUMERIC(10,2),
    total_sqft NUMERIC(10,2),
    total_contract_value NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_paid NUMERIC(15,2) NOT NULL DEFAULT 0,
    retention_amount NUMERIC(12,2) DEFAULT 0,
    is_third_party_dhalai BOOLEAN DEFAULT false,
    bills JSONB DEFAULT '[]'::jsonb, -- Stage Milestone RA Bills: Plinth, Chokhat, Lintel, Dhalai Lanter, Plaster, Finishing
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IDEMPOTENT COLUMN ADDITIONS (In case tables were created earlier)
ALTER TABLE public.thekedar_contracts ADD COLUMN IF NOT EXISTS contractor_category TEXT DEFAULT 'civil_structure';
ALTER TABLE public.thekedar_contracts ADD COLUMN IF NOT EXISTS unit_basis TEXT DEFAULT 'sqft';
ALTER TABLE public.thekedar_contracts ADD COLUMN IF NOT EXISTS rate_per_unit NUMERIC(10,2);
ALTER TABLE public.thekedar_contracts ADD COLUMN IF NOT EXISTS total_units NUMERIC(10,2);
ALTER TABLE public.thekedar_contracts ADD COLUMN IF NOT EXISTS is_third_party_dhalai BOOLEAN DEFAULT false;

ALTER TABLE public.preop_expenses ADD COLUMN IF NOT EXISTS vendor_name TEXT;
ALTER TABLE public.preop_expenses ADD COLUMN IF NOT EXISTS gst_amount NUMERIC(12,2) DEFAULT 0;
ALTER TABLE public.preop_expenses ADD COLUMN IF NOT EXISTS invoice_no TEXT;
ALTER TABLE public.preop_expenses ADD COLUMN IF NOT EXISTS is_fixed_asset BOOLEAN DEFAULT true;

ALTER TABLE public.construction_materials ADD COLUMN IF NOT EXISTS vendor_name TEXT;
ALTER TABLE public.construction_materials ADD COLUMN IF NOT EXISTS vendor_phone TEXT;
ALTER TABLE public.construction_materials ADD COLUMN IF NOT EXISTS vehicle_no TEXT;
ALTER TABLE public.construction_materials ADD COLUMN IF NOT EXISTS invoice_no TEXT;

-- 8. LABOR HAZIRA & DAILY WAGES
CREATE TABLE IF NOT EXISTS public.labor_hazira_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.construction_projects(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    mistri_count INT NOT NULL DEFAULT 0,
    mistri_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
    labor_count INT NOT NULL DEFAULT 0,
    labor_rate NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_daily_wage NUMERIC(12,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    khuraki_advance NUMERIC(10,2) DEFAULT 0,
    supervisor_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE public.business_setup_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setup_funding_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preop_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setup_project_repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thekedar_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labor_hazira_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user family setup projects') THEN
        CREATE POLICY "Allow authenticated user family setup projects" ON public.business_setup_projects FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user funding sources') THEN
        CREATE POLICY "Allow authenticated user funding sources" ON public.setup_funding_sources FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user preop expenses') THEN
        CREATE POLICY "Allow authenticated user preop expenses" ON public.preop_expenses FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user repayments') THEN
        CREATE POLICY "Allow authenticated user repayments" ON public.setup_project_repayments FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user construction projects') THEN
        CREATE POLICY "Allow authenticated user construction projects" ON public.construction_projects FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user construction materials') THEN
        CREATE POLICY "Allow authenticated user construction materials" ON public.construction_materials FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user thekedar contracts') THEN
        CREATE POLICY "Allow authenticated user thekedar contracts" ON public.thekedar_contracts FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated user labor hazira') THEN
        CREATE POLICY "Allow authenticated user labor hazira" ON public.labor_hazira_logs FOR ALL USING (auth.uid() IS NOT NULL);
    END IF;
END $$;
