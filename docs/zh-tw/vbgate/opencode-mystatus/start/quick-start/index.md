---
title: "快速開始: 一鍵查詢 AI 額度 | opencode-mystatus"
sidebarTitle: "快速開始"
subtitle: "快速開始：一鍵查詢所有 AI 平台額度"
description: "學習在 5 分鐘內安裝 opencode-mystatus 外掛，一鍵查詢所有 AI 平台額度。支援三種安裝方式，涵蓋 OpenAI、智證 AI、GitHub Copilot、Google Cloud 等平台。"
tags:
  - "快速開始"
  - "安裝"
  - "配置"
order: 1
---

# 快速開始：一鍵查詢所有 AI 平台額度

## 學完你能做什麼

- 在 5 分鐘內完成 opencode-mystatus 外掛安裝
- 配置斜線指令 `/mystatus`
- 驗證安裝成功，查詢第一個 AI 平台額度

## 你現在的困境

你在使用多個 AI 平台開發（OpenAI、智證 AI、GitHub Copilot、Google Cloud 等），每天都需要頻繁檢查各平台剩餘額度。每次都要逐個登入各平台查看，太浪費時間了。

## 什麼時候用這一招

- **剛接觸 OpenCode 時**：作為新手，第一個安裝的外掛
- **需要多平台額度管理時**：同時使用 OpenAI、智證 AI、GitHub Copilot 等多個平台
- **團隊協作場景**：團隊成員共用多個 AI 帳號，需要統一查看額度

## 🎒 開始前的準備

在開始之前，請確認你已經：

::: info 前置條件

- [ ] 已安裝 [OpenCode](https://opencode.ai)
- [ ] 已配置至少一個 AI 平台的認證資訊（OpenAI、智證 AI、Z.ai、GitHub Copilot 或 Google Cloud）

:::

如果你還沒有配置任何 AI 平台，建議先在 OpenCode 中完成至少一個平台的登入，然後再安裝此外掛。

## 核心思路

opencode-mystatus 是一個 OpenCode 外掛，它的核心價值是：

1. **自動讀取認證檔案**：從 OpenCode 的官方認證儲存中讀取所有已配置的帳號資訊
2. **並行查詢各平台**：同時呼叫 OpenAI、智證 AI、Z.ai、GitHub Copilot 和 Google Cloud 的官方 API
3. **可視化展示**：用進度條和倒數計時直觀顯示剩餘額度

安裝流程很簡單：
1. 在 OpenCode 配置檔中新增外掛和斜線指令
2. 重新啟動 OpenCode
3. 輸入 `/mystatus` 查詢額度

## 跟我做

### 第 1 步：選擇安裝方式

opencode-mystatus 提供三種安裝方式，根據你的習慣選擇一種即可：

::: code-group

```bash [讓 AI 幫你安裝（推薦）]
將以下內容貼上到任意 AI 代理（Claude Code、OpenCode、Cursor 等）：

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [手動安裝]
開啟 ~/.config/opencode/opencode.json，按第 2 步編輯配置
```

```bash [從本地檔案安裝]
複製外掛檔案到 ~/.config/opencode/plugin/ 目錄（詳見第 4 步）
```

:::

**為什麼推薦讓 AI 安裝**：AI 代理會自動執行所有配置步驟，你只需要確認即可，最快最省事。

---

### 第 2 步：手動安裝配置（手動安裝必選）

如果你選擇手動安裝，需要編輯 OpenCode 配置檔案。

#### 2.1 開啟配置檔案

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 新增外掛和斜線指令

在配置檔案中新增以下內容（保持原有的 `plugin` 和 `command` 配置，追加新的配置項）：

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool to query quota usage. Return result as-is without modification."
    }
  }
}
```

**為什麼這樣配置**：

| 配置項        | 值                                      | 作用                                 |
| ------------- | --------------------------------------- | ------------------------------------ |
| `plugin` 陣列 | `["opencode-mystatus"]`                 | 告訴 OpenCode 載入這個外掛           |
| `description` | "Query quota usage for all AI accounts" | 斜線指令清單中顯示的說明             |
| `template`    | "Use mystatus tool..."              | 提示 OpenCode 如何呼叫 mystatus 工具 |

**你應該看到**：配置檔案包含完整的 `plugin` 和 `command` 欄位，格式正確（注意 JSON 的逗號和引號）。

---

### 第 3 步：從本地檔案安裝（本地安裝必選）

如果你選擇從本地檔案安裝，需要手動複製外掛檔案。

#### 3.1 複製外掛檔案

```bash
# 假設你已經複製了 opencode-mystatus 原始碼到 ~/opencode-mystatus/

