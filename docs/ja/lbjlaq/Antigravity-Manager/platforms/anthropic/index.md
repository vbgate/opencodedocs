---
title: "Anthropic: 互換 API | Antigravity-Manager"
sidebarTitle: "Claude Code をローカルゲートウェイ経由で"
subtitle: "Anthropic: 互換 API"
description: "Antigravity-Manager の Anthropic 互換 API を学習します。Claude Code の Base URL 設定、/v1/messages での対話実行、認証と warmup インターセプトを理解します。"
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# Anthropic 互換 API：/v1/messages と Claude Code の重要な契約

Claude Code をローカルゲートウェイ経由で動作させたいが、Anthropic プロトコルの使用方法を変更したくない場合、Base URL を Antigravity Tools に向けて、/v1/messages で1回リクエストを成功させるだけで済みます。

## Anthropic 互換 API とは？

**Anthropic 互換 API** は、Antigravity Tools が外部に公開する Anthropic Messages プロトコルのエンドポイントです。/v1/messages リクエストを受け取り、ローカルでメッセージのクリーンアップ、ストリーミングのカプセル化、再試行ローテーションを行った後、リクエストを上流の実際のモデル機能を提供する場所に転送します。

## 学習後、できること

- Antigravity Tools の /v1/messages エンドポイントを使用して、Claude Code（または Anthropic Messages クライアント）を動作させる
- Base URL と認証ヘッダーの正しい設定方法を理解し、401/404 の盲目的な試行を回避する
- ストリーミングが必要な場合は標準 SSE を取得し、不要な場合は JSON を取得する
- プロキシがバックグラウンドで「プロトコル修正」（warmup インターセプト、メッセージクリーンアップ、署名のフォールバック）を行うことを知る

## 現在の課題

Claude Code/Anthropic SDK を使用したいが、ネットワーク、アカウント、クォータ、レート制限などの問題で対話が不安定です。Antigravity Tools をローカルゲートウェイとして動作させていますが、次のような問題でよく行き詰まります：

- Base URL が .../v1 になっていたり、クライアントがパスを重ねたりして、結果的に 404 になる
- プロキシ認証を有効にしたが、クライアントがどのヘッダーでキーを渡しているかわからず、401 になる
- Claude Code のバックグラウンド warmup/要約タスクがクォータをこっそり消費する

## いつこの手法を使うか

- **Claude Code CLI** を接続し、「Anthropic プロトコルに従って」ローカルゲートウェイに直接接続させたい場合
- 手元のクライアントが Anthropic Messages API（/v1/messages）のみをサポートしており、コードを変更したくない場合

## 🎒 始める前の準備

::: warning 前提条件
この授業では、ローカルリバースプロキシの基本的なループ（/healthz にアクセスでき、プロキシポートと認証の有無を知っている）が既に動作していることを前提としています。まだ動作していない場合は、**[ローカルリバースプロキシを起動し、最初のクライアントを接続する](/ja/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** を先に見てください。
:::

次の3つを準備する必要があります：

1. プロキシアドレス（例：`http://127.0.0.1:8045`）
2. プロキシ認証が有効かどうか（および対応する `proxy.api_key`）
3. Anthropic Messages リクエストを送信できるクライアント（Claude Code / curl のどちらでも可）

## コアな考え方

**Anthropic 互換 API** は、Antigravity Tools で次の固定ルートセットに対応しています：`POST /v1/messages`、`POST /v1/messages/count_tokens`、`GET /v1/models/claude`（`src-tauri/src/proxy/server.rs` のルーター定義を参照）。

その中で `/v1/messages` が「メインの入り口」であり、プロキシは実際に上流リクエストを送信する前に、互換性処理を多数行います：

- プロトコルで受け入れられないフィールド（`cache_control` など）を履歴メッセージから削除する
- 連続した同一ロールのメッセージをマージし、「ロール交替」の検証エラーを回避する
- Claude Code の warmup メッセージを検出し、シミュレートされた応答を直接返して、クォータの浪費を減らす
- エラーの種類に基づいて再試行とアカウントローテーションを行い（最大3回の試行）、長いセッションの安定性を向上させる

## 実践してみましょう

### ステップ1：Base URL がポートまでしか書かれていないことを確認する

**なぜ**
/v1/messages はプロキシ側の固定ルートです。Base URL が .../v1 になっていると、クライアントがもう一度 /v1/messages を連結して、最終的に .../v1/v1/messages になる可能性があります。

curl で直接生存確認ができます：

```bash
# {"status":"ok"} が見えるはずです
curl -sS "http://127.0.0.1:8045/healthz"
```

### ステップ2：認証を有効にした場合、まずはこの3つのヘッダーを覚えておく

**なぜ**
プロキシの認証ミドルウェアは `Authorization`、`x-api-key`、`x-goog-api-key` からキーを取得します。認証を有効にしてもヘッダーが一致しない場合、安定して 401 になります。

::: info プロキシはどの認証ヘッダーを受け付けますか？
`Authorization: Bearer <key>`、`x-api-key: <key>`、`x-goog-api-key: <key>` のすべてが使用できます（`src-tauri/src/proxy/middleware/auth.rs` を参照）。
:::

### ステップ3：Claude Code CLI でローカルゲートウェイに直接接続する

**なぜ**
Claude Code は Anthropic Messages プロトコルを使用します。Base URL をローカルゲートウェイに向けるだけで、/v1/messages の契約を再利用できます。

README の例に従って環境変数を設定します：

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**次のように見えるはずです**：Claude Code が正常に起動し、メッセージを送信した後に応答を受信します。

### ステップ4：最初に利用可能なモデルを一覧表示する（curl/SDK 用）

**なぜ**
異なるクライアントが `model` をそのまま渡します。まずモデルリストを取得しておくと、問題のトラブルシューティングがはるかに早くなります。

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**次のように見えるはずです**：`object: "list"` の JSON が返され、その `data[].id` が利用可能なモデル ID です。

### ステップ5：curl で /v1/messages を呼び出す（非ストリーミング）

**なぜ**
これが最小の再現可能なチェーンです：Claude Code を使用せずに、「ルーティング + 認証 + リクエストボディ」のどこが間違っているかを確認できます。

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<from /v1/models/claude select one>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "こんにちは、簡単に自己紹介してください"}
    ]
  }'
