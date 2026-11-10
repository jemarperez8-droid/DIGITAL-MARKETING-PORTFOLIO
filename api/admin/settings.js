import { db } from 'hatchable';
import { DEFAULT_SETTINGS } from 'lib/defaults.js';

export const access = 'admin';
export const methods = ['POST'];

export default async function (req, res) {
  const incoming = (req.body && req.body.settings) || {};
  const stmts = [];
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (!(key in incoming)) continue;
    const value = String(incoming[key] == null ? '' : incoming[key]).slice(0, 6000);
    stmts.push({
      sql: 'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      params: [key, value]
    });
  }
  if (stmts.length) await db.transaction(stmts);
  res.json({ ok: true, saved: stmts.length });
}