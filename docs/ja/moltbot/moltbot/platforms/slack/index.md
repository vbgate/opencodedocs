---
title: "Slackチャンネル設定完全ガイド：Socket/HTTP Mode、セキュリティ設定 | Clawdbotチュートリアル"
sidebarTitle: "SlackもAIで"
subtitle: "Slackチャンネル設定完全ガイド | Clawdbotチュートリアル"
description: "ClawdbotでSlackチャンネルを設定・使用する方法を学びます。このチュートリアルはSocket ModeとHTTP Modeの2つの接続方式、Token取得手順、DMセキュリティ設定、グループ管理ポリシー、Slack Actionsツールの使用方法を網羅します。"
tags:
  - "platforms"
  - "slack"
  - "設定"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Slackチャンネル設定完全ガイド

## 学習目標

このチュートリアルを完了すると、以下のことができるようになります：

- ✅ SlackでClawdbotと対話し、AIアシスタントを使用してタスクを完了する
- ✅ DMセキュリティポリシーを設定し、個人のプライバシーを保護する
- ✅ グループでClawdbotを統合し、@メンションとコマンドにインテリジェントに応答する
- ✅ Slack Actionsツール（メッセージ送信、Pin管理、メンバー情報確認など）を使用する
- ✅ Socket ModeまたはHTTP Modeの2つの接続方式を選択する

## 今直面している問題

Slackはチーム協力の中核ツールですが、以下のような問題に直面しているかもしれません：

- チームの議論が複数のチャンネルに分散し、重要な情報を見逃す
- 過去のメッセージ、Pin、メンバー情報を素早く確認したいが、SlackのUIが不便
- SlackでAIの機能を直接使用したいが、他のアプリに切り替える必要がある
- グループでAIアシスタントを有効にすることで、メッセージの氾濫やプライバシーの漏洩を心配している

## いつこの方法を使用すべきか

- **チームの日常コミュニケーション**：Slackがあなたのチームの主要なコミュニケーションツールである場合
- **Slackネイティブ統合が必要**：Reaction、Pin、Threadなどの機能を活用したい場合
- **複数アカウントのニーズ**：複数のSlack Workspaceに接続する必要がある場合
- **リモートデプロイシナリオ**：HTTP ModeでリモートGatewayに接続する場合

## 🎒 始める前の準備

::: warning 事前確認
始める前に、以下を確認してください：
- [クイックスタート](../../start/getting-started/)を完了している
- Gatewayが起動・実行されている
- Slack Workspaceの管理者権限を持っている（Appを作成するため）
:::

