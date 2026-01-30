---
title: "Superpowers 整合：設定工作流 | opencode-agent-skills"
subtitle: "Superpowers 整合：設定工作流 | opencode-agent-skills"
sidebarTitle: "啟用 Superpowers"
description: "學習 Superpowers 模式的安裝和設定方法。透過環境變數啟用工作流指導，掌握工具對應和命名空間優先規則。"
tags:
  - "進階設定"
  - "工作流"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Superpowers 工作流整合

## 學完你能做什麼

- 了解 Superpowers 工作流的價值和適用場景
- 正確安裝和設定 Superpowers 模式
- 理解工具對應和技能命名空間系統
- 掌握壓縮恢復時 Superpowers 的自動注入機制

## 你現在的困境

你可能在考慮這些問題：

- **工作流不夠規範**：團隊成員的開發習慣不統一，程式碼品質參差不齊
- **缺少嚴格流程**：雖然有技能庫，但 AI 助手沒有明確的流程指導
- **工具呼叫混亂**：Superpowers 定義的工具與 OpenCode 的原生工具名稱不同，導致呼叫失敗
- **遷移成本高**：已經在使用 Superpowers，擔心切換到 OpenCode 後需要重新設定

這些問題都會影響開發效率和程式碼品質。

## 核心思路

::: info 什麼是 Superpowers？
Superpowers 是一個完整的軟體開發工作流框架，透過組合式技能提供嚴格的工作流程指導。它定義了規範的開發步驟、工具呼叫方式和命名空間系統。
:::

**OpenCode Agent Skills 提供了無縫的 Superpowers 整合**，透過環境變數啟用後，會自動注入完整的工作流指導，包括：

1. **using-superpowers 技能內容**：Superpowers 核心工作流指令
2. **工具對應**：將 Superpowers 定義的工具名對應到 OpenCode 原生工具
3. **技能命名空間**：明確技能的優先順序和引用方式

## 🎒 開始前的準備

在開始之前，請確保：

::: warning 前置檢查
- ✅ 已安裝 [opencode-agent-skills 外掛](../../start/installation/)
- ✅ 熟悉基本的技能發現機制
:::

## 跟我做

### 第 1 步：安裝 Superpowers

**為什麼**
需要先安裝 Superpowers 專案，本外掛才能發現 `using-superpowers` 技能。

**操作方式**

根據你的需求，選擇以下任一方式安裝 Superpowers：

::: code-group

```bash [作為 Claude Code 外掛]
// 按照 Superpowers 官方文件安裝
// https://github.com/obra/superpowers
// 技能會自動位於 ~/.claude/plugins/...
```

```bash [作為 OpenCode 技能]
// 手動安裝為 OpenCode 技能
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// 技能會位於 .opencode/skills/superpowers/ (專案級) 或 ~/.config/opencode/skills/superpowers/ (使用者級)
```

:::

**你應該看到**：
- 安裝後，Superpowers 的技能目錄包含 `using-superpowers/SKILL.md` 檔案

### 第 2 步：啟用 Superpowers 模式

**為什麼**
透過環境變數告訴外掛啟用 Superpowers 模式，外掛會在會話初始化時自動注入相關內容。

**操作方式**

臨時啟用（僅當前終端機會話）：

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

永久啟用（新增到 Shell 設定檔）：

::: code-group

```bash [Bash (~/.bashrc 或 ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**你應該看到**：
- 輸入 `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 顯示 `true`

### 第 3 步：驗證自動注入

**為什麼**
確認外掛正確識別 Superpowers 技能，並在新會話開始時自動注入內容。

**操作方式**

1. 重啟 OpenCode
2. 建立一個新會話
3. 在新會話中輸入任何訊息（如「你好」）
4. 檢視會話上下文（如果 OpenCode 支援）

