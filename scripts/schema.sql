-- ParcelFlow Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  receiver_name VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(50),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  estimated_delivery_date TIMESTAMPTZ,
  current_status VARCHAR(50) DEFAULT 'pending',
  current_location VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_parcels_tracking_id ON parcels(tracking_id);
CREATE INDEX IF NOT EXISTS idx_parcels_receiver_email ON parcels(receiver_email);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_parcel_id ON tracking_updates(parcel_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public can read parcels and tracking_updates (for public tracking page)
CREATE POLICY IF NOT EXISTS "Public read parcels"
  ON parcels FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read tracking_updates"
  ON tracking_updates FOR SELECT USING (true);

-- Service role has full access (automatic via service role key)

-- ============================================================
-- SEED: Default Admin Account
-- Replace 'your-secure-password' with a real password before running
-- ============================================================

-- NOTE: The app stores plain text passwords and compares them directly.
-- For production, hash passwords with bcrypt before storing.

INSERT INTO admins (email, password_hash)
VALUES ('admin@parcelflow.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
