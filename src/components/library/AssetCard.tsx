import { Link } from 'react-router-dom'
import { BookOpen, Download, Calendar, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { DigitalAsset } from '@/types'
import { cn } from '@/lib/utils'

interface AssetCardProps {
  asset: DigitalAsset
  viewMode: 'grid' | 'list'
  onDownload?: (asset: DigitalAsset) => void
  isAdmin?: boolean
}

const TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/epub+zip': 'EPUB',
}

const COVER_COLORS = [
  'from-blue-900 to-blue-700',
  'from-emerald-900 to-emerald-700',
  'from-violet-900 to-violet-700',
  'from-amber-900 to-amber-700',
  'from-rose-900 to-rose-700',
  'from-cyan-900 to-cyan-700',
]

function getCoverColor(id: string) {
  const idx = id.charCodeAt(0) % COVER_COLORS.length
  return COVER_COLORS[idx]
}

export function AssetCard({ asset, viewMode, onDownload, isAdmin }: AssetCardProps) {
  const typeLabel = TYPE_LABELS[asset.file_type ?? ''] ?? 'DOC'
  const coverGradient = getCoverColor(asset.id)

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow">
        {/* Thumbnail */}
        <div className={cn('h-14 w-10 shrink-0 rounded bg-gradient-to-b flex items-center justify-center text-white', coverGradient)}>
          {asset.cover_url
            ? <img src={asset.cover_url} alt="" className="h-full w-full object-cover rounded" />
            : <BookOpen className="h-4 w-4" />
          }
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <Link to={`/library/${asset.id}`} className="font-medium text-foreground hover:text-primary truncate block">
            {asset.title}
          </Link>
          <p className="text-sm text-muted-foreground truncate">{asset.author}</p>
        </div>

        {/* Category */}
        {asset.category && (
          <Badge variant="secondary" className="hidden sm:flex shrink-0">
            {asset.category.name}
          </Badge>
        )}

        {/* Type */}
        <Badge variant="outline" className="shrink-0">{typeLabel}</Badge>

        {/* Downloads */}
        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          <Download className="h-3 w-3" />
          {asset.download_count}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link to={`/library/${asset.id}`}>
            <Button size="xs" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
          </Link>
          {asset.file_path && (
            <Button size="xs" variant="outline" onClick={() => onDownload?.(asset)}>
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {asset.cover_url ? (
          <img
            src={asset.cover_url}
            alt={`Cover of ${asset.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className={cn('h-full w-full bg-gradient-to-b flex flex-col items-center justify-center text-white', coverGradient)}>
            <BookOpen className="h-12 w-12 opacity-60 mb-3" />
            <p className="text-xs font-medium opacity-80 px-3 text-center line-clamp-3">{asset.title}</p>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="text-xs">{typeLabel}</Badge>
          {!asset.is_published && isAdmin && <Badge variant="warning" className="text-xs">Draft</Badge>}
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <div>
          <Link to={`/library/${asset.id}`} className="font-semibold text-sm leading-tight hover:text-primary line-clamp-2">
            {asset.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{asset.author}</p>
        </div>

        {asset.category && (
          <Badge variant="outline" className="text-xs">{asset.category.name}</Badge>
        )}

        {asset.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="h-3 w-3" />
            {asset.download_count}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(asset.created_at)}
          </span>
        </div>

        {asset.file_path && (
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-1"
            onClick={() => onDownload?.(asset)}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
