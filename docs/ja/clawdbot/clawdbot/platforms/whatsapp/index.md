---
title: "WhatsApp チャンネル設定完全ガイド | Clawdbot チュートリアル"
sidebarTitle: "5 分で WhatsApp を接続"
subtitle: "WhatsApp チャンネル設定完全ガイド"
description: "Clawdbot で WhatsApp チャンネル（Baileys ベース）を設定・使用する方法を学びます。QR コードログイン、複数アカウント管理、DM アクセス制御、グループサポートを含みます。"
tags:
  - "whatsapp"
  - "チャンネル設定"
  - "baileys"
  - "qr-login"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# WhatsApp チャンネル設定完全ガイド

## 学んだ後、できること

- QR コードで WhatsApp アカウントを Clawdbot にリンクする
- 複数アカウントの WhatsApp サポートを設定する
- DM アクセス制御を設定する（ペアリング/ホワイトリスト/公開）
- WhatsApp グループサポートを有効化・管理する
- 自動メッセージ確認と既読通知を設定する

## 現在の課題

WhatsApp は最もよく使うメッセージングプラットフォームですが、AI アシスタントはまだ WhatsApp メッセージを受け取ることができません。あなたは以下を望んでいます：

- アプリを切り替えずに WhatsApp で直接 AI と対話する
- AI に誰がメッセージを送信できるかを制御する
- 複数の WhatsApp アカウントをサポートする（仕事/個人を分離）

## いつこの方法を使うか

- WhatsApp で AI アシスタントを統合する必要がある場合
- 仕事/個人用 WhatsApp アカウントを分離する必要がある場合
- AI に誰がメッセージを送信できるかを正確に制御したい場合

::: info Baileys とは？

Baileys は WhatsApp Web ライブラリであり、プログラムが WhatsApp Web プロトコル経由でメッセージを送受信できます。Clawdbot は Baileys を使用して WhatsApp に接続し、WhatsApp Business API を使用する必要がなく、よりプライベートで柔軟です。

:::

## 🎒 開始前の準備

WhatsApp チャンネルを設定する前に、以下を確認してください：

- [ ] Clawdbot Gateway をインストール・起動済み
- [ ] [クイックスタート](../../start/getting-started/)を完了済み
- [ ] 使用可能な電話番号がある（予備の番号を推奨）
- [ ] WhatsApp スマートフォンでネットにアクセスできる（QR コードスキャン用）

::: warning 注意事項

- **独立した番号の使用を推奨**：別の SIM カードまたは古いスマートフォンを使用し、個人の使用を妨げないようにしてください
- **仮想番号の回避**：TextNow、Google Voice などの仮想番号は WhatsApp でブロックされます
- **Node ランタイム**：WhatsApp と Telegram は Bun では不安定です。Node ≥22 を使用してください

:::

## 核心概念

WhatsApp チャンネルの核心アーキテクチャ：

```
あなたの WhatsApp 携帯 ←--(QR コード)--> Baileys ←--→ Clawdbot Gateway
                                                        ↓
                                                    AI Agent
                                                        ↓
                                                  メッセージ返信
```

**重要な概念**：

1. **Baileys セッション**：WhatsApp Linked Devices 経由で接続を確立
2. **DM ポリシー**：誰が AI にプライベートメッセージを送信できるかを制御
3. **複数アカウントサポート**：1 つの Gateway で複数の WhatsApp アカウントを管理
4. **メッセージ確認**：自動的に絵文字/既読通知を送信し、ユーザーエクスペリエンスを向上

## 手順を追って

### ステップ 1：基本設定を構成する

**なぜ必要か**
WhatsApp のアクセス制御ポリシーを設定し、AI アシスタントの悪用を防ぐためです。

`~/.clawdbot/clawdbot.json` を編集し、WhatsApp 設定を追加：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**フィールド説明**：

| フィールド | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| `dmPolicy` | string | `"pairing"` | DM アクセスポリシー：`pairing`（ペアリング）、`allowlist`（ホワイトリスト）、`open`（公開）、`disabled`（無効化） |
| `allowFrom` | string[] | `[]` | 送信者の電話番号リスト（E.164 形式、例：`+15551234567`） |

