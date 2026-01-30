---
title: "API仕様: Antigravity ゲートウェイインターフェース技術リファレンス | antigravity-auth"
sidebarTitle: "API 呼び出しのデバッグ"
subtitle: "Antigravity API 仕様"
description: "Antigravity API 仕様を学び、統一ゲートウェイインターフェースのエンドポイント設定、OAuth 2.0 認証、リクエストレスポンス形式、関数呼び出しルール、エラー処理メカニズムを習得します。"
tags:
  - "API"
  - "仕様"
  - "Antigravity"
  - "技術リファレンス"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API 仕様

> **⚠️ 重要なヒント**：これは Antigravity の**内部 API 仕様**であり、公開ドキュメントではありません。このチュートリアルは直接 API テストに基づいており、API の詳細を深く理解する必要がある開発者に適しています。

プラグインを使用したいだけの場合は、[クイックスタート](/ja/NoeFabris/opencode-antigravity-auth/start/quick-install/) と [設定ガイド](/ja/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/) を参照してください。

---

## このチュートリアルで学べること

- Antigravity 統一ゲートウェイ API の動作原理を理解する
- リクエスト/レスポンス形式と JSON Schema の制限を習得する
- Thinking モデルと関数呼び出しの設定方法を知る
- レート制限とエラー処理のメカニズムを理解する
- API 呼び出しの問題をデバッグできるようになる

---

## Antigravity API 概要

**Antigravity** は Google の統一ゲートウェイ API であり、Gemini スタイルのインターフェースを通じて Claude、Gemini などの複数の AI モデルにアクセスし、単一の形式と統一されたレスポンス構造を提供します。

::: info Vertex AI との違い
Antigravity **は** Vertex AI の直接モデル API **ではありません**。これは内部ゲートウェイであり、以下を提供します：
- 単一の API 形式（すべてのモデルは Gemini スタイル）
- プロジェクトレベルのアクセス（Google Cloud 認証を通じて）
- モデルバックエンドへの内部ルーティング（Claude 用 Vertex AI、Gemini 用 Gemini API）
- 統一されたレスポンス形式（`candidates[]` 構造）
:::

**コア機能**：

| 機能 | 説明 |
|--- | ---|
| **単一 API 形式** | すべてのモデルは Gemini スタイルの `contents` 配列を使用 |
| **プロジェクトレベルアクセス** | 有効な Google Cloud Project ID が必要 |
| **内部ルーティング** | 正しいバックエンド（Vertex AI または Gemini API）に自動ルーティング |
| **統一されたレスポンス** | すべてのモデルは `candidates[]` 構造を返す |
| **Thinking サポート** | Claude と Gemini 3 は拡張推論をサポート |

---

## エンドポイントとパス

### API 環境

| 環境 | URL | ステータス | 用途 |
|--- | --- | --- | ---|
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ アクティブ | 主要エンドポイント（CLIProxy と一致） |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ アクティブ | Gemini CLI モデル、loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ 使用不可 | 非推奨 |

