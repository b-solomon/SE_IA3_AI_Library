import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, RotateCcw, Maximize2, Cpu, AlertCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useChat } from '@/hooks/useChat'
import { Button } from '@/components/ui/button'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

const SUGGESTED_PROMPTS = [
  'chatbot.suggested1',
  'chatbot.suggested2',
  'chatbot.suggested3',
  'chatbot.suggested4',
] as const

export function ChatWindow({ fullPage = false }: { fullPage?: boolean }) {
  const { t } = useTranslation()
  const { messages, isTyping, error, modelUsed, sendMessage, resetConversation, createConversation, loadConversations, currentConversation } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (!currentConversation) {
      createConversation()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || isTyping) return
    setInput('')
    await sendMessage(msg)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={cn(
      'flex flex-col rounded-xl border bg-background shadow-2xl overflow-hidden',
      fullPage ? 'h-full' : 'h-[560px]'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground">
        <div>
          <h3 className="text-sm font-semibold">{t('chatbot.title')}</h3>
          <p className="text-xs opacity-70">{t('chatbot.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1">
          {modelUsed && (
            <span className="flex items-center gap-1 text-xs opacity-70 mr-2">
              <Cpu className="h-3 w-3" />
              {modelUsed.split('/').pop()?.split('-').slice(0, 2).join('-') ?? modelUsed}
            </span>
          )}
          {!fullPage && (
            <Link to="/assistant">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary/80">
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary/80"
            onClick={resetConversation}
            title={t('chatbot.reset')}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !isTyping && (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="text-center py-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Library Intelligence Assistant</p>
              <p className="text-xs text-muted-foreground mt-1">Powered by Gemini Flash · Karunya University</p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((key) => (
                <button
                  key={key}
                  onClick={() => { setInput(t(key)); inputRef.current?.focus() }}
                  className="w-full text-left rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground hover:bg-primary/5 transition-colors"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p>{error}</p>
              <button
                onClick={() => sendMessage(messages.at(-2)?.content ?? '')}
                className="mt-1 text-xs underline"
              >
                {t('chatbot.retry')}
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chatbot.placeholder')}
            rows={1}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-h-24 overflow-y-auto"
            style={{ minHeight: '40px' }}
            disabled={isTyping}
            aria-label={t('chatbot.placeholder')}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label={t('chatbot.send')}
          >
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
