-- ============================================================================
-- MIGRATION: 20260923000006_create_udhar_mandates.sql
-- DESCRIPTION: Task 5 Sub-task A: UPI Mandate / AutoPay Recovery Module
-- TABLES: udhar_mandates, udhar_mandate_logs
-- ============================================================================

-- 1. Create udhar_mandates table
CREATE TABLE IF NOT EXISTS udhar_mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  udhar_transaction_id UUID NOT NULL REFERENCES udhar_transactions(id) ON DELETE CASCADE,
  max_amount NUMERIC NOT NULL CHECK (max_amount > 0 AND max_amount <= 15000),
  razorpay_token_id TEXT,
  razorpay_customer_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'bounced', 'executed', 'cancelled')) DEFAULT 'pending',
  auth_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create udhar_mandate_logs table for audit trail & webhooks
CREATE TABLE IF NOT EXISTS udhar_mandate_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id UUID REFERENCES udhar_mandates(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  processing_fee NUMERIC DEFAULT 0,
  vendor_received_amount NUMERIC DEFAULT 0,
  failure_reason TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_udhar_mandates_tx_id ON udhar_mandates(udhar_transaction_id);
CREATE INDEX IF NOT EXISTS idx_udhar_mandates_status ON udhar_mandates(status);
CREATE INDEX IF NOT EXISTS idx_udhar_mandate_logs_mandate_id ON udhar_mandate_logs(mandate_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE udhar_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE udhar_mandate_logs ENABLE ROW LEVEL SECURITY;

-- 5. Policies allowing authenticated users to access mandates
CREATE POLICY "Allow authenticated users to read udhar_mandates"
  ON udhar_mandates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert/update udhar_mandates"
  ON udhar_mandates FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read udhar_mandate_logs"
  ON udhar_mandate_logs FOR SELECT
  TO authenticated
  USING (true);
