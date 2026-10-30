import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  BookOpen, Brain, FlaskConical, Shield, BarChart3,
  ChevronRight, GraduationCap, Layers, TestTube2,
  Settings, TrendingUp, CheckCircle2, ArrowRight,
  Library, Bot, FileText, Users, Award, Star,
  Code2, Database, GitBranch, Zap, Globe, Lock,
  Sparkles, Cpu, Network
} from 'lucide-react';

const courseOutcomes = [
  {
    id: 'CO1', title: 'Process Model Selection',
    outcome: 'Choose relevant software process model in software development.',
    coverage: 'Agile + Incremental model with sprint timeline, full justification and side-by-side comparison against Waterfall, Evolutionary and UP.',
    icon: Settings, lu: 'LU I',
    gradient: 'from-violet-600 to-purple-700',
    border: 'hover:border-violet-500/40',
    glow: 'hover:shadow-violet-500/10',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  },
  {
    id: 'CO2', title: 'UML Design',
    outcome: 'Build efficient software designs using various UML diagrams.',
    coverage: '10 Mermaid diagrams: class, sequence, activity, component, deployment, architecture — all match actual implementation.',
    icon: Layers, lu: 'LU II',
    gradient: 'from-cyan-500 to-blue-600',
    border: 'hover:border-cyan-500/40',
    glow: 'hover:shadow-cyan-500/10',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  },
  {
    id: 'CO3', title: 'Testing Strategies',
    outcome: 'Build relevant testing strategies for verification and validation.',
    coverage: 'Interactive black-box (12 cases) and white-box (CFG + V8 coverage) visualizers wired to Vitest and Supabase test_results.',
    icon: TestTube2, lu: 'LU III',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'hover:border-emerald-500/40',
    glow: 'hover:shadow-emerald-500/10',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'CO4', title: 'Quality Assurance',
    outcome: 'Use quality assurance practices for robust software development.',
    coverage: 'Live SQA dashboard — TPR, DRE, SMI from real DB. Git SCM workflow, RLS policies, defect lifecycle tracking.',
    icon: Shield, lu: 'LU IV',
    gradient: 'from-amber-500 to-orange-600',
    border: 'hover:border-amber-500/40',
    glow: 'hover:shadow-amber-500/10',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  },
  {
    id: 'CO5', title: 'Project Estimation',
    outcome: 'Evaluate software quality using relevant project estimation technique.',
    coverage: 'COCOMO II with stated assumptions, WBS, Gantt chart, risk register and planned vs actual progress.',
    icon: TrendingUp, lu: 'LU V',
    gradient: 'from-rose-500 to-pink-600',
    border: 'hover:border-rose-500/40',
    glow: 'hover:shadow-rose-500/10',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
  },
];

