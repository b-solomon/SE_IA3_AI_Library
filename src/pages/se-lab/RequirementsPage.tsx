import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const FUNCTIONAL_REQS = [
  { id: 'FR-01', description: 'Users can register with name, email, and password', priority: 'Must', status: '✅' },
  { id: 'FR-02', description: 'Users can log in and log out securely', priority: 'Must', status: '✅' },
  { id: 'FR-03', description: 'Admin can upload PDF/EPUB files ≤ 50 MB', priority: 'Must', status: '✅' },
  { id: 'FR-04', description: 'Students can browse and search the library', priority: 'Must', status: '✅' },
  { id: 'FR-05', description: 'Students can download documents', priority: 'Must', status: '✅' },
  { id: 'FR-06', description: 'Admin can manage categories (CRUD)', priority: 'Should', status: '✅' },
  { id: 'FR-07', description: 'Admin can manage users and assign roles', priority: 'Should', status: '✅' },
  { id: 'FR-08', description: 'AI chatbot answers library-related queries', priority: 'Must', status: '✅' },
  { id: 'FR-09', description: 'Chat history is persisted per user session', priority: 'Should', status: '✅' },
  { id: 'FR-10', description: 'AI falls back across Gemini → OpenRouter → NVIDIA', priority: 'Should', status: '✅' },
  { id: 'FR-11', description: 'AI can summarize documents (admin-only)', priority: 'Could', status: '✅' },
  { id: 'FR-12', description: 'AI suggests category and tags during upload', priority: 'Could', status: '✅' },
  { id: 'FR-13', description: 'SE Lab with 12 interactive sections', priority: 'Must', status: '✅' },
  { id: 'FR-14', description: 'UML diagrams rendered with Mermaid', priority: 'Must', status: '✅' },
  { id: 'FR-15', description: 'Black-box test visualizer with live execution', priority: 'Must', status: '✅' },
  { id: 'FR-16', description: 'White-box CFG and coverage data from Vitest', priority: 'Must', status: '✅' },
  { id: 'FR-17', description: 'Language toggle: English / Tamil / Hindi', priority: 'Should', status: '✅' },
  { id: 'FR-18', description: 'Password reset via Supabase email flow', priority: 'Should', status: '✅' },
]

const NON_FUNCTIONAL_REQS = [
  { id: 'NFR-01', category: 'Security', description: 'All API keys confined to Edge Functions; never in browser', status: '✅' },
  { id: 'NFR-02', category: 'Security', description: 'Row Level Security on every table', status: '✅' },
  { id: 'NFR-03', category: 'Performance', description: 'Search debounced to 300 ms; pages load in < 2 s on broadband', status: '✅' },
  { id: 'NFR-04', category: 'Accessibility', description: 'WCAG AA colour contrast; keyboard navigation; ARIA labels', status: '✅' },
  { id: 'NFR-05', category: 'Reliability', description: 'AI fallback chain ensures chatbot always responds', status: '✅' },
  { id: 'NFR-06', category: 'Usability', description: 'Mobile-responsive ≥ 375 px; skeleton loaders on all async operations', status: '✅' },
  { id: 'NFR-07', category: 'Maintainability', description: 'TypeScript strict mode; no implicit any; Zod validation', status: '✅' },
  { id: 'NFR-08', category: 'Scalability', description: 'Supabase PostgreSQL with indexed columns; paginated API queries', status: '✅' },
  { id: 'NFR-09', category: 'Portability', description: 'One-command local setup; deployable to Vercel on any machine', status: '✅' },
  { id: 'NFR-10', category: 'Internationalisation', description: 'All UI strings in i18n translation files; browser-locale auto-detect', status: '✅' },
]

