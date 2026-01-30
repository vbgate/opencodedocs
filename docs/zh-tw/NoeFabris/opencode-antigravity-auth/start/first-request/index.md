---
title: "第一個請求: 驗證 Antigravity 安裝 | opencode-antigravity-auth"
sidebarTitle: "發送第一條請求"
description: "學習發送第一個 Antigravity 模型請求，驗證 OAuth 認證和設定是否正確。掌握模型選擇、variant 參數使用和常見錯誤排查方法。"
subtitle: "第一個請求：驗證安裝成功"
tags:
  - "安裝驗證"
  - "模型請求"
  - "快速開始"
prerequisite:
  - "start-quick-install"
order: 4
---

# 第一個請求：驗證安裝成功

## 學完你能做什麼

- 發送第一個 Antigravity 模型請求
- 理解 `--model` 和 `--variant` 參數的作用
- 根據需求選擇合適的模型和思考設定
- 排查常見的模型請求錯誤

## 你現在的困境

剛安裝完外掛，完成了 OAuth 認證，設定了模型定義，但現在不確定：
- 外掛真的能正常運作嗎？
- 應該用什麼模型開始測試？
- `--variant` 參數怎麼用？
- 如果請求失敗了，怎麼知道是哪一步出了問題？

## 什麼時候用這一招

在以下場景使用本課的驗證方法：
- **首次安裝後** — 確認認證、設定、模型都能正常運作
- **新增新帳號後** — 驗證新帳號是否可用
- **更換模型設定後** — 確認新模型設定正確
- **遇到問題前** — 建立基準，方便後續對比

## 🎒 開始前的準備

::: warning 前置檢查

在繼續之前，請確認：

