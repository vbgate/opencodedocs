---
title: "Discordチャンネルの設定と使用 | Clawdbotチュートリアル"
sidebarTitle: "Discord Botを接続する"
subtitle: "Discordチャンネルの設定と使用"
description: "Discord Botの作成方法とClawdbotへの設定方法を学びます。本チュートリアルでは、Discord Developer PortalでのBot作成、Gateway Intents権限設定、Bot Token設定方法、OAuth2招待URL生成、DMペアリング保護メカニズム、サーバーチャンネルホワイトリスト設定、AI Discordツール呼び出し権限管理、一般的な問題のトラブルシューティング手順について説明します。"
tags:
  - "チャンネル設定"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Discordチャンネルの設定と使用

## 学習完了後にできること

- Discord Botを作成し、Bot Tokenを取得する
- ClawdbotとDiscord Botを統合するように設定する
- DiscordのDM（ダイレクトメッセージ）とサーバーチャンネルでAIアシスタントを使用する
- アクセス制御を設定する（DMペアリング、チャンネルホワイトリスト）
- AIにDiscordツールを呼び出させる（メッセージ送信、チャンネル作成、ロール管理など）

## 現在の課題

すでにDiscordを使って友人やチームと交流していて、アプリを切り替えることなく、Discord内で直接AIアシスタントと会話したいと考えています。以下のような問題に直面しているかもしれません：

- Discord Botの作成方法がわからない
- Botが正常に動作するために必要な権限が不明確
- Botと対話できるユーザーを制御したい（見知らぬ人による悪用を避けるため）
- 異なるサーバーチャンネルで異なる動作を設定したい

本チュートリアルでは、これらの問題を一歩ずつ解決する方法を教えます。

## この機能を使用するタイミング

Discordチャンネルは以下のシーンに適しています：

- ✅ Discordを頻繁に使用しており、ほとんどの交流がDiscord上で行われる
- ✅ DiscordサーバーにAI機能を追加したい（例：`#help`チャンネルのスマートアシスタントなど）
- ✅ DiscordのDMでAIと対話したい（WebChatを開くより便利）
- ✅ AIにDiscordで管理操作を実行させたい（チャンネル作成、メッセージ送信など）

::: info Discordチャンネルはdiscord.jsベースで、完全なBot API機能をサポートしています。
:::

## 🎒 開始前の準備

**必須条件**：
- [クイックスタート](../../start/getting-started/)が完了していること、Gatewayが実行可能であること
- Node.js ≥ 22
- Discordアカウント（アプリケーションを作成できる）

**必要な情報**：
- Discord Bot Token（後ほど取得方法を説明します）
- サーバーID（オプション、特定のチャンネルを設定する場合）
- チャンネルID（オプション、きめ細かい制御を行う場合）

## コアコンセプト

### Discordチャンネルの仕組み

Discordチャンネルは**公式Bot API**を通じてDiscordと通信します：

```
Discordユーザー
     ↓
   Discordサーバー
     ↓
   Discord Bot Gateway
     ↓ (WebSocket)
   Clawdbot Gateway
     ↓
   AI Agent (Claude/GPTなど)
     ↓
   Discord Bot API（返信を送信）
     ↓
   Discordサーバー
     ↓
   Discordユーザー（返信を見る）
```

**重要ポイント**：
- BotはWebSocketを通じてメッセージを受信する（Gateway → Bot）
- ClawdbotはメッセージをAI Agentに転送して処理させる
- AIは`discord`ツールを呼び出してDiscord固有の操作を実行できる
- すべての応答はBot APIを通じてDiscordに送信される

### DMとサーバーチャンネルの違い

| タイプ | セッション分離 | デフォルト動作 | 使用シーン |
|--- | --- | --- | ---|
| **DM（ダイレクトメッセージ）** | すべてのDMが`agent:main:main`セッションを共有 | ペアリング保護が必要 | 個人の会話、コンテキストを継続 |
| **サーバーチャンネル** | 各チャンネルが独立したセッション`agent:<agentId>:discord:channel:<channelId>` | @メンションが必要な場合のみ返信 | サーバースマートアシスタント、マルチチャンネル並列 |

::: tip
サーバーチャンネルのセッションは完全に分離されており、相互に干渉しません。`#help`チャンネルの会話は`#general`には表示されません。
:::

### デフォルトのセキュリティメカニズム

Discordチャンネルはデフォルトで**DMペアリング保護**が有効になっています：

```
不明なユーザー → DMを送信 → Clawdbot
                              ↓
                      処理を拒否、ペアリングコードを返す
                              ↓
                ユーザーが`clawdbot pairing approve discord <code>`を実行する必要がある
                              ↓
                            ペアリング成功、会話可能
```

