import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface MathCaptchaProps {
  onVerified: (verified: boolean) => void
  className?: string
}

interface CaptchaChallenge {
  question: string
  answer: number
  display: string   // visual representation with emoji operators
}

const OPERATORS = [
  { symbol: '+', emoji: '➕', fn: (a: number, b: number) => a + b },
  { symbol: '-', emoji: '➖', fn: (a: number, b: number) => a - b },
  { symbol: '×', emoji: '✖️', fn: (a: number, b: number) => a * b },
]

function generateChallenge(): CaptchaChallenge {
  const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)]
  let a = Math.floor(Math.random() * 9) + 1  // 1–9
  let b = Math.floor(Math.random() * 9) + 1  // 1–9

  // For subtraction, ensure positive result
  if (op.symbol === '-') {
    if (a < b) [a, b] = [b, a]
  }
  // For multiplication, keep small so it's answerable
  if (op.symbol === '×') {
    a = Math.floor(Math.random() * 5) + 1   // 1–5
    b = Math.floor(Math.random() * 5) + 1   // 1–5
  }

  const answer = op.fn(a, b)
  const question = `${a} ${op.symbol} ${b} = ?`
  const display  = `${a} ${op.emoji} ${b} = ?`
  return { question, answer, display }
}

export function MathCaptcha({ onVerified, className }: MathCaptchaProps) {
  const { t } = useTranslation()
  const [challenge, setChallenge] = useState<CaptchaChallenge>(generateChallenge)
  const [input, setInput]         = useState('')
  const [status, setStatus]       = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [attempts, setAttempts]   = useState(0)

  const refresh = useCallback(() => {
    setChallenge(generateChallenge())
    setInput('')
    setStatus('idle')
    onVerified(false)
  }, [onVerified])

  // Reset after too many wrong attempts
  useEffect(() => {
    if (attempts >= 3) {
      const t = setTimeout(refresh, 800)
      return () => clearTimeout(t)
    }
  }, [attempts, refresh])

  const handleCheck = () => {
    const userAnswer = parseInt(input.trim(), 10)
    if (isNaN(userAnswer)) return

    if (userAnswer === challenge.answer) {
      setStatus('correct')
      onVerified(true)
    } else {
      setStatus('wrong')
      setAttempts((a) => a + 1)
      onVerified(false)
      setInput('')
      setTimeout(() => setStatus('idle'), 1200)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck()
  }

  return (
    <div className={cn('rounded-xl border bg-muted/40 p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t('auth.verifyHuman')}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={refresh}
          aria-label={t('auth.captchaRefresh')}
          title={t('auth.captchaRefresh')}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>

      {/* Challenge display */}
      <div className="flex items-center justify-center rounded-lg bg-primary/5 border border-primary/20 py-3">
        <span className="text-2xl font-bold tracking-widest text-foreground select-none">
          {challenge.display}
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          value={input}
          onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
          onKeyDown={handleKeyDown}
          placeholder={t('auth.captchaPlaceholder')}
          className={cn(
            'text-center font-mono text-lg',
            status === 'correct' && 'border-green-500 bg-green-50',
            status === 'wrong'   && 'border-red-500   bg-red-50 animate-shake'
          )}
          aria-label="CAPTCHA answer"
          disabled={status === 'correct'}
        />
        <Button
          type="button"
          variant={status === 'correct' ? 'default' : 'outline'}
          onClick={handleCheck}
          disabled={!input || status === 'correct'}
          className={cn(
            'shrink-0 transition-all',
            status === 'correct' && 'bg-green-600 hover:bg-green-600 text-white'
          )}
        >
          {status === 'correct' ? '✓' : '→'}
        </Button>
      </div>

      {/* Status feedback */}
      {status === 'correct' && (
        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified!
        </p>
      )}
      {status === 'wrong' && (
        <p className="text-xs text-red-500">{t('auth.captchaError')}</p>
      )}
    </div>
  )
}
