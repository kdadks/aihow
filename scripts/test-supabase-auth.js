import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Setup Supabase client
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const admin = {
  email: 'admin@aihow.org',
  password: 'AIhow@Admin2025',
  fullName: 'System Administrator',
};

async function ensureAdminUser() {
  console.log('Checking and fixing admin account...');
  
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(admin.email);
    
    if (fetchError && fetchError.message !== 'User not found') {
      console.error('Error fetching user:', fetchError);
      return;
    }
    
    if (!existingUser) {
      console.log('Creating admin user...');
      
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          full_name: admin.fullName,
        }
      });
      
      if (createError) {
        console.error('Error creating admin user:', createError);
        return;
      }
      
      console.log('Admin user created successfully:', newUser.user.id);
    } else {
      console.log('Admin user exists:', existingUser.user.id);
      
      // Update password if needed
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.user.id,
        {
          password: admin.password,
          email: admin.email,
          email_confirm: true,
        }
      );
      
      if (updateError) {
        console.error('Error updating admin user:', updateError);
        return;
      }
      
      console.log('Admin user password updated');
    }
    
    // Try a login test
    console.log('Testing admin login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: admin.email,
      password: admin.password,
    });
    
    if (signInError) {
      console.error('Admin login test failed:', signInError);
    } else {
      console.log('Admin login test successful!');
    }

    // Now check and fix roles and profile
    await ensureAdminUserHasRole(existingUser?.user?.id || signInData?.user?.id);
    await ensureAdminProfile(existingUser?.user?.id || signInData?.user?.id);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function ensureAdminUserHasRole(userId) {
  if (!userId) {
    console.error('Missing user ID for role assignment');
    return;
  }
  
  // Check if roles table exists and has admin role
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('id, name')
    .eq('name', 'admin');
    
  if (rolesError) {
    console.error('Error checking roles:', rolesError);
    return;
  }
  
  let adminRoleId = roles?.[0]?.id;
  
  // If admin role doesn't exist, create it
  if (!adminRoleId) {
    const { data: newRole, error: createRoleError } = await supabase
      .from('roles')
      .insert({ name: 'admin', description: 'Full system access' })
      .select();
      
    if (createRoleError) {
      console.error('Error creating admin role:', createRoleError);
      return;
    }
    
    adminRoleId = newRole[0].id;
    console.log('Created admin role:', adminRoleId);
  }
  
  // Check if user already has admin role
  const { data: userRoles, error: userRolesError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role_id', adminRoleId);
    
  if (userRolesError) {
    console.error('Error checking user roles:', userRolesError);
    return;
  }
  
  // Assign admin role if not already assigned
  if (!userRoles || userRoles.length === 0) {
    const { error: assignRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: adminRoleId,
        created_at: new Date().toISOString()
      });
      
    if (assignRoleError) {
      console.error('Error assigning admin role:', assignRoleError);
    } else {
      console.log('Admin role assigned to user');
    }
  } else {
    console.log('User already has admin role');
  }
}

async function ensureAdminProfile(userId) {
  if (!userId) {
    console.error('Missing user ID for profile creation');
    return;
  }
  
  // Check if user profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
    
  if (profileError) {
    console.error('Error checking profile:', profileError);
    return;
  }
  
  // Create profile if doesn't exist
  if (!profile || profile.length === 0) {
    const { error: createProfileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: admin.email,
        full_name: admin.fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (createProfileError) {
      console.error('Error creating profile:', createProfileError);
    } else {
      console.log('Created admin profile');
    }
  } else {
    console.log('Admin profile exists');
  }
}

// Run the main function
ensureAdminUser();
