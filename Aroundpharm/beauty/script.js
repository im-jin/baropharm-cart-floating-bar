/* ─────────────────────────────────────────────────────────────
   Aroundpharm Beauty 홈 — 브랜드 카드 + 약사픽 제품 랭킹 렌더
   ───────────────────────────────────────────────────────────── */

/* 입점 브랜드 — 8종. page 있으면 상세로 연결, 없으면 입점 준비중 */
const BRANDS = [
  { id: 'thome',      name: 'THOME',      logo: 'images/logo-thome.png',      page: '../thome/' },
  { id: 'dr-melaxin', name: 'Dr.Melaxin', logo: 'images/logo-dr-melaxin.png', page: '../melaxin/' },
  { id: 're2o',       name: 'elravie',    logo: 'images/logo-re2o.png',       page: '../re2o/' },
  { id: 'juvelook',   name: 'juvelook',   logo: 'images/logo-juvelook.png' },
  { id: 'vt',         name: 'VT',         logo: 'images/logo-vt.png' },
  { id: 'asce',       name: 'Asce',       logo: 'images/logo-asce.png' },
  { id: 'onslo',      name: 'onslo',      logo: 'images/logo-onslo.png' },
  { id: 'koffer',     name: 'koffer',     logo: 'images/logo-koffer.png' }
];

/* 약사픽 랭킹 — 제품 slug + 소속 페이지 (랭킹 순서대로) */
const RANKING = [
  { slug: 'thome-cpr',          page: '../thome/' },
  { slug: 're2o-ampoule',       page: '../re2o/?p=re2o-ampoule' },
  { slug: 'dr-melaxin-cream',   page: '../melaxin/?p=dr-melaxin-cream' },
  { slug: 'dr-melaxin-serum',   page: '../melaxin/?p=dr-melaxin-serum' },
  { slug: 're2o-cream',         page: '../re2o/?p=re2o-cream' },
  { slug: 'dr-melaxin-eyecream',page: '../melaxin/?p=dr-melaxin-eyecream' },
  { slug: 're2o-bb',            page: '../re2o/?p=re2o-bb' }
];

async function loadJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed: ${path}`);
  return res.json();
}

function renderBrands() {
  const mount = document.getElementById('btBrands');
  if (!mount) return;
  mount.innerHTML = '';
  BRANDS.forEach(b => {
    const cell = document.createElement(b.page ? 'a' : 'button');
    cell.className = 'bt-brand-cell';
    if (b.page) {
      cell.href = b.page;
    } else {
      cell.type = 'button';
      cell.addEventListener('click', () => alert(`${b.name} — 입점 준비 중입니다.`));
    }
    cell.innerHTML = `<img src="${b.logo}" alt="${b.name}" loading="lazy" />`;
    mount.appendChild(cell);
  });
}

async function renderRanking() {
  const mount = document.getElementById('btRanking');
  if (!mount) return;

  const results = await Promise.all(RANKING.map(async (r) => {
    try {
      const p = await loadJson(`../products/${r.slug}/data.json`);
      return { ...r, product: p };
    } catch (_) { return null; }
  }));

  mount.innerHTML = '';
  let rank = 0;
  results.forEach(entry => {
    if (!entry || !entry.product) return;
    rank++;
    const p = entry.product;
    const name = (p.name && (p.name.ko || p.name.en)) || '';
    const li = document.createElement('li');
    li.className = 'bt-rank-card';

    const a = document.createElement('a');
    a.href = entry.page;
    a.style.display = 'contents';
    a.innerHTML = `
      <span class="bt-rank-num">${rank}</span>
      <span class="bt-rank-thumb">
        <img src="../products/${p.id}/${p.hero_image}" loading="lazy" alt="" />
      </span>
      <span class="bt-rank-info">
        <span class="bt-rank-brand">${p.brand || ''}</span>
        <span class="bt-rank-name">${name}</span>
        <span class="bt-rank-meta">
          <span class="bt-rank-star" aria-hidden="true">★</span>
          <span class="bt-rank-score">${p.rating ?? ''}</span>
          <span class="bt-rank-count">(${(p.review_count ?? 0).toLocaleString('en-US')})</span>
        </span>
      </span>
    `;
    li.appendChild(a);
    mount.appendChild(li);
  });
}

function setupActions() {
  const msg = {
    findPharmacy: '내 주변 어라운드팜 뷰티 약국 찾기 — 위치 권한 후 지도 노출 (데모)',
    sample: '샘플 신청 — 가까운 약국으로 발송 (데모)',
    inquiry: '브랜드 입점 문의 — 어라운드팜 뷰티 입점 상담 폼 (데모)',
    event: '이벤트 (데모)',
    my: '마이 페이지 (데모)',
    content: '건강 콘텐츠 상세 (데모)'
  };
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', (e) => {
      const act = el.dataset.action;
      if (act === 'ranking') {
        e.preventDefault();
        document.querySelector('.bt-section--ranking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (msg[act]) { e.preventDefault(); alert(msg[act]); }
    });
  });
}

async function boot() {
  try {
    renderBrands();
    await renderRanking();
    setupActions();
    document.body.removeAttribute('data-loading');
  } catch (err) {
    console.error(err);
    document.body.removeAttribute('data-loading');
  }
}

boot();
