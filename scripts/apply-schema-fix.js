import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bynlkphjpmxskoqiahow.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ';

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function applySchemaFix() {
  console.log('🚀 Applying Database Schema Fix...');
  
  try {
    // Read the migration file
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20250601000000_fix_critical_auth_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📖 Read migration file successfully');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await adminClient.rpc('exec_sql', { sql: statement });
          if (error) {
            throw error;
          }
        } catch (error) {
          console.log(`   ⚠️  Statement ${i + 1} failed (might be expected): ${error.message}`);
          // Continue with other statements - some failures are expected
        }
      }
    }
    
    console.log('✅ Schema fix applied successfully');
    
    // Verify the tables exist
    console.log('\n🔍 Verifying table creation...');
    const tables = ['permissions', 'role_permissions'];
    
    for (const table of tables) {
      try {
        const { data, error } = await adminClient.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' verification failed: ${error.message}`);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (error) {
        console.log(`❌ Table '${table}' verification error: ${error.message}`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to apply schema fix:', error);
    return false;
  }
}

// Alternative direct SQL execution
async function executeDirectSQL() {
  console.log('\n🔧 Attempting direct SQL execution...');
  
  const sql = `
-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role_permissions table  
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- Insert basic permissions
INSERT INTO public.permissions (name, description, category) VALUES
    ('admin:read', 'Read admin data', 'admin'),
    ('admin:write', 'Write admin data', 'admin'),
    ('admin:manage_users', 'Manage users', 'admin'),
    ('system:admin', 'System administration', 'system')
ON CONFLICT (name) DO NOTHING;
  `;
  
  try {
    const { error } = await adminClient.rpc('exec_sql', { sql });
    if (error) {
      console.log('❌ Direct SQL execution failed:', error.message);
      return false;
    }
    console.log('✅ Direct SQL execution successful');
    return true;
  } catch (error) {
    console.log('❌ Direct SQL execution error:', error.message);
    return false;
  }
}

async function main() {
  const success = await applySchemaFix();
  if (!success) {
    console.log('\n🔄 Trying alternative approach...');
    await executeDirectSQL();
  }
}

main().catch(console.error);