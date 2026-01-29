---
title: "マルチチャンネルシステム概要：Clawdbotがサポートする13+の通信チャンネル完全詳細ガイド | Clawdbotチュートリアル"
sidebarTitle: "最適なチャンネルを選ぶ"
subtitle: "マルチチャンネルシステム概要：Clawdbotがサポートするすべての通信チャンネル"
description: "Clawdbotがサポートする13+の通信チャンネル（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINEなど）を学びます。各チャンネルの認証方法、特徴、使用シナリオをマスターし、最適なチャンネルを選んで設定を開始します。チュートリアルではDMペアリング保護、グループメッセージ処理、設定方法をカバーします。"
tags:
  - "チャンネル"
  - "プラットフォーム"
  - "マルチチャンネル"
  - "入門"
prerequisite:
  - "start-getting-started"
order: 60
---

# マルチチャンネルシステム概要：Clawdbotがサポートするすべての通信チャンネル

## 学習目標

このチュートリアルを完了すると、以下のことができるようになります：

- ✅ Clawdbotがサポートする13+の通信チャンネルを理解する
- ✅ 各チャンネルの認証方法と設定の要点をマスターする
- ✅ 使用シナリオに基づいて最適なチャンネルを選択する
- ✅ DMペアリング保護メカニズムのセキュリティ価値を理解する

## 今直面している問題

あなたは今、次のような疑問を持っているかもしれません：

- "Clawdbotはどのプラットフォームをサポートしているの？"
- "WhatsApp、Telegram、Slackにはどのような違いがあるの？"
- "どのチャンネルが最も簡単で高速なの？"
- "各プラットフォームでボットを登録する必要があるの？"

朗報です：**Clawdbotは豊富なチャンネル選択肢を提供しており、習慣とニーズに応じて自由に組み合わせることができます**。

## いつこの方法を使用すべきか

以下のような場合に必要です：

- 🌐 **マルチチャンネル統合管理** —— 一つのAIアシスタントで複数のチャンネルを同時に利用可能
- 🤝 **チーム協力** —— Slack、Discord、Google Chatなどのワークプレース統合
- 💬 **個人チャット** —— WhatsApp、Telegram、iMessageなどの日常的なコミュニケーションツール
- 🔧 **柔軟な拡張** —— LINE、Zaloなどの地域別プラットフォームをサポート

::: tip マルチチャンネルの価値
複数のチャンネルを使用するメリット：
- **シームレスな切り替え**：自宅ではWhatsApp、会社ではSlack、外出先ではTelegram
- **マルチデバイス同期**：すべてのチャンネルでメッセージとセッションが一貫して保持される
- **シナリオカバレッジ**：異なるプラットフォームには異なる強みがあり、組み合わせることで最良の結果が得られる
:::

---

## コアコンセプト

Clawdbotのチャンネルシステムは**プラグインアーキテクチャ**を採用しています：

```
┌─────────────────────────────────────────────────┐
│              Gateway (制御プレーン)                   │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... 等 13+ チャンネル
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**重要な概念**：

| 概念         | 役割                         |
|--- | ---|
| **チャンネルプラグイン** | 各チャンネルは独立したプラグイン    |
| **統一インターフェース** | すべてのチャンネルで同じAPIを使用        |
| **DM保護**   | デフォルトでペアリングメカニズムを有効化し、未知の送信者を拒否 |
| **グループサポート**  | `@mention`とコマンドトリガーをサポート    |

---

## サポートされているチャンネルの概要

Clawdbotは**13+の通信チャンネル**をサポートしており、2つのカテゴリに分類されます：

### コアチャンネル（内蔵）

| チャンネル           | 認証方式             | 難易度 | 特徴                              |
|--- | --- | --- | ---|
| **Telegram**   | Bot Token            | ⭐   | 最もシンプルで高速、初心者に推奨                |
| **WhatsApp**   | QR Code / Phone Link | ⭐⭐  | 実際の電話番号を使用、専用携帯電話 + eSIMを推奨 |
| **Slack**      | Bot Token + App Token | ⭐⭐ | ワークプレースの第一選択、Socket Mode         |
| **Discord**    | Bot Token            | ⭐⭐  | コミュニティとゲームシーン、機能豊富         |
| **Google Chat** | OAuth / Service Account | ⭐⭐⭐ | Google Workspace企業統合        |
| **Signal**     | signal-cli           | ⭐⭐⭐ | 高度なセキュリティ、設定が複雑              |
| **iMessage**   | imsg (macOS)        | ⭐⭐⭐ | macOS専用、まだ開発中          |

### 拡張チャンネル（外部プラグイン）

| チャンネル             | 認証方式             | タイプ       | 特徴                              |
|--- | --- | --- | ---|
| **WebChat**       | Gateway WebSocket     | 内蔵       | サードパーティ認証不要、最もシンプル            |
| **LINE**          | Messaging API        | 外部プラグイン   | アジアユーザーによく使用される                       |
| **BlueBubbles**   | Private API         | 拡張プラグイン   | iMessage拡張、リモートデバイスをサポート       |
| **Microsoft Teams** | Bot Framework       | 拡張プラグイン   | 企業協力                           |
| **Matrix**        | Matrix Bot SDK      | 拡張プラグイン   | 分散型通信                       |
| **Zalo**         | Zalo OA             | 拡張プラグイン   | ベトナムユーザーによく使用される                       |
| **Zalo Personal** | Personal Account     | 拡張プラグイン   | Zalo個人アカウント                       |

::: info どのチャンネルを選ぶべき？
- **初心者**：TelegramまたはWebChatから始める
- **個人使用**：WhatsApp（既に番号がある場合）、Telegram
- **チーム協力**：Slack、Google Chat、Discord
- **プライバシー優先**：Signal
- **Appleエコシステム**：iMessage、BlueBubbles
:::

---

## コアチャンネルの詳細解説

### 1. Telegram（初心者に推奨）

**推奨理由**：
- ⚡ 最もシンプルな設定フロー（Bot Tokenのみ必要）
- 📱 Markdown、リッチメディアのネイティブサポート
- 🌍 グローバルで利用可能、特別なネットワーク環境不要

**認証方法**：
1. Telegramで`@BotFather`を見つける
2. `/newbot`コマンドを送信
3. 指示に従ってボット名を設定
4. Bot Tokenを取得（形式：`123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`）

**設定例**：
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # デフォルトのDMペアリング保護
    allowFrom: ["*"]     # （ペアリング後）すべてのユーザーを許可
```

**特徴**：
- ✅ Thread/Topicをサポート
- ✅ Reaction絵文字をサポート
- ✅ ファイル、画像、ビデオをサポート

---

### 2. WhatsApp（個人ユーザーに推奨）

**推奨理由**：
- 📱 実際の携帯電話番号を使用、友達が新しい連絡先を追加する必要がない
- 🌍 世界で最も人気のあるインスタントメッセージングツール
- 📞 ボイスメッセージ、通話をサポート

**認証方法**：
1. `clawdbot channels login whatsapp`を実行
2. QRコードをスキャン（WhatsApp Webと同様）
3. または携帯電話リンクを使用（新機能）

**設定例**：
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # デフォルトのDMペアリング保護
        allowFrom: ["*"]     # （ペアリング後）すべてのユーザーを許可
```

**特徴**：
- ✅ リッチメディア（画像、ビデオ、ドキュメント）をサポート
- ✅ ボイスメッセージをサポート
- ✅ Reaction絵文字をサポート
- ⚠️ **専用携帯電話が必要**（eSIM + 予備携帯電話を推奨）

::: warning WhatsAppの制限
- 同一番号で複数の場所から同時にログインしない
- 頻繁な再接続を避ける（一時的にブロックされる可能性がある）
- 専用のテスト番号を使用することを推奨
:::

---

### 3. Slack（チーム協力に推奨）

**推奨理由**：
- 🏢 企業とチームで広く使用されている
- 🔧 豊富なActionsとSlash Commandsをサポート
- 📋 ワークフローとのシームレスな統合

**認証方法**：
1. [Slack API](https://api.slack.com/apps)でアプリを作成
2. Bot Token Scopesを有効化
3. App-Level Tokenを有効化
4. Socket Modeを有効化
5. Bot TokenとApp Tokenを取得

**設定例**：
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特徴**：
- ✅ チャンネル、プライベートメッセージ、グループをサポート
- ✅ Slack Actions（チャンネル作成、ユーザー招待など）をサポート
- ✅ ファイルアップロード、絵文字をサポート
- ⚠️ Socket Modeを有効化する必要がある（ポートを公開するため）

---

### 4. Discord（コミュニティシーンに推奨）

**推奨理由**：
- 🎮 ゲームとコミュニティシーンの第一選択
- 🤖 Discord固有機能（ロール、チャンネル管理）をサポート
- 👥 強力なグループとコミュニティ機能

**認証方法**：
1. [Discord Developer Portal](https://discord.com/developers/applications)でアプリを作成
2. Botユーザーを作成
3. Message Content Intentを有効化
4. Bot Tokenを取得

**設定例**：
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特徴**：
- ✅ ロールと権限管理をサポート
- ✅ チャンネル、スレッド、絵文字をサポート
- ✅ 特定のActions（チャンネル作成、ロール管理など）をサポート
- ⚠️ Intentsを正しく設定する必要がある

---

### 5. その他のコアチャンネル

#### Google Chat
- **使用シナリオ**：Google Workspace企業ユーザー
- **認証方法**：OAuthまたはService Account
- **特徴**：Gmail、Calendarとの統合

#### Signal
- **使用シナリオ**：プライバシー優先ユーザー
- **認証方法**：signal-cli
- **特徴**：エンドツーエンド暗号化、高度なセキュリティ

#### iMessage
- **使用シナリオ**：macOSユーザー
- **認証方法**：imsg (macOS専用)
- **特徴**：Appleエコシステム統合、まだ開発中

---

## 拡張チャンネルの紹介

### WebChat（最もシンプル）

**推奨理由**：
- 🚀 サードパーティアカウントやToken不要
- 🌐 内蔵Gateway WebSocketサポート
- 🔧 開発・デバッグが高速

**使用方法**：

Gatewayを起動した後、以下の方法で直接アクセスできます：
- **macOS/iOS app**：ネイティブSwiftUIインターフェース
- **Control UI**：ブラウザでコンソールのチャットタブにアクセス

**特徴**：
- ✅ 設定不要、すぐに使用可能
- ✅ テストとデバッグをサポート
- ✅ 他のチャンネルとセッションとルーティングルールを共有
- ⚠️ ローカルアクセスのみ（Tailscaleで公開可能）

---

### LINE（アジアユーザー）

**使用シナリオ**：日本、台湾、タイなどのLINEユーザー

**認証方法**：Messaging API（LINE Developers Console）

**特徴**：
- ✅ ボタン、クイックリプライをサポート
- ✅ アジア市場で広く使用されている
- ⚠️ 審査とビジネスアカウントが必要

---

### BlueBubbles（iMessage拡張）

**使用シナリオ**：リモートiMessageアクセスが必要

**認証方法**：Private API

**特徴**：
- ✅ iMessageのリモート制御
- ✅ 複数のデバイスをサポート
- ⚠️ 専用のBlueBubblesサーバーが必要

---

### Microsoft Teams（企業協力）

**使用シナリオ**：Office 365を使用する企業

**認証方法**：Bot Framework

**特徴**：
- ✅ Teamsとの深い統合
- ✅ Adaptive Cardsをサポート
- ⚠️ 設定が複雑

---

### Matrix（分散型）

**使用シナリオ**：分散型通信愛好家

**認証方法**：Matrix Bot SDK

**特徴**：
- ✅ フェデレーションネットワーク
- ✅ エンドツーエンド暗号化
- ⚠️ Homeserverの設定が必要

---

### Zalo / Zalo Personal（ベトナムユーザー）

**使用シナリオ**：ベトナム市場

**認証方法**：Zalo OA / Personal Account

**特徴**：
- ✅ 個人アカウントと企業アカウントをサポート
- ⚠️ 地域制限（ベトナム）

---

## DMペアリング保護メカニズム

### DMペアリング保護とは？

Clawdbotはデフォルトで**DMペアリング保護**（`dmPolicy="pairing"`）を有効にしています。これはセキュリティ機能です：

1. **未知の送信者**がペアリングコードを受け取る
2. メッセージは承認されるまで処理されない
3. 承認後、送信者はローカルホワイトリストに追加される

::: warning なぜペアリング保護が必要なの？
Clawdbotは実際のメッセージングプラットフォームに接続しているため、**受信DMを信頼できない入力として扱う必要があります**。ペアリング保護は以下の効果があります：
- スパムメッセージと悪用を防止
- 悪意のあるコマンドの実行を回避
- AIのクォータとプライバシーを保護
:::

### ペアリングを承認するには？

```bash
# 承認待ちのペアリングリクエストを一覧表示
clawdbot pairing list

