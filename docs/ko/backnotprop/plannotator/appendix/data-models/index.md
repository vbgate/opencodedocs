---
title: "데이터 모델: 핵심 타입 완전 정의 | Plannotator"
subtitle: "데이터 모델: 핵심 타입 완전 정의 | Plannotator"
sidebarTitle: "핵심 데이터 모델 마스터하기"
description: "Plannotator의 데이터 모델을 이해하고, Annotation, Block, CodeAnnotation 등 핵심 타입의 완전 정의와 필드 설명을 마스터하여 시스템 아킴처처를 깊이 이해하세요."
tags:
  - "데이터 모델"
  - "타입 정의"
  - "API 참조"
prerequisite: []
order: 2
---

# Plannotator 데이터 모델

이 부록에서는 Plannotator에서 사용하는 모든 데이터 모델을 소개합니다. 계획 검토, 코드 검토, URL 공유 등 핵심 데이터 구조를 포함합니다.

## 핵심 데이터 모델 개요

Plannotator는 TypeScript로 다음 핵심 데이터 모델을 정의합니다.

| 모델 | 용도 | 정의 위치 |
|--- | --- | ---|
| `Annotation` | 계획 검토의 주석 | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Markdown 파싱 후 콘텐츠 블록 | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | 코드 검토의 주석 | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | URL 공유용 간소화 주석 형식 | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation（계획 주석）

`Annotation`은 계획 검토의 주석을 나타내며, 계획의 삭제, 삽입, 교체 또는 댓글을 표시하는 데 사용됩니다.

### 완전 정의

```typescript
export interface Annotation {
  id: string;              // 고유 식별자
  blockId: string;         // 연결된 Block ID（폐기됨, 호환성 유지）
  startOffset: number;     // 시작 오프셋（폐기됨, 호환성 유지）
  endOffset: number;       // 종료 오프셋（폐기됨, 호환성 유지）
  type: AnnotationType;     // 주석 타입
  text?: string;           // 댓글 내용（INSERTION/REPLACEMENT/COMMENT용）
  originalText: string;    // 주석된 원본 텍스트
  createdA: number;        // 생성 타임스탬프
  author?: string;         // 협업자 식별（URL 공유용）
  imagePaths?: string[];    // 첨부 이미지 경로
  startMeta?: {            // web-highlighter 요소 간 선택 메타데이터
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter 요소 간 선택 메타데이터
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType 열거형

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // 이 내용 삭제
  INSERTION = 'INSERTION',         // 이 내용 삽입
  REPLACEMENT = 'REPLACEMENT',     // 이 내용 교체
  COMMENT = 'COMMENT',             // 이 내용 댓글
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // 전역 댓글（특정 텍스트 미연결）
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 고유 식별자, 일반적으로 자동 생성된 UUID |
| `blockId` | string | ✅ | 연결된 `Block` ID（폐기됨, 호환성 유지） |
| `startOffset` | number | ✅ | 시작 문자 오프셋（폐기됨, 호환성 유지） |
| `endOffset` | number | ✅ | 종료 문자 오프셋（폐기됨, 호환성 유지） |
| `type` | AnnotationType | ✅ | 주석 타입（DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT） |
| `text` | string | ❌ | 댓글 내용（INSERTION/REPLACEMENT/COMMENT 시 작성） |
| `originalText` | string | ✅ | 주석된 원본 텍스트 |
| `createdA` | number | ✅ | 생성 타임스탬프（밀리초） |
| `author` | string | ❌ | 협업자 식별자（URL 공유 시 작성자 구분용） |
| `imagePaths` | string[] | ❌ | 첨부 이미지 경로 배열 |
| `startMeta` | object | ❌ | web-highlighter 요소 간 선택 시작 메타데이터 |
| `endMeta` | object | ❌ | web-highlighter 요소 간 선택 종료 메타데이터 |

### 예시

#### 삭제 주석

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "이 부분은 필요하지 않습니다",
  createdA: Date.now(),
}
```

