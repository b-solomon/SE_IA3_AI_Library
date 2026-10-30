/**
 * ai-summarize Edge Function
 * ==========================
 * Admin-only. Summarises a digital asset using AI.
 * Sends only metadata (title, author, description, tags) by default.
 * Never sends raw file contents without disclosure.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  Deno.env.get('APP_URL') ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })

  // Auth
  const token = req.headers.get('Authorization')?.slice(7)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: CORS_HEADERS })

  // Admin check
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: CORS_HEADERS })
  }

  const { assetId } = await req.json()

  const { data: asset } = await supabase
    .from('digital_assets')
    .select('title, author, isbn, description, tags, file_type, file_size')
    .eq('id', assetId)
    .single()

  if (!asset) return new Response(JSON.stringify({ error: 'Asset not found' }), { status: 404, headers: CORS_HEADERS })

  const prompt = `Summarise the following academic document for a university student:
Title: ${asset.title}
Author: ${asset.author}
ISBN: ${asset.isbn ?? 'N/A'}
Type: ${asset.file_type === 'application/pdf' ? 'PDF' : 'EPUB'}
Description: ${asset.description ?? 'Not provided'}
Tags: ${asset.tags?.join(', ') ?? 'None'}

Provide a concise 3–5 sentence academic summary suitable for a library catalogue. Focus on the subject matter, intended audience, and key topics covered.`

  let summary = ''
  const geminiKey = Deno.env.get('GEMINI_API_KEY')

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 512, temperature: 0.3 },
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        summary = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      }
    } catch { /* fall through */ }
  }

  if (!summary) summary = 'AI summarisation is temporarily unavailable. Please try again later.'

  return new Response(JSON.stringify({ summary }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
