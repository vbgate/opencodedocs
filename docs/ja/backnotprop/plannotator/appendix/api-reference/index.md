---
title: "API リファレンス：ローカルインターフェースドキュメント | Plannotator"
sidebarTitle: "API リファレンス"
subtitle: "API リファレンス：ローカルインターフェースドキュメント | Plannotator"
description: "Plannotator が提供するすべての API エンドポイントとリクエスト/レスポンス形式について学びます。計画レビュー、コードレビュー、画像アップロードなどのインターフェースの完全な仕様を詳しく紹介し、統合開発を支援します。"
tags:
  - "API"
  - "付録"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API リファレンス

## 学習目標

- Plannotator ローカルサーバーが提供するすべての API エンドポイントを理解する
- 各 API のリクエストとレスポンス形式を確認する
- 計画レビューとコードレビューのインターフェースの違いを理解する
- 統合や拡張開発のための参考資料を得る

## 概要

Plannotator はローカルで HTTP サーバー（Bun.serve を使用）を実行し、計画レビューとコードレビュー用の RESTful API を提供します。すべての API レスポンスは JSON 形式で、認証は不要です（ローカル隔離環境）。

**サーバー起動方式**：
- ランダムポート（ローカルモード）
- 固定ポート 19432（リモート/Devcontainer モード、`PLANNOTATOR_PORT` で上書き可能）

**API ベース URL**：`http://localhost:<PORT>/api/`

::: tip ヒント
以下の API は機能モジュール別に分類されています。同じパスでも計画レビューサーバーとコードレビューサーバーで動作が異なる場合があります。
:::

## 計画レビュー API

### GET /api/plan

現在の計画内容と関連メタ情報を取得します。

**リクエスト**：なし

**レスポンス例**：

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `plan` | string | 計画の Markdown コンテンツ |
| `origin` | string | ソース識別子（`"claude-code"` または `"opencode"`） |
| `permissionMode` | string | 現在の権限モード（Claude Code 専用） |
| `sharingEnabled` | boolean | URL 共有が有効かどうか |

---

### POST /api/approve

現在の計画を承認し、オプションでノートアプリに保存します。

**リクエストボディ**：

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "承認時のメモ（OpenCode のみ）",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**レスポンス例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**フィールド説明**：

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `obsidian` | object | いいえ | Obsidian 保存設定 |
| `bear` | object | いいえ | Bear 保存設定 |
| `feedback` | string | いいえ | 承認時に添付するメモ（OpenCode のみ） |
| `agentSwitch` | string | いいえ | 切り替え先の Agent 名（OpenCode のみ） |
| `permissionMode` | string | いいえ | リクエストする権限モード（Claude Code のみ） |
| `planSave` | object | いいえ | 計画保存設定 |

**Obsidian 設定フィールド**：

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `vaultPath` | string | はい | Vault ファイルパス |
| `folder` | string | いいえ | 保存先フォルダ（デフォルトはルートディレクトリ） |
| `tags` | string[] | いいえ | 自動生成されるタグ |
| `plan` | string | はい | 計画コンテンツ |

---

### POST /api/deny

現在の計画を却下し、フィードバックを送信します。

**リクエストボディ**：

