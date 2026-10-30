import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  BookOpen, Eye, EyeOff, Loader2, AlertCircle,
  CheckCircle2, GraduationCap, User, Mail, Lock, ArrowLeft
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { registrationSchema, type RegistrationFormData } from '@/lib/validators'
import { passwordStrength } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { MathCaptcha } from '@/components/ui/MathCaptcha'
import { cn } from '@/lib/utils'

export function RegisterPage() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const { signUp } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)
  const [success, setSuccess]           = useState(false)
  const [captchaOk, setCaptchaOk]       = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const strength = passwordStrength(passwordValue)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data: RegistrationFormData) => {
    if (!captchaOk) {
      setServerError('Please complete the human verification first.')
      return
    }
    setServerError(null)
    const { error } = await signUp(data.email, data.password, data.full_name)
    if (error) setServerError(error)
    else {
      setSuccess(true)
      setTimeout(() => navigate('/auth/login'), 3500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-sm w-full text-center space-y-5 animate-slide-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Account Created!</h2>
          <p className="text-sm text-muted-foreground">
            Check your email to verify your account. Redirecting to login…
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* ── Fixed floating Back to Home button ── */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 shadow-xl backdrop-blur-md transition-all group hover:border-amber-400/50"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
          <span>Back to Home Dashboard</span>
        </Link>
      </div>

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 mb-6">
            <GraduationCap className="h-10 w-10 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-center">Join the Library</h1>
          <p className="text-lg text-white/70 mt-2 text-center">Create your Karunya University account</p>

          {/* Steps */}
          <div className="mt-10 space-y-4 w-full max-w-xs">
            {[
              { icon: '1', label: 'Fill in your details' },
              { icon: '2', label: 'Verify you\'re human' },
              { icon: '3', label: 'Check your email' },
              { icon: '4', label: 'Start exploring!' },
            ].map((step) => (
              <div key={step.icon} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 font-bold text-sm ring-1 ring-amber-400/40">
                  {step.icon}
                </div>
                <p className="text-sm text-white/80">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-10 py-8 overflow-y-auto">
        {/* Back to Home Link */}
        <div className="w-full max-w-sm mb-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all group py-1.5 px-3 rounded-lg border border-border/60 hover:border-border bg-card/50 hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home Dashboard
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-5">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">AI Digital Library</p>
              <p className="text-xs text-muted-foreground">Karunya University</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('auth.registerTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.registerSubtitle')}</p>
          </div>

          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Full name */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">{t('auth.fullName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  {...register('full_name')}
                  aria-invalid={!!errors.full_name}
                  className={cn('pl-9', errors.full_name && 'border-destructive')}
                />
              </div>
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@karunya.edu"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                  className={cn('pl-9', errors.email && 'border-destructive')}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('password', {
                    onChange: (e) => setPasswordValue(e.target.value),
                  })}
                  aria-invalid={!!errors.password}
                  className={cn('pl-9 pr-10', errors.password && 'border-destructive')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {passwordValue && (
                <div className="space-y-1">
                  <Progress
                    value={(strength.score / 4) * 100}
                    className={cn('h-1.5 transition-all', {
                      '[&>div]:bg-red-500':    strength.score <= 1,
                      '[&>div]:bg-orange-500': strength.score === 2,
                      '[&>div]:bg-yellow-500': strength.score === 3,
                      '[&>div]:bg-green-500':  strength.score === 4,
                    })}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{t('auth.passwordStrength')}</p>
                    <p className={cn('text-xs font-medium', {
                      'text-red-500':    strength.score <= 1,
                      'text-orange-500': strength.score === 2,
                      'text-yellow-600': strength.score === 3,
                      'text-green-600':  strength.score === 4,
                    })}>
                      {strength.label}
                    </p>
                  </div>
                  {/* Requirements checklist */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                    {[
                      { ok: passwordValue.length >= 8,   label: '8+ characters' },
                      { ok: /[A-Z]/.test(passwordValue), label: 'Uppercase' },
                      { ok: /[a-z]/.test(passwordValue), label: 'Lowercase' },
                      { ok: /\d/.test(passwordValue),    label: 'Number' },
                    ].map((req) => (
                      <p key={req.label} className={cn('text-xs flex items-center gap-1', req.ok ? 'text-green-600' : 'text-muted-foreground')}>
                        <span>{req.ok ? '✓' : '○'}</span> {req.label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  className={cn('pl-9 pr-10', errors.confirmPassword && 'border-destructive')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            {/* Human verification */}
            <MathCaptcha onVerified={setCaptchaOk} />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !captchaOk}
            >
              {isSubmitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.creatingAccount')}</>
                : t('auth.signUp')
              }
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.haveAccount')}{' '}
            <Link to="/auth/login" className="font-semibold text-primary hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
