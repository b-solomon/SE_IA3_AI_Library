import { formatDateTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[80%] space-y-1', isUser && 'items-end')}>
        <div className={cn(
          'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-foreground'
        )}>
          {/* Render content preserving line breaks */}
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
          ))}
        </div>
        <p className={cn('text-xs text-muted-foreground px-1', isUser && 'text-right')}>
          {formatDateTime(message.created_at)}
          {message.model_used && !isUser && (
            <span className="ml-1 opacity-60">· {message.model_used.split('/').pop()?.split('-').slice(0,2).join('-')}</span>
          )}
        </p>
      </div>
    </div>
  )
}
