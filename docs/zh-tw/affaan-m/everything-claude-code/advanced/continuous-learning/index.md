---
title: "持續學習: 自動提取模式 | Everything Claude Code"
sidebarTitle: "讓 Claude Code 越用越聰明"
subtitle: "持續學習: 自動提取可複用模式"
description: "學習 Everything Claude Code 的持續學習機制。透過 /learn 提取模式、設定自動評估、配置 Stop hook，讓 Claude Code 不斷累積經驗，提升開發效率。"
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# 持續學習機制：自動提取可複用模式

## 學完你能做什麼

- 使用 `/learn` 指令手動提取對話中的可複用模式
- 設定 continuous-learning skill 在對話結束時自動評估
- 配置 Stop hook 自動觸發模式提取
- 儲存提取的模式為 learned skills，在未來的對話中複用
- 設定提取閾值、對話長度要求等參數

## 你現在的困境

在使用 Claude Code 開發時，你是否遇過這些情況：

- 解決了一個複雜問題，下次遇到類似問題又要重新摸索
- 學會了某個框架的除錯技巧，過段時間就忘了
- 發現了專案的特定編碼規範，但無法系統地記錄下來
- 找到了一個 workaround 方案，但下次遇到類似問題又想不起來

這些問題導致你的經驗和知識無法有效累積，每次都要從頭開始。

## 什麼時候用這一招

使用持續學習機制的場景：

- **解決複雜問題時**：除錯了半天的 bug，需要記住解決思路
- **學習新框架時**：發現了框架的 quirks 或最佳實踐
- **專案開發中期**：逐步發現了專案特定的約定和模式
- **程式碼審查後**：學到了新的安全檢查方法或編碼規範
- **效能最佳化時**：找到了有效的最佳化技巧或工具組合

::: tip 核心價值
持續學習機制讓 Claude Code 越用越聰明。它像一個經驗豐富的導師，在你解決問題的過程中自動記錄有用的模式，在未來的類似情境中提供建議。
:::

## 核心思路

持續學習機制由三個核心元件組成：

```
1. /learn 指令     → 手動提取：隨時執行，儲存當前有價值的模式
2. Continuous Learning Skill → 自動評估：Stop hook 觸發，分析對話
3. Learned Skills   → 知識庫：儲存模式，未來自動載入
```

**運作原理**：

- **手動提取**：你在解決非平凡問題後，主動使用 `/learn` 提取模式
- **自動評估**：對話結束時，Stop hook 腳本檢查對話長度，提示 Claude 評估
- **知識沉澱**：提取的模式儲存為 learned skills，在 `~/.claude/skills/learned/` 目錄
- **未來複用**：Claude Code 在未來的對話中自動載入這些 skills

**為什麼選擇 Stop hook**：

- **輕量級**：只在對話結束時執行一次，不影響互動回應速度
- **完整上下文**：可以存取完整的對話記錄，更容易發現有價值的模式
- **非阻塞**：不會在每次傳送訊息時都執行，不會增加延遲

## 🎒 開始前的準備

在使用持續學習機制之前，請確認：

- ✅ 已安裝 Everything Claude Code 外掛
- ✅ 了解了 [核心 Commands 詳解](../../platforms/commands-overview/) 中的 `/learn` 指令
- ✅ 理解了 [Hooks 自動化](../hooks-automation/) 中的 Stop hook 概念

::: warning 前置條件
本教學假設你已熟悉 Claude Code 的基本操作和 hooks 概念。如果還沒完成安裝，請先閱讀[快速開始](../../start/quickstart/)。
:::

## 跟我做：完整的持續學習流程

讓我們透過一個實際範例來學習整個流程。假設你在除錯一個 TypeScript 型別錯誤，最終找到了解決方案。

### 第 1 步：使用 /learn 手動提取模式

**為什麼**
手動提取適用於剛解決的重要問題，立即儲存避免遺忘。

**操作**
在 Claude Code 中輸入：

```
/learn
```

**你應該看到**
Claude 會分析當前對話，並詢問是否發現可提取的模式：

```markdown
我分析了當前對話，發現了以下可提取的模式：

1. TypeScript 型別錯誤：透過泛型約束解決
   - 問題描述：函式參數型別推斷不正確
   - 解決方法：新增顯式泛型約束 `<T extends ...>`
   - 適用場景：複雜型別推斷、回呼函式

是否提取這些模式？(yes/no/skip)
```

**檢查點 ✅**
- Claude 是否識別到了你解決的問題
- 提取的模式描述是否準確
- 適用場景是否合理

**下一步**
如果模式正確，回覆 `yes`。需要修改就說明具體變更。

---

### 第 2 步：儲存為 learned skill

**為什麼**
儲存為 skill 檔案後，未來的對話可以自動載入這些知識。

**操作**
如果確認提取，Claude 會建立 skill 檔案：

```markdown
將儲存模式到：~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** 解決複雜型別推斷問題

## Problem
TypeScript 函式參數型別推斷不正確，導致型別錯誤。

## Solution
新增顯式泛型約束 `<T extends ...>` 明確型別關係。

## Example
```typescript
// Before
function process(data) { ... }  // 型別推斷失敗

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- 複雜型別推斷場景
- 回呼函式型別定義
- 泛型函式參數約束
```

**你應該看到**
Claude 提示檔案已儲存：

```markdown
✅ Skill 已儲存到：~/.claude/skills/learned/typescript-generic-constraints.md

未來遇到類似型別問題時，Claude 會自動載入這個技能。
```

**檢查點 ✅**
- 檔案是否成功建立
- 檔案路徑是否在 `~/.claude/skills/learned/` 目錄
- skill 內容是否準確

---

### 第 3 步：設定 Continuous Learning Skill

**為什麼**
設定自動評估後，Claude 會在每次對話結束時自動檢查是否有可提取的模式。

**操作**

建立設定檔 `~/.claude/skills/continuous-learning/config.json`：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**設定說明**：

| 欄位 | 說明 | 建議值 |
| --- | --- | --- |
| `min_session_length` | 最小對話長度（使用者訊息數） | 10 |
| `extraction_threshold` | 提取閾值 | medium |
| `auto_approve` | 是否自動儲存（建議 false） | false |
| `learned_skills_path` | learned skills 儲存路徑 | `~/.claude/skills/learned/` |
| `patterns_to_detect` | 要偵測的模式類型 | 見上文 |
| `ignore_patterns` | 忽略的模式類型 | 見上文 |

**你應該看到**
設定檔已建立在 `~/.claude/skills/continuous-learning/config.json`。

**檢查點 ✅**
- 設定檔格式正確（JSON 有效）
- `learned_skills_path` 包含 `~` 符號（會被替換為實際 home 目錄）
- `auto_approve` 設定為 `false`（建議）

---

### 第 4 步：設定 Stop Hook 自動觸發

**為什麼**
Stop hook 會在每次對話結束時自動觸發，無需手動執行 `/learn`。

**操作**

編輯 `~/.claude/settings.json`，新增 Stop hook：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**腳本路徑說明**：

| 平台 | 腳本路徑 |
| --- | --- |
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**你應該看到**
Stop hook 已新增到 `~/.claude/settings.json`。

**檢查點 ✅**
- hooks 結構正確（Stop → matcher → hooks）
- command 路徑指向正確的腳本
- matcher 設定為 `"*"`（符合所有對話）

---

### 第 5 步：驗證 Stop Hook 運作正常

**為什麼**
驗證設定正確後，才能放心使用自動提取功能。

**操作**
1. 開啟一個新的 Claude Code 對話
2. 進行一些開發工作（至少傳送 10 則訊息）
3. 關閉對話

**你應該看到**
Stop hook 腳本輸出日誌：

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/yourname/.claude/skills/learned/
```

**檢查點 ✅**
- 日誌顯示對話訊息數 ≥ 10
- 日誌輸出 learned skills 路徑正確
- 沒有錯誤訊息

---

### 第 6 步：未來對話自動載入 learned skills

**為什麼**
saved skills 會在未來的類似場景中自動載入，提供上下文。

**操作**
在未來的對話中遇到類似問題時，Claude 會自動載入相關 learned skills。

**你應該看到**
Claude 提示已載入相關 skills：

```markdown
我注意到這個場景與之前解決的型別推斷問題類似。

根據 saved skill (typescript-generic-constraints)，建議使用顯式泛型約束：

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**檢查點 ✅**
- Claude 引用了 saved skill
- 建議的解決方案準確
- 提升了問題解決效率

## 檢查點 ✅：驗證設定

完成以上步驟後，執行以下檢查確認一切正常：

1. **檢查設定檔存在**：
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **檢查 Stop hook 設定**：
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **檢查 learned skills 目錄**：
```bash
ls -la ~/.claude/skills/learned/
```

4. **手動測試 Stop hook**：
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## 踩坑提醒

### 坑 1：對話太短導致不觸發提取

**問題**：
Stop hook 腳本檢查對話長度，低於 `min_session_length` 時跳過。

**原因**：
預設 `min_session_length: 10`，短對話不會觸發評估。

**解決方法**：
```json
{
  "min_session_length": 5  // 降低閾值
}
```

::: warning 注意
不要設定太低（如 < 5），否則會提取大量無意義的模式（如簡單的語法錯誤修復）。
:::

---

### 坑 2：`auto_approve: true` 導致自動儲存垃圾模式

**問題**：
自動儲存模式下，Claude 可能儲存低品質的 patterns。

**原因**：
`auto_approve: true` 會跳過人工確認環節。

**解決方法**：
```json
{
  "auto_approve": false  // 始終保持 false
}
```

**建議做法**：
始終手動確認提取的模式，保證品質。

---

### 坑 3：learned skills 目錄不存在導致儲存失敗

**問題**：
Stop hook 執行成功，但 skill 檔案沒有建立。

**原因**：
`learned_skills_path` 指向的目錄不存在。

**解決方法**：
```bash
# 手動建立目錄
mkdir -p ~/.claude/skills/learned/

