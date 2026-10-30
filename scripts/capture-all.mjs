import { spawn, execSync } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.join(projectRoot, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4199;
const BASE_URL = `http://localhost:${PORT}`;

// Helper: check if server is up
function pingServer() {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}/`, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

// Helper: sleep
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🚀 Starting Vite preview server on port', PORT);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: true,
  });

  // Wait for server to be responsive
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await wait(500);
    ready = await pingServer();
    if (ready) break;
  }

  if (!ready) {
    console.error('❌ Server failed to start on port', PORT);
    preview.kill();
    process.exit(1);
  }

  console.log('✅ Server ready! Capturing presentation screenshots...');

  const targets = [
    {
      file: '01_Landing_Hero.png',
      url: `${BASE_URL}/`,
      width: 1440,
      height: 900,
      time: 2500,
    },
    {
      file: '02_Course_Outcomes_CO1_to_CO5.png',
      url: `${BASE_URL}/#cos`,
      width: 1440,
      height: 980,
      time: 2500,
    },
    {
      file: '03_Learning_Units_LUI_to_LUV.png',
      url: `${BASE_URL}/#lus`,
      width: 1440,
      height: 1050,
      time: 2500,
    },
    {
      file: '04_Features_Overview.png',
      url: `${BASE_URL}/#features`,
      width: 1440,
      height: 900,
      time: 2000,
    },
    {
      file: '05_SE_Lab_12_Modules_Grid.png',
      url: `${BASE_URL}/#selab`,
      width: 1440,
      height: 900,
      time: 2000,
    },
    {
      file: '06_Interactive_Demo_Sandbox.png',
      url: `${BASE_URL}/demo`,
      width: 1440,
      height: 950,
      time: 3000,
    },
    {
      file: '07_User_Login_Math_Captcha.png',
      url: `${BASE_URL}/login`,
      width: 1440,
      height: 900,
      time: 2000,
    },
    {
      file: '08_User_Registration_Checklist.png',
      url: `${BASE_URL}/register`,
      width: 1440,
      height: 950,
      time: 2000,
    },
    {
      file: '09_Full_Landing_Overview.png',
      url: `${BASE_URL}/`,
      width: 1440,
      height: 3800,
      time: 3500,
    },
  ];

  for (const t of targets) {
    const outFile = path.join(screenshotsDir, t.file);
    console.log(`📸 Capturing ${t.file}...`);
    try {
      const cmd = `"${CHROME_PATH}" --headless=new --disable-gpu --hide-scrollbars --window-size=${t.width},${t.height} --virtual-time-budget=${t.time} --screenshot="${outFile}" "${t.url}"`;
      execSync(cmd, { stdio: 'ignore', timeout: 30000 });
      if (fs.existsSync(outFile)) {
        const stats = fs.statSync(outFile);
        console.log(`   ✅ Saved: ${t.file} (${Math.round(stats.size / 1024)} KB)`);
      } else {
        console.log(`   ⚠️ File was not generated: ${t.file}`);
      }
    } catch (err) {
      console.error(`   ❌ Failed to capture ${t.file}:`, err.message);
    }
  }

  // Kill preview process
  try {
    process.kill(preview.pid);
    execSync(`taskkill /F /T /PID ${preview.pid}`, { stdio: 'ignore' });
  } catch {}

  console.log('\n🎉 All screenshots captured successfully in /screenshots folder!\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
