-- Fix role fetching and RLS policies
-- This migration addresses foreign key relationship and policy recursion issues

-- Step 1: Fix foreign key references
ALTER TABLE public.user_role_assignments 
  DROP CONSTRAINT IF EXISTS user_role_assignments_user_id_fkey;

ALTER TABLE public.user_role_assignments
  ADD CONSTRAINT user_role_assignments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Step 2: Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read role assignments" ON public.user_role_assignments;
DROP POLICY IF EXISTS "Allow users to read own assignments" ON public.user_role_assignments;

-- Step 3: Create properly scoped policies
CREATE POLICY "Users can read their assigned roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_role_assignments ura
      WHERE ura.role_id = user_roles.id
      AND ura.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own role assignments" ON public.user_role_assignments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Step 4: Add index to improve join performance
CREATE INDEX IF NOT EXISTS idx_role_assignments_user_role 
  ON public.user_role_assignments(user_id, role_id);

-- Notify about completion
DO $$
BEGIN
  RAISE NOTICE 'Role fetching fixes applied successfully.';
END $$;
