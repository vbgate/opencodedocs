---
title: "Rules: 8 套規則集詳解 | everything-claude-code"
sidebarTitle: "8 套規則速查"
subtitle: "Rules: 8 套規則集詳解 | everything-claude-code"
description: "學習 everything-claude-code 的 8 套規則集，包括安全、程式碼風格、測試、Git 工作流程、效能最佳化、Agent 使用、設計模式和 Hooks 系統。"
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules 完整參考：8 套規則集詳解

## 學完你能做什麼

- 快速查找和理解所有 8 套強制性規則集
- 在開發過程中正確應用安全、程式碼風格、測試等規範
- 知道何時使用哪個 Agent 來幫助遵守規則
- 理解效能最佳化策略和 Hooks 系統的工作原理

## 你現在的困境

面對專案中的 8 套規則集，你可能會：

- **記不住所有規則**：security、coding-style、testing、git-workflow... 哪些是必須遵守的？
- **不知道如何應用**：規則提到了不可變模式、TDD 流程，但具體怎麼操作？
- **不知道找誰幫忙**：遇到安全問題用哪個 Agent？程式碼審查又該找誰？
- **效能和安全的權衡**：如何在保證程式碼品質的同時，最佳化開發效率？

這份參考文件幫你全面了解每套規則的內容、應用場景和對應的 Agent 工具。

---

## Rules 概覽

Everything Claude Code 包含 8 套強制性規則集，每套規則都有明確的目標和應用場景：

| 規則集 | 目標 | 優先級 | 對應 Agent |
|--- | --- | --- | ---|
| **Security** | 防止安全漏洞、敏感資料外洩 | P0 | security-reviewer |
| **Coding Style** | 程式碼可讀、不可變模式、小檔案 | P0 | code-reviewer |
| **Testing** | 80%+ 測試覆蓋率、TDD 流程 | P0 | tdd-guide |
| **Git Workflow** | 規範提交、PR 流程 | P1 | code-reviewer |
| **Agents** | 正確使用子代理 | P1 | N/A |
| **Performance** | Token 最佳化、上下文管理 | P1 | N/A |
| **Patterns** | 設計模式、架構最佳實踐 | P2 | architect |
| **Hooks** | 理解和使用 Hooks | P2 | N/A |

::: info 規則優先級說明

- **P0（關鍵）**：必須嚴格遵守，違反會導致安全風險或程式碼品質嚴重下降
- **P1（重要）**：應該遵守，影響開發效率和團隊協作
- **P2（建議）**：推薦遵守，提升程式碼架構和可維護性
:::

---

## 1. Security（安全規則）

### 強制性安全檢查

在**任何提交之前**，必須完成以下檢查：

- [ ] 無硬編碼金鑰（API keys、密碼、tokens）
- [ ] 所有使用者輸入已驗證
- [ ] SQL 注入預防（參數化查詢）
- [ ] XSS 預防（HTML 清理）
- [ ] CSRF 保護已啟用
- [ ] 認證/授權已驗證
- [ ] 所有端點有速率限制
- [ ] 錯誤資訊不外洩敏感資料

### 金鑰管理

**❌ 錯誤做法**：硬編碼金鑰

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ 正確做法**：使用環境變數

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### 安全回應協定

如果發現安全問題：

1. **立即停止**目前工作
2. 使用 **security-reviewer** agent 進行全面分析
3. 在繼續之前修復 CRITICAL 問題
4. 輪換任何暴露的金鑰
5. 檢查整個程式碼庫是否存在類似問題

::: tip 安全 Agent 使用

使用 `/code-review` 指令會自動觸發 security-reviewer 檢查，確保程式碼符合安全規範。
:::

---

## 2. Coding Style（程式碼風格規則）

### 不可變性（CRITICAL）

**始終建立新物件，絕不修改現有物件**：

**❌ 錯誤做法**：直接修改物件

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 正確做法**：建立新物件

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### 檔案組織

**多小檔案 > 少大檔案**：

- **高內聚、低耦合**
- **典型 200-400 行，最大 800 行**
- 從大型元件中提取工具函式
- 按功能/領域組織，而非按類型

### 錯誤處理

**始終全面處理錯誤**：

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### 輸入驗證

**始終驗證使用者輸入**：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### 程式碼品質檢查清單

在標記工作完成前，必須確認：

- [ ] 程式碼可讀且命名清晰
- [ ] 函式小（< 50 行）
- [ ] 檔案專注（< 800 行）
- [ ] 無深層巢狀（> 4 層）
- [ ] 正確的錯誤處理
- [ ] 無 console.log 陳述句
- [ ] 無硬編碼值
- [ ] 無直接修改（使用不可變模式）

