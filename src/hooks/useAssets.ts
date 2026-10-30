import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { DigitalAsset, Category } from '@/types'
import { debounce } from '@/lib/utils'
// Note: debounce is used via the useCallback pattern in consuming components

interface UseAssetsOptions {
  search?: string
  categoryId?: string
  fileType?: string
  sortBy?: 'title' | 'created_at' | 'download_count'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
  adminMode?: boolean  // show unpublished assets too
}

interface UseAssetsResult {
  assets: DigitalAsset[]
  categories: Category[]
  loading: boolean
  error: string | null
  totalCount: number
  totalPages: number
  refetch: () => void
}

export function useAssets(opts: UseAssetsOptions = {}): UseAssetsResult {
  const {
    search = '',
    categoryId = '',
    fileType = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 12,
    adminMode = false,
  } = opts

  const [assets, setAssets] = useState<DigitalAsset[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data as Category[]) ?? [])
  }, [])

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('digital_assets')
        .select('*, category:categories(*)', { count: 'exact' })

      if (!adminMode) {
        query = query.eq('is_published', true)
      }
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      if (fileType) {
        query = query.eq('file_type', fileType)
      }
      if (search) {
        query = query.or(
          `title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`
        )
      }

      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      query = query.range((page - 1) * pageSize, page * pageSize - 1)

      const { data, error: queryError, count } = await query
      if (queryError) throw queryError

      setAssets((data as DigitalAsset[]) ?? [])
      setTotalCount(count ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }, [search, categoryId, fileType, sortBy, sortOrder, page, pageSize, adminMode])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  return {
    assets,
    categories,
    loading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    refetch: fetchAssets,
  }
}

export function useAssetDetail(id: string | undefined) {
  const [asset, setAsset] = useState<DigitalAsset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('digital_assets')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setAsset(data as DigitalAsset)
        setLoading(false)
      })
  }, [id])

  return { asset, loading, error }
}
