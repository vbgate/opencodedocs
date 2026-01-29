---
title: "最初のメッセージを送信：WebChat またはチャンネル経由で AI と会話 | Clawdbot チュートリアル"
sidebarTitle: "AI と会話を始める"
subtitle: "最初のメッセージを送信：WebChat またはチャンネル経由で AI と会話"
description: "WebChat インターフェースまたは設定したチャンネル（WhatsApp/Telegram/Slack/Discord など）を通じて Clawdbot AI アシスタントに最初のメッセージを送信する方法を学びます。本チュートリアルでは CLI コマンド、WebChat へのアクセス、チャンネル経由のメッセージ送信の 3 つの方法と、期待される結果、トラブルシューティングを紹介します。"
tags:
  - "入門"
  - "WebChat"
  - "チャンネル"
  - "メッセージ"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# 最初のメッセージを送信：WebChat またはチャンネル経由で AI と会話

## 本チュートリアル完了後にできること

本チュートリアルを完了すると、以下が可能になります：

- ✅ CLI を通じて AI アシスタントと会話する
- ✅ WebChat インターフェースを使用してメッセージを送信する
- ✅ 設定したチャンネル（WhatsApp、Telegram、Slack など）で AI と会話する
- ✅ メッセージ送信の期待される結果とステータスコードを理解する

## 現在の課題

あなたはおそらく Clawdbot のインストールと Gateway の起動を完了しましたが、すべてが正常に動作しているかどうかを確認する方法がわからないかもしれません。

以下のような疑問を持っているかもしれません：

- "Gateway が起動しましたが、メッセージに応答することをどう確認できますか？"
- "コマンドライン以外に、使用できるグラフィカルインターフェースはありますか？"
- "WhatsApp/Telegram を設定しましたが、これらのプラットフォームで AI とどう会話すればよいですか？"

良いお知らせがあります：**Clawdbot は最初のメッセージを送信する複数の方法を提供しています**。必ずあなたに合った方法があります。

## いつこの方法を使うか

以下の場合に使用します：

- 🧪 **インストールの検証**：Gateway と AI アシスタントが正常に動作していることを確認
- 🌐 **チャンネルのテスト**：WhatsApp/Telegram/Slack などのチャンネル接続が正常であることを確認
- 💬 **迅速な会話**：チャンネルアプリを開くことなく、CLI または WebChat を通じて直接 AI と交流
- 🔄 **応答の配信**：AI の応答を特定のチャンネルまたは連絡先に送信

---

## 🎒 開始前の準備

最初のメッセージを送信する前に、以下を確認してください：

### 必要条件

| 条件                     | 確認方法                                        |
| ---------------------- | ------------------------------------------- |
| **Gateway が起動済み**   | `clawdbot gateway status` またはプロセスが実行中か確認 |
| **AI モデルが設定済み** | `clawdbot models list` で利用可能なモデルがあるか確認      |
| **ポートがアクセス可能**       | 18789 ポート（またはカスタムポート）が使用中でないことを確認 |

::: warning 前提レッスン
本チュートリアルは、以下を完了していることを前提としています：
- [クイックスタート](../getting-started/) - Clawdbot のインストール、設定、起動
- [Gateway の起動](../gateway-startup/) - Gateway の異なる起動モードの理解

まだ完了していない場合は、先にこれらのレッスンに戻ってください。
:::

### オプション：チャンネルの設定

WhatsApp/Telegram/Slack などのチャンネルを通じてメッセージを送信したい場合は、まずチャンネルを設定する必要があります。

クイックチェック：

```bash
## 設定済みのチャンネルを表示
clawdbot channels list
```

空のリストが返されるか、使用したいチャンネルが不足している場合は、対応するチャンネルの設定チュートリアル（`platforms/` セクション）を参照してください。

---

## コアコンセプト

Clawdbot はメッセージを送信する 3 つの主要な方法をサポートしています：

