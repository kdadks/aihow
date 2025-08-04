import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Admin user credentials
const ADMIN_EMAIL = 'testadmin@aihow.org'
const ADMIN_PASSWORD = 'AIhow@Admin2025'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function validateAdminPortal() {
  console.log('🔍 Starting Admin Portal Validation...\n')

  try {
    // Test 1: Admin Authentication
    console.log('1️⃣ Testing Admin Authentication...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (authError) {
      console.log('❌ Admin authentication failed:', authError.message)
      
      // Check if user exists
      console.log('🔍 Checking if admin user exists in auth.users...')
      const { data: adminCheck } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', ADMIN_EMAIL)
        .single()
      
      if (!adminCheck) {
        console.log('❌ Admin user does not exist. Creating admin user...')
        
        // Try to create admin user
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        })
        
        if (signupError) {
          console.log('❌ Failed to create admin user:', signupError.message)
          return
        } else {
          console.log('✅ Admin user created successfully')
          console.log('📧 Check email for confirmation link or use local auth')
        }
      }
      return
    }

    console.log('✅ Admin authentication successful')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${authData.user.email}`)

    // Test 2: Check Admin Profile
    console.log('\n2️⃣ Testing Admin Profile Access...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.log('❌ Profile access failed:', profileError.message)
    } else {
      console.log('✅ Admin profile found:')
      console.log(`   Display Name: ${profile.display_name}`)
      console.log(`   Role: ${profile.role}`)
    }

    // Test 3: Check User Roles (New Structure)
    console.log('\n3️⃣ Testing User Roles Access...')
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')

    if (rolesError) {
      console.log('❌ Roles access failed:', rolesError.message)
    } else {
      console.log('✅ User roles accessible:')
      roles.forEach(role => {
        console.log(`   - ${role.name}: ${role.description}`)
      })
    }

    // Test 4: Check User Role Assignments
    console.log('\n4️⃣ Testing User Role Assignments...')
    const { data: assignments, error: assignmentsError } = await supabase
      .from('user_roles')
      .select(`
        *,
        roles(name, description, permissions)
      `)
      .eq('user_id', authData.user.id)

    if (assignmentsError) {
      console.log('❌ Role assignments access failed:', assignmentsError.message)
    } else if (assignments.length === 0) {
      console.log('⚠️  No role assignments found for admin user')
    } else {
      console.log('✅ Admin role assignments found:')
      assignments.forEach(assignment => {
        console.log(`   - Role: ${assignment.user_roles.name}`)
        console.log(`   - Permissions: ${JSON.stringify(assignment.user_roles.permissions, null, 2)}`)
      })
    }

    // Test 5: Check System Settings
    console.log('\n5️⃣ Testing System Settings Access...')
    const { data: settings, error: settingsError } = await supabase
      .from('system_settings')
      .select('*')

    if (settingsError) {
      console.log('❌ System settings access failed:', settingsError.message)
    } else {
      console.log('✅ System settings accessible:')
      settings.forEach(setting => {
        console.log(`   - ${setting.key}: ${setting.value} (${setting.category})`)
      })
    }

    // Test 6: Check Feature Flags
    console.log('\n6️⃣ Testing Feature Flags Access...')
    const { data: flags, error: flagsError } = await supabase
      .from('feature_flags')
      .select('*')

    if (flagsError) {
      console.log('❌ Feature flags access failed:', flagsError.message)
    } else {
      console.log('✅ Feature flags accessible:')
      flags.forEach(flag => {
        console.log(`   - ${flag.name}: ${flag.enabled ? 'enabled' : 'disabled'}`)
      })
    }

    // Test 7: Check Audit Logs
    console.log('\n7️⃣ Testing Audit Logs Access...')
    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .limit(5)

    if (logsError) {
      console.log('❌ Audit logs access failed:', logsError.message)
    } else {
      console.log(`✅ Audit logs accessible (${logs.length} entries found)`)
      logs.forEach(log => {
        console.log(`   - ${log.action} on ${log.resource_type} at ${log.created_at}`)
      })
    }

    // Test 8: Test Admin Functions
    console.log('\n8️⃣ Testing Admin Functions...')
    
    // Test creating a system setting
    const { data: newSetting, error: createError } = await supabase
      .from('system_settings')
      .insert({
        key: 'test_setting',
        value: '"test_value"',
        description: 'Test setting for validation',
        category: 'test',
        is_public: false
      })
      .select()
      .single()

    if (createError) {
      console.log('❌ Failed to create test setting:', createError.message)
    } else {
      console.log('✅ Successfully created test setting')
      
      // Clean up test setting
      await supabase
        .from('system_settings')
        .delete()
        .eq('key', 'test_setting')
    }

    console.log('\n🎉 Admin Portal Validation Complete!')

  } catch (error) {
    console.error('💥 Validation failed with error:', error)
  }
}

// Run validation
validateAdminPortal()
