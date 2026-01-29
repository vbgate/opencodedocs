---
title: "MCP エンドポイント: ツールを公開 | Antigravity-Manager"
sidebarTitle: "Claude に z.ai 能力を使用させる"
subtitle: "MCP エンドポイント：Web Search/Reader/Vision を呼び出し可能なツールとして公開する"
description: "Antigravity Manager の MCP エンドポイント設定を学習します。Web Search/Reader/Vision を有効にし、ツール呼び出しを検証し、外部クライアントを接続し、一般的なエラートラブルシューティング方法をマスターします。"
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---
# MCP エンドポイント：Web Search/Reader/Vision を呼び出し可能なツールとして公開する

この **MCP エンドポイント** を使用して、z.ai の検索、読み取り、視覚能力を外部 MCP クライアントに公開します。「リモートリバースプロキシ」と「内蔵サーバー」の違いを明確にし、これらのエンドポイントを有効にして呼び出す方法に焦点を当てます。

## 学習後、できること

- 3種類の MCP エンドポイントの動作原理を理解する（リモートリバースプロキシ vs 内蔵サーバー）
- Antigravity Tools で Web Search/Web Reader/Vision MCP エンドポイントを有効にする
- 外部 MCP クライアント（Claude Desktop、Cursor など）をローカルゲートウェイ経由でこれらの能力を呼び出させる
- セッション管理（Vision MCP）と認証モデルをマスターする

## 現在の課題

多くの AI ツールが MCP（Model Context Protocol）をサポートし始めましたが、上流 API Key と URL を設定する必要があります。z.ai の MCP サーバーも強力な能力（検索、読み取り、視覚分析）を提供していますが、直接設定すると各クライアントで z.ai Key を暴露する必要があります。

Antigravity Tools の解決策は、ローカルゲートウェイレベルで z.ai Key を統一的に管理し、MCP エンドポイントを公開します。クライアントはローカルゲートウェイに接続するだけで、z.ai Key を知る必要がありません。

## いつこの手法を使うか

- 複数の MCP クライアント（Claude Desktop、Cursor、自作ツール）があり、統一的な z.ai Key を使用したい
- z.ai の Web Search/Web Reader/Vision 能力をツールとして AI に使用させたい
- 複数の場所で z.ai Key を繰り返し設定・ローテーションしたくない

## 🎒 始める前の準備

::: warning 前提条件
- Antigravity Tools の "API Proxy" ページでリバースプロキシサービスを起動済み
- z.ai API Key を取得済み（z.ai コンソールから）
- リバースプロキシポートを知っている（デフォルト `8045`）
:::

::: info MCP とは？
MCP（Model Context Protocol）は、AI クライアントが外部ツール/データソースを呼び出すことができるオープンプロトコルです。

典型的な MCP インタラクションフロー：
1. クライアント（例：Claude Desktop）が MCP Server に `tools/list` リクエストを送信し、利用可能なツールリストを取得
2. クライアントがコンテキストに基づいてツールを選択し、`tools/call` リクエストを送信
3. MCP Server がツールを実行し、結果（テキスト、画像、データなど）を返す

Antigravity Tools は3種類の MCP エンドポイントを提供します：
- **リモートリバースプロキシ**：z.ai MCP サーバーに直接転送（Web Search/Web Reader）
- **内蔵サーバー**：ローカルで JSON-RPC 2.0 プロトコルを実装し、ツール呼び出しを処理（Vision）
:::

## MCP エンドポイントとは？

**MCP エンドポイント** は、Antigravity Tools が公開する一連の HTTP ルートで、外部 MCP クライアントが z.ai の能力を呼び出すことができ、Antigravity Tools が認証と設定を統一的に管理します。

### エンドポイントの分類

| エンドポイントタイプ | 実装方法 | ローカルパス | 上流ターゲット |
|--- | --- | --- | ---|
| **Web Search** | リモートリバースプロキシ | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | リモートリバースプロキシ | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | 内蔵サーバー（JSON-RPC 2.0） | `/mcp/zai-mcp-server/mcp` | 内部で z.ai PaaS API を呼び出し |

### 重要な違い

::: info リモートリバースプロキシ vs 内蔵サーバー
**リモートリバースプロキシ**（Web Search/Web Reader）：
- プロキシは一部のリクエストヘッダ（`content-type`、`accept`、`user-agent`）を保持し、`Authorization` ヘッダを注入
- プロキシは上流のレスポンスボディとステータスコードを転送しますが、`CONTENT_TYPE` レスポンスヘッダのみを保持
- ステートレス、セッション管理不要

