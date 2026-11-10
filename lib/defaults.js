// Starter content. Everything here is editable from /admin after the first load.
export const DEFAULT_SETTINGS = {
  name: 'Your Name',
  title: 'Digital Marketer · Social Media Manager · Content Creator',
  tagline: 'I turn ideas into content that gets noticed and customers that come back.',
  intro: 'I help small businesses and personal brands grow online with clear strategy, eye-catching Canva designs, and consistent social media content.',
  cta_primary: 'View My Portfolio',
  cta_secondary: 'Contact Me',
  what_i_do: 'I plan, design and publish digital marketing content: content calendars, social media posts, short videos and campaign plans that guide customers from first look to first purchase.',
  about_text: 'I am a Digital Marketing NC III graduate who enjoys turning ideas into clear, creative content. During my training I learned how customers move through the marketing funnel, how to plan campaigns, and how to design and publish content that fits each digital channel.\n\nI like practical work: building a content calendar, designing a promotional graphic in Canva, editing a short video, or writing a campaign proposal that a business owner can actually use.',
  about_interests: 'Social media trends\nGraphic design\nShort-form video\nBrand storytelling\nSmall business growth',
  about_strengths: 'Creative and detail-oriented\nFast learner who accepts feedback well\nOrganized with deadlines and content schedules\nClear communicator with clients and teammates',
  about_goals: 'My goal is to work as a social media manager or content creator for a growing brand, while taking on freelance projects that help small businesses build a strong online presence.',
  skills_intro: 'These are the skills I built and practiced throughout my Digital Marketing NC III training.',
  certs_intro: 'Certificates and completed training that back up my skills.',
  portfolio_intro: 'A selection of the real outputs I created during my training: planning, design, video and campaign work.',
  services_intro: 'Here is how I can help your business or brand grow online.',
  contact_intro: 'Have a project in mind or want to work together? Send me a message and I will get back to you as soon as I can.',
  email: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  phone: '',
  location: '',
  photo_id: ''
};

const SKILLS = [
  ['Digital Marketing Fundamentals', 'Marketing principles, target audiences, brand positioning and the customer journey.', 85],
  ['Social Media Management', 'Planning, posting and monitoring content across Facebook, Instagram and TikTok.', 85],
  ['Canva Graphic Design', 'Posts, banners, flyers, carousels and branded templates that look consistent.', 90],
  ['Content Creation & Video Editing', 'Short-form and long-form video, captions and scripts for different platforms.', 80],
  ['Campaign Planning', 'Setting goals, choosing channels and building a campaign timeline and creative brief.', 80],
  ['Digital Marketing Funnels', 'Mapping awareness, consideration and conversion with the right content for each stage.', 75],
  ['Google Workspace', 'Docs, Sheets, Slides, Drive and Forms for planning, reporting and collaboration.', 85]
];

const PROJECTS = [
  ['Social Media Content Calendar', 'Content Planning', 'A monthly content calendar that schedules post topics, formats, captions and publishing dates so a page stays active and on-brand.'],
  ['Canva Graphic Designs & Promotional Materials', 'Graphic Design', 'A set of promotional graphics made in Canva, including social media posts, banners and flyers that follow one consistent brand style.'],
  ['Video Content', 'Video', 'Short-form promotional video edited for Reels and TikTok, with captions, music and a clear call to action.'],
  ['Digital Marketing Campaign Proposal', 'Campaign Strategy', 'A campaign proposal and creative brief covering objectives, target audience, key message, channels, timeline and success measures.'],
  ['Marketing Funnel Plan', 'Funnel & Landing Page', 'A funnel plan that maps content to each stage of the customer journey, from awareness to conversion and repeat customers.']
];

const SERVICES = [
  ['Social Media Content Creation', 'Ready-to-post graphics, captions and short videos that match your brand and speak to your audience.', 'Custom quote'],
  ['Canva Graphic Design', 'Posts, banners, flyers, menus and branded templates you can reuse again and again.', 'Custom quote'],
  ['Content Calendar Preparation', 'A clear monthly plan of what to post, when to post it and why, so you never run out of ideas.', 'Custom quote'],
  ['Social Media Page Management', 'Regular posting, page updates and message monitoring so your page stays active.', 'Custom quote'],
  ['Promotional Video Editing', 'Short, polished videos for Reels, TikTok and Facebook with captions and music.', 'Custom quote']
];

const CERTS = [
  ['Digital Marketing NC III Training Certificate', 'TESDA Digital Marketing NC III Program', '2026']
];

export async function ensureSeed(db) {
  const done = await db.query("SELECT value FROM site_settings WHERE key = 'seeded'");
  if (done.rows.length) return;
  await db.query("INSERT INTO site_settings (key, value) VALUES ('seeded', '1') ON CONFLICT (key) DO NOTHING");
  for (let i = 0; i < SKILLS.length; i++) {
    const s = SKILLS[i];
    await db.query('INSERT INTO site_skills (name, description, level, sort_order) VALUES ($1, $2, $3, $4)', [s[0], s[1], s[2], i + 1]);
  }
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    await db.query('INSERT INTO site_projects (title, category, description, sort_order) VALUES ($1, $2, $3, $4)', [p[0], p[1], p[2], i + 1]);
  }
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await db.query('INSERT INTO site_services (name, description, price, sort_order) VALUES ($1, $2, $3, $4)', [s[0], s[1], s[2], i + 1]);
  }
  for (let i = 0; i < CERTS.length; i++) {
    const c = CERTS[i];
    await db.query('INSERT INTO site_certificates (title, issuer, year, sort_order) VALUES ($1, $2, $3, $4)', [c[0], c[1], c[2], i + 1]);
  }
}

export async function loadAll(db) {
  await ensureSeed(db);
  const s = await db.query('SELECT key, value FROM site_settings');
  const settings = { ...DEFAULT_SETTINGS };
  for (const r of s.rows) { if (r.key !== 'seeded') settings[r.key] = r.value; }
  const q = (t) => db.query('SELECT * FROM ' + t + ' ORDER BY sort_order, id').then(r => r.rows);
  const [skills, certificates, projects, services] = await Promise.all([q('site_skills'), q('site_certificates'), q('site_projects'), q('site_services')]);
  return { settings, skills, certificates, projects, services };
}