import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const DIAGRAMS = [
  {
    id: 'context',
    title: 'System Context Diagram',
    description: 'Top-level view of actors and external systems',
    chart: `
graph TB
  Student([👤 Student])
  Admin([👤 Admin])
  Browser([🌐 Browser])
  Vercel([☁️ Vercel CDN])
  Supabase([🗄️ Supabase\nPostgres + Storage + Auth])
  GeminiAI([🤖 Gemini Flash API])
  OpenRouter([🤖 OpenRouter API])
  NvidiaAI([🤖 NVIDIA NIM API])

  Student -->|HTTPS| Browser
  Admin -->|HTTPS| Browser
  Browser -->|React SPA| Vercel
  Vercel -->|API calls| Supabase
  Supabase -->|Edge Function| GeminiAI
  Supabase -->|Fallback| OpenRouter
  Supabase -->|Fallback| NvidiaAI
`,
  },
  {
    id: 'architecture',
    title: 'Layered Architecture Diagram',
    description: 'Four-layer clean architecture',
    chart: `
graph TB
  subgraph Presentation["Presentation Layer (React 18 + Vite)"]
    Pages[Pages / Routes]
    Components[Components]
    i18n[i18n EN/TA/HI]
  end
  subgraph Application["Application Layer (Hooks + Stores)"]
    Hooks[Custom Hooks]
    Zustand[Zustand Stores]
    Validators[Zod Validators]
  end
  subgraph Domain["Domain Layer (Supabase Edge Functions)"]
    AiChat[ai-chat Edge Fn]
    AiSummarize[ai-summarize Edge Fn]
    AiClassify[ai-classify Edge Fn]
  end
  subgraph Data["Data Layer (Supabase)"]
    Auth[Auth + JWT]
    Postgres[(PostgreSQL + RLS)]
    Storage[(Object Storage)]
  end

  Presentation --> Application
  Application --> Domain
  Application --> Data
  Domain --> Data
`,
  },
  {
    id: 'component',
    title: 'Component Diagram',
    description: 'Major front-end component interactions',
    chart: `
graph LR
  App --> AppLayout
  AppLayout --> Sidebar
  AppLayout --> Header
  AppLayout --> Outlet
  AppLayout --> FloatingLauncher
  Outlet --> LibraryPage
  Outlet --> AssistantPage
  Outlet --> AdminDashboard
  Outlet --> SELabPages
  LibraryPage --> AssetCard
  LibraryPage --> useAssets
  FloatingLauncher --> ChatWindow
  ChatWindow --> MessageBubble
  ChatWindow --> TypingIndicator
  ChatWindow --> useChat
  useChat --> supabase
  useChat --> EdgeFunctions
  AdminDashboard --> useAuthStore
  SELabPages --> MermaidRenderer
`,
  },
  {
    id: 'class',
    title: 'UML Class Diagram',
    description: 'Core entities matching the database schema',
    chart: `
classDiagram
  class Profile {
    +UUID id
    +string full_name
    +string role
    +string avatar_url
    +timestamp created_at
  }
  class DigitalAsset {
    +UUID id
    +string title
    +string author
    +string isbn
    +string description
    +string file_path
    +string file_type
    +int download_count
    +bool is_published
    +string[] tags
  }
  class Category {
    +UUID id
    +string name
    +string description
    +string icon
  }
  class Conversation {
    +UUID id
    +UUID user_id
    +string title
    +timestamp created_at
  }
  class ChatMessage {
    +UUID id
    +string role
    +string content
    +string model_used
    +int tokens_used
  }
  class TestCase {
    +UUID id
    +string test_id
    +string category
    +string test_type
    +string severity
  }
  class TestRun {
    +UUID id
    +string run_label
    +int total
    +int passed
    +int failed
  }
  class TestResult {
    +UUID id
    +string status
    +int duration_ms
  }
  class Defect {
    +UUID id
    +string defect_id
    +string status
    +string severity
  }

  Profile "1" --> "*" DigitalAsset : uploads
  Profile "1" --> "*" Conversation : has
  Category "1" --> "*" DigitalAsset : contains
  Conversation "1" --> "*" ChatMessage : contains
  TestRun "1" --> "*" TestResult : includes
  TestResult "*" --> "1" TestCase : references
  TestResult "1" --> "0..1" Defect : generates
`,
  },
  {
    id: 'seq-register',
    title: 'Sequence: Registration Flow',
    description: 'User registration with profile creation',
    chart: `
sequenceDiagram
  actor User
  participant Browser as React App
  participant Supabase as Supabase Auth
  participant DB as PostgreSQL

  User->>Browser: Fill registration form
  Browser->>Browser: Zod validation
  Browser->>Supabase: signUp(email, password, full_name)
  Supabase->>Supabase: Create auth.users record
  Supabase->>DB: Trigger: create_profile_on_signup()
  DB-->>DB: INSERT INTO profiles (id, full_name, role='student')
  Supabase-->>Browser: User session + JWT
  Browser->>DB: GET /profiles?id=user_id (RLS: own row)
  DB-->>Browser: Profile data
  Browser-->>User: Redirect to /library
`,
  },
  {
    id: 'seq-login',
    title: 'Sequence: Login Flow',
    description: 'Authentication with session persistence',
    chart: `
sequenceDiagram
  actor User
  participant Browser as React App
  participant Supabase as Supabase Auth
  participant DB as PostgreSQL

  User->>Browser: Enter email + password
  Browser->>Browser: Zod validation
  Browser->>Supabase: signInWithPassword(email, password)
  Supabase->>Supabase: Verify credentials
  alt Invalid credentials
    Supabase-->>Browser: error: "Invalid login credentials"
    Browser-->>User: Show specific error message
  else Valid credentials
    Supabase-->>Browser: Session + access_token + refresh_token
    Browser->>DB: SELECT * FROM profiles WHERE id = user_id
    DB-->>Browser: Profile (role, full_name)
    Browser->>Browser: Set Zustand auth store
    Browser-->>User: Redirect to /library
  end
`,
  },
  {
    id: 'seq-upload',
    title: 'Sequence: Document Upload',
    description: 'Admin document upload flow',
    chart: `
sequenceDiagram
  actor Admin
  participant Browser as React App
  participant EdgeFn as ai-classify (Edge Fn)
  participant Storage as Supabase Storage
  participant DB as PostgreSQL

  Admin->>Browser: Select PDF/EPUB file
  Browser->>Browser: validateFile() - type + size check
  Admin->>Browser: Click "AI Classify"
  Browser->>EdgeFn: POST /ai-classify {title, description} + JWT
  EdgeFn->>EdgeFn: Verify JWT
  EdgeFn->>EdgeFn: Call Gemini Flash API (server-side only)
  EdgeFn-->>Browser: {categoryName, tags}
  Browser->>Browser: Auto-fill category + tags fields
  Admin->>Browser: Submit form
  Browser->>Storage: upload(filePath, file) to documents bucket
  Storage-->>Browser: filePath confirmed
  Browser->>DB: INSERT INTO digital_assets {metadata, filePath}
  DB-->>Browser: Asset record created
  Browser-->>Admin: Toast: "Upload successful"
  Browser->>Browser: Navigate to /library
`,
  },
  {
    id: 'seq-ai-chat',
    title: 'Sequence: AI Chatbot Request',
    description: 'Full AI chat flow with fallback chain',
    chart: `
sequenceDiagram
  actor User
  participant Browser as React App
  participant EdgeFn as ai-chat (Edge Fn)
  participant DB as PostgreSQL
  participant Gemini as Gemini Flash
  participant OpenRouter as OpenRouter
  participant NVIDIA as NVIDIA NIM

  User->>Browser: Type message + press Send
  Browser->>EdgeFn: POST /ai-chat {conversationId, message} + JWT
  EdgeFn->>EdgeFn: Verify Supabase JWT
  EdgeFn->>DB: Fetch conversation history
  DB-->>EdgeFn: Previous messages
  EdgeFn->>EdgeFn: Build system prompt (Library Assistant)
  EdgeFn->>Gemini: Chat completion request (GEMINI_API_KEY)
  alt Gemini success
    Gemini-->>EdgeFn: Response text
  else Gemini quota exceeded
    EdgeFn->>OpenRouter: Fallback request (OPENROUTER_API_KEY)
    alt OpenRouter success
      OpenRouter-->>EdgeFn: Response text
    else OpenRouter fails
      EdgeFn->>NVIDIA: Final fallback (NVIDIA_API_KEY)
      NVIDIA-->>EdgeFn: Response text
    end
  end
  EdgeFn->>DB: INSERT INTO chat_messages (role='assistant', model_used)
  EdgeFn-->>Browser: {reply, modelUsed} + X-Model-Used header
  Browser->>Browser: Show message bubble + model badge
  Browser-->>User: AI response displayed
`,
  },
  {
    id: 'activity',
    title: 'Activity Diagram: Library Operations',
    description: 'Browse → search → download workflow',
    chart: `
flowchart TD
  Start([🟢 User visits /library]) --> Auth{Authenticated?}
  Auth -->|No| Login[Redirect to /login]
  Auth -->|Yes| Load[Load published assets\nfrom Supabase]
  Load --> Browse[Browse asset grid/list]
  Browse --> Search{Search / filter?}
  Search -->|Yes| Query[Debounced query\n300ms delay\nfilter + sort]
  Query --> Results{Results found?}
  Results -->|No| Empty[Show empty state\nwith CTA]
  Results -->|Yes| Browse
  Search -->|No| Select[Select asset]
  Browse --> Select
  Select --> Detail[View asset detail page]
  Detail --> Download{Has file?}
  Download -->|Yes| Auth2{Authenticated?}
  Auth2 -->|Yes| SignedUrl[Get signed URL\nfrom Supabase Storage]
  SignedUrl --> Increment[Increment download_count\nvia RPC]
  Increment --> Open[Open file in new tab]
  Open --> End([🔴 Done])
  Download -->|No| Detail
  Auth2 -->|No| Login
  Empty --> End
`,
  },
  {
    id: 'deployment',
    title: 'Deployment Diagram',
    description: 'Production infrastructure topology',
    chart: `
graph TB
  subgraph Client["Client (Browser)"]
    ReactApp[React 18 SPA\nTypeScript + Vite]
    i18n[i18next\nEN / TA / HI]
  end
  subgraph Vercel["Vercel (Free Tier)"]
    CDN[Edge CDN\nStatic assets]
    ServerlessApi[Vercel Serverless\nfunctions planned]
  end
  subgraph SupabaseCloud["Supabase (Cloud)"]
    SupaAuth[Auth Service\nJWT + Sessions]
    Postgres[(PostgreSQL\n+ Row Level Security)]
    ObjectStore[(Object Storage\ndocuments / covers)]
    EdgeFunctions[Edge Functions\nDeno Runtime\nai-chat / summarize / classify]
  end
  subgraph ExternalAI["External AI APIs"]
    Gemini[Google Gemini Flash\nPrimary model]
    OpenRouterSvc[OpenRouter\nFallback 1]
    NvidiaSvc[NVIDIA NIM\nFallback 2]
  end

  ReactApp -->|HTTPS| CDN
  ReactApp -->|supabase-js client| SupaAuth
  ReactApp -->|RLS-protected queries| Postgres
  ReactApp -->|Signed URLs| ObjectStore
  ReactApp -->|fetch + JWT| EdgeFunctions
  EdgeFunctions -->|GEMINI_API_KEY\nserver-side only| Gemini
  EdgeFunctions -->|OPENROUTER_API_KEY\nfallback| OpenRouterSvc
  EdgeFunctions -->|NVIDIA_API_KEY\nfallback| NvidiaSvc
  EdgeFunctions -->|SUPABASE_SERVICE_ROLE_KEY| Postgres
`,
  },
]

export function UMLDiagramsPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState(DIAGRAMS[0].id)
  const current = DIAGRAMS.find((d) => d.id === active) ?? DIAGRAMS[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('seLab.umlDiagrams')}
        description={`${DIAGRAMS.length} Mermaid-rendered diagrams — all accurate to the implemented system`}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'UML Diagrams' }]}
      />

      {/* Diagram selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {DIAGRAMS.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            className={`rounded-lg border p-3 text-left text-sm transition-colors ${
              active === d.id
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <span className="text-xs text-muted-foreground block mb-0.5">Diagram {i + 1}</span>
            <span className="line-clamp-2">{d.title}</span>
          </button>
        ))}
      </div>

      {/* Active diagram */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{current.title}</CardTitle>
              <CardDescription className="mt-1">{current.description}</CardDescription>
            </div>
            <Badge variant="outline">Mermaid</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <MermaidRenderer
            key={current.id}
            chart={current.chart}
            title={current.title}
            showDownload
          />
        </CardContent>
      </Card>
    </div>
  )
}
