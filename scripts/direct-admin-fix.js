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
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';

// Admin credentials
const adminEmail = 'admin@aihow.org';
const adminPassword = 'AIhow@Admin2025';

async function fixAdminAccount() {
  console.log('Creating/fixing admin account directly...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // 1. Create admin user directly in auth system
    console.log('Creating admin user in auth system...');
    
    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: { full_name: 'System Administrator' }
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      
      // If the user already exists, try to update them
      if (error.message.includes('already exists')) {
        console.log('Admin user already exists, will try updating...');
        
        // First try to get the user by email
        const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
        
        if (fetchError) {
          console.error('Error fetching users:', fetchError);
          return;
        }
        
        const adminUser = users.find(u => u.email === adminEmail);
        
        if (adminUser) {
          console.log('Found existing admin user, updating password...');
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            adminUser.id,
            { password: adminPassword, email_confirm: true }
          );
          
          if (updateError) {
            console.error('Error updating admin user:', updateError);
          } else {
            console.log('✅ Admin user updated successfully');
          }
        } else {
          console.error('Admin user not found in auth system');
        }
      }
      
      return;
    }
    
    console.log('Admin user created successfully with ID:', user.id);
    
    // 2. Check if profile exists, and create/update if needed
    console.log('Checking admin profile in public.profiles...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', adminEmail)
      .single();
      
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating admin profile...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id, 
            username: adminEmail,
            full_name: 'System Administrator'
          });
          
        if (insertError) {
          console.error('Error creating admin profile:', insertError);
        } else {
          console.log('✅ Admin profile created successfully');
        }
      } else {
        console.error('Error checking admin profile:', profileError);
      }
    } else {
      console.log('Admin profile already exists, updating if needed...');
      
      // If ID doesn't match user ID, update it
      if (profileData.id !== user.id) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ id: user.id })
          .eq('username', adminEmail);
          
        if (updateError) {
          console.error('Error updating admin profile:', updateError);
        } else {
          console.log('✅ Admin profile updated successfully');
        }
      }
    }
    
    // 3. Check if admin role exists, create if not
    console.log('Checking admin role in public.roles...');
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id, name')
      .eq('name', 'admin')
      .single();
      
    if (roleError) {
      if (roleError.code === 'PGRST116') {
        console.log('Creating admin role...');
        const { data: newRole, error: createRoleError } = await supabase
          .from('roles')
          .insert({ name: 'admin', description: 'Full system access' })
          .select()
          .single();
          
        if (createRoleError) {
          console.error('Error creating admin role:', createRoleError);
          return;
        }
        
        console.log('✅ Admin role created successfully');
        var adminRoleId = newRole.id;
      } else {
        console.error('Error checking admin role:', roleError);
        return;
      }
    } else {
      console.log('Admin role exists with ID:', roleData.id);
      var adminRoleId = roleData.id;
    }
    
    // 4. Assign admin role to user
    console.log('Assigning admin role to user...');
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_id', adminRoleId);
      
    if (userRoleError) {
      console.error('Error checking user role assignment:', userRoleError);
    } else if (!userRoleData || userRoleData.length === 0) {
      console.log('Admin role not assigned, adding assignment...');
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role_id: adminRoleId });
        
      if (assignError) {
        console.error('Error assigning admin role:', assignError);
      } else {
        console.log('✅ Admin role assigned successfully');
      }
    } else {
      console.log('✅ Admin role already assigned');
    }
    
    console.log('\n✅ Admin user setup complete');
    console.log('Try logging in with:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixAdminAccount();
