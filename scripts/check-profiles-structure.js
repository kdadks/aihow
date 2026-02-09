/**
 * Check profiles table structure
 */

import { createClient } from '@supabase/supabase-js';
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

async function checkProfiles() {
  console.log('🔍 Checking profiles table structure...\n');

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }

  if (profiles && profiles.length > 0) {
    console.log('✅ Profiles table columns:');
    console.log(Object.keys(profiles[0]));
  }

  // Check if user_role_assignments table exists
  const { data: roleAssignments, error: roleError } = await supabase
    .from('user_role_assignments')
    .select('*')
    .limit(1);

  if (!roleError) {
    console.log('\n✅ user_role_assignments table exists');
    if (roleAssignments && roleAssignments.length > 0) {
      console.log('   Columns:', Object.keys(roleAssignments[0]));
    }
  }

  // Check if user_roles table exists
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*')
    .limit(5);

  if (!rolesError) {
    console.log('\n✅ user_roles table exists');
    if (roles && roles.length > 0) {
      console.log('   Available roles:');
      roles.forEach(role => console.log(`   - ${role.name}`));
    }
  }
}

checkProfiles().catch(console.error);