**DM ポリシーの比較**：

| ポリシー | 動作 | 適用シナリオ |
|--------|------|----------|
| `pairing` | 不明な送信者にはペアリングコードが送信され、手動で承認が必要 | **推奨**、セキュリティと利便性のバランス |
| `allowlist` | `allowFrom` リスト内の番号のみ許可 | 厳格な制御、既知のユーザー向け |
| `open` | 誰でも送信可能（`allowFrom` に `"*"` を含める必要あり） | 公開テストやコミュニティサービス |
| `disabled` | すべての WhatsApp メッセージを無視 | 一時的にチャンネルを無効化 |

**確認すべき点**：設定ファイルが正常に保存され、JSON 形式エラーがないこと。

### ステップ 2：WhatsApp にログインする

**なぜ必要か**
QR コードで WhatsApp アカウントを Clawdbot にリンクし、Baileys がセッション状態を維持するためです。

ターミナルで実行：

```bash
clawdbot channels login whatsapp
```

**複数アカウントログイン**：

特定のアカウントにログイン：

```bash
clawdbot channels login whatsapp --account work
```

デフォルトアカウントにログイン：

```bash
clawdbot channels login whatsapp
```

**操作手順**：

1. ターミナルに QR コードが表示される（または CLI インターフェースに表示）
2. WhatsApp スマートフォンアプリを開く
3. **Settings → Linked Devices** に移動
4. **Link a Device** をタップ
5. ターミナルに表示された QR コードをスキャン

**確認すべき点**：

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip 認証情報の保存

WhatsApp ログイン認証情報は `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json` に保存されます。初回ログイン後、次回の起動時にセッションが自動的に復元され、QR コードを再度スキャンする必要はありません。

:::

### ステップ 3：Gateway を起動する

**なぜ必要か**
Gateway を起動して WhatsApp チャンネルがメッセージの送受信を開始できるようにするためです。

```bash
clawdbot gateway
```

またはデーモンモードを使用：

```bash
clawdbot gateway start
```

**確認すべき点**：

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### ステップ 4：テストメッセージを送信する

**なぜ必要か**
WhatsApp チャンネルの設定が正しく、正常にメッセージを送受信できるかを確認するためです。

WhatsApp スマートフォンからリンクされた番号にメッセージを送信：

```
こんにちは
```

**確認すべき点**：
- ターミナルに受信メッセージのログが表示される
- WhatsApp で AI の返信を受け取る

**チェックポイント ✅**

- [ ] Gateway ログに `[WhatsApp] Received message from +15551234567` が表示される
- [ ] WhatsApp で AI の返信を受け取る
- [ ] 返信内容が入力に関連している

### ステップ 5：高度なオプションを設定する（オプション）

#### 自動メッセージ確認を有効化

`clawdbot.json` に追加：

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**フィールド説明**：

| フィールド | 型 | デフォルト値 | 説明 |
|------|------|--------|------|
| `emoji` | string | - | 確認絵文字（`"👀"`、`"✅"` など）、空文字列は無効化 |
| `direct` | boolean | `true` | ダイレクトメッセージで確認を送信するかどうか |
| `group` | string | `"mentions"` | グループでの動作：`"always"`（すべてのメッセージ）、`"mentions"`（@ メンションのみ）、`"never"`（送信しない） |

#### 既読通知を設定

デフォルトでは、Clawdbot はメッセージを自動的に既読としてマークします（青いチェック）。無効化する場合：

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### メッセージ制限を調整

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| フィールド | デフォルト値 | 説明 |
|------|--------|------|
| `textChunkLimit` | 4000 | 1 つのテキストメッセージの最大文字数 |
| `mediaMaxMb` | 50 | 受信するメディアファイルの最大サイズ（MB） |
| `chunkMode` | `"length"` | 分割モード：`"length"`（長さで分割）、`"newline"`（段落で分割） |

**確認すべき点**：設定が有効になると、長いメッセージが自動的に分割され、メディアファイルのサイズが制御されます。

