import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen, Bot, LayoutDashboard, Upload, Users,
  FolderOpen, ChevronLeft, ChevronRight, Settings2, GitBranch,
  TestTube2, Shield, BarChart3, BookMarked, GraduationCap,
  ClipboardList, Cpu, CheckSquare, FileCode2, Activity,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { Button } from '@/components/ui/button'

interface NavItem {
  label: string
  icon: React.ReactNode
  to: string
  adminOnly?: boolean
  badge?: string
}

export function Sidebar() {
  const { t } = useTranslation()
  const { isAdmin } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const location = useLocation()
  const [seLabOpen, setSeLabOpen] = useState(
    location.pathname.startsWith('/se-lab')
  )
  const [adminOpen, setAdminOpen] = useState(
    location.pathname.startsWith('/admin')
  )

  const mainNav: NavItem[] = [
    { label: t('nav.library'), icon: <BookOpen className="h-4 w-4" />, to: '/library' },
    { label: t('nav.assistant'), icon: <Bot className="h-4 w-4" />, to: '/assistant' },
  ]

  const adminNav: NavItem[] = [
    { label: t('nav.dashboard'), icon: <LayoutDashboard className="h-4 w-4" />, to: '/admin' },
    { label: t('nav.assets'), icon: <FolderOpen className="h-4 w-4" />, to: '/admin/assets' },
    { label: t('nav.users'), icon: <Users className="h-4 w-4" />, to: '/admin/users' },
    { label: t('nav.categories'), icon: <BookMarked className="h-4 w-4" />, to: '/admin/categories' },
    { label: t('nav.upload'), icon: <Upload className="h-4 w-4" />, to: '/library/upload' },
  ]

  const seLabNav: NavItem[] = [
    { label: t('nav.processModel'), icon: <Activity className="h-4 w-4" />, to: '/se-lab/process-model' },
    { label: t('nav.requirements'), icon: <ClipboardList className="h-4 w-4" />, to: '/se-lab/requirements' },
    { label: t('nav.architecture'), icon: <Cpu className="h-4 w-4" />, to: '/se-lab/architecture' },
    { label: t('nav.umlDiagrams'), icon: <GitBranch className="h-4 w-4" />, to: '/se-lab/uml-diagrams' },
    { label: t('nav.blackBox'), icon: <CheckSquare className="h-4 w-4" />, to: '/se-lab/black-box' },
    { label: t('nav.whiteBox'), icon: <FileCode2 className="h-4 w-4" />, to: '/se-lab/white-box' },
    { label: t('nav.testExecution'), icon: <TestTube2 className="h-4 w-4" />, to: '/se-lab/test-execution' },
    { label: t('nav.quality'), icon: <Shield className="h-4 w-4" />, to: '/se-lab/quality' },
    { label: t('nav.configMgmt'), icon: <Settings2 className="h-4 w-4" />, to: '/se-lab/config-mgmt' },
    { label: t('nav.estimation'), icon: <BarChart3 className="h-4 w-4" />, to: '/se-lab/estimation' },
    { label: t('nav.syllabus'), icon: <BookMarked className="h-4 w-4" />, to: '/se-lab/syllabus' },
    { label: t('nav.viva'), icon: <GraduationCap className="h-4 w-4" />, to: '/se-lab/viva' },
  ]

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300 relative',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-4 border-b',
        sidebarCollapsed && 'justify-center px-2'
      )}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookOpen className="h-4 w-4" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">AI Digital Library</p>
            <p className="truncate text-xs text-muted-foreground">Karunya University</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">

        {/* Main nav */}
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="pt-3 pb-1">
              {!sidebarCollapsed ? (
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  <span>Admin</span>
                  <ChevronDown className={cn('h-3 w-3 transition-transform', adminOpen && 'rotate-180')} />
                </button>
              ) : (
                <hr className="border-border mx-1" />
              )}
            </div>
            {(adminOpen || sidebarCollapsed) && adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}

        {/* SE Lab section */}
        <div className="pt-3 pb-1">
          {!sidebarCollapsed ? (
            <button
              onClick={() => setSeLabOpen(!seLabOpen)}
              className="flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              <span>SE Lab</span>
              <ChevronDown className={cn('h-3 w-3 transition-transform', seLabOpen && 'rotate-180')} />
            </button>
          ) : (
            <hr className="border-border mx-1" />
          )}
        </div>
        {(seLabOpen || sidebarCollapsed) && seLabNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            {item.icon}
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />
          }
        </Button>
      </div>
    </aside>
  )
}
