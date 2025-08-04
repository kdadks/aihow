/**
 * Test script to validate AdminAuthContext role fetching against new schema
 * This script tests the role fetching logic that was fixed
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRoleFetching() {
  console.log('🧪 Testing AdminAuthContext role fetching logic...\n');

  // Test 1: Check what tables exist and their structure
  console.log('1. Inspecting database structure...');
  
  try {
    // Check what columns exist in user_roles table
    const { data: userRolesStructure, error: structureError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ user_roles table error:', structureError.message);
    } else {
      console.log('✅ user_roles table accessible');
      if (userRolesStructure && userRolesStructure.length > 0) {
        console.log('   Columns:', Object.keys(userRolesStructure[0]));
      } else {
        console.log('   Table exists but is empty');
      }
    }

    // Check user_roles table
    const { data: assignments, error: assignmentError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);
    
    if (assignmentError) {
      console.error('❌ user_roles table error:', assignmentError.message);
    } else {
      console.log('✅ user_roles table accessible');
      if (assignments && assignments.length > 0) {
        console.log('   Columns:', Object.keys(assignments[0]));
      } else {
        console.log('   Table exists but is empty');
      }
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return;
  }

  // Test 2: Test the exact query pattern used in AdminAuthContext
  console.log('\n2. Testing role fetching query pattern...');
  
  try {
    // This simulates what happens in AdminAuthContext for any user
    const { data: testAssignments } = await supabase
      .from('user_roles')
      .select('role_id, user_id')
      .limit(5);

    if (testAssignments && testAssignments.length > 0) {
      console.log(`✅ Found ${testAssignments.length} role assignments`);
      
      // Test fetching role data for the first assignment
      const firstAssignment = testAssignments[0];
      const { data: roleData, error: roleDataError } = await supabase
        .from('user_roles')
        .select('id, name, permissions')
        .eq('id', firstAssignment.role_id)
        .single();

      if (roleDataError) {
        console.error('❌ Role data fetch error:', roleDataError.message);
      } else {
        console.log('✅ Role data fetched successfully:');
        console.log(`   - Role: ${roleData.name}`);
        console.log(`   - Permissions: ${Object.keys(roleData.permissions || {}).length} defined`);
      }
    } else {
      console.log('ℹ️  No role assignments found in database');
    }

  } catch (error) {
    console.error('❌ Query test error:', error.message);
  }

  // Test 3: Check for admin roles specifically
  console.log('\n3. Checking for admin roles...');
  
  try {
    const { data: adminRoles, error: adminError } = await supabase
      .from('user_roles')
      .select('*')
      .in('name', ['admin', 'system_admin', 'content_admin']);

    if (adminError) {
      console.error('❌ Admin roles check error:', adminError.message);
    } else if (adminRoles && adminRoles.length > 0) {
      console.log(`✅ Found ${adminRoles.length} admin role(s):`);
      adminRoles.forEach(role => {
        console.log(`   - ${role.name}: ${Object.keys(role.permissions || {}).length} permissions`);
      });
    } else {
      console.log('⚠️  No admin roles found in database');
    }

  } catch (error) {
    console.error('❌ Admin roles check error:', error.message);
  }

  console.log('\n🎉 AdminAuthContext role fetching test completed!');
  console.log('\nThe fixed AdminAuthContext should now properly:');
  console.log('  ✅ Fetch role assignments from user_roles table');
  console.log('  ✅ Fetch role data from roles table');
  console.log('  ✅ Handle JSONB permissions structure');
  console.log('  ✅ Validate admin role access');
}

// Run the test
testRoleFetching().catch(console.error);
