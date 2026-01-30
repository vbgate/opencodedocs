---
title: "クイックスタート：OpenSkillsを始めよう | OpenSkills"
sidebarTitle: "15分で始める"
subtitle: "クイックスタート：OpenSkillsを始めよう | OpenSkills"
description: "OpenSkillsのクイックスタートを学びます。15分以内でツールとスキルのインストールを完了し、AIエージェントが新しいスキルを使用できるようにして、その動作原理を理解します。"
order: 1
---

# クイックスタート

このセクションでは、ツールのインストールからAIエージェントがスキルを使用するまで、10〜15分でOpenSkillsを始められるようにします。

## 学習パス

以下の順序で学習することをお勧めします：

### 1. [クイックスタート](./quick-start/)

5分以内でツールのインストール、スキルのインストールと同期を完了し、OpenSkillsの核心的な価値を体験します。

- OpenSkillsツールのインストール
- Anthropic公式リポジトリからスキルをインストール
- スキルをAGENTS.mdに同期
- AIエージェントがスキルを使用できることを検証

### 2. [OpenSkillsとは何ですか？](./what-is-openskills/)

OpenSkillsの核心的な概念と動作原理を理解します。

- OpenSkillsとClaude Codeの関係
- 統一されたスキルフォーマット、漸進的な読み込み、マルチエージェント対応
- 内蔵スキルシステムではなくOpenSkillsを使用すべきタイミング

### 3. [インストールガイド](./installation/)

詳細なインストール手順と環境設定。

- Node.jsとGitの環境チェック
- npxの一時使用 vs グローバルインストール
- よくあるインストール問題のトラブルシューティング

### 4. [最初のスキルをインストール](./first-skill/)

Anthropic公式リポジトリからスキルをインストールし、インタラクティブな選択体験をします。

- `openskills install`コマンドを使用
- 必要なスキルを対話的に選択
- スキルのディレクトリ構造（.claude/skills/）を理解

### 5. [スキルをAGENTS.mdに同期](./sync-to-agents/)

AGENTS.mdファイルを生成し、AIエージェントが利用可能なスキルを認識できるようにします。

- `openskills sync`コマンドを使用
- AGENTS.mdのXMLフォーマットを理解
- 同期するスキルを選択し、コンテキストサイズを制御

### 6. [スキルを使用する](./read-skills/)

AIエージェントがスキルコンテンツを読み込む方法を学びます。

- `openskills read`コマンドを使用
- スキル検索の4段階の優先順位
- 複数のスキルを一度に読み込む

## 前提条件

学習を開始する前に、以下を確認してください：

- [Node.js](https://nodejs.org/) 20.6.0以降がインストールされている
- [Git](https://git-scm.com/)がインストールされている（GitHubからスキルをインストールするため）
- 少なくとも1つのAIコーディングエージェントがインストールされている（Claude Code、Cursor、Windsurf、Aiderなど）

::: tip 環境のクイックチェック
```bash
node -v  # v20.6.0以降が表示される
git -v   # git version x.x.xが表示される
```
:::

## 次のステップ

このセクションを完了したら、次の学習を続けることができます：

- [コマンドの詳細](../platforms/cli-commands/)：すべてのコマンドと引数について深く理解
- [インストールソースの詳細](../platforms/install-sources/)：GitHub、ローカルパス、プライベートリポジトリからスキルをインストールする方法を学ぶ
- [カスタムスキルの作成](../advanced/create-skills/)：独自のスキルを作成
