---
title: "帳戶遷移: 跨裝置設定 | Antigravity Auth"
sidebarTitle: "換電腦繼續用"
subtitle: "遷移帳戶：跨機器設定與版本升級"
description: "學習如何在 macOS/Linux/Windows 間遷移 Antigravity Auth 帳戶檔案，理解儲存格式自動升級機制，解決遷移後的認證問題。"
tags:
  - "遷移"
  - "跨機器"
  - "版本升級"
  - "帳戶管理"
prerequisite:
  - "quick-install"
order: 2
---

# 遷移帳戶：跨機器設定與版本升級

## 學完你能做什麼

- ✅ 將帳戶從一台機器遷移到另一台機器
- ✅ 理解儲存格式的版本變化（v1/v2/v3）
- ✅ 解決遷移後的認證問題（invalid_grant 錯誤）
- ✅ 在多台裝置上共享同一個帳戶

## 你現在的困境

買了一台新電腦，需要在上面繼續用 Antigravity Auth 存取 Claude 和 Gemini 3，但不想重新走一遍 OAuth 認證流程。或者升級外掛版本後，發現原來的帳戶資料無法使用。

## 什麼時候用這一招

- 📦 **換新裝置**：從舊電腦遷移到新電腦
- 🔄 **多裝置同步**：在桌上型電腦和筆記型電腦間共享帳戶
- 🆙 **版本升級**：外掛升級後儲存格式變化
- 💾 **備份還原**：定期備份帳戶資料

## 核心思路

**帳戶遷移**是將帳戶檔案（antigravity-accounts.json）從一台機器複製到另一台機器的過程。外掛會自動處理儲存格式版本升級。

### 遷移機制概覽

儲存格式有版本控制（目前是 v3），外掛會**自動處理版本遷移**：

| 版本 | 主要變化 | 目前狀態 |
|---|---|---|
| v1 → v2 | 速率限制狀態結構化 | ✅ 自動遷移 |
| v2 → v3 | 支援雙配額池（gemini-antigravity/gemini-cli） | ✅ 自動遷移 |

儲存檔案位置（跨平台）：

| 平台 | 路徑 |
|---|---|
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip 安全提醒
帳戶檔案包含 OAuth refresh token，**相當於密碼**。傳輸時請使用加密方式（如 SFTP、加密 ZIP）。
:::

## 🎒 開始前的準備

- [ ] 目標機器已安裝 OpenCode
- [ ] 目標機器已安裝 Antigravity Auth 外掛：`opencode plugin add opencode-antigravity-auth@beta`
- [ ] 確保兩台機器能安全傳輸檔案（SSH、U 盤等）

## 跟我做

### 第 1 步：在源機器上找到帳戶檔案

**為什麼**
需要定位包含帳戶資料的 JSON 檔案。

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**你應該看到**：檔案存在，包含類似內容：

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

如果檔案不存在，說明還沒新增帳戶，請先執行 `opencode auth login`。

### 第 2 步：複製帳戶檔案到目標機器

**為什麼**
將帳戶資訊（refresh token 和 Project ID）傳輸到新裝置。

::: code-group

```bash [macOS/Linux]
# 方法 1：使用 scp（透過 SSH）
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# 方法 2：使用 U 盤
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# 方法 1：使用 PowerShell Copy-Item（透過 SMB）
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# 方法 2：使用 U 盤
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**你應該看到**：檔案成功複製到目標機器的暫存目錄（如 `/tmp/` 或 `Downloads/`）。

### 第 3 步：在目標機器上安裝外掛

**為什麼**
確保目標機器的外掛版本相容。

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**你應該看到**：外掛安裝成功提示。

### 第 4 步：將檔案放到正確位置

**為什麼**
外掛只會在固定路徑尋找帳戶檔案。

::: code-group

```bash [macOS/Linux]
# 建立目錄（如果不存在）
mkdir -p ~/.config/opencode

# 複製檔案
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# 驗證權限
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# 複製檔案（目錄會自動建立）
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# 驗證
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**你應該看到**：檔案存在於設定目錄。

### 第 5 步：驗證遷移結果

**為什麼**
確認帳戶已正確載入。

```bash
# 列出帳戶（會觸發外掛載入帳戶檔案）
opencode auth login

# 如果已有帳戶，會顯示：
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

按 `Ctrl+C` 退出（不需要新增帳戶）。

**你應該看到**：外掛成功識別帳戶列表，包括遷移過來的帳戶信箱。

### 第 6 步：測試首次請求

**為什麼**
驗證 refresh token 仍然有效。

```bash
# 在 OpenCode 中發起一個測試請求
# 選擇：google/antigravity-gemini-3-flash
```

**你應該看到**：模型正常回應。

## 檢查點 ✅

- [ ] 目標機器能列出遷移過來的帳戶
- [ ] 測試請求成功（無認證錯誤）
- [ ] 外掛日誌無錯誤提示

## 踩坑提醒

### 問題 1：「API key missing」錯誤

**現象**：遷移後請求報錯 `API key missing`。

**原因**：refresh token 可能已過期或被 Google 撤銷（如密碼更改、安全事件）。

**解決方案**：

```bash
# 清除帳戶檔案，重新認證
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### 問題 2：外掛版本不相容

