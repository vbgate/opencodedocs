---
title: "Bear 整合：自動儲存計畫 | Plannotator"
sidebarTitle: "計畫自動存到 Bear"
subtitle: "Bear 整合：自動儲存批准的計畫 | Plannotator"
description: "學習 Plannotator 的 Bear 整合設定方法。透過 x-callback-url 自動儲存批准的計畫，智慧產生標籤，實現知識沉澱和計畫歸檔。"
tags:
  - "整合"
  - "Bear"
  - "筆記應用程式"
  - "知識沉澱"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Bear 整合：自動儲存批准的計畫

## 學完你能做什麼

啟用 Bear 整合後，每次批准計畫時，Plannotator 會自動將計畫儲存到你的 Bear 筆記中，包括：
- 自動產生的標題（從計畫擷取）
- 智慧標籤（專案名稱、關鍵字、程式語言）
- 完整的計畫內容

這樣你就能在一個地方管理所有批准的計畫，方便後續查閱和知識沉澱。

## 你現在的困境

你可能遇到過這些情況：
- AI 產生的計畫很好，但想儲存下來以後參考
- 在 Bear 裡手動複製貼上計畫太麻煩
- 不同專案的計畫混在一起，沒有標籤管理

有了 Bear 整合，這些問題都能自動解決。

## 什麼時候用這一招

- 你使用 Bear 做主要筆記應用程式
- 需要歸檔批准的計畫做知識庫
- 希望透過標籤快速檢索歷史計畫

