---
title: "LINEチャンネルの設定と使用 | Clawdbotチュートリアル"
sidebarTitle: "LINEでAIを使用する"
subtitle: "LINEチャンネルの設定と使用"
description: "ClawdbotのLINEチャンネルの設定と使用方法を学びます。本チュートリアルでは、LINE Messaging API統合、Webhook設定、アクセス制御、リッチメディアメッセージ（Flexテンプレート、クイックリプライ、Rich Menu）および一般的な問題のトラブルシューティング手法について説明します。"
tags:
  - "LINE"
  - "Messaging API"
  - "チャンネル設定"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINEチャンネルの設定と使用

## 学習完了後にできること

本チュートリアルを完了すると、以下のことができるようになります：

- ✅ LINE Messaging APIチャンネルを作成し、認証情報を取得する
- ✅ ClawdbotのLINEプラグインとWebhookを設定する
- ✅ DMペアリング、グループアクセス制御、メディア制限を設定する
- ✅ リッチメディアメッセージを送信する（Flexカード、クイックリプライ、位置情報）
- ✅ LINEチャンネルの一般的な問題をトラブルシューティングする

## 現在の課題

あなたは以下のようなことを考えているかもしれません：

- 「LINEでAIアシスタントと会話したい、どう統合すればいい？」
- 「LINE Messaging APIのWebhookはどう設定する？」
- 「LINEはFlexメッセージやクイックリプライをサポートしている？」
- 「LINEを通じてAIアシスタントにアクセスできるユーザーを制御したい」

良いニュース：**Clawdbotは完全なLINEプラグインを提供しており、Messaging APIのすべての主要機能をサポートしています**。

## この機能を使用するタイミング

以下のニーズがある場合：

- 📱 **LINE上で**AIアシスタントと対話したい
- 🎨 **リッチメディアメッセージを使用したい**（Flexカード、クイックリプライ、Rich Menu）
- 🔒 **アクセス権限を制御したい**（DMペアリング、グループホワイトリスト）
- 🌐 **LINEを既存のワークフローに統合したい**

## 基本的な仕組み

LINEチャンネルは**LINE Messaging API**を通じて統合され、Webhookを使用してイベントを受信しメッセージを送信します。

```
LINEユーザー
    │
    ▼ (メッセージ送信)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (AI呼び出し)
         ▼
     ┌────────┐
     │ Agent  │
     └───┬────┘
         │ (応答)
         ▼
     LINEユーザー
```

**重要な概念**：

| 概念 | 役割 |
|------|------|
| **Channel Access Token** | メッセージ送信用の認証トークン |
| **Channel Secret** | Webhook署名検証用の秘密鍵 |
| **Webhook URL** | ClawdbotがLINEイベントを受信するエンドポイント（HTTPS必須） |
| **DM Policy** | 不明な送信者のアクセスポリシー（pairing/allowlist/open/disabled） |
| **Rich Menu** | LINEの固定メニュー、ユーザーがクリックして素早く操作をトリガー |

## 🎒 開始前の準備

### 必要なアカウントとツール

| 項目 | 要件 | 取得方法 |
|------|------|----------|
| **LINE Developersアカウント** | 無料登録 | https://developers.line.biz/console/ |
| **LINE Provider** | ProviderとMessaging APIチャンネルの作成 | LINE Console |
| **HTTPSサーバー** | WebhookはHTTPS必須 | ngrok、Cloudflare Tunnel、Tailscale Serve/Funnel |

