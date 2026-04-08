import { google } from 'googleapis';

// ─── Auth ────────────────────────────────────────────────────────────────────

function getAuth() {
  let credentials;

  if (process.env.GOOGLE_CREDENTIALS) {
    // Local dev: full service account JSON as a single env var
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  } else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    // Vercel: individual vars (private key has literal \n that must be unescaped)
    credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key:  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  } else {
    throw new Error('No Google credentials. Set GOOGLE_CREDENTIALS or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.');
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
}

// ─── Tab Name Map ─────────────────────────────────────────────────────────────

const TAB_MAP = {
  po_headers:    'PO Headers',
  po_line_items: 'PO Line Items',
  supplier_view: 'Supplier View',
  vendor_spend:  'Vendor Spend',
  thresholds:    'Thresholds',
  discount:      'Discount Threshold',
  activity:      'Activity Feed',
};

// ─── Row Parsers ──────────────────────────────────────────────────────────────

function parsePoHeaders(rows) {
  if (!rows || rows.length < 2) return [];
  return rows.slice(1).map(r => ({
    po_number:           r[0]  ?? '',
    date:                r[1]  ?? '',
    supplier_name:       r[2]  ?? '',
    supplier_email:      r[3]  ?? '',
    supplier_phone:      r[4]  ?? '',
    delivery_address:    r[5]  ?? '',
    notes:               r[6]  ?? '',
    date_required_by:    r[7]  ?? '',
    requested_by:        r[8]  ?? '',
    job_number:          r[9]  ?? '',
    processed_at:        r[10] ?? '',
    delivery_status:     r[11] ?? '',
    total_supplier_cost: r[12] ?? '',
    total_customer_price:r[13] ?? '',
    total_gross_profit:  r[14] ?? '',
  }));
}

function parsePoLineItems(rows) {
  if (!rows || rows.length < 2) return [];
  return rows.slice(1).map(r => ({
    po_number:        r[0]  ?? '',
    line_number:      r[1]  ?? '',
    description:      r[2]  ?? '',
    item_code:        r[3]  ?? '',
    notes:            r[4]  ?? '',
    qty:              r[5]  ?? '',
    price_ex_tax:     r[6]  ?? '',
    amount_ex_tax:    r[7]  ?? '',
    tax:              r[8]  ?? '',
    amount_inc_tax:   r[9]  ?? '',
    item_number:      r[10] ?? '',
    supplier_name:    r[11] ?? '',
    customer_price:   r[12] ?? '',
    customer_total:   r[13] ?? '',
    gross_profit:     r[14] ?? '',
    margin_pct:       r[15] ?? '',
    delivery_status:  r[16] ?? '',
  }));
}

// Generic parser — returns header row as keys, remaining rows as objects
function parseGeneric(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
    return obj;
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // CORS headers (for local dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) {
    res.status(500).json({ error: 'SPREADSHEET_ID env var not set' });
    return;
  }

  // ── GET /api/sheets?tab=xxx ───────────────────────────────────────────────
  if (req.method === 'GET') {
    const tab = req.query?.tab || new URL(req.url, 'http://localhost').searchParams.get('tab');

    if (!tab || !TAB_MAP[tab]) {
      res.status(400).json({
        error: `Unknown tab "${tab}". Valid tabs: ${Object.keys(TAB_MAP).join(', ')}`,
      });
      return;
    }

    try {
      const sheets = getSheets();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: TAB_MAP[tab],
      });

      const rows = response.data.values || [];

      let data;
      switch (tab) {
        case 'po_headers':    data = parseGeneric(rows);    break;
        case 'po_line_items': data = parseGeneric(rows);    break;
        default:              data = parseGeneric(rows);    break;
      }

      res.status(200).json({ tab, count: data.length, data });
    } catch (err) {
      console.error(`[sheets] GET ?tab=${tab} error:`, err.message);
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // ── PUT /api/sheets — update threshold ────────────────────────────────────
  if (req.method === 'PUT') {
    let body = req.body;

    // Parse body if it's a string (some runtimes don't auto-parse)
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const { supplier_name, threshold_amount } = body || {};

    if (!supplier_name || threshold_amount === undefined) {
      res.status(400).json({ error: 'supplier_name and threshold_amount are required' });
      return;
    }

    try {
      const sheets = getSheets();

      // Read current Thresholds tab to find the row
      const readResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Thresholds',
      });

      const rows = readResponse.data.values || [];
      // Find row index where column 0 matches supplier_name (case-insensitive)
      const rowIndex = rows.findIndex(
        (r, i) => i > 0 && r[0]?.toLowerCase() === supplier_name.toLowerCase()
      );

      if (rowIndex === -1) {
        res.status(404).json({ error: `Supplier "${supplier_name}" not found in Thresholds tab` });
        return;
      }

      // Column B (index 1) = Threshold Amount — row is 1-indexed in Sheets A1 notation
      const sheetRow = rowIndex + 1; // +1 for 1-based index
      const range = `Thresholds!B${sheetRow}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[threshold_amount]],
        },
      });

      res.status(200).json({ success: true, supplier_name, threshold_amount, range });
    } catch (err) {
      console.error('[sheets] PUT threshold error:', err.message);
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
