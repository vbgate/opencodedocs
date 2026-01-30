---
title: "狀態持久化: 跨會話保留歷史 | opencode-dynamic-context-pruning"
subtitle: "狀態持久化: 跨會話保留歷史"
sidebarTitle: "重啟後不遺失資料"
description: "學習 opencode-dynamic-context-pruning 的狀態持久化機制。跨會話保留修剪歷史，透過 /dcp stats 查看累計 Token 節省效果。"
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# 狀態持久化：跨會話保留修剪歷史

## 學完你能做什麼

- 理解 DCP 如何跨 OpenCode 重啟保留修剪狀態
- 知道持久化檔案的儲存位置和內容格式
- 掌握會話切換和上下文壓縮時的狀態管理邏輯
- 透過 `/dcp stats` 查看所有會話的累計 Token 節省

## 你現在的困境

你關閉了 OpenCode，重新開啟後發現之前的修剪記錄不見了？或者想知道 `/dcp stats` 中的「所有會話累計節省」是從哪裡來的？

DCP 的狀態持久化機制會自動在背景儲存你的修剪歷史和統計資料，確保重啟後依然可見。

## 什麼時候用這一招

- 需要跨會話累計統計 Token 節省
- 重啟 OpenCode 後繼續修剪歷史
- 長期使用 DCP，想看到整體效果

## 核心思路

**什麼是狀態持久化**

**狀態持久化**是指 DCP 將修剪歷史和統計資料儲存到磁碟檔案中，確保在 OpenCode 重啟或會話切換後，這些資訊不會遺失。

::: info 為什麼需要持久化？

如果沒有持久化，每次關閉 OpenCode 後：
- 修剪的工具 ID 清單會遺失
- Token 節省統計會歸零
- AI 可能重複修剪同一個工具

持久化後，DCP 能夠：
- 記住哪些工具已經被修剪
- 累計所有會話的 Token 節省
- 重啟後繼續之前的工作
:::

**持久化內容的兩大部分**

DCP 儲存的狀態包含兩類資訊：

| 類型 | 內容 | 用途 |
| --- | --- | --- |
| **修剪狀態** | 已修剪工具的 ID 清單 | 避免重複修剪，跨會話追蹤 |
| **統計資料** | Token 節省數量（目前會話 + 歷史累計） | 展示 DCP 效果，長期趨勢分析 |

這些資料按 OpenCode 會話 ID 分別儲存，每個會話對應一個 JSON 檔案。

## 資料流向

```mermaid
graph TD
    subgraph "修剪操作"
        A1[AI 呼叫 discard/extract]
        A2[使用者執行 /dcp sweep]
    end

    subgraph "記憶體狀態"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "持久化儲存"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|非同步儲存| C1
    B2 -->|非同步儲存| C1
    C1 --> C2

    C2 -->|會話切換時載入| B1
    C2 -->|會話切換時載入| B2

    D[OpenCode summary 訊息] -->|清空快取| B1
```

## 跟我做

### 第 1 步：了解持久化儲存位置

**為什麼**
知道資料存在哪裡，可以手動檢查或刪除（如果需要）

DCP 將狀態儲存在本機檔案系統中，不會上傳到雲端。

```bash
# 持久化目錄位置
~/.local/share/opencode/storage/plugin/dcp/

# 每個會話一個 JSON 檔案，格式：{sessionId}.json
```

**你應該看到**：目錄下可能有多個 `.json` 檔案，每個對應一個 OpenCode 會話

::: tip 資料隱私

DCP 僅在本機儲存修剪狀態和統計資料，不涉及任何敏感資訊。持久化檔案包含：
- 工具 ID 清單（數字識別碼）
- Token 節省數量（統計資料）
- 最後更新時間（時間戳記）

不包含對話內容、工具輸出或使用者輸入。
:::

### 第 2 步：查看持久化檔案格式

**為什麼**
了解檔案結構，可以手動檢查或除錯問題

