---
title: "クイックインストール: 5分でプラグイン設定完了 | Antigravity Auth"
sidebarTitle: "5分で始める"
subtitle: "Antigravity Auth クイックインストール：5分でプラグイン設定完了"
description: "Antigravity Auth プラグインのクイックインストール方法を解説。AI アシスト/手動の2つのインストール方法、モデル定義の設定、Google OAuth 認証、動作確認まで網羅。"
tags:
  - "クイックスタート"
  - "インストールガイド"
  - "OAuth"
  - "プラグイン設定"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth クイックインストール：5分でプラグイン設定完了

Antigravity Auth のクイックインストールで、5分以内に OpenCode プラグインを設定し、Claude や Gemini 3 の高性能モデルを使い始めましょう。本チュートリアルでは、2つのインストール方法（AI アシスト/手動設定）を紹介し、プラグインのインストール、OAuth 認証、モデル定義、動作確認までをカバーします。

## 学べること

- ✅ 5分以内に Antigravity Auth プラグインをインストールする
- ✅ Claude と Gemini 3 モデルへのアクセス権限を設定する
- ✅ Google OAuth 認証を実行し、インストールの成功を確認する

## 現状の課題

Antigravity Auth の強力な機能（Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash）を試したいけれど、プラグインのインストール方法やモデルの設定方法がわからず、一歩間違えると詰まってしまうのではないかと不安に感じている。

## こんなときに使う

- Antigravity Auth プラグインを初めて使うとき
- 新しいマシンに OpenCode をインストールするとき
- プラグインを再設定する必要があるとき

## 🎒 始める前の準備

::: warning 事前チェック

始める前に、以下を確認してください：
- [ ] OpenCode CLI がインストール済み（`opencode` コマンドが使用可能）
- [ ] Google アカウントを持っている（OAuth 認証に使用）
- [ ] Antigravity Auth の基本概念を理解している（[Antigravity Auth とは？](/ja/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) を参照）

:::

## 基本的な流れ

Antigravity Auth のインストールは4つのステップで完了します：

1. **プラグインのインストール** → OpenCode 設定でプラグインを有効化
2. **OAuth 認証** → Google アカウントでログイン
3. **モデルの設定** → Claude/Gemini モデル定義を追加
4. **インストールの確認** → 最初のリクエストでテスト

**重要**：設定ファイルのパスは、すべてのシステムで `~/.config/opencode/opencode.json` です（Windows の `~` は自動的にユーザーディレクトリ（例：`C:\Users\YourName`）に解決されます）。

## 手順

### ステップ 1：インストール方法を選択

Antigravity Auth には2つのインストール方法があります。どちらか一方を選んでください。

::: tip おすすめ

LLM Agent（Claude Code、Cursor、OpenCode など）を使用している場合は、**AI アシストインストール**がより簡単で手軽です。

:::

**方法1：AI アシストインストール（推奨）**

以下のプロンプトをコピーして、任意の LLM Agent に貼り付けてください：

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**AI が自動的に実行する内容**：
- `~/.config/opencode/opencode.json` を編集
- プラグイン設定を追加
- 完全なモデル定義を追加
- `opencode auth login` を実行して認証

**期待される結果**：AI が「プラグインのインストールが完了しました」などのメッセージを出力します。

**方法2：手動インストール**

手動で設定したい場合は、以下の手順に従ってください：

**ステップ 1.1：設定ファイルにプラグインを追加**

`~/.config/opencode/opencode.json` を編集します（ファイルが存在しない場合は作成）：

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta 版**：最新機能を試したい場合は、`@latest` の代わりに `opencode-antigravity-auth@beta` を使用してください。

**期待される結果**：設定ファイルに `plugin` フィールドがあり、値が配列になっていること。

---

### ステップ 2：Google OAuth 認証を実行

ターミナルで以下を実行します：

```bash
opencode auth login
```

**システムが自動的に実行する内容**：
1. ローカル OAuth サーバーを起動（`localhost:51121` でリッスン）
2. ブラウザを開いて Google 認証ページにリダイレクト
3. OAuth コールバックを受信してトークンを交換
4. Google Cloud プロジェクト ID を自動取得

**あなたがやること**：
1. ブラウザで「許可」をクリックしてアクセスを承認
2. WSL や Docker 環境の場合、コールバック URL を手動でコピーする必要があるかもしれません

**期待される結果**：

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip マルチアカウント対応

クォータを増やすためにアカウントを追加したい場合は、`opencode auth login` を再度実行してください。プラグインは最大10アカウントをサポートし、自動的に負荷分散を行います。

:::

---

### ステップ 3：モデル定義を設定

