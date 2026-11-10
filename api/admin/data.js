import { db } from 'hatchable';
import { loadAll } from 'lib/defaults.js';

export const access = 'admin';
export const methods = ['GET'];

export default async function (req, res) {
  const data = await loadAll(db);
  const inq = await db.query('SELECT id, name, email, message, created_at FROM site_inquiries ORDER BY created_at DESC LIMIT 200');
  res.setHeader('Cache-Control', 'no-store');
  res.json({ ...data, inquiries: inq.rows });
}