
# Supabase Authentication Troubleshooting Checklist

Follow this checklist to resolve the 400 Bad Request authentication issues.

## 1. Run the Fixed SQL Scripts

- [ ] Run `quick_admin_fix.sql` in Supabase SQL Editor
- [ ] Verify there are no errors in the script output
- [ ] Check the NOTICE messages for confirmation of successful updates

## 2. Create a Test User to Verify Auth System

- [ ] Run `create_test_user.sql` in Supabase SQL Editor
- [ ] Try logging in with test@example.com / password123
- [ ] If test user can log in but admin cannot, the issue is specific to the admin account

## 3. Check Authentication Provider Configuration

Go to Supabase Dashboard → Authentication → Providers:

- [ ] Ensure "Email" provider is enabled
- [ ] Make sure "Confirm email" is turned OFF (for testing purposes)
- [ ] Check that "Secure email change" is disabled (for testing)

## 4. Verify URL Configuration

Go to Supabase Dashboard → Authentication → URL Configuration:

- [ ] Site URL is set to http://localhost:5177 (for development)
- [ ] Redirect URLs include:
  - [ ] http://localhost:5177
  - [ ] http://localhost:5177/
  - [ ] http://localhost:5177/login
  - [ ] http://localhost:5177/auth/callback

## 5. Check CORS Configuration

Go to Supabase Dashboard → API → CORS Origins:

- [ ] http://localhost:5177
- [ ] http://localhost:5177/ (with trailing slash)
- [ ] * (if you're just testing and want to allow all origins temporarily)

## 6. Inspect Auth Database Tables

In SQL Editor, run these commands to check the admin account state:

```sql
-- Check if admin exists in auth.users
SELECT * FROM auth.users WHERE email = 'admin@aihow.org';

-- Check if email is confirmed
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'admin@aihow.org';

-- Check if profile exists
SELECT * FROM public.profiles WHERE username = 'admin@aihow.org';

-- Check admin role assignment
SELECT r.name 
FROM public.user_roles ur
JOIN public.roles r ON ur.role_id = r.id
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'admin@aihow.org';
```

## 7. Frontend Configuration Check

In your codebase, check:

- [ ] Supabase URL is correct in `.env` or environment variables
- [ ] Supabase Anon Key is correct in `.env` or environment variables
- [ ] No CORS issues in browser developer console
- [ ] Auth provider is properly importing Supabase client

## 8. Browser-Side Troubleshooting

- [ ] Clear browser cookies and cache
- [ ] Try in an incognito/private window
- [ ] Check browser console for specific error messages
- [ ] Try with a different browser

## 9. Common Error Solutions

### 400 Bad Request - Invalid Credentials

This usually means:
- Password hash is incorrect
- Email is not confirmed
- User doesn't exist in auth.users table
- There's a mismatch between auth.users and public.profiles

### 400 Bad Request - Email not confirmed

- Run SQL to set `email_confirmed_at` to the current time

### 500 Server Error

- Check Supabase logs for backend issues
- Verify database permissions are correct

## 10. Last Resort Options

If nothing else works:

- [ ] Delete the admin user completely and recreate from scratch
- [ ] Disable RLS temporarily for testing
- [ ] Reset the Supabase JWT secret (caution: logs out all users)
- [ ] Contact Supabase support with your specific error details
