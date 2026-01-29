---
title: "驗證失敗: 401 錯誤排查 | Antigravity-Manager"
sidebarTitle: "3 分鐘搞定 401"
subtitle: "401/驗證失敗：先看 auth_mode，再看 Header"
description: "學習 Antigravity Tools 代理的驗證機制，排查 401 錯誤。按 auth_mode、api_key、Header 順序定位問題，了解 auto 模式規則與 /healthz 豁免，避免 Header 優先級誤判。"
tags:
  - "FAQ"
  - "驗證"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/驗證失敗：先看 auth_mode，再看 Header

## 學完你能做什麼

- 3 分鐘內判斷 401 是不是被 Antigravity Tools 的驗證中介軟體攔下
- 弄清 `proxy.auth_mode` 四種模式（尤其是 `auto`）在你當前配置下的「實際生效值」
- 用正確的 API Key Header（以及避免 Header 優先級坑）讓請求通過

## 你現在的困境

客戶端呼叫本地反代時收到 `401 Unauthorized` 錯誤：
- Python/OpenAI SDK：拋出 `AuthenticationError`
- curl：返回 `HTTP/1.1 401 Unauthorized`
- HTTP 客戶端：響應狀態碼 401

## 什麼是 401/驗證失敗？

**401 Unauthorized** 在 Antigravity Tools 裡最常見的含義是：代理啟用了驗證（由 `proxy.auth_mode` 決定），但請求沒有帶對 API Key，或帶了一個優先級更高但不匹配的 Header，於是 `auth_middleware()` 直接返回 401。

::: info 先確認是不是「代理在攔」
上游平台也可能返回 401，但這篇 FAQ 只處理「代理驗證導致的 401」。你可以先用下面的 `/healthz` 快速分辨。
:::

## 快速排查（按這個順序做）

### 第 1 步：用 `/healthz` 判斷「驗證是否在攔你」

**為什麼**
`all_except_health` 會放行 `/healthz`，但會攔住其他路由；這能幫你快速定位 401 是否來自代理驗證層。

```bash
 # 不帶任何驗證 Header
curl -i http://127.0.0.1:8045/healthz
```

**你應該看到**
- `auth_mode=all_except_health`（或 `auto` 且 `allow_lan_access=true`）時：通常會返回 `200`
- `auth_mode=strict` 時：會返回 `401`

::: tip `/healthz` 在路由層是 GET
代理在路由裡註冊的是 `GET /healthz`（見 `src-tauri/src/proxy/server.rs`）。
:::

---

### 第 2 步：確認 `auth_mode` 的「實際生效值」（尤其是 `auto`）

**為什麼**
`auto` 不是一個「獨立策略」，它會根據 `allow_lan_access` 計算出真正要執行的模式。

| `proxy.auth_mode` | 額外條件 | 實際生效值（effective mode） |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**你可以在 GUI 的 API Proxy 頁面檢查**：`Allow LAN Access` 和 `Auth Mode`。

---

### 第 3 步：確認 `api_key` 不是空的，並且你用的是同一個值

**為什麼**
驗證開啟時，如果 `proxy.api_key` 為空，`auth_middleware()` 會直接拒絕全部請求並打錯誤日誌。

```text
Proxy auth is enabled but api_key is empty; denying request
```

**你應該看到**
- API Proxy 頁面裡能看到一個以 `sk-` 開頭的 key（預設值在 `ProxyConfig::default()` 會自動生成）
- 點擊「Regenerate/編輯」保存後，外部請求立刻按新 key 校驗（無需重啟）

---

### 第 4 步：用最簡單的 Header 試一次（先別用複雜 SDK）

**為什麼**
中介軟體會優先讀取 `Authorization`，再讀 `x-api-key`，最後讀 `x-goog-api-key`。如果你同時發了多個 Header，前面的那個錯了，後面的那個就算對也不會被用上。

```bash
 # 推薦寫法：Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**你應該看到**：`HTTP/1.1 200 OK`（或至少不再是 401）

::: info 代理對 Authorization 的相容細節
`auth_middleware()` 會把 `Authorization` 的值按 `Bearer ` 前綴做一次剝離；如果沒有 `Bearer ` 前綴，也會把整個值當成 key 去比對。文件仍推薦 `Authorization: Bearer <key>`（更符合通用 SDK 約定）。
:::

**如果你必須用 `x-api-key`**：

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## 常見坑（都是原始碼裡真實會發生的）

| 現象 | 真實原因 | 該怎麼改 |
| --- | --- | --- |
| `auth_mode=auto`，但本機呼叫仍然 401 | `allow_lan_access=true` 導致 `auto` 生效為 `all_except_health` | 關閉 `allow_lan_access`，或讓客戶端帶上 key |
| 你覺得「我明明帶了 x-api-key」，但仍 401 | 同時帶了一個不匹配的 `Authorization`，中介軟體優先用它 | 刪掉多餘 Header，只保留一個你確定正確的 |
| `Authorization: Bearer<key>` 仍 401 | `Bearer` 後少了空格，無法按 `Bearer ` 前綴剝離 | 改成 `Authorization: Bearer <key>` |
| 所有請求都 401，日誌出現 `api_key is empty` | `proxy.api_key` 為空 | 在 GUI 裡重新生成/設置一個非空 key |

## 本課小結

- 先用 `/healthz` 定位 401 是否來自代理驗證層
- 再確認 `auth_mode`（尤其是 `auto` 的 effective mode）
- 最後只帶一個確定正確的 Header 去驗證（避免 Header 優先級坑）

## 下一課預告

> 下一課我們學習 **[429/容量錯誤：帳號輪換的正確預期與模型容量耗盡的誤區](../429-rotation/)**。
>
> 你會學到：
> - 429 到底是「配額不足」還是「上游限流」
> - 帳號輪換的正確預期（什麼時候會自動切、什麼時候不會）
> - 用配置把 429 的機率壓下去

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能        | 檔案路徑                                                                                             | 行號    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| ProxyAuthMode 枚舉 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key 與預設值 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| auto 模式解析（effective_auth_mode） | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| 驗證中介軟體（Header 提取與優先級、/healthz 豁免、OPTIONS 放行） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| /healthz 路由註冊與中介軟體順序 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| 驗證文件（模式與客戶端約定） | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**關鍵枚舉**：
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`：驗證模式

**關鍵函式**：
- `ProxySecurityConfig::effective_auth_mode()`：把 `auto` 解析成真實策略
- `auth_middleware()`：執行驗證（含 Header 提取順序與 /healthz 豁免）

</details>
