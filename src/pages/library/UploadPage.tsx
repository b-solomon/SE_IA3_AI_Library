import { useState, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, X, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { useAssets } from '@/hooks/useAssets'
import { assetUploadSchema, type AssetUploadFormData } from '@/lib/validators'
import { formatFileSize, validateFile } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function UploadPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, session } = useAuthStore()
  const { categories } = useAssets()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [classifying, setClassifying] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<AssetUploadFormData>({
    resolver: zodResolver(assetUploadSchema),
    defaultValues: { is_published: false, tags: [] },
  })

  const handleFile = (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      setFileError(validation.error ?? 'Invalid file')
      setSelectedFile(null)
      return
    }
    setFileError(null)
    setSelectedFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t) && tags.length < 10) {
      const newTags = [...tags, t]
      setTags(newTags)
      setValue('tags', newTags)
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    setValue('tags', newTags)
  }

  const handleAiClassify = async () => {
    if (!session) return
    const title = (document.getElementById('asset-title') as HTMLInputElement)?.value
    const description = (document.getElementById('asset-desc') as HTMLTextAreaElement)?.value
    if (!title) { toast.error('Enter a title first to use AI classification'); return }

    setClassifying(true)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const res = await fetch(`${supabaseUrl}/functions/v1/ai-classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ title, description }),
      })
      if (!res.ok) throw new Error('Classification failed')
      const data = await res.json()
      if (data.categoryName && categories.length) {
        const match = categories.find((c) => c.name.toLowerCase() === data.categoryName?.toLowerCase())
        if (match) setValue('category_id', match.id)
      }
      if (data.tags?.length) {
        const newTags = [...new Set([...tags, ...data.tags.slice(0, 8)])]
        setTags(newTags)
        setValue('tags', newTags)
      }
      toast.success('AI classification applied')
    } catch {
      toast.error('AI classification failed')
    } finally {
      setClassifying(false)
    }
  }

  const onSubmit = async (data: AssetUploadFormData) => {
    if (!selectedFile || !user) { toast.error('Please select a file'); return }

    setUploading(true)
    setUploadProgress(10)
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`

      setUploadProgress(30)
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (storageError) throw storageError
      setUploadProgress(60)

      // 2. Insert metadata record
      const { error: dbError } = await supabase.from('digital_assets').insert({
        title: data.title,
        author: data.author,
        isbn: data.isbn || null,
        description: data.description || null,
        category_id: data.category_id,
        file_path: filePath,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        tags: data.tags ?? [],
        is_published: data.is_published,
        uploaded_by: user.id,
      })

      if (dbError) throw dbError
      setUploadProgress(100)

      toast.success(t('upload.uploadSuccess'))
      setTimeout(() => navigate('/library'), 1000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('upload.uploadError'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('upload.title')}
        description={t('upload.subtitle')}
        breadcrumbs={[
          { label: 'Library', to: '/library' },
          { label: t('upload.title') },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Left — metadata */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="asset-title">Title *</Label>
            <Input id="asset-title" placeholder="Document title" {...register('title')} className={cn(errors.title && 'border-destructive')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asset-author">Author *</Label>
            <Input id="asset-author" placeholder="Author name" {...register('author')} className={cn(errors.author && 'border-destructive')} />
            {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="asset-isbn">ISBN</Label>
              <Input id="asset-isbn" placeholder="978-x-xxx-xxxxx-x" {...register('isbn')} />
            </div>

            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn(errors.category_id && 'border-destructive')}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asset-desc">Description</Label>
            <Textarea
              id="asset-desc"
              rows={4}
              placeholder="Brief description of the document..."
              {...register('description')}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Add tag, press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* AI Classify */}
          <Button type="button" variant="outline" onClick={handleAiClassify} disabled={classifying} className="gap-2">
            {classifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber" />}
            {classifying ? t('upload.classifying') : t('upload.aiClassify')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('upload.classifyHint')}</p>

          {/* Publish toggle */}
          <div className="flex items-center gap-3 p-4 rounded-lg border">
            <Controller
              name="is_published"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="is_published"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-input"
                />
              )}
            />
            <div>
              <Label htmlFor="is_published" className="cursor-pointer">Publish immediately</Label>
              <p className="text-xs text-muted-foreground">Visible to all students. Uncheck to save as draft.</p>
            </div>
          </div>
        </div>

        {/* Right — file upload */}
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Upload file"
            className={cn(
              'rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-muted/50',
              fileError && 'border-destructive'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.epub"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                <Badge variant="success">{t('upload.fileSelected')}</Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{t('upload.dropZone')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('upload.dropZoneHint')}</p>
                </div>
              </div>
            )}
          </div>

          {fileError && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {fileError}
            </p>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-1.5">
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground text-center">{t('upload.uploading')} {uploadProgress}%</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedFile || isSubmitting || uploading}
          >
            {isSubmitting || uploading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('upload.saving')}</>
              : <><CheckCircle2 className="h-4 w-4" /> {t('upload.save')}</>
            }
          </Button>
        </div>
      </form>
    </div>
  )
}
