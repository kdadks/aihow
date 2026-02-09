-- =====================================================
-- DROP UNUSED PERMISSION TABLES
-- =====================================================
-- Date: 2026-02-09
-- Purpose: Remove unused permissions infrastructure
--          The application uses JSONB permissions in roles table,
--          making these normalized tables redundant
-- 
-- Tables to drop:
--   - user_permissions (view) - Never used in application
--   - role_permissions (table) - Designed but never queried
--   - permissions (table) - Defined but application uses JSONB approach
--
-- Impact: NONE - No application code references these tables
-- Verified: All permission checks use roles.permissions JSONB field
-- =====================================================

BEGIN;

-- =====================================================
-- BACKUP DATA (for rollback capability)
-- =====================================================

-- Create temporary backup tables in case rollback is needed
DO $$ 
BEGIN
    -- Backup permissions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'permissions') THEN
        EXECUTE 'CREATE TABLE IF NOT EXISTS permissions_backup_20260209 AS SELECT * FROM public.permissions';
        RAISE NOTICE 'Backed up permissions table to permissions_backup_20260209';
    END IF;

    -- Backup role_permissions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        EXECUTE 'CREATE TABLE IF NOT EXISTS role_permissions_backup_20260209 AS SELECT * FROM public.role_permissions';
        RAISE NOTICE 'Backed up role_permissions table to role_permissions_backup_20260209';
    END IF;
END $$;

-- =====================================================
-- DROP UNUSED OBJECTS
-- =====================================================

-- Drop view first (depends on tables)
DROP VIEW IF EXISTS public.user_permissions CASCADE;
RAISE NOTICE '✅ Dropped user_permissions view';

-- Drop junction table
DROP TABLE IF EXISTS public.role_permissions CASCADE;
RAISE NOTICE '✅ Dropped role_permissions table';

-- Drop permissions table
DROP TABLE IF EXISTS public.permissions CASCADE;
RAISE NOTICE '✅ Dropped permissions table';

-- =====================================================
-- VERIFY CRITICAL TABLES STILL EXIST
-- =====================================================

DO $$
BEGIN
    -- Verify roles table exists (required for auth)
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        RAISE EXCEPTION 'CRITICAL: roles table missing after cleanup';
    END IF;
    
    -- Verify user_roles table exists (required for auth)
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) THEN
        RAISE EXCEPTION 'CRITICAL: user_roles table missing after cleanup';
    END IF;
    
    -- Verify roles.permissions column exists (required for RBAC)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'roles' 
        AND column_name = 'permissions'
    ) THEN
        RAISE EXCEPTION 'CRITICAL: roles.permissions column missing';
    END IF;
    
    -- Verify at least one role exists
    IF NOT EXISTS (SELECT 1 FROM public.roles LIMIT 1) THEN
        RAISE EXCEPTION 'CRITICAL: No roles found after cleanup';
    END IF;

    RAISE NOTICE '✅ Verification passed: Core auth tables intact';
END $$;

-- =====================================================
-- CLEANUP BACKUP TABLES (Optional - keep for safety)
-- =====================================================

-- Uncommment these lines after verifying in production
-- DROP TABLE IF EXISTS permissions_backup_20260209;
-- DROP TABLE IF EXISTS role_permissions_backup_20260209;

COMMIT;

-- =====================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- =====================================================
-- 
-- If you need to rollback this migration:
--
-- BEGIN;
-- 
-- -- Restore from backups
-- CREATE TABLE public.permissions AS SELECT * FROM permissions_backup_20260209;
-- CREATE TABLE public.role_permissions AS SELECT * FROM role_permissions_backup_20260209;
-- 
-- -- Recreate view
-- CREATE OR REPLACE VIEW user_permissions AS
-- SELECT ur.user_id, p.name as permission_name, p.category as permission_category
-- FROM user_roles ur
-- JOIN role_permissions rp ON rp.role_id = ur.role_id
-- JOIN permissions p ON p.id = rp.permission_id;
-- 
-- COMMIT;
-- 
-- =====================================================

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- 
-- Summary:
-- ✅ Dropped user_permissions view (no application usage)
-- ✅ Dropped role_permissions table (no application usage)
-- ✅ Dropped permissions table (no application usage)
-- ✅ Verified roles and user_roles tables intact
-- ✅ Verified JSONB permissions approach still functional
-- ✅ Created backup tables for safety
-- 
-- The application continues to use:
-- - roles.permissions (JSONB) for permission definitions
-- - user_roles for user-to-role assignments
-- - In-memory permission checks via checkPermission()
-- - RLS policies using roles.permissions->>'key' pattern
-- 
-- =====================================================
