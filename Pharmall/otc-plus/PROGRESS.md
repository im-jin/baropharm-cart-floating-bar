# OTC Plus 페이지 진행 상황

> 매 세션 끝(`오늘 마침` / `오늘 마무리`)에 갱신. 다음 세션 시작(`이어서`)에 가장 먼저 읽는 파일.

## 마지막 작업 일자
2026-05-28

## 현재 상태
- **4 페이지**: index.html / ai.html / list.html / detail.html
- **AI Agent 명: 바로아이 (Baro i)** — `images/baro-i.png` (블루 3D 로봇)
- floating dock 3 페이지 공통 전역 진입점 (`script.js` `goToAi()`)
- `images/baro-i.png` · `OTCplus_logo.svg` 자원 추가

## 오늘 한 일 (2026-05-28)
1. **바로아이 Agent 도입**
   - GNB 1번 항목 텍스트 → `OTCplus_logo.svg` 워드마크
   - GNB 모든 항목 opacity 1 고정 (`.gnb-item` opacity .75 / 트랜지션 제거)
   - floating-agent: SVG sun → **바로아이 아이콘** (40x40, 투명 배경, brand-pharmall pill)
   - ai.html: page title / eyebrow `BARO i · OTC AGENT` / 로딩 태그 `바로아이 분석중`

2. **index.html HERO — Plani 무드**
   - 타이틀 → 1줄 statement `약사의 시간을 아끼는 OTC 플러스.`
   - 서브 분리 (`.hero-statement-sub`) — "사입가·셀링리뷰·신제품·수급 — ..."
   - **댄싱 그라데이션 mesh**: 4 blob (brand-pharmall / purple-5 / blue-4 / geekblue-5) — blue 패밀리만, magenta/cyan/green 금지
   - 잉크 블룸 효과 (scale 1→1.3, opacity pulse, mix-blend-mode multiply, blur 120px)
   - topnav `background: transparent` + border-bottom 제거 → mesh 가 topnav 뒤로 bleed
   - hero `margin-top: -72px` 로 위로 bleed
   - hero 하단 220px 흰색 페이드 (`.hero-plani::after`) → 다음 섹션과 부드럽게 연결

3. **추천 질문 (HERO 아래)**
   - 단일 글래스 컨테이너로 묶음 (인풋과 친구처럼 붙는 패턴)
   - 4행 세로 + 행 간 얇은 divider
   - 폰트 b3 / weight 500 (h4-b 에서 죽임)
   - 시각 순서: **[arrow] · [chip] · [text]** (CSS order)

4. **섹션 재배치 (index)**
   - "한눈에 보는 OTC" (atglance) 섹션 헤더 분리 — num/title/sub 가 사이드바에서 빠져나와 섹션 상단 full-width
   - 타이틀 어순: `OTC 한눈에 보기` → **`한눈에 보는 OTC`**
   - 새 sub: "증상·계열로 보는 OTC, 약사 리뷰 키워드까지 한 화면에."
   - 섹션 순서: HERO → atglance → **CATEGORY × 셀링리뷰** → STARTER PACK → THIS MONTH → MIDDLE BANNER → CAPABILITIES → FOOTER
   - 타이레놀정 500mg 랭킹 row → `detail.html` 링크

5. **ai.html — 분석 인터랙션 전면 리뉴얼**
   - 옛 5줄 누적 스텝 폐기 → **단일 라인 텍스트 fade-cross** (스텝 사이 180ms 전환, 1100~1400ms 노출)
   - 스피너 폐기 → **연결된 블루 그라데이션 바 3개** (ai-검색중.png 패턴, 음수 delay 로 wave)
   - 답변 본문 **타이핑** (TreeWalker 로 text node 만 추출, 14ms/char, 공백은 빠르게)
   - 본문 끝나면 나머지 블록(facts/guide/products/followups) **JS 가 320ms 간격으로 `.is-shown` 부여** (CSS animation-delay 스태거는 동시 발사돼서 폐기)
   - `:not(.is-shown)` 으로 CSS 특이도 충돌 해결
   - 사용자 질문 버블: b3→**b2**, bg `fill-tertiary`→**`fill-secondary`** 한 톤 진하게

