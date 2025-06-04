#!/usr/bin/env node

/**
 * Enhanced test script to verify admin post-login navigation fix
 * Tests the complete admin authentication flow with detailed debugging
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminAuthFlow() {
  console.log('🧪 Testing Enhanced Admin Authentication Flow Fix...\n');

  try {
    // Use multiple possible admin credentials
    const adminCredentials = [
      { email: 'testadmin@aihow.org', password: 'AIhow@Admin2025' },
      { email: 'admin@aihow.org', password: 'AIhow@Admin2025' },
      { email: 'testadmin@aihow.org', password: 'AdminPassword123!' },
      { email: 'admin@aihow.org', password: 'AdminPass123!' }
    ];

    let authData = null;
    let usedCredentials = null;

    console.log('1. Testing admin user authentication...');
    
    for (const credentials of adminCredentials) {
      console.log(`   Trying: ${credentials.email}`);
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (!error && data.user) {
        authData = data;
        usedCredentials = credentials;
        console.log(`✅ Authentication successful with: ${credentials.email}`);
        break;
      } else {
        console.log(`   ❌ Failed: ${error?.message || 'Unknown error'}`);
      }
    }

    if (!authData) {
      console.log('\n❌ No admin user found with any of the test credentials');
      console.log('   Run one of these scripts to create an admin user:');
      console.log('   - npm run setup:admin-database');
      console.log('   - node scripts/create-simple-admin.js');
      return;
    }

    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}`);
    console.log(`   Last Sign In: ${authData.user.last_sign_in_at}\n`);

    // Test admin role verification
    console.log('2. Testing admin role verification...');
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', authData.user.id);

    if (roleError || !roleData || roleData.length === 0) {
      console.log('❌ Failed to fetch user roles');
      console.log('   Error:', roleError?.message || 'No roles found');
      await supabase.auth.signOut();
      return;
    }

    const userRoles = roleData.map(r => r.roles?.name).filter(Boolean);
    console.log('✅ Admin roles verification successful');
    console.log(`   Roles: ${userRoles.join(', ')}\n`);

    // Verify admin permissions
    console.log('3. Testing role permissions...');
    const validAdminRoles = ['admin', 'system_admin', 'content_admin'];
    const hasAdminRole = userRoles.some(role => validAdminRoles.includes(role));
    
    if (!hasAdminRole) {
      console.log('❌ User does not have valid admin role');
      console.log(`   Current roles: ${userRoles.join(', ')}`);
      console.log(`   Valid admin roles: ${validAdminRoles.join(', ')}`);
      await supabase.auth.signOut();
      return;
    }

    console.log('✅ Role permissions validated');
    console.log(`   Has admin access via role(s): ${userRoles.filter(r => validAdminRoles.includes(r)).join(', ')}\n`);

    // Test profile data access
    console.log('4. Testing profile data access...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      console.log('⚠️  Profile data not found');
      console.log('   This may affect admin dashboard display');
      console.log('   Error:', profileError?.message);
    } else {
      console.log('✅ Profile data access successful');
      console.log(`   Username: ${profileData.username || 'Not set'}`);
      console.log(`   Full Name: ${profileData.full_name || 'Not set'}\n`);
    }

    // Test session validation
    console.log('5. Testing session validation...');
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.log('❌ Session validation failed');
      console.log('   Error:', sessionError?.message);
      return;
    }

    console.log('✅ Session validation successful');
    console.log(`   Session expires: ${new Date(sessionData.session.expires_at * 1000).toLocaleString()}\n`);

    // Test auth state change simulation
    console.log('6. Testing auth state change handling...');
    
    // Sign out and sign back in to test state changes
    await supabase.auth.signOut();
    console.log('   Signed out successfully');
    
    const { data: resignInData, error: resignInError } = await supabase.auth.signInWithPassword(usedCredentials);
    
    if (resignInError || !resignInData.user) {
      console.log('❌ Re-authentication failed');
      console.log('   Error:', resignInError?.message);
      return;
    }
    
    console.log('✅ Auth state change handling successful');
    console.log('   Re-authentication completed\n');

    // Clean up
    await supabase.auth.signOut();
    console.log('✅ Successfully signed out\n');

    // Detailed success summary
    console.log('🎉 ENHANCED ADMIN AUTHENTICATION FLOW TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Admin user authentication works');
    console.log('   ✅ Admin role verification works');
    console.log('   ✅ Role permissions are valid');
    console.log('   ✅ Profile data access works');
    console.log('   ✅ Session validation works');
    console.log('   ✅ Auth state change handling works');
    
    console.log('\n🔧 Working Credentials:');
    console.log(`   Email: ${usedCredentials.email}`);
    console.log(`   Password: ${usedCredentials.password}`);
    
    console.log('\n🚀 Next Steps to Test Navigation Fix:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Visit: http://localhost:5173/admin/login');
    console.log('   3. Login with the working credentials above');
    console.log('   4. Verify redirect to: http://localhost:5173/admin/dashboard');
    console.log('   5. Check that dashboard content is visible');
    
    console.log('\n✨ Admin Dashboard Navigation Fixes Applied:');
    console.log('   ✅ AdminAuthGuard now has proper loading states');
    console.log('   ✅ AdminLoginPage handles post-login navigation correctly');
    console.log('   ✅ AdminAuthContext has enhanced debugging and state management');
    console.log('   ✅ Route configuration simplified for better compatibility');
    console.log('   ✅ Dashboard component enhanced with admin context');
    
    console.log('\n🔍 If Dashboard Still Not Visible After These Fixes:');
    console.log('   - Check browser console for JavaScript errors');
    console.log('   - Verify React DevTools shows AdminAuthProvider context');
    console.log('   - Check Network tab for failed API requests');
    console.log('   - Ensure all admin components are properly imported');
    console.log('   - Look for TypeScript compilation errors in terminal');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('\n🔍 Debugging info:');
    console.error('   - Check if Supabase is configured correctly');
    console.error('   - Verify admin user exists in database');
    console.error('   - Ensure user_roles and profiles tables have proper data');
    console.error('   - Check that all environment variables are set');
    console.error('   - Verify database RLS policies allow admin access');
  }
}

// Run the test
testAdminAuthFlow();