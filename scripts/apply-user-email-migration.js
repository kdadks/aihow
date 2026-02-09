#!/usr/bin/env node

/**
 * Apply the get_all_users_with_emails migration to the database
 * This fixes the issue where admin panel shows incorrect email addresses
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 Applying migration: add_get_all_users_function.sql\n');
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, '../supabase/migrations/20260209000001_add_get_all_users_function.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    console.log('📄 Migration SQL loaded');
    console.log('🔄 Executing migration...\n');
    
    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: migrationSQL 
    });
    
    if (error) {
      // If exec_sql function doesn't exist, try direct execution
      console.log('⚠️  exec_sql function not found, trying direct execution via SQL Editor');
      console.log('\nPlease run the following SQL in your Supabase SQL Editor:\n');
      console.log('=' .repeat(80));
      console.log(migrationSQL);
      console.log('=' .repeat(80));
      console.log('\nOr copy the contents of:');
      console.log(`   ${migrationPath}`);
      console.log('\nInto your Supabase dashboard SQL Editor and execute it.');
      process.exit(0);
    }
    
    console.log('✅ Migration applied successfully!');
    console.log('\n📊 The following functions were created:');
    console.log('   • get_all_users_with_emails(page_number, page_size)');
    console.log('   • get_user_with_email(user_id)');
    console.log('\n✨ Admin panel will now display correct email addresses from the database.');
    
  } catch (error) {
    console.error('❌ Error applying migration:', error.message);
    console.error('\n📝 Please apply the migration manually:');
    console.error('   1. Open your Supabase Dashboard');
    console.error('   2. Go to SQL Editor');
    console.error('   3. Copy and paste the contents of:');
    console.error(`      ${join(__dirname, '../supabase/migrations/20260209000001_add_get_all_users_function.sql')}`);
    console.error('   4. Execute the SQL');
    process.exit(1);
  }
}

applyMigration();
