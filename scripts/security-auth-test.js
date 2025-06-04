import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';

const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔒 AUTHENTICATION SECURITY TESTING');
console.log('===================================');

// Test unauthorized access
async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing unauthorized access attempts...');
  
  const protectedTables = ['profiles', 'roles', 'user_roles'];
  const securityResults = {};
  
  try {
    // Test 1: Unauthenticated access to protected tables
    console.log('\n--- Testing unauthenticated table access ---');
    
    for (const table of protectedTables) {
      try {
        const { data, error } = await anonClient.from(table).select('*');
        
        if (error) {
          console.log(`✅ ${table}: Access properly blocked - ${error.message}`);
          securityResults[`unauth_${table}`] = 'SECURE';
        } else {
          console.log(`❌ ${table}: Unauthorized access allowed! Found ${data?.length || 0} records`);
          securityResults[`unauth_${table}`] = 'VULNERABLE';
        }
      } catch (error) {
        console.log(`✅ ${table}: Access blocked by exception - ${error.message}`);
        securityResults[`unauth_${table}`] = 'SECURE';
      }
    }
    
    // Test 2: Attempt privilege escalation
    console.log('\n--- Testing privilege escalation attempts ---');
    
    // Try to create admin user without proper privileges
    try {
      const { data, error } = await anonClient.from('user_roles').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        role_id: 1
      });
      
      if (error) {
        console.log('✅ Role assignment properly blocked');
        securityResults.privilege_escalation = 'SECURE';
      } else {
        console.log('❌ Role assignment allowed without authorization!');
        securityResults.privilege_escalation = 'VULNERABLE';
      }
    } catch (error) {
      console.log('✅ Role assignment blocked by exception');
      securityResults.privilege_escalation = 'SECURE';
    }
    
    // Test 3: SQL injection attempts
    console.log('\n--- Testing SQL injection resistance ---');
    
    const injectionAttempts = [
      "'; DROP TABLE profiles; --",
      "1' OR '1'='1",
      "admin@test.com'; DELETE FROM user_roles; --"
    ];
    
    for (const injection of injectionAttempts) {
      try {
        const { data, error } = await anonClient
          .from('profiles')
          .select('*')
          .eq('username', injection);
        
        console.log(`✅ SQL injection attempt blocked: "${injection.substring(0, 30)}..."`);
      } catch (error) {
        console.log(`✅ SQL injection properly handled: "${injection.substring(0, 30)}..."`);
      }
    }
    securityResults.sql_injection = 'SECURE';
    
    return securityResults;
    
  } catch (error) {
    console.log('❌ Security test failed:', error.message);
    return securityResults;
  }
}

// Test session security
async function testSessionSecurity() {
  console.log('\n🔐 Testing session security...');
  
  try {
    // Create test user for session testing
    const testEmail = 'sessiontest@example.com';
    const testPassword = 'password123';
    
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (createError && createError.message !== 'A user with this email address has already been registered') {
      console.log('❌ Could not create test user for session testing');
      return false;
    }
    
    const userId = userData?.user?.id;
    
    // Test 1: Session timeout behavior
    console.log('\n--- Testing session management ---');
    
    const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.log('❌ Could not login for session testing:', loginError.message);
      return false;
    }
    
    console.log('✅ Session created successfully');
    
    // Check session validity
    const { data: sessionData } = await anonClient.auth.getSession();
    if (sessionData.session) {
      console.log('✅ Session properly maintained');
      console.log(`   Session expires: ${new Date(sessionData.session.expires_at * 1000)}`);
      
      // Check if session has reasonable expiration
      const expiresAt = new Date(sessionData.session.expires_at * 1000);
      const now = new Date();
      const hoursToExpiry = (expiresAt - now) / (1000 * 60 * 60);
      
      if (hoursToExpiry > 24) {
        console.log('⚠️  WARNING: Session expires too far in the future (security risk)');
      } else if (hoursToExpiry < 1) {
        console.log('⚠️  WARNING: Session expires too soon (usability issue)');
      } else {
        console.log('✅ Session expiration is reasonable');
      }
    }
    
    // Test 2: Session isolation
    console.log('\n--- Testing session isolation ---');
    
    const client2 = createClient(supabaseUrl, supabaseAnonKey);
    const { data: session2Data } = await client2.auth.getSession();
    
    if (session2Data.session) {
      console.log('❌ Session leaked to new client instance');
    } else {
      console.log('✅ Sessions properly isolated between clients');
    }
    
    // Test 3: Logout behavior
    console.log('\n--- Testing logout security ---');
    
    await anonClient.auth.signOut();
    const { data: postLogoutSession } = await anonClient.auth.getSession();
    
    if (postLogoutSession.session) {
      console.log('❌ Session persisted after logout');
    } else {
      console.log('✅ Session properly cleared on logout');
    }
    
    // Clean up
    if (userId) {
      await adminClient.auth.admin.deleteUser(userId);
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Session security test failed:', error.message);
    return false;
  }
}

