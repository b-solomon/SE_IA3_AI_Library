/**
 * ai-classify Edge Function
 * =========================
 * Suggests a category and tags for a document based on title + description.
 * Used during document upload to assist admin with classification.
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

  const token = req.headers.get('Authorization')?.slice(7)
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS })

  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: CORS_HEADERS })

  const { title, description } = await req.json()

  // Fetch available categories for the model to choose from
  const { data: categories } = await supabase.from('categories').select('name')
  const categoryList = (categories ?? []).map((c: { name: string }) => c.name).join(', ')

  const prompt = `You are a university library cataloguing assistant.
Given the following document details, suggest the most appropriate category and 3–6 relevant tags.

Title: ${title}
Description: ${description ?? 'Not provided'}

Available categories: ${categoryList}

Respond ONLY with valid JSON in this exact format:
{
  "categoryName": "one of the available categories",
  "tags": ["tag1", "tag2", "tag3"]
}

Do not include any explanation outside the JSON.`

  let categoryName = ''
  let tags: string[] = []
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
            generationConfig: { maxOutputTokens: 256, temperature: 0.2, responseMimeType: 'application/json' },
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
        const parsed = JSON.parse(text.trim())
        categoryName = parsed.categoryName ?? ''
        tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : []
      }
    } catch { /* return empty if AI fails */ }
  }

  return new Response(JSON.stringify({ categoryName, tags }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
})
