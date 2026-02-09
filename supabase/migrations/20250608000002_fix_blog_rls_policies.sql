-- Fix blog_posts RLS policies to avoid users table permission issue

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;

-- Recreate public read policy (simplified)
CREATE POLICY "Public can read published posts"
    ON blog_posts FOR SELECT
    TO authenticated, anon
    USING (status = 'published');

-- Authors can CRUD their own posts (simplified)
CREATE POLICY "Authors can manage their own posts"
    ON blog_posts FOR ALL
    TO authenticated
    USING (auth.uid() = author_id);

-- Admins can manage all posts (simplified - check user metadata instead of users table)
CREATE POLICY "Admins can manage all posts"
    ON blog_posts FOR ALL
    TO authenticated
    USING (
        auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
        OR
        (auth.jwt() -> 'raw_user_meta_data' ->> 'role')::text = 'admin'
    );
