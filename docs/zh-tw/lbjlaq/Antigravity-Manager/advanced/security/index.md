---
title: "安全：隱私與鑑權設定 | Antigravity-Manager"
sidebarTitle: "別讓區域網路裸奔"
subtitle: "安全與隱私：auth_mode、allow_lan_access，以及「不要洩露帳號資訊」的設計"
description: "學習 Antigravity Tools 的安全設定方法。掌握 auth_mode 的 4 種模式、allow_lan_access 的位址差異、api_key 設定和 /healthz 驗證，避免洩露帳號資訊。"
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# 安全與隱私：auth_mode、allow_lan_access，以及「不要洩露帳號資訊」的設計

你把 Antigravity Tools 當「本地 AI 閘道」用時，安全問題通常只繞 2 件事：你把服務暴露給了誰（只本機，還是整個區域網路/公網），以及外部請求要不要帶 API Key。這課把原始碼裡的規則講清楚，並給你一套能直接照做的最小安全基線。

## 學完你能做什麼

- 選對 `allow_lan_access`：知道它會影響監聽位址（`127.0.0.1` vs `0.0.0.0`）
- 選對 `auth_mode`：搞清 `off/strict/all_except_health/auto` 的實際行為
- 設好 `api_key` 並驗證：能用 `curl` 一眼看出「到底有沒有開鑑權」
- 知道隱私保護的邊界：本地 proxy key 不會被轉發到上游；對 API 客戶端的錯誤資訊避免洩露帳號信箱

## 你現在的困境

- 你想讓手機/另一台電腦存取，但擔心一開區域網路存取就「裸奔」
- 你想開鑑權，但又不确定 `/healthz` 該不該豁免，怕把探活也搞掛
- 你擔心把本地 key、cookie、帳號信箱洩露給外部客戶端或上游平台

## 什麼時候用這一招