**内蔵サーバー**（Vision MCP）：
- JSON-RPC 2.0 プロトコルを完全に実装（`initialize`、`tools/list`、`tools/call`）
- ステートフル：セッションを作成（`mcp-session-id`）、GET エンドポイントが SSE keepalive を返す
- ツールロジックはローカルで実装し、z.ai PaaS API を呼び出して視覚分析を実行
:::

## コアな考え方

Antigravity Tools の MCP エンドポイントは次の設計原則に従います：

1. **統一認証**：Antigravity が z.ai Key を管理し、クライアントは設定不要
2. **オフ/オン**：3つのエンドポイントを独立して有効/無効にできる
3. **セッション分離**：Vision MCP は `mcp-session-id` で異なるクライアントを分離
4. **エラー透明**：上流のレスポンスボディとステータスコードをそのまま転送（レスポンスヘッダはフィルタリング）

### 認証モデル

```
MCP クライアント → Antigravity ローカルプロキシ → z.ai 上流
                ↓
            [オプション] proxy.auth_mode
                ↓
            [自動] z.ai Key を注入
```

Antigravity Tools のプロキシミドルウェア（`src-tauri/src/proxy/middleware/auth.rs`）は `proxy.auth_mode` を確認し、認証を有効にした場合、クライアントに API Key を持たせる必要があります。

**重要**：`proxy.auth_mode` に関わらず、z.ai Key はプロキシが自動的に注入するため、クライアントは設定する必要がありません。

## 実践してみましょう

### ステップ1：z.ai を設定し、MCP 機能を有効にする

**なぜ**
まず z.ai 基本設定が正しいことを確認し、MCP エンドポイントを1つずつ有効にします。

1. Antigravity Tools を開き、**API Proxy** ページに入る
2. **z.ai 設定** カードを見つけ、展開をクリック
3. 次のフィールドを設定：

```yaml
 # z.ai 設定
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic 互換エンドポイント
api_key: "あなたの-z.ai-api-key"               # z.ai コンソールから取得
enabled: true                              # z.ai を有効にする
```

4. **MCP 設定** サブカードを見つけ、設定：

```yaml
 # MCP 設定
enabled: true                              # MCP 総スイッチを有効にする
web_search_enabled: true                    # Web Search を有効にする
web_reader_enabled: true                    # Web Reader を有効にする
vision_enabled: true                        # Vision MCP を有効にする
```

**次のように見えるはずです**：設定保存後、ページの下部に「ローカル MCP エンドポイント」リストが表示され、3つのエンドポイントの完全な URL が表示されます。

### ステップ2：Web Search エンドポイントを検証する

**なぜ**
Web Search はリモートリバースプロキシで、最も単純で、基本設定を先に検証するのに適しています。

```bash
 # 1) まず Web Search エンドポイントが提供するツールを一覧表示（ツール名は実際の返り値に依存）
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**次のように見えるはずです**：`tools` リストを含む JSON レスポンスが返されます。

::: tip tools/call を続けて検証（オプション）
`tools[].name` と `tools[].inputSchema` を取得した後、schema に従って `tools/call` リクエストを構築できます（パラメータは schema に依存し、フィールドを推測しないでください）。
:::

::: tip エンドポイントが見つかりませんか？
`404 Not Found` が返された場合、次を確認：
1. `proxy.zai.mcp.enabled` が `true` か
2. `proxy.zai.mcp.web_search_enabled` が `true` か
3. リバースプロキシサービスが実行中か
:::

### ステップ3：Web Reader エンドポイントを検証する

**なぜ**
Web Reader もリモートリバースプロキシですが、パラメータと返り形式が異なり、プロキシが異なるエンドポイントを正しく処理できることを検証します。

```bash
 # 2) Web Reader エンドポイントが提供するツールを一覧表示
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**次のように見えるはずです**：`tools` リストを含む JSON レスポンスが返されます。

### ステップ4：Vision MCP エンドポイントを検証する（セッション管理）

**なぜ**
Vision MCP は内蔵サーバーで、セッション状態があり、まず `initialize` してからツールを呼び出す必要があります。

#### 4.1 セッションを初期化

```bash
 # 1) initialize リクエストを送信
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**次のように見えるはずです**：レスポンスに `mcp-session-id` ヘッダが含まれ、この ID を保存します。

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info リマインダー
`serverInfo.version` は Rust の `env!("CARGO_PKG_VERSION")` から来ており、実際にインストールしたバージョンに依存します。
:::

レスポンスヘッダ：
```
mcp-session-id: uuid-v4-string
```

#### 4.2 ツールリストを取得

```bash
 # 2) tools/list リクエストを送信（セッション ID を添付）
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: あなたのセッションID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**次のように見えるはずです**：8つのツールの定義（`ui_to_artifact`、`extract_text_from_screenshot`、`diagnose_error_screenshot` など）が返されます。

