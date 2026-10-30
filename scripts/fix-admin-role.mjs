// Fix admin role - patch by UUID id
const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

const ADMIN_ID = '0229a621-c946-4133-86a9-26f170b7d100'

async function main() {
  console.log('🔧 Setting role = admin for ID:', ADMIN_ID)

  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${ADMIN_ID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ role: 'admin' }),
  })

  const data = await res.json()
  console.log('Result:', JSON.stringify(data, null, 2))

  if (Array.isArray(data) && data[0]?.role === 'admin') {
    console.log('\n✅ SUCCESS! Admin credentials ready:')
    console.log('   URL:      http://localhost:5173/login')
    console.log('   Email:    admin@karunya.edu')
    console.log('   Password: Admin@1234')
  }
}

main().catch(console.error)
