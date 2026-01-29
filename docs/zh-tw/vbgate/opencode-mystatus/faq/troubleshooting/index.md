---
title: "常見問題排查: Token 過期與權限錯誤 | opencode-mystatus"
sidebarTitle: "常見問題"
subtitle: "常見問題：無法查詢額度、Token 過期、權限問題"
description: "了解 opencode-mystatus 常見問題的排查方法。涵蓋認證檔讀取、Token 過期、API 錯誤、Copilot PAT 和 Google Cloud 配置等問題的解決方案。"
tags:
  - "故障排除"
  - "常見問題"
  - "Token 過期"
  - "權限問題"
prerequisite:
  - "start-quick-start"
order: 1
---

# 常見問題：無法查詢額度、Token 過期、權限問題

使用 opencode-mystatus 外掛時，你可能會遇到各種錯誤：無法讀取認證檔、OAuth Token 過期、GitHub Copilot 權限不足、API 請求失敗等。這些常見問題通常可以透過簡單的設定或重新授權解決。本教學整理了所有常見錯誤的排查步驟，幫你快速定位問題根源。

## 學完你能做什麼

- 快速定位 mystatus 查詢失敗的原因
- 解決 OpenAI Token 過期問題
- 設定 GitHub Copilot 的 Fine-grained PAT
- 處理 Google Cloud 缺少 project_id 的情況
- 應對各種 API 請求失敗和逾時問題

## 你現在的困境

你執行 `/mystatus` 查詢額度，但看到了各種錯誤訊息，不知道該從哪裡開始排查。

## 什麼時候用這一招

- **看到任何錯誤提示時**：本教學涵蓋了所有常見錯誤
- **剛設定新帳號時**：驗證設定是否正確
- **額度查詢突然失敗時**：可能是 Token 過期或權限變化

::: tip 排錯原則

遇到錯誤時，先看錯誤訊息的關鍵詞，再對應到本教學的解決方案。大部分錯誤都有明確的提示訊息。

:::

## 核心思路

mystatus 工具的錯誤處理機制分為三層：

1. **讀取認證檔層**：檢查 `auth.json` 是否存在、格式是否正確
2. **平台查詢層**：每個平台獨立查詢，失敗不影響其他平台
3. **API 請求層**：網路請求可能逾時或返回錯誤，但工具會繼續嘗試其他平台

這意味著：
- 一個平台失敗，其他平台仍會正常顯示
- 錯誤訊息會明確指出是哪個平台出問題
- 大部分錯誤都可以透過設定或重新授權解決

## 問題排查清單

### 問題 1：無法讀取認證檔

**錯誤訊息**：

```
❌ 無法讀取認證檔: ~/.local/share/opencode/auth.json
錯誤: ENOENT: no such file or directory
```

**原因**：
- OpenCode 的認證檔不存在
- 還沒有設定任何平台的帳號

**解決方法**：

1. **確認 OpenCode 已安裝並設定**
   - 確認你已經在 OpenCode 中設定過至少一個平台（OpenAI、智證 AI 等）
   - 如果沒有，請先在 OpenCode 中完成授權

2. **檢查檔案路徑**
   - OpenCode 的認證檔應該在 `~/.local/share/opencode/auth.json`
   - 如果你使用的是自訂設定目錄，確認檔案路徑是否正確

3. **驗證檔格式**
   - 確認 `auth.json` 是有效的 JSON 檔
   - 檔案內容應該至少包含一個平台的認證訊息

**你應該看到**：
重新執行 `/mystatus` 後，能看到至少一個平台的額度訊息。

---

### 問題 2：未找到任何已設定的帳號

**錯誤訊息**：

