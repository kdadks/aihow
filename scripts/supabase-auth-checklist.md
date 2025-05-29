# Supabase Authentication Checklist

## 1. Email Authentication Settings

- [ ] Email authentication provider is enabled
- [ ] Email confirmation requirement matches your setup
- [ ] Email domain allowlist is correctly configured (if used)

## 2. Authentication API Settings

- [ ] Site URL is configured correctly
- [ ] Redirect URLs include your development URL (http://localhost:5177)
- [ ] CORS origins include your development URL (http://localhost:5177)

## 3. JWT Settings

- [ ] JWT expiry is set to a reasonable time (default 3600s/1hr)
- [ ] Service role key is valid
- [ ] Anon/public key is valid

## 4. Custom Email Templates

- [ ] If using custom email templates, check they are properly configured

## 5. Row Level Security (RLS)

- [ ] Proper RLS policies are enabled for the tables
- [ ] `auth.users` has necessary policies for login
- [ ] `public.profiles` has correct RLS policies
