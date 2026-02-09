import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^e(eyJ)/, '$1');

console.log('=== Grant Admin Access ===\n');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function grantAdminAccess() {
  // List existing users
  console.log('Fetching users...\n');
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError || !users) {
    console.error('❌ Failed to list users:', listError?.message);
    rl.close();
    return;
  }

  console.log('Existing users:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
  });

  console.log('\n');
  const emailInput = await question('Enter the email address to grant admin access: ');

  if (!emailInput) {
    console.log('❌ Email is required');
    rl.close();
    return;
  }

  // Find the user
  const user = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());

  if (!user) {
    console.log(`❌ User with email "${emailInput}" not found`);
    rl.close();
    return;
  }

  console.log(`\n✅ Found user: ${user.email} (ID: ${user.id})`);

  // Check if roles table exists
  console.log('\n📊 Checking roles table...');
  const { data: rolesData, error: rolesError } = await supabase
    .from('roles')
    .select('id, name')
    .limit(5);

  if (rolesError) {
    console.log('⚠️  Roles table error:', rolesError.message);
    console.log('\nThe roles table might not exist or might have different structure.');
    console.log('Checking current user role assignment...\n');
  } else {
    console.log('✅ Roles table exists');
    console.log('Available roles:', rolesData.map(r => r.name).join(', '));
  }

  // Check current role
  console.log('\n📊 Checking current role for user...');
  const { data: currentRole, error: currentRoleError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id);

  if (currentRoleError) {
    console.log('❌ Error checking current role:', currentRoleError.message);
  } else if (currentRole && currentRole.length > 0) {
    console.log('Current role assignments:');
    currentRole.forEach(r => {
      console.log('  -', JSON.stringify(r, null, 2));
    });
  } else {
    console.log('⚠️  User has no role assignments');
  }

  // Try to find admin role
  console.log('\n🔍 Looking for admin role...');
  const { data: adminRoles, error: adminRoleError } = await supabase
    .from('roles')
    .select('id, name')
    .or('name.eq.admin,name.eq.system_admin,name.eq.content_admin');

  if (adminRoleError) {
    console.log('❌ Error finding admin roles:', adminRoleError.message);
    console.log('\nTrying alternative approach...');

    // Try to insert directly
    const confirm = await question('\nDo you want to try creating an admin role assignment? (y/n): ');

    if (confirm.toLowerCase() === 'y') {
      console.log('\nAttempting to create admin role assignment...');

      // First, let's check the structure of roles table
      const { data: rolesStructure } = await supabase
        .from('roles')
        .select('*')
        .limit(1);

      console.log('Roles table structure sample:', rolesStructure);

      // Try to find role_id = 1 or 3 (common admin role IDs)
      console.log('\nTrying to assign role_id = 3 (common admin role)...');

      const { data: insertData, error: insertError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role_id: 3,
          assigned_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,role_id'
        })
        .select();

      if (insertError) {
        console.log('❌ Failed to assign role:', insertError.message);
        console.log('\nYou may need to manually assign the role in Supabase dashboard.');
        console.log(`User ID: ${user.id}`);
        console.log('Table: user_roles');
        console.log('Set role_id to an admin role (usually 3)');
      } else {
        console.log('✅ Successfully assigned admin role!');
        console.log('Result:', insertData);
      }
    }
  } else if (adminRoles && adminRoles.length > 0) {
    console.log('✅ Found admin roles:', adminRoles.map(r => `${r.name} (ID: ${r.id})`).join(', '));

    const adminRole = adminRoles[0]; // Use first admin role found
    console.log(`\nAssigning role: ${adminRole.name} (ID: ${adminRole.id})`);

    // Delete existing role assignments for this user
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', user.id);

    // Insert new admin role
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: adminRole.id,
        assigned_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.log('❌ Failed to assign admin role:', insertError.message);
    } else {
      console.log('✅ Successfully assigned admin role!');
      console.log('Result:', insertData);
    }
  }

  console.log('\n✅ Done! User should now have admin access.');
  console.log('Please try logging in again.');

  rl.close();
}

grantAdminAccess().catch(error => {
  console.error('Error:', error);
  rl.close();
});
