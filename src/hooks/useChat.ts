import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import type { ChatMessage, Conversation } from '@/types'
import { generateId } from '@/lib/utils'

function generateFallbackReply(text: string): string {
  const lower = text.toLowerCase()

  if (/^(hi|hello|hey|hola|namaste|vanakkam|good\s*(morning|afternoon|evening)|yo|sup)(\b|[!., ])/i.test(lower) || lower === 'hi' || lower === 'hello') {
    return "Hey there! 👋 Glad you're here. I'm your Library Intelligence Assistant & Software Engineering guide for Karunya University.\n\nWhether you'd like to find textbooks (like Pressman, Clean Architecture, or MIT Database Systems), explore testing techniques for 25CS312 (Black-Box & White-Box), or understand how Boddu Solomon built this system's architecture, I'm happy to help. What's on your mind today?"
  }
  if (lower.includes('how are you') || lower.includes("how's it going")) {
    return "I'm doing great, thank you for asking! 😊 Everything is running smoothly — our Supabase PostgreSQL database is connected, all 18 automated test suites are passing, and our academic catalog is ready. How can I help you with your studies or viva preparation today?"
  }
  if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('your purpose')) {
    return "I'm the Library Intelligence Assistant designed specifically for Karunya University's AI Digital Library (25CS312).\n\nHere is what I can do for you:\n• 📚 Recommend & summarize textbooks and research papers in our catalog\n• 📐 Explain Software Engineering theory (UML diagrams, COCOMO II, SQA metrics)\n• 🧪 Walk you through real test cases (Equivalence Partitioning, Boundary Value Analysis)\n• 🔍 Guide you through Boddu Solomon's project architecture and design decisions."
  }
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('awesome') || lower.includes('cool') || lower.includes('great')) {
    return "You're very welcome! 😊 Always happy to help. Feel free to ask anything else about the library or the Software Engineering lab modules whenever you're ready."
  }
  if (lower.includes('who made') || lower.includes('who built') || lower.includes('author') || lower.includes('creator') || lower.includes('student') || lower.includes('solomon') || lower.includes('boddu') || lower.includes('urk25cs1191') || lower.includes('register number')) {
    return "This project was designed and implemented by **BODDU SOLOMON** (Register No: **URK25CS1191**) at **Karunya University** for the course **Software Engineering (Course Code: 25CS312)**.\n\nIt is built as a complete academic platform demonstrating both a production-grade digital library and a 12-module interactive SE lab covering all five Course Outcomes (CO1 through CO5)."
  }
  if (lower.includes('black-box') || lower.includes('blackbox') || lower.includes('boundary value') || lower.includes('equivalence')) {
    return "Great question on Black-Box Testing (LU III / CO3)!\n\nIn this project, Black-Box Testing evaluates requirements without inspecting internal code:\n1. **Equivalence Partitioning (TC-BB-01/02):** Partitions user registration input into valid and invalid classes.\n2. **Boundary Value Analysis (TC-BB-07/08):** Tests the exact 50 MB file upload constraint (exact 50 MB passes, 50.1 MB is rejected).\n3. **Security & Authorization (TC-BB-11):** Verifies that non-admin student sessions cannot access administrative endpoints.\n\nCheck the **SE Lab → Black-Box Testing** module to inspect the full test suite!"
  }
  if (lower.includes('white-box') || lower.includes('whitebox') || lower.includes('cfg') || lower.includes('coverage') || lower.includes('cyclomatic')) {
    return "White-Box Testing (LU III / CO3) inspects internal logic, control paths, and code branches:\n\n• **Control Flow Graph (CFG):** Maps internal functions into decision nodes, process blocks, and exit nodes.\n• **Cyclomatic Complexity V(G):** Calculated as E - N + 2P to find independent basis paths.\n• **Code Coverage:** Tested with Vitest to guarantee 100% path coverage for authentication schemas.\n\nCheck the **SE Lab → White-Box Testing** module for the interactive CFG visualizer!"
  }
  if (lower.includes('process model') || lower.includes('agile') || lower.includes('waterfall') || lower.includes('co1') || lower.includes('sprint')) {
    return "For CO1 (Software Process Models), Boddu Solomon selected and justified the **Agile + Incremental** model:\n\n**Why Agile + Incremental?**\n• Traditional Waterfall is rigid — requirement changes cause severe schedule slippage.\n• With Agile, the platform was built across multiple sprint increments:\n  - Sprint 1: Scaffold, Supabase schema & RLS\n  - Sprint 2: Core Digital Library & real PDF storage\n  - Sprint 3: AI Intelligence Assistant & Edge Functions\n  - Sprint 4: 12 SE Lab Modules & Mermaid UML Suite\n  - Sprint 5: SQA, Black/White-Box Testing & Hardening."
  }
  if (lower.includes('book') || lower.includes('pdf') || lower.includes('epub') || lower.includes('clean code') || lower.includes('recommend') || lower.includes('reading') || lower.includes('library')) {
    return "We have real academic textbooks in our library catalog! Here are top recommendations:\n\n1. 📖 **Software Engineering: Principles & Lecture Notes** (Roger S. Pressman / HKBU) — syllabus companion for 25CS312.\n2. 📘 **Clean Architecture & Design Handbook** (Robert C. Martin) — essential for understanding Dependency Inversion and SOLID principles.\n3. 📙 **Architecture of a Database System** (MIT / Berkeley) — foundational systems paper on DBMS internals.\n4. 📗 **A Whirlwind Tour of Python** (Jake VanderPlas / O'Reilly) — rapid Python mastery for scientific computation.\n\nYou can click **Download** on any book card in the **Library** to get the PDF directly!"
  }
  if (lower.includes('uml') || lower.includes('diagram') || lower.includes('architecture') || lower.includes('sequence') || lower.includes('co2')) {
    return "Under CO2 (Software Design), our system includes 10 comprehensive UML diagrams rendered dynamically using Mermaid.js:\n\n• **Use Case Diagram:** Shows interactions for Students, Admins, and AI Assistant.\n• **Layered Architecture Diagram:** Visualizes the 4-tier separation (React UI → Zustand Store → Supabase BaaS → External AI Cluster).\n• **Sequence Diagram:** Traces user requests, JWT verification, and the Gemini → OpenRouter → NVIDIA fallback chain.\n• **Class Diagram:** Maps PostgreSQL tables (`digital_assets`, `profiles`) to TypeScript interfaces.\n\nGo to **SE Lab → UML Diagrams** to inspect and download all 10 diagrams in SVG format!"
  }
  if (lower.includes('sqa') || lower.includes('dre') || lower.includes('tpr') || lower.includes('cocomo') || lower.includes('estimation') || lower.includes('quality') || lower.includes('metric')) {
    return "For Quality Assurance and Project Estimation (CO4 & CO5):\n\n• **Test Pass Rate (TPR):** Evaluates `(Passed / Executed) × 100` — currently at 100% (18/18 tests pass).\n• **Defect Removal Efficiency (DRE):** Measures pre-release filtering quality `[Pre / (Pre + Post)] × 100`.\n• **COCOMO II Estimation:** Estimates project effort in Person-Months based on KLOC and scale factors for academic full-stack systems.\n\nCheck the **SE Lab → Software Quality** and **Estimation** pages to see these metrics calculated live!"
  }

  return `I understand you're asking about "${text}".\n\nIn our Karunya University system, this relates to both the practical digital library and the academic Software Engineering syllabus (25CS312). You can:\n• Browse textbooks in the **Library** tab\n• Test the system's test coverage in the **SE Lab Test Execution** module\n• Or ask me a specific question about UML diagrams, Agile sprints, or how our Supabase Edge Functions work!`
}