```bash
# 列出所有持久化檔案
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# 查看某個會話的持久化內容
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**你應該看到**：類似這樣的 JSON 結構

```json
{
  "sessionName": "我的會話名稱",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**欄位說明**：

| 欄位 | 類型 | 含義 |
| --- | --- | --- |
| `sessionName` | string (可選) | 會話名稱，方便識別 |
| `prune.toolIds` | string[] | 已修剪工具的 ID 清單 |
| `stats.pruneTokenCounter` | number | 目前會話節省的 Token 數（未歸檔） |
| `stats.totalPruneTokens` | number | 歷史累計節省的 Token 數 |
| `lastUpdated` | string | ISO 8601 格式的最後更新時間 |

### 第 3 步：查看累計統計

**為什麼**
了解所有會話的累計效果，評估 DCP 的長期價值

```bash
# 在 OpenCode 中執行
/dcp stats
```

**你應該看到**：統計資訊面板

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**統計資料含義**：

| 統計項 | 來源 | 說明 |
| --- | --- | --- |
| **Session** | 目前記憶體狀態 | 目前會話的修剪效果 |
| **All-time** | 所有持久化檔案 | 所有歷史會話的累計效果 |

::: info All-time 統計如何計算

DCP 會遍歷 `~/.local/share/opencode/storage/plugin/dcp/` 目錄下的所有 JSON 檔案，累加：
- `totalPruneTokens`：所有會話節省的 Token 總數
- `toolIds.length`：所有會話修剪的工具總數
- 檔案數量：會話總數

這樣你就能看到 DCP 在長期使用中的整體效果。
:::

### 第 4 步：理解自動儲存機制

**為什麼**
知道 DCP 何時儲存狀態，避免誤操作遺失資料

DCP 在以下時機自動儲存狀態到磁碟：

| 觸發時機 | 儲存內容 | 呼叫位置 |
| --- | --- | --- |
| AI 呼叫 `discard`/`extract` 工具後 | 更新的修剪狀態 + 統計 | `lib/strategies/tools.ts:148-150` |
| 使用者執行 `/dcp sweep` 命令後 | 更新的修剪狀態 + 統計 | `lib/commands/sweep.ts:234-236` |
| 修剪操作完成後 | 非同步儲存，不阻塞主流程 | `saveSessionState()` |

**儲存流程**：

```typescript
// 1. 更新記憶體狀態
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. 非同步儲存到磁碟
await saveSessionState(state, logger)
```

::: tip 非同步儲存的好處

DCP 使用非同步儲存機制，確保修剪操作不會被磁碟 I/O 阻塞。即使儲存失敗（如磁碟空間不足），也不會影響目前會話的修剪效果。

失敗時會記錄警告日誌到 `~/.config/opencode/logs/dcp/`。
:::

### 第 5 步：理解自動載入機制

**為什麼**
知道 DCP 何時載入持久化狀態，理解會話切換的行為

DCP 在以下時機自動載入持久化狀態：

| 觸發時機 | 載入內容 | 呼叫位置 |
| --- | --- | --- |
| OpenCode 啟動或切換會話時 | 該會話的歷史修剪狀態 + 統計 | `lib/state/state.ts:104`（在 `ensureSessionInitialized` 函式內部） |

**載入流程**：

```typescript
// 1. 偵測會話 ID 變化
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. 重設記憶體狀態
resetSessionState(state)
state.sessionId = lastSessionId

// 3. 從磁碟載入持久化狀態
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**你應該看到**：切換到之前的會話後，`/dcp stats` 顯示的歷史統計資料保留不變

### 第 6 步：理解上下文壓縮時的狀態清理

**為什麼**
了解 OpenCode 自動壓縮上下文時，DCP 如何處理狀態

當 OpenCode 偵測到對話過長時，會自動產生 summary 訊息壓縮上下文。DCP 會偵測到這種壓縮並清理相關狀態。

```typescript
// 偵測到 summary 訊息時的處理
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // 清空工具快取
    state.prune.toolIds = []       // 清空修剪狀態
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info 為什麼需要清空？

OpenCode 的 summary 訊息會壓縮整個對話歷史，此時：
- 舊的工具呼叫已經被合併到 summary 中
- 保留工具 ID 清單已無意義（工具已不存在）
- 清空狀態避免參照無效的工具 ID

這是設計上的權衡：犧牲部分修剪歷史，保證狀態一致性。
:::

## 檢查點 ✅

確認你理解了以下要點：

- [ ] DCP 的持久化檔案儲存在 `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] 每個會話對應一個 `{sessionId}.json` 檔案
- [ ] 持久化內容包含修剪狀態（toolIds）和統計資料（totalPruneTokens）
- [ ] `/dcp stats` 的「All-time」統計來自所有持久化檔案的累加
- [ ] 修剪操作後自動非同步儲存，不阻塞主流程
- [ ] 會話切換時自動載入該會話的歷史狀態
- [ ] 偵測到 OpenCode summary 訊息時清空工具快取和修剪狀態

## 踩坑提醒

### ❌ 誤刪持久化檔案

**問題**：手動刪除了 `~/.local/share/opencode/storage/plugin/dcp/` 目錄下的檔案

**後果**：
- 歷史修剪狀態遺失
- 累計統計歸零
- 但不影響目前會話的修剪功能

**解決**：重新開始使用，DCP 會自動建立新的持久化檔案

### ❌ 子代理狀態不可見

**問題**：在子代理中修剪了工具，但回到主代理後看不到這些修剪記錄

**原因**：子代理有獨立的 `sessionId`，修剪狀態會被持久化到獨立的檔案。但切換回主代理時，由於主代理的 `sessionId` 不同，不會載入子代理的持久化狀態

**解決**：這是設計行為。子代理會話的狀態是獨立的，不會與主代理共享。如果你想統計所有修剪記錄（包括子代理），可以使用 `/dcp stats` 的「All-time」統計（它會累加所有持久化檔案的資料）

### ❌ 磁碟空間不足導致儲存失敗

**問題**：`/dcp stats` 顯示的「All-time」統計沒有增長

**原因**：可能是磁碟空間不足，儲存失敗

**解決**：檢查日誌檔案 `~/.config/opencode/logs/dcp/`，查看是否有「Failed to save session state」錯誤

## 本課小結

**狀態持久化的核心價值**：

1. **跨會話記憶**：記住哪些工具已被修剪，避免重複工作
2. **累計統計**：長期追蹤 DCP 的 Token 節省效果
3. **重啟恢復**：OpenCode 重啟後繼續之前的工作

**資料流向總結**：

```
修剪操作 → 更新記憶體狀態 → 非同步儲存到磁碟
                ↑
會話切換 → 從磁碟載入 → 恢復記憶體狀態
                ↑
上下文壓縮 → 清空記憶體狀態（不刪除磁碟檔案）
```

**關鍵要點**：

- 持久化是本機檔案操作，不影響修剪效能
- `/dcp stats` 的「All-time」來自所有歷史會話的累加
- 子代理會話不持久化，這是設計行為
- 上下文壓縮時會清空快取，保證狀態一致性

## 下一課預告

> 下一課我們學習 **[Prompt 快取影響](/zh-tw/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**。
>
> 你會學到：
> - DCP 修剪如何影響 Prompt Caching
> - 如何權衡快取命中率和 Token 節省
> - 理解 Anthropic 的快取計費機制

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 持久化介面定義 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| 儲存會話狀態 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| 載入會話狀態 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| 載入所有會話統計 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| 儲存目錄常數 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| 會話狀態初始化 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| 偵測上下文壓縮 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| 統計命令處理 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| 修剪工具儲存狀態 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**關鍵常數**：
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`：持久化檔案儲存根目錄

**關鍵函式**：
- `saveSessionState(state, logger)`：非同步儲存會話狀態到磁碟
- `loadSessionState(sessionId, logger)`：從磁碟載入指定會話的狀態
- `loadAllSessionStats(logger)`：彙總所有會話的統計資料
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`：確保會話已初始化，會載入持久化狀態

**關鍵介面**：
- `PersistedSessionState`：持久化狀態的結構定義
- `AggregatedStats`：累計統計資料的結構定義

</details>
