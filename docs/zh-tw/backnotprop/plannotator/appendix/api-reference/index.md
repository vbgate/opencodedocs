---
title: "API 參考: 本機介面文件 | plannotator"
sidebarTitle: "API 一查便知"
subtitle: "API 參考: 本機介面文件 | plannotator"
description: "瞭解 Plannotator 提供的所有 API 端點和請求/回應格式。詳細介紹計畫審查、程式碼審查、圖片上傳等介面的完整規範，方便整合開發。"
tags:
  - "API"
  - "附錄"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API 參考

## 學完你能做什麼

- 瞭解 Plannotator 本機伺服器提供的所有 API 端點
- 檢視每個 API 的請求和回應格式
- 理解計畫審查和程式碼審查的介面差異
- 為整合或擴充開發提供參考

## 概述

Plannotator 在本機執行 HTTP 伺服器（使用 Bun.serve），為計畫審查和程式碼審查提供 RESTful API。所有 API 回應格式為 JSON，無認證要求（本機隔離環境）。

**伺服器啟動方式**：
- 隨機連接埠（本機模式）
- 固定連接埠 19432（遠端/Devcontainer 模式，可透過 `PLANNOTATOR_PORT` 覆寫）

**API 基礎 URL**：`http://localhost:<PORT>/api/`

::: tip 提示
以下 API 按功能模組分類，相同路徑在計畫審查和程式碼審查伺服器中的行為可能不同。
:::

## 計畫審查 API

### GET /api/plan

取得目前計畫內容及相關元資訊。

**請求**：無

**回應範例**：

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| 欄位 | 類型 | 說明 |
|--- | --- | ---|
| `plan` | string | 計畫的 Markdown 內容 |
| `origin` | string | 來源識別碼（`"claude-code"` 或 `"opencode"`） |
| `permissionMode` | string | 目前權限模式（Claude Code 專用） |
| `sharingEnabled` | boolean | 是否啟用 URL 分享 |

---

### POST /api/approve

核准目前計畫，可選擇儲存到筆記應用程式。

**請求主體**：

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "核准時的備註（僅 OpenCode）",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**回應範例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**欄位說明**：

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `obsidian` | object | 否 | Obsidian 儲存設定 |
| `bear` | object | 否 | Bear 儲存設定 |
| `feedback` | string | 否 | 核准時附帶的備註（僅 OpenCode） |
| `agentSwitch` | string | 否 | 切換到的 Agent 名稱（僅 OpenCode） |
| `permissionMode` | string | 否 | 請求的權限模式（僅 Claude Code） |
| `planSave` | object | 否 | 計畫儲存設定 |

**Obsidian 設定欄位**：

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `vaultPath` | string | 是 | Vault 檔案路徑 |
| `folder` | string | 否 | 目標資料夾（預設根目錄） |
| `tags` | string[] | 否 | 自動產生的標籤 |
| `plan` | string | 是 | 計畫內容 |

---

### POST /api/deny

拒絕目前計畫並回饋意見。

**請求主體**：

