// Creates admin user in Supabase and sets role = 'admin' in profiles table
const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

const ADMIN_EMAIL    = 'admin@karunya.edu'
const ADMIN_PASSWORD = 'Admin@1234'
const ADMIN_NAME     = 'BODDU SOLOMON - Admin'

async function main() {
  console.log('🔧 Creating admin user:', ADMIN_EMAIL)

  // Step 1: Create user via Admin API (bypasses email confirmation)
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    }),
  })

  const createData = await createRes.json()

  if (!createRes.ok) {
    if (createData.message?.includes('already been registered') || createData.code === 'email_exists') {
      console.log('ℹ️  User already exists — skipping creation, will still update role.')
    } else {
      console.error('❌ Failed to create user:', JSON.stringify(createData, null, 2))
      process.exit(1)
    }
  } else {
    console.log('✅ User created! ID:', createData.id)
  }

  // Step 2: Upsert profile with role = 'admin'
  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(ADMIN_EMAIL)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      role: 'admin',
      full_name: ADMIN_NAME,
    }),
  })

  const profileData = await profileRes.json()
  
  if (profileRes.ok && Array.isArray(profileData) && profileData.length > 0) {
    console.log('✅ Profile updated to admin role!')
    console.log('   Profile:', profileData[0])
  } else {
    console.log('⚠️  Profile patch response:', JSON.stringify(profileData))
    console.log('   Trying INSERT instead...')

    // Get the user ID first
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(ADMIN_EMAIL)}`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    })
    const userData = await userRes.json()
    const userId = userData?.users?.[0]?.id || createData?.id

    if (!userId) {
      console.error('❌ Could not find user ID')
      process.exit(1)
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        id: userId,
        email: ADMIN_EMAIL,
        full_name: ADMIN_NAME,
        role: 'admin',
      }),
    })
    const insertData = await insertRes.json()
    console.log('Insert result:', JSON.stringify(insertData, null, 2))
  }

  console.log('\n🎉 Done! Admin credentials:')
  console.log('   URL:      http://localhost:5173/login')
  console.log('   Email:    admin@karunya.edu')
  console.log('   Password: Admin@1234')
}

main().catch(console.error)
