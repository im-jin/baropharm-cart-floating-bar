/* ─────────────────────────────────────────────────────────────
   Aroundpharm — QR pharmacy-shelf landing
   - Language: auto-detect (navigator.language) → ko/en/zh/ja (en fallback)
   - Override: ?lang=xx  (highest priority) or localStorage
   - Loads i18n/<lang>.json + products/<slug>/data.json
   - 원본 어라운드팜 상세 + 리뷰 필터 4종(피부타입/연령대/고민/지역)
   ───────────────────────────────────────────────────────────── */

const SUPPORTED_LANGS = ['ko', 'en', 'zh', 'ja'];
const FALLBACK_LANG = 'en';
const LANG_LABEL = { ko: '한국어', en: 'EN', zh: '中文', ja: '日本語' };

const params = new URLSearchParams(location.search);
const productSlug = params.get('p') || 'thome-cpr';

let _state = { sort: 'latest', photoOnly: false, product: null, strings: null, lang: 'en' };

function detectLang() {
  const qp = params.get('lang');
  if (qp && SUPPORTED_LANGS.includes(qp)) return qp;
  const stored = localStorage.getItem('ap_lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const navLang = (navigator.language || 'en').split('-')[0].toLowerCase();
  if (SUPPORTED_LANGS.includes(navLang)) return navLang;
  return FALLBACK_LANG;
}

async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

function bindI18n(strings) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o, k) => (o ? o[k] : undefined), strings);
    if (typeof val === 'string') el.textContent = val;
  });
}

function bindProduct(product, lang) {
  const pick = (obj) => (obj && obj[lang]) || (obj && obj[FALLBACK_LANG]) || '';
  const fmtKrw = (n) => (n != null ? `₩${n.toLocaleString('en-US')}` : '');

  document.querySelectorAll('[data-product]').forEach(el => {
    const key = el.getAttribute('data-product');
    switch (key) {
      case 'brand': el.textContent = product.brand || ''; break;
      case 'name': el.textContent = pick(product.name); break;
      case 'tagline': el.textContent = pick(product.tagline); break;
      case 'discount':
        el.textContent = product.discount_pct ? `${product.discount_pct}%` : '';
        break;
      case 'price': el.textContent = fmtKrw(product.price_krw); break;
      case 'price_original':
        el.textContent = product.price_original_krw ? fmtKrw(product.price_original_krw) : '';
        break;
      case 'rating': el.textContent = (product.rating ?? '').toString(); break;
      case 'review_count':
        el.textContent = product.review_count
          ? `(${product.review_count.toLocaleString('en-US')})` : '';
        break;
      case 'review_count_raw':
        el.textContent = product.review_count
          ? product.review_count.toLocaleString('en-US') : '0';
        break;
      case 'hero':
        if (product.hero_image) el.setAttribute('src', `products/${product.id}/${product.hero_image}`);
        el.setAttribute('alt', pick(product.name));
        break;
    }
  });

  /* Thumb strip */
  const strip = document.getElementById('thumbStrip');
  if (strip) {
    strip.innerHTML = '';
    (product.thumbnails || [product.hero_image]).forEach((src, i) => {
      const t = document.createElement('div');
      t.className = 'thumb';
      if (i === 0) t.setAttribute('data-active', 'true');
      const img = document.createElement('img');
      img.src = `products/${product.id}/${src}`;
      img.loading = 'lazy';
      img.alt = '';
      t.appendChild(img);
      t.addEventListener('click', () => {
        strip.querySelectorAll('.thumb').forEach(x => x.removeAttribute('data-active'));
        t.setAttribute('data-active', 'true');
        const hero = document.querySelector('.hero-img');
        if (hero) hero.setAttribute('src', `products/${product.id}/${src}`);
      });
      strip.appendChild(t);
    });
  }

  /* Detail modules (per-language images) */
  const mountDetail = document.getElementById('detailModules');
  if (mountDetail) {
    mountDetail.innerHTML = '';
    const mods = (product.detail_modules && product.detail_modules[lang]) || [];
    if (mods.length === 0) {
      mountDetail.innerHTML =
        '<div class="detail-modules-placeholder">No detail images uploaded for this language yet.</div>';
    } else {
      mods.forEach(src => {
        const img = document.createElement('img');
        img.src = `products/${product.id}/${src}`;
        img.loading = 'lazy';
        img.alt = '';
        mountDetail.appendChild(img);
      });
    }
  }
}

/* ─── Review stats (피부타입 / 연령대 / 피부고민 / 지역) ─── */
function renderReviewStats(product, strings) {
  const root = document.getElementById('reviewStats');
  if (!root || !product.review_stats) return;
  root.innerHTML = '';

  const categories = ['skin_type', 'age_group', 'concerns', 'region'];

  categories.forEach(cat => {
    const data = product.review_stats[cat];
    if (!data) return;

    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return;

    const group = document.createElement('div');
    group.className = 'stat-group';

    const title = document.createElement('div');
    title.className = 'stat-group-title';
    title.textContent = strings.review.filters[cat] || cat;
    group.appendChild(title);

    const bars = document.createElement('div');
    bars.className = 'stat-bars';

    const COLLAPSED_LIMIT = 3;

    entries.forEach(([key, pct], i) => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      if (i === 0 && pct > 0) row.setAttribute('data-leader', 'true');
      if (i >= COLLAPSED_LIMIT) row.setAttribute('data-collapsed', 'true');

      const label = (strings.review[cat] && strings.review[cat][key]) || key;

      const labelEl = document.createElement('span');
      labelEl.className = 'stat-label';
      labelEl.textContent = label;

      const barEl = document.createElement('span');
      barEl.className = 'bar';
      const inner = document.createElement('i');
      inner.style.setProperty('--p', `${pct}%`);
      barEl.appendChild(inner);

      const valEl = document.createElement('span');
      valEl.className = 'stat-val';
      valEl.textContent = `${pct}%`;

      row.append(labelEl, barEl, valEl);
      bars.appendChild(row);
    });

    group.appendChild(bars);

    /* 펼쳐보기 / 접기 토글 */
    if (entries.length > COLLAPSED_LIMIT) {
      const btn = document.createElement('button');
      btn.className = 'stat-expand';
      btn.setAttribute('type', 'button');
      const lbl = document.createElement('span');
      lbl.textContent = strings.review.expand || '펼쳐보기';
      const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      caret.setAttribute('viewBox', '0 0 12 12');
      caret.setAttribute('width', '10');
      caret.setAttribute('height', '10');
      caret.setAttribute('fill', 'currentColor');
      caret.innerHTML = '<path d="M2 4l4 4 4-4z"/>';
      btn.append(lbl, caret);
      btn.addEventListener('click', () => {
        const expanded = group.classList.toggle('is-expanded');
        lbl.textContent = expanded
          ? (strings.review.collapse || '접기')
          : (strings.review.expand || '펼쳐보기');
      });
      group.appendChild(btn);
    }

    root.appendChild(group);
  });
}

/* ─── Quantity stepper (PC order block) ─── */
function setupQuantity(product) {
  const decBtn = document.querySelector('[data-qty="dec"]');
  const incBtn = document.querySelector('[data-qty="inc"]');
  const qtyVal = document.getElementById('qtyVal');
  const totalQty = document.getElementById('totalQty');
  const linePrice = document.getElementById('qtyLinePrice');
  const totalPrice = document.getElementById('totalPrice');
  if (!decBtn || !incBtn || !qtyVal) return;

  const unitPrice = product.price_krw || 0;
  let q = 1;

  const fmt = (n) => `₩${n.toLocaleString('en-US')}`;
  const update = () => {
    qtyVal.textContent = q;
    if (totalQty) totalQty.textContent = q;
    if (linePrice) linePrice.textContent = fmt(unitPrice * q);
    if (totalPrice) totalPrice.textContent = fmt(unitPrice * q);
    decBtn.disabled = q <= 1;
  };

  decBtn.addEventListener('click', () => { if (q > 1) { q--; update(); } });
  incBtn.addEventListener('click', () => { q++; update(); });
  update();
}

/* ─── Video mute toggle ─── */
function setupVideoMute() {
  const btn = document.getElementById('videoMute');
  const video = document.querySelector('.pharmacist-video-el');
  if (!btn || !video) return;
  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    const icon = btn.querySelector('svg');
    if (icon) {
      icon.setAttribute('data-state', video.muted ? 'muted' : 'unmuted');
      icon.innerHTML = video.muted
        ? '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/>'
        : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 4v2.5a6.5 6.5 0 0 1 0 11V20a8.5 8.5 0 0 0 0-16z"/>';
    }
  });
}

