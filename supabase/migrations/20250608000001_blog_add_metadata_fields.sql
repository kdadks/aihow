-- Add missing fields to blog_posts table to match TypeScript data structure

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS read_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_image TEXT,
ADD COLUMN IF NOT EXISTS author_credential VARCHAR(255),
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS date VARCHAR(50);

-- Add index for category filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Update the RLS policies to allow reading all these fields
-- (Public read access already exists for published posts)
