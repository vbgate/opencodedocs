---
title: "常見問題：ultrawork 模式 | oh-my-opencode"
subtitle: "常見問題解答"
sidebarTitle: "遇到問題怎麼辦"
description: "學習 oh-my-opencode 常見問題的解答。包括 ultrawork 模式、多代理協作、背景任務、Ralph Loop 和組態故障排除。"
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# 常見問題解答

## 學完你能做什麼

讀完這篇 FAQ，你將能夠：

- 快速找到安裝和組態問題的解決方案
- 了解如何正確使用 ultrawork 模式
- 掌握代理程式呼叫的最佳實踐
- 理解 Claude Code 相容性的邊界和限制
- 避免常見的安全和效能陷阱

---

## 安裝與組態

### 如何安裝 oh-my-opencode？

**最簡單的方式**：讓 AI 代理程式幫你安裝。

將以下提示詞發給你的 LLM 代理程式（Claude Code、AmpCode、Cursor 等）：

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**手動安裝**：參考 [安裝指南](../start/installation/)。

::: tip 為什麼推薦讓 AI 代理程式安裝？
人類容易在組態 JSONC 格式時出錯（如忘記引號、冒號位置錯誤）。讓 AI 代理程式處理可以避免常見的語法錯誤。
:::

### 如何解除安裝 oh-my-opencode？

分三步清理：

**第 1 步**：從 OpenCode 組態中移除外掛程式

編輯 `~/.config/opencode/opencode.json`（或 `opencode.jsonc`），從 `plugin` 陣列中刪除 `"oh-my-opencode"`。

```bash
# 使用 jq 自動移除
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**第 2 步**：刪除組態檔案（可選）

```bash
# 刪除使用者組態
rm -f ~/.config/opencode/oh-my-opencode.json

# 刪除專案組態（如果存在）
rm -f .opencode/oh-my-opencode.json
```

**第 3 步**：驗證移除

```bash
opencode --version
# 外掛程式應該不再載入
```

### 組態檔案在哪裡？

組態檔案有兩個層級：

| 級別 | 位置 | 用途 | 優先順序 |
| --- | --- | --- | --- |
| 專案級 | `.opencode/oh-my-opencode.json` | 專案特定組態 | 低 |
| 使用者級 | `~/.config/opencode/oh-my-opencode.json` | 全域預設組態 | 高 |

**合併規則**：使用者級組態會覆蓋專案級組態。

組態檔案支援 JSONC 格式（JSON with Comments），你可以新增註解和尾隨逗號：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // 這是一個註解
  "disabled_agents": [], // 可以有尾隨逗號
  "agents": {}
}
```

### 如何停用某個功能？

在組態檔案中使用 `disabled_*` 陣列：

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code 相容性開關**：

```json
{
  "claude_code": {
    "mcp": false,        // 停用 Claude Code 的 MCP
    "commands": false,    // 停用 Claude Code 的 Commands
    "skills": false,      // 停用 Claude Code 的 Skills
    "hooks": false        // 停用 settings.json hooks
  }
}
```

---

## 使用相關

### 什麼是 ultrawork？

**ultrawork**（或簡寫 `ulw`）是魔法詞——在提示詞中包含它，所有功能會自動啟動：

- ✅ 並行背景任務
- ✅ 所有專業代理程式（Sisyphus、Oracle、Librarian、Explore、Prometheus 等）
- ✅ 深度探索模式
- ✅ Todo 強制完成機制

**使用示例**：

```
ultrawork 開發一個 REST API，需要 JWT 認證和使用者管理
```

或者更簡短：

```
ulw 重構這個模組
```

::: info 原理
`keyword-detector` Hook 會檢測到 `ultrawork` 或 `ulw` 關鍵詞，然後設定 `message.variant` 為特殊值，觸發所有進階功能。
:::

### 如何呼叫特定的代理程式？

**方式 1：使用 @ 符號**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**方式 2：使用 delegate_task 工具**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**代理程式權限限制**：

| 代理程式 | 可寫入程式碼 | 可執行 Bash | 可委託任務 | 說明 |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | 主編排器 |
| Oracle | ❌ | ❌ | ❌ | 唯讀顧問 |
| Librarian | ❌ | ❌ | ❌ | 唯讀研究 |
| Explore | ❌ | ❌ | ❌ | 唯讀搜尋 |
| Multimodal Looker | ❌ | ❌ | ❌ | 唯讀媒體分析 |
| Prometheus | ✅ | ✅ | ✅ | 規劃師 |

### 背景任務如何工作？

背景任務讓你可以像真實開發團隊一樣，讓多個 AI 代理程式並行工作：

**啟動背景任務**：

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**繼續工作...**

**系統自動通知完成**（透過 `background-notification` Hook）

**取得結果**：

```
background_output(task_id="bg_abc123")
```

