import { Bot } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TypingIndicator() {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2.5" aria-live="polite" aria-label={t('chatbot.typing')}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
        </div>
        <span className="sr-only">{t('chatbot.typing')}</span>
      </div>
    </div>
  )
}
