import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { categorySchema, type CategoryFormData } from '@/lib/validators'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/types'
import { toast } from 'sonner'

export function CategoryManagement() {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema) })

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  const openAdd = () => { setEditing(null); reset({}); setDialogOpen(true) }
  const openEdit = (cat: Category) => {
    setEditing(cat)
    reset({ name: cat.name, description: cat.description ?? '', icon: cat.icon ?? '' })
    setDialogOpen(true)
  }

  const onSubmit = async (data: CategoryFormData) => {
    if (editing) {
      const { error } = await supabase
        .from('categories')
        .update({ name: data.name, description: data.description, icon: data.icon })
        .eq('id', editing.id)
      if (error) toast.error(error.message)
      else { toast.success('Category updated'); setDialogOpen(false); loadCategories() }
    } else {
      const { error } = await supabase.from('categories').insert({
        name: data.name,
        description: data.description,
        icon: data.icon,
        created_by: profile?.id,
      })
      if (error) toast.error(error.message)
      else { toast.success('Category created'); setDialogOpen(false); loadCategories() }
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Category deleted'); loadCategories() }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.categoryManagement')}
        description={`${categories.length} categories`}
        breadcrumbs={[{ label: 'Admin', to: '/admin' }, { label: 'Categories' }]}
        actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> {t('admin.addCategory')}</Button>}
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4 p-4">
                  <span className="text-2xl">{cat.icon ?? '📁'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cat.name}</p>
                    {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                  </div>
                  <Button size="xs" variant="ghost" onClick={() => openEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                  >
                    {deletingId === cat.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('admin.editCategory') : t('admin.addCategory')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input placeholder="Category name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea placeholder="Brief description" rows={3} {...register('description')} />
            </div>
            <div className="space-y-1.5">
              <Label>Icon (emoji)</Label>
              <Input placeholder="📚" {...register('icon')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
