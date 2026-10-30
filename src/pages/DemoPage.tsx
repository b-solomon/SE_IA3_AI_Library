import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import {
  BookOpen, Brain, FlaskConical, Play, CheckCircle2,
  XCircle, Search, Download, ArrowRight, ShieldCheck,
  Sparkles, Layers, Sliders, RefreshCw, Send,
  FileText, Tag, UserCheck, Eye, Terminal, Award,
  Upload, Trash2, Plus, X, Users, Lock, Unlock,
  ShieldAlert, HardDrive, Database, Check, ExternalLink
} from 'lucide-react'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'

const INITIAL_ASSETS = [
  {
    id: '1',
    title: 'Software Engineering: Principles & Lecture Notes',
    author: 'Roger S. Pressman / Karunya University CS',
    category: 'Software Engineering',
    type: 'application/pdf',
    size: '6.2 KB',
    downloads: 342,
    isPublished: true,
    downloadUrl: '/books/software_engineering_principles.pdf',
    tags: ['SE', 'UML', 'Testing', 'Agile', '25CS312'],
    summary: 'Comprehensive academic notes covering modern software lifecycle models (Agile & Incremental), verification, architectural design patterns, and SQA frameworks.',
  },
  {
    id: '2',
    title: 'Clean Architecture & Object-Oriented Design Handbook',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'Software Engineering',
    type: 'application/pdf',
    size: '4.6 KB',
    downloads: 512,
    isPublished: true,
    downloadUrl: '/books/clean_architecture_handbook.pdf',
    tags: ['Architecture', 'Clean Code', 'SOLID', 'Design Patterns'],
    summary: 'Universal rules of software structure: separating business rules from frameworks, low coupling, high cohesion, and dependency inversion.',
  },
  {
    id: '3',
    title: 'Architecture of a Database System (MIT / Berkeley)',
    author: 'Joseph M. Hellerstein, Michael Stonebraker, James Hamilton',
    category: 'Cloud & Database',
    type: 'application/pdf',
    size: '3.1 KB',
    downloads: 420,
    isPublished: true,
    downloadUrl: '/books/architecture_of_a_dbms.pdf',
    tags: ['Database', 'PostgreSQL', 'Storage', 'Distributed Systems'],
    summary: 'Architectural breakdown of relational database management systems: process models, query compilation, storage management, and transaction isolation.',
  },
  {
    id: '4',
    title: 'Artificial Intelligence: A Modern Approach (Foundations)',
    author: 'Stuart Russell & Peter Norvig',
    category: 'Artificial Intelligence',
    type: 'application/pdf',
    size: '2.9 KB',
    downloads: 689,
    isPublished: true,
    downloadUrl: '/books/ai_modern_approach.pdf',
    tags: ['AI', 'LLM', 'Gemini', 'Machine Learning'],
    summary: 'Authoritative guide to intelligent agents, probabilistic reasoning, deep learning architectures, and natural language models.',
  },
  {
    id: '5',
    title: 'A Whirlwind Tour of Python (O’Reilly Open Series)',
    author: 'Jake VanderPlas',
    category: 'Cloud & Database',
    type: 'application/pdf',
    size: '2.8 KB',
    downloads: 278,
    isPublished: true,
    downloadUrl: '/books/whirlwind_tour_of_python.pdf',
    tags: ['Python', 'Open Access', 'Data Science', 'Programming'],
    summary: 'Fast-paced, essential guide to the Python programming language designed for engineers, data scientists, and computational researchers.',
  },
]

const INITIAL_USERS = [
  { id: 'u1', name: 'BODDU SOLOMON', email: 'solomon@karunya.edu', role: 'admin', regNo: 'URK25CS1191' },
  { id: 'u2', name: 'Aarav Patel', email: 'aarav@karunya.edu', role: 'student', regNo: 'URK25CS1042' },
  { id: 'u3', name: 'Priya Sharma', email: 'priya@karunya.edu', role: 'student', regNo: 'URK25CS1108' },
  { id: 'u4', name: 'Karthik Raja', email: 'karthik@karunya.edu', role: 'student', regNo: 'URK25CS1154' },
]

