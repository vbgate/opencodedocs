---
title: "內建 Skills：瀏覽器自動化與 Git | oh-my-opencode"
sidebarTitle: "4 個瑞士軍刀技能"
subtitle: "內建 Skills：瀏覽器自動化、UI/UX 設計與 Git 專家"
description: "學習 oh-my-opencode 的 4 個內建 Skills：playwright、frontend-ui-ux、git-master、dev-browser。掌握瀏覽器自動化、UI 設計和 Git 操作。"
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# 內建 Skills：瀏覽器自動化、UI/UX 設計與 Git 專家

## 學完你能做什麼

透過本課，你將學會：
- 使用 `playwright` 或 `agent-browser` 進行瀏覽器自動化測試和資料擷取
- 讓代理採用設計師視角，打造精美 UI/UX 介面
- 自動化 Git 操作，包括原子提交、歷史搜尋和 rebase
- 使用 `dev-browser` 進行持久化的瀏覽器自動化開發

## 你現在的困境

你是否遇過這些情況：
- 想測試前端頁面，但手動點擊太慢，又不會寫 Playwright 腳本
- 寫完程式碼後，提交訊息亂七八糟，歷史一團糟
- 需要設計 UI 介面，但不知道從何入手，做出來的介面缺乏美感
- 需要自動化瀏覽器操作，但每次都要重新登入認證

**內建 Skills** 就是為你準備的瑞士軍刀——每個 Skill 都是特定領域的專家，幫你快速解決這些痛點。

## 什麼時候用這一招

| 場景 | 推薦的 Skill | 為什麼 |
| --- | --- | --- |
| 前端 UI 介面需要美觀的設計 | `frontend-ui-ux` | 設計師視角，關注排版、色彩、動效 |
| 瀏覽器測試、截圖、爬取資料 | `playwright` 或 `agent-browser` | 完整的瀏覽器自動化能力 |
| Git 提交、歷史搜尋、分支管理 | `git-master` | 自動偵測提交風格，產生原子提交 |
| 需要多次瀏覽器操作（保持登入狀態） | `dev-browser` | 持久化頁面狀態，支援複用 |

## 核心思路

**Skill 是什麼？**

Skill 是一種機制，向代理注入**專業知識**和**專用工具**。當你使用 `delegate_task` 並指定 `load_skills` 參數時，系統會：
1. 載入 Skill 的 `template` 作為系統提示的一部分
2. 注入 Skill 設定的 MCP 伺服器（如果有）
3. 限制可用的工具範圍（如果有 `allowedTools`）

**內建 vs 自訂 Skills**

- **內建 Skills**：開箱即用，預先設定好提示詞和工具
- **自訂 Skills**：你可以在 `.opencode/skills/` 或 `~/.claude/skills/` 目錄下建立自己的 SKILL.md

本課重點介紹 4 個內建 Skills，它們涵蓋了最常見的開發場景。

## 🎒 開始前的準備

在開始使用內建 Skills 前，請確保：
- [ ] 已完成 [Categories 和 Skills](../categories-skills/) 課程的學習
- [ ] 了解 `delegate_task` 工具的基本用法
- [ ] 瀏覽器自動化 Skill 需要先啟動對應的伺服器（Playwright MCP 或 agent-browser）

---

## Skill 1：playwright（瀏覽器自動化）

### 功能概述

`playwright` Skill 使用 Playwright MCP 伺服器，提供完整的瀏覽器自動化能力：
- 頁面導覽和互動
- 元素定位和操作（點擊、填寫表單）
- 截圖和 PDF 匯出
- 網路請求攔截和模擬

**適用場景**：UI 驗證、E2E 測試、網頁截圖、資料擷取

### 跟我做：驗證網站功能

**場景**：你需要驗證登入功能是否正常運作。

#### 第 1 步：觸發 playwright Skill

在 OpenCode 中輸入：

```
使用 playwright 導覽到 https://example.com/login，截圖顯示頁面狀態
```

**你應該看到**：代理會自動呼叫 Playwright MCP 工具，開啟瀏覽器並截圖。

#### 第 2 步：填寫表單並提交

繼續輸入：

