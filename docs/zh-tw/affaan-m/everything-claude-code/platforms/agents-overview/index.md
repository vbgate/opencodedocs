---
title: "Agents: 9 個專業化代理 | Everything Claude Code"
sidebarTitle: "用對 Agent，效率翻倍"
subtitle: "Agents: 9 個專業化代理 | Everything Claude Code"
description: "學習 Everything Claude Code 的 9 個專業化 agents，掌握不同場景的呼叫方法，提升 AI 輔助開發的效率和品質。"
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# 核心 Agents 詳解：9 個專業化子代理

## 學完你能做什麼

- 理解 9 個專業化 agents 的職責和使用場景
- 知道在不同開發任務中應該呼叫哪個 agent
- 掌握 agents 之間的協作方式，建構高效開發流程
- 避免「通用 AI」的侷限性，利用專業化 agents 提升效率

## 你現在的困境

- 經常讓 Claude 做一些任務，但得到的回覆不夠專業或不夠深入
- 不確定什麼時候該用 /plan、/tdd、/code-review 等指令
- 覺得 AI 給出的建議太泛，缺少針對性
- 想要一套系統化的開發工作流程，但不知道如何組織

## 什麼時候用這一招

當你需要完成以下任務時，這個教學會幫到你：
- 複雜功能開發前的規劃
- 編寫新功能或修復 bug
- 程式碼審查和安全稽核
- 建置錯誤修復
- 端對端測試
- 程式碼重構和清理
- 文件更新

## 核心思路

Everything Claude Code 提供了 9 個專業化 agents，每個 agent 都專注於特定領域。就像你在真實團隊中會找不同角色的專家一樣，不同的開發任務應該呼叫不同的 agent。

::: info Agent vs Command
- **Agent**：專業的 AI 助手，有特定領域的知識和工具
- **Command**：快捷方式，用於快速呼叫 agent 或執行特定操作

例如：`/tdd` 指令會呼叫 `tdd-guide` agent 來執行測試驅動開發流程。
:::

### 9 個 Agents 總覽

| Agent | 角色 | 典型場景 | 關鍵能力 |
| --- | --- | --- | --- |
| **planner** | 規劃專家 | 複雜功能開發前的計畫制定 | 需求分析、架構審查、步驟拆解 |
| **architect** | 架構師 | 系統設計和技術決策 | 架構評估、模式推薦、權衡分析 |
| **tdd-guide** | TDD 導師 | 編寫測試和實作功能 | Red-Green-Refactor 流程、覆蓋率保證 |
| **code-reviewer** | 程式碼審查員 | 審查程式碼品質 | 品質、安全、可維護性檢查 |
| **security-reviewer** | 安全稽核員 | 安全漏洞檢測 | OWASP Top 10、金鑰洩露、注入防護 |
| **build-error-resolver** | 建置錯誤修復師 | 修復 TypeScript/建置錯誤 | 最小化修復、型別推斷 |
| **e2e-runner** | E2E 測試專家 | 端對端測試管理 | Playwright 測試、flaky 管理、artifact |
| **refactor-cleaner** | 重構清理師 | 刪除死程式碼和重複 | 相依性分析、安全刪除、文件記錄 |
| **doc-updater** | 文件更新師 | 產生和更新文件 | codemap 產生、AST 分析 |

## 詳細介紹

### 1. Planner - 規劃專家

**何時使用**：需要實作複雜功能、架構變更或大型重構時。

::: tip 最佳實踐
在開始寫程式碼前，先用 `/plan` 建立實作計畫。這可以避免遺漏相依性、發現潛在風險、制定合理的實作順序。
:::

**核心能力**：
- 需求分析和澄清
- 架構審查和相依性識別
- 詳細的實作步驟拆解
- 風險識別和緩解方案
- 測試策略規劃

**輸出格式**：
```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 句話總結]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: 檔案路徑和描述]
- [Change 2: 檔案路徑和描述]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: 具體操作
   - Why: 原因
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [要測試的檔案]
- Integration tests: [要測試的流程]
- E2E tests: [要測試的使用者旅程]

## Risks & Mitigations
- **Risk**: [描述]
  - Mitigation: [如何解決]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**範例場景**：
- 新增新的 API 端點（需要資料庫遷移、快取更新、文件）
- 重構核心模組（影響多個相依性）
- 新增新功能（涉及前端、後端、資料庫）

### 2. Architect - 架構師

**何時使用**：需要設計系統架構、評估技術方案、做架構決策時。

**核心能力**：
- 系統架構設計
- 技術權衡分析
- 設計模式推薦
- 可擴展性規劃
- 安全性考量

**架構原則**：
- **模組化**：單一職責、高內聚低耦合
- **可擴展性**：水平擴展、無狀態設計
- **可維護性**：清晰結構、一致模式
- **安全性**：縱深防禦、最小權限
- **效能**：高效演算法、最小網路請求

**常用模式**：

**前端模式**：
- 元件組合、Container/Presenter 模式、自訂 Hooks、Context 全域狀態、程式碼分割

**後端模式**：
- Repository 模式、Service 層、中介軟體模式、事件驅動架構、CQRS

**資料模式**：
- 正規化資料庫、反正規化讀取效能、事件溯源、快取層、最終一致性

**架構決策記錄 (ADR) 格式**：
```markdown
# ADR-001: 使用 Redis 儲存語意搜尋向量

## Context
需要儲存和查詢 1536 維嵌入向量用於語意市場搜尋。

## Decision
使用 Redis Stack 的向量搜尋功能。

## Consequences

### Positive
- 快速向量相似度搜尋 (<10ms)
- 內建 KNN 演算法
- 部署簡單
- 效能良好（直到 10K 向量）

### Negative
- 記憶體儲存（大資料集成本高）
- 單點故障（無叢集）
- 僅支援餘弦相似度

### Alternatives Considered
- **PostgreSQL pgvector**: 較慢，但持久儲存
- **Pinecone**: 託管服務，成本更高
- **Weaviate**: 功能更多，設定更複雜

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - TDD 導師

**何時使用**：編寫新功能、修復 bug、重構程式碼時。

::: warning 核心原則
TDD Guide 要求所有程式碼必須**先寫測試**，再實作功能，確保 80%+ 測試覆蓋率。
:::

**TDD 工作流程**：

**Step 1: 先寫測試 (RED)**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**Step 2: 執行測試（驗證失敗）**
```bash
npm test
# Test should fail - we haven't implemented yet
```

**Step 3: 寫最小實作 (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Step 4: 執行測試（驗證通過）**
```bash
npm test
# Test should now pass
```

**Step 5: 重構 (IMPROVE)**
- 移除重複程式碼
- 改進命名
- 最佳化效能
- 提升可讀性

**Step 6: 驗證覆蓋率**
```bash
npm run test:coverage
# Verify 80%+ coverage
```

**必須編寫的測試類型**：

1. **單元測試**（必填）：測試獨立函式
2. **整合測試**（必填）：測試 API 端點和資料庫操作
3. **E2E 測試**（關鍵流程）：測試完整使用者旅程

**必須覆蓋的邊界情況**：
- Null/Undefined：如果輸入為 null 怎麼辦？
- 空：陣列/字串為空怎麼辦？
- 無效型別：傳了錯誤的型別怎麼辦？
- 邊界：最小/最大值
- 錯誤：網路失敗、資料庫錯誤
- 競態條件：並行操作
- 大資料：10k+ 項的效能
- 特殊字元：Unicode、emoji、SQL 字元

### 4. Code Reviewer - 程式碼審查員

**何時使用**：寫完或修改程式碼後，立即進行審查。

::: tip 強制使用
Code Reviewer 是**必須使用**的 agent，所有程式碼變更都需要通過它的審查。
:::

**審查清單**：

**安全檢查 (CRITICAL)**：
- 硬編碼憑證（API keys、密碼、tokens）
- SQL 注入風險（查詢中的字串拼接）
- XSS 漏洞（未跳脫的使用者輸入）
- 缺失輸入驗證
- 不安全的相依性（過時、有漏洞）
- 路徑遍歷風險（使用者控制的檔案路徑）
- CSRF 漏洞
- 認證繞過

**程式碼品質 (HIGH)**：
- 大函式（>50 行）
- 大檔案（>800 行）
- 深層巢狀（>4 層）
- 缺失錯誤處理（try/catch）
- console.log 陳述式
- 變更模式
- 新程式碼缺失測試

**效能 (MEDIUM)**：
- 低效演算法（O(n²) 當 O(n log n) 可行時）
- React 中不必要的重新渲染
- 缺失 memoization
- 大的 bundle 大小
- 未最佳化的圖片
- 缺失快取
- N+1 查詢

**最佳實踐 (MEDIUM)**：
- 程式碼/註解中使用 emoji
- TODO/FIXME 沒有關聯 ticket
- 公開 API 缺失 JSDoc
- 無障礙問題（缺失 ARIA 標籤、對比度差）
- 變數命名差（x, tmp, data）
- 未解釋的 magic numbers
- 格式不一致

**審查輸出格式**：
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposed in source code
Fix: Move to environment variable

const apiKey = "sk-abc123";  // ❌ Bad
const apiKey = process.env.API_KEY;  // ✓ Good
```

**批准標準**：
- ✅ 批准：沒有 CRITICAL 或 HIGH 問題
- ⚠️ 警告：只有 MEDIUM 問題（可以謹慎合併）
- ❌ 阻止：發現 CRITICAL 或 HIGH 問題

### 5. Security Reviewer - 安全稽核員

**何時使用**：編寫處理使用者輸入、認證、API 端點或敏感資料的程式碼後。

::: danger 關鍵
Security Reviewer 會標記金鑰洩露、SSRF、注入、不安全加密和 OWASP Top 10 漏洞。發現 CRITICAL 問題必須立即修復！
:::

**核心職責**：
1. **漏洞檢測**：識別 OWASP Top 10 和常見安全問題
2. **金鑰檢測**：查找硬編碼的 API keys、密碼、tokens
3. **輸入驗證**：確保所有使用者輸入都經過適當清理
4. **認證/授權**：驗證適當的存取控制
5. **相依性安全**：檢查有漏洞的 npm 套件
6. **安全最佳實踐**：強制安全編碼模式

**OWASP Top 10 檢查**：

1. **注入**（SQL、NoSQL、Command）
   - 查詢是否參數化？
   - 使用者輸入是否清理？
   - ORM 是否安全使用？

2. **損壞的認證**
   - 密碼是否雜湊（bcrypt、argon2）？
   - JWT 是否正確驗證？
   - 工作階段是否安全？
   - 是否有 MFA？

3. **敏感資料暴露**
   - 是否強制使用 HTTPS？
   - 金鑰是否在環境變數中？
   - PII 是否在靜態加密？
   - 日誌是否清理？

4. **XML 外部實體 (XXE)**
   - XML 解析器是否安全設定？
   - 外部實體處理是否停用？

5. **損壞的存取控制**
   - 每個路由是否檢查授權？
   - 物件參考是否間接？
   - CORS 是否正確設定？

6. **安全設定錯誤**
   - 預設憑證是否更改？
   - 錯誤處理是否安全？
   - 安全標頭是否設定？
   - 正式環境是否停用除錯模式？

7. **跨站腳本攻擊 (XSS)**
   - 輸出是否跳脫/清理？
   - Content-Security-Policy 是否設定？
   - 框架是否預設跳脫？

8. **不安全的反序列化**
   - 使用者輸入是否安全反序列化？
   - 反序列化函式庫是否最新？

9. **使用有已知漏洞的元件**
   - 所有相依性是否最新？
   - npm audit 是否乾淨？
   - CVE 是否監控？

10. **日誌和監控不足**
    - 安全事件是否記錄？
    - 日誌是否監控？
    - 告警是否設定？

**常見漏洞模式**：

**1. 硬編碼金鑰 (CRITICAL)**
```javascript
// ❌ CRITICAL: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ✅ CORRECT: Environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQL 注入 (CRITICAL)**
```javascript
// ❌ CRITICAL: SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRECT: Parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (HIGH)**
```javascript
// ❌ HIGH: XSS vulnerability
element.innerHTML = userInput

// ✅ CORRECT: Use textContent or sanitize
element.textContent = userInput
```

**安全審查報告格式**：
```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

## Summary
- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

## Critical Issues (Fix Immediately)

### 1. [Issue Title]
**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[漏洞描述]

**Impact:**
[如果被利用會發生什麼]

**Proof of Concept:**
```javascript
// 漏洞利用範例
```

**Remediation:**
```javascript
// ✅ 安全實作
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - 建置錯誤修復師

**何時使用**：建置失敗或出現型別錯誤時。

::: tip 最小化修復
Build Error Resolver 的核心原則是**最小化修復**，只修復錯誤，不做架構修改或重構。
:::

**核心職責**：
1. **TypeScript 錯誤修復**：修復型別錯誤、推斷問題、泛型約束
2. **建置錯誤修復**：解決編譯失敗、模組解析
3. **相依性問題**：修復匯入錯誤、缺失套件、版本衝突
4. **設定錯誤**：解決 tsconfig.json、webpack、Next.js 設定問題
5. **最小化差異**：做盡可能小的更改來修復錯誤
6. **不做架構更改**：只修復錯誤，不重構或重新設計

**診斷指令**：
```bash
# TypeScript 型別檢查（無輸出）
npx tsc --noEmit

# TypeScript 帶美觀輸出
npx tsc --noEmit --pretty

# 顯示所有錯誤（不在第一個停止）
npx tsc --noEmit --pretty --incremental false

# 檢查特定檔案
npx tsc --noEmit path/to/file.ts

# ESLint 檢查
npx eslint . --ext .ts,.tsx,.js,.jsx

# Next.js 建置（正式環境）
npm run build
```

**錯誤修復流程**：

**1. 收集所有錯誤**
```
a) 執行完整型別檢查
   - npx tsc --noEmit --pretty
   - 捕獲 ALL 錯誤，不只是第一個

b) 按型別分類錯誤
   - 型別推斷失敗
   - 缺失型別定義
   - 匯入/匯出錯誤
   - 設定錯誤
   - 相依性問題

c) 按影響優先級排序
   - 阻止建置：先修復
   - 型別錯誤：按順序修復
   - 警告：有時間就修復
```

**2. 修復策略（最小化更改）**
```
對每個錯誤：

1. 理解錯誤
   - 仔細閱讀錯誤訊息
   - 檢查檔案和行號
   - 理解預期 vs 實際型別

2. 找最小修復
   - 新增缺失的型別註解
   - 修復匯入陳述式
   - 新增 null 檢查
   - 使用型別斷言（最後手段）

3. 驗證修復不破壞其他程式碼
   - 每個修復後執行 tsc
   - 檢查相關檔案
   - 確保沒有引入新錯誤

4. 迭代直到建置通過
   - 一次修復一個錯誤
   - 每個修復後重新編譯
   - 追蹤進度（X/Y 錯誤已修復）
```

**常見錯誤模式與修復**：

**模式 1：型別推斷失敗**
```typescript
// ❌ ERROR: Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y
}

// ✅ FIX: Add type annotations
function add(x: number, y: number): number {
  return x + y
}
```

**模式 2：Null/Undefined 錯誤**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Null check
const name = user && user.name ? user.name.toUpperCase() : ''
```

**模式 3：匯入錯誤**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: 檢查 tsconfig paths 是否正確
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: 使用相對匯入
import { formatDate } from '../lib/utils'
```

**最小化差異策略**：

**CRITICAL：做盡可能小的更改**

**DO：**
✅ 新增缺失的型別註解
✅ 新增需要的 null 檢查
✅ 修復匯入/匯出
✅ 新增缺失的相依性
✅ 更新型別定義
✅ 修復設定檔

**DON'T：**
❌ 重構不相關的程式碼
❌ 更改架構
❌ 重新命名變數/函式（除非導致錯誤）
❌ 新增新功能
❌ 更改邏輯流程（除非修復錯誤）
❌ 最佳化效能
❌ 改進程式碼風格

### 7. E2E Runner - E2E 測試專家

**何時使用**：需要產生、維護和執行 E2E 測試時。

::: tip 端對端測試的價值
E2E 測試是正式環境前的最後一道防線，它們捕獲單元測試遺漏的整合問題。
:::

**核心職責**：
1. **測試旅程建立**：為使用者流程編寫 Playwright 測試
2. **測試維護**：保持測試與 UI 變更同步
3. **Flaky 測試管理**：識別和隔離不穩定測試
4. **Artifact 管理**：捕獲截圖、影片、traces
5. **CI/CD 整合**：確保測試在管線中可靠執行
6. **測試報告**：產生 HTML 報告和 JUnit XML

**測試指令**：
```bash
# 執行所有 E2E 測試
npx playwright test

# 執行特定測試檔案
npx playwright test tests/markets.spec.ts

# 以 headed 模式執行測試（看到瀏覽器）
npx playwright test --headed

# 用 inspector 除錯測試
npx playwright test --debug

# 從瀏覽器操作產生測試程式碼
npx playwright codegen http://localhost:3000

# 執行帶 trace 的測試
npx playwright test --trace on

# 顯示 HTML 報告
npx playwright show-report

# 更新快照
npx playwright test --update-snapshots

# 在特定瀏覽器執行測試
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2E 測試工作流程**：

**1. 測試規劃階段**
```
a) 識別關鍵使用者旅程
   - 認證流程（登入、登出、註冊）
   - 核心功能（市場建立、交易、搜尋）
   - 支付流程（存款、提款）
   - 資料完整性（CRUD 操作）

b) 定義測試場景
   - Happy path（一切都正常）
   - Edge cases（空狀態、限制）
   - Error cases（網路失敗、驗證）

c) 按風險優先級排序
   - HIGH：金融交易、認證
   - MEDIUM：搜尋、篩選、導覽
   - LOW：UI 打磨、動畫、樣式
```

**2. 測試建立階段**
```
對每個使用者旅程：

1. 在 Playwright 中編寫測試
   - 使用 Page Object Model (POM) 模式
   - 新增有意義的測試描述
   - 在關鍵步驟新增斷言
   - 在關鍵點新增截圖

2. 使測試有彈性
   - 使用合適的定位器（data-testid 優先）
   - 新增動態內容等待
   - 處理競態條件
   - 實作重試邏輯

3. 新增 artifact 捕獲
   - 失敗時截圖
   - 影片錄製
   - 用於除錯的 trace
   - 需要時的網路日誌
```

**Playwright 測試結構**：

**測試檔案組織**：
```
tests/
├── e2e/                       # 端對端使用者旅程
│   ├── auth/                  # 認證流程
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # 市場功能
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # 錢包操作
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # API 端點測試
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # 測試資料和輔助工具
│   ├── auth.ts                # 認證 fixtures
│   ├── markets.ts             # 市場測試資料
│   └── wallets.ts             # 錢包 fixtures
└── playwright.config.ts       # Playwright 設定
```

**Page Object Model 模式**：
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**最佳實踐測試範例**：
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Verify first result contains search term
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Take screenshot for verification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Flaky 測試管理**：

**識別 Flaky 測試**：
```bash
# 多次執行測試檢查穩定性
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# 帶重試執行特定測試
npx playwright test tests/markets/search.spec.ts --retries=3
```

**隔離模式**：
```typescript
// 標記 flaky 測試進行隔離
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// 或使用條件跳過
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**常見 Flakiness 原因與修復**：

**1. 競態條件**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. 網路時序**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. 動畫時序**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - 重構清理師

**何時使用**：需要刪除未使用程式碼、重複程式碼和進行重構時。

::: warning 謹慎操作
Refactor Cleaner 執行分析工具（knip、depcheck、ts-prune）識別死程式碼並安全刪除。刪除前一定要充分驗證！
:::

**核心職責**：
1. **死程式碼檢測**：查找未使用程式碼、匯出、相依性
2. **重複消除**：識別和合併重複程式碼
3. **相依性清理**：移除未使用套件和匯入
4. **安全重構**：確保更改不破壞功能
5. **文件記錄**：在 `DELETION_LOG.md` 中追蹤所有刪除

**檢測工具**：
- **knip**：查找未使用檔案、匯出、相依性、型別
- **depcheck**：識別未使用 npm 相依性
- **ts-prune**：查找未使用 TypeScript 匯出
- **eslint**：檢查未使用的 disable-directives 和變數

**分析指令**：
```bash
# 執行 knip 查找未使用匯出/檔案/相依性
npx knip

