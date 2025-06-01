import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Use production config
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 TESTING FRONTEND AUTHENTICATION CONTEXTS');
console.log('============================================');

// Simulate the AuthContext behavior
async function testRegularAuthContext() {
  console.log('\n📱 Testing Regular AuthContext behavior...');
  
  try {
    // 1. Test user registration process
    console.log('\n--- Testing registration process ---');
    const testUser = {
      email: 'contexttest@example.com',
      password: 'password123',
      username: 'contexttest'
    };
    
    // Create user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password
    });
    
    if (signUpError && signUpError.message !== 'A user with this email address has already been registered') {
      console.log('❌ Registration failed:', signUpError.message);
      return false;
    }
    
    const userId = signUpData.user?.id;
    console.log('✅ User registration successful, ID:', userId);
    
    // 2. Test profile creation (what AuthProvider does)
    console.log('\n--- Testing profile creation ---');
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: testUser.username,
          full_name: 'Test Context User'
        });
      
      if (profileError && !profileError.message.includes('duplicate key')) {
        console.log('❌ Profile creation failed:', profileError.message);
      } else {
        console.log('✅ Profile created successfully');
      }
    }
    
    // 3. Test login
    console.log('\n--- Testing login process ---');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (loginError) {
      console.log('❌ Login failed:', loginError.message);
      return false;
    }
    
    console.log('✅ Login successful');
    
    // 4. Test role checking (hasRole function)
    console.log('\n--- Testing role checking ---');
    const session = loginData.session;
    const userRoles = session?.user?.app_metadata?.roles || [];
    console.log('User roles from app_metadata:', userRoles);
    
    // Simulate hasRole function
    const hasAdminRole = Array.isArray(userRoles) 
      ? userRoles.includes('admin') 
      : userRoles === 'admin';
    
    console.log('Has admin role:', hasAdminRole);
    
    // 5. Test profile loading
    console.log('\n--- Testing profile loading ---');
    const { data: profileData, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileFetchError) {
      console.log('❌ Profile loading failed:', profileFetchError.message);
    } else {
      console.log('✅ Profile loaded:', profileData);
    }
    
    // Clean up
    await supabase.auth.signOut();
    if (userId) {
      await adminSupabase.auth.admin.deleteUser(userId);
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Regular AuthContext test failed:', error.message);
    return false;
  }
}