## トラブルシューティング

### 問題 1：QR コードスキャン失敗

**症状**：QR コードをスキャンした後、ターミナルに接続失敗またはタイムアウトが表示される。

**原因**：ネットワーク接続の問題または WhatsApp サービスの不安定性。

**解決方法**：

1. スマートフォンのネットワーク接続を確認
2. Gateway サーバーがインターネットにアクセスできることを確認
3. ログアウトして再ログイン：
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### 問題 2：メッセージ未配信または遅延

**症状**：メッセージを送信した後、返信が来るまで時間がかかる。

**原因**：Gateway が実行されていないか、WhatsApp 接続が切断されている。

**解決方法**：

1. Gateway の状態を確認：`clawdbot gateway status`
2. Gateway を再起動：`clawdbot gateway restart`
3. ログを確認：`clawdbot logs --follow`

### 問題 3：ペアリングコードが届かない

**症状**：見知らぬ人からメッセージが送られてきたが、ペアリングコードが届かない。

**原因**：`dmPolicy` が `pairing` に設定されていない。

**解決方法**：

`clawdbot.json` 内の `dmPolicy` 設定を確認：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← "pairing" であることを確認
    }
  }
}
```

### 問題 4：Bun ランタイムの問題

**症状**：WhatsApp と Telegram が頻繁に切断されるか、ログインに失敗する。

**原因**：Baileys と Telegram SDK は Bun では不安定。

**解決方法**：

Node ≥22 で Gateway を実行：

現在のランタイムを確認：

```bash
node --version
```

切り替えが必要な場合、Node で Gateway を実行：

```bash
clawdbot gateway --runtime node
```

::: tip 推奨ランタイム

WhatsApp と Telegram チャンネルは Node ランタイムの使用を強く推奨します。Bun を使用すると接続が不安定になる可能性があります。

:::

## まとめ

WhatsApp チャンネル設定の要点：

1. **基本設定**：`dmPolicy` + `allowFrom` でアクセスを制御
2. **ログインプロセス**：`clawdbot channels login whatsapp` で QR コードをスキャン
3. **複数アカウント**：`--account` パラメータで複数の WhatsApp アカウントを管理
4. **高度なオプション**：自動メッセージ確認、既読通知、メッセージ制限
5. **トラブルシューティング**：Gateway の状態、ログ、ランタイムを確認

## 次回の予告

> 次回のレッスンでは **[Telegram チャンネル](../telegram/)** 設定を学びます。
>
> 学ぶこと：
> - Bot Token を使用して Telegram Bot を設定
> - コマンドとインラインクエリを設定
> - Telegram 固有のセキュリティポリシーを管理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
|------|----------|------|
| WhatsApp 設定型定義 | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| WhatsApp 設定 Schema | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| WhatsApp オンボーディング設定 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| WhatsApp ドキュメント | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| WhatsApp ログインツール | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| WhatsApp Actions ツール | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**重要な設定項目**：
- `dmPolicy`: DM アクセスポリシー（`pairing`/`allowlist`/`open`/`disabled`）
- `allowFrom`: 許可された送信者リスト（E.164 形式の電話番号）
- `ackReaction`: 自動メッセージ確認設定（`{emoji, direct, group}`）
- `sendReadReceipts`: 既読通知を送信するかどうか（デフォルト `true`）
- `textChunkLimit`: テキスト分割制限（デフォルト 4000 文字）
- `mediaMaxMb`: メディアファイルサイズ制限（デフォルト 50 MB）

**重要な関数**：
- `loginWeb()`: WhatsApp QR コードログインを実行
- `startWebLoginWithQr()`: QR コード生成プロセスを開始
- `sendReactionWhatsApp()`: WhatsApp のリアクションを送信
- `handleWhatsAppAction()`: WhatsApp 固有の操作を処理（リアクションなど）

**重要な定数**：
- `DEFAULT_ACCOUNT_ID`: デフォルトアカウント ID（`"default"`）
- `creds.json`: WhatsApp 認証認証情報保存パス

</details>