# 檢查未使用相依性
npx depcheck

# 查找未使用 TypeScript 匯出
npx ts-prune

# 檢查未使用 disable-directives
npx eslint . --report-unused-disable-directives
```

**重構工作流程**：

**1. 分析階段**
```
a) 並行執行檢測工具
b) 收集所有發現
c) 按風險級別分類：
   - SAFE：未使用匯出、未使用相依性
   - CAREFUL：可能透過動態匯入使用
   - RISKY：公開 API、共用工具
```

**2. 風險評估**
```
對每個要刪除的項目：
- 檢查是否在任何地方匯入（grep 搜尋）
- 驗證沒有動態匯入（grep 字串模式）
- 檢查是否是公開 API 的一部分
- 查看歷史記錄取得上下文
- 測試對建置/測試的影響
```

**3. 安全刪除過程**
```
a) 只從 SAFE 項目開始
b) 一次刪除一個類別：
   1. 未使用 npm 相依性
   2. 未使用內部匯出
   3. 未使用檔案
   4. 重複程式碼
c) 每批後執行測試
d) 為每批建立 git commit
```

**4. 重複合併**
```
a) 查找重複元件/工具
b) 選擇最佳實作：
   - 功能最全
   - 最好測試
   - 最近使用
c) 更新所有匯入使用選定版本
d) 刪除重複
e) 驗證測試仍然通過
```

**刪除日誌格式**：

建立/更新 `docs/DELETION_LOG.md`，使用以下結構：
```markdown
# Code Deletion Log

## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed
- package-name@version - Last used: never, Size: XX KB
- another-package@version - Replaced by: better-package

### Unused Files Deleted
- src/old-component.tsx - Replaced by: src/new-component.tsx
- lib/deprecated-util.ts - Functionality moved to: lib/utils.ts

### Duplicate Code Consolidated
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Reason: Both implementations were identical

### Unused Exports Removed
- src/utils/helpers.ts - Functions: foo(), bar()
- Reason: No references found in codebase

### Impact
- Files deleted: 15
- Dependencies removed: 5
- Lines of code removed: 2,300
- Bundle size reduction: ~45 KB

### Testing
- All unit tests passing: ✓
- All integration tests passing: ✓
- Manual testing completed: ✓
```

**安全檢查清單**：

**刪除任何東西之前：**
- [ ] 執行檢測工具
- [ ] Grep 所有參考
- [ ] 檢查動態匯入
- [ ] 查看歷史記錄
- [ ] 檢查是否是公開 API
- [ ] 執行所有測試
- [ ] 建立備份分支
- [ ] 在 DELETION_LOG.md 中文件化

**每次刪除後：**
- [ ] 建置成功
- [ ] 測試通過
- [ ] 無主控台錯誤
- [ ] 提交更改
- [ ] 更新 DELETION_LOG.md

**常見要刪除的模式**：

**1. 未使用匯入**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. 死程式碼分支**
```typescript
// ❌ Remove unreachable code
if (false) {
  // This never executes
  doSomething()
}

