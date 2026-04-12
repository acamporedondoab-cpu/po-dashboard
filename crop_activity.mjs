import puppeteer from 'C:/Users/nateh/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const browser = await puppeteer.launch({ executablePath: 'C:/Users/nateh/.cache/puppeteer/chrome/win64-133.0.6943.53/chrome-win64/chrome.exe', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 800));
const box = await page.evaluate(() => {
  const el = document.getElementById('activity-feed');
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height };
});
await page.screenshot({ path: 'temporary screenshots/screenshot-65-activity-crop.png', clip: { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: Math.min(box.height + 20, 600) } });
await browser.close();
console.log('done', box);
