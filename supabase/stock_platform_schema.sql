
-- Migration: 001_stocks_master.sql
-- 001_stocks_master.sql migration
-- ============================================================
-- FILE: supabase/migrations/001_stocks_master.sql
-- DESC: Master list of all NSE/BSE listed stocks
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE exchange_type AS ENUM ('NSE', 'BSE', 'BOTH');
CREATE TYPE stock_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELISTED');
CREATE TYPE market_cap_category AS ENUM ('LARGECAP', 'MIDCAP', 'SMALLCAP', 'MICROCAP');
CREATE TYPE index_membership AS ENUM (
  'NIFTY50', 'NIFTY100', 'NIFTY200', 'NIFTY500',
  'BANKNIFTY', 'SENSEX', 'NIFTYMIDCAP150',
  'NIFTYSMALLCAP250', 'NIFTYNEXT50'
);

-- ============================================================
-- SECTORS & INDUSTRIES
-- ============================================================

CREATE TABLE sectors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE industries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id   UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sector_id, name)
);

-- ============================================================
-- MAIN STOCKS TABLE
-- ============================================================

CREATE TABLE stocks_master (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Identity
  symbol              TEXT NOT NULL,           -- NSE symbol e.g. RELIANCE
  bse_code            TEXT,                    -- BSE code e.g. 500325
  isin                TEXT UNIQUE,             -- ISIN number
  company_name        TEXT NOT NULL,
  short_name          TEXT,                    -- Short display name

  -- Exchange Info
  exchange            exchange_type DEFAULT 'BOTH',
  listing_date        DATE,                    -- When first listed
  status              stock_status DEFAULT 'ACTIVE',

  -- Classification
  sector_id           UUID REFERENCES sectors(id),
  industry_id         UUID REFERENCES industries(id),
  market_cap_category market_cap_category,

  -- Index Memberships (array - stock can be in multiple indices)
  indices             index_membership[] DEFAULT '{}',

  -- Company Details
  registered_office   TEXT,
  website             TEXT,
  founded_year        INTEGER,
  employees_count     INTEGER,
  cin_number          TEXT,                    -- Company identification number

  -- Current Market Data (updated daily)
  current_price       DECIMAL(12,2),
  market_cap          DECIMAL(20,2),           -- In crores
  face_value          DECIMAL(8,2) DEFAULT 10,
  lot_size            INTEGER DEFAULT 1,

  -- Float & Shareholding
  total_shares        BIGINT,
  public_float_pct    DECIMAL(5,2),
  promoter_holding    DECIMAL(5,2),

  -- Zerodha Kite Token (for live data)
  kite_instrument_token BIGINT,
  kite_exchange_token   INTEGER,

  -- Flags
  is_fno_enabled      BOOLEAN DEFAULT FALSE,
  is_etf              BOOLEAN DEFAULT FALSE,
  is_index            BOOLEAN DEFAULT FALSE,
  has_derivatives     BOOLEAN DEFAULT FALSE,

  -- Metadata
  logo_url            TEXT,
  description         TEXT,                    -- Company description
  tags                TEXT[] DEFAULT '{}',     -- Custom tags for filtering

  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(symbol, exchange)
);

-- ============================================================
-- INDEX COMPONENTS TABLE
-- Track which stocks are in which indices
-- ============================================================

CREATE TABLE index_components (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_name    index_membership NOT NULL,
  stock_id      UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  added_date    DATE,
  removed_date  DATE,                          -- NULL if currently in index
  weight_pct    DECIMAL(6,4),                  -- Weight in index
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(index_name, stock_id, added_date)
);

-- ============================================================
-- STOCK ALIASES
-- For search (company known by multiple names)
-- ============================================================

CREATE TABLE stock_aliases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id   UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  alias      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stock_id, alias)
);

-- ============================================================
-- CORPORATE ACTIONS
-- Splits, Bonuses, Dividends, Rights
-- ============================================================

CREATE TYPE corporate_action_type AS ENUM (
  'SPLIT', 'BONUS', 'DIVIDEND', 'RIGHTS',
  'BUYBACK', 'MERGER', 'DEMERGER', 'NAME_CHANGE'
);

CREATE TABLE corporate_actions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id      UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  action_type   corporate_action_type NOT NULL,
  ex_date       DATE NOT NULL,
  record_date   DATE,
  details       JSONB NOT NULL DEFAULT '{}',
  -- For SPLIT: {"ratio": "1:5", "from_fv": 10, "to_fv": 2}
  -- For BONUS: {"ratio": "1:1"}
  -- For DIVIDEND: {"amount": 5.5, "type": "interim/final"}
  -- For RIGHTS: {"ratio": "1:4", "price": 100}
  announced_at  DATE,
  source_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STOCK MANAGEMENT HISTORY
-- CEO/MD changes, major management events
-- ============================================================

CREATE TABLE management_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id     UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,               -- CEO, MD, Chairman, CFO
  person_name  TEXT NOT NULL,
  from_date    DATE,
  to_date      DATE,                        -- NULL if current
  notes        TEXT,
  source_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Primary search indexes
CREATE INDEX idx_stocks_symbol        ON stocks_master(symbol);
CREATE INDEX idx_stocks_bse_code      ON stocks_master(bse_code);
CREATE INDEX idx_stocks_isin          ON stocks_master(isin);
CREATE INDEX idx_stocks_status        ON stocks_master(status);
CREATE INDEX idx_stocks_sector        ON stocks_master(sector_id);
CREATE INDEX idx_stocks_market_cap    ON stocks_master(market_cap_category);
CREATE INDEX idx_stocks_indices       ON stocks_master USING GIN(indices);

-- Full text search on company name
CREATE INDEX idx_stocks_name_trgm     ON stocks_master USING GIN(company_name gin_trgm_ops);
CREATE INDEX idx_stocks_symbol_trgm   ON stocks_master USING GIN(symbol gin_trgm_ops);
CREATE INDEX idx_aliases_alias_trgm   ON stock_aliases USING GIN(alias gin_trgm_ops);

-- Corporate actions
CREATE INDEX idx_corp_actions_stock   ON corporate_actions(stock_id);
CREATE INDEX idx_corp_actions_date    ON corporate_actions(ex_date DESC);
CREATE INDEX idx_corp_actions_type    ON corporate_actions(action_type);

-- Index components
CREATE INDEX idx_index_comp_index     ON index_components(index_name);
CREATE INDEX idx_index_comp_stock     ON index_components(stock_id);
CREATE INDEX idx_index_comp_active    ON index_components(index_name) WHERE removed_date IS NULL;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stocks_master_updated_at
  BEFORE UPDATE ON stocks_master
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEARCH FUNCTION
-- Fuzzy search across symbol, name, aliases
-- ============================================================

