---
title: "Google Cloud: 多帳號管理 | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud: 多帳號管理"
description: "學習 Google Cloud 多帳號管理方法。瞭解 4 個模型映射關係，掌握 projectId 和 managedProjectId 的使用，一鍵查詢所有帳號額度。"
tags:
  - "Google Cloud"
  - "多帳號管理"
  - "Antigravity"
  - "模型映射"
prerequisite:
  - "start-quick-start"
order: 1
---

# Google Cloud 進階設定：多帳號和模型管理

## 學完你能做什麼

設定多個 Google Cloud 帳號，一鍵查看所有帳號的額度使用情況，瞭解 4 個模型的映射關係（G3 Pro、G3 Image、G3 Flash、Claude），解決單帳號模型額度不足的問題。

## 核心思路

### 多帳號支援

opencode-mystatus 支援同時查詢多個 Google Cloud Antigravity 帳號。每個帳號獨立顯示其 4 個模型的額度，方便你管理多個專案的額度分配。

帳號儲存在 `~/.config/opencode/antigravity-accounts.json` 中，由 `opencode-antigravity-auth` 外掛管理。你需要先安裝該外掛才能新增 Google Cloud 帳號。

### 模型映射關係

Google Cloud Antigravity 提供多個模型，外掛會顯示其中 4 個最常用的：

| 顯示名稱 | 模型 Key（主） | 模型 Key（備選） |
| -------- | -------------- | --------------- |
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

**為什麼有備選 Key？**

某些模型有兩個版本（high/low），外掛會優先顯示主 key 的資料，如果主 key 沒有額度資訊，會自動使用備選 key 的資料。

### Project ID 的使用

查詢額度時需要提供 Project ID，外掛會優先使用 `projectId`，如果不存在則使用 `managedProjectId`。這兩個 ID 都可以在新增帳號時設定。

## 🎒 開始前的準備

::: warning 前置條件
確保你已經：
- [x] 完成快速開始教學（[Quick Start](/zh-tw/vbgate/opencode-mystatus/start/quick-start/)）
- [x] 已安裝 opencode-mystatus 外掛
- [x] 安裝了 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 外掛
:::

## 跟我做

### 第 1 步：新增第一個 Google Cloud 帳號

**為什麼**
第一個帳號是基礎，新增成功後才能測試多帳號查詢。

使用 `opencode-antigravity-auth` 外掛新增帳號。假設你已經安裝了該外掛：

```bash
# 讓 AI 幫你安裝（推薦）
# 在 Claude/OpenCode 中輸入：
Install the opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

安裝完成後，按照該外掛的文件完成 Google OAuth 認證。

**你應該看到**：
- 帳號資訊已儲存到 `~/.config/opencode/antigravity-accounts.json`
- 檔案內容類似：
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### 第 2 步：查詢 Google Cloud 額度

**為什麼**
驗證第一個帳號設定是否正確，查看 4 個模型的額度情況。

```bash
/mystatus
```

**你應該看到**：

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### 第 3 步：新增第二個 Google Cloud 帳號

**為什麼**
當你有多個 Google Cloud 帳號時，可以同時管理多個專案的額度分配。

重複第 1 步的流程，使用另一個 Google 帳號登入。

新增完成後，`antigravity-accounts.json` 檔案會變成：

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### 第 4 步：查看多帳號額度

**為什麼**
確認兩個帳號的額度都正確顯示，方便你規劃各帳號的使用。

```bash
/mystatus
```

**你應該看到**：

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## 踩坑提醒

### 帳號不顯示

**問題**：新增了帳號，但 `mystatus` 沒有顯示。

**原因**：帳號沒有電子郵件欄位。外掛會過濾掉沒有 `email` 的帳號（見原始碼 `google.ts:318`）。

**解決方法**：確保 `antigravity-accounts.json` 中每個帳號都有 `email` 欄位。

### 缺少 Project ID

**問題**：顯示錯誤 "No project ID found"。

**原因**：帳號設定中既沒有 `projectId` 也沒有 `managedProjectId`。

**解決方法**：重新新增帳號時確保填寫了 Project ID。

### 模型資料為空

**問題**：某個模型顯示為 0% 或沒有資料。

**原因**：
1. 該帳號確實沒有使用過該模型
2. 該模型的額度資訊沒有返回（某些模型可能需要特殊權限）

**解決方法**：
- 這是正常情況，只要帳號有額度資料即可
- 如果所有模型都是 0%，檢查帳號權限是否正確

## 本課小結

- 安裝 `opencode-antigravity-auth` 外掛是使用 Google Cloud 額度查詢的前提
- 支援多帳號同時查詢，每個帳號獨立顯示 4 個模型的額度
- 模型映射關係：G3 Pro（支援 high/low）、G3 Image、G3 Flash、Claude（支援 thinking/normal）
- 外掛優先使用 `projectId`，不存在則使用 `managedProjectId`
- 帳號必須包含 `email` 欄位才會被查詢

## 下一課預告

> 下一課我們學習 **[GitHub Copilot 認證設定](/zh-tw/vbgate/opencode-mystatus/advanced/copilot-auth/)**。
>
> 你會學到：
> - 兩種 Copilot 認證方式：OAuth Token 和 Fine-grained PAT
> - 如何解決 Copilot 權限問題
> - 不同訂閱類型的額度差異

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 模型設定映射 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| 多帳號並行查詢 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| 帳號過濾（必須有電子郵件） | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Project ID 優先級 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| 模型額度提取 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| AntigravityAccount 類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**關鍵常數**：
- `MODELS_TO_DISPLAY`：4 個模型的設定（key、altKey、display）
- `GOOGLE_QUOTA_API_URL`：Google Cloud 額度 API 位址
- `USER_AGENT`：請求 User-Agent（antigravity/1.11.9）

**關鍵函數**：
- `queryGoogleUsage()`：查詢所有 Google Cloud 帳號的額度
- `fetchAccountQuota()`：查詢單個帳號的額度（包含 Token 重新整理）
- `extractModelQuotas()`：從 API 回應中提取 4 個模型的額度資訊
- `formatAccountQuota()`：格式化單個帳號的額度輸出

</details>
