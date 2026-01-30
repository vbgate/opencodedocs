---
title: "MCP 設定: 外部サービスとの連携 | Everything Claude Code"
sidebarTitle: "外部サービス連携"
subtitle: "MCP サーバー設定: Claude Code の外部サービス統合機能を拡張する"
description: "MCP の設定方法を学びます。15 種類の事前設定済みサーバーからプロジェクトに適したものを選択し、API キーと環境変数を設定して、コンテキストウィンドウを最適化しましょう。"
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP サーバー設定：Claude Code の外部サービス統合機能を拡張する

## このレッスンで学べること

- MCP とは何か、Claude Code の機能をどのように拡張するか
- 15 種類の事前設定済み MCP サーバーからプロジェクトに適したものを選ぶ方法
- API キーと環境変数の正しい設定方法
- コンテキストウィンドウの消費を抑える MCP の最適化

## 現在の課題

Claude Code はデフォルトではファイル操作とコマンド実行のみ可能ですが、以下のような機能が必要になることがあります：

- GitHub の PR や Issues を照会する
- Web ページのコンテンツを取得する
- Supabase データベースを操作する
- リアルタイムでドキュメントを検索する
- セッションをまたいでメモリを永続化する

これらのタスクを手動で処理すると、ツールの切り替えやコピー＆ペーストが頻繁に発生し、効率が低下します。MCP（Model Context Protocol）サーバーを使えば、これらの外部サービス統合を自動化できます。

## この機能を使うべきタイミング

**MCP サーバーが適しているケース**：
- プロジェクトが GitHub、Vercel、Supabase などのサードパーティサービスを利用している
- リアルタイムドキュメント（Cloudflare、ClickHouse など）を検索する必要がある
- セッションをまたいで状態やメモリを保持したい
- Web スクレイピングや UI コンポーネント生成が必要

**MCP が不要なケース**：
- ローカルファイル操作のみ
- 外部サービス統合のない純粋なフロントエンド開発
- データベース操作が少ないシンプルな CRUD アプリケーション

## 🎒 始める前の準備

設定を始める前に、以下を確認してください：

::: warning 事前チェック

- ✅ [プラグインのインストール](../installation/)が完了している
- ✅ 基本的な JSON 設定構文に慣れている
- ✅ 統合するサービスの API キー（GitHub PAT、Firecrawl API Key など）を持っている
- ✅ `~/.claude.json` 設定ファイルの場所を把握している

:::

## 基本コンセプト

### MCP とは

**MCP（Model Context Protocol）** は、Claude Code が外部サービスに接続するためのプロトコルです。AI が GitHub、データベース、ドキュメント検索などの外部リソースにアクセスできるようになり、機能を拡張できます。

**動作の仕組み**：

```
Claude Code ←→ MCP Server ←→ External Service
   (ローカル)      (ミドルウェア)     (GitHub/Supabase/...)
```

### MCP 設定の構造

各 MCP サーバーの設定には以下が含まれます：

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // 起動コマンド
      "args": ["-y", "package"],  // コマンド引数
      "env": {                   // 環境変数
        "API_KEY": "YOUR_KEY"
      },
      "description": "機能の説明"   // 説明
    }
  }
}
```

**タイプ**：
- **npx タイプ**：npm パッケージで実行（GitHub、Firecrawl など）
- **http タイプ**：HTTP エンドポイントに接続（Vercel、Cloudflare など）

### コンテキストウィンドウの管理（重要！）

::: warning コンテキストに関する注意

有効化した MCP サーバーはそれぞれコンテキストウィンドウを消費します。有効化しすぎると、200K のコンテキストが 70K まで縮小してしまいます。

**ゴールデンルール**：
- 20〜30 個の MCP サーバーを設定（すべて利用可能）
- プロジェクトごとに有効化するのは 10 個未満
- アクティブなツールの合計は 80 未満

プロジェクト設定で `disabledMcpServers` を使用して、不要な MCP を無効化しましょう。

:::

## 手順

### ステップ 1：利用可能な MCP サーバーを確認する

Everything Claude Code には **15 種類の事前設定済み MCP サーバー**が用意されています：

| MCP サーバー | タイプ | キーが必要 | 用途 |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | PR、Issues、リポジトリ操作 |
| **firecrawl** | npx | ✅ API Key | Web スクレイピングとクローリング |
| **supabase** | npx | ✅ Project Ref | データベース操作 |
| **memory** | npx | ❌ | セッション間の永続メモリ |
| **sequential-thinking** | npx | ❌ | 連鎖推論の強化 |
| **vercel** | http | ❌ | デプロイとプロジェクト管理 |
| **railway** | npx | ❌ | Railway デプロイ |
| **cloudflare-docs** | http | ❌ | ドキュメント検索 |
| **cloudflare-workers-builds** | http | ❌ | Workers ビルド |
| **cloudflare-workers-bindings** | http | ❌ | Workers バインディング |
| **cloudflare-observability** | http | ❌ | ログとモニタリング |
| **clickhouse** | http | ❌ | 分析クエリ |
| **context7** | npx | ❌ | リアルタイムドキュメント検索 |
| **magic** | npx | ❌ | UI コンポーネント生成 |
| **filesystem** | npx | ❌（パスが必要） | ファイルシステム操作 |

**確認できること**：GitHub、デプロイ、データベース、ドキュメント検索など、一般的なシナリオをカバーする 15 種類の MCP サーバーの完全なリスト。

---

### ステップ 2：MCP 設定を Claude Code にコピーする

ソースディレクトリから設定をコピーします：

```bash
# MCP 設定テンプレートをコピー
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**理由**：元の設定をバックアップしておくと、後で参照や比較がしやすくなります。