// Simulate the AdminAuthContext behavior
async function testAdminAuthContext() {
  console.log('\n🛡️  Testing AdminAuthContext behavior...');
  
  try {
    // 1. Test admin login attempt
    console.log('\n--- Testing admin login attempt ---');
    const adminCredentials = {
      email: 'admin@aihow.org',
      password: 'AIhow@Admin2025'
    };
    
    const { data: adminLoginData, error: adminLoginError } = await supabase.auth.signInWithPassword({
      email: adminCredentials.email,
      password: adminCredentials.password
    });
    
    if (adminLoginError) {
      console.log('❌ Admin login failed:', adminLoginError.message);
      console.log('   This explains why AdminAuthContext fails to authenticate');
      
      // Let's check what admin users exist
      console.log('\n--- Checking existing users in auth system ---');
      const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers();
      if (!usersError && users) {
        console.log(`Found ${users.users.length} users in auth system:`);
        users.users.forEach(user => {
          console.log(`  - ${user.email} (ID: ${user.id})`);
          console.log(`    Confirmed: ${!!user.email_confirmed_at}`);
          console.log(`    Last sign in: ${user.last_sign_in_at || 'Never'}`);
        });
      }
      return false;
    }
    
    console.log('✅ Admin login successful');
    const session = adminLoginData.session;
    
    // 2. Test admin profile loading (what AdminAuthContext does)
    console.log('\n--- Testing admin profile loading ---');
    const { data: adminProfileData, error: adminProfileError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .eq('id', session.user.id)
      .single();
    
    if (adminProfileError) {
      console.log('❌ Admin profile loading failed:', adminProfileError.message);
      console.log('   AdminAuthContext would fail at this step');
    } else {
      console.log('✅ Admin profile loaded:', adminProfileData);
    }
    
    // 3. Test admin role loading (what AdminAuthContext does)
    console.log('\n--- Testing admin role loading ---');
    const { data: adminRoleData, error: adminRoleError } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name,
          role_permissions (
            permissions (name)
          )
        )
      `)
      .eq('user_id', session.user.id);
    
    if (adminRoleError) {
      console.log('❌ Admin role loading failed:', adminRoleError.message);
      console.log('   This would cause AdminAuthContext to fail');
      
      // Check if the tables exist and what's the actual issue
      console.log('\n--- Diagnosing role loading issues ---');
      
      // Check user_roles table
      const { data: userRolesCheck, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (userRolesError) {
        console.log('   user_roles table issue:', userRolesError.message);
      } else {
        console.log('   user_roles data:', userRolesCheck);
      }
      
      // Check roles table
      const { data: rolesCheck, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .limit(3);
      
      if (rolesError) {
        console.log('   roles table issue:', rolesError.message);
      } else {
        console.log('   available roles:', rolesCheck);
      }
      
    } else {
      console.log('✅ Admin roles loaded:', adminRoleData);
      
      // Extract role info as AdminAuthContext does
      const firstRole = adminRoleData?.[0]?.roles;
      const userRole = firstRole?.name || 'content_admin';
      const userPermissions = firstRole?.role_permissions?.map(rp => rp.permissions.name) || [];
      
      console.log('   Extracted role:', userRole);
      console.log('   Extracted permissions:', userPermissions);
    }
    
    // 4. Test permission checking
    console.log('\n--- Testing admin permission checking ---');
    const validRoles = ['admin', 'system_admin', 'content_admin'];
    const currentRole = adminRoleData?.[0]?.roles?.name;
    const hasValidRole = validRoles.includes(currentRole);
    
    console.log('Current role:', currentRole);
    console.log('Has valid admin role:', hasValidRole);
    
    if (!hasValidRole) {
      console.log('❌ User does not have admin privileges');
      console.log('   AdminAuthContext would reject this user');
    }
    
    await supabase.auth.signOut();
    return true;
    
  } catch (error) {
    console.log('❌ AdminAuthContext test failed:', error.message);
    return false;
  }
}

// Test authentication conflicts
async function testAuthenticationConflicts() {
  console.log('\n⚡ Testing Authentication Conflicts...');
  
  try {
    // Test if both auth systems can work with the same user
    console.log('\n--- Testing dual authentication systems ---');
    
    // Create a test user that could be used by both systems
    const testEmail = 'dualauth@example.com';
    const testPassword = 'password123';
    
    // Create user
    const { data: userData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (createError && createError.message !== 'A user with this email address has already been registered') {
      console.log('❌ Failed to create test user:', createError.message);
      return false;
    }
    
    const userId = userData?.user?.id;
    console.log('✅ Test user created/exists');
    
    // Create profile
    if (userId) {
      await adminSupabase.from('profiles').upsert({
        id: userId,
        username: testEmail,
        full_name: 'Dual Auth Test User'
      });
    }
    
    // Test: Login through regular auth system
    console.log('\n--- Testing login through regular auth system ---');
    const regularClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: regularLogin, error: regularError } = await regularClient.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (regularError) {
      console.log('❌ Regular auth login failed:', regularError.message);
    } else {
      console.log('✅ Regular auth login successful');
      
      // Test: Try admin auth while regular auth is active
      console.log('\n--- Testing admin auth while regular auth is active ---');
      const adminClient = createClient(supabaseUrl, supabaseAnonKey);
      const { data: adminLogin, error: adminLoginError } = await adminClient.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (adminLoginError) {
        console.log('❌ Admin auth login failed while regular auth active:', adminLoginError.message);
        console.log('   This suggests session conflicts');
      } else {
        console.log('✅ Admin auth login successful while regular auth active');
        console.log('   Both systems can handle the same user simultaneously');
        
        // Check if sessions are different
        const { data: regularSession } = await regularClient.auth.getSession();
        const { data: adminSession } = await adminClient.auth.getSession();
        
        if (regularSession.session?.access_token === adminSession.session?.access_token) {
          console.log('⚠️  WARNING: Same session token used by both systems');
        } else {
          console.log('✅ Different session tokens - proper isolation');
        }
        
        await adminClient.auth.signOut();
      }
      
      await regularClient.auth.signOut();
    }
    
    // Clean up
    if (userId) {
      await adminSupabase.auth.admin.deleteUser(userId);
    }
    
    return true;
    
  } catch (error) {
    console.log('❌ Authentication conflicts test failed:', error.message);
    return false;
  }
}

// Create an admin user for testing
async function createTestAdminUser() {
  console.log('\n🔧 Creating test admin user...');
  
  try {
    const adminEmail = 'testadmin@aihow.org';
    const adminPassword = 'TestAdmin2025!';
    
    // 1. Create admin user in auth
    const { data: userData, error: userError } = await adminSupabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (userError && userError.message !== 'A user with this email address has already been registered') {
      console.log('❌ Failed to create admin user:', userError.message);
      return null;
    }
    
    const userId = userData?.user?.id;
    if (!userId) {
      // Get existing user
      const { data: users } = await adminSupabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === adminEmail);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        console.log('❌ Could not get user ID');
        return null;
      }
    }
    
    console.log('✅ Admin user created/exists, ID:', userId);
    
    // 2. Create profile
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: userId,
        username: adminEmail,
        full_name: 'Test Admin User'
      });
    
    if (profileError && !profileError.message.includes('duplicate key')) {
      console.log('❌ Profile creation failed:', profileError.message);
    } else {
      console.log('✅ Admin profile created');
    }
    
    // 3. Try to assign admin role (if roles table exists)
    try {
      const { data: roleData, error: roleError } = await adminSupabase
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single();
      
      if (!roleError && roleData) {
        const { error: userRoleError } = await adminSupabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role_id: roleData.id
          });
        
        if (userRoleError && !userRoleError.message.includes('duplicate key')) {
          console.log('❌ Role assignment failed:', userRoleError.message);
        } else {
          console.log('✅ Admin role assigned');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not assign role (table may not exist):', error.message);
    }
    
    return { email: adminEmail, password: adminPassword, id: userId };
    
  } catch (error) {
    console.log('❌ Failed to create test admin user:', error.message);
    return null;
  }
}

// Main test execution
async function runFrontendAuthTests() {
  console.log('🚀 Starting frontend authentication context tests...\n');
  
  const results = {
    regularAuth: false,
    adminAuth: false,
    conflicts: false
  };
  
  // Run tests
  results.regularAuth = await testRegularAuthContext();
  results.adminAuth = await testAdminAuthContext();
  results.conflicts = await testAuthenticationConflicts();
  
  // If admin auth failed, try creating a test admin
  if (!results.adminAuth) {
    console.log('\n🔧 Admin auth failed, attempting to create test admin...');
    const testAdmin = await createTestAdminUser();
    
    if (testAdmin) {
      console.log('\n🔄 Retrying admin auth test with created admin...');
      // Retry admin test with the new credentials
      const { data: testLoginData, error: testLoginError } = await supabase.auth.signInWithPassword({
        email: testAdmin.email,
        password: testAdmin.password
      });
      
      if (!testLoginError) {
        console.log('✅ Test admin login successful!');
        results.adminAuth = true;
        await supabase.auth.signOut();
      } else {
        console.log('❌ Test admin login still failed:', testLoginError.message);
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 FRONTEND AUTH TEST RESULTS');
  console.log('='.repeat(50));
  
  console.log(`Regular AuthContext: ${results.regularAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin AuthContext: ${results.adminAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication Conflicts: ${results.conflicts ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  return results;
}

// Run the tests
runFrontendAuthTests().catch(console.error);