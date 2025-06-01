#!/usr/bin/env node

/**
 * Admin User Creation Script
 * 
 * This script creates the missing admin@aihow.org user and sets up the admin role.
 * It uses the database functions created in the migration to complete the admin setup.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  console.error('Optional but recommended: VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminSupabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

const ADMIN_EMAIL = 'admin@aihow.org';
const ADMIN_PASSWORD = 'AdminPass123!'; // Default password - should be changed after first login
const ADMIN_NAME = 'System Administrator';

async function checkExistingAdminUsers() {
  console.log('🔍 Checking for existing admin users...');
  
  try {
    const client = adminSupabase || supabase;
    const { data, error } = await client.rpc('list_admin_users');
    
    if (error) {
      console.error('❌ Failed to check existing admin users:', error.message);
      return [];
    }
    
    if (data && data.length > 0) {
      console.log('✅ Found existing admin users:');
      data.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.full_name}) - Role: ${admin.role_name}`);
      });
      return data;
    } else {
      console.log('⚠️  No admin users found in database');
      return [];
    }
  } catch (error) {
    console.error('❌ Error checking admin users:', error.message);
    return [];
  }
}

async function createAdminUserViaAuth() {
  console.log(`\n🔧 Creating admin user: ${ADMIN_EMAIL}...`);
  
  if (!adminSupabase) {
    console.error('❌ Service role key required for user creation');
    console.error('Please provide SUPABASE_SERVICE_ROLE_KEY in your .env file');
    return null;
  }
  
  try {
    // Create user via Admin API
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Skip email confirmation for admin user
      user_metadata: {
        full_name: ADMIN_NAME,
        role: 'admin'
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('ℹ️  User already exists, attempting to find existing user...');
        
        // Try to get existing user
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
      console.log(`   Email: ${data.user.email}`);
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Unexpected error creating admin user:', error.message);
    return null;
  }
}

async function setupAdminUser(userId) {
  console.log(`\n⚙️  Setting up admin profile and role for user ${userId}...`);
  
  try {
    const client = adminSupabase || supabase;
    const { data, error } = await client.rpc('setup_admin_user', {
      user_id: userId,
      admin_name: ADMIN_NAME
    });
    
    if (error) {
      console.error('❌ Failed to setup admin user:', error.message);
      return false;
    }
    
    console.log('✅ Admin user setup completed!');
    return true;
  } catch (error) {
    console.error('❌ Unexpected error setting up admin user:', error.message);
    return false;
  }
}

async function verifyAdminUser(userId) {
  console.log(`\n🔍 Verifying admin user setup for ${userId}...`);
  
  try {
    const client = adminSupabase || supabase;
    const { data, error } = await client.rpc('verify_admin_user', {
      user_id: userId
    });
    
    if (error) {
      console.error('❌ Failed to verify admin user:', error.message);
      return false;
    }
    
    if (data && data.length > 0) {
      const verification = data[0];
      console.log('📊 Admin User Verification Results:');
      console.log(`   ✅ User exists in auth.users: ${verification.user_exists}`);
      console.log(`   ✅ Profile exists: ${verification.profile_exists}`);
      console.log(`   ✅ Has admin role: ${verification.has_admin_role}`);
      console.log(`   ✅ Admin permissions count: ${verification.admin_permissions_count}`);
      console.log(`   ✅ Setup complete: ${verification.setup_complete}`);
      
      return verification.setup_complete;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Unexpected error verifying admin user:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Admin User Creation Script Starting...\n');
  
  // Step 1: Check for existing admin users
  const existingAdmins = await checkExistingAdminUsers();
  
  // If admin users exist, ask if we should proceed
  if (existingAdmins.length > 0) {
    const hasTargetAdmin = existingAdmins.some(admin => admin.email === ADMIN_EMAIL);
    if (hasTargetAdmin) {
      console.log(`✅ Admin user ${ADMIN_EMAIL} already exists and is configured.`);
      console.log('ℹ️  No action needed. Admin authentication should now work.');
      return;
    } else {
      console.log(`ℹ️  Other admin users exist, but not ${ADMIN_EMAIL}`);
      console.log('   Proceeding to create the expected admin user...');
    }
  }
  
  // Step 2: Create admin user via Supabase Auth
  const createdUser = await createAdminUserViaAuth();
  if (!createdUser) {
    console.error('\n❌ Failed to create admin user. Cannot proceed.');
    process.exit(1);
  }
  
  // Step 3: Setup admin profile and role
  const setupSuccess = await setupAdminUser(createdUser.id);
  if (!setupSuccess) {
    console.error('\n❌ Failed to setup admin user profile and role.');
    process.exit(1);
  }
  
  // Step 4: Verify admin user setup
  const verificationSuccess = await verifyAdminUser(createdUser.id);
  if (!verificationSuccess) {
    console.error('\n❌ Admin user verification failed.');
    process.exit(1);
  }
  
  // Step 5: Final success message
  console.log('\n🎉 SUCCESS! Admin user creation completed successfully!');
  console.log('\n📋 Admin User Details:');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Name: ${ADMIN_NAME}`);
  console.log(`   User ID: ${createdUser.id}`);
  
  console.log('\n⚠️  IMPORTANT NEXT STEPS:');
  console.log('   1. Admin authentication should now work in the application');
  console.log('   2. Change the default password after first login');
  console.log('   3. Set up MFA if required for your security policy');
  console.log('   4. Test admin login at /admin/login');
  
  console.log('\n✅ AdminAuthProvider is now integrated and admin user is ready!');
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('\n💥 Script failed with error:', error.message);
    process.exit(1);
  });
}

export { main as createAdminUser };