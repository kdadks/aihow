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
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTable() {
  try {
    // Use raw fetch to execute SQL
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS public.user_role_assignments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, role_id)
          );

          ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

          DO $$ 
          BEGIN
            CREATE POLICY "Users can read their own role assignments" 
              ON public.user_role_assignments
              FOR SELECT 
              TO authenticated 
              USING (user_id = auth.uid());
          EXCEPTION
            WHEN duplicate_object THEN
              NULL;
          END $$;
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error creating table:', error);
    } else {
      console.log('Table created successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createTable();