#### 교체 주석

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "새로운 내용",
  originalText: "원래 내용",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### 전역 댓글

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "전체적으로 계획이 명확합니다",
  originalText: "",
  createdA: Date.now(),
}
```

::: info 폐기된 필드 설명
`blockId`, `startOffset`, `endOffset` 필드는 이전 버전에서 문자 오프셋 기반 텍스트 하이라이팅에 사용되었습니다. 현재 버전은 [web-highlighter](https://github.com/alvarotrigo/web-highlighter) 라이브러리를 사용하여 `startMeta`와 `endMeta`를 통해 요소 간 선택을 구현하며, 이 필드는 호환성용으로만 유지됩니다.
:::

## Block（계획 블록）

`Block`은 Markdown 텍스트 파싱 후 콘텐츠 블록을 나타내며, 계획 콘텐츠를 구조적으로 표시하는 데 사용됩니다.

### 완전 정의

```typescript
export interface Block {
  id: string;              // 고유 식별자
  type: BlockType;         // 블록 타입
  content: string;        // 순수 텍스트 콘텐츠
  level?: number;         // 레벨（제목 또는 리스트용）
  language?: string;      // 코드 언어（코드 블록용）
  checked?: boolean;      // 체크박스 상태（리스트 항목용）
  order: number;          // 정렬 순서
  startLine: number;      // 시작 행 번호（1-based）
}
```

### BlockType 타입

```typescript
type BlockType =
  | 'paragraph'     // 단락
  | 'heading'       // 제목
  | 'blockquote'    // 인용 블록
|---|
  | 'code'          // 코드 블록
  | 'hr'            // 구분선
  | 'table';        // 표
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 고유 식별자, 형식은 `block-{숫자}` |
| `type` | BlockType | ✅ | 블록 타입（paragraph/heading/blockquote/list-item/code/hr/table） |
| `content` | string | ✅ | 블록의 순수 텍스트 콘텐츠 |
| `level` | number | ❌ | 레벨：제목은 1-6, 리스트 항목은 들여쓰기 레벨 |
| `language` | string | ❌ | 코드 블록의 언어（예：'typescript', 'rust'） |
| `checked` | boolean | ❌ | 리스트 항목의 체크박스 상태（true = 체크됨, false = 체크 안됨） |
| `order` | number | ✅ | 정렬 순서, 블록 순서 유지용 |
| `startLine` | number | ✅ | 원본 Markdown에서의 시작 행 번호（1부터 시작） |

### 예시

#### 제목 블록

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Implementation Plan",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### 단락 블록

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### 코드 블록

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### 리스트 항목（체크박스 포함）

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "인증 모듈 완료",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown 파싱
Plannotator는 사용자 정의 간소화 Markdown 파서（`parseMarkdownToBlocks`）를 사용하여 원본 Markdown을 `Block[]` 배열로 변환합니다. 파서는 제목, 리스트, 코드 블록, 표, 인용 블록 등 일반적인 구문을 지원합니다.
:::

## CodeAnnotation（코드 주석）

`CodeAnnotation`은 코드 검토의 행 수준 주석을 나타내며, Git diff의 특정 행 또는 범위에 피드백을 추가하는 데 사용됩니다.

### 완전 정의

```typescript
export interface CodeAnnotation {
  id: string;              // 고유 식별자
  type: CodeAnnotationType;  // 주석 타입
  filePath: string;         // 파일 경로
  lineStart: number;        // 시작 행 번호
  lineEnd: number;          // 종료 행 번호
  side: 'old' | 'new';     // 측（'old' = 삭제 행, 'new' = 추가 행）
  text?: string;           // 댓글 내용
  suggestedCode?: string;    // 제안 코드（suggestion 타입용）
  createdAt: number;        // 생성 타임스탬프
  author?: string;         // 협업자 식별
}
```

