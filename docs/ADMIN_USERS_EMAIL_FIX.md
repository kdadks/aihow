# Admin Users Email Fix

## Issue
When accessing `/admin/users`, the email addresses shown were incorrect. The admin panel was displaying generated email addresses (e.g., `username@example.com`) instead of the actual user email addresses from the database.

## Root Cause
The `userManagement` service was querying the `profiles` table directly, which doesn't contain email addresses. Email addresses are stored in the `auth.users` table in Supabase. The service was generating fake emails from usernames as a workaround.

## Solution

### 1. Database Functions Created
Created two new database functions to safely access user emails from `auth.users`:

- **`get_all_users_with_emails(page_number, page_size)`**
  - Returns paginated list of all users with their real email addresses
  - Joins `auth.users` with `profiles` table
  - Includes: id, email, username, full_name, created_at, updated_at, last_sign_in_at, is_active

- **`get_user_with_email(user_id)`**
  - Returns a single user with their real email address
  - Same structure as above but for a specific user

### 2. Service Layer Updated
Updated [src/admin/services/userManagement.ts](src/admin/services/userManagement.ts):

**Before:**
```typescript
email: `${user.username}@example.com`, // Generate email from username
```

**After:**
```typescript
email: user.email, // Use real email from auth.users
```

### 3. Additional Improvements
- Now uses real `last_sign_in_at` from `auth.users` instead of `updated_at` fallback
- Uses actual `is_active` status from database

## How to Apply the Migration

### Option 1: Via Supabase Dashboard (Recommended)
1. Open your Supabase Dashboard at https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Copy the contents of the migration file:
   ```
   supabase/migrations/20260209000001_add_get_all_users_function.sql
   ```
5. Paste into the SQL Editor
6. Click **Run**

### Option 2: Via Supabase CLI
If you need to apply multiple migrations:
```bash
cd "/Users/prashant/Documents/Application directory/AIhow"
supabase db push
```
When prompted, confirm with `Y`

### Option 3: Via Script
```bash
node scripts/apply-user-email-migration.js
```

## Verification

After applying the migration:

1. Log in to the admin portal at `/admin/login`
2. Navigate to `/admin/users`
3. Verify that correct email addresses are now displayed
4. Check that all user information (created_at, last_sign_in_at) is accurate

## Files Changed

### Created:
- [supabase/migrations/20260209000001_add_get_all_users_function.sql](supabase/migrations/20260209000001_add_get_all_users_function.sql)
- [scripts/apply-user-email-migration.js](scripts/apply-user-email-migration.js)
- [docs/ADMIN_USERS_EMAIL_FIX.md](docs/ADMIN_USERS_EMAIL_FIX.md) (this file)

### Modified:
- [src/admin/services/userManagement.ts](src/admin/services/userManagement.ts)
  - Updated `getUsers()` method
  - Updated `getUserById()` method

## Security Notes

Both database functions use `SECURITY DEFINER` which means they run with elevated privileges to access the `auth.users` table. Access control is handled by:
- Functions are only accessible to authenticated users
- Admin panel already requires admin role to access `/admin/users`
- No sensitive auth data (passwords, tokens) is exposed

## Testing

Test the fix by:
1. Creating a test user account with a known email
2. Logging in as admin
3. Navigate to `/admin/users`
4. Verify the correct email is displayed for the test user

## Rollback

If you need to rollback this change:
```sql
-- Drop the new functions
DROP FUNCTION IF EXISTS public.get_all_users_with_emails(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.get_user_with_email(UUID);
```

Then revert the changes to `src/admin/services/userManagement.ts` using git:
```bash
git checkout HEAD -- src/admin/services/userManagement.ts
```
