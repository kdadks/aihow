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

async function recreateAdmin() {
  console.log('Recreating admin account...\n');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }
  
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
  const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
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
      // Delete profile first (cascade will handle user_roles)
      await adminSupabase
        .from('profiles')
        .delete()
        .eq('id', existingProfile.id);
        
      // Then delete auth user
      await adminSupabase.auth.admin.deleteUser(existingProfile.id);
    }
    
    // 2. Create new admin user
    console.log('\nCreating new admin user...');
    const { data: userData, error: createError } = await adminSupabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'System Administrator' },
      app_metadata: { provider: 'email', providers: ['email'] }
    });
    
    if (createError) {
      throw createError;
    }
    
    const userId = userData.user.id;
    console.log('Created admin user with ID:', userId);
    
    // 3. Set up admin profile
    console.log('\nCreating admin profile...');
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: userId,
        username: adminEmail,
        full_name: 'System Administrator',
        updated_at: new Date().toISOString()
      });
      
    if (profileError) {
      throw profileError;
    }
    
    // 4. Set up admin role
    console.log('\nSetting up admin role...');
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
    
    // 5. Assign admin role
    console.log('\nAssigning admin role...');
    const { error: assignError } = await adminSupabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId
      });
      
    if (assignError) {
      throw assignError;
    }
    
    // 6. Test admin login
    console.log('\nTesting admin login...');
    const { data: loginData, error: loginError } = await anonSupabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (loginError) {
      console.error('❌ Admin login failed:', loginError);
    } else {
      console.log('✅ Admin login successful!');
      console.log('Session:', loginData.session ? 'Created' : 'Not created');
      console.log('User ID:', loginData.user?.id);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

recreateAdmin();