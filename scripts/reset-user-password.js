import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^e(eyJ)/, '$1');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetUserPassword() {
  console.log('=== Reset User Password ===\n');

  // List existing users
  console.log('Fetching existing users...\n');
  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();

  if (listError || !users) {
    console.error('❌ Failed to list users:', listError?.message);
    rl.close();
    return;
  }

  console.log('Existing users:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
  });

  console.log('\n');
  const emailInput = await question('Enter the email address of the user: ');
  const newPassword = await question('Enter the new password (min 6 characters): ');

  if (!emailInput || !newPassword) {
    console.log('❌ Email and password are required');
    rl.close();
    return;
  }

  if (newPassword.length < 6) {
    console.log('❌ Password must be at least 6 characters long');
    rl.close();
    return;
  }

  // Find the user
  const user = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase());

  if (!user) {
    console.log(`❌ User with email "${emailInput}" not found`);
    console.log('\nWould you like to create a new user? (y/n)');
    const createNew = await question('> ');

    if (createNew.toLowerCase() === 'y') {
      console.log('\nCreating new user...');
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: emailInput,
        password: newPassword,
        email_confirm: true
      });

      if (createError) {
        console.log('❌ Failed to create user:', createError.message);
      } else {
        console.log('✅ User created successfully!');
        console.log('   Email:', newUser.user.email);
        console.log('   ID:', newUser.user.id);
        console.log('   You can now log in with these credentials.');
      }
    }
  } else {
    console.log(`\nResetting password for: ${user.email}`);

    const { data, error } = await adminClient.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    );

    if (error) {
      console.log('❌ Failed to reset password:', error.message);
    } else {
      console.log('✅ Password reset successfully!');
      console.log('   Email:', data.user.email);
      console.log('   You can now log in with the new password.');
    }
  }

  rl.close();
}

resetUserPassword().catch(error => {
  console.error('Error:', error);
  rl.close();
});
