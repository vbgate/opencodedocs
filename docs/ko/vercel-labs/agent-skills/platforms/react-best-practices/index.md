---
title: "React 성능 최적화: Vercel 57가지 규칙 적용 | Agent Skills"
sidebarTitle: "React 2-10× 빠르게"
subtitle: "React/Next.js 성능 최적화 베스트 프랙티스"
description: "React와 Next.js 성능 최적화를 학습합니다. Vercel 엔지니어링 표준 57가지 규칙을 적용합니다. 워터폴 제거, 번들 최적화, Re-render 감소로 애플리케이션 성능을 향상시킵니다."
tags:
  - "React"
  - "Next.js"
  - "성능 최적화"
  - "코드 감사"
order: 30
prerequisite:
  - "start-getting-started"
---

# React/Next.js 성능 최적화 베스트 프랙티스

## 학습 후 할 수 있는 것

- 🎯 AI가 React 코드에서 성능 문제를 자동으로 감지하고 최적화 제안을 제공하게 합니다
- ⚡ 워터폴을 제거하여 페이지 로딩 속도를 2-10배 향상시킵니다
- 📦 번들 크기를 최적화하여 초기 로딩 시간을 줄입니다
- 🔄 Re-render를 줄여 페이지 응답 속도를 높입니다
- 🏗️ Vercel 엔지니어링 팀의 프로덕션급 베스트 프랙티스를 적용합니다

## 현재 당면한 문제

React 코드를 작성했지만 어딘가 잘못되었다고 느끼는 경우:

- 페이지 로딩이 느리고 Developer Tools를 열어도 문제가 보이지 않습니다
- AI가 생성한 코드는 작동하지만 성능 베스트 프랙티스를 따르는지 모릅니다
- 다른 사람의 Next.js 애플리케이션은 빠른데 본인의 것은 버벅거립니다
- 일부 최적화 기술(`useMemo`, `useCallback` 등)은 알지만 언제 사용해야 할지 모릅니다
- 매번 코드 감사에서 성능 문제를 수동으로 검사하여 효율이 낮습니다

실제로 Vercel 엔지니어링 팀은 **57가지** 실증된 성능 최적화 규칙을 정리했습니다. 이는 "워터폴 제거"부터 "고급 모드"까지 모든 시나리오를 다룹니다. 이제 이 규칙들이 Agent Skills에 패키징되어 AI가 자동으로 코드를 감사하고 최적화할 수 있습니다.

::: info "Agent Skills"란 무엇인가
Agent Skills는 AI 코딩 에이전트(Claude, Cursor, Copilot 등)용 확장 스킬 팩입니다. 설치 후 AI는 관련 작업에서 이 규칙들을 자동으로 적용합니다. 마치 Vercel 엔지니어의 뇌를 AI에 장착한 것과 같습니다.
:::

## 언제 이 기술 사용

React 베스트 프랙티스 스킬을 사용하는 일반적인 시나리오:

- ❌ **해당 안 함**: 간단한 정적 페이지, 복잡한 상호작용이 없는 컴포넌트
- ✅ **해당**:
  - 새로운 React 컴포넌트 또는 Next.js 페이지 작성
  - client-side 또는 server-side 데이터 가져오기 구현
  - 기존 코드 감사 또는 리팩터링
  - 번들 크기 또는 로딩 시간 최적화
  - 사용자가 페이지 버벅거림을 피드백

## 🎒 시작 전 준비

::: warning 사전 확인
시작하기 전에 이미 다음을 완료했는지 확인하세요:
1. Agent Skills 설치([설치 가이드](../../start/installation/) 참조)
2. React와 Next.js의 기초 지식 이해
3. 최적화할 React/Next.js 프로젝트 보유
:::

## 핵심 아이디어

React 성능 최적화는 단순히 몇 가지 Hook을 사용하는 것이 아니라 **아키텍처 레벨**에서 문제를 해결해야 합니다. Vercel의 57가지 규칙은 우선순위에 따라 8개 카테고리로 나뉩니다:

| 우선순위          | 카테고리            | 포인트                | 일반적인 이득         |
|--- | --- | --- | ---|
| **CRITICAL**    | 워터폴 제거      | 직렬 비동기 작업 방지 | 2-10× 향상       |
| **CRITICAL**    | 번들 최적화        | 초기 번들 크기 감소  | TTI/LCP 크게 개선 |
| **HIGH**        | 서버 성능      | 데이터 가져오기 및 캐시 최적화    | 서버 부하 감소   |
| **MEDIUM-HIGH** | 클라이언트 데이터 가져오기  | 중복 요청 방지          | 네트워크 트래픽 감소     |
| **MEDIUM**      | Re-render 최적화  | 불필요한 다시 렌더링 방지  | 상호작용 응답 속도 향상 |
| **MEDIUM**      | 렌더링 성능        | CSS 및 JS 실행 최적화   | 프레임 레이트 향상         |
| **LOW-MEDIUM**  | JavaScript 성능 | 코드 실행 미세 최적화        | 5-20% 향상       |
| **LOW**         | 고급 모드        | 특수 시나리오 최적화          | 경계 조건         |

