---
title: "표 규격: 포맷 조건 | opencode-md-table-formatter"
sidebarTitle: "invalid structure 오류 해결"
subtitle: "표 규격: 어떤 표가 포맷될 수 있는가"
description: "Markdown 표의 4가지 유효 조건을 학습하세요. 행 시작/끝 파이프 기호, 구분 행 구문, 열 수 일관성을 마스터하고 invalid structure 오류를 해결하세요."
tags:
  - "표 검증"
  - "구분 행"
  - "열 수 일관"
  - "정렬 구문"
prerequisite:
  - "start-features"
order: 40
---

# 표 규격: 어떤 표가 포맷될 수 있는가

::: info 이 과정을 마치면
- 어떤 표가 플러그인으로 포맷될 수 있는지 알게 됩니다
- `invalid structure` 오류의 원인을 이해하게 됩니다
- 규격에 맞는 Markdown 표를 작성할 수 있습니다
:::

## 현재 상황

AI가 표를 생성했지만 플러그인이 포맷하지 않고 끝에 다음 문구를 추가했습니다:

```markdown
<!-- table not formatted: invalid structure -->
```

"유효하지 않은 구조"란 무엇인가요? 왜 내 표는 작동하지 않나요?

## 언제 사용하나요

- `invalid structure` 오류가 발생하여 문제가 무엇인지 알고 싶을 때
- AI가 생성한 표가 올바르게 포맷되도록 보장하고 싶을 때
- 규격에 맞는 Markdown 표를 직접 작성하고 싶을 때

## 핵심 아이디어

플러그인은 포맷하기 전에 세 단계 검증을 수행합니다:

```
1단계: 표 행인가? → isTableRow()
2단계: 구분 행이 있는가? → isSeparatorRow()
3단계: 구조가 유효한가? → isValidTable()
```

세 단계 모두 통과해야만 포맷됩니다. 어느 단계에서든 실패하면 원본을 유지하고 오류 주석을 추가합니다.

## 유효한 표의 4가지 조건

### 조건 1: 각 행은 `|`로 시작하고 끝나야 합니다

이것이 가장 기본적인 요구사항입니다. Markdown 파이프 표(Pipe Table)의 모든 행은 `|`로 감싸져야 합니다.

```markdown
✅ 올바름
| 이름 | 설명 |

❌ 잘못됨
이름 | 설명      ← 시작하는 |가 없음
| 이름 | 설명     ← 끝나는 |가 없음
```

::: details 소스 코드 구현
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
소스 코드 위치: `index.ts:58-61`
:::

### 조건 2: 각 행은 최소 2개의 구분자가 있어야 합니다

`split("|").length > 2`는 최소 2개의 `|`로 내용을 구분해야 함을 의미합니다.

```markdown
✅ 올바름 (3개의 |, 2개의 구분자)
| 이름 | 설명 |

❌ 잘못됨 (2개의 |만 있음, 1개의 구분자)
| 이름 |
```

즉, **단일 열 표도 유효하지만** `| 내용 |` 형식으로 작성해야 합니다.

### 조건 3: 구분 행이 있어야 합니다

구분 행은 헤더와 데이터 행 사이의 행으로 정렬 방식을 정의하는 데 사용됩니다.

```markdown
| 이름 | 설명 |
| --- | --- |      ← 이것이 구분 행입니다
| 값1 | 값2 |
```

**구분 행 구문 규칙**:

각 셀은 정규식 `/^\s*:?-+:?\s*$/`와 일치해야 합니다. 쉽게 말하면:

| 구성 요소 | 의미 | 예시 |
|--- | --- | ---|
| `\s*` | 선택적 공백 | `| --- |` 또는 `|---|` 허용 |
| `:?` | 선택적 콜론 | 정렬 방식 지정에 사용 |
| `-+` | 최소 하나의 대시 | `-`, `---`, `------` 모두 가능 |

**유효한 구분 행 예시**:

```markdown
| --- | --- |           ← 가장 간단한 형식
| :--- | ---: |         ← 정렬 표시 포함
| :---: | :---: |       ← 중앙 정렬
|---|---|               ← 공백 없어도 됨
| -------- | -------- | ← 긴 대시도 가능
```

**유효하지 않은 구분 행 예시**:

```markdown
| === | === |           ← 등호 사용, 대시 아님
| - - | - - |           ← 대시 사이에 공백
| ::: | ::: |           ← 콜론만 있고 대시 없음
```

