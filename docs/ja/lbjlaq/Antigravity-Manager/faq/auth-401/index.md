---
title: "認証失敗: 401 エラートラブルシューティング | Antigravity-Manager"
sidebarTitle: "3分で 401 を解決"
subtitle: "401/認証失敗：まず auth_mode を見て、次に Header を見る"
description: "Antigravity Tools プロキシの認証メカニズムを学び、401 エラーをトラブルシューティングします。auth_mode、api_key、Header の順序で問題を特定し、auto モードルールと /healthz 豁免を理解し、Header 優先度の誤判を回避します。"
tags:
  - "FAQ"
  - "認証"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/認証失敗：まず auth_mode を見て、次に Header を見る

## 学んだ後できること

- 3 分以内に 401 が Antigravity Tools の認証ミドルウェアにブロックされたか判断できる
- `proxy.auth_mode` の 4 つのモード（特に `auto`）が現在の設定でどの「実際の有効値」になるのか明確にできる
- 正しい API Key Header（および Header 優先度の罠を回避）を使ってリクエストを通す

## 現在の悩み

クライアントがローカルリバースプロキシを呼び出すときに `401 Unauthorized` エラーを受信：
- Python/OpenAI SDK：`AuthenticationError` をスロー
- curl：`HTTP/1.1 401 Unauthorized` を返す
- HTTP クライアント：レスポンスステータスコード 401

## 401/認証失敗とは？

**401 Unauthorized** は Antigravity Tools で最も一般的な意味は：プロキシが認証を有効にしていて（`proxy.auth_mode` で決定）、リクエストが正しい API Key を持っていないか、優先度が高くて不一致の Header を持っているため、`auth_middleware()` が直接 401 を返したことです。

::: info まず「プロキシがブロックしているか」を確認
アップストリームプラットフォームも 401 を返す可能性がありますが、この FAQ は「プロキシ認証による 401」のみを処理します。以下の `/healthz` で素早く区別できます。
:::

## 高速トラブルシューティング（この順序で実行）

### 第 1 ステップ：`/healthz` で「認証があなたをブロックしているか」を判断

**なぜか**
`all_except_health` は `/healthz` を通すが、他のルートをブロックします。これにより 401 がプロキシ認証層から来るかを素早く特定できます。

```bash
 # 認証 Header なし
curl -i http://127.0.0.1:8045/healthz
```

**表示されるべきもの**
- `auth_mode=all_except_health`（または `auto` で `allow_lan_access=true`）の時：通常 `200` を返す
- `auth_mode=strict` の時：`401` を返す

::: tip `/healthz` はルート層で GET
プロキシはルートで `GET /healthz` を登録しています（`src-tauri/src/proxy/server.rs` 参照）。
:::

---

### 第 2 ステップ：`auth_mode` の「実際の有効値」を確認（特に `auto`）

**なぜか**
`auto` は「独立した戦略」ではなく、`allow_lan_access` に基づいて実際に実行するモードを計算します。

| `proxy.auth_mode` | 追加条件 | 実際の有効値（effective mode） |
|--- | --- | ---|
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**GUI の API Proxy ページで確認できます**：`Allow LAN Access` と `Auth Mode`。

---

### 第 3 ステップ：`api_key` が空でなく、同じ値を使っているか確認

**なぜか**
認証が有効な時、`proxy.api_key` が空だと、`auth_middleware()` はすべてのリクエストを直接拒否し、エラーログを記録します。

```text
Proxy auth is enabled but api_key is empty; denying request
```

**表示されるべきもの**
- API Proxy ページで `sk-` で始まる key が見える（デフォルト値は `ProxyConfig::default()` で自動生成）
- 「Regenerate/編集」をクリックして保存すると、外部リクエストはすぐに新しい key で検証される（再起動不要）

---

### 第 4 ステップ：最も簡単な Header で一度試す（まず複雑な SDK を使わない）

**なぜか**
ミドルウェアは優先的に `Authorization` を読み、次に `x-api-key`、最後に `x-goog-api-key` を読みます。複数の Header を同時に送った場合、前の方が間違っていれば、後の方が合っていても使われません。

```bash
 # 推奨書き方：Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**表示されるべきもの**：`HTTP/1.1 200 OK`（または少なくとも 401 ではなくなる）

::: info プロキシの Authorization 互換性の詳細
`auth_middleware()` は `Authorization` の値を `Bearer ` プレフィックスで一度剥がします。`Bearer ` プレフィックスがない場合も、値全体を key として比較します。ドキュメントは引き続き `Authorization: Bearer <key>` を推奨します（共通 SDK の約定により適合）。
:::

**`x-api-key` を使わなければならない場合**：

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## 一般的な罠（すべてソースコードで実際に発生する）

| 現象 | 真の原因 | どう直すべきか |
|--- | --- | ---|
| `auth_mode=auto` で、ローカル呼び出しは依然として 401 | `allow_lan_access=true` により `auto` が `all_except_health` として有効になる | `allow_lan_access` を閉じるか、クライアントに key を持たせる |
| 「明らかに x-api-key を持っているのに」と思っても、依然として 401 | 同時に不一致の `Authorization` を持っていて、ミドルウェアがそれを優先的に使う | 多余な Header を削除し、確実に正しいものだけを残す |
| `Authorization: Bearer<key>` でも 401 | `Bearer` の後にスペースがなく、`Bearer ` プレフィックスで剥がせない | `Authorization: Bearer <key>` に変更 |
| すべてのリクエストが 401 で、ログに `api_key is empty` が現れる | `proxy.api_key` が空 | GUI で再度生成/設定して空でない key を作る |

## レッスンまとめ

- まず `/healthz` で 401 がプロキシ認証層から来るかを特定
- 次に `auth_mode` を確認（特に `auto` の effective mode）
- 最後に確実に正しい Header を一つ持って検証（Header 優先度の罠を回避）

## 次のレッスン予告

> 次のレッスンでは **[429/容量エラー：アカウントローテーションの正しい期待とモデル容量枯渇の誤解](../429-rotation/)** を学びます
>
> 学べること：
> - 429 は「クォータ不足」か「アップストリームレート制限」か
> - アカウントローテーションの正しい期待（いつ自動的に切り替わるか、いつ切り替わらないか）
> - 設定で 429 の確率を下げる方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新時間：2026-01-23

| 機能        | ファイルパス                                                                                             | 行番号    |
|--- | --- | ---|
| ProxyAuthMode 列挙 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key とデフォルト値 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| auto モード解析（effective_auth_mode） | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| 認証ミドルウェア（Header 抽出と優先度、/healthz 豁免、OPTIONS 通過） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| /healthz ルート登録とミドルウェア順序 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| 認証ドキュメント（モードとクライアント約定） | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**重要な列挙**：
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`：認証モード

**重要な関数**：
- `ProxySecurityConfig::effective_auth_mode()`：`auto` を真の戦略に解析
- `auth_middleware()`：認証を実行（Header 抽出順序と /healthz 豁免を含む）

</details>
