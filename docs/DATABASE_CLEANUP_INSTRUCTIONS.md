# Database Cleanup and Admin Creation Instructions

## Overview

This document provides step-by-step instructions for cleaning up all user data from the AIhow project database and creating a new admin user account. The project uses Supabase as the database backend with a complex schema including user authentication, content management, forums, blogs, tools directory, and workflows.

## Database Schema Summary

Based on the analysis, the database contains the following key tables with user data:

### Authentication Tables
- `auth.users` - Supabase auth users
- `public.profiles` - User profiles
- `public.user_roles` - User role assignments
- `public.roles` - Available roles (admin, user, moderator)
- `public.permissions` - System permissions
- `public.role_permissions` - Role-permission mappings

### Content Tables
- `public.blog_posts` - Blog posts with author references
- `public.blog_categories` - Blog categories
- `public.blog_post_categories` - Blog post-category mappings
- `public.forum_topics` - Forum topics with author references
- `public.forum_replies` - Forum replies with author references
- `public.forum_categories` - Forum categories
- `public.content_items` - CMS content items
- `public.content_versions` - Content version history
- `public.moderation_queue` - Content moderation queue

### Tools and Workflows
- `public.tools` - Tools directory
- `public.tool_categories` - Tool categories
- `public.tool_reviews` - User tool reviews
- `public.workflows` - User-created workflows
- `public.tool_bundles` - User-created tool bundles
- `public.user_saved_items` - User bookmarks/saves

### System Tables
- `public.activity_logs` - User activity tracking
- `public.audit_logs` - System audit logs
- `public.system_settings` - System configuration
- `public.feature_flags` - Feature flags
- `public.system_metrics` - System metrics

## Prerequisites

1. **Supabase Access**: You need admin access to the Supabase project
2. **Database Credentials**: From your `.env.local` file:
   - Supabase URL: `https://bynlkphjpmxskoqiahow.supabase.co`
   - Service Role Key: Required for admin operations
3. **Backup**: **IMPORTANT** - Create a backup before running cleanup scripts

## Step-by-Step Instructions

### Step 1: Create Database Backup (CRITICAL)

Before running any cleanup scripts, create a backup:

1. Go to Supabase Dashboard → Settings → Database
2. Click "Database Backups" 
3. Create a manual backup with a descriptive name like "pre-cleanup-backup-2025-01-07"
4. Wait for backup completion before proceeding

### Step 2: Access Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Create a new query

### Step 3: Choose Your Cleanup Method

You have three SQL scripts to choose from:

#### Option A: Safe Database Reset (Recommended)
**File:** `database_cleanup_safe.sql`

This script:
- ✅ Removes ALL user accounts and related data with error handling
- ✅ Safely handles missing tables and views
- ✅ Resets all tables to empty state
- ✅ Recreates roles and permissions
- ✅ Creates new admin user
- ✅ Re-enables all security policies safely
- ✅ Includes comprehensive error handling

**Use when:** You want a completely clean database with robust error handling.

#### Option B: Original Database Reset
**File:** `database_cleanup_and_admin_creation.sql`

This script:
- ✅ Removes ALL user accounts and related data
- ✅ Resets all tables to empty state
- ✅ Recreates roles and permissions
- ✅ Creates new admin user
- ✅ Re-enables all security policies
- ⚠️ Fixed RLS issue with user_role_assignments table

**Use when:** You want a completely clean database (original version with fixes).

#### Option C: Selective Management
**File:** `admin_user_management_queries.sql`

This script provides individual queries for:
- 🔍 Checking current database state
- 👥 Selective user cleanup (keeping admin)
- 👤 Creating admin user only
- 🔐 Updating admin password
- 🚨 Emergency admin reset

**Use when:** You want more control over what gets deleted.

### Step 4: Execute the Cleanup Script

#### For Complete Reset (Option A):

1. Copy the entire content of `database_cleanup_and_admin_creation.sql`
2. Paste it into the Supabase SQL Editor
3. Click "Run" to execute
4. Monitor the output for success messages
5. Look for the final verification queries showing the new admin user

#### For Selective Management (Option B):

1. Open `admin_user_management_queries.sql`
2. Copy and run individual queries as needed
3. Start with "QUERY 1: VERIFY CURRENT DATABASE STATE"
4. Use other queries based on your specific needs

### Step 5: Verify Results

After running the cleanup script, verify the results:

