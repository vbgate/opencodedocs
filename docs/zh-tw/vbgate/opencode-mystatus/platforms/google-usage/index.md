---
title: "Google Cloud 額度查詢 | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud 額度查詢"
description: "學習 Google Cloud 額度查詢方法。查看 G3 Pro、G3 Image、G3 Flash 和 Claude 模型的剩餘額度和重置時間，管理多個 Antigravity 帳號。"
tags:
  - "Google Cloud"
  - "Antigravity"
  - "額度查詢"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 4
---

# Google Cloud 額度查詢：G3 Pro/Image/Flash 和 Claude

## 學完你能做什麼

- 查看 Google Cloud Antigravity 帳號的 4 個模型額度
- 理解每個模型的重置時間和剩餘百分比
- 管理多個 Google Cloud 帳號的額度使用

## 你現在的困境

Google Cloud Antigravity 提供多個模型（G3 Pro、G3 Image、G3 Flash、Claude），每個模型有獨立的額度和重置時間。你需要：
- 分別登入 Google Cloud 控制台查看每個模型的狀態
- 手動計算剩餘額度和重置時間
- 管理多個帳號時更加混亂

## 什麼時候用這一招

當你：
- 想快速瞭解所有 Google Cloud 模型的剩餘額度
- 需要規劃在不同模型間的使用分配
- 有多個 Google Cloud 帳號需要統一管理

## 🎒 開始前的準備

::: warning 前置檢查

1. **已安裝 mystatus 外掛**：參考 [快速開始](/zh-tw/vbgate/opencode-mystatus/start/quick-start/)
2. **已配置 Google Cloud 認證**：需要先安裝 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 外掛完成 OAuth 認證
3. **認證檔案存在**：`~/.config/opencode/antigravity-accounts.json` 至少包含一個帳號

:::

## 核心思路

Google Cloud Antigravity 透過 OAuth 機制認證，每個帳號有獨立的 Refresh Token。mystatus 外掛會：
1. 讀取 `antigravity-accounts.json` 取得所有已配置帳號
2. 使用 Refresh Token 刷新 Access Token
3. 呼叫 Google Cloud API 取得所有模型的額度
4. 按帳號分組顯示 4 個模型的額度和重置時間

## Google Cloud 支援的模型

mystatus 顯示以下 4 個模型的額度：

| 顯示名稱 | 模型 Key（主/備） | 說明 |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Gemini 3 Pro 高效能版本 |
| G3 Image | `gemini-3-pro-image` | Gemini 3 Pro 影像生成 |
| G3 Flash | `gemini-3-flash` | Gemini 3 Flash 快速版本 |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude Opus 4.5 模型 |

**主 Key 和備 Key 機制**：
- API 回應中可能只返回主 key 或備 key 的資料
- mystatus 會自動嘗試取得任一 key 的額度
- 例如：如果 `gemini-3-pro-high` 沒有資料，會嘗試 `gemini-3-pro-low`

## 跟我做

### 第 1 步：執行查詢指令

**為什麼**
快速取得所有 Google Cloud 帳號的額度資訊

```
/mystatus
```

**你應該看到**
包含所有已配置平台的額度資訊，其中 Google Cloud 部分會顯示類似以下內容：

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### 第 2 步：理解輸出格式

**為什麼**
快速定位關鍵資訊：剩餘額度和重置時間

每行格式：
```
[模型名] [重置時間] [進度條] [剩餘百分比]
```

**欄位說明**：
- **模型名**：G3 Pro、G3 Image、G3 Flash、Claude
- **重置時間**：距離下次額度的剩餘時間（如 `4h 59m`、`2d 9h`）
- **進度條**：可視化顯示剩餘百分比
- **剩餘百分比**：0-100 的數值

**你應該看到**
每個模型一行，清晰顯示額度和重置時間

### 第 3 步：查看多帳號情況

