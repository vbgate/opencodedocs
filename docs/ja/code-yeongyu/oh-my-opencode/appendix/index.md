---
title: "付録: 設定リファレンスと移行 | oh-my-opencode"
sidebarTitle: "設定移行マスター"
subtitle: "付録: 設定リファレンスと移行"
description: "oh-my-opencode の設定リファレンス、Claude Code 互換性ガイド、および組み込み MCP サーバーの使用方法を学びます。設定オプション、移行手順、検索機能の設定を理解し、Claude Code からのシームレスな移行を実現します。"
tags:
  - "付録"
  - "リファレンス"
order: 170
---

# 付録：リファレンス資料と互換性ガイド

本チャプターには **oh-my-opencode** の詳細なリファレンス資料と互換性ガイドが含まれており、完全な設定説明、Claude Code 移行サポート、および組み込み拡張サーバーの詳細な紹介を網羅しています。

## チャプター内容

本チャプターには 3 つの重要なセクションが含まれています：

| サブページ | 説明 | 難易度 |
|--- | --- | ---|
| [Claude Code 互換性](./claude-code-compatibility/) | Claude Code から OpenCode への完全な移行ガイド。Commands、Skills、Agents、MCPs、Hooks の互換メカニズムを含む | ⭐⭐ |
| [設定リファレンス](./configuration-reference/) | oh-my-opencode 設定ファイルの完全な Schema 説明。すべてのフィールド、型、デフォルト値を網羅 | ⭐⭐⭐ |
| [組み込み MCP](./builtin-mcps/) | 3 つの組み込み MCP サーバー（Exa Websearch、Context7、Grep.app）の機能と使用方法 | ⭐⭐ |

## 学習パスの推奨

ニーズに応じて学習順序を選択してください：

### パス 1：Claude Code からの移行

Claude Code から移行するユーザーの場合：

1. まず **[Claude Code 互換性](./claude-code-compatibility/)** を読み、既存の設定をシームレスに移行する方法を理解する
2. 次に **[設定リファレンス](./configuration-reference/)** を確認し、利用可能な設定オプションを深く理解する
3. 最後に **[組み込み MCP](./builtin-mcps/)** を学び、追加の検索機能を設定する方法を理解する

### パス 2：高度なカスタマイズ

oh-my-opencode の動作を高度にカスタマイズしたい場合：

1. **[設定リファレンス](./configuration-reference/)** から始め、すべての設定可能項目を理解する
2. **[組み込み MCP](./builtin-mcps/)** を学び、検索とドキュメントクエリ機能を設定する
3. **[Claude Code 互換性](./claude-code-compatibility/)** を参照し、互換レイヤーの設定オプションを理解する

### パス 3：クイックリファレンス

特定の情報を確認するだけの場合：

- **設定に関する質問** → 直接 **[設定リファレンス](./configuration-reference/)** へ
- **移行に関する質問** → 直接 **[Claude Code 互換性](./claude-code-compatibility/)** へ
- **MCP 設定** → 直接 **[組み込み MCP](./builtin-mcps/)** へ

## 前提条件

本チャプターを学習する前に、以下を完了していることを推奨します：

- ✅ **[インストールと設定](../start/installation/)** を完了している
- ✅ **[Sisyphus オーケストレーター](../start/sisyphus-orchestrator/)** の基本概念を理解している
- ✅ JSON 設定ファイルの編集に慣れている

## 次のステップ

本チャプターの学習を完了した後、以下のことができます：

- 🚀 **[高度な機能](../advanced/)** を試し、より高度な使用方法を学ぶ
- 🔧 **[よくある質問](../faq/)** を確認し、使用中の問題を解決する
- 📖 **[更新履歴](../changelog/)** を読み、最新の機能改善を把握する

::: tip ヒント
本チャプターの内容は主にリファレンス資料として提供されており、順番に読む必要はありません。必要に応じて該当セクションを参照できます。
:::