**핵심 원칙**:
1. **CRITICAL 및 HIGH 레벨 문제를 우선 해결**——이 변경이 가장 큰 이득을 제공
2. **데이터 흐름부터 시작**——먼저 비동기 작업과 데이터 가져오기를 최적화
3. **그 다음 렌더링 최적화**——마지막에 `useMemo`, `useCallback` 등 고려

## 따라 하기

### 1단계: AI 성능 감사 트리거

React/Next.js 프로젝트를 열고 Claude 또는 Cursor에서 다음을 입력합니다:

```
Review this React component for performance issues
```

또는

```
Apply React best practices to optimize this code
```

**예상 결과**: AI가 `vercel-react-best-practices` 스킬을 활성화하고 규칙을 적용하여 코드를 검사합니다.

### 2단계: AI가 문제 자동 감지

AI가 코드를 줄별로 검사하고 문제를 발견하면 수정 제안을 제공합니다. 예를 들어:

```typescript
// ❌ 원본 코드(문제 존재)
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**AI 피드백**:
```
⚠️ async-parallel: 3개 독립 요청이 직렬로 실행되어 워터폴 발생
영향: CRITICAL(2-10× 향상)

제안:
Promise.all()을 사용하여 독립 요청을 병렬로 실행하고, 3회 네트워크 왕복을 1회로 줄입니다.
```

**AI가 제공한 최적화 코드**:
```typescript
// ✅ 최적화 후(병렬 가져오기)
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### 3단계: 일반적인 문제 예제

다음은 몇 가지 일반적인 성능 문제와 해결 방법입니다:

#### 문제 1: 큰 컴포넌트로 인해 초기 번들 과도

```typescript
// ❌ 오류: Monaco 에디터가 메인 번들과 함께 로드됨(~300KB)
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ 올바름: 동적 가져오기, 필요 시 로드
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**규칙**: `bundle-dynamic-imports`（CRITICAL）

#### 문제 2: 불필요한 Re-render

```typescript
// ❌ 오류: 부모 컴포넌트가 업데이트될 때마다 ExpensiveList가 다시 렌더링됨
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

```typescript
// ✅ 올바름: React.memo로 래핑하여 불필요한 다시 렌더링 방지
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  // ...
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

**규칙**: `rerender-memo`（MEDIUM）

#### 문제 3: Effect에서 파생 상태

```typescript
// ❌ 오류: 불필요한 Effect와 추가 Re-render
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ 올바름: 렌더링 시 파생 상태 계산, Effect 불필요
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**규칙**: `rerender-derived-state-no-effect`（MEDIUM）

### 4단계: 서버 성능 최적화(Next.js 특유)

Next.js를 사용하는 경우 AI는 서버 성능도 검사합니다:

```typescript
// ❌ 오류: 여러 독립 fetch가 직렬로 실행됨
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ 올바름: 모든 데이터 병렬로 가져오기
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**규칙**: `server-parallel-fetching`（**CRITICAL**）

### 5단계: React.cache로 중복 계산 캐시

```typescript
// ❌ 오류: 매번 렌더링할 때마다 다시 계산
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ 올바름: React.cache로 캐시, 동일 요청은 한 번만 실행
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // userData 재사용 가능
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**규칙**: `server-cache-react`（**MEDIUM**）

## 검사점 ✅

위 단계를 완료한 후, 다음을 숙달했는지 확인하세요:

- [ ] AI가 React 성능 감사를 수행하도록 트리거하는 방법 알기
- [ ] "워터폴 제거"의 중요성 이해(CRITICAL 레벨)
- [ ] `Promise.all()` 병렬 요청을 사용하는 시점 알기
- [ ] 동적 가져오기(`next/dynamic`)의 역할 이해
- [ ] 불필요한 Re-render를 줄이는 방법 알기
- [ ] 서버에서 React.cache의 역할 이해
- [ ] 코드에서 성능 문제 식별 가능

## 피해야 할 함정

### 함정 1: 과도 최적화

::: warning 조기 최적화하지 마세요
실제 성능 문제가 있는 경우에만 최적화합니다. 조기에 `useMemo`, `useCallback`을 사용하면 코드를 읽기 어렵게 만들고 역효과를 줄 수 있습니다.