```
未找到任何已設定的帳號。

支援的帳號類型:
- OpenAI (Plus/Team/Pro 訂閱使用者)
- 智證 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**原因**：
- `auth.json` 存在，但裡面沒有任何有效的設定
- 已有的設定格式不正確（比如缺少必要欄位）

**解決方法**：

1. **檢查 auth.json 內容**
   開啟 `~/.local/share/opencode/auth.json`，確認至少有一個平台設定：

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **設定至少一個平台**
   - 在 OpenCode 中完成 OAuth 授權
   - 或手動新增平台的 API Key（智證 AI、Z.ai）

3. **參考設定格式**
   各平台的設定要求：
   - OpenAI：必須有 `type: "oauth"` 和 `access` token
   - 智證 AI / Z.ai：必須有 `type: "api"` 和 `key`
   - GitHub Copilot：必須有 `type: "oauth"` 和 `refresh` token
   - Google Cloud：不依賴 `auth.json`，需要單獨設定（見問題 6）

---

### 問題 3：OpenAI OAuth Token 過期

**錯誤訊息**：

```
⚠️ OAuth 授權已過期，請在 OpenCode 中使用一次 OpenAI 模型以重新整理授權。
```

**原因**：
- OpenAI 的 OAuth Token 有效期有限，過期後無法查詢額度
- Token 的過期時間儲存在 `auth.json` 的 `expires` 欄位中

**解決方法**：

1. **在 OpenCode 中使用一次 OpenAI 模型**
   - 向 ChatGPT 或 Codex 提一個問題
   - OpenCode 會自動重新整理 Token 並更新 `auth.json`

2. **確認 Token 已更新**
   - 查看 `auth.json` 中的 `expires` 欄位
   - 確認它是一個未來的時間戳

3. **重新執行 /mystatus**
   - 現在應該能正常查詢 OpenAI 額度了

**為什麼需要重新使用模型**：
OpenAI 的 OAuth Token 有過期機制，使用模型時會觸發 Token 重新整理。這是 OpenCode 官方認證流程的安全特性。

---

### 問題 4：API 請求失敗（通用）

**錯誤訊息**：

```
OpenAI API 請求失敗 (401): Unauthorized
智證 API 請求失敗 (403): Forbidden
Google API 請求失敗 (500): Internal Server Error
```

**原因**：
- Token 或 API Key 無效
- 網路連線問題
- API 服務暫時無法使用
- 權限不足（某些平台要求特定權限）

**解決方法**：

1. **檢查 Token 或 API Key**
   - OpenAI：確認 `access` token 未過期（見問題 3）
   - 智證 AI / Z.ai：確認 `key` 正確，沒有多餘空格
   - GitHub Copilot：確認 `refresh` token 有效

2. **檢查網路連線**
   - 確認網路正常
   - 某些平台可能有地區限制（比如 Google Cloud）

3. **嘗試重新授權**
   - 在 OpenCode 中重新進行 OAuth 授權
   - 或手動更新 API Key

4. **查看具體的 HTTP 狀態碼**
   - `401` / `403`：權限問題，通常是 Token 或 API Key 無效
   - `500` / `503`：伺服器端錯誤，通常是 API 暫時無法使用，稍後重試
   - `429`：請求過於頻繁，需要等待一段時間

---

### 問題 5：請求逾時

**錯誤訊息**：

```
請求逾時 (10秒）
```

**原因**：
- 網路連線緩慢
- API 回應時間過長
- 防火牆或代理阻擋請求

**解決方法**：

1. **檢查網路連線**
   - 確認網路穩定
   - 嘗試存取該平台的網站，確認能正常存取

2. **檢查代理設定**
   - 如果你使用代理，確認代理設定正確
   - 某些平台可能需要特殊的代理設定

3. **重試一次**
   - 有時只是暫時的網路波動
   - 重試一次通常能解決問題

---

### 問題 6：GitHub Copilot 配額查詢無法使用

**錯誤訊息**：

```
⚠️ GitHub Copilot 配額查詢暫時無法使用。
OpenCode 的新 OAuth 整合不支援存取配額 API。

解決方案:
1. 建立一個 fine-grained PAT (存取 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中將 'Plan' 設為 'Read-only'
3. 建立設定檔並填寫以下內容（包含必需的 `tier` 欄位）：
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的使用者名稱",
     "tier": "pro"
   }
   ```

其他方法:
• 在 VS Code 中點擊狀態列的 Copilot 圖示查看配額
• 存取 https://github.com/settings/billing 查看使用情況
```

**原因**：
- OpenCode 的官方式 OAuth 整合使用的是新的認證流程
- 新的 OAuth Token 沒有 `copilot` 權限，無法呼叫內部配額 API
- 這是 OpenCode 官方的安全限制

**解決方法**（推薦）：

1. **建立 Fine-grained PAT**
   - 存取 https://github.com/settings/tokens?type=beta
   - 點擊 "Generate new token" → "Fine-grained token"
   - 填寫 Token 名稱（如 "OpenCode Copilot Quota"）

2. **設定權限**
   - 在 "Account permissions" 中，找到 "Plan" 權限
   - 設定為 "Read-only"
   - 點擊 "Generate token"

3. **建立設定檔**
   建立 `~/.config/opencode/copilot-quota-token.json`：

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的 GitHub 使用者名稱",
     "tier": "pro"
   }
   ```

   **tier 欄位說明**：
   - `free`：Copilot Free（50 次/月）
   - `pro`：Copilot Pro（300 次/月）
   - `pro+`：Copilot Pro+（1500 次/月）
   - `business`：Copilot Business（300 次/月）
   - `enterprise`：Copilot Enterprise（1000 次/月）

4. **重新執行 /mystatus**
   - 現在應該能正常查詢 GitHub Copilot 額度了

**替代方案**：

如果不想設定 PAT，可以：
- 在 VS Code 中點擊狀態列的 Copilot 圖示查看配額
- 存取 https://github.com/settings/billing 查看使用情況

---

### 問題 7：Google Cloud 缺少 project_id

**錯誤訊息**：

```
⚠️ 缺少 project_id，無法查詢額度。
```

**原因**：
- Google Cloud 帳號設定中缺少 `projectId` 或 `managedProjectId`
- mystatus 需要專案 ID 來呼叫 Google Cloud API

**解決方法**：

1. **檢查 antigravity-accounts.json**
   開啟設定檔，確認帳號設定包含 `projectId` 或 `managedProjectId`：

::: code-group

```bash [macOS/Linux]
~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
%APPDATA%\opencode\antigravity-accounts.json
```

:::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **如何取得 project_id**
   - 存取 https://console.cloud.google.com/
   - 選擇你的專案
   - 在專案資訊中找到 "專案 ID"（Project ID）
   - 將其複製到設定檔中

3. **如果沒有 project_id**
   - 如果你使用的是託管專案，可能需要使用 `managedProjectId`
   - 聯繫你的 Google Cloud 管理員確認專案 ID

---

### 問題 8：智證 AI / Z.ai API 返回無效資料

**錯誤訊息**：

```
智證 API 請求失敗 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 請求失敗 (200): {"code": 400, "msg": "Bad request"}
```

**原因**：
- API Key 無效或格式錯誤
- API Key 已過期或被撤銷
- 帳號沒有對應服務的權限

**解決方法**：

1. **確認 API Key 正確**
   - 登入智證 AI 或 Z.ai 控制台
   - 檢查你的 API Key 是否有效
   - 確認沒有多餘的空格或換行符

2. **檢查 API Key 權限**
   - 智證 AI：確認你有 "Coding Plan" 權限
   - Z.ai：確認你有 "Coding Plan" 權限

3. **重新生成 API Key**
   - 如果 API Key 有問題，可以在控制台中重新生成
   - 更新 `auth.json` 中的 `key` 欄位

---

## 檢查點 ✅

確認你能獨立解決常見問題：

| 技能 | 檢查方法 | 預期結果 |
|--- | --- | ---|
| 排查認證檔問題 | 檢查 auth.json 是否存在且格式正確 | 檔案存在，JSON 格式正確 |
| 重新整理 OpenAI Token | 在 OpenCode 中使用一次 OpenAI 模型 | Token 已更新，能正常查詢額度 |
| 設定 Copilot PAT | 建立 copilot-quota-token.json | 能正常查詢 Copilot 額度 |
| 處理 API 錯誤 | 查看 HTTP 狀態碼並採取對應措施 | 知道 401/403/500 等錯誤碼的含義 |
| 設定 Google project_id | 新增 projectId 到 antigravity-accounts.json | 能正常查詢 Google Cloud 額度 |

## 本課小結

mystatus 的錯誤處理分為三層：認證檔讀取、平台查詢、API 請求。遇到錯誤時，先看錯誤訊息的關鍵詞，再對應到解決方案。最常見的問題包括：

1. **認證檔問題**：檢查 `auth.json` 是否存在、格式是否正確
2. **Token 過期**：在 OpenCode 中使用一次對應模型重新整理 Token
3. **API 錯誤**：根據 HTTP 狀態碼判斷是權限問題還是伺服器端問題
4. **Copilot 特殊權限**：新 OAuth 整合需要設定 Fine-grained PAT
5. **Google 設定**：需要 project_id 才能查詢額度

大部分錯誤都可以透過設定或重新授權解決，一個平台失敗不會影響其他平台的查詢。

## 下一課預告

> 下一課我們學習 **[安全與隱私：本地檔案存取、API 脫敏、官方介面](/zh-tw/vbgate/opencode-mystatus/faq/security/)**。
>
> 你會學到：
> - mystatus 如何保護你的敏感資料
> - API Key 自動脫敏的原理
> - 為什麼外掛是安全的本地工具
> - 資料不儲存、不上傳的保證

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 錯誤處理主邏輯 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| 認證檔讀取 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| 未找到帳號提示 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| 結果收集和彙總 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| OpenAI Token 過期檢查 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| API 錯誤處理 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Copilot PAT 讀取 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Copilot OAuth 失敗提示 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Google project_id 檢查 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| 智證 API 錯誤處理 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| 錯誤訊息定義 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (中文), 144-201 (英文) |

**關鍵常數**：

- `HIGH_USAGE_THRESHOLD = 80`：高使用率警告閾值（`plugin/lib/types.ts:111`）

**關鍵函數**：

- `collectResult()`：收集查詢結果到 results 和 errors 陣列（`plugin/mystatus.ts:100-116`）
- `queryOpenAIUsage()`：查詢 OpenAI 額度，包含 Token 過期檢查（`plugin/lib/openai.ts:207-236`）
- `readQuotaConfig()`：讀取 Copilot PAT 設定（`plugin/lib/copilot.ts:122-151`）
- `fetchAccountQuota()`：查詢單個 Google Cloud 帳號額度（`plugin/lib/google.ts:218-256`）
- `fetchUsage()`：查詢智證/Z.ai 使用情況（`plugin/lib/zhipu.ts:81-106`）

</details>