---

## 3. Testing（測試規則）

### 最低測試覆蓋率：80%

**必須包含所有測試類型**：

1. **單元測試** - 獨立函式、工具函式、元件
2. **整合測試** - API 端點、資料庫操作
3. **E2E 測試** - 關鍵使用者流程（Playwright）

### 測試驅動開發（TDD）

**強制工作流程**：

1. 先寫測試（RED）
2. 執行測試 - 應該失敗
3. 撰寫最小實作（GREEN）
4. 執行測試 - 應該通過
5. 重構（IMPROVE）
6. 驗證覆蓋率（80%+）

### 測試故障排除

1. 使用 **tdd-guide** agent
2. 檢查測試隔離性
3. 驗證 mocks 是否正確
4. 修復實作，而非測試（除非測試本身錯誤）

### Agent 支援

- **tdd-guide** - 主動用於新功能，強制先寫測試
- **e2e-runner** - Playwright E2E 測試專家

::: tip 使用 TDD 指令

使用 `/tdd` 指令會自動呼叫 tdd-guide agent，引導你完成完整的 TDD 流程。
:::

---

## 4. Git Workflow（Git 工作流程規則）

### 提交資訊格式

```
<type>: <description>

<optional body>
```

**類型**：feat、fix、refactor、docs、test、chore、perf、ci

::: info 提交資訊

提交資訊中的 attribution 已透過 `~/.claude/settings.json` 全域停用。
:::

### Pull Request 工作流程

建立 PR 時：

1. 分析完整提交歷史（不僅僅是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有變更
3. 起草全面的 PR 摘要
4. 包含測試計劃和 TODOs
5. 如果是新分支，使用 `-u` 標誌推送

### 功能實作工作流程

#### 1. 計劃優先

- 使用 **planner** agent 建立實作計劃
- 識別依賴和風險
- 分解為多個階段

#### 2. TDD 方法

- 使用 **tdd-guide** agent
- 先寫測試（RED）
- 實作以通過測試（GREEN）
- 重構（IMPROVE）
- 驗證 80%+ 覆蓋率

#### 3. 程式碼審查

- 撰寫程式碼後立即使用 **code-reviewer** agent
- 修復 CRITICAL 和 HIGH 問題
- 盡可能修復 MEDIUM 問題

#### 4. 提交和推送

- 詳細的提交資訊
- 遵循 conventional commits 格式

---

## 5. Agents（Agent 規則）

### 可用 Agents

位於 `~/.claude/agents/`：

| Agent | 用途 | 何時使用 |
|--- | --- | --- | ---|
| planner | 實作規劃 | 複雜功能、重構 |
| architect | 系統設計 | 架構決策 |
| tdd-guide | 測試驅動開發 | 新功能、Bug 修復 |
| code-reviewer | 程式碼審查 | 撰寫程式碼後 |
| security-reviewer | 安全分析 | 提交前 |
| build-error-resolver | 修復建置錯誤 | 建置失敗時 |
| e2e-runner | E2E 測試 | 關鍵使用者流程 |
| refactor-cleaner | 死程式碼清理 | 程式碼維護 |
| doc-updater | 文件更新 | 更新文件 |

### 立即使用 Agent

**無需使用者提示**：

1. 複雜功能請求 - 使用 **planner** agent
2. 程式碼剛撰寫/修改 - 使用 **code-reviewer** agent
3. Bug 修復或新功能 - 使用 **tdd-guide** agent
4. 架構決策 - 使用 **architect** agent

### 並行任務執行

**始終對獨立操作使用並行任務執行**：

| 方式 | 說明 |
|--- | ---|
| ✅ 好：並行執行 | 啟動 3 個 agents 並行：Agent 1 (auth.ts 安全分析)、Agent 2 (快取系統效能審查)、Agent 3 (utils.ts 型別檢查) |
| ❌ 壞：循序執行 | 先執行 agent 1，然後 agent 2，然後 agent 3 |

### 多視角分析

對於複雜問題，使用分角色子代理：

- 事實審查者
- 高級工程師
- 安全專家
- 一致性審查者
- 冗餘檢查者

---

## 6. Performance（效能最佳化規則）

### 模型選擇策略

**Haiku 4.5**（90% 的 Sonnet 能力，3 倍成本節省）：

- 輕量級 agent，頻繁呼叫
- 結對程式設計和程式碼生成
- 多代理系統中的 worker agents

**Sonnet 4.5**（最佳編碼模型）：

- 主要開發工作
- �調多代理工作流程
- 複雜編碼任務

**Opus 4.5**（最深度推理）：

- 複雜架構決策
- 最大推理需求
- 研究和分析任務

### 上下文視窗管理

