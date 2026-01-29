---
title: "Copilot 認證: OAuth 和 PAT | opencode-mystatus"
sidebarTitle: "Copilot 認證"
subtitle: "Copilot 認證: OAuth 和 PAT"
description: "學習 GitHub Copilot 的兩種認證方式：OAuth Token 和 Fine-grained PAT。解決 OAuth 權限不足問題，建立 PAT 並設定訂閱類型，順利查詢 Copilot 額度。"
tags:
  - "GitHub Copilot"
  - "OAuth 認證"
  - "PAT 設定"
  - "權限問題"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Copilot 認證設定：OAuth Token 和 Fine-grained PAT

## 學完你能做什麼

- 瞭解 Copilot 的兩種認證方式：OAuth Token 和 Fine-grained PAT
- 解決 OAuth Token 權限不足的問題
- 建立 Fine-grained PAT 並設定訂閱類型
- 順利查詢 Copilot Premium Requests 額度

## 你現在的困境

執行 `/mystatus` 查詢 Copilot 額度時，你可能會看到這樣的錯誤提示：

```
⚠️ GitHub Copilot 配額查詢暫時無法使用。
OpenCode 的新 OAuth 整合不支援存取配額 API。

解決方案:
1. 建立一個 fine-grained PAT (存取 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中將 'Plan' 設為 'Read-only'
3. 建立設定檔 ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "你的使用者名稱"}
```

你不知道：
- 什麼是 OAuth Token？什麼是 Fine-grained PAT？
- 為什麼 OAuth 整合不支援存取配額 API？
- 如何建立 Fine-grained PAT？
- 訂閱類型（free、pro、pro+ 等）怎麼選？

這些問題卡住了你，導致無法查看 Copilot 額度。

## 什麼時候用這一招

當你：
- 看到提示「OpenCode 的新 OAuth 整合不支援存取配額 API」
- 想使用更穩定的 Fine-grained PAT 方式查詢額度
- 需要為團隊或企業帳號設定 Copilot 額度查詢

## 核心思路

mystatus 支援**兩種 Copilot 認證方式**：

| 認證方式 | 說明 | 優點 | 缺點 |
|---------|------|------|------|
| **OAuth Token**（預設） | 使用 OpenCode 登入時取得的 GitHub OAuth Token | 無需額外設定，開箱即用 | 新版 OpenCode 的 OAuth Token 可能沒有 Copilot 權限 |
| **Fine-grained PAT**（推薦） | 使用者手動建立的 Fine-grained Personal Access Token | 穩定可靠，不依賴 OAuth 權限 | 需要手動建立一次 |

**優先級規則**：
1. mystatus 優先使用 Fine-grained PAT（如果設定）
2. 如果沒有設定 PAT，才回退到 OAuth Token

::: tip 推薦做法
如果你的 OAuth Token 有權限問題，建立一個 Fine-grained PAT 是最穩定的解決方案。
:::

### 兩種方式的區別

**OAuth Token**：
- 儲存位置：`~/.local/share/opencode/auth.json`
- 取得方式：在 OpenCode 中登入 GitHub 時自動取得
- 權限問題：新版的 OpenCode 使用不同的 OAuth 客戶端，可能不授予 Copilot 相關權限

**Fine-grained PAT**：
- 儲存位置：`~/.config/opencode/copilot-quota-token.json`
- 取得方式：在 GitHub Developer Settings 中手動建立
- 權限要求：需要勾選 "Plan"（訂閱資訊）的 read 權限

## 跟我做

### 第 1 步：檢查是否已設定 Fine-grained PAT

在終端機中執行以下指令，檢查設定檔是否存在：

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**你應該看到**：
- 如果檔案存在，說明已經設定了 Fine-grained PAT
- 如果檔案不存在或提示錯誤，需要建立一個

### 第 2 步：建立 Fine-grained PAT（如果未設定）

如果上一步檢查檔案不存在，按以下步驟建立：

#### 2.1 存取 GitHub PAT 建立頁面

在瀏覽器中存取：
```
https://github.com/settings/tokens?type=beta
```

這是 GitHub 的 Fine-grained PAT 建立頁面。

#### 2.2 建立新的 Fine-grained PAT