- 你準備把 `allow_lan_access` 打開（NAS、家庭區域網路、團隊內網）
- 你要用 cloudflared/反向代理把本地服務暴露到公網（先看 **[Cloudflared 一鍵隧道](/zh-tw/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**）
- 你遇到 `401`，需要確認是「沒帶 key」，還是「模式沒對齊」

## 🎒 開始前的準備

::: warning 前置條件
- 你已經能在 GUI 裡啟動 API Proxy（如果還沒跑通，先看 **[啟動本地反代並接入第一個客戶端](/zh-tw/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**）。
- 你知道自己要解決的問題：只本機存取，還是要讓區域網路/公網存取。
:::

::: info 這課裡會反覆出現的 3 個欄位
- `allow_lan_access`：是否允許區域網路存取。
- `auth_mode`：鑑權策略（決定哪些路由必須帶 key）。
- `api_key`：本地代理的 API Key（只用於本地代理鑑權，不會轉發到上游）。
:::

## 什麼是 auth_mode？

**auth_mode** 是 Antigravity Tools 的「代理鑑權開關 + 豁免策略」。它決定外部客戶端存取本地代理端點時，哪些請求必須攜帶 `proxy.api_key`，以及 `/healthz` 這樣的探活路由是否允許無鑑權存取。

## 核心思路

1. 先把「暴露面」定下來：`allow_lan_access=false` 時只監聽 `127.0.0.1`；`true` 時監聽 `0.0.0.0`。
2. 再把「入口鑰匙」定下來：`auth_mode` 決定是否要帶 key，以及 `/healthz` 是否豁免。
3. 最後做「隱私收口」：不要把本地 proxy key/cookie 透傳給上游；對外錯誤資訊儘量不帶帳號信箱。

## 跟我做

### 第 1 步：先決定你要不要開區域網路存取（allow_lan_access）

**為什麼**
你只有在「需要其他裝置存取」時才應該打開區域網路存取，否則預設只本機存取是最省心的安全策略。

在 `ProxyConfig` 裡，監聽位址由 `allow_lan_access` 決定：

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

在 GUI 的 `API Proxy` 頁面，把「允許區域網路存取」開關按你的需求設定即可。

**你應該看到**
- 關閉時：提示語是「僅本機存取」的語意（具體文案取決於語言套件）
- 開啟時：介面會顯示醒目的風險提示（提醒這是一次「暴露面擴大」）

### 第 2 步：選一個 auth_mode（建議先用 auto）

**為什麼**
`auth_mode` 不只是「開/關鑑權」，它還決定了 `/healthz` 這種探活端點是不是豁免。

專案支援 4 種模式（來自 `docs/proxy/auth.md`）：

- `off`：所有路由都不需要鑑權
- `strict`：所有路由都需要鑑權
- `all_except_health`：除了 `/healthz`，其他路由都需要鑑權
- `auto`：自動模式，會根據 `allow_lan_access` 推導實際策略

`auto` 的推導邏輯在 `ProxySecurityConfig::effective_auth_mode()`：

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**推薦做法**
- 只本機存取：`allow_lan_access=false` + `auth_mode=auto`（最終等價於 `off`）
- 區域網路存取：`allow_lan_access=true` + `auth_mode=auto`（最終等價於 `all_except_health`）

**你應該看到**
- 在 `API Proxy` 頁面，「Auth Mode」下拉框裡有 `off/strict/all_except_health/auto` 四個選項

### 第 3 步：確認你的 api_key（必要時重新生成）

**為什麼**
只要你的代理需要對外存取（區域網路/公網），`api_key` 就應該當作密碼管理。

預設情況下 `ProxyConfig::default()` 會生成一個 `sk-...` 形式的 key：

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

在 `API Proxy` 頁面，你可以編輯、重新生成、複製當前 `api_key`。

**你應該看到**
- 頁面上有 `api_key` 輸入框，以及編輯/重新生成/複製按鈕

### 第 4 步：用 /healthz 驗證「豁免策略」是否符合預期

**為什麼**
`/healthz` 是最短閉環：你不用真的呼叫模型，就能確認「服務可達 + 鑑權策略正確」。

把 `<PORT>` 換成你自己的連接埠（預設 `8045`）：

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**你應該看到**

```json
{"status":"ok"}
```

::: details 如果你把 auth_mode 設成 strict
`strict` 不會豁免 `/healthz`。你需要帶上 key：

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### 第 5 步：用一個「非 health 端點」驗證 401（以及帶 key 後不再是 401）

**為什麼**
你要確認鑑權中介軟體真的在生效，而不是 UI 裡選了模式但實際沒起作用。

下面這個請求體是故意寫得不完整的，它的目的不是「呼叫成功」，而是驗證是否被鑑權攔截：

```bash
#不帶 key：當 auth_mode != off 時，應該直接 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#帶 key：不應該再是 401（可能返回 400/422，因為請求體不完整）
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**你應該看到**
- 不帶 key：`HTTP/1.1 401 Unauthorized`
- 帶 key：狀態碼不再是 401

## 檢查點 ✅

- 你能說清楚自己當前的暴露面：只本機（127.0.0.1）還是區域網路（0.0.0.0）
- `auth_mode=auto` 時，你能預測實際生效模式（LAN -> `all_except_health`，本機 -> `off`）
- 你能用 2 條 `curl` 指令重現「沒帶 key 的 401」

## 踩坑提醒

::: warning 錯誤做法 vs 推薦做法

| 場景 | ❌ 常見錯誤 | ✓ 推薦做法 |
|--- | --- | ---|
| 需要區域網路存取 | 只打開 `allow_lan_access=true`，但 `auth_mode=off` | 用 `auth_mode=auto`，並設定強 `api_key` |
| 開了鑑權但一直 401 | 客戶端帶了 key，但 header 名不兼容 | 代理兼容 `Authorization`/`x-api-key`/`x-goog-api-key` 三種 header |
| 鑑權開啟卻沒配 key | `api_key` 為空也打開了鑑權 | 後端會直接拒絕（日誌會提示 key 為空） |
:::

::: warning /healthz 的豁免只在 all_except_health 生效
中介軟體會在「有效模式」為 `all_except_health` 且路徑是 `/healthz` 時放行；你要把它當作「探活口」，不要拿它當業務 API。
:::

## 隱私與「不要洩露帳號資訊」的設計

### 1) 本地 proxy key 不會轉發到上游

鑑權只發生在本地代理入口；`docs/proxy/auth.md` 明確說明：proxy API key 不會被轉發到上游。

### 2) 轉發到 z.ai 時，會刻意收縮可透傳的 header

當請求被轉發到 z.ai（Anthropic 相容）時，程式碼會只放行少量 header，避免把本地 proxy key 或 cookie 帶出去：

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Token 重新整理失敗的錯誤資訊避免包含帳號信箱

當 Token 重新整理失敗時，日誌裡會記錄具體帳號，但返回給 API 客戶端的錯誤會被改寫成不包含信箱的形式：

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## 本課小結

- 先定暴露面（`allow_lan_access`），再定入口鑰匙（`auth_mode` + `api_key`）
- `auth_mode=auto` 的規則很簡單：LAN 就至少 `all_except_health`，只本機就 `off`
- 隱私的底線是「本地 key 不外帶、帳號信箱不對外報錯洩露」，細節在中介軟體與上游轉發程式碼裡

## 下一課預告

> 下一課我們會看 **[高可用調度：輪換、固定帳號、黏性會話與失敗重試](/zh-tw/lbjlaq/Antigravity-Manager/advanced/scheduling/)**，把「安全入口」之後的「穩定出口」補齊。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| auth_mode 的四種模式與 auto 語意說明 | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| ProxyAuthMode 列舉與預設值（預設 off） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig 的關鍵欄位與預設值（allow_lan_access、api_key） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| 監聽位址推導（127.0.0.1 vs 0.0.0.0） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
|--- | --- | ---|
| 鑑權中介軟體（OPTIONS 放行、/healthz 豁免、三種 header 相容） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| UI：allow_lan_access 與 auth_mode 的開關/下拉框 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI：api_key 的編輯/重設/複製 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
| invalid_grant 自動停用與「避免洩露信箱」的錯誤改寫 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L841-L940) | 841-940 |
| disable_account：寫入 disabled/disabled_at/disabled_reason 並移出記憶體池 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| z.ai 轉發時收縮可透傳 header（避免洩露本地 key/cookies） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| 帳號池停用與 UI 展示的行為說明（文件） | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
