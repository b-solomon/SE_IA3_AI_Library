import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, Grid3X3, List, ChevronLeft, ChevronRight, Upload, BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { useAssets } from '@/hooks/useAssets'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { supabase } from '@/lib/supabase'
import { debounce } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { AssetCard } from '@/components/library/AssetCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { DigitalAsset } from '@/types'
import { toast } from 'sonner'

export function LibraryPage() {
  const { t } = useTranslation()
  const { isAdmin } = useAuthStore()
  const { viewMode, setViewMode } = useUIStore()

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [fileType, setFileType] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'download_count'>('created_at')
  const [page, setPage] = useState(1)

  const { assets, categories, loading, error, totalCount, totalPages, refetch } = useAssets({
    search,
    categoryId,
    fileType,
    sortBy,
    sortOrder: sortBy === 'title' ? 'asc' : 'desc',
    page,
    pageSize: 12,
  })

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((val: string) => { setSearch(val); setPage(1) }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleDownload = async (asset: DigitalAsset) => {
    if (!asset.file_path) return
    try {
      if (asset.file_path.startsWith('http://') || asset.file_path.startsWith('https://') || asset.file_path.startsWith('/books/')) {
        try { await supabase.rpc('increment_download_count', { asset_id: asset.id }) } catch {}
        const a = document.createElement('a')
        a.href = asset.file_path
        a.download = `${asset.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success(`Downloading "${asset.title}"`)
        refetch()
        return
      }

      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(asset.file_path, 3600)
      if (error) throw error

      // Increment download count via RPC
      await supabase.rpc('increment_download_count', { asset_id: asset.id })

      window.open(data.signedUrl, '_blank')
      toast.success(`Downloading "${asset.title}"`)
      refetch()
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('library.title')}
        description={`${totalCount} document${totalCount !== 1 ? 's' : ''} available`}
        breadcrumbs={[{ label: 'Library' }]}
        actions={
          isAdmin ? (
            <Link to="/library/upload">
              <Button>
                <Upload className="h-4 w-4" />
                {t('upload.title')}
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={t('library.search')}
            className="pl-9"
            aria-label="Search documents"
          />
        </div>

        {/* Category filter */}
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-44" aria-label={t('library.filterByCategory')}>
            <SelectValue placeholder={t('library.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('library.allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type filter */}
        <Select value={fileType} onValueChange={(v) => { setFileType(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-36" aria-label={t('library.filterByType')}>
            <SelectValue placeholder={t('library.allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('library.allTypes')}</SelectItem>
            <SelectItem value="application/pdf">PDF</SelectItem>
            <SelectItem value="application/epub+zip">EPUB</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v as typeof sortBy); setPage(1) }}>
          <SelectTrigger className="w-44" aria-label={t('library.sortBy')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">{t('library.sortDate')}</SelectItem>
            <SelectItem value="title">{t('library.sortTitle')}</SelectItem>
            <SelectItem value="download_count">{t('library.sortDownloads')}</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            aria-label={t('library.gridView')}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            aria-label={t('library.listView')}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Failed to load documents</p>
            <p className="text-xs text-destructive/70">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
          : 'space-y-3'
        }>
          {Array.from({ length: 12 }).map((_, i) => (
            viewMode === 'grid'
              ? <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              : <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && assets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">{t('library.noResults')}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t('library.noResultsDesc')}</p>
          {isAdmin && (
            <Link to="/library/upload" className="mt-4">
              <Button><Upload className="h-4 w-4" /> Upload First Document</Button>
            </Link>
          )}
        </div>
      )}

      {/* Asset grid/list */}
      {!loading && assets.length > 0 && (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
          : 'space-y-3'
        }>
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              viewMode={viewMode}
              onDownload={handleDownload}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {totalCount} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <Button
                  key={pg}
                  variant={pg === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pg)}
                  aria-current={pg === page ? 'page' : undefined}
                >
                  {pg}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