**並發控制**：

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**優先順序**：`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip 為什麼需要並發控制？
避免 API 限流和成本失控。例如，Claude Opus 4.5 成本高，限制其並發數；而 Haiku 成本低，可以並發更多。
:::

### 如何使用 Ralph Loop？

**Ralph Loop** 是自我參考的開發循環——持續工作直到任務完成。

**啟動**：

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**如何判斷完成**：代理程式輸出 `<promise>DONE</promise>` 標記。

**取消循環**：

```
/cancel-ralph
```

**組態**：

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip 與 ultrawork 的區別
`/ralph-loop` 普通模式，`/ulw-loop` ultrawork 模式（所有進階功能啟動）。
:::

### Categories 和 Skills 是什麼？

**Categories**（v3.0 新增）：模型抽象層，根據任務類型自動選擇最優模型。

**內建 Categories**：

| Category | 預設模型 | Temperature | 用例 |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | 前端、UI/UX、設計 |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | 高智商推理任務 |
| artistry | google/gemini-3-pro | 0.7 | 創意和藝術任務 |
| quick | anthropic/claude-haiku-4-5 | 0.1 | 快速、低成本任務 |
| writing | google/gemini-3-flash | 0.1 | 文件和寫作任務 |

**Skills**：專業知識模組，注入特定領域的最佳實踐。

**內建 Skills**：

| Skill | 觸發條件 | 描述 |
| --- | --- | --- |
| playwright | 瀏覽器相關任務 | Playwright MCP 瀏覽器自動化 |
| frontend-ui-ux | UI/UX 任務 | 設計師轉開發人員，打造精美介面 |
| git-master | Git 操作（commit、rebase、squash） | Git 專家，原子提交、歷史搜尋 |

**使用示例**：

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="設計這個頁面的 UI")
delegate_task(category="quick", skills=["git-master"], prompt="提交這些更改")
```

::: info 優勢
Categories 優化成本（用便宜的模型），Skills 確保品質（注入專業知識）。
:::

---

## Claude Code 相容性

### 能否使用 Claude Code 的組態？

**可以**，oh-my-opencode 提供**完全相容層**：

**支援的組態類型**：

| 類型 | 載入位置 | 優先順序 |
| --- | --- | --- |
| Commands | `~/.claude/commands/`, `.claude/commands/` | 低 |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | 中 |
| Agents | `~/.claude/agents/*.md/agents/*.md`, `.claude` | 高 |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | 高 |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | 高 |

**組態載入優先順序**：

OpenCode 專案的組態 > Claude Code 使用者的組態

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 停用特定外掛程式
    }
  }
}
```

### 能否使用 Claude Code 訂閱？

**技術上可行，但不推薦**。

::: warning Claude OAuth 存取限制
截至 2026 年 1 月，Anthropic 已限制第三方 OAuth 存取，理由是違反 ToS。
:::

**官方聲明**（來自 README）：

> 確實存在一些偽造 Claude Code OAuth 請求簽名的社群工具。這些工具可能在技術上無法檢測，但使用者應了解 ToS 影響，我個人不推薦使用它們。
>
> **本專案不負責因使用非官方工具而產生的任何問題，我們沒有自定義實現這些 OAuth 系統。**

**推薦方案**：使用你已有的 AI Provider 訂閱（Claude、OpenAI、Gemini 等）。

### 資料是否相容？

**是的**，資料儲存格式相容：

| 資料 | 位置 | 格式 | 相容性 |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code 相容 |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code 相容 |

你可以無縫在 Claude Code 和 oh-my-opencode 之間切換。

---

## 安全性與效能

### 是否有安全警告？

**是的**，README 頂部有明確警告：

::: danger 警告：冒充站台
**ohmyopencode.com 與本專案無關。** 我們不營運或背書該網站。
>
> OhMyOpenCode 是**免費和開源的**。不要在聲稱「官方」的第三方站台下載安裝程式或輸入付款資訊。
>
> 由於冒充站台位於付費牆後，我們**無法驗證其分發內容**。將其中的任何下載視為**潛在不安全**。
>
> ✅ 官方下載：https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### 如何優化效能？

**策略 1：使用合適的模型**

- 快速任務 → 使用 `quick` category（Haiku 模型）
- UI 設計 → 使用 `visual` category（Gemini 3 Pro）
- 複雜推理 → 使用 `ultrabrain` category（GPT 5.2）

**策略 2：啟動並發控制**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // 限制 Anthropic 並發
      "openai": 5       // 增加 OpenAI 並發
    }
  }
}
```

**策略 3：使用背景任務**

讓輕量級模型（如 Haiku）在背景收集資訊，主代理程式專注於核心邏輯。

