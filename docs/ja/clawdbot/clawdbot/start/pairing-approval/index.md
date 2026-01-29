---
title: "DMペアリングとアクセス制御：あなたのAIアシスタントを保護する | Clawdbotチュートリアル"
sidebarTitle: "不明なユーザーのアクセスを管理"
subtitle: "DMペアリングとアクセス制御：あなたのAIアシスタントを保護する"
description: "ClawdbotのDMペアリング保護メカニズムを理解し、CLIを使用して不明な送信者のペアリング要求を承認する方法、保留中の要求を一覧表示する方法、許可リストを管理する方法を学びます。本チュートリアルでは、ペアリングフロー、CLIコマンドの使用、アクセスポリシーの設定、セキュリティベストプラクティスを完全に説明し、一般的なエラーのトラブルシューティングとdoctorコマンドを含みます。"
tags:
  - "入門"
  - "セキュリティ"
  - "ペアリング"
  - "アクセス制御"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DMペアリングとアクセス制御：あなたのAIアシスタントを保護する

## このチュートリアルで学べること

このチュートリアルを完了すると、以下のことができるようになります：

- ✅ デフォルトのDMペアリング保護メカニズムを理解する
- ✅ 不明な送信者のペアリング要求を承認する
- ✅ 保留中のペアリング要求を一覧表示・管理する
- ✅ 異なるDMアクセスポリシー（pairing/allowlist/open）を設定する
- ✅ doctorコマンドを実行してセキュリティ設定を確認する

## 現在直面している課題

WhatsAppやTelegramチャネルを設定し、AIアシスタントと対話したいが、以下の問題に直面しているかもしれません：

- 「なぜ見知らぬ人がメッセージを送ってきても、Clawdbotが返信しないのか？」
- 「ペアリングコードを受け取ったが、どういう意味か分からない」
- 「誰かの要求を承認したいが、どのコマンドを使えばよいか分からない」
- 「現在、誰が承認待ちかどう確認するか？」

朗報：**ClawdbotはデフォルトでDMペアリング保護を有効にしています**。これは、あなたが承認した送信者のみがAIアシスタントと対話できるようにするためです。

## いつこの機能を使うか

以下のニーズがある場合：

- 🛡 **プライバシー保護**：信頼できる人だけがAIアシスタントと対話できるようにする
- ✅ **不明なユーザーの承認**：新しい送信者がAIアシスタントにアクセスできるようにする
- 🔒 **厳格なアクセス制御**：特定のユーザーのアクセス権を制限する
- 📋 **一括管理**：保留中のすべてのペアリング要求を表示・管理する

---

## 核心概念

### DMペアリングとは？

Clawdbotは実際のメッセージプラットフォーム（WhatsApp、Telegram、Slackなど）に接続し、これらのプラットフォーム上の**DM（ダイレクトメッセージ）はデフォルトで信頼できない入力として扱われます**。

AIアシスタントを保護するために、Clawdbotは**ペアリングメカニズム**を提供しています：

::: info ペアリングフロー
1. 不明な送信者がメッセージを送信する
2. Clawdbotがその送信者が承認されていないことを検知する
3. Clawdbotが**ペアリングコード**（8文字）を返す
4. 送信者はペアリングコードをあなたに提供する必要がある
5. あなたはCLIを使用してそのコードを承認する
6. 送信者IDが許可リストに追加される
7. 送信者はAIアシスタントと通常通り対話できる
:::

### デフォルトのDMポリシー

**すべてのチャネルでデフォルトで `dmPolicy="pairing"` が使用されます**。これは以下を意味します：

| ポリシー | 動作 |
| ------ | ---- |
| `pairing` | 不明な送信者はペアリングコードを受け取り、メッセージは処理されない（デフォルト） |
| `allowlist` | `allowFrom` リスト内の送信者のみ許可 |
| `open` | すべての送信者を許可（明示的に `"*"` を設定する必要あり） |
| `disabled` | DM機能を完全に無効化 |

::: warning セキュリティリマインダー
デフォルトの `pairing` モードが最も安全な選択肢です。特別な要件がない限り、`open` モードに変更しないでください。
:::

---

## 🎒 始める前の準備

以下が完了していることを確認してください：

- [x] [クイックスタート](../getting-started/) チュートリアルを完了した
- [x] [Gatewayの起動](../gateway-startup/) チュートリアルを完了した
- [x] 少なくとも1つのメッセージチャネル（WhatsApp、Telegram、Slackなど）を設定した
- [x] Gatewayが実行中である

---

## 手順通り進める

### ステップ1：ペアリングコードの仕組みを理解する

不明な送信者があなたのClawdbotにメッセージを送信すると、以下のような返信を受け取ります：

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**ペアリングコードの主な特性**（出典：`src/pairing/pairing-store.ts`）：

- **8文字**：入力と記憶が簡単
- **大文字と数字**：混乱を防ぐ
- **紛らわしい文字を除外**：0、O、1、Iは含まない
- **1時間の有効期間**：経過すると自動的に失効
- **最大3つの保留中の要求を保持**：超過すると最も古い要求を自動的にクリア

### ステップ2：保留中のペアリング要求を一覧表示する

ターミナルで以下のコマンドを実行します：

```bash
clawdbot pairing list telegram
```

**以下が表示されるはずです**：

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

