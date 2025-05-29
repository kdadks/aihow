-- Community Phase Migration
-- Implements forum categories, topics, replies with RLS policies and performance indexes

-- Create forum categories table
CREATE TABLE forum_categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    slug text NOT NULL UNIQUE,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create forum topics table
CREATE TABLE forum_topics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id uuid NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    views integer DEFAULT 0,
    is_pinned boolean DEFAULT false,
    is_locked boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create forum replies table
CREATE TABLE forum_replies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_reply_id uuid REFERENCES forum_replies(id) ON DELETE SET NULL,
    content text NOT NULL,
    is_solution boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Performance Indexes
CREATE INDEX idx_forum_categories_slug ON forum_categories(slug);
CREATE INDEX idx_forum_categories_order ON forum_categories(display_order);
CREATE INDEX idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX idx_forum_topics_views ON forum_topics(views DESC);
CREATE INDEX idx_forum_topics_created ON forum_topics(created_at DESC);
CREATE INDEX idx_forum_replies_topic ON forum_replies(topic_id);
CREATE INDEX idx_forum_replies_author ON forum_replies(author_id);
CREATE INDEX idx_forum_replies_parent ON forum_replies(parent_reply_id);
CREATE INDEX idx_forum_replies_created ON forum_replies(created_at);

-- Enable Row Level Security
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view categories"
    ON forum_categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage categories"
    ON forum_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Topics Policies
CREATE POLICY "Public can view topics"
    ON forum_topics FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create topics"
    ON forum_topics FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their topics"
    ON forum_topics FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Only authors and admins can delete topics"
    ON forum_topics FOR DELETE
    USING (
        auth.uid() = author_id 
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Replies Policies
CREATE POLICY "Public can view replies"
    ON forum_replies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create replies"
    ON forum_replies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their replies"
    ON forum_replies FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Only authors and admins can delete replies"
    ON forum_replies FOR DELETE
    USING (
        auth.uid() = author_id 
        OR EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Triggers for updated_at maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forum_categories_updated_at
    BEFORE UPDATE ON forum_categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at
    BEFORE UPDATE ON forum_topics
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
    BEFORE UPDATE ON forum_replies
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();