---
title: "貢獻指南：提交配置 | Everything Claude Code"
sidebarTitle: "提交你的第一個配置"
subtitle: "貢獻指南：提交配置"
description: "學習向 Everything Claude Code 提交配置的標準流程。掌握 Fork 專案、建立分支、遵循格式、本機測試和提交 PR 的步驟，成為貢獻者。"
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# 貢獻指南：如何向專案貢獻配置、agent 和 skill

## 學完你能做什麼

- 理解專案的貢獻流程和規範
- 正確提交 Agents、Skills、Commands、Hooks、Rules 和 MCP 配置
- 遵循程式碼風格和命名規範
- 避免常見的貢獻錯誤
- 透過 Pull Request 高效地與社群協作

## 你現在的困境

你想為 Everything Claude Code 做貢獻，但遇到這些問題：
- "不知道貢獻什麼內容才有價值"
- "不知道怎麼開始第一個 PR"
- "不清楚檔案格式和命名規範"
- "擔心提交的內容不滿足要求"

本教程會給你一份完整的貢獻指南，從理念到實作。

## 核心思路

Everything Claude Code 是一個**社群資源**，不是一個人的專案。這個儲存庫的價值在於：

1. **實戰驗證** - 所有配置都經過 10+ 個月的生產環境使用
2. **模組化設計** - 每個 Agent、Skill、Command 都是獨立可重複使用的元件
3. **品質優先** - 程式碼審查和安全性稽核確保貢獻品質
4. **開放協作** - MIT 授權，鼓勵貢獻和客製化

::: tip 為什麼貢獻有價值
- **知識分享**：你的經驗可以幫助其他開發者
- **影響力**：被數百/數千人使用的配置
- **技能提升**：學習專案結構和社群協作
- **網路建設**：與 Anthropic 和 Claude Code 社群連接
:::

## 我們在尋找什麼

### Agents

專業化子代理，處理特定領域的複雜任務：

| 類型 | 範例 |
|--- | ---|
| 語言專家 | Python, Go, Rust 程式碼審查 |
| 框架專家 | Django, Rails, Laravel, Spring |
| DevOps 專家 | Kubernetes, Terraform, CI/CD |
| 領域專家 | ML pipelines, data engineering, mobile |

### Skills

工作流程定義和領域知識庫：

| 類型 | 範例 |
|--- | ---|
| 語言最佳實務 | Python, Go, Rust 編碼規範 |
| 框架模式 | Django, Rails, Laravel 架構模式 |
| 測試策略 | 單元測試、整合測試、E2E 測試 |
| 架構指南 | 微服務、事件驅動、CQRS |
| 領域知識 | ML、資料分析、行動開發 |

### Commands

斜線命令，提供快速工作流程入口：

| 類型 | 範例 |
|--- | ---|
| 部署命令 | 部署到 Vercel, Railway, AWS |
| 測試命令 | 執行單元測試、E2E 測試、覆蓋率分析 |
| 文件命令 | 產生 API 文件、更新 README |
| 程式碼產生命令 | 產生型別、產生 CRUD 範本 |

### Hooks

自動化掛鉤，在特定事件時觸發：

| 類型 | 範例 |
|--- | ---|
| Linting/formatting | 程式碼格式化、lint 檢查 |
| 安全性檢查 | 敏感資料偵測、漏洞掃描 |
| 驗證掛鉤 | Git commit 驗證、PR 檢查 |
| 通知掛鉤 | Slack/Email 通知 |

### Rules

強制性規則，確保程式碼品質和安全標準：

| 類型 | 範例 |
|--- | ---|
| 安全性規則 | 禁止硬編碼金鑰、OWASP 檢查 |
| 程式碼風格 | 不可變模式、檔案大小限制 |
| 測試要求 | 80%+ 覆蓋率、TDD 流程 |
| 命名規範 | 變數命名、檔案命名 |

### MCP Configurations

MCP 伺服器配置，擴展外部服務整合：

| 類型 | 範例 |
|--- | ---|
| 資料庫整合 | PostgreSQL, MongoDB, ClickHouse |
| 雲端提供商 | AWS, GCP, Azure |
| 監控工具 | Datadog, New Relic, Sentry |
| 通訊工具 | Slack, Discord, Email |

## 如何貢獻

### 第 1 步：Fork 專案

**為什麼**：你需要自己的複本來進行修改，不影響原始儲存庫。

```bash
# 1. 存取 https://github.com/affaan-m/everything-claude-code
# 2. 點擊右上角 "Fork" 按鈕
# 3. Clone 你的 fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. 新增上游儲存庫（方便後續同步）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**你應該看到**：本機 `everything-claude-code` 目錄，包含完整的專案檔案。

### 第 2 步：建立功能分支

**為什麼**：分支隔離你的修改，方便管理和合併。

```bash
# 建立描述性分支名稱
git checkout -b add-python-reviewer

# 或使用更具體的命名
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**分支命名規範**：
- `feature/` - 新功能
- `fix/` - Bug 修復
- `docs/` - 文件更新
- `refactor/` - 程式碼重構

### 第 3 步：新增你的貢獻

