import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';

async function testAuthSystem() {
  console.log('Testing authentication system...\n');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }
  
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
  const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Test credentials
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    // 1. First check auth configuration
    console.log('Checking auth settings...');
    const { data: authSettings, error: settingsError } = await adminSupabase
      .from('auth_config')
      .select('*')
      .single();
      
    if (settingsError) {
      console.log('Could not check auth settings, continuing anyway...');
    } else {
      console.log('Auth settings:', authSettings);
    }
    
    // 2. Create test user using auth admin API
    console.log('\nCreating test user...');
    const { data: userData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (createError) {
      throw createError;
    }
    
    console.log('Test user created with ID:', userData.user.id);
    
    // 3. Create profile for test user
    console.log('\nCreating test profile...');
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        username: testEmail,
        full_name: 'Test User'
      });
      
    if (profileError) {
      throw profileError;
    }
    
    // 4. Test logging in with test user
    console.log('\nTesting login with test credentials...');
    const { data: loginData, error: loginError } = await anonSupabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Test user login failed:', loginError);
      console.log('\nThis indicates a general problem with the auth system');
    } else {
      console.log('✅ Test user login successful!');
      console.log('Session:', loginData.session ? 'Created' : 'Not created');
      console.log('User ID:', loginData.user?.id);
      console.log('\nThis indicates the auth system is working correctly');
      console.log('The admin login issue is specific to the admin account');
    }
    
    // 5. Clean up - delete test user
    console.log('\nCleaning up test user...');
    await adminSupabase.auth.admin.deleteUser(userData.user.id);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuthSystem();