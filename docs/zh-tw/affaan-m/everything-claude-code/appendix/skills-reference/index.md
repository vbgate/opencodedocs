---
title: "Skills 參考：11 個技能庫 | Everything Claude Code"
sidebarTitle: "5 分鐘速查 11 個技能"
subtitle: "Skills 參考：11 個技能庫"
description: "學習 Everything Claude Code 的 11 個技能庫應用。掌握編碼標準、後端/前端模式、TDD 工作流程和安全審查，提升開發效率。"
tags:
  - "skills"
  - "coding-standards"
  - "backend-patterns"
  - "frontend-patterns"
  - "tdd-workflow"
  - "security-review"
prerequisite:
  - "start-quickstart"
order: 210
---

# Skills 完整參考：11 個技能庫詳解

## 學完你能做什麼

- 快速查找和理解所有 11 個技能庫的內容和用途
- 在開發過程中正確應用編碼標準、架構模式和最佳實踐
- 知道何時使用哪個技能來提升開發效率和代碼品質
- 掌握 TDD 工作流程、安全審查、持續學習等關鍵技能

## 你現在的困境

面對項目中的 11 個技能庫，你可能會：

- **記不住所有技能**：coding-standards、backend-patterns、security-review... 哪些技能在什麼時候用？
- **不知道如何應用**：技能提到了不可變模式、TDD 流程，但具體怎麼操作？
- **不知道找哪個幫忙**：遇到安全問題用哪個技能？後端開發用哪個技能？
- **技能和 Agent 的關係**：技能和 Agents 有什麼區別？什麼時候用 Agent，什麼時候用 Skill？

這份參考文檔幫你全面了解每個技能的內容、應用場景和使用方法。

---

## Skills 概覽

Everything Claude Code 包含 11 個技能庫，每套技能都有明確的目標和應用場景：

| 技能庫 | 目標 | 優先級 | 使用場景 |
|--- | --- | --- | ---|
| **coding-standards** | 統一編碼規範、最佳實踐 | P0 | 通用編碼、TypeScript/JavaScript/React |
| **backend-patterns** | 後端架構模式、API 設計 | P0 | Node.js、Express、Next.js API 路由開發 |
| **frontend-patterns** | 前端開發模式、性能優化 | P0 | React、Next.js、狀態管理 |
| **tdd-workflow** | 測試驅動開發工作流程 | P0 | 新功能開發、Bug 修復、重構 |
| **security-review** | 安全審查和漏洞檢測 | P0 | 認證授權、輸入驗證、敏感資料處理 |
| **continuous-learning** | 自動提取可複用模式 | P1 | 長期項目、知識沉澱 |
| **strategic-compact** | 策略性上下文壓縮 | P1 | 長會話、複雜任務 |
| **eval-harness** | 評估驅動開發框架 | P1 | AI 開發評估、可靠性測試 |
| **verification-loop** | 綜合驗證系統 | P1 | PR 前驗證、品質檢查 |
| **project-guidelines-example** | 項目指南示例 | P2 | 自定義項目規範 |
| **clickhouse-io** | ClickHouse 分析模式 | P2 | 高效能分析查詢 |

::: info Skills vs Agents

**Skills** 是工作流程定義和領域知識庫，提供模式、最佳實踐和規範指導。

**Agents** 是專業化子代理，執行特定領域的複雜任務（如規劃、審查、調試）。

兩者相輔相成：Skills 提供知識框架，Agents 執行具體任務。
:::


## 1. coding-standards（編碼標準）

### 核心原則

#### 1. 可讀性優先
- 代碼被閱讀的次數遠多於被編寫的次數
- 清晰的變數和函數命名
- 自解釋的代碼優於註釋
- 一致的格式

#### 2. KISS 原則（Keep It Simple, Stupid）
- 使用最簡單的有效解決方案
- 避免過度設計
- 不做過早優化
- 容易理解 > 聰明代碼

#### 3. DRY 原則（Don't Repeat Yourself）
- 提取公共邏輯到函數
- 創建可複用組件
- 跨模組共享工具函數
- 避免複製貼上編程

#### 4. YAGNI 原則（You Aren't Gonna Need It）
- 不要在需要之前構建功能
- 避免推測性的泛化
- 只在需要時增加複雜度
- 從簡單開始，需要時重構

### 不可變模式（CRITICAL）

::: warning 關鍵規則

始終創建新物件，絕不修改現有物件！這是代碼品質最重要的原則之一。
:::

**❌ 錯誤做法**：直接修改物件

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 正確做法**：創建新物件

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### TypeScript/JavaScript 最佳實踐

#### 變數命名

```typescript
// ✅ GOOD: 描述性命名
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: 不清楚的命名
const q = 'election'
const flag = true
const x = 1000
```

#### 函數命名

```typescript
// ✅ GOOD: 動詞-名詞模式
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 不清楚或只有名詞
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### 錯誤處理

```typescript
// ✅ GOOD: 全面的錯誤處理
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ BAD: 沒有錯誤處理
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### 並行執行

```typescript
// ✅ GOOD: 盡可能並行執行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 不必要的順序執行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### React 最佳實踐

#### 組件結構

```typescript
// ✅ GOOD: 帶類型的函數組件
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ BAD: 沒有類型，結構不清楚
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

