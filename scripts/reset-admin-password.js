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

async function resetAdminPassword() {
  console.log('Resetting admin password...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get the admin user ID using the service role key
    console.log('Finding admin user by email...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', adminEmail)
      .single();
      
    if (profileError) {
      console.error('Error finding admin user:', profileError);
      return;
    }
    
    if (!profileData?.id) {
      console.error('Admin user not found in profiles');
      return;
    }
    
    const userId = profileData.id;
    console.log('Admin user ID:', userId);
    
    // Update admin user password using the admin API
    console.log('Updating admin password...');
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: adminPassword }
    );
    
    if (error) {
      console.error('Error updating admin password:', error);
      return;
    }
    
    console.log('✅ Admin password reset successful');
    console.log('Try logging in with:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

resetAdminPassword();