### CodeAnnotationType 타입

```typescript
export type CodeAnnotationType =
  | 'comment'      // 일반 댓글
  | 'suggestion'  // 수정 제안（suggestedCode 제공 필요）
  | 'concern';     // 우려 사항（중요 사항 알림）
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 고유 식별자 |
| `type` | CodeAnnotationType | ✅ | 주석 타입（comment/suggestion/concern） |
| `filePath` | string | ✅ | 주석된 파일의 상대 경로（예：`src/auth.ts`） |
| `lineStart` | number | ✅ | 시작 행 번호（1부터 시작） |
| `lineEnd` | number | ✅ | 종료 행 번호（1부터 시작） |
| `side` | 'old' \| 'new' | ✅ | 측：`'old'` = 삭제 행（이전 버전）, `'new'` = 추가 행（새 버전） |
| `text` | string | ❌ | 댓글 내용 |
| `suggestedCode` | string | ❌ | 제안 코드（type이 'suggestion'일 때 필수） |
| `createdAt` | number | ✅ | 생성 타임스탬프（밀리초） |
| `author` | string | ❌ | 협업자 식별자 |

### side 필드 설명

`side` 필드는 [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) 라이브러리의 diff 뷰에 대응합니다.

| side 값 | @pierre/diffs 대응 | 설명 |
|--- | --- | ---|
| `'old'` | `deletions` | 삭제된 행（이전 버전의 콘텐츠） |
| `'new'` | `additions` | 추가된 행（새 버전의 콘텐츠） |

### 예시

#### 일반 댓글（추가 행）

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "여기서 오류 상황을 처리해야 합니다",
  createdAt: Date.now(),
}
```

#### 수정 제안（삭제 행）

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "async/await 사용을 제안합니다",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation（공유 주석）

`ShareableAnnotation`은 URL 공유용 간소화 주석 형식으로, 배열 튜플로 표현하여 payload 크기를 줄입니다.

### 완전 정의

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### 타입 설명

| 타입 | 첫 문자 | 튜플 구조 | 설명 |
|--- | --- | --- | ---|
| DELETION | `'D'` | `['D', original, author?, images?]` | 내용 삭제 |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | 내용 교체 |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | 내용 댓글 |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | 내용 삽입 |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | 전역 댓글 |

### 예시

```typescript
// 삭제
['D', '삭제할 내용', null, []]

// 교체
['R', '원본', '교체할 내용', null, ['/tmp/img.png']]

// 댓글
['C', '이 코드', '최적화를 제안합니다', null, []]

// 삽입
['I', '컨텍스트', '삽입할 새 내용', null, []]

// 전역 댓글
['G', '전체적으로 좋습니다', null, []]
```

::: tip 간소화 형식을 사용하는 이유?
객체 대신 배열 튜플을 사용하면 payload 크기를 줄일 수 있으며, 압축 후 URL이 더 짧아집니다. 예：
- 객체 형식：`{"type":"DELETION","originalText":"text"}` → 38 바이트
- 간소화 형식：`["D","text",null,[]]` → 18 바이트
:::

## SharePayload（공유 페이로드）

`SharePayload`는 URL 공유의 완전 데이터 구조로, 계획 콘텐츠와 주석을 포함합니다.

### 완전 정의

```typescript
export interface SharePayload {
  p: string;                  // 계획의 Markdown 텍스트
  a: ShareableAnnotation[];    // 주석 배열（간소화 형식）
  g?: string[];              // 전역 첨부 경로（이미지）
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `p` | string | ✅ | 원본 계획의 Markdown 콘텐츠 |
| `a` | ShareableAnnotation[] | ✅ | 주석 배열（`ShareableAnnotation` 간소화 형식 사용） |
| `g` | string[] | ❌ | 전역 첨부 경로（특정 주석에 연결되지 않은 이미지） |

### 예시

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', 'OAuth 지원 필요', null, []],
    ['G', '전체 계획이 명확합니다', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter（프론트매터）

`Frontmatter`는 Markdown 파일 상단의 YAML 메타데이터를 나타내며, 추가 정보를 저장하는 데 사용됩니다.

### 완전 정의

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### 예시

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan（예시）
...
```

