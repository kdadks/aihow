import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables');
    process.exit(1);
}

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verifyAdminSetup() {
    console.log('Verifying admin user setup...');

    try {
        // 1. Check auth.users for admin
        const { data: adminUser, error: userError } = await adminSupabase.auth.admin.listUsers();
        if (userError) throw userError;

        const admin = adminUser.users.find(u => u.email === 'admin@aihow.org');
        if (!admin) {
            throw new Error('Admin user not found in auth.users');
        }

        console.log('✓ Admin user exists in auth.users');

        // 2. Check profile
        const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('*')
            .eq('id', admin.id)
            .single();

        if (profileError) throw profileError;
        if (!profile) {
            throw new Error('Admin profile not found');
        }

        console.log('✓ Admin profile exists');

        // 3. Check admin role exists
        const { data: roles, error: rolesError } = await adminSupabase
            .from('roles')
            .select('*')
            .eq('name', 'admin')
            .single();

        if (rolesError) throw rolesError;
        if (!roles) {
            throw new Error('Admin role not found');
        }

        console.log('✓ Admin role exists');

        // 4. Check role assignment
        const { data: roleAssignment, error: assignmentError } = await adminSupabase
            .from('user_roles')
            .select('*')
            .eq('user_id', admin.id)
            .eq('role_id', roles.id)
            .single();

        if (assignmentError) throw assignmentError;
        if (!roleAssignment) {
            throw new Error('Admin role not assigned to admin user');
        }

        console.log('✓ Admin role properly assigned');
        console.log('\nAdmin user setup is complete and correct');

        // Verify RLS bypass capability
        const { data: testData, error: testError } = await adminSupabase
            .from('roles')
            .select('*');

        if (testError) {
            console.error('\nWarning: Service role cannot bypass RLS:', testError.message);
        } else {
            console.log('\n✓ Service role can bypass RLS');
        }

    } catch (error) {
        console.error('\nError during verification:', error.message);
        process.exit(1);
    }
}

verifyAdminSetup();