# ペアリングを承認
clawdbot pairing approve <channel> <code>

# 例：Telegram送信者を承認
clawdbot pairing approve telegram 123456
```

### ペアリングフローの例

```
未知の送信者：Hello AI!
Clawdbot：🔒 先にペアリングしてください。ペアリングコード：ABC123
あなたの操作：clawdbot pairing approve telegram ABC123
Clawdbot：✅ ペアリング成功！メッセージを送信できます。
```

::: tip DMペアリング保護を無効にする（非推奨）
公開アクセスが必要な場合、以下のように設定できます：
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # すべてのユーザーを許可
```

⚠️ セキュリティが低下するため、慎重に使用してください！
:::

---

## グループメッセージ処理

### @mentionトリガー

デフォルトでは、グループメッセージはボットを**@mention**しないと応答しません：

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # デフォルト：@mentionが必要
```

### コマンドトリガー

コマンドプレフィックスを使用してトリガーすることもできます：

```bash
# グループで送信
/ask 量子もつれを説明してください
/help 利用可能なコマンドを一覧表示
/new 新しいセッションを開始
```

### 設定例

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # @mentionが必要
    # または
    allowUnmentionedGroups: true   # すべてのメッセージに応答（非推奨）
```

---

## チャンネル設定：ウィザード vs 手動

### 方法 A：オンボーディングウィザードを使用（推奨）

```bash
clawdbot onboard
```

ウィザードは以下をガイドします：
1. チャンネルの選択
2. 認証の設定（Token、API Keyなど）
3. DMポリシーの設定
4. 接続のテスト

### 方法 B：手動設定

設定ファイル`~/.clawdbot/clawdbot.json`を編集：

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

設定を有効にするにはGatewayを再起動：

```bash
clawdbot gateway restart
```

---

## チェックポイント ✅

このチュートリアルを完了すると、以下のことができるようになります：

- [ ] Clawdbotがサポートするすべてのチャンネルを一覧表示できる
- [ ] DMペアリング保護メカニズムを理解できる
- [ ] 自分に最適なチャンネルを選択できる
- [ ] チャンネルの設定方法（ウィザードまたは手動）を知っている
- [ ] グループメッセージのトリガー方法を理解できる

::: tip 次のステップ
チャンネルを選択して、設定を開始してください：
- [WhatsAppチャンネル設定](../whatsapp/) - 実際の番号を使用
- [Telegramチャンネル設定](../telegram/) - 最もシンプルで高速
- [Slackチャンネル設定](../slack/) - チーム協力の第一選択
- [Discordチャンネル設定](../discord/) - コミュニティシーン
:::

---

## トラブルシューティングのヒント

### ❌ DMペアリング保護を有効化し忘れる

**誤った方法**：
```yaml
channels:
  telegram:
    dmPolicy: "open"  # 開放的すぎる！
```

**正しい方法**：
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # 安全なデフォルト
```

::: danger DMオープンのリスク
DMをオープンにすると、誰でもAIアシスタントにメッセージを送信でき、以下の問題が発生する可能性があります：
- クォータの悪用
- プライバシーの漏洩
- 悪意のあるコマンドの実行
:::

### ❌ WhatsAppで複数の場所からログイン

**誤った方法**：
- 携帯電話とClawdbotで同時に同じ番号にログインする
- 頻繁にWhatsAppを再接続する

**正しい方法**：
- 専用のテスト番号を使用する
- 頻繁な再接続を避ける
- 接続状態を監視する

### ❌ SlackでSocket Modeを有効化し忘れる

**誤った方法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # appTokenが不足
```

