---
title: "OpenAI API: 接続設定 | Antigravity-Manager"
sidebarTitle: "5分で OpenAI SDK に接続"
subtitle: "OpenAI API: 接続設定"
description: "OpenAI 互換 API の接続設定を学習します。ルート変換、base_url 設定と 401/404/429 トラブルシューティングをマスターし、Antigravity Tools を迅速に使用します。"
tags:
  - "OpenAI"
  - "API Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# OpenAI 互換 API：/v1/chat/completions と /v1/responses の実装戦略

この **OpenAI 互換 API** を使用して、既存の OpenAI SDK/クライアントを Antigravity Tools ローカルゲートウェイに直接接続します。重点的に `/v1/chat/completions` と `/v1/responses` を動作させ、レスポンスヘッダを使用して素早くトラブルシューティングする方法を学びます。

## 学習後、できること

- OpenAI SDK（または curl）を使用して Antigravity Tools ローカルゲートウェイに直接接続する
- `/v1/chat/completions`（`stream: true` を含む）と `/v1/responses` を動作させる
- `/v1/models` のモデルリストと、レスポンスヘッダの `X-Mapped-Model` を理解する
- 401/404/429 が発生した場合、どこを先に確認すべきかを知る

## 現在の課題

多くのクライアント/SDK は OpenAI のインターフェース形状しか認識しません：固定された URL、固定された JSON フィールド、固定された SSE ストリーミング形式。
Antigravity Tools の目標は、クライアントを変更することではなく、クライアントに「自分は OpenAI を呼び出している」と思わせ、実際にはリクエストを内部上流呼び出しに変換し、結果を OpenAI 形式に戻すことです。

## いつこの手法を使うか

- OpenAI のみをサポートするツール（IDE プラグイン、スクリプト、Bot、SDK）を多数持っており、それぞれに新しい統合を書きたくない場合
- `base_url` を使用してリクエストをローカル（または LAN）ゲートウェイに送信し、ゲートウェイでアカウントスケジューリング、再試行、監視を行いたい場合

## 🎒 始める前の準備

::: warning 前提条件
- Antigravity Tools の "API Proxy" ページでリバースプロキシサービスを起動済み、ポートを記録（例：`8045`）
- 少なくとも1つの利用可能なアカウントを追加済み、そうしないとリバースプロキシが上流 token を取得できない
:::

::: info 認証はどう持たせますか？
`proxy.auth_mode` を有効にし `proxy.api_key` を設定した場合、リクエストに API Key を含める必要があります。

Antigravity Tools のミドルウェアは `Authorization` を優先的に読み取り、`x-api-key`、`x-goog-api-key` も互換します。（実装は `src-tauri/src/proxy/middleware/auth.rs` を参照）
:::

## OpenAI 互換 API とは？

**OpenAI 互換 API** は、「OpenAI のように見える」HTTP ルートと JSON/SSE プロトコルのセットです。クライアントは OpenAI のリクエスト形式でローカルゲートウェイに送信し、ゲートウェイはリクエストを内部上流呼び出しに変換し、上流レスポンスを OpenAI レスポンス構造に変換して返します。これにより、既存の OpenAI SDK は基本的に変更なしで使用できます。

### 互換エンドポイント概要（この授業関連）

| エンドポイント | 用途 | コード証拠 |
|--- | --- | ---|
| `POST /v1/chat/completions` | Chat Completions（ストリーミングを含む） | `src-tauri/src/proxy/server.rs` ルート登録；`src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions（同じハンドラーを再利用） | `src-tauri/src/proxy/server.rs` ルート登録 |
| `POST /v1/responses` | Responses/Codex CLI 互換（同じハンドラーを再利用） | `src-tauri/src/proxy/server.rs` ルート登録（コメント：Codex CLI 互換） |
| `GET /v1/models` | モデルリストを返す（カスタムマッピング + 動的生成を含む） | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## 実践してみましょう

### ステップ1：curl でサービスが動作していることを確認する（/healthz + /v1/models）

**なぜ**
「サービスが起動していない/ポートが間違っている/ファイアウォールにブロックされている」などの低レベルな問題を先に排除します。

```bash
 # 1) ヘルスチェック
curl -s http://127.0.0.1:8045/healthz

 # 2) モデルリストを取得
curl -s http://127.0.0.1:8045/v1/models
```

**次のように見えるはずです**：`/healthz` は `{"status":"ok"}` のような JSON を返す；`/v1/models` は `{"object":"list","data":[...]}` を返す。

### ステップ2：OpenAI Python SDK を使用して /v1/chat/completions を呼び出す

**なぜ**
このステップは「OpenAI SDK → ローカルゲートウェイ → 上流 → OpenAI レスポンス変換」のチェーン全体が通っていることを証明します。

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "こんにちは、自己紹介してください"}],
)

print(response.choices[0].message.content)
```

**次のように見えるはずです**：ターミナルにモデル返信テキストが出力されます。

### ステップ3：stream を有効にし、SSE ストリーミング返却を確認する

**なぜ**
多くのクライアントは OpenAI の SSE プロトコル（`Content-Type: text/event-stream`）に依存します。このステップはストリーミングチェーンとイベント形式が使用可能であることを確認します。

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "ローカルリバースプロキシゲートウェイを3文で説明してください"}
    ]
  }'
