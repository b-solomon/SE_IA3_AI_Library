// Test if RLS is blocking the profile read for the admin user
const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODM0NjIsImV4cCI6MjEwODg1OTQ2Mn0.WHzdJyi0ACEVLG93wKKbS8VoPee1vuCOkJZxcWPDfN8'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

// First sign in as admin to get a real JWT
async function main() {
  console.log('1. Signing in as admin to get JWT...')
  const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
    body: JSON.stringify({ email: 'admin@karunya.edu', password: 'Admin@1234' }),
  })
  const signInData = await signInRes.json()
  
  if (!signInData.access_token) {
    console.error('❌ Sign-in failed:', JSON.stringify(signInData))
    return
  }
  console.log('✅ Signed in. User ID:', signInData.user.id)

  // 2. Try to read own profile with anon key + user JWT (what the browser does)
  console.log('\n2. Reading profile with user JWT (RLS test)...')
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${signInData.user.id}&select=*`,
    {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${signInData.access_token}`,
      },
    }
  )
  const profileData = await profileRes.json()
  console.log('Profile read result:', JSON.stringify(profileData, null, 2))

  if (Array.isArray(profileData) && profileData.length === 0) {
    console.log('\n⚠️  RLS is BLOCKING the profile read — user gets empty array!')
    console.log('   This means isAdmin stays false for ALL users.')
    console.log('   FIX: Need to add RLS policy: allow users to read their own profile.')
  } else if (Array.isArray(profileData) && profileData[0]) {
    console.log('\n✅ Profile readable. Role is:', profileData[0].role)
  }
}

main().catch(console.error)