**為什麼**
如果你有多個 Google Cloud 帳號，會分別顯示

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░░ 75%
G3 Image   2h 30m     ████████████░░░░░░░░░ 75%
```

**你應該看到**
每個帳號單獨一個區塊，包含該帳號的 4 個模型額度

### 第 4 步：檢查額度警告

**為什麼**
避免超額使用導致服務中斷

如果任一模型的使用率超過 80%，會顯示警告提示：

```
### user@gmail.com

G3 Pro     1h 30m     ████░░░░░░░░░░░░░░░░░ 20%
G3 Image   1h 30m     ████░░░░░░░░░░░░░░░░░ 20%

⚠️ 使用率已達到或超過 80%
```

**你應該看到**
警告提示出現在對應帳號的模型列表下方

## 檢查點 ✅

完成以下檢查，確保你做對了：

- [ ] 執行 `/mystatus` 後能看到 Google Cloud 額度資訊
- [ ] 能理解 4 個模型的名稱和重置時間
- [ ] 能識別進度條和剩餘百分比
- [ ] 如果有多帳號，能看到所有帳號的額度

## 踩坑提醒

### 問題 1：看不到 Google Cloud 額度

**可能原因**：
- 未安裝 opencode-antigravity-auth 外掛
- 未完成 Google OAuth 認證
- `antigravity-accounts.json` 檔案不存在或為空

**解決方案**：
1. 安裝 opencode-antigravity-auth 外掛
2. 按照 GitHub 儲存庫的說明完成認證
3. 重新執行 `/mystatus`

### 問題 2：某個帳號顯示錯誤

**可能原因**：
- Refresh Token 過期
- projectId 缺失

**錯誤範例**：
```
user@gmail.com: No project ID found
```

**解決方案**：
1. 重新使用 opencode-antigravity-auth 外掛認證該帳號
2. 確保在認證過程中正確設定了專案 ID

### 問題 3：模型顯示"-"或重置時間異常

**可能原因**：
- API 返回的 resetTime 欄位缺失或格式異常
- 該模型暫無額度資訊

**解決方案**：
- 這是正常的，mystatus 會顯示"-"表示資料不可用
- 如所有模型都顯示"-"，檢查網路連線或 Google Cloud API 狀態

## 本課小結

- Google Cloud Antigravity 支援 4 個模型：G3 Pro、G3 Image、G3 Flash、Claude
- 每個模型有獨立的額度和重置時間
- 支援多帳號管理，每個帳號單獨顯示
- 使用率超過 80% 時會顯示警告提示

## 下一課預告

> 下一課我們學習 **[Google Cloud 進階設定：多帳號和模型管理](../../advanced/google-setup/)**。
>
> 你會學到：
> - 如何新增和管理多個 Google Cloud 帳號
> - 理解 4 個模型的映射關係
> - projectId 和 managedProjectId 的區別

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能          | 檔案路徑                                                                                                                  | 行號    |
|--- | --- | ---|
| 模型設定      | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78)                    | 69-78   |
| 帳號查詢邏輯  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370)                   | 304-370 |
| Token 重新整理    | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184)                   | 162-184 |
| 額度提取      | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L132-L157)                   | 132-157 |
| 格式化輸出    | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294)                   | 265-294 |
| 類型定義      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)                      | 78-94   |

**關鍵常數**：
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`：Google Cloud 額度查詢 API
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`：OAuth Token 重新整理 API
- `USER_AGENT = "antigravity/1.11.9 windows/amd64"`：API 請求 User-Agent

**關鍵函數**：
- `queryGoogleUsage()`：查詢所有 Antigravity 帳號的額度
- `fetchAccountQuota()`：查詢單個帳號的額度
- `extractModelQuotas()`：從 API 回應中提取 4 個模型的額度
- `formatAccountQuota()`：格式化單個帳號的額度顯示

**模型映射規則**：
- G3 Pro 支援 `gemini-3-pro-high` 和 `gemini-3-pro-low`，優先使用主 key
- Claude 支援 `claude-opus-4-5-thinking` 和 `claude-opus-4-5`，優先使用主 key
- G3 Image 和 G3 Flash 只有一個 key

</details>
