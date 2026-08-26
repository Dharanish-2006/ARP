-- Avatar Realty Group — Neon Postgres schema
-- Run this once against your Neon database before starting the server:
--   psql "$DATABASE_URL" -f server/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Admin',
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  price NUMERIC,
  price_unit TEXT NOT NULL DEFAULT 'sale',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  beds NUMERIC,
  baths NUMERIC,
  area_sqft NUMERIC,
  lot_sqft NUMERIC,
  year_built INTEGER,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  images JSONB NOT NULL DEFAULT '[]',
  custom_fields JSONB NOT NULL DEFAULT '[]',
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties (featured);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties (created_at DESC);

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No property rows are seeded here on purpose — all listings are added
-- through the admin panel once the server (and its default admin account,
-- see server/seedAdmin.js) is running.