CREATE OR REPLACE FUNCTION search_stocks(search_query TEXT, result_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id            UUID,
  symbol        TEXT,
  company_name  TEXT,
  bse_code      TEXT,
  exchange      exchange_type,
  status        stock_status,
  market_cap    DECIMAL,
  current_price DECIMAL,
  market_cap_category market_cap_category,
  similarity    REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (s.id)
    s.id,
    s.symbol,
    s.company_name,
    s.bse_code,
    s.exchange,
    s.status,
    s.market_cap,
    s.current_price,
    s.market_cap_category,
    GREATEST(
      similarity(s.symbol, search_query),
      similarity(s.company_name, search_query)
    ) AS sim
  FROM stocks_master s
  LEFT JOIN stock_aliases sa ON sa.stock_id = s.id
  WHERE
    s.status = 'ACTIVE'
    AND (
      s.symbol % search_query
      OR s.company_name % search_query
      OR sa.alias % search_query
      OR s.symbol ILIKE search_query || '%'
      OR s.company_name ILIKE '%' || search_query || '%'
    )
  ORDER BY s.id, sim DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SEED: SECTORS
-- ============================================================

INSERT INTO sectors (name, display_name) VALUES
  ('financial_services',    'Financial Services'),
  ('information_technology', 'Information Technology'),
  ('oil_gas',               'Oil & Gas'),
  ('consumer_goods',        'Consumer Goods'),
  ('automobile',            'Automobile'),
  ('pharma',                'Pharmaceuticals'),
  ('metals_mining',         'Metals & Mining'),
  ('infrastructure',        'Infrastructure'),
  ('telecom',               'Telecom'),
  ('power',                 'Power & Energy'),
  ('realty',                'Realty'),
  ('fmcg',                  'FMCG'),
  ('chemicals',             'Chemicals'),
  ('media',                 'Media & Entertainment'),
  ('healthcare',            'Healthcare'),
  ('agriculture',           'Agriculture'),
  ('textile',               'Textile'),
  ('cement',                'Cement'),
  ('aviation',              'Aviation'),
  ('retail',                'Retail');

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE stocks_master     ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_aliases      ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_actions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE index_components   ENABLE ROW LEVEL SECURITY;

-- Public read access for all stocks data
CREATE POLICY "Public read stocks"
  ON stocks_master FOR SELECT USING (true);

CREATE POLICY "Public read aliases"
  ON stock_aliases FOR SELECT USING (true);

CREATE POLICY "Public read corporate actions"
  ON corporate_actions FOR SELECT USING (true);

CREATE POLICY "Public read index components"
  ON index_components FOR SELECT USING (true);

-- Only service role can write
CREATE POLICY "Service role write stocks"
  ON stocks_master FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role write aliases"
  ON stock_aliases FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE stocks_master     IS 'Master list of all NSE/BSE listed stocks';
COMMENT ON TABLE stock_aliases     IS 'Alternative names/search terms for stocks';
COMMENT ON TABLE corporate_actions IS 'Splits, bonuses, dividends, mergers history';
COMMENT ON TABLE index_components  IS 'Track which stocks belong to which indices';
COMMENT ON TABLE management_history IS 'CEO/MD/CFO change history';

COMMENT ON COLUMN stocks_master.kite_instrument_token IS 'Zerodha Kite API instrument token for live data';
COMMENT ON COLUMN stocks_master.indices IS 'Array of index memberships - NIFTY50, BANKNIFTY etc';
COMMENT ON COLUMN stocks_master.market_cap IS 'Market cap in Indian Crores';

-- Migration: 002_price_history.sql
-- 002_price_history.sql migration
-- ============================================================
-- FILE: supabase/migrations/002_price_history.sql
-- DESC: Daily OHLCV price history for all stocks
--       Handles adjusted prices (splits/bonuses)
-- ============================================================

-- ============================================================
-- MAIN PRICE HISTORY TABLE
-- Partitioned by year for performance
-- ============================================================

CREATE TABLE price_history (
  id              BIGSERIAL,
  stock_id        UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,              -- Denormalized for fast queries
  trade_date      DATE NOT NULL,

  -- OHLCV Data
  open            DECIMAL(12,2) NOT NULL,
  high            DECIMAL(12,2) NOT NULL,
  low             DECIMAL(12,2) NOT NULL,
  close           DECIMAL(12,2) NOT NULL,
  volume          BIGINT NOT NULL DEFAULT 0,
  turnover        DECIMAL(20,2),              -- In crores

  -- Adjusted Prices (adjusted for splits/bonuses)
  adj_open        DECIMAL(12,2),
  adj_high        DECIMAL(12,2),
  adj_low         DECIMAL(12,2),
  adj_close       DECIMAL(12,2),
  adj_factor      DECIMAL(10,6) DEFAULT 1.0, -- Adjustment factor applied

  -- Delivery Data (from NSE)
  delivery_qty    BIGINT,
  delivery_pct    DECIMAL(6,2),              -- Delivery % of volume

  -- Market Stats
  vwap            DECIMAL(12,2),             -- Volume weighted avg price
  trades_count    INTEGER,                   -- Number of trades
  upper_circuit   DECIMAL(12,2),             -- Upper circuit limit
  lower_circuit   DECIMAL(12,2),             -- Lower circuit limit

  -- Calculated Fields (pre-computed for screener speed)
  prev_close      DECIMAL(12,2),             -- Previous day close
  change          DECIMAL(12,2),             -- Price change
  change_pct      DECIMAL(7,4),              -- % change

  -- 52 Week (updated daily)
  week52_high     DECIMAL(12,2),
  week52_low      DECIMAL(12,2),

  -- Data Source
  source          TEXT DEFAULT 'NSE',        -- NSE, BSE, ZERODHA

  created_at      TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (id, trade_date),
  UNIQUE(stock_id, trade_date)
) PARTITION BY RANGE (trade_date);

-- ============================================================
-- CREATE PARTITIONS BY YEAR
-- ============================================================

-- Historical data partitions
CREATE TABLE price_history_1980_1989
  PARTITION OF price_history
  FOR VALUES FROM ('1980-01-01') TO ('1990-01-01');

CREATE TABLE price_history_1990_1999
  PARTITION OF price_history
  FOR VALUES FROM ('1990-01-01') TO ('2000-01-01');

CREATE TABLE price_history_2000_2009
  PARTITION OF price_history
  FOR VALUES FROM ('2000-01-01') TO ('2010-01-01');

CREATE TABLE price_history_2010_2014
  PARTITION OF price_history
  FOR VALUES FROM ('2010-01-01') TO ('2015-01-01');

CREATE TABLE price_history_2015_2019
  PARTITION OF price_history
  FOR VALUES FROM ('2015-01-01') TO ('2020-01-01');

CREATE TABLE price_history_2020_2022
  PARTITION OF price_history
  FOR VALUES FROM ('2020-01-01') TO ('2023-01-01');

CREATE TABLE price_history_2023
  PARTITION OF price_history
  FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE price_history_2024
  PARTITION OF price_history
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE price_history_2025
  PARTITION OF price_history
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE price_history_future
  PARTITION OF price_history
  FOR VALUES FROM ('2026-01-01') TO ('2100-01-01');

-- ============================================================
-- INTRADAY DATA (Last 30 days only - live market)
-- ============================================================

CREATE TABLE price_intraday (
  id          BIGSERIAL PRIMARY KEY,
  stock_id    UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  symbol      TEXT NOT NULL,
  timestamp   TIMESTAMPTZ NOT NULL,
  interval    TEXT NOT NULL DEFAULT '1min',  -- 1min, 5min, 15min, 1hour

  open        DECIMAL(12,2) NOT NULL,
  high        DECIMAL(12,2) NOT NULL,
  low         DECIMAL(12,2) NOT NULL,
  close       DECIMAL(12,2) NOT NULL,
  volume      BIGINT NOT NULL DEFAULT 0,
  vwap        DECIMAL(12,2),

  created_at  TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, timestamp, interval)
);

-- Auto-delete old intraday data (keep only 30 days)
CREATE INDEX idx_intraday_timestamp ON price_intraday(timestamp DESC);
CREATE INDEX idx_intraday_stock     ON price_intraday(stock_id, timestamp DESC);

-- ============================================================
-- LIVE QUOTES CACHE (Updated every second during market hours)
-- ============================================================