**為什麼**：將檔案放在正確的目錄，確保 Claude Code 能正確載入。

```bash
# 根據貢獻類型選擇目錄
agents/           # 新的 Agent
skills/           # 新的 Skill（可以是單個 .md 或目錄）
commands/         # 新的斜線命令
rules/            # 新的規則檔案
hooks/            # Hook 配置（修改 hooks/hooks.json）
mcp-configs/      # MCP 伺服器配置（修改 mcp-configs/mcp-servers.json）
```

::: tip 目錄結構
- **單個檔案**：直接放在目錄下，如 `agents/python-reviewer.md`
- **複雜元件**：建立子目錄，如 `skills/coding-standards/`（包含多個檔案）
:::

### 第 4 步：遵循格式規範

#### Agent 格式

**為什麼**：Front Matter 定義了 Agent 的元資料，Claude Code 依賴這些資訊載入 Agent。

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**必填欄位**：
- `name`: Agent 識別碼（小寫連字號）
- `description`: 功能描述
- `tools`: 允許使用的工具列表（逗號分隔）
- `model`: 首選模型（`opus` 或 `sonnet`）

#### Skill 格式

**為什麼**：清晰的 Skill 定義更容易被重複使用和理解。

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**推薦章節**：
- `When to Use`: 使用場景
- `How It Works`: 工作原理
- `Examples`: 範例（Good vs Bad）
- `References`: 相關資源（可選）

#### Command 格式

**為什麼**：清晰的命令描述幫助使用者理解功能。

Front Matter（必填）：

```markdown
---
description: Run Python tests with coverage report
---
```

正文內容（可選）：

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

命令範例（可選）：

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**必填欄位**：
- `description`: 簡短的功能描述

#### Hook 格式

**為什麼**：Hook 需要明確的匹配規則和執行動作。

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**必填欄位**：
- `matcher`: 觸發條件運算式
- `hooks`: 執行的動作陣列
- `description`: Hook 功能描述

### 第 5 步：測試你的貢獻

**為什麼**：確保配置在實際使用中能正常運作。

::: warning 重要
在提交 PR 前，**務必**在你的本機環境測試配置。
:::

**測試步驟**：

```bash
# 1. 複製到你的 Claude Code 配置
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. 在 Claude Code 中測試
# 啟動 Claude Code 並使用新配置

# 3. 驗證功能
# - Agent 能否被正確呼叫？
# - Command 能否正確執行？
# - Hook 能否在正確時機觸發？
```

**你應該看到**：配置在 Claude Code 中正常運作，無錯誤或異常。

### 第 6 步：提交 PR

**為什麼**：Pull Request 是社群協作的標準方式。

```bash
# 新增所有變更
git add .

# 提交（使用清晰的提交訊息）
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# 推送到你的 fork
git push origin add-python-reviewer
```

**然後在 GitHub 上建立 PR**：

1. 存取你的 fork 儲存庫
2. 點擊 "Compare & pull request"
3. 填寫 PR 範本：

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**你應該看到**：PR 建立成功，等待維護者審核。

## 指導原則

### Do（應該做）

✅ **保持配置專注和模組化**
- 每個 Agent/Skill 只做一件事
- 避免功能混合

✅ **包含清晰的描述**
- Front Matter 描述準確
- 程式碼註解有幫助

✅ **提交前測試**
- 在本機驗證配置
- 確保沒有錯誤

✅ **遵循現有模式**
- 參考現有檔案的格式
- 保持程式碼風格一致

✅ **文件化依賴關係**
- 列出外部依賴
- 說明安裝要求

### Don't（不應該做）

❌ **包含敏感資料**
- API keys, tokens
- 硬編碼路徑
- 個人憑證

❌ **新增過於複雜或小眾的配置**
- 通用性優先
- 避免過度設計

❌ **提交未經測試的配置**
- 測試是必須的
- 提供測試步驟

❌ **建立重複功能**
- 搜尋現有配置
- 避免重複造輪子

❌ **新增依賴特定付費服務的配置**
- 提供免費替代方案
- 或使用開源工具

## 檔案命名規範

**為什麼**：統一的命名規範使專案更易維護。

### 命名規則

| 規則 | 範例 |
|--- | ---|
| 使用小寫 | `python-reviewer.md` |
| 使用連字號分隔 | `tdd-workflow.md` |
| 描述性命名 | `django-pattern-skill.md` |
| 避免模糊名稱 | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### 匹配原則

檔案名稱應該與 Agent/Skill/Command 名稱保持一致：

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip 命名技巧
- 使用業界術語（如 "PEP 8", "TDD", "REST"）
- 避免縮寫（除非是標準縮寫）
- 保持簡潔但描述性
:::

## 貢獻流程檢查清單

在提交 PR 前，確保滿足以下條件：

### 程式碼品質
- [ ] 遵循現有程式碼風格
- [ ] 包含必要的 Front Matter
- [ ] 有清晰的描述和文件
- [ ] 在本機測試通過

### 檔案規範
- [ ] 檔案名稱符合命名規範
- [ ] 檔案放在正確的目錄
- [ ] JSON 格式正確（如有）
- [ ] 無敏感資料