::: tip 推奨される公開方法
ローカル開発の場合、以下を使用できます：
- **ngrok**：`ngrok http 18789`
- **Tailscale Funnel**：`gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**：無料で安定
:::

## 実践ガイド

### ステップ1：LINEプラグインのインストール

**理由**
LINEチャンネルはプラグインで実装されており、先にインストールする必要があります。

```bash
clawdbot plugins install @clawdbot/line
```

**期待される出力**：
```
✓ Installed @clawdbot/line plugin
```

::: tip ローカル開発
ソースコードから実行している場合、ローカルインストールが可能です：
```bash
clawdbot plugins install ./extensions/line
```
:::

### ステップ2：LINE Messaging APIチャンネルの作成

**理由**
`Channel Access Token`と`Channel Secret`を取得してClawdbotを設定する必要があります。

#### 2.1 LINE Developers Consoleにログイン

アクセス：https://developers.line.biz/console/

#### 2.2 Providerの作成（まだの場合）

1. 「Create new provider」をクリック
2. Provider名を入力（例：`Clawdbot`）
3. 「Create」をクリック

#### 2.3 Messaging APIチャンネルの追加

1. Providerの下で「Add channel」→「Messaging API」を選択
2. チャンネル情報を設定：
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. 「Agree」にチェック→「Create」をクリック

#### 2.4 Webhookの有効化

1. チャンネル設定ページで「Messaging API」タブを見つける
2. 「Use webhook」スイッチをクリック→ONに設定
3. 以下の情報をコピー：

| 項目 | 場所 | 例 |
|------|------|------|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning 認証情報を安全に保管！
Channel Access TokenとChannel Secretは機密情報です。安全に保管し、公開リポジトリに漏らさないでください。
:::
### ステップ3：ClawdbotのLINEチャンネルの設定

**理由**
LINE Messaging APIを使用してメッセージを送受信するためにGatewayを設定します。

#### 方法A：コマンドラインで設定

```bash
clawdbot configure
```

ウィザードが以下を尋ねます：
- LINEチャンネルを有効にするか
- Channel Access Token
- Channel Secret
- DMポリシー（デフォルト `pairing`）

#### 方法B：設定ファイルを直接編集

`~/.clawdbot/clawdbot.json` を編集：

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip 環境変数の使用
環境変数でも設定可能（デフォルトアカウントのみ有効）：
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### 方法C：ファイルで認証情報を保存

より安全な方法は認証情報を別のファイルに保存することです：

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### ステップ4：Webhook URLの設定

**理由**
LINEはClawdbotにメッセージイベントをプッシュするためにWebhook URLを必要とします。

#### 4.1 Gatewayが外部からアクセス可能であることを確認

ローカル開発の場合、トンネルサービスを使用する必要があります：

```bash
# ngrokを使用
ngrok http 18789

# 出力にHTTPS URLが表示されます。例：
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 LINE ConsoleでWebhook URLを設定

1. Messaging API設定ページで「Webhook settings」を見つける
2. Webhook URLを入力：
   ```
   https://your-gateway-host/line/webhook
   ```
   - デフォルトパス：`/line/webhook`
   - `channels.line.webhookPath`でカスタマイズ可能
3. 「Verify」をクリック→LINEがGatewayにアクセスできることを確認

**期待される出力**：
```
✓ Webhook URL verification succeeded
```

#### 4.3 必要なイベントタイプを有効にする

Webhook settingsで以下のイベントにチェックを入れます：

| イベント | 用途 |
|------|------|
| **Message event** | ユーザーが送信したメッセージを受信 |
| **Follow event** | ユーザーがBotを友だち追加 |
| **Unfollow event** | ユーザーがBotを削除 |
| **Join event** | Botがグループに参加 |
| **Leave event** | Botがグループを退出 |
| **Postback event** | クイックリプライとボタンクリック |

### ステップ5：Gatewayの起動

**理由**
LINEのWebhookイベントを受信するためにGatewayを実行する必要があります。

```bash
clawdbot gateway --verbose
```

**期待される出力**：
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### ステップ6：LINEチャンネルのテスト

**理由**
設定が正しいか、AIアシスタントが正常に応答するかを検証します。

#### 6.1 Botを友だちに追加

1. LINE Console → Messaging API → Channel settings
2. 「Basic ID」または「QR Code」をコピー
3. LINEアプリで検索またはQRコードをスキャンしてBotを友だち追加

#### 6.2 テストメッセージを送信

LINEでBotにメッセージを送信：
```
こんにちは、今日の天気をまとめてください。
```

**期待される出力**：
- Botが「typing」状態を表示（typing indicatorsを設定している場合）
- AIアシスタントがストリームで応答を返す
- メッセージがLINEに正しく表示される

### ステップ7：DMペアリングの検証（オプション）

**理由**
デフォルトの `dmPolicy="pairing"` を使用している場合、不明な送信者は最初に承認される必要があります。

#### 承認待ちのペアリングリクエストを表示

```bash
clawdbot pairing list line
```

**期待される出力**：
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### ペアリングリクエストを承認

```bash
clawdbot pairing approve line ABC123
```

**期待される出力**：
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DMポリシーの説明
- `pairing`（デフォルト）：不明な送信者はペアリングコードを受け取り、承認されるまでメッセージは無視される
- `allowlist`：ホワイトリスト内のユーザーのみメッセージ送信を許可
- `open`：誰でもメッセージを送信可能（注意して使用）
- `disabled`：DMを無効化
:::
## チェックポイント ✅

設定が正しいか検証します：

| チェック項目 | 検証方法 | 期待される結果 |
|--------|----------|----------|
| **プラグインがインストール済み** | `clawdbot plugins list` | `@clawdbot/line` が表示される |
| **設定が有効** | `clawdbot doctor` | LINE関連のエラーがない |
| **Webhookが到達可能** | LINE Consoleでの検証 | `✓ Verification succeeded` |
| **Botがアクセス可能** | LINEで友だち追加してメッセージ送信 | AIアシスタントが正常に応答 |
| **ペアリングメカニズム** | 新規ユーザーでDM送信 | ペアリングコードを受信（pairingポリシー使用時） |

## よくある落とし穴

### よくある問題1：Webhook検証失敗

**症状**：
```
Webhook URL verification failed
```

**原因**：
- Webhook URLがHTTPSではない
- Gatewayが実行されていないかポートが正しくない
- ファイアウォールがインバウンド接続をブロックしている

**解決方法**：
1. HTTPSを使用していることを確認：`https://your-gateway-host/line/webhook`
2. Gatewayが実行中か確認：`clawdbot gateway status`
3. ポートを検証：`netstat -an | grep 18789`
4. トンネルサービスを使用する（ngrok/Tailscale/Cloudflare）

### よくある問題2：メッセージを受信できない

**症状**：
- Webhook検証は成功
- しかしBotにメッセージを送信しても応答なし

**原因**：
- Webhookパスの設定が間違っている
- イベントタイプが有効化されていない
- 設定ファイルの `channelSecret` が一致しない

**解決方法**：
1. `channels.line.webhookPath` がLINE Consoleと一致しているか確認
2. LINE Consoleで「Message event」が有効になっているか確認
3. `channelSecret` が正しくコピーされているか確認（余分なスペースなし）

### よくある問題3：メディアダウンロード失敗

**症状**：
```
Error downloading LINE media: size limit exceeded
```

**原因**：
- メディアファイルがデフォルト制限（10MB）を超えている

