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

async function testAdminStatus() {
  console.log('🔍 Testing current admin status...\n');
  
  // Check for existing users with admin@aihow.org
  try {
    console.log('1. Checking for existing admin@aihow.org user...');
    const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Failed to list users:', usersError.message);
    } else {
      const adminUser = users.users.find(u => u.email === 'admin@aihow.org');
      if (adminUser) {
        console.log('✅ Found admin@aihow.org user:', adminUser.id);
        
        // Check profile
        const { data: profile, error: profileError } = await adminSupabase
          .from('profiles')
          .select('*')
          .eq('id', adminUser.id)
          .single();
        
        if (profileError) {
          console.log('❌ No profile found for admin user');
        } else {
          console.log('✅ Profile exists:', profile.full_name);
        }
        
        // Check role assignment
        const { data: roles, error: rolesError } = await adminSupabase
          .from('user_roles')
          .select(`
            roles (name)
          `)
          .eq('user_id', adminUser.id);
        
        if (rolesError) {
          console.log('❌ No roles found for admin user');
        } else {
          console.log('✅ Roles:', roles.map(r => r.roles?.name).join(', '));
        }
        
        return adminUser;
      } else {
        console.log('❌ No admin@aihow.org user found');
      }
    }
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  }
  
  // Check roles table
  try {
    console.log('\n2. Checking roles table...');
    const { data: roles, error: rolesError } = await adminSupabase
      .from('roles')
      .select('*');
    
    if (rolesError) {
      console.error('❌ Failed to check roles:', rolesError.message);
    } else {
      console.log('✅ Available roles:');
      roles.forEach(role => {
        console.log(`   - ${role.name} (ID: ${role.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Error checking roles:', error.message);
  }
  
  // Check profiles table
  try {
    console.log('\n3. Checking profiles table...');
    const { data: profiles, error: profilesError } = await adminSupabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Failed to check profiles:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles.length} profiles`);
      profiles.forEach(profile => {
        console.log(`   - ${profile.full_name || 'No name'} (${profile.username || 'No username'})`);
      });
    }
  } catch (error) {
    console.error('❌ Error checking profiles:', error.message);
  }
  
  return null;
}

testAdminStatus().catch(console.error);