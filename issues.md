# Design System Token Issues

24개 컴포넌트(`get_variable_defs` 기준)를 분석하면서 **디자인 시스템 라이브러리에 등록되지 않은 raw 값** 또는 **잘못된 값을 가진 변수 사용**이 발견된 노드들의 목록입니다.

이 항목들은 `tokens.css` / `tokens.js`에는 포함시키지 않았습니다 — 디자이너 측에서 컴포넌트를 디자인 시스템 변수로 다시 바인딩하는 정리가 필요합니다.

Figma fileKey: `8JV1QkzSuEpZEMtLiLQYYv`

---

## 1. Legacy Gray / Red 스케일 (디자인 시스템 통합 전 잔재)

현재 디자인 시스템에는 `Colors/grey/1~10`이 정식 토큰으로 존재하는데, 일부 컴포넌트가 구버전 grey 스케일을 그대로 사용 중입니다.

### 발견 노드
- `8932:3149` — 이 한 노드에서 모든 legacy gray 변수가 발견됨

### 비표준 변수 → 권장 대체 토큰
| Legacy variable | Hex | 권장 대체 |
|---|---|---|
| `Gray/Gray_01` | `#1E1E1E` | `--color-grey-10` (#141414) 또는 `--color-text` 검토 |
| `Gray/100(배경 Default, 디바이더L)` | `#F5F5F5` | `--color-grey-2` |
| `Gray/200(디바이더S,아웃라인)` | `#EEEEEE` | `--color-grey-3` 근사 |
| `Gray/500(설명 및 비활성화 텍스트)` | `#9E9E9E` | `--color-grey-6` 근사 |
| `gray-20` | `#E1E1E1` | `--color-grey-4` 근사 |
| `gray-75` | `#6C6C6C` | `--color-grey-8` 근사 |
| `gray-90` | `#3D3D3D` | `--color-grey-9` |
| `Red/500(Default)` | `#FF2424` | `--color-error` (#f5222d) |

> 변수명에 한글 설명이 포함된 것은 매우 오래된 토큰 정의일 가능성이 큽니다.

---

## 2. 비표준 Title 스타일 (이상한 letterSpacing 포함)

표준 Headline(H1~H6) 시리즈와 별개로 존재하는 1회용 Title 스타일들. 특히 `Title/18/SemiBold`는 letterSpacing이 `-2.4`로 명백한 오타로 보입니다.

### 발견 노드
- `8650:9881`
- `8650:9924`
- `8932:3149`

### 비표준 변수
| Variable | Family | Weight | Size | LH | LS | 권장 대체 |
|---|---|---|---|---|---|---|
| `Title/18_Bd` | Pretendard | Bold (700) | 18 | 1.4 | -0.4 | `--font-h3-b` (LH 26 ≈ 1.44) |
| `Title/18/SemiBold` | Pretendard | SemiBold (600) | 18 | 1.5 | **-2.4** ⚠️ | `--font-h3` (LS 0). LS -2.4는 거의 확실히 오타 |
| `Title/20_Bd` | Pretendard | Bold (700) | 20 | 1.4 | -0.4 | `--font-h2-b` (LH 28 = 1.4) |
| `Title/24/ExtraBold` | Pretendard | ExtraBold (800) | 24 | 1.5 | 0 | 정식 토큰 없음. 한 번만 쓴다면 inline으로 |
| `Body/16_Reg-long (Default)` | Pretendard | Regular (400) | 16 | 28 | -0.4 | `--font-b2` (LH 24)와 사양 다름 — long-form용 별도 토큰 필요 여부 검토 |
| `Event/Post/Body/16` | Pretendard | Regular (400) | 16 | 1.6 | -1 | 한 캠페인 페이지 전용 — 토큰화 비추천 |

---

## 3. 같은 변수명, 다른 값 (디테치된 토큰)

`8921:2664` 노드에서 `Text/colorTextSecondary` 와 `Border/colorBorder`가 정식 토큰 값과 다르게 보고됨. **변수 바인딩이 끊겨서 raw 값으로 그려졌을 가능성**이 큽니다.

| Variable | 정식 토큰 값 | 이 노드에서 본 값 |
|---|---|---|
| `Text/colorTextSecondary` | `#595959` | `#000000a6` (RGBA로 다른 표현) |
| `Border/colorBorder` | `#dbdbdb` | `#d9d9d9` |

→ 디자이너에게 해당 노드의 텍스트/보더를 토큰으로 다시 바인딩 요청.

---

## 4. 디자인 시스템 외부 컬러 (정리 검토 필요)

### `8979:10956` (소셜 로그인 버튼으로 추정)
| Variable | Hex | 메모 |
|---|---|---|
| `kakao/bg` | `#fee500` | Kakao 브랜드 가이드 컬러. 단독 그룹화 필요시 social 토큰으로 분리 가능 |
| `kakao/text` | `#000000d9` | |
| `kakao/logo` | `#000000` | |
| `naver/bg` | `#03c75a` | Naver 브랜드 컬러 |
| `naver/text` | `#ffffff` | |
| `component` | `#9747FF` | Figma의 component marker color로 추정. 실제 디자인 컬러 아님 |

### `8985:10823` (특수 마케팅 페이지로 추정)
| Variable | Hex | 메모 |
|---|---|---|
| `Dark` | `#28303F` | 정식 토큰과 별개의 1회용 다크 컬러 |

> 위 결정 단계에서 "Social (Kakao/Naver) 제외"를 선택했으므로 tokens 파일에는 반영하지 않았습니다. 필요하면 별도 `social.css` 같은 파일로 분리하는 게 적절합니다.

---

## 5. 분석 한계 — 수집 실패한 노드

총 25개 중 1개 노드는 Figma MCP가 "선택된 레이어 없음" 오류를 반환해서 데이터를 가져오지 못했습니다.

| Node ID | 상태 |
|---|---|
| `8657:11479` | ❌ 수집 실패 (재시도 필요) |

다음 번에 이 노드를 Figma 데스크탑에서 클릭한 상태로 두면 다시 시도할 수 있습니다.

---

## 6. REVION℞ 홈 작업에서 발견된 토큰/에셋 이슈 (2026-05-19)

### 6-1. 신규 토큰 — `--color-brand-revion-brown`
- 값: `#693C17` (muted brown)
- 출처: REVION℞ 홈(index)의 marquee 캠페인 밴드 배경. 디자이너(jin@baropharm.co.kr) 직접 지정.
- 처리: `tokens.css` / `tokens.js`에 `--color-brand-revion-brown` (= `colors.brand.revion.brown`)으로 추가했습니다. 기존 10-slot 브랜드 시스템과 다른 단일 액센트라서 슬롯 1개만 정의했습니다.
- 후속: Figma Variables에도 동일 이름으로 추가해 1:1 sync 유지 필요.

### 6-2. 신규 토큰 — `--font-family-marquee`
- 스택: `"Inter", "Plus Jakarta Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`
- 출처: REVION℞ 홈 marquee. editorial sans 무드.
- 처리: `tokens.css` / `tokens.js`에 추가. Inter 웹폰트 로딩은 각 페이지 `<head>`에서 직접 처리 (`tokens.css`에서 import하지 않음 — 다른 페이지에는 불필요).

### 6-3. 저해상도 미들 카드 원본
홈 hero-cards(미들) 섹션이 16:9로 통일되면서 일부 원본이 업스케일됩니다. 새 원본 교체 권장:

| 파일 | 현재 해상도 | 사용처 | 권장 |
|---|---|---|---|
| `revion-rx/images/middle-2.png` | 477 × 512 | hero-card "Daily Care" | ≥ 1920×1080 새 원본 필요 |
| `revion-rx/images/middle-3.png` | 478 × 512 | hero-card "Pharmacy Only" | ≥ 1920×1080 새 원본 필요 |
| `revion-rx/images/middle-1.png` | 840 × 560 | hero-card "Origin" | 16:9에 근접하나 1920w 권장 |

---

## 권장 조치 요약

| 우선순위 | 항목 | 담당 |
|---|---|---|
| 🔴 높음 | `Title/18/SemiBold`의 letterSpacing `-2.4` → `0` 또는 `-0.4`로 수정 (명백한 오타) | 디자이너 |
| 🟡 중간 | `8932:3149` 노드의 legacy gray 변수들을 `Colors/grey/*` 정식 토큰으로 재바인딩 | 디자이너 |
| 🟡 중간 | `Title/18_Bd`, `Title/20_Bd`를 정식 `H3-B`, `H2-B` 토큰으로 재바인딩 | 디자이너 |
| 🟢 낮음 | `8921:2664`의 raw hex값을 정식 토큰으로 재바인딩 | 디자이너 |
| 🟢 낮음 | Kakao/Naver/Dark 컬러의 정식 토큰화 여부 결정 (별도 social 그룹으로 추가 검토) | PM/디자이너 |
| 🟢 낮음 | `8657:11479` 노드 분석 (다음 세션에서) | — |
