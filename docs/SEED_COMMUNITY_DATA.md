# Seed Community Data - Setup Guide

This guide explains how to set up reviews, forums, and success stories (case studies) data for your application.

**✅ UPDATED**: All RLS policy issues have been fixed. The migrations have been simplified to use basic authentication checks. Admin management can be done via:
- Supabase Dashboard (has full access)
- Service role key (used by the seed script)
- Admin portal (when you're logged in as admin)

## Step 1: Apply Database Migrations

You need to run three migrations to create the necessary tables:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/project/bynlkphjpmxskoqiahow
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file and run them one by one:

   **Migration 1: Forum Tables**
   - File: `supabase/migrations/20250601_community.sql`
   - Creates: `forum_categories`, `forum_topics`, `forum_replies` tables

   **Migration 2: Reviews V2 Table**
   - File: `supabase/migrations/20250609000000_create_reviews_v2.sql`
   - Creates: `tool_reviews_v2` table

   **Migration 3: Case Studies Table**
   - File: `supabase/migrations/20250609000001_create_case_studies.sql`
   - Creates: `case_studies` table

5. After running each migration, verify the tables were created in the **Table Editor**

### Option B: Using Supabase CLI (if you have it installed)

```bash
cd "/Users/prashant/Documents/Application directory/AIhow"
supabase db push
```

## Step 2: Create a Sample User (for Forums)

Forum topics and replies require a user account. Create one first:

```bash
cd "/Users/prashant/Documents/Application directory/AIhow"
npx tsx scripts/create-sample-user.js
```

This creates a user with:
- Email: `community@aihow.org`
- Password: `Community@2025`

**Note**: Reviews and case studies don't require a user, so you can skip this if you only want those.

## Step 3: Run the Seed Script

Once all migrations are applied and you have a user, run the seed script:

```bash
npx tsx scripts/seed-community-data.js
```

### What Gets Seeded:

1. **Reviews** (~20-40 reviews)
   - 1-3 reviews per tool
   - Realistic ratings (3.5-5 stars)
   - Sample user names and avatars
   - Helpful/unhelpful counts
   - Verified purchase flags

2. **Forums** (~5 categories, ~8 topics, ~15 replies)
   - Categories: General, Tool Comparisons, Best Practices, Troubleshooting, Feature Requests
   - Sample discussion topics
   - Sample replies from community members

3. **Case Studies** (3 success stories)
   - Acme Corp: Content automation case study
   - TechStart: Customer support with AI chatbots
   - Design Co: Creative workflow transformation
   - Includes metrics, testimonials, and tools used

## Step 4: Verify the Data

After seeding, verify the data was created:

```bash
npx tsx scripts/check-tables.js
```

You should see:
- ✅ tool_reviews_v2 table exists with data
- ✅ forum_categories, forum_topics, forum_replies tables with data
- ✅ case_studies table with data

## Troubleshooting

### "Table does not exist" error

Make sure you've applied all three migrations first (Step 1).

### "Permission denied" error

Ensure your `.env` file has the correct `SUPABASE_SERVICE_ROLE_KEY` (not the anon key).

### Network connectivity issues

If you can't connect to Supabase, check:
1. Your internet connection
2. The Supabase project is running and not paused
3. The database URL and keys in `.env` are correct

## Next Steps

After seeding:
1. Reviews will appear on tool detail pages
2. Forum discussions will be visible on `/forum` routes
3. Case studies can be accessed via `/case-study/:slug` routes

## Admin Access

To manage this content through the admin panel:
- URL: http://localhost:5175/admin/login
- Email: `testadmin@aihow.org`
- Password: `AIhow@Admin2025`
