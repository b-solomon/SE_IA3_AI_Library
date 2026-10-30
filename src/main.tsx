import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { router } from '@/router'
import { useAuthStore } from '@/store/auth'
import '@/i18n'  // initialise i18next
import '@/index.css'

/**
 * Bootstrap the Supabase auth session before rendering.
 * This prevents a flash of the login page for authenticated users.
 */
async function bootstrap() {
  await useAuthStore.getState().init()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </React.StrictMode>
  )
}

bootstrap()