```
┌─────────────────────────────────────────────────────────────┐
│              Clawdbot メッセージ送信方法                    │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  方法 1：CLI Agent 会話                                   │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → 結果を返す              │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方法 2：CLI を使用してチャンネルに直接メッセージ送信                          │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → チャンネル → メッセージ送信              │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方法 3：WebChat / 設定済みチャンネル                              │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   または         │ WhatsApp    │   │
│  │ ブラウザUI   │              │ Telegram    │ → Gateway → AI → チャンネルで返信 │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**主な違い**：

| 方法                     | AI を経由するか | 用途                           |
| ---------------------- | ----------- | ------------------------------ |
| `clawdbot agent`     | ✅ はい       | AI と会話し、返信と思考プロセスを取得    |
| `clawdbot message send` | ❌ いいえ       | チャンネルにメッセージを直接送信、AI を経由しない    |
| WebChat / チャンネル       | ✅ はい       | グラフィカルインターフェースを通じて AI と会話         |

::: info 適切な方法の選択
- **インストールの検証**：`clawdbot agent` または WebChat を使用
- **チャンネルのテスト**：WhatsApp/Telegram などのチャンネルアプリを使用
- **一括送信**：`clawdbot message send` を使用（AI を経由しない）
:::

---

## 手順に従って実行

### ステップ 1：CLI を通じて AI と会話

**理由**
CLI は最も高速な検証方法であり、ブラウザやチャンネルアプリを開く必要がありません。

#### 基本的な会話

```bash
## AI アシスタントにシンプルなメッセージを送信
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**表示されるはずの内容**：
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### 思考レベルの使用

Clawdbot は異なる思考レベルをサポートし、AI の「透明度」を制御できます：

```bash
## 高い思考レベル（完全な推論プロセスを表示）
clawdbot agent --message "Ship checklist" --thinking high

## 思考をオフ（最終的な回答のみ）
clawdbot agent --message "What's 2+2?" --thinking off
```

**表示されるはずの内容**（高い思考レベル）：
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**思考レベルのオプション**：

| レベル        | 説明                           | 適用シナリオ             |
| --------- | ------------------------------ | ------------------ |
| `off`     | 思考プロセスを表示しない               | シンプルな質問回答、迅速な応答 |
| `minimal` | 思考の出力を最小化              | デバッグ、プロセスの確認     |
| `low`     | 低い詳細度                     | 日常的な会話           |
| `medium`   | 中程度の詳細度                   | 複雑なタスク           |
| `high`     | 高い詳細度（完全な推論プロセスを含む） | 学習、コード生成     |

#### 受信チャンネルの指定

AI が返信をデフォルトチャンネルではなく特定のチャンネルに送信するようにできます：

```bash
## AI の返信を Telegram に送信させる
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip よく使われるパラメータ
- `--to <番号>`：受信者の E.164 番号を指定（特定の会話を作成するために使用）
- `--agent <id>`：特定の Agent ID を使用（デフォルトの main ではなく）
- `--session-id <id>`：新しい会話を作成せず、既存の会話を継続
- `--verbose on`：詳細なログ出力を有効化
- `--json`：JSON 形式で出力（スクリプト解析に適している）
:::

---

### ステップ 2：WebChat インターフェースを通じてメッセージを送信

**理由**
WebChat はブラウザ内のグラフィカルインターフェースを提供し、より直感的で、リッチテキストと添付ファイルをサポートします。

#### WebChat へアクセス

WebChat は Gateway の WebSocket サービスを使用し、**個別の設定や追加のポートは必要ありません**。

**アクセス方法**：

1. **ブラウザを開き、以下にアクセス**：`http://localhost:18789`
2. **またはターミナルで実行**：`clawdbot dashboard`（ブラウザを自動的に開く）

::: info WebChat ポート
WebChat は Gateway と同じポート（デフォルト 18789）を使用します。Gateway ポートを変更した場合、WebChat も同じポートを使用します。
:::

