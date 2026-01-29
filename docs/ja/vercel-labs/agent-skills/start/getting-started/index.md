---
title: "入門: AI スキルパッケージの基本 | Agent Skills"
sidebarTitle: "入門"
subtitle: "Agent Skills 入門"
description: "Agent Skills の基本概念と 3 つのコアスキルパッケージを学びます。AI コーディングエージェントの機能を拡張し、開発効率を向上させる方法を習得できます。"
tags:
  - "入門"
  - "AI コーディングエージェント"
  - "Claude"
  - "スキルパッケージ"
prerequisite: []
---

# Agent Skills 入門

## 学習後、できること

- Agent Skills とは何か、それが AI コーディングエージェントの機能をどのように拡張するかを理解する
- 3 つのコアスキルパッケージの機能と使用シナリオを理解する
- Agent Skills を使用して開発効率を向上させるタイミングを知る

## 現在の課題

日常的に Claude、Cursor、またはその他の AI コーディングエージェントを使用しているとき、以下の問題に遭遇するかもしれません：

- ベストプラクティスに従いたいが、覚えるべきルールがわからない
- 同様のデプロイ操作を頻繁に繰り返し、自動化したい
- AI が生成するコードの品質にばらつきがあり、統一された基準がない

## コアコンセプト

**Agent Skills はスキルパッケージシステム**です——AI コーディングエージェントに拡張可能な「プラグイン」を提供します。各スキルには以下が含まれます：

