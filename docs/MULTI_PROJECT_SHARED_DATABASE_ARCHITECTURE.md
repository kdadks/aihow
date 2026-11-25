# Airtight Multi-Project Schema Isolation & Security Guide

## 1. Executive Summary & Security Mandate

### Context
- **Shared Infrastructure**: Single Supabase PostgreSQL database (`uyokvwgipoevdkinmhdj`).
- **Project 1 (Nirchal)**: Uses the `public` schema.
- **Project 2 (How2doAI)**: Uses the `how2doai` schema.
- **Auth**: Centralized `auth.users` pool managed by Supabase.

### Core Security Principle: Absolute Zero-Trust Isolation
> **Cross-schema access is strictly forbidden.**
> 
> A user belonging to How2doAI must **NEVER** be able to view, query, or modify any Nirchal data.
> A user belonging to Nirchal must **NEVER** be able to view, query, or modify any How2doAI data.
> Public/anonymous visitors to either application must **ONLY** see the public data belonging specifically to that application.

### Why You Do NOT Need to Migrate Nirchal Out of `public`
By creating a dedicated **`shared`** schema solely for tenant binding infrastructure (`shared.projects` and `shared.user_project_binding`):
1. **Nirchal's schema remains untouched**: No table renames, no migration risks, and zero downtime for Nirchal.
2. **Clean Separation**:
   - `auth`: Built-in Supabase Auth credentials.
   - `shared`: Internal project binding & validation functions.
   - `public`: Dedicated exclusively to Nirchal application tables.
   - `how2doai`: Dedicated exclusively to How2doAI application tables.

```
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Instance                      │
├──────────────┬──────────────┬───────────────┬───────────────┤
│    auth      │    shared    │    public     │   how2doai    │
│  (Supabase   │ (Tenant &    │   (Nirchal    │  (How2doAI    │
│  Identities) │  Bindings)   │  Application) │  Application) │
└──────────────┴──────────────┴───────────────┴───────────────┘
                                      ▲               ▲
                                      │  AIR-GAPPED   │
                                      └─── NO ACCESS ─┘
```

---

## 2. The 3-Tier Isolation Defense Model

To ensure security is absolute, isolation is enforced at three distinct layers:

```mermaid
graph TD
    subgraph Client Tier
        C1["How2doAI Frontend Client<br/>(db: { schema: 'how2doai' }, storageKey: 'auth_how2doai')"]
        C2["Nirchal Frontend Client<br/>(db: { schema: 'public' }, storageKey: 'auth_nirchal')"]
    end

    subgraph Auth & Identity Tier
        Auth["auth.users (Global User Pool)"]
        Binding["shared.user_project_binding<br/>(user_id is PRIMARY KEY: 1 user = 1 project)"]
        JWT["Signed JWT Claim:<br/>app_metadata.project_id"]
    end

    subgraph Database RLS Tier
        H2D["how2doai Schema Tables"]
        NIR["public Schema Tables (Nirchal)"]
    end

    C1 -->|Requests| H2D
    C2 -->|Requests| NIR

    Auth --> Binding
    Binding --> JWT

    H2D -->|Checks: shared.is_user_bound_to('how2doai')| Binding
    NIR -->|Checks: shared.is_user_bound_to('nirchal')| Binding

    C1 -.->|BLOCKED if attempting cross-call| NIR
    C2 -.->|BLOCKED if attempting cross-call| H2D
```

### Tier 1: Anonymous (Unauthenticated) Isolation
- **How2doAI Visitors**: When an unauthenticated visitor browses How2doAI, PostgREST requests target `how2doai`. The RLS policy on `how2doai.tools_v2` permits public viewing of active tools in How2doAI. It gives zero access to Nirchal.
- **Nirchal Visitors**: PostgREST requests target `public`. Private Nirchal tables do **not** grant access to `anon`. Unauthenticated users can never read private Nirchal records.

### Tier 2: Irreversible 1-to-1 User Project Binding
- In `shared.user_project_binding`, `user_id` is the **PRIMARY KEY**. A user can belong to **EXACTLY ONE** project. It is physically impossible in the database schema for a user to be bound to both projects.
- When a user registers in How2doAI, an automated database trigger tags their `app_metadata.project_id` and registers them into `shared.user_project_binding` as `'how2doai'`.
- When a user registers in Nirchal, they are permanently tagged as `'nirchal'`.
- Users **cannot edit** `app_metadata` from the frontend (Supabase Auth restricts `app_metadata` updates exclusively to the database/service role).

