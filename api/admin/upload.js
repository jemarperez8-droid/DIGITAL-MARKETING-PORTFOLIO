import { db, storage } from 'hatchable';
import crypto from 'node:crypto';

export const access = 'admin';
export const methods = ['POST'];

const MAX_B64 = 8 * 1024 * 1024; // the browser shrinks photos first, so this is generous

export default async function (req, res) {
  const data = String((req.body && req.body.data) || '');
  const m = data.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return res.status(415).json({ error: 'Please upload a JPG, PNG, WEBP or GIF image.' });
  if (m[2].length > MAX_B64) return res.status(413).json({ error: 'Image is too large.' });

  const bin = atob(m[2]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

  const ext = m[1] === 'image/jpeg' ? 'jpg' : m[1].split('/')[1];
  const key = 'portfolio/' + crypto.randomUUID() + '.' + ext;
  await storage.put(key, bytes, m[1]);
  const r = await db.query('INSERT INTO site_media (storage_key, content_type) VALUES ($1, $2) RETURNING id', [key, m[1]]);
  res.json({ ok: true, id: r.rows[0].id });
}