點擊 **Generate new token (classic)** 或 **Generate new token (beta)**，推薦使用 Fine-grained（beta）。

**設定參數**：

| 欄位 | 值 |
|------|-----|
| **Name** | `mystatus-copilot`（或任何你喜歡的名稱） |
| **Expiration** | 選擇過期時間（如 90 days 或 No expiration） |
| **Resource owner** | 不需要選擇（預設） |

**權限設定**（重要！）：

在 **Account permissions** 部分，勾選：
- ✅ **Plan** → 選擇 **Read**（這個權限是查詢額度必需的）

::: warning 重要提示
只勾選 "Plan" 的 Read 權限即可，不要勾選其他不必要的權限，以保護帳戶安全。
:::

**你應該看到**：
- 勾選了 "Plan: Read"
- 沒有勾選其他權限（保持最小權限原則）

#### 2.3 產生並儲存 Token

點擊頁面底部的 **Generate token** 按鈕。

**你應該看到**：
- 頁面顯示新產生的 Token（類似 `github_pat_xxxxxxxxxxxx`）
- ⚠️ **立即複製這個 Token**，頁面重新整理後就看不到了

### 第 3 步：取得 GitHub 使用者名稱

在瀏覽器中存取你的 GitHub 首頁：
```
https://github.com/
```

**你應該看到**：
- 右上角或左上角顯示你的使用者名稱（如 `john-doe`）

記錄下這個使用者名稱，設定時需要用到。

### 第 4 步：確定 Copilot 訂閱類型

你需要知道自己的 Copilot 訂閱類型，因為不同類型的月度配額不同：

| 訂閱類型 | 月度配額 | 適用場景 |
|---------|---------|---------|
| `free` | 50 | Copilot Free（免費使用者） |
| `pro` | 300 | Copilot Pro（個人專業版） |
| `pro+` | 1500 | Copilot Pro+（個人增強版） |
| `business` | 300 | Copilot Business（團隊商業版） |
| `enterprise` | 1000 | Copilot Enterprise（企業版） |

::: tip 如何確定訂閱類型？
1. 存取 [GitHub Copilot 訂閱頁面](https://github.com/settings/copilot)
2. 查看目前顯示的訂閱計劃
3. 對照上表選擇對應的類型
:::

### 第 5 步：建立設定檔

根據你的作業系統，建立設定檔並填入資訊。

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_使用者名稱",
  "tier": "訂閱類型"
}
EOF
```

```powershell [Windows]
# 建立目錄（如果不存在）
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# 建立設定檔
@"
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_使用者名稱",
  "tier": "訂閱類型"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**設定範例**：

假設你的 PAT 是 `github_pat_abc123`，使用者名稱是 `johndoe`，訂閱類型是 `pro`：

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger 安全提醒
- 不要將 Token 提交到 Git 儲存庫或分享給他人
- Token 是存取你 GitHub 帳戶的憑證，洩露可能導致安全問題
:::

### 第 6 步：驗證設定

在 OpenCode 中執行 `/mystatus` 指令。

**你應該看到**：
- Copilot 部分正常顯示額度資訊
- 不再出現權限錯誤提示
- 顯示類似這樣的內容：

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
███████████████████░░░░░░░░ 70% (90/300)