これにより、見知らぬユーザーが直接あなたのAIアシスタントと対話することを防ぎます。

---

## 実践手順

### ステップ1：DiscordアプリケーションとBotを作成

**理由**
Discord BotがDiscordサーバーに接続するには「ID」が必要です。このIDがBot Tokenです。

#### 1.1 Discordアプリケーションを作成

1. [Discord Developer Portal](https://discord.com/developers/applications)を開く
2. **New Application**（新しいアプリケーション）をクリック
3. アプリケーション名を入力（例：`Clawdbot AI`）
4. **Create**（作成）をクリック

#### 1.2 Botユーザーを追加

1. 左側のナビゲーションバーで**Bot**（ボット）をクリック
2. **Add Bot** → **Reset Token** → **Reset Token**（トークンをリセット）をクリック
3. **重要**：Bot Tokenをすぐにコピー（1回しか表示されません！）

```
Bot Tokenの形式：MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
（リセットするたびに変わるので、安全に保管してください！）
```

#### 1.3 必要なGateway Intentsを有効化

DiscordはデフォルトでBotにメッセージコンテンツの読み取りを許可しません。手動で有効にする必要があります。

**Bot → Privileged Gateway Intents**（特権ゲートウェイインテント）で以下を有効化：

| Intent | 必須 | 説明 |
|--- | --- | ---|
| **Message Content Intent** | ✅ **必須** | メッセージテキストの内容を読み取る（これがないとBotはメッセージを認識できません） |
| **Server Members Intent** | ⚠️ **推奨** | メンバー検索とユーザー名解決に使用 |

::: danger 禁忌事項
本当にユーザーのオンライン状態が必要な場合を除き、**Presence Intent**（プレゼンスインテント）を有効にしないでください。
:::

**確認すべきこと**：両方のスイッチが緑色（ON）の状態になっていること。

---

### ステップ2：招待URLを生成してサーバーに追加

**理由**
Botがサーバーでメッセージを読み取り、送信するには権限が必要です。

1. 左側のナビゲーションバーで**OAuth2 → URL Generator**をクリック
2. **Scopes**（スコープ）で以下を選択：
   - ✅ **bot**
   - ✅ **applications.commands**（ネイティブコマンド用）

3. **Bot Permissions**（Bot権限）で少なくとも以下を選択：

| 権限 | 説明 |
|--- | ---|
| **View Channels** | チャンネルを表示 |
| **Send Messages** | メッセージを送信 |
| **Read Message History** | 過去のメッセージを読み取る |
| **Embed Links** | リンクを埋め込む |
| **Attach Files** | ファイルをアップロード |

オプション権限（必要に応じて追加）：
- **Add Reactions**（リアクションを追加）
- **Use External Emojis**（カスタム絵文字を使用）

::: warning セキュリティヒント
デバッグ中でBotを完全に信頼している場合を除き、**Administrator**（管理者）権限を付与しないでください。
:::

4. 生成されたURLをコピー
5. ブラウザでURLを開く
6. サーバーを選択し、**Authorize**（承認）をクリック

**確認すべきこと**：Botがサーバーに正常に追加され、緑色のオンライン状態で表示されていること。

---

### ステップ3：必要なIDを取得（サーバー、チャンネル、ユーザー）

**理由**
Clawdbotの設定ではID（数値）を使用することが推奨されます。IDは変更されないためです。

#### 3.1 Discord開発者モードを有効化

1. Discordデスクトップ/ウェブ版 → **User Settings**（ユーザー設定）
2. **Advanced**（詳細）→ **Developer Mode**（開発者モード）を有効化

#### 3.2 IDをコピー

| タイプ | 操作 |
|--- | ---|
| **サーバーID** | サーバー名を右クリック → **Copy Server ID** |
| **チャンネルID** | チャンネル（例：`#general`）を右クリック → **Copy Channel ID** |
| **ユーザーID** | ユーザーアバターを右クリック → **Copy User ID** |

::: tip IDと名称の比較
設定時はIDの使用を優先してください。名前は変更される可能性がありますが、IDは永遠に変更されません。
:::

**確認すべきこと**：IDがクリップボードにコピーされていること（形式：`123456789012345678`）。

---

### ステップ4：Clawdbotを設定してDiscordに接続

**理由**
ClawdbotにDiscord Botへの接続方法を伝えます。

#### 方法1：環境変数を使用（推奨、サーバーに適している）

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### 方法2：設定ファイルを使用

`~/.clawdbot/clawdbot.json`を編集：

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // ステップ1でコピーしたToken
    }
  }
}
```

::: tip 環境変数の優先順位
環境変数と設定ファイルの両方が設定されている場合、**設定ファイルが優先**されます。
:::

**確認すべきこと**：Gatewayを起動すると、Discord Botがオンライン状態で表示されること。

---

### ステップ5：接続を検証してテスト

**理由**
設定が正しく、Botが正常にメッセージを受信・送信できることを確認します。

1. Gatewayを起動（まだ起動していない場合）：

```bash
clawdbot gateway --port 18789 --verbose
```

2. Discord Botの状態を確認：
   - Botはサーバーメンバーリストに**緑色のオンライン**で表示されるはず
   - グレーのオフラインの場合、Tokenが正しいか確認

3. テストメッセージを送信：

Discordで：
- **DM**：Botに直接メッセージを送信（ペアリングコードが返されます。次のセクションを参照）
- **サーバーチャンネル**：Botを@メンション、例：`@ClawdbotAI hello`

**確認すべきこと**：Botがメッセージで返信すること（内容はあなたのAIモデルによります）。

::: tip テストに失敗した場合
Botが返信しない場合、[トラブルシューティング](#トラブルシューティング)セクションを確認してください。
:::

---

## チェックポイント ✅

続行する前に、以下を確認してください：

- [ ] Bot Tokenが正しく設定されている
- [ ] Botがサーバーに正常に追加されている
- [ ] Message Content Intentが有効化されている
- [ ] Gatewayが実行中である
- [ ] BotがDiscordでオンラインで表示されている
- [ ] Botを@メンションすると返信が届く

---

## 高度な設定

### DMアクセス制御

デフォルトのポリシーは`pairing`（ペアリングモード）で、個人使用に適しています。必要に応じて調整できます：

| ポリシー | 説明 | 設定例 |
|--- | --- | ---|
| **pairing**（デフォルト） | 見知らぬユーザーはペアリングコードを受け取り、手動で承認が必要 | `"dm": { "policy": "pairing" }` |
| **allowlist** | リスト内のユーザーのみ許可 | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | すべてのユーザーを許可（`allowFrom`に`"*"`を含める必要あり） | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | すべてのDMを無効化 | `"dm": { "enabled": false }` |

#### 設定例：特定のユーザーを許可

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // ユーザーID
          "@alice",                   // ユーザー名（IDに解決されます）
          "alice#1234"              // 完全なユーザー名
        ]
      }
    }
  }
}
```

