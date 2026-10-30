import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import type { TestRun, Defect } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download } from 'lucide-react'

const DEFECT_STATUS_COLOR: Record<string, string> = {
  new: 'bg-red-100 text-red-700',
  triaged: 'bg-orange-100 text-orange-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  fixed: 'bg-blue-100 text-blue-700',
  retested: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
}

export function TestExecutionPage() {
  const { t } = useTranslation()
  const [runs, setRuns] = useState<TestRun[]>([])
  const [defects, setDefects] = useState<Defect[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('test_runs').select('*').order('started_at', { ascending: false }).limit(10),
      supabase.from('defects').select('*').order('created_at', { ascending: false }),
    ]).then(([runsRes, defectsRes]) => {
      setRuns((runsRes.data as TestRun[]) ?? [])
      setDefects((defectsRes.data as Defect[]) ?? [])
      setLoading(false)
    })
  }, [])

  const chartData = runs.slice().reverse().map((r) => ({
    label: r.run_label,
    Passed: r.passed,
    Failed: r.failed,
    Skipped: r.skipped,
  }))

  const exportCsv = () => {
    const rows = [['Run Label','Total','Passed','Failed','Skipped','Date'],
      ...runs.map(r => [r.run_label, r.total, r.passed, r.failed, r.skipped, r.started_at])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'test-runs.csv'; a.click()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('seLab.testExecution')}
        description={t('seLab.testExecutionDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Test Execution' }]}
        actions={<Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>}
      />

      <Tabs defaultValue="runs">
        <TabsList>
          <TabsTrigger value="runs">Test Runs</TabsTrigger>
          <TabsTrigger value="defects">Defects</TabsTrigger>
          <TabsTrigger value="trend">Trend Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="runs">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>
          ) : runs.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No test runs yet. Run tests from the Black-Box page.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <Card key={run.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-medium text-sm">{run.run_label}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(run.started_at)}</p>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <span className="text-green-600 font-semibold">✓ {run.passed}</span>
                        <span className="text-red-600 font-semibold">✗ {run.failed}</span>
                        <span className="text-muted-foreground">⊘ {run.skipped}</span>
                        <span className="text-muted-foreground">/ {run.total}</span>
                      </div>
                      <Badge variant="outline">{run.branch ?? 'main'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="defects">
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-16" />)}</div>
          ) : defects.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No defects recorded.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {defects.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <code className="text-xs font-mono mt-0.5">{d.defect_id}</code>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{d.title}</p>
                      {d.description && <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>}
                    </div>
                    <Badge className={DEFECT_STATUS_COLOR[d.status]} variant="outline">
                      {d.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{d.severity}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trend">
          {chartData.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Run tests to see the trend chart.</CardContent></Card>
          ) : (
            <Card>
              <CardHeader><CardTitle>Test Run History</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Passed" fill="#22c55e" />
                    <Bar dataKey="Failed" fill="#ef4444" />
                    <Bar dataKey="Skipped" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
