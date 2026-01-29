---
title: "알려진 제한: HTML 테이블 등 미지원 | opencode-md-table-formatter"
sidebarTitle: "테이블 포맷팅 실패 시 대처법"
subtitle: "알려진 제한: HTML 테이블 등 미지원"
description: "opencode-md-table-formatter의 기술적 경계를 이해하세요. HTML 테이블과 다중 행 셀 미지원 등을 포함합니다. 지원되지 않는 시나리오에서 사용을 피하고 업무 효율을 높이세요."
tags:
  - "알려진 제한"
  - "HTML 테이블"
  - "다중 행 셀"
  - "구분 행 없는 테이블"
prerequisite:
  - "start-features"
order: 70
---

# 알려진 제한: 플러그인의 경계는 어디까지인가

::: info 학습 후 할 수 있는 것
- 플러그인이 지원하지 않는 테이블 유형 파악
- 지원되지 않는 시나리오에서 플러그인 사용 방지
- 플러그인의 기술적 경계와 설계 트레이드오프 이해
:::

## 핵심 아이디어

이 플러그인은 하나의 목표에 집중합니다: **OpenCode의 숨김 모드를 위해 Markdown 파이프 테이블 포맷팅을 최적화**합니다.

이를 위해 일부 기능을 의도적으로 제한하여 핵심 시나리오의 신뢰성과 성능을 보장합니다.

## 알려진 제한 요약

| 제한 | 설명 | 지원 계획 여부 |
| --- | --- | --- |
| **HTML 테이블** | Markdown 파이프 테이블(`\| ... \|`)만 지원 | ❌ 미지원 |
| **다중 행 셀** | 셀 내에 `<br>` 등 줄바꿈 태그 포함 불가 | ❌ 미지원 |
| **구분 행 없는 테이블** | `|---|` 구분 행이 있어야 함 | ❌ 미지원 |
| **셀 병합** | 행 또는 열 병합 미지원 | ❌ 미지원 |
| **헤더 없는 테이블** | 구분 행이 헤더로 간주되므로 헤더 없는 테이블 생성 불가 | ❌ 미지원 |
| **구성 옵션** | 열 너비 사용자 정의, 기능 비활성화 등 불가 | 🤔 향후 가능 |
| **대형 테이블** | 100+ 행 테이블의 성능 미검증 | 🤔 향후 최적화 |

---

## 제한 상세 설명

### 1. HTML 테이블 미지원

**현상**

```html
<!-- 이 테이블은 포맷팅되지 않습니다 -->
<table>
  <tr>
    <th>열 1</th>
    <th>열 2</th>
  </tr>
  <tr>
    <td>데이터 1</td>
    <td>데이터 2</td>
  </tr>
</table>
```

**원인**

플러그인은 Markdown 파이프 테이블(Pipe Table)만 처리하며, `|`로 구분된 형식입니다:

```markdown
| 열 1 | 열 2 |
| --- | --- |
| 데이터 1 | 데이터 2 |
```

**소스 코드 근거**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

감지 로직은 `|`로 시작하고 끝나는 행만 일치시키므로 HTML 테이블은 건너뜁니다.

**대안**

HTML 테이블 포맷팅이 필요한 경우 다음을 권장합니다:
- 전용 HTML 포맷팅 도구 사용
- HTML 테이블을 Markdown 파이프 테이블로 변환

---

### 2. 다중 행 셀 미지원

**현상**

```markdown
| 열 1 | 열 2 |
| --- | --- |
| 1행<br>2행 | 단일 행 |
```

출력 시 `<!-- table not formatted: invalid structure -->` 주석이 표시됩니다.

**원인**

플러그인은 테이블을 행별로 처리하며 셀 내 줄바꿈을 지원하지 않습니다.

**소스 코드 근거**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... 행별 스캔, 다중 행 병합 로직 없음
}
```

**대안**

- 다중 행 내용을 여러 행 데이터로 분할
- 또는 테이블이 넓어지는 것을 받아들이고 내용을 한 행에 표시

---

### 3. 구분 행 없는 테이블 미지원

**현상**

```markdown
<!-- 구분 행 누락 -->
| 열 1 | 열 2 |
| 데이터 1 | 데이터 2 |
| 데이터 3 | 데이터 4 |
```

`<!-- table not formatted: invalid structure -->` 주석이 표시됩니다.

**원인**

Markdown 파이프 테이블은 열 수와 정렬 방식을 정의하는 구분 행(Separator Row)을 포함해야 합니다.

**소스 코드 근거**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // 구분 행 없으면 false 반환
```

**올바른 작성법**

```markdown
| 열 1 | 열 2 |
| --- | --- |  ← 구분 행
| 데이터 1 | 데이터 2 |
| 데이터 3 | 데이터 4 |
```

---

### 4. 셀 병합 미지원

**현상**

```markdown
| 열 1 | 열 2 |
| --- | --- |
| 두 열 병합 |  ← 열 1과 열 2를 병합하려는 의도
| 데이터 1 | 데이터 2 |
```

**원인**

Markdown 표준은 셀 병합 구문을 지원하지 않으며, 플러그인도 병합 로직을 구현하지 않았습니다.

**대안**

- 빈 셀로 자리 채우기: `| 두 열 병합 | |`
- 또는 Markdown의 제한을 받아들이고 HTML 테이블 사용