# 複製主外掛和函式庫檔案
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# 複製斜線指令配置
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**為什麼需要複製這些檔案**：

- `mystatus.ts`：外掛主入口檔案，包含 mystatus 工具的定義
- `lib/` 目錄：包含 OpenAI、智證 AI、Z.ai、GitHub Copilot 和 Google Cloud 的查詢邏輯
- `mystatus.md`：斜線指令的配置描述

**你應該看到**：`~/.config/opencode/plugin/` 目錄下有 `mystatus.ts` 和 `lib/` 子目錄，`~/.config/opencode/command/` 目錄下有 `mystatus.md`。

---

### 第 4 步：重新啟動 OpenCode

無論你選擇哪種安裝方式，最後一步都是重新啟動 OpenCode。

**為什麼必須重新啟動**：OpenCode 只在啟動時讀取配置檔案，修改配置後需要重新啟動才能生效。

**你應該看到**：OpenCode 重新啟動後，可以正常使用。

---

### 第 5 步：驗證安裝

現在驗證安裝是否成功。

#### 5.1 測試斜線指令

在 OpenCode 中輸入：

```bash
/mystatus
```

**你應該看到**：

如果已配置至少一個 AI 平台的認證資訊，會看到類似這樣的輸出（以 OpenAI 為例）：

::: code-group

```markdown [中文系統輸出]
## OpenAI 帳號額度

Account:        user@example.com (team)

3小時限額
█████████████████████████ 剩餘 85%
重置: 2h 30m後
```

```markdown [英文系統輸出]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
█████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip 輸出語言說明
外掛會自動偵測你的系統語言（中文系統顯示中文，英文系統顯示英文），以上兩種輸出都是正確的。
:::

如果還沒有配置任何帳號，會看到：

::: code-group

```markdown [中文系統輸出]
未找到任何已配置的帳號。

支援的帳號類型:
- OpenAI (Plus/Team/Pro 訂閱使用者)
- 智證 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [英文系統輸出]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 理解輸出含義

| 元素（中文版本）          | 元素（英文版本）          | 含義                   |
| ------------------------- | ------------------------- | ---------------------- |
| `## OpenAI 帳號額度`      | `## OpenAI Account Quota` | 平台標題               |
| `user@example.com (team)` | `user@example.com (team)` | 帳號資訊（郵件或團隊） |
| `3小時限額`               | `3-hour limit`            | 限額類型（3 小時限額） |
| `剩餘 85%`                | `85% remaining`           | 剩餘百分比             |
| `重置: 2h 30m後`          | `Resets in: 2h 30m`       | 重置時間倒數計時         |

**為什麼 API Key 沒有完整顯示**：為了保護你的隱私，外掛會自動脫敏顯示（如 `9c89****AQVM`）。

## 檢查點 ✅

確認你已經完成以下步驟：

| 步驟          | 檢查方法                                | 預期結果                                |
| ------------- | --------------------------------------- | --------------------------------------- |
| 安裝外掛      | 查看 `~/.config/opencode/opencode.json` | `plugin` 陣列包含 `"opencode-mystatus"` |
| 配置斜線指令  | 查看同一檔案                            | `command` 物件包含 `mystatus` 配置      |
| 重新啟動 OpenCode | 查看 OpenCode 程序                      | 已重新啟動                              |
| 測試指令      | 輸入 `/mystatus`                        | 顯示額度資訊或"未找到任何已配置的帳號"  |

## 踩坑提醒

### 常見錯誤 1：JSON 格式錯誤

**現象**：OpenCode 啟動失敗，報錯提示 JSON 格式錯誤

**原因**：配置檔案中多了或少了逗號、引號

**解決方法**：

使用線上 JSON 驗證工具檢查格式，例如：

