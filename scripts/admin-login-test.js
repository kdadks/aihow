import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Hardcoded values from the .env file we saw
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTAxMjQsImV4cCI6MjA2Mzc2NjEyNH0.KVrcmJiDxRoyp4zNnqr-C50KlRfNguTuH6F3tICNsJM';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function checkAdminLogin() {
  console.log('Testing admin login with anon key...');
  
  // Client for admin login attempts (uses anon key like the frontend)
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  
  // Client for admin verification (uses service role key for admin access)
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Admin credentials from SQL script
    const adminEmail = 'admin@aihow.org';
    const adminPassword = 'AIhow@Admin2025';
    
    // 1. Directly test login first
    console.log('\nAttempting admin login...');
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (signInError) {
      console.error('Admin login failed:', signInError);
      console.log('\nChecking admin user in database...');
    } else {
      console.log('✓ Admin login successful!');
      console.log('Session:', signInData.session ? 'Created' : 'Not created');
      console.log('User ID:', signInData.user?.id);
    }
    
    // 2. Use the service role client to query the auth.users table directly
    console.log('\nVerifying admin user exists in database...');
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('auth_users_view') // This is often exposed by Supabase
      .select('*')
      .eq('email', adminEmail)
      .single();
    
    if (usersError) {
      console.log('Could not query auth users view, trying users table...');
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users') // Try direct database access
        .select('*')
        .eq('email', adminEmail)
        .single();
        
      if (userError) {
        console.error('Error fetching admin user from database:', userError);
      } else if (userData) {
        console.log('✓ Admin user found in users table');
        console.log('User data:', userData);
      } else {
        console.error('Admin user not found in users table');
      }
    } else if (usersData) {
      console.log('✓ Admin user exists in auth_users_view');
      console.log('User data:', usersData);
    } else {
      console.error('Admin user not found in auth_users_view');
    }
    
    // 3. Check admin profile in public.profiles
    console.log('\nChecking admin profile in public.profiles...');
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('username', adminEmail)
      .single();
      
    if (profilesError) {
      console.error('Error fetching admin profile:', profilesError);
    } else if (!profilesData) {
      console.error('Admin profile does not exist in public.profiles');
    } else {
      console.log('✓ Admin profile exists in public.profiles');
      console.log('Profile:', profilesData);
    }
    
    // 4. Check admin role in public.roles
    console.log('\nChecking admin role in public.roles...');
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id, name')
      .eq('name', 'admin')
      .single();
      
    if (roleError) {
      console.error('Error fetching admin role:', roleError);
    } else if (!roleData) {
      console.error('Admin role does not exist in public.roles');
    } else {
      console.log('✓ Admin role exists in public.roles');
      console.log('Role ID:', roleData.id);
      
      // 5. Check role assignment if we found a profile
      if (profilesData) {
        console.log('\nChecking if admin role is assigned to the user...');
        const { data: userRoleData, error: userRoleError } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', profilesData.id)
          .eq('role_id', roleData.id);
          
        if (userRoleError) {
          console.error('Error fetching user role assignment:', userRoleError);
        } else if (!userRoleData || userRoleData.length === 0) {
          console.error('Admin user does not have admin role assigned');
        } else {
          console.log('✓ Admin user has admin role assigned');
        }
      }
    }
    
    // Return true if login was successful, false otherwise
    return !signInError;
    
  } catch (error) {
    console.error('Error during admin check:', error);
    return false;
  }
}

// Run the test
checkAdminLogin().then(success => {
  if (success) {
    console.log('\n✅ Admin user is correctly configured and can log in');
  } else {
    console.log('\n❌ Admin login check failed');
  }
});