```json
{
  "feedback": "ユニットテストのカバレッジを追加する必要があります",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**レスポンス例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**フィールド説明**：

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `feedback` | string | いいえ | 却下理由（デフォルト "Plan rejected by user"） |
| `planSave` | object | いいえ | 計画保存設定 |

---

### GET /api/obsidian/vaults

ローカルに設定されている Obsidian vault を検出します。

**リクエスト**：なし

**レスポンス例**：

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**設定ファイルパス**：
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## コードレビュー API

### GET /api/diff

現在の git diff コンテンツを取得します。

**リクエスト**：なし

**レスポンス例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `rawPatch` | string | Git diff 統一形式パッチ |
| `gitRef` | string | 使用された Git 参照 |
| `origin` | string | ソース識別子 |
| `diffType` | string | 現在の diff タイプ |
| `gitContext` | object | Git コンテキスト情報 |
| `sharingEnabled` | boolean | URL 共有が有効かどうか |

**gitContext フィールド説明**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `currentBranch` | string | 現在のブランチ名 |
| `defaultBranch` | string | デフォルトブランチ名（main または master） |
| `diffOptions` | object[] | 利用可能な diff タイプオプション（id と label を含む） |

---

### POST /api/diff/switch

異なるタイプの git diff に切り替えます。

**リクエストボディ**：

```json
{
  "diffType": "staged"
}
```

**サポートされる diff タイプ**：

| タイプ | Git コマンド | 説明 |
| --- | --- | --- |
| `uncommitted` | `git diff HEAD` | コミットされていない変更（デフォルト） |
| `staged` | `git diff --staged` | ステージングされた変更 |
| `last-commit` | `git diff HEAD~1..HEAD` | 最後のコミット |
| `vs main` | `git diff main..HEAD` | 現在のブランチ vs main |

**レスポンス例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

コードレビューのフィードバックを AI Agent に送信します。

**リクエストボディ**：

```json
{
  "feedback": "エラーハンドリングロジックの追加を推奨します",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "ここは try-catch を使うべきです",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**フィールド説明**：

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `feedback` | string | いいえ | テキストフィードバック（LGTM など） |
| `annotations` | array | いいえ | 構造化アノテーション配列 |
| `agentSwitch` | string | いいえ | 切り替え先の Agent 名（OpenCode のみ） |

**annotation オブジェクトフィールド**：

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | string | はい | 一意識別子 |
| `type` | string | はい | タイプ：`comment`、`suggestion`、`concern` |
| `filePath` | string | はい | ファイルパス |
| `lineStart` | number | はい | 開始行番号 |
| `lineEnd` | number | はい | 終了行番号 |
| `side` | string | はい | サイド：`"old"` または `"new"` |
| `text` | string | いいえ | コメント内容 |
| `suggestedCode` | string | いいえ | 提案コード（suggestion タイプ用） |

**レスポンス例**：

```json
{
  "ok": true
}
```

---

## 共有 API

### GET /api/image

画像を取得します（ローカルファイルパスまたはアップロードされた一時ファイル）。

**リクエストパラメータ**：

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `path` | string | はい | 画像ファイルパス |

**リクエスト例**：`GET /api/image?path=/tmp/plannotator/abc-123.png`

**レスポンス**：画像ファイル（PNG/JPEG/WebP）

**エラーレスポンス**：
- `400` - path パラメータがありません
- `404` - ファイルが存在しません
- `500` - ファイル読み取りに失敗しました

---

### POST /api/upload

画像を一時ディレクトリにアップロードし、アクセス可能なパスを返します。

**リクエスト**：`multipart/form-data`

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `file` | File | はい | 画像ファイル |

**サポートされる形式**：PNG、JPEG、WebP

**レスポンス例**：

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**エラーレスポンス**：
- `400` - ファイルが提供されていません
- `500` - アップロードに失敗しました

::: info 説明
アップロードされた画像は `/tmp/plannotator` ディレクトリに保存され、サーバー終了後も自動的にはクリーンアップされません。
:::

---

### GET /api/agents

利用可能な OpenCode Agent のリストを取得します（OpenCode のみ）。

**リクエスト**：なし

**レスポンス例**：

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**フィルタリングルール**：
- `mode === "primary"` の agent のみを返す
- `hidden === true` の agent を除外

**エラーレスポンス**：

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## エラーハンドリング

### HTTP ステータスコード

| ステータスコード | 説明 |
| --- | --- |
| `200` | リクエスト成功 |
| `400` | パラメータ検証失敗 |
| `404` | リソースが存在しません |
| `500` | サーバー内部エラー |

### エラーレスポンス形式

```json
{
  "error": "エラー説明メッセージ"
}
```

### よくあるエラー

| エラー | トリガー条件 |
| --- | --- |
| `Missing path parameter` | `/api/image` で `path` パラメータがない |
| `File not found` | `/api/image` で指定されたファイルが存在しない |
| `No file provided` | `/api/upload` でファイルがアップロードされていない |
| `Missing diffType` | `/api/diff/switch` で `diffType` フィールドがない |
| `Port ${PORT} in use` | ポートが使用中（サーバー起動失敗） |

---

## サーバー動作

### ポートリトライメカニズム

- 最大リトライ回数：5 回
- リトライ遅延：500 ミリ秒
- タイムアウトエラー：`Port ${PORT} in use after 5 retries`

::: warning リモートモードの注意
リモート/Devcontainer モードでポートが使用中の場合、`PLANNOTATOR_PORT` 環境変数を設定して別のポートを使用できます。
:::

### 決定待機

サーバー起動後、ユーザーの決定を待つ状態に入ります：

**計画レビューサーバー**：
- `/api/approve` または `/api/deny` の呼び出しを待機
- 呼び出し後、決定を返してサーバーを終了

**コードレビューサーバー**：
- `/api/feedback` の呼び出しを待機
- 呼び出し後、フィードバックを返してサーバーを終了

### SPA フォールバック

マッチしないすべてのパスは埋め込み HTML（シングルページアプリケーション）を返します：

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

これにより、フロントエンドルーティングが正常に動作します。

---

## 環境変数

| 変数 | 説明 | デフォルト値 |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | リモートモードを有効化 | 未設定 |
| `PLANNOTATOR_PORT` | 固定ポート番号 | ランダム（ローカル）/ 19432（リモート） |
| `PLANNOTATOR_ORIGIN` | ソース識別子 | `"claude-code"` または `"opencode"` |
| `PLANNOTATOR_SHARE` | URL 共有を無効化 | 未設定（有効） |

::: tip ヒント
環境変数の詳細な設定については、[環境変数設定](../../advanced/environment-variables/) セクションを参照してください。
:::

---

## 本課のまとめ

Plannotator は完全なローカル HTTP API を提供し、計画レビューとコードレビューの 2 つのコア機能をサポートしています：

- **計画レビュー API**：計画の取得、承認/却下の決定、Obsidian/Bear 統合
- **コードレビュー API**：diff の取得、diff タイプの切り替え、構造化フィードバックの送信
- **共有 API**：画像のアップロード/ダウンロード、Agent リストのクエリ
- **エラーハンドリング**：統一された HTTP ステータスコードとエラー形式

すべての API はローカルで実行され、データのアップロードはなく、安全で信頼性があります。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 計画レビューサーバーエントリ | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents（計画レビュー） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| コードレビューサーバーエントリ | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents（コードレビュー） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**重要な定数**：
- `MAX_RETRIES = 5`：サーバー起動の最大リトライ回数（`packages/server/index.ts:79`、`packages/server/review.ts:68`）
- `RETRY_DELAY_MS = 500`：ポートリトライ遅延（`packages/server/index.ts:80`、`packages/server/review.ts:69`）

**重要な関数**：
- `startPlannotatorServer(options)`：計画レビューサーバーを起動（`packages/server/index.ts:91`）
- `startReviewServer(options)`：コードレビューサーバーを起動（`packages/server/review.ts:79`）

</details>
