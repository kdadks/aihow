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
const supabaseServiceKey = (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^e(eyJ)/, '$1');

console.log('=== Testing User Creation and Login ===\n');

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function testFullAuthFlow() {
  const testEmail = 'testuser-' + Date.now() + '@example.com';
  const testPassword = 'TestPassword123!';

  console.log('1. Creating new test user...');
  console.log(`   Email: ${testEmail}`);

  // Create user with admin client to skip email confirmation
  const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: 'Test User'
    }
  });

  if (createError) {
    console.log('❌ Failed to create user:', createError.message);
    return;
  }

  console.log('✅ User created successfully');
  console.log('   User ID:', createData.user.id);
  console.log('   Email confirmed:', createData.user.email_confirmed_at ? 'Yes' : 'No');

  console.log('\n2. Waiting 2 seconds before attempting login...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n3. Attempting to login with the new user...');

  const { data: loginData, error: loginError } = await anonClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.log('❌ Login failed:', loginError.message);
    console.log('   Error code:', loginError.code);
    console.log('   Status:', loginError.status);

    // Check if the user exists
    console.log('\n4. Verifying user still exists...');
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    const foundUser = users.find(u => u.email === testEmail);

    if (foundUser) {
      console.log('✅ User exists in database');
      console.log('   Email confirmed:', foundUser.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Created at:', foundUser.created_at);
    } else {
      console.log('❌ User not found in database');
    }

  } else {
    console.log('✅ Login successful!');
    console.log('   User ID:', loginData.user?.id);
    console.log('   Email:', loginData.user?.email);
    console.log('   Session:', loginData.session ? 'Active' : 'None');

    // Test profile creation
    console.log('\n4. Checking if profile was created...');
    const { data: profile, error: profileError } = await anonClient
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (profileError) {
      console.log('⚠️  Profile not found (this is expected initially)');
    } else {
      console.log('✅ Profile exists:', profile);
    }
  }

  // Cleanup
  console.log('\n5. Cleaning up test user...');
  try {
    await adminClient.auth.admin.deleteUser(createData.user.id);
    console.log('✅ Test user deleted');
  } catch (error) {
    console.log('⚠️  Could not delete test user');
  }
}

testFullAuthFlow().catch(console.error);