const TRACEABILITY = [
  { req: 'FR-01', feature: 'RegisterPage', testCase: 'TC-BB-01', diagram: 'Seq: Registration' },
  { req: 'FR-02', feature: 'LoginPage', testCase: 'TC-BB-02', diagram: 'Seq: Login' },
  { req: 'FR-03', feature: 'UploadPage', testCase: 'TC-BB-04', diagram: 'Seq: Upload' },
  { req: 'FR-04', feature: 'LibraryPage', testCase: 'TC-BB-05', diagram: 'Activity: Library Ops' },
  { req: 'FR-05', feature: 'AssetDetailPage', testCase: 'TC-BB-07', diagram: 'Activity: Library Ops' },
  { req: 'FR-08', feature: 'AssistantPage / ai-chat fn', testCase: 'TC-BB-09', diagram: 'Seq: AI Chat' },
  { req: 'FR-09', feature: 'conversations + chat_messages', testCase: 'TC-BB-10', diagram: 'Class Diagram' },
  { req: 'FR-13', feature: 'SE Lab (all 12 pages)', testCase: 'TC-UI-01', diagram: 'Deployment Diagram' },
  { req: 'FR-14', feature: 'MermaidRenderer', testCase: 'TC-UI-02', diagram: 'All 10 UML' },
  { req: 'NFR-01', feature: 'Edge Functions (server-side only)', testCase: 'TC-SEC-01', diagram: 'Seq: AI Chat' },
  { req: 'NFR-02', feature: 'Supabase RLS migrations', testCase: 'TC-SEC-02', diagram: 'Class Diagram' },
]

const PRIORITY_VARIANT: Record<string, 'default' | 'accent' | 'secondary' | 'outline'> = {
  Must: 'default', Should: 'accent', Could: 'secondary', WontHave: 'outline',
}

export function RequirementsPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.requirements')}
        description={t('seLab.requirementsDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Requirements' }]}
      />
      <Tabs defaultValue="functional">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="functional">Functional</TabsTrigger>
          <TabsTrigger value="nonfunctional">Non-Functional</TabsTrigger>
          <TabsTrigger value="traceability">Traceability Matrix</TabsTrigger>
          <TabsTrigger value="moscow">MoSCoW</TabsTrigger>
        </TabsList>

        <TabsContent value="functional">
          <Card>
            <CardHeader><CardTitle>Functional Requirements</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left"><th className="p-2">ID</th><th className="p-2">Requirement</th><th className="p-2">Priority</th><th className="p-2">Status</th></tr></thead>
                  <tbody className="divide-y">
                    {FUNCTIONAL_REQS.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30">
                        <td className="p-2 font-mono text-xs">{r.id}</td>
                        <td className="p-2">{r.description}</td>
                        <td className="p-2"><Badge variant={PRIORITY_VARIANT[r.priority]}>{r.priority}</Badge></td>
                        <td className="p-2">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nonfunctional">
          <Card>
            <CardHeader><CardTitle>Non-Functional Requirements</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left"><th className="p-2">ID</th><th className="p-2">Category</th><th className="p-2">Requirement</th><th className="p-2">Status</th></tr></thead>
                  <tbody className="divide-y">
                    {NON_FUNCTIONAL_REQS.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/30">
                        <td className="p-2 font-mono text-xs">{r.id}</td>
                        <td className="p-2"><Badge variant="outline">{r.category}</Badge></td>
                        <td className="p-2">{r.description}</td>
                        <td className="p-2">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traceability">
          <Card>
            <CardHeader><CardTitle>Requirements Traceability Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left bg-muted/50"><th className="p-2">Req ID</th><th className="p-2">Feature / Component</th><th className="p-2">Test Case</th><th className="p-2">Diagram</th></tr></thead>
                  <tbody className="divide-y">
                    {TRACEABILITY.map((r) => (
                      <tr key={r.req} className="hover:bg-muted/30">
                        <td className="p-2 font-mono text-xs">{r.req}</td>
                        <td className="p-2 text-sm">{r.feature}</td>
                        <td className="p-2 font-mono text-xs text-primary">{r.testCase}</td>
                        <td className="p-2 text-xs text-muted-foreground">{r.diagram}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moscow">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: '🔴 Must Have', color: 'border-red-200 bg-red-50', items: FUNCTIONAL_REQS.filter(r => r.priority === 'Must') },
              { label: '🟡 Should Have', color: 'border-yellow-200 bg-yellow-50', items: FUNCTIONAL_REQS.filter(r => r.priority === 'Should') },
              { label: '🟢 Could Have', color: 'border-green-200 bg-green-50', items: FUNCTIONAL_REQS.filter(r => r.priority === 'Could') },
              { label: '⚪ Won\'t Have (this release)', color: 'border-gray-200 bg-gray-50', items: [] },
            ].map(group => (
              <Card key={group.label} className={group.color}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{group.label}</CardTitle></CardHeader>
                <CardContent>
                  {group.items.length === 0
                    ? <p className="text-xs text-muted-foreground">None in this category</p>
                    : <ul className="space-y-1">{group.items.map(r => <li key={r.id} className="text-xs flex gap-1.5"><span className="font-mono shrink-0">{r.id}</span><span>{r.description}</span></li>)}</ul>
                  }
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
