# Tools V2 Migration Plan

## Overview

Migration from static TypeScript data files to a fully database-driven implementation for tools, categories, and bundles. This replaces all `src/data/*.ts` static imports with Supabase-backed API calls using React Query for caching and loading state management.

## Current State

### Static Data Files (to be replaced)

| File | Contents | Size |
|------|----------|------|
| `src/data/tools.ts` | AI tool definitions with pricing, features, ratings | Large |
| `src/data/categories.ts` | Category and subcategory tree | Medium |
| `src/data/workflows.ts` | Workflow bundle definitions | Medium |
| `src/data/reviews.ts` | Static review data | Small |
| `src/data/questions.ts` | Recommendation assessment questions | Small |
| `src/data/community.ts` | Community static data | Small |
| `src/data/keywordPages.ts` | SEO keyword page data | Medium |

### Files That Import Static Data (27 import statements across 20 files)

**Pages (12 files):**
- `src/pages/SearchPage.tsx` — imports `tools`, `categories`
- `src/pages/DirectoryPage.tsx` — imports `tools`, `categories`
- `src/pages/ToolDetailPage.tsx` — imports `tools`, `categories`
- `src/pages/WorkflowsPage.tsx` — imports `workflowBundles`
- `src/pages/BundlePage.tsx` — imports `workflowBundles`
- `src/pages/BundleDetailPage.tsx` — imports `workflowBundles`
- `src/pages/SavedBundleDetailPage.tsx` — imports `workflowBundles`
- `src/pages/DashboardBundlesPage.tsx` — imports `workflowBundles`
- `src/pages/CategoriesPage.tsx` — imports `categories`
- `src/pages/ContactPage.tsx` — imports `workflowBundles`

**Components (8 files):**
- `src/components/layout/Header.tsx` — imports `categories`, `tools`
- `src/components/directory/SearchFilters.tsx` — imports `categories`
- `src/components/home/CategorySection.tsx` — imports `categories`
- `src/components/home/FeaturedTools.tsx` — imports `tools`
- `src/components/home/WorkflowSection.tsx` — imports `workflowBundles`
- `src/components/search/AutocompleteSearch.tsx` — imports `tools`, `categories`
- `src/components/bundles/BundleCreator.tsx` — imports `tools`, `workflowBundles`
- `src/components/bundles/EnterpriseWorkflowCreator.tsx` — imports `tools`, `workflowBundles`
- `src/components/recommendation/AssessmentForm.tsx` — imports `tools`
- `src/components/recommendation/RecommendationResults.tsx` — imports `tools`, `workflowBundles`

### Current Database Layer

Existing database ops in `src/database/tools.ts` query `tool_categories` and `tools` tables (legacy V1 schema). No V2 tables or migration SQL files exist yet.

---

## Timeline

| Phase | Duration | Details |
|-------|----------|---------|
| Phase 1: Database Setup | Day 1–2 | Create V2 tables, indexes, RLS, triggers |
| Phase 2: API Services | Day 3–5 | React Query hooks for tools, categories, bundles |
| Phase 3: Component Migration | Day 6–10 | Replace static imports in all 20 files |
| Phase 4: Testing | Day 11–14 | Unit, integration, E2E tests |
| Phase 5: Migration Day | Day 15 | Big Bang — seed data, deploy, verify |
| Phase 6: Cleanup | Day 16–21 | Remove static data files, cleanup |

**Total: ~3 weeks**

---

## Database Schema — V2 Tables

### 1. Categories V2

```sql
CREATE TABLE tool_categories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tool_categories_v2_slug ON tool_categories_v2(slug);
```

### 2. Subcategories V2

```sql
CREATE TABLE subcategories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_category_id UUID NOT NULL REFERENCES tool_categories_v2(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subcategories_v2_parent ON subcategories_v2(parent_category_id);
CREATE INDEX idx_subcategories_v2_slug ON subcategories_v2(slug);
```

### 3. Tools V2

```sql
CREATE TABLE tools_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    website_url VARCHAR(500),
    features JSONB DEFAULT '[]',
    limitations TEXT[],
    pricing JSONB DEFAULT '{}',
    integrations TEXT[],
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    trending BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tools_v2_slug ON tools_v2(slug);
CREATE INDEX idx_tools_v2_status ON tools_v2(status);
CREATE INDEX idx_tools_v2_featured ON tools_v2(featured) WHERE featured = true;
CREATE INDEX idx_tools_v2_trending ON tools_v2(trending) WHERE trending = true;
CREATE INDEX idx_tools_v2_name_search ON tools_v2 USING gin(to_tsvector('english', name || ' ' || coalesce(description, '')));
```

