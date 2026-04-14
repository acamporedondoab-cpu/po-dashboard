import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Users/Administrator/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(400);

  // Login
  await page.type('#login-username', 'adminaries');
  await page.type('#login-password', 'Gkh8NcrEkZEHLEcK');
  await page.click('#login-btn');
  await sleep(1800);

  await sleep(500);

  // Inject test data directly into the drawer
  await page.evaluate(() => {
    if (!window.openPODrawer) return;
    window.openPODrawer({
      po_number: 'PO-952701-003',
      supplier_name: 'TPS Electrical Supplies',
      customer_name: 'Westside Commercial',
      job_number: 'JOB-1031',
      date_required_by: '2026-04-20',
      delivery_status: 'In Transit',
      urgency: 'DUE SOON',
      supplier_cost: 4820.50,
      customer_price: 6350.00,
      gross_profit: 1529.50,
      margin_pct: 24.1,
      lines: [
        { line_number:1, description:'LED Batten 1500mm 50W', item_code:'LED-B150', qty:12, price_ex_tax:320.40, customer_price:420.00, margin_pct:23.7, delivery_status:'In Transit' },
        { line_number:2, description:'IP66 Weatherproof Fitting', item_code:'WP-IP66', qty:6, price_ex_tax:210.00, customer_price:280.00, margin_pct:25.0, delivery_status:'In Transit' },
        { line_number:3, description:'Surface Mount Downlight', item_code:'DL-SM01', qty:20, price_ex_tax:580.10, customer_price:780.00, margin_pct:25.6, delivery_status:'Ordered' },
      ]
    });
  });
  await sleep(700);

  const outPath = path.join(__dirname, 'temporary screenshots', 'screenshot-45-drawer-premium.png');
  await page.screenshot({ path: outPath });
  console.log('Saved:', outPath);

  // Scroll to bottom of drawer body and screenshot
  await page.evaluate(() => {
    const body = document.getElementById('drawer-body');
    if (body) body.scrollTop = body.scrollHeight;
  });
  await sleep(300);
  const outPath2 = path.join(__dirname, 'temporary screenshots', 'screenshot-46-drawer-bottom.png');
  await page.screenshot({ path: outPath2 });
  console.log('Saved:', outPath2);

  await browser.close();
})();
