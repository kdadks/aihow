import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfile() {
  const userId = '6754c844-f073-4fe5-9655-d570dd87fbef';
  
  console.log('Checking profile for user ID:', userId);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId);
    
  console.log('\nProfile query result:');
  console.log('Data:', data);
  console.log('Error:', error);
  
  if (!data || data.length === 0) {
    console.log('\n❌ NO PROFILE FOUND - Creating one...');
    
    // Get user email
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.id === userId);
    
    if (user) {
      console.log('Found user:', user.email);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          username: user.email?.split('@')[0],
          full_name: user.email?.split('@')[0]
        }])
        .select()
        .single();
        
      console.log('Created profile:', newProfile);
      console.log('Create error:', createError);
    }
  }
}

checkProfile().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
