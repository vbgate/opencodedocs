---
title: "React 效能優化: 應用 Vercel 57 條規則 | Agent Skills"
sidebarTitle: "React 效能優化"
subtitle: "React/Next.js 效能優化最佳實踐"
description: "學習 React 和 Next.js 效能優化，應用 Vercel 工程標準的 57 條規則。消除瀑布流、優化打包、減少 Re-render，提升應用效能。涵蓋 8 大類別優化技巧，從架構到微優化全面覆蓋。"
tags:
  - "React"
  - "Next.js"
  - "效能優化"
  - "程式碼審查"
prerequisite:
  - "start-getting-started"
---

# React/Next.js 效能優化最佳實踐

## 學完你能做什麼

- 🎯 讓 AI 自動檢測 React 程式碼中的效能問題，並給出優化建議
- ⚡ 消除瀑布流，加快頁面載入速度 2-10 倍
- 📦 優化打包大小，減少初始載入時間
- 🔄 減少 Re-render，提升頁面回應速度
- 🏗️ 應用 Vercel 工程團隊的生產級最佳實踐

## 你現在的困境

你寫了 React 程式碼，但總覺得哪裡不對勁：

- 頁面載入慢，打開 Developer Tools 看不到問題
- AI 生成的程式碼能用，但不知道是否符合效能最佳實踐
- 看到別人的 Next.js 應用飛快，自己的卻卡頓
- 知道一些優化技巧（如 `useMemo`、`useCallback`），但不知道什麼時候該用
- 每次程式碼審查都要手動檢查效能問題，效率低下

其實，Vercel 工程團隊已經總結了一套 **57 條** 經過實戰驗證的效能優化規則，涵蓋了從"消除瀑布流"到"高級模式"的所有場景。現在，這些規則已經被打包到 Agent Skills 中，你可以讓 AI 自動幫你檢查和優化程式碼。

::: info 什麼是"Agent Skills"
Agent Skills 是為 AI 編碼代理（如 Claude、Cursor、Copilot）提供的擴展技能包。安裝後，AI 會在相關的任務中自動應用這些規則，就像給 AI 配備了一個 Vercel 工程師的大腦。
:::

## 什麼時候用這一招

使用 React 最佳實踐技能的典型場景：

- ❌ **不適用**：簡單的靜態頁面、沒有複雜互動的元件
- ✅ **適用**：
  - 編寫新的 React 元件或 Next.js 頁面
  - 實作 client-side 或 server-side 資料獲取
  - 程式碼審查或重構已有程式碼
  - 優化 bundle 大小或載入時間
  - 使用者的體驗回饋頁面卡頓

## 🎒 開始前的準備

::: warning 前置檢查
在開始之前，請確保你已經：
1. 安裝了 Agent Skills（參考 [安裝指南](../../start/installation/)）
2. 了解 React 和 Next.js 的基礎知識
3. 有一個 React/Next.js 專案需要優化
:::

## 核心思路

React 效能優化不僅僅是用幾個 Hook，而是要從**架構層面**解決問題。Vercel 的 57 條規則按優先級分為 8 個類別：

| 優先級 | 類別 | 關注點 | 典型收益 |
| ------ | ---- | ---- | ---- |
| **CRITICAL** | 消除瀑布流 | 避免串行的 async 操作 | 2-10× 提升 |
| **CRITICAL** | 打包優化 | 減少初始 bundle 大小 | TTI/LCP 顯著改善 |
| **HIGH** | 服務端效能 | 優化資料獲取和快取 | 減少伺服器負載 |
| **MEDIUM-HIGH** | 客戶端資料獲取 | 避免重複請求 | 降低網路流量 |
| **MEDIUM** | Re-render 優化 | 減少不必要的重新渲染 | 提升互動回應速度 |
| **MEDIUM** | 渲染效能 | 優化 CSS 和 JS 執行 | 提升幀率 |
| **LOW-MEDIUM** | JavaScript 效能 | 微優化程式碼執行 | 5-20% 提升 |
| **LOW** | 高級模式 | 特殊場景優化 | 邊界情況 |

**核心原則**：
1. **優先解決 CRITICAL 和 HIGH 級別的問題**——這些變動收益最大
2. **從資料流入手**——先優化非同步操作和資料獲取
3. **再優化渲染**——最後考慮 `useMemo`、`useCallback` 等

## 跟我做

### 第 1 步：觸發 AI 效能審查

開啟你的 React/Next.js 專案，在 Claude 或 Cursor 中輸入：

```
Review this React component for performance issues
```

或

```
Apply React best practices to optimize this code
```

**你應該看到**：AI 會啟用 `vercel-react-best-practices` 技能，並開始應用規則檢查程式碼。

### 第 2 步：AI 自動檢測問題

AI 會逐條檢查程式碼，發現問題後給出修復建議。例如：

```typescript
// ❌ 你的原始程式碼（存在問題）
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**AI 的回饋**：
```
⚠️ async-parallel: 3 個獨立請求串行執行，導致瀑布流
影響：CRITICAL（2-10× 提升）

建議：
使用 Promise.all() 並行執行獨立請求，將 3 次網路往返減少到 1 次。
```

**AI 給出的優化程式碼**：
```typescript
// ✅ 優化後（並行獲取）
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### 第 3 步：常見問題示例

下面是幾個典型的效能問題和修復方案：

#### 問題 1：大元件導致初始 Bundle 過大

