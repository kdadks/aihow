#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSimpleAdmin() {
  console.log('🚀 Creating Simple Admin User...\n');
  
  try {
    // Check if testadmin@aihow.org already has admin role
    console.log('1. Checking existing testadmin@aihow.org...');
    const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Failed to list users:', usersError.message);
      return;
    }
    
    const existingAdmin = users.users.find(u => u.email === 'testadmin@aihow.org');
    
    if (existingAdmin) {
      console.log('✅ Found testadmin@aihow.org user:', existingAdmin.id);
      
      // Check if it has admin role
      const { data: userRoles, error: roleError } = await adminSupabase
        .from('user_roles')
        .select(`
          roles (name)
        `)
        .eq('user_id', existingAdmin.id);
      
      if (roleError) {
        console.error('❌ Failed to check user roles:', roleError.message);
      } else {
        const hasAdminRole = userRoles.some(ur => ur.roles?.name === 'admin');
        
        if (hasAdminRole) {
          console.log('✅ testadmin@aihow.org already has admin role!');
          console.log('\n🎉 SUCCESS! Admin user already exists and configured!');
          console.log('\n📋 Admin User Details:');
          console.log(`   Email: testadmin@aihow.org`);
          console.log(`   User ID: ${existingAdmin.id}`);
          console.log('\n✅ You can use this admin user to test admin authentication.');
          return;
        } else {
          console.log('⚠️  testadmin@aihow.org exists but doesn\'t have admin role');
          console.log('   Assigning admin role...');
          
          // Get admin role ID
          const { data: adminRole, error: adminRoleError } = await adminSupabase
            .from('roles')
            .select('id')
            .eq('name', 'admin')
            .single();
          
          if (adminRoleError) {
            console.error('❌ Failed to get admin role:', adminRoleError.message);
            return;
          }
          
          // Assign admin role
          const { error: assignError } = await adminSupabase
            .from('user_roles')
            .insert({
              user_id: existingAdmin.id,
              role_id: adminRole.id,
              created_at: new Date().toISOString()
            });
          
          if (assignError) {
            console.error('❌ Failed to assign admin role:', assignError.message);
            return;
          }
          
          console.log('✅ Admin role assigned to testadmin@aihow.org!');
          console.log('\n🎉 SUCCESS! Admin user configured!');
          console.log('\n📋 Admin User Details:');
          console.log(`   Email: testadmin@aihow.org`);
          console.log(`   User ID: ${existingAdmin.id}`);
          return;
        }
      }
    }
    
    // If no existing admin, try to create admin@aihow.org with a simpler approach
    console.log('\n2. Creating admin@aihow.org user...');
    
    // Try creating with minimal data
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
      email: 'admin@aihow.org',
      password: 'AdminPass123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'System Administrator'
      }
    });
    
    if (createError) {
      console.error('❌ Failed to create admin user:', createError.message);
      console.log('\n📝 MANUAL SETUP INSTRUCTIONS:');
      console.log('Since automatic user creation failed, please:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to Authentication > Users');
      console.log('3. Click "Add user" ');
      console.log('4. Create user with:');
      console.log('   - Email: admin@aihow.org');
      console.log('   - Password: AdminPass123!');
      console.log('   - Confirm Email: Yes');
      console.log('5. Then run this script again to assign the admin role');
      return;
    }
    
    if (newUser?.user) {
      console.log('✅ Admin user created successfully!');
      console.log(`   User ID: ${newUser.user.id}`);
      
      // Create profile
      const { error: profileError } = await adminSupabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          full_name: 'System Administrator',
          username: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('❌ Failed to create profile:', profileError.message);
      } else {
        console.log('✅ Admin profile created');
      }
      
      // Assign admin role
      const { data: adminRole, error: adminRoleError } = await adminSupabase
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single();
      
      if (adminRoleError) {
        console.error('❌ Failed to get admin role:', adminRoleError.message);
        return;
      }
      
      const { error: assignError } = await adminSupabase
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role_id: adminRole.id,
          created_at: new Date().toISOString()
        });
      
      if (assignError) {
        console.error('❌ Failed to assign admin role:', assignError.message);
        return;
      }
      
      console.log('✅ Admin role assigned!');
      console.log('\n🎉 SUCCESS! Admin user created and configured!');
      console.log('\n📋 Admin User Details:');
      console.log(`   Email: admin@aihow.org`);
      console.log(`   Password: AdminPass123!`);
      console.log(`   User ID: ${newUser.user.id}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createSimpleAdmin();