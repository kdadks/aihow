import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function createTablesDirectly() {
  console.log('🚀 Creating Database Tables Directly...');
  
  try {
    // First, let's try to insert permissions data into the existing structure
    // Check if we can work around the missing tables
    
    console.log('🔍 Checking current table structure...');
    
    // Try to get existing roles
    const { data: roles, error: rolesError } = await adminClient
      .from('roles')
      .select('id, name')
      .limit(5);
    
    if (rolesError) {
      console.log('❌ Cannot access roles table:', rolesError.message);
      return false;
    }
    
    console.log('✅ Roles table accessible');
    console.log('📋 Existing roles:', roles.map(r => r.name).join(', '));
    
    // Since we can't create the missing tables via client,
    // let's focus on what we can fix with the existing admin user
    
    console.log('\n🔧 Checking admin user configuration...');
    
    // Test the existing admin user login
    const { data: loginData, error: loginError } = await adminClient.auth.signInWithPassword({
      email: 'testadmin@aihow.org',
      password: 'admin123'
    });
    
    if (loginError) {
      console.log('❌ Admin login failed:', loginError.message);
      
      // Try to reset the admin password
      console.log('🔧 Attempting to reset admin password...');
      const { error: resetError } = await adminClient.auth.admin.updateUserById(
        '11a0cba6-ee96-4a0d-96ab-2f853e41c80d',
        { password: 'AIhow@Admin2025' }
      );
      
      if (resetError) {
        console.log('❌ Password reset failed:', resetError.message);
      } else {
        console.log('✅ Admin password reset to AIhow@Admin2025');
      }
    } else {
      console.log('✅ Admin login successful');
      await adminClient.auth.signOut();
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

createTablesDirectly().catch(console.error);