파싱 후：

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip 프론트매터 용도
Plannotator는 계획을 Obsidian에 저장할 때 자동으로 프론트매터를 생성하며, 생성 시간, 출처 태그 등의 정보를 포함하여 노트 관리 및 검색에 용이합니다.
:::

## 관련 보조 타입

### EditorMode（에디터 모드）

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`：텍스트 선택 모드
- `'comment'`：댓글 모드
- `'redline'`：레드라인 주석 모드

### DiffResult（Diff 결과）

```typescript
export interface DiffResult {
  original: string;    // 원본 콘텐츠
  modified: string;    // 수정 후 콘텐츠
  diffText: string;    // Unified diff 텍스트
}
```

### DiffAnnotationMetadata（Diff 주석 메타데이터）

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // 연결된 주석 ID
  type: CodeAnnotationType;  // 주석 타입
  text?: string;            // 댓글 내용
  suggestedCode?: string;   // 제안 코드
  author?: string;          // 작성자
}
```

### SelectedLineRange（선택된 행 범위）

```typescript
export interface SelectedLineRange {
  start: number;                      // 시작 행 번호
  end: number;                        // 종료 행 번호
  side: 'deletions' | 'additions';   // 측（@pierre/diffs의 diff 뷰 대응）
  endSide?: 'deletions' | 'additions'; // 종료 측（측 간 선택용）
}
```

## 데이터 변환 관계

### Annotation ↔ ShareableAnnotation

```typescript
// 완전 → 간소화
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// 간소화 → 완전
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info 좌표 손실
`fromShareable`에서 생성된 `Annotation`의 `blockId`, `startOffset`, `endOffset` 필드는 비어 있거나 0이며, 텍스트 매칭 또는 web-highlighter를 통해 정확한 위치를 복원해야 합니다.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## 이 과정 요약

이 부록에서는 Plannotator의 모든 핵심 데이터 모델을 소개했습니다.

- **Annotation**：계획 검토의 주석, 삭제, 삽입, 교체, 댓글 등 타입 지원
- **Block**：Markdown 파싱 후 콘텐츠 블록, 계획 구조적 표시용
- **CodeAnnotation**：코드 검토의 행 수준 주석, 댓글과 제안 지원
- **ShareableAnnotation**：URL 공유용 간소화 형식, payload 크기 감소
- **SharePayload**：URL 공유의 완전 데이터 구조

이 데이터 모델은 계획 검토, 코드 검토, URL 공유 등 기능에서 널리 사용됩니다. 이를 이해하면 Plannotator를 깊이 사용자 정의하고 확장하는 데 도움이 됩니다.

## 다음 과정 예고

> 다음 과정에서는 **[Plannotator 라이선스 설명](../license/)**을 학습합니다.
>
> 다음을 확인할 수 있습니다：
> - Business Source License 1.1 (BSL)의 핵심 조항
> - 허용되는 사용 방식과 상업적 제한
> - 2030년에 Apache 2.0으로 변환되는 일정
> - 상업용 라이선스 획득 방법

---

## 부록：소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간：2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Annotation 인터페이스 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType 열거형 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block 인터페이스 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation 인터페이스 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType 타입 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation 타입 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload 인터페이스 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**핵심 상수**：
- 없음

**핵심 함수**：
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：완전 주석을 간소화 형식으로 변환
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：간소화 형식을 완전 주석으로 복원
- `parseMarkdownToBlocks(markdown: string): Block[]`：Markdown을 Block 배열로 파싱
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`：주석을 Markdown 형식으로 내보내

</details>