#### 4.3 ツールを呼び出す

```bash
 # 3) analyze_image ツールを呼び出す
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: あなたのセッションID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "この画像の内容を説明してください"
      }
    },
    "id": 3
  }'
```

**次のように見えるはずです**：画像分析結果のテキスト説明が返されます。

::: danger セッション ID が重要
Vision MCP のすべてのリクエスト（`initialize` を除く）には `mcp-session-id` ヘッダが必要です。

セッション ID は `initialize` レスポンスで返され、後続のリクエストは同じ ID を使用する必要があります。セッションが失われた場合は、再度 `initialize` する必要があります。
:::

### ステップ5：SSE keepalive をテストする（オプション）

**なぜ**
Vision MCP の GET エンドポイントは SSE（Server-Sent Events）ストリームを返し、接続をアクティブに保ちます。

```bash
 # 4) GET エンドポイントを呼び出す（SSE ストリームを取得）
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: あなたのセッションID"
```

**次のように見えるはずです**：15秒ごとに `event: ping` メッセージを受け取り、形式は次のようになります：

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## チェックポイント ✅

### 設定チェック

- [ ] `proxy.zai.enabled` が `true`
- [ ] `proxy.zai.api_key` が設定済み（空ではない）
- [ ] `proxy.zai.mcp.enabled` が `true`
- [ ] 少なくとも1つの MCP エンドポイントが有効（`web_search_enabled` / `web_reader_enabled` / `vision_enabled`）
- [ ] リバースプロキシサービスが実行中

### 機能検証

- [ ] Web Search エンドポイントが検索結果を返す
- [ ] Web Reader エンドポイントが Web ページの内容を返す
- [ ] Vision MCP エンドポイントが `initialize` に成功し、`mcp-session-id` を取得
- [ ] Vision MCP エンドポイントがツールリスト（8つのツール）を返す
- [ ] Vision MCP エンドポイントがツールを呼び出し、結果を返す

## Vision MCP ツールクイックリファレンス

| ツール名 | 機能 | 必須パラメータ | 例シーン |
|--- | --- | --- | ---|
| `ui_to_artifact` | UI スクリーンショットをコード/プロンプト/仕様/説明に変換 | `image_source`、`output_type`、`prompt` | デザイン稿からフロントエンドコードを生成 |
| `extract_text_from_screenshot` | スクリーンショットからテキスト/コードを抽出（OCR に類似） | `image_source`、`prompt` | エラーログのスクリーンショットを読み取る |
| `diagnose_error_screenshot` | エラースクリーンショットを診断（スタックトレース、ログ） | `image_source`、`prompt` | 実行時エラーを分析 |
| `understand_technical_diagram` | アーキテクチャ/フロー/UML/ER 図を分析 | `image_source`、`prompt` | システムアーキテクチャ図を理解 |
| `analyze_data_visualization` | チャート/ダッシュボードを分析 | `image_source`、`prompt` | ダッシュボードからトレンドを抽出 |
| `ui_diff_check` | 2つの UI スクリーンショットを比較し、差異を報告 | `expected_image_source`、`actual_image_source`、`prompt` | 視覚的回帰テスト |
| `analyze_image` | 汎用画像分析 | `image_source`、`prompt` | 画像の内容を説明 |
| `analyze_video` | ビデオ内容の分析 | `video_source`、`prompt` | ビデオシーンを分析 |

::: info パラメータ説明
- `image_source`：ローカルファイルパス（例：`/tmp/screenshot.png`）またはリモート URL（例：`https://example.com/image.jpg`）
- `video_source`：ローカルファイルパスまたはリモート URL（MP4、MOV、M4V をサポート）
- `output_type`（`ui_to_artifact`）：`code` / `prompt` / `spec` / `description`
:::

## よくある落とし穴

### 404 Not Found

**現象**：MCP エンドポイントを呼び出すと `404 Not Found` が返される。

**原因**：
1. エンドポイントが有効になっていない（対応する `*_enabled` が `false`）
2. リバースプロキシサービスが起動していない
3. URL パスが間違っている（`/mcp/` プレフィックスに注意）

**解決**：
1. `proxy.zai.mcp.enabled` と対応する `*_enabled` 設定を確認
2. リバースプロキシサービスのステータスを確認
3. URL パス形式を確認（例：`/mcp/web_search_prime/mcp`）