---

### ステップ 3：必要な MCP サーバーを選択する

プロジェクトの要件に基づいて、必要な MCP サーバーを選択します。

**シナリオ例**：

| プロジェクトタイプ | 推奨する MCP |
| --- | --- |
| **フルスタックアプリ**（GitHub + Supabase + Vercel） | github, supabase, vercel, memory, context7 |
| **フロントエンドプロジェクト**（Vercel + ドキュメント検索） | vercel, cloudflare-docs, context7, magic |
| **データプロジェクト**（ClickHouse + 分析） | clickhouse, sequential-thinking, memory |
| **汎用開発** | github, filesystem, memory, context7 |

**確認できること**：プロジェクトタイプと MCP サーバーの明確な対応関係。

---

### ステップ 4：`~/.claude.json` 設定ファイルを編集する

Claude Code の設定ファイルを開きます：

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

`~/.claude.json` に `mcpServers` セクションを追加します：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub operations - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent memory across sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Live documentation lookup"
    }
  }
}
```

**理由**：これがコア設定であり、Claude Code にどの MCP サーバーを起動するかを指示します。

**確認できること**：`mcpServers` オブジェクトに選択した MCP サーバーの設定が含まれている。

---

### ステップ 5：API キーのプレースホルダーを置き換える

API キーが必要な MCP サーバーについて、`YOUR_*_HERE` プレースホルダーを置き換えます：

**GitHub MCP の例**：

1. GitHub Personal Access Token を生成：
   - https://github.com/settings/tokens にアクセス
   - 新しい Token を作成し、`repo` 権限にチェック

2. 設定内のプレースホルダーを置き換え：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // 実際の Token に置き換え
  }
}
```

**その他キーが必要な MCP**：

| MCP | キー名 | 取得先 |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**理由**：実際のキーがないと、MCP サーバーは外部サービスに接続できません。

**確認できること**：すべての `YOUR_*_HERE` プレースホルダーが実際のキーに置き換えられている。

---

### ステップ 6：プロジェクトレベルの MCP 無効化を設定する（推奨）

すべてのプロジェクトですべての MCP が有効になるのを避けるため、プロジェクトルートに `.claude/config.json` を作成します：

```json
{
  "disabledMcpServers": [
    "supabase",      // 不要な MCP を無効化
    "railway",
    "firecrawl"
  ]
}
```

**理由**：これにより、プロジェクトレベルでどの MCP を有効にするかを柔軟に制御でき、コンテキストウィンドウの消費を抑えられます。

**確認できること**：`.claude/config.json` ファイルに `disabledMcpServers` 配列が含まれている。

---

### ステップ 7：Claude Code を再起動する

設定を反映させるために Claude Code を再起動します：

```bash
# Claude Code を停止（実行中の場合）
# その後、再起動
claude
```

**理由**：MCP 設定は起動時に読み込まれるため、反映には再起動が必要です。

**確認できること**：Claude Code 起動後、MCP サーバーが自動的に読み込まれる。

## チェックポイント ✅

MCP 設定が成功したか確認します：

