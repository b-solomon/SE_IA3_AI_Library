import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'

const GANTT = `gantt
  title AI Digital Library Project Schedule
  dateFormat YYYY-MM-DD
  section Analysis and Design
    Requirements Gathering :done, req, 2025-12-20, 4d
    Architecture Design :done, arch, after req, 3d
  section Sprint 1 Scaffold
    Vite TypeScript Tailwind Setup :done, s1a, 2026-01-01, 2d
    Supabase Schema and RLS :done, s1b, after s1a, 3d
    Deployment Configuration :done, s1c, after s1b, 1d
  section Sprint 2 Auth and Library
    Auth Pages and Zustand Store :done, s2a, 2026-01-08, 3d
    Library Browse and Search :done, s2b, after s2a, 3d
    Upload Page and Storage Bucket :done, s2c, after s2b, 2d
  section Sprint 3 AI Features
    AI Chat Edge Function :done, s3a, 2026-01-20, 3d
    AI Summarize and Classify :done, s3b, after s3a, 2d
    Chatbot Interface Integration :done, s3c, after s3b, 3d
  section Sprint 4 SE Lab
    All 12 SE Lab Modules :done, s4a, 2026-02-01, 8d
    Ten Mermaid UML Diagrams :done, s4b, after s4a, 3d
  section Sprint 5 QA and Deploy
    Vitest Automated Test Suite :done, s5a, 2026-02-15, 4d
    Security Audit and Hardening :done, s5b, after s5a, 2d
    Production Deployment :done, s5c, after s5b, 1d
    Documentation and Report :done, s5d, after s5c, 2d
`

const WBS = [
  { id: '1', task: 'Project Inception', effort: 8, status: '✅' },
  { id: '1.1', task: 'Requirements elicitation', effort: 4, status: '✅', indent: 1 },
  { id: '1.2', task: 'Architecture design', effort: 4, status: '✅', indent: 1 },
  { id: '2', task: 'Scaffold & Infrastructure', effort: 12, status: '✅' },
  { id: '2.1', task: 'Vite + TS + Tailwind setup', effort: 3, status: '✅', indent: 1 },
  { id: '2.2', task: 'Supabase schema + RLS migrations', effort: 5, status: '✅', indent: 1 },
  { id: '2.3', task: 'CI/CD + Vercel config', effort: 2, status: '✅', indent: 1 },
  { id: '2.4', task: 'i18n setup (EN/TA/HI)', effort: 2, status: '✅', indent: 1 },
  { id: '3', task: 'Core Features', effort: 28, status: '✅' },
  { id: '3.1', task: 'Authentication (register/login/logout)', effort: 6, status: '✅', indent: 1 },
  { id: '3.2', task: 'Library browse, search, filter, paginate', effort: 8, status: '✅', indent: 1 },
  { id: '3.3', task: 'Document upload + Supabase Storage', effort: 6, status: '✅', indent: 1 },
  { id: '3.4', task: 'Admin dashboard + user/category CRUD', effort: 8, status: '✅', indent: 1 },
  { id: '4', task: 'AI Features', effort: 18, status: '✅' },
  { id: '4.1', task: 'ai-chat Edge Function (fallback chain)', effort: 6, status: '✅', indent: 1 },
  { id: '4.2', task: 'ai-summarize Edge Function', effort: 4, status: '✅', indent: 1 },
  { id: '4.3', task: 'ai-classify Edge Function', effort: 3, status: '✅', indent: 1 },
  { id: '4.4', task: 'Chatbot UI (floating + full page)', effort: 5, status: '✅', indent: 1 },
  { id: '5', task: 'SE Lab (12 modules)', effort: 24, status: '✅' },
  { id: '5.1', task: '10 UML Mermaid diagrams', effort: 6, status: '✅', indent: 1 },
  { id: '5.2', task: 'Black-box + white-box visualizers', effort: 8, status: '✅', indent: 1 },
  { id: '5.3', task: 'Quality metrics + defect tracking', effort: 5, status: '✅', indent: 1 },
  { id: '5.4', task: 'Estimation + SCM + syllabus + viva pages', effort: 5, status: '✅', indent: 1 },
  { id: '6', task: 'Testing & QA', effort: 14, status: '✅' },
  { id: '6.1', task: 'Vitest unit + integration tests', effort: 8, status: '✅', indent: 1 },
  { id: '6.2', task: 'Security audit (RLS, exposed keys, routes)', effort: 3, status: '✅', indent: 1 },
  { id: '6.3', task: 'Cross-browser + mobile testing', effort: 3, status: '✅', indent: 1 },
  { id: '7', task: 'Documentation', effort: 6, status: '✅' },
]

const totalEffort = WBS.filter(w => !w.indent).reduce((s, w) => s + w.effort, 0)

