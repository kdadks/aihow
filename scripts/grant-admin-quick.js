import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^e(eyJ)/, '$1');

console.log('=== Quick Grant Admin Access ===\n');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function grantAdmin() {
  const targetEmail = 'kdadks@outlook.com';

  console.log(`Finding user: ${targetEmail}...`);

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError || !users) {
    console.error('❌ Failed to list users:', listError?.message);
    return;
  }

  const user = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());

  if (!user) {
    console.log(`❌ User ${targetEmail} not found`);
    return;
  }

  console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

  // Check current role
  console.log('\n📊 Checking current role...');
  const { data: currentRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id);

  console.log('Current roles:', currentRole);

  // Delete existing roles
  console.log('\n🗑️  Removing old role assignments...');
  await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', user.id);

  // Assign admin role (role_id = 3 is typically admin)
  console.log('\n✨ Assigning admin role (role_id = 3)...');

  const { data: insertData, error: insertError } = await supabase
    .from('user_roles')
    .insert({
      user_id: user.id,
      role_id: 3,
      assigned_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    })
    .select();

  if (insertError) {
    console.log('❌ Failed to assign role:', insertError.message);

    // Try role_id = 1 as fallback
    console.log('\n🔄 Trying role_id = 1 as fallback...');
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: 1,
        assigned_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select();

    if (fallbackError) {
      console.log('❌ Fallback also failed:', fallbackError.message);
    } else {
      console.log('✅ Assigned role_id = 1');
      console.log('Result:', fallbackData);
    }
  } else {
    console.log('✅ Successfully assigned admin role!');
    console.log('Result:', insertData);
  }

  // Verify
  console.log('\n🔍 Verifying new role assignment...');
  const { data: newRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id);

  console.log('New roles:', newRole);

  console.log('\n✅ Done! User should now have admin access.');
  console.log('Please clear browser cache and try logging in again.');
}

grantAdmin().catch(console.error);