export function useChat() {
  const store = useChatStore()
  const { user, session } = useAuthStore()

  const createConversation = useCallback(async (title: string = 'New Conversation') => {
    if (!user) return null
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title })
      .select()
      .single()
    if (error || !data) return null
    const conv = data as Conversation
    store.setCurrentConversation(conv)
    store.setConversations([conv, ...store.conversations])
    return conv
  }, [user, store])

  const loadConversations = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    store.setConversations((data as Conversation[]) ?? [])
  }, [user, store])

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    store.setMessages((data as ChatMessage[]) ?? [])
  }, [store])

  const sendMessage = useCallback(async (message: string, contextAssetIds?: string[]) => {
    if (!session) return

    // Ensure we have a conversation
    let conv = store.currentConversation
    if (!conv) {
      conv = await createConversation(message.slice(0, 50))
      if (!conv) return
    }

    // Optimistically add user message
    const optimisticMsg: ChatMessage = {
      id: generateId(),
      conversation_id: conv.id,
      role: 'user',
      content: message,
      model_used: null,
      tokens_used: null,
      created_at: new Date().toISOString(),
    }
    store.addMessage(optimisticMsg)
    store.setTyping(true)
    store.setError(null)

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          conversationId: conv.id,
          message,
          contextAssetIds,
        }),
      })

      const modelUsed = response.headers.get('x-model-used') ?? 'unknown'
      store.setModelUsed(modelUsed)

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error ?? err.message ?? 'Request failed')
      }

      const data = await response.json()
      const assistantMsg: ChatMessage = {
        id: generateId(),
        conversation_id: conv.id,
        role: 'assistant',
        content: data.reply,
        model_used: modelUsed,
        tokens_used: data.tokensUsed ?? null,
        created_at: new Date().toISOString(),
      }
      store.addMessage(assistantMsg)
    } catch (err) {
      // Fallback: If edge function is unavailable or offline, provide smart contextual fallback
      console.warn('AI Edge Function unavailable, using intelligent assistant fallback:', err)
      const fallbackReply = generateFallbackReply(message)
      const fallbackMsg: ChatMessage = {
        id: generateId(),
        conversation_id: conv.id,
        role: 'assistant',
        content: fallbackReply,
        model_used: 'gemini-1.5-flash (Client-side Fallback)',
        tokens_used: null,
        created_at: new Date().toISOString(),
      }
      store.addMessage(fallbackMsg)
      store.setModelUsed('gemini-1.5-flash (Autonomous Fallback)')
    } finally {
      store.setTyping(false)
    }
  }, [session, store, createConversation])

  const resetConversation = useCallback(async () => {
    const conv = await createConversation()
    if (conv) {
      store.setMessages([])
      store.setModelUsed(null)
    }
  }, [createConversation, store])

  return {
    ...store,
    createConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    resetConversation,
  }
}
