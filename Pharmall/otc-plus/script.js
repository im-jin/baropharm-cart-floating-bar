/* ============================================================
 * Drug+ (OTC Plus) — Hero Agent demo interactions
 * - Prompt chip click → swap answer-preview Q/A (mock data)
 * - Chat form submit  → echo into preview as live demo
 * - Floating Agent    → scroll back to hero chat input
 * ============================================================ */

(function () {
  'use strict';

  /* QA dataset — OTC-only. 바로팜 4대 고유 데이터(수급/사입가/셀링리뷰/신제품)에서만 답변.
   * 기본 약물정보(성분·효능·DUR 단순 조회)는 의약품플러스(drug.pharmallplus.com)로 위임. */
  const QA = {
    '타이레놀 500mg 사입가 평균이 얼마야?':
      '심평원 등재 기준 사입가 범위는 <strong>최저 ₩280 ~ 최고 ₩340 / 정</strong> (평균 ₩312). ' +
      '바로팜 가입 약국의 최근 30일 실거래 평균은 <strong>평균 대비 -4.2%</strong>입니다. ' +
      '정확한 거래가 · 도매별 비교는 로그인 후 확인하실 수 있어요.' +
      '<span class="answer-source">출처: 심평원 약가 고시 · 바로팜 사입 DB · 2026.05</span>',

    '약사들이 가장 많이 추천한 종합감기약은?':
      '약사 28,400명이 평가한 종합감기약 셀링리뷰 TOP 5: ' +
      '<strong>판콜에이내복액 (★4.7) · 모드콜 (★4.6) · 화이투벤 (★4.5) · 펜잘콜드 (★4.4) · 콜대원 (★4.3)</strong>. ' +
      '키워드: "복용 편의" · "잘 듣는다" · "재구매 높음".' +
      '<span class="answer-source">출처: Sell+ 셀링리뷰 DB · 2026.05.27 기준 90일 누적</span>',

    '이번달 출시된 신제품 OTC 알려줘':
      '2026년 5월 신규 허가/출시 OTC 중 약사 평가 데이터가 쌓인 3종: ' +
      '<strong>아이로파인안약 (가렴증 안약) · 가스로엔정 (소화효소+천연제산제) · 비타뉴플러스 (활성형 비타민B군)</strong>. ' +
      '신제품 발견 슬롯에서 셀링리뷰 누적 추이까지 확인하실 수 있어요.' +
      '<span class="answer-source">출처: 식약처 허가 공시 + Sell+ 신제품 평가 · 2026.05</span>',

    '개국 약국용 진통제 세트 추천해줘':
      '개국 약국 진통제 진열 추천 세트 (셀링리뷰 + 회전율 기준): ' +
      '<strong>타이레놀정 500mg · 애드빌정 · 게보린정 · 펜잘큐정 · 사리돈에이</strong>. ' +
      '아세트아미노펜(타이레놀), 이부프로펜(애드빌), 복합 진통제 3종으로 일반 환자 응대 커버됩니다. ' +
      '바로팜 묶음 주문 시 사입가 평균 대비 -5.8%.' +
      '<span class="answer-source">출처: 개국 OTC 큐레이션 + Sell+ 회전율 데이터</span>',
  };

  const FALLBACK =
    '데모 화면에서는 위 추천 질문 중 하나를 눌러 주세요. ' +
    '실제 OTC Agent는 바로팜 수급/사입 DB · Sell+ 셀링리뷰 · 식약처 허가 공시에 연결돼 자유 질의를 처리합니다. ' +
    '기본 약물 정보(성분·효능·DUR 단순 조회)는 <a href="https://drug.pharmallplus.com/" target="_blank" rel="noopener">의약품플러스</a>에서 확인하세요.';

  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const chipsWrap = document.getElementById('promptChips');
  const floatingBtn = document.getElementById('floatingAgent');

  /* ai.html 로 진입 — context-aware 파라미터까지 전달
   * URL 컨트랙트:
   *   ai.html?q=<question>
   *           &ctx=<main|detail|list>
   *           &product=<sku-slug>   &product_name=<encoded>
   *           &category=<slug>      &category_name=<encoded>
   *           &back=<page-url>
   * ctx 인자는 (1) 명시적으로 넘기거나 (2) floating dock 의 data-* 에서 자동 추출 */
  function goToAi(q, ctxOverride) {
    const url = new URL('ai.html', window.location.href);
    if (q) url.searchParams.set('q', q);

    var ctx = ctxOverride || {};
    // floating dock 에 박힌 data-* 가 디폴트 컨텍스트
    if (!ctxOverride && floatingBtn && floatingBtn.dataset) {
      var d = floatingBtn.dataset;
      if (d.ctx) ctx.ctx = d.ctx;
      if (d.product) ctx.product = d.product;
      if (d.productName) ctx.product_name = d.productName;
      if (d.category) ctx.category = d.category;
      if (d.categoryName) ctx.category_name = d.categoryName;
    }
    // 자동: 현재 페이지 경로를 back 으로 (chip 클릭 시 복귀)
    if (ctx.ctx && !ctx.back) ctx.back = window.location.pathname.split('/').pop() || '';

    ['ctx','product','product_name','category','category_name','back'].forEach(function (key) {
      if (ctx[key]) url.searchParams.set(key, ctx[key]);
    });

    window.location.href = url.toString();
  }

  // 노출 (다른 스크립트가 직접 호출할 수 있게)
  window.OtcAi = { goToAi: goToAi };

  if (chipsWrap) {
    chipsWrap.addEventListener('click', function (e) {
      const row = e.target.closest('.prompt-row');
      if (!row) return;
      const q = row.dataset.q;
      if (!q) return;
      goToAi(q);
    });
  }

  /* 인풋 submit / 검색 아이콘 → search.html (일반 OTC 검색)
   * 바로아이 검색 버튼 → ai.html (AI 답변) */
  function goToSearch(q) {
    const url = new URL('search.html', window.location.href);
    if (q) url.searchParams.set('q', q);
    window.location.href = url.toString();
  }

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const v = (chatInput && chatInput.value || '').trim();
      goToSearch(v);
    });
  }

  const aiSearchCta = document.getElementById('aiSearchCta');
  if (aiSearchCta) {
    aiSearchCta.addEventListener('click', function () {
      const v = (chatInput && chatInput.value || '').trim();
      goToAi(v);
    });
  }

  // STARTER PACK 세트 카드 — 클릭 시 바로아이에게 세트 구성 질문
  document.querySelectorAll('.starter-cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const q = btn.dataset.q;
      if (q) goToAi(q);
    });
  });

  if (floatingBtn) {
    floatingBtn.addEventListener('click', function () {
      goToAi();
    });
  }
})();
