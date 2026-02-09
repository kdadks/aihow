import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Checking Existing Users ===\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Using service role key:', supabaseServiceKey ? 'Yes' : 'No');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

// Fix the service key if it has an extra 'e' at the beginning
const fixedServiceKey = supabaseServiceKey.startsWith('eeyJ')
  ? supabaseServiceKey.substring(1)
  : supabaseServiceKey;

if (fixedServiceKey !== supabaseServiceKey) {
  console.log('⚠️  Fixed service role key (removed extra "e" at the beginning)');
}

const supabase = createClient(supabaseUrl, fixedServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function checkUsers() {
  console.log('\n1. Checking profiles table...');

  try {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (profileError) {
      console.log('❌ Error fetching profiles:', profileError.message);
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`);
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ID: ${profile.id}`);
        console.log(`      Username: ${profile.username || 'N/A'}`);
        console.log(`      Full name: ${profile.full_name || 'N/A'}`);
        console.log(`      Created: ${profile.created_at}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log('❌ Exception checking profiles:', error.message);
  }

  console.log('\n2. Using Admin API to list auth users...');

  try {
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log('❌ Error listing users:', usersError.message);
    } else {
      console.log(`✅ Found ${users.length} auth users:`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. Email: ${user.email}`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
        console.log(`      Created: ${user.created_at}`);
        console.log(`      Last sign in: ${user.last_sign_in_at || 'Never'}`);
        console.log('');
      });

      // Check for unconfirmed emails
      const unconfirmed = users.filter(u => !u.email_confirmed_at);
      if (unconfirmed.length > 0) {
        console.log(`⚠️  ${unconfirmed.length} user(s) with unconfirmed emails:`);
        unconfirmed.forEach(u => console.log(`   - ${u.email}`));
      }
    }
  } catch (error) {
    console.log('❌ Exception listing users:', error.message);
  }

  console.log('\n3. Checking user_roles table...');

  try {
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(10);

    if (rolesError) {
      console.log('❌ Error fetching user roles:', rolesError.message);
    } else {
      console.log(`✅ Found ${userRoles.length} user role assignments:`);
      userRoles.forEach((role, index) => {
        console.log(`   ${index + 1}. User ID: ${role.user_id}`);
        console.log(`      Role: ${JSON.stringify(role)}`);
        console.log('');
      });
    }
  } catch (error) {
    console.log('❌ Exception checking user roles:', error.message);
  }
}

checkUsers().catch(console.error);
