#!/usr/bin/env node

/**
 * Setup Admin Database Script
 * 
 * This script directly applies the admin user creation migrations
 * and creates the admin user via direct SQL execution.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin Supabase client
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@aihow.org';
const ADMIN_PASSWORD = 'AdminPass123!';
const ADMIN_NAME = 'System Administrator';

async function runMigrationSQL() {
  console.log('🔧 Running admin user migration SQL...');
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250601000001_create_admin_user.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await adminSupabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If the RPC doesn't exist, we'll try a different approach
      console.log('ℹ️  Direct SQL execution via RPC not available, trying alternative approach...');
      return false;
    }
    
    console.log('✅ Migration SQL executed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to execute migration SQL:', error.message);
    return false;
  }
}

async function checkAdminRole() {
  console.log('🔍 Checking if admin role exists...');
  
  try {
    const { data, error } = await adminSupabase
      .from('roles')
      .select('id, name')
      .eq('name', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Failed to check admin role:', error.message);
      return false;
    }
    
    if (data) {
      console.log('✅ Admin role exists with ID:', data.id);
      return true;
    } else {
      console.log('⚠️  Admin role not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking admin role:', error.message);
    return false;
  }
}

async function createAdminUser() {
  console.log(`\n🔧 Creating admin user: ${ADMIN_EMAIL}...`);
  
  try {
    // Create user via Admin API
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_NAME,
        role: 'admin'
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  User already exists, finding existing user...');
        
        const { data: users, error: listError } = await adminSupabase.auth.admin.listUsers();
        if (listError) {
          console.error('❌ Failed to list users:', listError.message);
          return null;
        }
        
        const existingUser = users.users.find(u => u.email === ADMIN_EMAIL);
        if (existingUser) {
          console.log('✅ Found existing user:', existingUser.id);
          return existingUser;
        } else {
          console.error('❌ User exists but could not be found');
          return null;
        }
      } else {
        console.error('❌ Failed to create admin user:', error.message);
        return null;
      }
    }
    
    if (data?.user) {
      console.log('✅ Admin user created successfully!');
      console.log(`   User ID: ${data.user.id}`);
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return null;
  }
}

async function setupAdminProfile(userId) {
  console.log(`\n⚙️  Setting up admin profile for user ${userId}...`);
  
  try {
    // First, ensure the profile exists
    const { data: existingProfile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('❌ Failed to check profile:', profileError.message);
      return false;
    }
    
    if (!existingProfile) {
      // Create profile
      const { error: insertError } = await adminSupabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: ADMIN_NAME,
          username: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('❌ Failed to create profile:', insertError.message);
        return false;
      }
      
      console.log('✅ Admin profile created');
    } else {
      console.log('✅ Admin profile already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up profile:', error.message);
    return false;
  }
}

async function assignAdminRole(userId) {
  console.log(`\n👑 Assigning admin role to user ${userId}...`);
  
  try {
    // Get admin role ID
    const { data: roleData, error: roleError } = await adminSupabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();
    
    if (roleError) {
      console.error('❌ Failed to get admin role:', roleError.message);
      return false;
    }
    
    if (!roleData) {
      console.error('❌ Admin role not found');
      return false;
    }
    
    // Check if role assignment already exists
    const { data: existingAssignment, error: assignmentError } = await adminSupabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', roleData.id)
      .single();
    
    if (assignmentError && assignmentError.code !== 'PGRST116') {
      console.error('❌ Failed to check role assignment:', assignmentError.message);
      return false;
    }
    
    if (!existingAssignment) {
      // Assign admin role
      const { error: insertError } = await adminSupabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleData.id,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('❌ Failed to assign admin role:', insertError.message);
        return false;
      }
      
      console.log('✅ Admin role assigned');
    } else {
      console.log('✅ Admin role already assigned');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error assigning admin role:', error.message);
    return false;
  }
}

async function verifyAdminSetup(userId) {
  console.log(`\n🔍 Verifying admin setup for ${userId}...`);
  
  try {
    // Check user in auth.users
    const { data: userData, error: userError } = await adminSupabase.auth.admin.getUserById(userId);
    if (userError) {
      console.error('❌ User not found in auth.users');
      return false;
    }
    
    // Check profile
    const { data: profileData, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id, full_name, username')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('❌ Profile not found');
      return false;
    }
    
    // Check role assignment
    const { data: roleData, error: roleError } = await adminSupabase
      .from('user_roles')
      .select(`
        roles (
          name,
          role_permissions (
            permissions (name)
          )
        )
      `)
      .eq('user_id', userId);
    
    if (roleError) {
      console.error('❌ Role assignment not found');
      return false;
    }
    
    const adminRole = roleData.find(ur => ur.roles?.name === 'admin');
    if (!adminRole) {
      console.error('❌ Admin role not assigned');
      return false;
    }
    
    console.log('📊 Admin Setup Verification:');
    console.log(`   ✅ User: ${userData.user.email}`);
    console.log(`   ✅ Profile: ${profileData.full_name} (@${profileData.username})`);
    console.log(`   ✅ Role: ${adminRole.roles.name}`);
    console.log(`   ✅ Permissions: ${adminRole.roles.role_permissions?.length || 0} permissions`);
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying admin setup:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Admin Database Setup Script Starting...\n');
  
  // Step 1: Check if admin role exists
  const adminRoleExists = await checkAdminRole();
  if (!adminRoleExists) {
    console.error('\n❌ Admin role not found. Please run the schema migration first.');
    console.error('The role should be created by: supabase/migrations/20250601000000_fix_critical_auth_schema.sql');
    process.exit(1);
  }
  
  // Step 2: Create admin user
  const adminUser = await createAdminUser();
  if (!adminUser) {
    console.error('\n❌ Failed to create admin user. Cannot proceed.');
    process.exit(1);
  }
  
  // Step 3: Setup admin profile
  const profileSetup = await setupAdminProfile(adminUser.id);
  if (!profileSetup) {
    console.error('\n❌ Failed to setup admin profile.');
    process.exit(1);
  }
  
  // Step 4: Assign admin role
  const roleAssignment = await assignAdminRole(adminUser.id);
  if (!roleAssignment) {
    console.error('\n❌ Failed to assign admin role.');
    process.exit(1);
  }
  
  // Step 5: Verify setup
  const verificationSuccess = await verifyAdminSetup(adminUser.id);
  if (!verificationSuccess) {
    console.error('\n❌ Admin setup verification failed.');
    process.exit(1);
  }
  
  // Success!
  console.log('\n🎉 SUCCESS! Admin user setup completed successfully!');
  console.log('\n📋 Admin User Details:');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Name: ${ADMIN_NAME}`);
  console.log(`   User ID: ${adminUser.id}`);
  
  console.log('\n⚠️  IMPORTANT NEXT STEPS:');
  console.log('   1. AdminAuthProvider is integrated in Providers.tsx ✅');
  console.log('   2. Admin user created and configured ✅');
  console.log('   3. Test admin login at /admin/login');
  console.log('   4. Change the default password after first login');
  console.log('   5. Set up MFA if required for your security policy');
  
  console.log('\n✅ Admin authentication should now be fully functional!');
}

// Run the script
main().catch(error => {
  console.error('\n💥 Script failed with error:', error.message);
  process.exit(1);
});