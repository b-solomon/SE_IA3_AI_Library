import puppeteer from 'puppeteer'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const BASE = 'http://localhost:5173'
const OUT  = 'C:/Users/kivsa/OneDrive/Desktop/seia3/IA3/screenshots'
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const W    = 1440
const H    = 900

const SUPABASE_URL = 'https://ectfmfydnlvguixhzbmy.supabase.co'
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGZtZnlkbmx2Z3VpeGh6Ym15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODM0NjIsImV4cCI6MjEwODg1OTQ2Mn0.WHzdJyi0ACEVLG93wKKbS8VoPee1vuCOkJZxcWPDfN8'
const STORAGE_KEY  = 'sb-ectfmfydnlvguixhzbmy-auth-token'

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const PUBLIC_PAGES = [
  { name: '01_landing_hero',        url: '/',          scroll: 0,    wait: 1500 },
  { name: '02_landing_course_outcomes', url: '/',      scroll: 850,  wait: 1000 },
  { name: '03_landing_features',    url: '/',          scroll: 1850, wait: 1000 },
  { name: '04_login_page',          url: '/login',     scroll: 0,    wait: 1500 },
  { name: '05_register_page',       url: '/register',  scroll: 0,    wait: 1500 },
  { name: '06_demo_page',           url: '/demo',      scroll: 0,    wait: 2500 },
]

const AUTH_PAGES = [
  { name: '07_admin_dashboard',     url: '/admin',        scroll: 0, wait: 2500 },
  { name: '08_admin_user_management', url: '/admin/users', scroll: 0, wait: 2000 },
  { name: '09_admin_category_management', url: '/admin/categories', scroll: 0, wait: 2000 },
  { name: '10_library_browse',      url: '/library',   scroll: 0, wait: 2500 },
  { name: '11_library_upload',      url: '/library/upload', scroll: 0, wait: 2000 },
  { name: '12_ai_assistant',        url: '/assistant', scroll: 0, wait: 2000 },
  { name: '13_selab_process_model', url: '/se-lab/process-model',  scroll: 0, wait: 2500 },
  { name: '14_selab_requirements',  url: '/se-lab/requirements',   scroll: 0, wait: 2000 },
  { name: '15_selab_architecture',  url: '/se-lab/architecture',   scroll: 0, wait: 2500 },
  { name: '16_selab_uml_diagrams',  url: '/se-lab/uml-diagrams',   scroll: 0, wait: 3000 },
  { name: '17_selab_blackbox',      url: '/se-lab/black-box',      scroll: 0, wait: 2000 },
  { name: '18_selab_whitebox',      url: '/se-lab/white-box',      scroll: 0, wait: 2000 },
  { name: '19_selab_test_execution',url: '/se-lab/test-execution', scroll: 0, wait: 2000 },
  { name: '20_selab_quality',       url: '/se-lab/quality',        scroll: 0, wait: 2000 },
  { name: '21_selab_config_mgmt',   url: '/se-lab/config-mgmt',    scroll: 0, wait: 2500 },
  { name: '22_selab_estimation',    url: '/se-lab/estimation',     scroll: 0, wait: 2500 },
  { name: '23_selab_syllabus',      url: '/se-lab/syllabus',       scroll: 0, wait: 2000 },
  { name: '24_selab_viva',          url: '/se-lab/viva',           scroll: 0, wait: 2000 },
]

async function getAdminSession() {
  console.log('🔑 Authenticating as admin via Supabase API...')
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
    },
    body: JSON.stringify({
      email: 'admin@karunya.edu',
      password: 'Admin@1234',
    }),
  })
  if (!res.ok) {
    throw new Error(`Auth failed: ${await res.text()}`)
  }
  return await res.json()
}

async function capture(page, item) {
  process.stdout.write(`📸 Capturing ${item.name}... `)
  try {
    await page.goto(`${BASE}${item.url}`, { waitUntil: 'networkidle2', timeout: 20000 })
    await new Promise(r => setTimeout(r, item.wait))
    if (item.scroll > 0) {
      await page.evaluate(s => window.scrollTo({ top: s, behavior: 'instant' }), item.scroll)
      await new Promise(r => setTimeout(r, 600))
    }
    const filePath = join(OUT, `${item.name}.png`)
    await page.screenshot({ path: filePath, fullPage: false })
    console.log(`✅ Saved`)
  } catch (err) {
    console.log(`❌ Error: ${err.message}`)
  }
}

async function main() {
  const session = await getAdminSession()
  console.log('✅ Admin session token acquired!')

  console.log(`🚀 Launching Chrome at ${CHROME_PATH}...`)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1.25 })

  console.log('\n--- Capturing Public Pages ---')
  for (const item of PUBLIC_PAGES) {
    await capture(page, item)
  }

  console.log('\n--- Injecting Admin Session & Capturing Protected Pages ---')
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' })
  await page.evaluate((key, sess) => {
    localStorage.setItem(key, JSON.stringify(sess))
  }, STORAGE_KEY, session)

  for (const item of AUTH_PAGES) {
    await capture(page, item)
  }

  await browser.close()
  console.log(`\n🎉 Success! All screenshots saved in:\n${OUT}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