- ✅ 已完成 [快速安裝](/zh-tw/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- ✅ 已執行 `opencode auth login` 完成 OAuth 認證
- ✅ `~/.config/opencode/opencode.json` 中已加入模型定義
- ✅ OpenCode 終端機或 CLI 可用

:::

## 核心思路

### 為什麼需要先驗證

外掛涉及多個元件的協作：
1. **OAuth 認證** — 取得存取權杖
2. **帳號管理** — 選擇可用帳號
3. **請求轉換** — 將 OpenCode 格式轉換為 Antigravity 格式
4. **串流響應** — 處理 SSE 響應並轉換回 OpenCode 格式

發送第一個請求可以驗證整個鏈路是否暢通。如果成功，說明所有元件都正常運作；如果失敗，可以根據錯誤訊息定位問題。

### Model 和 Variant 的關係

在 Antigravity 外掛中，**模型和 variant 是兩個獨立的概念**：

| 概念 | 作用 | 範例 |
|---|---|---|
| **Model（模型）** | 選擇具體的 AI 模型 | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant（變體）** | 設定模型的思考預算或模式 | `low`（輕量思考）、`max`（最大思考） |

::: info 思考預算是什麼？

思考預算（thinking budget）是指模型在生成回答前可以用於「思考」的 token 數量。更高的預算意味著模型有更多時間進行推理，但也會增加響應時間和成本。

- **Claude Thinking 模型**：用 `thinkingConfig.thinkingBudget` 設定（單位：token）
- **Gemini 3 模型**：用 `thinkingLevel` 設定（字串級別：minimal/low/medium/high）

:::

### 推薦的入門組合

不同需求的推薦模型和 variant 組合：

| 需求 | 模型 | Variant | 特點 |
|---|---|---|---|
| **快速測試** | `antigravity-gemini-3-flash` | `minimal` | 響應最快，適合驗證 |
| **日常開發** | `antigravity-claude-sonnet-4-5-thinking` | `low` | 平衡速度和品質 |
| **複雜推理** | `antigravity-claude-opus-4-5-thinking` | `max` | 最強推理能力 |
| **視覺任務** | `antigravity-gemini-3-pro` | `high` | 多模態支援（圖片/PDF） |

## 跟我做

### 第 1 步：發送最簡單的測試請求

先用最簡單的命令測試基本連線是否正常。

**為什麼**
這個請求不使用 thinking 功能，返回極快，適合快速驗證認證和帳號狀態。

**執行命令**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**你應該看到**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip 成功標誌

如果看到了 AI 的回覆，說明：
- ✅ OAuth 認證成功
- ✅ 帳號有存取權限
- ✅ 請求轉換正常運作
- ✅ 串流響應正確解析

:::

### 第 2 步：使用 Thinking 模型和 Variant

現在測試完整的思考流程，包括 variant 參數。

**為什麼**
Thinking 模型需要額外的請求轉換邏輯，這是外掛的核心功能之一。

**執行命令**

```bash
opencode run "解釋什麼是閉包，用簡單的比喻" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**你應該看到**

1. **串流思考輸出**：你會看到模型先輸出思考過程（帶 `<thinking>` 標記）
2. **思考過程**：模型會詳細分析如何組織回答
3. **最終回答**：思考完成後輸出最終內容

::: details 看個完整的響應範例

```
<thinking>
使用者問的是什麼是閉包，需要用簡單的比喻來解釋。

閉包的概念：
1. 函式可以存取其外部作用域的變數
2. 即使外部函式已經執行完畢
3. 這個能力就像「背包」一樣

比喻思路：
- 可以用「背包」比喻
- 函式返回時帶上了一些變數
- 就像出門時包裡裝了家裡的東西
</thinking>

閉包就像是函式的一個「背包」。

當函式被建立時，它會「打包」自己能存取的外部變數，就像出門前把家裡需要的東西裝進背包。即使函式離開了建立它的地方（外部函式執行完畢），它依然可以透過這個「背包」存取那些變數。

舉個例子：
```javascript
function createCounter() {
  let count = 0;  // 這個變數被裝進「背包」
  return function() {
    count++;  // 還能存取背包裡的變數
    return count;
  };
}
```
```

:::

**檢查點 ✅**

- [ ] 看到了 `<thinking>` 塊（如果設定了 `keep_thinking: true`）
- [ ] 回答內容合理且有邏輯
- [ ] 響應時間在可接受範圍內（通常 2-10 秒）

### 第 3 步：測試 Gemini 3 模型

測試 Gemini 3 Pro 的不同思考級別。

**為什麼**
Gemini 3 使用字串級別的 `thinkingLevel`，驗證對不同模型家族的支持。

**執行命令**

```bash
# 測試 Gemini 3 Flash（快速響應）
opencode run "寫一個氣泡排序" --model=google/antigravity-gemini-3-flash --variant=low

# 測試 Gemini 3 Pro（深度思考）
opencode run "分析氣泡排序的時間複雜度" --model=google/antigravity-gemini-3-pro --variant=high
```

**你應該看到**

- Flash 模型響應更快（適合簡單任務）
- Pro 模型思考更深入（適合複雜分析）
- 兩個模型都正常運作

### 第 4 步：測試多模態能力（可選）

如果你的模型設定支援圖片輸入，可以測試多模態功能。

**為什麼**
Antigravity 支援圖片/PDF 輸入，這是很多場景需要的功能。

**準備一張測試圖片**：任意圖片檔案（如 `test.png`）

**執行命令**

```bash
opencode run "描述這張圖片的內容" --model=google/antigravity-gemini-3-pro --image=test.png
```

**你應該看到**

- 模型準確描述了圖片內容
- 響應包含視覺分析結果

## 檢查點 ✅

完成上述測試後，確認以下清單：

| 檢查項 | 預期結果 | 狀態 |
|---|---|---|
| **基礎連接** | 第 1 步的簡單請求成功 | ☐ |
| **Thinking 模型** | 第 2 步看到思考過程 | ☐ |
| **Gemini 3 模型** | 第 3 步兩個模型都正常 | ☐ |
| **Variant 參數** | 不同 variant 產生不同結果 | ☐ |
| **串流輸出** | 響應即時顯示，無中斷 | ☐ |

::: tip 全部通過？

如果所有檢查項都通過，恭喜你！外掛已完全設定好，可以開始正式使用。

下一步可以：
- [探索可用模型](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [設定多帳號負載平衡](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [啟用 Google Search](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## 踩坑提醒

### 錯誤 1：`Model not found`

**錯誤訊息**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**原因**
模型定義沒有正確加入到 `opencode.json` 的 `provider.google.models` 中。

**解決方法**

檢查設定檔：

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

確認模型定義格式正確：

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning 注意拼寫

模型名稱必須與設定檔中的 key 完全一致（區分大小寫）：

- ❌ 錯誤：`--model=google/claude-sonnet-4-5`
- ✅ 正確：`--model=google/antigravity-claude-sonnet-4-5`

:::

### 錯誤 2：`403 Permission Denied`

**錯誤訊息**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**原因**
1. OAuth 認證未完成
2. 帳號沒有存取權限
3. Project ID 設定問題（針對 Gemini CLI 模型）

**解決方法**

1. **檢查認證狀態**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   應該看到至少一個帳號記錄。

2. **如果帳號為空或認證失敗**：
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **如果是 Gemini CLI 模型報錯**：
   需要手動設定 Project ID（詳見 [FAQ - 403 Permission Denied](/zh-tw/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/)）

### 錯誤 3：`Invalid variant 'max'`

**錯誤訊息**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**原因**
不同模型支援的 variant 設定格式不同。

**解決方法**

檢查模型設定中的 variant 定義：

| 模型類型 | Variant 格式 | 範例值 |
|---|---|---|
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**正確設定範例**：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### 錯誤 4：請求逾時或無響應

**症狀**
指令執行後長時間無輸出，或最終逾時。

**可能原因**
1. 網路連線問題
2. 伺服器響應緩慢
3. 所有帳號都處於速率限制狀態

**解決方法**

1. **檢查網路連線**：
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **查看除錯日誌**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **檢查帳號狀態**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   如果看到所有帳號都有 `rateLimit` 時間戳，說明都被限速了，需要等待重置。

### 錯誤 5：SSE 串流輸出中斷

**症狀**
響應中途停止，或只看到部分內容。

**可能原因**
1. 網路不穩定
2. 帳號權杖在請求過程中過期
3. 伺服器錯誤

**解決方法**

1. **啟用除錯日誌查看詳細資訊**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **檢查日誌檔案**：
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **如果頻繁中斷**：
   - 嘗試切換到更穩定的網路環境
   - 使用非 Thinking 模型減少請求時間
   - 檢查帳號是否接近配額限制

## 本課小結

發送第一個請求是驗證安裝成功的關鍵步驟。透過本課，你學會了：

- **基本請求**：使用 `opencode run --model` 發送請求
- **Variant 使用**：透過 `--variant` 設定思考預算
- **模型選擇**：根據需求選擇 Claude 或 Gemini 模型
- **問題排查**：根據錯誤訊息定位和解決問題

::: tip 建議的實踐

在日常開發中：

1. **先用簡單測試**：每次設定變更後，先發一個簡單請求驗證
2. **逐步增加複雜度**：從無 thinking → low thinking → max thinking
3. **記錄基線響應**：記住正常情況下的響應時間，方便對比
4. **善用除錯日誌**：遇到問題時，開啟 `OPENCODE_ANTIGRAVITY_DEBUG=2`

---

## 下一課預告

> 下一課我們學習 **[可用模型全覽](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**。
>
> 你會學到：
> - 所有可用模型的完整列表和特點
> - Claude 和 Gemini 模型的選擇指南
> - 上下文限制和輸出限制對比
> - Thinking 模型的最佳使用場景

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|---|---|---|
| 請求轉換入口 | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| 帳號選擇與權杖管理 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude 模型轉換 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 全文 |
| Gemini 模型轉換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 全文 |
| 串流響應處理 | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | 全文 |
| 除錯日誌系統 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全文 |

**關鍵函式**：
- `prepareAntigravityRequest()`：將 OpenCode 請求轉換為 Antigravity 格式（`request.ts`）
- `createStreamingTransformer()`：建立串流響應轉換器（`core/streaming/`）
- `resolveModelWithVariant()`：解析模型和 variant 設定（`transform/model-resolver.ts`）
- `getCurrentOrNextForFamily()`：選擇帳號進行請求（`accounts.ts`）

**設定範例**：
- 模型設定格式：[`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Variant 詳細說明：[`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