CREATE TABLE live_quotes (
  stock_id        UUID PRIMARY KEY REFERENCES stocks_master(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,

  ltp             DECIMAL(12,2),              -- Last traded price
  open            DECIMAL(12,2),
  high            DECIMAL(12,2),
  low             DECIMAL(12,2),
  prev_close      DECIMAL(12,2),
  change          DECIMAL(12,2),
  change_pct      DECIMAL(7,4),

  volume          BIGINT DEFAULT 0,
  buy_qty         BIGINT DEFAULT 0,
  sell_qty        BIGINT DEFAULT 0,

  upper_circuit   DECIMAL(12,2),
  lower_circuit   DECIMAL(12,2),

  market_cap      DECIMAL(20,2),

  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MARKET HOLIDAYS
-- ============================================================

CREATE TABLE market_holidays (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_date  DATE NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  exchange      TEXT DEFAULT 'NSE',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed common holidays (2024-2025)
INSERT INTO market_holidays (holiday_date, description) VALUES
  ('2024-01-26', 'Republic Day'),
  ('2024-03-25', 'Holi'),
  ('2024-04-14', 'Dr. Ambedkar Jayanti'),
  ('2024-04-17', 'Ram Navami'),
  ('2024-05-23', 'Buddha Purnima'),
  ('2024-06-17', 'Bakri Id'),
  ('2024-07-17', 'Muharram'),
  ('2024-08-15', 'Independence Day'),
  ('2024-10-02', 'Gandhi Jayanti'),
  ('2024-11-01', 'Diwali Laxmi Puja'),
  ('2024-11-15', 'Gurunanak Jayanti'),
  ('2024-12-25', 'Christmas'),
  ('2025-01-26', 'Republic Day'),
  ('2025-02-26', 'Maha Shivratri'),
  ('2025-03-14', 'Holi'),
  ('2025-04-10', 'Ram Navami'),
  ('2025-04-14', 'Dr. Ambedkar Jayanti'),
  ('2025-04-18', 'Good Friday'),
  ('2025-08-15', 'Independence Day'),
  ('2025-08-27', 'Ganesh Chaturthi'),
  ('2025-10-02', 'Gandhi Jayanti'),
  ('2025-10-20', 'Diwali Laxmi Puja'),
  ('2025-11-05', 'Gurunanak Jayanti'),
  ('2025-12-25', 'Christmas');

-- ============================================================
-- MARKET SESSIONS
-- Track market open/close status
-- ============================================================

CREATE TABLE market_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date  DATE NOT NULL UNIQUE,
  is_trading    BOOLEAN DEFAULT TRUE,
  pre_open_start  TIME DEFAULT '09:00:00',
  market_open     TIME DEFAULT '09:15:00',
  market_close    TIME DEFAULT '15:30:00',
  post_close      TIME DEFAULT '16:00:00',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Most critical - used by screener and charts
CREATE INDEX idx_price_stock_date    ON price_history(stock_id, trade_date DESC);
CREATE INDEX idx_price_symbol_date   ON price_history(symbol, trade_date DESC);
CREATE INDEX idx_price_date          ON price_history(trade_date DESC);
CREATE INDEX idx_price_change_pct    ON price_history(change_pct);
CREATE INDEX idx_price_volume        ON price_history(volume DESC);

-- For screener filters on specific dates
CREATE INDEX idx_price_screener ON price_history(trade_date, change_pct, volume, close);

-- Live quotes
CREATE INDEX idx_live_symbol ON live_quotes(symbol);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get last N days of price data for a stock
CREATE OR REPLACE FUNCTION get_price_history(
  p_symbol    TEXT,
  p_days      INTEGER DEFAULT 365,
  p_adjusted  BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
  trade_date  DATE,
  open        DECIMAL,
  high        DECIMAL,
  low         DECIMAL,
  close       DECIMAL,
  volume      BIGINT,
  change_pct  DECIMAL,
  vwap        DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ph.trade_date,
    CASE WHEN p_adjusted THEN ph.adj_open  ELSE ph.open  END,
    CASE WHEN p_adjusted THEN ph.adj_high  ELSE ph.high  END,
    CASE WHEN p_adjusted THEN ph.adj_low   ELSE ph.low   END,
    CASE WHEN p_adjusted THEN ph.adj_close ELSE ph.close END,
    ph.volume,
    ph.change_pct,
    ph.vwap
  FROM price_history ph
  JOIN stocks_master sm ON sm.id = ph.stock_id
  WHERE sm.symbol = p_symbol
  ORDER BY ph.trade_date DESC
  LIMIT p_days;
END;
$$ LANGUAGE plpgsql;

-- Check if market is currently open
CREATE OR REPLACE FUNCTION is_market_open()
RETURNS BOOLEAN AS $$
DECLARE
  current_time_ist TIME;
  current_date_ist DATE;
  is_holiday BOOLEAN;
BEGIN
  -- IST = UTC + 5:30
  current_time_ist := (NOW() AT TIME ZONE 'Asia/Kolkata')::TIME;
  current_date_ist := (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE;

  -- Check if holiday
  SELECT EXISTS(
    SELECT 1 FROM market_holidays
    WHERE holiday_date = current_date_ist
  ) INTO is_holiday;

  -- Check if weekend
  IF EXTRACT(DOW FROM current_date_ist) IN (0, 6) THEN
    RETURN FALSE;
  END IF;

  IF is_holiday THEN
    RETURN FALSE;
  END IF;

  -- Market hours: 9:15 AM to 3:30 PM IST
  RETURN current_time_ist BETWEEN '09:15:00' AND '15:30:00';
END;
$$ LANGUAGE plpgsql;

-- Get volume surge (current vs avg)
CREATE OR REPLACE FUNCTION get_volume_surge(
  p_symbol TEXT,
  p_days_avg INTEGER DEFAULT 20
)
RETURNS DECIMAL AS $$
DECLARE
  avg_vol DECIMAL;
  today_vol BIGINT;
BEGIN
  SELECT AVG(volume) INTO avg_vol
  FROM (
    SELECT volume FROM price_history ph
    JOIN stocks_master sm ON sm.id = ph.stock_id
    WHERE sm.symbol = p_symbol
    ORDER BY ph.trade_date DESC
    LIMIT p_days_avg
  ) t;

  SELECT volume INTO today_vol
  FROM price_history ph
  JOIN stocks_master sm ON sm.id = ph.stock_id
  WHERE sm.symbol = p_symbol
  ORDER BY ph.trade_date DESC
  LIMIT 1;

  IF avg_vol = 0 THEN RETURN 0; END IF;
  RETURN ROUND((today_vol::DECIMAL / avg_vol) * 100, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE price_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_intraday ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_quotes    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read price history"
  ON price_history FOR SELECT USING (true);

CREATE POLICY "Public read intraday"
  ON price_intraday FOR SELECT USING (true);

CREATE POLICY "Public read live quotes"
  ON live_quotes FOR SELECT USING (true);

CREATE POLICY "Service role write price history"
  ON price_history FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role write intraday"
  ON price_intraday FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role write live quotes"
  ON live_quotes FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE price_history  IS 'Daily OHLCV data, partitioned by year for performance';
COMMENT ON TABLE price_intraday IS 'Intraday candles - auto-purged after 30 days';
COMMENT ON TABLE live_quotes    IS 'Real-time quote cache - updated by Zerodha WebSocket';
COMMENT ON COLUMN price_history.adj_close   IS 'Adjusted close price accounting for splits and bonuses';
COMMENT ON COLUMN price_history.adj_factor  IS 'Cumulative adjustment factor applied to prices';
COMMENT ON COLUMN price_history.delivery_pct IS 'Delivery percentage - higher = more conviction';

-- Migration: 003_fundamentals.sql
-- ============================================================
-- FILE: supabase/migrations/003_fundamentals.sql
-- DESC: Quarterly & Annual financial fundamentals
--       P&L, Balance Sheet, Cash Flow, Ratios
-- ============================================================

CREATE TYPE period_type AS ENUM ('QUARTERLY', 'ANNUAL', 'TTM');
CREATE TYPE result_type AS ENUM ('STANDALONE', 'CONSOLIDATED');

-- ============================================================
-- FINANCIAL RESULTS (P&L)
-- ============================================================

CREATE TABLE financial_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id          UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,

  -- Period
  period_type       period_type NOT NULL,
  result_type       result_type DEFAULT 'CONSOLIDATED',
  period_end        DATE NOT NULL,              -- Quarter/Year end date
  period_label      TEXT NOT NULL,              -- "Q3 FY25", "FY2024"

  -- Revenue
  revenue           DECIMAL(20,2),              -- Total revenue (crores)
  revenue_growth    DECIMAL(8,4),               -- YoY % growth

  -- Profitability
  gross_profit      DECIMAL(20,2),
  gross_margin      DECIMAL(8,4),               -- %
  ebitda            DECIMAL(20,2),
  ebitda_margin     DECIMAL(8,4),               -- %
  ebit              DECIMAL(20,2),
  ebit_margin       DECIMAL(8,4),
  pbt               DECIMAL(20,2),              -- Profit before tax
  tax               DECIMAL(20,2),
  pat               DECIMAL(20,2),              -- Profit after tax (Net profit)
  pat_growth        DECIMAL(8,4),               -- YoY % growth
  net_margin        DECIMAL(8,4),               -- %

  -- EPS
  eps_basic         DECIMAL(12,4),              -- Basic EPS
  eps_diluted       DECIMAL(12,4),              -- Diluted EPS
  eps_growth        DECIMAL(8,4),               -- YoY % growth

  -- Expenses breakdown
  raw_material_cost DECIMAL(20,2),
  employee_cost     DECIMAL(20,2),
  other_expenses    DECIMAL(20,2),
  depreciation      DECIMAL(20,2),
  interest          DECIMAL(20,2),
  exceptional_items DECIMAL(20,2) DEFAULT 0,

  -- BSE/NSE Filing reference
  bse_filing_id     TEXT,
  filing_date       DATE,
  source_url        TEXT,

  -- Beat/Miss vs estimate
  consensus_revenue_est DECIMAL(20,2),
  consensus_pat_est     DECIMAL(20,2),
  revenue_beat_miss     DECIMAL(8,4),           -- % vs estimate
  pat_beat_miss         DECIMAL(8,4),

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, period_type, result_type, period_end)
);

-- ============================================================
-- BALANCE SHEET
-- ============================================================

CREATE TABLE balance_sheet (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id          UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,

  period_end        DATE NOT NULL,
  result_type       result_type DEFAULT 'CONSOLIDATED',
  period_label      TEXT NOT NULL,

  -- Assets
  total_assets      DECIMAL(20,2),
  current_assets    DECIMAL(20,2),
  cash_equivalents  DECIMAL(20,2),
  receivables       DECIMAL(20,2),
  inventory         DECIMAL(20,2),
  fixed_assets      DECIMAL(20,2),             -- Net block
  investments       DECIMAL(20,2),             -- Long-term investments
  goodwill          DECIMAL(20,2),

  -- Liabilities
  total_liabilities   DECIMAL(20,2),
  current_liabilities DECIMAL(20,2),
  short_term_debt     DECIMAL(20,2),
  long_term_debt      DECIMAL(20,2),
  total_debt          DECIMAL(20,2),
  accounts_payable    DECIMAL(20,2),

  -- Equity
  total_equity        DECIMAL(20,2),
  share_capital       DECIMAL(20,2),
  reserves            DECIMAL(20,2),
  book_value_per_share DECIMAL(12,4),

  -- Derived ratios
  debt_to_equity      DECIMAL(8,4),
  current_ratio       DECIMAL(8,4),
  quick_ratio         DECIMAL(8,4),

  source_url          TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, period_end, result_type)
);

-- ============================================================
-- CASH FLOW
-- ============================================================

CREATE TABLE cash_flow (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id              UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,

  period_end            DATE NOT NULL,
  result_type           result_type DEFAULT 'CONSOLIDATED',
  period_label          TEXT NOT NULL,

  -- Operating
  cfo                   DECIMAL(20,2),         -- Cash from operations
  net_income            DECIMAL(20,2),
  depreciation_amort    DECIMAL(20,2),
  working_capital_change DECIMAL(20,2),

  -- Investing
  cfi                   DECIMAL(20,2),         -- Cash from investing
  capex                 DECIMAL(20,2),         -- Capital expenditure
  acquisitions          DECIMAL(20,2),
  investments_sold      DECIMAL(20,2),

  -- Financing
  cff                   DECIMAL(20,2),         -- Cash from financing
  debt_raised           DECIMAL(20,2),
  debt_repaid           DECIMAL(20,2),
  dividends_paid        DECIMAL(20,2),
  buyback               DECIMAL(20,2),

  -- Net
  net_cash_flow         DECIMAL(20,2),
  free_cash_flow        DECIMAL(20,2),         -- CFO - Capex

  source_url            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, period_end, result_type)
);

-- ============================================================
-- KEY RATIOS (Pre-computed daily)
-- ============================================================

CREATE TABLE key_ratios (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id          UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  calculated_on     DATE NOT NULL,

  -- Valuation
  pe_ratio          DECIMAL(10,4),             -- Price to Earnings
  pb_ratio          DECIMAL(10,4),             -- Price to Book
  ps_ratio          DECIMAL(10,4),             -- Price to Sales
  ev_ebitda         DECIMAL(10,4),             -- EV/EBITDA
  market_cap        DECIMAL(20,2),
  enterprise_value  DECIMAL(20,2),

  -- Profitability
  roe               DECIMAL(8,4),              -- Return on equity %
  roa               DECIMAL(8,4),              -- Return on assets %
  roce              DECIMAL(8,4),              -- Return on capital employed %
  gross_margin      DECIMAL(8,4),
  net_margin        DECIMAL(8,4),
  ebitda_margin     DECIMAL(8,4),

  -- Growth (YoY)
  revenue_growth_1y  DECIMAL(8,4),
  revenue_growth_3y  DECIMAL(8,4),             -- 3yr CAGR
  profit_growth_1y   DECIMAL(8,4),
  profit_growth_3y   DECIMAL(8,4),
  eps_growth_1y      DECIMAL(8,4),

  -- Efficiency
  asset_turnover    DECIMAL(8,4),
  inventory_days    DECIMAL(8,4),
  receivables_days  DECIMAL(8,4),
  payables_days     DECIMAL(8,4),

  -- Debt & Liquidity
  debt_to_equity    DECIMAL(8,4),
  interest_coverage DECIMAL(8,4),
  current_ratio     DECIMAL(8,4),

  -- Per Share
  eps_ttm           DECIMAL(12,4),
  book_value        DECIMAL(12,4),
  revenue_per_share DECIMAL(12,4),
  fcf_per_share     DECIMAL(12,4),
  dividend_per_share DECIMAL(12,4),
  dividend_yield    DECIMAL(8,4),              -- %

  -- Piotroski Score (1-9, higher = better quality)
  piotroski_score   INTEGER,

  created_at        TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, calculated_on)
);

-- ============================================================
-- SHAREHOLDING PATTERN (Quarterly)
-- ============================================================

CREATE TABLE shareholding_pattern (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id              UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  period_end            DATE NOT NULL,

  promoter_pct          DECIMAL(6,4),
  promoter_pledge_pct   DECIMAL(6,4),          -- % of promoter shares pledged
  fii_pct               DECIMAL(6,4),          -- Foreign institutional
  dii_pct               DECIMAL(6,4),          -- Domestic institutional
  mf_pct                DECIMAL(6,4),          -- Mutual funds
  retail_pct            DECIMAL(6,4),          -- Public/Retail
  govt_pct              DECIMAL(6,4),

  -- QoQ Change
  promoter_change       DECIMAL(6,4),          -- vs last quarter
  fii_change            DECIMAL(6,4),

  source_url            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, period_end)
);

-- ============================================================
-- RESULTS CALENDAR (Upcoming announcements)
-- ============================================================