```
使用 playwright 填寫使用者名稱和密碼欄位（user@example.com / password123），然後點擊登入按鈕，截圖顯示結果
```

**你應該看到**：代理會自動定位表單元素，填寫資料，點擊按鈕，並回傳結果截圖。

#### 第 3 步：驗證跳轉

```
等待頁面載入完成後，檢查 URL 是否跳轉到 /dashboard
```

**你應該看到**：代理報告目前 URL 確認跳轉成功。

### 檢查點 ✅

- [ ] 瀏覽器能夠成功導覽到目標頁面
- [ ] 表單填寫和點擊操作正常執行
- [ ] 截圖能夠清晰顯示頁面狀態

::: tip 設定說明
預設情況下，瀏覽器自動化引擎使用 `playwright`。如果你想切換到 `agent-browser`，在 `oh-my-opencode.json` 中設定：

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2：frontend-ui-ux（設計師視角）

### 功能概述

`frontend-ui-ux` Skill 將代理轉變為「設計師轉開發者」的角色：
- 關注**排版、色彩、動效**等視覺細節
- 強調**大膽的美學方向**（極簡、極繁、復古未來主義等）
- 提供**設計原則**：避免通用字型（Inter、Roboto、Arial），建立獨特配色方案

**適用場景**：UI 元件設計、介面美化、視覺系統搭建

### 跟我做：設計精美的儀表板

**場景**：你需要設計一個資料統計儀表板，但沒有設計稿。

#### 第 1 步：啟用 frontend-ui-ux Skill

```
使用 frontend-ui-ux 技能，設計一個資料統計儀表板頁面
要求：包含 3 個資料卡片（使用者數、收入、訂單數），使用現代設計風格
```

**你應該看到**：代理會先進行「設計規劃」，確定目的、基調、約束和差異化點。

#### 第 2 步：明確美學方向

代理會問你（或在內部確定）設計風格。例如：

```
**美學方向選擇**：
- 極簡主義（Minimalist）
- 極繁主義（Maximalist）
- 復古未來主義（Retro-futuristic）
- 精緻奢華（Luxury/Refined）
```

回答：**極簡主義**

**你應該看到**：代理根據你選擇的方向，產生設計規範（字型、色彩、間距）。

#### 第 3 步：產生程式碼

```
基於上面的設計規範，使用 React + Tailwind CSS 實作這個儀表板頁面
```

**你應該看到**：
- 精心設計的排版和間距
- 鮮明但和諧的配色（不是常見的紫色漸層）
- 微妙的動效和過渡效果

### 檢查點 ✅

- [ ] 頁面採用了獨特的設計風格，不是通用的「AI slop」
- [ ] 字型選擇有特色，避免使用 Inter/Roboto/Arial
- [ ] 配色方案 cohesive，有清晰的視覺層級

::: tip 與普通代理的區別
普通代理可能寫出的程式碼功能正確，但介面缺乏美感。`frontend-ui-ux` Skill 的核心價值在於：
- 強調設計過程（規劃 > 編碼）
- 提供明確的美學指導
- 警告反模式（通用設計、紫色漸層）
:::

---

## Skill 3：git-master（Git 專家）

### 功能概述

`git-master` Skill 是一個整合了三種專業能力的 Git 專家：
1. **提交架構師**：原子提交、依賴順序、風格偵測
2. **Rebase 外科醫生**：歷史重寫、衝突解決、分支清理
3. **歷史考古學家**：查找何時/何處引入了特定更改

**核心原則**：預設建立**多個提交**，拒絕「一個提交包含多個檔案」的懶惰行為。

**適用場景**：程式碼提交、歷史搜尋、分支管理、rebase 操作

### 跟我做：智慧提交程式碼

**場景**：你修改了 5 個檔案，需要提交程式碼。

#### 第 1 步：觸發 git-master Skill（推薦使用 quick category）

```
使用 delegate_task(category='quick', load_skills=['git-master']) 提交目前的程式碼更改
```

**為什麼使用 `quick` category？**
- Git 操作不需要複雜推理
- `claude-haiku-4-5` 模型足夠快速處理
- 節省成本（Haiku 比 Opus 便宜 10 倍）

