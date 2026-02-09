-- ============================================================
-- Create case_studies table for success stories
-- ============================================================

CREATE TABLE IF NOT EXISTS case_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    subtitle VARCHAR(500),
    company_name VARCHAR(200) NOT NULL,
    company_logo TEXT,
    company_industry VARCHAR(100),
    company_size VARCHAR(50),
    featured_image TEXT,
    challenge TEXT NOT NULL,
    solution TEXT NOT NULL,
    results TEXT NOT NULL,
    testimonial TEXT,
    testimonial_author VARCHAR(200),
    testimonial_role VARCHAR(200),
    tools_used JSONB DEFAULT '[]'::JSONB,
    metrics JSONB DEFAULT '[]'::JSONB,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    published_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_company ON case_studies(company_name);

-- Trigger for updated_at
CREATE TRIGGER set_case_studies_updated_at
    BEFORE UPDATE ON case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published case studies are viewable by everyone"
    ON case_studies FOR SELECT
    USING (status = 'published');

-- Note: Admin management of case studies can be handled via Supabase Dashboard
-- or by using the service role key directly