**解決方法**：
設定で制限を増やす：
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // LINE公式制限 25MB
    }
  }
}
```

### よくある問題4：グループメッセージに応答なし

**症状**：
- DMは正常
- グループでメッセージを送信しても応答なし

**原因**：
- デフォルト `groupPolicy="allowlist"`、グループがホワイトリストに追加されていない
- グループでBotを@mentionしていない

**解決方法**：
1. 設定にグループIDをホワイトリストに追加：
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. またはグループでBotを@mention：`@Clawdbot このタスクを処理してください`

## 高度な機能

### リッチメディアメッセージ（Flexテンプレートとクイックリプライ）

ClawdbotはLINEのリッチメディアメッセージをサポートしています。Flexカード、クイックリプライ、位置情報などが含まれます。

#### クイックリプライの送信

```json5
{
  text: "今日は何がお手伝いできますか？",
  channelData: {
    line: {
      quickReplies: ["天気を確認", "リマインダー設定", "コード生成"]
    }
  }
}
```

#### Flexカードの送信

```json5
{
  text: "ステータスカード",
  channelData: {
    line: {
      flexMessage: {
        altText: "サーバーステータス",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### 位置情報の送信

```json5
{
  text: "私のオフィスの場所です",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu（固定メニュー）

Rich MenuはLINEの固定メニューで、ユーザーはクリックして素早く操作をトリガーできます。

```bash
# Rich Menuの作成
clawdbot line rich-menu create

# メニュー画像のアップロード
clawdbot line rich-menu upload --image /path/to/menu.png

# デフォルトメニューに設定
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menuの制限
- 画像サイズ：2500x1686 または 2500x843 ピクセル
- 画像フォーマット：PNGまたはJPEG
- 最大10個のメニュー項目
:::

### Markdown変換

ClawdbotはMarkdownフォーマットをLINEがサポートするフォーマットに自動変換します：

| Markdown | LINE変換結果 |
|----------|---------------|
| コードブロック | Flexカード |
| 表 | Flexカード |
| リンク | 自動検出してFlexカードに変換 |
| 太字/斜体 | 削除される（LINEは非サポート） |

::: tip フォーマットの保持
LINEはMarkdownフォーマットをサポートしていないため、ClawdbotはFlexカードへの変換を試みます。プレーンテキストを希望する場合は、設定で自動変換を無効にできます。
:::
## まとめ

本チュートリアルでは以下を学びました：

1. ✅ LINEプラグインのインストール
2. ✅ LINE Messaging APIチャンネルの作成
3. ✅ Webhookと認証情報の設定
4. ✅ アクセス制御の設定（DMペアリング、グループホワイトリスト）
5. ✅ リッチメディアメッセージの送信（Flex、クイックリプライ、位置情報）
6. ✅ Rich Menuの使用
7. ✅ 一般的な問題のトラブルシューティング

LINEチャンネルは豊富なメッセージタイプとインタラクション方法を提供しており、LINE上でパーソナライズされたAIアシスタント体験を構築するのに最適です。

---

## 次のレッスンの予告

> 次のレッスンでは **[WebChatインターフェース](../webchat/)** を学習します。
>
> 学べること：
> - ブラウザ経由でWebChatインターフェースにアクセスする方法
> - WebChatの主要機能（セッション管理、ファイルアップロード、Markdownサポート）
> - リモートアクセスの設定（SSHトンネル、Tailscale）
> - WebChatと他のチャンネルの違いを理解する

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
|------|---------|------|
| LINE Botコア実装 | [`src/line/bot.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot.ts) | 27-83 |
| 設定スキーマ定義 | [`src/line/config-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Webhookイベントハンドラー | [`src/line/bot-handlers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| メッセージ送信機能 | [`src/line/send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/send.ts) | - |
| Flexテンプレート生成 | [`src/line/flex-templates.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/flex-templates.ts) | - |
| Rich Menu操作 | [`src/line/rich-menu.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/rich-menu.ts) | - |
| Templateメッセージ | [`src/line/template-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/template-messages.ts) | - |
| MarkdownからLINEへ変換 | [`src/line/markdown-to-line.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhookサーバー | [`src/line/webhook.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/webhook.ts) | - |

**主要な設定フィールド**：
- `channelAccessToken`: LINE Channel Access Token（`config-schema.ts:19`）
- `channelSecret`: LINE Channel Secret（`config-schema.ts:20`）
- `dmPolicy`: DMアクセスポリシー（`config-schema.ts:26`）
- `groupPolicy`: グループアクセスポリシー（`config-schema.ts:27`）
- `mediaMaxMb`: メディアサイズ制限（`config-schema.ts:28`）
- `webhookPath`: カスタムWebhookパス（`config-schema.ts:29`）

**主要な関数**：
- `createLineBot()`: LINE Botインスタンスの作成（`bot.ts:27`）
- `handleLineWebhookEvents()`: LINE Webhookイベントの処理（`bot-handlers.ts:100`）
- `sendMessageLine()`: LINEメッセージの送信（`send.ts`）
- `createFlexMessage()`: Flexメッセージの作成（`send.ts:20`）
- `createQuickReplyItems()`: クイックリプライの作成（`send.ts:21`）

**サポートされているDMポリシー**：
- `open`: オープンアクセス
- `allowlist`: ホワイトリストモード
- `pairing`: ペアリングモード（デフォルト）
- `disabled`: 無効

**サポートされているグループポリシー**：
- `open`: オープンアクセス
- `allowlist`: ホワイトリストモード（デフォルト）
- `disabled`: 無効

</details>