**你應該看到**：代理執行並行分析（Phase 0），包括：
- `git status` 和 `git diff --stat`
- 最近 30 條提交日誌（用於風格偵測）
- 目前分支狀態

#### 第 2 步：風格偵測（Phase 1）

代理會輸出：

```
STYLE DETECTION RESULT
======================
Analyzed: 30 commits from git log

Language: ENGLISH
  - English commits: 28 (93%)
  
Style: SEMANTIC
  - Semantic (feat:, fix:, etc.): 25 (83%)
  - Plain: 3 (10%)
  
Reference examples from repo:
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

All commits will follow: ENGLISH + SEMANTIC
```

**你應該看到**：代理明確告訴你將使用的提交風格和語言。

#### 第 3 步：規劃原子提交（Phase 3）

代理會分析檔案變化，並輸出：

```
COMMIT PLAN
===========
Files changed: 5
Minimum commits required: ceil(5/3) = 2
Planned commits: 3
Status: 3 >= 2 (PASS)

COMMIT 1: feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justification: service implementation + its type definitions

COMMIT 2: feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justification: page and its components

COMMIT 3: feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justification: API endpoint + its test

Execution order: Commit 1 -> Commit 2 -> Commit 3
```

**你應該看到**：代理明確拆分提交，並解釋為什麼這些檔案必須在一起。

#### 第 4 步：執行提交（Phase 5）

代理會自動執行：
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**你應該看到**：
- 3 個獨立的提交，每個都有明確的語意化訊息
- 工作目錄乾淨（`git status` 無未提交檔案）

### 檢查點 ✅

- [ ] 代理進行了風格偵測，並明確告知
- [ ] 提交數量滿足「最小提交數」規則（檔案數 / 3，向上取整）
- [ ] 每個提交訊息符合偵測到的風格（語意化、普通描述等）
- [ ] 測試檔案與實作檔案在同一提交中

::: tip 歷史搜尋功能
`git-master` 還支援強大的歷史搜尋：

- "when was X added" → `git log -S`（pickaxe 搜尋）
- "who wrote this line" → `git blame`
- "when did bug start" → `git bisect`
- "find commits changing X pattern" → `git log -G`（regex 搜尋）

範例：`使用 git-master 查找 'calculate_discount' 函式是在哪個提交中新增的`
:::

::: warning 反模式：單個大提交
`git-master` 的強制規則是：

| 檔案數量 | 最少提交數 |
| --- | --- |
| 3+ 檔案 | 2+ 提交 |
| 5+ 檔案 | 3+ 提交 |
| 10+ 檔案 | 5+ 提交 |

如果代理嘗試 1 次提交多個檔案，會自動失敗並重新規劃。
:::

---

## Skill 4：dev-browser（開發者瀏覽器）

### 功能概述

`dev-browser` Skill 提供持久化的瀏覽器自動化能力：
- **頁面狀態持久化**：多次腳本執行之間保持登入狀態
- **ARIA Snapshot**：自動發現頁面元素，回傳帶參照（`@e1`, `@e2`）的樹狀結構
- **雙模式支援**：
  - **Standalone 模式**：啟動新的 Chromium 瀏覽器
  - **Extension 模式**：連接到使用者的現有 Chrome 瀏覽器

**適用場景**：需要多次瀏覽器操作（保持登入狀態）、複雜的工作流程自動化

### 跟我做：編寫登入後操作的腳本

**場景**：你需要自動化登入後的一系列操作，並保持工作階段狀態。

#### 第 1 步：啟動 dev-browser 伺服器

**macOS/Linux**：
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**：
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**你應該看到**：主控台輸出 `Ready` 訊息。

#### 第 2 步：編寫登入腳本

在 OpenCode 中輸入：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**你應該看到**：瀏覽器開啟登入頁面，並輸出頁面標題和 URL。

#### 第 3 步：新增表單填寫操作

修改腳本：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// 取得 ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// 選擇並填寫表單（根據 snapshot 中的 ref）
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**你應該看到**：
- 輸出 ARIA Snapshot（顯示頁面元素和參照）
- 表單自動填寫並提交
- 頁面跳轉到 dashboard（驗證登入成功）

#### 第 4 步：複用登入狀態