### 4. Tool–Subcategory Mapping

```sql
CREATE TABLE tool_subcategories_v2 (
    tool_id UUID NOT NULL REFERENCES tools_v2(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES subcategories_v2(id) ON DELETE CASCADE,
    PRIMARY KEY (tool_id, subcategory_id)
);

CREATE INDEX idx_tool_subcategories_v2_tool ON tool_subcategories_v2(tool_id);
CREATE INDEX idx_tool_subcategories_v2_sub ON tool_subcategories_v2(subcategory_id);
```

### 5. Bundles V2

```sql
CREATE TABLE tool_bundles_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    implementation_steps TEXT[],
    total_cost VARCHAR(100),
    tools JSONB NOT NULL DEFAULT '[]',
    category VARCHAR(100),
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tool_bundles_v2_slug ON tool_bundles_v2(slug);
CREATE INDEX idx_tool_bundles_v2_category ON tool_bundles_v2(category);
```

### 6. RLS Policies

```sql
-- Public read access
ALTER TABLE tool_categories_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON tool_categories_v2 FOR SELECT USING (true);

ALTER TABLE subcategories_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read subcategories" ON subcategories_v2 FOR SELECT USING (true);

ALTER TABLE tools_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active tools" ON tools_v2 FOR SELECT USING (status = 'active');

ALTER TABLE tool_subcategories_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tool subcategories" ON tool_subcategories_v2 FOR SELECT USING (true);

ALTER TABLE tool_bundles_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active bundles" ON tool_bundles_v2 FOR SELECT USING (status = 'active');

-- Admin write access (using existing role system)
CREATE POLICY "Admin manage categories" ON tool_categories_v2 FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_name = 'admin')
);
-- (repeat for each table)
```

### 7. Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON tool_categories_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subcategories_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tools_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tool_bundles_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Required Files Structure

### Database Migration Files

```
supabase/migrations/
├── 20250604181357_create_v2_schema.sql     # Create V2 tables, indexes, RLS
├── 20250604181358_migrate_v2_data.sql      # Seed data from static files
└── 20250604181359_cleanup_legacy.sql       # Drop legacy tables after verification
```

### API Service Layer

```
src/services/api/v2/
├── tools/
│   ├── index.ts          # React Query hooks: useTools, useTool, useSearchTools
│   └── types.ts          # ToolV2, PricingV2, FeatureV2 interfaces
├── categories/
│   ├── index.ts          # React Query hooks: useCategories, useCategory
│   └── types.ts          # CategoryV2, SubcategoryV2 interfaces
└── bundles/
    ├── index.ts          # React Query hooks: useBundles, useBundle
    └── types.ts          # BundleV2 interfaces
```

### Updated Type Definitions

```
src/types/
├── tool.types.ts         # Replace Tool.d.ts — V2 tool interface
├── category.types.ts     # Replace Category in index.ts — V2 category interface
└── bundle.types.ts       # New — V2 bundle interface
```

### V2 Directory Components (optional — can update existing)

```
src/components/directory/v2/
├── ToolCard.tsx          # V2 tool card with database-driven data
├── CategoryList.tsx      # V2 category navigation
└── BundleCard.tsx        # V2 bundle card
```

---

## Implementation Plan

### Phase 1: Database Setup (Day 1–2)

**Day 1:**
- [ ] Create `supabase/migrations/20250604181357_create_v2_schema.sql` with all 5 tables, indexes, RLS policies, and triggers
- [ ] Apply migration to local Supabase instance and verify schema
- [ ] Test RLS policies with anonymous and admin sessions

**Day 2:**
- [ ] Write data seeding script `supabase/migrations/20250604181358_migrate_v2_data.sql`
- [ ] Map `src/data/categories.ts` → `tool_categories_v2` + `subcategories_v2`
- [ ] Map `src/data/tools.ts` → `tools_v2` + `tool_subcategories_v2`
- [ ] Map `src/data/workflows.ts` → `tool_bundles_v2`
- [ ] Run seeding and verify record counts

---

### Phase 2: API Service Layer (Day 3–5)