### Tier 3: Database Row-Level Security (RLS) Air-Gap
Every table in both schemas enforces strict RLS policies using `shared.is_user_bound_to(...)`:
- **If a Nirchal user attempts to query How2doAI**:
  `shared.is_user_bound_to('how2doai')` returns `FALSE`. The query returns 0 rows.
- **If a How2doAI user attempts to query Nirchal**:
  `shared.is_user_bound_to('nirchal')` returns `FALSE`. The query returns 0 rows.

---

## 3. Database Layer Implementation

The implementation is contained in:
- `supabase/migrations/20261125000000_multi_project_tenant_architecture.sql`
- `supabase/migrations/20261125000001_how2doai_project_rls_policies.sql`
- `supabase/scripts/nirchal_strict_isolation_policies.sql`

### 3.1. User Binding Table Definition
```sql
CREATE TABLE shared.user_project_binding (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES shared.projects(id) ON DELETE RESTRICT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.2. Air-Gap Helper Function
```sql
CREATE OR REPLACE FUNCTION shared.is_user_bound_to(target_project TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM shared.user_project_binding
        WHERE user_id = auth.uid() 
          AND project_id = target_project
    );
$$;
```

---

## 4. Implementation in This Project (`how2doai`)

### 4.1. Client Configuration (`src/lib/supabase.ts`)
```typescript
export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'auth_how2doai', // Isolated session storage
  },
  db: {
    schema: 'how2doai', // Bound to how2doai schema
  },
});
```

### 4.2. Signup Logic with Strict Project Binding
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
      project_id: 'how2doai', // Triggers permanent binding to how2doai
    },
  },
});
```

### 4.3. Session Verification Utility (`src/lib/multiProject.ts`)
```typescript
import { verifyCurrentProjectBinding, isHow2doaiAdmin } from './multiProject';

// Verify that the logged-in session belongs to How2doAI
const isAuthorized = await verifyCurrentProjectBinding();
if (!isAuthorized) {
  // Reject foreign session (e.g. Nirchal user attempting to log into How2doAI)
  await supabase.auth.signOut();
}
```

---

## 5. Step-by-Step Instructions for the Nirchal Project (`public`)

Follow these steps to configure the Nirchal project so that it is equally airtight.

### Step 1: Run the Central Architecture Migration
In the Supabase SQL Editor, run:
`supabase/migrations/20261125000000_multi_project_tenant_architecture.sql`

This creates the `shared` schema, the projects registry, the 1-to-1 user binding table, and the registration trigger.

### Step 2: Apply Strict RLS Policies on Nirchal Tables
In the Supabase SQL Editor, run the script provided in:
`supabase/scripts/nirchal_strict_isolation_policies.sql`

For every table in `public` owned by Nirchal, apply policies that check `shared.is_user_bound_to('nirchal')`:

```sql
-- Example for a private user table in Nirchal:
ALTER TABLE public.user_orders ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Only Nirchal users can view their records
CREATE POLICY "Nirchal user orders select"
ON public.user_orders FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id 
    AND shared.is_user_bound_to('nirchal')
);

-- 2. INSERT: Only Nirchal users can insert records
CREATE POLICY "Nirchal user orders insert"
ON public.user_orders FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id 
    AND shared.is_user_bound_to('nirchal')
);

-- 3. UPDATE: Only Nirchal users can update their records
CREATE POLICY "Nirchal user orders update"
ON public.user_orders FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id 
    AND shared.is_user_bound_to('nirchal')
)
WITH CHECK (
    auth.uid() = user_id 
    AND shared.is_user_bound_to('nirchal')
);

-- 4. DELETE: Only Nirchal users can delete their records
CREATE POLICY "Nirchal user orders delete"
ON public.user_orders FOR DELETE
TO authenticated
USING (
    auth.uid() = user_id 
    AND shared.is_user_bound_to('nirchal')
);
```

### Step 3: Revoke Public Anon Access on Private Nirchal Tables
Ensure unauthenticated users cannot read private Nirchal tables:
```sql
REVOKE ALL ON TABLE public.user_orders FROM anon;
```

### Step 4: Configure Nirchal's Client SDK
In Nirchal's application repository:

```typescript
// nirchal-app/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'auth_nirchal', // Isolate session storage from How2doAI
    },
    db: {
      schema: 'public', // Nirchal application tables live in public
    },
  }
);
```

### Step 5: User Signup & Email Confirmation in Nirchal
When a user signs up on Nirchal, pass `project_id: 'nirchal'` and dynamic `emailRedirectTo`:

