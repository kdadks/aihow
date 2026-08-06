#!/usr/bin/env node

import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing VITE_SUPABASE_URL in environment');
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'supabase', 'rls-audit');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function auditViaSupabase() {
  console.log('🔍 Auditing via Supabase Management API...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY);

  try {
    const { data, error } = await supabase
      .from('tables')
      .select('name, schema, rls_enabled, security_barrier, has_rls_policies')
      .eq('schema', 'public');

    if (error) {
      console.log('⚠️  Management API tables endpoint not available, falling back to direct SQL');
      return null;
    }

    const report = {
      timestamp: new Date().toISOString(),
      method: 'supabase-management-api',
      tables: data || [],
      missingRls: (data || []).filter(t => !t.rls_enabled),
      missingPolicies: (data || []).filter(t => t.rls_enabled && !t.has_rls_policies)
    };

    fs.writeFileSync(
      path.join(outputDir, 'rls-audit-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log(`✅ Audited ${data.length} tables via Management API`);
    console.log(`   - ${report.missingRls.length} tables without RLS`);
    console.log(`   - ${report.missingPolicies.length} tables with RLS but no policies`);
    return report;
  } catch (err) {
    console.log('⚠️  Management API failed, falling back to direct SQL');
    return null;
  }
}

async function auditViaDirectSql() {
  console.log('🔍 Auditing via direct SQL...');
  
  const connectionString = process.env.SUPABASE_DB_URL || 
    `${SUPABASE_URL?.replace('https://', 'postgresql://postgres:[YOUR_PASSWORD]@')}`;

  let conn;
  try {
    conn = new pg.Client({
      connectionString: process.env.SUPABASE_DB_URL,
      host: new URL(SUPABASE_URL).hostname.replace('.supabase.co', '.pooler.supabase.com'),
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      ssl: { rejectUnauthorized: false }
    });
    await conn.connect();
  } catch (err) {
    console.error('❌ Could not connect to database directly:', err.message);
    console.log('💡 Set SUPABASE_DB_URL or SUPABASE_DB_PASSWORD to enable direct SQL audit');
    process.exit(1);
  }

  try {
    const tablesResult = await conn.query(`
      SELECT 
        t.oid,
        t.relname AS table_name,
        t.relrowsecurity AS rls_enabled,
        t.relforcerowsecurity AS rls_forced,
        pg_catalog.array_to_string(pg_catalog.array_agg(DISTINCT polname), ', ') AS policies
      FROM pg_class t
      JOIN pg_namespace n ON n.oid = t.relnamespace
      LEFT JOIN pg_policy p ON p.polrelid = t.oid
      WHERE n.nspname = 'public'
        AND t.relkind = 'r'
      GROUP BY t.oid, t.relname, t.relrowsecurity, t.relforcerowsecurity
      ORDER BY t.relname
    `);

    const report = {
      timestamp: new Date().toISOString(),
      method: 'direct-sql',
      tables: tablesResult.rows.map(row => ({
        table_name: row.table_name,
        rls_enabled: row.rls_enabled,
        rls_forced: row.rls_forced,
        policies: row.policies ? row.policies.split(', ') : [],
        policy_count: row.policies ? row.policies.split(', ').filter(Boolean).length : 0
      })),
      missingRls: [],
      missingPolicies: []
    };

    for (const row of tablesResult.rows) {
      if (!row.rls_enabled) {
        report.missingRls.push({
          table_name: row.table_name,
          rls_enabled: row.rls_enabled,
          rls_forced: row.rls_forced
        });
      }
      if (row.rls_enabled && (!row.policies || row.policies.trim() === '')) {
        report.missingPolicies.push({
          table_name: row.table_name,
          rls_enabled: row.rls_enabled,
          rls_forced: row.rls_forced
        });
      }
    }

    fs.writeFileSync(
      path.join(outputDir, 'rls-audit-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log(`✅ Audited ${tablesResult.rows.length} tables via direct SQL`);
    console.log(`   - ${report.missingRls.length} tables without RLS`);
    console.log(`   - ${report.missingPolicies.length} tables with RLS but no policies`);

    if (report.missingRls.length > 0) {
      console.log('\n📋 Tables missing RLS:');
      report.missingRls.forEach(t => console.log(`   - ${t.table_name}`));
    }

    if (report.missingPolicies.length > 0) {
      console.log('\n📋 Tables with RLS but no policies:');
      report.missingPolicies.forEach(t => console.log(`   - ${t.table_name}`));
    }

    const migrationSql = generateMigrationSql(report);
    fs.writeFileSync(
      path.join(outputDir, 'rls-fix-migration.sql'),
      migrationSql
    );
    console.log(`\n✅ Generated migration SQL: ${path.join(outputDir, 'rls-fix-migration.sql')}`);

    return report;
  } finally {
    if (conn) await conn.end();
  }
}

function generateMigrationSql(report) {
  let sql = `-- =====================================================\n`;
  sql += `-- RLS AUDIT FIX MIGRATION\n`;
  sql += `-- Generated: ${report.timestamp}\n`;
  sql += `-- =====================================================\n\n`;
  sql += `BEGIN;\n\n`;

  for (const table of report.missingRls) {
    sql += `-- Enable RLS on ${table.table_name}\n`;
    sql += `ALTER TABLE public.${table.table_name} ENABLE ROW LEVEL SECURITY;\n\n`;
  }

  for (const table of report.missingPolicies) {
    sql += `-- Create policies for ${table.table_name}\n`;
    sql += generatePoliciesForTable(table.table_name);
    sql += `\n`;
  }

  sql += `COMMIT;\n`;
  return sql;
}

function generatePoliciesForTable(tableName) {
  const policies = {
    'profiles': `CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'roles': `CREATE POLICY "Authenticated can read roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert roles" ON public.roles FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can update roles" ON public.roles FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can delete roles" ON public.roles FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'permissions': `CREATE POLICY "Authenticated can read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert permissions" ON public.permissions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can update permissions" ON public.permissions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can delete permissions" ON public.permissions FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'user_roles': `CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can view all user roles" ON public.user_roles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'role_permissions': `CREATE POLICY "Authenticated can read role permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert role permissions" ON public.role_permissions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can update role permissions" ON public.role_permissions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can delete role permissions" ON public.role_permissions FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'user_role_assignments': `CREATE POLICY "Users can view own assignments" ON public.user_role_assignments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can view all assignments" ON public.user_role_assignments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Admin can manage assignments" ON public.user_role_assignments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'audit_logs': `CREATE POLICY "Admin can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);\n`,
    'system_settings': `CREATE POLICY "Public can read system settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'feature_flags': `CREATE POLICY "Public can read feature flags" ON public.feature_flags FOR SELECT USING (true);
CREATE POLICY "Admin can manage feature flags" ON public.feature_flags FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'content_items': `CREATE POLICY "Admin can manage content items" ON public.content_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);
CREATE POLICY "Public can read published content" ON public.content_items FOR SELECT USING (status = 'published');\n`,
    'moderation_queue': `CREATE POLICY "Admin can manage moderation queue" ON public.moderation_queue FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'page_visits': `CREATE POLICY "Anyone can track page visits" ON public.page_visits FOR INSERT WITH CHECK (session_id IS NOT NULL);\n`,
    'user_sessions': `CREATE POLICY "Anyone can create sessions" ON public.user_sessions FOR INSERT WITH CHECK (session_id IS NOT NULL);
CREATE POLICY "Anyone can update sessions" ON public.user_sessions FOR UPDATE USING (session_id IS NOT NULL);\n`,
    'page_analytics_summary': `CREATE POLICY "Authenticated can read analytics" ON public.page_analytics_summary FOR SELECT TO authenticated USING (true);\n`,
    'site_analytics_summary': `CREATE POLICY "Authenticated can read analytics" ON public.site_analytics_summary FOR SELECT TO authenticated USING (true);\n`,
    'tool_referrals': `CREATE POLICY "Anyone can track referrals" ON public.tool_referrals FOR INSERT WITH CHECK (session_id IS NOT NULL);\n`,
    'tool_referral_analytics': `CREATE POLICY "Authenticated can read analytics" ON public.tool_referral_analytics FOR SELECT TO authenticated USING (true);\n`,
    'tools_v2': `CREATE POLICY "Public can read tools" ON public.tools_v2 FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage tools" ON public.tools_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_categories_v2': `CREATE POLICY "Public can read categories" ON public.tool_categories_v2 FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.tool_categories_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'subcategories_v2': `CREATE POLICY "Public can read subcategories" ON public.subcategories_v2 FOR SELECT USING (true);
CREATE POLICY "Admin can manage subcategories" ON public.subcategories_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_subcategories_v2': `CREATE POLICY "Public can read tool subcategories" ON public.tool_subcategories_v2 FOR SELECT USING (true);
CREATE POLICY "Admin can manage tool subcategories" ON public.tool_subcategories_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_bundles_v2': `CREATE POLICY "Public can read bundles" ON public.tool_bundles_v2 FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own bundles" ON public.tool_bundles_v2 FOR ALL TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Admin can manage all bundles" ON public.tool_bundles_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_reviews_v2': `CREATE POLICY "Public can read reviews" ON public.tool_reviews_v2 FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create reviews" ON public.tool_reviews_v2 FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.tool_reviews_v2 FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can manage reviews" ON public.tool_reviews_v2 FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'case_studies': `CREATE POLICY "Public can read published case studies" ON public.case_studies FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage case studies" ON public.case_studies FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'blog_categories': `CREATE POLICY "Public can read blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage blog categories" ON public.blog_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
);\n`,
    'blog_posts': `CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL TO authenticated USING (author_id = auth.uid());
CREATE POLICY "Admin can manage all posts" ON public.blog_posts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
);\n`,
    'blog_post_categories': `CREATE POLICY "Public can read post categories" ON public.blog_post_categories FOR SELECT USING (true);
CREATE POLICY "Authors can manage own post categories" ON public.blog_post_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.blog_posts bp WHERE bp.id = blog_post_categories.post_id AND bp.author_id = auth.uid())
);
CREATE POLICY "Admin can manage all post categories" ON public.blog_post_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
);\n`,
    'forum_categories': `CREATE POLICY "Public can read forum categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage forum categories" ON public.forum_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'forum_topics': `CREATE POLICY "Public can read topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated can create topics" ON public.forum_topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update topics" ON public.forum_topics FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete topics" ON public.forum_topics FOR DELETE TO authenticated USING (auth.uid() = author_id);\n`,
    'forum_replies': `CREATE POLICY "Public can read replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated can create replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update replies" ON public.forum_replies FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete replies" ON public.forum_replies FOR DELETE TO authenticated USING (auth.uid() = author_id);\n`,
    'workflows': `CREATE POLICY "Public workflows are viewable" ON public.workflows FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own workflows" ON public.workflows FOR SELECT TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Users can create workflows" ON public.workflows FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY "Users can update own workflows" ON public.workflows FOR UPDATE TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Users can delete own workflows" ON public.workflows FOR DELETE TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Admin can manage all workflows" ON public.workflows FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_bundles': `CREATE POLICY "Public bundles are viewable" ON public.tool_bundles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own bundles" ON public.tool_bundles FOR SELECT TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Users can create bundles" ON public.tool_bundles FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
CREATE POLICY "Users can update own bundles" ON public.tool_bundles FOR UPDATE TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Users can delete own bundles" ON public.tool_bundles FOR DELETE TO authenticated USING (creator_id = auth.uid());
CREATE POLICY "Admin can manage all bundles" ON public.tool_bundles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'user_saved_items': `CREATE POLICY "Users can view own saved items" ON public.user_saved_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can save items" ON public.user_saved_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update saved items" ON public.user_saved_items FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete saved items" ON public.user_saved_items FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin can manage all saved items" ON public.user_saved_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'saved_bundles': `CREATE POLICY "Users can view own saved bundles" ON public.saved_bundles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert saved bundles" ON public.saved_bundles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update saved bundles" ON public.saved_bundles FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete saved bundles" ON public.saved_bundles FOR DELETE TO authenticated USING (user_id = auth.uid());\n`,
    'saved_workflows': `CREATE POLICY "Users can view own saved workflows" ON public.saved_workflows FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert saved workflows" ON public.saved_workflows FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update saved workflows" ON public.saved_workflows FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete saved workflows" ON public.saved_workflows FOR DELETE TO authenticated USING (user_id = auth.uid());\n`,
    'workflow_drafts': `CREATE POLICY "Users can view own workflow drafts" ON public.workflow_drafts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert workflow drafts" ON public.workflow_drafts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update workflow drafts" ON public.workflow_drafts FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete workflow drafts" ON public.workflow_drafts FOR DELETE TO authenticated USING (user_id = auth.uid());\n`,
    'user_settings': `CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own settings" ON public.user_settings FOR DELETE USING (auth.uid() = id);\n`,
    'auth_settings': `CREATE POLICY "Public can read auth settings" ON public.auth_settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage auth settings" ON public.auth_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_categories': `CREATE POLICY "Public can read tool categories" ON public.tool_categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage tool categories" ON public.tool_categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tools': `CREATE POLICY "Public can read tools" ON public.tools FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage tools" ON public.tools FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
);\n`,
    'tool_reviews': `CREATE POLICY "Public can read tool reviews" ON public.tool_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.tool_reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.tool_reviews FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own reviews" ON public.tool_reviews FOR DELETE TO authenticated USING (user_id = auth.uid());\n`,
    'admin_roles': `CREATE POLICY "Admin can manage admin roles" ON public.admin_roles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin'))
);\n`,
    'admin_users': `CREATE POLICY "Admin can view own profile" ON public.admin_users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Super admins can view all admin profiles" ON public.admin_users FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin'))
);\n`,
    'admin_sessions': `CREATE POLICY "Admins can manage own sessions" ON public.admin_sessions FOR ALL TO authenticated USING (admin_id = auth.uid());\n`,
  };

  if (policies[tableName]) {
    return policies[tableName];
  }

  return `-- TODO: Add policies for ${tableName}\n`;
}

async function main() {
  console.log('🚀 Starting RLS Audit...\n');
  
  let report = await auditViaSupabase();
  if (!report) {
    report = await auditViaDirectSql();
  }

  if (!report) {
    console.error('❌ Could not complete audit');
    process.exit(1);
  }

  console.log('\n📊 Audit Summary:');
  console.log(`   Total tables: ${report.tables.length}`);
  console.log(`   Missing RLS: ${report.missingRls.length}`);
  console.log(`   Missing policies: ${report.missingPolicies.length}`);

  if (report.missingRls.length === 0 && report.missingPolicies.length === 0) {
    console.log('\n✅ All tables have RLS enabled and policies defined!');
  } else {
    console.log('\n⚠️  Issues found. Generated migration SQL in supabase/rls-audit/rls-fix-migration.sql');
    console.log('   Review and apply it with: supabase migration up');
  }

  console.log('\n📁 Output files:');
  console.log(`   - ${path.join(outputDir, 'rls-audit-report.json')}`);
  if (report.missingRls.length > 0 || report.missingPolicies.length > 0) {
    console.log(`   - ${path.join(outputDir, 'rls-fix-migration.sql')}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