**策略 4：停用不需要的功能**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // 停用 Claude Code hooks（如果不用）
  }
}
```

### OpenCode 版本要求？

**推薦**：OpenCode >= 1.0.132

::: warning 舊版本 bug
如果你使用的是 1.0.132 或更舊版本，OpenCode 的一個 bug 可能會破壞組態。
>
> 該修復在 1.0.132 之後合併——使用更新版本。
:::

檢查版本：

```bash
opencode --version
```

---

## 故障排除

### 代理程式不工作？

**檢查清單**：

1. ✅ 驗證組態檔案格式正確（JSONC 語法）
2. ✅ 檢查 Provider 組態（API Key 是否有效）
3. ✅ 執行診斷工具：`oh-my-opencode doctor --verbose`
4. ✅ 查看 OpenCode 日誌中的錯誤資訊

**常見問題**：

| 問題 | 原因 | 解決方案 |
| --- | --- | --- |
| 代理程式拒絕任務 | 權限組態錯誤 | 檢查 `agents.permission` 組態 |
| 背景任務超時 | 並發限制過嚴 | 增加 `providerConcurrency` |
| 思考塊錯誤 | 模型不支援 thinking | 切換到支援 thinking 的模型 |

### 組態檔案不生效？

**可能原因**：

1. JSON 語法錯誤（忘記引號、逗號）
2. 組態檔案位置錯誤
3. 使用者組態未覆蓋專案組態

**驗證步驟**：

```bash
# 檢查組態檔案是否存在
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# 驗證 JSON 語法
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**使用 JSON Schema 驗證**：

在組態檔案開頭新增 `$schema` 欄位，編輯器會自動提示錯誤：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### 背景任務沒有完成？

**檢查清單**：

1. ✅ 查看任務狀態：`background_output(task_id="...")`
2. ✅ 檢查並發限制：是否有可用並發槽
3. ✅ 查看日誌：是否有 API 限流錯誤

**強制取消任務**：

```javascript
background_cancel(task_id="bg_abc123")
```

**任務 TTL**：背景任務會在 30 分鐘後自動清理。

---

## 更多資源

### 去哪裡尋求幫助？

- **GitHub Issues**：https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord 社群**：https://discord.gg/PUwSMR9XNk
- **X (Twitter)**：https://x.com/justsisyphus

### 推薦閱讀順序

如果你是新手，建議按以下順序閱讀：

1. [快速安裝與組態](../start/installation/)
2. [初識 Sisyphus：主編排器](../start/sisyphus-orchestrator/)
3. [Ultrawork 模式](../start/ultrawork-mode/)
4. [組態診斷與故障排除](../troubleshooting/)

### 貢獻程式碼

歡迎 Pull Request！專案 99% 程式碼使用 OpenCode 建構。

如果你想改進某個功能或修復 bug，請：

1. Fork 倉庫
2. 建立特性分支
3. 提交更改
4. 推送至分支
5. 建立 Pull Request

---

## 本課小結

本 FAQ 涵蓋了 oh-my-opencode 的常見問題，包括：

- **安裝與組態**：如何安裝、解除安裝、組態檔案位置、停用功能
- **使用技巧**：ultrawork 模式、代理程式呼叫、背景任務、Ralph Loop、Categories 和 Skills
- **Claude Code 相容性**：組態載入、訂閱使用限制、資料相容性
- **安全與效能**：安全警告、效能優化策略、版本要求
- **故障排除**：常見問題和解決方案

記住這些關鍵點：

- 使用 `ultrawork` 或 `ulw` 關鍵詞啟動所有功能
- 讓輕量級模型在背景收集資訊，主代理程式專注於核心邏輯
- 組態檔案支援 JSONC 格式，可以新增註解
- Claude Code 組態可以無縫載入，但 OAuth 存取有限制
- 從官方 GitHub 倉庫下載，警惕冒充站台

## 下一課預告

> 如果你在使用過程中遇到具體的組態問題，可以查看 **[組態診斷與故障排除](../troubleshooting/)**。
>
> 你會學到：
> - 如何使用診斷工具檢查組態
> - 常見錯誤代碼的含義和解決方法
> - Provider 組態問題的排查技巧
> - 效能問題的定位和優化建議

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Keyword Detector (ultrawork 檢測) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | 全目錄 |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 全檔案 |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | 全檔案 |
| Delegate Task (Category & Skill 解析) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 全檔案 |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | 全目錄 |

**關鍵常數**：
- `DEFAULT_MAX_ITERATIONS = 100`：Ralph Loop 預設最大迭代次數
- `TASK_TTL_MS = 30 * 60 * 1000`：背景任務 TTL（30 分鐘）
- `POLL_INTERVAL_MS = 2000`：背景任務輪詢間隔（2 秒）

**關鍵組態**：
- `disabled_agents`: 停用的代理程式列表
- `disabled_skills`: 停用的技能列表
- `disabled_hooks`: 停用的鉤子列表
- `claude_code`: Claude Code 相容性組態
- `background_task`: 背景任務並發組態
- `categories`: Category 自定義組態
- `agents`: 代理程式覆蓋組態

</details>
