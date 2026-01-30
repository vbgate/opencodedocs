---
title: "Agent 故障排查：診斷與修復 | Everything Claude Code"
sidebarTitle: "Agent 掛了怎麼辦"
subtitle: "Agent 故障排查：診斷與修復"
description: "學習 Everything Claude Code Agent 呼叫失敗的排查方法。涵蓋 Agent 未載入、設定錯誤、工具權限不足、呼叫逾時等常見故障的診斷與解決，幫助你掌握系統化除錯技巧。"
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Agent 呼叫失敗排查

## 你遇到的問題

使用 Agent 時遇到困難？你可能會遇到以下情況：

- 輸入 `/plan` 或其他指令，Agent 沒有被呼叫
- 看到錯誤訊息：「Agent not found」
- Agent 執行逾時或卡住
- Agent 輸出不符合預期
- Agent 沒有按照規則工作

別擔心，這些問題通常都有明確的解決方法。本課幫你系統地排查和修復 Agent 相關問題。

## 🎒 開始前的準備

::: warning 前置檢查
確保你已經：
1. ✅ 完成了 Everything Claude Code 的[安裝](../../start/installation/)
2. ✅ 了解 [Agents 概念](../../platforms/agents-overview/)和 9 個專業化子代理
3. ✅ 嘗試呼叫過 Agent（如 `/plan`、`/tdd`、`/code-review`）
:::

---

## 常見問題 1：Agent 完全不被呼叫

### 症狀
輸入 `/plan` 或其他指令，但 Agent 沒有被觸發，只是普通聊天。

### 可能原因

#### 原因 A：Agent 檔案路徑錯誤

**問題**：Agent 檔案沒有放在正確的位置，Claude Code 找不到。

**解決方案**：

檢查 Agent 檔案的位置是否正確：

```bash
# 應該在以下位置之一：
~/.claude/agents/              # 使用者級設定（全域）
.claude/agents/                 # 專案級設定
```

**檢查方法**：

```bash
# 查看使用者級設定
ls -la ~/.claude/agents/

# 查看專案級設定
ls -la .claude/agents/
```

**應該看到 9 個 Agent 檔案**：
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**如果檔案不存在**，從 Everything Claude Code 外掛目錄複製：

```bash
# 假設外掛安裝在 ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# 或者從複製的儲存庫複製
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### 原因 B：Command 檔案缺失或路徑錯誤

**問題**：Command 檔案（如 `/plan` 對應的 `plan.md`）不存在或路徑錯誤。

**解決方案**：

檢查 Command 檔案的位置：

```bash
# Commands 應該在以下位置之一：
~/.claude/commands/             # 使用者級設定（全域）
.claude/commands/                # 專案級設定
```

**檢查方法**：

```bash
# 查看使用者級設定
ls -la ~/.claude/commands/

# 查看專案級設定
ls -la .claude/commands/
```

**應該看到 14 個 Command 檔案**：
- `plan.md` → 呼叫 `planner` agent
- `tdd.md` → 呼叫 `tdd-guide` agent
- `code-review.md` → 呼叫 `code-reviewer` agent
- `build-fix.md` → 呼叫 `build-error-resolver` agent
- `e2e.md` → 呼叫 `e2e-runner` agent
- 等等...

**如果檔案不存在**，複製 Command 檔案：

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### 原因 C：外掛未正確載入

**問題**：透過外掛市場安裝，但外掛未被正確載入。

**解決方案**：

檢查 `~/.claude/settings.json` 中的外掛設定：

```bash
# 查看外掛設定
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**應該看到**：

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**如果未啟用**，手動新增：

```bash
# 編輯 settings.json
nano ~/.claude/settings.json

# 新增或修改 enabledPlugins 欄位
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**重新啟動 Claude Code 使設定生效**。

---

## 常見問題 2：Agent 呼叫報錯「Agent not found」

### 症狀
輸入指令後，看到錯誤訊息：「Agent not found」或「Could not find agent: xxx」。

### 可能原因

#### 原因 A：Command 檔案中的 Agent 名稱不匹配

**問題**：Command 檔案中的 `invokes` 欄位與 Agent 檔案名稱不匹配。

**解決方案**：

檢查 Command 檔案中的 `invokes` 欄位：

```bash
# 查看某個 Command 檔案
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Command 檔案結構**（以 `plan.md` 為例）：

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**驗證 Agent 檔案是否存在**：

Command 檔案中提到的 agent 名稱（如 `planner`）必須對應一個檔案：`planner.md`

```bash
# 驗證 Agent 檔案存在
ls -la ~/.claude/agents/planner.md

# 如果不存在，檢查是否有類似名稱的檔案
ls -la ~/.claude/agents/ | grep -i plan
```

**常見不匹配範例**：

