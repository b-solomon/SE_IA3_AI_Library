import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const LEARNING_UNITS = [
  {
    lu: 'LU1',
    title: 'Software Process Models',
    items: [
      { topic: 'Waterfall Model', status: '🔬', feature: 'Process Model Comparison table', page: '/se-lab/process-model' },
      { topic: 'Incremental Model', status: '🔬', feature: 'Sprint timeline Gantt chart', page: '/se-lab/process-model' },
      { topic: 'Evolutionary Model', status: '📚', feature: 'Model comparison table', page: '/se-lab/process-model' },
      { topic: 'Agile/Scrum', status: '✅', feature: 'Selected process model — 5 completed sprints', page: '/se-lab/process-model' },
      { topic: 'UP (Unified Process)', status: '📚', feature: 'Model comparison table', page: '/se-lab/process-model' },
      { topic: 'Requirements Engineering', status: '✅', feature: '18 FRs + 10 NFRs + traceability matrix', page: '/se-lab/requirements' },
      { topic: 'MoSCoW Prioritisation', status: '✅', feature: 'MoSCoW tab in Requirements page', page: '/se-lab/requirements' },
    ],
  },
  {
    lu: 'LU2',
    title: 'Software Architecture & Design',
    items: [
      { topic: 'Layered Architecture', status: '✅', feature: 'Four-layer clean architecture; Diagram 2', page: '/se-lab/architecture' },
      { topic: 'Cohesion & Coupling', status: '✅', feature: 'Per-layer analysis in Architecture page', page: '/se-lab/architecture' },
      { topic: 'Information Hiding', status: '✅', feature: 'API keys in Edge Functions; never in src/', page: '/se-lab/architecture' },
      { topic: 'Dependency Inversion', status: '✅', feature: 'hooks → supabase.ts chain; DI diagram', page: '/se-lab/architecture' },
      { topic: 'UML Class Diagram', status: '✅', feature: 'Diagram 4 — matches actual DB schema', page: '/se-lab/uml-diagrams' },
      { topic: 'UML Sequence Diagrams', status: '✅', feature: 'Diagrams 5–8 (reg, login, upload, AI chat)', page: '/se-lab/uml-diagrams' },
      { topic: 'Deployment Diagram', status: '✅', feature: 'Diagram 10 — Browser→Vercel→Supabase→AI', page: '/se-lab/uml-diagrams' },
    ],
  },
  {
    lu: 'LU3',
    title: 'Software Testing',
    items: [
      { topic: 'Black-Box Testing', status: '✅', feature: '12 test cases (EP, BVA, functional, security)', page: '/se-lab/black-box' },
      { topic: 'Equivalence Partitioning', status: '✅', feature: 'TC-BB-01 to TC-BB-06', page: '/se-lab/black-box' },
      { topic: 'Boundary Value Analysis', status: '✅', feature: 'TC-BB-02, TC-BB-07, TC-BB-08', page: '/se-lab/black-box' },
      { topic: 'White-Box Testing', status: '✅', feature: 'CFGs for validateRegistration + validateFile', page: '/se-lab/white-box' },
      { topic: 'Statement & Branch Coverage', status: '✅', feature: 'V8 coverage data from vitest --coverage', page: '/se-lab/white-box' },
      { topic: 'Test Execution & Defects', status: '✅', feature: 'Live test_runs + defects from Supabase', page: '/se-lab/test-execution' },
      { topic: 'Defect Lifecycle', status: '✅', feature: 'New→Triaged→In Progress→Fixed→Closed', page: '/se-lab/test-execution' },
    ],
  },
  {
    lu: 'LU4',
    title: 'Software Quality Assurance',
    items: [
      { topic: 'Test Pass Rate', status: '✅', feature: 'Live calculation from test_runs DB table', page: '/se-lab/quality' },
      { topic: 'DRE (Defect Removal Efficiency)', status: '🔬', feature: 'Calculated from defect log; labelled "estimated"', page: '/se-lab/quality' },
      { topic: 'SMI (Software Maturity Index)', status: '🔬', feature: 'Calculated from module delta Sprint 4→5', page: '/se-lab/quality' },
      { topic: 'SQA Process', status: '📚', feature: 'Security checklist; coverage targets', page: '/se-lab/quality' },
    ],
  },
  {
    lu: 'LU5',
    title: 'Configuration Management & Project Planning',
    items: [
      { topic: 'Version Control (Git)', status: '✅', feature: 'Branch strategy + SCM workflow Mermaid diagram', page: '/se-lab/config-mgmt' },
      { topic: 'Configuration Identification', status: '✅', feature: 'Migration versioning; env var taxonomy', page: '/se-lab/config-mgmt' },
      { topic: 'Change Management', status: '✅', feature: 'change_records table; PR-based workflow', page: '/se-lab/config-mgmt' },
      { topic: 'COCOMO II Estimation', status: '✅', feature: 'Worked example with stated assumptions', page: '/se-lab/estimation' },
      { topic: 'Gantt Chart / Scheduling', status: '✅', feature: 'Sprint-level Mermaid gantt diagram', page: '/se-lab/estimation' },
      { topic: 'Risk Management', status: '✅', feature: 'Risk register with probability/impact/mitigation', page: '/se-lab/estimation' },
      { topic: 'Work Breakdown Structure', status: '✅', feature: 'Feature-level WBS with effort estimates', page: '/se-lab/estimation' },
    ],
  },
]

const STATUS_LABEL: Record<string, string> = {
  '✅': 'Implemented',
  '🔬': 'Demonstrated',
  '📚': 'Educational',
  '⏳': 'Planned',
}

const STATUS_VARIANT: Record<string, 'success' | 'accent' | 'secondary' | 'outline'> = {
  '✅': 'success',
  '🔬': 'accent',
  '📚': 'secondary',
  '⏳': 'outline',
}

export function SyllabusPage() {
  const { t } = useTranslation()

  const allItems = LEARNING_UNITS.flatMap((lu) => lu.items)
  const counts = {
    implemented: allItems.filter((i) => i.status === '✅').length,
    demonstrated: allItems.filter((i) => i.status === '🔬').length,
    educational: allItems.filter((i) => i.status === '📚').length,
    planned: allItems.filter((i) => i.status === '⏳').length,
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.syllabus')}
        description={t('seLab.syllabusDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Syllabus Coverage' }]}
      />

      {/* Summary */}
      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: '✅ Implemented', count: counts.implemented, color: 'text-green-600' },
          { label: '🔬 Demonstrated', count: counts.demonstrated, color: 'text-amber-600' },
          { label: '📚 Educational', count: counts.educational, color: 'text-blue-600' },
          { label: '⏳ Planned', count: counts.planned, color: 'text-muted-foreground' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Per-LU tables */}
      {LEARNING_UNITS.map((lu) => (
        <Card key={lu.lu}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge>{lu.lu}</Badge>
              {lu.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th className="p-2">Topic</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Implementation / Evidence</th>
                    <th className="p-2">Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {lu.items.map((item) => (
                    <tr key={item.topic} className="hover:bg-muted/30">
                      <td className="p-2 font-medium text-sm">{item.topic}</td>
                      <td className="p-2">
                        <Badge variant={STATUS_VARIANT[item.status]} className="text-xs gap-1">
                          {item.status} {STATUS_LABEL[item.status]}
                        </Badge>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">{item.feature}</td>
                      <td className="p-2">
                        <a href={item.page} className="text-xs text-primary hover:underline font-mono">
                          {item.page}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
