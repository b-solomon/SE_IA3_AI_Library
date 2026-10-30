import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'

const SCM_WORKFLOW = `
gitGraph
  commit id: "Initial scaffold + Vite config"
  commit id: "Supabase migrations (full schema)"
  branch develop
  checkout develop
  commit id: "Auth pages + Zustand store"
  branch feature/library
  checkout feature/library
  commit id: "LibraryPage + AssetCard"
  commit id: "UploadPage + Storage"
  checkout develop
  merge feature/library id: "Merge library feature"
  branch feature/chatbot
  checkout feature/chatbot
  commit id: "Edge Functions: ai-chat"
  commit id: "FloatingLauncher + ChatWindow"
  checkout develop
  merge feature/chatbot id: "Merge chatbot feature"
  branch feature/se-lab
  checkout feature/se-lab
  commit id: "All 12 SE Lab pages"
  commit id: "10 UML Mermaid diagrams"
  checkout develop
  merge feature/se-lab id: "Merge SE Lab"
  checkout main
  merge develop id: "v1.0.0 Release" tag: "v1.0.0"
`

const MIGRATIONS = [
  { file: '20260101000000_initial_schema.sql', description: 'Full schema: all 9 tables + RLS + triggers' },
  { file: '20260110000000_storage_buckets.sql', description: 'Create documents (private) + covers (public) buckets' },
  { file: '20260115000000_rpc_functions.sql', description: 'increment_download_count RPC function' },
  { file: '20260120000000_seed_categories.sql', description: 'Default categories: CS, Math, Physics, SE, AI, Data Science' },
]

const ENV_VARS = [
  { name: 'VITE_SUPABASE_URL', scope: 'Frontend', exposure: 'Public', purpose: 'Supabase project URL for API calls' },
  { name: 'VITE_SUPABASE_ANON_KEY', scope: 'Frontend', exposure: 'Public', purpose: 'Anon key — safe to expose; security enforced by RLS' },
  { name: 'GEMINI_API_KEY', scope: 'Edge Function', exposure: 'Secret', purpose: 'Gemini Flash API authentication — server-side only' },
  { name: 'OPENROUTER_API_KEY', scope: 'Edge Function', exposure: 'Secret', purpose: 'OpenRouter fallback AI — server-side only' },
  { name: 'NVIDIA_API_KEY', scope: 'Edge Function', exposure: 'Secret', purpose: 'NVIDIA NIM fallback AI — server-side only' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', scope: 'Edge Function', exposure: 'Secret', purpose: 'Service role for Edge Function DB access — never in browser' },
]

export function ConfigMgmtPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.configMgmt')}
        description={t('seLab.configMgmtDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Configuration Management' }]}
      />

      {/* Branching strategy */}
      <Card>
        <CardHeader><CardTitle>SCM Workflow — Git Branch Strategy</CardTitle></CardHeader>
        <CardContent>
          <MermaidRenderer chart={SCM_WORKFLOW} title="Git Workflow" />
          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { branch: 'main', desc: 'Production-ready code only. Tagged releases. Direct commits prohibited.' },
              { branch: 'develop', desc: 'Integration branch. All features merge here before promotion to main.' },
              { branch: 'feature/*', desc: 'Short-lived feature branches. One branch per user story or SE sprint task.' },
            ].map((b) => (
              <div key={b.branch} className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">{b.branch}</code>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Migrations */}
      <Card>
        <CardHeader><CardTitle>Database Migration Versioning</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MIGRATIONS.map((m) => (
              <div key={m.file} className="flex items-start gap-3 p-3 rounded-lg border">
                <code className="text-xs font-mono text-muted-foreground shrink-0">{m.file}</code>
                <p className="text-sm">{m.description}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Applied via <code className="text-xs">supabase db push</code>. Each migration is numbered with timestamp prefix to ensure deterministic ordering.
            Never modify existing migrations — create a new migration for changes.
          </p>
        </CardContent>
      </Card>

      {/* Environment variables */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variable Taxonomy</CardTitle>
          <p className="text-xs text-muted-foreground">Security classification of all runtime configuration</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50 text-left">
                <th className="p-2">Variable</th>
                <th className="p-2">Scope</th>
                <th className="p-2">Exposure</th>
                <th className="p-2">Purpose</th>
              </tr></thead>
              <tbody className="divide-y">
                {ENV_VARS.map((v) => (
                  <tr key={v.name}>
                    <td className="p-2 font-mono text-xs">{v.name}</td>
                    <td className="p-2"><Badge variant="outline">{v.scope}</Badge></td>
                    <td className="p-2">
                      <Badge variant={v.exposure === 'Secret' ? 'destructive' : 'success'} className="text-xs">
                        {v.exposure}
                      </Badge>
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">{v.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dependency lock */}
      <Card>
        <CardHeader><CardTitle>Dependency Lock File</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <code>package-lock.json</code> is committed to the repository. This ensures every developer and the
            Vercel build environment installs exactly the same dependency versions, preventing "works on my machine" issues.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs mt-2">
            <li>All dependencies are pinned to exact versions in package.json</li>
            <li>No open ranges (e.g., <code>^1.0.0</code> behaviour is locked by the lock file)</li>
            <li>Run <code>npm ci</code> in CI for reproducible installs</li>
            <li>Run <code>npm audit</code> before every release to check for vulnerabilities</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