| Command invokes | 實際 Agent 檔案名稱 | 問題 |
| --- | --- | --- |
| `planner` | `planner.md` | ✅ 正確 |
| `planner` | `Planner.md` | ❌ 大小寫不匹配（Unix 系統區分大小寫） |
| `planner` | `planner.md.backup` | ❌ 檔案副檔名錯誤 |
| `tdd-guide` | `tdd_guide.md` | ❌ 連字號 vs 底線 |

#### 原因 B：Agent 檔案名稱錯誤

**問題**：Agent 檔案名稱與預期不符。

**解決方案**：

檢查所有 Agent 檔案名稱：

```bash
# 列出所有 Agent 檔案
ls -la ~/.claude/agents/

# 預期的 9 個 Agent 檔案
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**如果檔案名稱不正確**，重新命名檔案：

```bash
# 範例：修復檔案名稱
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## 常見問題 3：Agent Front Matter 格式錯誤

### 症狀
Agent 被呼叫，但看到錯誤訊息：「Invalid agent metadata」或類似格式錯誤。

### 可能原因

#### 原因 A：缺少必需欄位

**問題**：Agent Front Matter 缺少必需欄位（`name`、`description`、`tools`）。

**解決方案**：

檢查 Agent Front Matter 格式：

```bash
# 查看某個 Agent 檔案的開頭
head -20 ~/.claude/agents/planner.md
```

**正確的 Front Matter 格式**：

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**必需欄位**：
- `name`：Agent 名稱（必須與檔案名稱匹配，不含副檔名）
- `description`：Agent 描述（用於理解 Agent 的職責）
- `tools`：允許使用的工具清單（逗號分隔）

**可選欄位**：
- `model`：首選模型（`opus` 或 `sonnet`）

#### 原因 B：Tools 欄位錯誤

**問題**：`tools` 欄位使用了錯誤的工具名稱或格式。

**解決方案**：

檢查 `tools` 欄位：

```bash
# 提取 tools 欄位
grep "^tools:" ~/.claude/agents/*.md
```

**允許的工具名稱**（區分大小寫）：
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**常見錯誤**：

| 錯誤寫法 | 正確寫法 | 問題 |
| --- | --- | --- |
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ 大小寫錯誤 |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ 尾部逗號（YAML 語法錯誤） |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ 不需要引號包裹 |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ 缺少逗號分隔 |

#### 原因 C：YAML 語法錯誤

**問題**：Front Matter YAML 格式錯誤（如縮排、引號、特殊字元）。

**解決方案**：

驗證 YAML 格式：

```bash
# 使用 Python 驗證 YAML
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# 或使用 yamllint（需要安裝）
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**常見 YAML 錯誤**：
- 縮排不一致（YAML 對縮排敏感）
- 冒號後缺少空格：`name:planner` → `name: planner`
- 字串中包含未轉義的特殊字元（如冒號、井號）
- 使用了 Tab 縮排（YAML 只接受空格）

---

## 常見問題 4：Agent 執行逾時或卡住

### 症狀
Agent 開始執行，但長時間無回應或卡住。

### 可能原因

#### 原因 A：任務複雜度過高

**問題**：請求的任務過於複雜，超出 Agent 的處理能力。

**解決方案**：

**將任務拆分為更小的步驟**：

```
❌ 錯誤：一次性要求 Agent 處理整個專案
「幫我重構整個使用者認證系統，包括所有測試和文件」

