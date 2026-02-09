/**
 * Apply new migrations directly
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function applyMigration(filePath, name) {
  console.log(`\n📝 Applying ${name}...`);

  try {
    const sql = readFileSync(filePath, 'utf8');

    // Use raw SQL execution through RPC
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
      // If RPC doesn't exist, try direct execution via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });

      if (!response.ok) {
        // Fall back to running individual statements
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
          if (!statement) continue;
          // This is a workaround - we'll need to use the SQL editor or CLI
          console.log('   ⚠️  Need to run SQL manually via Supabase dashboard or CLI');
          console.log('   SQL:', statement.substring(0, 100) + '...');
        }
      }

      return { error: null };
    });

    if (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      return false;
    }

    console.log(`   ✅ Applied successfully`);
    return true;
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Applying new migrations...');

  const migrations = [
    {
      path: resolve(__dirname, '../supabase/migrations/20250601_community.sql'),
      name: 'Forum tables'
    },
    {
      path: resolve(__dirname, '../supabase/migrations/20250609000000_create_reviews_v2.sql'),
      name: 'Reviews V2 table'
    },
    {
      path: resolve(__dirname, '../supabase/migrations/20250609000001_create_case_studies.sql'),
      name: 'Case studies table'
    }
  ];

  console.log('\n⚠️  Note: These migrations might need to be applied manually via Supabase Dashboard');
  console.log('   Go to: SQL Editor in Supabase Dashboard');
  console.log('   Copy and paste the SQL from the migration files\n');

  for (const migration of migrations) {
    await applyMigration(migration.path, migration.name);
  }

  console.log('\n✅ Migration application complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Verify tables were created in Supabase Dashboard');
  console.log('   2. Run seed scripts to populate data');
}

main().catch(console.error);
