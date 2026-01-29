---
title: "プロキシ起動: リバースプロキシとクライアント接続 | Antigravity-Manager"
sidebarTitle: "5 分でリバースプロキシを実行"
subtitle: "ローカルリバースプロキシを起動し、最初のクライアントを接続（/healthz + SDK 設定）"
description: "Antigravity リバースプロキシ起動とクライアント接続を学びます：ポートと認証を設定し、/healthz で活性検証を行い、SDK 初回呼び出しを完了します。"
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# ローカルリバースプロキシを起動し、最初のクライアントを接続（/healthz + SDK 設定）

このレッスンでは、Antigravity Tools を使用してローカルリバースプロキシ（API Proxy）を実行します：サービスを起動し、`/healthz` で活性検証を行い、SDK を接続して初回リクエストを完了します。

## 学習後にできること

- Antigravity Tools の API Proxy ページでローカルリバースプロキシサービスを起動/停止する
- `GET /healthz` を使用して活性検証を行い、「ポートが正しい、サービスが実際に実行中」を確認する
- `auth_mode` と API Key の関係を明確にする：どのパスが認証を必要とし、どの Header を持つべきか
- クライアント（OpenAI / Anthropic / Gemini SDK）を 1 つ選んで初回の実際のリクエストを完了する

## 現在の課題

- Antigravity Tools をインストールし、アカウントも追加したが、「リバースプロキシが実際に正常に起動したか」わからない
- クライアント接続時に `401`（key がない）や `404`（Base URL 間違い/パス重複）に遭遇しやすい
- 推測ではなく、最短のクローズドループが欲しい：起動 → 活性検証 → 初回リクエスト成功

## いつこの方法を使用するか

- インストールしたばかりで、ローカルゲートウェイが外部で動作するか確認したい場合
- ポートを変更、LAN アクセスを有効、認証モードを変更し、設定が問題ないか迅速に検証したい場合
- 新しいクライアント/新しい SDK を接続し、最小限の例で最初に実行させたい場合

## 🎒 開始前の準備

::: warning 前提条件
- インストールが完了し、Antigravity Tools を正常に開くことができます。
- 少なくとも 1 つの使用可能なアカウントがあります。そうでない場合、リバースプロキシ起動時にエラー `"使用可能なアカウントがありません。先にアカウントを追加してください"` が返されます（z.ai 分配も有効でない場合のみ）。
:::

::: info このレッスンで頻繁に現れる用語
- **Base URL**：クライアントリクエストの「サービスルートアドレス」。異なる SDK の連結方法は異なり、`/v1` を含むものと含まないものがあります。
- **活性検証**：最小限のリクエストでサービスが到達可能か確認すること。このプロジェクトの活性検証エンドポイントは `GET /healthz` で、`{"status":"ok"}` を返します。
:::

## コアアイデア

1. Antigravity Tools がリバースプロキシを起動するとき、設定に従って監視アドレスとポートをバインドします：
   - `allow_lan_access=false` の時、`127.0.0.1` をバインド
   - `allow_lan_access=true` の時、`0.0.0.0` をバインド
2. 最初にコードを書く必要はありません。まず `GET /healthz` で活性検証を行い、「サービスが実行中」を確認します。
3. 認証を有効にした場合：
   - `auth_mode=all_except_health` は `/healthz` を免除します
   - `auth_mode=strict` はすべてのパスで API Key が必要です

## 手順に従って進める

### ステップ 1：ポート、LAN アクセス、認証モードを確認する

**なぜ**
まず「クライアントがどこに接続すべきか（host/port）」と「key を持つ必要があるか」を明確にする必要があります。そうしないと、後で 401/404 のトラブルシューティングが困難になります。

Antigravity Tools で `API Proxy` ページを開き、この 4 つのフィールドに注目します：

- `port`：デフォルトは `8045`
- `allow_lan_access`：デフォルトで無効（ローカルアクセスのみ）
- `auth_mode`：オプション `off/strict/all_except_health/auto`
- `api_key`：デフォルトで `sk-...` が生成され、UI は `sk-` 接頭辞で長さが少なくとも 10 であることを検証します

**次のように表示されます**
- ページ右上に Start/Stop ボタン（リバースプロキシ起動/停止）があり、サービス実行中はポート入力ボックスが無効になります

::: tip 初心者推奨設定（最初に実行してからセキュリティを追加）
- 最初に実行：`allow_lan_access=false` + `auth_mode=off`
- LAN アクセスが必要な場合は、最初に `allow_lan_access=true` を開き、`auth_mode` を `all_except_health` に切り替えます（少なくとも LAN 全体を「裸の API」として公開しないでください）
:::

### ステップ 2：リバースプロキシサービスを起動する

