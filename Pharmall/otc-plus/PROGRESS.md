# OTC Plus 페이지 진행 상황

> 매 세션 끝(`오늘 마침` / `오늘 마무리`)에 갱신. 다음 세션 시작(`이어서`)에 가장 먼저 읽는 파일.

## 마지막 작업 일자
2026-06-01

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
★ 1. **시드 데이터 → 페이지 박기** — `data/kakao-seeds.json` 의 5개 카테고리를 실제 페이지에 노출. selling_review 부터 시작 추천 (가장 임팩트 큼)
2. **detail.html 컨텍스트 추천** — "이 제품에 대해 묻기" 박스 (3~4개 deeplink: 사입가 추이 / 대체품 / 비교)
3. **list.html 카테고리 컨텍스트 트리거** — "이 카테고리 Agent 에게 묻기" 인라인
4. **ai.html 의 STEPS_MAP / ANSWERS 확장** — `kakao-seeds.json` 의 `otc_counseling` 으로 채움
5. **atglance 5개 lens 콘텐츠 채우기** — 환절기 / 사입가 / 셀링리뷰 ★ / 신제품 (현재 진통제만) → seeds 의 `otc_trend` 활용
6. **HERO 그 외 영역의 `Drug+` / `Agent` 표기 → 바로아이 통일** (banner-title, capability eyebrow, footer 등)

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
- 1400px 아래 추가 섹션 (오늘의 뉴스 / 학술 / 수강 후기 / 검색 TOP5 / 신규 약사 이벤트)
- HERO 슬라이드 인터랙션 (현재는 정적 1프레임 — JS 추가 필요)
- 매물 카드 / 강의 카드 thumb 실제 이미지로 교체 (현재는 CSS 그라데이션)
- Figma 디테일 추가 검수 (사용자가 "이미지랑 안 맞는다" 피드백 — 다음 세션에서 노드별로 비교 필요)

### 2026-05-28 마지막 (Figma 기준 재정렬)
사용자 피드백: 라이브 → Figma 기준으로 재구성. 이미지도 직접 채워.
- 좌측 섹션 변경: 이주의 품절 → HERO 슬라이드 / 강의+이벤트 → 개인화 카드 / 에듀+ → 뉴스 / 오픈+ 유지
- 우측 변경: 검색 TOP5 → 수강중 강의 + 강의 리뷰 (Figma 기준 R3, R4)
- 이미지 placeholder (`.ph-img`) 전부 실제 비주얼로 교체:
  - HERO art: 인라인 SVG (캡슐 + 돋보기 + 별)
  - 매물 thumb: CSS 그라데이션 3종 (geekblue/purple/magenta) + 우측 위치 pin 칩
  - 프로필 아바타: brand-pharmall→purple-6 그라디언트 + 글자 "약"
  - 수강중 강의 thumb: brand 그라디언트 + ▶ 플레이 버튼 + 라벨
- GNB cross-link 보강:
  - Pharmall index 의 OTC 플러스 → `otc-plus/index.html`
  - otc-plus 의 brand 로고 → `../index.html` (팜올 홈으로 복귀)

### URL (GitHub Pages)
- 팜올 홈: https://im-jin.github.io/baropharm-cart-floating-bar/Pharmall/
- OTC Plus: https://im-jin.github.io/baropharm-cart-floating-bar/Pharmall/otc-plus/

---

## ✨ 2026-05-29 — 컨텐츠 시드 추출 (카카오톡 → 페이지 데이터)

### 배경
- 페이지의 카피/질문/답변/셀링리뷰 멘트가 placeholder. 실제 약사 톤이 안 박혀서 신뢰감 약함.
- 소스: 바로팜 단톡방 카카오톡 export (`~/Downloads/KakaoTalkChats (1).txt`, 8개월치, 100,833 lines / 7.8MB)
- **OTC only 스코프** — ETC 처방룰/청구/마약류는 제외 (사용자 지시).

### 신규 파일
| 파일 | 용도 |
|------|------|
| `data/kakao-seeds.json` | 5개 카테고리 시드 (stockout / selling_price / selling_review / otc_counseling / otc_trend) — 익명화 완료 |
| `data/EXTRACT-NOTES.md` | 추출 방법론 + 익명화 룰 + 페이지 매핑 |

