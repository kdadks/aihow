import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function applyMigration() {
  try {
    console.log('📦 Reading migration file...');
    const migrationPath = join(
      process.cwd(),
      'supabase',
      'migrations',
      '20260210000000_create_referral_system.sql'
    );
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Applying referral system migration...');
    console.log('This may take a moment...\n');

    // Split the SQL into individual statements
    // The RPC function will execute the entire SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (error) {
      // If exec_sql doesn't exist, we'll need to use a different approach
      if (error.message.includes('function') || error.message.includes('exec_sql')) {
        console.log('⚠️  exec_sql function not available. Using alternative method...\n');

        // Try executing through the REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceRoleKey,
            'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          },
          body: JSON.stringify({ query: migrationSQL }),
        });

        if (!response.ok) {
          console.error('❌ Migration failed:', await response.text());
          process.exit(1);
        }

        console.log('✅ Migration applied successfully!');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Migration applied successfully!');
      if (data) {
        console.log('Result:', data);
      }
    }

    console.log('\n📊 Referral system tables created:');
    console.log('  ✓ tool_referrals');
    console.log('  ✓ tool_referral_analytics');
    console.log('  ✓ tool_referrals_summary (view)');
    console.log('\n🔒 RLS policies configured');
    console.log('🔧 RPC functions created:');
    console.log('  ✓ track_tool_referral');
    console.log('  ✓ get_referral_analytics');
    console.log('  ✓ get_tool_referral_stats');
    console.log('\n🎉 Referral system is ready to use!');
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

// Run the migration
applyMigration();