```json
// ❌ 錯誤：最後一項多了逗號
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool..."
    }
  }  // ← 這裡不應該有逗號
}

// ✅ 正確
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool..."
    }
  }
}
```

---

### 常見錯誤 2：忘記重新啟動 OpenCode

**現象**：配置完成後輸入 `/mystatus`，提示"未找到指令"

**原因**：OpenCode 沒有重新載入配置檔案

**解決方法**：

1. 完全退出 OpenCode（不是最小化）
2. 重新啟動 OpenCode
3. 再次嘗試 `/mystatus` 指令

---

### 常見錯誤 3：顯示"未找到任何已配置的帳號"

**現象**：執行 `/mystatus` 後顯示"未找到任何已配置的帳號"

**原因**：還沒有在 OpenCode 中登入任何 AI 平台

**解決方法**：

1. 在 OpenCode 中登入至少一個 AI 平台（OpenAI、智證 AI、Z.ai、GitHub Copilot 或 Google Cloud）
2. 認證資訊會自動儲存到 `~/.local/share/opencode/auth.json`
3. 重新執行 `/mystatus`

---

### 常見錯誤 4：Google Cloud 額度查詢失敗

**現象**：其他平台都能正常查詢，但 Google Cloud 顯示錯誤

**原因**：Google Cloud 需要額外的認證外掛

**解決方法**：

先安裝 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 外掛來完成 Google 帳號認證。

## 本課小結

本課完成了 opencode-mystatus 的安裝和初步驗證：

1. **三種安裝方式**：讓 AI 幫你安裝（推薦）、手動安裝、從本地檔案安裝
2. **配置檔案位置**：`~/.config/opencode/opencode.json`
3. **關鍵配置項**：
   - `plugin` 陣列：新增 `"opencode-mystatus"`
   - `command` 物件：配置 `mystatus` 斜線指令
4. **驗證方法**：重新啟動 OpenCode 後輸入 `/mystatus`
5. **自動讀取認證**：外掛自動從 `~/.local/share/opencode/auth.json` 讀取已配置的帳號資訊

安裝完成後，你可以在 OpenCode 中使用 `/mystatus` 指令或自然語言查詢所有 AI 平台的額度。

## 下一課預告

> 下一課我們學習 **[使用 mystatus：斜線指令和自然語言](/zh-tw/vbgate/opencode-mystatus/start/using-mystatus/)**。
>
> 你會學到：
> - 斜線指令 `/mystatus` 的詳細用法
> - 如何用自然語言觸發 mystatus 工具
> - 兩種觸發方式的區別和適用場景
> - 斜線指令的配置原理解析

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能              | 檔案路徑                                                                                           | 行號  |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----- |
| 外掛入口          | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 26-94 |
| mystatus 工具定義 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 29-33 |
| 讀取認證檔案      | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 35-46 |
| 並行查詢所有平台  | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 49-56 |
| 結果收集和彙總    | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 58-89 |
| 斜線指令配置      | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6   |

**關鍵常數**：
- 認證檔案路徑：`~/.local/share/opencode/auth.json`（`plugin/mystatus.ts:35`）

**關鍵函數**：
- `mystatus()`：mystatus 工具的主函數，讀取認證檔案並並行查詢所有平台（`plugin/mystatus.ts:29-33`）
- `collectResult()`：收集查詢結果到 results 和 errors 陣列（`plugin/mystatus.ts:100-116`）
- `queryOpenAIUsage()`：查詢 OpenAI 額度（`plugin/lib/openai.ts`）
- `queryZhipuUsage()`：查詢智證 AI 額度（`plugin/lib/zhipu.ts`）
- `queryZaiUsage()`：查詢 Z.ai 額度（`plugin/lib/zhipu.ts`）
- `queryGoogleUsage()`：查詢 Google Cloud 額度（`plugin/lib/google.ts`）
- `queryCopilotUsage()`：查詢 GitHub Copilot 額度（`plugin/lib/copilot.ts`）

**配置檔案格式**：
OpenCode 配置檔案 `~/.config/opencode/opencode.json` 中的外掛和斜線指令配置參考 [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安裝) 第 33-82 行。

</details>
