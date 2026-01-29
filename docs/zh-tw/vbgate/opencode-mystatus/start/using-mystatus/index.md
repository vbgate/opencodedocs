---
title: "使用 mystatus: 斜線指令與自然語言查詢 | opencode-mystatus"
sidebarTitle: "使用方法"
subtitle: "使用 mystatus：斜線指令和自然語言"
description: "學習 opencode-mystatus 的兩種查詢方式：斜線指令 /mystatus 和自然語言提問，如何快速查看多個 AI 平台的額度使用情況。"
tags:
  - "快速開始"
  - "斜線指令"
  - "自然語言"
prerequisite:
  - "start-quick-start"
order: 2
---

# 使用 mystatus：斜線指令和自然語言

## 學完你能做什麼

- 使用 `/mystatus` 斜線指令一鍵查詢所有 AI 平台額度
- 用自然語言提問讓 OpenCode 自動呼叫 mystatus 工具
- 理解斜線指令和自然語言兩種觸發方式的區別和適用場景

## 你現在的困境

你在使用多個 AI 平台開發（OpenAI、智證 AI、GitHub Copilot 等），想知道每個平台還剩多少額度，但不想逐個登入各平台查看——太麻煩了。

## 什麼時候用這一招

- **需要快速查看所有平台額度時**：每天開發前檢查一下，合理安排使用
- **想知道某個平台具體額度時**：比如想確認 OpenAI 是否快用完了
- **想檢查配置是否生效時**：剛配置好新帳號，驗證一下能否正常查詢

::: info 前置檢查

本教學假設你已完成[opencode-mystatus 外掛安裝](/zh-tw/vbgate/opencode-mystatus/start/quick-start/)。如果還沒有安裝，請先完成安裝步驟。

:::

## 核心思路

opencode-mystatus 提供了兩種觸發 mystatus 工具的方式：

1. **斜線指令 `/mystatus`**：快速、直接、無歧義，適合頻繁查詢
2. **自然語言提問**：更靈活，適合結合具體場景的查詢

兩種方式都會呼叫同一個 `mystatus` 工具，工具會並行查詢所有已配置的 AI 平台額度，返回帶進度條、使用統計和重置倒數計時的結果。

## 跟我做

### 第 1 步：使用斜線指令查詢額度

在 OpenCode 中輸入以下指令：

```bash
/mystatus
```

**為什麼**
斜線指令是 OpenCode 的快捷指令機制，可以快速呼叫預定義的工具。`/mystatus` 指令會直接呼叫 mystatus 工具，無需額外參數。

**你應該看到**：
OpenCode 會返回所有已配置平台的額度資訊，格式如下：

```
## OpenAI 帳號額度

Account:        user@example.com (team)

3小時限額
███████████████████████████ 剩餘 85%
重置: 2h 30m後

## 智證 AI 帳號額度

Account:        9c89****AQVM (Coding Plan)

5小時 token 限額
███████████████████████████ 剩餘 95%
已用: 0.5M / 10.0M
重置: 4h後
```

每個平台會顯示：
- 帳號資訊（郵件或脫敏後的 API Key）
- 進度條（可視化顯示剩餘額度）
- 重置時間倒數計時
- 已用量和總量（部分平台）

### 第 2 步：用自然語言提問

除了斜線指令，你也可以用自然語言提問，OpenCode 會自動識別意圖並呼叫 mystatus 工具。

試試這些提問方式：

```bash
Check my OpenAI quota
```

或

```bash
How much Codex quota do I have left?
```

或

```bash
Show my AI account status
```

**為什麼**
自然語言查詢更符合日常對話習慣，適合在具體開發場景中提出問題。OpenCode 會透過語意匹配識別出你想查詢額度，並自動呼叫 mystatus 工具。

**你應該看到**：
與斜線指令相同的輸出結果，只是觸發方式不同。

### 第 3 步：理解斜線指令的配置

斜線指令 `/mystatus` 是如何工作的？它是在 OpenCode 配置檔中定義的。

開啟 `~/.config/opencode/opencode.json`，找到 `command` 部分：

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

**關鍵配置項說明**：

| 配置項 | 值 | 作用 |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | 在指令清單中顯示的說明 |
| `template` | "Use to mystatus tool..." | 提示 OpenCode 如何處理這個指令 |

**為什麼需要 template**
template 是給 OpenCode 的"指令"，告訴它：當使用者輸入 `/mystatus` 時，呼叫 mystatus 工具，並將結果原樣返回給使用者（不做任何修改）。

## 檢查點 ✅

確認你已經掌握了兩種使用方式：

| 技能 | 檢查方法 | 預期結果 |
|--- | --- | ---|
| 斜線指令查詢 | 輸入 `/mystatus` | 顯示所有平台的額度資訊 |
| 自然語言查詢 | 輸入 "Check my OpenAI quota" | 顯示額度資訊 |
| 理解配置 | 查看 opencode.json | 找到 mystatus 指令配置 |

## 踩坑提醒

### 常見錯誤 1：斜線指令無回應

**現象**：輸入 `/mystatus` 後沒有任何反應

**原因**：OpenCode 配置檔沒有正確配置斜線指令

**解決方法**：
1. 開啟 `~/.config/opencode/opencode.json`
2. 確認 `command` 部分包含 `mystatus` 配置（見第 3 步）
3. 重新啟動 OpenCode

### 常見錯誤 2：自然語言提問沒有呼叫 mystatus 工具

**現象**：輸入 "Check my OpenAI quota" 後，OpenCode 沒有呼叫 mystatus 工具，而是嘗試自己回答

**原因**：OpenCode 沒有正確識別你的意圖

**解決方法**：
1. 嘗試更明確的表達："Use mystatus tool to check my OpenAI quota"
2. 或直接使用斜線指令 `/mystatus`，更可靠

### 常見錯誤 3：顯示"未找到任何已配置的帳號"

**現象**：執行 `/mystatus` 後顯示"未找到任何已配置的帳號"

**原因**：還沒有配置任何平台的認證資訊

**解決方法**：
- 至少配置一個平台的認證資訊（OpenAI、智證 AI、Z.ai、GitHub Copilot 或 Google Cloud）
- 詳見 [快速開始教學](/zh-tw/vbgate/opencode-mystatus/start/quick-start/) 中的配置說明

## 本課小結

mystatus 工具提供了兩種使用方式：
1. **斜線指令 `/mystatus`**：快速直接，適合頻繁查詢
2. **自然語言提問**：更靈活，適合結合具體場景

兩種方式都會並行查詢所有已配置的 AI 平台額度，返回帶進度條和重置倒數計時的結果。斜線指令的配置在 `~/.config/opencode/opencode.json` 中定義，透過 template 指示 OpenCode 如何呼叫 mystatus 工具。

## 下一課預告

> 下一課我們學習 **[解讀輸出：進度條、重置時間和多帳號](/zh-tw/vbgate/opencode-mystatus/start/understanding-output/)**。
>
> 你會學到：
> - 如何解讀進度條的含義
> - 重置時間倒數計時如何計算
> - 多帳號場景下的輸出格式
> - 進度條生成原理

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| mystatus 工具定義 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| 工具描述 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| 斜線指令配置 | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| 並行查詢所有平台 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| 結果收集和彙總 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**關鍵常數**：
無（本節主要介紹呼叫方式，不涉及具體常數）

**關鍵函數**：
- `mystatus()`：mystatus 工具的主函數，讀取認證檔並並行查詢所有平台（`plugin/mystatus.ts:29-33`）
- `collectResult()`：收集查詢結果到 results 和 errors 陣列（`plugin/mystatus.ts:100-116`）

</details>
