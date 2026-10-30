import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, ShieldCheck, ShieldX, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { Profile } from '@/types'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

export function UserManagement() {
  const { t } = useTranslation()
  const { profile: currentProfile } = useAuthStore()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setUsers((data as Profile[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleRole = async (user: Profile) => {
    if (user.id === currentProfile?.id) {
      toast.error("You cannot change your own role.")
      return
    }
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    setUpdating(user.id)
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    if (error) {
      toast.error('Failed to update role')
    } else {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u))
      toast.success(`${user.full_name} is now a ${newRole}`)
    }
    setUpdating(null)
  }

  const filtered = users.filter((u) =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.id.includes(search)
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.userManagement')}
        description={`${users.length} users registered`}
        breadcrumbs={[{ label: 'Admin', to: '/admin' }, { label: 'Users' }]}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name…"
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> All Users</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <div className="divide-y">
              {filtered.map((user) => (
                <div key={user.id} className="flex items-center gap-4 py-3">
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {user.full_name?.slice(0, 2).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{t('admin.userJoined')}: {formatDate(user.created_at)}</p>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                  {user.id !== currentProfile?.id && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => toggleRole(user)}
                      disabled={updating === user.id}
                      className="shrink-0"
                    >
                      {user.role === 'admin'
                        ? <><ShieldX className="h-3.5 w-3.5" /> Demote</>
                        : <><ShieldCheck className="h-3.5 w-3.5" /> Promote</>
                      }
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
