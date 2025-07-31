-- Add domains column to tenants table
-- This migration adds support for domain-based tenant detection

-- Add domains column as JSONB array
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS domains JSONB DEFAULT '[]'::jsonb;

-- Create index for efficient domain lookups
CREATE INDEX IF NOT EXISTS idx_tenants_domains 
ON tenants USING gin(domains);

-- Add comment for documentation
COMMENT ON COLUMN tenants.domains IS 'Array of domain configurations for this tenant';

-- Example domain structure:
-- [
--   {"url": "ramen-taro.localhost", "isActive": true},
--   {"url": "ramen-taro.jp", "isActive": false}
-- ]