**必要なリソース**：
- [Slack APIコンソール](https://api.slack.com/apps) - Slack Appの作成・管理
- Clawdbot設定ファイル - 通常は `~/.clawdbot/clawdbot.json` に配置

## コアコンセプト

ClawdbotのSlackチャンネルは [Bolt](https://slack.dev/bolt-js) フレームワークに基づいて実装されており、2つの接続モードをサポートしています：

| モード | 使用シナリオ | 優位性 | 劣位性 |
|--- | --- | --- | ---|
| **Socket Mode** | ローカルGateway、個人使用 | 設定が簡単（Tokenのみ） | 常時WebSocket接続が必要 |
| **HTTP Mode** | サーバーデプロイ、リモートアクセス | ファイアウォール通過、負荷分散対応 | パブリックIPが必要、設定が複雑 |

**デフォルトでSocket Modeを使用**、大多数のユーザーに適しています。

**認証メカニズム**：
- **Bot Token** (`xoxb-...`) - 必須、API呼び出し用
- **App Token** (`xapp-...`) - Socket Mode必須、WebSocket接続用
- **User Token** (`xoxp-...`) - オプション、読み取り専用操作（履歴、Pin、Reactions）
- **Signing Secret** - HTTP Mode必須、Webhookリクエストの検証用

## 実践チュートリアル

### 手順1：Slack Appを作成する

**理由**
Slack AppはClawdbotとWorkspace間の架け橋となり、認証と権限管理を提供します。

1. [Slack APIコンソール](https://api.slack.com/apps)にアクセス
2. **Create New App**をクリック → **From scratch**を選択
3. App情報を入力：
   - **App Name**：`Clawdbot`（またはお好みの名前）
   - **Pick a workspace to develop your app in**：あなたのWorkspaceを選択
4. **Create App**をクリック

**期待する結果**：
Appが正常に作成され、基本設定ページに入ります。

### 手順2：Socket Modeを設定する（推奨）

::: tip ヒント
ローカルGatewayを使用する場合、Socket Modeが推奨されます。設定がより簡単です。
:::

**理由**
Socket ModeはパブリックIPを必要とせず、SlackのWebSocketサービスを介して接続します。

1. App設定ページで**Socket Mode**を見つけ、**On**に切り替え
2. **App-Level Tokens**までスクロールし、**Generate Token and Scopes**をクリック
3. **Token**セクションでscopeを選択：
   - `connections:write`にチェック
4. **Generate Token**をクリックし、生成された**App Token**（`xapp-`で始まる）をコピー

**期待する結果**：
生成されたTokenは以下のようになります：`xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger セキュリティリマインダー
App Tokenは機密情報です。慎重に保管し、公開リポジトリに漏洩しないようにしてください。
:::

### 手順3：Bot Tokenと権限を設定する

1. **OAuth & Permissions** → **Bot Token Scopes**までスクロール
2. 以下のscopes（権限）を追加：

**Bot Token Scopes（必須）**：

```yaml
    chat:write                    # メッセージ送信/編集/削除
    channels:history              # チャンネル履歴読み取り
    channels:read                 # チャンネル情報取得
    groups:history                # グループ履歴読み取り
    groups:read                   # グループ情報取得
    im:history                   # DM履歴読み取り
    im:read                      # DM情報取得
    im:write                     # DMセッション開始
    mpim:history                # グループDM履歴読み取り
    mpim:read                   # グループDM情報取得
    users:read                   # ユーザー情報照会
    app_mentions:read            # @メンション読み取り
    reactions:read               # Reaction読み取り
    reactions:write              # Reaction追加/削除
    pins:read                    # Pinリスト読み取り
    pins:write                   # Pin追加/削除
    emoji:read                   # カスタムEmoji読み取り
    commands                     # スラッシュコマンド処理
    files:read                   # ファイル情報読み取り
    files:write                  # ファイルアップロード
```

::: info 説明
以上は**Bot Token**の必須権限で、Botが正常にメッセージを読み取り、応答を送信し、ReactionとPinを管理できることを確保します。
:::

3. ページの上部までスクロールし、**Install to Workspace**をクリック
4. **Allow**をクリックしてAppがWorkspaceにアクセスすることを許可
5. 生成された**Bot User OAuth Token**（`xoxb-`で始まる）をコピー

**期待する結果**：
Tokenは以下のようになります：`xoxb-YOUR-BOT-TOKEN-HERE`

::: tip ヒント
 **User Token**（読み取り専用操作用）が必要な場合、**User Token Scopes**までスクロールし、以下の権限を追加します：
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

その後、**Install App**ページで**User OAuth Token**（`xoxp-`で始まる）をコピーします。

**User Token Scopes（オプション、読み取り専用）**：
- 読み取り専用操作（履歴、Reaction、Pin、Emoji、検索）にのみ使用
- 書き込み操作はBot Tokenを使用（`userTokenReadOnly: false`設定時を除く）
:::

### 手順4：イベントサブスクリプションを設定する

1. App設定ページで**Event Subscriptions**を見つけ、**Enable Events**を有効化
2. **Subscribe to bot events**に以下のイベントを追加：

```yaml
    app_mention                  # @Botメンション
    message.channels              # チャンネルメッセージ
    message.groups               # グループメッセージ
    message.im                   # DMメッセージ
    message.mpim                # グループDMメッセージ
    reaction_added               # Reaction追加
    reaction_removed             # Reaction削除
    member_joined_channel       # メンバーチャンネル参加
    member_left_channel          # メンバーチャンネル離脱
    channel_rename               # チャンネル名変更
    pin_added                   # Pin追加
    pin_removed                 # Pin削除
```

3. **Save Changes**をクリック

### 手順5：DM機能を有効化する

1. App設定ページで**App Home**を見つける
2. **Messages Tab**を有効化 → **Enable Messages Tab**を有効化
3. **Messages tab read-only disabled: No**と表示されていることを確認

**期待する結果**：
Messages Tabが有効になり、ユーザーはBotとDMで対話できるようになります。

### 手順6：Clawdbotを設定する

**理由**
Slack TokenをClawdbotに設定し、接続を確立します。

#### 方法1：環境変数を使用（推奨）

```bash
    # 環境変数を設定
    export SLACK_BOT_TOKEN="xoxb-あなたのBotToken"
    export SLACK_APP_TOKEN="xapp-あなたのAppToken"

    # Gatewayを再起動
    clawdbot gateway restart
```

**期待する結果**：
Gateway起動ログに `Slack: connected` と表示されます。

#### 方法2：設定ファイル

`~/.clawdbot/clawdbot.json`を編集：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-あなたのBotToken",
      "appToken": "xapp-あなたのAppToken"
    }
  }
}
```

**User Tokenがある場合**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-あなたのBotToken",
      "appToken": "xapp-あなたのAppToken",
      "userToken": "xoxp-あなたのUserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**期待する結果**：
Gatewayを再起動後、Slack接続が成功します。

### 手順7：Botをチャンネルに招待する

1. SlackでBotを参加させたいチャンネルを開く
2. `/invite @Clawdbot`と入力（Bot名を置換）
3. **Add to channel**をクリック

**期待する結果**：
Botが正常にチャンネルに参加し、"Clawdbot has joined the channel"と表示されます。

### 手順8：グループセキュリティポリシーを設定する

**理由**
すべてのチャンネルでBotが自動応答するのを防ぎ、プライバシーを保護します。

`~/.clawdbot/clawdbot.json`を編集：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-あなたのBotToken",
      "appToken": "xapp-あなたのAppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**フィールドの説明**：
- `groupPolicy`: グループポリシー
  - `"open"` - すべてのチャンネルを許可（非推奨）
  - `"allowlist"` - リストされたチャンネルのみ許可（推奨）
  - `"disabled"` - すべてのチャンネルを禁止
- `channels`: チャンネル設定
  - `allow`: 許可/拒否
  - `requireMention`: Botに@メンションして応答するかどうか（デフォルト `true`）
  - `users`: 追加のユーザーホワイトリスト
  - `skills`: このチャンネルで使用できるスキルを制限
  - `systemPrompt`: 追加のシステムプロンプト

**期待する結果**：
Botは設定されたチャンネルでのみメッセージに応答し、@メンションが必要です。

### 手順9：DMセキュリティポリシーを設定する

**理由**
見知らぬ人がDMでBotと対話するのを防ぎ、プライバシーを保護します。

`~/.clawdbot/clawdbot.json`を編集：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-あなたのBotToken",
      "appToken": "xapp-あなたのAppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**フィールドの説明**：
- `dm.enabled`: DMの有効/無効（デフォルト `true`）
- `dm.policy`: DMポリシー
  - `"pairing"` - 見知らぬ人はペアリングコードを受け取り、承認が必要（デフォルト）
  - `"open"` - 誰でもDM可能
  - `"allowlist"` - ホワイトリストのユーザーのみ許可
- `dm.allowFrom`: ホワイトリスト
  - ユーザーID（`U1234567890`）をサポート
  - @メンション（`@alice`）をサポート
  - メールアドレス（`user@example.com`）をサポート

**ペアリングフロー**：
1. 見知らぬ人がBotにDMを送信
2. Botがペアリングコードを返信（有効期限1時間）
3. ユーザーがペアリングコードを管理者に提供
4. 管理者が実行：`clawdbot pairing approve slack <ペアリングコード>`
5. ユーザーがホワイトリストに追加され、正常に使用可能

**期待する結果**：
未知の送信者はペアリングコードを受け取り、Botはメッセージを処理しません。

### 手順10：Botをテストする

1. 設定されたチャンネルでメッセージを送信：`@Clawdbot こんにちは`
2. またはBotにDMを送信
3. Botの応答を観察

**期待する結果**：
Botが正常にメッセージに応答します。

### チェックポイント ✅

- [ ] Slack Appが正常に作成された
- [ ] Socket Modeが有効化された
- [ ] Bot TokenとApp Tokenがコピーされた
- [ ] Clawdbot設定ファイルが更新された
- [ ] Gatewayが再起動された
- [ ] Botがチャンネルに招待された
- [ ] グループセキュリティポリシーが設定された
- [ ] DMセキュリティポリシーが設定された
- [ ] テストメッセージが応答を受け取った

## よくある問題

### よくあるエラー1：Botが応答しない

**問題**：メッセージ送信後、Botが応答しない。

**考えられる原因**：
1. Botがチャンネルに参加していない → `/invite @Clawdbot`で招待
2. `requireMention`が`true`に設定されている → メッセージ送信時に`@Clawdbot`が必要
3. Token設定が誤っている → `clawdbot.json`のTokenが正しいか確認
4. Gatewayが実行されていない → `clawdbot gateway status`で状態確認

### よくあるエラー2：Socket Mode接続失敗

**問題**：Gatewayログに接続失敗が表示される。

**解決方法**：
1. App Tokenが正しいか確認（`xapp-`で始まる）
2. Socket Modeが有効化されているか確認
3. ネットワーク接続を確認

### よくあるエラー3：User Token権限不足

**問題**：一部の操作が失敗し、権限エラーが表示される。

**解決方法**：
1. User Tokenに必要な権限が含まれているか確認（手順3参照）
2. `userTokenReadOnly`設定を確認（デフォルト `true`、読み取り専用）
3. 書き込み操作が必要な場合、`"userTokenReadOnly": false`を設定

### よくあるエラー4：チャンネルID解決失敗

**問題**：設定されたチャンネル名がIDに解決できない。

**解決方法**：
1. 名前よりもチャンネルID（`C1234567890`など）を優先して使用
2. チャンネル名が`#`で始まることを確認（`#general`など）
3. Botがそのチャンネルにアクセスする権限を持っているか確認

## 上級設定

### 権限の説明

::: info Bot Token vs User Token
- **Bot Token**：必須、Botの主要機能（メッセージ送信、履歴読み取り、Pin/Reaction管理など）
- **User Token**：オプション、読み取り専用操作（履歴、Reaction、Pin、Emoji、検索）にのみ使用
  - デフォルト `userTokenReadOnly: true`、読み取り専用を確保
  - 書き込み操作（メッセージ送信、Reaction追加など）はBot Tokenを使用
:::

**将来必要になる可能性のある権限**：

現在のバージョンでは必須ではありませんが、将来サポートが追加される可能性のある権限：

| 権限 | 用途 |
|--- | ---|
| `groups:write` | プライベートチャンネル管理（作成、名前変更、招待、アーカイブ） |
| `mpim:write` | グループDMセッション管理 |
| `chat:write.public` | Botが参加していないチャンネルにメッセージを公開 |
| `files:read` | ファイルメタデータのリスト/読み取り |

これらの機能を有効にする必要がある場合は、Slack Appの**Bot Token Scopes**に対応する権限を追加してください。

### HTTP Mode（サーバーデプロイ）

Gatewayがリモートサーバーにデプロイされている場合、HTTP Modeを使用します：

1. Slack Appを作成し、Socket Modeを無効化
2. **Signing Secret**をコピー（Basic Informationページ）
3. Event Subscriptionsを設定し、**Request URL**を`https://あなたのドメイン/slack/events`に設定
4. Interactivity & Shortcutsを設定し、同じ**Request URL**を設定
5. Slash Commandsを設定し、**Request URL**を設定

**設定ファイル**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-あなたのBotToken",
      "signingSecret": "あなたのSigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### 複数アカウント設定

複数のSlack Workspaceに接続をサポート：

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### スラッシュコマンドの設定

`/clawd`コマンドを有効化：

1. App設定ページで**Slash Commands**を見つける
2. コマンドを作成：
   - **Command**：`/clawd`
   - **Request URL**：Socket Modeでは不要（WebSocketで処理）
   - **Description**：`Send a message to Clawdbot`

**設定ファイル**：

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### スレッド返信設定

Botがチャンネルで返信する方法を制御：

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| モード | 動作 |
|--- | ---|
| `off` | デフォルト、メインチャンネルで返信 |
| `first` | 最初の返信がスレッドに入り、以降の返信はメインチャンネル |
| `all` | すべての返信がスレッド |

### Slack Actionsツールを有効化

AgentがSlack固有の操作を呼び出せるようにします：

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**使用可能な操作**：
- `sendMessage` - メッセージ送信
- `editMessage` - メッセージ編集
- `deleteMessage` - メッセージ削除
- `readMessages` - 過去のメッセージ読み取り
- `react` - Reaction追加
- `reactions` - Reactionリスト
- `pinMessage` - メッセージをPin
- `unpinMessage` - Pin解除
- `listPins` - Pinリスト
- `memberInfo` - メンバー情報取得
- `emojiList` - カスタムEmojiリスト

## まとめ

- SlackチャンネルはSocket ModeとHTTP Modeの2つの接続方式をサポート
- Socket Mode設定が簡単で、ローカル使用に推奨
- DMセキュリティポリシーはデフォルトで`pairing`、見知らぬ人は承認が必要
- グループセキュリティポリシーはホワイトリストと@メンションフィルタリングをサポート
- Slack Actionsツールは豊富な操作機能を提供
- 複数アカウントで複数のWorkspaceに接続をサポート

## 次のレッスンの予告

> 次のレッスンでは**[Discordチャンネル](../discord/)**を学びます。
>
> 学習内容：
> - Discord Botの設定方法
> - Token取得と権限設定
> - グループとDMセキュリティポリシー
> - Discord固有ツールの使用

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能            | ファイルパス                                                                                               | 行番号       |
|--- | --- | ---|
| Slack設定タイプ | [`src/config/types.slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack onboardingロジック | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Slack Actionsツール | [`src/agents/tools/slack-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Slack公式ドキュメント | [`docs/channels/slack.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/slack.md) | 1-508      |

**重要な型定義**：
- `SlackConfig`：Slackチャンネルメイン設定型
- `SlackAccountConfig`：単一アカウント設定（socket/httpモード対応）
- `SlackChannelConfig`：チャンネル設定（ホワイトリスト、mentionポリシーなど）
- `SlackDmConfig`：DM設定（pairing、allowlistなど）
- `SlackActionConfig`：Actionsツール権限制御

**重要な関数**：
- `handleSlackAction()`：Slack Actionsツール呼び出しを処理
- `resolveThreadTsFromContext()`：replyToModeに基づいてスレッドIDを解決
- `buildSlackManifest()`：Slack App Manifestを生成

</details>