### PR 品質
- [ ] PR 標題清晰描述變動
- [ ] PR 描述包含 "What", "Why", "How"
- [ ] 鏈結相關 issue（如有）
- [ ] 提供測試步驟

### 社群規範
- [ ] 確保沒有重複功能
- [ ] 提供替代方案（如涉及付費服務）
- [ ] 回應 review 意見
- [ ] 保持友善和建設性的討論

## 常見問題

### Q: 如何知道貢獻什麼有價值？

**A**: 從你自己的需求開始：
- 你最近遇到過什麼問題？
- 你使用了什麼解決方案？
- 這個方案是否可以重複使用？

也可以查看專案 Issues：
- 未解決的 feature requests
- Enhancement suggestions
- Bug reports

### Q: 貢獻會被拒絕嗎？

**A**: 可能，但這是正常的。常見原因：
- 功能已存在
- 配置不符合規範
- 缺少測試
- 安全性或隱私問題

維護者會提供詳細的回饋，你可以根據回饋修改後重新提交。

### Q: 如何追蹤 PR 狀態？

**A**: 
1. 在 GitHub PR 頁面查看狀態
2. 關注 review comments
3. 回應維護者的回饋
4. 根據需要更新 PR

### Q: 可以貢獻 Bug 修復嗎？

**A**: 當然可以！Bug 修復是最有價值的貢獻之一：
1. 在 Issues 中搜尋或建立新 issue
2. Fork 專案並修復 Bug
3. 新增測試（如果需要）
4. 提交 PR，在描述中引用 issue

### Q: 如何保持 fork 與上游同步？

**A**:

```bash
# 1. 新增上游儲存庫（如果還沒有）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. 取得上游更新
git fetch upstream

# 3. 合併上游更新到你的 main 分支
git checkout main
git merge upstream/main

# 4. 將更新推送到你的 fork
git push origin main

# 5. 重新基於最新的 main 分支
git checkout your-feature-branch
git rebase main
```

## 聯絡方式

如果你有任何問題或需要協助：

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: 透過 GitHub 聯絡

::: tip 提問建議
- 先搜尋現有 Issues 和 Discussions
- 提供清晰的上下文和重現步驟
- 保持禮貌和建設性
:::

## 本課小結

本課系統講解了 Everything Claude Code 的貢獻流程和規範：

**核心理念**：
- 社群資源，共同建設
- 實戰驗證，品質優先
- 模組化設計，易於重複使用
- 開放協作，知識分享

**貢獻類型**：
- **Agents**: 專業化子代理（語言、框架、DevOps、領域專家）
- **Skills**: 工作流程定義和領域知識庫
- **Commands**: 斜線命令（部署、測試、文件、程式碼產生）
- **Hooks**: 自動化掛鉤（linting、安全性檢查、驗證、通知）
- **Rules**: 強制性規則（安全性、程式碼風格、測試、命名）
- **MCP Configurations**: MCP 伺服器配置（資料庫、雲端、監控、通訊）

**貢獻流程**：
1. Fork 專案
2. 建立功能分支
3. 新增貢獻內容
4. 遵循格式規範
5. 本機測試
6. 提交 PR

**格式規範**：
- Agent: Front Matter + 描述 + 指令
- Skill: When to Use + How It Works + Examples
- Command: Description + 使用範例
- Hook: Matcher + Hooks + Description

**指導原則**：
- **Do**: 專注、清晰、測試、遵循模式、文件化
- **Don't**: 敏感資料、複雜小眾、未測試、重複、付費依賴

**檔案命名**：
- 小寫 + 連字號
- 描述性命名
- 與 Agent/Skill/Command 名稱一致

**檢查清單**：
- 程式碼品質、檔案規範、PR 品質、社群規範

## 下一課預告

> 下一課我們學習 **[範例配置：專案級與使用者級配置](../examples/)**。
>
> 你會學到：
> - 專案級配置的最佳實務
> - 使用者級配置的個性化設定
> - 如何自訂配置適應特定專案
> - 實際專案的配置範例

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能          | 檔案路徑                                                                                     | 行號  |
|--- | --- | ---|
| 貢獻指南      | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)           | 1-192 |
| Agent 範例    | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | -     |
| Skill 範例    | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | -     |
| Command 範例  | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)           | -     |
| Hook 配置     | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)     | 1-158 |
| Rule 範例     | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | -     |
| MCP 配置範例  | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| 範例配置      | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | -     |

**關鍵 Front Matter 欄位**：
- `name`: Agent/Skill/Command 識別碼
- `description`: 功能描述
- `tools`: 允許使用的工具（Agent）
- `model`: 首選模型（Agent，可選）

**關鍵目錄結構**：
- `agents/`: 9 個專業化子代理
- `skills/`: 11 個工作流程定義
- `commands/`: 14 個斜線命令
- `rules/`: 8 套規則集
- `hooks/`: 自動化掛鉤配置
- `mcp-configs/`: MCP 伺服器配置
- `examples/`: 範例配置檔案

**貢獻相關鏈結**：
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