CREATE TABLE results_calendar (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id          UUID NOT NULL REFERENCES stocks_master(id) ON DELETE CASCADE,
  symbol            TEXT NOT NULL,

  result_date       DATE NOT NULL,
  period_label      TEXT NOT NULL,             -- "Q3 FY25"
  result_type       result_type DEFAULT 'CONSOLIDATED',

  -- Status
  is_announced      BOOLEAN DEFAULT FALSE,
  is_confirmed_date BOOLEAN DEFAULT FALSE,     -- Or estimated date

  -- Estimates (consensus)
  est_revenue       DECIMAL(20,2),
  est_pat           DECIMAL(20,2),
  est_eps           DECIMAL(12,4),

  -- Board meeting details
  board_meeting_date DATE,
  agenda            TEXT,

  source_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(stock_id, period_label)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Financial results
CREATE INDEX idx_fin_results_stock   ON financial_results(stock_id, period_end DESC);
CREATE INDEX idx_fin_results_date    ON financial_results(period_end DESC);
CREATE INDEX idx_fin_results_period  ON financial_results(period_type, period_end DESC);

-- Key ratios - most used by screener
CREATE INDEX idx_ratios_stock        ON key_ratios(stock_id, calculated_on DESC);
CREATE INDEX idx_ratios_date         ON key_ratios(calculated_on DESC);
CREATE INDEX idx_ratios_pe           ON key_ratios(pe_ratio);
CREATE INDEX idx_ratios_roe          ON key_ratios(roe DESC);

-- Shareholding
CREATE INDEX idx_shareholding_stock  ON shareholding_pattern(stock_id, period_end DESC);
CREATE INDEX idx_shareholding_pledge ON shareholding_pattern(promoter_pledge_pct DESC);

-- Results calendar
CREATE INDEX idx_results_cal_date    ON results_calendar(result_date);
CREATE INDEX idx_results_cal_stock   ON results_calendar(stock_id);
CREATE INDEX idx_results_upcoming    ON results_calendar(result_date)
  WHERE is_announced = FALSE;

-- Balance sheet & cash flow
CREATE INDEX idx_bs_stock_period     ON balance_sheet(stock_id, period_end DESC);
CREATE INDEX idx_cf_stock_period     ON cash_flow(stock_id, period_end DESC);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER financial_results_updated_at
  BEFORE UPDATE ON financial_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER results_calendar_updated_at
  BEFORE UPDATE ON results_calendar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Latest ratios for each stock (for screener)
CREATE VIEW latest_ratios AS
SELECT DISTINCT ON (stock_id)
  kr.*,
  sm.symbol,
  sm.company_name,
  sm.market_cap_category,
  sm.sector_id
FROM key_ratios kr
JOIN stocks_master sm ON sm.id = kr.stock_id
ORDER BY stock_id, calculated_on DESC;

-- Latest quarterly results
CREATE VIEW latest_quarterly_results AS
SELECT DISTINCT ON (stock_id)
  fr.*,
  sm.symbol,
  sm.company_name
FROM financial_results fr
JOIN stocks_master sm ON sm.id = fr.stock_id
WHERE fr.period_type = 'QUARTERLY'
ORDER BY stock_id, period_end DESC;

-- Upcoming results in next 30 days
CREATE VIEW upcoming_results AS
SELECT
  rc.*,
  sm.company_name,
  sm.market_cap_category,
  lq.ltp AS current_price
FROM results_calendar rc
JOIN stocks_master sm ON sm.id = rc.stock_id
LEFT JOIN live_quotes lq ON lq.stock_id = rc.stock_id
WHERE rc.result_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  AND rc.is_announced = FALSE
ORDER BY rc.result_date;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE financial_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_sheet         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow             ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_ratios            ENABLE ROW LEVEL SECURITY;
ALTER TABLE shareholding_pattern  ENABLE ROW LEVEL SECURITY;
ALTER TABLE results_calendar      ENABLE ROW LEVEL SECURITY;

-- Public read all fundamentals
DO $$ DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'financial_results', 'balance_sheet', 'cash_flow',
    'key_ratios', 'shareholding_pattern', 'results_calendar'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY "Public read %I" ON %I FOR SELECT USING (true)', t, t
    );
    EXECUTE format(
      'CREATE POLICY "Service write %I" ON %I FOR ALL USING (auth.role() = ''service_role'')', t, t
    );
  END LOOP;
END $$;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE financial_results    IS 'Quarterly and annual P&L data from BSE/NSE filings';
COMMENT ON TABLE balance_sheet        IS 'Balance sheet data - assets, liabilities, equity';
COMMENT ON TABLE cash_flow            IS 'Cash flow statement - operating, investing, financing';
COMMENT ON TABLE key_ratios           IS 'Pre-computed financial ratios updated daily for screener performance';
COMMENT ON TABLE shareholding_pattern IS 'Quarterly promoter/FII/DII shareholding data';
COMMENT ON TABLE results_calendar     IS 'Upcoming quarterly result dates and estimates';
COMMENT ON COLUMN key_ratios.piotroski_score IS '9-point quality score: >7 strong, <3 weak';
COMMENT ON COLUMN shareholding_pattern.promoter_pledge_pct IS 'High pledge % = risk signal for manipulation';
-- 003_fundamentals.sql migration


-- Migration: 004_news_filings.sql
-- ============================================================
-- FILE: supabase/migrations/004_news_filings.sql
-- DESC: News, BSE/NSE announcements, SEBI filings
-- ============================================================

CREATE TYPE news_category AS ENUM (
  'RESULT', 'ANNOUNCEMENT', 'SEBI_ORDER', 'DIVIDEND',
  'MERGER', 'BUYBACK', 'GENERAL', 'IPO', 'RIGHTS'
);
CREATE TYPE sentiment_type AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');
CREATE TYPE filing_type AS ENUM ('BSE', 'NSE', 'SEBI', 'MCA');

-- ============================================================
-- NEWS ARTICLES
-- ============================================================

CREATE TABLE news_articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  summary       TEXT,
  content       TEXT,
  source        TEXT NOT NULL,
  source_url    TEXT NOT NULL,
  category      news_category DEFAULT 'GENERAL',
  sentiment     sentiment_type DEFAULT 'NEUTRAL',
  stock_symbols TEXT[] DEFAULT '{}',
  is_sebi       BOOLEAN DEFAULT FALSE,
  published_at  TIMESTAMPTZ NOT NULL,
  fetched_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BSE/NSE FILINGS
-- ============================================================