```

**次のように見えるはずです**：

- HTTP 200
- レスポンスヘッダに `X-Account-Email` と `X-Mapped-Model` が含まれる場合がある（トラブルシューティング用）
- レスポンスボディは Anthropic Messages スタイルの JSON（`type: "message"`）

### ステップ6：ストリーミングが必要な場合は、`stream: true` を有効にする

**なぜ**
Claude Code は SSE を使用します。curl でも SSE を実行して、プロキシ/バッファリングの問題がないことを確認できます。

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<from /v1/models/claude select one>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "ローカルリバースプロキシを3文で説明してください"}
    ]
  }'
```

**次のように見えるはずです**：SSE イベントの行（`event: message_start`、`event: content_block_delta` など）が表示されます。

## チェックポイント ✅

- `GET /healthz` が `{"status":"ok"}` を返す
- `GET /v1/models/claude` で `data[].id` を取得できる
- `POST /v1/messages` が 200 を返す（非ストリーミング JSON またはストリーミング SSE のいずれか）

## よくある落とし穴

### 1) Base URL を .../v1 にしない

Claude Code の例は `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"` です。プロキシ側のルート自体に /v1/messages が含まれているためです。

### 2) 認証を有効にしたが `proxy.api_key` が空の場合、直接拒否される

プロキシ認証が有効で `api_key` が空の場合、ミドルウェアは直接 401 を返します（`src-tauri/src/proxy/middleware/auth.rs` の保護ロジックを参照）。

### 3) `/v1/messages/count_tokens` はデフォルトパスではプレースホルダー実装

z.ai 転送が有効になっていない場合、このエンドポイントは直接 `input_tokens: 0, output_tokens: 0` を返します（`handle_count_tokens` を参照）。実際のトークンを判断するために使用しないでください。

### 4) ストリーミングを有効にしていないのに、サーバーが「内部的に SSE を使用している」のが見える

プロキシは /v1/messages に対して互換性ポリシーを持っています：クライアントがストリーミングを要求しない場合、サーバーは**内部的に強制的にストリーミングを使用**し、結果を収集して JSON として返すことがあります（`handle_messages` の `force_stream_internally` ロジックを参照）。

## この授業のまとめ

- Claude Code/Anthropic クライアントを動作させるには、本質的に3つのこと：Base URL、認証ヘッダー、/v1/messages リクエストボディ
- プロキシは「プロトコルが動作 + 長いセッションの安定」のために、履歴メッセージのクリーンアップ、warmup のインターセプト、失敗時の再試行/アカウントローテーションを行う
- `count_tokens` は現時点では実際の基準としては機能しない（対応する転送パスを有効にした場合を除く）

## 次の授業の予告

> 次の授業では、**[Gemini ネイティブ API：/v1beta/models と Google SDK エンドポイントの接続](/ja/lbjlaq/Antigravity-Manager/platforms/gemini/)** を学習します。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| プロキシルーティング：`/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Anthropic メインエントリー：`handle_messages`（warmup インターセプトと再試行ループを含む） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| モデルリスト：`GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens`（z.ai 未有効時に0を返す） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Warmup 検出とシミュレート応答 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| リクエストクリーンアップ：`cache_control` の削除 | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| リクエストクリーンアップ：連続した同一ロールメッセージのマージ | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**重要な定数**：
- `MAX_RETRY_ATTEMPTS = 3`：/v1/messages の最大再試行回数

</details>
