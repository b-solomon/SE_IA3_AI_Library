import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase browser client.
 *
 * SECURITY: This client uses ONLY the anon (public) key, which is safe to
 * expose in the browser. All authorization is enforced server-side via
 * Row Level Security (RLS) policies on every table.
 *
 * The service-role key is NEVER imported here — it exists only inside
 * Edge Functions where it is injected via Supabase secrets.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// During development without env vars, create a no-op-safe placeholder.
// This prevents hard crashes on import — queries will fail gracefully.
let client: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
} else {
  // Placeholder client for dev without Supabase configured.
  // Shows a helpful warning in console.
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.\n' +
      'Copy .env.example to .env and fill in your Supabase project credentials.'
  )
  client = createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
    auth: { persistSession: false },
  })
}

export const supabase = client

export type { SupabaseClient }