/* ─── Review cards ─── */
function renderReviews() {
  const { product, strings, lang, sort, photoOnly } = _state;
  const list = document.getElementById('reviewList');
  if (!list || !product?.reviews) return;
  list.innerHTML = '';

  let sorted = [...product.reviews];
  if (sort === 'latest') sorted.sort((a, b) => b.date.localeCompare(a.date));
  else if (sort === 'popular') sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  else if (sort === 'rating_high') sorted.sort((a, b) => b.rating - a.rating);
  else if (sort === 'rating_low') sorted.sort((a, b) => a.rating - b.rating);

  if (photoOnly) sorted = sorted.filter(r => r.photo);

  if (sorted.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = strings.review?.no_reviews || 'No reviews';
    list.appendChild(empty);
    return;
  }

  sorted.forEach(r => {
    const li = document.createElement('li');
    li.className = 'review-card';

    const ageLabel = (strings.review.age_group && strings.review.age_group[r.age_group]) || '';
    const skinLabel = (strings.review.skin_type && strings.review.skin_type[r.skin_type]) || '';
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const text = (r.text && (r.text[lang] || r.text[FALLBACK_LANG])) || '';

    // head
    const head = document.createElement('div');
    head.className = 'review-card-head';
    const user = document.createElement('div');
    user.className = 'review-user';
    const userName = document.createElement('span');
    userName.className = 'review-user-name';
    userName.textContent = r.user || '';
    user.appendChild(userName);
    if (ageLabel) {
      const c = document.createElement('span');
      c.className = 'review-meta-chip';
      c.textContent = ageLabel;
      user.appendChild(c);
    }
    if (skinLabel) {
      const c = document.createElement('span');
      c.className = 'review-meta-chip';
      c.textContent = skinLabel;
      user.appendChild(c);
    }
    const ratingEl = document.createElement('span');
    ratingEl.className = 'review-rating-stars';
    ratingEl.textContent = stars;
    head.append(user, ratingEl);
    li.appendChild(head);

    // concerns
    if (r.concerns && r.concerns.length) {
      const wrap = document.createElement('div');
      wrap.className = 'review-concerns';
      r.concerns.forEach(c => {
        const tag = document.createElement('span');
        tag.className = 'review-concern-tag';
        tag.textContent = `#${(strings.review.concerns && strings.review.concerns[c]) || c}`;
        wrap.appendChild(tag);
      });
      li.appendChild(wrap);
    }

    // text
    const textEl = document.createElement('div');
    textEl.className = 'review-text';
    textEl.textContent = text;
    li.appendChild(textEl);

    // photo
    if (r.photo) {
      const photoEl = document.createElement('div');
      photoEl.className = 'review-photo';
      const img = document.createElement('img');
      img.src = `products/${product.id}/${r.photo}`;
      img.loading = 'lazy';
      img.alt = '';
      photoEl.appendChild(img);
      li.appendChild(photoEl);
    }

    // footer
    const footer = document.createElement('div');
    footer.className = 'review-footer';
    const likes = document.createElement('span');
    likes.className = 'review-likes';
    likes.textContent = `👍 ${strings.review?.likes || 'Helpful'} ${r.likes ?? 0}`;
    const date = document.createElement('span');
    date.textContent = r.date || '';
    footer.append(likes, date);
    li.appendChild(footer);

    list.appendChild(li);
  });
}

/* ─── Sort tabs ─── */
function setupSortTabs() {
  document.querySelectorAll('.sort-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sort-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      _state.sort = tab.dataset.sort;
      renderReviews();
    });
  });
}

/* ─── Photo-only toggle ─── */
function setupPhotoToggle() {
  const cb = document.getElementById('photoOnly');
  if (!cb) return;
  cb.addEventListener('change', () => {
    _state.photoOnly = cb.checked;
    renderReviews();
  });
}

/* ─── Tab switching ─── */
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      panels.forEach(p => {
        const active = p.dataset.panel === id;
        p.classList.toggle('is-active', active);
        p.hidden = !active;
      });
      const tabsBar = document.querySelector('.tabs');
      if (tabsBar) {
        const top = tabsBar.getBoundingClientRect().top + window.scrollY - 52;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ─── Lang switcher ─── */
function setupLangSwitcher(activeLang, onChange) {
  const btn = document.getElementById('langSwitcher');
  const menu = document.getElementById('langMenu');
  const label = document.querySelector('[data-lang-label]');
  label.textContent = LANG_LABEL[activeLang] || activeLang.toUpperCase();

  menu.querySelectorAll('li[data-lang]').forEach(li => {
    li.setAttribute('aria-selected', li.dataset.lang === activeLang ? 'true' : 'false');
    li.addEventListener('click', () => {
      const next = li.dataset.lang;
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      if (next !== activeLang) onChange(next);
    });
  });

  btn.addEventListener('click', () => {
    const open = !menu.hidden;
    menu.hidden = open;
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ─── Action handlers ─── */
function setupActions(strings) {
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.dataset.action;
      if (action === 'save') {
        alert(strings.alerts?.saved || 'Saved.');
      } else if (action === 'shop') {
        window.location.href = strings.urls?.shop || 'https://aroundpharm.com';
      } else if (action === 'getApp') {
        window.location.href = strings.urls?.app_store || 'https://aroundpharm.com';
      } else if (action === 'findPharmacy') {
        alert(strings.alerts?.find_pharmacy || 'Opening pharmacy finder…');
      }
    });
  });
}

async function boot() {
  const lang = detectLang();
  document.documentElement.lang = lang;
  localStorage.setItem('ap_lang', lang);

  try {
    const [strings, product] = await Promise.all([
      loadJson(`i18n/${lang}.json`),
      loadJson(`products/${productSlug}/data.json`)
    ]);

    _state = { sort: 'latest', photoOnly: false, product, strings, lang };

    bindI18n(strings);
    bindProduct(product, lang);
    renderReviewStats(product, strings);
    renderReviews();
    setupTabs();
    setupSortTabs();
    setupPhotoToggle();
    setupVideoMute();
    setupQuantity(product);
    setupActions(strings);
    setupLangSwitcher(lang, (next) => {
      localStorage.setItem('ap_lang', next);
      const u = new URL(location.href);
      u.searchParams.set('lang', next);
      location.replace(u.toString());
    });

    document.body.removeAttribute('data-loading');
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `<div style="padding:40px;text-align:center;color:#999;">Failed to load. ${err.message}</div>`;
  }
}

boot();
