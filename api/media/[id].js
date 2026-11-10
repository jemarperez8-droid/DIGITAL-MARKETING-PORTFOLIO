import { db, storage } from 'hatchable';

export const access = 'public';
export const methods = ['GET'];

export default async function (req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(404).send('Not found');
  const row = (await db.query('SELECT storage_key FROM site_media WHERE id = $1', [id])).rows[0];
  if (!row) return res.status(404).send('Not found');
  const url = await storage.url(row.storage_key, { ttl: 300 });
  res.setHeader('Cache-Control', 'public, max-age=240');
  res.redirect(302, url);
}