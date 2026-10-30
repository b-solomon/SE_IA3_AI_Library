import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// Initialise once
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 13,
  gantt: {
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
    axisFormat: '%Y-%m-%d',
    useMaxWidth: true,
  },
})

interface MermaidRendererProps {
  chart: string
  title?: string
  className?: string
  showDownload?: boolean
}

export function MermaidRenderer({ chart, title, className, showDownload = true }: MermaidRendererProps) {
  const uid = useId().replace(/:/g, '')
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!chart.trim()) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const renderId = `mermaid-${uid}-${Math.random().toString(36).slice(2, 7)}`

    mermaid.render(renderId, chart.trim()).then(({ svg }) => {
      if (!cancelled) {
        setSvg(svg)
        setLoading(false)
      }
    }).catch((err: unknown) => {
      // Clean up any stray error container mermaid may have inserted
      const stray = document.getElementById(renderId)
      if (stray) stray.remove()
      const strayD = document.getElementById(`d${renderId}`)
      if (strayD) strayD.remove()

      if (!cancelled) {
        setError(err instanceof Error ? err.message : 'Diagram render error')
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [chart, uid])

  const downloadSvg = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title ?? 'diagram'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Skeleton className={cn('h-64 w-full rounded-lg', className)} />

  if (error) return (
    <div className={cn('rounded-lg border border-destructive/30 bg-destructive/5 p-4', className)}>
      <p className="text-sm font-medium text-destructive mb-2">Diagram render error</p>
      <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">{error}</pre>
    </div>
  )

  return (
    <div className={cn('group relative', className)}>
      {showDownload && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="xs" onClick={downloadSvg}>
            <Download className="h-3.5 w-3.5" /> SVG
          </Button>
        </div>
      )}
      <div
        className="mermaid-container overflow-x-auto rounded-lg border bg-white p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label={title ? `Diagram: ${title}` : 'Mermaid diagram'}
      />
    </div>
  )
}
