---
title: "プラットフォーム機能: プランレビューとコードレビュー | Plannotator"
sidebarTitle: "AIプランとコードのレビュー"
subtitle: "プラットフォーム機能: プランレビューとコードレビュー"
description: "Plannotatorのプラットフォーム機能を学びます。プランレビューとコードレビューを含み、可視化レビュー、アノテーション追加、画像マークアップなどのコアスキルを習得します。"
order: 2
---

# プラットフォーム機能

この章では、Plannotatorの2つのコア機能である**プランレビュー**と**コードレビュー**を紹介します。AIが生成したプランを可視化してレビューする方法、各種アノテーションの追加、画像マークアップの添付、そしてgit diffコード変更のレビュー方法を学びます。

## 前提条件

::: warning 開始前にご確認ください
この章を学習する前に、以下の準備が完了していることを確認してください：

- ✅ [クイックスタート](../start/getting-started/)チュートリアルを完了済み
- ✅ Plannotatorプラグインをインストール済み（[Claude Code](../start/installation-claude-code/)または[OpenCode](../start/installation-opencode/)）
:::

## この章の内容

### プランレビュー

AIが生成した実行プランをレビューし、修正提案を追加して、AIをあなたの意図通りに動作させる方法を学びます。

| チュートリアル | 説明 |
|------|------|
| [プランレビューの基本](./plan-review-basics/) | Plannotatorを使用してAIが生成したプランを可視化レビューする方法を学びます。プランの承認または却下を含みます |
| [プランアノテーションの追加](./plan-review-annotations/) | プランに異なるタイプのアノテーション（削除、置換、挿入、コメント）を追加する方法を習得します |
| [画像マークアップの追加](./plan-review-images/) | プランレビューに画像を添付し、ブラシ、矢印、円形ツールでマークアップする方法を学びます |

### コードレビュー

コード変更をレビューし、行レベルのアノテーションを追加して、コミット前に問題を発見する方法を学びます。

| チュートリアル | 説明 |
|------|------|
| [コードレビューの基本](./code-review-basics/) | `/plannotator-review`コマンドを使用してgit diffをレビューする方法を学びます。side-by-sideとunifiedビューをサポート |
| [コードアノテーションの追加](./code-review-annotations/) | コードレビューで行レベルのアノテーション（comment/suggestion/concern）を追加する方法を習得します |
| [Diffビューの切り替え](./code-review-diff-types/) | コードレビューで異なるdiffタイプ（uncommitted/staged/last commit/branch）を切り替える方法を学びます |

## 学習パス

::: tip 推奨学習順序
使用シナリオに応じて、適切な学習パスを選択してください：

**パスA：プランレビュー優先**（初心者におすすめ）
1. [プランレビューの基本](./plan-review-basics/) → まず基本的なプランレビューフローを学ぶ
2. [プランアノテーションの追加](./plan-review-annotations/) → プランを正確に修正する方法を学ぶ
3. [画像マークアップの追加](./plan-review-images/) → 画像でより明確に意図を伝える
4. その後、コードレビューシリーズを学習

**パスB：コードレビュー優先**（Code Review経験のある開発者向け）
1. [コードレビューの基本](./code-review-basics/) → コードレビュー画面に慣れる
2. [コードアノテーションの追加](./code-review-annotations/) → 行レベルアノテーションを学ぶ
3. [Diffビューの切り替え](./code-review-diff-types/) → 異なるdiffタイプを習得
4. その後、プランレビューシリーズを学習
:::

## 次のステップ

この章を完了したら、以下の学習を続けることができます：

- [URL共有](../advanced/url-sharing/) - URLでプランとアノテーションを共有し、チームコラボレーションを実現
- [Obsidian連携](../advanced/obsidian-integration/) - 承認したプランをObsidianに自動保存
- [リモートモード](../advanced/remote-mode/) - SSH、devcontainer、WSL環境でPlannotatorを使用
