# OTC Plus 디자인 결정 (영속)

> 확정된 디자인 룰만 누적. 진행 중 / 미확정 사항은 PROGRESS.md.
> 모든 룰은 `images/` 폴더 레퍼런스에 근거.

## 레퍼런스 이미지 → 적용 영역 매핑
| 이미지 | 패턴 | 적용 위치 | 상태 |
|--------|------|----------|------|
| `images/OTC 한눈에 보기.png` | 좌사이드+우 큰타이틀+두 흰카드(랭킹) | OTC 한눈에 보기 (atglance) | ✅ 적용 |
| `images/성분별순위.png` | 좌측 stroke형 랭킹 / 우측 차트·카드 | (참고용 — atglance에 일부 영감만) | 참고 |
| `images/home.png` | 전체 페이지 frame / 섹션 위계 | 전 페이지 | 참고 |
| `images/home_category.png` | 카테고리 그리드 (아이콘+라벨) | CATEGORY 섹션 | ✅ 적용 |
| `images/리스트.png` | 탭 + 항목 카드 (좌측 NUM 박스) | CATEGORY 제품 리스트 / list.html | ✅ 적용 |
| `images/검색.png` | 다단 필터 / 탭 그룹 | (예정) 검색 결과 | 예정 |
| `images/상세.png` | 좌 상세 / 우 사이드 / 큰 제품 영역 | detail.html | ✅ 적용 |
| `images/이번달신제품.png` | 가로 스크롤 카드 그리드 | THIS MONTH 섹션 | ✅ 적용 |
| `images/ai-홈.png` / `ai-검색중.png` / `ai-추천문장검색결과.png` / `ai-사용자입력검색결과.png` | AI 챗 페이지 모든 상태 | ai.html | ✅ 적용 |
| `images/baro-i.png` | 바로아이 (Baro i) 마스코트 | 모든 Agent 진입점 | ✅ 적용 |

## 확정 룰

### Ranking 컴포넌트 (`.rank-stroke` / `.atglance-rank-block`)
- 그룹은 **흰 카드** (radius-lg, border-secondary, padding 28x24).
- 항목 = `28px 동그라미 숫자 / 키워드 / 트렌드 인디케이터` 그리드.
- **1위 동그라미만 brand solid + 흰 숫자**, 2~10위는 fill-tertiary 회색 동그라미.
- 항목 컨테이너는 라운드 pill (`var(--radius-pill)`), 평상시 보더 투명.

### Active 상태 (랭킹 / 일반 인터랙티브 항목 공통)
- ❌ Solid fill 배경.
- ✅ **항목 전체를 둘러싸는 stroke pill border** (1.5px brand-pharmall). 흰 배경 유지.
- 좌측 좁은 띠 (border-left 3px) 패턴은 폐기 — 정답 이미지 `OTC 한눈에 보기.png` 와 다름.

### 트렌드 인디케이터
- 상승: `var(--color-volcano-7)` + `▲ N`
- 하락: `var(--color-cyan-8)` + `▼ N`
- 변동없음: `var(--color-text-tertiary)` + `-`
- 배경 없이 텍스트만 (volcano-1 / cyan-1 칩 패턴은 다른 곳에서만 사용).

### Agent (바로아이 / Baro i)
- 이름: **바로아이 (영문 표기: Baro i)**
- 마스코트: `images/baro-i.png` — 블루 3D 로봇
- 진입점: 모든 페이지(index/list/detail)의 **우하단 floating dock** (brand-pharmall pill, 아이콘 투명 배경, "바로아이에게 묻기")
- ai.html 내부 표기:
  - eyebrow: `BARO i · OTC AGENT` + 28px 아이콘
  - 분석 중 태그: `바로아이 분석중` + 20px 아이콘
- script.js `goToAi(q?)` 가 단일 진입 함수 (q 있으면 deeplink, 없으면 ai 홈)

### AI 분석 인터랙션 (ai.html)
- 분석 텍스트: **단일 라인 fade-cross** (5스텝, 1100~1400ms 노출, 180ms 전환). 누적 리스트 X.
- 분석 wave: **연결된 블루 그라데이션 바 3개** (blue-2 base → blue-4 peak, 2.4s linear, 음수 delay 로 위→아래 연결 wave). ai-검색중.png 패턴.
- 답변 본문: **타이핑** (TreeWalker, 14ms/char, 공백 빠름, last `<p>` 에 깜빡이는 caret).
- 본문 끝나면 나머지 블록: **JS 가 320ms 간격으로 `.is-shown` 부여**. CSS animation-delay 스태거는 동시 발사돼서 폐기. `:not(.is-shown)` 으로 특이도 충돌 회피.
- 사용자 질문 버블: `font-b2` + `fill-secondary` (회색 한 톤 진하게).

### HERO (index.html) — Plani 무드
- 1줄 statement (`약사의 시간을 아끼는 OTC 플러스.`) + 별도 sub (`hero-statement-sub`).
- 배경: **블루 패밀리만 4 blob mesh** (brand-pharmall / purple-5 / blue-4 / geekblue-5). magenta/cyan/green 금지.
- 잉크 블룸 효과: scale 1→1.3 pulse, opacity 0.24→0.42 변동, mix-blend-mode multiply, blur 120px, 22~32s 주기.
- 단절 방지:
  - `.topnav { background: transparent; border-bottom: 0 }` — mesh 가 topnav 뒤로 흐름
  - `.hero-plani { margin-top: -72px }` + hero-inner padding-top: 160px
  - `.hero-plani::after` 220px 흰색 페이드 → 다음 흰 섹션과 부드럽게 연결

### 추천 질문 리스트 (HERO 아래 / ai.html 홈)
- **단일 글래스 컨테이너** (rgba 0.80 white + blur 14px + soft shadow). 인풋과 같은 톤으로 친구처럼 붙는 패턴.
- 4행 세로, 행 간 얇은 1px divider (rgba 0.05).
- 항목 폰트: `b3` weight 500. h4-b 같은 큰 폰트 금지.
- 시각 순서 (CSS order): **[arrow] · [chip] · [text]**.
- hover: 행 배경 brand 옅은 틴트 + arrow 우측 시프트.

### 색상 / 타이포 / 토큰
- 모든 색은 `../../tokens.css` 의 `var(--*)` 사용. raw hex 금지.
- 강조 brand color = `--color-brand-pharmall`.
- 모든 font 는 `var(--font-*)` 단축 속성. raw `font-size`/`font-weight` 단독 사용 지양.
- HERO mesh 등에서 raw `rgba(47, 84, 235, x)` 는 brand-pharmall 의 alpha 변형이라 예외 허용. (다만 토큰화 검토 필요)

### Section 헤더 패턴 (atglance 등)
- num/title/sub 가 사이드바에 묻히지 않게 **section 상단 full-width 헤더**로 분리.
- 그 아래 grid (사이드바 + 메인) 로 컨텐츠 배치.
- 예: `.atglance-head` → `.atglance` (grid)
