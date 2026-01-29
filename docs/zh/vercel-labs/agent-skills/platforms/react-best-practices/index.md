---
title: "React 性能优化：应用 Vercel 57 条规则 | Agent Skills"
sidebarTitle: "React 快 2-10×"
subtitle: "React/Next.js 性能优化最佳实践"
description: "学习 React 和 Next.js 性能优化，应用 Vercel 工程标准的 57 条规则。消除瀑布流、优化打包、减少 Re-render，提升应用性能。"
tags:
  - "React"
  - "Next.js"
  - "性能优化"
  - "代码审查"
order: 30
prerequisite:
  - "start-getting-started"
---

# React/Next.js 性能优化最佳实践

## 学完你能做什么

- 🎯 让 AI 自动检测 React 代码中的性能问题，并给出优化建议
- ⚡ 消除瀑布流，加快页面加载速度 2-10 倍
- 📦 优化打包大小，减少初始加载时间
- 🔄 减少 Re-render，提升页面响应速度
- 🏗️ 应用 Vercel 工程团队的生产级最佳实践

## 你现在的困境

你写了 React 代码，但总觉得哪里不对劲：

- 页面加载慢，打开 Developer Tools 看不到问题
- AI 生成的代码能用，但不知道是否符合性能最佳实践
- 看到别人的 Next.js 应用飞快，自己的却卡顿
- 知道一些优化技巧（如 `useMemo`、`useCallback`），但不知道什么时候该用
- 每次代码审查都要手动检查性能问题，效率低下

其实，Vercel 工程团队已经总结了一套 **57 条** 经过实战验证的性能优化规则，涵盖了从"消除瀑布流"到"高级模式"的所有场景。现在，这些规则已经被打包到 Agent Skills 中，你可以让 AI 自动帮你检查和优化代码。

::: info 什么是"Agent Skills"
Agent Skills 是为 AI 编码代理（如 Claude、Cursor、Copilot）提供的扩展技能包。安装后，AI 会在相关的任务中自动应用这些规则，就像给 AI 配备了一个 Vercel 工程师的大脑。
:::

## 什么时候用这一招

使用 React 最佳实践技能的典型场景：

- ❌ **不适用**：简单的静态页面、没有复杂交互的组件
- ✅ **适用**：
  - 编写新的 React 组件或 Next.js 页面
  - 实现 client-side 或 server-side 数据获取
  - 代码审查或重构已有代码
  - 优化 bundle 大小或加载时间
  - 用户的体验反馈页面卡顿

## 🎒 开始前的准备

::: warning 前置检查
在开始之前，请确保你已经：
1. 安装了 Agent Skills（参考 [安装指南](../../start/installation/)）
2. 了解 React 和 Next.js 的基础知识
3. 有一个 React/Next.js 项目需要优化
:::

## 核心思路

React 性能优化不仅仅是用几个 Hook，而是要从**架构层面**解决问题。Vercel 的 57 条规则按优先级分为 8 个类别：

| 优先级          | 类别            | 关注点                | 典型收益         |
| --------------- | --------------- | --------------------- | ---------------- |
| **CRITICAL**    | 消除瀑布流      | 避免串行的 async 操作 | 2-10× 提升       |
| **CRITICAL**    | 打包优化        | 减少初始 bundle 大小  | TTI/LCP 显著改善 |
| **HIGH**        | 服务端性能      | 优化数据获取和缓存    | 减少服务器负载   |
| **MEDIUM-HIGH** | 客户端数据获取  | 避免重复请求          | 降低网络流量     |
| **MEDIUM**      | Re-render 优化  | 减少不必要的重新渲染  | 提升交互响应速度 |
| **MEDIUM**      | 渲染性能        | 优化 CSS 和 JS 执行   | 提升帧率         |
| **LOW-MEDIUM**  | JavaScript 性能 | 微优化代码执行        | 5-20% 提升       |
| **LOW**         | 高级模式        | 特殊场景优化          | 边界情况         |

**核心原则**：
1. **优先解决 CRITICAL 和 HIGH 级别的问题**——这些改动收益最大
2. **从数据流入手**——先优化异步操作和数据获取
3. **再优化渲染**——最后考虑 `useMemo`、`useCallback` 等

## 跟我做

### 第 1 步：触发 AI 性能审查

打开你的 React/Next.js 项目，在 Claude 或 Cursor 中输入：

```
Review this React component for performance issues
```

或

```
Apply React best practices to optimize this code
```

**你应该看到**：AI 会激活 `vercel-react-best-practices` 技能，并开始应用规则检查代码。

### 第 2 步：AI 自动检测问题

AI 会逐条检查代码，发现问题后给出修复建议。例如：

```typescript
// ❌ 你的原始代码（存在问题）
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**AI 的反馈**：
```
⚠️ async-parallel: 3 个独立请求串行执行，导致瀑布流
影响：CRITICAL（2-10× 提升）

建议：
使用 Promise.all() 并行执行独立请求，将 3 次网络往返减少到 1 次。
```

**AI 给出的优化代码**：
```typescript
// ✅ 优化后（并行获取）
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### 第 3 步：常见问题示例

下面是几个典型的性能问题和修复方案：

#### 问题 1：大组件导致初始 Bundle 过大

