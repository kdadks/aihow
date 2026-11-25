# Supabase Database Migration Memory

This file records the migration procedure and current state for moving How2doAI data from the source Supabase project into the target project's `how2doai` schema.

## Project and repository references

- Source project ref: `bynlkphjpmxskoqiahow`
- Target project ref: `uyokvwgipoevdkinmhdj`
- Target app schema: `how2doai`
- Export script: `scripts/export-source-public.ps1`
- Exports: `supabase/exports/`
- The export directory is Git-ignored. Keep it that way: the Auth dump contains sensitive user records and password hashes.

## Migration checklist

### 1. Prepare and protect both projects

1. Confirm the source and target project refs in the Supabase dashboard before using either database connection.
2. Take a target backup and plan a source write-freeze/cutover window so data does not change during the final export.
3. Install PostgreSQL client tools (`pg_dump`, `pg_restore`, and `psql`); the current local installation is PostgreSQL 18.1.
4. Get connection details from each project's **Connect** panel. For `pg_dump`, use the source's Session pooler or a supported direct connection. For a pooler, the host is the pooler hostname and the username is typically `postgres.<project-ref>`; do not interchange them.
5. Never put a database password, service-role key, or full credential-bearing connection URI in source code, a command that gets saved to shell history, or this file. Use `-W` for interactive password entry. If a password has been exposed, rotate it.
6. Store the source `SOURCE_DATABASE_URL` only in the ignored local `.env.local`; preserve the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` entries there. The export script validates the source project ref, uses read-only transaction settings, and refuses to overwrite existing export files.

### 2. Export the source public schema and data

1. Archive or securely back up any existing export files before re-exporting. The script intentionally refuses to overwrite them.
2. From the repository root, run:

   ```powershell
   .\scripts\export-source-public.ps1
   ```

3. Confirm these outputs exist and are non-empty:
   - `supabase/exports/source-public-structure.sql`
   - `supabase/exports/source-public-data.sql`
4. The script exports source `public` tables, rewrites schema references to `how2doai`, and creates the structure and data files from the same read-only archive. It removes its temporary archive after successful export.

### 3. Export Auth users and identities

Auth records are separate from the public-schema export. Export them only if users must retain their existing account IDs/password hashes. Use the source connection details from Supabase; keep the password prompt private:

```powershell
pg_dump -W -h "<SOURCE_DB_HOST>" -p <PORT> -U "<SOURCE_DB_USER>" -d postgres --data-only --no-owner --no-acl -t auth.users -t auth.identities -f "D:\ITWala Projects\aihow\supabase\exports\source-auth-users.sql"
```

Verify the host and username separately in the source Connect panel. Do not use the project ref as the host unless Supabase explicitly shows it as the host.

### 4. Prepare the target schema

1. Confirm the target database is the intended project and the `how2doai` schema is empty or otherwise ready for this migration.
2. On a fresh target, import the structure **once**, before data. This file creates the tables, functions, constraints, views, and RLS policies:

   ```powershell
   psql "postgresql://<TARGET_DB_USER>@<TARGET_DB_HOST>:<PORT>/postgres" -W -X -v ON_ERROR_STOP=1 --single-transaction -f "D:\ITWala Projects\aihow\supabase\exports\source-public-structure.sql"
   ```

3. The structure export was made with `--no-acl`, so it does not supply the required SQL `GRANT`s. RLS policies and SQL privileges are separate requirements.
4. Do not import the structure file again into a populated schema. For retries, use a fresh/staging target or make an explicit, backed-up cleanup plan; do not blindly truncate or drop production data.

### 5. Import Auth records first

Public rows such as `audit_log` reference `auth.users`. Import Auth records before the public data:

```powershell
psql "postgresql://<TARGET_DB_USER>@<TARGET_DB_HOST>:<PORT>/postgres" -W -X -v ON_ERROR_STOP=1 --single-transaction -f "D:\ITWala Projects\aihow\supabase\exports\source-auth-users.sql"
```

This preserves user IDs referenced by public rows. Target Auth settings such as email templates, redirect URLs, OAuth providers, and SMTP configuration are not migrated by this dump and must be configured separately. Existing user sessions/tokens should not be assumed to carry over.

### 6. Import public data

1. A normal import may fail if the SQL data-file ordering encounters a foreign key before its referenced row. Always use `--single-transaction` so a failed import rolls back completely.
2. For this migration, the successful import used `session_replication_role = replica` to bypass FK triggers during the bulk load:

   ```powershell
   psql "postgresql://<TARGET_DB_USER>@<TARGET_DB_HOST>:<PORT>/postgres" -W -X -v ON_ERROR_STOP=1 --single-transaction --command="SET session_replication_role = replica" --file="D:\ITWala Projects\aihow\supabase\exports\source-public-data.sql"
   ```

3. This bypass is a recovery technique, not routine validation. It can allow orphan rows and skips trigger behavior. Use it only when the target role permits it, and perform the integrity checks below before declaring success. The setting is scoped to the `psql` connection; do not leave a persistent session using it.
4. Do not rerun a successful data import into the same populated schema: primary-key conflicts or duplicate data are expected.

### 7. Validate data and relationships

1. Compare target counts with source/export counts for key tables. The current export contained 12 `tool_categories_v2` rows; the imported snapshot had 257 `tools_v2` rows.
2. Check Auth row counts:

   ```sql
   SELECT count(*) AS users FROM auth.users;
   SELECT count(*) AS identities FROM auth.identities;
   ```

   The last recorded Auth import contained 8 users and 7 identities.
3. Check the two known cross-table relationships:

   ```sql
   SELECT count(*) AS orphaned_replies
   FROM how2doai.forum_replies r
   LEFT JOIN how2doai.forum_topics t ON t.id = r.topic_id
   WHERE r.topic_id IS NOT NULL AND t.id IS NULL;

   SELECT count(*) AS orphaned_audit_log_users
   FROM how2doai.audit_log a
   LEFT JOIN auth.users u ON u.id = a.user_id
   WHERE a.user_id IS NOT NULL AND u.id IS NULL;
   ```

   Both returned zero after the last import. These are spot checks, not a complete FK audit.
4. List every FK in the target schema and audit each relationship (especially because the successful bulk import bypassed FK triggers):

   ```sql
   SELECT conrelid::regclass AS child_table,
          conname,
          confrelid::regclass AS parent_table,
          convalidated
   FROM pg_constraint
   WHERE contype = 'f'
     AND connamespace = 'how2doai'::regnamespace
   ORDER BY 1, 2;
   ```

5. Record any missing parent rows and resolve them before cutover. Do not treat `convalidated = true` alone as proof that rows loaded while replication-role triggers were disabled were checked.

### 8. Enable the Supabase Data API safely

1. Add `how2doai` to the target project's **Exposed schemas** in the Supabase API settings. Direct project settings URL:
   `https://supabase.com/dashboard/project/uyokvwgipoevdkinmhdj/settings/api`
