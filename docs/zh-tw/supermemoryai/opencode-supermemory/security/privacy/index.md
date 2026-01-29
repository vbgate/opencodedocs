---
title: "隱私安全: 資料保護與脫敏 | opencode-supermemory"
sidebarTitle: "隱私安全"
subtitle: "隱私與資料安全：如何保護你的敏感資訊"
description: "了解 opencode-supermemory 的隱私保護機制。學習使用 private 標籤脫敏敏感資料、安全配置 API Key，以及理解資料流向與雲端儲存原理。"
tags:
  - "隱私"
  - "安全"
  - "配置"
prerequisite:
  - "start-getting-started"
order: 1
---

# 隱私與資料安全：如何保護你的敏感資訊

## 學完你能做什麼

*   **理解資料去哪了**：清楚知道哪些資料會上傳到雲端，哪些會留在本機。
*   **掌握脫敏技巧**：學會使用 `<private>` 標籤防止敏感資訊（如密碼、金鑰）被上傳。
*   **安全管理金鑰**：學會以最安全的方式配置 `SUPERMEMORY_API_KEY`。

## 核心思路

在使用 opencode-supermemory 時，理解資料流向至關重要：

1.  **雲端儲存**：你的記憶（Memories）是儲存在 Supermemory 的雲端資料庫中的，而不是本機檔案。這意味著你需要網路連接才能存取記憶。
2.  **本機脫敏**：為了保護隱私，外掛在將資料發送到雲端**之前**，會在本機進行脫敏處理。
3.  **顯式控制**：外掛不會自動掃描所有檔案上傳，只有 Agent 顯式呼叫 `add` 工具或觸發壓縮時，相關內容才會被處理。

### 脫敏機制

外掛內建了一個簡單的過濾器，專門識別 `<private>` 標籤。

*   **輸入**：`這裡的資料庫密碼是 <private>123456</private>`
*   **處理**：外掛偵測到標籤，將其內容替換為 `[REDACTED]`。
*   **上傳**：`這裡的資料庫密碼是 [REDACTED]`

::: info 提示
這個處理過程發生在外掛內部程式碼中，在資料離開你的電腦之前就已經完成了。
:::

## 跟我做

### 第 1 步：安全配置 API Key

雖然你可以將 API Key 直接寫入配置檔案，但為了防止意外洩露（比如誤把配置檔案分享給別人），我們推薦了解優先級的邏輯。

**優先級規則**：
1.  **配置檔案** (`~/.config/opencode/supermemory.jsonc`)：優先級最高。
2.  **環境變數** (`SUPERMEMORY_API_KEY`)：如果配置檔案中未設定，則使用此變數。

**推薦做法**：
如果你希望靈活切換或在 CI/CD 環境中使用，請使用環境變數。如果你是個人開發者，配置在使用者目錄的 JSONC 檔案中也是安全的（因為它不在你的專案 Git 倉庫裡）。

### 第 2 步：使用 `<private>` 標籤

當你在對話中透過自然語言讓 Agent 記住某些包含敏感資訊的內容時，可以使用 `<private>` 標籤包裹敏感部分。

**操作示範**：

告訴 Agent：
> 請記住，生產環境的資料庫 IP 是 192.168.1.10，但 root 密碼是 `<private>SuperSecretPwd!</private>`，不要洩露密碼。

**你應該看到**：
Agent 會呼叫 `supermemory` 工具儲存記憶。雖然 Agent 的回覆可能包含密碼（因為它在上下文中），但**實際儲存到 Supermemory 雲端的記憶**已經被脫敏。

### 第 3 步：驗證脫敏結果

我們可以透過搜尋來驗證剛才的密碼是否真的沒被存進去。

**操作**：
讓 Agent 搜尋剛才的記憶：
> 搜尋一下生產環境資料庫的密碼。

**預期結果**：
Agent 從 Supermemory 檢索到的內容應該是：
`生產環境的資料庫 IP 是 192.168.1.10，但 root 密碼是 [REDACTED]...`

如果 Agent 告訴你「密碼是 [REDACTED]」，說明脫敏機制工作正常。

## 常見誤區

::: warning 誤區 1：所有程式碼都會被上傳
**事實**：外掛**不會**自動上傳你的整個程式碼庫。它只有在執行 `/supermemory-init` 進行初始化掃描，或者 Agent 顯式決定「記住」某段程式碼邏輯時，才會將那特定的片段上傳。
:::

::: warning 誤區 2：.env 檔案會自動載入
**事實**：外掛讀取的是程序環境中的 `SUPERMEMORY_API_KEY`。如果你在專案根目錄放了一個 `.env` 檔案，外掛**不會**自動讀取它，除非你使用的終端機或 OpenCode 主程序載入了它。
:::

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 隱私脫敏邏輯 | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| API Key 載入 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| 外掛呼叫脫敏 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**關鍵函數**：
- `stripPrivateContent(content)`: 執行正則替換，將 `<private>` 內容變為 `[REDACTED]`。
- `loadConfig()`: 載入本機配置檔案，優先級高於環境變數。

</details>

## 下一課預告

> 恭喜你完成了 opencode-supermemory 的核心課程！
>
> 接下來你可以：
> - 回顧 [進階配置](/zh-tw/supermemoryai/opencode-supermemory/advanced/configuration/) 了解更多自訂選項。