**기억하세요**:
- 먼저 React DevTools Profiler로 측정
- CRITICAL 및 HIGH 레벨 문제 우선 해결
- `useMemo`는 "렌더링 시 계산 비용이 높을 때"만 사용
:::

### 함정 2: 서버 성능 무시

::: tip Next.js의 특수성
Next.js는 많은 서버 최적화 기술(React.cache, 병렬 가져오기, after())을 가지고 있으며, 이는 클라이언트 최적화보다 더 큰 이득을 제공합니다.

**우선순위**: 서버 최적화 > 클라이언트 최적화 > 미세 최적화
:::

### 함정 3: 모든 컴포넌트에 `React.memo` 추가

::: danger React.memo는 만능 해결책이 아닙니다
`React.memo`는 "prop이 변하지 않지만 부모 컴포넌트가 자주 업데이트"할 때만 유용합니다.

**잘못된 사용법**:
- 간단한 컴포넌트(렌더링 시간 < 1ms)
- prop이 자주 변하는 컴포넌트
- 컴포넌트가 부모 업데이트에 응답해야 하는 경우
:::

### 함정 4: `useEffect`에 의존하여 파생 상태

파생 상태(derived state)는 렌더링 시 계산해야 하며, `useEffect` + `setState`를 사용하지 않습니다.

```typescript
// ❌ 오류: Effect로 파생 상태(추가 Re-render)
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ 올바름: 렌더링 시 계산(추가 오버헤드 없음)
const filtered = items.filter(...)
```

## 이 과정 요약

React 성능 최적화의 핵심 원칙:

1. **워터폴 제거**: 독립 작업을 `Promise.all()`로 병렬 실행
2. **번들 크기 감소**: 큰 컴포넌트를 `next/dynamic`로 동적 가져오기
3. **Re-render 감소**: 순수 컴포넌트를 `React.memo`로 래핑, 불필요한 Effect 방지
4. **서버 최적화 우선**: Next.js의 `React.cache`와 병렬 가져오기가 가장 큰 이득
5. **AI 자동화 감사 사용**: Agent Skills가 문제를 발견하고 수정하도록

Vercel의 57가지 규칙은 아키텍처부터 미세 최적화까지 모든 시나리오를 다루며, AI가 이 규칙을 적용하도록 트리거하면 코드 품질이 크게 향상됩니다.

## 다음 과정 예고

다음으로 **[웹 인터페이스 디자인 가이드 감사](../web-design-guidelines/)**를 학습합니다.

배우게 될 것:
- 100개 이상 규칙으로 접근성(a11y) 감사 방법
- 애니메이션 성능 및 Focus States 검사
- 양식 유효성 검사 및 다크 모드 지원 감사

---

## 부록: 소스 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 날짜: 2026-01-25

| 기능                   | 파일 경로                                                                                                                                                 | 행번호 |
|--- | --- | ---|
| React 베스트 프랙티스 스킬 정의 | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md)                     | 전체 |
| 완전 규칙 문서           | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md)                   | 전체 |
| 57개 규칙 파일          | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules)                      | -    |
| 규칙 템플릿               | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 전체 |
| 메타데이터                 | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json)           | 전체 |
| README 개요            | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md)                                                                           | 9-27 |

**핵심 파일(CRITICAL 레벨 규칙 예제)**:

| 규칙                   | 파일 경로                                                                                                                                         | 설명             |
|--- | --- | ---|
| Promise.all() 병렬 요청 | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md)                 | 워터폴 제거       |
| 큰 컴포넌트 동적 가져오기         | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | 번들 크기 감소 |
| Defer await            | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md)           | 비동기 작업 지연 실행 |

**핵심 상수**:
- `version = "1.0.0"`: 규칙 라이브러리 버전 번호(metadata.json)
- `organization = "Vercel Engineering"`: 유지 관리 조직

**8개 규칙 카테고리**:
- `async-`（워터폴 제거, 5개 규칙, CRITICAL）
- `bundle-`（번들 최적화, 5개 규칙, CRITICAL）
- `server-`（서버 성능, 7개 규칙, HIGH）
- `client-`（클라이언트 데이터 가져오기, 4개 규칙, MEDIUM-HIGH）
- `rerender-`（Re-render 최적화, 12개 규칙, MEDIUM）
- `rendering-`（렌더링 성능, 9개 규칙, MEDIUM）
- `js-`（JavaScript 성능, 12개 규칙, LOW-MEDIUM）
- `advanced-`（고급 모드, 3개 규칙, LOW）

</details>