#### ペアリングリクエストを承認

見知らぬユーザーが初めてDMを送信すると、ペアリングコードが返されます。承認方法：

```bash
clawdbot pairing approve discord <ペアリングコード>
```

### サーバーチャンネル設定

#### 基本設定：特定のチャンネルのみ許可

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // ホワイトリストモード（デフォルト）
      guilds: {
        "123456789012345678": {
          requireMention: true,  // @メンションが必要な場合のみ返信
          channels: {
            help: { allow: true },    // #helpを許可
            general: { allow: true } // #generalを許可
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true`は推奨設定で、Botが公開チャンネルで「勝手に反応」するのを防ぎます。
:::

#### 高度な設定：チャンネル固有の動作

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // 表示名（オプション）
          reactionNotifications: "own",      // Bot自身のメッセージへのリアクションのみイベントをトリガー
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // 特定のユーザーのみトリガー可能
              skills: ["search", "docs"],    // 利用可能なスキルを制限
              systemPrompt: "Keep answers under 50 words."  // 追加のシステムプロンプト
            }
          }
        }
      }
    }
  }
}
```

### Discordツール操作

AI Agentは`discord`ツールを呼び出してDiscord固有の操作を実行できます。`channels.discord.actions`を通じて権限を制御：

| 操作カテゴリ | デフォルト状態 | 説明 |
|--- | --- | ---|
| **reactions** | ✅ 有効 | リアクションの追加/読み取り |
| **messages** | ✅ 有効 | メッセージの読み取り/送信/編集/削除 |
| **threads** | ✅ 有効 | スレッドの作成/返信 |
| **channels** | ✅ 有効 | チャンネルの作成/編集/削除 |
| **pins** | ✅ 有効 | メッセージのピン留め/ピン留め解除 |
| **search** | ✅ 有効 | メッセージの検索 |
| **memberInfo** | ✅ 有効 | メンバー情報のクエリ |
| **roleInfo** | ✅ 有効 | ロール一覧のクエリ |
| **roles** | ❌ **無効** | ロールの追加/削除 |
| **moderation** | ❌ **無効** | ブロック/キック/タイムアウト |

#### 特定の操作を無効化

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // チャンネル管理を無効化
        moderation: false,   // モデレーション操作を無効化
        roles: false         // ロール管理を無効化
      }
    }
  }
}
```

::: danger セキュリティ警告
`moderation`と`roles`操作を有効にする場合、AIに厳格なプロンプトとアクセス制御を設定し、誤ったユーザーブロックを避けてください。
:::

### その他の設定オプション

| 設定項目 | 説明 | デフォルト値 |
|--- | --- | ---|
| `historyLimit` | サーバーチャンネルのコンテキストに含める過去のメッセージ数 | 20 |
| `dmHistoryLimit` | DMセッションの過去メッセージ数 | 無制限 |
| `textChunkLimit` | 1メッセージあたりの最大文字数 | 2000 |
| `maxLinesPerMessage` | 1メッセージあたりの最大行数 | 17 |
| `mediaMaxMb` | アップロード可能なメディアファイルの最大サイズ（MB） | 8 |
| `chunkMode` | メッセージ分割モード（`length`/`newline`） | `length` |

---

## よくある問題

### ❌ "Used disallowed intents"エラー

**原因**：**Message Content Intent**が有効化されていない。

**解決策**：
1. Discord Developer Portalに戻る
2. Bot → Privileged Gateway Intents
3. **Message Content Intent**を有効化
4. Gatewayを再起動

### ❌ Botは接続しているが返信しない

**可能な原因**：
1. **Message Content Intent**がない
2. Botにチャンネル権限がない
3. 設定で@メンションが必要だが、メンションしていない
4. チャンネルがホワイトリストに含まれていない

**解決手順**：
```bash
# 診断ツールを実行
clawdbot doctor

