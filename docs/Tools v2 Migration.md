## Overview

Migration from static TypeScript data to fully database-driven implementation for tools, categories, and bundles.

## Timeline

- Development: 2 weeks
- Testing: 1 week
- Migration: 1 day (Big Bang)
- Cleanup: 1 week

## Required Files Structure

### Database Migrations

```sql
supabase/migrations/
├── 20250604181357_create_v2_schema.sql     # Create V2 tables with _v2 suffix
├── 20250604181358_migrate_v2_data.sql      # Migrate existing data
└── 20250604181359_cleanup_legacy.sql       # Drop legacy tables after successful migration
```

### Frontend Changes

```plaintext
src/
├── services/
│   └── api/
│       └── v2/
│           ├── tools/
│           │   ├── index.ts
│           │   └── types.ts
│           ├── categories/
│           │   ├── index.ts
│           │   └── types.ts
│           └── bundles/
│               ├── index.ts
│               └── types.ts
├── components/
│   └── directory/
│       └── v2/
│           ├── ToolCard.tsx
│           ├── CategoryList.tsx
│           └── BundleCard.tsx
└── types/
    ├── tool.types.ts
    ├── category.types.ts
    └── bundle.types.ts
```

## Database Schema Changes

### New Tables

1. Categories V2:

```sql
CREATE TABLE tool_categories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

2. Subcategories V2:

```sql
CREATE TABLE subcategories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_category_id UUID REFERENCES tool_categories_v2(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

3. Tools V2:

```sql
CREATE TABLE tools_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    website_url VARCHAR(500),
    features JSONB,
    limitations TEXT[],
    pricing JSONB,
    integrations TEXT[],
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

4. Tool-Subcategory Mapping:

```sql
CREATE TABLE tool_subcategories_v2 (
    tool_id UUID REFERENCES tools_v2(id),
    subcategory_id UUID REFERENCES subcategories_v2(id),
    PRIMARY KEY(tool_id, subcategory_id)
);
```

5. Bundles V2:

```sql
CREATE TABLE tool_bundles_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    implementation_steps TEXT[],
    total_cost VARCHAR(100),
    tools JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Implementation Steps

### 1. Database Setup (Day 1-2)

- Create V2 tables with suffix
- Set up indexes and constraints
- Configure RLS policies
- Create database functions and triggers

### 2. API Layer Development (Day 3-7)

- Create new API endpoints
- Implement data validation
- Add error handling
- Set up testing infrastructure

### 3. Frontend Components (Day 8-14)

- Create V2 versions of components
- Implement new features
- Add comprehensive testing
- Set up monitoring

### 4. Testing (Week 2)

- Unit tests for all new components
- Integration tests for API
- E2E testing scenarios
- Performance benchmarking

### 5. Migration Day (Big Bang Migration)

```bash
# Migration Steps
1. Take application offline (maintenance mode)
2. Backup existing database
3. Run V2 migrations
4. Verify data migration
5. Deploy V2 frontend
6. Run verification suite
7. Bring application online
```

### 6. Cleanup Week

- Remove legacy static data files
- Clean up old components
- Update documentation
- Monitor for issues

## Rollback Plan

### Quick Rollback (During Migration)

```bash
# If issues detected during migration:
1. Stop migration process
2. Restore database backup
3. Revert frontend code
4. Bring application online with legacy system
```

### Emergency Rollback (Post Migration)

```bash
# If critical issues detected after migration:
1. Enable maintenance mode
2. Execute rollback scripts
3. Verify system state
4. Resume with legacy system
```

## Files to Remove Post-Migration

```plaintext
src/data/categories.ts
src/data/tools.ts
src/data/workflows.ts
```

## Success Metrics

- Zero downtime during business hours
- All features functional post-migration
- Performance matches or exceeds legacy system
- No data loss or corruption
- All tests passing

## Post-Migration Monitoring

- API response times
- Database query performance
- Error rates
- User feedback
- System stability

## Future Improvements

- Add analytics tracking
- Implement caching layer
- Enhance search capabilities
- Add bulk operations API
- Improve performance monitoring

## Verification Steps

### Pre-Migration Verification

- Database backup verification
- Schema validation
- Data integrity checks
- Frontend build verification
- Test suite passing

### Migration Verification

- Schema migration success
- Data migration completion
- Foreign key constraints intact
- RLS policies applied
- API endpoints responding

### Post-Migration Verification

- All CRUD operations functional
- Performance metrics within bounds
- User sessions maintained
- Search functionality working
- Category navigation working
- Bundle creation/editing working </write_file>
