#!/usr/bin/env node
/**
 * Apply Database Migration to Supabase
 * Runs SQL migrations via Supabase REST API
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN_KEY;

if (!SUPABASE_URL || !SUPABASE_ADMIN_KEY) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_ADMIN_KEY environment variables');
  console.error('Please ensure:');
  console.error('  - VITE_SUPABASE_URL is set in .env');
  console.error('  - SUPABASE_ADMIN_KEY is set (can be found in Supabase project settings)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

async function applyMigration(filePath) {
  try {
    console.log(`\n📝 Reading migration: ${path.basename(filePath)}`);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log('🔄 Applying migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }

    console.log('✅ Migration applied successfully!');
    return true;
  } catch (err) {
    console.error('❌ Error applying migration:', err.message);
    return false;
  }
}

async function main() {
  const migrationFile = path.join(
    process.cwd(),
    'supabase/migrations/20260807_fix_analytics_functions_final.sql'
  );

  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    process.exit(1);
  }

  console.log('🚀 Starting migration application...');
  const success = await applyMigration(migrationFile);

  if (!success) {
    console.error('\n⚠️  Migration may have failed. Please verify in Supabase dashboard.');
    process.exit(1);
  }

  console.log('\n✨ All migrations applied successfully!');
  console.log('📊 Analytics functions are now ready to use.');
}

main();
