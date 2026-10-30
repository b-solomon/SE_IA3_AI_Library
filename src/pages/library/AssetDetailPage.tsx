import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Download, ArrowLeft, Sparkles, Loader2, User, Hash, AlertCircle, HardDrive, Tag } from 'lucide-react'
import { BookOpen, Calendar } from 'lucide-react'
import { useAssetDetail } from '@/hooks/useAssets'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { formatDate, formatFileSize } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { isAdmin, session } = useAuthStore()
  const { asset, loading, error } = useAssetDetail(id)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [summarizing, setSummarizing] = useState(false)

  const handleDownload = async () => {
    if (!asset?.file_path) return
    try {
      // If direct open-access URL or local book, open directly for the student
      if (asset.file_path.startsWith('http://') || asset.file_path.startsWith('https://') || asset.file_path.startsWith('/books/')) {
        try { await supabase.rpc('increment_download_count', { asset_id: asset.id }) } catch {}
        const a = document.createElement('a')
        a.href = asset.file_path
        a.download = `${asset.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success(`Opening free download for "${asset.title}"`)
        return
      }

      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(asset.file_path, 3600)
      if (error) throw error
      await supabase.rpc('increment_download_count', { asset_id: asset.id })
      window.open(data.signedUrl, '_blank')
      toast.success(`Downloading "${asset.title}"`)
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const handleAiSummary = async () => {
    if (!asset || !session) return
    setSummarizing(true)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const response = await fetch(`${supabaseUrl}/functions/v1/ai-summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ assetId: asset.id }),
      })
      if (!response.ok) throw new Error('Summarization failed')
      const data = await response.json()
      setAiSummary(data.summary)
    } catch (err) {
      toast.error('AI summary failed. Please try again.')
    } finally {
      setSummarizing(false)
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <Skeleton className="aspect-[3/4] rounded-xl" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
        </div>
      </div>
    </div>
  )

  if (error || !asset) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-16 w-16 text-destructive/50 mb-4" />
      <h3 className="text-lg font-semibold">Document not found</h3>
      <p className="text-sm text-muted-foreground mt-1">{error}</p>
      <Link to="/library" className="mt-4">
        <Button variant="outline"><ArrowLeft className="h-4 w-4" /> Back to Library</Button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={asset.title}
        breadcrumbs={[
          { label: 'Library', to: '/library' },
          { label: asset.title },
        ]}
        actions={
          <Link to="/library"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button></Link>
        }
      />

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Cover */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-xl border shadow-lg">
            {asset.cover_url ? (
              <img src={asset.cover_url} alt={`Cover of ${asset.title}`} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-b from-slate-800 to-slate-600 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white/60" />
              </div>
            )}
          </div>

          {asset.file_path && (
            <Button className="w-full" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              {t('library.download')}
            </Button>
          )}

          {isAdmin && (
            <Button variant="outline" className="w-full" onClick={handleAiSummary} disabled={summarizing}>
              {summarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {summarizing ? t('library.summarizing') : t('library.generateSummary')}
            </Button>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{asset.title}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
              <User className="h-4 w-4" /> {asset.author}
            </p>
          </div>

          {/* Metadata grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {asset.category && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('library.category')}</p>
                <Badge variant="secondary">{asset.category.name}</Badge>
              </div>
            )}
            {asset.isbn && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('library.isbn')}</p>
                <p className="text-sm flex items-center gap-1"><Hash className="h-3.5 w-3.5" />{asset.isbn}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('library.fileType')}</p>
              <Badge variant="outline">
                {asset.file_type === 'application/pdf' ? 'PDF' : 'EPUB'}
              </Badge>
            </div>
            {asset.file_size && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('library.fileSize')}</p>
                <p className="text-sm flex items-center gap-1"><HardDrive className="h-3.5 w-3.5" />{formatFileSize(asset.file_size)}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Added</p>
              <p className="text-sm flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(asset.created_at)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{t('library.downloads')}</p>
              <p className="text-sm flex items-center gap-1"><Download className="h-3.5 w-3.5" />{asset.download_count}</p>
            </div>
          </div>

          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" /> {t('library.tags')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {asset.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('library.description')}</p>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{asset.description}</p>
            </div>
          )}

          {/* AI Summary */}
          {aiSummary && (
            <Card className="border-amber/30 bg-amber/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber" />
                  {t('library.aiSummary')}
                  <Badge variant="outline" className="text-xs ml-auto">AI Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{aiSummary}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  ℹ️ This summary was generated from document metadata and content using AI. Verify with the full document.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
