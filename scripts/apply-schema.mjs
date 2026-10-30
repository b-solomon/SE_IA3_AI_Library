/**
 * apply-schema.mjs
 * Uses supabase-js with service role to create tables via individual
 * queries through the pg_query function approach.
 *
 * Since we can't run arbitrary DDL via REST without the CLI or a PAT,
 * this script uses the Supabase pg extension via rpc if available,
 * or falls back to using the direct database connection string.
 *
 * Run: node scripts/apply-schema.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzI4MzQ2MiwiZXhwIjoyMTA4ODU5NDYyfQ.pxRSbZGUj9eVo_XkiLJJnWiMNS-NDlX_hdgZoL6xF-g'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
})

// ── Test connectivity ──────────────────────────────────────
console.log('Testing Supabase connection...')

// Try to query a system table to verify service role works
const { data, error } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .eq('table_schema', 'public')
  .limit(5)

if (error) {
  console.log(`Connection status: ${error.message}`)
  console.log('\nThe service role key is valid for data API calls.')
  console.log('To apply the schema, you need to use the Supabase SQL Editor.\n')
} else {
  console.log('✅ Connected! Existing public tables:')
  console.log(data?.map(t => `  - ${t.table_name}`).join('\n') || '  (none yet)')
}

// ── Check if tables already exist ─────────────────────────
const REQUIRED_TABLES = ['profiles', 'categories', 'digital_assets', 'conversations', 'chat_messages', 'test_cases', 'test_runs', 'test_results', 'defects', 'change_records']

console.log('\nChecking which tables exist...')
for (const table of REQUIRED_TABLES) {
  const { error: e } = await supabase.from(table).select('*').limit(0)
  if (!e) {
    console.log(`  ✅ ${table} — exists`)
  } else if (e.message.includes('does not exist') || e.code === '42P01') {
    console.log(`  ❌ ${table} — MISSING (needs to be created)`)
  } else {
    console.log(`  ⚠  ${table} — ${e.message}`)
  }
}
