import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen, Users, FolderOpen, Download,
  Upload, Settings, Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashStats {
  totalAssets: number
  publishedAssets: number
  totalCategories: number
  totalUsers: number
  totalDownloads: number
  recentAssets: Array<{ id: string; title: string; author: string; created_at: string; is_published: boolean }>
}

export function AdminDashboard() {
  const { t } = useTranslation()
  const { profile } = useAuthStore()
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [assets, categories, users, recentAssets] = await Promise.all([
        supabase.from('digital_assets').select('id, download_count, is_published'),
        supabase.from('categories').select('id'),
        supabase.from('profiles').select('id'),
        supabase.from('digital_assets')
          .select('id, title, author, created_at, is_published')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const assetsData = assets.data ?? []
      const totalDownloads = assetsData.reduce((sum, a) => sum + (a.download_count ?? 0), 0)

      setStats({
        totalAssets: assetsData.length,
        publishedAssets: assetsData.filter((a) => a.is_published).length,
        totalCategories: categories.data?.length ?? 0,
        totalUsers: users.data?.length ?? 0,
        totalDownloads,
        recentAssets: (recentAssets.data ?? []) as DashStats['recentAssets'],
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: t('admin.totalAssets'),
      value: stats?.totalAssets ?? 0,
      sub: `${stats?.publishedAssets ?? 0} published`,
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: t('admin.totalCategories'),
      value: stats?.totalCategories ?? 0,
      icon: <FolderOpen className="h-5 w-5" />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: t('admin.totalUsers'),
      value: stats?.totalUsers ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      title: t('admin.totalDownloads'),
      value: stats?.totalDownloads ?? 0,
      icon: <Download className="h-5 w-5" />,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('admin.dashboard')}
        description={`Welcome back, ${profile?.full_name}. Here's an overview of the library.`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
        actions={
          <Link to="/library/upload">
            <Button><Plus className="h-4 w-4" /> Add Document</Button>
          </Link>
        }
      />

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-1">{card.value.toLocaleString()}</p>
                    {card.sub && <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>}
                  </div>
                  <div className={`rounded-lg p-2.5 ${card.color}`}>
                    {card.icon}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/library/upload">
          <Card className="hover:shadow-md cursor-pointer border-dashed">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Upload Document</p>
                <p className="text-xs text-muted-foreground">Add PDF or EPUB</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/categories">
          <Card className="hover:shadow-md cursor-pointer border-dashed">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Settings className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Manage Categories</p>
                <p className="text-xs text-muted-foreground">Organise documents</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/users">
          <Card className="hover:shadow-md cursor-pointer border-dashed">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Manage Users</p>
                <p className="text-xs text-muted-foreground">Roles & access</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('admin.recentUploads')}
            <Link to="/admin/assets">
              <Button variant="ghost" size="sm">View all →</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : stats?.recentAssets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded yet</p>
          ) : (
            <div className="divide-y">
              {stats?.recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <Link to={`/library/${asset.id}`} className="text-sm font-medium hover:text-primary truncate block">
                      {asset.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{asset.author} · {formatDate(asset.created_at)}</p>
                  </div>
                  <Badge variant={asset.is_published ? 'success' : 'secondary'} className="ml-3 shrink-0">
                    {asset.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
