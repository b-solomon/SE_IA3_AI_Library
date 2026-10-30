import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

const SPRINT_TIMELINE = `gantt
  title AI Digital Library Sprint Timeline
  dateFormat YYYY-MM-DD
  section Sprint 1 Foundation
    Project Scaffold and DB Schema :done, s1a, 2026-01-01, 5d
    Authentication and RLS Setup :done, s1b, after s1a, 4d
  section Sprint 2 Core Library
    Asset Browsing and Search :done, s2a, 2026-01-10, 5d
    Document Upload and Storage :done, s2b, after s2a, 4d
  section Sprint 3 AI Features
    AI Chat Edge Function :done, s3a, 2026-01-20, 4d
    AI Summarize and Classify :done, s3b, after s3a, 3d
    Chatbot Interface Integration :done, s3c, after s3b, 3d
  section Sprint 4 SE Lab
    All 12 SE Lab Modules :done, s4a, 2026-02-01, 8d
    Mermaid UML Diagrams Suite :done, s4b, after s4a, 3d
  section Sprint 5 Testing and SQA
    Black Box Verification Tests :done, s5a, 2026-02-15, 4d
    White Box CFG and V8 Coverage :done, s5b, after s5a, 3d
    Security Audit and Final Deploy :done, s5c, after s5b, 3d
`

const MODEL_COMPARISON = [
  {
    model: 'Waterfall',
    pros: ['Simple, structured', 'Clear milestones', 'Easy documentation'],
    cons: ['Inflexible', 'Late feedback', 'Not suitable for evolving requirements'],
    suitable: false,
  },
  {
    model: 'Incremental',
    pros: ['Early working software', 'Feedback at each increment', 'Risk reduced per iteration'],
    cons: ['Requires good planning', 'Integration complexity'],
    suitable: true,
  },
  {
    model: 'Evolutionary (Prototyping)',
    pros: ['User feedback drives development', 'Good for unclear requirements'],
    cons: ['Can lead to scope creep', 'Documentation may lag'],
    suitable: false,
  },
  {
    model: 'Unified Process (UP)',
    pros: ['Architecture-centric', 'Use-case driven', 'Iterative'],
    cons: ['Heavy for small projects', 'Complex artifacts'],
    suitable: false,
  },
  {
    model: 'Agile (Scrum)',
    pros: ['Adaptive', 'Rapid delivery', 'Continuous feedback', 'Collaboration-focused'],
    cons: ['Needs experienced team', 'Scope may drift', 'Hard to predict end date'],
    suitable: true,
  },
]

export function ProcessModelPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.processModel')}
        description={t('seLab.processModelDesc')}
        breadcrumbs={[{ label: 'SE Lab', to: '/se-lab/process-model' }, { label: 'Process Model' }]}
      />

      {/* Selected Model Justification */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Selected Model: Agile + Incremental
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            This project uses an <strong>Agile + Incremental</strong> process model. Development was
            organised into 5 sprints, each delivering a working, deployable increment of the system.
          </p>
          <p><strong>Justification:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Requirements were partially unknown at start — AI features evolved through experimentation</li>
            <li>Each sprint produced a testable, reviewable increment (library → auth → AI → SE Lab → QA)</li>
            <li>Agile ceremonies (sprint review, retrospective) provided feedback loops</li>
            <li>Supabase's iterative migration system aligns with incremental DB evolution</li>
            <li>A student solo project benefits from short cycles: build → test → demo → improve</li>
          </ul>
        </CardContent>
      </Card>

      {/* Sprint Timeline */}
      <Card>
        <CardHeader><CardTitle>Sprint Timeline (Gantt)</CardTitle></CardHeader>
        <CardContent>
          <MermaidRenderer chart={SPRINT_TIMELINE} title="Sprint Timeline" />
        </CardContent>
      </Card>

      {/* Model Comparison */}
      <Card>
        <CardHeader><CardTitle>Process Model Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Model</th>
                  <th className="text-left p-3 font-semibold">Pros</th>
                  <th className="text-left p-3 font-semibold">Cons</th>
                  <th className="text-center p-3 font-semibold">This Project</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MODEL_COMPARISON.map((row) => (
                  <tr key={row.model} className={row.suitable ? 'bg-green-50/50' : ''}>
                    <td className="p-3 font-medium align-top">
                      {row.model}
                      {row.suitable && <Badge variant="success" className="ml-2">✓ Used</Badge>}
                    </td>
                    <td className="p-3 text-muted-foreground align-top">
                      <ul className="list-disc list-inside space-y-0.5">
                        {row.pros.map((p) => <li key={p}>{p}</li>)}
                      </ul>
                    </td>
                    <td className="p-3 text-muted-foreground align-top">
                      <ul className="list-disc list-inside space-y-0.5">
                        {row.cons.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </td>
                    <td className="p-3 text-center">{row.suitable ? '✅' : '—'}</td>
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