---

### 5. 구분 행이 헤더로 간주됨

**현상**

```markdown
| :--- | :---: | ---: |
| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |
| 데이터 1 | 데이터 2 | 데이터 3 |
```

구분 행이 헤더 행으로 간주되므로 "헤더 없는" 순수 데이터 테이블을 만들 수 없습니다.

**원인**

Markdown 규격은 구분 행 후 첫 번째 행을 헤더(Table Header)로 간주합니다.

**대안**

- 이는 Markdown 자체의 제한이며 플러그인 특유의 문제가 아님
- 헤더 없는 테이블이 필요한 경우 다른 형식(예: CSV) 고려

---

### 6. 구성 옵션 없음

**현상**

구성 파일을 통해 다음을 조정할 수 없습니다:
- 최소/최대 열 너비
- 특정 기능 비활성화
- 사용자 정의 캐시 전략

**원인**

현재 버전(v0.0.3)은 구성 인터페이스를 제공하지 않으며, 모든 매개변수가 소스 코드에 하드코딩되어 있습니다.

::: tip 버전 정보
현재 플러그인 버전은 v0.0.3(package.json 선언)입니다. CHANGELOG.md에 기록된 v0.1.0은 향후 버전 계획이며 아직 출시되지 않았습니다.
:::

**소스 코드 근거**

```typescript
// index.ts:115 - 열 최소 너비가 3으로 하드코딩됨
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - 캐시 임계값 하드코딩
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**향후 계획**

CHANGELOG에서 향후 지원 가능성을 언급했습니다:
> Configuration options (min/max column width, disable features)

---

### 7. 대형 테이블 성능 미검증

**현상**

100+ 행 테이블의 경우 포맷팅이 느리거나 메모리를 많이 사용할 수 있습니다.

**원인**

플러그인은 행별 스캔과 캐싱 메커니즘을 사용하므로 이론적으로 대형 테이블을 처리할 수 있지만, 전용 성능 최적화는 수행되지 않았습니다.

**소스 코드 근거**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// 캐시는 100회 작업 또는 1000개 항목 후 비워짐
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**권장 사항**

- 대형 테이블의 경우 여러 작은 테이블로 분할 권장
- 또는 향후 성능 최적화 버전 대기

---

## 확인 포인트

이 과정을 완료한 후 다음 질문에 답할 수 있어야 합니다:

- [ ] 플러그인은 어떤 테이블 형식을 지원하나요? (답: Markdown 파이프 테이블만 지원)
- [ ] 다중 행 셀을 포맷팅할 수 없는 이유는 무엇인가요? (답: 플러그인은 행별로 처리하며 병합 로직이 없음)
- [ ] 구분 행의 역할은 무엇인가요? (답: 열 수와 정렬 방식을 정의하며 필수)
- [ ] 열 너비를 사용자 정의할 수 있나요? (답: 현재 버전에서는 미지원)

---

## 일반적인 실수 주의

::: warning 일반적인 오류

**오류 1**: HTML 테이블이 포맷팅되기를 기대함

플러그인은 Markdown 파이프 테이블만 처리하며, HTML 테이블은 수동으로 포맷팅하거나 다른 도구를 사용해야 합니다.

**오류 2**: 테이블에 구분 행이 없음

구분 행은 Markdown 테이블의 필수 부분이며, 누락 시 "유효하지 않은 구조" 오류가 발생합니다.

**오류 3**: 셀 내용이 너무 길어 테이블이 넓어짐

플러그인은 최대 열 너비 제한이 없으므로 셀 내용이 너무 길면 전체 테이블이 넓어집니다. 수동으로 줄바꿈하거나 내용을 간소화하는 것을 권장합니다.

:::

---

## 이 과정 요약

| 제한 | 원인 | 대안 |
| --- | --- | --- |
| HTML 테이블 미지원 | 플러그인은 Markdown 파이프 테이블에 집중 | HTML 포맷팅 도구 사용 |
| 다중 행 셀 미지원 | 행별 처리 로직 | 여러 행으로 분할하거나 넓어지는 것을 수용 |
| 구분 행 없는 테이블 미지원 | Markdown 규격 요구사항 | `|---|` 구분 행 추가 |
| 구성 옵션 없음 | 현재 버전 미구현 | 향후 버전 업데이트 대기 |

## 다음 과정 예고

> 다음 과정에서는 **[기술 세부사항](../tech-details/)**을 학습합니다.
>
> 학습할 내용:
> - 플러그인의 캐싱 메커니즘 작동 방식
> - 성능 최적화 전략
> - 캐시가 100회 작업 후 비워지는 이유

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-26

| 제한 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| HTML 테이블 감지 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 구분 행 감지 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 테이블 검증(구분 행 필수) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 열 최소 너비 하드코딩 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| 캐시 임계값 하드코딩 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**핵심 함수**:
- `isTableRow()`: Markdown 파이프 테이블 행인지 감지
- `isSeparatorRow()`: 구분 행 감지
- `isValidTable()`: 테이블 구조 유효성 검증

**핵심 상수**:
- `colWidths 최소 너비 = 3`: 열의 최소 표시 너비
- `캐시 임계값 = 100회 작업 또는 1000개 항목`: 캐시 정리 트리거 조건

**CHANGELOG 참조**:
- 알려진 제한 장: [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) 31-36행

</details>
