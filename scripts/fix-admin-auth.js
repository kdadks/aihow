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

async function fixAdminAuth() {
  console.log('Running admin auth fix...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Admin credentials
    const adminEmail = 'admin@aihow.org';
    const adminPassword = 'AIhow@Admin2025';
    
    // 1. Clean up existing admin
    console.log('Cleaning up existing admin...');
    const { data: existingProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('username', adminEmail)
      .single();
      
    if (existingProfile?.id) {
      console.log('Deleting existing admin user and profile...');
      // Delete from profiles first (cascade will handle user_roles)
      await adminSupabase
        .from('profiles')
        .delete()
        .eq('id', existingProfile.id);
        
      // Then delete auth user
      await adminSupabase.auth.admin.deleteUser(existingProfile.id);
    }
    
    // 2. Sign up new admin user
    console.log('Creating new admin account...');
    // Create admin user using the existing create_initial_admin function
    const { error: createError } = await adminSupabase.rpc('create_initial_admin', {
      email: adminEmail,
      password: adminPassword
    });

    if (createError) {
      throw createError;
    }

    console.log('Admin user created successfully');
    
    // Verify admin user exists
    console.log('Verifying admin user...');
    const { data: adminData, error: verifyError } = await adminSupabase
      .from('profiles')
      .select('id, username')
      .eq('username', adminEmail)
      .single();

    if (verifyError || !adminData) {
      throw new Error('Failed to verify admin user creation');
    }

    console.log('Admin user verified:', adminData);
    
    // 5. Set up admin role
    console.log('Setting up admin role...');
    let roleId;
    
    const { data: existingRole } = await adminSupabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();
      
    if (existingRole) {
      roleId = existingRole.id;
    } else {
      const { data: newRole, error: roleError } = await adminSupabase
        .from('roles')
        .insert({ name: 'admin', description: 'Full system access' })
        .select()
        .single();
        
      if (roleError) {
        throw roleError;
      }
      
      roleId = newRole.id;
    }
    
    // 6. Assign admin role
    console.log('Assigning admin role...');
    const { error: assignError } = await adminSupabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId
      });
      
    if (assignError) {
      throw assignError;
    }
    
    // 7. Test login
    console.log('\nTesting admin login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (loginError) {
      console.error('Login test failed:', loginError);
    } else {
      console.log('✅ Login test successful!');
      console.log('Session:', loginData.session ? 'Created' : 'Not created');
      console.log('User ID:', loginData.user?.id);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdminAuth();