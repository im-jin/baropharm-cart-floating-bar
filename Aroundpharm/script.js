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
const LANG_FLAG = { ko: '한국어 🇰🇷', en: 'English 🇺🇸', zh: '中文 🇨🇳', ja: '日本語 🇯🇵' };

/* 환율 (한국 → 자국통화). 실시간 아닌 데모용 근사치. */
const FX_RATES = {
  en: { code: 'USD', symbol: '$', per_krw: 1 / 1380 },
  zh: { code: 'CNY', symbol: '¥', per_krw: 1 / 190 },
  ja: { code: 'JPY', symbol: '¥', per_krw: 1 / 9.2 },
};

const params = new URLSearchParams(location.search);
const _defaultProduct = document.body.dataset.defaultProduct || 'thome-cpr';
const productSlug = params.get('p') || _defaultProduct;
const _baseRaw = document.body.dataset.base || '';
const BASE = _baseRaw ? (_baseRaw.endsWith('/') ? _baseRaw : _baseRaw + '/') : '';

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

  /* 브랜드 컬러 적용 — body에 data-brand-id 셋팅 → CSS 변수가 받아 처리 */
  if (product.brand_id) {
    document.body.setAttribute('data-brand-id', product.brand_id);
  } else {
    document.body.removeAttribute('data-brand-id');
  }

  /* 핵심 성분 chips */
  const mountIngredients = document.getElementById('keyIngredients');
  if (mountIngredients) {
    mountIngredients.innerHTML = '';
    (product.key_ingredients || []).forEach(label => {
      const chip = document.createElement('span');
      chip.className = 'key-ingredient-chip';
      chip.textContent = label;
      mountIngredients.appendChild(chip);
    });
  }

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
      case 'price_fx': {
        const fx = FX_RATES[lang];
        if (fx && product.price_krw) {
          const v = product.price_krw * fx.per_krw;
          const rounded = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
          el.textContent = `≈ ${fx.symbol}${rounded.toLocaleString('en-US')}`;
        } else {
          el.textContent = '';
        }
        break;
      }
      case 'name_ko': el.textContent = (product.name && product.name.ko) || ''; break;
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
        if (product.hero_image) el.setAttribute('src', `${BASE}products/${product.id}/${product.hero_image}`);
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
      img.src = `${BASE}products/${product.id}/${src}`;
      img.loading = 'lazy';
      img.alt = '';
      t.appendChild(img);
      t.addEventListener('click', () => {
        strip.querySelectorAll('.thumb').forEach(x => x.removeAttribute('data-active'));
        t.setAttribute('data-active', 'true');
        const hero = document.querySelector('.hero-img');
        if (hero) hero.setAttribute('src', `${BASE}products/${product.id}/${src}`);
      });
      strip.appendChild(t);
    });
  }

  /* Detail-top video (video_display='detail-top') — 상세 탭 최상단 인라인 카드 */
  const detailVideoMount = document.getElementById('detailVideo');
  if (detailVideoMount) {
    detailVideoMount.innerHTML = '';
    if (product.video_display === 'detail-top' && product.pharmacist_video) {
      const v = document.createElement('video');
      v.className = 'detail-video-el';
      v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true; v.controls = true;
      v.preload = 'metadata';
      const src = document.createElement('source');
      src.src = `${BASE}products/${product.id}/${product.pharmacist_video}`;
      src.type = 'video/mp4';
      v.appendChild(src);
      detailVideoMount.appendChild(v);
      detailVideoMount.hidden = false;
    } else {
      detailVideoMount.hidden = true;
    }
  }

  /* v1 미디어 섹션 (약사 영상 / GIF) — pharmacist_video 없으면 숨김 */
  const pvBlock = document.querySelector('.pharmacist-video-block');
  if (pvBlock) {
    if (!product.pharmacist_video) {
      pvBlock.style.display = 'none';
    } else {
      pvBlock.style.display = '';
      const isGif = /\.gif$/i.test(product.pharmacist_video);
      const mediaUrl = `${BASE}products/${product.id}/${product.pharmacist_video}`;
      pvBlock.setAttribute('data-media', isGif ? 'gif' : 'video');

      /* 미디어 엘리먼트 (GIF=img / 영상=video) */
      const frame = pvBlock.querySelector('.pharmacist-video-frame');
      if (frame) {
        frame.innerHTML = '';
        if (isGif) {
          const img = document.createElement('img');
          img.className = 'pharmacist-video-el';
          img.src = mediaUrl;
          img.alt = '';
          img.loading = 'lazy';
          frame.appendChild(img);
        } else {
          const v = document.createElement('video');
          v.className = 'pharmacist-video-el';
          v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
          v.preload = 'metadata';
          const src = document.createElement('source');
          src.src = mediaUrl; src.type = 'video/mp4';
          v.appendChild(src);
          frame.appendChild(v);
          const muteBtn = document.createElement('button');
          muteBtn.className = 'pharmacist-video-mute';
          muteBtn.id = 'videoMute';
          muteBtn.setAttribute('aria-label', 'Toggle mute');
          muteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>';
          frame.appendChild(muteBtn);
        }
      }

      /* 헤더 — product.media 있으면 override, 없으면 i18n 기본값 유지 */
      const header = pvBlock.querySelector('.pharmacist-video-header');
      if (header && product.media) {
        const m = product.media;
        const mp = (o) => (o && (o[lang] || o.ko || o.en)) || '';
        const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
        header.classList.add('pharmacist-video-header--media');
        header.innerHTML = `
          <span class="pharmacist-video-eyebrow pharmacist-video-eyebrow--text">${esc(m.eyebrow || '')}</span>
          <h2 class="pharmacist-video-title">
            <span class="pv-title-top">${esc(mp(m.title_top))}</span>
            <span class="pv-title-main">${esc(mp(m.title_main))}</span>
          </h2>
          <p class="pharmacist-video-desc">${esc(mp(m.body)).replace(/\n/g, '<br>')}</p>
        `;
      }
    }
  }

  /* Hero media (v2): video if pharmacist_video exists, else hero image fallback */
  const heroMedia = document.getElementById('heroMedia');
  if (heroMedia) {
    // remove any existing media (video or img), keep overlays
    heroMedia.querySelectorAll('.video-hero-el, .video-hero-fallback').forEach(n => n.remove());
    if (product.pharmacist_video) {
      const v = document.createElement('video');
      v.className = 'video-hero-el';
      v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('aria-label', "Pharmacist's recommendation video");
      const src = document.createElement('source');
      src.src = `${BASE}products/${product.id}/${product.pharmacist_video}`;
      src.type = 'video/mp4';
      v.appendChild(src);
      heroMedia.prepend(v);
    } else {
      const img = document.createElement('img');
      img.className = 'video-hero-fallback';
      img.src = `${BASE}products/${product.id}/${product.hero_image}`;
      img.alt = pick(product.name);
      heroMedia.prepend(img);
      // hide mute button + author overlay if no video (irrelevant for static image)
      const muteBtn = document.getElementById('videoMute');
      if (muteBtn) muteBtn.style.display = 'none';
      const author = heroMedia.querySelector('.video-hero-author');
      if (author) author.style.display = 'none';
    }
  }

  /* Detail modules (per-language images, fallback to ko if user lang missing) */
  const mountDetail = document.getElementById('detailModules');
  if (mountDetail) {
    mountDetail.innerHTML = '';
    const mods = (product.detail_modules && (product.detail_modules[lang] || product.detail_modules.ko)) || [];
    if (mods.length === 0) {
      mountDetail.innerHTML =
        '<div class="detail-modules-placeholder">No detail images uploaded for this language yet.</div>';
    } else {
      mods.forEach(src => {
        const img = document.createElement('img');
        img.src = `${BASE}products/${product.id}/${src}`;
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

/* ─── LIVE widget (라이브쇼핑 스타일 떠있는 영상) + 풀스크린 모달 ─── */
function setupLiveWidget(product) {
  const widget = document.getElementById('liveWidget');
  const widgetVideo = document.getElementById('liveWidgetVideo');
  const expandBtn = document.getElementById('liveWidgetExpand');
  const closeBtn = document.getElementById('liveWidgetClose');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalCloseBtn = document.getElementById('videoModalClose');
  if (!widget || !widgetVideo) return;

  if (!product.pharmacist_video) {
    widget.hidden = true;
    return;
  }

  const videoSrc = `${BASE}products/${product.id}/${product.pharmacist_video}`;
  widgetVideo.src = videoSrc;
  if (modalVideo) modalVideo.src = videoSrc;
  widget.hidden = false;

  // Try autoplay (might be blocked on first paint; user gesture will recover)
  widgetVideo.play().catch(() => {});

  function openModal() {
    if (!modal || !modalVideo) return;
    modal.hidden = false;
    // sync time so modal continues from where widget was
    try { modalVideo.currentTime = widgetVideo.currentTime; } catch (_) {}
    modalVideo.muted = false;
    modalVideo.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal || !modalVideo) return;
    modal.hidden = true;
    modalVideo.pause();
    document.body.style.overflow = '';
  }

  expandBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    widget.hidden = true;
    widgetVideo.pause();
  });
  modalCloseBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });
}

/* ─── Related products (함께 쓰면 좋은 제품) ─── */
async function renderRelatedProducts(product, lang) {
  const section = document.getElementById('relatedProducts');
  const mount = document.getElementById('relatedScroll');
  if (!section || !mount) return;
  if (!product.related || product.related.length === 0) {
    section.hidden = true;
    return;
  }

  const fmtKrw = (n) => (n != null ? `₩${n.toLocaleString('en-US')}` : '');
  const pick = (obj) => (obj && obj[lang]) || (obj && obj.ko) || (obj && obj.en) || '';

  // load each related product's data.json in parallel
  const results = await Promise.allSettled(
    product.related.map(slug => loadJson(`${BASE}products/${slug}/data.json`))
  );

  const cards = [];
  results.forEach((res) => {
    if (res.status !== 'fulfilled') return;
    const p = res.value;
    const card = document.createElement('a');
    card.className = 'related-card';
    const u = new URL(location.href);
    u.searchParams.set('p', p.id);
    card.href = u.toString();

    card.innerHTML = `
      <div class="related-card-image">
        <img src="${BASE}products/${p.id}/${p.hero_image}" loading="lazy" alt="" />
      </div>
      <div class="related-card-body">
        <div class="related-card-brand">${p.brand || ''}</div>
        <div class="related-card-name"></div>
        <div class="related-card-price">
          ${p.discount_pct ? `<span class="related-card-discount">${p.discount_pct}%</span>` : ''}
          <span class="related-card-current">${fmtKrw(p.price_krw)}</span>
          ${p.price_original_krw ? `<span class="related-card-original">${fmtKrw(p.price_original_krw)}</span>` : ''}
        </div>
      </div>
    `;
    card.querySelector('.related-card-name').textContent = pick(p.name);
    cards.push(card);
  });

  if (cards.length === 0) {
    section.hidden = true;
    return;
  }
  mount.innerHTML = '';
  cards.forEach(c => mount.appendChild(c));
  section.hidden = false;
}

/* ─── SNS 인스타 릴스 (제품 정보 ↔ 탭 사이) ─── */
function renderSnsReels(product, lang, strings) {
  const section = document.getElementById('snsReels');
  const mount = document.getElementById('snsReelsScroll');
  if (!section || !mount) return;

  const reels = product.sns_videos || [];
  if (reels.length === 0) {
    section.hidden = true;
    return;
  }

  const pick = (obj) => (obj && obj[lang]) || (obj && obj[FALLBACK_LANG]) || (obj && obj.ko) || '';
  const snsStr = (strings && strings.sns) || {};

  /* 인스타 핸들 (아이브로우) */
  const handleEl = document.getElementById('snsHandle');
  if (handleEl) handleEl.textContent = product.instagram_handle || '@aroundpharm';

  /* "인스타에서 더 보기" 링크 — handle 우선, 없으면 첫 릴스 permalink */
  const moreLink = document.getElementById('snsReelsMore');
  if (moreLink) {
    const handleUrl = product.instagram_handle
      ? `https://www.instagram.com/${product.instagram_handle.replace(/^@/, '')}/`
      : null;
    moreLink.href = handleUrl || reels[0].permalink || 'https://www.instagram.com/';
  }

  /* 풀스크린 영상 모달 재사용 (video-modal) */
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalCloseBtn = document.getElementById('videoModalClose');
  function openModal(src) {
    if (!modal || !modalVideo) { return; }
    modalVideo.src = src;
    modalVideo.muted = false;
    modal.hidden = false;
    modalVideo.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal || !modalVideo) return;
    modal.hidden = true;
    modalVideo.pause();
    document.body.style.overflow = '';
  }
  /* 닫기 핸들러 — 약사영상 위젯이 없는 제품에서도 동작하도록 1회 바인딩 */
  if (modal && !modal.dataset.closeBound) {
    modal.dataset.closeBound = '1';
    modalCloseBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  mount.innerHTML = '';
  reels.forEach((reel) => {
    const src = `${BASE}products/${product.id}/${reel.video}`;
    const card = document.createElement('button');
    card.className = 'sns-reel';
    card.type = 'button';
    card.setAttribute('aria-label', pick(reel.caption) || 'Instagram reel');
    const viewsHtml = reel.views
      ? `<span class="sns-reel-views" aria-label="${reel.views} ${snsStr.views_suffix || ''}">
           <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
           ${reel.views}
         </span>`
      : '';
    const likesHtml = reel.likes
      ? `<span class="sns-reel-likes" aria-label="${reel.likes} ${snsStr.likes_label || ''}">
           <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"/></svg>
           ${reel.likes}
         </span>`
      : '';
    card.innerHTML = `
      <video class="sns-reel-video" autoplay muted loop playsinline preload="metadata"></video>
      <span class="sns-reel-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>
        </svg>
      </span>
      ${viewsHtml}
      <span class="sns-reel-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </span>
      <span class="sns-reel-foot">
        <span class="sns-reel-caption"></span>
        ${likesHtml}
      </span>
    `;
    const v = card.querySelector('.sns-reel-video');
    v.src = src;
    v.play().catch(() => {});
    card.querySelector('.sns-reel-caption').textContent = pick(reel.caption);
    card.addEventListener('click', () => openModal(src));
    mount.appendChild(card);
  });

  /* 좌우 화살표 (스와이프 + 클릭) */
  const prevBtn = document.getElementById('snsReelsPrev');
  const nextBtn = document.getElementById('snsReelsNext');
  function stepSize() {
    const first = mount.querySelector('.sns-reel');
    return first ? first.getBoundingClientRect().width + 12 : mount.clientWidth * 0.5;
  }
  function syncArrows() {
    const maxScroll = mount.scrollWidth - mount.clientWidth - 1;
    if (prevBtn) prevBtn.hidden = mount.scrollLeft <= 1;
    if (nextBtn) nextBtn.hidden = mount.scrollLeft >= maxScroll;
  }
  prevBtn?.addEventListener('click', () => mount.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
  nextBtn?.addEventListener('click', () => mount.scrollBy({ left: stepSize(), behavior: 'smooth' }));
  mount.addEventListener('scroll', syncArrows, { passive: true });
  syncArrows();

  section.hidden = false;
}

/* ─── Cart manager (localStorage) ─── */
const CART_KEY = 'ap_cart_v2';

function cartRead() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] };
  } catch (_) { return { items: [] }; }
}
function cartWrite(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  cartUpdateBadge();
}
function cartAdd(slug) {
  const c = cartRead();
  const it = c.items.find(x => x.slug === slug);
  if (it) it.qty += 1; else c.items.push({ slug, qty: 1 });
  cartWrite(c);
}
function cartUpdateQty(slug, qty) {
  const c = cartRead();
  const it = c.items.find(x => x.slug === slug);
  if (!it) return;
  if (qty <= 0) c.items = c.items.filter(x => x.slug !== slug);
  else it.qty = qty;
  cartWrite(c);
}
function cartRemove(slug) {
  const c = cartRead();
  c.items = c.items.filter(x => x.slug !== slug);
  cartWrite(c);
}
function cartTotalCount() {
  return cartRead().items.reduce((s, x) => s + x.qty, 0);
}
function cartUpdateBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const n = cartTotalCount();
  badge.textContent = n;
  badge.hidden = n === 0;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) { alert(msg); return; }
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => { t.hidden = true; }, 1800);
}

