import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Auto-increment filename
function getNextFilename() {
  const files = fs.readdirSync(screenshotDir)
    .filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));

  let max = 0;
  for (const f of files) {
    const match = f.match(/screenshot-(\d+)/);
    if (match) max = Math.max(max, parseInt(match[1]));
  }

  const n = max + 1;
  const suffix = label ? `-${label}` : '';
  return path.join(screenshotDir, `screenshot-${n}${suffix}.png`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Administrator/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Short pause for animations
  await new Promise(r => setTimeout(r, 500));

  const filename = getNextFilename();
  await page.screenshot({ path: filename, fullPage: false });

  console.log(`Screenshot saved: ${filename}`);
  await browser.close();
})();