**避免使用最後 20% 的上下文視窗**：

- 大規模重構
- 跨多個檔案的功能實作
- 複雜互動的除錯

**低上下文敏感度任務**：

- 單一檔案編輯
- 獨立工具建立
- 文件更新
- 簡單 Bug 修復

### Ultrathink + Plan Mode

對於需要深度推理的複雜任務：

1. 使用 `ultrathink` 進行增強思考
2. 啟用 **Plan Mode** 取得結構化方法
3. "重新啟動引擎"進行多輪批評
4. 使用分角色子代理進行多樣化分析

### 建置故障排除

如果建置失敗：

1. 使用 **build-error-resolver** agent
2. 分析錯誤資訊
3. 逐步修復
4. 每次修復後驗證

---

## 7. Patterns（常見模式規則）

### API 回應格式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### 自訂 Hooks 模式

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository 模式

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### 骨架專案

實作新功能時：

1. 搜尋經過實戰驗證的骨架專案
2. 使用並行 agents 評估選項：
   - 安全評估
   - 可擴展性分析
   - 相關性評分
   - 實作規劃
3. 克隆最佳匹配作為基礎
4. 在已驗證的結構中迭代

---

## 8. Hooks（Hooks 系統規則）

### Hook 類型

- **PreToolUse**：工具執行前（驗證、參數修改）
- **PostToolUse**：工具執行後（自動格式化、檢查）
- **Stop**：會話結束時（最終驗證）

### 目前 Hooks（在 ~/.claude/settings.json）

#### PreToolUse

- **tmux 提醒**：建議長時間執行指令使用 tmux（npm、pnpm、yarn、cargo 等）
- **git push 審查**：推送前在 Zed 中開啟審查
- **文件阻止器**：阻止建立不必要的 .md/.txt 檔案

#### PostToolUse

- **PR 建立**：記錄 PR URL 和 GitHub Actions 狀態
- **Prettier**：編輯後自動格式化 JS/TS 檔案
- **TypeScript 檢查**：編輯 .ts/.tsx 檔案後執行 tsc
- **console.log 警告**：警告編輯檔案中的 console.log

#### Stop

- **console.log 審計**：會話結束前檢查所有修改檔案中的 console.log

### 自動接受權限

**謹慎使用**：

- 對受信任、明確定義的計劃啟用
- 探索性工作時停用
- 永遠不要使用 dangerously-skip-permissions 標誌
- 改為在 `~/.claude.json` 中設定 `allowedTools`

### TodoWrite 最佳實踐

使用 TodoWrite 工具來：

- 追蹤多步驟任務的進度
- 驗證對指令的理解
- 啟用即時引導
- 顯示細粒度實作步驟

Todo 列表揭示：

- 順序錯誤的步驟
- 遺失項目
- 額外不必要的項目
- 錯誤的粒度
- 誤解的需求

---

## 下一課預告

> 下一課我們學習 **[Skills 完整參考](../skills-reference/)**。
>
> 你會學到：
> - 11 個技能庫的完整參考
> - 編碼標準、後端/前端模式、持續學習等技能
> - 如何為不同任務選擇合適的技能

---

## 本課小結

Everything Claude Code 的 8 套規則集為開發過程提供了全面的指導：

1. **Security** - 防止安全漏洞和敏感資料外洩
2. **Coding Style** - 確保程式碼可讀、不可變、小檔案
3. **Testing** - 強制 80%+ 覆蓋率和 TDD 流程
4. **Git Workflow** - 規範提交和 PR 流程
5. **Agents** - 指導正確使用 9 個專業化子代理
6. **Performance** - 最佳化 Token 使用和上下文管理
7. **Patterns** - 提供常見設計模式和最佳實踐
8. **Hooks** - 解釋自動化鉤子系統的工作原理

記住，這些規則不是束縛，而是幫助你撰寫高品質、安全、可維護程式碼的指導。使用對應的 Agents（如 code-reviewer、security-reviewer）可以幫助你自動遵守這些規則。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Security 規則 | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style 規則 | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing 規則 | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow 規則 | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents 規則 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance 規則 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns 規則 | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks 規則 | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**關鍵規則**：
- **Security**: No hardcoded secrets, OWASP Top 10 檢查
- **Coding Style**: 不可變模式、檔案 < 800 行、函式 < 50 行
- **Testing**: 80%+ 測試覆蓋率、TDD 流程強制
- **Performance**: 模型選擇策略、上下文視窗管理

**相關 Agents**：
- **security-reviewer**: 安全漏洞檢測
- **code-reviewer**: 程式碼品質和風格審查
- **tdd-guide**: TDD 流程指導
- **planner**: 實作計劃

</details>
