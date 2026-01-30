---
title: "快速安裝：5 分鐘完成外掛設定 | Antigravity Auth"
sidebarTitle: "5 分鐘跑起來"
subtitle: "Antigravity Auth 快速安裝：5 分鐘完成外掛設定"
description: "學習 Antigravity Auth 外掛的快速安裝。教你兩種安裝方式（AI 輔助/手動）、設定模型定義、Google OAuth 認證並驗證成功。"
tags:
  - "快速開始"
  - "安裝指南"
  - "OAuth"
  - "外掛設定"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth 快速安裝：5 分鐘完成外掛設定

Antigravity Auth 快速安裝讓你在 5 分鐘內完成 OpenCode 外掛設定，開始使用 Claude 和 Gemini 3 進階模型。本教學提供兩種安裝方式（AI 輔助/手動設定），涵蓋外掛安裝、OAuth 認證、模型定義和驗證步驟，確保你能快速上手。

## 學完你能做什麼

- ✅ 在 5 分鐘內完成 Antigravity Auth 外掛安裝
- ✅ 設定 Claude 和 Gemini 3 模型的存取權限
- ✅ 執行 Google OAuth 認證並驗證安裝成功

## 你現在的困境

想試試 Antigravity Auth 的強大功能（Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash），但不知道怎麼安裝外掛、設定模型，擔心一步走錯就卡住。

## 什麼時候用這一招

- 第一次使用 Antigravity Auth 外掛時
- 在新機器上安裝 OpenCode 時
- 需要重新設定外掛時

## 🎒 開始前的準備

::: warning 前置檢查

在開始之前，請確認：
- [ ] 已安裝 OpenCode CLI（`opencode` 指令可用）
- [ ] 有可用的 Google 帳號（用於 OAuth 認證）
- [ ] 已了解 Antigravity Auth 的基本概念（閱讀 [什麼是 Antigravity Auth？](/zh-tw/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/)）

:::

## 核心思路

Antigravity Auth 的安裝流程分為 4 步：

1. **安裝外掛** → 在 OpenCode 設定中啟用外掛
2. **OAuth 認證** → 使用 Google 帳號登入
3. **設定模型** → 新增 Claude/Gemini 模型定義
4. **驗證安裝** → 發起第一個請求測試

**重要提示**：設定檔路徑在不同系統上都是 `~/.config/opencode/opencode.json`（Windows 的 `~` 會自動解析為使用者目錄，如 `C:\Users\YourName`）。

## 跟我做

### 第 1 步：選擇安裝方式

Antigravity Auth 提供兩種安裝方式，任選其一即可。

::: tip 推薦方式

如果你使用 LLM Agent（如 Claude Code、Cursor、OpenCode），**推薦使用 AI 輔助安裝**，更快捷省心。

:::

**方式一：AI 輔助安裝（推薦）**

直接複製以下提示詞貼給任何 LLM Agent：

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**AI 會自動完成**：
- 編輯 `~/.config/opencode/opencode.json`
- 新增外掛設定
- 新增完整的模型定義
- 執行 `opencode auth login` 進行認證

**你應該看到**：AI 輸出「外掛安裝成功」或類似提示。

**方式二：手動安裝**

如果偏好手動控制，按以下步驟操作：

**第 1.1 步：新增外掛到設定檔**

編輯 `~/.config/opencode/opencode.json`（如果檔案不存在則建立）：

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta 版本**：如果想體驗最新功能，使用 `opencode-antigravity-auth@beta` 替代 `@latest`。

**你應該看到**：設定檔包含 `plugin` 欄位且值為陣列。

---

### 第 2 步：執行 Google OAuth 認證

在終端機執行：

```bash
opencode auth login
```

**系統會自動**：
1. 啟動本機 OAuth 伺服器（監聽 `localhost:51121`）
2. 開啟瀏覽器跳轉到 Google 授權頁面
3. 接收 OAuth 回呼並交換權杖
4. 自動取得 Google Cloud 專案 ID

**你需要做**：
1. 在瀏覽器中點擊「允許」授權存取
2. 如果是 WSL 或 Docker 環境，可能需要手動複製回呼 URL

**你應該看到**：

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip 多帳號支援

需要新增更多帳號以提升配額？再次執行 `opencode auth login` 即可。外掛支援最多 10 個帳號，並自動輪換負載平衡。

:::

