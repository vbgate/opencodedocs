---
title: "新增帳號: OAuth 與 Refresh Token 雙通道 | Antigravity Tools"
sidebarTitle: "加你的 Google 號"
subtitle: "新增帳號:OAuth/Refresh Token 雙通道與最佳實踐"
description: "學習 Antigravity Tools 新增帳號的兩種方式。透過 OAuth 一鍵授權或 Refresh Token 手動新增，支援批次匯入，處理回呼失敗並驗證帳號池。"
tags:
  - "帳號管理"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "最佳實踐"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# 新增帳號:OAuth/Refresh Token 雙通道與最佳實踐

在 Antigravity Tools 裡,「新增帳號」就是把 Google 帳號的 `refresh_token` 寫進本地帳號池,讓後續反代請求可以輪換使用。你可以走 OAuth 一鍵授權,也可以直接貼上 `refresh_token` 手動新增。

## 學完你能做什麼

- 用 OAuth 或 Refresh Token,把 Google 帳號加進 Antigravity Tools 的帳號池
- 複製/手動開啟授權連結,並在回呼成功後自動完成新增
- 遇到拿不到 `refresh_token`、回呼連不上 `localhost` 這類問題時,知道應該怎麼處理

## 你現在的困境

- 點了「OAuth 授權」卻一直轉圈,或瀏覽器提示 `localhost refused to connect`
- 授權成功了,但提示「未取得 Refresh Token」
- 你手裡只有 `refresh_token`,不知道怎麼一次性批次匯入

## 什麼時候用這一招

- 你想用最穩的方式把帳號加進來(優先 OAuth)
- 你更在意可遷移/可備份(Refresh Token 更適合做「帳號池資產」)
- 你要加很多號,想批次匯入 `refresh_token`(支援從文字/JSON 裡提取)

## 🎒 開始前的準備

