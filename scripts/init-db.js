#!/usr/bin/env node

/**
 * ParcelFlow Database Initialization Script
 * Uses Supabase Management API to run SQL statements.
 *
 * Run: node --env-file-if-exists=/vercel/share/.env.project scripts/init-db.js
 */

const https = require("https");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Extract project ref from URL: https://<ref>.supabase.co
const ref = supabaseUrl.replace("https://", "").split(".")[0];

function runSql(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: "api.supabase.com",
      path: `/v1/projects/${ref}/database/query`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const SQL = `
-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcels table
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

-- Tracking updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_parcels_tracking_id ON parcels(tracking_id);
CREATE INDEX IF NOT EXISTS idx_parcels_receiver_email ON parcels(receiver_email);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_parcel_id ON tracking_updates(parcel_id);

-- Row Level Security
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read policy for parcels (tracking page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='parcels' AND policyname='Public read parcels') THEN
    CREATE POLICY "Public read parcels" ON parcels FOR SELECT USING (true);
  END IF;
END $$;

-- Public read policy for tracking_updates (tracking page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tracking_updates' AND policyname='Public read tracking_updates') THEN
    CREATE POLICY "Public read tracking_updates" ON tracking_updates FOR SELECT USING (true);
  END IF;
END $$;
`;

async function initializeDatabase() {
  console.log("Initializing ParcelFlow database...\n");

  try {
    await runSql(SQL);
    console.log("Database schema created successfully!\n");
    console.log("Next step: Create your admin account via the Supabase SQL Editor:");
    console.log(`
  -- Run this in Supabase SQL Editor to create your admin account
  INSERT INTO admins (email, password_hash)
  VALUES ('admin@parcelflow.com', 'change-this-password');
    `);
  } catch (err) {
    console.error("Failed:", err.message);
    console.log("\nFallback: Run the SQL manually in Supabase Dashboard > SQL Editor");
    process.exit(1);
  }
}

initializeDatabase().catch(console.error);
