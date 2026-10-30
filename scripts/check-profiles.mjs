// Check profiles table schema and fix admin role
const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

const ADMIN_EMAIL = 'admin@karunya.edu'
const ADMIN_ID    = '0229a621-c946-4133-86a9-26f170b7d100'

async function main() {
  // Check all profiles
  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*&limit=5`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
  })
  const data = await res.json()
  console.log('Profiles sample:', JSON.stringify(data, null, 2))

  // Try to find the admin user profile by ID
  const adminRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${ADMIN_ID}`, {
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
  })
  const adminProfile = await adminRes.json()
  console.log('\nAdmin profile by ID:', JSON.stringify(adminProfile, null, 2))
}

main().catch(console.error)