// ❌ Remove unused functions
export function unusedHelper() {
  // No references in codebase
}
```

**3. 重複元件**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - 文件更新師

**何時使用**：需要更新 codemaps 和文件時。

::: tip 文件與程式碼同步
Doc Updater 執行 `/update-codemaps` 和 `/update-docs`，產生 `docs/CODEMAPS/*`，更新 READMEs 和指南。
:::

**核心職責**：
1. **Codemap 產生**：從程式碼庫結構建立架構映射
2. **文件更新**：從程式碼重新整理 READMEs 和指南
3. **AST 分析**：使用 TypeScript 編譯器 API 理解結構
4. **相依性映射**：跨模組追蹤匯入/匯出
5. **文件品質**：確保文件符合實際程式碼

**分析工具**：
- **ts-morph**：TypeScript AST 分析和操作
- **TypeScript Compiler API**：深度程式碼結構分析
- **madge**：相依性圖視覺化
- **jsdoc-to-markdown**：從 JSDoc 註解產生文件

**分析指令**：
```bash
# 分析 TypeScript 專案結構（執行使用 ts-morph 函式庫的自訂腳本）
npx tsx scripts/codemaps/generate.ts

# 產生相依性圖
npx madge --image graph.svg src/

# 提取 JSDoc 註解
npx jsdoc2md src/**/*.ts
```

**Codemap 產生工作流程**：

**1. 儲存庫結構分析**
```
a) 識別所有 workspaces/packages
b) 映射目錄結構
c) 查找進入點（apps/*, packages/*, services/*）
d) 檢測框架模式（Next.js, Node.js 等）
```

**2. 模組分析**
```
對每個模組：
- 提取匯出（公開 API）
- 映射匯入（相依性）
- 識別路由（API 路由、頁面）
- 查找資料庫模型（Supabase, Prisma）
- 定位 queue/worker 模組
```

**3. 產生 Codemaps**
```
結構：
docs/CODEMAPS/
├── INDEX.md              # 所有區域的概覽
├── frontend.md           # 前端結構
├── backend.md            # Backend/API 結構
├── database.md           # 資料庫 schema
├── integrations.md       # 外部服務
└── workers.md            # 背景任務
```

**Codemap 格式**：
```markdown
# [Area] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** 主要檔案列表

## Architecture

[元件關係的 ASCII 圖表]

## Key Modules

| Module | Purpose | Exports | Dependencies |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Data Flow

[描述資料如何在此區域流動]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

連結到與此區域互動的其他 codemaps
```

**文件更新工作流程**：

**1. 從程式碼提取文件**
```
- 讀取 JSDoc/TSDoc 註解
- 從 package.json 提取 README 部分
- 從 .env.example 解析環境變數
- 收集 API 端點定義
```

**2. 更新文件檔案**
```
要更新的檔案：
- README.md - 專案概覽、設定說明
- docs/GUIDES/*.md - 功能指南、教學
- package.json - 描述、腳本文件
- API documentation - 端點規格
```

**3. 文件驗證**
```
- 驗證所有提到的檔案存在
- 檢查所有連結有效
- 確保範例可執行
- 驗證程式碼片段編譯
```

**範例專案特定 Codemaps**：

**前端 Codemap (docs/CODEMAPS/frontend.md)**：
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API 路由
│   ├── markets/       # 市場頁面
│   ├── bot/           # 機器人互動
│   └── creator-dashboard/
├── components/        # React 元件
├── hooks/             # 自訂 hooks
└── lib/               # 工具

## Key Components

| Component | Purpose | Location |
| --- | --- | --- |
| HeaderWallet | Wallet connection | components/HeaderWallet.tsx |
| MarketsClient | Markets listing | app/markets/MarketsClient.js |
| SemanticSearchBar | Search UI | components/SemanticSearchBar.js |

## Data Flow

User → Markets Page → API Route → Supabase → Redis (optional) → Response

## External Dependencies

- Next.js 15.1.4 - Framework
- React 19.0.0 - UI library
- Privy - Authentication
- Tailwind CSS 3.4.1 - Styling
```

**後端 Codemap (docs/CODEMAPS/backend.md)**：
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| /api/markets | GET | List all markets |
| /api/markets/search | GET | Semantic search |
| /api/market/[slug] | GET | Single market |
| /api/market-price | GET | Real-time pricing |

## Data Flow

API Route → Supabase Query → Redis (cache) → Response

## External Services

- Supabase - PostgreSQL database
- Redis Stack - Vector search
- OpenAI - Embeddings
```

**README 更新範本**：

當更新 README.md 時：
```markdown
# Project Name

Brief description

## Setup
\`\`\`bash
# Installation
npm install

# Environment variables
cp .env.example .env.local
# Fill in: OPENAI_API_KEY, REDIS_URL, etc.

# Development
npm run dev

# Build
npm run build
\`\`\`

## Architecture

See [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) for detailed architecture.

### Key Directories

- `src/app` - Next.js App Router 頁面和 API 路由
- `src/components` - 可重用 React 元件
- `src/lib` - 工具函式庫和客戶端

## Features

- [Feature 1] - Description
- [Feature 2] - Description

## Documentation

- [Setup Guide](docs/GUIDES/setup.md)
- [API Reference](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
```

## 什麼時候呼叫哪個 Agent

基於你的任務類型，選擇合適的 agent：

| 任務類型 | 推薦呼叫 | 替代方案 |
| --- | --- | --- |
| **規劃新功能** | `/plan` → planner agent | 手動呼叫 planner agent |
| **系統架構設計** | 手動呼叫 architect agent | `/orchestrate` → 序列呼叫 agents |
| **編寫新功能** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **修復 bug** | `/tdd` → tdd-guide agent | build-error-resolver（如果是型別錯誤） |
| **程式碼審查** | `/code-review` → code-reviewer agent | 手動呼叫 code-reviewer agent |
| **安全稽核** | 手動呼叫 security-reviewer agent | code-reviewer（部分覆蓋） |
| **建置失敗** | `/build-fix` → build-error-resolver agent | 手動修復 |
| **E2E 測試** | `/e2e` → e2e-runner agent | 手動編寫 Playwright 測試 |
| **清理死程式碼** | `/refactor-clean` → refactor-cleaner agent | 手動刪除 |
| **更新文件** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Agent 協作範例

### 場景 1：從零開始開發新功能

```
1. /plan (planner agent)
   - 建立實作計畫
   - 識別相依性和風險

2. /tdd (tdd-guide agent)
   - 按照計畫編寫測試
   - 實作功能
   - 確保覆蓋率

3. /code-review (code-reviewer agent)
   - 審查程式碼品質
   - 檢查安全漏洞

4. /verify (指令)
   - 執行建置、型別檢查、測試
   - 檢查 console.log、git 狀態
```

### 場景 2：修復建置錯誤

```
1. /build-fix (build-error-resolver agent)
   - 修復 TypeScript 錯誤
   - 確保建置通過

2. /test-coverage (指令)
   - 檢查覆蓋率是否達標

3. /code-review (code-reviewer agent)
   - 審查修復的程式碼
```

### 場景 3：程式碼清理

```
1. /refactor-clean (refactor-cleaner agent)
   - 執行檢測工具
   - 刪除死程式碼
   - 合併重複程式碼

2. /update-docs (doc-updater agent)
   - 更新 codemaps
   - 重新整理文件

3. /verify (指令)
   - 執行所有檢查
```

## 本課小結

Everything Claude Code 提供了 9 個專業化 agents，每個 agent 都專注於特定領域：

1. **planner** - 複雜功能規劃
2. **architect** - 系統架構設計
3. **tdd-guide** - TDD 流程執行
4. **code-reviewer** - 程式碼品質審查
5. **security-reviewer** - 安全漏洞檢測
6. **build-error-resolver** - 建置錯誤修復
7. **e2e-runner** - 端對端測試管理
8. **refactor-cleaner** - 死程式碼清理
9. **doc-updater** - 文件和 codemap 更新

**核心原則**：
- 根據任務類型選擇合適的 agent
- 利用 agents 之間的協作建構高效工作流程
- 複雜任務可以序列呼叫多個 agents
- 程式碼變更後務必進行 code review

## 下一課預告

> 下一課我們學習 **[TDD 開發流程](../tdd-workflow/)**。
>
> 你會學到：
> - 如何使用 `/plan` 建立實作計畫
> - 如何使用 `/tdd` 執行 Red-Green-Refactor 週期
> - 如何確保 80%+ 測試覆蓋率
> - 如何使用 `/verify` 執行全面驗證

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**關鍵常數**：
- 無

**關鍵函式**：
- 無

</details>
