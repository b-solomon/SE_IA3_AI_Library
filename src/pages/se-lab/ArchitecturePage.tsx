import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const LAYERS = [
  {
    name: 'Presentation Layer',
    tech: 'React 18 + TypeScript + Tailwind + shadcn/ui',
    responsibility: 'Renders UI, handles user events, dispatches actions to the application layer.',
    cohesion: 'High — each page/component has one clear UI responsibility',
    coupling: 'Low — communicates only through hooks and store subscriptions',
  },
  {
    name: 'Application Layer',
    tech: 'Custom Hooks (useAuth, useAssets, useChat) + Zustand stores',
    responsibility: 'Orchestrates data flow between presentation and data layers. Manages client state.',
    cohesion: 'High — each hook encapsulates one domain (auth, assets, chat)',
    coupling: 'Moderate — hooks depend on Supabase client and Zustand stores',
  },
  {
    name: 'Domain Layer',
    tech: 'Supabase Edge Functions (Deno/TypeScript)',
    responsibility: 'Enforces business rules: AI model selection, fallback chain, JWT verification, API key management.',
    cohesion: 'High — each Edge Function does one job (chat, summarise, classify)',
    coupling: 'Low — stateless functions with well-defined JSON contracts',
  },
  {
    name: 'Data Layer',
    tech: 'Supabase PostgreSQL + RLS + Object Storage',
    responsibility: 'Persists all application data. RLS policies enforce authorisation at the database level.',
    cohesion: 'High — data concerns isolated from all other layers',
    coupling: 'Zero — no code dependencies; accessed only via supabase-js client',
  },
]

const DI_CHART = `
graph LR
  subgraph Presentation
    LibraryPage[LibraryPage]
  end
  subgraph Application
    useAssets[useAssets hook]
  end
  subgraph Data
    SupabaseClient[supabase.ts]
  end
  LibraryPage -->|"depends on interface,\nnot implementation"| useAssets
  useAssets -->|"depends on client,\nnot DB details"| SupabaseClient
  SupabaseClient -->|RLS-protected| PostgreSQL[(PostgreSQL)]
`

export function ArchitecturePage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.architecture')}
        description={t('seLab.architectureDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Architecture' }]}
      />

      <Tabs defaultValue="layers">
        <TabsList>
          <TabsTrigger value="layers">Layered Architecture</TabsTrigger>
          <TabsTrigger value="principles">Design Principles</TabsTrigger>
          <TabsTrigger value="di">Dependency Inversion</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The system follows a strict <strong>four-layer clean architecture</strong>. Each layer depends only on the
            layer below it. No layer imports from a layer above it. This enforces separation of concerns and makes
            each layer independently testable.
          </p>
          <div className="grid gap-4">
            {LAYERS.map((layer, i) => (
              <Card key={layer.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Badge variant="secondary">Layer {i + 1}</Badge>
                    {layer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><strong>Technology:</strong> {layer.tech}</p>
                  <p><strong>Responsibility:</strong> {layer.responsibility}</p>
                  <p className="text-muted-foreground">
                    <strong>Cohesion:</strong> {layer.cohesion}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Coupling:</strong> {layer.coupling}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="principles" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                principle: 'High Cohesion',
                example: 'useAssets hook only manages asset fetching logic. useChat only manages conversation state. Each Zustand store owns one domain.',
              },
              {
                principle: 'Low Coupling',
                example: 'LibraryPage does not import supabase directly — it calls useAssets. This means the data source can be swapped without touching the page.',
              },
              {
                principle: 'Information Hiding',
                example: 'API keys are hidden inside Edge Functions. The browser client never sees GEMINI_API_KEY or SUPABASE_SERVICE_ROLE_KEY at any point.',
              },
              {
                principle: 'Modularity',
                example: 'Each SE Lab section is a standalone page. The chatbot system (FloatingLauncher + ChatWindow + hooks) can be extracted with zero changes to other components.',
              },
              {
                principle: 'Open/Closed Principle',
                example: 'Adding a new AI provider requires only a new else-if block inside ai-chat Edge Function. No existing code changes.',
              },
              {
                principle: 'Single Responsibility',
                example: 'validators.ts only validates. supabase.ts only configures the client. coverage.ts only parses V8 coverage JSON.',
              },
            ].map((item) => (
              <Card key={item.principle}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{item.principle}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.example}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="di">
          <Card>
            <CardHeader>
              <CardTitle>Dependency Inversion in Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                High-level modules (pages) depend on abstractions (hooks), not on low-level details (Supabase queries).
                This is the Dependency Inversion Principle from SOLID.
              </p>
              <MermaidRenderer chart={DI_CHART} title="Dependency Inversion Example" />
              <div className="rounded-lg bg-muted p-4 font-mono text-xs space-y-2">
                <p className="text-muted-foreground">// LibraryPage.tsx — depends on hook interface, not Supabase</p>
                <p><span className="text-blue-600">const</span> {'{ assets, loading, error } = useAssets({ search, categoryId })'}</p>
                <p className="text-muted-foreground mt-2">// useAssets.ts — depends on Supabase client interface</p>
                <p><span className="text-blue-600">const</span> {'{ data } = await supabase.from(\'digital_assets\').select(…)'}</p>
                <p className="text-muted-foreground mt-2">// Result: LibraryPage is testable by mocking useAssets</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