- **SKILL.md**：スキル定義ファイルで、AI エージェントにいつそのスキルを有効にするかを伝えます
- **scripts/**：補助スクリプト（デプロイスクリプトなど）で、具体的なタスクを実行します
- **references/**：補助ドキュメント（オプション）で、詳細な参考資料を提供します

::: tip デザイン理念
スキルは**オンデマンドロード**メカニズムを採用しています：スキル名と説明のみが起動時にロードされ、完全なコンテンツは AI が必要と判断したときに読み込まれます。これにより、コンテキストの使用量が削減され、効率が向上します。
:::

## 利用可能なスキルパッケージ

プロジェクトは 3 つの主要なスキルパッケージを提供しており、それぞれが特定のシナリオに対応しています：

### react-best-practices

Vercel Engineering 基準に基づく React および Next.js のパフォーマンス最適化ガイド。影響レベル別に並べ替えられた 50 以上のルールが含まれています。

**使用シナリオ**：
- 新しい React コンポーネントまたは Next.js ページを記述する場合
- コードのパフォーマンス問題をレビューする場合
- バンドルサイズまたは読み込み時間を最適化する場合

**カテゴリの概要**：
- ウォーターフォールの排除（Critical）
- バンドルサイズの最適化（Critical）
- サーバーサイドのパフォーマンス（High）
- クライアントサイドのデータフェッチ（Medium-High）
- Re-render の最適化（Medium）
- レンダリングのパフォーマンス（Medium）
- JavaScript のマイクロ最適化（Low-Medium）
- 高度なパターン（Low）

### web-design-guidelines

Web インターフェースデザインガイド監査。コードが 100 近いベストプラクティスに準拠しているかを確認します。

**使用シナリオ**：
- プロンプト："Review my UI"
- アクセシビリティ（Accessibility）のチェック
- デザインの一貫性の監査
- パフォーマンスと UX のチェック

**カテゴリの概要**：
- アクセシビリティ（aria-labels、意味論的 HTML、キーボードハンドリング）
- フォーカス状態（可視フォーカス、focus-visible モード）
- フォーム（オートコンプリート、検証、エラーハンドリング）
- アニメーション（prefers-reduced-motion、合成フレンドリーな変換）
- 画像（サイズ、遅延読み込み、alt テキスト）
- タイポグラフィ、パフォーマンス、ナビゲーションなど

### vercel-deploy-claimable

アプリとウェブサイトをワンクリックで Vercel にデプロイし、プレビューリンクと所有権譲渡リンクを返します。

**使用シナリオ**：
- プロンプト："Deploy my app"
- プロジェクトプレビューを迅速に共有する
- 設定不要、認証不要のデプロイ

**コア機能**：
- 40 以上のフレームワークを自動検出（Next.js、Vite、Astro など）
- プレビュー URL（リアルタイムサイト）とクレーム URL（所有権譲渡）を返す
- 静的 HTML プロジェクトを自動処理
- アップロード時に `node_modules` と `.git` を除外

## スキルの仕組み

Claude やその他の AI エージェントを使用しているとき、スキルの有効化フローは以下の通りです：

```mermaid
graph LR
    A[ユーザーがタスクを入力] --> B[AI がキーワードを検出<br/>Deploy、Review、Optimize など]
    B --> C[スキルの説明を照合]
    C --> D[SKILL.md の完全なコンテンツを読み込む]
    D --> E[スクリプトを実行またはルールを適用]
    E --> F[ユーザーに結果を出力]
```

**フローの例**：

1. **ユーザー入力**："Deploy my app"
2. **AI 検出**：キーワード "Deploy" を認識し、`vercel-deploy` スキルを照合
3. **スキル読み込み**：`SKILL.md` の完全なコンテンツを読み込む
4. **デプロイ実行**：
   - `deploy.sh` スクリプトを実行
   - フレームワークを検出（package.json を読み込み）
   - プロジェクトを tarball にパッケージ化
   - Vercel API にアップロード
5. **結果返却**：
   ```json
   {
     "previewUrl": "https://skill-deploy-abc123.vercel.app",
     "claimUrl": "https://vercel.com/claim-deployment?code=..."
   }
   ```

## 使用タイミング

Agent Skills を使用する最適なタイミング：

| シナリオ | 使用するスキル | トリガープロンプトの例 |
| ---- | ---------- | -------------- |
| React コンポーネントを記述 | react-best-practices | "Review this React component for performance issues" |
| Next.js ページを最適化 | react-best-practices | "Help me optimize this Next.js page" |
| UI の品質をチェック | web-design-guidelines | "Check accessibility of my site" |
| プロジェクトをデプロイ | vercel-deploy-claimable | "Deploy my app to production" |

## セキュリティモデル

::: info セキュリティについての説明
- **ローカル実行**：すべてのスキルはローカルで実行され、Vercel デプロイ API を除きサードパーティサービスへデータはアップロードされません
- **オンデマンド有効化**：スキルは AI が関連すると判断した場合のみ詳細コンテンツを読み込むため、プライバシーの漏洩リスクが低減されます
- **オープンソースで透明**：すべてのスキルとスクリプトはオープンソースで監査可能です
:::

## 注意点

### スキルが有効にならない

スキルが有効にならない場合、以下を確認してください：

- プロンプトに十分なキーワード（"Deploy"、"Review" など）が含まれているか
- スキルが `~/.claude/skills/` ディレクトリに正しくインストールされているか
- claude.ai を使用している場合、スキルがプロジェクトナレッジベースに追加されているか

### ネットワーク権限

一部のスキルはネットワークアクセスが必要です：

- `vercel-deploy-claimable` は Vercel デプロイ API にアクセスする必要があります
- `web-design-guidelines` は GitHub から最新ルールをプルする必要があります

**解決策**：claude.ai/settings/capabilities で必要なドメインを追加してください。

## この授業のまとめ

Agent Skills は AI コーディングエージェント向けのスキルパッケージシステムで、以下を提供します：

- **react-best-practices**：React/Next.js パフォーマンス最適化ルール 50 以上
- **web-design-guidelines**：Web デザインベストプラクティス 100 近く
- **vercel-deploy-claimable**：Vercel へのワンクリックデプロイ

スキルはオンデマンドロードメカニズムを採用し、コンテキストの使用量を最小限に抑えます。インストール後、AI エージェントは関連するタスクで対応するスキルを自動的に有効にします。

## 次の授業の予告

> 次の授業では **[Agent Skills のインストール](../installation/)** を学びます。
>
> 学べること：
> - 2 つのインストール方法：Claude Code と claude.ai
> - ネットワーク権限の設定
> - スキルが正しくインストールされているかの確認

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能        | ファイルパス                                                              | 行番号    |
| ----------- | ------------------------------------------------------------------------- | ------- |
| スキルパッケージリスト | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L7-L80) | 7-80    |
| スキル構造の説明 | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L103-L110) | 103-110 |
| AGENTS.md 仕様 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md) | 全文    |
| スキルディレクトリ構造 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20) | 11-20   |
| SKILL.md フォーマット | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68) | 29-68   |
| スキルパッケージ化コマンド | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L93-L96) | 93-96   |
| ユーザーインストール方法 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110  |
| オンデマンドロードメカニズム | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L72-L78) | 72-78   |
| ビルドツールスクリプト | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json) | 全文    |

**重要な定数**：
- ハードコーディングされた定数はありません

**重要な関数**：
- `build.ts`：AGENTS.md とテストケースの構築
- `validate.ts`：ルールファイルの整合性の検証
- `extract-tests.ts`：ルールからテストケースを抽出

</details>
