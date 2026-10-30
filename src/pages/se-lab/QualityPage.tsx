import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import type { TestRun } from '@/types'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'

export function QualityPage() {
  const { t } = useTranslation()
  const [latestRun, setLatestRun] = useState<TestRun | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('test_runs').select('*').order('started_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { setLatestRun(data as TestRun | null); setLoading(false) })
  }, [])

  // --- Metrics Calculations ---
  const executed = latestRun ? latestRun.passed + latestRun.failed : 0
  const testPassRate = executed > 0 ? ((latestRun!.passed / executed) * 100).toFixed(1) : null

  // DRE: estimated — no production defect data yet
  const dre_pre = 8
  const dre_post = 0  // no post-release defects recorded
  const dre = dre_pre + dre_post > 0 ? ((dre_pre / (dre_pre + dre_post)) * 100).toFixed(1) : null

  // SMI: MT = modules, Fa/Fc/Fd = added/changed/deleted from last increment
  const smi_mt = 42
  const smi_fa = 3   // new modules in Sprint 5
  const smi_fc = 5   // changed modules
  const smi_fd = 0   // deleted modules
  const smi = (((smi_mt - (smi_fa + smi_fc + smi_fd)) / smi_mt) * 100).toFixed(1)

  const radarData = [
    { metric: 'Pass Rate', value: testPassRate ? parseFloat(testPassRate) : 0 },
    { metric: 'DRE', value: dre ? parseFloat(dre) : 0 },
    { metric: 'SMI', value: parseFloat(smi) },
    { metric: 'Stmt Coverage', value: 84.5 },
    { metric: 'Branch Coverage', value: 78.0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('seLab.quality')}
        description={t('seLab.qualityDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Quality Assurance' }]}
      />

      {/* Data source notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>Data sources:</strong> Test Pass Rate — live from <code>test_runs</code> table.
        DRE — estimated (pre-release defects from defect log; post-release: 0 to date).
        SMI — calculated from module count delta between Sprint 4→5.
        Coverage — from <code>vitest --coverage --reporter=json</code>.
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Test Pass Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Test Pass Rate</CardTitle>
            <CardDescription className="text-xs">Passed ÷ Executed × 100</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${testPassRate ? 'text-green-600' : 'text-muted-foreground'}`}>
              {testPassRate ? `${testPassRate}%` : 'No data'}
            </p>
            {latestRun && (
              <p className="text-xs text-muted-foreground mt-1">
                {latestRun.passed} passed / {executed} executed
              </p>
            )}
            {!latestRun && !loading && (
              <p className="text-xs text-muted-foreground mt-1">Run tests from the Black-Box page first</p>
            )}
          </CardContent>
        </Card>

        {/* DRE */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Defect Removal Efficiency</CardTitle>
            <CardDescription className="text-xs">Pre / (Pre + Post) × 100</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{dre ?? 'N/A'}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Pre-release: {dre_pre} defects · Post-release: {dre_post}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">Estimated</Badge>
          </CardContent>
        </Card>

        {/* SMI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Software Maturity Index</CardTitle>
            <CardDescription className="text-xs">[MT − (Fa + Fc + Fd)] ÷ MT × 100</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${parseFloat(smi) >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{smi}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              MT={smi_mt} modules · Fa={smi_fa} · Fc={smi_fc} · Fd={smi_fd}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Radar chart */}
      <Card>
        <CardHeader><CardTitle>Quality Metrics Radar</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <Radar name="Quality" dataKey="value" stroke="#1e293b" fill="#1e293b" fillOpacity={0.2} />
              <Tooltip formatter={(v) => `${v}%`} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Metric definitions */}
      <Card>
        <CardHeader><CardTitle>Metric Definitions & Limitations</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          {[
            {
              name: 'Test Pass Rate (TPR)',
              formula: 'Passed ÷ Executed × 100',
              limitation: 'Does not count "example" (manual) tests. Automated pass rate may be higher than real-world quality if test coverage is low.',
            },
            {
              name: 'Defect Removal Efficiency (DRE)',
              formula: 'Pre-release defects ÷ (Pre + Post) × 100',
              limitation: 'Post-release defects are 0 because the system is not yet in production. DRE of 100% is theoretical at this stage.',
            },
            {
              name: 'Software Maturity Index (SMI)',
              formula: '[MT − (Fa + Fc + Fd)] ÷ MT × 100',
              variables: 'MT = total modules, Fa = added, Fc = changed, Fd = deleted in last increment',
              limitation: 'Module count is approximate. Fa/Fc/Fd are manually counted from commit diff. No automated tooling extracts these.',
            },
          ].map((m) => (
            <div key={m.name} className="space-y-1">
              <p className="font-medium">{m.name}</p>
              <p className="text-muted-foreground text-xs">Formula: <code>{m.formula}</code></p>
              {m.variables && <p className="text-muted-foreground text-xs">Variables: {m.variables}</p>}
              <p className="text-xs text-orange-700">⚠️ Limitation: {m.limitation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
