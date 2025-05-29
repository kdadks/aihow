import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Hardcoded values from the .env file we saw
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';

// Admin credentials
const adminEmail = 'admin@aihow.org';
const adminPassword = 'AIhow@Admin2025';

/**
 * Detailed Supabase auth debugging script
 */
async function debugSupabaseAuth() {
  console.log('=== Supabase Authentication Debug ===\n');
  console.log(`URL: ${supabaseUrl}`);
  
  // Create client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  let hasIssues = false;
  
  console.log('\n1. Testing direct API connection...');
  try {
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    
    if (healthResponse.ok) {
      console.log('✅ API connection successful');
    } else {
      console.error('❌ API connection failed:', healthResponse.status, healthResponse.statusText);
      hasIssues = true;
    }
  } catch (error) {
    console.error('❌ API connection error:', error.message);
    hasIssues = true;
  }
  
  console.log('\n2. Testing auth API endpoint...');
  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, {
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    
    console.log(`Auth API status: ${authResponse.status} ${authResponse.statusText}`);
    
    if (authResponse.status === 404) {
      console.log('✅ Auth API endpoint exists (404 is expected for root path)');
    } else if (authResponse.ok) {
      console.log('✅ Auth API endpoint exists and is responding');
    } else {
      console.error('❌ Auth API endpoint issue:', authResponse.status, authResponse.statusText);
      hasIssues = true;
    }
  } catch (error) {
    console.error('❌ Auth API connection error:', error.message);
    hasIssues = true;
  }
  
  console.log('\n3. Testing direct API login with raw fetch...');
  try {
    const loginResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword
      })
    });
    
    const responseBody = await loginResponse.text();
    console.log(`Direct login status: ${loginResponse.status} ${loginResponse.statusText}`);
    
    if (loginResponse.ok) {
      console.log('✅ Direct API login successful');
      try {
        const jsonResponse = JSON.parse(responseBody);
        console.log('Access token received:', jsonResponse.access_token ? 'Yes' : 'No');
      } catch (e) {
        console.log('Response body (not JSON):', responseBody.substring(0, 100) + (responseBody.length > 100 ? '...' : ''));
      }
    } else {
      console.error('❌ Direct API login failed');
      console.error('Response body:', responseBody);
      hasIssues = true;
    }
  } catch (error) {
    console.error('❌ Error during direct API login:', error.message);
    hasIssues = true;
  }
  
  console.log('\n4. Testing SDK login...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (error) {
      console.error('❌ SDK login failed:', error);
      hasIssues = true;
      
      // Additional error info
      if (error.message && error.message.includes('rate limited')) {
        console.log('⚠️ You may be rate limited. Wait a few minutes and try again.');
      }
      
      if (error.message && error.message.includes('Invalid login credentials')) {
        console.log('⚠️ This suggests the password in the database does not match.');
        console.log('   - Check if the password was properly hashed with bcrypt/pgcrypto.');
        console.log('   - Ensure email_confirmed_at is set to a date in auth.users.');
      }
    } else {
      console.log('✅ SDK login successful');
      console.log('User ID:', data.user.id);
      console.log('Session token received:', data.session ? 'Yes' : 'No');
      console.log('User email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    }
  } catch (error) {
    console.error('❌ Unexpected error during SDK login:', error);
    hasIssues = true;
  }

  // Check for specific configuration issues
  console.log('\n5. Checking for common configuration issues...');
  
  // CORS check
  console.log('\nCORS Configuration:');
  console.log('Ensure your Supabase project has these CORS origins configured:');
  console.log('- http://localhost:5177');
  console.log('- http://localhost:5177/');
  console.log('- http://localhost:*');
  console.log('- https://aihow.netlify.app (production)');
  
  // Site URL
  console.log('\nSite URL Configuration:');
  console.log('Ensure your Supabase project has a site URL configured:');
  console.log('Development: http://localhost:5177');
  console.log('Production: https://aihow.netlify.app');
  
  // Redirect URLs
  console.log('\nRedirect URLs:');
  console.log('Ensure your Supabase project has these redirect URLs configured:');
  console.log('- http://localhost:5177/');
  console.log('- http://localhost:5177/login');
  console.log('- http://localhost:5177/auth/callback');
  console.log('- https://aihow.netlify.app/');
  console.log('- https://aihow.netlify.app/login');
  console.log('- https://aihow.netlify.app/auth/callback');
  
  if (hasIssues) {
    console.log('\n❌ Authentication issues detected. Please check the output above for details.');
    console.log('More suggestions:');
    console.log('1. Verify that the admin user exists in auth.users (via Supabase dashboard).');
    console.log('2. Check auth settings in Supabase dashboard (Authentication > Settings).');
    console.log('3. Try creating a completely new user and test login with that account.');
    console.log('4. Verify that email confirmation is properly set up for the admin user.');
    console.log('5. Check if Rate Limiting is blocking your requests (too many failed attempts).');
  } else {
    console.log('\n✅ All authentication tests passed!');
  }
}

// Run the diagnostics
debugSupabaseAuth().catch(err => {
  console.error('Script error:', err);
});
