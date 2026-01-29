---
title: "React Performance: Vercel's 57 Rules | Agent Skills"
sidebarTitle: "React Best Practices"
subtitle: "React Performance: Vercel's 57 Rules"
description: "Learn React performance optimization using Vercel's 57 engineering rules. Eliminate waterfalls, optimize bundles, reduce re-renders, and boost application performance."
tags:
  - "React"
  - "Next.js"
  - "Performance Optimization"
  - "Code Review"
order: 30
prerequisite:
  - "start-getting-started"
---

# React/Next.js Performance Best Practices

## What You'll Learn

- 🎯 Let AI automatically detect performance issues in React code and provide optimization suggestions
- ⚡ Eliminate waterfalls and speed up page loading by 2-10×
- 📦 Optimize bundle size and reduce initial load time
- 🔄 Reduce re-renders and improve page responsiveness
- 🏗️ Apply production-level best practices from Vercel's engineering team

## Your Current Challenges

You've written React code, but something feels off:

- Pages load slowly, but you can't pinpoint the issue in Developer Tools
- AI-generated code works, but you're unsure if it follows performance best practices
- Others' Next.js apps fly—yours lag
- You know optimization tricks like `useMemo` and `useCallback`, but not when to use them
- Every code review requires manual performance checks—inefficient

> The Vercel engineering team has compiled **57 rules**—battle-tested performance optimization practices covering everything from "eliminating waterfalls" to "advanced patterns." Now, these rules are packaged in Agent Skills. You can let AI automatically check and optimize your code.

::: info What is "Agent Skills"
Agent Skills is an extension pack for AI coding agents (like Claude, Cursor, Copilot). Once installed, AI automatically applies these rules in relevant tasks—like equipping AI with a Vercel engineer's brain.
:::

## When to Use This

Typical scenarios for React Best Practices skill:

- ❌ **Not applicable**: Simple static pages, components without complex interactions
- ✅ **Applicable**:
  - Writing new React components or Next.js pages
  - Implementing client-side or server-side data fetching
  - Code reviews or refactoring existing code
  - Optimizing bundle size or load time
  - Users report page stuttering

## 🎒 Prerequisites

::: warning Pre-flight Check
Before starting, ensure you:
1. Have installed Agent Skills (see [Installation Guide](../../start/installation/))
2. Understand React and Next.js basics
3. Have a React/Next.js project to optimize
:::

## Core Approach

React performance optimization is more than just using a few hooks—it's solving problems at the **architectural level**. Vercel's 57 rules are prioritized into 8 categories:

| Priority | Category | Focus | Typical Gains |
|--- | --- | --- | ---|
| **CRITICAL** | Eliminate Waterfalls | Avoid serial async operations | 2-10× improvement |
| **CRITICAL** | Bundle Optimization | Reduce initial bundle size | Significant TTI/LCP improvement |
| **HIGH** | Server Performance | Optimize data fetching & caching | Reduce server load |
| **MEDIUM-HIGH** | Client Data Fetching | Avoid duplicate requests | Lower network traffic |
| **MEDIUM** | Re-render Optimization | Reduce unnecessary re-renders | Improve interaction responsiveness |
| **MEDIUM** | Rendering Performance | Optimize CSS & JS execution | Increase frame rate |
| **LOW-MEDIUM** | JavaScript Performance | Micro-optimize code execution | 5-20% improvement |
| **LOW** | Advanced Patterns | Special scenario optimizations | Edge cases |

**Core Principles**:
1. **Prioritize CRITICAL and HIGH issues**—these yield the greatest impact
2. **Start with data flow**—optimize async operations and data fetching first
3. **Then optimize rendering**—finally consider `useMemo`, `useCallback`, etc.

## Do It With Me

### Step 1: Trigger AI Performance Review

Open your React/Next.js project, enter in Claude or Cursor:

```
Review this React component for performance issues
```

Or

```
Apply React best practices to optimize this code
```

**You should see**: AI activates the `vercel-react-best-practices` skill and starts applying rules to check the code.

### Step 2: AI Automatically Detects Issues

AI checks the code rule-by-rule, identifies problems, and suggests fixes. For example:

```typescript
// ❌ Your original code (has issues)
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**AI Feedback**:
```
⚠️ async-parallel: 3 independent requests execute serially, causing waterfall
Impact: CRITICAL (2-10× improvement)

Suggestion:
Use Promise.all() to execute independent requests in parallel, reducing 3 network round-trips to 1.
```

**AI's Optimized Code**:

```typescript
// ✅ Optimized (parallel fetching)
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### Step 3: Common Issue Examples

Below are typical performance issues and their fixes:

#### Issue 1: Large Component Causes Excessive Initial Bundle

```typescript
// ❌ Wrong: Monaco editor loads with main bundle (~300KB)
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ Correct: Dynamic import, load on demand
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Rule**: `bundle-dynamic-imports` (CRITICAL)

#### Issue 2: Unnecessary Re-renders

```typescript
// ❌ Wrong: ExpensiveList re-renders on every parent update
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
// ✅ Correct: Wrap with React.memo to avoid unnecessary re-renders
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

