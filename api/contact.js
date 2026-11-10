import { db, email } from 'hatchable';

export const access = 'public';
export const methods = ['POST'];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function (req, res) {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot for bots
  const name = String(b.name || '').trim().slice(0, 120);
  const from = String(b.email || '').trim().slice(0, 200);
  const message = String(b.message || '').trim().slice(0, 4000);
  if (!name || !message) return res.status(400).json({ error: 'Please enter your name and a message.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) return res.status(400).json({ error: 'Please enter a valid email address.' });

  await db.query('INSERT INTO site_inquiries (name, email, message) VALUES ($1, $2, $3)', [name, from, message]);

  try {
    const r = await db.query("SELECT value FROM site_settings WHERE key = 'email'");
    const to = r.rows[0] && r.rows[0].value;
    if (to && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      await email.send({
        to,
        subject: 'New portfolio inquiry from ' + name,
        html: '<p><strong>' + esc(name) + '</strong> (' + esc(from) + ') wrote:</p><p>' + esc(message).replace(/\n/g, '<br>') + '</p>'
      });
    }
  } catch (e) {
    console.log('inquiry email failed', e && e.message);
  }
  res.json({ ok: true });
}