- 你已經安裝並能開啟 Antigravity Tools 桌面端
- 你知道入口在哪:左側導覽進入 `Accounts` 頁面(路由見 `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info 這課裡的兩個關鍵詞
**OAuth**:一種「跳到瀏覽器登入並授權」的流程。Antigravity Tools 會在本地暫時啟一個回呼位址(`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`,根據系統 IPv4/IPv6 監聽情況自動選擇),等瀏覽器帶著 `code` 回來後再換取 token。(實作見 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token**:一種「可以長期用來刷新 access_token 的憑證」。本專案新增帳號時會用它先換取 access_token,再去 Google 拉取真實信箱,並忽略你在前端輸入的 email。(實作見 `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## 核心思路

Antigravity Tools 的「新增帳號」,最終都是為了拿到一份可用的 `refresh_token`,並把帳號資訊寫入本地帳號池。

- **OAuth 通道**:應用程式幫你產生授權連結並監聽本地回呼;授權完成後自動換取 token 並儲存帳號(見 `prepare_oauth_url`、`start_oauth_login`、`complete_oauth_login`)
- **Refresh Token 通道**:你直接把 `refresh_token` 貼進來,應用程式會用它刷新 access_token,並向 Google 取得真實信箱來落盤(見 `add_account`)

## 跟我做

### 第 1 步:開啟「新增帳號」彈窗

**為什麼**
所有新增入口都在 `Accounts` 頁面統一收口。

操作:進入 `Accounts` 頁面,點右側的 **Add Account** 按鈕(元件:`AddAccountDialog`)。

**你應該看到**:彈出一個包含 3 個分頁標籤的彈窗:`OAuth` / `Refresh Token` / `Import`(見 `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`)。

### 第 2 步:優先用 OAuth 一鍵授權(推薦)

**為什麼**
這是產品預設推薦路徑:讓應用程式自己產生授權連結、自動開啟瀏覽器,並在回呼回來後自動完成儲存。

1. 切到 `OAuth` 分頁標籤。
2. 先複製授權連結:彈窗開啟後會自動呼叫 `prepare_oauth_url` 預產生 URL(前端呼叫見 `AddAccountDialog.tsx:111-125`;後端產生與監聽見 `oauth_server.rs`)。
3. 點 **Start OAuth**(對應前端 `startOAuthLogin()` / 後端 `start_oauth_login`),讓應用程式開啟預設瀏覽器並開始等待回呼。

**你應該看到**:
- 彈窗裡出現一條可複製的授權連結(事件名:`oauth-url-generated`)
- 瀏覽器開啟 Google 授權頁;授權後會跳轉到一個本地位址,並顯示「Authorization Successful!」(`oauth_success_html()`)

### 第 3 步:OAuth 沒自動完成時,用「完成 OAuth」手動收尾

**為什麼**
OAuth 流程分兩段:瀏覽器授權得到 `code`,再由應用程式用 `code` 換 token。就算你沒點「Start OAuth」,只要你手動開啟了授權連結並完成回呼,彈窗也會嘗試自動收尾;如果沒收尾成功,你可以手動點一次。

1. 如果你是「把連結複製到自己的瀏覽器裡開啟」(而不是預設瀏覽器),授權回呼回來後,應用程式會收到 `oauth-callback-received` 事件,並自動呼叫 `completeOAuthLogin()`(見 `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`)。
2. 如果你沒看到自動完成,點擊彈窗裡的 **Finish OAuth**(對應後端 `complete_oauth_login`)。

**你應該看到**:彈窗提示成功並自動關閉;`Accounts` 列表出現新帳號。

::: tip 小技巧:遇到回呼連不上優先複製連結
後端會盡量同時監聽 IPv6 `::1` 與 IPv4 `127.0.0.1`,並根據監聽情況選擇 `localhost/127.0.0.1/[::1]` 作為回呼位址,主要是為了規避「瀏覽器把 localhost 解析到 IPv6」導致的連線失敗。(見 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### 第 4 步:用 Refresh Token 手動新增(支援批次)

**為什麼**
當你拿不到 `refresh_token`(或者你更偏向「可遷移資產」)時,直接用 Refresh Token 新增更可控。

1. 切到 `Refresh Token` 分頁標籤。
2. 把 `refresh_token` 貼到文字框。

支援的輸入形式(前端會解析並批次新增):

| 輸入類型 | 例子 | 解析邏輯 |
| --- | --- | --- |
| 純 token 文字 | `1//abc...` | 正規表示式提取:`/1\/\/[a-zA-Z0-9_\-]+/g`(見 `AddAccountDialog.tsx:213-220`) |
| 夾在一大段文字裡 | 日誌/匯出文字裡包含多個 `1//...` | 正規表示式批次提取並去重(見 `AddAccountDialog.tsx:213-224`) |
| JSON 陣列 | `[{"refresh_token":"1//..."}]` | 解析陣列並取 `item.refresh_token`(見 `AddAccountDialog.tsx:198-207`) |

點 **Confirm** 後,彈窗會按 token 數量逐個呼叫 `onAdd("", token)`(見 `AddAccountDialog.tsx:231-248`),最終落到後端 `add_account`。

**你應該看到**:
- 彈窗顯示批次進度(例如 `1/5`)
- 成功後 `Accounts` 列表出現新帳號

### 第 5 步:確認「帳號池已可用」

**為什麼**
新增成功不等於「馬上能穩定用」。後端會在新增後自動觸發一次「刷新配額」,並在 Proxy 執行時嘗試 reload token pool,讓變更立刻生效。

你可以用下面 2 個訊號確認:

1. 帳號出現在列表裡,並顯示信箱(信箱來自後端 `get_user_info`,不是你輸入的 email)。
2. 帳號配額/訂閱資訊開始刷新(後端會自動呼叫 `internal_refresh_account_quota`)。

**你應該看到**:新增後不需要手動點刷新,帳號會開始出現配額資訊(是否成功以介面實際展示為準)。

## 檢查點 ✅

- 帳號列表裡能看到新增帳號的信箱
- 沒有停留在「loading」狀態超過你能接受的時間(OAuth 回呼完成後應該很快收尾)
- 如果你正在執行 Proxy,新增帳號能很快參與排程(後端會嘗試 reload)

## 踩坑提醒

### 1) OAuth 提示「未取得 Refresh Token」

後端在 `start_oauth_login/complete_oauth_login` 會顯式檢查 `refresh_token` 是否存在;如果不存在,會回傳一段帶解決方案的錯誤資訊(見 `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`)。

按原始碼提示的處理方式:

1. 開啟 `https://myaccount.google.com/permissions`
2. 撤銷 **Antigravity Tools** 的存取權限
3. 回到應用程式重新走 OAuth

> 你也可以直接改走本課的 Refresh Token 通道。

### 2) 瀏覽器提示 `localhost refused to connect`

OAuth 回呼需要瀏覽器請求本地回呼位址。為降低失敗率,後端會:

- 嘗試同時監聽 `127.0.0.1` 與 `::1`
- 兩者都可用時才使用 `localhost`,否則強制用 `127.0.0.1` 或 `[::1]`

對應實作見 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`。

### 3) 切換到別的分頁標籤會取消 OAuth 準備

當彈窗從 `OAuth` 切到其他 tab 時,前端會呼叫 `cancelOAuthLogin()` 並清空 URL(見 `AddAccountDialog.tsx:127-136`)。

如果你正在授權過程中,別急著切 tab。

### 4) Refresh Token 的正確/錯誤範例

| 例子 | 是否會被識別 | 原因 |
| --- | --- | --- |
| `1//0gAbC...` | ✓ | 符合 `1//` 前綴規則(見 `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | 不符合前端提取規則,會被當成無效輸入 |

## 本課小結

- OAuth:適合「快」,也支援複製連結到你常用瀏覽器並自動/手動收尾
- Refresh Token:適合「穩」和「可遷移」,並支援從文字/JSON 批次提取 `1//...`
- 拿不到 `refresh_token` 時,按錯誤提示撤銷授權後重做,或直接改走 Refresh Token

## 下一課預告

下一課我們做一件更踏實的事:把帳號池變成「可遷移資產」。

> 去學 **[帳號備份與遷移:匯入/匯出、V1/DB 熱遷移](../backup-migrate/)**。

---

## 附錄:原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間:2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Accounts 頁面掛載新增彈窗 | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| OAuth URL 預產生 + 回呼事件自動收尾 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| OAuth 回呼事件觸發 `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Refresh Token 批次解析與去重 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| 前端呼叫 Tauri commands(add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| 後端 add_account:忽略 email、用 refresh_token 取得真實信箱並落盤 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| 後端 OAuth:檢查 refresh_token 遺失並給出撤銷授權方案 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| OAuth 回呼 server:同時監聽 IPv4/IPv6 並選擇 redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
| OAuth 回呼解析 `code` 並發出 `oauth-callback-received` | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L140-L180) | 140-180 |

**關鍵事件名**:
- `oauth-url-generated`:後端產生 OAuth URL 後發給前端(見 `oauth_server.rs:250-252`)
- `oauth-callback-received`:後端收到回呼並解析到 code 後通知前端(見 `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**關鍵指令**:
- `prepare_oauth_url`:預產生授權連結並啟動回呼監聽(見 `src-tauri/src/commands/mod.rs:469-473`)
- `start_oauth_login`:開啟預設瀏覽器並等待回呼(見 `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login`:不開啟瀏覽器,只等待回呼並完成換 token(見 `src-tauri/src/commands/mod.rs:405-467`)
- `add_account`:用 refresh_token 落盤帳號(見 `src-tauri/src/commands/mod.rs:19-60`)

</details>
