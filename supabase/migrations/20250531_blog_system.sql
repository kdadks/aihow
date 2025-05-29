-- Create blog_categories table
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT blog_categories_name_check CHECK (char_length(trim(name)) > 0)
);

-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT blog_posts_title_check CHECK (char_length(trim(title)) > 0),
    CONSTRAINT blog_posts_content_check CHECK (char_length(trim(content)) > 0)
);

-- Create junction table for posts and categories
CREATE TABLE blog_post_categories (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (post_id, category_id)
);

-- Create indexes for performance optimization
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies

-- Public can read published posts
CREATE POLICY "Public can read published posts"
    ON blog_posts FOR SELECT
    USING (status = 'published');

-- Authors can CRUD their own posts
CREATE POLICY "Authors can manage their own posts"
    ON blog_posts FOR ALL
    USING (auth.uid() = author_id);

-- Admins can manage all posts
CREATE POLICY "Admins can manage all posts"
    ON blog_posts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Blog Categories Policies

-- Public can read categories
CREATE POLICY "Public can read categories"
    ON blog_categories FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
    ON blog_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Blog Post Categories Policies

-- Public can read post-category relationships
CREATE POLICY "Public can read post categories"
    ON blog_post_categories FOR SELECT
    TO authenticated, anon
    USING (true);

-- Authors can manage categories for their own posts
CREATE POLICY "Authors can manage their post categories"
    ON blog_post_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM blog_posts
            WHERE blog_posts.id = post_id
            AND blog_posts.author_id = auth.uid()
        )
    );

-- Admins can manage all post-category relationships
CREATE POLICY "Admins can manage all post categories"
    ON blog_post_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );