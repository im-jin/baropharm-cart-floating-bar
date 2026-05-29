# 카카오톡 시드 추출 — 방법론 & 룰

> 원본 카카오톡 단톡방 → OTC 플러스 컨텐츠 시드 (kakao-seeds.json) 추출 방법.
> 시드 갱신할 때 동일한 룰 유지.

## 원본
- 파일: `/Users/jin/Downloads/KakaoTalkChats (1).txt`
- 정체: **바로팜 단톡방** (약사 그룹챗, 운영 by 바로팜)
- 기간: 2024-09-24 ~ 2026-05-13 (약 8개월)
- 크기: 100,833 lines / 7.8 MB

## OTC only 스코프
바로팜 단톡방은 **전문약 처방·청구·마약류 룰 토론이 절반 이상** 을 차지함. OTC 플러스 페이지는 OTC 전문 채널이므로 추출 단계에서 ETC 영역을 컷.

### 포함
- 일반의약품 (일반약 진통제·감기약·시럽·연고·안약·파스·밴드)
- 영양제 / 건기식 (비타민·오메가·콜라겐·아르기닌·프로바이오틱스 등)
- OTC 셀링가 / 마진 / 권유 노하우
- OTC 품절·입고·수급
- OTC 카운슬링 (손님 증상 → 일반약 추천)
- OTC 트렌드 (방송 효과, 시즌성, 신제품 런칭, 월간 일반약 순위)

### 제외
- 처방 룰 (졸피뎀 28일 vs 30일, DUR, 대체조제 청구)
- 마약류·향정 (펜디메트라진, 펜터민, 졸피뎀)
- 보험/급여/약가인하 (전문약 처방 영역)
- 전문약 품절 (콘서타, 한독세로자트, 부광 5품목 일부)
- 약국 운영 잡담 (결제카드 한도, 청소기, 인테리어)
- 진상 손님 사례 / 개인 푸념

## 익명화 룰

| 항목 | 처리 |
|------|------|
| 발신자 한글명 (예: `이경화`, `김미나(동김해얼짱약사님)`) | `약사 A`, `약사 B`, ... 알파벳 순으로 재할당 |
| 약국명 / 지역명 | 삭제 |
| 전화번호 (010-xxxx-xxxx, 한글표기 포함) | 삭제 |
| 환자 신원 (나이, 진단명, 처방내역 구체) | 일반화 또는 삭제 |
| 이모지·말줄임표·이중감탄부호 | **보존** (실제 톤이 핵심) |
| `사진` 라인 | 스킵 |
| `파일: *.pdf` 라인 | 스킵 |
| `메시지가 삭제되었습니다` 라인 | 스킵 |

## 추출 절차

1. **카테고리별 keyword grep** — 5개 카테고리 (stockout / selling_price / selling_review / otc_counseling / otc_trend) 각각 키워드 패턴 매칭.
2. **OTC 필터** — ETC 키워드(처방/급여/DUR/마약류) 가 포함된 라인 컷.
3. **샘플링** — 카테고리당 30~50건 raw → 대표 10건으로 압축. 중복 패턴 제거.
4. **익명화** — 위 룰 적용.
5. **page_mapping 부여** — 각 카테고리가 OTC 플러스 어느 페이지/어느 섹션에 박힐지 명시.
6. **ui_phrasing_seeds 추출** — 페이지 카피·태그·placeholder 에 바로 박을 수 있는 짧은 문구.

## 키워드 패턴 (grep 용)

```bash
# stockout
grep -E "품절|수급|입고|재고"

# selling_price
grep -E "얼마|받으|마진|최빈가|판매가|원에"

# selling_review
grep -E "추천드립니다|추천드려요|많이 나가|잘 나가|잘나가|효과 좋|좋더라"

# otc_counseling
grep -E "손님이|손님분|일반약|매약|권해|권하|편두통|지사제|영양제|비타민"

# otc_trend
grep -E "방송|유행|트렌드|시즌|런칭|월간|순위"

# 공통 제외
| grep -v "메시지가 삭제\|사진\|파일:"
```

## 페이지 매핑 요약

| 카테고리 | 주 사용처 |
|---------|----------|
| stockout | `index.html` atglance ▸ 수급 lens, `Pharmall/index.html` 이주의 품절 트렌드 |
| selling_price | `detail.html` 셀링가 박스, `ai.html` STEPS_MAP 답변 |
| selling_review | `index.html` CATEGORY × 셀링리뷰, `detail.html` 셀링리뷰 박스, `ai.html` 톤 reference |
| otc_counseling | `index.html` HERO 추천 질문 4행, `ai.html` STEPS_MAP prompts, `list.html` 카테고리 컨텍스트 |
| otc_trend | `index.html` atglance ▸ 환절기/방송 lens, THIS MONTH 섹션, `list.html` 트렌드 인디케이터 |

## 시드 갱신 시 주의

- 카카오톡 원본은 `~/Downloads/` 에 있는 **로컬 파일**. 깃에 커밋 X.
- 시드 JSON 만 커밋 (이미 익명화된 상태).
- 신규 멘트 추가 시 동일 익명화 룰 적용.
- 시드 갱신할 때마다 `_meta.extracted_at` 업데이트.