```typescript
// ❌ 錯誤：Monaco 編輯器隨主 Bundle 載入（~300KB）
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ 正確：動態導入，按需載入
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**規則**：`bundle-dynamic-imports`（CRITICAL）

#### 問題 2：不必要的 Re-render

```typescript
// ❌ 錯誤：每次父元件更新都會重新渲染 ExpensiveList
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
// ✅ 正確：用 React.memo 包裝，避免不必要的重新渲染
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

**規則**：`rerender-memo`（MEDIUM）

#### 問題 3：在 Effect 中派生狀態

```typescript
// ❌ 錯誤：不必要的 Effect 和額外的 Re-render
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ 正確：在渲染時派生狀態，無需 Effect
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**規則**：`rerender-derived-state-no-effect`（MEDIUM）

### 第 4 步：服務端效能優化（Next.js 特有）

如果你使用 Next.js，AI 還會檢查服務端效能：

```typescript
// ❌ 錯誤：多個獨立的 fetch 串行執行
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ 正確：並行獲取所有資料
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**規則**：`server-parallel-fetching`（**CRITICAL**）

### 第 5 步：React.cache 快取重複計算

```typescript
// ❌ 錯誤：每次渲染都重新計算
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ 正確：用 React.cache 快取，同一請求只執行一次
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // 可能複用 userData
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**規則**：`server-cache-react`（**MEDIUM**）

## 檢查點 ✅

完成上述步驟後，檢查自己是否掌握了：

- [ ] 知道如何觸發 AI 進行 React 效能審查
- [ ] 理解"消除瀑布流"的重要性（CRITICAL 級別）
- [ ] 知道什麼時候用 `Promise.all()` 並行請求
- [ ] 理解動態導入（`next/dynamic`）的作用
- [ ] 知道如何減少不必要的 Re-render
- [ ] 理解 React.cache 在服務端的作用
- [ ] 能夠識別程式碼中的效能問題

## 踩坑提醒

### 坑 1：過度優化

::: warning 不要過早優化
只在確實存在效能問題時才優化。過早使用 `useMemo`、`useCallback` 可能會讓程式碼更難閱讀，而且可能帶來負收益。

**記住**：
- 先用 React DevTools Profiler 測量
- 優先解決 CRITICAL 和 HIGH 級別的問題
- `useMemo` 只在"渲染時計算成本高"時使用
:::

### 坑 2：忽略服務端效能

::: tip Next.js 的特殊性
Next.js 有很多服務端優化技巧（React.cache、parallel fetching、after()），這些比客戶端優化收益更大。

**優先級**：服務端優化 > 客戶端優化 > 微優化
:::

### 坑 3：把所有元件都加 `React.memo`

::: danger React.memo 不是銀彈
`React.memo` 只有在"prop 不變但父元件頻繁更新"時才有用。

**錯誤用法**：
- 簡單元件（渲染時間 < 1ms）
- props 經常變化的元件
- 元件本身就需要回應父元件更新
:::

### 坑 4：依賴 `useEffect` 派生狀態

派生狀態應該在渲染時計算，而不是用 `useEffect` + `setState`。

```typescript
// ❌ 錯誤：Effect 派生狀態（額外的 Re-render）
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ 正確：渲染時計算（零額外開銷）
const filtered = items.filter(...)
```

## 本課小結

React 效能優化的關鍵原則：

1. **消除瀑布流**：獨立操作用 `Promise.all()` 並行執行
2. **減少 Bundle 大小**：大元件用 `next/dynamic` 動態導入
3. **減少 Re-render**：用 `React.memo` 包裝純元件，避免不必要的 Effect
4. **優先服務端優化**：Next.js 的 `React.cache` 和並行獲取收益最大
5. **用 AI 自動化審查**：讓 Agent Skills 幫你發現並修復問題

Vercel 的 57 條規則覆蓋了從架構到微優化的所有場景，學會觸發 AI 應用這些規則，你的程式碼品質會顯著提升。

## 下一課預告

接下來，我們學習 **[Web 介面設計指南審計](../web-design-guidelines/)**。

你會學到：
- 如何用 100+ 條規則審計可訪問性
- 檢查動畫效能和 Focus States
- 審計表單驗證和深色模式支援

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| ---- | -------- | ---- |
| React 最佳實踐技能定義 | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | 全文 |
| 完整規則文件 | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md) | 全文 |
| 57 條規則檔案 | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules) | - |
| 規則模板 | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 全文 |
| 元資料 | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json) | 全文 |
| README 概述 | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 9-27 |

**關鍵檔案（CRITICAL 級別規則示例）**：

| 規則 | 檔案路徑 | 說明 |
| ---- | -------- | ---- |
| Promise.all() 並行請求 | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md) | 消除瀑布流 |
| 動態導入大元件 | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | 減少 Bundle 大小 |
| Defer await | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md) | 延遲執行非同步操作 |

**關鍵常量**：
- `version = "1.0.0"`：規則庫版本號（metadata.json）
- `organization = "Vercel Engineering"`：維護組織

**8 個規則類別**：
- `async-`（消除瀑布流，5 條規則，CRITICAL）
- `bundle-`（打包優化，5 條規則，CRITICAL）
- `server-`（服務端效能，7 條規則，HIGH）
- `client-`（客戶端資料獲取，4 條規則，MEDIUM-HIGH）
- `rerender-`（Re-render 優化，12 條規則，MEDIUM）
- `rendering-`（渲染效能，9 條規則，MEDIUM）
- `js-`（JavaScript 效能，12 條規則，LOW-MEDIUM）
- `advanced-`（高級模式，3 條規則，LOW）

</details>
