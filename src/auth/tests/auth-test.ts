// Test file to validate the authentication flow
import { supabase } from '../../lib/supabase';

// This file is for testing auth flows with our updated query approach

// Test login functionality
async function testLogin(email: string, password: string) {
  console.log(`Testing login with email: ${email}...`);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return false;
    }

    console.log('Login successful:', data.user?.id);
    return true;
  } catch (error) {
    console.error('Login test failed:', error);
    return false;
  }
}

// Test signup functionality
async function testSignup(email: string, password: string, username: string) {
  console.log(`Testing signup with email: ${email}...`);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      return false;
    }

    console.log('Signup successful:', data);
    
    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          username: username
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return false;
      }
      
      console.log('Profile created successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Signup test failed:', error);
    return false;
  }
}

// Main test function to run
async function main() {
  // Get test credentials from environment variables or use defaults
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  const testPassword = process.env.TEST_PASSWORD || 'password123';
  const testUsername = process.env.TEST_USERNAME || 'testuser';
  
  // Uncomment to test signup
  // const signupResult = await testSignup(testEmail, testPassword, testUsername);
  // console.log(`Signup test ${signupResult ? 'passed' : 'failed'}`);
  
  // Test login
  const loginResult = await testLogin(testEmail, testPassword);
  console.log(`Login test ${loginResult ? 'passed' : 'failed'}`);
  
  if (loginResult) {
    // Test profile query after successful login
    const profile = await testProfileQuery();
    if (profile) {
      console.log('✅ Authentication query test successful');
    } else {
      console.log('❌ Authentication query test failed');
    }
  }
}

// Run the test
main().catch(console.error);

async function testProfileQuery() {
  console.log('Testing profile query...');
  
  const { data } = await supabase.auth.getSession();
  if (!data.session || !data.session.user) {
    console.log('No active session found. Please login first.');
    return null;
  }

  try {
    // Fetch basic profile first (as implemented in our fixes)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();
        
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return null;
    }
    
    console.log('Profile data:', profileData);

    // Then separately fetch user roles
    const { data: userRolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role_id, role:roles(id, name)')
      .eq('user_id', data.session.user.id);

    if (rolesError) {
      console.error('Roles fetch error:', rolesError);
      return null;
    }

    console.log('User roles data:', userRolesData);

    // Create user profile with roles from separate queries
    const roles = userRolesData?.map((ur: any) => ur.role) || [];
    
    const profile = {
      id: data.session.user.id,
      username: profileData?.username || data.session.user.id,
      full_name: profileData?.full_name,
      avatar_url: profileData?.avatar_url,
      roles: roles
    };

    console.log('Combined profile data:', profile);
    return profile;
  } catch (error) {
    console.error('Test failed:', error);
    return null;
  }
}

// We're not exporting this as it's meant to be run directly for testing
// To test: npm run ts-node src/auth/tests/auth-test.ts
