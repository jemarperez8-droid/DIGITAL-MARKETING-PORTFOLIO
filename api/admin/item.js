import { db } from 'hatchable';

export const access = 'admin';
export const methods = ['POST'];

// Whitelisted tables and columns: table names never come from user input directly.
const TABLES = {
  skills:       { table: 'site_skills',       cols: ['name', 'description', 'level', 'sort_order'] },
  certificates: { table: 'site_certificates', cols: ['title', 'issuer', 'year', 'image_id', 'sort_order'] },
  projects:     { table: 'site_projects',     cols: ['title', 'category', 'description', 'link_url', 'image_id', 'sort_order'] },
  services:     { table: 'site_services',     cols: ['name', 'description', 'price', 'sort_order'] },
  inquiries:    { table: 'site_inquiries',    cols: [] }
};
const NUMERIC = new Set(['level', 'sort_order']);

function clean(col, v) {
  if (col === 'image_id') { const n = Number(v); return n > 0 ? n : null; }
  if (NUMERIC.has(col)) { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; }
  return String(v == null ? '' : v).slice(0, 4000);
}

export default async function (req, res) {
  const { type, action, item } = req.body || {};
  const def = TABLES[type];
  if (!def) return res.status(400).json({ error: 'Unknown type.' });

  if (action === 'delete') {
    const id = Number(item && item.id);
    if (!id) return res.status(400).json({ error: 'Missing id.' });
    await db.query('DELETE FROM ' + def.table + ' WHERE id = $1', [id]);
    return res.json({ ok: true });
  }

  if (action === 'save' && def.cols.length) {
    const it = item || {};
    const vals = def.cols.map((c) => clean(c, it[c]));
    if (it.id) {
      const sets = def.cols.map((c, i) => c + ' = $' + (i + 1)).join(', ');
      await db.query('UPDATE ' + def.table + ' SET ' + sets + ' WHERE id = $' + (def.cols.length + 1), [...vals, Number(it.id)]);
      return res.json({ ok: true, id: Number(it.id) });
    }
    const maxRow = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM ' + def.table);
    const si = def.cols.indexOf('sort_order');
    if (!it.sort_order) vals[si] = Number(maxRow.rows[0].n);
    const ph = def.cols.map((c, i) => '$' + (i + 1)).join(', ');
    const r = await db.query('INSERT INTO ' + def.table + ' (' + def.cols.join(', ') + ') VALUES (' + ph + ') RETURNING id', vals);
    return res.json({ ok: true, id: r.rows[0].id });
  }

  res.status(400).json({ error: 'Unsupported action.' });
}