---

### 第 3 步：設定模型定義

複製以下完整設定並追加到 `~/.config/opencode/opencode.json`（注意不要覆蓋已有的 `plugin` 欄位）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info 模型分類

- **Antigravity 配額**（Claude + Gemini 3）：`antigravity-gemini-*`、`antigravity-claude-*`
- **Gemini CLI 配額**（獨立）：`gemini-2.5-*`、`gemini-3-*-preview`

更多模型設定細節，參考 [可用模型完整列表](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/available-models/)。

:::

**你應該看到**：設定檔包含完整的 `provider.google.models` 定義，且 JSON 格式有效（無語法錯誤）。

---

### 第 4 步：驗證安裝

執行以下指令測試外掛是否正常運作：

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**你應該看到**：

```
正在使用: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: 你好！我是 Claude Sonnet 4.5 Thinking。
```

::: tip 檢查點 ✅

如果看到 AI 正常回覆，恭喜你！Antigravity Auth 外掛已成功安裝並設定完成。

:::

---

## 踩坑提醒

### 問題 1：OAuth 認證失敗

**症狀**：執行 `opencode auth login` 後出現錯誤提示，如 `invalid_grant` 或授權頁面無法開啟。

**原因**：Google 帳號密碼變更、安全事件、或回呼 URL 不完整。

**解決方案**：
1. 檢查瀏覽器是否正確開啟 Google 授權頁面
2. 如果是 WSL/Docker 環境，手動複製終端機中顯示的回呼 URL 到瀏覽器
3. 刪除 `~/.config/opencode/antigravity-accounts.json` 後重新認證

### 問題 2：模型未找到（400 錯誤）

**症狀**：執行請求時回傳 `400 Unknown name 'xxx'`。

**原因**：模型名稱拼寫錯誤或設定檔格式問題。

**解決方案**：
1. 檢查 `--model` 參數是否與設定檔中的 key 完全一致（區分大小寫）
2. 驗證 `opencode.json` 是否為有效的 JSON（使用 `cat ~/.config/opencode/opencode.json | jq` 檢查）
3. 確認 `provider.google.models` 欄位下有對應的模型定義

### 問題 3：設定檔路徑錯誤

**症狀**：提示「設定檔不存在」或修改無效。

**原因**：在不同系統上使用了錯誤的路徑。

**解決方案**：所有系統統一使用 `~/.config/opencode/opencode.json`，包括 Windows（`~` 自動解析為使用者目錄）。

| 系統 | 正確路徑 | 錯誤路徑 |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## 本課小結

本課我們完成了：
1. ✅ 兩種安裝方式（AI 輔助 / 手動設定）
2. ✅ Google OAuth 認證流程
3. ✅ 完整的模型設定（Claude + Gemini 3）
4. ✅ 安裝驗證和常見問題排查

**關鍵要點**：
- 設定檔統一路徑：`~/.config/opencode/opencode.json`
- OAuth 認證自動取得 Project ID，無需手動設定
- 支援多帳號，提升配額上限
- 使用 `variant` 參數控制 Thinking 模型的思考深度

## 下一課預告

> 下一課我們學習 **[首次認證：深入理解 OAuth 2.0 PKCE 流程](/zh-tw/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**。
>
> 你會學到：
> - OAuth 2.0 PKCE 的運作原理
> - 權杖重新整理機制
> - Project ID 自動解析過程
> - 帳號儲存格式

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| OAuth 授權 URL 產生 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| PKCE 金鑰對產生 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| 權杖交換 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Project ID 自動取得 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| 使用者資訊取得 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**關鍵常數**：
- `ANTIGRAVITY_CLIENT_ID`：OAuth 用戶端 ID（用於 Google 認證）
- `ANTIGRAVITY_REDIRECT_URI`：OAuth 回呼位址（固定為 `http://localhost:51121/oauth-callback`）
- `ANTIGRAVITY_SCOPES`：OAuth 權限範圍列表

**關鍵函式**：
- `authorizeAntigravity()`：建構 OAuth 授權 URL，包含 PKCE challenge
- `exchangeAntigravity()`：交換授權碼取得存取權杖和重新整理權杖
- `fetchProjectID()`：自動解析 Google Cloud 專案 ID
- `encodeState()` / `decodeState()`：編碼/解碼 OAuth state 參數（包含 PKCE verifier）

</details>