### 400 Bad Request: Missing Mcp-Session-Id

**現象**：Vision MCP（`initialize` を除く）を呼び出すと `400 Bad Request` が返される。

- GET エンドポイント：純テキスト `Missing Mcp-Session-Id` を返す
- POST エンドポイント：JSON-RPC エラー `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}` を返す

**原因**：リクエストヘッダに `mcp-session-id` がない、または ID が無効。

**解決**：
1. `initialize` リクエストが成功し、レスポンスヘッダから `mcp-session-id` を取得したことを確認
2. 後続のリクエスト（`tools/list`、`tools/call`、および SSE keepalive）はすべてこのヘッダを含める必要がある
3. セッションが失われた場合（サービスの再起動など）、再度 `initialize` する必要がある

### z.ai is not configured

**現象**：`400 Bad Request` が返され、`z.ai is not configured` が表示される。

**原因**：`proxy.zai.enabled` が `false` または `api_key` が空。

**解決**：
1. `proxy.zai.enabled` が `true` であることを確認
2. `proxy.zai.api_key` が設定されている（空ではない）ことを確認

### 上流リクエスト失敗

**現象**：`502 Bad Gateway` または内部エラーが返される。

**原因**：
1. z.ai API Key が無効または期限切れ
2. ネットワーク接続問題（上流プロキシが必要）
3. z.ai サーバーエラー

**解決**：
1. z.ai API Key が正しいかを確認
2. `proxy.upstream_proxy` 設定を確認（z.ai にプロキシを通じてアクセスする必要がある場合）
3. ログを確認して詳細なエラー情報を取得

## 外部 MCP クライアントとの統合

### Claude Desktop 設定例

Claude Desktop の MCP クライアント設定ファイル（`~/.config/claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Claude Desktop の制限
Claude Desktop の MCP クライアントは `stdio` を通じて通信する必要があります。HTTP エンドポイントを直接使用する場合、`stdio` を HTTP リクエストに変換する wrapper スクリプトを書く必要があります。

または HTTP MCP をサポートするクライアント（Cursor など）を使用します。
:::

### HTTP MCP クライアント（例：Cursor）

クライアントが HTTP MCP をサポートする場合、エンドポイント URL を直接設定できます：

```yaml
 # Cursor MCP 設定
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## この授業のまとめ

Antigravity Tools の MCP エンドポイントは z.ai の能力を呼び出し可能なツールとして公開し、2種類に分けられます：
- **リモートリバースプロキシ**（Web Search/Web Reader）：単純な転送、ステートレス
- **内蔵サーバー**（Vision MCP）：JSON-RPC 2.0 を完全に実装、セッション管理あり

重要な点：
1. 統一認証：z.ai Key は Antigravity が管理し、クライアントは設定不要
2. オフ/オン：3つのエンドポイントを独立して有効/無効にできる
3. セッション分離：Vision MCP は `mcp-session-id` でクライアントを分離
4. 柔軟な統合：MCP プロトコルに準拠した任意のクライアントをサポート

## 次の授業の予告

> 次の授業では、**[Cloudflared ワンクリックトンネル](/ja/lbjlaq/Antigravity-Manager/platforms/cloudflared/)** を学習します。
>
> 学習内容：
> - Cloudflared トンネルをワンクリックでインストール・起動する方法
> - quick モード vs auth モードの違い
> - ローカル API を安全にパブリックに暴露する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Web Search エンドポイント | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Web Reader エンドポイント | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Vision MCP エンドポイント（メインエントリー） | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP initialize 処理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP tools/list 処理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP tools/call 処理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Vision MCP セッション状態管理 | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Vision MCP ツール定義 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Vision MCP ツール呼び出し実装 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| ルート登録 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| 認証ミドルウェア | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| MCP 設定 UI | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| リポジトリ内説明ドキュメント | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**重要な定数**：
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`：z.ai PaaS API エンドポイント（Vision ツール呼び出し用）

**重要な関数**：
- `handle_web_search_prime()`：Web Search エンドポイントのリモートリバースプロキシを処理
- `handle_web_reader()`：Web Reader エンドポイントのリモートリバースプロキシを処理
- `handle_zai_mcp_server()`：Vision MCP エンドポイントのすべてのメソッド（GET/POST/DELETE）を処理
- `mcp_session_id()`：リクエストヘッダから `mcp-session-id` を抽出
- `forward_mcp()`：汎用 MCP 転送関数（認証を注入して上流に転送）
- `tool_specs()`：Vision MCP のツール定義リストを返す
- `call_tool()`：指定された Vision MCP ツールを実行

</details>