CREATE TABLE stock_filings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id      UUID REFERENCES stocks_master(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  filing_type   filing_type NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  filing_date   TIMESTAMPTZ NOT NULL,
  pdf_url       TEXT,
  source_url    TEXT,
  bse_scrip_id  TEXT,
  category      news_category DEFAULT 'ANNOUNCEMENT',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEBI ORDERS & CIRCULARS
-- ============================================================

CREATE TABLE sebi_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type    TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  order_date    DATE NOT NULL,
  stock_symbols TEXT[] DEFAULT '{}',
  pdf_url       TEXT,
  source_url    TEXT NOT NULL,
  is_penalty    BOOLEAN DEFAULT FALSE,
  penalty_amount DECIMAL(20,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_news_published    ON news_articles(published_at DESC);
CREATE INDEX idx_news_symbols      ON news_articles USING GIN(stock_symbols);
CREATE INDEX idx_news_category     ON news_articles(category);
CREATE INDEX idx_filings_stock     ON stock_filings(stock_id, filing_date DESC);
CREATE INDEX idx_filings_symbol    ON stock_filings(symbol, filing_date DESC);
CREATE INDEX idx_sebi_date         ON sebi_orders(order_date DESC);
CREATE INDEX idx_sebi_symbols      ON sebi_orders USING GIN(stock_symbols);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE news_articles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_filings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sebi_orders    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read news"    ON news_articles  FOR SELECT USING (true);
CREATE POLICY "Public read filings" ON stock_filings  FOR SELECT USING (true);
CREATE POLICY "Public read sebi"    ON sebi_orders    FOR SELECT USING (true);
CREATE POLICY "Service write news"  ON news_articles  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write filings" ON stock_filings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write sebi"  ON sebi_orders    FOR ALL USING (auth.role() = 'service_role');

-- Migration: 005_screener.sql
-- ============================================================
-- FILE: supabase/migrations/005_screener.sql
-- DESC: Screener filters, saved screens, results cache
-- ============================================================

CREATE TYPE filter_operator AS ENUM (
  'gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'between', 'in'
);
CREATE TYPE filter_logic AS ENUM ('AND', 'OR');

-- ============================================================
-- SCREENER FILTERS (Saved Screens)
-- ============================================================

CREATE TABLE screener_filters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  is_public     BOOLEAN DEFAULT FALSE,
  conditions    JSONB NOT NULL DEFAULT '[]',
  -- [{field, operator, value, value2, label}]
  logic         filter_logic DEFAULT 'AND',
  index_filter  TEXT[],          -- Filter by NIFTY50, BANKNIFTY etc
  sector_filter TEXT[],          -- Filter by sector
  last_run_at   TIMESTAMPTZ,
  last_result_count INTEGER,
  run_count     INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCREENER RESULTS CACHE (15 min TTL)
-- ============================================================

CREATE TABLE screener_results_cache (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_hash   TEXT NOT NULL UNIQUE,  -- MD5 of conditions JSON
  results       JSONB NOT NULL,        -- Array of matching stocks
  result_count  INTEGER DEFAULT 0,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCREENER FIELDS REGISTRY
-- All available filter fields
-- ============================================================

CREATE TABLE screener_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_key   TEXT NOT NULL UNIQUE,   -- e.g. 'rsi_14', 'pe_ratio'
  label       TEXT NOT NULL,          -- Display name
  category    TEXT NOT NULL,          -- technical/fundamental/volume/price
  data_type   TEXT NOT NULL,          -- number/percentage/boolean
  min_value   DECIMAL,
  max_value   DECIMAL,
  unit        TEXT,                   -- %, x, days
  description TEXT,
  is_active   BOOLEAN DEFAULT TRUE
);

-- Seed screener fields
INSERT INTO screener_fields (field_key, label, category, data_type, unit, description) VALUES
  -- Price
  ('close',           'Current Price',        'price',       'number',     '₹',  'Last closing price'),
  ('change_pct',      'Day Change %',         'price',       'percentage', '%',  'Daily price change'),
  ('week52_high',     '52 Week High',         'price',       'number',     '₹',  '52 week highest price'),
  ('week52_low',      '52 Week Low',          'price',       'number',     '₹',  '52 week lowest price'),
  ('near_52w_high',   'Near 52W High %',      'price',       'percentage', '%',  'How close to 52W high'),
  -- Volume
  ('volume',          'Volume',               'volume',      'number',     '',   'Today volume'),
  ('volume_surge',    'Volume Surge %',       'volume',      'percentage', '%',  'Volume vs 20D avg'),
  ('delivery_pct',    'Delivery %',           'volume',      'percentage', '%',  'Delivery % of volume'),
  ('avg_volume_20d',  'Avg Volume 20D',       'volume',      'number',     '',   '20 day average volume'),
  -- Technical
  ('rsi_14',          'RSI (14)',             'technical',   'number',     '',   'Relative Strength Index'),
  ('macd_signal',     'MACD Signal',         'technical',   'number',     '',   'MACD vs Signal line'),
  ('sma_20',          'SMA 20',              'technical',   'number',     '₹',  '20 day simple moving avg'),
  ('sma_50',          'SMA 50',              'technical',   'number',     '₹',  '50 day simple moving avg'),
  ('sma_200',         'SMA 200',             'technical',   'number',     '₹',  '200 day simple moving avg'),
  ('above_sma_20',    'Above SMA 20',        'technical',   'boolean',    '',   'Price above 20D SMA'),
  ('above_sma_50',    'Above SMA 50',        'technical',   'boolean',    '',   'Price above 50D SMA'),
  ('above_sma_200',   'Above SMA 200',       'technical',   'boolean',    '',   'Price above 200D SMA'),
  ('atr_14',          'ATR (14)',             'technical',   'number',     '₹',  'Average True Range'),
  ('bb_upper',        'Bollinger Upper',     'technical',   'number',     '₹',  'Upper Bollinger Band'),
  ('bb_lower',        'Bollinger Lower',     'technical',   'number',     '₹',  'Lower Bollinger Band'),
  -- Fundamental
  ('pe_ratio',        'P/E Ratio',           'fundamental', 'number',     'x',  'Price to Earnings'),
  ('pb_ratio',        'P/B Ratio',           'fundamental', 'number',     'x',  'Price to Book'),
  ('roe',             'ROE %',               'fundamental', 'percentage', '%',  'Return on Equity'),
  ('roce',            'ROCE %',              'fundamental', 'percentage', '%',  'Return on Capital Employed'),
  ('debt_to_equity',  'Debt to Equity',      'fundamental', 'number',     'x',  'Total Debt / Equity'),
  ('revenue_growth',  'Revenue Growth %',    'fundamental', 'percentage', '%',  'YoY revenue growth'),
  ('profit_growth',   'Profit Growth %',     'fundamental', 'percentage', '%',  'YoY profit growth'),
  ('net_margin',      'Net Margin %',        'fundamental', 'percentage', '%',  'Net profit margin'),
  ('dividend_yield',  'Dividend Yield %',    'fundamental', 'percentage', '%',  'Annual dividend yield'),
  ('market_cap',      'Market Cap (Cr)',     'fundamental', 'number',     'Cr', 'Market capitalisation'),
  ('promoter_holding','Promoter Holding %',  'fundamental', 'percentage', '%',  'Promoter shareholding'),
  ('promoter_pledge', 'Promoter Pledge %',   'fundamental', 'percentage', '%',  'Pledged promoter shares'),
  ('piotroski_score', 'Piotroski Score',     'fundamental', 'number',     '',   'Quality score 1-9');

-- ============================================================
-- USER SCAN USAGE TRACKING
-- ============================================================

CREATE TABLE user_scan_usage (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  scan_count  INTEGER DEFAULT 0,
  UNIQUE(user_id, scan_date)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_screener_user     ON screener_filters(user_id);
CREATE INDEX idx_screener_public   ON screener_filters(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_cache_hash        ON screener_results_cache(filter_hash);
CREATE INDEX idx_cache_expires     ON screener_results_cache(expires_at);
CREATE INDEX idx_scan_usage_user   ON user_scan_usage(user_id, scan_date);

-- Auto cleanup expired cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM screener_results_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE screener_filters       ENABLE ROW LEVEL SECURITY;
ALTER TABLE screener_results_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scan_usage        ENABLE ROW LEVEL SECURITY;
ALTER TABLE screener_fields        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own screens"
  ON screener_filters FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public read public screens"
  ON screener_filters FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Public read fields"
  ON screener_fields FOR SELECT USING (true);

CREATE POLICY "Public read cache"
  ON screener_results_cache FOR SELECT USING (true);

CREATE POLICY "Service write cache"
  ON screener_results_cache FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users read own usage"
  ON user_scan_usage FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service write usage"
  ON user_scan_usage FOR ALL USING (auth.role() = 'service_role');

-- Migration: 006_predictions.sql
-- ============================================================
-- FILE: supabase/migrations/006_predictions.sql
-- DESC: AI predictions, accuracy tracking
-- ============================================================

CREATE TYPE prediction_direction AS ENUM ('UP', 'DOWN', 'NEUTRAL');

-- ============================================================
-- DAILY AI PREDICTIONS
-- ============================================================

CREATE TABLE ai_predictions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_date     DATE NOT NULL,
  symbol              TEXT NOT NULL,
  stock_id            UUID REFERENCES stocks_master(id),

  -- Scores (0-10)
  technical_score     DECIMAL(4,2),
  fundamental_score   DECIMAL(4,2),
  sentiment_score     DECIMAL(4,2),
  volume_score        DECIMAL(4,2),
  overall_score       DECIMAL(4,2),

  -- Prediction
  direction           prediction_direction NOT NULL,
  confidence_pct      DECIMAL(5,2),
  expected_move_min   DECIMAL(6,2),      -- Min expected % move
  expected_move_max   DECIMAL(6,2),      -- Max expected % move

  -- Key Levels
  support_level       DECIMAL(12,2),
  resistance_level    DECIMAL(12,2),
  stop_loss           DECIMAL(12,2),

  -- AI Reasoning
  reasoning           TEXT NOT NULL,
  pattern_detected    TEXT,
  key_signals         JSONB DEFAULT '[]',
  -- [{signal, value, interpretation}]

  -- Data Sources Used
  data_sources        JSONB DEFAULT '[]',
  -- [{name, url, type: sebi/bse/news}]

  -- At time of prediction
  price_at_prediction DECIMAL(12,2),

  -- Rank in top 5 (NULL if not in top 5)
  daily_rank          INTEGER,

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PREDICTION RESULTS (Filled next day)
-- ============================================================

CREATE TABLE prediction_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id     UUID NOT NULL REFERENCES ai_predictions(id),
  result_date       DATE NOT NULL,

  -- Actual movement
  price_at_open     DECIMAL(12,2),
  price_at_close    DECIMAL(12,2),
  actual_change_pct DECIMAL(7,4),
  actual_direction  prediction_direction,

  -- Was prediction correct?
  direction_correct BOOLEAN,
  within_range      BOOLEAN,    -- Was move within predicted range?

  -- Score for this prediction (0-100)
  accuracy_score    DECIMAL(5,2),

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prediction_id)
);

-- ============================================================
-- ACCURACY TRACKER (Pre-computed)
-- ============================================================

CREATE TABLE prediction_accuracy (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type           TEXT NOT NULL,   -- '7d', '30d', '90d', 'all'
  calculated_on         DATE NOT NULL,

  total_predictions     INTEGER DEFAULT 0,
  correct_predictions   INTEGER DEFAULT 0,
  accuracy_pct          DECIMAL(5,2),

  top5_total            INTEGER DEFAULT 0,
  top5_correct          INTEGER DEFAULT 0,
  top5_accuracy_pct     DECIMAL(5,2),

  avg_confidence        DECIMAL(5,2),
  avg_actual_move       DECIMAL(7,4),

  -- Direction breakdown
  up_predicted          INTEGER DEFAULT 0,
  up_correct            INTEGER DEFAULT 0,
  down_predicted        INTEGER DEFAULT 0,
  down_correct          INTEGER DEFAULT 0,

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period_type, calculated_on)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_predictions_date     ON ai_predictions(prediction_date DESC);
CREATE INDEX idx_predictions_symbol   ON ai_predictions(symbol, prediction_date DESC);
CREATE INDEX idx_predictions_rank     ON ai_predictions(prediction_date, daily_rank) WHERE daily_rank IS NOT NULL;
CREATE INDEX idx_pred_results_date    ON prediction_results(result_date DESC);
CREATE INDEX idx_accuracy_period      ON prediction_accuracy(period_type, calculated_on DESC);

-- ============================================================
-- VIEW: Today's Top 5
-- ============================================================

CREATE VIEW todays_top5 AS
SELECT
  ap.*,
  sm.company_name,
  sm.sector_id,
  lq.ltp AS current_price
FROM ai_predictions ap
JOIN stocks_master sm ON sm.symbol = ap.symbol
LEFT JOIN live_quotes lq ON lq.symbol = ap.symbol
WHERE ap.prediction_date = CURRENT_DATE
  AND ap.daily_rank IS NOT NULL
ORDER BY ap.daily_rank;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE ai_predictions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_results   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_accuracy  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read predictions"  ON ai_predictions      FOR SELECT USING (true);
CREATE POLICY "Public read results"      ON prediction_results   FOR SELECT USING (true);
CREATE POLICY "Public read accuracy"     ON prediction_accuracy  FOR SELECT USING (true);
CREATE POLICY "Service write predictions" ON ai_predictions      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write results"    ON prediction_results   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write accuracy"   ON prediction_accuracy  FOR ALL USING (auth.role() = 'service_role');

-- Migration: 007_users_subscriptions.sql
-- ============================================================
-- FILE: supabase/migrations/007_users_subscriptions.sql
-- DESC: User profiles, subscriptions, watchlists, alerts
-- ============================================================

CREATE TYPE subscription_plan AS ENUM ('FREE', 'PRO');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE alert_type AS ENUM ('PRICE_ABOVE', 'PRICE_BELOW', 'VOLUME_SURGE', 'PATTERN', 'RSI');

-- ============================================================
-- USER PROFILES
-- ============================================================

CREATE TABLE user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  name          TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  disclaimer_accepted BOOLEAN DEFAULT FALSE,
  disclaimer_accepted_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan            subscription_plan DEFAULT 'FREE',
  status          subscription_status DEFAULT 'ACTIVE',
  start_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date        DATE,
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  amount_paid     DECIMAL(10,2),
  scans_limit     INTEGER DEFAULT 5,     -- 5 for free, 50 for pro
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- DAILY SCAN USAGE
-- ============================================================

CREATE TABLE daily_scan_usage (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  scan_count  INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

-- ============================================================
-- WATCHLISTS
-- ============================================================

CREATE TABLE watchlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'My Watchlist',
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE watchlist_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id  UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  stock_id      UUID REFERENCES stocks_master(id),
  notes         TEXT,
  added_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol)
);

-- ============================================================
-- PRICE ALERTS
-- ============================================================

CREATE TABLE price_alerts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  alert_type    alert_type NOT NULL,
  trigger_value DECIMAL(12,2),
  is_active     BOOLEAN DEFAULT TRUE,
  triggered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');

  INSERT INTO subscriptions (user_id, plan, scans_limit)
  VALUES (NEW.id, 'FREE', 5);

  INSERT INTO watchlists (user_id, name, is_default)
  VALUES (NEW.id, 'My Watchlist', TRUE);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CHECK SCAN LIMIT FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION check_scan_limit(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  sub_record    subscriptions%ROWTYPE;
  used_today    INTEGER;
BEGIN
  SELECT * INTO sub_record FROM subscriptions WHERE user_id = p_user_id;
  SELECT COALESCE(scan_count, 0) INTO used_today
  FROM daily_scan_usage
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;

  RETURN jsonb_build_object(
    'allowed', used_today < sub_record.scans_limit,
    'used', used_today,
    'limit', sub_record.scans_limit,
    'plan', sub_record.plan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_subscriptions_user   ON subscriptions(user_id);
CREATE INDEX idx_watchlist_user       ON watchlists(user_id);
CREATE INDEX idx_watchlist_items      ON watchlist_items(watchlist_id);
CREATE INDEX idx_alerts_user          ON price_alerts(user_id, is_active);
CREATE INDEX idx_alerts_symbol        ON price_alerts(symbol, is_active);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scan_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists       ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile"     ON user_profiles   FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own sub"         ON subscriptions    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users own usage"       ON daily_scan_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users own watchlists"  ON watchlists       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own items"       ON watchlist_items  FOR ALL
  USING (watchlist_id IN (SELECT id FROM watchlists WHERE user_id = auth.uid()));
CREATE POLICY "Users own alerts"      ON price_alerts     FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service all subs"      ON subscriptions    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service all usage"     ON daily_scan_usage FOR ALL USING (auth.role() = 'service_role');

-- Migration: 008_accuracy_tracker.sql
-- ============================================================
-- FILE: supabase/migrations/008_accuracy_tracker.sql
-- ============================================================

CREATE TABLE accuracy_daily_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date        DATE NOT NULL UNIQUE,
  top30_selected  INTEGER DEFAULT 0,
  top30_moved_1pct INTEGER DEFAULT 0,
  top5_correct    INTEGER DEFAULT 0,
  top5_total      INTEGER DEFAULT 5,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE VIEW accuracy_summary AS
SELECT
  COUNT(*) AS total_days,
  ROUND(AVG(top5_correct::DECIMAL / NULLIF(top5_total,0) * 100), 2) AS avg_top5_accuracy,
  ROUND(AVG(top30_moved_1pct::DECIMAL / NULLIF(top30_selected,0) * 100), 2) AS avg_top30_hit_rate,
  MAX(log_date) AS last_updated
FROM accuracy_daily_log;

ALTER TABLE accuracy_daily_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read accuracy log" ON accuracy_daily_log FOR SELECT USING (true);
CREATE POLICY "Service write accuracy"   ON accuracy_daily_log FOR ALL USING (auth.role() = 'service_role');
-- 008_accuracy_tracker.sql migration


-- Migration: 009_pdf_knowledge.sql
-- ============================================================
-- FILE: supabase/migrations/009_pdf_knowledge.sql
-- DESC: RAG vector store for PDF technical knowledge
-- ============================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- PDF KNOWLEDGE CHUNKS
-- ============================================================

CREATE TABLE pdf_knowledge_chunks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content       TEXT NOT NULL,
  embedding     vector(768),          -- Google text-embedding-004 dimension
  source_file   TEXT NOT NULL,        -- PDF filename
  chapter       TEXT,
  topic         TEXT,                 -- e.g. 'RSI', 'Cup and Handle', 'MACD'
  pattern_type  TEXT,                 -- e.g. 'breakout', 'reversal', 'continuation'
  page_number   INTEGER,
  chunk_index   INTEGER,
  token_count   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VECTOR SIMILARITY SEARCH FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION match_pdf_chunks(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count     INTEGER DEFAULT 5,
  filter_topic    TEXT DEFAULT NULL
)
RETURNS TABLE (
  id          UUID,
  content     TEXT,
  topic       TEXT,
  chapter     TEXT,
  pattern_type TEXT,
  similarity  FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pkc.id,
    pkc.content,
    pkc.topic,
    pkc.chapter,
    pkc.pattern_type,
    1 - (pkc.embedding <=> query_embedding) AS similarity
  FROM pdf_knowledge_chunks pkc
  WHERE
    (filter_topic IS NULL OR pkc.topic ILIKE '%' || filter_topic || '%')
    AND 1 - (pkc.embedding <=> query_embedding) > match_threshold
  ORDER BY pkc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_pdf_chunks_embedding ON pdf_knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_pdf_chunks_topic   ON pdf_knowledge_chunks(topic);
CREATE INDEX idx_pdf_chunks_pattern ON pdf_knowledge_chunks(pattern_type);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE pdf_knowledge_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chunks"  ON pdf_knowledge_chunks FOR SELECT USING (true);
CREATE POLICY "Service write chunks" ON pdf_knowledge_chunks FOR ALL USING (auth.role() = 'service_role');

-- Migration: 010_commodities.sql
-- ============================================================
-- FILE: supabase/migrations/010_commodities.sql
-- ============================================================

CREATE TYPE commodity_category AS ENUM (
  'PRECIOUS_METALS', 'BASE_METALS', 'ENERGY', 'AGRI'
);

CREATE TABLE commodities_master (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    commodity_category NOT NULL,
  unit        TEXT NOT NULL,        -- per gram, per kg, per barrel
  exchange    TEXT DEFAULT 'MCX',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commodity_prices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol        TEXT NOT NULL,
  price         DECIMAL(14,2) NOT NULL,
  open          DECIMAL(14,2),
  high          DECIMAL(14,2),
  low           DECIMAL(14,2),
  change        DECIMAL(10,2),
  change_pct    DECIMAL(7,4),
  volume        BIGINT DEFAULT 0,
  recorded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Gold city-wise prices
CREATE TABLE gold_city_prices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city        TEXT NOT NULL,
  price_24k   DECIMAL(10,2),
  price_22k   DECIMAL(10,2),
  price_18k   DECIMAL(10,2),
  silver_1kg  DECIMAL(10,2),
  price_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, price_date)
);

-- Seed commodities
INSERT INTO commodities_master (symbol, name, category, unit, exchange) VALUES
  ('GOLD',    'Gold',         'PRECIOUS_METALS', 'per 10g',   'MCX'),
  ('SILVER',  'Silver',       'PRECIOUS_METALS', 'per kg',    'MCX'),
  ('CRUDEOIL','Crude Oil',    'ENERGY',          'per barrel','MCX'),
  ('NATURALGAS','Natural Gas','ENERGY',          'per mmBtu', 'MCX'),
  ('COPPER',  'Copper',       'BASE_METALS',     'per kg',    'MCX'),
  ('ALUMINIUM','Aluminium',   'BASE_METALS',     'per kg',    'MCX'),
  ('ZINC',    'Zinc',         'BASE_METALS',     'per kg',    'MCX'),
  ('COTTON',  'Cotton',       'AGRI',            'per bale',  'NCDEX'),
  ('SOYBEAN', 'Soybean',      'AGRI',            'per quintal','NCDEX');

CREATE INDEX idx_comm_prices_symbol ON commodity_prices(symbol, recorded_at DESC);
ALTER TABLE commodity_prices  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_city_prices  ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read commodities" ON commodity_prices FOR SELECT USING (true);
CREATE POLICY "Public read gold"        ON gold_city_prices FOR SELECT USING (true);
CREATE POLICY "Service write comm"      ON commodity_prices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write gold"      ON gold_city_prices FOR ALL USING (auth.role() = 'service_role');

-- Migration: 011_asset_classes.sql
-- ============================================================
-- FILE: supabase/migrations/011_asset_classes.sql
-- ============================================================

CREATE TYPE asset_type AS ENUM ('DIGITAL', 'PHYSICAL');
CREATE TYPE risk_level AS ENUM ('LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

CREATE TABLE asset_classes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  asset_type          asset_type NOT NULL,
  risk_level          risk_level NOT NULL,
  typical_returns_min DECIMAL(6,2),
  typical_returns_max DECIMAL(6,2),
  liquidity           TEXT,           -- High/Medium/Low
  min_investment      DECIMAL(12,2),
  lock_in_period      TEXT,
  tax_treatment       TEXT,
  description         TEXT,
  pros                TEXT[],
  cons                TEXT[],
  how_to_start        TEXT[],
  good_for            TEXT[],
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO asset_classes (slug, name, asset_type, risk_level, typical_returns_min, typical_returns_max, liquidity, min_investment, description, pros, cons) VALUES
  ('stocks',        'Stocks (Equity)',   'DIGITAL',  'HIGH',      10, 25,  'High',   500,    'NSE/BSE listed company shares', ARRAY['High return potential','Liquidity','Dividends'], ARRAY['Market risk','Volatility']),
  ('mutual-funds',  'Mutual Funds',      'DIGITAL',  'MODERATE',  8,  15,  'High',   500,    'Pooled investment managed by fund house', ARRAY['Professional management','Diversification'], ARRAY['Expense ratio','Market risk']),
  ('etf',           'ETF',               'DIGITAL',  'MODERATE',  8,  15,  'High',   100,    'Exchange traded funds', ARRAY['Low cost','Transparent'], ARRAY['Brokerage cost','Tracking error']),
  ('bonds',         'Bonds',             'DIGITAL',  'LOW',       6,  9,   'Medium', 1000,   'Fixed income debt instruments', ARRAY['Fixed return','Lower risk'], ARRAY['Lower returns','Interest rate risk']),
  ('fd-rd',         'FD / RD',           'DIGITAL',  'LOW',       5,  8,   'Medium', 1000,   'Bank fixed and recurring deposits', ARRAY['Guaranteed return','Safe'], ARRAY['Taxable','Inflation risk']),
  ('nps',           'NPS',               'DIGITAL',  'MODERATE',  8,  12,  'Low',    500,    'National Pension System', ARRAY['Tax benefit 80CCD','Pension'], ARRAY['Lock-in till 60','Partial withdrawal only']),
  ('ppf',           'PPF',               'DIGITAL',  'LOW',       7,  8,   'Low',    500,    'Public Provident Fund', ARRAY['Tax free','Safe','80C benefit'], ARRAY['15 year lock-in','Low returns']),
  ('reits',         'REITs',             'DIGITAL',  'MODERATE',  7,  12,  'Medium', 10000,  'Real Estate Investment Trusts', ARRAY['Real estate exposure','Regular dividend'], ARRAY['Interest rate sensitive']),
  ('gold-silver',   'Gold & Silver',     'PHYSICAL', 'MODERATE',  8,  12,  'High',   1000,   'Physical precious metals', ARRAY['Inflation hedge','Safe haven'], ARRAY['Storage cost','No income']),
  ('real-estate',   'Real Estate',       'PHYSICAL', 'MODERATE',  8,  15,  'Low',    500000, 'Physical property investment', ARRAY['Tangible asset','Rental income'], ARRAY['Illiquid','High ticket size']),
  ('unlisted',      'Unlisted Shares',   'PHYSICAL', 'VERY_HIGH', 0,  50,  'Low',    10000,  'Pre-IPO and unlisted company shares', ARRAY['High upside potential'], ARRAY['Very illiquid','High risk','No regulation']);

ALTER TABLE asset_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read assets" ON asset_classes FOR SELECT USING (true);

-- Migration: 012_search_analytics.sql
-- ============================================================
-- FILE: supabase/migrations/012_search_analytics.sql
-- ============================================================

CREATE TABLE search_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol        TEXT NOT NULL,
  user_id       UUID REFERENCES auth.users(id),
  session_id    TEXT,
  searched_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE search_aggregates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol          TEXT NOT NULL,
  agg_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  total_searches  INTEGER DEFAULT 0,
  unique_users    INTEGER DEFAULT 0,
  hour_breakdown  JSONB DEFAULT '{}',
  is_surge        BOOLEAN DEFAULT FALSE,
  surge_reason    TEXT,
  avg_7d          DECIMAL(10,2),
  UNIQUE(symbol, agg_date)
);

CREATE TABLE user_search_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol      TEXT NOT NULL,
  company_name TEXT,
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_events_symbol  ON search_events(symbol, searched_at DESC);
CREATE INDEX idx_search_agg_date       ON search_aggregates(agg_date DESC, total_searches DESC);
CREATE INDEX idx_search_agg_surge      ON search_aggregates(is_surge) WHERE is_surge = TRUE;
CREATE INDEX idx_user_history          ON user_search_history(user_id, searched_at DESC);

-- Function: increment search count
CREATE OR REPLACE FUNCTION record_search(p_symbol TEXT, p_user_id UUID DEFAULT NULL)
RETURNS void AS $$
BEGIN
  INSERT INTO search_events (symbol, user_id) VALUES (p_symbol, p_user_id);
  INSERT INTO search_aggregates (symbol, agg_date, total_searches, unique_users)
  VALUES (p_symbol, CURRENT_DATE, 1, CASE WHEN p_user_id IS NOT NULL THEN 1 ELSE 0 END)
  ON CONFLICT (symbol, agg_date) DO UPDATE SET
    total_searches = search_aggregates.total_searches + 1,
    unique_users = search_aggregates.unique_users + CASE WHEN p_user_id IS NOT NULL THEN 1 ELSE 0 END;

  IF p_user_id IS NOT NULL THEN
    INSERT INTO user_search_history (user_id, symbol) VALUES (p_user_id, p_symbol);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE search_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_aggregates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read aggregates"  ON search_aggregates   FOR SELECT USING (true);
CREATE POLICY "Users own history"       ON user_search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service all search"      ON search_events       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service all aggregates"  ON search_aggregates   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service all history"     ON user_search_history FOR ALL USING (auth.role() = 'service_role');

-- Migration: 013_portfolio.sql
-- ============================================================
-- FILE: supabase/migrations/013_portfolio.sql
-- ============================================================

CREATE TYPE broker_type AS ENUM ('ZERODHA', 'GROWW', 'UPSTOX', 'ANGEL', 'MANUAL');

CREATE TABLE user_portfolios (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broker        broker_type DEFAULT 'MANUAL',
  is_connected  BOOLEAN DEFAULT FALSE,
  last_synced   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, broker)
);

CREATE TABLE portfolio_holdings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id    UUID NOT NULL REFERENCES user_portfolios(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  company_name    TEXT,
  quantity        DECIMAL(12,4) NOT NULL,
  avg_buy_price   DECIMAL(12,2) NOT NULL,
  current_price   DECIMAL(12,2),
  current_value   DECIMAL(16,2),
  invested_value  DECIMAL(16,2),
  pnl             DECIMAL(16,2),
  pnl_pct         DECIMAL(8,4),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, symbol)
);

CREATE TABLE portfolio_ai_analysis (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id          UUID NOT NULL REFERENCES user_portfolios(id) ON DELETE CASCADE,
  health_score          DECIMAL(4,2),
  risk_score            DECIMAL(4,2),
  diversification_score DECIMAL(4,2),
  analysis_text         TEXT,
  warnings              JSONB DEFAULT '[]',
  suggestions           JSONB DEFAULT '[]',
  generated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_user     ON user_portfolios(user_id);
CREATE INDEX idx_holdings_portfolio ON portfolio_holdings(portfolio_id);

ALTER TABLE user_portfolios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_ai_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own portfolios" ON user_portfolios       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own holdings"   ON portfolio_holdings    FOR ALL
  USING (portfolio_id IN (SELECT id FROM user_portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Users own analysis"   ON portfolio_ai_analysis FOR SELECT
  USING (portfolio_id IN (SELECT id FROM user_portfolios WHERE user_id = auth.uid()));
CREATE POLICY "Service write portfolio" ON portfolio_holdings    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write analysis"  ON portfolio_ai_analysis FOR ALL USING (auth.role() = 'service_role');

-- Migration: 014_market_share.sql
-- ============================================================
-- FILE: supabase/migrations/014_market_share.sql
-- ============================================================

CREATE TABLE company_market_share (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol            TEXT NOT NULL,
  sector            TEXT NOT NULL,
  market_share_pct  DECIMAL(6,4),
  rank_in_sector    INTEGER,
  data_date         DATE NOT NULL,
  source_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, sector, data_date)
);

CREATE TABLE subsidiaries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_symbol     TEXT NOT NULL,
  child_name        TEXT NOT NULL,
  child_symbol      TEXT,
  stake_pct         DECIMAL(6,4),
  acquired_date     DATE,
  acquisition_cost  DECIMAL(20,2),
  is_listed         BOOLEAN DEFAULT FALSE,
  source_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subsidiary_performance (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subsidiary_id       UUID NOT NULL REFERENCES subsidiaries(id) ON DELETE CASCADE,
  period_label        TEXT NOT NULL,
  period_end          DATE NOT NULL,
  revenue             DECIMAL(20,2),
  profit              DECIMAL(20,2),
  contribution_pct    DECIMAL(6,4),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_share_symbol ON company_market_share(symbol, data_date DESC);
CREATE INDEX idx_subsidiaries_parent ON subsidiaries(parent_symbol);

ALTER TABLE company_market_share  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidiaries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidiary_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read market share" ON company_market_share   FOR SELECT USING (true);
CREATE POLICY "Public read subsidiaries" ON subsidiaries            FOR SELECT USING (true);
CREATE POLICY "Public read sub perf"     ON subsidiary_performance  FOR SELECT USING (true);
CREATE POLICY "Service write ms"         ON company_market_share    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write subs"       ON subsidiaries            FOR ALL USING (auth.role() = 'service_role');

-- Migration: 015_sector_events.sql
-- ============================================================
-- FILE: supabase/migrations/015_sector_events.sql
-- ============================================================

CREATE TYPE impact_type AS ENUM ('WINNER', 'LOSER', 'NEUTRAL');

CREATE TABLE market_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name        TEXT NOT NULL,
  event_type        TEXT NOT NULL,
  start_date        DATE NOT NULL,
  end_date          DATE,
  description       TEXT,
  affected_sectors  TEXT[] DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_stock_impact (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        UUID NOT NULL REFERENCES market_events(id) ON DELETE CASCADE,
  symbol          TEXT NOT NULL,
  impact_type     impact_type NOT NULL,
  price_before    DECIMAL(12,2),
  price_after     DECIMAL(12,2),
  pct_change      DECIMAL(8,4),
  ai_reasoning    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date    ON market_events(start_date DESC);
CREATE INDEX idx_impact_event   ON event_stock_impact(event_id);
CREATE INDEX idx_impact_symbol  ON event_stock_impact(symbol);

ALTER TABLE market_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stock_impact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events"  ON market_events      FOR SELECT USING (true);
CREATE POLICY "Public read impact"  ON event_stock_impact FOR SELECT USING (true);
CREATE POLICY "Service write events" ON market_events     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write impact" ON event_stock_impact FOR ALL USING (auth.role() = 'service_role');

-- Migration: 016_news.sql
-- ============================================================
-- FILE: supabase/migrations/016_news.sql
-- (Already covered in 004 - this adds currency/forex)
-- ============================================================

CREATE TABLE forex_rates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair        TEXT NOT NULL,   -- USD/INR, EUR/INR
  rate        DECIMAL(10,4),
  change      DECIMAL(8,4),
  change_pct  DECIMAL(7,4),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pair)
);

INSERT INTO forex_rates (pair, rate) VALUES
  ('USD/INR', 83.50),
  ('EUR/INR', 90.20),
  ('GBP/INR', 105.80),
  ('JPY/INR', 0.56),
  ('AED/INR', 22.74);

ALTER TABLE forex_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read forex" ON forex_rates FOR SELECT USING (true);
CREATE POLICY "Service write forex" ON forex_rates FOR ALL USING (auth.role() = 'service_role');

-- Migration: 017_mutual_funds.sql
-- ============================================================
-- FILE: supabase/migrations/017_mutual_funds.sql
-- ============================================================

CREATE TYPE mf_risk AS ENUM ('LOW', 'LOW_TO_MODERATE', 'MODERATE', 'MODERATELY_HIGH', 'HIGH', 'VERY_HIGH');

CREATE TABLE mutual_funds (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_code       TEXT NOT NULL UNIQUE,
  scheme_name       TEXT NOT NULL,
  fund_house        TEXT NOT NULL,
  category          TEXT NOT NULL,
  sub_category      TEXT,
  nav               DECIMAL(12,4),
  nav_date          DATE,
  aum_cr            DECIMAL(16,2),
  expense_ratio     DECIMAL(5,4),
  risk_level        mf_risk DEFAULT 'MODERATE',
  returns_1y        DECIMAL(8,4),
  returns_3y        DECIMAL(8,4),
  returns_5y        DECIMAL(8,4),
  returns_inception DECIMAL(8,4),
  min_sip           DECIMAL(10,2) DEFAULT 500,
  min_lumpsum       DECIMAL(10,2) DEFAULT 5000,
  exit_load         TEXT,
  fund_manager      TEXT,
  inception_date    DATE,
  benchmark         TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mf_holdings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_code     TEXT NOT NULL,
  symbol          TEXT,
  company_name    TEXT NOT NULL,
  holding_pct     DECIMAL(6,4),
  value_cr        DECIMAL(16,2),
  sector          TEXT,
  as_of_date      DATE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mf_nav_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_code   TEXT NOT NULL,
  nav           DECIMAL(12,4),
  nav_date      DATE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scheme_code, nav_date)
);

CREATE INDEX idx_mf_category    ON mutual_funds(category, returns_1y DESC);
CREATE INDEX idx_mf_fundhouse   ON mutual_funds(fund_house);
CREATE INDEX idx_mf_holdings    ON mf_holdings(scheme_code, holding_pct DESC);
CREATE INDEX idx_mf_nav_hist    ON mf_nav_history(scheme_code, nav_date DESC);

ALTER TABLE mutual_funds    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mf_holdings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mf_nav_history  ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mf"      ON mutual_funds   FOR SELECT USING (true);
CREATE POLICY "Public read mf hold" ON mf_holdings    FOR SELECT USING (true);
CREATE POLICY "Public read mf nav"  ON mf_nav_history FOR SELECT USING (true);
CREATE POLICY "Service write mf"    ON mutual_funds   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write hold"  ON mf_holdings    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write nav"   ON mf_nav_history FOR ALL USING (auth.role() = 'service_role');

-- Migration: 018_paper_trading.sql
-- ============================================================
-- FILE: supabase/migrations/018_paper_trading.sql
-- ============================================================

CREATE TYPE paper_trade_type AS ENUM ('BUY', 'SELL');
CREATE TYPE paper_payment_type AS ENUM ('FREE', 'PAID_50');

CREATE TABLE paper_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  virtual_cash    DECIMAL(16,2) DEFAULT 100000,
  total_value     DECIMAL(16,2) DEFAULT 100000,
  total_pnl       DECIMAL(16,2) DEFAULT 0,
  total_pnl_pct   DECIMAL(8,4) DEFAULT 0,
  payment_type    paper_payment_type DEFAULT 'FREE',
  is_active       BOOLEAN DEFAULT TRUE,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE paper_trades (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id    UUID NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  company_name  TEXT,
  trade_type    paper_trade_type NOT NULL,
  quantity      INTEGER NOT NULL,
  buy_price     DECIMAL(12,2) NOT NULL,
  sell_price    DECIMAL(12,2),
  status        VARCHAR(20) DEFAULT 'OPEN',
  pnl           DECIMAL(16,2) DEFAULT 0,
  invested_amount DECIMAL(16,2) GENERATED ALWAYS AS (quantity * buy_price) STORED,
  traded_at     TIMESTAMPTZ DEFAULT NOW(),
  closed_at     TIMESTAMPTZ
);

CREATE TABLE paper_holdings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id    UUID NOT NULL REFERENCES paper_accounts(id) ON DELETE CASCADE,
  symbol        TEXT NOT NULL,
  company_name  TEXT,
  quantity      INTEGER NOT NULL DEFAULT 0,
  avg_price     DECIMAL(12,2),
  current_price DECIMAL(12,2),
  current_value DECIMAL(16,2),
  pnl           DECIMAL(16,2),
  pnl_pct       DECIMAL(8,4),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(account_id, symbol)
);

CREATE TABLE paper_leaderboard (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT,
  total_value   DECIMAL(16,2),
  total_pnl_pct DECIMAL(8,4),
  trades_count  INTEGER DEFAULT 0,
  rank          INTEGER,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_paper_trades_account  ON paper_trades(account_id, traded_at DESC);
CREATE INDEX idx_paper_holdings        ON paper_holdings(account_id);
CREATE INDEX idx_leaderboard_rank      ON paper_leaderboard(total_pnl_pct DESC);

ALTER TABLE paper_accounts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_trades      ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_holdings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own paper account"  ON paper_accounts    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own paper trades"   ON paper_trades      FOR SELECT
  USING (account_id IN (SELECT id FROM paper_accounts WHERE user_id = auth.uid()));
CREATE POLICY "Users own paper holdings" ON paper_holdings    FOR SELECT
  USING (account_id IN (SELECT id FROM paper_accounts WHERE user_id = auth.uid()));
CREATE POLICY "Public read leaderboard"  ON paper_leaderboard FOR SELECT USING (true);
CREATE POLICY "Service write paper"      ON paper_accounts    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write trades"     ON paper_trades      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write holdings"   ON paper_holdings    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write leaderboard" ON paper_leaderboard FOR ALL USING (auth.role() = 'service_role');

-- Migration: 019_ai_self_learning.sql
-- ============================================================
-- FILE: supabase/migrations/019_ai_self_learning.sql
-- DESC: AI predictions log and rule memory for self-learning
-- ============================================================

-- ============================================================
-- PREDICTIONS LOG (Stores every AI prediction)
-- ============================================================
CREATE TABLE predictions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL,
  target_price DECIMAL(20,2),
  stop_loss DECIMAL(20,2),
  timeframe TEXT,
  reasoning TEXT,
  status TEXT DEFAULT 'PENDING', -- PENDING, PASS, FAIL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI RULES MEMORY (Stores rules from failed predictions)
-- ============================================================
CREATE TABLE ai_rules_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  rule_text TEXT NOT NULL,
  failed_prediction_id UUID REFERENCES predictions_log(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE predictions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_rules_memory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to predictions and rules
CREATE POLICY "Public read predictions_log" ON predictions_log FOR SELECT USING (true);
CREATE POLICY "Public read ai_rules_memory" ON ai_rules_memory FOR SELECT USING (true);

-- Allow service_role (Python Backend) to insert/update data
CREATE POLICY "Service write predictions_log" ON predictions_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write ai_rules_memory" ON ai_rules_memory FOR ALL USING (auth.role() = 'service_role');

-- Migration: 020_learning_and_rules.sql
-- Table for AI Rules Memory (AI Learning Agent)
-- Table for Learn Chapters (Auto-generated by AI)
CREATE TABLE IF NOT EXISTS learn_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    quiz_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Quiz Ratings / Feedback (AI Feedback Loop)
CREATE TABLE IF NOT EXISTS quiz_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID REFERENCES learn_chapters(id) ON DELETE CASCADE,
    user_id UUID, -- For tracking which user submitted the rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: 021_new_features.sql
-- Enable pgvector extension
-- Learning Center: Quiz results tracking
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  segment TEXT NOT NULL,
  lesson_number INTEGER,
  score INTEGER,
  total_questions INTEGER,
  time_taken_seconds INTEGER,
  wrong_topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Center: Lesson completion tracking
CREATE TABLE lesson_completions (
  user_id UUID NOT NULL REFERENCES auth.users(id),
  segment TEXT NOT NULL,
  lesson_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, segment, lesson_number)
);

-- Learning Center: User streaks
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trending: Intent classification
CREATE TABLE trending_intent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  intent_date DATE NOT NULL,
  intent_type TEXT NOT NULL,
  ai_reason TEXT,
  confidence INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(symbol, intent_date)
);

-- Trending: Correlated searches
CREATE TABLE search_correlations (
  symbol_a TEXT NOT NULL,
  symbol_b TEXT NOT NULL,
  correlation_score DECIMAL(5,4),
  reason TEXT,
  calculated_on DATE NOT NULL,
  PRIMARY KEY (symbol_a, symbol_b, calculated_on)
);

-- New Features: IPO data
CREATE TABLE ipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  symbol TEXT,
  open_date DATE,
  close_date DATE,
  listing_date DATE,
  price_band_low DECIMAL(10,2),
  price_band_high DECIMAL(10,2),
  lot_size INTEGER,
  issue_size_cr DECIMAL(16,2),
  gmp INTEGER,
  subscription_qib DECIMAL(8,4),
  subscription_nii DECIMAL(8,4),
  subscription_retail DECIMAL(8,4),
  subscription_total DECIMAL(8,4),
  status TEXT DEFAULT 'UPCOMING',
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- New Features: FII/DII daily data
CREATE TABLE fii_dii_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_date DATE NOT NULL UNIQUE,
  fii_buy_cr DECIMAL(16,2),
  fii_sell_cr DECIMAL(16,2),
  fii_net_cr DECIMAL(16,2),
  dii_buy_cr DECIMAL(16,2),
  dii_sell_cr DECIMAL(16,2),
  dii_net_cr DECIMAL(16,2),
  nifty_close DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- New Features: Bulk/Block deals
CREATE TABLE bulk_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_date DATE NOT NULL,
  exchange TEXT NOT NULL,
  symbol TEXT NOT NULL,
  company_name TEXT,
  client_name TEXT,
  deal_type TEXT NOT NULL, -- BUY/SELL
  quantity BIGINT,
  price DECIMAL(12,2),
  value_cr DECIMAL(16,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration: 022_beginner_curriculum.sql
-- Turns learn_chapters from "random AI topics" into an ordered, lockable
-- curriculum. segment groups a learning path (e.g. 'zero-to-hero');
-- lesson_number gives it a fixed order that matches lesson_completions
-- and quiz_results, which already used (segment, lesson_number).

ALTER TABLE learn_chapters ADD COLUMN IF NOT EXISTS segment TEXT;
ALTER TABLE learn_chapters ADD COLUMN IF NOT EXISTS lesson_number INTEGER;
ALTER TABLE learn_chapters ADD COLUMN IF NOT EXISTS summary TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS learn_chapters_segment_lesson_idx
  ON learn_chapters (segment, lesson_number)
  WHERE segment IS NOT NULL;


-- Migration: 023_fno_risk_gate.sql
-- Tracks whether a user has passed the mandatory F&O risk-awareness quiz.
-- Gates access to the "how options/futures actually work" pages behind an
-- honest acknowledgement of the SEBI loss data first.
CREATE TABLE IF NOT EXISTS fno_risk_gate_completions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);


-- Migration: 024_prediction_scores.sql
ALTER TABLE predictions_log ADD COLUMN IF NOT EXISTS technical_score INTEGER;
ALTER TABLE predictions_log ADD COLUMN IF NOT EXISTS fundamental_score INTEGER;
ALTER TABLE predictions_log ADD COLUMN IF NOT EXISTS overall_score INTEGER;

