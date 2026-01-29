---
title: "z.ai 統合: 能力境界の詳細解説 | Antigravity-Manager"
sidebarTitle: "z.ai 境界一覧"
subtitle: "z.ai 統合: 能力境界の詳細解説"
description: "Antigravity Tools の z.ai 統合境界を把握します。リクエストルーティング、dispatch_mode 分散、モデルマッピング、Header セキュリティポリシー、MCP リバースプロキシと制限を理解し、誤判断を回避します。"
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "能力境界"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# z.ai 統合の能力境界（実装済み vs 明確に未実装）

このドキュメントは Antigravity Tools の z.ai の「境界」のみを説明し、「接続方法」は説明しません。特定の機能が有効になっていないと気づいた場合、ここで照合してください：それはまだ有効になっていないのか、設定されていないのか、それとも最初から実装されていないのか。

## 学べること

- z.ai に期待できることかどうかを判断できる：「実装済み」と「明確に未実装」の区別
- z.ai がどのエンドポイントにのみ影響するか（およびどのエンドポイントには完全に影響しないか）を明確にする
- 各結論のソースコード/ドキュメントの証拠（GitHub 行番号リンク付き）を確認し、自分で再検証できるようにする

## 現在の課題

あなたはすでに Antigravity Tools で z.ai を有効にしているかもしれませんが、使用すると以下のような疑問に直面しているかもしれません：

- なぜ一部のリクエストは z.ai を経由し、一部は全く経由しないのか？
- MCP エンドポイントは「完全な MCP Server」として使用できるか？
- UI で見えるスイッチは、実際の実装に対応しているのか？

## z.ai 統合とは（このプロジェクトで）？

**z.ai 統合**は Antigravity Tools ではオプションの「アップストリームプロバイダー + MCP 拡張」です。特定の条件下でのみ Claude プロトコルリクエストを引き継ぎ、MCP Search/Reader リバースプロキシと最小限の Vision MCP 内蔵サーバーを提供します。全プロトコル、全機能の置換ソリューションではありません。

::: info 一言で記憶
z.ai は「Claude リクエストのオプションのアップストリーム + 一連のオン/オフ可能な MCP エンドポイント」として使用でき、「z.ai のすべての機能を完全に取り込む」ものと期待しないでください。
:::

## 実装済み：安定して利用可能（ソースコードを基準）

### 1) Claude プロトコルのみが z.ai を経由する（/v1/messages + /v1/messages/count_tokens）

z.ai の Anthropic アップストリーム転送は、Claude ハンドラーの z.ai ブランチでのみ発生します：

- `POST /v1/messages`：`use_zai=true` の場合、`forward_anthropic_json(...)` を呼び出して JSON リクエストを z.ai Anthropic 互換エンドポイントに転送します
- `POST /v1/messages/count_tokens`：z.ai が有効な場合も同様に転送します。それ以外の場合はプレースホルダー `{input_tokens:0, output_tokens:0}` を返します

証拠：

- z.ai ブランチ選択と転送エントリ：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- count_tokens の z.ai ブランチとプレースホルダー返却：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- z.ai Anthropic 転送実装：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip 「レスポンスストリーミング」の理解方法
`forward_anthropic_json` はアップストリームレスポンスボディを `bytes_stream()` でストリーミングしてクライアントに返し、SSE を解析しません（`providers/zai_anthropic.rs` の Response body 構築を参照）。
:::

### 2) スケジューリングモード（dispatch_mode）の「実際の意味」

`dispatch_mode` は `/v1/messages` が z.ai を経由するかどうかを決定します：

| dispatch_mode | 何が起こるか | 証拠 |
|--- | --- | ---|
| `off` | z.ai を使用しない | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | すべての Claude リクエストが z.ai を経由する | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Google プールが使用不可（0 アカウントまたは「使用可能なアカウントなし」）の場合のみ z.ai を経由する | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | z.ai を「追加の 1 つのスロット」としてラウンドロビンに参加させる（必ずヒットする保証はない） | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning pooled のよくある誤解
`pooled` は「z.ai と Google アカウントプールの両方を使用し、重みに基づいて安定して分散する」わけではありません。コードには明確に「no strict guarantees」と書かれており、本質的にはラウンドロビンスロット（`slot == 0` の場合のみ z.ai を経由）です。
:::

### 3) モデルマッピング：Claude モデル名が z.ai の glm-* にどう変換されるか

z.ai に転送する前に、リクエストボディに `model` フィールドがある場合、次のように書き換えられます：

1. `proxy.zai.model_mapping` の完全一致（元の文字列と小文字のキーを同時にサポート）
2. `zai:<model>` プレフィックス：`zai:` を削除して直接使用
3. `glm-*`：変更なし
4. `claude-*` 以外：変更なし
5. `claude-*` で `opus/haiku` を含む：`proxy.zai.models.opus/haiku` にマッピング；それ以外はデフォルトで `sonnet`

証拠：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37)、[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) 転送時の Header セキュリティポリシー（ローカルプロキシキーの漏洩を回避）

z.ai アップストリーム転送は「すべての Header をそのまま渡す」のではなく、2 層の防御を行います：