**なぜ**
GUI の Start はバックエンドコマンドを呼び出して Axum Server を起動し、アカウントプールをロードします。これが「外部 API を提供する」前提です。

ページ右上の Start をクリックします。

**次のように表示されます**
- ステータスが stopped から running に変わります
- 隣に現在ロードされたアカウント数（active accounts）が表示されます

::: warning 起動失敗の場合、最も一般的な 2 種類のエラー
- `"使用可能なアカウントがありません。先にアカウントを追加してください"`：アカウントプールが空で、z.ai 分配も有効でないことを示します。
- `"Axum サーバー起動失敗: アドレス <host:port> バインド失敗: ..."`：ポートが占有されているか、権限がない（ポートを変えて再試行してください）。
:::

### ステップ 3：/healthz で活性検証を行う（最短クローズドループ）

**なぜ**
`/healthz` は最も安定した「接続性確認」です。モデル、アカウント、プロトコル変換に依存せず、サービスが到達可能かのみを検証します。

`<PORT>` を UI で見たポート（デフォルト `8045`）に置き換えます：

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**次のように表示されます**

```json
{"status":"ok"}
```

::: details 認証が必要な場合はどうテストしますか？
`auth_mode` を `strict` に切り替えると、すべてのパスで key が必要（`/healthz` を含む）になります。

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

認証 Header の推奨書き方（より多くの形式と互換性）：
- `Authorization: Bearer <proxy.api_key>` または `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### ステップ 4：最初のクライアントを接続する（OpenAI / Anthropic / Gemini から 3 つ選択）

**なぜ**
`/healthz` は「サービスが到達可能」を示すだけです。実際の接続成功は、SDK が実際のリクエストを発行したかどうかで判断する必要があります。

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "こんにちは、自己紹介してください"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**次のように表示されます**
- クライアントが空でないテキスト応答を取得できる
- Proxy Monitor を有効にしている場合、監視でこのリクエスト記録も表示されます

## チェックポイント ✅

- `GET /healthz` が `{"status":"ok"}` を返す
- API Proxy ページが running を表示
- 選択した 1 つの SDK 例が内容を返す（401/404 ではなく、空の応答でもない）

## トラブルシューティング

::: warning 401：大多数は認証が一致していない
- `auth_mode` を有効にしたが、クライアントが key を持っていない。
- key を持っているが、Header 名が正しくない：このプロジェクトは `Authorization` / `x-api-key` / `x-goog-api-key` と同時に互換性があります。
:::

::: warning 404：大多数は Base URL 間違いまたは「パス重複」
- OpenAI SDK は通常 `base_url=.../v1` が必要です。一方、Anthropic/Gemini の例は `/v1` を含みません。
- 一部のクライアントはパスを繰り返し連結し、`/v1/chat/completions/responses` のような 404 を引き起こします（プロジェクト README は Kilo Code の OpenAI モードパス重複問題について特別に言及しています）。
:::

::: warning LAN アクセスは「開けば終わり」ではない
`allow_lan_access=true` を有効にすると、サービスは `0.0.0.0` にバインドされます。これは、同じ LAN 内の他のデバイスがあなたのマシン IP + ポートを通じてアクセスできることを意味します。

このように使用する場合、少なくとも `auth_mode` を有効にし、強力な `api_key` を設定してください。
:::

## このレッスンのまとめ

- リバースプロキシ起動後、まず `/healthz` で活性検証を行い、その後 SDK を設定する
- `auth_mode` はどのパスで key が必要かを決定する。`all_except_health` は `/healthz` を免除する
- SDK 接続時、最も間違いやすいのは Base URL に `/v1` を含める必要があるかどうか

## 次のレッスン予告

> 次のレッスンでは、OpenAI 互換 API の詳細を明確にします：`/v1/chat/completions` と `/v1/responses` の互換境界を含みます。
>
> **[OpenAI 互換 API：/v1/chat/completions と /v1/responses の実装戦略](/ja/lbjlaq/Antigravity-Manager/platforms/openai/)** を見てください。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-23

| トピック | ファイルパス | 行番号 |
| --- | --- | --- |
| リバースプロキシサービス起動/停止/ステータス | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| 起動前アカウントプールチェック（アカウントなし時のエラー条件） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| ルート登録（`/healthz` を含む） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` 戻り値 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| プロキシ認証ミドルウェア（Header 互換と `/healthz` 免除） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| `auth_mode=auto` の実際の解析ロジック | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| ProxyConfig デフォルト値（ポート 8045、デフォルトローカルのみ） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| バインドアドレス導出（127.0.0.1 vs 0.0.0.0） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI 起動/停止ボタンが `start_proxy_service/stop_proxy_service` を呼び出し | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI ポート/LAN/認証/API key 設定領域 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README の Claude Code / Python 接続例 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