```sql
-- Check admin user was created
SELECT 
    u.id,
    u.email,
    u.is_super_admin,
    p.username,
    p.full_name,
    r.name as role_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@aihow.org';

-- Check data was cleaned
SELECT 
    'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'public.profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'public.blog_posts', COUNT(*) FROM public.blog_posts
UNION ALL
SELECT 'public.forum_topics', COUNT(*) FROM public.forum_topics;
```

### Step 6: Test Admin Login

After cleanup, test the admin login:

**Credentials:**
- Email: `admin@aihow.org`
- Password: `AIhowAdmin2025!`

**Important:** Change this password immediately after first login!

### Step 7: Update Admin Password

Use this query to update the admin password:

```sql
UPDATE auth.users 
SET encrypted_password = crypt('YourNewSecurePassword!', gen_salt('bf', 10)),
    updated_at = NOW()
WHERE email = 'admin@aihow.org';
```

## Security Considerations

### Row Level Security (RLS)
The cleanup script temporarily disables RLS to allow complete data deletion, then re-enables it. This is necessary because RLS policies would prevent deletion of user data.

### Password Security
- Default password: `AIhowAdmin2025!`
- **MUST be changed** after first login
- Use a strong, unique password
- Consider enabling 2FA if available

### Permission Verification
The admin user is created with all available permissions. Verify permissions are correctly assigned:

```sql
SELECT 
    r.name as role_name,
    p.name as permission_name,
    p.description
FROM public.roles r
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
WHERE r.name = 'admin'
ORDER BY p.category, p.name;
```

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Ensure you're using the service role key, not the anon key
   - Check that RLS is properly disabled before deletion

2. **"ALTER action DISABLE ROW SECURITY cannot be performed on relation" error**
   - This occurs when trying to disable RLS on views or non-existent tables
   - **Solution**: Use the `database_cleanup_safe.sql` script which handles this automatically
   - The error typically happens with `user_role_assignments` table which might be a view
   - Fixed by checking `table_type = 'BASE TABLE'` before RLS operations

3. **Admin user creation fails**
   - Check if email already exists
   - Verify roles table has correct structure
   - Use the emergency admin reset query

4. **RLS policy errors**
   - Ensure all tables have RLS re-enabled after cleanup
   - Check that policies reference the correct role structure

5. **Table does not exist errors**
   - Some tables might not exist in your specific database schema
   - **Solution**: Use the `database_cleanup_safe.sql` script which includes existence checks
   - The safe version will skip non-existent tables gracefully

### Emergency Admin Reset

If something goes wrong, use this emergency query:

```sql
-- Copy and run the "QUERY 7: EMERGENCY ADMIN RESET" 
-- from admin_user_management_queries.sql
```

### Recovery from Backup

If you need to restore from backup:

1. Go to Supabase Dashboard → Settings → Database
2. Find your backup in "Database Backups"
3. Click "Restore" next to your backup
4. Wait for restoration to complete

## Post-Cleanup Tasks

1. **Change admin password** - Use the application or SQL query
2. **Test admin login** - Verify authentication works
3. **Check permissions** - Ensure admin has all required permissions
4. **Update environment variables** - If needed for your application
5. **Test key functionality** - Verify the application works correctly

## File Descriptions

### `database_cleanup_and_admin_creation.sql`
- **Purpose**: Complete database reset with admin creation
- **Size**: ~400 lines
- **Sections**: 
  - RLS disable
  - Data deletion
  - Role/permission recreation
  - Admin user creation
  - RLS re-enable
  - Verification

### `admin_user_management_queries.sql`
- **Purpose**: Individual management queries
- **Size**: ~470 lines
- **Sections**:
  - Database state verification
  - Selective cleanup
  - Admin creation
  - Password management
  - Permission verification
  - Emergency reset

## Important Notes

- **BACKUP FIRST** - Always create a backup before running cleanup
- **Test Environment** - Consider running on a test database first
- **Downtime** - The cleanup process will cause temporary downtime
- **Irreversible** - User data deletion cannot be undone without backup
- **RLS Policies** - Ensure policies are correctly re-enabled after cleanup

## Support

If you encounter issues:
1. Check the Supabase logs for error details
2. Verify your service role key has proper permissions
3. Use the verification queries to check database state
4. Restore from backup if necessary

---

**Created:** January 7, 2025  
**For:** AIhow Project Database Cleanup  
**Supabase Project:** `bynlkphjpmxskoqiahow`