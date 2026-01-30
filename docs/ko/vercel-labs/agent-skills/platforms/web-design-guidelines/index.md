---
title: "웹 디자인 가이드라인 감사: 100가지 UI 모범 사례 적용 | Agent Skills"
sidebarTitle: "100가지 규칙으로 UI 검사"
subtitle: "웹 인터페이스 디자인 가이드라인 감사"
description: "웹 디자인 가이드라인 감사로 접근성, 성능, UX를 학습하세요. 100가지 규칙으로 aria-label, 폼 검증, 애니메이션, 다크 모드를 검사하여 인터페이스 품질을 향상시킵니다."
tags:
- "접근성"
- "UX"
- "코드 리뷰"
- "웹 디자인"
order: 40
prerequisite:
- "start-getting-started"
---

# 웹 인터페이스 디자인 가이드라인 감사

## 학습 후 할 수 있는 것

- 🎯 AI가 UI 코드를 자동으로 감사하여 접근성, 성능, UX 문제를 발견하도록 합니다
- ♿ 웹 접근성(WCAG) 모범 사례를 적용하여 웹사이트 접근성을 향상시킵니다
- ⚡ 애니메이션 성능과 이미지 로딩을 최적화하여 사용자 경험을 개선합니다
- 🎨 다크 모드와 반응형 디자인의 올바른 구현을 보장합니다
- 🔍 일반적인 UI 안티패턴(예: `transition: all`, 누락된 aria-label 등)을 수정합니다

## 현재의 어려움

UI 컴포넌트를 작성했지만 뭔가 부족하다고 느끼고 있습니다:

- 웹사이트가 기능 테스트는 통과했지만 접근성 표준을 충족하는지 모릅니다
- 애니메이션 성능이 좋지 않아 사용자가 페이지가 끊긴다고 피드백합니다
- 다크 모드에서 일부 요소가 잘 보이지 않습니다
- AI가 생성한 코드는 작동하지만 필요한 aria-label이나 의미론적 HTML이 부족합니다
- 매번 코드 리뷰에서 17개 카테고리의 규칙을 수동으로 확인해야 해서 효율이 떨어집니다
- `prefers-reduced-motion`, `tabular-nums` 같은 CSS 속성을 언제 사용해야 할지 모릅니다

실제로 Vercel 엔지니어링 팀은 접근성부터 성능 최적화까지 모든 시나리오를 다루는 **100가지** 웹 인터페이스 디자인 가이드라인을 정리했습니다. 이제 이러한 규칙이 Agent Skills에 패키징되어 AI가 UI 문제를 자동으로 감사하고 수정하도록 할 수 있습니다.

::: info "웹 인터페이스 가이드라인"이란?
웹 인터페이스 가이드라인은 Vercel의 UI 품질 표준 모음으로, 17개 카테고리에 걸쳐 100가지 규칙을 포함합니다. 이러한 규칙은 WCAG 접근성 표준, 성능 모범 사례, UX 디자인 원칙을 기반으로 하여 웹 애플리케이션의 품질이 프로덕션 수준에 도달하도록 보장합니다.
:::

## 언제 이 기능을 사용할까요

웹 디자인 가이드라인 스킬을 사용하는 전형적인 시나리오:

- ❌ **적용되지 않음**: 순수 백엔드 로직, 간단한 프로토타입 페이지(사용자 상호작용 없음)
- ✅ **적용됨**:
  - 새로운 UI 컴포넌트 작성(버튼, 폼, 카드 등)
  - 상호작용 기능 구현(모달, 드롭다운, 드래그 등)
  - UI 컴포넌트 코드 리뷰 또는 리팩토링
  - 배포 전 UI 품질 검사
  - 사용자 피드백의 접근성 또는 성능 문제 수정

## 🎒 시작하기 전 준비사항

::: warning 사전 확인
시작하기 전에 다음 사항을 확인하세요:
1. Agent Skills가 설치되어 있는지 확인합니다([설치 가이드](../../start/installation/) 참조)
2. 기본적인 HTML/CSS/React 지식이 있는지 확인합니다
3. 감사가 필요한 UI 프로젝트가 있는지 확인합니다(단일 컴포넌트 또는 전체 페이지)
:::

## 핵심 개념