```json
{
  "feedback": "需要補充單元測試覆蓋",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**回應範例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**欄位說明**：

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `feedback` | string | 否 | 拒絕理由（預設 "Plan rejected by user"） |
| `planSave` | object | 否 | 計畫儲存設定 |

---

### GET /api/obsidian/vaults

偵測本機已設定的 Obsidian vaults。

**請求**：無

**回應範例**：

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**設定檔路徑**：
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## 程式碼審查 API

### GET /api/diff

取得目前 git diff 內容。

**請求**：無

**回應範例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| 欄位 | 類型 | 說明 |
|--- | --- | ---|
| `rawPatch` | string | Git diff 統一格式 patch |
| `gitRef` | string | 使用的 Git 參照 |
| `origin` | string | 來源識別碼 |
| `diffType` | string | 目前 diff 類型 |
| `gitContext` | object | Git 上下文資訊 |
| `sharingEnabled` | boolean | 是否啟用 URL 分享 |

**gitContext 欄位說明**：

| 欄位 | 類型 | 說明 |
|--- | --- | ---|
| `currentBranch` | string | 目前分支名稱 |
| `defaultBranch` | string | 預設分支名稱（main 或 master） |
| `diffOptions` | object[] | 可用的 diff 類型選項（包含 id 和 label） |

---

### POST /api/diff/switch

切換到不同類型的 git diff。

**請求主體**：

```json
{
  "diffType": "staged"
}
```

**支援的 diff 類型**：

| 類型 | Git 指令 | 說明 |
|--- | --- | ---|
| `uncommitted` | `git diff HEAD` | 未提交的變更（預設） |
| `staged` | `git diff --staged` | 已暫存的變更 |
| `last-commit` | `git diff HEAD~1..HEAD` | 最後一次提交 |
| `vs main` | `git diff main..HEAD` | 目前分支 vs main |

**回應範例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

提交程式碼審查回饋給 AI Agent。

**請求主體**：

```json
{
  "feedback": "建議添加錯誤處理邏輯",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "這裡應該用 try-catch",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**欄位說明**：

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `feedback` | string | 否 | 文字回饋（LGTM 或其他） |
| `annotations` | array | 否 | 結構化註解陣列 |
| `agentSwitch` | string | 否 | 切換到的 Agent 名稱（僅 OpenCode） |

**annotation 物件欄位**：

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `id` | string | 是 | 唯一識別碼 |
| `type` | string | 是 | 類型：`comment`、`suggestion`、`concern` |
| `filePath` | string | 是 | 檔案路徑 |
| `lineStart` | number | 是 | 起始行號 |
| `lineEnd` | number | 是 | 結束行號 |
| `side` | string | 是 | 側：`"old"` 或 `"new"` |
| `text` | string | 否 | 評論內容 |
| `suggestedCode` | string | 否 | 建議程式碼（suggestion 類型） |

**回應範例**：

```json
{
  "ok": true
}
```

---

## 共用 API

### GET /api/image

取得圖片（本機檔案路徑或上傳的暫存檔案）。

**請求參數**：

| 參數 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `path` | string | 是 | 圖片檔案路徑 |

**範例請求**：`GET /api/image?path=/tmp/plannotator/abc-123.png`

**回應**：圖片檔案（PNG/JPEG/WebP）

**錯誤回應**：
- `400` - 缺少 path 參數
- `404` - 檔案不存在
- `500` - 讀取檔案失敗

---

### POST /api/upload

上傳圖片到暫存目錄，回傳可存取的路徑。

**請求**：`multipart/form-data`

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `file` | File | 是 | 圖片檔案 |

**支援的格式**：PNG、JPEG、WebP

**回應範例**：

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**錯誤回應**：
- `400` - 未提供檔案
- `500` - 上傳失敗

::: info 說明
上傳的圖片儲存在 `/tmp/plannotator` 目錄，伺服器關閉後不會自動清理。
:::

---

### GET /api/agents

取得可用的 OpenCode Agents 清單（僅 OpenCode）。

**請求**：無

**回應範例**：

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**過濾規則**：
- 只回傳 `mode === "primary"` 的 agents
- 排除 `hidden === true` 的 agents

**錯誤回應**：

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## 錯誤處理

### HTTP 狀態碼

| 狀態碼 | 說明 |
|--- | ---|
| `200` | 請求成功 |
| `400` | 參數驗證失敗 |
| `404` | 資源不存在 |
| `500` | 伺服器內部錯誤 |

### 錯誤回應格式

```json
{
  "error": "錯誤描述資訊"
}
```

### 常見錯誤

| 錯誤 | 觸發條件 |
|--- | ---|
| `Missing path parameter` | `/api/image` 缺少 `path` 參數 |
| `File not found` | `/api/image` 指定的檔案不存在 |
| `No file provided` | `/api/upload` 未上傳檔案 |
| `Missing diffType` | `/api/diff/switch` 缺少 `diffType` 欄位 |
| `Port ${PORT} in use` | 連接埠已被佔用（伺服器啟動失敗） |

---

## 伺服器行為

### 連接埠重試機制

- 最大重試次數：5 次
- 重試延遲：500 毫秒
- 逾時錯誤：`Port ${PORT} in use after 5 retries`

::: warning 遠端模式提示
遠端/Devcontainer 模式下，如果連接埠被佔用，可以透過設定 `PLANNOTATOR_PORT` 環境變數使用其他連接埠。
:::

### 決策等待

伺服器啟動後進入等待使用者決策的狀態：

**計畫審查伺服器**：
- 等待 `/api/approve` 或 `/api/deny` 呼叫
- 呼叫後回傳決策並關閉伺服器

**程式碼審查伺服器**：
- 等待 `/api/feedback` 呼叫
- 呼叫後回傳回饋並關閉伺服器

### SPA 回退

所有未匹配的路徑回傳嵌入式 HTML（單頁應用程式）：

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

這確保了前端路由正常運作。

---

## 環境變數

| 變數 | 說明 | 預設值 |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | 啟用遠端模式 | 未設定 |
| `PLANNOTATOR_PORT` | 固定連接埠號 | 隨機（本機）/ 19432（遠端） |
| `PLANNOTATOR_ORIGIN` | 來源識別碼 | `"claude-code"` 或 `"opencode"` |
| `PLANNOTATOR_SHARE` | 停用 URL 分享 | 未設定（啟用） |

::: tip 提示
更多環境變數設定詳見 [環境變數設定](../../advanced/environment-variables/) 章節。
:::

---

## 本課小結

Plannotator 提供了完整的本機 HTTP API，支援計畫審查和程式碼審查兩大核心功能：

- **計畫審查 API**：取得計畫、核准/拒絕決策、Obsidian/Bear 整合
- **程式碼審查 API**：取得 diff、切換 diff 類型、提交結構化回饋
- **共用 API**：圖片上傳下載、Agent 清單查詢
- **錯誤處理**：統一的 HTTP 狀態碼和錯誤格式

所有 API 都在本機執行，無資料上傳，安全可靠。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 計畫審查伺服器進入點 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents（計畫審查） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| 程式碼審查伺服器進入點 | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents（程式碼審查） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**關鍵常數**：
- `MAX_RETRIES = 5`：伺服器啟動最大重試次數（`packages/server/index.ts:79`、`packages/server/review.ts:68`）
- `RETRY_DELAY_MS = 500`：連接埠重試延遲（`packages/server/index.ts:80`、`packages/server/review.ts:69`）

**關鍵函式**：
- `startPlannotatorServer(options)`：啟動計畫審查伺服器（`packages/server/index.ts:91`）
- `startReviewServer(options)`：啟動程式碼審查伺服器（`packages/server/review.ts:79`）

</details>
