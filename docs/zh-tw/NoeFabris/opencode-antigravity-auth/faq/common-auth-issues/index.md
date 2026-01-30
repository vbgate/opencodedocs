---
title: "OAuth 認證排查：常見問題解決 | Antigravity Auth"
sidebarTitle: "OAuth 認證失敗怎麼辦"
subtitle: "OAuth 認證排查：常見問題解決"
description: "學習 Antigravity Auth 外掛的 OAuth 認證問題排查方法。涵蓋 Safari 回呼失敗、403 錯誤、速率限制、WSL2/Docker 環境設定等常見故障解決方案。"
tags:
  - "FAQ"
  - "故障排查"
  - "OAuth"
  - "認證"
prerequisite:
  - "start-first-auth-login"
  - "start-quick-install"
order: 1
---

# 常見認證問題排查

學完這課，你能自己解決 OAuth 認證失敗、權杖重新整理錯誤、權限被拒等常見問題，快速恢復外掛正常使用。

## 你現在的困境

你剛裝好 Antigravity Auth 外掛，正準備用 Claude 或 Gemini 3 模型幹活，結果：

- 執行 `opencode auth login` 後，瀏覽器授權成功，但終端機提示「授權失敗」
- 使用一段時間後突然報錯「Permission Denied」或「invalid_grant」
- 所有帳戶都顯示「速率限制」，明明配額還夠
- WSL2 或 Docker 環境下無法完成 OAuth 認證
- Safari 瀏覽器 OAuth 回呼總是失敗

這些問題都很常見，大多數情況下不需要重裝或聯繫支援，跟著本文一步步排查就能解決。

## 什麼時候用這一招

當你遇到以下情況時，參考本教學：
- **OAuth 認證失敗**：`opencode auth login` 無法完成
- **權杖失效**：invalid_grant、Permission Denied 錯誤
- **速率限制**：429 錯誤、「所有帳戶限速」
- **環境問題**：WSL2、Docker、遠端開發環境
- **外掛衝突**：與 oh-my-opencode 或其他外掛不相容

::: tip 快速重設
遇到認證問題，**90% 的情況**可以透過刪除帳戶檔案重新認證解決：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## 快速診斷流程

遇到問題時，按以下順序快速定位：

1. **檢查設定路徑** → 確認檔案位置正確
2. **刪除帳戶檔案重新認證** → 解決大多數認證問題
3. **查看錯誤訊息** → 根據具體錯誤類型尋找解決方案
4. **檢查網路環境** → WSL2/Docker 需要額外設定

---

## 核心概念：OAuth 認證和權杖管理

在解決問題前，先理解幾個關鍵概念。

::: info 什麼是 OAuth 2.0 PKCE 認證？

Antigravity Auth 使用 **OAuth 2.0 with PKCE**（Proof Key for Code Exchange）認證機制：

1. **授權碼**：你授權後，Google 回傳一個臨時授權碼
2. **權杖交換**：外掛用授權碼換取 `access_token`（用於 API 呼叫）和 `refresh_token`（用於重新整理）
3. **自動重新整理**：`access_token` 過期前 30 分鐘，外掛自動用 `refresh_token` 重新整理
4. **權杖儲存**：所有權杖儲存在本機 `~/.config/opencode/antigravity-accounts.json`，不會上傳到任何伺服器

**安全性**：PKCE 機制防止授權碼被攔截，即使權杖洩露，攻擊者也無法重新授權。

:::

::: info 什麼是速率限制（Rate Limit）？

Google 對每個 Google 帳戶的 API 呼叫有頻率限制。當觸發限制時：

- **429 Too Many Requests**：請求過於頻繁，需要等待
- **403 Permission Denied**：可能被軟禁或觸發濫用偵測
- **請求掛起**：200 OK 但沒有回應，通常表示被靜默限流

**多帳戶的優勢**：透過輪換多個帳戶，可以繞過單一帳戶的限制，最大化總體配額。