6. **ai.html 홈**
   - 카피 "OTC에 관한 무엇이든 물어보세요."
   - 화면 세로 가운데 (min-height: 100vh + flex-center)
   - 타이틀 60px → 28~40px
   - `.ai-search` fixed-bottom 제거 → inline 가운데 (채팅 진입 시엔 `.ai-chat-input` 가 바닥 고정)
   - LNB (검색/새대화/히스토리) 폰트 `caption` → **`b3`**
   - 사이드바 로고 24px → 26px height + width auto

7. **floating-agent dock 3 페이지 공통**
   - list.html / detail.html 에 dock + script.js 추가
   - script.js 의 `goToAi()` 가 어디서나 ai.html 로 진입

## 다음에 들어갈 때 할 일 (우선순위)
1. **detail.html 컨텍스트 추천** — "이 제품에 대해 묻기" 박스 (3~4개 deeplink: 사입가 추이 / 대체품 / 비교)
2. **list.html 카테고리 컨텍스트 트리거** — "이 카테고리 Agent 에게 묻기" 인라인
3. **ai.html 의 STEPS_MAP / ANSWERS 확장** — 사용자 임의 질문에도 대응 (현재 4개 prompt 한정)
4. **atglance 5개 lens 콘텐츠 채우기** — 환절기 / 사입가 / 셀링리뷰 ★ / 신제품 (현재 진통제만)
5. **HERO 그 외 영역의 `Drug+` / `Agent` 표기 → 바로아이 통일** (banner-title, capability eyebrow, footer 등)

---

## ✨ 2026-05-28 후반 — 팜올플러스 홈 (`/Pharmall/index.html`) 신규

- 신설 파일: `Pharmall/index.html`, `Pharmall/styles.css` (otc-plus 와 별도)
- 스코프: **above-the-fold 1400px** 만 (사용자 요청)
- 소스: **라이브 사이트 pharmallplus.com** (Figma `paHcO3Txnfb8yirTkkCCWA/20189-54400` 는 신규 리뉴얼 디자인이지만 라이브 카피가 더 정확해서 라이브 기준)
- 이미지는 `.ph-img` 점선 placeholder (파일명만 노출, 사용자가 직접 업데이트 예정)

### 구조 (좌 845 / 우 411)
**좌측 (4 섹션)**:
1. 이주의 품절 트렌드 — 탭(신규진입/장기전환/품절해소) + 5건 리스트
2. 이달의 강의 + 이벤트 — 2-col row
3. 에듀 플러스 — 강의 카드 3개
4. **오픈 플러스 + AI 진입 CTA** (★ 메인 → 오픈플러스 AI 동선의 핵심) — `openplus-ai.html` 로 deeplink, 매물 카드 6개 (3x2)

**우측 (3 블록, sticky)**:
1. 약사 프로필 카드
2. 퀵메뉴 4개 (받은제안서·매물관리·순수익·수강내역)
3. 의약품 검색 순위 TOP 5 — 탭(전문/일반) + 5건

### 디자인 결정
- GNB 동일 패턴 (OTC Plus 와 공유)
- 오픈플러스 AI CTA: brand-pharmall → purple-6 그라데이션 pill, 바로아이 아이콘 + "조건만 알려주세요 — AI 가 매물 골라드릴게요"
- 매물 카드 포맷: 라이브 그대로 (태그 + 위치 + 월조제/일매 + 매매가/임대보증금)
- 토큰만 사용, raw hex 금지 (예외: brand-pharmall 의 rgba alpha 변형)

### 다음 (팜올홈 후속)
- `openplus-ai.html` 신규 — OpenPlus AI 챗 페이지 (ai.html 패턴 재사용 가능)
- 1400px 아래 추가 섹션 (오늘의 뉴스 / 학술 / 수강 후기) — 사용자 우선순위 OK 시
- 이미지 실제 자산으로 교체 (사용자 직접)