**你應該看到**：
- 外掛在背景自動注入了以下內容（格式化為 XML）：

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[using-superpowers 技能的實際內容...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## 檢查點 ✅

完成上述步驟後，驗證以下內容：

| 檢查項 | 預期結果 |
| --- | --- |
| 環境變數設定正確 | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 輸出 `true` |
| Superpowers 技能可發現 | 呼叫 `get_available_skills()` 能看到 `using-superpowers` |
| 新會話自動注入 | 建立新會話後，AI 知道自己有 superpowers |

## 踩坑提醒

### ❌ 錯誤 1：技能未被發現

**現象**：啟用了環境變數，但外掛沒有注入 Superpowers 內容。

**原因**：Superpowers 安裝位置不在技能發現路徑中。

**解決方案**：
- 確認 Superpowers 安裝在以下任一位置：
  - `.claude/plugins/...` （Claude Code 外掛快取）
  - `.opencode/skills/...` （OpenCode 技能目錄）
  - `~/.config/opencode/skills/...` （OpenCode 使用者技能）
  - `~/.claude/skills/...` （Claude 使用者技能）
- 執行 `get_available_skills()` 驗證 `using-superpowers` 是否在列表中

### ❌ 錯誤 2：工具呼叫失敗

**現象**：AI 嘗試呼叫 `TodoWrite` 或 `Skill` 工具，提示工具不存在。

**原因**：AI 沒有應用工具對應，仍在使用 Superpowers 定義的名稱。

**解決方案**：
- 外掛會自動注入工具對應，確保 `<EXTREMELY_IMPORTANT>` 標籤被正確注入
- 如果問題持續，檢查會話是否在啟用環境變數後建立

### ❌ 錯誤 3：壓縮後 Superpowers 消失

**現象**：長時間會話後，AI 不再遵循 Superpowers 工作流。

**原因**：上下文壓縮導致之前的注入內容被清理。

**解決方案**：
- 外掛會在 `session.compacted` 事件後自動重新注入 Superpowers 內容
- 如果問題持續，檢查外掛是否正常監聽事件

## 工具對應詳解

外掛會自動注入以下工具對應，幫助 AI 正確呼叫 OpenCode 工具：

| Superpowers 工具 | OpenCode 工具 | 說明 |
| --- | --- | --- |
| `TodoWrite` | `todowrite` | Todo 寫入工具 |
| `Task` (帶 subagents) | `task` + `subagent_type` | 子代理呼叫 |
| `Skill` | `use_skill` | 載入技能 |
| `Read` / `Write` / `Edit` | 原生小寫工具 | 檔案操作 |
| `Bash` / `Glob` / `Grep` / `WebFetch` | 原生小寫工具 | 系統操作 |

::: tip 為什麼需要工具對應？
Superpowers 原生設計基於 Claude Code，工具名稱與 OpenCode 不一致。透過自動對應，AI 可以無縫使用 OpenCode 的原生工具，無需手動轉換。
:::

## 技能命名空間優先順序

當多個來源存在同名技能時，外掛按以下優先順序選擇：

```
1. project:skill-name         (專案級 OpenCode 技能)
2. claude-project:skill-name  (專案級 Claude 技能)
3. skill-name                (使用者級 OpenCode 技能)
4. claude-user:skill-name    (使用者級 Claude 技能)
5. claude-plugins:skill-name  (外掛市場技能)
```

::: info 命名空間引用
你可以顯式指定命名空間：`use_skill("project:my-skill")`  
或者讓外掛自動對應：`use_skill("my-skill")`
:::

**第一個發現的匹配生效**，後續同名技能被忽略。這允許專案級技能覆蓋使用者級技能。

## 壓縮恢復機制

長時間會話中，OpenCode 會執行上下文壓縮以節省 token。外掛透過以下機制確保 Superpowers 持續可用：

1. **監聽事件**：外掛監聽 `session.compacted` 事件
2. **重新注入**：壓縮完成後，自動重新注入 Superpowers 內容
3. **無感切換**：AI 的工作流指導始終存在，不會因壓縮而中斷

## 本課小結

Superpowers 整合提供了嚴格的工作流指導，核心要點：

- **安裝 Superpowers**：選擇 Claude Code 外掛或 OpenCode 技能任一方式
- **啟用環境變數**：設定 `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **自動注入**：外掛在會話初始化和壓縮後自動注入內容
- **工具對應**：自動將 Superpowers 工具名對應到 OpenCode 原生工具
- **命名空間優先順序**：專案級技能優先於使用者級技能

## 下一課預告

> 下一課我們學習 **[命名空間與技能優先順序](../namespaces-and-priority/)**。
>
> 你會學到：
> - 理解技能的命名空間系統和發現優先順序規則
> - 掌握如何使用命名空間明確指定技能來源
> - 了解同名技能的覆蓋和衝突處理機制

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Superpowers 整合模組 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| 工具對應定義 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| 技能命名空間定義 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Superpowers 內容注入函式 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| 環境變數檢查 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| 會話初始化注入呼叫 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| 壓縮後重新注入 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**關鍵常數**：
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`：環境變數，設定為 `'true'` 啟用 Superpowers 模式

**關鍵函式**：
- `maybeInjectSuperpowersBootstrap()`：檢查環境變數和技能存在性，注入 Superpowers 內容
- `discoverAllSkills()`：發現所有可用技能（用於查找 `using-superpowers`）
- `injectSyntheticContent()`：將內容以 synthetic 訊息形式注入會話

</details>