:::

---

## 設定路徑說明

所有平台（包括 Windows）都使用 `~/.config/opencode/` 作為設定目錄：

| 檔案 | 路徑 | 說明 |
| --- | --- | --- |
| 主設定 | `~/.config/opencode/opencode.json` | OpenCode 主設定檔 |
| 帳戶檔案 | `~/.config/opencode/antigravity-accounts.json` | OAuth 權杖和帳戶資訊 |
| 外掛設定 | `~/.config/opencode/antigravity.json` | 外掛特定設定 |
| 除錯日誌 | `~/.config/opencode/antigravity-logs/` | 除錯日誌檔案 |

> **Windows 使用者注意**：`~` 會自動解析為你的使用者目錄（如 `C:\Users\YourName`）。不要使用 `%APPDATA%`。

---

## OAuth 認證問題

### Safari OAuth 回呼失敗（macOS）

**症狀**：
- 瀏覽器授權成功後，終端機提示「fail to authorize」
- Safari 顯示「Safari 無法開啟頁面」或「連線被拒絕」

**原因**：Safari 的「僅限 HTTPS 模式」阻止了 `http://localhost` 回呼位址。

**解決方案**：

**方案 1：使用其他瀏覽器（最簡單）**

1. 執行 `opencode auth login`
2. 複製終端機顯示的 OAuth URL
3. 貼到 Chrome 或 Firefox 中開啟
4. 完成授權

**方案 2：暫時停用僅限 HTTPS 模式**

1. Safari → 設定（⌘,）→ 隱私
2. 取消勾選「啟用僅限 HTTPS 模式」
3. 執行 `opencode auth login`
4. 認證完成後重新啟用僅限 HTTPS 模式

**方案 3：手動擷取回呼（進階）**

Safari 顯示錯誤時，網址列包含 `?code=...&scope=...`，可以手動擷取回呼參數。詳見 [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119)。

### 連接埠已被佔用

**錯誤訊息**：`Address already in use`

**原因**：OAuth 回呼伺服器預設使用 `localhost:51121`，如果連接埠被佔用則無法啟動。

**解決方案**：

**macOS / Linux：**
```bash
# 尋找佔用連接埠的程序
lsof -i :51121

# 終止程序（將 <PID> 替換為實際程序 ID）
kill -9 <PID>

# 重新認證
opencode auth login
```

**Windows：**
```powershell
# 尋找佔用連接埠的程序
netstat -ano | findstr :51121

# 終止程序（將 <PID> 替換為實際程序 ID）
taskkill /PID <PID> /F

# 重新認證
opencode auth login
```

### WSL2 / Docker / 遠端開發環境

**問題**：OAuth 回呼需要瀏覽器能存取執行 OpenCode 的 `localhost`，但在容器或遠端環境中無法直接存取。

**WSL2 解決方案**：
- 使用 VS Code 的連接埠轉發
- 或設定 Windows → WSL 連接埠轉發

**SSH / 遠端開發解決方案**：
```bash
# 建立 SSH 通道，將遠端的 51121 連接埠轉發到本機
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / 容器解決方案**：
- 容器內無法使用 localhost 回呼
- 等待 30 秒後使用手動 URL 流程
- 或使用 SSH 連接埠轉發

### 多帳戶認證問題

**症狀**：多個帳戶認證失敗或混淆。

**解決方案**：
1. 刪除帳戶檔案：`rm ~/.config/opencode/antigravity-accounts.json`
2. 重新認證：`opencode auth login`
3. 確保每個帳戶使用不同的 Google 信箱

---

## 權杖重新整理問題

### invalid_grant 錯誤

**錯誤訊息**：
```
Error: invalid_grant
Token has been revoked or expired.
```

**原因**：
- Google 帳戶密碼變更
- 帳戶發生安全事件（如可疑登入）
- `refresh_token` 失效

**解決方案**：
```bash
# 刪除帳戶檔案
rm ~/.config/opencode/antigravity-accounts.json