- 一部の Header のみを許可（例：`content-type`、`accept`、`anthropic-version`、`user-agent`）
- z.ai の API Key をアップストリームに注入（クライアントが使用する認証方式を優先：`x-api-key` または `Authorization: Bearer ...`）

証拠：

- Header ホワイトリスト：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- z.ai auth の注入：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## 実装済み：MCP（Search/Reader リバースプロキシ + Vision 内蔵）

### 1) MCP Search/Reader：z.ai の MCP エンドポイントへのリバースプロキシ

ローカルエンドポイントとアップストリームアドレスは固定されています：

| ローカルエンドポイント | アップストリームアドレス | スイッチ | 証拠 |
|--- | --- | --- | ---|
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 は「ネットワークの問題」ではありません
`proxy.zai.mcp.enabled=false`、または対応する `web_search_enabled/web_reader_enabled=false` の場合、これらのエンドポイントは直接 404 を返します。
:::

証拠：

- MCP 総スイッチと z.ai キー検証：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- ルーティング登録：[`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP：「最小限の Streamable HTTP MCP」内蔵サーバー

Vision MCP はリバースプロキシではなく、ローカル内蔵実装です：

- エンドポイント：`/mcp/zai-mcp-server/mcp`
- `POST` でサポート：`initialize`、`tools/list`、`tools/call`
- `GET` で SSE keepalive を返却（初期化されたセッションが必要）
- `DELETE` でセッションを終了

証拠：

- ハンドラーメインエントリとメソッドディスパッチ：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- `initialize`、`tools/list`、`tools/call` の実装：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Vision MCP の「最小実装」の位置付け：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP ツールセット（8 つ）とファイルサイズ制限

ツールリストは `tool_specs()` から取得されます：

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

証拠：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270)、[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

ローカルファイルは読み取られて `data:<mime>;base64,...` にエンコードされ、同時にハード制限があります：

- 画像の上限は 5 MB（`image_source_to_content(..., 5)`）
- 動画の上限は 8 MB（`video_source_to_content(..., 8)`）

証拠：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## 明確に未実装 / 期待しないでください（ドキュメント宣言と実装の詳細を基準）

### 1) z.ai 使用量/予算監視（usage/budget）は未実装

`docs/zai/implementation.md` に明確に「not implemented yet」と記載されています。これは以下を意味します：

- Antigravity Tools が z.ai の usage/budget クエリやアラートを提供することは期待できません
- クォータガバナンス（Quota Protection）も自動的に z.ai の予算/使用量データを読み取りません

証拠：[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP は完全な MCP Server ではありません

Vision MCP は現在、ツール呼び出しに「十分な」最小実装として位置づけられており、prompts/resources、resumability、streamed tool output などはまだ実装されていません。

証拠：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36)、[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` は z.ai の実際のモデルリストを反映しません

このエンドポイントが返すモデルリストはローカルの内蔵マッピングとカスタムマッピング（`get_all_dynamic_models`）から取得され、z.ai アップストリームの `/v1/models` をリクエストしません。

証拠：

- ハンドラー：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- リスト生成ロジック：[`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## 設定フィールド一覧（z.ai 関連）

z.ai 設定は `ProxyConfig.zai` の下にあり、以下のフィールドが含まれます：

- `enabled` / `base_url` / `api_key`
- `dispatch_mode`（`off/exclusive/pooled/fallback`）
- `model_mapping`（完全一致で上書き）
- `models.{opus,sonnet,haiku}`（Claude ファミリーのデフォルトマッピング）
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

デフォルト値（base_url / デフォルトモデル）も同じファイルにあります：

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

証拠：[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116)、[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## 本レッスンのまとめ

- z.ai は現在 Claude プロトコル（`/v1/messages` + `count_tokens`）のみを引き継ぎ、他のプロトコルエンドポイントは「自動的に z.ai を経由する」わけではありません
- MCP Search/Reader はリバースプロキシです。Vision MCP はローカルの最小実装であり、完全な MCP Server ではありません
- `/v1/models/claude` のモデルリストはローカルマッピングから取得され、z.ai アップストリームの実際のモデルを表すものではありません

---

## 次のレッスンの予告

> 次のレッスンでは **[バージョン進化](../../changelog/release-notes/)** を学習します。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| z.ai 統合範囲（Claude プロトコル + MCP + Vision MCP） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai スケジューリングモードとモデルのデフォルト値 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai デフォルト base_url / デフォルトモデル | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages` が z.ai を経由するかどうかの選択ロジック | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens` の z.ai 転送とプレースホルダー返却 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic アップストリーム転送（JSON 転送 + レスポンスストリーミング返却） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai モデルマッピングルール（map_model_for_zai） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header ホワイトリスト + z.ai auth の注入 | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader リバースプロキシとスイッチ | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
|--- | --- | ---|
| Vision MCP 最小実装の位置付け（完全な MCP Server ではない） | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision ツールリストと制限（tool_specs + ファイルサイズ + stream=false） | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` モデルリストのソース（ローカルマッピング、アップストリームを照会しない） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| 使用量/予算監視未実装（ドキュメント宣言） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