保留中の要求がない場合、以下が表示されます：

```
No pending telegram pairing requests.
```

::: tip 対応チャネル
ペアリング機能は以下のチャネルをサポートしています：
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### ステップ3：ペアリング要求を承認する

送信者から提供されたペアリングコードを使用してアクセスを承認します：

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**以下が表示されるはずです**：

```
✅ Approved telegram sender 123456789
```

::: info 承認後の効果
承認後、送信者ID（123456789）は自動的にそのチャネルの許可リストに追加され、以下の場所に保存されます：
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### ステップ4：送信者に通知する（オプション）

送信者に自動的に通知したい場合、`--notify` フラグを使用できます：

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

送信者は以下のメッセージを受け取ります（出典：`src/channels/plugins/pairing-message.ts`）：

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**注意**：`--notify` フラグはClawdbot Gatewayが実行中であり、そのチャネルがアクティブな状態であることを必要とします。

### ステップ5：送信者が正常に対話できることを確認する

送信者に再度メッセージを送信してもらうと、AIアシスタントが正常に返信するはずです。

---

## チェックポイント ✅

以下のチェックを完了して、設定が正しいことを確認してください：

- [ ] `clawdbot pairing list <channel>` を実行すると、保留中の要求が表示される
- [ ] `clawdbot pairing approve <channel> <code>` を使用して、正常に承認できる
- [ ] 承認された送信者がAIアシスタントと正常に対話できる
- [ ] ペアリングコードは1時間後に自動的に期限切れになる（再度メッセージを送信して確認可能）

---

## よくあるエラーと回避策

### エラー1：ペアリングコードが見つからない

**エラーメッセージ**：
```
No pending pairing request found for code: AB3D7X9K
```

**考えられる原因**：
- ペアリングコードが期限切れ（1時間経過）
- ペアリングコードの入力ミス（大文字小文字を確認）
- 送信者が実際にメッセージを送信していない（ペアリングコードはメッセージを受信した場合のみ生成される）

**解決方法**：
- 送信者に再度メッセージを送信してもらい、新しいペアリングコードを生成する
- ペアリングコードが正しくコピーされているか確認する（大文字小文字に注意）

### エラー2：チャネルがペアリングをサポートしていない

**エラーメッセージ**：
```
Channel xxx does not support pairing
```

**考えられる原因**：
- チャネル名のスペルミス
- そのチャネルはペアリング機能をサポートしていない

**解決方法**：
- `clawdbot pairing list` を実行して、サポートされているチャネルのリストを確認する
- 正しいチャネル名を使用する

### エラー3：通知に失敗した

**エラーメッセージ**：
```
Failed to notify requester: <error details>
```

**考えられる原因**：
- Gatewayが実行されていない
- チャネル接続が切断されている
- ネットワークの問題

**解決方法**：
- Gatewayが実行中であることを確認する
- チャネル接続状態を確認する：`clawdbot channels status`
- `--notify` フラグを使用せず、手動で送信者に通知する

---

## まとめ

このチュートリアルでは、ClawdbotのDMペアリング保護メカニズムについて学びました：

- **デフォルトで安全**：すべてのチャネルはデフォルトで `pairing` モードを使用し、AIアシスタントを保護します
- **ペアリングフロー**：不明な送信者は8文字のペアリングコードを受け取り、CLIを使用して承認する必要があります
- **管理コマンド**：
  - `clawdbot pairing list <channel>`：保留中の要求を一覧表示
  - `clawdbot pairing approve <channel> <code>`：ペアリングを承認
- **保存場所**：許可リストは `~/.clawdbot/credentials/<channel>-allowFrom.json` に保存されます
- **自動期限切れ**：ペアリング要求は1時間後に自動的に失効します

覚えておいてください：**ペアリングメカニズムはClawdbotのセキュリティの基盤**であり、承認したユーザーのみがAIアシスタントと対話できるようにします。

---

## 次回の予告

> 次のレッスンでは、**[トラブルシューティング：一般的な問題の解決](../../faq/troubleshooting/)** を学びます。
>
> 学べること：
> - 迅速な診断とシステム状態の確認
> - Gatewayの起動、チャネル接続、認証エラーなどの問題を解決する
> - ツール呼び出しの失敗とパフォーマンス最適化のトラブルシューティング方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| ペアリングコード生成（8文字、紛らわしい文字を除外） | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| ペアリング要求の保存とTTL（1時間） | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| ペアリング承認コマンド | [`src/cli/pairing-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| ペアリングコードメッセージ生成 | [`src/pairing/pairing-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| 許可リストの保存 | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| `pairing` をサポートするチャネルリスト | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| デフォルトのDMポリシー（pairing） | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**重要な定数**：
- `PAIRING_CODE_LENGTH = 8`：ペアリングコードの長さ
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`：ペアリングコードの文字セット（0O1Iを除外）
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`：ペアリング要求の有効期間（1時間）
- `PAIRING_PENDING_MAX = 3`：保留中の要求の最大数

**重要な関数**：
- `approveChannelPairingCode()`：ペアリングコードを承認し、許可リストに追加する
- `listChannelPairingRequests()`：保留中のペアリング要求を一覧表示する
- `upsertChannelPairingRequest()`：ペアリング要求を作成または更新する
- `addChannelAllowFromStoreEntry()`：許可リストに送信者を追加する

</details>
