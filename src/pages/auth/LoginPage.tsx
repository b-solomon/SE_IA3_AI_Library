import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle, GraduationCap, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { supabase } from '@/lib/supabase'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MathCaptcha } from '@/components/ui/MathCaptcha'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate   = useNavigate()
  const location   = useLocation()
  const { signIn } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)
  const [captchaOk, setCaptchaOk]       = useState(false)

  const from = (location.state as { from?: string })?.from

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    if (!captchaOk) {
      setServerError('Please complete the human verification first.')
      return
    }
    setServerError(null)
    const { error } = await signIn(data.email, data.password)
    if (error) {
      setServerError(error)
    } else {
      // Fetch the profile to determine role-based redirect
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        const role = (profile as { role?: string } | null)?.role
        if (from && from !== '/library') {
          navigate(from, { replace: true })
        } else if (role === 'admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/library', { replace: true })
        }
      } else {
        navigate('/library', { replace: true })
      }
    }
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

      {/* ── Fixed floating Language Switcher ── */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher variant="light" />
      </div>

      {/* ── Left branding panel ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur mb-6 ring-1 ring-white/20">
            <BookOpen className="h-10 w-10 text-amber-400" />
          </div>

          <h1 className="text-4xl font-bold text-center">AI Digital Library</h1>
          <p className="text-xl text-white/70 mt-2">Karunya University</p>

          {/* Student badge */}
          <div className="mt-8 rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/20 p-5 w-full max-w-xs text-center space-y-1">
            <div className="flex items-center justify-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Student Details</span>
            </div>
            <p className="font-semibold">BODDU SOLOMON</p>
            <p className="text-sm text-white/70">URK25CS1191</p>
            <p className="text-sm text-white/70">25CS312 · Software Engineering</p>
          </div>

          {/* Feature pills */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-xs">
            {['📚 Digital Library', '🤖 AI Assistant', '🔬 SE Lab', '🌐 4 Languages'].map((f) => (
              <span key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/20">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ───────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 sm:px-10 py-12 relative">
        {/* Back to Home Link */}
        <div className="w-full max-w-sm mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all group py-1.5 px-3 rounded-lg border border-border/60 hover:border-border bg-card/50 hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home Dashboard
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-7">

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

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('auth.loginTitle')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.loginSubtitle')}</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            <div className="space-y-1.5">
              <Label htmlFor="login-email">{t('auth.email')}</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="student@karunya.edu"
                {...register('email')}
                aria-invalid={!!errors.email}
                className={cn(errors.email && 'border-destructive')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">{t('auth.password')}</Label>
                <Link to="/auth/reset-password" className="text-xs text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  className={cn('pr-10', errors.password && 'border-destructive')}
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
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Human verification */}
            <MathCaptcha onVerified={setCaptchaOk} />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !captchaOk}
            >
              {isSubmitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('auth.signingIn')}</>
                : t('auth.signIn')
              }
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/auth/register" className="font-semibold text-primary hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
