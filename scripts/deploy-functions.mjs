/**
 * Deploy Edge Functions to Supabase via Management API
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'ectfmfydnlvguixhzbmy';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';
const FUNCTIONS = ['ai-chat', 'ai-summarize', 'ai-classify'];

async function deployFunction(name) {
  const funcPath = resolve(__dirname, `../supabase/functions/${name}/index.ts`);
  const source = readFileSync(funcPath, 'utf8');
  console.log(`\n📦 Deploying ${name}...`);

  // Try the correct v1 Management API endpoint
  const endpoints = [
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions`,
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/${name}`,
  ];

  // POST to create
  let res = await fetch(endpoints[0], {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slug: name,
      name: name,
      body: source,
      verify_jwt: true,
    }),
  });

  let data = await res.json().catch(() => ({}));

  if (res.ok) {
    console.log(`   ✅ Created: ${name}`);
    return;
  }

  // If exists (409 conflict or 400 duplicated), PATCH to update
  if (res.status === 409 || res.status === 400) {
    res = await fetch(endpoints[1], {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: source,
        verify_jwt: true,
      }),
    });
    data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`   ✅ Updated: ${name}`);
      return;
    }
  }

  console.log(`   ⚠  ${res.status}: ${JSON.stringify(data).substring(0,200)}`);
}

async function checkAuth() {
  const res = await fetch('https://api.supabase.com/v1/projects', {
    headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
  });
  const data = await res.json().catch(() => []);
  if (res.ok) {
    const proj = Array.isArray(data) ? data.find(p => p.ref === PROJECT_REF) : null;
    console.log(`✅ Auth OK. Project: ${proj?.name ?? PROJECT_REF}`);
    return true;
  }
  console.log(`❌ Auth failed: ${res.status} ${JSON.stringify(data)}`);
  return false;
}

async function main() {
  if (!ACCESS_TOKEN) { console.log('No SUPABASE_ACCESS_TOKEN set'); process.exit(1); }

  console.log('🔑 Verifying access token...');
  const ok = await checkAuth();
  if (!ok) process.exit(1);

  console.log(`\n🚀 Deploying Edge Functions to: ${PROJECT_REF}`);
  for (const fn of FUNCTIONS) {
    await deployFunction(fn);
  }
  console.log('\n✅ All done!\n');
}

main().catch(console.error);