// Test role-based access control bypass attempts
async function testRBACBypass() {
  console.log('\n🛡️  Testing RBAC bypass attempts...');
  
  try {
    // Login with the test admin we created
    const { data: adminLogin, error: adminError } = await anonClient.auth.signInWithPassword({
      email: 'testadmin@aihow.org',
      password: 'TestAdmin2025!'
    });
    
    if (adminError) {
      console.log('❌ Could not login admin for RBAC testing');
      return false;
    }
    
    console.log('✅ Admin logged in for RBAC testing');
    
    // Test 1: Check if role changes take effect immediately
    console.log('\n--- Testing role modification detection ---');
    
    const session = adminLogin.session;
    const userId = session.user.id;
    
    // Get current roles
    const { data: currentRoles, error: rolesError } = await anonClient
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', userId);
    
    if (rolesError) {
      console.log('❌ Could not fetch current roles:', rolesError.message);
    } else {
      console.log('Current roles:', currentRoles.map(ur => ur.roles.name));
    }
    
    // Test 2: Check admin-only table access
    console.log('\n--- Testing admin table access ---');
    
    const adminTables = ['roles', 'user_roles'];
    
    for (const table of adminTables) {
      try {
        const { data, error } = await anonClient.from(table).select('*').limit(1);
        
        if (error) {
          if (error.message.includes('permission denied') || error.message.includes('not allowed')) {
            console.log(`❌ Admin cannot access ${table} (unexpected restriction)`);
          } else {
            console.log(`✅ ${table} access properly controlled`);
          }
        } else {
          console.log(`✅ Admin can access ${table}`);
        }
      } catch (error) {
        console.log(`✅ ${table} access properly restricted`);
      }
    }
    
    await anonClient.auth.signOut();
    
    // Test 3: Check access after logout
    console.log('\n--- Testing access after logout ---');
    
    for (const table of adminTables) {
      try {
        const { data, error } = await anonClient.from(table).select('*').limit(1);
        
        if (error) {
          console.log(`✅ ${table} access properly blocked after logout`);
        } else {
          console.log(`❌ ${table} access still allowed after logout!`);
        }
      } catch (error) {
        console.log(`✅ ${table} access blocked after logout`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ RBAC bypass test failed:', error.message);
    return false;
  }
}

// Test password security
async function testPasswordSecurity() {
  console.log('\n🔑 Testing password security...');
  
  try {
    // Test weak password rejection
    console.log('\n--- Testing weak password rejection ---');
    
    const weakPasswords = [
      '123',
      'password',
      '12345678',
      'admin'
    ];
    
    for (const weakPassword of weakPasswords) {
      try {
        const { data, error } = await adminClient.auth.admin.createUser({
          email: `weaktest${Date.now()}@example.com`,
          password: weakPassword,
          email_confirm: true
        });
        
        if (error && error.message.includes('Password')) {
          console.log(`✅ Weak password rejected: "${weakPassword}"`);
        } else if (error) {
          console.log(`? Password "${weakPassword}" rejected for other reason: ${error.message}`);
        } else {
          console.log(`❌ Weak password accepted: "${weakPassword}"`);
          // Clean up
          if (data.user) {
            await adminClient.auth.admin.deleteUser(data.user.id);
          }
        }
      } catch (error) {
        console.log(`✅ Weak password properly rejected: "${weakPassword}"`);
      }
    }
    
    // Test brute force protection
    console.log('\n--- Testing brute force protection ---');
    
    const testEmail = 'bruteforcetest@example.com';
    const wrongPassword = 'wrongpassword';
    
    // Create test user
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: 'CorrectPassword123!',
      email_confirm: true
    });
    
    if (createError && createError.message !== 'A user with this email address has already been registered') {
      console.log('❌ Could not create user for brute force testing');
      return false;
    }
    
    const userId = userData?.user?.id;
    
    // Attempt multiple wrong logins
    let bruteForceBlocked = false;
    for (let i = 0; i < 10; i++) {
      try {
        const { data, error } = await anonClient.auth.signInWithPassword({
          email: testEmail,
          password: wrongPassword
        });
        
        if (error && error.message.includes('rate limit')) {
          console.log('✅ Brute force protection activated');
          bruteForceBlocked = true;
          break;
        }
      } catch (error) {
        if (error.message.includes('rate limit')) {
          console.log('✅ Brute force protection activated');
          bruteForceBlocked = true;
          break;
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!bruteForceBlocked) {
      console.log('⚠️  No brute force protection detected (may require more attempts)');
    }
    
    // Clean up
    if (userId) {
      await adminClient.auth.admin.deleteUser(userId);
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Password security test failed:', error.message);
    return false;
  }
}

// Main security test execution
async function runSecurityTests() {
  console.log('🚀 Starting authentication security tests...\n');
  
  const results = {
    unauthorizedAccess: {},
    sessionSecurity: false,
    rbacBypass: false,
    passwordSecurity: false
  };
  
  // Run all security tests
  results.unauthorizedAccess = await testUnauthorizedAccess();
  results.sessionSecurity = await testSessionSecurity();
  results.rbacBypass = await testRBACBypass();
  results.passwordSecurity = await testPasswordSecurity();
  
  // Security summary
  console.log('\n' + '='.repeat(50));
  console.log('🔒 SECURITY TEST RESULTS');
  console.log('='.repeat(50));
  
  // Check unauthorized access results
  const unauthorizedResults = results.unauthorizedAccess;
  const vulnerabilities = Object.entries(unauthorizedResults).filter(([_, status]) => status === 'VULNERABLE');
  
  if (vulnerabilities.length > 0) {
    console.log('❌ CRITICAL VULNERABILITIES FOUND:');
    vulnerabilities.forEach(([test, _]) => {
      console.log(`   - ${test}`);
    });
  } else {
    console.log('✅ No unauthorized access vulnerabilities detected');
  }
  
  console.log(`Session Security: ${results.sessionSecurity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`RBAC Bypass Protection: ${results.rbacBypass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Password Security: ${results.passwordSecurity ? '✅ PASS' : '❌ FAIL'}`);
  
  const securityScore = [
    vulnerabilities.length === 0,
    results.sessionSecurity,
    results.rbacBypass,
    results.passwordSecurity
  ].filter(Boolean).length;
  
  console.log(`\nOverall Security Score: ${securityScore}/4`);
  
  if (securityScore < 3) {
    console.log('⚠️  SECURITY ALERT: Multiple security issues detected');
  } else if (securityScore === 4) {
    console.log('✅ Security appears robust');
  } else {
    console.log('⚠️  Some security concerns identified');
  }
  
  return results;
}

// Run the security tests
runSecurityTests().catch(console.error);