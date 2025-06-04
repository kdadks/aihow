import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env.local');

dotenv.config({ path: envPath });

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function createTableStructure() {
  try {
    // First check if table exists
    const { error: checkError } = await supabase
      .from('user_role_assignments')
      .select('id')
      .limit(1);

    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Creating user_role_assignments table...');

      // Create table using prepared statement
      const queries = [
        `CREATE TABLE IF NOT EXISTS public.user_role_assignments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          role_id INTEGER NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        
        `ALTER TABLE public.user_role_assignments 
         ADD CONSTRAINT user_role_unique UNIQUE(user_id, role_id);`,
        
        `ALTER TABLE public.user_role_assignments 
         ADD CONSTRAINT fk_user FOREIGN KEY (user_id) 
         REFERENCES auth.users(id) ON DELETE CASCADE;`,
        
        `ALTER TABLE public.user_role_assignments 
         ADD CONSTRAINT fk_role FOREIGN KEY (role_id) 
         REFERENCES public.roles(id) ON DELETE CASCADE;`,
        
        `ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;`,
        
        `DROP POLICY IF EXISTS "Users can read their own role assignments" 
         ON public.user_role_assignments;`,
        
        `CREATE POLICY "Users can read their own role assignments" 
         ON public.user_role_assignments FOR SELECT TO authenticated 
         USING (user_id = auth.uid());`
      ];

      for (const query of queries) {
        const { error } = await supabase.rpc('execute_sql', { sql: query });
        if (error) {
          console.error('Error executing query:', error);
          console.error('Failed query:', query);
          throw error;
        }
      }

      console.log('Table created successfully with all constraints and policies');
    } else {
      console.log('Table already exists');
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTableStructure();
