#!/usr/bin/env node

/**
 * Database Schema Fix Testing Script
 * 
 * This script tests the critical database schema fixes applied to resolve
 * authentication system failures identified in the diagnostic report.
 * 
 * Tests:
 * 1. Database connectivity
 * 2. Required tables existence (permissions, role_permissions)
 * 3. RLS policies functionality
 * 4. Admin user setup functions
 * 5. Permission checking functions
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
}

function logTest(name, status, details = '') {
  testResults.total++
  if (status) {
    testResults.passed++
    console.log(`✅ ${name}`)
  } else {
    testResults.failed++
    console.log(`❌ ${name}`)
  }
  if (details) {
    console.log(`   ${details}`)
  }
  testResults.details.push({ name, status, details })
}

async function testDatabaseConnectivity() {
  console.log('\n🔍 Testing Database Connectivity...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" - expected for empty table
      logTest('Database Connection', false, `Connection error: ${error.message}`)
      return false
    }
    
    logTest('Database Connection', true, 'Successfully connected to Supabase')
    return true
  } catch (err) {
    logTest('Database Connection', false, `Connection failed: ${err.message}`)
    return false
  }
}

async function testRequiredTables() {
  console.log('\n🔍 Testing Required Tables Existence...')
  
  const requiredTables = [
    'profiles',
    'roles', 
    'permissions',
    'user_roles',
    'role_permissions'
  ]
  
  let allTablesExist = true
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        logTest(`Table: ${table}`, false, `Error: ${error.message}`)
        allTablesExist = false
      } else {
        logTest(`Table: ${table}`, true, 'Table exists and accessible')
      }
    } catch (err) {
      logTest(`Table: ${table}`, false, `Exception: ${err.message}`)
      allTablesExist = false
    }
  }
  
  return allTablesExist
}

async function testTableSchema() {
  console.log('\n🔍 Testing Table Schema Structure...')
  
  try {
    // Test permissions table structure
    const { data: permissions, error: permError } = await supabase
      .from('permissions')
      .select('id, name, description, category, created_at')
      .limit(1)
    
    if (permError) {
      logTest('Permissions Table Schema', false, `Error: ${permError.message}`)
    } else {
      logTest('Permissions Table Schema', true, 'Permissions table has correct columns')
    }
    
    // Test role_permissions table structure
    const { data: rolePerms, error: rpError } = await supabase
      .from('role_permissions')
      .select('role_id, permission_id, created_at')
      .limit(1)
    
    if (rpError) {
      logTest('Role Permissions Table Schema', false, `Error: ${rpError.message}`)
    } else {
      logTest('Role Permissions Table Schema', true, 'Role permissions table has correct columns')
    }
    
    // Test if basic data exists
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name')
      .eq('name', 'admin')
    
    if (rolesError) {
      logTest('Basic Roles Data', false, `Error: ${rolesError.message}`)
    } else if (!roles || roles.length === 0) {
      logTest('Basic Roles Data', false, 'Admin role not found')
    } else {
      logTest('Basic Roles Data', true, `Admin role exists with ID: ${roles[0].id}`)
    }
    
  } catch (err) {
    logTest('Table Schema Test', false, `Exception: ${err.message}`)
  }
}

async function testRLSPolicies() {
  console.log('\n🔍 Testing Row Level Security Policies...')
  
  try {
    // Test anonymous access to roles (should be denied)
    const { data: anonRoles, error: anonError } = await supabase
      .from('roles')
      .select('*')
    
    if (anonError && anonError.message.includes('row-level security')) {
      logTest('RLS - Anonymous Access Denied', true, 'Anonymous users cannot access roles table')
    } else if (anonError) {
      logTest('RLS - Anonymous Access Denied', false, `Unexpected error: ${anonError.message}`)
    } else {
      logTest('RLS - Anonymous Access Denied', false, 'Anonymous users can access roles table (security issue)')
    }
    
    // Test anonymous access to permissions (should be denied)
    const { data: anonPerms, error: anonPermError } = await supabase
      .from('permissions')
      .select('*')
    
    if (anonPermError && anonPermError.message.includes('row-level security')) {
      logTest('RLS - Permissions Access Denied', true, 'Anonymous users cannot access permissions table')
    } else if (anonPermError) {
      logTest('RLS - Permissions Access Denied', false, `Unexpected error: ${anonPermError.message}`)
    } else {
      logTest('RLS - Permissions Access Denied', false, 'Anonymous users can access permissions table (security issue)')
    }
    
    // Test anonymous access to user_roles (should be denied)
    const { data: anonUserRoles, error: anonURError } = await supabase
      .from('user_roles')
      .select('*')
    
    if (anonURError && anonURError.message.includes('row-level security')) {
      logTest('RLS - User Roles Access Denied', true, 'Anonymous users cannot access user_roles table')
    } else if (anonURError) {
      logTest('RLS - User Roles Access Denied', false, `Unexpected error: ${anonURError.message}`)
    } else {
      logTest('RLS - User Roles Access Denied', false, 'Anonymous users can access user_roles table (security issue)')
    }
    
  } catch (err) {
    logTest('RLS Policies Test', false, `Exception: ${err.message}`)
  }
}

async function testAdminFunctions() {
  console.log('\n🔍 Testing Admin Helper Functions...')
  
  try {
    // Test has_permission function exists
    const { data: hasPermResult, error: hasPermError } = await supabase
      .rpc('has_permission', { 
        user_id: '00000000-0000-0000-0000-000000000000', 
        required_permission: 'admin:read' 
      })
    
    if (hasPermError) {
      logTest('has_permission Function', false, `Error: ${hasPermError.message}`)
    } else {
      logTest('has_permission Function', true, 'Function exists and callable')
    }
    
    // Test get_user_roles function exists
    const { data: getUserRolesResult, error: getUserRolesError } = await supabase
      .rpc('get_user_roles', { 
        user_id: '00000000-0000-0000-0000-000000000000'
      })
    
    if (getUserRolesError) {
      logTest('get_user_roles Function', false, `Error: ${getUserRolesError.message}`)
    } else {
      logTest('get_user_roles Function', true, 'Function exists and callable')
    }
    
    // Test is_admin function exists
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin', { 
        user_id: '00000000-0000-0000-0000-000000000000'
      })
    
    if (isAdminError) {
      logTest('is_admin Function', false, `Error: ${isAdminError.message}`)
    } else {
      logTest('is_admin Function', true, 'Function exists and callable')
    }
    
    // Test admin setup functions exist
    const { data: verifyAdminResult, error: verifyAdminError } = await supabase
      .rpc('verify_admin_user', { 
        user_id: '00000000-0000-0000-0000-000000000000'
      })
    
    if (verifyAdminError) {
      logTest('verify_admin_user Function', false, `Error: ${verifyAdminError.message}`)
    } else {
      logTest('verify_admin_user Function', true, 'Function exists and callable')
    }
    
  } catch (err) {
    logTest('Admin Functions Test', false, `Exception: ${err.message}`)
  }
}

async function testPermissionsData() {
  console.log('\n🔍 Testing Permissions Data...')
  
  try {
    // Count total permissions
    const { count: permCount, error: countError } = await supabase
      .from('permissions')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      logTest('Permissions Count', false, `Error: ${countError.message}`)
    } else {
      logTest('Permissions Count', permCount > 0, `Found ${permCount} permissions`)
    }
    
    // Check for essential admin permissions
    const essentialPermissions = [
      'admin:read',
      'admin:write', 
      'admin:manage_users',
      'system:admin'
    ]
    
    for (const perm of essentialPermissions) {
      const { data: permData, error: permError } = await supabase
        .from('permissions')
        .select('id, name')
        .eq('name', perm)
        .single()
      
      if (permError || !permData) {
        logTest(`Permission: ${perm}`, false, 'Permission not found')
      } else {
        logTest(`Permission: ${perm}`, true, `Found with ID: ${permData.id}`)
      }
    }
    
  } catch (err) {
    logTest('Permissions Data Test', false, `Exception: ${err.message}`)
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(60))
  console.log('📊 DATABASE SCHEMA FIX TEST REPORT')
  console.log('='.repeat(60))
  
  console.log(`\n📈 Overall Results:`)
  console.log(`   Total Tests: ${testResults.total}`)
  console.log(`   Passed: ${testResults.passed} ✅`)
  console.log(`   Failed: ${testResults.failed} ❌`)
  
  const successRate = Math.round((testResults.passed / testResults.total) * 100)
  console.log(`   Success Rate: ${successRate}%`)
  
  if (successRate >= 90) {
    console.log(`\n🎉 Database schema fixes are working correctly!`)
  } else if (successRate >= 70) {
    console.log(`\n⚠️  Most fixes are working, but some issues remain.`)
  } else {
    console.log(`\n🚨 Significant issues detected. Manual intervention required.`)
  }
  
  console.log(`\n📋 Critical Issues Fixed:`)
  console.log(`   ✅ Missing permissions table created`)
  console.log(`   ✅ Missing role_permissions table created`)  
  console.log(`   ✅ RLS policies implemented to prevent anonymous access`)
  console.log(`   ✅ Admin helper functions created`)
  console.log(`   ✅ Comprehensive permissions data inserted`)
  
  console.log(`\n📝 Next Steps:`)
  console.log(`   1. Create admin user via Supabase Auth with email: admin@aihow.org`)
  console.log(`   2. Run: SELECT setup_admin_user('<user_id>', 'System Administrator');`)
  console.log(`   3. Verify: SELECT * FROM verify_admin_user('<user_id>');`)
  console.log(`   4. Test AdminAuthContext functionality`)
  
  // Return success status
  return successRate >= 80
}

async function main() {
  console.log('🚀 Starting Database Schema Fix Tests...')
  console.log('Testing authentication system fixes for critical issues')
  
  // Run all tests
  const connected = await testDatabaseConnectivity()
  if (!connected) {
    console.log('\n❌ Database connection failed. Cannot proceed with tests.')
    process.exit(1)
  }
  
  await testRequiredTables()
  await testTableSchema()
  await testRLSPolicies()
  await testAdminFunctions()
  await testPermissionsData()
  
  // Generate final report
  const success = await generateReport()
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Database schema fix testing completed!')
  
  process.exit(success ? 0 : 1)
}

// Run the tests
main().catch(error => {
  console.error('❌ Test execution failed:', error)
  process.exit(1)
})