::: info 關於 Bear
Bear 是一款 macOS 上的 Markdown 筆記應用程式，支援標籤、加密、同步等功能。如果你還沒安裝，可以造訪 [bear.app](https://bear.app/) 了解。
:::

## 🎒 開始前的準備

- 已安裝 Plannotator（參見[安裝教學](../../start/installation-claude-code/)）
- 已安裝 Bear 並能夠正常使用
- 了解基本的計畫審查流程（參見[計畫審查基礎](../../platforms/plan-review-basics/)）

## 核心思路

Bear 整合的核心是 **x-callback-url** 協定：

1. 在 Plannotator UI 中啟用 Bear 整合（儲存在瀏覽器 localStorage）
2. 批准計畫時，Plannotator 發送 `bear://x-callback-url/create` URL
3. 系統使用 `open` 指令自動開啟 Bear 建立筆記
4. 計畫內容、標題、標籤自動填入

**關鍵特點**：
- 無需設定 vault 路徑（不像 Obsidian 需要指定 vault）
- 標籤智慧產生（最多 7 個）
- 批准計畫時自動儲存

::: tip 與 Obsidian 的區別
Bear 整合更簡單，不需要設定 vault 路徑，只需一個開關。但 Obsidian 可以指定儲存資料夾和更多客製化。
:::

## 跟我做

### 第 1 步：開啟 Plannotator 設定

當 AI Agent 產生計畫並開啟 Plannotator UI 後，點擊右上角的 ⚙️ **Settings** 按鈕。

**你應該看到**：設定面板彈出，包含多個設定選項

### 第 2 步：啟用 Bear 整合

在設定面板中找到 **Bear Notes** 部分，點擊開關按鈕。

**為什麼**
開關會從灰色（停用）變為藍色（啟用），同時儲存到瀏覽器的 localStorage 中。

**你應該看到**：
- Bear Notes 開關變藍
- 描述文字：「Auto-save approved plans to Bear」

### 第 3 步：批准計畫

完成計畫審查後，點擊底部的 **Approve** 按鈕。

**為什麼**
Plannotator 會讀取 Bear 設定，如果已啟用，會在批准的同時呼叫 Bear 的 x-callback-url。

**你應該看到**：
- Bear 應用程式自動開啟
- 新建筆記視窗彈出
- 標題和內容已自動填充
- 標籤已自動產生（以 `#` 開頭）

### 第 4 步：檢視儲存的筆記

在 Bear 中，檢查新建的筆記，確認：
- 標題是否正確（來自計畫的 H1）
- 內容是否完整（包含計畫全文）
- 標籤是否合理（專案名稱、關鍵字、程式語言）

**你應該看到**：
類似這樣的筆記結構：

```markdown
## User Authentication

[完整的計畫內容...]

#plannotator #myproject #authentication #typescript #api
```

## 檢查點 ✅

- [ ] Settings 中 Bear Notes 開關已啟用
- [ ] 批准計畫後 Bear 自動開啟
- [ ] 筆記標題與計畫的 H1 一致
- [ ] 筆記包含完整的計畫內容
- [ ] 標籤包含 `#plannotator` 和專案名稱

## 踩坑提醒

### Bear 沒有自動開啟

**原因**：系統 `open` 指令失敗，可能是：
- Bear 未安裝或未從 App Store 下載
- Bear 的 URL scheme 被其他應用程式劫持

**解決方法**：
1. 確認 Bear 已正常安裝
2. 在終端機中手動測試：`open "bear://x-callback-url/create?title=test"`

### 標籤不符合預期

**原因**：標籤是自動產生的，規則如下：
- 必選：`#plannotator`
- 必選：專案名稱（從 git 儲存庫名稱或目錄名稱擷取）
- 可選：從 H1 標題擷取最多 3 個關鍵字（排除停用詞）
- 可選：從程式碼區塊擷取程式語言標籤（排除 json/yaml/markdown）
- 最多 7 個標籤

**解決方法**：
- 標籤不符合預期時，可以在 Bear 中手動編輯
- 如果專案名稱不對，檢查 git 儲存庫設定或目錄名稱

### 批准但沒有儲存

**原因**：
- Bear 開關未啟用（檢查 Settings）
- 網路錯誤或 Bear 回應逾時
- 計畫內容為空

**解決方法**：
1. 確認 Settings 中開關是藍色（啟用狀態）
2. 檢視終端機是否有錯誤日誌（`[Bear] Save failed:`）
3. 重新批准計畫

## 標籤產生機制詳解

Plannotator 會智慧產生標籤，讓你在 Bear 中快速檢索計畫。以下是標籤的產生規則：

| 標籤來源 | 範例 | 優先順序 |
|---------|------|---------|
| 固定標籤 | `#plannotator` | 必選 |
| 專案名稱 | `#myproject`、`#plannotator` | 必選 |
| H1 關鍵字 | `#authentication`、`#api` | 可選（最多 3 個） |
| 程式語言 | `#typescript`、`#python` | 可選 |

**停用詞清單**（不會作為標籤）：
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**程式語言排除**（不會作為標籤）：
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details 範例：標籤產生過程
假設計畫標題為「Implementation Plan: User Authentication System in TypeScript」，程式碼區塊包含 Python 和 JSON：

1. **固定標籤**：`#plannotator`
2. **專案名稱**：`#myproject`（假設 git 儲存庫名稱）
3. **H1 關鍵字**：
   - `implementation` → 排除（停用詞）
   - `plan` → 排除（停用詞）
   - `user` → 保留 → `#user`
   - `authentication` → 保留 → `#authentication`
   - `system` → 保留 → `#system`
   - `typescript` → 保留 → `#typescript`
4. **程式語言**：
   - `python` → 保留 → `#python`
   - `json` → 排除（排除清單）

最終標籤：`#plannotator #myproject #user #authentication #system #typescript #python`（7 個，達到上限）
:::

## 與 Obsidian 整合對比

| 特性 | Bear 整合 | Obsidian 整合 |
|-----|----------|--------------|
| 設定複雜度 | 簡單（僅開關） | 中等（需要選擇 vault 和資料夾） |
| 儲存位置 | Bear 應用程式內 | 指定 vault 路徑 |
| 檔案名稱 | Bear 自動管理 | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | 無（Bear 不支援） | 有（created, source, tags） |
| 跨平台 | 僅 macOS | macOS/Windows/Linux |
| x-callback-url | ✅ 使用 | ❌ 直接寫入檔案 |

::: tip 如何選擇
- 如果你只用 macOS 且喜歡 Bear：Bear 整合更簡單
- 如果需要跨平台或自訂儲存路徑：Obsidian 整合更靈活
- 如果兩者都想用：可以同時啟用（批准計畫會同時儲存到兩個地方）
:::

## 本課小結

- Bear 整合透過 x-callback-url 協定運作，設定簡單
- 只需在 Settings 中開啟開關，無需指定路徑
- 批准計畫時自動儲存到 Bear
- 標籤智慧產生，包含專案名稱、關鍵字、程式語言（最多 7 個）
- 與 Obsidian 整合相比，Bear 更簡單但功能較少

## 下一課預告

> 下一課我們學習 **[遠端/Devcontainer 模式](../remote-mode/)**。
>
> 你會學到：
> - 如何在遠端環境（SSH、devcontainer、WSL）中使用 Plannotator
> - 設定固定連接埠和連接埠轉發
> - 在遠端環境中開啟瀏覽器檢視審查頁面

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                    | 行號    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Bear 設定介面 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20   |
| 儲存到 Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| 標籤擷取     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| 標題擷取     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105  |
| Bear 設定介面 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17   |
| 讀取 Bear 設定 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26   |
| 儲存 Bear 設定 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33   |
| UI 設定元件 | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| 批准時呼叫 Bear | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| 伺服器處理 Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**關鍵函式**：
- `saveToBear(config: BearConfig)`：透過 x-callback-url 將計畫儲存到 Bear
- `extractTags(markdown: string)`：從計畫內容智慧擷取標籤（最多 7 個）
- `extractTitle(markdown: string)`：從計畫的 H1 標題擷取筆記標題
- `getBearSettings()`：從 localStorage 讀取 Bear 整合設定
- `saveBearSettings(settings)`：將 Bear 整合設定儲存到 localStorage

**關鍵常數**：
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`：localStorage 中 Bear 設定的鍵名

**Bear URL 格式**：
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>