**Create `src/types/tool.types.ts`:**
```typescript
export interface ToolV2 {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  website_url: string | null;
  features: string[];
  limitations: string[];
  pricing: PricingV2;
  integrations: string[];
  rating: number;
  review_count: number;
  trending: boolean;
  featured: boolean;
  status: 'active' | 'inactive' | 'pending';
  subcategories?: SubcategoryV2[];
  created_at: string;
  updated_at: string;
}

export interface PricingV2 {
  type: 'free' | 'freemium' | 'paid' | 'enterprise';
  starting_price?: string;
  has_free_option: boolean;
  tiers?: PricingTierV2[];
}

export interface PricingTierV2 {
  name: string;
  price: string;
  billing_period: string;
  features: string[];
}
```

**Create `src/types/category.types.ts`:**
```typescript
export interface CategoryV2 {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  subcategories?: SubcategoryV2[];
}

export interface SubcategoryV2 {
  id: string;
  parent_category_id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}
```

**Create `src/services/api/v2/categories/index.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CategoryV2 } from '@/types/category.types';

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async (): Promise<CategoryV2[]> => {
      const { data, error } = await supabase
        .from('tool_categories_v2')
        .select('*, subcategories_v2(*)')
        .order('display_order');
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
```

**Create `src/services/api/v2/tools/index.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ToolV2 } from '@/types/tool.types';

export const toolKeys = {
  all: ['tools'] as const,
  lists: () => [...toolKeys.all, 'list'] as const,
  list: (filters: object) => [...toolKeys.lists(), filters] as const,
  detail: (slug: string) => [...toolKeys.all, 'detail', slug] as const,
  featured: () => [...toolKeys.all, 'featured'] as const,
  trending: () => [...toolKeys.all, 'trending'] as const,
  search: (query: string) => [...toolKeys.all, 'search', query] as const,
};

export function useTools(params?: { categorySlug?: string; subcategorySlug?: string; limit?: number }) {
  return useQuery({
    queryKey: toolKeys.list(params ?? {}),
    queryFn: async (): Promise<ToolV2[]> => { /* ... */ },
  });
}

export function useTool(slug: string) {
  return useQuery({
    queryKey: toolKeys.detail(slug),
    queryFn: async (): Promise<ToolV2 | null> => { /* ... */ },
    enabled: !!slug,
  });
}

export function useFeaturedTools(limit = 6) {
  return useQuery({
    queryKey: toolKeys.featured(),
    queryFn: async (): Promise<ToolV2[]> => { /* ... */ },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchTools(query: string) {
  return useQuery({
    queryKey: toolKeys.search(query),
    queryFn: async (): Promise<ToolV2[]> => { /* ... */ },
    enabled: query.length > 1,
    debounce: 300,
  });
}
```

---

### Phase 3: Component Migration (Day 6–10)

Replace static imports with React Query hooks in all affected files:

#### Priority Order (highest traffic first):

1. **`src/components/layout/Header.tsx`** — Navigation depends on categories
   - Replace `import { categories }` with `const { data: categories } = useCategories()`
   - Replace `import { tools }` with `const { data: tools } = useSearchTools(query)`
   - Add loading skeleton for category nav

2. **`src/components/search/AutocompleteSearch.tsx`**
   - Replace static tool/category imports with React Query hooks
   - Add debounced search with `useSearchTools()`

3. **`src/pages/DirectoryPage.tsx`**
   - Replace `tools` with `useTools({ categorySlug, subcategorySlug })`
   - Replace `categories` with `useCategories()`
   - Add `Suspense` + skeleton loading states

4. **`src/pages/SearchPage.tsx`**
   - Replace static tools/categories with database queries
   - Update `generateAnswer` util to use dynamic data

5. **`src/pages/ToolDetailPage.tsx`**
   - Replace static tool lookup with `useTool(slug)`
   - Replace categories with `useCategories()`

6. **`src/components/home/FeaturedTools.tsx`**
   - Replace with `useFeaturedTools()`

7. **`src/components/home/CategorySection.tsx`**
   - Replace with `useCategories()`

8. **`src/components/home/WorkflowSection.tsx`**
   - Replace with `useBundles({ featured: true })`

9. **`src/pages/WorkflowsPage.tsx`**
   - Replace with `useBundles()`

10. **`src/pages/BundlePage.tsx`**, **`BundleDetailPage.tsx`**, **`SavedBundleDetailPage.tsx`**
    - Replace with `useBundles()` / `useBundle(id)`

11. **`src/components/bundles/BundleCreator.tsx`**
    - Replace with `useTools()` for tool selection

12. **`src/components/bundles/EnterpriseWorkflowCreator.tsx`**
    - Replace with `useTools()` + `useBundles()`

