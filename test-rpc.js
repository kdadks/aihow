import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('Testing RPC call...');

// Test the RPC function
const { data, error } = await supabase
  .rpc('get_all_users_with_emails', { 
    page_number: 1, 
    page_size: 10 
  });

console.log('Data:', data);
console.log('Error:', error);
