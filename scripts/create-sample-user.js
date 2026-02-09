/**
 * Create a sample user for forum seeding
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function createSampleUser() {
  console.log('👤 Creating sample user for forum seeding...\n');

  const sampleUser = {
    email: 'community@aihow.org',
    password: 'Community@2025',
    email_confirm: true,
  };

  // Try to sign up the user
  const { data: authData, error: signupError } = await supabase.auth.signUp({
    email: sampleUser.email,
    password: sampleUser.password,
    options: {
      data: {
        full_name: 'Community User',
      },
    },
  });

  if (signupError) {
    if (signupError.message.includes('already registered')) {
      console.log('✓ Sample user already exists');

      // Get the existing user
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(u => u.email === sampleUser.email);

      if (existingUser) {
        console.log(`   User ID: ${existingUser.id}`);
        console.log(`   Email: ${existingUser.email}`);
        return existingUser;
      }
    } else {
      console.log('❌ Error creating user:', signupError.message);
      return null;
    }
  }

  if (authData?.user) {
    console.log('✅ Sample user created successfully!');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}`);

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: 'communityuser',
        full_name: 'Community User',
      });

    if (profileError && !profileError.message.includes('duplicate')) {
      console.log('⚠️  Profile creation warning:', profileError.message);
    }

    return authData.user;
  }

  return null;
}

createSampleUser()
  .then(user => {
    if (user) {
      console.log('\n✅ Ready to seed forum data!');
      console.log('   Run: npx tsx scripts/seed-community-data.js');
    } else {
      console.log('\n⚠️  Could not create sample user');
      console.log('   You may need to create a user manually via Supabase Dashboard');
    }
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });
