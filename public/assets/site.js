(function () {
  var PAGES = [['index.html', 'Home'], ['about.html', 'About'], ['skills.html', 'Skills & Certificates'], ['portfolio.html', 'Portfolio'], ['services.html', 'Services'], ['contact.html', 'Contact']];
  var page = document.body.getAttribute('data-page') || 'index';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lines = function (s) { return String(s || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); };
  var paras = function (s) { return String(s || '').split(/\n\s*\n/).map(function (x) { return x.trim(); }).filter(Boolean); };
  var img = function (id) { return id ? '/api/media/' + id : ''; };
  var initials = function (n) { return (String(n).trim().split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2) || 'DM').toUpperCase(); };
  var safeUrl = function (u) { u = String(u || '').trim(); return /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : ''; };

  function header(S) {
    var cur = page === 'index' ? 'index.html' : page + '.html';
    var items = PAGES.map(function (p) { return '<li><a href="/' + (p[0] === 'index.html' ? '' : p[0]) + '"' + (p[0] === cur ? ' class="on" aria-current="page"' : '') + '>' + p[1] + '</a></li>'; }).join('');
    return '<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap nav"><a class="brand" href="/"><i>' + esc(initials(S.name)) + '</i>' + esc(S.name) + '</a><button class="burger" aria-label="Open menu" aria-expanded="false">\u2630</button><ul id="menu">' + items + '</ul></div></header>';
  }
  function footer(S) {
    var links = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn']].map(function (l) { var u = safeUrl(S[l[0]]); return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + l[1] + '</a>' : ''; }).join('');
    return '<footer class="site"><div class="wrap row"><span>\u00a9 ' + new Date().getFullYear() + ' ' + esc(S.name) + ' \u00b7 Digital Marketing Portfolio</span><span>' + links + '</span></div></footer><div class="lb" id="lb" role="dialog" aria-label="Image preview"><button aria-label="Close">\u00d7</button><img alt=""></div>';
  }
  function photoBox(S, alt) {
    return S.photo_id ? '<img src="' + img(S.photo_id) + '" alt="' + esc(alt) + '">' : '<span class="ph" aria-hidden="true">' + esc(initials(S.name)) + '</span>';
  }
  function ctaBand(S) {
    return '<section class="block"><div class="wrap"><div class="cta reveal"><h2>Let\u2019s grow your brand together</h2><p>Need content, designs or a campaign plan? I would love to hear about your project.</p><a class="btn primary" href="/contact.html">' + esc(S.cta_secondary || 'Contact Me') + '</a></div></div></section>';
  }
  function projectCard(p) {
    var u = safeUrl(p.link_url);
    var t = p.image_id ? '<button class="thumb" data-zoom="' + img(p.image_id) + '" aria-label="Enlarge image for ' + esc(p.title) + '"><img loading="lazy" src="' + img(p.image_id) + '" alt="' + esc(p.title) + '"></button>' : '<div class="thumb" style="cursor:default"><span class="soon">' + esc(p.category || 'Project') + '</span></div>';
    return '<article class="card proj reveal">' + t + '<div class="body"><span class="tag">' + esc(p.category) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p>' + (u ? '<a class="btn ghost" style="align-self:flex-start" href="' + esc(u) + '" target="_blank" rel="noopener">View project \u2192</a>' : '') + '</div></article>';
  }

  var R = {
    index: function (D) {
      var S = D.settings;
      var feat = D.projects.slice(0, 3).map(projectCard).join('');
      var svc = D.services.slice(0, 3).map(function (s, i) { return '<div class="card reveal"><div class="icon">' + (i + 1) + '</div><h3>' + esc(s.name) + '</h3><p style="color:var(--muted)">' + esc(s.description) + '</p></div>'; }).join('');
      return '<section class="hero"><div class="wrap grid"><div><span class="eyebrow">' + esc(S.title) + '</span><h1>Hi, I\u2019m ' + esc(S.name) + '</h1><p class="tagline">' + esc(S.tagline) + '</p><p class="lead">' + esc(S.intro) + '</p><div class="actions"><a class="btn primary" href="/portfolio.html">' + esc(S.cta_primary || 'View My Portfolio') + ' \u2192</a><a class="btn ghost" href="/contact.html">' + esc(S.cta_secondary || 'Contact Me') + '</a></div></div><div class="photo">' + photoBox(S, S.name) + '</div></div></section>'
        + '<section class="block alt"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">What I do</span><h2>Marketing that moves people to act</h2><p>' + esc(S.what_i_do) + '</p></div><div class="cards">' + svc + '</div></div></section>'
        + '<section class="block"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Featured work</span><h2>Recent projects</h2></div><div class="cards">' + feat + '</div><p style="margin-top:1.6rem"><a class="btn ghost" href="/portfolio.html">See all projects</a></p></div></section>' + ctaBand(S);
    },
    about: function (D) {
      var S = D.settings;
      return '<section class="page-hero"><div class="wrap"><span class="eyebrow">About me</span><h1>Get to know ' + esc(S.name) + '</h1></div></section><section class="block"><div class="wrap about-grid"><div class="photo reveal">' + photoBox(S, 'Portrait of ' + S.name) + '</div><div class="reveal"><h2>' + esc(S.title.split('\u00b7')[0].trim()) + '</h2>' + paras(S.about_text).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('')
        + '<h3>Interests</h3><ul class="chips">' + lines(S.about_interests).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><h3>Strengths</h3><ul class="ticks">' + lines(S.about_strengths).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><h3>Professional goals</h3><p>' + esc(S.about_goals) + '</p><a class="btn primary" href="/portfolio.html">View My Portfolio</a></div></div></section>' + ctaBand(S);
    },
    skills: function (D) {
      var S = D.settings;
      var sk = D.skills.map(function (s) { return '<div class="card skill reveal"><div class="top"><h3>' + esc(s.name) + '</h3><span class="pct">' + Number(s.level) + '%</span></div><p>' + esc(s.description) + '</p><div class="bar" role="img" aria-label="' + esc(s.name) + ' proficiency ' + Number(s.level) + ' percent"><b data-w="' + Math.max(0, Math.min(100, Number(s.level))) + '"></b></div></div>'; }).join('');
      var ce = D.certificates.map(function (c) { var t = c.image_id ? '<button class="thumb" data-zoom="' + img(c.image_id) + '" aria-label="Enlarge certificate"><img loading="lazy" src="' + img(c.image_id) + '" alt="' + esc(c.title) + '"></button>' : '<div class="thumb" style="cursor:default">Certificate</div>'; return '<article class="card cert reveal">' + t + '<h3>' + esc(c.title) + '</h3><small>' + esc(c.issuer) + (c.year ? ' \u00b7 ' + esc(c.year) : '') + '</small></article>'; }).join('');
      return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Skills</span><h1>What I can do</h1><p>' + esc(S.skills_intro) + '</p></div></section><section class="block"><div class="wrap"><div class="cards">' + (sk || '<p class="empty">Skills coming soon.</p>') + '</div></div></section><section class="block alt"><div class="wrap"><div class="sec-head"><span class="eyebrow">Certifications</span><h2>Certificates &amp; training</h2><p>' + esc(S.certs_intro) + '</p></div><div class="cards">' + (ce || '<p class="empty">Certificates coming soon.</p>') + '</div></div></section>' + ctaBand(S);
    },
    portfolio: function (D) {
      var S = D.settings;
      var cats = []; D.projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
      var chips = cats.length > 1 ? '<div class="filters"><button class="chip on" data-cat="">All</button>' + cats.map(function (c) { return '<button class="chip" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') + '</div>' : '';
      return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Portfolio</span><h1>My projects</h1><p>' + esc(S.portfolio_intro) + '</p></div></section><section class="block"><div class="wrap">' + chips + '<div class="cards" id="plist">' + (D.projects.map(function (p) { return '<div data-c="' + esc(p.category) + '" style="display:contents">' + projectCard(p) + '</div>'; }).join('') || '<p class="empty">Projects coming soon.</p>') + '</div></div></section>' + ctaBand(S);
    },
    services: function (D) {
      var S = D.settings;
      var sv = D.services.map(function (s, i) { return '<div class="card reveal"><div class="icon">' + (i + 1) + '</div><h3>' + esc(s.name) + '</h3><p style="color:var(--muted)">' + esc(s.description) + '</p>' + (s.price ? '<span class="price">' + esc(s.price) + '</span>' : '') + '</div>'; }).join('');
      return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Services</span><h1>How I can help</h1><p>' + esc(S.services_intro) + '</p></div></section><section class="block"><div class="wrap"><div class="cards">' + (sv || '<p class="empty">Services coming soon.</p>') + '</div></div></section>' + ctaBand(S);
    },
    contact: function (D) {
      var S = D.settings, rows = [];
      var link = function (u, t) { u = safeUrl(u); return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t || u.replace(/^https?:\/\/(www\.)?/, '')) + '</a>' : ''; };
      if (S.email) rows.push(['Email', '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>']);
      if (S.phone) rows.push(['Phone', '<a href="tel:' + esc(S.phone.replace(/\s+/g, '')) + '">' + esc(S.phone) + '</a>']);
      if (S.location) rows.push(['Location', esc(S.location)]);
      if (link(S.facebook)) rows.push(['Facebook', link(S.facebook)]);
      if (link(S.instagram)) rows.push(['Instagram', link(S.instagram)]);
      if (link(S.linkedin)) rows.push(['LinkedIn', link(S.linkedin)]);
      var info = rows.length ? '<ul class="info">' + rows.map(function (r) { return '<li><b>' + r[0] + '</b><span>' + r[1] + '</span></li>'; }).join('') + '</ul>' : '';
      return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Contact</span><h1>Let\u2019s work together</h1><p>' + esc(S.contact_intro) + '</p></div></section><section class="block"><div class="wrap contact-grid"><div class="reveal"><h3>Contact details</h3>' + info + '</div><div class="card reveal"><h3>Send me a message</h3><form class="contact" id="cf" novalidate><label>Your name<input name="name" required maxlength="120" autocomplete="name"></label><label>Email address<input name="email" type="email" required maxlength="200" autocomplete="email"></label><label>How can I help?<textarea name="message" rows="5" required maxlength="4000"></textarea></label><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn primary" type="submit">Send message</button><p class="note" id="cn" role="status"></p></form></div></div></section>';
    }
  };

  function wire(D) {
    var burger = $('.burger'), menu = $('#menu');
    if (burger) burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    var lb = $('#lb'), lbi = $('img', lb);
    document.addEventListener('click', function (e) {
      var z = e.target.closest('[data-zoom]'); if (z) { lbi.src = z.getAttribute('data-zoom'); lb.classList.add('open'); return; }
      if (e.target === lb || e.target.closest('#lb button')) lb.classList.remove('open');
      var c = e.target.closest('.chip[data-cat]');
      if (c) {
        document.querySelectorAll('.chip').forEach(function (x) { x.classList.toggle('on', x === c); });
        document.querySelectorAll('#plist > [data-c]').forEach(function (w) { w.style.display = (!c.dataset.cat || w.dataset.c === c.dataset.cat) ? 'contents' : 'none'; });
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
    var f = $('#cf');
    if (f) f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#cn'), b = $('button', f), d = Object.fromEntries(new FormData(f).entries());
      n.className = 'note'; n.textContent = '';
      if (!d.name.trim() || !d.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { n.className = 'note err'; n.textContent = 'Please complete all fields with a valid email.'; return; }
      b.disabled = true; b.textContent = 'Sending\u2026';
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) { if (x.ok) { n.className = 'note ok'; n.textContent = 'Thank you! Your message was sent. I will reply soon.'; f.reset(); } else { n.className = 'note err'; n.textContent = x.j.error || 'Something went wrong. Please try again.'; } })
        .catch(function () { n.className = 'note err'; n.textContent = 'Network error. Please try again.'; })
        .then(function () { b.disabled = false; b.textContent = 'Send message'; });
    });
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .12 }) : null;
    document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
    setTimeout(function () { document.querySelectorAll('.bar b').forEach(function (b) { b.style.width = b.dataset.w + '%'; }); }, 250);
  }

  fetch('/api/site').then(function (r) { return r.json(); }).then(function (D) {
    var S = D.settings;
    var titles = { index: 'Home', about: 'About Me', skills: 'Skills & Certificates', portfolio: 'Portfolio', services: 'Services', contact: 'Contact' };
    document.title = (titles[page] || 'Portfolio') + ' | ' + S.name + ' \u00b7 ' + S.title.split('\u00b7')[0].trim();
    var m = document.querySelector('meta[name=description]'); if (m) m.setAttribute('content', S.tagline);
    $('#app').innerHTML = header(S) + '<main id="main">' + (R[page] || R.index)(D) + '</main>' + footer(S);
    wire(D);
  }).catch(function () {
    $('#app').innerHTML = '<main class="wrap" style="padding:80px 0"><h1>Something went wrong</h1><p>Please refresh the page.</p></main>';
  });
})();