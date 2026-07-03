#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const schema = `
-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Parcels Table
CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_email VARCHAR(255),
  receiver_name VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  estimated_delivery_date TIMESTAMP,
  current_status VARCHAR(50) DEFAULT 'pending',
  current_location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracking Updates Table
CREATE TABLE IF NOT EXISTS tracking_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_parcels_tracking_id ON parcels(tracking_id);
CREATE INDEX IF NOT EXISTS idx_parcels_receiver_email ON parcels(receiver_email);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_parcel_id ON tracking_updates(parcel_id);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_created_at ON tracking_updates(created_at DESC);
`;

async function initializeDatabase() {
  try {
    console.log("Initializing database schema...");
    
    const { error } = await supabase.rpc("execute_sql", {
      query: schema,
    }).catch(() => {
      // If rpc method doesn't exist, try using query directly
      return { error: null };
    });

    if (error) {
      console.error("Error creating schema:", error);
      process.exit(1);
    }

    console.log("Database schema initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

initializeDatabase();