웹 인터페이스 디자인 가이드라인은 **17개 카테고리**를 다루며, 우선순위에 따라 세 가지 주요 블록으로 나뉩니다:

| 카테고리 블록 | 관심사 | 전형적인 이점 |
| --- | --- | --- |
| **접근성 (Accessibility)** | 모든 사용자가 사용할 수 있도록 보장(스크린 리더, 키보드 사용자 포함) | WCAG 표준 준수, 사용자층 확대 |
| **성능 & UX (Performance & UX)** | 로딩 속도, 애니메이션 부드러움, 상호작용 경험 최적화 | 사용자 유지율 향상, 이탈률 감소 |
| **완성도 & 세부사항 (Completeness)** | 다크 모드, 반응형, 폼 검증, 오류 처리 | 사용자 불만 감소, 브랜드 이미지 향상 |

**17개 규칙 카테고리**:

| 카테고리 | 전형적인 규칙 | 우선순위 |
| --- | --- | --- |
| Accessibility | aria-labels, 의미론적 HTML, 키보드 처리 | ⭐⭐⭐ 최고 |
| Focus States | 가시적 포커스, :focus-visible로 :focus 대체 | ⭐⭐⭐ 최고 |
| Forms | autocomplete, 검증, 오류 처리 | ⭐⭐⭐ 최고 |
| Animation | prefers-reduced-motion, transform/opacity | ⭐⭐ 높음 |
| Typography | curly quotes, ellipsis, tabular-nums | ⭐⭐ 높음 |
| Content Handling | 텍스트 잘림, 빈 상태 처리 | ⭐⭐ 높음 |
| Images | dimensions, lazy loading, alt text | ⭐⭐ 높음 |
| Performance | virtualization, preconnect, DOM 작업 일괄 처리 | ⭐⭐ 높음 |
| Navigation & State | URL이 상태 반영, 딥 링크 | ⭐⭐ 높음 |
| Touch & Interaction | touch-action, tap-highlight | ⭐ 중간 |
| Safe Areas & Layout | 안전 영역, 스크롤바 처리 | ⭐ 중간 |
| Dark Mode & Theming | color-scheme, theme-color meta | ⭐ 중간 |
| Locale & i18n | Intl.DateTimeFormat, Intl.NumberFormat | ⭐ 중간 |
| Hydration Safety | value + onChange, 셀 불일치 방지 | ⭐ 중간 |
| Hover & Interactive States | hover 상태, 대비 향상 | ⭐ 중간 |
| Content & Copy | 능동태, 특정 버튼 레이블 | ⭐ 낮음 |
| Anti-patterns | 일반적인 오류 패턴 플래그 | ⭐⭐⭐ 최고 |

**핵심 원칙**:
1. **접근성 카테고리 문제 우선 수정** — 장애 사용자의 사용에 영향을 미칩니다
2. **애니메이션과 이미지로 성능 문제 시작** — 사용자 경험에 직접적인 영향을 미칩니다
3. **완성도 문제는 마지막에 확인** — 다크 모드, 국제화 등 세부사항

## 따라 해보기

### 1단계: AI UI 감사 트리거

UI 프로젝트(단일 컴포넌트 파일 또는 전체 디렉토리)를 열고 Claude 또는 Cursor에 다음을 입력합니다:

```
Review my UI components for accessibility and UX issues
```

또는

```
Check accessibility of my site
```

또는

```
Audit design and apply Web Interface Guidelines
```

**예상 결과**: AI가 `web-design-guidelines` 스킬을 활성화하고 GitHub에서 최신 100가지 규칙을 가져옵니다.

### 2단계: 감사할 파일 지정(AI가 자동 감지하지 않은 경우)

AI가 어떤 파일을 감사할지 묻는 경우:

```bash
# 단일 파일 감사
src/components/Button.tsx

# 여러 파일 감사(공백으로 구분)
src/components/Button.tsx src/components/Input.tsx

# 전체 디렉토리 감사(glob 패턴 사용)
src/components/**/*.tsx
```

### 3단계: AI가 문제 자동 감지

AI가 코드를 규칙별로 확인하고 `file:line` 형식의 감사 결과를 출력합니다. 예를 들어:

```typescript
// ❌ 원본 코드(문제 있음)
export function Button({ icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      {icon}
    </button>
  )
}
```