**Rule**: `rerender-memo` (MEDIUM)

#### Issue 3: Deriving State in Effects

```typescript
// ❌ Wrong: Unnecessary effect and extra re-render
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ Correct: Derive state during render, no effect needed
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**Rule**: `rerender-derived-state-no-effect` (MEDIUM)

### Step 4: Server Performance Optimization (Next.js Specific)

If you're using Next.js, AI also checks server performance:

```typescript
// ❌ Wrong: Multiple independent fetches execute serially
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ Correct: Fetch all data in parallel
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**Rule**: `server-parallel-fetching` (**CRITICAL**)

### Step 5: React.cache for Repeated Computations

```typescript
// ❌ Wrong: Recalculate on every render
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ Correct: Cache with React.cache, execute each request only once
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // May reuse userData
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**Rule**: `server-cache-react` (**MEDIUM**)

## Checkpoint ✅

After completing the above steps, verify you've mastered:

- [ ] Know how to trigger AI for React performance review
- [ ] Understand the importance of "eliminating waterfalls" (CRITICAL level)
- [ ] Know when to use `Promise.all()` for parallel requests
- [ ] Understand the role of dynamic imports (`next/dynamic`)
- [ ] Know how to reduce unnecessary re-renders
- [ ] Understand React.cache's role on the server
- [ ] Can identify performance issues in code

## Common Pitfalls

### Pitfall 1: Over-Optimization

::: warning Don't Optimize Prematurely
Only optimize when performance issues actually exist. Premature use of `useMemo` and `useCallback` can make code harder to read and may yield negative returns.

**Remember**:
- Measure first with React DevTools Profiler
- Prioritize CRITICAL and HIGH issues
- Use `useMemo` only when "render-time computation is expensive"
:::

### Pitfall 2: Ignoring Server Performance

::: tip Next.js Specialties
Next.js has many server optimization techniques (React.cache, parallel fetching, after())—these yield greater gains than client-side optimization.

**Priority**: Server optimization > Client optimization > Micro-optimization
:::

### Pitfall 3: Adding `React.memo` to Everything

::: danger React.memo Is Not a Silver Bullet
`React.memo` only helps when "props don't change but parent updates frequently."

**Wrong usage**:
- Simple components (render time < 1ms)
- Components with frequently changing props
- Components that need to respond to parent updates
:::

### Pitfall 4: Relying on `useEffect` for Derived State

Derived state should be calculated during render, not with `useEffect` + `setState`.

```typescript
// ❌ Wrong: Effect derives state (extra re-render)
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ Correct: Calculate during render (zero extra overhead)
const filtered = items.filter(...)
```

## Summary

Key principles of React performance optimization:

1. **Eliminate waterfalls**: Execute independent operations in parallel with `Promise.all()`
2. **Reduce bundle size**: Use `next/dynamic` for dynamic imports of large components
3. **Reduce re-renders**: Wrap pure components with `React.memo`, avoid unnecessary effects
4. **Prioritize server optimization**: Next.js's `React.cache` and parallel fetching yield maximum gains
5. **Automate review with AI**: Let Agent Skills discover and fix issues for you

Vercel's 57 rules cover all scenarios from architecture to micro-optimizations. Learning to trigger AI to apply these rules will significantly boost your code quality.

## Next Up

Next, we'll learn **[Web UI Design Guidelines Audit](../web-design-guidelines/)**.

You'll learn:
- How to audit accessibility (a11y) with 100+ rules
- Check animation performance and focus states
- Audit form validation and dark mode support

---

## Appendix: Source Reference

<details>
<summary><strong>Expand to view source locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| React Best Practices skill definition | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Full text |
| Complete rules documentation | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md) | Full text |
| 57 rules files | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) | - |
| Rule template | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Full text |
| Metadata | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json) | Full text |
| README overview | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 9-27 |

**Key Files (CRITICAL Rule Examples)**:

| Rule | File Path | Description |
|--- | --- | ---|
| Promise.all() parallel requests | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md) | Eliminate waterfalls |
| Dynamic import large components | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | Reduce bundle size |
| Defer await | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md) | Delay async operations |

**Key Constants**:
- `version = "1.0.0"`: Rules library version (metadata.json)
- `organization = "Vercel Engineering"`: Maintaining organization

**8 Rule Categories**:
- `async-` (Eliminate waterfalls, 5 rules, CRITICAL)
- `bundle-` (Bundle optimization, 5 rules, CRITICAL)
- `server-` (Server performance, 7 rules, HIGH)
- `client-` (Client data fetching, 4 rules, MEDIUM-HIGH)
- `rerender-` (Re-render optimization, 12 rules, MEDIUM)
- `rendering-` (Rendering performance, 9 rules, MEDIUM)
- `js-` (JavaScript performance, 12 rules, LOW-MEDIUM)
- `advanced-` (Advanced patterns, 3 rules, LOW)

</details>
