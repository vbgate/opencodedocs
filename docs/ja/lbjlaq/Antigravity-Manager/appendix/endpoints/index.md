---
title: "エンドポイント速查: HTTP ルート一覧 | Antigravity-Manager"
sidebarTitle: "すべてのルートを即座に確認"
subtitle: "エンドポイント速查表：外部 HTTP ルート一覧"
description: "Antigravity ゲートウェイの HTTP エンドポイント分布を学びます。テーブルで OpenAI/Anthropic/Gemini/MCP ルートを照合し、認証モードと API Key Header の使用方法をマスターします。"
tags:
  - "エンドポイント速查"
  - "API リファレンス"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# エンドポイント速查表：外部 HTTP ルート一覧

## 学んだ後できること

- 呼び出す必要があるエンドポイントパスを素早く特定する
- 異なるプロトコルのエンドポイント分布を理解する
- 認証モードとヘルスチェックの特別なルールを理解する

## エンドポイント概要

Antigravity Tools のローカルリバースプロキシサービスは、以下の種類のエンドポイントを提供します：

| プロトコル分類 | 用途 | 代表的なクライアント |
| --- | --- | --- |
| **OpenAI プロトコル** | 汎用 AI アプリ互換 | OpenAI SDK / 互換クライアント |
| **Anthropic プロトコル** | Claude シリーズ呼び出し | Claude Code / Anthropic SDK |
| **Gemini プロトコル** | Google 公式 SDK | Google Gemini SDK |
| **MCP エンドポイント** | ツール呼び出し拡張 | MCP クライアント |
| **内部/補助** | ヘルスチェック、インターセプト/内部機能 | 自動化スクリプト / モニタリングヘルスチェック |

---

## OpenAI プロトコルエンドポイント

これらのエンドポイントは OpenAI API フォーマットに互換性があり、大多数の OpenAI SDK をサポートするクライアントに適しています。

| メソッド | パス | ルート入り口（Rust handler） | 備考 |
| --- | --- | --- | --- |
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI 互換：モデル一覧 |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI 互換：Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI 互換：Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI 互換：Codex CLI リクエスト（`/v1/completions` と同じ handler） |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI 互換：Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI 互換：Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI 互換：Audio Transcriptions |

::: tip 互換性ヒント
`/v1/responses` エンドポイントは Codex CLI 専用に設計されており、実際には `/v1/completions` と同じ処理ロジックを使用します。
:::

---

## Anthropic プロトコルエンドポイント

これらのエンドポイントは Anthropic API のパスとリクエストフォーマットに従って整理され、Claude Code / Anthropic SDK の呼び出しに使用されます。

| メソッド | パス | ルート入り口（Rust handler） | 備考 |
| --- | --- | --- | --- |
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic 互換：Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic 互換：count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic 互換：モデル一覧 |

---

## Gemini プロトコルエンドポイント

これらのエンドポイントは Google Gemini API フォーマットに互換性があり、Google 公式 SDK を直接使用できます。

| メソッド | パス | ルート入り口（Rust handler） | 備考 |
| --- | --- | --- | --- |
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini ネイティブ：モデル一覧 |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini ネイティブ：GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini ネイティブ：generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini ネイティブ：countTokens |

::: warning パス説明
`/v1beta/models/:model` は同じパスで GET と POST の両方が登録されています（ルート定義参照）。
:::

---

## MCP エンドポイント

MCP（Model Context Protocol）エンドポイントは「ツール呼び出し」インターフェースを公開するために使用されます（`handlers::mcp::*` で処理）。有効かどうかと具体的な動作は設定によります；詳細は [MCP エンドポイント](../../platforms/mcp/) を参照してください。

| メソッド | パス | ルート入り口（Rust handler） | 備考 |
| --- | --- | --- | --- |
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP：Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP：Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP：z.ai MCP Server |

::: details MCP 関連説明
MCP の利用範囲と境界説明は、[z.ai 統合の能力境界（実装済み vs 明確未実装）](../zai-boundaries/) を参照してください。
:::

---

## 内部と補助エンドポイント

これらのエンドポイントはシステム内部機能と外部モニタリングに使用されます。

| メソッド | パス | ルート入り口（Rust handler） | 備考 |
| --- | --- | --- | --- |
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | 内部ウォームアップエンドポイント |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | テレメトリログインターセプト：直接 200 を返す |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | テレメトリログインターセプト：直接 200 を返す |
| GET | `/healthz` | `health_check_handler` | ヘルスチェック：`{"status":"ok"}` を返す |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | モデル自動検出 |

::: tip サイレント処理
イベントログエンドポイントは `200 OK` を直接返し、実際の処理は行わず、クライアントのテレメトリ報告をインターセプトするために使用されます。
:::

::: warning これらのエンドポイントは API Key が必要か？
`GET /healthz` を除き、他のルートが key を持つ必要があるかどうかは、すべて `proxy.auth_mode` の「有効モード」で決定されます（以下の「認証モード」およびソースコード内の `auth_middleware` 詳細参照）。
:::

---

## 認証モード

すべてのエンドポイントのアクセス権限は `proxy.auth_mode` で制御されます：

| モード | 説明 | `/healthz` は認証が必要？ | 他のエンドポイントは認証が必要？ |
| --- | --- | --- | --- |
| `off` | 完全に公開 | ❌ いいえ | ❌ いいえ |
| `strict` | すべて認証必要 | ✅ はい | ✅ はい |
| `all_except_health` | ヘルスチェックのみ公開 | ❌ いいえ | ✅ はい |
| `auto` | 自動判断（デフォルト） | ❌ いいえ | `allow_lan_access` による |

::: info auto モードロジック
`auto` は独立戦略ではなく、設定から導出されます：`proxy.allow_lan_access=true` の時 `all_except_health` と同等、そうでない場合 `off` と同等（`docs/proxy/auth.md` 参照）。
:::

**認証リクエストフォーマット**：

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI スタイル）
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini スタイル）
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI スタイル）
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini スタイル）
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## このセクションのまとめ

Antigravity Tools は、OpenAI、Anthropic、Gemini の 3 つの主流 API フォーマットと MCP ツール呼び出し拡張をサポートする、完全なマルチプロトコル互換エンドポイントを提供します。

- **迅速な統合**：OpenAI プロトコルエンドポイントを優先的に使用し、互換性が最も高い
- **ネイティブ機能**：Claude Code の完全な機能が必要な場合、Anthropic プロトコルエンドポイントを使用
- **Google エコシステム**：Google 公式 SDK を使用する場合、Gemini プロトコルエンドポイントを選択
- **セキュリティ設定**：使用シナリオ（ローカル/LAN/インターネット）に基づいて適切な認証モードを選択

---

## 次のレッスンの予告

> 次のレッスンでは **[データとモデル](../storage-models/)** を学びます。
>
> 学べること：
> - アカウントファイルの保存構造
> - SQLite 統計データベースのテーブル構造
> - 重要フィールド口径とバックアップ戦略

---

## 付録：ソースコード参考

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| ルート登録（すべてのエンドポイント） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 認証ミドルウェア（Header 互換 + `/healthz` 除外 + OPTIONS 通過） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode モードと auto 派生ルール | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz` 戻り値 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| テレメトリログインターセプト（silent 200） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**主要な関数**：
- `AxumServer::start()`：Axum サーバーを起動し、ルートを登録（79-254 行）
- `health_check_handler()`：ヘルスチェック処理（266-272 行）
- `silent_ok_handler()`：サイレント成功処理（274-277 行）

</details>