1. **MCP の読み込み状態を確認**：

Claude Code で以下を入力：

```bash
/tool list
```

**期待される結果**：読み込まれた MCP サーバーとツールのリストが表示される。

2. **MCP 機能をテスト**：

GitHub MCP を有効にしている場合、クエリをテスト：

```bash
# GitHub Issues を照会
@mcp list issues
```

**期待される結果**：リポジトリの Issues リストが返される。

3. **コンテキストウィンドウを確認**：

`~/.claude.json` 内のツール数を確認：

```bash
jq '.mcpServers | length' ~/.claude.json
```

**期待される結果**：有効な MCP サーバー数が 10 未満。

::: tip デバッグのヒント

MCP が正常に読み込まれない場合は、Claude Code のログファイルを確認してください：
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## よくある問題と解決策

### 問題 1：MCP を有効化しすぎてコンテキストが不足する

**症状**：会話開始時のコンテキストウィンドウが 200K ではなく 70K しかない。

**原因**：有効化した MCP の各ツールがコンテキストウィンドウを消費している。

**解決策**：
1. 有効な MCP の数を確認（`~/.claude.json`）
2. プロジェクトレベルの `disabledMcpServers` で不要な MCP を無効化
3. アクティブなツールの合計を 80 未満に維持

---

### 問題 2：API キーが正しく設定されていない

**症状**：MCP 機能を呼び出すと権限エラーや接続失敗が発生する。

**原因**：`YOUR_*_HERE` プレースホルダーが置き換えられていない。

**解決策**：
1. `~/.claude.json` の `env` フィールドを確認
2. すべてのプレースホルダーが実際のキーに置き換えられていることを確認
3. キーに十分な権限があることを確認（GitHub Token には `repo` 権限が必要など）

---

### 問題 3：Filesystem MCP のパスエラー

**症状**：Filesystem MCP が指定されたディレクトリにアクセスできない。

**原因**：`args` 内のパスが実際のパスに置き換えられていない。

**解決策**：
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // 実際のプロジェクトパスに置き換え
    "description": "Filesystem operations"
  }
}
```

---

### 問題 4：プロジェクトレベルの設定が反映されない

**症状**：プロジェクトルートの `disabledMcpServers` が MCP を無効化しない。

**原因**：`.claude/config.json` のパスまたはフォーマットが間違っている。

**解決策**：
1. ファイルがプロジェクトルートにあることを確認：`.claude/config.json`
2. JSON フォーマットが正しいことを確認（`jq .` で検証）
3. `disabledMcpServers` が文字列配列であることを確認

## このレッスンのまとめ

このレッスンでは MCP サーバーの設定方法を学びました：

**キーポイント**：
- MCP は Claude Code の外部サービス統合機能を拡張する
- 15 種類の事前設定済み MCP から適切なものを選択（推奨は 10 個未満）
- `YOUR_*_HERE` プレースホルダーを実際の API キーに置き換える
- プロジェクトレベルの `disabledMcpServers` で有効数を制御
- アクティブなツールの合計を 80 未満に維持し、コンテキストウィンドウの消費を抑える

**次のステップ**：MCP サーバーの設定が完了しました。次のレッスンではコアコマンドの使い方を学びます。

## 次のレッスン予告

> 次のレッスンでは **[コアコマンド詳解](../../platforms/commands-overview/)** を学びます。
>
> 学べること：
> - 14 種類のスラッシュコマンドの機能と使用シナリオ
> - `/plan` コマンドで実装計画を作成する方法
> - `/tdd` コマンドでテスト駆動開発を実行する方法
> - コマンドで複雑なワークフローを素早くトリガーする方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| MCP 設定テンプレート | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README 重要な注意事項 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
| --- | --- | --- |

**主要な設定**：
- 15 種類の MCP サーバー（GitHub、Firecrawl、Supabase、Memory、Sequential-thinking、Vercel、Railway、Cloudflare シリーズ、ClickHouse、Context7、Magic、Filesystem）
- 2 つのタイプをサポート：npx（コマンドライン）と http（エンドポイント接続）
- `disabledMcpServers` プロジェクトレベル設定で有効数を制御

**主要なルール**：
- 20〜30 個の MCP サーバーを設定
- プロジェクトごとに有効化するのは 10 個未満
- アクティブなツールの合計は 80 未満
- コンテキストウィンドウが 200K から 70K に縮小するリスク

</details>