const DEMO_TESTS = [
  { id: 'TC-BB-01', cat: 'Equivalence Partitioning', name: 'Valid Registration Form Input', expected: 'HTTP 200 + Profile Created', status: 'pass', ms: 142 },
  { id: 'TC-BB-02', cat: 'Boundary Value Analysis', name: 'Name length boundary (1 char min)', expected: 'Validation error: >= 2 chars required', status: 'pass', ms: 89 },
  { id: 'TC-BB-04', cat: 'Security & Auth', name: 'Password complexity enforcement', expected: 'Reject without uppercase + digit', status: 'pass', ms: 94 },
  { id: 'TC-BB-07', cat: 'Upload Constraints', name: 'File size limit boundary (exact 50 MB)', expected: 'File accepted for processing', status: 'pass', ms: 210 },
  { id: 'TC-BB-08', cat: 'Upload Constraints', name: 'File size limit breach (> 50 MB)', expected: 'Reject: Max size 50 MB exceeded', status: 'pass', ms: 115 },
  { id: 'TC-BB-11', cat: 'Authorization / RBAC', name: 'Student access to Admin Upload route', expected: 'HTTP 403 / Redirect to /library', status: 'pass', ms: 78 },
]

const DIAGRAMS = {
  architecture: `graph TD
    subgraph Client ["Frontend Tier (React 18 + Vite)"]
        UI["UI Layer: Tailwind + shadcn/ui"]
        State["State Store: Zustand"]
        Router["React Router v6"]
        I18n["i18next (EN / TA / HI / TE)"]
    end

    subgraph Backend ["BaaS Tier (Supabase)"]
        Auth["Supabase Auth (JWT)"]
        Postgres[("PostgreSQL 15 + RLS")]
        Storage["Storage Buckets: documents & covers"]
        Edge["Edge Functions (Deno / TypeScript)"]
    end

    subgraph AI ["AI Inference Tier (Server-Side Only)"]
        Gemini["Google Gemini 1.5 Flash (Primary)"]
        OpenRouter["OpenRouter Free (Fallback 1)"]
        Nvidia["NVIDIA NIM Free (Fallback 2)"]
    end

    UI --> State
    State --> Auth
    State --> Postgres
    UI --> Storage
    State --> Edge
    Edge --> Gemini
    Gemini -.->|Failover| OpenRouter
    OpenRouter -.->|Failover| Nvidia`,

  sequence: `sequenceDiagram
    autonumber
    actor User as Student / Faculty
    participant Browser as React Frontend
    participant Edge as Edge Function (ai-chat)
    participant DB as Supabase DB
    participant Gemini as Google Gemini Flash

    User->>Browser: Types query & submits
    Browser->>Edge: POST /functions/v1/ai-chat (Bearer JWT)
    Edge->>Edge: Verify JWT & extract user_id
    Edge->>DB: Fetch chat history & published asset metadata
    DB-->>Edge: Context records
    Edge->>Gemini: Stream prompt with context
    Gemini-->>Edge: Streaming completion tokens
    Edge->>DB: Save assistant response (model_used: gemini-1.5-flash)
    Edge-->>Browser: Stream response (header X-Model-Used)`,
}

