import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigrations() {
  try {
    // Read the migration file
    const migration = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20250603181354_add_profiles_and_user_role.sql'), 'utf8');
    console.log('Applying migration for profiles and user role...');

    // Create profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (profilesError?.code === 'PGRST301') {
      console.log('Creating profiles table...');
      await supabase.auth.admin.createTable({
        name: 'profiles',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true, references: 'auth.users(id)', onDelete: 'CASCADE' },
          { name: 'username', type: 'text' },
          { name: 'avatar_url', type: 'text' },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' }
        ]
      });
      
      // Enable RLS
      await supabase.rpc('set_table_rls', { table_name: 'profiles' });
      
      // Create RLS policies
      await supabase.rpc('create_rls_policy', {
        table_name: 'profiles',
        policy_name: 'Users can view own profile',
        definition: 'id = auth.uid()',
        operation: 'SELECT'
      });
      
      await supabase.rpc('create_rls_policy', {
        table_name: 'profiles',
        policy_name: 'Users can update own profile',
        definition: 'id = auth.uid()',
        operation: 'UPDATE'
      });
      
      await supabase.rpc('create_rls_policy', {
        table_name: 'profiles',
        policy_name: 'Users can insert own profile',
        definition: 'id = auth.uid()',
        operation: 'INSERT'
      });
    }

    // Add default user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('name', 'user')
      .single();

    if (roleError?.code === 'PGRST404') {
      console.log('Adding default user role...');
      await supabase
        .from('user_roles')
        .insert({
          name: 'user',
          description: 'Default role for registered users',
          permissions: {
            canUpdateProfile: true,
            canViewContent: true
          }
        });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

applyMigrations();
