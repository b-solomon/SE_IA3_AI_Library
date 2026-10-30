import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const VIVA_QA = [
  {
    lu: 'LU1 — Process Models',
    questions: [
      {
        q: 'What process model did you use and why?',
        a: `We used Agile + Incremental. The project was divided into 5 sprints, each delivering a working
increment (scaffold → auth → library → AI → SE Lab → QA). Agile was chosen because requirements
evolved — particularly the AI features, which required experimentation with multiple model providers.
Incremental ensured we always had a deployable system, reducing risk. Waterfall was rejected
because changing AI requirements mid-project would have caused expensive rework.`,
      },
      {
        q: 'How did you gather requirements?',
        a: `Requirements were derived from the project specification and refined during sprint reviews.
We identified 18 functional requirements (FR-01 to FR-18) and 10 non-functional requirements (NFR-01 to NFR-10).
Each requirement was prioritised using MoSCoW: Must Have (all core library and AI features),
Should Have (i18n, admin management), Could Have (AI summarisation). A traceability matrix links
each requirement to its feature, test case, and UML diagram.`,
      },
    ],
  },
  {
    lu: 'LU2 — Architecture & Design',
    questions: [
      {
        q: 'Explain the architecture of your system.',
        a: `The system uses a four-layer clean architecture:
1. Presentation Layer — React 18 + TypeScript + Tailwind + shadcn/ui
2. Application Layer — Custom hooks (useAuth, useAssets, useChat) + Zustand stores
3. Domain Layer — Supabase Edge Functions (Deno) for AI logic
4. Data Layer — PostgreSQL + RLS + Object Storage
Each layer depends only on the layer below it. No layer imports from above it.
This enforces separation of concerns and makes each layer independently testable.`,
      },
      {
        q: 'How does Supabase RLS enforce authorization?',
        a: `Row Level Security (RLS) is enabled on every table. RLS policies run on the PostgreSQL server —
they cannot be bypassed from the browser. For example:
- digital_assets: authenticated users can SELECT rows where is_published = true.
  Admins can SELECT all. Only admins can INSERT/UPDATE/DELETE.
- profiles: users can only SELECT and UPDATE their own row (WHERE id = auth.uid()).
- conversations: users only see rows where user_id = auth.uid().
Even if a malicious client sends a raw SQL query, PostgreSQL enforces these policies.
The service-role key (which bypasses RLS) exists ONLY inside Edge Functions — never in the browser.`,
      },
      {
        q: 'What is the difference between cohesion and coupling?',
        a: `Cohesion measures how focused a module's responsibilities are.
High cohesion is desirable — e.g., useChat only manages conversation state; it does not
handle file uploads or UI rendering.

Coupling measures how dependent modules are on each other.
Low coupling is desirable — e.g., LibraryPage does not import supabase.ts directly;
it calls useAssets, which abstracts the data source. This means the data layer can change
without touching the page component.

In this project: each Edge Function (ai-chat, ai-summarize, ai-classify) has high cohesion
(one job) and low coupling (stateless JSON API, no shared mutable state).`,
      },
    ],
  },
  {
    lu: 'LU3 — Testing',
    questions: [
      {
        q: 'Explain the difference between black-box and white-box testing with examples from your project.',
        a: `Black-box testing tests the external behaviour without knowledge of internal code.
Example: TC-BB-08 — uploading a file > 50 MB. We do not care how validateFile() works internally;
we only verify that the error message "File size must not exceed 50 MB." appears. The test
is defined by input + expected output only.

White-box testing tests internal logic — control flow, branches, coverage.
Example: the CFG for validateFile() shows two decision nodes (type check, size check).
We design test inputs to cover every branch: valid PDF, valid EPUB, invalid type, oversized file.
Branch coverage is measured at 100% for validateFile() using V8 via vitest --coverage.`,
      },
      {
        q: 'What is Boundary Value Analysis?',
        a: `BVA tests at the edges of valid input ranges, not just the middle.
For file upload: the boundary is 50 MB (52,428,800 bytes).
- TC-BB-07: file at exactly 50 MB → should PASS
- TC-BB-08: file at 50 MB + 1 byte → should FAIL
This catches off-by-one errors in comparisons (> vs >=).
Another example: name minimum length is 2 characters.
- TC-BB-02: name = "AB" (exactly 2) → should PASS
- name = "A" (1 character) → should FAIL`,
      },
      {
        q: 'What testing framework did you use and how?',
        a: `Vitest with @testing-library/react. Vitest is a Vite-native test runner compatible with
the Jest API. Tests are in src/test/{unit,integration}/.

Key test commands:
  pnpm test          — run all tests once
  pnpm test:watch    — watch mode during development
  pnpm test:coverage — generate V8 coverage report

The test:coverage command produces coverage/coverage-summary.json which is parsed by
src/lib/coverage.ts and displayed in the White-Box visualizer.

Example unit test: validateFile() with valid/invalid inputs.
Example integration test: registration form submission with mocked supabase.auth.signUp.`,
      },
    ],
  },
  {
    lu: 'LU4 — Quality Assurance',
    questions: [
      {
        q: 'How does your chatbot protect API keys?',
        a: `API keys never touch the browser. The security architecture is:
1. Browser sends a message + Supabase JWT to the ai-chat Edge Function via HTTPS.
2. The Edge Function runs on Deno (Supabase's server-side runtime).
3. Inside the Edge Function, GEMINI_API_KEY is read from Supabase Secrets (environment variables).
4. The Edge Function calls the Gemini API server-to-server. The browser never sees the key.
5. The key is not in src/, not in .env (only VITE_ vars are there), not in Git history.

Even if a user inspects the browser bundle with DevTools, they will find only the anon key
(which is designed to be public — security is enforced by RLS, not key secrecy).`,
      },
      {
        q: 'What is DRE and what does it mean if it is 100%?',
        a: `DRE = Defect Removal Efficiency = Pre-release defects ÷ (Pre-release + Post-release) × 100.

In our project, DRE is reported as ~100% because all 8 defects found were identified and fixed
before deployment (pre-release = 8, post-release = 0).

However, this is NOT reliable evidence of high quality at this stage — it simply means
we have not yet observed post-release defects, because the system is not yet in production use.
DRE is most meaningful after the system has been in production for a period.
We clearly label this metric as "estimated" in the Quality page.`,
      },
    ],
  },
  {
    lu: 'LU5 — Configuration Management',
    questions: [
      {
        q: 'What is software configuration management and how is it applied in your project?',
        a: `SCM (Software Configuration Management) controls changes to software artefacts throughout
the lifecycle.

In this project:
1. Version Control: Git with main/develop/feature/* branching strategy.
   main = production-ready; develop = integration; feature/* = one branch per sprint story.
2. Configuration Identification: All env variables documented in .env.example.
   Database schema versioned as timestamped migrations in supabase/migrations/.
3. Change Management: Feature branches are peer-reviewed before merging to develop.
   Production releases are tagged (v1.0.0).
4. Baseline: v1.0.0 tag on main = the project baseline submitted for assessment.`,
      },
      {
        q: 'Why is the .env file not committed to Git?',
        a: `.env contains secrets: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
Even though the anon key is technically safe to expose (RLS protects the data),
.env is gitignored because:
1. It establishes a safe pattern — if VITE_ vars are gitignored, there is no risk of
   accidentally committing a secret key using the same VITE_ prefix.
2. Different environments (dev/staging/production) have different values.
3. Team members should configure their own Supabase project.

.env.example is committed — it documents all required variables without their values,
so any developer can clone the repo and know exactly what to configure.`,
      },
    ],
  },
]

export function VivaPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <PageHeader
        title={t('seLab.viva')}
        description={t('seLab.vivaDesc')}
        breadcrumbs={[{ label: 'SE Lab' }, { label: 'Viva Preparation' }]}
      />

      <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm">
        <p className="font-semibold">🎓 BODDU SOLOMON · URK25CS1191 · 25CS312</p>
        <p className="text-muted-foreground mt-1">
          All answers reference the actual implementation. Review each section before your viva.
          Open relevant pages to demonstrate features live.
        </p>
      </div>

      {VIVA_QA.map((section) => (
        <Card key={section.lu}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge>{section.lu.slice(0, 3)}</Badge>
              {section.lu}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple">
              {section.questions.map((qa, i) => (
                <AccordionItem key={i} value={`${section.lu}-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    Q: {qa.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {qa.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
