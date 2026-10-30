import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'
import { useUIStore } from '@/store/ui'

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
]

interface LanguageSwitcherProps {
  className?: string
  variant?: 'dark' | 'light' | 'auto'
}

export function LanguageSwitcher({ className = '', variant = 'auto' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const { setLanguage } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find(l => l.code === (i18n.language?.slice(0, 2) || 'en')) || LANGUAGES[0]

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    setLanguage(code)
    try {
      localStorage.setItem('i18nextLng', code)
    } catch {}
    setIsOpen(false)
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isDark = variant === 'dark' || variant === 'auto'

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language settings"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
          isDark
            ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border-white/10'
            : 'bg-background hover:bg-accent text-foreground border-border'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline font-mono uppercase text-[11px]">{currentLang.code}</span>
        <span className="sm:hidden font-mono uppercase text-[11px]">{currentLang.code}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl border border-white/15 bg-[#0e0e1a]/95 text-white shadow-2xl backdrop-blur-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10 mb-1">
            Language Settings (4 Languages)
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-violet-600/30 text-cyan-300 font-bold border border-violet-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold leading-none">{lang.native}</p>
                    <p className="text-[10px] text-white/40">{lang.label}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