# 重新認證
opencode auth login
```

### 權杖過期

**症狀**：一段時間未使用後，再次呼叫模型時報錯。

**原因**：`access_token` 有效期約 1 小時，`refresh_token` 有效期更長但也會過期。

**解決方案**：
- 外掛會在權杖過期前 30 分鐘自動重新整理，無需手動操作
- 如果自動重新整理失敗，重新認證：`opencode auth login`

---

## 權限錯誤

### 403 Permission Denied（rising-fact-p41fc）

**錯誤訊息**：
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**原因**：外掛在沒有找到有效專案時，會回退到預設的 Project ID（如 `rising-fact-p41fc`）。這適用於 Antigravity 模型，但對 Gemini CLI 模型會失敗，因為 Gemini CLI 需要你自己帳戶中的 GCP 專案。

**解決方案**：

**第 1 步：建立或選擇 GCP 專案**

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立一個新專案或選擇現有專案
3. 記下專案 ID（如 `my-gemini-project`）

**第 2 步：啟用 Gemini for Google Cloud API**

1. 在 Google Cloud Console 中，進入「API 和服務」→「程式庫」
2. 搜尋「Gemini for Google Cloud API」（`cloudaicompanion.googleapis.com`）
3. 點擊「啟用」

**第 3 步：在帳戶檔案中新增 projectId**

編輯 `~/.config/opencode/antigravity-accounts.json`：

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning 多帳戶設定
如果設定了多個 Google 帳戶，每個帳戶都需要新增對應的 `projectId`。
:::

---

## 速率限制問題

### 所有帳戶限速（但配額可用）

**症狀**：
- 提示「All accounts rate-limited」
- 配額看起來還夠用，但無法發起新請求
- 新增的帳戶立即被限速

**原因**：這是外掛在 hybrid 模式下的一個級聯 bug（`clearExpiredRateLimits()`），已在最近的 beta 版本中修復。

**解決方案**：

**方案 1：更新到最新 beta 版本**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**方案 2：刪除帳戶檔案重新認證**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**方案 3：切換帳戶選擇策略**
編輯 `~/.config/opencode/antigravity.json`，將策略改為 `sticky`：
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**症狀**：
- 請求頻繁回傳 429 錯誤
- 提示「Rate limit exceeded」

**原因**：Google 已顯著收緊配額和速率限制 enforcement。所有使用者都會受影響，不只是本外掛。關鍵因素：

1. **更嚴格的 enforcement**：即使配額「看起來可用」，Google 也可能對觸發濫用偵測的帳戶進行節流或軟禁
2. **OpenCode 的請求模式**：OpenCode 比原生應用程式發起更多 API 呼叫（工具呼叫、重試、串流傳輸、多輪對話鏈），這比「正常」使用更快觸發限制
3. **Shadow bans**：某些帳戶一旦被標記，會長時間無法使用，而其他帳戶繼續正常運作

::: danger 使用風險
使用此外掛可能會增加觸發自動濫用/速率限制保護的機會。上游供應商可自行決定限制、暫停或終止存取。**使用風險自負**。
:::

**解決方案**：

**方案 1：等待重設（最可靠）**

速率限制通常在幾小時後重設。如果問題持續：
- 停止使用受影響的帳戶 24-48 小時
- 期間使用其他帳戶
- 檢查帳戶檔案中的 `rateLimitResetTimes` 查看限制何時過期

**方案 2：在 Antigravity IDE 中「暖身」帳戶（社群經驗）**

使用者回報這種方法有效：
1. 在瀏覽器中直接開啟 [Antigravity IDE](https://idx.google.com/)
2. 用受影響的 Google 帳戶登入
3. 執行幾個簡單的提示（如「你好」、「2+2 等於幾」）
4. 5-10 次成功提示後，嘗試再次使用帳戶與外掛

**原理**：透過「官方」介面使用帳戶可能會重設一些內部旗標，或讓帳戶看起來不那麼可疑。

**方案 3：減少請求量和突發性**

- 使用更短的工作階段
- 避免並行/重試密集型工作流程（如同時產生多個子代理）
- 如果使用 oh-my-opencode，考慮減少並行代理產生數
- 設定 `max_rate_limit_wait_seconds: 0` 以快速失敗而不是重試

**方案 4：直接使用 Antigravity IDE（單帳戶使用者）**

如果你只有一個帳戶，直接使用 [Antigravity IDE](https://idx.google.com/) 可能會有更好的體驗，因為 OpenCode 的請求模式會更快觸發限制。

**方案 5：新帳戶設定**

如果新增新帳戶：
1. 刪除帳戶檔案：`rm ~/.config/opencode/antigravity-accounts.json`
2. 重新認證：`opencode auth login`
3. 更新到最新 beta：`"plugin": ["opencode-antigravity-auth@beta"]`
4. 考慮先在 Antigravity IDE 中「暖身」帳戶

**需要回報的資訊**：

如果你遇到異常的速率限制行為，請在 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues) 中分享：
- 除錯日誌中的狀態碼（403、429 等）
- 速率限制狀態持續的時間
- 帳戶數量和使用的選擇策略

### 請求掛起（無回應）

**症狀**：
- 提示一直掛起，沒有回傳
- 日誌顯示 200 OK，但沒有回應內容

**原因**：通常是 Google 的靜默限流或軟禁。

**解決方案**：
1. 停止目前請求（Ctrl+C 或 ESC）
2. 等待 24-48 小時後再使用該帳戶
3. 在期間使用其他帳戶

---

## 工作階段恢復問題

### 工具執行中斷後報錯

**症狀**：工具執行時按 ESC 中斷，後續對話報錯 `tool_result_missing`。

**解決方案**：
1. 在對話中輸入 `continue` 觸發自動恢復
2. 如果被阻塞，使用 `/undo` 回退到錯誤前的狀態
3. 重試操作

::: tip 自動恢復
外掛工作階段恢復功能預設啟用。如果工具執行中斷，它會自動注入 synthetic `tool_result` 並嘗試恢復。
:::

---

## 外掛相容性問題

### 與 oh-my-opencode 衝突

**問題**：oh-my-opencode 內建 Google 認證，與本外掛衝突。

**解決方案**：在 `~/.config/opencode/oh-my-opencode.json` 中停用內建認證：
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**並行代理問題**：產生並行子代理時，多個程序可能命中同一個帳戶。**解決方法**：
- 啟用 `pid_offset_enabled: true`（在 `antigravity.json` 中設定）
- 或新增更多帳戶

### 與 @tarquinen/opencode-dcp 衝突

**問題**：DCP 建立缺少思考區塊的 synthetic assistant 訊息，與本外掛衝突。

**解決方案**：**將本外掛列在 DCP 之前**：
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### 其他 gemini-auth 外掛

**問題**：安裝了其他 Google Gemini 認證外掛，導致衝突。

**解決方案**：你不需要它們。本外掛已經處理了所有 Google OAuth 認證。解除安裝其他 gemini-auth 外掛。

---

## 設定問題

### 設定鍵拼寫錯誤

**錯誤訊息**：`Unrecognized key: "plugins"`

**原因**：使用了錯誤的鍵名。

**解決方案**：正確的鍵是 `plugin`（單數）：
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**不是** `"plugins"`（複數），這會導致「Unrecognized key」錯誤。

### 模型未找到

**症狀**：使用模型時報錯「Model not found」或 400 錯誤。

**解決方案**：在 `google` provider 設定中新增：
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## 遷移問題

### 機器間遷移帳戶

**問題**：將 `antigravity-accounts.json` 複製到新機器後，提示「API key missing」。

**解決方案**：
1. 確保外掛已安裝：`"plugin": ["opencode-antigravity-auth@beta"]`
2. 複製 `~/.config/opencode/antigravity-accounts.json` 到新機器的相同路徑
3. 如果仍然報錯，`refresh_token` 可能已失效 → 重新認證：`opencode auth login`

---

## 除錯技巧

### 啟用除錯日誌

**基本日誌**：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**詳細日誌**（完整請求/回應）：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

日誌檔案位置：`~/.config/opencode/antigravity-logs/`

### 查看速率限制狀態

查看帳戶檔案中的 `rateLimitResetTimes` 欄位：
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## 檢查點 ✅

完成排查後，你應該能：
- [ ] 正確理解設定檔路徑（`~/.config/opencode/`）
- [ ] 解決 Safari OAuth 回呼失敗問題
- [ ] 處理 invalid_grant 和 403 錯誤
- [ ] 理解速率限制的原因和應對策略
- [ ] 解決與 oh-my-opencode 的衝突
- [ ] 啟用除錯日誌定位問題

---

## 踩坑提醒

### 不要提交帳戶檔案到版本控制

`antigravity-accounts.json` 包含 OAuth refresh tokens，等同於密碼檔案。外掛會自動建立 `.gitignore`，但請確保你的 `.gitignore` 包含：
```
~/.config/opencode/antigravity-accounts.json
```

### 避免頻繁重試

觸發 429 限制後，不要反覆重試。等待一段時間再試，否則可能被標記為濫用。

### 多帳戶設定時注意 projectId

如果使用 Gemini CLI 模型，**每個帳戶**都需要設定自己的 `projectId`。不要使用同一個 project ID。

---

## 本課小結

本課涵蓋了 Antigravity Auth 外掛最常見的認證和帳戶問題：

1. **OAuth 認證問題**：Safari 回呼失敗、連接埠佔用、WSL2/Docker 環境
2. **權杖重新整理問題**：invalid_grant、權杖過期
3. **權限錯誤**：403 Permission Denied、缺失 projectId
4. **速率限制問題**：429 錯誤、Shadow bans、所有帳戶限速
5. **外掛相容性**：oh-my-opencode、DCP 衝突
6. **設定問題**：拼寫錯誤、模型未找到

遇到問題時，先嘗試**快速重設**（刪除帳戶檔案重新認證），90% 的情況下能解決。如果問題持續，啟用除錯日誌查看詳細資訊。

---

## 下一課預告

> 下一課我們學習 **[模型未找到錯誤排查](../model-not-found/)**。
>
> 你會學到：
> - Gemini 3 模型的 400 錯誤（Unknown name 'parameters'）
> - Tool Schema 不相容問題
> - MCP 伺服器導致錯誤的診斷方法
> - 如何透過除錯定位問題源頭

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| OAuth 認證（PKCE） | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| 權杖驗證與重新整理 | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| 帳戶儲存與管理 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| 速率限制偵測 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| 工作階段恢復 | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| 除錯日誌系統 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**關鍵常數**：
- `OAUTH_PORT = 51121`：OAuth 回呼伺服器連接埠（`constants.ts:25`）
- `CLIENT_ID`：OAuth 用戶端 ID（`constants.ts:4`）
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`：權杖過期前 30 分鐘重新整理（`auth.ts:33`）

**關鍵函式**：
- `authorizeAntigravity()`：啟動 OAuth 認證流程（`oauth.ts:91`）
- `exchangeAntigravity()`：交換授權碼取得權杖（`oauth.ts:209`）
- `refreshAccessToken()`：重新整理過期的存取權杖（`oauth.ts:263`）
- `isOAuthAuth()`：檢查是否為 OAuth 認證類型（`auth.ts:5`）
- `accessTokenExpired()`：檢查權杖是否即將過期（`auth.ts:33`）
- `markRateLimitedWithReason()`：標記帳戶為限速狀態（`accounts.ts:9`）
- `detectErrorType()`：偵測可恢復的錯誤類型（`recovery/index.ts`）

</details>
