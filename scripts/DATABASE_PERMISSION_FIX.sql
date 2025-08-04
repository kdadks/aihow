-- Database Permission Fix for MyContent Page
-- This script fixes RLS policies that might still reference the old 'users' table

-- First, check if there are any RLS policies on blog_posts that reference 'users' table
-- and update them to use auth.users() or profiles table instead

-- Drop any existing policies that might reference the old users table
DROP POLICY IF EXISTS "Users can only see their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can only edit their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can only delete their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable read access for own posts" ON blog_posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON blog_posts;
DROP POLICY IF EXISTS "Enable update for users based on author_id" ON blog_posts;
DROP POLICY IF EXISTS "Enable delete for users based on author_id" ON blog_posts;

-- Create new RLS policies that use auth.uid() instead of referencing users table
CREATE POLICY "Enable read access for own posts" ON blog_posts
  FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Enable insert for authenticated users only" ON blog_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable update for users based on author_id" ON blog_posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Enable delete for users based on author_id" ON blog_posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Also fix tool_reviews table policies if they exist
DROP POLICY IF EXISTS "Users can only see their own reviews" ON tool_reviews;
DROP POLICY IF EXISTS "Users can only edit their own reviews" ON tool_reviews;
DROP POLICY IF EXISTS "Users can only delete their own reviews" ON tool_reviews;
DROP POLICY IF EXISTS "Enable read access for own reviews" ON tool_reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tool_reviews;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON tool_reviews;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON tool_reviews;

-- Create new RLS policies for tool_reviews
CREATE POLICY "Enable read access for own reviews" ON tool_reviews
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON tool_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON tool_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON tool_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on both tables if not already enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_reviews ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tool_reviews TO authenticated;

-- Also grant usage on sequences if they exist
-- GRANT USAGE ON SEQUENCE blog_posts_id_seq TO authenticated;
-- GRANT USAGE ON SEQUENCE tool_reviews_id_seq TO authenticated;