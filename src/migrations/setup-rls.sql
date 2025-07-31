-- Row-Level Security (RLS) Setup for Multi-tenant System
-- ========================================================
-- This script enables RLS on relevant tables and creates policies
-- to isolate data by tenant_id using PostgreSQL session variables

-- Step 1: Enable RLS on tables with tenant_id
-- --------------------------------------------

-- Enable RLS on media table (has tenant_id column)
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create policy for media table
DROP POLICY IF EXISTS media_isolate_by_tenant ON media;
CREATE POLICY media_isolate_by_tenant
  ON media
  FOR ALL
  USING (
    -- Allow if tenant_id matches the current session tenant
    tenant_id = current_setting('app.current_tenant', true)::integer
    OR
    -- Allow if no tenant context is set (for migrations, etc.)
    current_setting('app.current_tenant', true) IS NULL
    OR
    -- Allow for super admins (bypassed at application level)
    current_setting('app.is_super_admin', true)::boolean = true
  );

-- Step 2: Enable RLS on users table (complex multi-tenant relationship)
-- ---------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users table
DROP POLICY IF EXISTS users_isolate_by_tenant ON users;
CREATE POLICY users_isolate_by_tenant
  ON users
  FOR ALL
  USING (
    -- Allow access to users who share at least one tenant
    EXISTS (
      SELECT 1 FROM users_rels ur1
      JOIN users_rels ur2 ON ur1.tenants_id = ur2.tenants_id
      WHERE ur1.parent_id = users.id
      AND ur2.parent_id = current_setting('app.current_user_id', true)::integer
    )
    OR
    -- Allow if no tenant context is set
    current_setting('app.current_tenant', true) IS NULL
    OR
    -- Allow for super admins
    current_setting('app.is_super_admin', true)::boolean = true
    OR
    -- Allow users to see themselves
    id = current_setting('app.current_user_id', true)::integer
  );

-- Step 3: Enable RLS on tenants table
-- ------------------------------------
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create policy for tenants table
DROP POLICY IF EXISTS tenants_isolate_by_access ON tenants;
CREATE POLICY tenants_isolate_by_access
  ON tenants
  FOR ALL
  USING (
    -- Allow access to tenants the user belongs to
    EXISTS (
      SELECT 1 FROM users_rels
      WHERE parent_id = current_setting('app.current_user_id', true)::integer
      AND tenants_id = tenants.id
    )
    OR
    -- Allow if no user context is set
    current_setting('app.current_user_id', true) IS NULL
    OR
    -- Allow for super admins
    current_setting('app.is_super_admin', true)::boolean = true
  );

-- Step 4: Create helper functions for session management
-- ------------------------------------------------------

-- Function to set current tenant and user context
CREATE OR REPLACE FUNCTION set_tenant_context(
  p_tenant_id integer,
  p_user_id integer,
  p_is_super_admin boolean DEFAULT false
) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant', p_tenant_id::text, false);
  PERFORM set_config('app.current_user_id', p_user_id::text, false);
  PERFORM set_config('app.is_super_admin', p_is_super_admin::text, false);
END;
$$ LANGUAGE plpgsql;

-- Function to clear tenant context
CREATE OR REPLACE FUNCTION clear_tenant_context() RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant', NULL, false);
  PERFORM set_config('app.current_user_id', NULL, false);
  PERFORM set_config('app.is_super_admin', NULL, false);
END;
$$ LANGUAGE plpgsql;

-- Step 5: Grant necessary permissions
-- -----------------------------------

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION set_tenant_context(integer, integer, boolean) TO PUBLIC;
GRANT EXECUTE ON FUNCTION clear_tenant_context() TO PUBLIC;

-- Step 6: Create indexes for performance
-- --------------------------------------

-- Index for users_rels tenant lookup
CREATE INDEX IF NOT EXISTS idx_users_rels_parent_tenant ON users_rels(parent_id, tenants_id);

-- Verification queries
-- --------------------
COMMENT ON POLICY media_isolate_by_tenant ON media IS 'RLS policy to isolate media by tenant_id';
COMMENT ON POLICY users_isolate_by_tenant ON users IS 'RLS policy to isolate users by tenant relationship';
COMMENT ON POLICY tenants_isolate_by_access ON tenants IS 'RLS policy to show only accessible tenants';

-- To verify RLS is enabled, run:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('media', 'users', 'tenants');