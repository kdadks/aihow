const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkUserRole() {
  const email = 'kdadks@outlook.com';
  
  // Get user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  const user = users?.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log('User ID:', user.id);
  
  // Check user_roles
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id);
    
  console.log('user_roles result:', { userRoles, rolesError });
  
  if (userRoles && userRoles.length > 0) {
    // Get role details
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', userRoles[0].role_id)
      .single();
      
    console.log('Role data:', { roleData, roleError });
  }
}

checkUserRole().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