現在編寫第二個腳本，操作需要登入的頁面：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// 複用之前建立的 "login" 頁面（工作階段已儲存）
const page = await client.page("login");

// 直接存取需要登入的頁面
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**你應該看到**：頁面直接跳轉到設定頁面，無需重新登入（因為工作階段狀態已儲存）。

### 檢查點 ✅

- [ ] dev-browser 伺服器成功啟動並顯示 `Ready`
- [ ] ARIA Snapshot 能夠正確發現頁面元素
- [ ] 登入後的工作階段狀態能夠跨腳本複用
- [ ] 多次腳本執行之間無需重新登入

::: tip playwright vs dev-browser 的區別

| 特性 | playwright | dev-browser |
| --- | --- | --- |
| **工作階段持久化** | ❌ 每次新工作階段 | ✅ 跨腳本儲存 |
| **ARIA Snapshot** | ❌ 使用 Playwright API | ✅ 自動產生參照 |
| **Extension 模式** | ❌ 不支援 | ✅ 連接使用者瀏覽器 |
| **適用場景** | 單次操作、測試 | 多次操作、複雜工作流程 |
:::

---

## 最佳實踐

### 1. 選擇合適的 Skill

根據任務類型選擇 Skill：

| 任務類型 | 推薦組合 |
| --- | --- |
| 快速 Git 提交 | `delegate_task(category='quick', load_skills=['git-master'])` |
| UI 介面設計 | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| 瀏覽器驗證 | `delegate_task(category='quick', load_skills=['playwright'])` |
| 複雜瀏覽器工作流程 | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. 組合多個 Skills

你可以同時載入多個 Skills：

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="測試登入功能，完成後提交程式碼"
)
```

### 3. 避免常見錯誤

::: warning 警告

- ❌ **錯誤**：使用 `git-master` 時手動指定提交訊息
  - ✅ **正確**：讓 `git-master` 自動偵測並產生符合專案風格的提交訊息

- ❌ **錯誤**：使用 `frontend-ui-ux` 時要求「普通就好」
  - ✅ **正確**：讓代理充分發揮設計師能力，創造獨特設計

- ❌ **錯誤**：在 `dev-browser` 腳本中使用 TypeScript 型別註解
  - ✅ **正確**：`page.evaluate()` 中使用純 JavaScript（瀏覽器不識別 TS 語法）
:::

---

## 本課小結

本課介紹了 4 個內建 Skills：

| Skill | 核心價值 | 典型場景 |
| --- | --- | --- |
| **playwright** | 完整的瀏覽器自動化 | UI 測試、截圖、爬蟲 |
| **frontend-ui-ux** | 設計師視角，美觀優先 | UI 元件設計、介面美化 |
| **git-master** | 自動化 Git 操作，原子提交 | 程式碼提交、歷史搜尋 |
| **dev-browser** | 持久化工作階段，複雜工作流程 | 多次瀏覽器操作 |

**核心要點**：
1. **Skill = 專業知識 + 工具**：向代理注入特定領域的最佳實踐
2. **組合使用**：`delegate_task(category=..., load_skills=[...])` 實現精確匹配
3. **成本最佳化**：簡單任務使用 `quick` category，避免使用昂貴模型
4. **反模式警告**：每個 Skill 都有明確的「不要做什麼」指導

---

## 下一課預告

> 下一課我們學習 **[生命週期鉤子](../lifecycle-hooks/)**。
>
> 你會學到：
> - 32 個生命週期鉤子的作用和執行順序
> - 如何自動化上下文注入和錯誤復原
> - 常用鉤子的設定方法（todo-continuation-enforcer、keyword-detector 等）

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| playwright Skill 定義 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| createBuiltinSkills 函式 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| BuiltinSkill 型別定義 | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| 內建 Skills 載入邏輯 | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| 瀏覽器引擎設定 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**關鍵設定**：
- `browser_automation_engine.provider`: 瀏覽器自動化引擎（預設 `playwright`，可選 `agent-browser`）
- `disabled_skills`: 停用的 Skill 清單

**關鍵函式**：
- `createBuiltinSkills(options)`: 根據瀏覽器引擎設定回傳對應的 Skills 陣列

</details>