::: details 소스 코드 구현
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
소스 코드 위치: `index.ts:63-68`
:::

### 조건 4: 모든 행의 열 수가 일치해야 합니다

첫 번째 행에 3개의 열이 있다면, 그 뒤의 모든 행도 3개의 열이 있어야 합니다.

```markdown
✅ 올바름 (모든 행이 3개 열)
| A | B | C |
|--- | --- | ---|
| 1 | 2 | 3 |

❌ 잘못됨 (세 번째 행은 2개 열만 있음)
| A | B | C |
|--- | --- | ---|
| 1 | 2 |
```

::: details 소스 코드 구현
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
소스 코드 위치: `index.ts:70-88`
:::

## 정렬 구문 빠른 참조

구분 행은 구분뿐만 아니라 정렬 방식 지정에도 사용됩니다:

| 구문 | 정렬 방식 | 효과 |
|--- | --- | ---|
| `---` 또는 `:---` | 왼쪽 정렬 | 텍스트 왼쪽 (기본값) |
| `:---:` | 중앙 정렬 | 텍스트 중앙 |
| `---:` | 오른쪽 정렬 | 텍스트 오른쪽 |

**예시**:

```markdown
| 왼쪽 정렬 | 중앙 정렬 | 오른쪽 정렬 |
|--- | --- | ---|
| 텍스트 | 텍스트 | 텍스트 |
```

포맷 후:

```markdown
| 왼쪽 정렬 |  중앙 정렬  | 오른쪽 정렬 |
|--- | --- | ---|
| 텍스트   |  텍스트   |     텍스트 |
```

::: details 소스 코드 구현
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
소스 코드 위치: `index.ts:141-149`
:::

## 일반적인 오류 문제 해결

| 오류 현상 | 가능한 원인 | 해결 방법 |
|--- | --- | ---|
| `invalid structure` | 구분 행 누락 | 헤더 뒤에 `\| --- \| --- \|` 추가 |
| `invalid structure` | 열 수 불일치 | 각 행의 `\|` 수가 같은지 확인 |
| `invalid structure` | 행 시작/끝에 `\|` 누락 | 누락된 `\|` 추가 |
| 표가 감지되지 않음 | 1개 열만 있음 | 최소 2개의 `\|` 구분자가 있는지 확인 |
| 정렬이 적용되지 않음 | 구분 행 구문 오류 | `-`를 사용했는지 다른 문자가 아닌지 확인 |

## 확인 사항

이 과정을 완료한 후 다음 질문에 답할 수 있어야 합니다:

- [ ] 표 행은 어떤 조건을 만족해야 하나요? (답: `|`로 시작하고 끝나며, 최소 2개의 구분자)
- [ ] 구분 행의 정규식은 무엇을 의미하나요? (답: 선택적 콜론 + 최소 하나의 대시 + 선택적 콜론)
- [ ] 왜 `invalid structure`가 발생하나요? (답: 구분 행 누락, 열 수 불일치, 또는 행 시작/끝에 `|` 누락)
- [ ] `:---:`는 어떤 정렬 방식을 의미하나요? (답: 중앙 정렬)

## 이 과정 요약

| 조건 | 요구사항 |
|--- | ---|
| 행 시작/끝 | `\|`로 시작하고 끝나야 함 |
| 구분자 수 | 최소 2개의 `\|` |
| 구분 행 | 필수, 형식은 `:?-+:?` |
| 열 수 일관 | 모든 행의 열 수가 같아야 함 |

**기억 구문**:

> 파이프로 양쪽 감싸기, 구분 행에 대시, 열 수 일치 필수, 네 가지 규칙 기억하기.

## 다음 과정 예고

> 다음 과정에서는 **[정렬 방식 상세](../alignment/)**를 학습합니다.
>
> 배우게 될 내용:
> - 세 가지 정렬 방식의 상세 사용법
> - 구분 행 포맷 구현 원리
> - 셀 패딩 알고리즘

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 표 행 판정 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 구분 행 판정 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 표 검증 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 정렬 방식 파싱 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 유효하지 않은 표 처리 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**핵심 정규식**:
- `/^\s*:?-+:?\s*$/`: 구분 행 셀 일치 규칙

**핵심 함수**:
- `isTableRow()`: 표 행인지 판단
- `isSeparatorRow()`: 구분 행인지 판단
- `isValidTable()`: 표 구조가 유효한지 검증
- `getAlignment()`: 정렬 방식 파싱

</details>
