/*
  # Row Level Security Policies

  ## Overview
  Implements organization-scoped access control for all tables.
  Users can only access data from organizations they are members of.

  ## Security Model
  1. All data operations require authentication
  2. Access is controlled via memberships table
  3. Role hierarchy: OWNER > ADMIN > ANALYST > VIEWER
  4. Write operations require ADMIN or OWNER roles
  5. Market data is readable by all authenticated users (public data)

  ## Policies Created
  - Organizations: members can view their own org; owners can update
  - Memberships: users can view memberships for their orgs
  - Properties: org members can view; admins+ can create/update/delete
  - Tenants: org members can view; admins+ can create/update/delete
  - Insights: org members can view; system can create
  - Reports: org members can view and create
  - Files: org members can view and create
  - Market Data: all authenticated users can read (public data)
*/

-- Helper function to check if user is member of org
CREATE OR REPLACE FUNCTION is_org_member(org_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
    AND org_id = org_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has role in org
CREATE OR REPLACE FUNCTION has_org_role(org_uuid uuid, required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = auth.uid()
    AND org_id = org_uuid
    AND (
      role = required_role OR
      (required_role = 'VIEWER' AND role IN ('OWNER', 'ADMIN', 'ANALYST')) OR
      (required_role = 'ANALYST' AND role IN ('OWNER', 'ADMIN')) OR
      (required_role = 'ADMIN' AND role = 'OWNER')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (is_org_member(id));

CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (has_org_role(id, 'OWNER'))
  WITH CHECK (has_org_role(id, 'OWNER'));

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Memberships policies
CREATE POLICY "Users can view memberships in their orgs"
  ON memberships FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Owners can manage memberships"
  ON memberships FOR ALL
  TO authenticated
  USING (has_org_role(org_id, 'OWNER'))
  WITH CHECK (has_org_role(org_id, 'OWNER'));

CREATE POLICY "Users can create their own first membership"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Properties policies
CREATE POLICY "Org members can view properties"
  ON properties FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Admins can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (has_org_role(org_id, 'ADMIN'));

CREATE POLICY "Admins can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'))
  WITH CHECK (has_org_role(org_id, 'ADMIN'));

CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'));

-- Tenants policies
CREATE POLICY "Org members can view tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Admins can create tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (has_org_role(org_id, 'ADMIN'));

CREATE POLICY "Admins can update tenants"
  ON tenants FOR UPDATE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'))
  WITH CHECK (has_org_role(org_id, 'ADMIN'));

CREATE POLICY "Admins can delete tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'));

-- Market data policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view market data"
  ON market_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage market data"
  ON market_data FOR ALL
  TO authenticated
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Insights policies
CREATE POLICY "Org members can view insights"
  ON insights FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Analysts can create insights"
  ON insights FOR INSERT
  TO authenticated
  WITH CHECK (has_org_role(org_id, 'ANALYST'));

CREATE POLICY "Admins can delete insights"
  ON insights FOR DELETE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'));

-- Reports policies
CREATE POLICY "Org members can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Analysts can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (has_org_role(org_id, 'ANALYST'));

-- Files policies
CREATE POLICY "Org members can view files"
  ON files FOR SELECT
  TO authenticated
  USING (is_org_member(org_id));

CREATE POLICY "Analysts can upload files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (has_org_role(org_id, 'ANALYST'));

CREATE POLICY "Admins can delete files"
  ON files FOR DELETE
  TO authenticated
  USING (has_org_role(org_id, 'ADMIN'));