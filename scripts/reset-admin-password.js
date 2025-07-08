#!/usr/bin/env node

/**
 * Reset Admin Password Script
 * 
 * This script resets the password for the testadmin@aihow.org user
 * so you can log in and test admin authentication.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@aihow.org';
const NEW_PASSWORD = 'AdminTest123!'; // New known password

async function resetAdminPassword() {
  console.log('🔐 Resetting Admin Password...\n');
  
  try {
    // First, find the admin user
    console.log('1. Finding admin user...');
    const { data: users, error: listError } = await adminSupabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message);
      return;
    }
    
    const adminUser = users.users.find(u => u.email === ADMIN_EMAIL);
    
    if (!adminUser) {
      console.error(`❌ Admin user ${ADMIN_EMAIL} not found`);
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.id}`);
    
    // Reset the password
    console.log('\n2. Resetting password...');
    const { data: updateData, error: updateError } = await adminSupabase.auth.admin.updateUserById(
      adminUser.id,
      {
        password: NEW_PASSWORD
      }
    );
    
    if (updateError) {
      console.error('❌ Failed to reset password:', updateError.message);
      return;
    }
    
    console.log('✅ Password reset successfully!');
    
    // Verify the user still has admin role
    console.log('\n3. Verifying admin role...');
    const { data: userRoles, error: roleError } = await adminSupabase
      .from('user_roles')
      .select(`
        roles (name)
      `)
      .eq('user_id', adminUser.id);
    
    if (roleError) {
      console.error('❌ Failed to check user roles:', roleError.message);
    } else {
      const hasAdminRole = userRoles.some(ur => ur.roles?.name === 'admin');
      
      if (hasAdminRole) {
        console.log('✅ Admin role confirmed');
      } else {
        console.log('⚠️  Admin role not found');
      }
    }
    
    // Success summary
    console.log('\n🎉 SUCCESS! Admin password has been reset!');
    console.log('\n📋 Updated Admin Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    console.log(`   User ID: ${adminUser.id}`);
    
    console.log('\n🔗 Next Steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Navigate to: http://localhost:5173/admin/login');
    console.log('   3. Use the credentials above to log in');
    console.log('   4. Change password after first successful login');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

resetAdminPassword();