export function EstimationPage() {
  const { t } = useTranslation()

  // COCOMO II Intermediate — Early Design model
  // SLOC estimate based on actual codebase
  const sloc = 5200  // estimated lines (src/ only, excluding generated)
  const ksloc = sloc / 1000  // 5.2 KSLOC
  const a = 2.94    // COCOMO II coefficient
  const b = 0.91    // exponent (organic mode, scale factors)
  const effort_mm = a * Math.pow(ksloc, b)  // Person-Months
  const duration_months = 2.5 * Math.pow(effort_mm, 0.38)

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.estimation')}
        description={t('seLab.estimationDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Estimation & Scheduling' }]}
      />

      {/* Gantt */}
      <Card>
        <CardHeader><CardTitle>Project Gantt Chart</CardTitle></CardHeader>
        <CardContent>
          <MermaidRenderer chart={GANTT} title="Project Gantt" />
        </CardContent>
      </Card>

      {/* WBS */}
      <Card>
        <CardHeader>
          <CardTitle>Work Breakdown Structure</CardTitle>
          <p className="text-xs text-muted-foreground">Total estimated effort: {totalEffort} person-hours</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {WBS.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between py-1.5 px-2 rounded text-sm
                  ${!item.indent ? 'bg-muted/50 font-medium' : ''}`}
                style={{ paddingLeft: `${(item.indent ?? 0) * 20 + 8}px` }}
              >
                <span className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground">{item.id}</code>
                  {item.task}
                </span>
                <span className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{item.effort}h</span>
                  <span>{item.status}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* COCOMO II */}
      <Card>
        <CardHeader><CardTitle>COCOMO II Estimation</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="font-medium text-orange-800">⚠️ Assumptions & Limitations</p>
            <ul className="text-xs text-orange-700 mt-2 space-y-1 list-disc list-inside">
              <li>SLOC count is estimated (actual count: {sloc.toLocaleString()} lines in src/)</li>
              <li>COCOMO II Early Design model used — post-architecture model would be more accurate</li>
              <li>Scale factors assumed for a solo student project: organic type (familiar domain, small team)</li>
              <li>No cost driver adjustments applied (would require calibration to historical data)</li>
              <li>Output should be treated as a ballpark estimate ± 50%, not a contractual commitment</li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2 font-mono text-xs">
              <p className="font-semibold text-sm font-sans">Inputs</p>
              <p>SLOC = {sloc.toLocaleString()}</p>
              <p>KSLOC = {ksloc.toFixed(2)}</p>
              <p>a = {a} (COCOMO II coefficient)</p>
              <p>b = {b} (Organic exponent)</p>
            </div>
            <div className="rounded-lg border p-4 space-y-2 font-mono text-xs">
              <p className="font-semibold text-sm font-sans">Results</p>
              <p>Effort = a × KSLOC^b</p>
              <p>       = {a} × {ksloc.toFixed(2)}^{b}</p>
              <p className="font-bold text-primary">= {effort_mm.toFixed(1)} Person-Months</p>
              <p>Duration = 2.5 × E^0.38</p>
              <p className="font-bold text-primary">= {duration_months.toFixed(1)} months</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Actual time: 2 months (faster than COCOMO prediction because: (1) student project with focused scope,
            (2) modern AI-assisted development, (3) Supabase eliminates most backend boilerplate).
            COCOMO II was designed for large team industrial software — its predictions are less accurate for solo student projects.
          </p>
        </CardContent>
      </Card>

      {/* Risk Register */}
      <Card>
        <CardHeader><CardTitle>Risk Register</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50 text-left"><th className="p-2">Risk</th><th className="p-2">Probability</th><th className="p-2">Impact</th><th className="p-2">Mitigation</th><th className="p-2">Status</th></tr></thead>
              <tbody className="divide-y text-xs">
                {[
                  { risk: 'Gemini API quota exhausted', prob: 'High', impact: 'High', mitigation: 'OpenRouter + NVIDIA fallback chain implemented', status: '✅ Mitigated' },
                  { risk: 'Supabase free tier limits hit', prob: 'Low', impact: 'Medium', mitigation: 'Paginated queries; 50 MB file limit; monitoring enabled', status: '✅ Controlled' },
                  { risk: 'RLS misconfiguration exposes data', prob: 'Low', impact: 'Critical', mitigation: 'Security audit step; tested with student & admin roles', status: '✅ Tested' },
                  { risk: 'Viva question not covered by SE Lab', prob: 'Medium', impact: 'High', mitigation: 'All 5 LUs mapped in syllabus coverage matrix; viva prep page', status: '✅ Mitigated' },
                  { risk: 'Vercel deploy fails due to missing env vars', prob: 'Medium', impact: 'High', mitigation: '.env.example documents all required variables; Vercel dashboard configured', status: '✅ Resolved' },
                ].map((r) => (
                  <tr key={r.risk} className="hover:bg-muted/30">
                    <td className="p-2">{r.risk}</td>
                    <td className="p-2"><Badge variant={r.prob === 'High' ? 'destructive' : r.prob === 'Medium' ? 'warning' : 'secondary'}>{r.prob}</Badge></td>
                    <td className="p-2"><Badge variant={r.impact === 'Critical' || r.impact === 'High' ? 'destructive' : 'secondary'}>{r.impact}</Badge></td>
                    <td className="p-2 text-muted-foreground">{r.mitigation}</td>
                    <td className="p-2 text-green-600">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