const learningUnits = [
  {
    id: 'LU I', emoji: '🔄', title: 'Software Process Models',
    topics: ['Waterfall, Incremental & Evolutionary models', 'Concurrent models & Unified Process', 'Agile process models & Agile teams', 'Requirements monitoring & validation'],
    project: 'Process Model Explorer — Agile+Incremental with sprint timeline and model comparison.',
    color: 'from-violet-600/20 to-transparent', dot: 'bg-violet-400', badge: 'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  },
  {
    id: 'LU II', emoji: '🏗️', title: 'Software Design',
    topics: ['Abstraction, architecture, design patterns', 'Information hiding & functional independence', 'OO design, dependency inversion, cohesion/coupling', 'UML diagrams & UI design'],
    project: 'Architecture page + 10 UML diagrams + layered React + Zustand + Supabase architecture.',
    color: 'from-cyan-600/20 to-transparent', dot: 'bg-cyan-400', badge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  },
  {
    id: 'LU III', emoji: '🧪', title: 'Software Testing',
    topics: ['White-box testing & unit testing', 'Black-box testing & integration testing', 'UI, navigation, security & performance testing', 'Selenium-style web application testing'],
    project: 'Black-Box Visualizer + White-Box CFG + Vitest suite + Supabase test_results storage.',
    color: 'from-emerald-600/20 to-transparent', dot: 'bg-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  },
  {
    id: 'LU IV', emoji: '🔒', title: 'SQA & Configuration Management',
    topics: ['Statistical SQA & formal approaches', 'Six Sigma, ISO 9000', 'SCM repository & SCM process', 'Software measurement & quality metrics'],
    project: 'Quality metrics dashboard (TPR/DRE/SMI) + Git branching strategy + Supabase RLS audit.',
    color: 'from-amber-600/20 to-transparent', dot: 'bg-amber-400', badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  },
  {
    id: 'LU V', emoji: '📊', title: 'Project Estimation & Improvement',
    topics: ['COCOMO II for object-oriented projects', 'Empirical estimation models', 'Timeline charts & schedule tracking', 'CMMI model & process improvement'],
    project: 'COCOMO II + Gantt chart + WBS + risk register + retrospective findings.',
    color: 'from-rose-600/20 to-transparent', dot: 'bg-rose-400', badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
  },
];

const features = [
  { icon: Library, title: 'Digital Library', desc: 'Browse, search, and download PDF/EPUB with grid/list toggle, debounced search, and advanced filters.', color: 'from-violet-600 to-purple-700', glow: 'shadow-violet-500/20' },
  { icon: Bot, title: 'AI Chatbot', desc: 'Gemini Flash → OpenRouter → NVIDIA NIM fallback chain. Streaming responses. History in Supabase.', color: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/20' },
  { icon: FlaskConical, title: 'SE Lab — 12 Modules', desc: 'All 5 LUs covered: process models, UML diagrams, testing visualizers, SQA metrics, estimation.', color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
  { icon: Database, title: 'Supabase Backend', desc: '9-table PostgreSQL schema. RLS on every table. Storage buckets. 3 Edge Functions.', color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
  { icon: Code2, title: 'Vitest Testing', desc: '18+ automated tests. V8 coverage. Results saved to Supabase test_results table live.', color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/20' },
  { icon: Lock, title: 'Security-first', desc: 'AI keys in Edge Functions only. RLS enforced. CORS policy. WCAG AA. JWT auth everywhere.', color: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/20' },
];

const seModules = [
  { num: '01', title: 'Process Model Explorer', co: 'CO1' },
  { num: '02', title: 'Requirements & Traceability', co: 'CO1' },
  { num: '03', title: 'Software Architecture', co: 'CO2' },
  { num: '04', title: 'UML Diagram Viewer', co: 'CO2' },
  { num: '05', title: 'Black-Box Testing', co: 'CO3' },
  { num: '06', title: 'White-Box Testing', co: 'CO3' },
  { num: '07', title: 'Test Execution & Defects', co: 'CO3' },
  { num: '08', title: 'Software Quality Assurance', co: 'CO4' },
  { num: '09', title: 'Configuration Management', co: 'CO4' },
  { num: '10', title: 'Project Estimation', co: 'CO5' },
  { num: '11', title: 'Syllabus Coverage Matrix', co: 'CO1–5' },
  { num: '12', title: 'Viva Preparation', co: 'CO1–5' },
];

const coBadgeColor: Record<string, string> = {
  'CO1': 'bg-violet-500/20 text-violet-300',
  'CO2': 'bg-cyan-500/20 text-cyan-300',
  'CO3': 'bg-emerald-500/20 text-emerald-300',
  'CO4': 'bg-amber-500/20 text-amber-300',
  'CO5': 'bg-rose-500/20 text-rose-300',
  'CO1–5': 'bg-white/10 text-white/60',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#070711] text-white font-sans overflow-x-hidden">

      {/* ── AMBIENT GLOWS ──────────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/6 rounded-full blur-[100px]" />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#070711]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-sm opacity-70" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white tracking-tight">{t('landing.title1', 'AI Digital Library')}</p>
              <p className="text-[10px] text-white/35 font-medium tracking-wide">Karunya University · 25CS312</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              ['#cos', t('landing.navCos', 'Course Outcomes')],
              ['#lus', t('landing.navLus', 'Learning Units')],
              ['#features', t('landing.navFeatures', 'Features')],
              ['#selab', t('landing.navSeLab', 'SE Lab')],
            ].map(([href, label]) => (
              <a key={href} href={href} className="px-3 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              onClick={() => navigate('/demo')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all shadow-sm shadow-cyan-500/20"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {t('landing.tryDemo', 'Try Demo')}
            </button>
            <button onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-white/10">
              {t('landing.signIn', 'Sign In')}
            </button>
            <button onClick={() => navigate('/register')}
              className="relative px-4 py-1.5 text-xs font-semibold rounded-lg overflow-hidden group shadow-lg shadow-violet-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-500 group-hover:to-indigo-500 transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-400/20 to-indigo-400/20 blur-xl" />
              <span className="relative">{t('landing.getStarted', 'Get Started →')}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
            bg-gradient-to-r from-violet-500/10 to-indigo-500/10
            border border-violet-500/20 text-violet-300 text-xs font-medium
            backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            {t('landing.badge', 'Software Engineering · 25CS312 · Karunya University')}
            <span className="w-px h-3 bg-white/10" />
            {t('landing.studentBadge', 'BODDU SOLOMON · URK25CS1191')}
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-[80px] font-black leading-[0.95] tracking-[-0.03em] mb-6">
            <span className="block text-white">{t('landing.title1', 'AI Digital Library')}</span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400">
              {t('landing.title2', 'Management System.')}
            </span>
          </h1>

          <p className="text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t('landing.subtitle', 'A production-grade academic platform covering all 5 Course Outcomes and 5 Learning Units of the official SE syllabus — through a working library, AI chatbot, and interactive SE lab.')}
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button onClick={() => navigate('/register')}
              className="relative group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 group-hover:from-violet-500 group-hover:to-cyan-400 transition-all" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-violet-500/30 to-cyan-400/30 blur-2xl scale-150" />
              <span className="relative text-white">{t('landing.getStarted', 'Get Started')}</span>
              <ArrowRight className="relative w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/demo')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10"
            >
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              {t('landing.tryDemoNoAccount', 'Try Demo — no account')}
            </button>

            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border border-white/10 hover:border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-all">
              {t('landing.signIn', 'Sign In')}
            </button>

            <a href="#selab"
              className="flex items-center gap-1 text-sm text-white/30 hover:text-white/60 transition-colors">
              {t('landing.exploreLab', 'Explore SE Lab')} <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats grid */}
          <div className="mt-20 grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { val: '5', label: t('landing.cosCovered', 'COs Covered') },
              { val: '5', label: t('landing.learningUnits', 'Learning Units') },
              { val: '10', label: t('landing.umlDiagrams', 'UML Diagrams') },
              { val: '12', label: t('landing.seLabModules', 'SE Lab Modules') },
              { val: '18+', label: t('landing.automatedTests', 'Automated Tests') },
              { val: '3', label: t('landing.aiProviders', 'AI Providers') },
            ].map(s => (
              <div key={s.label}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] transition-all">
                <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">{s.val}</p>
                <p className="text-[11px] text-white/30 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STRIP ─────────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.05] bg-white/[0.015] py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-3">
          <p className="w-full text-center text-[11px] text-white/20 uppercase tracking-widest font-medium mb-2">Built with</p>
          {[['⚛️','React 18'],['🔷','TypeScript'],['⚡','Vite'],['🎨','Tailwind CSS'],['🟢','Supabase'],['🤖','Gemini AI'],['🧪','Vitest'],['📐','Mermaid UML'],['🐻','Zustand'],['🚀','Vercel']].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-white/40 hover:text-white/70 hover:border-white/10 transition-all">
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── COURSE OUTCOMES ────────────────────────────────────────────────── */}
      <section id="cos" className="py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
              <Award className="w-3.5 h-3.5" /> Official Syllabus · 25CS312
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {t('landing.coSectionTitle', 'All 5 Course Outcomes')}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              {t('landing.coSectionSubtitle', 'Every CO is implemented, demonstrated, and traceable to a real feature.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseOutcomes.map(co => {
              const Icon = co.icon;
              return (
                <div key={co.id}
                  className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 
                    ${co.border} hover:bg-white/[0.04] hover:shadow-2xl ${co.glow}
                    transition-all duration-300 hover:-translate-y-1 cursor-default`}>
                  {/* Subtle top gradient */}
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${co.gradient} opacity-40 rounded-t-2xl`} />

                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${co.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${co.badge}`}>{co.id}</span>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-white/30 border border-white/5">{co.lu}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{co.title}</h3>
                  <p className="text-xs text-white/40 mb-4 leading-relaxed italic">"{co.outcome}"</p>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">Project Coverage</p>
                    <p className="text-xs text-white/60 leading-relaxed">{co.coverage}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-medium">Fully Implemented</span>
                  </div>
                </div>
              );
            })}

            {/* All-CO summary */}
            <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-emerald-500/20
              bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5
              p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-emerald-300 font-bold text-lg mb-1">
                  ✅ CO1 · CO2 · CO3 · CO4 · CO5 — All five covered
                </p>
                <p className="text-white/40 text-sm">Every CO maps to an implemented feature, a test case, and a diagram in this system.</p>
              </div>
              <button onClick={() => navigate('/se-lab/syllabus')}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300
                  border border-emerald-500/25 hover:border-emerald-500/40
                  font-semibold text-sm transition-all">
                View Coverage Matrix <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNING UNITS ─────────────────────────────────────────────────── */}
      <section id="lus" className="py-28 px-6 border-y border-white/[0.05] bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Syllabus Mapping
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              {t('landing.luSectionTitle', 'All 5 Learning Units')}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{t('landing.luSectionSubtitle', 'Each LU has a dedicated SE Lab module with real implementation evidence.')}</p>
          </div>

          <div className="space-y-3">
            {learningUnits.map((lu, i) => (
              <div key={lu.id}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all p-5 md:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: ID + title */}
                  <div className="flex items-center gap-4 md:w-56 shrink-0">
                    <span className="text-2xl select-none">{lu.emoji}</span>
                    <div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg mb-2 inline-block ${lu.badge}`}>{lu.id}</span>
                      <p className="text-sm font-bold text-white leading-snug">{lu.title}</p>
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Topics Covered</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {lu.topics.map(t => (
                        <div key={t} className="flex items-center gap-2 text-xs text-white/50">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lu.dot}`} />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project application */}
                  <div className="md:w-64 shrink-0">
                    <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">Project Application</p>
                    <p className="text-xs text-white/60 leading-relaxed">{lu.project}</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs text-emerald-400 font-medium">SE Lab Module {i + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
              <Zap className="w-3.5 h-3.5" /> Production System
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{t('landing.featuresSectionTitle', 'Platform Capabilities & Architecture')}</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{t('landing.featuresSectionSubtitle', 'Engineered for high performance, zero-leak credential security, and reactive multi-language accessibility.')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02]
                    hover:border-white/10 hover:bg-white/[0.04]
                    hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden">
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${f.color} opacity-50`} />
                  <div className={`w-10 h-10 rounded-xl mb-4 bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg ${f.glow}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SE LAB GRID ────────────────────────────────────────────────────── */}
      <section id="selab" className="py-28 px-6 border-t border-white/[0.05] bg-white/[0.01] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <FlaskConical className="w-3.5 h-3.5" /> Interactive Laboratory
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{t('landing.seLabSectionTitle', 'SE Lab — 12 Modules')}</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">{t('landing.seLabSectionSubtitle', 'Live diagrams, actual test data, measured metrics — theory meets real implementation.')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {seModules.map(m => (
              <div key={m.num}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02]
                  hover:border-violet-500/20 hover:bg-violet-500/5
                  transition-all hover:-translate-y-0.5 p-4 cursor-default group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl font-black text-white/8 group-hover:text-white/15 transition-colors">{m.num}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${coBadgeColor[m.co] ?? 'bg-white/10 text-white/40'}`}>{m.co}</span>
                </div>
                <p className="text-xs font-semibold text-white/70 group-hover:text-white leading-snug transition-colors">{m.title}</p>
                <div className="mt-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-violet-500/20 overflow-hidden">
            {/* BG layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/10 to-cyan-600/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />
            <div className="absolute top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

            <div className="relative p-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-6">
                <Sparkles className="w-3 h-3" />
                Ready to explore?
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Start with the library.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  Explore the SE Lab.
                </span>
              </h2>
              <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                Register as a student for library and SE Lab access. Admin role unlocks document upload, user management, and AI summarization.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => navigate('/register')}
                  className="relative group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 group-hover:from-violet-500 group-hover:to-cyan-400 transition-all" />
                  <span className="relative text-white">Register Now</span>
                  <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-white/10 hover:border-white/20 text-white/60 hover:text-white hover:bg-white/5 transition-all">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-white/30">AI Digital Library Management System</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-white/20">
            <span>BODDU SOLOMON</span>
            <span>·</span><span>URK25CS1191</span>
            <span>·</span><span>Karunya University</span>
            <span>·</span><span>Software Engineering 25CS312</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/20">
            <Globe className="w-3.5 h-3.5" />
            React 18 · Supabase · Vercel
          </div>
        </div>
      </footer>
    </div>
  );
}