以下の完全な設定をコピーして `~/.config/opencode/opencode.json` に追加します（既存の `plugin` フィールドを上書きしないように注意）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info モデルの分類

- **Antigravity クォータ**（Claude + Gemini 3）：`antigravity-gemini-*`、`antigravity-claude-*`
- **Gemini CLI クォータ**（独立）：`gemini-2.5-*`、`gemini-3-*-preview`

詳細なモデル設定については、[利用可能なモデル一覧](/ja/NoeFabris/opencode-antigravity-auth/platforms/available-models/) を参照してください。

:::

**期待される結果**：設定ファイルに完全な `provider.google.models` 定義が含まれ、JSON 形式が有効（構文エラーなし）であること。

---

### ステップ 4：インストールの確認

以下のコマンドを実行して、プラグインが正常に動作するかテストします：

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**期待される結果**：

```
正在使用: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: 你好！我是 Claude Sonnet 4.5 Thinking。
```

::: tip チェックポイント ✅

AI から正常な応答が返ってきたら、おめでとうございます！Antigravity Auth プラグインのインストールと設定が完了しました。

:::

---

## よくあるトラブル

### 問題 1：OAuth 認証に失敗する

**症状**：`opencode auth login` を実行後、`invalid_grant` などのエラーが表示される、または認証ページが開かない。

**原因**：Google アカウントのパスワード変更、セキュリティイベント、またはコールバック URL が不完全。

**解決策**：
1. ブラウザで Google 認証ページが正しく開いているか確認
2. WSL/Docker 環境の場合、ターミナルに表示されるコールバック URL を手動でブラウザにコピー
3. `~/.config/opencode/antigravity-accounts.json` を削除して再認証

### 問題 2：モデルが見つからない（400 エラー）

**症状**：リクエスト実行時に `400 Unknown name 'xxx'` が返される。

**原因**：モデル名のスペルミス、または設定ファイルの形式に問題がある。

**解決策**：
1. `--model` パラメータが設定ファイルのキーと完全に一致しているか確認（大文字小文字を区別）
2. `opencode.json` が有効な JSON かどうか確認（`cat ~/.config/opencode/opencode.json | jq` で検証）
3. `provider.google.models` フィールドに対応するモデル定義があるか確認

### 問題 3：設定ファイルのパスが間違っている

**症状**：「設定ファイルが存在しません」と表示される、または変更が反映されない。

**原因**：異なるシステムで間違ったパスを使用している。

**解決策**：すべてのシステムで `~/.config/opencode/opencode.json` を使用してください（Windows でも `~` は自動的にユーザーディレクトリに解決されます）。

| システム | 正しいパス | 間違ったパス |
|---|---|---|
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## まとめ

このレッスンで学んだこと：
1. ✅ 2つのインストール方法（AI アシスト / 手動設定）
2. ✅ Google OAuth 認証フロー
3. ✅ 完全なモデル設定（Claude + Gemini 3）
4. ✅ インストールの確認とよくあるトラブルの解決

**重要なポイント**：
- 設定ファイルの統一パス：`~/.config/opencode/opencode.json`
- OAuth 認証で Project ID を自動取得、手動設定は不要
- マルチアカウント対応でクォータ上限を拡大
- `variant` パラメータで Thinking モデルの思考深度を制御

## 次のレッスン

> 次のレッスンでは **[初回認証：OAuth 2.0 PKCE フローを深く理解する](/ja/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)** を学びます。
>
> 学べること：
> - OAuth 2.0 PKCE の仕組み
> - トークンリフレッシュの仕組み
> - Project ID の自動解決プロセス
> - アカウントストレージの形式

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| OAuth 認証 URL 生成 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113 |
| PKCE キーペア生成 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2) | 1-2 |
| トークン交換 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Project ID 自動取得 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| ユーザー情報取得 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**主要な定数**：
- `ANTIGRAVITY_CLIENT_ID`：OAuth クライアント ID（Google 認証用）
- `ANTIGRAVITY_REDIRECT_URI`：OAuth コールバックアドレス（固定値：`http://localhost:51121/oauth-callback`）
- `ANTIGRAVITY_SCOPES`：OAuth 権限スコープリスト

**主要な関数**：
- `authorizeAntigravity()`：OAuth 認証 URL を構築（PKCE challenge を含む）
- `exchangeAntigravity()`：認証コードをアクセストークンとリフレッシュトークンに交換
- `fetchProjectID()`：Google Cloud プロジェクト ID を自動解決
- `encodeState()` / `decodeState()`：OAuth state パラメータのエンコード/デコード（PKCE verifier を含む）

</details>
