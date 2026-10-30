import { useTranslation } from 'react-i18next'
import { Moon, Sun, Globe, LogOut, User, ChevronDown } from 'lucide-react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = DropdownMenuPrimitive.Content
const DropdownMenuItem = DropdownMenuPrimitive.Item
const DropdownMenuLabel = DropdownMenuPrimitive.Label
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்',   flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी',  flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు',  flag: '🇮🇳' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const { profile, signOut, isAdmin } = useAuthStore()
  const { darkMode, toggleDarkMode, setLanguage } = useUIStore()

  const handleSignOut = async () => {
    await signOut()
    toast.success(t('auth.logoutSuccess'))
  }

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    setLanguage(code)
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Student info banner */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground border-r pr-4">
        <span className="font-medium text-foreground">BODDU SOLOMON</span>
        <span>·</span>
        <span>URK25CS1191</span>
        <span>·</span>
        <span>25CS312</span>
      </div>

      <div className="flex-1" />

      {/* Dark mode toggle */}
      <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label={t('common.darkMode')}>
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Language picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-xs uppercase">
              {i18n.language?.slice(0, 2) || 'en'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            {t('common.language')}
          </DropdownMenuLabel>
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onSelect={() => handleLanguageChange(lang.code)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                i18n.language?.startsWith(lang.code) && 'font-medium'
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 h-9 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-xs font-medium leading-none">{profile?.full_name || 'User'}</span>
              <span className={`text-xs font-bold capitalize px-1.5 py-0.5 rounded-full mt-0.5 ${
                isAdmin
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {isAdmin ? '🛡 Admin' : '🎓 Student'}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuLabel className="px-2 py-1.5">
            <div className="text-sm font-medium">{profile?.full_name}</div>
            <div className={`text-xs font-semibold mt-0.5 ${isAdmin ? 'text-orange-400' : 'text-blue-400'}`}>
              {isAdmin ? '🛡 Administrator — Full Access' : '🎓 Student — Read Only'}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
            onSelect={() => {}}
          >
            <User className="h-4 w-4" />
            {t('nav.profile')}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10"
            onSelect={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