**現象**：遷移後帳戶檔案無法載入，日誌提示 `Unknown storage version`。

**原因**：目標機器的外掛版本太舊，不支援目前儲存格式。

**解決方案**：

```bash
# 升級到最新版本
opencode plugin add opencode-antigravity-auth@latest

# 重新測試
opencode auth login
```

### 問題 3：雙配額池資料遺失

**現象**：遷移後 Gemini 模型只使用一個配額池，沒有自動 fallback。

**原因**：遷移時只複製了 `antigravity-accounts.json`，但設定檔 `antigravity.json` 未遷移。

**解決方案**：

同時複製設定檔（如果啟用了 `quota_fallback`）：

::: code-group

```bash [macOS/Linux]
# 複製設定檔
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# 複製設定檔
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### 問題 4：檔案權限錯誤

**現象**：macOS/Linux 上提示 `Permission denied`。

**原因**：檔案權限不正確，外掛無法讀取。

**解決方案**：

```bash
# 修復權限
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## 儲存格式自動遷移詳解

外掛載入帳戶時，會自動偵測儲存版本並遷移：

```
v1 (舊版本)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (目前版本)
```

**遷移規則**：
- v1 → v2：將 `rateLimitResetTime` 拆分為 `claude` 和 `gemini` 兩個欄位
- v2 → v3：將 `gemini` 拆分為 `gemini-antigravity` 和 `gemini-cli`（支援雙配額池）
- 自動清理：過期的速率限制時間會被過濾掉（`> Date.now()`）

::: info 自動去重
載入帳戶時，外掛會根據信箱自動去重，保留最新的帳戶（按 `lastUsed` 和 `addedAt` 排序）。
:::

## 本課小結

遷移帳戶的核心步驟：

1. **定位檔案**：在源機器找到 `antigravity-accounts.json`
2. **複製傳輸**：安全傳輸到目標機器
3. **正確放置**：放到設定目錄（`~/.config/opencode/` 或 `%APPDATA%\opencode\`）
4. **驗證測試**：執行 `opencode auth login` 確認識別

外掛會**自動處理版本遷移**，無需手動修改儲存檔案格式。但如果遇到 `invalid_grant` 錯誤，只能重新認證。

## 下一課預告

> 下一課我們學習 **[ToS 警告](../../tos-warning/)**。
>
> 你會學到：
> - 使用 Antigravity Auth 可能面臨的風險
> - 如何避免帳戶被封禁
> - Google 的服務條款限制

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能        | 檔案路徑                                                                                               | 行號    |
|---|---|---|
| 儲存格式定義 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198)         | 128-198 |
| v1→v2 遷移 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395)         | 366-395 |
| v2→v3 遷移 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431)         | 397-431 |
| 帳戶載入（含自動遷移） | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| 設定目錄路徑 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213)         | 202-213 |
| 檔案去重邏輯 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364)         | 301-364 |

**關鍵介面**：

- `AccountStorageV3`（v3 儲存格式）：
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3`（帳戶元資料）：
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Google 帳戶信箱
    refreshToken: string;              // OAuth refresh token（核心）
    projectId?: string;                // GCP 專案 ID
    managedProjectId?: string;         // 託管專案 ID
    addedAt: number;                   // 新增時間戳
    lastUsed: number;                  // 最後使用時間
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // 速率限制重設時間（v3 支援雙配額池）
    coolingDownUntil?: number;          // 冷卻結束時間
    cooldownReason?: CooldownReason;   // 冷卻原因
  }
  ```

- `RateLimitStateV3`（v3 速率限制狀態）：
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Claude 配額重設時間
    "gemini-antigravity"?: number;    // Gemini Antigravity 配額重設時間
    "gemini-cli"?: number;            // Gemini CLI 配額重設時間
  }
  ```

**關鍵函式**：
- `loadAccounts()`：載入帳戶檔案，自動偵測版本並遷移（storage.ts:433）
- `migrateV1ToV2()`：將 v1 格式遷移到 v2（storage.ts:366）
- `migrateV2ToV3()`：將 v2 格式遷移到 v3（storage.ts:397）
- `deduplicateAccountsByEmail()`：根據信箱去重，保留最新帳戶（storage.ts:301）
- `getStoragePath()`：取得儲存檔案路徑，跨平台相容（storage.ts:215）

**遷移邏輯**：
- 偵測 `data.version` 欄位（storage.ts:446）
- v1：先遷移到 v2，再遷移到 v3（storage.ts:447-457）
- v2：直接遷移到 v3（storage.ts:458-468）
- v3：無需遷移，直接載入（storage.ts:469-470）
- 自動清理過期的速率限制時間（storage.ts:404-410）

</details>