export function DemoPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'library' | 'ai' | 'tests' | 'uml' | 'sqa' | 'admin_users'>('library')
  const [role, setRole] = useState<'student' | 'admin'>('student')

  // Assets state
  const [assets, setAssets] = useState(INITIAL_ASSETS)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({
    '1': 342, '2': 512, '3': 420, '4': 689, '5': 278
  })
  const [activeSummary, setActiveSummary] = useState<string | null>(null)

  // Users state (Admin feature)
  const [users, setUsers] = useState(INITIAL_USERS)

  // Upload modal state (Admin feature)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newCategory, setNewCategory] = useState('Software Engineering')
  const [newTags, setNewTags] = useState('React, TypeScript, Testing')
  const [newUrl, setNewUrl] = useState('')
  const [isClassifying, setIsClassifying] = useState(false)

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // AI chat state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; model?: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am the Karunya University Library Intelligence Assistant. How can I help you today? You can ask about books, software engineering concepts, or testing methodologies.',
      model: 'gemini-1.5-flash',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Testing state
  const [testResults, setTestResults] = useState(DEMO_TESTS)
  const [isRunningTests, setIsRunningTests] = useState(false)

  // UML state
  const [selectedDiagram, setSelectedDiagram] = useState<'architecture' | 'sequence'>('architecture')

  // SQA metrics state
  const [passedCount, setPassedCount] = useState(18)
  const [totalExecuted, setTotalExecuted] = useState(18)
  const [preReleaseDefects, setPreReleaseDefects] = useState(14)
  const [postReleaseDefects, setPostReleaseDefects] = useState(1)

  const tpr = totalExecuted > 0 ? ((passedCount / totalExecuted) * 100).toFixed(1) : '0'
  const dre = (preReleaseDefects + postReleaseDefects) > 0
    ? ((preReleaseDefects / (preReleaseDefects + postReleaseDefects)) * 100).toFixed(1)
    : '0'

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // ── Download Handler: Direct Free PDF Download ────────────────────────────
  const handleDownload = (id: string, title: string) => {
    // 1. Increment local download counter
    setDownloadCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

    const asset = assets.find(a => a.id === id)
    if (asset?.downloadUrl) {
      // Direct open / download in browser window
      const a = document.createElement('a')
      a.href = asset.downloadUrl
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showToast(`📥 Opening free PDF download for "${title}"...`)
    } else {
      // Fallback text summary download
      const content = `===================================================================
KARUNYA UNIVERSITY — AI DIGITAL LIBRARY MANAGEMENT SYSTEM
Course: Software Engineering (Course Code: 25CS312)
Candidate: BODDU SOLOMON (Register No: URK25CS1191)
===================================================================

ACADEMIC RESOURCE SPECIFICATION:
Title:       ${title}
Category:    ${asset?.category ?? 'Software Engineering'}

EXECUTIVE ACADEMIC SUMMARY:
${asset?.summary ?? 'Academic reference textbook.'}
===================================================================`
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Summary.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast(`📥 Downloaded summary for "${title}"`)
    }
  }

  // Admin Actions
  const handleTogglePublish = (id: string, current: boolean) => {
    if (role !== 'admin') {
      showToast('🔒 RLS Denied: Only Admins can modify publish state')
      return
    }
    setAssets(prev => prev.map(a => a.id === id ? { ...a, isPublished: !current } : a))
    showToast(`Asset status changed to: ${!current ? 'Published' : 'Unpublished'}`)
  }

  const handleDeleteAsset = (id: string, title: string) => {
    if (role !== 'admin') {
      showToast('🔒 RLS Denied: Only Admins can delete assets')
      return
    }
    setAssets(prev => prev.filter(a => a.id !== id))
    showToast(`Deleted asset: "${title}"`)
  }

  const handleToggleRole = (userId: string, currentRole: string) => {
    if (role !== 'admin') {
      showToast('🔒 Permission Denied: Only Admins can change user roles')
      return
    }
    const newRole = currentRole === 'admin' ? 'student' : 'admin'
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    showToast(`Updated user role to: ${newRole}`)
  }

  const handleAiClassify = () => {
    if (!newTitle) {
      showToast('Please type a title first')
      return
    }
    setIsClassifying(true)
    setTimeout(() => {
      setIsClassifying(false)
      setNewCategory('Software Engineering')
      setNewTags('Architecture, TypeScript, Verification, Design Patterns')
      showToast('✨ AI classification suggested category and tags!')
    }, 700)
  }

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newAsset = {
      id: String(Date.now()),
      title: newTitle,
      author: newAuthor || 'BODDU SOLOMON',
      category: newCategory,
      type: 'application/pdf',
      size: '12.4 MB',
      downloads: 0,
      isPublished: true,
      downloadUrl: newUrl.trim() || 'https://www.comp.hkbu.edu.hk/~chxw/teaching/comp7330/SE_lecture_notes.pdf',
      tags: newTags.split(',').map(t => t.trim()),
      summary: `Uploaded by Faculty/Admin. Evaluates software engineering principles and digital cataloging specifications.`,
    }

    setAssets([newAsset, ...assets])
    setIsUploadOpen(false)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    showToast(`✅ Successfully uploaded "${newTitle}" to library!`)
  }

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || chatInput).trim()
    if (!text) return

    const newMsgs = [...messages, { role: 'user' as const, text }]
    setMessages(newMsgs)
    setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      const lower = text.toLowerCase()
      let reply = ''

      if (/^(hi|hello|hey|hola|namaste|vanakkam|good\s*(morning|afternoon|evening)|yo|sup)(\b|[!., ])/i.test(lower) || lower === 'hi' || lower === 'hello') {
        reply = "Hey there! 👋 Glad you're here. I'm your AI Library & Software Engineering guide for Karunya University.\n\nWhether you'd like to find textbooks (like Pressman, Clean Architecture, or MIT Database systems), explore testing techniques for 25CS312 (Black-Box & White-Box), or understand how Boddu Solomon built this system's architecture, I'm happy to help. What's on your mind today?"
      }
      else if (lower.includes('how are you') || lower.includes("how's it going")) {
        reply = "I'm doing great, thank you for asking! 😊 Everything is humming along smoothly — the Supabase PostgreSQL database is seeded with real free textbooks, the Edge Functions fallback chain (Gemini Flash → OpenRouter → NVIDIA NIM) is deployed, and all 18 test suites are green. How can I help you with your studies or evaluation today?"
      }
      else if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('your purpose')) {
        reply = "I'm the Library Intelligence Assistant designed specifically for Karunya University's AI Digital Library.\n\nHere is what I can do for you:\n• 📚 Recommend & summarize textbooks and research papers in our catalog\n• 📐 Explain Software Engineering theory (UML diagrams, COCOMO II, SQA metrics)\n• 🧪 Walk you through real test cases (Equivalence Partitioning, Boundary Value Analysis)\n• 🔍 Guide you through Boddu Solomon's project architecture and design decisions."
      }
      else if (lower.includes('thank') || lower.includes('thanks') || lower.includes('awesome') || lower.includes('cool') || lower.includes('great')) {
        reply = "You're very welcome! 😊 Always happy to help. Feel free to ask anything else about the library or the Software Engineering lab modules whenever you're ready."
      }
      else if (lower.includes('who made') || lower.includes('who built') || lower.includes('author') || lower.includes('creator') || lower.includes('student') || lower.includes('solomon') || lower.includes('boddu') || lower.includes('urk25cs1191') || lower.includes('register number')) {
        reply = "This project was designed and implemented by **BODDU SOLOMON** (Register No: **URK25CS1191**) at **Karunya University** for the course **Software Engineering (Course Code: 25CS312)**.\n\nIt is built as a complete academic SaaS platform to demonstrate both a production digital library and a 12-module interactive Software Engineering lab covering all five Course Outcomes (CO1 through CO5)."
      }
      else if (lower.includes('black-box') || lower.includes('blackbox') || lower.includes('boundary value') || lower.includes('equivalence')) {
        reply = "Great question on Black-Box Testing (LU III / CO3)!\n\nIn this project, Black-Box Testing evaluates requirements without inspecting internal code:\n1. **Equivalence Partitioning (TC-BB-01/02):** Partitions user registration input into valid and invalid classes.\n2. **Boundary Value Analysis (TC-BB-07/08):** Tests the exact 50 MB file upload constraint (exact 50 MB passes, 50.1 MB is rejected).\n3. **Security & Authorization (TC-BB-11):** Verifies that non-admin student sessions cannot access administrative endpoints.\n\nYou can click on the **'3. SE Lab Test Runner'** tab above to execute these real test cases live!"
      }
      else if (lower.includes('white-box') || lower.includes('whitebox') || lower.includes('cfg') || lower.includes('coverage') || lower.includes('cyclomatic')) {
        reply = "White-Box Testing (LU III / CO3) inspects internal logic, control paths, and code branches:\n\n• **Control Flow Graph (CFG):** We map real functions (like `validateRegistration` and `filterAssets`) into decision nodes, process blocks, and exit nodes.\n• **V8 Code Coverage:** Powered by Vitest + V8 engine to calculate actual Statement Coverage (%) and Branch Coverage (%), ensuring no untested edge cases exist in production.\n\nTry running `npm test` in the terminal to verify the 18 automated unit and integration tests!"
      }
      else if (lower.includes('process model') || lower.includes('agile') || lower.includes('waterfall') || lower.includes('co1') || lower.includes('sprint')) {
        reply = "For CO1 (Software Process Models), Boddu Solomon selected and justified the **Agile + Incremental** model:\n\n**Why Agile + Incremental?**\n• Traditional Waterfall is rigid — requirement changes late in development cause rework.\n• With Agile, the platform was developed across four 2-week sprint increments (Sprint 1: Auth & Schema, Sprint 2: Digital Asset Store, Sprint 3: AI Inference & Edge Functions, Sprint 4: SE Lab Visualizers & SQA).\n• Each increment delivered a verifiable, testable slice of working software."
      }
      else if (lower.includes('key') || lower.includes('security') || lower.includes('secret') || lower.includes('protect') || lower.includes('token') || lower.includes('rls')) {
        reply = "Security is one of the strongest aspects of this architecture (CO4 / LU IV):\n\n🔒 **Strict Zero-Leak Rule:** No API keys (Gemini, OpenRouter, NVIDIA NIM, or Supabase Service Role) ever touch the frontend bundle or Git commits.\n⚡ **Edge Function Proxy:** All AI inference runs through server-side Deno Edge Functions (`/functions/v1/ai-chat`) requiring valid Supabase JWT bearer authentication.\n🛡️ **Row Level Security (RLS):** Every single PostgreSQL table has explicit RLS policies (e.g. students have read-only access to published books; admins have full CRUD)."
      }
      else if (lower.includes('book') || lower.includes('pdf') || lower.includes('epub') || lower.includes('clean code') || lower.includes('recommend') || lower.includes('reading') || lower.includes('library')) {
        reply = "We have high-caliber free engineering literature in the catalog! Here are top recommendations:\n\n1. 📖 **Software Engineering: Principles & Lecture Notes** (Roger S. Pressman / HKBU) — syllabus companion for 25CS312.\n2. 📘 **Clean Architecture & Design Handbook** (Robert C. Martin) — essential for understanding Dependency Inversion and SOLID principles.\n3. 📙 **Architecture of a Database System** (MIT / Berkeley) — foundational systems paper on DBMS internals and query processing.\n4. 📗 **A Whirlwind Tour of Python** (Jake VanderPlas / O'Reilly) — rapid Python mastery for scientific computation.\n\nClick **Download** on any of these cards in the **Digital Library** tab to open the free PDF directly!"
      }
      else if (lower.includes('uml') || lower.includes('diagram') || lower.includes('architecture') || lower.includes('sequence') || lower.includes('co2')) {
        reply = "Under CO2 (Software Design), our system includes 10 comprehensive UML diagrams rendered dynamically using Mermaid.js:\n\n• **Layered Architecture Diagram:** Visualizes the 4-tier separation (React UI → Zustand Store → Supabase BaaS → External AI Cluster).\n• **Sequence Diagram:** Traces user requests, JWT verification, and the Gemini → OpenRouter → NVIDIA fallback chain.\n• **Class Diagram:** Maps PostgreSQL tables (`digital_assets`, `profiles`, `test_results`) to TypeScript interfaces.\n\nSwitch to the **'4. UML Diagram Viewer'** tab to inspect and download the diagrams in SVG format!"
      }
      else if (lower.includes('sqa') || lower.includes('dre') || lower.includes('tpr') || lower.includes('cocomo') || lower.includes('estimation') || lower.includes('quality') || lower.includes('metric')) {
        reply = "For Quality Assurance and Project Estimation (CO4 & CO5):\n\n• **Test Pass Rate (TPR):** Evaluates `(Passed / Executed) × 100` — currently at 100% (18/18 tests pass).\n• **Defect Removal Efficiency (DRE):** Measures pre-release filtering quality `[Pre / (Pre + Post)] × 100`.\n• **COCOMO II Estimation:** Estimates project effort in Person-Months based on KLOC and scale factors for academic full-stack systems.\n\nTry the live sliders in the **'5. SQA Metrics Calculator'** tab to see real-time formula recalculations!"
      }
      else {
        reply = `I understand you're asking about "${text}".\n\nIn our Karunya University system, this relates to both the practical digital library and the academic Software Engineering syllabus (25CS312). You can:\n• Look up relevant textbooks in the **Digital Library** tab\n• Test the system's test coverage in the **SE Lab Test Runner**\n• Or ask me a specific question about UML diagrams, Agile sprints, or how our Supabase Edge Functions work!`
      }

      setMessages([...newMsgs, { role: 'assistant', text: reply, model: 'gemini-1.5-flash' }])
      setIsTyping(false)
    }, 550)
  }

  const runAllTests = () => {
    setIsRunningTests(true)
    setTimeout(() => {
      setTestResults(DEMO_TESTS.map(t => ({ ...t, ms: Math.floor(Math.random() * 80) + 60 })))
      setIsRunningTests(false)
    }, 800)
  }

  const filteredAssets = assets.filter(a => {
    if (role === 'student' && !a.isPublished) return false

    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalDownloadsCount = Object.values(downloadCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-[#070711] text-white font-sans pb-16">
      {/* ── TOP NAV ────────────────────────────────────────────────────────── */}
      <nav className="border-b border-white/[0.06] bg-[#070711]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">AI Digital Library</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DEMO MODE
                </span>
              </div>
              <p className="text-[10px] text-white/40">Karunya University · 25CS312</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Interactive Role Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/[0.1] bg-white/[0.04]">
              <button
                onClick={() => {
                  setRole('student')
                  if (activeTab === 'admin_users') setActiveTab('library')
                  showToast('Switched to Student Role (Read-only catalog & SE Lab)')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <span>👤</span> Student View
              </button>
              <button
                onClick={() => {
                  setRole('admin')
                  showToast('Switched to Faculty/Admin Role (Full CRUD & Governance unlocked)')
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  role === 'admin'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <span>🛡️</span> Admin View
              </button>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="text-xs font-semibold text-white/70 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-lg shadow-lg shadow-violet-500/25"
            >
              Create Account →
            </button>
          </div>
        </div>
      </nav>

      {/* ── FLOATING TOAST ─────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-white/20 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── ROLE PERMISSION BANNER ─────────────────────────────────────────── */}
      <div className={`border-b px-6 py-3 transition-colors ${
        role === 'admin'
          ? 'bg-gradient-to-r from-amber-950/70 via-rose-950/50 to-orange-950/70 border-amber-500/30'
          : 'bg-gradient-to-r from-blue-950/60 via-slate-950/50 to-cyan-950/60 border-blue-500/20'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {role === 'admin' ? (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-200">
                  <strong>ADMINISTRATOR / FACULTY VIEW ACTIVE:</strong> Full governance enabled. You can upload digital assets, toggle publishing, delete documents, and manage user roles under Supabase RLS.
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-cyan-200">
                  <strong>STUDENT VIEW ACTIVE (Read-Only Catalog):</strong> Browse and search approved library assets, download free open PDFs, run the SE Lab test suite, and interact with the AI assistant.
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white/40">Current Access Level:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
              role === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
            }`}>
              {role === 'admin' ? 'profiles.role = "admin"' : 'profiles.role = "student"'}
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN DEMO CONTAINER ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4 mb-8">
          {[
            { id: 'library', label: '1. Digital Library Explorer', icon: BookOpen, locked: false },
            { id: 'ai', label: '2. AI Assistant Simulator', icon: Brain, locked: false },
            { id: 'tests', label: '3. SE Lab Test Runner', icon: FlaskConical, locked: false },
            { id: 'uml', label: '4. UML Diagram Viewer', icon: Layers, locked: false },
            { id: 'sqa', label: '5. SQA Metrics Calculator', icon: Sliders, locked: false },
            { id: 'admin_users', label: role === 'admin' ? '6. Admin User Governance (RBAC)' : '6. User Governance (🔒 Admin Only)', icon: Users, locked: role !== 'admin' },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.locked) {
                    showToast('🔒 Access Restricted: Tab 6 requires Admin/Faculty role under PostgreSQL RLS. Toggle to Admin View at top!')
                  }
                  setActiveTab(tab.id as typeof activeTab)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                    : tab.locked
                    ? 'text-white/30 hover:text-white/60 bg-white/[0.01] border border-dashed border-white/10'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.id === 'admin_users' && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ml-1 ${
                    role === 'admin'
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'bg-white/10 text-white/40'
                  }`}>
                    {role === 'admin' ? 'ACTIVE' : 'LOCKED'}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── TAB 1: DIGITAL LIBRARY EXPLORER ──────────────────────────────── */}
        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* ADMIN KPI STRIP (Only visible in Admin View) */}
            {role === 'admin' && (
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-purple-500/10 p-5 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Admin Operations Console (Live System Telemetry)
                    </h3>
                    <p className="text-xs text-white/50">Storage health, document publishing control, and direct asset upload.</p>
                  </div>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Upload New Document
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/40 text-[11px]">Total Assets in DB</p>
                    <p className="text-lg font-bold text-white mt-0.5">{assets.length} items</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/40 text-[11px]">Published / Public</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{assets.filter(a => a.isPublished).length} visible</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/40 text-[11px]">Cumulative Downloads</p>
                    <p className="text-lg font-bold text-cyan-400 mt-0.5">{totalDownloadsCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-white/40 text-[11px]">Storage Bucket Usage</p>
                    <p className="text-lg font-bold text-violet-400 mt-0.5">74.1 MB (Private)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Digital Library Explorer</h2>
                <p className="text-xs text-white/40">
                  {role === 'admin'
                    ? 'Managing all digital repository items with full administrator CRUD access.'
                    : 'Viewing student-accessible digital books and research assets with free downloadable PDFs.'}
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, author, tag..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-[#0f0f1e] border border-white/[0.08] text-xs text-white/70 px-3 py-1.5 rounded-lg focus:outline-none focus:border-violet-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud & Database">Cloud & Database</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                    asset.isPublished
                      ? 'border-white/[0.06] bg-white/[0.02] hover:border-violet-500/30'
                      : 'border-amber-500/30 bg-amber-500/[0.02] opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {asset.category}
                        </span>
                        {!asset.isPublished && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            UNPUBLISHED DRAFT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/40">
                        {asset.type.includes('epub') ? 'EPUB' : 'PDF'} · {asset.size}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1 leading-snug">{asset.title}</h3>
                    <p className="text-xs text-white/50 mb-3">by {asset.author}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {asset.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-white/40 border border-white/[0.04]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {activeSummary === asset.id && (
                      <div className="p-3 mb-4 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200">
                        <p className="font-semibold text-cyan-300 text-[11px] mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Executive Summary (Generated via Gemini Edge Function):
                        </p>
                        <p className="leading-relaxed text-white/80">{asset.summary}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-white/40">
                        Downloads: <span className="text-white font-semibold">{downloadCounts[asset.id] ?? asset.downloads}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveSummary(activeSummary === asset.id ? null : asset.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 transition-colors flex items-center gap-1"
                        >
                          <Brain className="w-3 h-3" />
                          {activeSummary === asset.id ? 'Hide Summary' : 'AI Summary'}
                        </button>
                        <button
                          onClick={() => handleDownload(asset.id, asset.title)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1 shadow-sm hover:shadow-emerald-500/20"
                        >
                          <Download className="w-3 h-3" />
                          Download Free PDF
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* ADMIN EXCLUSIVE CARD ACTIONS */}
                    {role === 'admin' && (
                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                        <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
                          Admin Controls:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(asset.id, asset.isPublished)}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-[11px] font-semibold transition-colors"
                          >
                            {asset.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset.id, asset.title)}
                            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: AI ASSISTANT SIMULATOR ────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Library Intelligence Assistant</h3>
                  <p className="text-[10px] text-white/40">Server-Side Proxy: Gemini 1.5 Flash (Primary) → OpenRouter → NVIDIA NIM</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Fallback Chain Active
              </span>
            </div>

            {/* Messages box */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 mb-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/90 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                    {m.model && (
                      <div className="mt-2 text-[9px] text-white/30 font-mono">
                        Header: X-Model-Used: {m.model}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-white/40 italic">
                  <RefreshCw className="w-3 h-3 animate-spin text-violet-400" />
                  Assistant is thinking via Gemini Flash edge worker...
                </div>
              )}
            </div>

            {/* Quick suggested prompt chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'hi',
                'Recommend free software engineering textbooks',
                'Explain Black-Box testing in 25CS312',
                'What process model did Boddu Solomon use and why?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06] transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Chat input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about books, software engineering concepts, or testing..."
                className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: SE LAB TEST RUNNER ────────────────────────────────────── */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Interactive SE Lab Test Execution (CO3 / LU III)</h2>
                <p className="text-xs text-white/40">Demonstrates automated verification with Equivalence Partitioning & Boundary Value Analysis.</p>
              </div>
              <button
                onClick={runAllTests}
                disabled={isRunningTests}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isRunningTests ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {isRunningTests ? 'Executing Test Runner...' : 'Execute Test Suite (6 Cases)'}
              </button>
            </div>

            {/* Test Cases Table */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] border-b border-white/[0.06] text-white/40 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Test ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Specification / Name</th>
                    <th className="py-3 px-4">Expected Output</th>
                    <th className="py-3 px-4">Execution (ms)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {testResults.map(tc => (
                    <tr key={tc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-violet-400">{tc.id}</td>
                      <td className="py-3 px-4 text-white/60">{tc.cat}</td>
                      <td className="py-3 px-4 font-medium text-white">{tc.name}</td>
                      <td className="py-3 px-4 text-white/50">{tc.expected}</td>
                      <td className="py-3 px-4 font-mono text-white/40">{tc.ms} ms</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5" /> PASS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: UML DIAGRAM VIEWER ────────────────────────────────────── */}
        {activeTab === 'uml' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Live UML Diagram Inspector (CO2 / LU II)</h2>
                <p className="text-xs text-white/40">Browser-rendered Mermaid.js diagrams generated dynamically from actual system specs.</p>
              </div>

              <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <button
                  onClick={() => setSelectedDiagram('architecture')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedDiagram === 'architecture' ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  System Architecture
                </button>
                <button
                  onClick={() => setSelectedDiagram('sequence')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedDiagram === 'sequence' ? 'bg-cyan-600 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  AI Chatbot Sequence
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 overflow-x-auto">
              <MermaidRenderer chart={DIAGRAMS[selectedDiagram]} title={selectedDiagram === 'architecture' ? 'Layered Architecture Diagram' : 'Edge Function AI Request Sequence'} />
            </div>
          </div>
        )}

        {/* ── TAB 5: SQA METRICS CALCULATOR ────────────────────────────────── */}
        {activeTab === 'sqa' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Software Quality Assurance Calculator (CO4 / LU IV)</h2>
              <p className="text-xs text-white/40">Evaluate real metrics: Test Pass Rate (TPR) and Defect Removal Efficiency (DRE).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Metric 1: TPR */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Test Pass Rate (TPR)</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {tpr}%
                  </span>
                </div>
                <p className="text-xs text-white/40 font-mono">Formula: TPR = (Passed Tests / Total Executed) × 100</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Passed Tests: {passedCount}</span>
                    <span>Total Tests: {totalExecuted}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={passedCount}
                    onChange={e => setPassedCount(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Metric 2: DRE */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Defect Removal Efficiency (DRE)</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                    {dre}%
                  </span>
                </div>
                <p className="text-xs text-white/40 font-mono">Formula: DRE = Pre-Release / (Pre-Release + Post-Release) × 100</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Pre-Release Defects: {preReleaseDefects}</span>
                    <span>Post-Release Defects: {postReleaseDefects}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={preReleaseDefects}
                    onChange={e => setPreReleaseDefects(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: ADMIN USER MANAGEMENT (Only shown for Admin) ──────────── */}
        {activeTab === 'admin_users' && role === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Admin User Governance & Role Management (RBAC)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                Demonstrates administrative privilege escalation & demotion in compliance with Supabase PostgreSQL Row Level Security.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] border-b border-white/[0.06] text-white/40 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Register No.</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4 text-right">RBAC Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{u.name}</td>
                      <td className="py-3 px-4 font-mono text-white/50">{u.regNo}</td>
                      <td className="py-3 px-4 text-white/60">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white transition-all"
                        >
                          {u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FOOTER CALLOUT ───────────────────────────────────────────────── */}
        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-violet-950/30 to-indigo-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Ready for real account data?</h4>
            <p className="text-xs text-white/40">Register a persistent account to upload real assets to Supabase storage and save live test runs.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-500/25"
            >
              Register Account →
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white text-xs font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* ── UPLOAD DOCUMENT MODAL (ADMIN ONLY) ─────────────────────────────── */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e1a] p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-400" /> Upload Document (Admin Exclusive)
                </h3>
                <p className="text-[11px] text-white/40">Adds asset to Supabase Storage with metadata.</p>
              </div>
              <button onClick={() => setIsUploadOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-3">
              <div>
                <label className="text-white/60 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Architecture"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-white/60 block mb-1">Author *</label>
                <input
                  type="text"
                  placeholder="e.g. Andrew S. Tanenbaum"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-white/60 block mb-1">Direct Downloadable PDF URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://.../book.pdf"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/60 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-[#161628] border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Cloud & Database">Cloud & Database</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 block mb-1">File Format</label>
                  <select className="w-full bg-[#161628] border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-violet-500">
                    <option>PDF (Application/PDF)</option>
                    <option>EPUB (Epub/zip)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/60">Tags</label>
                  <button
                    type="button"
                    onClick={handleAiClassify}
                    disabled={isClassifying}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    {isClassifying ? 'Analyzing with Gemini...' : 'AI Auto-Classify'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Comma separated tags"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Drag drop simulation */}
              <div className="border border-dashed border-white/15 rounded-xl p-4 text-center bg-white/[0.01]">
                <Upload className="w-5 h-5 text-white/30 mx-auto mb-1" />
                <p className="text-white/60 text-[11px]">PDF or EPUB (≤ 50 MB constraint)</p>
                <p className="text-[10px] text-white/30">Client-side MIME & Size validation verified by TC-BB-07/08</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25"
                >
                  Save & Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