/* ─── Cart modal render ─── */
async function renderCartModal(strings, lang) {
  const cart = cartRead();
  const list = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const total = document.getElementById('cartTotal');
  const totalAmount = document.getElementById('cartTotalAmount');
  const stock = document.getElementById('cartStock');
  const foot = document.getElementById('cartFoot');
  if (!list) return;

  list.innerHTML = '';
  const items = cart.items || [];

  if (items.length === 0) {
    empty.hidden = false;
    total.hidden = true;
    stock.hidden = true;
    foot.hidden = true;
    return;
  }
  empty.hidden = true;

  // fetch product info for each item in parallel
  const products = await Promise.all(items.map(async (it) => {
    try {
      const p = await loadJson(`${BASE}products/${it.slug}/data.json`);
      return { ...it, product: p };
    } catch (_) { return null; }
  }));

  const pick = (obj) => (obj && obj[lang]) || (obj && obj.ko) || (obj && obj.en) || '';
  const fmtKrw = (n) => (n != null ? `₩${n.toLocaleString('en-US')}` : '');

  let sum = 0;
  products.forEach(entry => {
    if (!entry || !entry.product) return;
    const p = entry.product;
    const line = p.price_krw * entry.qty;
    sum += line;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-thumb">
        <img src="${BASE}products/${p.id}/${p.hero_image}" loading="lazy" alt="" />
      </div>
      <div class="cart-item-meta">
        <div class="cart-item-brand">${p.brand || ''}</div>
        <div class="cart-item-name"></div>
        <div class="cart-item-qty-row">
          <div class="cart-qty-stepper">
            <button data-qty-dec="${p.id}" aria-label="Decrease">−</button>
            <span class="cart-qty-val">${entry.qty}</span>
            <button data-qty-inc="${p.id}" aria-label="Increase">＋</button>
          </div>
          <button class="cart-item-remove" data-cart-remove="${p.id}">${strings.cart?.remove || '삭제'}</button>
        </div>
      </div>
      <div class="cart-item-price">${fmtKrw(line)}</div>
    `;
    li.querySelector('.cart-item-name').textContent = pick(p.name);
    list.appendChild(li);
  });

  totalAmount.textContent = fmtKrw(sum);
  total.hidden = false;
  stock.hidden = false;
  foot.hidden = false;

  /* 주변 약국 리스트 렌더 (i18n strings.cart.pharmacies) */
  const stockList = document.getElementById('cartStockList');
  if (stockList) {
    stockList.innerHTML = '';
    const pharmacies = (strings.cart && strings.cart.pharmacies) || [];
    pharmacies.forEach(ph => {
      const li = document.createElement('li');
      li.className = 'cart-stock-item';

      const stockKey = ph.stock === 'in' ? 'stock_in'
                      : ph.stock === 'partial' ? 'stock_partial'
                      : 'stock_out';
      const stockText = (strings.cart && strings.cart[stockKey]) || '';
      const stockClass = `cart-stock-status--${ph.stock}`;
      const youHereText = (strings.cart && strings.cart.you_are_here) || '';

      li.innerHTML = `
        <span class="cart-stock-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14">
            <circle cx="8" cy="8" r="8" fill="#3B82F6"/>
            <path d="M8 4v8M4 8h8" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          </svg>
        </span>
        <div class="cart-stock-info">
          <div class="cart-stock-row1">
            <span class="cart-stock-name"></span>
            ${ph.is_current ? `<span class="cart-stock-here-badge"></span>` : ''}
          </div>
          <div class="cart-stock-row2">
            <span class="cart-stock-status-open">${(strings.cart && strings.cart.open_now) || ''}</span>
            <span class="cart-stock-sep">·</span>
            <span>${(strings.cart && strings.cart.closes_at_19) || ''}</span>
          </div>
          <div class="cart-stock-row3">
            <strong>${ph.distance || ''}</strong>
            <span class="cart-stock-sep">·</span>
            <span class="cart-stock-addr"></span>
          </div>
          <div class="cart-stock-row4">
            <span class="cart-stock-status-badge ${stockClass}">${stockText}</span>
          </div>
        </div>
      `;
      li.querySelector('.cart-stock-name').textContent = ph.name || '';
      li.querySelector('.cart-stock-addr').textContent = ph.address || '';
      if (ph.is_current) {
        li.querySelector('.cart-stock-here-badge').textContent = youHereText;
      }
      stockList.appendChild(li);
    });
  }

  // wire qty/remove buttons
  list.querySelectorAll('[data-qty-inc]').forEach(b => b.addEventListener('click', () => {
    const slug = b.dataset.qtyInc;
    const c = cartRead();
    const it = c.items.find(x => x.slug === slug);
    if (it) { it.qty += 1; cartWrite(c); renderCartModal(strings, lang); }
  }));
  list.querySelectorAll('[data-qty-dec]').forEach(b => b.addEventListener('click', () => {
    const slug = b.dataset.qtyDec;
    const c = cartRead();
    const it = c.items.find(x => x.slug === slug);
    if (it) {
      it.qty -= 1;
      if (it.qty <= 0) c.items = c.items.filter(x => x.slug !== slug);
      cartWrite(c); renderCartModal(strings, lang);
    }
  }));
  list.querySelectorAll('[data-cart-remove]').forEach(b => b.addEventListener('click', () => {
    cartRemove(b.dataset.cartRemove);
    renderCartModal(strings, lang);
  }));
}

function setupCart(strings, lang) {
  const cartBtn = document.getElementById('cartBtn');
  const modal = document.getElementById('cartModal');
  const backdrop = document.getElementById('cartModalBackdrop');
  const closeBtn = document.getElementById('cartModalClose');

  cartUpdateBadge();

  // Sticky qty stepper
  const stickyQtyVal = document.getElementById('stickyQtyVal');
  let stickyQty = 1;
  function updateStickyQty() {
    if (stickyQtyVal) stickyQtyVal.textContent = stickyQty;
    document.querySelectorAll('[data-sticky-qty="dec"]').forEach(b => b.disabled = stickyQty <= 1);
  }
  document.querySelectorAll('[data-sticky-qty]').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.stickyQty === 'inc') stickyQty++;
      else if (b.dataset.stickyQty === 'dec' && stickyQty > 1) stickyQty--;
      updateStickyQty();
    });
  });
  updateStickyQty();

  // 담기 (add to cart) — sticky qty 만큼
  document.querySelectorAll('[data-action="addToCart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = _state.product?.id;
      if (!slug) return;
      const c = cartRead();
      const it = c.items.find(x => x.slug === slug);
      if (it) it.qty += stickyQty; else c.items.push({ slug, qty: stickyQty });
      cartWrite(c);
      const msg = (strings.cart?.added_n || '장바구니에 {n}개 담았어요').replace('{n}', stickyQty);
      showToast(msg);
      stickyQty = 1;
      updateStickyQty();
    });
  });

  // Cart icon → open modal
  if (cartBtn) cartBtn.addEventListener('click', () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    renderCartModal(strings, lang);
  });

  function close() {
    if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  }
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && !modal.hidden) close();
  });

  // Cart → 약사에게 보여주기 멀티 모달
  document.querySelectorAll('[data-action="showCartToPharmacist"]').forEach(btn => {
    btn.addEventListener('click', () => {
      openShowCartModal();
    });
  });

  // 약사 멀티 모달 닫기
  const showCartModal = document.getElementById('showCartModal');
  const showCartClose = document.getElementById('showCartModalClose');
  showCartClose?.addEventListener('click', () => {
    if (showCartModal) showCartModal.hidden = true;
    document.body.style.overflow = '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && showCartModal && !showCartModal.hidden) {
      showCartModal.hidden = true;
      document.body.style.overflow = '';
    }
  });
}

/* 약사 멀티 모달 열기 — 카트 내용 + 총액 + 약국 정보 */
async function openShowCartModal() {
  const modal = document.getElementById('showCartModal');
  const list = document.getElementById('showCartItems');
  const totalAmount = document.getElementById('showCartTotalAmount');
  const pharmacyNameEl = document.getElementById('showCartPharmacyName');
  if (!modal || !list) return;

  // 현재 약국 (is_current = true) i18n 데이터로 표시
  if (pharmacyNameEl && _state.strings?.cart?.pharmacies) {
    const current = _state.strings.cart.pharmacies.find(p => p.is_current) || _state.strings.cart.pharmacies[0];
    if (current) {
      pharmacyNameEl.textContent = `${current.name} · ${current.distance || ''}`;
    }
  }

  const cart = cartRead();
  const items = cart.items || [];
  if (items.length === 0) return;

  const products = await Promise.all(items.map(async (it) => {
    try {
      const p = await loadJson(`${BASE}products/${it.slug}/data.json`);
      return { ...it, product: p };
    } catch (_) { return null; }
  }));

  const pickKo = (obj) => (obj && obj.ko) || (obj && obj.en) || '';
  const fmtKrw = (n) => (n != null ? `₩${n.toLocaleString('en-US')}` : '');

  let sum = 0;
  list.innerHTML = '';
  products.forEach(entry => {
    if (!entry || !entry.product) return;
    const p = entry.product;
    const line = p.price_krw * entry.qty;
    sum += line;
    const li = document.createElement('li');
    li.className = 'show-cart-item';
    li.innerHTML = `
      <div class="show-cart-item-thumb">
        <img src="${BASE}products/${p.id}/${p.hero_image}" loading="lazy" alt="" />
      </div>
      <div>
        <div class="show-cart-item-name"></div>
        <div class="show-cart-item-price">${fmtKrw(p.price_krw)}</div>
      </div>
      <div class="show-cart-item-qty">×${entry.qty}</div>
    `;
    li.querySelector('.show-cart-item-name').textContent = pickKo(p.name);
    list.appendChild(li);
  });

  totalAmount.textContent = fmtKrw(sum);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  // 햅틱 (있으면)
  if (navigator.vibrate) navigator.vibrate(50);
}

/* ─── Show-to-pharmacist modal ─── */
function setupPharmacistModal(product, lang) {
  const modal = document.getElementById('pharmacistModal');
  const closeBtn = document.getElementById('pharmacistModalClose');
  const imgEl = document.getElementById('pharmacistModalImg');
  const qtyVal = document.getElementById('pharmacistQtyVal');
  const langFlag = document.getElementById('pharmacistLangFlag');
  if (!modal) return;

  if (imgEl && product.hero_image) {
    imgEl.src = `${BASE}products/${product.id}/${product.hero_image}`;
  }
  if (langFlag) langFlag.textContent = LANG_FLAG[lang] || lang;

  let q = 1;
  function updateQty() {
    if (qtyVal) qtyVal.textContent = q;
  }
  modal.querySelectorAll('[data-modal-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.modalQty === 'inc') q++;
      else if (btn.dataset.modalQty === 'dec' && q > 1) q--;
      updateQty();
    });
  });

  let wakeLock = null;
  async function open() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // haptic (best effort, mobile only)
    if (navigator.vibrate) navigator.vibrate(50);
    // wake lock — prevent screen dim while showing to pharmacist
    if ('wakeLock' in navigator) {
      try { wakeLock = await navigator.wakeLock.request('screen'); } catch (_) {}
    }
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (wakeLock) { try { wakeLock.release(); } catch (_) {} wakeLock = null; }
  }

  document.querySelectorAll('[data-action="showPharmacist"]').forEach(btn => {
    btn.addEventListener('click', open);
  });
  closeBtn?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
}

/* ─── Pharmacy map/list view toggle ─── */
function setupPharmacyToggle() {
  document.querySelectorAll('[data-toggle-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.toggleView; // 'map' or 'list'
      const tab = document.querySelector('.pharmacy-tab');
      if (tab) tab.setAttribute('data-view', next);
    });
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
      loadJson(`${BASE}i18n/${lang}.json`),
      loadJson(`${BASE}products/${productSlug}/data.json`)
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
    setupPharmacyToggle();
    setupLiveWidget(product);
    setupPharmacistModal(product, lang);
    setupCart(strings, lang);
    setupActions(strings);
    renderSnsReels(product, lang, strings);
    renderRelatedProducts(product, lang);
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
