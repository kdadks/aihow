import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('=== Authentication Test ===\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function testAuth() {
  console.log('\n1. Testing connection to Supabase...');

  try {
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (healthError) {
      console.log('⚠️  Database connection issue:', healthError.message);
    } else {
      console.log('✅ Connected to Supabase');
    }
  } catch (error) {
    console.log('⚠️  Database connection test failed:', error.message);
  }

  console.log('\n2. Checking auth.users table for existing users...');

  // Try to get a list of users (this will only work with service role)
  const { data: sessionData } = await supabase.auth.getSession();
  console.log('Current session:', sessionData.session ? 'Active' : 'None');

  console.log('\n3. Attempting to login with test credentials...');

  // Test with a simple email/password
  const testEmail = 'admin@how2doai.com';
  const testPassword = 'Test123!';

  console.log(`Testing login for: ${testEmail}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  console.log('\n=== Login Result ===');
  console.log('Error:', error);
  console.log('Data:', data ? {
    user: data.user ? {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    } : null,
    session: data.session ? 'Present' : 'None'
  } : null);

  if (error) {
    console.log('\n❌ Authentication failed:');
    console.log('   Error message:', error.message);
    console.log('   Error code:', error.code || 'N/A');
    console.log('   Error status:', error.status || 'N/A');
  } else if (data.user) {
    console.log('\n✅ Authentication successful!');
    console.log('   User ID:', data.user.id);
    console.log('   Email:', data.user.email);
  }

  // Test with another common email if the first one failed
  if (error) {
    console.log('\n4. Trying alternate test credentials...');
    const altEmail = 'test@example.com';
    const altPassword = 'password123';

    console.log(`Testing login for: ${altEmail}`);

    const { data: altData, error: altError } = await supabase.auth.signInWithPassword({
      email: altEmail,
      password: altPassword,
    });

    console.log('\n=== Alternate Login Result ===');
    console.log('Error:', altError?.message);
    console.log('Success:', altData?.user ? 'Yes' : 'No');
  }
}

testAuth().catch(console.error);
