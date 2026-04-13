import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname); // project root (one level up from scripts/)
const PORT = 3000;

// Load .env.local for local dev
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

// Parse request body as JSON
function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0];

  // ── API routes — proxy to handler ──────────────────────────────────────────
  if (urlPath.startsWith('/api/')) {
    // Derive handler from URL: /api/sheets → ./api/sheets.js, /api/auth → ./api/auth.js
    const handlerName = urlPath.replace(/^\/api\//, '').split('/')[0];
    try {
      const handlerUrl = pathToFileURL(path.join(ROOT, 'api', `${handlerName}.js`)).href;
      const { default: handler } = await import(handlerUrl);

      // Attach query params
      const searchParams = new URL(req.url, 'http://localhost').searchParams;
      req.query = Object.fromEntries(searchParams.entries());

      // Parse body for PUT/POST
      if (req.method === 'PUT' || req.method === 'POST') {
        req.body = await parseBody(req);
      }

      // Minimal res mock matching Vercel's res API
      let statusCode = 200;
      const headers = {};

      res.status = (code) => { statusCode = code; return res; };
      res.setHeader = (k, v) => { headers[k] = v; };
      const _origEnd = res.end.bind(res);
      res.json = (data) => {
        if (!res.headersSent) res.writeHead(statusCode, { ...headers, 'Content-Type': 'application/json' });
        _origEnd(JSON.stringify(data));
      };
      res.end = (body) => {
        if (!res.headersSent) res.writeHead(statusCode, headers);
        _origEnd(body);
      };

      await handler(req, res);
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `No handler for ${urlPath}` }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    }
    return;
  }

  // ── Static files ──────────────────────────────────────────────────────────
  let filePath = path.join(ROOT, urlPath);

  // SPA fallback — serve index.html for extensionless routes
  if (!path.extname(urlPath)) {
    filePath = path.join(ROOT, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!process.env.SPREADSHEET_ID) {
    console.log('  ⚠  No .env.local found — API calls will use sample data fallback in frontend');
  }
});
