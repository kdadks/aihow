# Admin Login Issue Fix

This guide will help you resolve the 400 error when trying to login as an admin.

## Diagnosis

The 400 error when logging in typically indicates one of the following issues:

1. Admin user was not properly created in the `auth.users` table
2. Email confirmation status is not set correctly
3. Admin profile is missing in the `public.profiles` table
4. Admin role is not assigned correctly
5. Row Level Security (RLS) policies are preventing access
6. Password hashing issue or incorrect password

## Step 1: Verify the Admin Account

Run the verification script in the Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `verify_admin_login.sql`
4. Run the script and check the output for any issues

## Step 2: Fix the Admin Account

If issues were found, run the fix script:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `fix_admin_login.sql`
4. Run the script

This script will:
- Create or update the admin user with proper credentials
- Ensure email confirmation is set
- Create or fix the admin profile
- Assign the admin role
- Fix RLS policies that might prevent access

## Step 3: Try Logging In

After running the fix script:

1. Try logging in with:
   - Email: `admin@aihow.org`
   - Password: `AIhow@Admin2025`

2. If login still fails:
   - Check your browser console for specific error messages
   - Verify that you're using the correct Supabase URL and API keys
   - Make sure your frontend authentication code is working correctly

## Common Issues and Solutions

### 1. Incorrect Supabase Configuration

Make sure your environment variables are set correctly:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. CORS Issues

Check your Supabase project settings to ensure your domain is allowed in CORS settings.

### 3. Session Issues

If login works but you get logged out immediately:
- Check your token expiration settings
- Verify that session handling is working in your frontend code

### 4. Network Issues

- Confirm your application can access the Supabase API
- Check for any network errors in the browser console

## For Further Assistance

If you continue to experience issues after following these steps, please:

1. Check the Supabase logs for more information
2. Review the authentication code in your application
3. Contact support with specific error details
