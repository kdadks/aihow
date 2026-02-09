-- =====================================================
-- FIX PROFILES RLS POLICIES
-- =====================================================
-- Date: 2026-02-09
-- Purpose: Fix hanging profile queries by ensuring proper RLS policies
-- Issue: Admin login hangs when fetching profile data
-- =====================================================

BEGIN;

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile data" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-conflicting policies

-- SELECT: Any authenticated user can read any profile
CREATE POLICY "authenticated_users_select_profiles" 
  ON profiles FOR SELECT 
  TO authenticated
  USING (true);

-- INSERT: Users can only insert their own profile
CREATE POLICY "users_insert_own_profile" 
  ON profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own profile
CREATE POLICY "users_update_own_profile" 
  ON profiles FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can only delete their own profile
CREATE POLICY "users_delete_own_profile" 
  ON profiles FOR DELETE 
  TO authenticated
  USING (auth.uid() = id);

-- Verify policies created
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'authenticated_users_select_profiles'
    ) THEN
        RAISE EXCEPTION 'Failed to create SELECT policy on profiles';
    END IF;
    
    RAISE NOTICE '✅ Profile RLS policies fixed successfully';
END $$;

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- 
-- To verify policies are working:
-- 
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';
-- 
-- Should show:
-- - authenticated_users_select_profiles (SELECT, true, NULL)
-- - users_insert_own_profile (INSERT, NULL, auth.uid() = id)
-- - users_update_own_profile (UPDATE, auth.uid() = id, auth.uid() = id)
-- - users_delete_own_profile (DELETE, auth.uid() = id, NULL)
-- 
-- =====================================================
