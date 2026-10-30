import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  darkMode: boolean
  language: string
  viewMode: 'grid' | 'list'

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleDarkMode: () => void
  setDarkMode: (dark: boolean) => void
  setLanguage: (lang: string) => void
  toggleViewMode: () => void
  setViewMode: (mode: 'grid' | 'list') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  darkMode: false,
  language: 'en',
  viewMode: 'grid',

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.darkMode
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: newMode }
    }),
  setDarkMode: (dark) => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    set({ darkMode: dark })
  },
  setLanguage: (lang) => set({ language: lang }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' })),
  setViewMode: (mode) => set({ viewMode: mode }),
}))
