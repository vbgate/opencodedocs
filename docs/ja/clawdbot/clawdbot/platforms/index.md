---
title: "マルチチャンネルとプラットフォーム | Clawdbot チュートリアル"
sidebarTitle: "一般的なチャットツールへの接続"
subtitle: "マルチチャンネルとプラットフォーム"
description: "WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINE、WebChat、macOS、iOS、Android プラットフォームを含む、Clawdbot のマルチチャンネルシステムの設定と使用方法を学びます。"
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# マルチチャンネルとプラットフォーム

Clawdbot は統一された Gateway 制御プレーンを通じて、複数の通信チャネルとプラットフォームをサポートし、あなたが使い慣れたインターフェースで AI アシスタントと対話できるようにします。

## 章の概要

本章では、Clawdbot がサポートするすべての通信チャネルとプラットフォームについて紹介します。これには、インスタントメッセージングアプリ（WhatsApp、Telegram、Slack、Discord など）、モバイルノード（iOS、Android）、デスクトップアプリ（macOS）が含まれます。これらのチャネルを設定し、AI アシスタントを日常のワークフローにシームレスに統合する方法を学びます。

## サブページナビゲーション

### チャネルの概要

- **[マルチチャンネルシステムの概要](channels-overview/)** - Clawdbot がサポートするすべての通信チャネルとその特徴について理解し、チャネル設定の基本概念を習得します。

### インスタントメッセージングチャネル

- **[WhatsApp](whatsapp/)** - WhatsApp チャネル（Baileys ベース）を設定し使用し、デバイスのリンクとグループ管理をサポートします。
- **[Telegram](telegram/)** - Telegram チャネル（grammY Bot API ベース）を設定し使用し、Bot Token と Webhook を設定します。
- **[Slack](slack/)** - Slack チャネル（Bolt ベース）を設定し使用し、ワークスペースに統合します。
- **[Discord](discord/)** - Discord チャネル（discord.js ベース）を設定し使用し、サーバーとチャンネルをサポートします。
- **[Google Chat](googlechat/)** - Google Chat チャネルを設定し使用し、Google Workspace と統合します。
- **[Signal](signal/)** - Signal チャネル（signal-cli ベース）を設定し使用し、プライバシーを保護した通信を行います。
- **[iMessage](imessage/)** - iMessage チャネル（macOS 専用）を設定し使用し、macOS メッセージアプリと統合します。
- **[LINE](line/)** - LINE チャネル（Messaging API ベース）を設定し使用し、LINE ユーザーと対話します。

### Web とネイティブアプリ

- **[WebChat インターフェース](webchat/)** - 内蔵の WebChat インターフェースを使用して AI アシスタントと対話し、外部チャネルの設定は不要です。
- **[macOS アプリ](macos-app/)** - macOS メニューバーアプリの機能について学びます（Voice Wake、Talk Mode、リモートコントロールを含む）。
- **[iOS ノード](ios-node/)** - iOS ノードを設定してデバイスのローカル操作を実行します（Camera、Canvas、Voice Wake）。
- **[Android ノード](android-node/)** - Android ノードを設定してデバイスのローカル操作を実行します（Camera、Canvas）。

## 学習パスの提案

あなたの使用シナリオに応じて、以下の学習順序をお勧めします。

### 初心者向けクイックスタート

初めて Clawdbot を使用する場合、以下の順序で学習することをお勧めします。

1. **[マルチチャンネルシステムの概要](channels-overview/)** - まず全体のアーキテクチャとチャネルの概念を理解します
2. **[WebChat インターフェース](webchat/)** - 最も簡単な方法で、設定なしで使用を開始できます
3. **一般的なチャネルを 1 つ選択** - あなたの日常の習慣に応じて選択します：
   - 日常のチャット → [WhatsApp](whatsapp/) または [Telegram](telegram/)
   - チーム協力 → [Slack](slack/) または [Discord](discord/)
   - macOS ユーザー → [iMessage](imessage/)

### モバイル統合

モバイルデバイスで Clawdbot を使用したい場合：

1. **[iOS ノード](ios-node/)** - iPhone/iPad 上のローカル機能を設定します
2. **[Android ノード](android-node/)** - Android デバイス上のローカル機能を設定します
3. **[macOS アプリ](macos-app/)** - macOS アプリをコントロールセンターとして使用します

### エンタープライズデプロイメント

チーム環境にデプロイする必要がある場合：

1. **[Slack](slack/)** - チームワークスペースに統合します
2. **[Discord](discord/)** - コミュニティサーバーを構築します
3. **[Google Chat](googlechat/)** - Google Workspace と統合します

## 前提条件

本章の学習を開始する前に、以下を完了することをお勧めします。

- **[クイックスタート](../start/getting-started/)** - Clawdbot のインストールと基本設定を完了します
- **[設定ウィザード](../start/onboarding-wizard/)** - ウィザードを通じて Gateway とチャネルの基本設定を完了します

::: tip ヒント
設定ウィザードを完了している場合、一部のチャネルは既に自動的に設定されている可能性があります。重複する設定手順をスキップして、特定のチャネルの高度な機能を確認できます。
:::

## 次のステップ

本章の学習を完了した後、以下を引き続き探索できます。

- **[AI モデルと認証設定](../advanced/models-auth/)** - 異なる AI モデルプロバイダーを設定します
- **[セッション管理とマルチエージェント](../advanced/session-management/)** - セッション分離とサブエージェントの協調について学びます
- **[ツールシステム](../advanced/tools-browser/)** - ブラウザ自動化、コマンド実行などのツールを使用します

## よくある質問

::: details 複数のチャネルを同時に使用できますか？
はい！Clawdbot は複数のチャネルを同時に有効化できます。異なるチャネルでメッセージの送受信ができ、すべてのメッセージは統一された Gateway を通じて処理されます。
:::

::: details どのチャネルが最も推奨されますか？
これはあなたの使用シナリオによります：
- **WebChat** - 最もシンプルで、設定は不要です
- **WhatsApp** - 友人や家族とのチャットに適しています
- **Telegram** - Bot API が安定しており、自動返信に適しています
- **Slack/Discord** - チーム協力に適しています
:::

::: details チャネルの設定に費用はかかりますか？
多くのチャネル自体は無料ですが、一部のチャネルにはコストがかかる場合があります：
- WhatsApp Business API - 料金が発生する可能性があります
- Google Chat - Google Workspace アカウントが必要です
- その他のチャネル - 通常は無料で、Bot Token の申請のみが必要です
:::
