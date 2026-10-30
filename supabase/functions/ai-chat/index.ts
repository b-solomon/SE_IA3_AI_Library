/**
 * ai-chat Edge Function
 * =====================
 * Secure AI chatbot proxy. All API keys stay server-side.
 * Fallback chain: Gemini Flash → OpenRouter free → NVIDIA NIM free
 *
 * SECURITY: JWT required. Service-role key never exposed to browser.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ---- Types ----
interface ChatRequest {
  conversationId: string
  message: string
  contextAssetIds?: string[]
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ---- Supabase client (service-role, server-side only) ----
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  // 1. Verify JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // 2. Parse request
  const body: ChatRequest = await req.json()
  const { conversationId, message, contextAssetIds } = body

  // 3. Fetch conversation history
  const { data: historyData } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20)

  const history: Message[] = (historyData ?? []).map((m: { role: string; content: string }) => ({
    role: m.role as Message['role'],
    content: m.content,
  }))

  // 4. Optionally fetch asset context (metadata only — no file contents sent by default)
  let contextText = ''
  if (contextAssetIds?.length) {
    const { data: assets } = await supabase
      .from('digital_assets')
      .select('title, author, description, tags')
      .in('id', contextAssetIds)
      .eq('is_published', true)

    if (assets?.length) {
      contextText = '\n\nContext documents:\n' +
        assets.map((a: { title: string; author: string; description?: string; tags?: string[] }) =>
          `- "${a.title}" by ${a.author}. ${a.description ?? ''} Tags: ${a.tags?.join(', ') ?? ''}`
        ).join('\n')
    }
  }

  // 5. Build system prompt
  const systemPrompt = `You are the friendly, intelligent, and articulate Library Intelligence Assistant for Karunya University's AI Digital Library (Subject: Software Engineering, Course Code: 25CS312, Student: BODDU SOLOMON, Reg No: URK25CS1191).
You assist students and faculty in finding academic resources, understanding Software Engineering principles, navigating the 12 SE Lab modules, and exploring the project architecture.${contextText}

Guidelines for your personality and answers:
- Be genuinely conversational, warm, and natural — like an expert human academic mentor and teaching assistant.
- When greeted (e.g., "hi", "hello"), respond naturally and warmly, introducing yourself and offering relevant avenues to explore. Never output robotic or generic templates like "I found 2 relevant digital assets for 'hi'".
- When asked about the student or project, reference Boddu Solomon (URK25CS1191), Karunya University, 25CS312, and the 5 Course Outcomes.
- When asked technical questions, provide clear, accurate, and deeply insightful explanations (e.g., Black-Box vs White-Box testing, Equivalence Partitioning, Boundary Value Analysis, Agile + Incremental lifecycle, UML diagrams, SQA metrics like TPR, DRE, SMI).
- If recommending resources, cite reputable engineering literature (e.g., Pressman, Martin, Kleppmann, Russell & Norvig).
- Be polite, supportive, and engaging.`

  // 6. Try Gemini Flash → OpenRouter → NVIDIA NIM
  const allMessages: Message[] = [
    ...history,
    { role: 'user', content: message },
  ]

  let reply = ''
  let modelUsed = 'unknown'

  // --- Attempt 1: Gemini Flash ---
  const geminiKey = Deno.env.get('GEMINI_API_KEY')
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: allMessages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
          }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (reply) modelUsed = 'gemini-1.5-flash-latest'
      }
    } catch { /* fall through */ }
  }

  // --- Attempt 2: OpenRouter (free tier) ---
  if (!reply) {
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY')
    if (openrouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openrouterKey}`,
            'HTTP-Referer': 'https://ai-library.karunya.edu',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              ...allMessages,
            ],
            max_tokens: 1024,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          reply = data.choices?.[0]?.message?.content ?? ''
          if (reply) modelUsed = 'llama-3-8b-instruct (OpenRouter)'
        }
      } catch { /* fall through */ }
    }
  }

  // --- Attempt 3: NVIDIA NIM ---
  if (!reply) {
    const nvidiaKey = Deno.env.get('NVIDIA_API_KEY')
    if (nvidiaKey) {
      try {
        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: 'meta/llama-3.1-8b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              ...allMessages,
            ],
            max_tokens: 1024,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          reply = data.choices?.[0]?.message?.content ?? ''
          if (reply) modelUsed = 'llama-3.1-8b-instruct (NVIDIA NIM)'
        }
      } catch { /* fall through */ }
    }
  }

  if (!reply) {
    reply = 'I\'m having trouble connecting to the AI service right now. Please try again in a moment.'
    modelUsed = 'unavailable'
  }

  // 7. Save assistant message
  await supabase.from('chat_messages').insert([
    { conversation_id: conversationId, role: 'user', content: message },
    { conversation_id: conversationId, role: 'assistant', content: reply, model_used: modelUsed },
  ])

  // 8. Update conversation timestamp
  await supabase.from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return new Response(
    JSON.stringify({ reply, modelUsed }),
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json',
        'X-Model-Used': modelUsed,
      },
    }
  )
})