```typescript
// ❌ 错误：Monaco 编辑器随主 Bundle 加载（~300KB）
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ 正确：动态导入，按需加载
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**规则**：`bundle-dynamic-imports`（CRITICAL）

#### 问题 2：不必要的 Re-render

```typescript
// ❌ 错误：每次父组件更新都会重新渲染 ExpensiveList
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
// ✅ 正确：用 React.memo 包装，避免不必要的重新渲染
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

**规则**：`rerender-memo`（MEDIUM）

#### 问题 3：在 Effect 中派生状态

```typescript
// ❌ 错误：不必要的 Effect 和额外的 Re-render
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ 正确：在渲染时派生状态，无需 Effect
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**规则**：`rerender-derived-state-no-effect`（MEDIUM）

### 第 4 步：服务端性能优化（Next.js 特有）

如果你使用 Next.js，AI 还会检查服务端性能：

```typescript
// ❌ 错误：多个独立的 fetch 串行执行
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ 正确：并行获取所有数据
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**规则**：`server-parallel-fetching`（**CRITICAL**）

### 第 5 步：React.cache 缓存重复计算

```typescript
// ❌ 错误：每次渲染都重新计算
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ 正确：用 React.cache 缓存，同一请求只执行一次
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // 可能复用 userData
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**规则**：`server-cache-react`（**MEDIUM**）

## 检查点 ✅

完成上述步骤后，检查自己是否掌握了：

- [ ] 知道如何触发 AI 进行 React 性能审查
- [ ] 理解"消除瀑布流"的重要性（CRITICAL 级别）
- [ ] 知道什么时候用 `Promise.all()` 并行请求
- [ ] 理解动态导入（`next/dynamic`）的作用
- [ ] 知道如何减少不必要的 Re-render
- [ ] 理解 React.cache 在服务端的作用
- [ ] 能够识别代码中的性能问题

## 踩坑提醒

### 坑 1：过度优化

::: warning 不要过早优化
只在确实存在性能问题时才优化。过早使用 `useMemo`、`useCallback` 可能会让代码更难阅读，而且可能带来负收益。

**记住**：
- 先用 React DevTools Profiler 测量
- 优先解决 CRITICAL 和 HIGH 级别的问题
- `useMemo` 只在"渲染时的计算成本高"时使用
:::

### 坑 2：忽略服务端性能

::: tip Next.js 的特殊性
Next.js 有很多服务端优化技巧（React.cache、parallel fetching、after()），这些比客户端优化收益更大。

**优先级**：服务端优化 > 客户端优化 > 微优化
:::

### 坑 3：把所有组件都加 `React.memo`

::: danger React.memo 不是银弹
`React.memo` 只有在"prop 不变但父组件频繁更新"时才有用。

**错误用法**：
- 简单组件（渲染时间 < 1ms）
- props 经常变化的组件
- 组件本身就需要响应父组件更新
:::

### 坑 4：依赖 `useEffect` 派生状态

派生状态（derived state）应该在渲染时计算，而不是用 `useEffect` + `setState`。

```typescript
// ❌ 错误：Effect 派生状态（额外的 Re-render）
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ 正确：渲染时计算（零额外开销）
const filtered = items.filter(...)
```

## 本课小结

React 性能优化的关键原则：

1. **消除瀑布流**：独立操作用 `Promise.all()` 并行执行
2. **减少 Bundle 大小**：大组件用 `next/dynamic` 动态导入
3. **减少 Re-render**：用 `React.memo` 包装纯组件，避免不必要的 Effect
4. **优先服务端优化**：Next.js 的 `React.cache` 和并行获取收益最大
5. **用 AI 自动化审查**：让 Agent Skills 帮你发现并修复问题

Vercel 的 57 条规则覆盖了从架构到微优化的所有场景，学会触发 AI 应用这些规则，你的代码质量会显著提升。

## 下一课预告

接下来，我们学习 **[Web 界面设计指南审计](../web-design-guidelines/)**。

你会学到：
- 如何用 100+ 条规则审计可访问性（a11y）
- 检查动画性能和 Focus States
- 审计表单验证和深色模式支持

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                   | 文件路径                                                                                                                                                 | 行号 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| React 最佳实践技能定义 | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md)                     | 全文 |
| 完整规则文档           | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md)                   | 全文 |
| 57 条规则文件          | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules)                      | -    |
| 规则模板               | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 全文 |
| 元数据                 | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json)           | 全文 |
| README 概述            | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md)                                                                           | 9-27 |

**关键文件（CRITICAL 级别规则示例）**：

| 规则                   | 文件路径                                                                                                                                         | 说明             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| Promise.all() 并行请求 | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md)                 | 消除瀑布流       |
| 动态导入大组件         | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | 减少 Bundle 大小 |
| Defer await            | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md)           | 延迟执行异步操作 |

**关键常量**：
- `version = "1.0.0"`：规则库版本号（metadata.json）
- `organization = "Vercel Engineering"`：维护组织

**8 个规则类别**：
- `async-`（消除瀑布流，5 条规则，CRITICAL）
- `bundle-`（打包优化，5 条规则，CRITICAL）
- `server-`（服务端性能，7 条规则，HIGH）
- `client-`（客户端数据获取，4 条规则，MEDIUM-HIGH）
- `rerender-`（Re-render 优化，12 条规则，MEDIUM）
- `rendering-`（渲染性能，9 条规则，MEDIUM）
- `js-`（JavaScript 性能，12 条规则，LOW-MEDIUM）
- `advanced-`（高级模式，3 条规则，LOW）

</details>