# チャンネルの状態と権限を確認
clawdbot channels status --probe
```

### ❌ DMペアリングコードの有効期限切れ

**原因**：ペアリングコードの有効期限は**1時間**です。

**解決策**：ユーザーにDMを再送信させ、新しいペアリングコードを取得してから承認する。

### ❌ グループDMが無視される

**原因**：デフォルトで`dm.groupEnabled: false`になっている。

**解決策**：

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // オプション：特定のグループDMのみ許可
      }
    }
  }
}
```

---

## トラブルシューティング

### 一般的な問題診断

```bash
# 1. Gatewayが実行中か確認
clawdbot gateway status

# 2. チャンネル接続状態を確認
clawdbot channels status

# 3. 完全な診断を実行（推奨！）
clawdbot doctor
```

### ログデバッグ

Gatewayを起動時に`--verbose`を使用して詳細なログを表示：

```bash
clawdbot gateway --port 18789 --verbose
```

**注目すべきログ**：
- `Discord channel connected: ...` → 接続成功
- `Message received from ...` → メッセージ受信
- `ERROR: ...` → エラー情報

---

## 本講座のまとめ

- Discordチャンネルは**discord.js**経由で接続し、DMとサーバーチャンネルをサポート
- Bot作成には**アプリケーション、Botユーザー、Gateway Intents、招待URL**の4ステップが必要
- **Message Content Intent**は必須で、これがないとBotはメッセージを読み取れない
- デフォルトで**DMペアリング保護**が有効で、見知らぬユーザーはペアリングする必要がある
- サーバーチャンネルは`guilds.<id>.channels`を通じてホワイトリストと動作を設定可能
- AIはDiscordツールを呼び出して管理操作を実行可能（`actions`で制御可能）

---

## 次回の講座の予告

> 次回の講座では**[Google Chatチャンネル](../googlechat/)**について学びます。
>
> 学ぶこと：
> - Google Chat OAuth認証の設定方法
> - Google Chat Spaceでのメッセージルーティング
> - Google Chat APIの制限に対処する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>展開してソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Discord Bot設定Schema | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Discordオンボーディングウィザード | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Discordツール操作 | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Discordメッセージ操作 | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Discordサーバー操作 | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Discord公式ドキュメント | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**重要なSchemaフィールド**：
- `DiscordAccountSchema`：Discordアカウント設定（token、guilds、dm、actionsなど）
- `DiscordDmSchema`：DM設定（enabled、policy、allowFrom、groupEnabled）
- `DiscordGuildSchema`：サーバー設定（slug、requireMention、reactionNotifications、channels）
- `DiscordGuildChannelSchema`：チャンネル設定（allow、requireMention、skills、systemPrompt）

**重要な関数**：
- `handleDiscordAction()`：Discordツール操作処理エントリポイント
- `discordOnboardingAdapter.configure()`：ウィザード形式の設定フロー

</details>