```

**次のように見えるはずです**：ターミナルが継続的に `data: { ... }` で始まる行を出力し、`data: [DONE]` で終わります。

### ステップ4：/v1/responses を使用して（Codex/Responses スタイル）1つのリクエストを動作させる

**なぜ**
一部のツールは `/v1/responses` を使用するか、リクエストボディで `instructions`、`input` などのフィールドを使用します。このプロジェクトはこの種のリクエストを `messages` に「正規化」し、同じ変換ロジックを再利用します。（ハンドラーは `src-tauri/src/proxy/handlers/openai.rs` を参照）

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "あなたは厳格なコードレビュアーです。",
    "input": "次のコードの最も可能性の高いバグを指摘してください：\n\nfunction add(a, b) { return a - b }"
  }'
```

**次のように見えるはずです**：レスポンスボディは OpenAI スタイルのレスポンスオブジェクトです（このプロジェクトは Gemini レスポンスを OpenAI `choices[].message.content` に変換します）。

### ステップ5：モデルルーティングが有効になっていることを確認する（X-Mapped-Model レスポンスヘッダを確認）

**なぜ**
クライアントで記述した `model` は必ずしも実際に呼び出される「物理モデル」ではありません。ゲートウェイはまずモデルマッピングを行い（カスタムマッピング/ワイルドカードを含む、[モデルルーティング：カスタムマッピング、ワイルドカード優先度とプリセット戦略](/ja/lbjlaq/Antigravity-Manager/advanced/model-router/) を参照）、最終結果をレスポンスヘッダに配置し、トラブルシューティングを容易にします。

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "こんにちは"}]
  }'
```

**次のように見えるはずです**：レスポンスヘッダに `X-Mapped-Model: ...` が含まれます（例：`gemini-2.5-flash` にマッピング）、また `X-Account-Email: ...` が含まれる可能性があります。

## チェックポイント ✅

- `GET /healthz` が `{"status":"ok"}` を返す（または同等の JSON）
- `GET /v1/models` が `object=list` を返し、`data` は配列
- `/v1/chat/completions` 非ストリーミングリクエストで `choices[0].message.content` を取得できる
- `stream: true` の場合、SSE を受信し、`[DONE]` で終了
- `curl -i` で `X-Mapped-Model` レスポンスヘッダを見ることができる

## よくある落とし穴

### 1) Base URL の書き間違いによる 404（最も一般的）

- OpenAI SDK の例では、`base_url` は `/v1` で終わる必要があります（プロジェクト README の Python 例を参照）。
- 一部のクライアントは「パスを重ねる」可能性があります。例：README で明示的に言及されていますが、Kilo Code は OpenAI モードで `/v1/chat/completions/responses` この種の非標準パスを生成し、404 をトリガーする可能性があります。

### 2) 401：上流がダウンしたのではなく、key を持っていないか、モードが間違っている

認証戦略の「有効モード」が `off` ではない場合、ミドルウェアはリクエストヘッダを検証します：`Authorization: Bearer <proxy.api_key>`、`x-api-key`、`x-goog-api-key` も互換します。（実装は `src-tauri/src/proxy/middleware/auth.rs` を参照）

::: tip 認証モードヒント
`auth_mode = auto` の場合、`allow_lan_access` に基づいて自動的に決定されます：
- `allow_lan_access = true` → 有効モードは `all_except_health`（`/healthz` を除きすべて認証が必要）
- `allow_lan_access = false` → 有効モードは `off`（ローカルアクセスは認証不要）
:::

### 3) 429/503/529：プロキシは再試行 + アカウントローテーションを行いますが、「プール枯渇」の可能性もあります

OpenAI ハンドラーは最大3回の試行を内蔵し（アカウントプールのサイズにも制限）、一部のエラーが発生すると待機/アカウントローテーションして再試行します。（実装は `src-tauri/src/proxy/handlers/openai.rs` を参照）

## この授業のまとめ

- `/v1/chat/completions` は最も汎用的な接続ポイントで、`stream: true` は SSE を使用
- `/v1/responses` と `/v1/completions` は同じ互換ハンドラーを使用し、コアはリクエストを `messages` に正規化すること
- `X-Mapped-Model` は「クライアントモデル名 → 最終物理モデル」のマッピング結果を確認するのに役立つ

## 次の授業の予告

> 次の授業では、**Anthropic 互換 API：/v1/messages と Claude Code の重要な契約**（対応章：`platforms-anthropic`）を続けて見ていきます。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| OpenAI ルート登録（/v1/responses を含む） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Chat Completions ハンドラー（Responses 形式検出を含む） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| /v1/completions と /v1/responses ハンドラー（Codex/Responses 正規化 + 再試行/ローテーション） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| /v1/models の返り（動的モデルリスト） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| OpenAI リクエストデータ構造（messages/instructions/input/size/quality） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
|--- | --- | ---|
|--- | --- | ---|
| モデルマッピングとワイルドカード優先度（厳密 > ワイルドカード > デフォルト） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
|--- | --- | ---|

**重要な定数**：
- `MAX_RETRY_ATTEMPTS = 3`：OpenAI プロトコル最大試行回数（ローテーションを含む）（`src-tauri/src/proxy/handlers/openai.rs` を参照）

**重要な関数**：
- `transform_openai_request(...)`：OpenAI リクエストボディを内部上流リクエストに変換（`src-tauri/src/proxy/mappers/openai/request.rs` を参照）
- `transform_openai_response(...)`：上流レスポンスを OpenAI `choices`/`usage` に変換（`src-tauri/src/proxy/mappers/openai/response.rs` を参照）

</details>