**正しい方法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # 必須
```

### ❌ Discord Intentsの設定ミス

**誤った方法**：
- 基本的なIntentsのみを有効化
- Message Content Intentの有効化を忘れる

**正しい方法**：
- Discord Developer Portalですべての必要なIntentsを有効化
- 特にMessage Content Intent

---

## このレッスンのまとめ

このレッスンでは以下を学びました：

1. ✅ **チャンネル概要**：Clawdbotが13+の通信チャンネルをサポート
2. ✅ **コアチャンネル**：Telegram、WhatsApp、Slack、Discordの特徴と設定
3. ✅ **拡張チャンネル**：LINE、BlueBubbles、Teams、Matrixなどの特徴的なチャンネル
4. ✅ **DM保護**：ペアリングメカニズムのセキュリティ価値と使用方法
5. ✅ **グループ処理**：@mentionとコマンドトリガーメカニズム
6. ✅ **設定方法**：ウィザードと手動設定の2つの方法

**次のステップ**：

- [WhatsAppチャンネル設定](../whatsapp/)を学び、実際の番号を設定
- [Telegramチャンネル設定](../telegram/)を学び、最も高速な開始方法を習得
- [Slackチャンネル設定](../slack/)を理解し、チーム協力を統合
- [Discordチャンネル設定](../discord/)をマスターし、コミュニティシーンで活用

---

## 次のレッスンの予告

> 次のレッスンでは**[WhatsAppチャンネル設定](../whatsapp/)**を学びます。
>
> 学習内容：
> - QRコードまたは携帯電話リンクを使用してWhatsAppにログインする方法
> - DMポリシーとグループルールを設定する方法
> - 複数のWhatsAppアカウントを管理する方法
> - WhatsAppの接続問題をトラブルシューティングする方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能            | ファイルパス                                                                                               | 行番号    |
|--- | --- | ---|
| チャンネルレジストリ       | [`src/channels/registry.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.ts) | 7-100   |
| チャンネルプラグインディレクトリ   | [`src/channels/plugins/`](https://github.com/clawdbot/clawdbot/tree/main/src/channels/plugins/) | 全ディレクトリ  |
| チャンネルメタデータタイプ   | [`src/channels/plugins/types.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/types.core.ts) | 74-93   |
| DMペアリングメカニズム     | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts) | 全ファイル  |
| グループ@mention | [`src/channels/plugins/group-mentions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/group-mentions.ts) | 全ファイル  |
| ホワイトリストマッチ     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/allowlist-match.ts) | 全ファイル  |
| チャンネルディレクトリ設定   | [`src/channels/plugins/directory-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/directory-config.ts) | 全ファイル  |
| WhatsAppプラグイン | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 全ファイル  |
| Telegramプラグイン | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | 全ファイル  |
| Slackプラグイン     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 全ファイル  |
| Discordプラグイン   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 全ファイル  |

**重要な定数**：
- `CHAT_CHANNEL_ORDER`：コアチャンネルの順序配列（`src/channels/registry.ts:7-15`より）
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：デフォルトチャンネル（`src/channels/registry.ts:21`より）
- `dmPolicy="pairing"`：デフォルトのDMペアリングポリシー（`README.md:110`より）

**重要なタイプ**：
- `ChannelMeta`：チャンネルメタデータインターフェース（`src/channels/plugins/types.core.ts:74-93`より）
- `ChannelAccountSnapshot`：チャンネルアカウント状態スナップショット（`src/channels/plugins/types.core.ts:95-142`より）
- `ChannelSetupInput`：チャンネル設定入力インターフェース（`src/channels/plugins/types.core.ts:19-51`より）

**重要な関数**：
- `listChatChannels()`：すべてのコアチャンネルを一覧表示（`src/channels/registry.ts:114-116`）
- `normalizeChatChannelId()`：チャンネルIDを正規化（`src/channels/registry.ts:126-133`）
- `buildChannelUiCatalog()`：UIカタログを構築（`src/channels/plugins/catalog.ts:213-239`）

</details>
