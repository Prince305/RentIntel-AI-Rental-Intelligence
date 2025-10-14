/*
  # RentIntel - Initial Database Schema

  ## Overview
  Multi-tenant rental property intelligence platform with organization-scoped data.

  ## New Tables

  ### Core Tables
  - `organizations` - Tenant organizations (one per company/landlord)
    - `id` (uuid, primary key)
    - `name` (text) - Organization name
    - `timezone` (text) - Default: 'Africa/Johannesburg'
    - `stripe_customer_id` (text, nullable) - Stripe customer ID
    - `plan` (text) - Subscription plan: 'free', 'pro', 'enterprise'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `memberships` - User-to-organization relationships with roles
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to auth.users)
    - `org_id` (uuid, foreign key to organizations)
    - `role` (text) - 'OWNER', 'ADMIN', 'ANALYST', 'VIEWER'
    - `created_at` (timestamptz)
    - Unique constraint on (user_id, org_id)

  - `properties` - Rental properties managed by organizations
    - `id` (uuid, primary key)
    - `org_id` (uuid, foreign key to organizations)
    - `address` (text)
    - `region` (text) - Geographic region
    - `type` (text) - Property type (apartment, house, etc.)
    - `bedrooms` (integer)
    - `bathrooms` (integer)
    - `size_m2` (integer)
    - `amenities` (jsonb) - Array of amenity strings
    - `current_rent` (integer) - Monthly rent in cents
    - `target_rent` (integer) - Target/ideal rent in cents
    - `expenses` (integer) - Monthly expenses in cents
    - `tenant_id` (uuid, nullable, foreign key to tenants)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `tenants` - Tenants renting properties
    - `id` (uuid, primary key)
    - `org_id` (uuid, foreign key to organizations)
    - `name` (text)
    - `email` (text, nullable)
    - `phone` (text, nullable)
    - `lease_start` (date)
    - `lease_end` (date)
    - `payment_status` (text) - 'CURRENT', 'LATE', 'DEFAULTED', 'UNKNOWN'
    - `last_payment_date` (date, nullable)
    - `risk_score` (integer) - 0-100 risk score
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `market_data` - Regional market statistics
    - `id` (uuid, primary key)
    - `region` (text)
    - `property_type` (text)
    - `avg_rent` (integer) - Average rent in cents
    - `vacancy_rate` (numeric) - Percentage as decimal
    - `updated_at` (timestamptz)
    - Unique constraint on (region, property_type)

  - `insights` - AI-generated insights and alerts
    - `id` (uuid, primary key)
    - `org_id` (uuid, foreign key to organizations)
    - `property_id` (uuid, nullable, foreign key to properties)
    - `type` (text) - Insight type (pricing, cashflow, risk, etc.)
    - `message` (text) - Human-readable insight
    - `severity` (text) - 'INFO', 'WARNING', 'CRITICAL'
    - `created_at` (timestamptz)

  - `reports` - Generated monthly reports
    - `id` (uuid, primary key)
    - `org_id` (uuid, foreign key to organizations)
    - `month` (text) - YYYY-MM format
    - `url` (text) - Storage path to PDF
    - `created_at` (timestamptz)

  - `files` - Uploaded documents (leases, etc.)
    - `id` (uuid, primary key)
    - `org_id` (uuid, foreign key to organizations)
    - `property_id` (uuid, nullable, foreign key to properties)
    - `tenant_id` (uuid, nullable, foreign key to tenants)
    - `kind` (text) - File type: 'lease', 'document', etc.
    - `path` (text) - Storage path
    - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Organization-scoped policies for data isolation
  - Role-based access control via memberships table
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  timezone text DEFAULT 'Africa/Johannesburg' NOT NULL,
  stripe_customer_id text,
  plan text DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'VIEWER' NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'ANALYST', 'VIEWER')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, org_id)
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  address text NOT NULL,
  region text NOT NULL,
  type text NOT NULL,
  bedrooms integer DEFAULT 0 NOT NULL,
  bathrooms integer DEFAULT 0 NOT NULL,
  size_m2 integer DEFAULT 0 NOT NULL,
  amenities jsonb DEFAULT '[]'::jsonb,
  current_rent integer DEFAULT 0 NOT NULL,
  target_rent integer DEFAULT 0 NOT NULL,
  expenses integer DEFAULT 0 NOT NULL,
  tenant_id uuid,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  lease_start date NOT NULL,
  lease_end date NOT NULL,
  payment_status text DEFAULT 'UNKNOWN' NOT NULL CHECK (payment_status IN ('CURRENT', 'LATE', 'DEFAULTED', 'UNKNOWN')),
  last_payment_date date,
  risk_score integer DEFAULT 50 NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Add foreign key from properties to tenants (after tenants table exists)
ALTER TABLE properties 
  DROP CONSTRAINT IF EXISTS properties_tenant_id_fkey,
  ADD CONSTRAINT properties_tenant_id_fkey 
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

-- Create market_data table
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region text NOT NULL,
  property_type text NOT NULL,
  avg_rent integer NOT NULL,
  vacancy_rate numeric(5,2) DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(region, property_type)
);

ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'INFO' NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  month text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  kind text NOT NULL,
  path text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_properties_org_id ON properties(org_id);
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenants_org_id ON tenants(org_id);
CREATE INDEX IF NOT EXISTS idx_insights_org_id ON insights(org_id);
CREATE INDEX IF NOT EXISTS idx_insights_property_id ON insights(property_id);
CREATE INDEX IF NOT EXISTS idx_reports_org_id ON reports(org_id);
CREATE INDEX IF NOT EXISTS idx_files_org_id ON files(org_id);
CREATE INDEX IF NOT EXISTS idx_market_data_region_type ON market_data(region, property_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();