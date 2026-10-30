/**
 * V8 coverage parser utilities.
 *
 * Parses the JSON output from `vitest --coverage --reporter=json` to
 * extract statement and branch coverage for the White-Box Testing Visualizer.
 *
 * The coverage data structure follows the istanbul/nyc format:
 * { total: { lines, statements, branches, functions }, file1: {...}, ... }
 */

export interface CoverageSummary {
  total: CoverageStats
  [filePath: string]: CoverageStats | unknown
}

export interface CoverageStats {
  total: number
  covered: number
  skipped: number
  pct: number
}

export interface FileCoverage {
  path: string
  statementCoverage: number
  branchCoverage: number
  functionCoverage: number
  lineCoverage: number
  uncoveredLines: number[]
}

export interface CoverageReport {
  overall: {
    statementPct: number
    branchPct: number
    functionPct: number
    linePct: number
  }
  files: FileCoverage[]
}

/**
 * Parse a coverage JSON summary object into a structured report.
 */
export function parseCoverageSummary(summary: CoverageSummary): CoverageReport {
  const total = summary.total

  const getStats = (key: string): CoverageStats => {
    const s = total[key as keyof typeof total] as unknown as CoverageStats
    return {
      total: s?.total ?? 0,
      covered: s?.covered ?? 0,
      skipped: s?.skipped ?? 0,
      pct: s?.pct ?? 0,
    }
  }

  const stmtStats = getStats('statements')
  const branchStats = getStats('branches')
  const fnStats = getStats('functions')
  const lineStats = getStats('lines')

  const files: FileCoverage[] = []
  for (const [key, value] of Object.entries(summary)) {
    if (key === 'total') continue
    const fc = value as Record<string, CoverageStats>
    files.push({
      path: key,
      statementCoverage: fc.statements?.pct ?? 0,
      branchCoverage: fc.branches?.pct ?? 0,
      functionCoverage: fc.functions?.pct ?? 0,
      lineCoverage: fc.lines?.pct ?? 0,
      uncoveredLines: [],
    })
  }

  return {
    overall: {
      statementPct: stmtStats.pct,
      branchPct: branchStats.pct,
      functionPct: fnStats.pct,
      linePct: lineStats.pct,
    },
    files,
  }
}

/**
 * Format a coverage percentage for display.
 */
export function formatCoverage(pct: number): string {
  if (pct >= 100) return '100%'
  return `${pct.toFixed(1)}%`
}

/**
 * Get a color class based on coverage percentage.
 */
export function coverageColor(pct: number): string {
  if (pct >= 80) return 'text-green-600'
  if (pct >= 60) return 'text-yellow-600'
  if (pct >= 40) return 'text-orange-600'
  return 'text-red-600'
}