# 或者在設定中使用絕對路徑
{
  "learned_skills_path": "/absolute/path/to/learned/"
}
```

---

### 坑 4：Stop hook 腳本路徑錯誤（Windows）

**問題**：
Windows 上 Stop hook 不觸發。

**原因**：
設定檔使用了 Unix 風格的路徑（`~/.claude/...`），但 Windows 實際路徑不同。

**解決方法**：
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**建議做法**：
使用 Node.js 腳本（跨平台），而不是 Shell 腳本。

---

### 坑 5：提取的模式太泛化，複用性差

**問題**：
提取的模式描述太泛（如「修復型別錯誤」），缺乏具體上下文。

**原因**：
提取時沒有包含足夠的上下文資訊（錯誤訊息、程式碼範例、適用場景）。

**解決方法**：
在 `/learn` 時提供更詳細的上下文：

```
/learn 我解決了一個 TypeScript 型別錯誤：Property 'xxx' does not exist on type 'yyy'。透過使用型別斷言 as 臨時解決，但更好的方法是使用泛型約束。
```

**檢查清單**：
- [ ] 問題描述具體（包含錯誤訊息）
- [ ] 解決方法詳細（包含程式碼範例）
- [ ] 適用場景明確（何時使用此模式）
- [ ] 命名具體（如「typescript-generic-constraints」而非「type-fix」）

---

### 坑 6：learned skills 數量過多，難以管理

**問題**：
隨著時間推移，`learned/` 目錄累積了大量 skills，難以查找和管理。

**原因**：
沒有定期清理低品質或過時的 skills。

**解決方法**：

1. **定期審查**：每月檢查一次 learned skills
```bash
# 列出所有 skills
ls -la ~/.claude/skills/learned/

# 查看 skill 內容
cat ~/.claude/skills/learned/pattern-name.md
```

2. **標記低品質 skills**：在檔名前新增 `deprecated-` 前綴
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **分類管理**：使用子目錄分類
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**建議做法**：
每季清理一次，保持 learned skills 精簡有效。

---

## 本課小結

持續學習機制透過三個核心元件運作：

1. **`/learn` 指令**：手動提取對話中的可複用模式
2. **Continuous Learning Skill**：設定自動評估參數（對話長度、提取閾值）
3. **Stop Hook**：在對話結束時自動觸發評估

**關鍵點**：

- ✅ 手動提取適用於剛解決的重要問題
- ✅ 自動評估透過 Stop hook 在對話結束時觸發
- ✅ 提取的模式儲存為 learned skills，在 `~/.claude/skills/learned/` 目錄
- ✅ 設定 `min_session_length` 控制最小對話長度（建議 10）
- ✅ 始終保持 `auto_approve: false`，手動確認提取的品質
- ✅ 定期清理低品質或過時的 learned skills

**最佳實踐**：

- 解決非平凡問題後，立即使用 `/learn` 提取模式
- 提供詳細的上下文（問題描述、解決方案、程式碼範例、適用場景）
- 使用具體的 skill 命名（如「typescript-generic-constraints」而非「type-fix」）
- 定期審查和清理 learned skills，保持知識庫精簡

## 下一課預告

> 下一課我們學習 **[Token 最佳化策略](../token-optimization/)**。
>
> 你會學到：
> - 如何最佳化 Token 使用，最大化上下文視窗效率
> - strategic-compact skill 的設定和使用
> - PreCompact 和 PostToolUse hooks 的自動化
> - 選擇合適的模型（opus vs sonnet）平衡成本和品質

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| /learn 指令定義 | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Stop Hook 腳本 | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Checkpoint 指令 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**關鍵常數**：
- `min_session_length = 10`：預設最小對話長度（使用者訊息數）
- `CLAUDE_TRANSCRIPT_PATH`：環境變數，對話記錄路徑
- `learned_skills_path`：learned skills 儲存路徑，預設 `~/.claude/skills/learned/`

**關鍵函式**：
- `main()`：evaluate-session.js 主函式，讀取設定、檢查對話長度、輸出日誌
- `getLearnedSkillsDir()`：取得 learned skills 目錄路徑（處理 `~` 展開）
- `countInFile()`：統計檔案中符合模式的出現次數

**設定項**：
| 設定項 | 類型 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `min_session_length` | number | 10 | 最小對話長度（使用者訊息數） |
| `extraction_threshold` | string | "medium" | 提取閾值 |
| `auto_approve` | boolean | false | 是否自動儲存（建議 false） |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | learned skills 儲存路徑 |
| `patterns_to_detect` | array | 見原始碼 | 要偵測的模式類型 |
| `ignore_patterns` | array | 見原始碼 | 忽略的模式類型 |

**模式類型**：
- `error_resolution`：錯誤解決模式
- `user_corrections`：使用者糾正模式
- `workarounds`：workaround 方案
- `debugging_techniques`：除錯技巧
- `project_specific`：專案特定模式

**Hook 類型**：
- Stop：在對話結束時執行（evaluate-session.js）

</details>