**AI의 감사 결과**:

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**AI가 제공하는 수정 코드**:

```typescript
// ✅ 수정 후
export function Button({ icon, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded hover:bg-gray-100
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        motion-safe:hover:scale-105 active:scale-100
        motion-reduce:transition-none motion-reduce:transform-none"
    >
      {icon}
    </button>
  )
}
```

### 4단계: 일반적인 문제 예시

#### 문제 1: 폼 입력에 label과 autocomplete 누락

```typescript
// ❌ 오류: label과 autocomplete 누락
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ 올바름: label, name, autocomplete 포함
<label htmlFor="email" className="sr-only">
  Email address
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="your@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**규칙**:
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### 문제 2: 애니메이션이 `prefers-reduced-motion`을 고려하지 않음

```css
/* ❌ 오류: 모든 사용자가 애니메이션을 보고, 전정 장애 사용자에게 친화적이지 않음 */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ 올바름: 사용자의 애니메이션 감소 선호를 존중 */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**규칙**:
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### 문제 3: 이미지에 dimensions와 lazy loading 누락

```typescript
// ❌ 오류: 누적 레이아웃 이동(CLS) 발생
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ 올바름: 공간을 미리 예약하여 레이아웃 이동 방지
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high" // 첫 화면 핵심 이미지용
/>
```

**규칙**:
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### 문제 4: 다크 모드에 `color-scheme` 미설정

```html
<!-- ❌ 오류: 다크 모드에서 네이티브 컨트롤(예: select, input)이 여전히 흰색 배경 -->
<html>
<body>
  <select>...</select>
</body>
</html>
```

```html
<!-- ✅ 올바름: 네이티브 컨트롤이 다크 테마에 자동 적응 -->
<html class="dark">
<head>
  <meta name="theme-color" content="#0f172a" />
</head>
<body style="color-scheme: dark">
  <select style="background-color: #1e293b; color: #e2e8f0">
    ...
  </select>
</body>
</html>
```

**규칙**:
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### 문제 5: 키보드 탐색 지원 불완전

```typescript
// ❌ 오류: 마우스만 클릭 가능하고 키보드 사용자는 사용할 수 없음
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ 올바름: 키보드 탐색 지원(Enter/Space 트리거)
<button
  onClick={handleClick}
  className="cursor-pointer"
  // 키보드 지원이 자동으로 되므로 추가 코드 불필요
>
  Click me
</button>

// 또는 div를 사용해야 하는 경우 키보드 지원 추가:
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }}
  onClick={handleClick}
  className="cursor-pointer"
>
  Click me
</div>
```

**규칙**:
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button> for actions, <a>/<Link> for navigation (not <div onClick>)`
- `Icon-only buttons need aria-label`

#### 문제 6: 긴 목록이 가상화되지 않음

```typescript
// ❌ 오류: 1000개 항목을 렌더링하여 페이지가 끊김
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

```typescript
// ✅ 올바름: 가상 스크롤을 사용하여 보이는 항목만 렌더링
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // 각 항목 높이
    overscan: 5, // 공백 방지를 위해 미리 렌더링할 항목
  })

  return (
    <ul ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {users[virtualItem.index].name}
          </div>
        ))}
      </div>
    </ul>
  )
}
```

**규칙**:
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### 문제 7: 숫자 열에 `tabular-nums` 미사용

```css
/* ❌ 오류: 숫자 너비가 고정되지 않아 정렬이 불안정 */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ 올바름: 숫자가 등폭으로 정렬이 안정 */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**규칙**:
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### 5단계: 일반적인 안티패턴 수정

AI가 이러한 안티패턴을 자동으로 표시합니다:

```typescript
// ❌ 안티패턴 모음
const BadComponent = () => (
  <div>
    {/* 안티패턴 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* 안티패턴 2: 아이콘 버튼에 aria-label 누락 */}
    <button onClick={handleClose}>✕</button>

    {/* 안티패턴 3: 붙여넣기 금지 */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* 안티패턴 4: 포커스 대체 없는 outline-none */}
    <button className="focus:outline-none">...</button>

    {/* 안티패턴 5: 이미지에 dimensions 누락 */}
    <img src="/logo.png" alt="Logo" />

    {/* 안티패턴 6: button 대신 div 사용 */}
    <div onClick={handleClick}>Submit</div>

    {/* 안티패턴 7: 하드코딩된 날짜 형식 */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* 안티패턴 8: 모바일에서 autofocus */}
    <input autoFocus />

    {/* 안티패턴 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* 안티패턴 10: 큰 목록이 가상화되지 않음 */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ 수정 후
const GoodComponent = () => (
  <div>
    {/* 수정 1: 명시적으로 전환 속성 나열 */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* 수정 2: 아이콘 버튼에 aria-label 포함 */}
    <button onClick={handleClose} aria-label="Close dialog">✕</button>

    {/* 수정 3: 붙여넣기 허용 */}
    <Input />

    {/* 수정 4: focus-visible 링 사용 */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* 수정 5: 이미지에 dimensions 포함 */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* 수정 6: 의미론적 button 사용 */}
    <button onClick={handleClick}>Submit</button>

    {/* 수정 7: Intl 형식 사용 */}
    <Text>{new Intl.DateTimeFormat('en-US').format(new Date())}</Text>

    {/* 수정 8: autoFocus는 데스크톱에서만 */}
    <input autoFocus={isDesktop} />

    {/* 수정 9: 확대 허용 */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* 수정 10: 가상화 */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## 체크포인트 ✅

위 단계를 완료한 후 다음을 숙지했는지 확인합니다:

- [ ] AI가 웹 디자인 가이드라인 감사를 트리거하는 방법을 압니다
- [ ] 접근성(Accessibility)의 중요성을 이해합니다(접근성이 최우선 순위)
- [ ] aria-label과 의미론적 HTML을 추가하는 방법을 압니다
- [ ] `prefers-reduced-motion`의 역할을 이해합니다
- [ ] 이미지 로딩을 최적화하는 방법을 압니다(dimensions, lazy loading)
- [ ] 다크 모드의 올바른 구현을 이해합니다(`color-scheme`)
- [ ] 코드에서 일반적인 UI 안티패턴을 식별할 수 있습니다

## 함정 경고

### 함정 1: 시각적 요소에만 집중하고 접근성 무시

::: warning 접근성은 선택 사항이 아닙니다
접근성은 법적 요구사항(예: ADA, WCAG)이자 사회적 책임입니다.

**일반적인 누락**:
- 아이콘 버튼에 `aria-label` 누락
- 사용자 정의 컨트롤(예: 드롭다운)이 키보드를 지원하지 않음
- 폼 입력에 `<label>` 누락
- 비동기 업데이트(예: Toast)에 `aria-live="polite"` 누락
:::

### 함정 2: `transition: all` 과도 사용

::: danger 성능 킬러
`transition: all`은 모든 CSS 속성 변경을 감시하여 브라우저가 많은 값을 다시 계산하게 합니다.

**잘못된 사용법**:
```css
.card {
  transition: all 0.3s ease; // ❌ background, color, transform, padding, margin 등을 전환
}
```

**올바른 사용법**:
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease; // ✅ 필요한 속성만 전환
}
```
:::

### 함정 3: `outline` 대체 방안 잊기

::: focus-visible는 선택 사항이 아닙니다
기본 `outline`을 제거한 후에는 가시적인 포커스 스타일을 제공해야 합니다. 그렇지 않으면 키보드 사용자가 포커스 위치를 알 수 없습니다.

**잘못된 방법**:
```css
button {
  outline: none; // ❌ 포커스를 완전히 제거
}
```

**올바른 방법**:
```css
button {
  outline: none; /* 기본 보기 흉한 윤곽 제거 */
}

button:focus-visible {
  ring: 2px solid blue; /* ✅ 사용자 정의 포커스 스타일 추가(키보드 탐색 시에만) */
}

button:focus {
  /* 마우스 클릭 시 표시되지 않음(focus-visible = false이므로) */
}
```
:::

### 함정 4: 이미지에 `alt` 또는 `dimensions` 누락

::: CLS는 Core Web Vitals 중 하나입니다
`width`와 `height`가 누락되면 페이지 로드 시 레이아웃이 이동하여 사용자 경험과 SEO에 영향을 미칩니다.

**기억하세요**:
- 장식용 이미지는 `alt=""`(빈 문자열) 사용
- 정보 제공용 이미지는 설명적인 `alt` 사용(예: "Team photo: Alice and Bob")
- 모든 이미지에 `width`와 `height` 포함
:::

### 함정 5: 국제화(i18n) 하드코딩 형식

::: Intl API 사용
날짜, 숫자, 통화 형식을 하드코딩하지 말고 브라우저 내장 `Intl` API를 사용하세요.

**잘못된 방법**:
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY') // ❌ 미국 형식, 다른 국가는 혼란
```

**올바른 방법**:
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date) // ✅ 사용자의 로케일을 자동으로 사용
```
:::

## 수업 요약

웹 인터페이스 디자인 가이드라인의 핵심 원칙:

1. **접근성 우선**: 모든 사용자가 사용할 수 있도록 보장(키보드, 스크린 리더)
2. **성능 최적화**: 애니메이션은 `transform/opacity` 사용, 이미지는 lazy load, 큰 목록은 가상화
3. **사용자 선호 존중**: `prefers-reduced-motion`, `color-scheme`, 확대 허용
4. **의미론적 HTML**: `<div>` 대신 `<button>`, `<label>`, `<input>` 사용
5. **완성도 확인**: 다크 모드, 국제화, 폼 검증, 오류 처리
6. **AI 자동화 감사 사용**: Agent Skills가 100가지 규칙을 발견하고 수정하도록 합니다

Vercel의 100가지 규칙은 기본부터 세부사항까지 모든 시나리오를 다루며, AI가 이러한 규칙을 적용하도록 트리거하는 방법을 배우면 UI 품질이 프로덕션 수준에 도달할 것입니다.

## 다음 수업 예고

다음으로 **[Vercel 원클릭 배포](../vercel-deploy/)**를 학습합니다.

학습할 내용:
- Vercel에 프로젝트를 원클릭으로 배포하는 방법(40개 이상의 프레임워크 지원)
- 프레임워크 유형 자동 감지(Next.js, Vue, Svelte 등)
- 미리보기 링크와 소유권 이전 링크 가져오기

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 웹 디자인 가이드라인 스킬 정의 | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | 전체 |
| 규칙 소스(100가지) | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | 전체 |
| README 개요 | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 28-50 |

**17개 규칙 카테고리**:

| 카테고리 | 규칙 수 | 전형적인 규칙 |
| --- | --- | --- |
| Accessibility | 10가지 | aria-labels, 의미론적 HTML, 키보드 처리 |
| Focus States | 4가지 | 가시적 포커스, :focus-visible |
| Forms | 11가지 | autocomplete, 검증, 오류 처리 |
| Animation | 6가지 | prefers-reduced-motion, transform/opacity |
| Typography | 6가지 | curly quotes, ellipsis, tabular-nums |
| Content Handling | 4가지 | 텍스트 잘림, 빈 상태 처리 |
| Images | 3가지 | dimensions, lazy loading, alt text |
| Performance | 6가지 | virtualization, preconnect, 일괄 처리 |
| Navigation & State | 4가지 | URL이 상태 반영, 딥 링크 |
| Touch & Interaction | 5가지 | touch-action, tap-highlight |
| Safe Areas & Layout | 3가지 | 안전 영역, 스크롤바 처리 |
| Dark Mode & Theming | 3가지 | color-scheme, theme-color |
| Locale & i18n | 3가지 | Intl.DateTimeFormat, Intl.NumberFormat |
| Hydration Safety | 3가지 | value + onChange, 셀 불일치 방지 |
| Hover & Interactive States | 2가지 | hover 상태, 대비 |
| Content & Copy | 7가지 | 능동태, 특정 버튼 레이블 |
| Anti-patterns | 20가지 | 일반적인 오류 패턴 플래그 |

**주요 상수**:
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"`: 규칙 가져오기 소스
- `version = "1.0.0"`: 스킬 버전 번호(SKILL.md)

**워크플로우**:
1. `SKILL.md:23-27`: GitHub에서 최신 규칙 가져오기
2. `SKILL.md:31-38`: 사용자 파일 읽기 및 모든 규칙 적용
3. `SKILL.md:39`: 파일이 지정되지 않은 경우 사용자에게 문의

**트리거 키워드**:
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>