```typescript
// nirchal-app/src/services/auth.ts
export async function signUpUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Directs the confirmation link specifically back to Nirchal
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
      data: {
        full_name: fullName,
        project_id: 'nirchal', // Permanently binds user to nirchal in shared.user_project_binding
      },
    },
  });

  if (error) throw error;
  return data;
}
```

### Step 6: Password Reset Request in Nirchal
When a user requests a password reset on Nirchal, pass dynamic `redirectTo`:

```typescript
// nirchal-app/src/services/auth.ts
export async function sendPasswordResetEmail(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    // Directs the password reset link specifically back to Nirchal
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
  return data;
}
```

### Step 7: Nirchal Email Confirmation Page (`/auth/confirm`)
Create the route handler in Nirchal to verify confirmation tokens:

```typescript
// nirchal-app/src/pages/AuthConfirmPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthConfirmPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type') as any;

        if (token_hash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({ token_hash, type });
          if (error) throw error;
        }

        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Verification failed');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {status === 'loading' && <p>Verifying your email address...</p>}
      {status === 'success' && <p className="text-green-600">Email confirmed successfully! Redirecting...</p>}
      {status === 'error' && <p className="text-red-600">{errorMsg}</p>}
    </div>
  );
}
```

### Step 8: Nirchal Password Reset Page (`/reset-password`)
Create the reset password page in Nirchal to update the user's password:

```typescript
// nirchal-app/src/pages/ResetPasswordPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event parsed from URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setError(null);
      }
    });

    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !window.location.hash.includes('access_token')) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      navigate('/login', { state: { message: 'Password updated successfully! Please log in.' } });
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleReset} className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-bold">Set New Password</h2>
        {error && <div className="rounded bg-red-50 p-3 text-red-600 text-sm">{error}</div>}
        <input
          type="password"
          placeholder="New password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border p-2"
        />
        <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
```

### Step 9: Supabase URL Allowlist Configuration
In the **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:

1. **Site URL**: `https://how2doai.com` (Default primary)
2. **Redirect URLs** (Add all frontend origins for both projects):
   - `https://how2doai.com/**`
   - `https://nirchal.com/**`
   - `http://localhost:5173/**` (How2doAI development)
   - `http://localhost:3000/**` (Nirchal development)

### Step 10: Custom HTML Email Templates via Netlify Functions (Zero Resend / Zero Sendgrid)
Instead of using Supabase's default email template or paying for Resend/SendGrid, you can use the **Supabase Send Email Auth Hook** connected to a Netlify Function (`netlify/functions/auth-email-hook.js`).

1. **How It Works**:
   - Supabase Auth intercepts signups and password resets and triggers your Netlify Function via HTTP POST.
   - The function inspects `user_metadata.project_id` to determine whether the request is from **How2doAI** or **Nirchal**.
   - It renders custom branded HTML (custom logo, colors, fonts, buttons).
   - It sends the email directly through your existing SMTP server (e.g. Hostinger SMTP / domain mail server) using `nodemailer`.

2. **To Enable in Supabase Dashboard**:
   - Go to **Authentication** -> **Hooks**.
   - Find **Send Email (auth hook)**.
   - Choose **HTTP Webhook**.
   - Set the Endpoint URL to: `https://your-app-domain.netlify.app/.netlify/functions/auth-email-hook`.
   - Save changes.

---

## 6. Verification & Security Audit Matrix

| Test Case | Attempted Action | Expected Result | Enforcement Layer |
| :--- | :--- | :--- | :--- |
| **Public Visitor on How2doAI** | Browses `how2doai.tools_v2` | Allowed (Active tools only) | RLS (`status = 'active'`) |
| **Public Visitor on How2doAI** | Attempts to query `public.<nirchal_table>` | **Blocked (0 rows / 401)** | RLS on Nirchal (No policy for `anon`) |
| **Nirchal User** | Logs into Nirchal and accesses Nirchal data | Allowed | RLS (`is_user_bound_to('nirchal')`) |
| **Nirchal User** | Attempts to query `how2doai.tools_v2` | **Blocked (0 rows)** | RLS (`is_user_bound_to('how2doai')`) |
| **Nirchal User** | Attempts to query `how2doai.profiles` or forum | **Blocked (0 rows / Error)** | RLS (`is_user_bound_to('how2doai')`) |
| **How2doAI User** | Attempts to query `public.<nirchal_table>` | **Blocked (0 rows / Error)** | RLS (`is_user_bound_to('nirchal')`) |
| **Tampering** | User attempts to change `project_id` in client | **Blocked** | Supabase Auth blocks client updates to `app_metadata` |