### 5개 카테고리
1. **stockout** — 품절/입고. OTC 17개 제품 명시. → atglance 수급 lens, 이주의 품절
2. **selling_price** — 셀링가 Q/A. 무조날s 15000 등 실제 가격대. → detail 셀링가 박스, ai.html 답변
3. **selling_review** ★ — 약사 권유 멘트 ("벤포벨 많이 추천 드립니다", "마진 보다는 유명품"). → CATEGORY × 셀링리뷰
4. **otc_counseling** — 손님 증상 → 일반약 추천 패턴. → HERO 추천 질문, ai.html STEPS_MAP
5. **otc_trend** — 방송 효과(글루타치온, 오메가), 시즌성, 신제품. → atglance 환절기/방송 lens

### 익명화 룰
- 발신자명 → 약사 A/B/C
- 약국명/전번/지역 삭제
- 환자 신원 일반화
- **이모지·말투 보존** (톤이 핵심)
- raw 카카오톡 파일은 git 제외 (~/Downloads/ 로컬만)

### 다음 (시드 → 페이지)
- selling_review 5개 멘트 → index.html CATEGORY × 셀링리뷰 placeholder 교체
- otc_counseling Q 4개 → index.html HERO 추천 질문 교체
- otc_counseling + selling_price → ai.html STEPS_MAP / ANSWERS 확장
- stockout 제품명 17개 → atglance 수급 lens + Pharmall/index.html 이주의 품절

---

## ✨ 2026-05-29 후반 — HERO + ai.html Agent 카톡 톤 통합 적용

### 변경 요약
1. **HERO 추천 질문 4개 + ai.html default prompts 4개 동기화** (카톡 톤 → 정제)
   - "타이레놀 500mg 10정, 약국 평균 판매가는?"
   - "콜대원 지명 손님께 같이 권할 OTC는?"
   - "이석증 손님께 권할 영양제는?"
   - "환절기 알러지·감기 일반약 라인업은?"
   - 정제 룰: 사적 호칭(`다들`/`있을까요?`/괄호) 제거, 끝 `~는?` 통일.

2. **ai.html ANSWERS 4개 시나리오 카톡 데이터 기반 통째 재작성**
   - tag / body / facts / guide / products / followups / source 전부 신 키 + 카톡 출처 매핑.
   - body 마다 `.ai-answer-kakao` 인용 단락 신규 (TIP 라벨 + brand-pharmall 좌측 보더, fill-tertiary 배경).
   - STEPS_MAP 분석 5단계도 카톡 톤("약사 가격 트렌드", "약사 추가권유 패턴" 등).
   - fallback 키 → `'타이레놀 500mg 10정, 약국 평균 판매가는?'`.

3. **셀링리뷰 카톡 인용** — index.html CATEGORY 섹션 1위/4위 quote 만 (게보린·애드빌·베아제는 카톡 데이터 부족으로 그대로).
   - `.rank-review-author` CSS 신규 (caption · text-tertiary).

4. **사이드바 히스토리 4개 동기화 + 클릭 작동**
   - 옛 5개 → 새 추천 4개 (data-q + 표시 텍스트). 클릭 시 ANSWERS 매칭으로 답변 swap.

5. **"단톡방" 단어 전수 정제 (17곳)** → "TIP" / "약사 사이" / "약사 트렌드" / "약사 카운슬링" 등.
   - 라벨: `<span class="ai-answer-kakao-label">단톡방에서도</span>` → `<span class="ai-answer-kakao-label">TIP</span>`.
   - 셀링리뷰 author: `— 약사 X · 단톡방 인용` → `— 약사 X · TIP`.
   - body/guide/source 내 "단톡방" 모두 톤 맞춰 재표현.

### 신규 CSS
- `.ai-answer-kakao` + `.ai-answer-kakao-label` (TIP 인용 박스, ai.html)
- `.rank-review-author` (셀링리뷰 출처 표기, index.html)

### 깨졌던 이슈 (해결됨)
- 로컬 서버 root 가 `/Pharmall` 이라 `../../tokens.css` 가 root 밖 → 404 → 전체 깨짐.
- 해결: 서버 root 를 `/Users/jin/claude/` 로 한 단계 올려 재시작. URL: `http://localhost:8088/Pharmall/otc-plus/...`.

## 다음에 들어갈 때 할 일 (재정렬)

### ★ 핵심 비전 (2026-05-29 사용자 전략 문서 반영)
**원칙**: AI 를 "따로 쓰는 기능" 으로 분리하면 실패. **기존 OTC 쇼핑/검색 흐름 안에 자연스럽게 끼어드는 보조 인터페이스** 가 정답.
- 절대 "ChatGPT 기반" X / "약사 커뮤니티 집단지성 기반" 으로 포지셔닝.
- "질문하세요" X / **상황 기반 액션 버튼** ("졸림 적은 제품 보기", "대체약 추천", "복약지도 보기", "응대 멘트") 으로.

### 적용 영역별 우선순위

★ 1. **검색 = 증상형 + 키워드 혼합형 AI 검색** (전략 4번)
   - HERO 인풋: "속쓰림", "졸리지 않은 감기약", "5세 기침약", "임산부 두통약", "편두통 OTC" 같은 증상 검색.
   - 검색창 추천어: "요즘 많이 찾는" / "약사 추천" / "품절 대체" / "소아 가능" / "임산부 가능".
   - 검색 결과 상단 AI 블록: 추천 제품 + 추천 조합 + 복약지도 + 주의사항.

★ 2. **상세 페이지 (detail.html) — 전환률 핵심** (전략 3번)
   - 제품명 아래 **AI 요약 박스** ("실제 약국에서 많이 추천", "졸림 문의 많음", "비염 환자 재구매 많음").
   - **AI 질문 자동 생성**: "이런 질문이 많았습니다" (임산부 가능? 졸린가요? 운전 가능? 어린이 가능? 공복 복용?) → 클릭 시 펼침 FAQ.
   - **"실전 약사 응대"** 박스 (가장 강력) — "식후 복용 추천", "졸릴 수 있어 밤 복용 권장", "3일 이상 지속되면 병원 권장" 등.

★ 3. **카테고리 페이지 (list.html) — 상단 Sticky AI Bar** (전략 1번)
   - "기침/가래용 추천받기", "코감기 조합 추천", "졸림 적은 감기약 찾기", "임산부 가능 제품 보기" 등 액션 버튼.

★ 4. **리스트 페이지 AI 요약 + 카드 배지** (전략 2번)
   - 리스트 상단: "약사님들이 이 카테고리에서 가장 많이 추천하는 조합" (타이레놀 + 판콜, 지르텍 + 하이로손).
   - 제품 카드 내부 [AI 추천] 배지: "졸림 적음" / "소아 상담 많음" / "편두통 환자 선호" / "재구매 높음" / "약사 추천 조합 존재".
   - Hover 시 "왜 추천되나요?" → AI 짧은 설명.

★ 5. **상세 페이지 우측 AI 채팅 사이드카** (전략 5번)
   - 같이 많이 판매되는 제품 / 병용 주의 / 실제 약사 상담 질문 / 추천 멘트 / 대체 제품 / 소아 가능 여부.

★ 6. **장바구니 AI** (전략 7번)
   - "이 증상엔 이것도 함께 많이 구매됩니다" — 연관 OTC 추천.

### TOP 5 핵심 기능 (전략 문서 기준)
1. 증상형 검색
2. 대체약 추천
3. 실제 약사 응대 멘트
4. 같이 판매되는 OTC 조합
5. 복약지도 자동 생성

### 그 외 남은 작업
- **검색 vs AI 검색 분리** — ~~HERO 듀얼 탭~~ → 인풋(자연어) Enter → search.html / 옆 ✨바로아이 검색 버튼 → ai.html 로 분기 적용 완료 (2026-06-01).
- **atglance 5개 lens 콘텐츠 채우기** — seeds 의 `otc_trend` / `stockout` 활용.
- **PROMPTS_BY_CTX variants (detail/list)** 도 카톡 톤으로 — 일관성.
- **셀링리뷰 게보린/애드빌/베아제** 자리 채우기 (카톡 추가 grep 으로 후보 확보 후).

---

## ✨ 2026-06-01 — search.html 신규 + AI 노출 전략 적용 (큰 step)

### A. HERO 바로아이 검색 CTA + 검색 분기
- HERO 인풋 옆 **✨ 바로아이 검색 버튼** (그라데이션 흐름 + light sweep + sparkle 떨림, button 안에서만).
- **chat 인풋 submit / 검색 아이콘** → `search.html?q=...` (일반 OTC 검색).
- **AI 버튼 클릭** → `ai.html?q=...` (자연어 AI 답변).
- HERO 시각 정제: XL 사이즈 (height ~56px), 인풋과 버튼 stretch.

### B. 추천 4개 → 별도 흰 바디 섹션
- "지금 약사님이 많이 궁금해해요!" `section-title` (font-display-5, 32/42 bold).
- 4개 prompt = 시드 카톡 톤 (타이레놀 판매가 / 콜대원 권유 / 이석증 영양제 / 환절기 라인업).
- prompt-list = container 풀 폭 (max-width 720 제거), 흰 카드 톤 (border-secondary).