Period: 2026-01
```

## 檢查點 ✅

驗證一下你理解了：

| 場景 | 你應該看到/做 |
|------|--------------|
| 設定檔已存在 | `ls ~/.config/opencode/copilot-quota-token.json` 顯示檔案 |
| PAT 建立成功 | Token 以 `github_pat_` 開頭 |
| 訂閱類型正確 | 設定中的 `tier` 值是 free/pro/pro+/business/enterprise 之一 |
| 驗證成功 | 執行 `/mystatus` 後看到 Copilot 額度資訊 |

## 踩坑提醒

### ❌ 錯誤操作：忘記勾選 "Plan: Read" 權限

**錯誤現象**：執行 `/mystatus` 時看到 API 錯誤（403 或 401）

**原因**：建立 PAT 時沒有勾選必要的權限。

**正確做法**：
1. 刪除舊的 Token（在 GitHub Settings 中）
2. 重新建立，確保勾選 **Plan: Read**
3. 更新設定檔中的 `token` 欄位

### ❌ 錯誤操作：訂閱類型填錯

**錯誤現象**：額度顯示不正確（如 Free 使用者顯示 300 次額度）

**原因**：`tier` 欄位填錯了（如填了 `pro` 但實際是 `free`）。

**正確做法**：
1. 存取 GitHub Copilot 設定頁面確認訂閱類型
2. 修改設定檔中的 `tier` 欄位

### ❌ 錯誤操作：Token 過期

**錯誤現象**：執行 `/mystatus` 時看到 401 錯誤

**原因**：Fine-grained PAT 設定了過期時間，已經失效。

**正確做法**：
1. 存取 GitHub Settings → Tokens 頁面
2. 找到已過期的 Token，刪除它
3. 建立新的 Token，更新設定檔

### ❌ 錯誤操作：使用者名稱大小寫錯誤

**錯誤現象**：看到 404 或使用者不存在錯誤

**原因**：GitHub 使用者名稱是區分大小寫的（如 `Johndoe` 和 `johndoe` 是不同的使用者）。

**正確做法**：
1. 複製 GitHub 首頁顯示的使用者名稱（完全一致）
2. 不要手動輸入，避免大小寫錯誤

::: tip 小竅門
如果遇到 404 錯誤，直接從 GitHub URL 中複製使用者名稱，例如存取 `https://github.com/YourName`，URL 中的 `YourName` 就是你的使用者名稱。
:::

## 本課小結

mystatus 支援兩種 Copilot 認證方式：

1. **OAuth Token**（預設）：自動取得，但可能有權限問題
2. **Fine-grained PAT**（推薦）：手動設定，穩定可靠

推薦設定 Fine-grained PAT 的步驟：
1. 在 GitHub Settings 建立 Fine-grained PAT
2. 勾選 "Plan: Read" 權限
3. 記錄 GitHub 使用者名稱和訂閱類型
4. 建立 `~/.config/opencode/copilot-quota-token.json` 設定檔
5. 驗證設定成功

設定完成後，mystatus 會優先使用 PAT 查詢 Copilot 額度，避免 OAuth 權限問題。

## 下一課預告

> 下一課我們學習 **[多語言支援：中文和英文自動切換](../i18n-setup/)**。
>
> 你會學到：
> - 語言偵測機制（Intl API、環境變數）
> - 如何手動切換語言
> - 中英文對照表

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能                        | 檔案路徑                                                                                   | 行號    |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| Copilot 認證策略入口        | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| 讀取 Fine-grained PAT 設定  | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| 公共 Billing API 呼叫       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| OAuth Token 交換           | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| 內部 API 呼叫（OAuth）     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| 格式化公共 Billing API 輸出 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| CopilotAuthData 類型定義    | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)    | 46-51   |
| CopilotQuotaConfig 類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)    | 66-73   |
| CopilotTier 列舉定義       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57)        | 57      |
| Copilot 訂閱類型配額       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**關鍵常數**：
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`：Fine-grained PAT 設定檔路徑
- `COPILOT_PLAN_LIMITS`：各訂閱類型的月度配額限制（第 397-403 行）

**關鍵函數**：
- `queryCopilotUsage(authData)`：查詢 Copilot 額度的主函數，包含兩種認證策略
- `readQuotaConfig()`：讀取 Fine-grained PAT 設定檔
- `fetchPublicBillingUsage(config)`：呼叫 GitHub 公共 Billing API（使用 PAT）
- `fetchCopilotUsage(authData)`：呼叫 GitHub 內部 API（使用 OAuth Token）
- `exchangeForCopilotToken(oauthToken)`：交換 OAuth Token 為 Copilot Session Token
- `formatPublicBillingUsage(data, tier)`：格式化公共 Billing API 的回應
- `formatCopilotUsage(data)`：格式化內部 API 的回應

**認證流程對比**：

| 策略 | Token 類型 | API 端點 | 優先級 |
|------|-----------|---------|--------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1（優先） |
| OAuth Token（快取） | Copilot Session Token | `/copilot_internal/user` | 2 |
| OAuth Token（直接） | GitHub OAuth Token | `/copilot_internal/user` | 3 |
| OAuth Token（交換） | Copilot Session Token（交換後） | `/copilot_internal/v2/token` | 4 |

</details>
