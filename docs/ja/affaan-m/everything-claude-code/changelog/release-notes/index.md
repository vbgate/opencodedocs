---
title: "更新履歴: バージョン履歴 | everything-claude-code"
sidebarTitle: "最新の更新を確認"
subtitle: "更新履歴: バージョン履歴"
description: "everything-claude-code のバージョン履歴と重要な変更点を確認。新機能、セキュリティ修正、ドキュメント更新を追跡し、アップグレードの必要性を判断できます。"
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# 更新履歴：バージョン履歴と変更点

## 学習後にできること

- 各バージョンの重要な変更点を把握する
- 新機能と修正内容を追跡する
- アップグレードの必要性を判断する

## バージョン履歴

### 2026-01-24 - セキュリティ修正とドキュメント修正

**修正内容**：
- 🔒 **セキュリティ修正**：`commandExists()` におけるコマンドインジェクション脆弱性を防止
  - `execSync` を `spawnSync` に置き換え
  - 入力を英数字、ハイフン、アンダースコア、ドットのみに制限
- 📝 **ドキュメント修正**：`runCommand()` にセキュリティ警告を追加
- 🐛 **XSS スキャナー誤検知修正**：`<script>` と `<binary>` を `[script-name]` と `[binary-name]` に置換
- 📚 **ドキュメント修正**：`doc-updater.md` の `npx ts-morph` を正しい `npx tsx scripts/codemaps/generate.ts` に修正

**影響**：#42, #43, #51

---

### 2026-01-22 - クロスプラットフォーム対応とプラグイン化

**新機能**：
- 🌐 **クロスプラットフォーム対応**：すべての hooks とスクリプトを Node.js で書き直し、Windows、macOS、Linux をサポート
- 📦 **プラグインパッケージ化**：Claude Code プラグインとして配布、プラグインマーケットプレイスからインストール可能
- 🎯 **パッケージマネージャー自動検出**：6 種類の検出優先順位をサポート
  - 環境変数 `CLAUDE_PACKAGE_MANAGER`
  - プロジェクト設定 `.claude/package-manager.json`
  - `package.json` の `packageManager` フィールド
  - Lock ファイル検出（package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb）
  - グローバル設定 `~/.claude/package-manager.json`
  - 最初に利用可能なパッケージマネージャーにフォールバック

**修正内容**：
- 🔄 **Hook 読み込み**：規約に基づいて hooks を自動読み込み、`plugin.json` での hooks 宣言を削除
- 📌 **Hook パス**：`${CLAUDE_PLUGIN_ROOT}` と相対パスを使用
- 🎨 **UI 改善**：スター履歴グラフとバッジバーを追加
- 📖 **Hook 整理**：session-end hooks を Stop から SessionEnd に移動

---

### 2026-01-20 - 機能強化

**新機能**：
- 💾 **Memory Persistence Hooks**：セッション間で自動的にコンテキストを保存・読み込み
- 🧠 **Strategic Compact Hook**：インテリジェントなコンテキスト圧縮提案
- 📚 **Continuous Learning Skill**：セッションから再利用可能なパターンを自動抽出
- 🎯 **Strategic Compact Skill**：トークン最適化戦略

---

### 2026-01-17 - 初回リリース

**初期機能**：
- ✨ 完全な Claude Code 設定コレクション
- 🤖 9 つの専門化エージェント
- ⚡ 14 のスラッシュコマンド
- 📋 8 セットのルールセット
- 🔄 自動化 hooks
- 🎨 11 のスキルライブラリ
- 🌐 15 以上の MCP サーバー事前設定
- 📖 完全な README ドキュメント

---

## バージョン命名規則

本プロジェクトでは従来のセマンティックバージョニングではなく、**日付バージョン**形式（`YYYY-MM-DD`）を採用しています。

### バージョンタイプ

| タイプ | 説明 | 例 |
| --- | --- | --- |
| **新機能** | 新機能または大幅な改善の追加 | `feat: add new agent` |
| **修正** | バグや問題の修正 | `fix: resolve hook loading issue` |
| **ドキュメント** | ドキュメントの更新 | `docs: update README` |
| **スタイル** | フォーマットやコードスタイル | `style: fix indentation` |
| **リファクタリング** | コードのリファクタリング | `refactor: simplify hook logic` |
| **パフォーマンス** | パフォーマンス最適化 | `perf: improve context loading` |
| **テスト** | テスト関連 | `test: add unit tests` |
| **ビルド** | ビルドシステムや依存関係 | `build: update package.json` |
| **リバート** | 以前のコミットの取り消し | `revert: remove version field` |

---

## 更新の取得方法

### プラグインマーケットプレイスからの更新

プラグインマーケットプレイスから Everything Claude Code をインストールした場合：

1. Claude Code を開く
2. `/plugin update everything-claude-code` を実行
3. 更新完了を待つ

### 手動更新

リポジトリを手動でクローンした場合：

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### マーケットプレイスからのインストール

初回インストール：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## 変更影響分析

### セキュリティ修正（アップグレード必須）

- **2026-01-24**：コマンドインジェクション脆弱性の修正、アップグレードを強く推奨

### 機能強化（任意のアップグレード）

- **2026-01-22**：クロスプラットフォーム対応、Windows ユーザーはアップグレード必須
- **2026-01-20**：新機能強化、必要に応じてアップグレード

### ドキュメント更新（アップグレード不要）

- ドキュメント更新は機能に影響しません。README を手動で確認できます

---

## 既知の問題

### 現在のバージョン（2026-01-24）

- 既知の重大な問題はありません

### 以前のバージョン

- 2026-01-22 以前：Hooks の読み込みに手動設定が必要（2026-01-22 で修正済み）
- 2026-01-20 以前：Windows 非対応（2026-01-22 で修正済み）

---

## 貢献とフィードバック

### 問題の報告

バグを発見した場合や機能の提案がある場合：

1. [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) で類似の問題がないか検索
2. ない場合は、新しい Issue を作成し、以下を記載：
   - バージョン情報
   - オペレーティングシステム
   - 再現手順
   - 期待される動作 vs 実際の動作

### PR の提出

貢献を歓迎します！詳細は [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) をご覧ください。

---

## このレッスンのまとめ

- Everything Claude Code は日付バージョン番号（`YYYY-MM-DD`）を使用
- セキュリティ修正（2026-01-24 など）は必ずアップグレード
- 機能強化は必要に応じてアップグレード
- プラグインマーケットプレイスユーザーは `/plugin update` で更新
- 手動インストールユーザーは `git pull` で更新
- 問題報告と PR 提出はプロジェクトガイドラインに従う

## 次のレッスン予告

> 次のレッスンでは **[設定ファイル詳解](../../appendix/config-reference/)** を学びます。
>
> 学習内容：
> - `settings.json` の完全なフィールド説明
> - Hooks 設定の高度なオプション
> - MCP サーバー設定の詳細
> - カスタム設定のベストプラクティス
