---
title: "安裝：Agent Skills 外掛 | opencode-agent-skills"
sidebarTitle: "5 分鐘裝好外掛"
subtitle: "安裝：Agent Skills 外掛 | opencode-agent-skills"
description: "學習 opencode-agent-skills 的三種安裝方式。包括基本安裝、固定版本安裝和本地開發安裝，適用於不同使用場景。"
tags:
  - "安裝"
  - "外掛"
  - "快速開始"
prerequisite: []
order: 2
---

# 安裝 OpenCode Agent Skills

## 學完你能做什麼

- 用三種方式為 OpenCode 安裝 Agent Skills 外掛
- 驗證外掛是否正確安裝
- 理解固定版本和最新版本的區別

## 你現在的困境

你希望 AI Agent 學會複用技能，但不知道如何在 OpenCode 中啟用這個功能。OpenCode 的外掛系統看起來有點複雜，你擔心配置錯誤。

## 什麼時候用這一招

**你需要 AI Agent 具備以下能力時**：
- 在不同專案間複用技能（比如程式碼規範、測試範本）
- 載入 Claude Code 的技能庫
- 讓 AI 遵循特定工作流程

## 🎒 開始前的準備

::: warning 前置檢查

開始前，請確認：

- 已安裝 [OpenCode](https://opencode.ai/) v1.0.110 或更高版本
- 能夠存取 `~/.config/opencode/opencode.json` 設定檔（OpenCode 的設定檔）

:::

## 核心思路

OpenCode Agent Skills 是一個外掛，它透過 npm 發布，安裝方式很簡單：在設定檔中宣告外掛名，OpenCode 會在啟動時自動下載並載入。

**三種安裝方式的適用場景**：

| 方式 | 適用場景 | 優缺點 |
|--- | --- | ---|
| **基本安裝** | 每次啟動都使用最新版本 | ✅ 方便自動更新<br>❌ 可能遇到破壞性更新 |
| **固定版本** | 需要穩定的生產環境 | ✅ 版本可控<br>❌ 需要手動升級 |
| **本地開發** | 自訂外掛或貢獻程式碼 | ✅ 靈活修改<br>❌ 需要手動管理相依套件 |

---

## 跟我做

### 方式一：基本安裝（推薦）

這是最簡單的方式，每次 OpenCode 啟動時都會檢查並下載最新版本。

**為什麼**
適合大多數使用者，保證你總是使用最新功能和 bug 修正。

**步驟**

1. 開啟 OpenCode 設定檔

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (使用記事本)
notepad %APPDATA%\opencode\opencode.json
```

2. 在設定檔中新增外掛名

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

如果檔案中已有其他外掛，在 `plugin` 陣列中新增即可：

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. 儲存檔案並重新啟動 OpenCode

**你應該看到**：
- OpenCode 重新啟動，在啟動日誌中看到外掛載入成功
- 在 AI 對話中可以使用 `get_available_skills` 等工具

### 方式二：固定版本安裝（適合生產環境）

如果你希望鎖定外掛版本，避免自動更新帶來的意外，使用這種方式。

**為什麼**
生產環境通常需要版本控制，固定版本可以確保團隊使用相同的外掛版本。

**步驟**

1. 開啟 OpenCode 設定檔

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. 在設定檔中新增帶版本號的外掛名

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. 儲存檔案並重新啟動 OpenCode

**你應該看到**：
- OpenCode 使用固定版本 v0.6.4 啟動
- 外掛快取到本機，無需每次下載

::: tip 版本管理

固定版本的外掛會快取到 OpenCode 本機，升級版本時需要手動修改版本號並重新啟動。查看 [最新版本](https://www.npmjs.com/package/opencode-agent-skills) 更新。

:::

### 方式三：本地開發安裝（面向貢獻者）

如果你想自訂外掛或參與開發，使用這種方式。

**為什麼**
開發過程中可以立即看到程式碼修改效果，無需等待 npm 發布。

**步驟**

1. 克隆儲存庫到 OpenCode 設定目錄

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. 進入專案目錄並安裝相依套件

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info 為什麼用 Bun

專案使用 Bun 作為執行環境和套件管理器，根據 package.json 的 `engines` 欄位，要求 Bun >= 1.0.0。

:::

3. 建立外掛符號連結

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**你應該看到**：
- `~/.config/opencode/plugin/skills.ts` 指向你的本機外掛程式碼
- 修改程式碼後重新啟動 OpenCode 即可生效

---

## 檢查點 ✅

完成安裝後，用以下方式驗證：

**方法 1：查看工具列表**

在 OpenCode 中詢問 AI：

```
請列出所有可用的工具，看看有沒有技能相關的工具？
```

你應該看到包含以下工具：
- `use_skill` - 載入技能
- `read_skill_file` - 讀取技能檔案
- `run_skill_script` - 執行技能腳本
- `get_available_skills` - 取得可用技能列表

**方法 2：呼叫工具**

```
請呼叫 get_available_skills 查看目前有哪些技能可用？
```

你應該看到技能列表（可能為空，但工具呼叫成功）。

**方法 3：查看啟動日誌**

檢查 OpenCode 的啟動日誌，應該有類似：

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## 踩坑提醒

### 問題 1：OpenCode 啟動後工具未出現

**可能原因**：
- 設定檔 JSON 格式錯誤（缺少逗號、引號等）
- OpenCode 版本過低（需要 >= v1.0.110）
- 外掛名稱拼寫錯誤

**解決方法**：
1. 用 JSON 驗證工具檢查設定檔語法
2. 執行 `opencode --version` 確認版本
3. 確認外掛名是 `opencode-agent-skills`（注意連字號）

### 問題 2：固定版本升級後沒生效

**原因**：固定版本外掛會快取到本機，更新版本號後需要清除快取。

**解決方法**：
1. 修改設定檔中的版本號
2. 重新啟動 OpenCode
3. 如果仍然沒生效，清除 OpenCode 外掛快取（位置取決於你的系統）

### 問題 3：本地開發安裝後修改不生效

**原因**：符號連結錯誤或 Bun 相依套件未安裝。

**解決方法**：
1. 檢查符號連結是否正確：
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   應該指向 `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. 確認相依套件已安裝：
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## 本課小結

本課學習了三種安裝方式：

- **基本安裝**：在設定檔中新增 `opencode-agent-skills`，適合大多數人
- **固定版本安裝**：新增 `opencode-agent-skills@版本號`，適合生產環境
- **本地開發安裝**：克隆儲存庫並建立符號連結，適合開發者

安裝後可以透過工具列表、工具呼叫或啟動日誌驗證。

---

## 下一課預告

> 下一課我們學習 **[建立你的第一個技能](../creating-your-first-skill/)**。
>
> 你會學到：
> - 技能目錄結構
> - SKILL.md 的 YAML frontmatter 格式
> - 如何編寫技能內容

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| 外掛入口定義 | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18)         | 18      |
| 外掛主檔案 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts)         | 全檔案  |
| 相依套件配置    | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32   |
| 版本要求    | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41   |

**關鍵設定**：
- `main: "src/plugin.ts"`：外掛入口檔案
- `engines.bun: ">=1.0.0"`：執行環境版本要求

**關鍵相依套件**：
- `@opencode-ai/plugin ^1.0.115`：OpenCode 外掛 SDK
- `@huggingface/transformers ^3.8.1`：語義匹配模型
- `zod ^4.1.13`：Schema 驗證
- `yaml ^2.8.2`：YAML 解析

</details>