### C. ai.html — summary + 사용자 히스토리 + 가짜답 자동
- **summary 필드** (한 줄 답) — 답변 본문 최상단 brand-pharmall 강조 박스. 4개 시나리오 + STARTER PACK 6세트 모두.
- **사용자 검색 히스토리 (sessionStorage)** — search → 더 깊이 묻기 / form submit / followup 클릭 시 자동 누적. 디폴트 4개 위에 prepend.
- **이벤트 위임** — 동적 히스토리 li 도 클릭 작동.
- **`makeGenericAnswer(q)` fallback** — ANSWERS 미정의 키도 자연스러운 framing 답 (DEMO 라벨 카톡 박스 + 시드 4개 안내).
- **답변 제품 카드 → 바로팜 직접 주문 deeplink** (`pharmallplus.com/search?q=<제품명>`, `target="_blank"`).

### D. search.html 신규 (검색.png 패턴 정확히 적용)
- list.html 베이스 + 검색 결과 헤더 (검색어 + N개 + 확장 칩).
- **3컬럼 카테고리 트리** (대/중/소분류) — 검색.png 패턴.
- **AI 분석 박스** (`search-ai-box`) — brand-pharmall-bg + 좌측 보더, "바로아이 분석" 태그 + 한 줄 요약 + TIP + 더 깊이 묻기 deeplink.
- 탭 (전체/보유/미구매), 카드 5개.
- **SEARCH_DB** (6 키워드: 타이레놀/위장약/감기/영양제/안약/콜대원) + **PRODUCTS** (15 제품) — 검색어 매칭으로 카테고리 트리/AI 박스/카드 일관 swap. 매칭 안 되면 generic.
- 인라인 JS — URL `?q=...` 받아 일관 갱신.

### E. 서브 페이지 floating dock → 홈 CTA 스타일 통일
- list/detail/search 의 floating-agent → linear-gradient 흐름 + 내부 light sweep + brightness hover.
- index.html 의 floating dock 제거 (HERO 에 CTA 있어 불필요).

### F. STARTER PACK 큐레이션 → 바로아이 가이드 (B 변형)
- 거짓 묶음 주문 ("▼ 5.8%" 사입가 절감) 제거 — 바로팜은 개별 코드 판매.
- 5세트 그리드 → 단일 .pack-guide 박스 5 row → **6 카드 3 col × 2 row** (안과 OTC 세트 신규 추가).
- 카드 클릭 → ai.html?q=세트별 응대 질의 → ANSWERS 6세트 시나리오 (실제 시드 기반 답).

### G. ANSWERS 4 → 10개 시나리오
| # | 키 | 카테고리 |
|---|---|---|
| 1 | 타이레놀 500mg 10정, 약국 평균 판매가는? | 가격 |
| 2 | 콜대원 지명 손님께 같이 권할 OTC는? | 셀링리뷰 |
| 3 | 이석증 손님께 권할 영양제는? | 카운슬링 |
| 4 | 환절기 알러지·감기 일반약 라인업은? | 시즌 |
| 5 | 개국 진통·해열 세트 | 큐레이션 |
| 6 | 개국 소화·위장 세트 | 큐레이션 |
| 7 | 환절기 감기·기침 세트 | 큐레이션 |
| 8 | 개국 외용·연고 세트 | 큐레이션 |
| 9 | 개국 비타민·영양 세트 | 큐레이션 |
| 10 | 개국 안과 OTC 세트 | 큐레이션 |

각 시나리오: tag / summary / body + TIP / facts 3 / guide 5 / products 3 / followups 3 / source.

### H. 시즌 추천 ETC → OTC 브랜드
- ETC 성분명(세티리진/로라타딘/슈도에페드린/클로르페니라민/펙소페나딘) → OTC 브랜드명 (지르텍/알레그라/케토핀프리/콜대원/판콜에이) 교체.

### I. cache buster
- `script.js?v=20260601a` — 4개 페이지. 브라우저 캐시 강제 갱신.

### 다음 step 후보 (우선순위)
★ 1. **detail.html "실전 약사 응대" 박스** — 카톡 시드 selling_review + counseling 그대로 박힘. 전환률 핵심.
2. **list.html 상단 Sticky AI Bar** + 카드 [AI 추천] 배지.
3. **PROMPTS_BY_CTX variants (detail/list)** 도 카톡 톤으로.
4. **atglance 5개 lens 콘텐츠 채우기** — seeds 의 `otc_trend` / `stockout` 활용.
5. **셀링리뷰 게보린/애드빌/베아제** 자리 채우기.
6. **LLM 연동** — Vercel Edge + Anthropic API (자유 질의 진짜 답).