✅ 正確：分步驟執行
第 1 步：/plan 重構使用者認證系統
第 2 步：/tdd 實作第一步（登入 API）
第 3 步：/tdd 實作第二步（註冊 API）
...
```

**使用 `/plan` 指令先規劃**：

```
使用者：/plan 我需要重構使用者認證系統

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[詳細步驟...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### 原因 B：模型選擇不當

**問題**：任務複雜度高，但使用了較弱的模型（如 `sonnet` 而非 `opus`）。

**解決方案**：

檢查 Agent 的 `model` 欄位：

```bash
# 查看所有 Agent 使用的模型
grep "^model:" ~/.claude/agents/*.md
```

**推薦設定**：
- **推理密集型任務**（如 `planner`、`architect`）：使用 `opus`
- **程式碼生成/修改**（如 `tdd-guide`、`code-reviewer`）：使用 `opus`
- **簡單任務**（如 `refactor-cleaner`）：可以使用 `sonnet`

**修改模型設定**：

編輯 Agent 檔案：

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # 使用 opus 提升複雜任務效能
---
```

#### 原因 C：檔案讀取過多

**問題**：Agent 讀取了大量檔案，超出 Token 限制。

**解決方案**：

**限制 Agent 讀取的檔案範圍**：

```
❌ 錯誤：讓 Agent 讀取整個專案
「閱讀專案中所有檔案，然後分析架構」

✅ 正確：指定相關檔案
「閱讀 src/auth/ 目錄下的檔案，分析認證系統架構」
```

**使用 Glob 模式精確匹配**：

```
使用者：請幫我最佳化效能

Agent 應該：
# 使用 Glob 找到效能關鍵檔案
Glob pattern="**/*.{ts,tsx}" path="src/api"

# 而不是
Glob pattern="**/*" path="."  # 讀取所有檔案
```

---

## 常見問題 5：Agent 輸出不符合預期

### 症狀
Agent 被呼叫並執行，但輸出不符合預期或品質不高。

### 可能原因

#### 原因 A：任務描述不清晰

**問題**：使用者的請求模糊，Agent 無法準確理解需求。

**解決方案**：

**提供清晰、具體的任務描述**：

```
❌ 錯誤：模糊的請求
「幫我最佳化程式碼」

✅ 正確：具體的請求
「幫我最佳化 src/api/markets.ts 中的 searchMarkets 函式，
提升查詢效能，目標是將回應時間從 500ms 降低到 100ms 以下」
```

**包含以下資訊**：
- 具體的檔案或函式名稱
- 明確的目標（效能、安全性、可讀性等）
- 限制條件（不能破壞現有功能、必須保持相容性等）

#### 原因 B：缺少上下文

**問題**：Agent 缺少必要的上下文資訊，無法做出正確決策。

**解決方案**：

**主動提供背景資訊**：

```
使用者：請幫我修復測試失敗

❌ 錯誤：沒有上下文
「npm test 報錯了，幫我修一下」

✅ 正確：提供完整上下文
「執行 npm test 時，searchMarkets 測試失敗了。
錯誤訊息是：Expected 5 but received 0。
我剛才修改了 vectorSearch 函式，可能與此相關。
請幫我定位問題並修復。」
```

**使用 Skills 提供領域知識**：

如果專案有特定的技能庫（`~/.claude/skills/`），Agent 會自動載入相關知識。

#### 原因 C：Agent 專業領域不匹配

**問題**：使用了不合適的 Agent 處理任務。

**解決方案**：

**根據任務類型選擇正確的 Agent**：

| 任務類型 | 推薦使用 | Command |
| --- | --- | --- |
| 實作新功能 | `tdd-guide` | `/tdd` |
| 複雜功能規劃 | `planner` | `/plan` |
| 程式碼審查 | `code-reviewer` | `/code-review` |
| 安全稽核 | `security-reviewer` | 手動呼叫 |
| 修復建置錯誤 | `build-error-resolver` | `/build-fix` |
| E2E 測試 | `e2e-runner` | `/e2e` |
| 清理死程式碼 | `refactor-cleaner` | `/refactor-clean` |
| 更新文件 | `doc-updater` | `/update-docs` |
| 系統架構設計 | `architect` | 手動呼叫 |

**查看 [Agent 概覽](../../platforms/agents-overview/) 了解每個 Agent 的職責**。

---

## 常見問題 6：Agent 工具權限不足

### 症狀
Agent 嘗試使用某個工具時被拒絕，看到錯誤：「Tool not available: xxx」。

### 可能原因

#### 原因 A：Tools 欄位缺少該工具

**問題**：Agent 的 Front Matter 中的 `tools` 欄位沒有包含需要的工具。

**解決方案**：

檢查 Agent 的 `tools` 欄位：

```bash
# 查看 Agent 允許使用的工具
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**如果缺少工具**，新增到 `tools` 欄位：

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # 確保包含 Write 和 Edit
model: opus
---
```

**工具使用場景**：
- `Read`：讀取檔案內容（幾乎所有 Agent 都需要）
- `Write`：建立新檔案
- `Edit`：編輯現有檔案
- `Bash`：執行指令（如執行測試、建置）
- `Grep`：搜尋檔案內容
- `Glob`：查找檔案路徑

#### 原因 B：工具名稱拼寫錯誤

**問題**：`tools` 欄位中使用了錯誤的工具名稱。

**解決方案**：

**驗證工具名稱拼寫**（區分大小寫）：

| ✅ 正確 | ❌ 錯誤 |
| --- | --- |
| `Read` | `read`、`READ` |
| `Write` | `write`、`WRITE` |
| `Edit` | `edit`、`EDIT` |
| `Bash` | `bash`、`BASH` |
| `Grep` | `grep`、`GREP` |
| `Glob` | `glob`、`GLOB` |

---

## 常見問題 7：Proactive Agent 未自動觸發

### 症狀
某些 Agent 應該自動觸發（如程式碼修改後自動呼叫 `code-reviewer`），但沒有。

### 可能原因

#### 原因 A：觸發條件不滿足

**問題**：Agent 的描述中標記了 `Use PROACTIVELY`，但觸發條件未滿足。

**解決方案**：

檢查 Agent 的 `description` 欄位：

```bash
# 查看 Agent 描述
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**範例（code-reviewer）**：

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proactive 觸發條件**：
- 使用者明確請求程式碼審查
- 剛完成程式碼編寫/修改
- 準備提交程式碼前

**手動觸發**：

如果自動觸發不工作，可以手動呼叫：

```
使用者：請幫我審查剛才的程式碼

或者使用 Command：
使用者：/code-review
```

---

## 診斷工具和技巧

### 檢查 Agent 載入狀態

查看 Claude Code 是否正確載入了所有 Agent：

```bash
# 查看 Claude Code 日誌（如果可用）
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### 手動測試 Agent

在 Claude Code 中手動測試 Agent 呼叫：

```
使用者：請呼叫 planner agent 幫我規劃一個新功能

# 觀察 Agent 是否被正確呼叫
# 查看輸出是否符合預期
```

### 驗證 Front Matter 格式

使用 Python 驗證所有 Agent 的 Front Matter：

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extract front matter (between ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Check required fields
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

儲存為 `validate-agents.sh`，執行：

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## 檢查點 ✅

按以下清單逐一檢查：

- [ ] Agent 檔案在正確位置（`~/.claude/agents/` 或 `.claude/agents/`）
- [ ] Command 檔案在正確位置（`~/.claude/commands/` 或 `.claude/commands/`）
- [ ] Agent Front Matter 格式正確（包含 name、description、tools）
- [ ] Tools 欄位使用正確的工具名稱（區分大小寫）
- [ ] Command 的 `invokes` 欄位與 Agent 檔案名稱匹配
- [ ] 外掛在 `~/.claude/settings.json` 中正確啟用
- [ ] 任務描述清晰、具體
- [ ] 選擇了合適的 Agent 處理任務

---

## 何時需要幫助

如果以上方法都無法解決問題：

1. **收集診斷資訊**：
   ```bash
   # 輸出以下資訊
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **查看 GitHub Issues**：
   - 造訪 [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - 搜尋相似問題

3. **提交 Issue**：
   - 包含完整的錯誤訊息
   - 提供作業系統和版本資訊
   - 附上相關 Agent 和 Command 檔案內容

---

## 本課小結

Agent 呼叫失敗通常有以下幾類原因：

| 問題類型 | 常見原因 | 快速排查 |
| --- | --- | --- |
| **完全不被呼叫** | Agent/Command 檔案路徑錯誤、外掛未載入 | 檢查檔案位置、驗證外掛設定 |
| **Agent not found** | 名稱不匹配（Command invokes vs 檔案名稱） | 驗證檔案名稱和 invokes 欄位 |
| **格式錯誤** | Front Matter 缺少欄位、YAML 語法錯誤 | 檢查必需欄位、驗證 YAML 格式 |
| **執行逾時** | 任務複雜度高、模型選擇不當 | 拆分任務、使用 opus 模型 |
| **輸出不符合預期** | 任務描述不清晰、缺少上下文、Agent 不匹配 | 提供具體任務、選擇正確的 Agent |
| **工具權限不足** | Tools 欄位缺少工具、名稱拼寫錯誤 | 檢查 tools 欄位、驗證工具名稱 |

記住：大多數問題都可以透過檢查檔案路徑、驗證 Front Matter 格式、選擇正確的 Agent 來解決。

---

## 下一課預告

> 下一課我們學習 **[效能最佳化技巧](../performance-tips/)**。
>
> 你會學到：
> - 如何最佳化 Token 使用
> - 提升 Claude Code 回應速度
> - 上下文視窗管理策略

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 外掛清單設定 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Agent 使用規則 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Front Matter 必需欄位**（所有 Agent 檔案）：
- `name`：Agent 識別符號（必須與檔案名稱匹配，不含 `.md` 副檔名）
- `description`：Agent 功能描述（包含觸發條件說明）
- `tools`：允許使用的工具清單（逗號分隔：`Read, Grep, Glob`）
- `model`：首選模型（`opus` 或 `sonnet`，可選）

**允許的工具名稱**（區分大小寫）：
- `Read`：讀取檔案內容
- `Write`：建立新檔案
- `Edit`：編輯現有檔案
- `Bash`：執行指令
- `Grep`：搜尋檔案內容
- `Glob`：查找檔案路徑

**關鍵設定路徑**：
- 使用者級 Agents：`~/.claude/agents/`
- 使用者級 Commands：`~/.claude/commands/`
- 使用者級 Settings：`~/.claude/settings.json`
- 專案級 Agents：`.claude/agents/`
- 專案級 Commands：`.claude/commands/`

**外掛載入設定**（`~/.claude/settings.json`）：
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