13. **`src/components/directory/SearchFilters.tsx`**
    - Replace with `useCategories()`

14. **`src/pages/CategoriesPage.tsx`**
    - Replace with `useCategories()`

15. **`src/pages/DashboardBundlesPage.tsx`**
    - Replace with user-specific bundle queries

16. **`src/pages/ContactPage.tsx`**
    - Replace with `useBundles()` (minor usage)

17. **`src/components/recommendation/AssessmentForm.tsx`**
18. **`src/components/recommendation/RecommendationResults.tsx`**
    - Replace tool imports with `useTools()`

#### Loading State Pattern for Each Component:

```tsx
// Before (static):
import { tools } from '../data/tools';

// After (database-driven):
import { useTools } from '@/services/api/v2/tools';

function Component() {
  const { data: tools = [], isLoading, error } = useTools();

  if (isLoading) return <ToolsSkeleton />;
  if (error) return <ErrorFallback error={error} />;

  return <ToolsList tools={tools} />;
}
```

---

### Phase 4: Testing (Day 11–14)

- [ ] Unit tests for all new React Query hooks
- [ ] Integration tests for Supabase queries
- [ ] E2E tests for directory, search, and tool detail flows
- [ ] Performance benchmarking (compare static vs DB load times)
- [ ] Test with empty database state (graceful fallback)

---

### Phase 5: Migration Day — Big Bang (Day 15)

```bash
# Migration Steps
1. Enable maintenance mode / deploy loading page
2. Backup existing database (supabase db dump)
3. Apply V2 schema migration (20250604181357_create_v2_schema.sql)
4. Run data seeding (20250604181358_migrate_v2_data.sql)
5. Verify record counts match static data
6. Deploy V2 frontend build
7. Run smoke tests on all critical paths
8. Re-enable production traffic
9. Monitor error rates for 24 hours
```

---

### Phase 6: Cleanup (Day 16–21)

- [ ] Remove `src/data/categories.ts`
- [ ] Remove `src/data/tools.ts`
- [ ] Remove `src/data/workflows.ts`
- [ ] Remove unused `src/data/reviews.ts` (if migrated)
- [ ] Update `src/database/tools.ts` to use V2 tables
- [ ] Remove V1 `tool_categories` and `tools` table references
- [ ] Apply `20250604181359_cleanup_legacy.sql` to drop legacy tables
- [ ] Update all TypeScript types to remove legacy interfaces

---

## Rollback Plan

### Quick Rollback (During Migration)

```bash
# If issues detected during migration:
1. Stop migration process
2. Restore database from backup
3. Revert frontend deployment to previous build
4. Bring application online with legacy system
5. Document failure cause
```

### Emergency Rollback (Post Migration)

```bash
# If critical issues detected after migration:
1. Enable maintenance mode
2. Redeploy previous frontend build (Git revert)
3. Verify legacy static data still intact
4. Resume with legacy system while investigating
```

### Feature Flag Option (Safer Alternative)

Instead of Big Bang, use a feature flag to gradually migrate:

```typescript
// src/config/featureFlags.ts
export const USE_V2_API = import.meta.env.VITE_USE_V2_API === 'true';

// In components:
const { data: tools } = USE_V2_API ? useToolsV2() : { data: staticTools };
```

This allows per-component rollback without full deployment.

---

## Success Metrics

- [ ] Zero data loss — all static tool/category/bundle records in database
- [ ] Zero downtime during business hours
- [ ] All 20 affected files migrated from static imports
- [ ] Page load time ≤ current (with React Query caching)
- [ ] All tests passing (unit, integration, E2E)
- [ ] No console errors in production for 48 hours post-migration

---

## Post-Migration Monitoring

- API response times (Supabase dashboard)
- React Query cache hit rates
- Database query performance (slow query logs)
- Error rates (console errors, Supabase logs)
- User-facing 404s on tool/category pages

---

## Files to Remove Post-Migration

```
src/data/categories.ts
src/data/tools.ts
src/data/workflows.ts
src/data/reviews.ts       (if migrated to tool_reviews table)
```

---

## Future Improvements (Post V2)

- Admin UI for managing tools/categories directly in the app
- Full-text search via Supabase `pg_trgm` extension
- Tool submission workflow (user-submitted tools with moderation)
- Analytics tracking on tool views and clicks
- Caching layer with Redis/Upstash for high-traffic queries
- Bulk import/export API for tool data management
- Image/logo storage via Supabase Storage
