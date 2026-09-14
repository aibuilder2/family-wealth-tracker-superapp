-- =========================================================================
-- COMPLETE SUPABASE SCHEMA FOR FAMILY WEALTH & STOCK SUPERAPP
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/dylqygcccgrarerfgupe/sql)
-- =========================================================================

-- Enable UUID Extension
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
    permissions JSONB DEFAULT '{"is_admin": false, "can_view_investments": true, "can_view_vault": true}',
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
    mode TEXT DEFAULT 'online', -- 'cash' | 'online' | 'cheque'
    scope TEXT DEFAULT 'ghar',
    note TEXT,
    txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_stamp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.assets (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'liquid' | 'fixed'
    sub_category TEXT, -- 'bank' | 'gold' | 'real_estate' | 'crypto' | 'stocks' | 'vehicle'
    value NUMERIC NOT NULL DEFAULT 0,
    owner_member_id TEXT,
    notes TEXT,
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL DEFAULT 'fam-1',
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC,
    category TEXT DEFAULT 'general',
    color TEXT DEFAULT '#B98B2A',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEARN CHAPTERS TABLE (Stock Academy)
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

-- 7. PREDICTIONS LOG TABLE
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

-- Disable Row Level Security (or Enable Public Access for Anon Key)
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.learn_chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions_log DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- SEED INITIAL SAMPLES
-- =========================================================================

INSERT INTO public.family_members (id, family_id, name, role, color, initials, relationship, permissions)
VALUES ('m-head', 'fam-1', 'Head of Family (Aap)', 'owner', '#B98B2A', 'H', 'Head of Family', '{"is_admin": true, "can_view_investments": true, "can_view_vault": true}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.goals (id, family_id, title, target_amount, saved_amount, category)
VALUES ('g-1', 'fam-1', 'Priya ki Education', 500000, 310000, 'education')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.predictions_log (id, symbol, company_name, direction, timeframe, confidence_pct, overall_score, pattern_detected, reasoning)
VALUES 
('p-1', 'TATAMOTORS', 'Tata Motors Ltd', 'up', 'Intraday', 89, 8.7, 'Bullish Flag Breakout', 'Heavy intraday buying volume crossing 200 EMA with expanding commercial vehicle orders.'),
('p-2', 'INFY', 'Infosys Ltd', 'up', 'Intraday', 84, 8.2, 'RSI Mean Reversion', 'Oversold bounce confirmed with positive tech sector momentum and institutional inflow.'),
('p-3', 'RELIANCE', 'Reliance Industries Ltd', 'up', 'Short Term', 88, 8.6, 'Cup & Handle Continuation', 'Strong oil-to-chemicals refining margins and Jio subscriber growth momentum.')
ON CONFLICT (id) DO NOTHING;
