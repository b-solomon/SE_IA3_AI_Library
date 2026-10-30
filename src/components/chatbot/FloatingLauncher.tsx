import { Bot, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import { ChatWindow } from './ChatWindow'
import { useAuthStore } from '@/store/auth'

export function FloatingLauncher() {
  const { isOpen, toggleChat } = useChatStore()
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return null

  const unread = 0 // Extend with real unread tracking if needed

  return (
    <>
      {/* Chat window panel */}
      <div
        className={cn(
          'fixed bottom-20 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)] transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ height: '560px' }}
        aria-live="polite"
        aria-label="AI Chat assistant"
      >
        <ChatWindow />
      </div>

      {/* FAB */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isOpen
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-primary text-primary-foreground'
        )}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber text-navy text-xs font-bold">
            {unread}
          </span>
        )}
      </button>
    </>
  )
}