2. Grant only the privileges required by public app paths. For category/tool browsing, for example:

   ```sql
   GRANT USAGE ON SCHEMA how2doai TO anon, authenticated;
   GRANT SELECT ON TABLE
     how2doai.tool_categories_v2,
     how2doai.subcategories_v2,
     how2doai.tool_subcategories_v2,
     how2doai.tools_v2,
     how2doai.tools_v2_with_categories
   TO anon, authenticated;
   ```

   Add other tables only when a public feature needs them. Avoid blanket grants to every table; this schema also contains audit, analytics, profile, and user data.
3. Confirm RLS is enabled and the public read policies exist for `tool_categories_v2` and `subcategories_v2`. The structure export defines public SELECT policies for these tables. A SQL `GRANT` does not bypass RLS.
4. `tools_v2` has 257 rows with status `active`, while the exported public-read policy checks for `published`. The app queries `active`; add a matching policy or deliberately align the data/status policy:

   ```sql
   DROP POLICY IF EXISTS "Public can read active tools" ON how2doai.tools_v2;
   CREATE POLICY "Public can read active tools"
   ON how2doai.tools_v2
   FOR SELECT TO anon, authenticated
   USING (status = 'active');
   ```

5. If the API returns `PGRST106` / HTTP 406, the schema is not exposed. If it returns a permission error, check grants. If it returns no rows, check RLS policies, data, and status filters.

### 9. Point the app and deployment at the target

1. The frontend must use the target **Supabase API URL** and publishable key, not a PostgreSQL connection URI and never a service-role key.
2. The shared app client selects `how2doai`; `supabase/config.toml` only configures local Supabase development and does not expose the schema on the hosted project.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in every deployment environment (for example, Netlify), not only in local `.env.local`.
4. Smoke-test the home page category cards, directory filters, tool detail pages, authentication, and any intended public content pages. Test authenticated create/update paths separately under their intended RLS policies.
5. Run `npm run build` before deployment.

## Current migration state and remaining work

- Public structure and data exports exist in `supabase/exports/`; Auth export exists as `source-auth-users.sql`.
- Auth and public data imports completed. The public import required `session_replication_role = replica`.
- Verified orphan counts for forum replies and audit-log user references were both zero; a complete FK audit remains outstanding.
- The app is configured locally for the target Supabase URL and `how2doai` schema. The home page now renders the category section.
- The target Data API previously returned HTTP 406 `PGRST106`: only `public` and `graphql_public` were exposed. Expose `how2doai` and apply the scoped grants above before expecting browser queries to work.
- Local production builds have passed. A standalone TypeScript check previously hit `TS6310` in the project-reference configuration.
- Some legacy review screens still query `tools` / `tool_reviews`, while the imported schema contains `tools_v2` / `tool_reviews_v2`. Map those screens before considering every feature fully migrated.