**表示されるはずの内容**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  こんにちは！私はあなたの AI アシスタントです。       │   │
│  │  何かお手伝いできることはありますか？        │   │
│  └───────────────────────────────────┘   │
│  [入力ボックス...                       │   │
│  [送信]                            │   │
└─────────────────────────────────────────────┘
```

#### メッセージの送信

1. 入力ボックスにメッセージを入力
2. 「送信」をクリックするか `Enter` キーを押す
3. AI の応答を待つ

**表示されるはずの内容**：
- AI の返信がチャットインターフェースに表示される
- 思考レベルが有効になっている場合、`[THINKING]` マークが表示される

**WebChat の機能**：

| 機能     | 説明                           |
| ------ | ------------------------------ |
| リッチテキスト   | Markdown 形式をサポート            |
| 添付ファイル     | 画像、音声、動画のアップロードをサポート    |
| 履歴 | 会話履歴を自動保存             |
| セッションの切り替え | 左側パネルで異なるセッションを切り替え         |

::: tip macOS メニューバーアプリ
Clawdbot macOS アプリをインストールしている場合、メニューバーの「Open WebChat」ボタンから WebChat を直接開くこともできます。
:::

---

### ステップ 3：設定済みチャンネルを通じてメッセージを送信

**理由**
チャンネル（WhatsApp、Telegram、Slack など）の接続が正常であることを検証し、実際のクロスプラットフォーム会話を体験します。

#### WhatsApp の例

オンボーディングまたは設定で WhatsApp を設定した場合：

1. **WhatsApp APP を開く**（モバイルまたはデスクトップ版）
2. **Clawdbot の番号を検索**（または保存済みの連絡先）
3. **メッセージを送信**：`Hello from WhatsApp!`

**表示されるはずの内容**：
```
[WhatsApp]
あなた → Clawdbot: Hello from WhatsApp!

Clawdbot → あなた: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram の例

Telegram Bot を設定した場合：

1. **Telegram APP を開く**
2. **Bot を検索**（ユーザー名を使用）
3. **メッセージを送信**：`/start` または `Hello from Telegram!`

**表示されるはずの内容**：
```
[Telegram]
あなた → @your_bot: /start

@your_bot → あなた: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord の例

Slack または Discord の場合：

1. **対応する APP を開く**
2. **Bot が存在するチャンネルまたはサーバーを見つける**
3. **メッセージを送信**：`Hello from Slack!`

**表示されるはずの内容**：
- Bot があなたのメッセージに返信
- メッセージの前に「AI Assistant」タグが表示される場合がある

::: info DM ペアリング保護
デフォルトで、Clawdbot は **DM ペアリング保護** を有効にしています：
- 未知の送信者はペアリングコードを受信
- ペアリングが承認されるまでメッセージは処理されません

チャンネルから初めてメッセージを送信する場合、以下が必要になることがあります：
```bash
## 承認待ちのペアリングリクエストを表示
clawdbot pairing list

## ペアリングリクエストを承認（<channel> と <code> を実際の値に置き換えてください）
clawdbot pairing approve <channel> <code>
```

詳細：[DM ペアリングとアクセス制御](../pairing-approval/)
:::

---

### ステップ 4（オプション）：チャンネルにメッセージを直接送信

**理由**
AI を経由せずにチャンネルにメッセージを直接送信します。一括通知、プッシュメッセージなどのシナリオに適しています。

#### テキストメッセージの送信

```bash
## テキストメッセージを WhatsApp に送信
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### 添付ファイル付きメッセージの送信

```bash
## 画像を送信
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## URL 画像を送信
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**表示されるはずの内容**：
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip message send よく使われるパラメータ
- `--channel`：チャンネルを指定（デフォルト：whatsapp）
- `--reply-to <id>`：指定したメッセージに返信
- `--thread-id <id>`：Telegram スレッド ID
- `--buttons <json>`：Telegram インラインボタン（JSON 形式）
- `--card <json>`：Adaptive Card（サポートされているチャンネル）
:::

---

## チェックポイント ✅

上記のステップを完了したら、以下ができるはずです：

- [ ] CLI を通じてメッセージを送信し、AI からの返信を受信
- [ ] WebChat インターフェースでメッセージを送信し、応答を確認
- [ ] （オプション）設定済みチャンネルでメッセージを送信し、AI からの返信を受信
- [ ] （オプション）`clawdbot message send` を使用してチャンネルにメッセージを直接送信

::: tip よくある問題

**Q: AI がメッセージに返信しない？**

A: 以下の点を確認してください：
1. Gateway が実行中か確認：`clawdbot gateway status`
2. AI モデルが設定されているか確認：`clawdbot models list`
3. 詳細なログを確認：`clawdbot agent --message "test" --verbose on`

**Q: WebChat が開かない？**

A: 以下を確認してください：
1. Gateway が実行中か確認
2. ポートが正しいか確認：デフォルト 18789
3. ブラウザが `http://127.0.0.1:18789` にアクセスしているか確認（`localhost` ではなく）

**Q: チャンネルメッセージの送信に失敗？**

A: 以下を確認してください：
1. チャンネルがログインしているか確認：`clawdbot channels status`
2. ネットワーク接続が正常か確認
3. チャンネル固有のエラーログを確認：`clawdbot gateway --verbose`
:::

---

## よくある落とし穴

### ❌ Gateway が起動していない

**誤った方法**：
```bash
clawdbot agent --message "Hello"
## エラー：Gateway connection failed
```

**正しい方法**：
```bash
## 最初に Gateway を起動
clawdbot gateway --port 18789

## 次にメッセージを送信
clawdbot agent --message "Hello"
```

::: warning Gateway を先に起動する必要があります
すべてのメッセージ送信方法（CLI、WebChat、チャンネル）は Gateway の WebSocket サービスに依存しています。Gateway が実行中であることを確認することが最初のステップです。
:::

### ❌ チャンネルがログインしていない

**誤った方法**：
```bash
## WhatsApp がログインしていない状態でメッセージを送信
clawdbot message send --target +15555550123 --message "Hi"
## エラー：WhatsApp not authenticated
```

**正しい方法**：
```bash
## 最初にチャンネルにログイン
clawdbot channels login whatsapp

## ステータスを確認
clawdbot channels status

## 次にメッセージを送信
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ DM ペアリングを忘れる

**誤った方法**：
```bash
## Telegram から初めてメッセージを送信したが、ペアリングを承認していない
## 結果：Bot はメッセージを受信するが処理しない
```

**正しい方法**：
```bash
## 1. 承認待ちのペアリングリクエストを表示
clawdbot pairing list

## 2. ペアリングを承認
clawdbot pairing approve telegram ABC123
## 3. メッセージを再送信

### 現在メッセージが処理され、AI からの返信が得られます
```

### ❌ agent と message send を混同

**誤った方法**：
```bash
## AI と会話したいが、message send を使用
clawdbot message send --target +15555550123 --message "Help me write code"
## 結果：メッセージはチャンネルに直接送信され、AI は処理しない
```

**正しい方法**：
```bash
## AI と会話：agent を使用
clawdbot agent --message "Help me write code" --to +15555550123

## メッセージを直接送信：message send を使用（AI を経由しない）
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## レッスンのまとめ

本レッスンで学んだこと：

1. ✅ **CLI Agent 会話**：`clawdbot agent --message` を通じて AI と交流し、思考レベルを制御
2. ✅ **WebChat インターフェース**：`http://localhost:18789` にアクセスしてグラフィカルインターフェースを使用してメッセージを送信
3. ✅ **チャンネルメッセージ**：WhatsApp、Telegram、Slack などの設定済みチャンネルで AI と会話
4. ✅ **直接送信**：`clawdbot message send` を使用して AI を回避してチャンネルにメッセージを直接送信
5. ✅ **トラブルシューティング**：一般的な失敗の原因と解決策を理解

**次のステップ**：

- [DM ペアリングとアクセス制御](../pairing-approval/)を学び、未知の送信者を安全に管理する方法を理解する
- [マルチチャンネルシステム概要](../../platforms/channels-overview/)を探索し、サポートされているすべてのチャンネルとその設定を理解する
- さらに多くのチャンネル（WhatsApp、Telegram、Slack、Discord など）を設定して、クロスプラットフォーム AI アシスタントを体験する

---

## 次のレッスンの予告

> 次のレッスンでは **[DM ペアリングとアクセス制御](../pairing-approval/)** を学びます。
>
> 学ぶ内容：
> - デフォルトの DM ペアリング保護メカニズムを理解する
> - 未知の送信者のペアリングリクエストを承認する方法
> - allowlist とセキュリティポリシーを設定する

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>ソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能                  | ファイルパス                                                                                             | 行番号    |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| CLI Agent コマンド登録  | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Agent CLI 実行        | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| CLI message send 登録 | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Gateway chat.send メソッド | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| WebChat 内部メッセージ処理 | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| メッセージチャンネルタイプ定義   | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| チャンネルレジストリ         | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | 全ファイル   |

**重要な定数**：
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：デフォルトのメッセージチャンネル（`src/channels/registry.js` から）
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 内部メッセージチャンネル（`src/utils/message-channel.ts` から）

**重要な関数**：
- `agentViaGatewayCommand()`：Gateway WebSocket を通じて agent メソッドを呼び出す（`src/commands/agent-via-gateway.ts`）
- `agentCliCommand()`：CLI agent コマンドエントリ、ローカルと Gateway モードをサポート（`src/commands/agent-via-gateway.ts`）
- `registerMessageSendCommand()`：`message send` コマンドを登録（`src/cli/program/message/register.send.ts`）
- `chat.send`：Gateway WebSocket メソッド、メッセージ送信リクエストを処理（`src/gateway/server-methods/chat.ts`）

</details>
