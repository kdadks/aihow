import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Configuration detection
const isLocalDev = process.env.VITE_SUPABASE_URL?.includes('127.0.0.1') || process.env.VITE_SUPABASE_URL?.includes('localhost');

let supabaseUrl, supabaseAnonKey, supabaseServiceKey;

if (isLocalDev) {
  // Local development configuration
  supabaseUrl = 'http://127.0.0.1:54321';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
  console.log('🔧 Using LOCAL DEVELOPMENT configuration');
} else {
  // Production configuration
  supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';
  supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';
  console.log('🌐 Using PRODUCTION configuration');
}

console.log(`🔗 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Using anon key: ${supabaseAnonKey.substring(0, 20)}...`);

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// Test credentials
const ADMIN_EMAIL = 'testadmin@aihow.org';
const ADMIN_PASSWORD = 'AIhow@Admin2025';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// Utilities
const logSection = (title) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 ${title}`);
  console.log(`${'='.repeat(60)}`);
};

const logSubsection = (title) => {
  console.log(`\n--- ${title} ---`);
};

const logSuccess = (message) => {
  console.log(`✅ ${message}`);
};

const logError = (message, error = null) => {
  console.log(`❌ ${message}`);
  if (error) {
    console.log(`   Error: ${error.message || error}`);
    if (error.details) console.log(`   Details: ${error.details}`);
    if (error.code) console.log(`   Code: ${error.code}`);
  }
};

const logWarning = (message) => {
  console.log(`⚠️  ${message}`);
};

const logInfo = (message) => {
  console.log(`ℹ️  ${message}`);
};

// Test Functions
async function testSupabaseConnection() {
  logSection('TESTING SUPABASE CONNECTION');
  
  try {
    // Test basic connection
    const { data, error } = await anonClient.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    
    logSuccess('Supabase connection established');
    logInfo(`Database accessible - profiles table exists`);
    return true;
  } catch (error) {
    logError('Failed to connect to Supabase', error);
    return false;
  }
}

async function testDatabaseSchema() {
  logSection('TESTING DATABASE SCHEMA');
  
  const tables = [
    'profiles',
    'roles', 
    'permissions',
    'user_roles',
    'role_permissions'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await adminClient.from(table).select('*').limit(1);
      if (error) throw error;
      
      logSuccess(`Table '${table}' exists and accessible`);
      results[table] = true;
    } catch (error) {
      logError(`Table '${table}' issue`, error);
      results[table] = false;
    }
  }
  
  // Check for critical missing tables
  const missingTables = Object.entries(results).filter(([_, exists]) => !exists).map(([table, _]) => table);
  if (missingTables.length > 0) {
    logError(`Missing critical tables: ${missingTables.join(', ')}`);
    return false;
  }
  
  logSuccess('All required database tables exist');
  return true;
}

async function testNormalUserAuthentication() {
  logSection('TESTING NORMAL USER AUTHENTICATION');
  
  let testUserId = null;
  
  try {
    // 1. Try to create test user (if not exists)
    logSubsection('Creating test user');
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true
    });
    
    if (createError && createError.message !== 'A user with this email address has already been registered') {
      throw createError;
    }
    
    testUserId = createData?.user?.id;
    if (testUserId) {
      logSuccess(`Test user created with ID: ${testUserId}`);
    } else {
      logInfo('Test user already exists, proceeding with login test');
    }
    
    // 2. Create profile if user was created
    if (testUserId) {
      logSubsection('Creating test user profile');
      const { error: profileError } = await adminClient
        .from('profiles')
        .upsert({
          id: testUserId,
          username: TEST_EMAIL,
          full_name: 'Test User'
        });
        
      if (profileError && !profileError.message.includes('duplicate key')) {
        throw profileError;
      }
      logSuccess('Test user profile created');
    }
    
    // 3. Test login
    logSubsection('Testing normal user login');
    const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (loginError) {
      throw loginError;
    }
    
    logSuccess('Normal user login successful');
    logInfo(`Session created: ${!!loginData.session}`);
    logInfo(`User ID: ${loginData.user?.id}`);
    
    // 4. Test session state
    const { data: sessionData } = await anonClient.auth.getSession();
    if (sessionData.session) {
      logSuccess('Session state maintained');
    } else {
      logWarning('Session not maintained');
    }
    
    // 5. Test logout
    await anonClient.auth.signOut();
    logSuccess('Normal user logout successful');
    
    // 6. Clean up test user
    if (testUserId) {
      await adminClient.auth.admin.deleteUser(testUserId);
      logInfo('Test user cleaned up');
    }
    
    return true;
    
  } catch (error) {
    logError('Normal user authentication failed', error);
    
    // Clean up on failure
    if (testUserId) {
      try {
        await adminClient.auth.admin.deleteUser(testUserId);
        logInfo('Test user cleaned up after failure');
      } catch (cleanupError) {
        logError('Failed to clean up test user', cleanupError);
      }
    }
    
    return false;
  }
}

async function testAdminUserExistence() {
  logSection('TESTING ADMIN USER EXISTENCE');
  
  try {
    // 1. Check if admin user exists in auth.users
    logSubsection('Checking admin user in auth system');
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    const adminAuthUser = authUsers.users.find(user => user.email === ADMIN_EMAIL);
    if (adminAuthUser) {
      logSuccess(`Admin user exists in auth system`);
      logInfo(`Admin user ID: ${adminAuthUser.id}`);
      logInfo(`Email confirmed: ${adminAuthUser.email_confirmed_at ? 'Yes' : 'No'}`);
      logInfo(`Last sign in: ${adminAuthUser.last_sign_in_at || 'Never'}`);
    } else {
      logError('Admin user not found in auth system');
      return { authExists: false, profileExists: false, roleExists: false };
    }
    
    // 2. Check admin profile
    logSubsection('Checking admin profile');
    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', adminAuthUser.id)
      .single();
    
    const profileExists = !profileError && profileData;
    if (profileExists) {
      logSuccess('Admin profile exists');
      logInfo(`Profile ID: ${profileData.id}`);
      logInfo(`Username: ${profileData.username}`);
      logInfo(`Full name: ${profileData.full_name || 'Not set'}`);
    } else {
      logError('Admin profile not found', profileError);
    }
    
    // 3. Check admin roles
    logSubsection('Checking admin roles and permissions');
    const { data: roleData, error: roleError } = await adminClient
      .from('user_roles')
      .select(`
        roles (
          id,
          name,
          role_permissions (
            permissions (name)
          )
        )
      `)
      .eq('user_id', adminAuthUser.id);
    
    const roleExists = !roleError && roleData && roleData.length > 0;
    if (roleExists) {
      logSuccess('Admin roles found');
      roleData.forEach(userRole => {
        const role = userRole.roles;
        logInfo(`Role: ${role.name}`);
        const permissions = role.role_permissions?.map(rp => rp.permissions.name) || [];
        logInfo(`Permissions: ${permissions.length > 0 ? permissions.join(', ') : 'None'}`);
      });
    } else {
      logError('Admin roles not found', roleError);
    }
    
    return {
      authExists: !!adminAuthUser,
      profileExists,
      roleExists,
      userId: adminAuthUser?.id
    };
    
  } catch (error) {
    logError('Failed to check admin user existence', error);
    return { authExists: false, profileExists: false, roleExists: false };
  }
}

async function testAdminAuthentication() {
  logSection('TESTING ADMIN AUTHENTICATION');
  
  try {
    // 1. Test admin login
    logSubsection('Testing admin login');
    const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (loginError) {
      logError('Admin login failed', loginError);
      
      // Try alternative admin credentials
      logSubsection('Trying alternative admin credentials');
      const alternatives = [
        { email: 'admin@example.com', password: 'admin123' },
        { email: 'admin@aihow.org', password: 'password123' },
        { email: 'admin@localhost', password: 'admin123' }
      ];
      
      let loginSuccessful = false;
      for (const alt of alternatives) {
        try {
          const { data: altData, error: altError } = await anonClient.auth.signInWithPassword({
            email: alt.email,
            password: alt.password
          });
          
          if (!altError) {
            logSuccess(`Admin login successful with alternative credentials: ${alt.email}`);
            loginSuccessful = true;
            break;
          }
        } catch (e) {
          // Continue to next alternative
        }
      }
      
      if (!loginSuccessful) {
        throw loginError;
      }
    } else {
      logSuccess('Admin login successful with primary credentials');
    }
    
    // 2. Verify admin session
    const { data: sessionData } = await anonClient.auth.getSession();
    if (sessionData.session) {
      logSuccess('Admin session established');
      logInfo(`Admin user ID: ${sessionData.session.user.id}`);
      logInfo(`Admin email: ${sessionData.session.user.email}`);
    } else {
      logError('Admin session not established');
    }
    
    // 3. Test admin role verification
    logSubsection('Testing admin role verification');
    if (sessionData.session) {
      const { data: roleData, error: roleError } = await anonClient
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', sessionData.session.user.id);
      
      if (roleError) {
        logError('Failed to fetch admin roles', roleError);
      } else if (roleData && roleData.length > 0) {
        const roles = roleData.map(ur => ur.roles.name);
        logSuccess(`Admin roles verified: ${roles.join(', ')}`);
        
        const adminRoles = ['admin', 'system_admin', 'content_admin'];
        const hasAdminRole = roles.some(role => adminRoles.includes(role));
        if (hasAdminRole) {
          logSuccess('User has admin privileges');
        } else {
          logError('User does not have admin privileges');
        }
      } else {
        logError('No roles found for admin user');
      }
    }
    
    // 4. Test logout
    await anonClient.auth.signOut();
    logSuccess('Admin logout successful');
    
    return true;
    
  } catch (error) {
    logError('Admin authentication failed', error);
    return false;
  }
}

async function testAuthenticationConflicts() {
  logSection('TESTING AUTHENTICATION CONFLICTS');
  
  try {
    // Test concurrent sessions
    logSubsection('Testing concurrent authentication sessions');
    
    const client1 = createClient(supabaseUrl, supabaseAnonKey);
    const client2 = createClient(supabaseUrl, supabaseAnonKey);
    
    // Try to login with same user on different clients
    const { data: session1, error: error1 } = await client1.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (error1) {
      logError('Cannot test conflicts - admin login failed', error1);
      return false;
    }
    
    const { data: session2, error: error2 } = await client2.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (error2) {
      logWarning('Second session creation failed - this might be expected behavior');
    } else {
      logInfo('Multiple sessions allowed - check if this is intended');
    }
    
    // Test session isolation
    logSubsection('Testing session isolation');
    const { data: clientSession1 } = await client1.auth.getSession();
    const { data: clientSession2 } = await client2.auth.getSession();
    
    if (clientSession1.session && clientSession2.session) {
      if (clientSession1.session.access_token === clientSession2.session.access_token) {
        logWarning('Sessions share the same token - potential security issue');
      } else {
        logSuccess('Sessions have different tokens - properly isolated');
      }
    }
    
    // Clean up
    await client1.auth.signOut();
    await client2.auth.signOut();
    
    return true;
    
  } catch (error) {
    logError('Authentication conflict test failed', error);
    return false;
  }
}

async function testRoleBasedAccess() {
  logSection('TESTING ROLE-BASED ACCESS CONTROL');
  
  try {
    // Login as admin
    const { data: adminLogin, error: adminError } = await anonClient.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (adminError) {
      logError('Cannot test RBAC - admin login failed', adminError);
      return false;
    }
    
    // Test admin table access
    logSubsection('Testing admin table access');
    const protectedTables = ['roles', 'permissions', 'user_roles', 'role_permissions'];
    
    for (const table of protectedTables) {
      try {
        const { data, error } = await anonClient.from(table).select('*').limit(1);
        if (error) {
          logError(`Admin cannot access ${table}`, error);
        } else {
          logSuccess(`Admin can access ${table}`);
        }
      } catch (error) {
        logError(`Admin access to ${table} failed`, error);
      }
    }
    
    await anonClient.auth.signOut();
    
    // Test unauthorized access
    logSubsection('Testing unauthorized access to protected tables');
    for (const table of protectedTables) {
      try {
        const { data, error } = await anonClient.from(table).select('*').limit(1);
        if (error) {
          logSuccess(`Unauthorized access to ${table} properly blocked`);
        } else {
          logError(`Unauthorized access to ${table} allowed - security issue!`);
        }
      } catch (error) {
        logSuccess(`Unauthorized access to ${table} properly blocked`);
      }
    }
    
    return true;
    
  } catch (error) {
    logError('RBAC test failed', error);
    return false;
  }
}

// Main test execution
async function runComprehensiveAuthTests() {
  console.log('🚀 STARTING COMPREHENSIVE AUTHENTICATION SYSTEM TESTS');
  console.log(`📅 ${new Date().toISOString()}`);
  
  const results = {
    connection: false,
    schema: false,
    normalAuth: false,
    adminExists: false,
    adminAuth: false,
    conflicts: false,
    rbac: false
  };
  
  // Run all tests
  results.connection = await testSupabaseConnection();
  results.schema = await testDatabaseSchema();
  results.normalAuth = await testNormalUserAuthentication();
  
  const adminExistence = await testAdminUserExistence();
  results.adminExists = adminExistence.authExists && adminExistence.profileExists && adminExistence.roleExists;
  
  results.adminAuth = await testAdminAuthentication();
  results.conflicts = await testAuthenticationConflicts();
  results.rbac = await testRoleBasedAccess();
  
  // Summary
  logSection('TEST RESULTS SUMMARY');
  
  const tests = [
    ['Supabase Connection', results.connection],
    ['Database Schema', results.schema],
    ['Normal User Auth', results.normalAuth],
    ['Admin User Setup', results.adminExists],
    ['Admin Authentication', results.adminAuth],
    ['Auth Conflicts', results.conflicts],
    ['Role-Based Access', results.rbac]
  ];
  
  tests.forEach(([name, passed]) => {
    if (passed) {
      logSuccess(name);
    } else {
      logError(name);
    }
  });
  
  const totalTests = tests.length;
  const passedTests = tests.filter(([_, passed]) => passed).length;
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  console.log(`\n📊 Overall Success Rate: ${passedTests}/${totalTests} (${successRate}%)`);
  
  // Critical issues identification
  if (!results.connection) {
    logError('CRITICAL: Cannot connect to Supabase');
  }
  if (!results.schema) {
    logError('CRITICAL: Database schema issues detected');
  }
  if (!results.adminExists) {
    logError('CRITICAL: Admin user not properly configured');
  }
  if (!results.adminAuth) {
    logError('CRITICAL: Admin authentication failing');
  }
  
  return results;
}

// Run the tests
runComprehensiveAuthTests().catch(console.error);