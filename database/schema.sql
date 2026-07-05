-- HYDRAWIRE Database Schema
-- Target: Supabase (PostgreSQL)

-- Enable required extensions for geospatial queries
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- 1. PROPERTIES TABLE
-- Core property data
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    parcel_id TEXT,
    apn TEXT,
    property_type TEXT, -- SFR, Multi-family, Condo, Townhouse, Commercial, Land
    property_use TEXT,
    owner_name TEXT,
    owner_address TEXT,
    owner_type TEXT, -- Absentee, Owner-occupied, Corporate
    mailing_address TEXT,
    estimated_value DECIMAL(12, 2),
    equity DECIMAL(12, 2),
    equity_percent DECIMAL(5, 2),
    loan_balance DECIMAL(12, 2),
    loan_type TEXT,
    lender_name TEXT,
    origination_date DATE,
    assessed_value DECIMAL(12, 2),
    annual_taxes DECIMAL(12, 2),
    tax_delinquency BOOLEAN DEFAULT FALSE,
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    sqft INTEGER,
    lot_size DECIMAL(10, 2),
    year_built INTEGER,
    garage BOOLEAN,
    pool BOOLEAN,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    flood_zone TEXT,
    school_district TEXT,
    listing_status TEXT, -- Active, Off-market, Pre-foreclosure, Foreclosure, Auction, REO
    listing_date DATE,
    days_on_market INTEGER,
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_properties_zip ON properties(zip);
CREATE INDEX IF NOT EXISTS idx_properties_city_state ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(listing_status);
CREATE INDEX IF NOT EXISTS idx_properties_coords ON properties USING gist (ll_to_earth(latitude, longitude));

-- 2. LEAD LISTS
CREATE TABLE IF NOT EXISTS lead_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    filters JSONB DEFAULT '{}'::jsonb,
    record_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. LIST PROPERTIES (Many-to-Many)
CREATE TABLE IF NOT EXISTS list_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES lead_lists(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'new', -- new, contacted, interested, skip, converted
    tags TEXT[],
    notes TEXT,
    added_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(list_id, property_id)
);

-- 4. SKIP TRACE RESULTS
CREATE TABLE IF NOT EXISTS skip_trace_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    phones JSONB DEFAULT '[]'::jsonb,
    emails JSONB DEFAULT '[]'::jsonb,
    confidence_score DECIMAL(3, 2),
    source TEXT,
    credits_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- mail, email
    template_id TEXT,
    audience_list_id UUID REFERENCES lead_lists(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'draft', -- draft, scheduled, sending, completed
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opens": 0, "clicks": 0, "cost": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SAVED SEARCHES
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    location JSONB,
    alert_frequency TEXT DEFAULT 'none', -- none, instant, daily, weekly
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan TEXT DEFAULT 'free', -- free, basic, pro, team
    status TEXT DEFAULT 'active', -- active, cancelled, past_due
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    credits_remaining INTEGER DEFAULT 0,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- lookup, skip_trace, mail, topup
    amount DECIMAL(10, 2),
    credits INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. MARKET STATS
CREATE TABLE IF NOT EXISTS market_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_type TEXT, -- city, zip, county
    location_value TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(12, 2),
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_modtime BEFORE UPDATE ON properties FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_lead_lists_modtime BEFORE UPDATE ON lead_lists FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_campaigns_modtime BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_saved_searches_modtime BEFORE UPDATE ON saved_searches FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_subscriptions_modtime BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