**ソースコードの場所**：[`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API パス

| アクション | パス | 説明 |
|--- | --- | ---|
| コンテンツ生成 | `/v1internal:generateContent` | 非ストリーミングリクエスト |
| ストリーミング生成 | `/v1internal:streamGenerateContent?alt=sse` | ストリーミングリクエスト（SSE） |
| コードアシスタントのロード | `/v1internal:loadCodeAssist` | プロジェクト発見（Project ID を自動取得） |
| ユーザーオンボーディング | `/v1internal:onboardUser` | ユーザーガイダンス（通常は使用しない） |

---

## 認証方式

### OAuth 2.0 フロー

```
認可 URL: https://accounts.google.com/o/oauth2/auth
トークン URL: https://oauth2.googleapis.com/token
```

### 必要な Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**ソースコードの場所**：[`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### 必要な Headers

#### Antigravity エンドポイント（デフォルト）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI エンドポイント（`:antigravity` サフィックスのないモデル）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### ストリーミングリクエストの追加 Header

```http
Accept: text/event-stream
```

**ソースコードの場所**：[`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## リクエスト形式

### 基本構造

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Contents 配列（必須）

::: warning 重要な制限
**Gemini スタイル形式**を使用する必要があります。Anthropic スタイルの `messages` 配列は**サポートされていません**。
:::

**正しい形式**：

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your message here" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Assistant response" }
      ]
    }
  ]
}
```

**Role の値**：
- `user` - ユーザー/人間のメッセージ
- `model` - モデルのレスポンス（**`assistant` ではない**）

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| フィールド | 型 | 説明 |
|--- | --- | ---|
| `maxOutputTokens` | number | レスポンスの最大トークン数 |
| `temperature` | number | ランダム性（0.0 - 2.0） |
| `topP` | number | nucleus sampling しきい値 |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | 生成を停止するトリガーワード |
| `thinkingConfig` | object | 拡張推論の設定（Thinking モデル） |

### System Instructions

::: warning 形式の制限
System Instruction は**`parts` を含むオブジェクト**である必要があり、純粋な文字列**であってはなりません**。
:::

```json
// ✅ 正しい
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ 誤り - 400 エラーが返されます
{
  "systemInstruction": "You are a helpful assistant."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Get weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Function 命名規則

| 規則 | 説明 |
|--- | ---|
| 最初の文字 | アルファベット（a-z, A-Z）またはアンダースコア（_）である必要があります |
| 使用可能な文字 | `a-zA-Z0-9`、アンダースコア（_）、ドット（.）、コロン（:）、ハイフン（-） |
| 最大長 | 64 文字 |
| 使用不可 | スラッシュ（/）、スペース、その他の特殊文字 |

**例**：
- ✅ `get_weather` - 有効
- ✅ `mcp:mongodb.query` - 有効（コロンとドットを使用可能）
- ✅ `read-file` - 有効（ハイフンを使用可能）
- ❌ `mcp/query` - 無効（スラッシュは使用不可）
- ❌ `123_tool` - 無効（アルファベットまたはアンダースコアで始める必要があります）

---

## JSON Schema サポート

### サポートされている機能

| 機能 | ステータス | 説明 |
|--- | --- | ---|
| `type` | ✅ サポート | `object`、`string`、`number`、`integer`、`boolean`、`array` |
| `properties` | ✅ サポート | オブジェクトプロパティ |
| `required` | ✅ サポート | 必須フィールド配列 |
| `description` | ✅ サポート | フィールドの説明 |
| `enum` | ✅ サポート | 列挙値 |
| `items` | ✅ サポート | 配列要素の schema |
| `anyOf` | ✅ サポート | 内部的に `any_of` に変換 |
| `allOf` | ✅ サポート | 内部的に `all_of` に変換 |
| `oneOf` | ✅ サポート | 内部的に `one_of` に変換 |
| `additionalProperties` | ✅ サポート | 追加プロパティの schema |

### サポートされていない機能（400 エラーの原因）

::: danger 以下のフィールドは 400 エラーを引き起こします
- `const` - 代わりに `enum: [value]` を使用
- `$ref` - インライン schema 定義
- `$defs` / `definitions` - インライン定義
- `$schema` - これらのメタデータフィールドを削除
- `$id` - これらのメタデータフィールドを削除
- `default` - これらのドキュメントフィールドを削除
- `examples` - これらのドキュメントフィールドを削除
- `title`（ネスト） - ⚠️ ネストされたオブジェクトで問題を引き起こす可能性があります
:::

```json
// ❌ 誤り - 400 エラーが返されます
{ "type": { "const": "email" } }

// ✅ 正しい - 代わりに enum を使用
{ "type": { "enum": ["email"] } }
```

**プラグインによる自動処理**：プラグインは `request-helpers.ts` の `cleanJSONSchemaForAntigravity()` 関数を通じて、これらの変換を自動的に処理します。

---

## レスポンス形式

### 非ストリーミングレスポンス

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Response text here" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### ストリーミングレスポンス（SSE）

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### レスポンスフィールドの説明

| フィールド | 説明 |
|--- | ---|
| `response.candidates` | レスポンス候補配列 |
| `response.candidates[].content.role` | 常に `"model"` |
| `response.candidates[].content.parts` | コンテンツ部分の配列 |
| `response.candidates[].finishReason` | `STOP`、`MAX_TOKENS`、`OTHER` |
| `response.usageMetadata.promptTokenCount` | 入力トークン数 |
| `response.usageMetadata.candidatesTokenCount` | 出力トークン数 |
| `response.usageMetadata.totalTokenCount` | 総トークン数 |
| `response.usageMetadata.thoughtsTokenCount` | Thinking トークン数（Gemini） |
| `response.modelVersion` | 実際に使用されたモデル |
| `response.responseId` | リクエスト ID（形式はモデルによって異なります） |
| `traceId` | デバッグ用トレース ID |

### Response ID 形式

| モデルタイプ | 形式 | 例 |
|--- | --- | ---|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64 スタイル | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64 スタイル | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call レスポンス

モデルが関数を呼び出したい場合：

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Function 結果の提供

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "What's the weather?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / 拡張推論

### Thinking の設定

Thinking をサポートするモデル（`*-thinking`）の場合：

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning 重要な制限
`maxOutputTokens` は `thinkingBudget` より**大きく**ある必要があります
:::

### Thinking レスポンス（Gemini）

Gemini モデルは署名付き thinking を返します：

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Let me think about this..."
    },
    {
      "text": "The answer is..."
    }
  ]
}
```

### Thinking レスポンス（Claude）

Claude thinking モデルには `thought: true` の部分が含まれる場合があります：

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Reasoning process...",
      "thoughtSignature": "..."
    },
    {
      "text": "Final answer..."
    }
  ]
}
```

**プラグインによる処理**：プラグインは thinking 署名を自動的にキャッシュし、マルチターン会話での署名エラーを回避します。詳細は [advanced/session-recovery/](/ja/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/) を参照してください。

---

## エラーレスポンス

### エラー構造

```json
{
  "error": {
    "code": 400,
    "message": "Error description",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### 一般的なエラーコード

| Code | Status | 説明 |
|--- | --- | ---|
| 400 | `INVALID_ARGUMENT` | 無効なリクエスト形式 |
| 401 | `UNAUTHENTICATED` | 無効または期限切れのトークン |
| 403 | `PERMISSION_DENIED` | リソースへのアクセス権限なし |
| 404 | `NOT_FOUND` | モデルが見つかりません |
| 429 | `RESOURCE_EXHAUSTED` | レート制限超過 |

### レート制限レスポンス

```json
{
  "error": {
    "code": 429,
    "message": "You have exhausted your capacity on this model. Your quota will reset after 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**プラグインによる処理**：プラグインは 429 エラーを自動的に検出し、アカウントを切り替えるかリセット時間まで待機します。詳細は [advanced/rate-limit-handling/](/ja/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/) を参照してください。

---

## サポートされていない機能

以下の Anthropic/Vertex AI 機能は**サポートされていません**：

| 機能 | エラー |
|--- | ---|
| `anthropic_version` | Unknown field |
| `messages` 配列 | Unknown field（`contents` を使用する必要があります） |
| `max_tokens` | Unknown field（`maxOutputTokens` を使用する必要があります） |
| 純粋な文字列 `systemInstruction` | Invalid value（オブジェクト形式を使用する必要があります） |
| `system_instruction`（ルートレベルの snake_case） | Unknown field |
| JSON Schema `const` | Unknown field（代わりに `enum: [value]` を使用） |
| JSON Schema `$ref` | サポートされていません（インライン定義） |
| JSON Schema `$defs` | サポートされていません（インライン定義） |
| Tool 名に `/` が含まれる | Invalid（代わりに `_` または `:` を使用） |
| Tool 名が数字で始まる | Invalid（アルファベットまたはアンダースコアで始める必要があります） |

---

## 完全なリクエストの例

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello, how are you?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "You are a helpful assistant." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## レスポンス Headers

| Header | 説明 |
|--- | ---|
| `x-cloudaicompanion-trace-id` | デバッグ用トレース ID |
| `server-timing` | リクエスト所要時間 |

---

## Antigravity vs Vertex AI Anthropic の比較

| 機能 | Antigravity | Vertex AI Anthropic |
|--- | --- | ---|
| エンドポイント | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| リクエスト形式 | Gemini スタイル `contents` | Anthropic `messages` |
| `anthropic_version` | 使用しない | 必須 |
| モデル名 | シンプル（`claude-sonnet-4-5`） | バージョン付き（`claude-4-5@date`） |
| レスポンス形式 | `candidates[]` | Anthropic `content[]` |
| マルチモデルサポート | あり（Claude、Gemini など） | Anthropic のみ |

---

## このレッスンのまとめ

このチュートリアルでは、Antigravity 統一ゲートウェイ API の内部仕様について詳しく説明しました：

- **エンドポイント**：3 つの環境（Daily、Production、Autopush）、Daily Sandbox が主要エンドポイント
- **認証**：OAuth 2.0 + Bearer Token、必要な scopes と headers
- **リクエスト形式**：Gemini スタイルの `contents` 配列、System Instruction と Tools をサポート
- **JSON Schema**：一般的な機能をサポート、`const`、`$ref`、`$defs` はサポートされていません
- **レスポンス形式**：`candidates[]` 構造、ストリーミング SSE をサポート
- **Thinking**：Claude と Gemini 3 は拡張推論をサポート、`thinkingConfig` が必要
- **エラー処理**：標準エラー形式、429 はリトライ遅延を含む

API 呼び出しの問題をデバッグする場合、プラグインのデバッグモードを使用できます：

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## 次のレッスンのプレビュー

> これは最後のレッスン付録です。技術的な詳細についてさらに知りたい場合は、以下を参照できます：
> - [アーキテクチャ概要](/ja/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - プラグインのモジュールアーキテクチャと呼び出しフローを理解する
> - [ストレージ形式](/ja/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - アカウントストレージファイル形式を理解する
> - [設定オプション](/ja/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - すべての設定オプションの完全なリファレンスマニュアル

スタートアップフェーズに戻る必要がある場合は、[Antigravity Auth とは](/ja/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) からやり直すことができます。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| API エンドポイント定数 | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| リクエスト変換の主要ロジック | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON Schema クリーンアップ | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 全体 |
| 思考署名キャッシュ | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | 全体 |

**重要な定数**：
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox エンドポイント
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production エンドポイント
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - デフォルトプロジェクト ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - 思考署名検証をスキップするセンチネル値

**重要な関数**：
- `cleanJSONSchemaForAntigravity(schema)` - JSON Schema をクリーンアップして Antigravity API の要件に適合させる
- `prepareAntigravityRequest(request)` - Antigravity API リクエストを準備して送信する
- `createStreamingTransformer()` - ストリーミングレスポンストランスフォーマーを作成する

</details>
