import { createHmac, timingSafeEqual } from 'crypto';

// ── Token helpers ─────────────────────────────────────────────────────────────

function b64url(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createToken(username, secret) {
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'POD' }));
  const payload = b64url(JSON.stringify({
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24h TTL
  }));
  const sig = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('hex');
  return `${header}.${payload}.${sig}`;
}

function safeEqual(a, b) {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const { username, password } = body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  const envUser = process.env.AUTH_USERNAME;
  const envPass = process.env.AUTH_PASSWORD;
  const secret  = process.env.JWT_SECRET;

  if (!envUser || !envPass || !secret) {
    console.error('[auth] Missing AUTH_USERNAME / AUTH_PASSWORD / JWT_SECRET env vars');
    res.status(500).json({ error: 'Server auth not configured' });
    return;
  }

  const ok = safeEqual(username, envUser) && safeEqual(password, envPass);
  if (!ok) {
    await new Promise(r => setTimeout(r, 200)); // timing attack mitigation
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  res.status(200).json({ token: createToken(username, secret) });
}
