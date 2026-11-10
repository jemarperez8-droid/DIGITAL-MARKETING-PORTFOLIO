import { db } from 'hatchable';
import { loadAll } from 'lib/defaults.js';

export const access = 'public';
export const methods = ['GET'];

export default async function (req, res) {
  const data = await loadAll(db);
  res.setHeader('Cache-Control', 'no-store');
  res.json(data);
}