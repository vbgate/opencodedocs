---
title: "iOS ノード設定：Gateway と Canvas Voice Wake の接続 | Clawdbot チュートリアル"
sidebarTitle: "AI に iPhone を使わせる"
subtitle: "iOS ノード設定ガイド"
description: "iOS ノードを Gateway に接続する方法を学びます。カメラでの撮影、Canvas 可視化インターフェース、Voice Wake 音声ウェイク、Talk Mode 連続会話、位置情報取得などのデバイスローカル操作機能を使用します。Bonjour と Tailscale による自動ディスカバリー、ペアリング認証とセキュリティ制御を経て、マルチデバイス AI 協調を実現し、フォアグラウンド/バックグラウンドと権限管理をサポートします。"
tags:
  - "iOS ノード"
  - "デバイスノード"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# iOS ノード設定ガイド

## 学習完了後にできること

iOS ノードを設定すると、以下のことができるようになります：

- ✅ AI アシスタントが iOS デバイスのカメラを呼び出して写真を撮影または動画を録画できる
- ✅ iOS デバイス上で Canvas 可視化インターフェースをレンダリングできる
- ✅ Voice Wake と Talk Mode を使用して音声対話できる
- ✅ iOS デバイスの位置情報を取得できる
- ✅ Gateway を通じて複数のデバイスノードを統一管理できる

## 現在の課題

あなたは自分の iOS デバイス上で AI アシスタントの能力を拡張し、次のことを実現したいと考えています：

- **カメラを呼び出して写真を撮影または動画を録画する**：「写真を撮って」と言うと、AI が自動的に iPhone で写真を撮る
- **可視化インターフェースを表示する**：iPhone 上で AI が生成したグラフ、フォーム、またはコントロールパネルを表示する
- **音声ウェイクと連続会話**：手動で操作することなく、直接「Clawd」と言うだけでアシスタントを起動して会話を開始する
- **デバイス情報を取得する**：AI に自分の位置情報、画面ステータスなどの情報を知らせる

## この機能を使用するタイミング

- **モバイルシーン**：AI が iPhone のカメラ、画面などの能力を使用できるようにしたい場合
- **マルチデバイス協調**：Gateway はサーバー上で実行されているが、ローカルデバイス機能を呼び出す必要がある場合
- **音声対話**：iPhone をポータブルな音声アシスタント端末として使用したい場合

::: info iOS ノードとは？
iOS ノードは iPhone/iPad 上で実行される Companion アプリで、WebSocket 経由で Clawdbot Gateway に接続します。Gateway 本体ではなく、「周辺機器」としてデバイスのローカル操作機能を提供します。

**Gateway との違い**：
- **Gateway**：サーバー/macOS 上で実行され、メッセージルーティング、AI モデル呼び出し、ツール配信を担当
- **iOS ノード**：iPhone 上で実行され、デバイスのローカル操作（カメラ、Canvas、位置情報など）を実行
:::

---

## 🎒 開始前の準備

::: warning 前提条件

開始前に、以下を確認してください：

1. **Gateway が起動し実行されていること**
   - Gateway が別のデバイス（macOS、Linux、または WSL2 経由の Windows）上で実行されていること
   - Gateway がアクセス可能なネットワークアドレスにバインドされていること（ローカルネットワークまたは Tailscale）

2. **ネットワーク接続性**
   - iOS デバイスと Gateway が同じローカルネットワーク上にあること（推奨）、または Tailscale 経由で接続されていること
   - iOS デバイスが Gateway の IP アドレスとポートにアクセスできること（デフォルト：18789）

3. **iOS アプリの入手**
   - iOS アプリは現在**内部プレビュー版**で、公開配布されていません
   - ソースコードからビルドするか、TestFlight テスト版を入手する必要があります
:::

## コアコンセプト

iOS ノードのワークフロー：

```
[Gateway] ←→ [iOS ノード]
      ↓            ↓
   [AI モデル]   [デバイス能力]
      ↓            ↓
   [意思決定実行]   [カメラ/Canvas/音声]
```

**主要な技術ポイント**：

1. **自動ディスカバリー**：Bonjour（ローカルネットワーク）または Tailscale（クロスネットワーク）経由で Gateway を自動発見
2. **ペアリング認証**：初回接続時に Gateway 側で手動承認が必要で、信頼関係を確立
3. **プロトコル通信**：WebSocket プロトコル（`node.invoke`）を使用してコマンドを送信
4. **権限制御**：デバイスローカルコマンドにはユーザー認証が必要（カメラ、位置情報など）

**アーキテクチャの特徴**：

- **セキュリティ**：すべてのデバイス操作には iOS 側での明示的なユーザー認可が必要
- **分離性**：ノードは Gateway を実行せず、ローカル操作のみを実行
- **柔軟性**：フォアグラウンド、バックグラウンド、リモートなど複数の使用シーンをサポート

---

## 一緒に進めよう

### ステップ 1：Gateway を起動する

Gateway ホスト上でサービスを起動します：

```bash
clawdbot gateway --port 18789
```

**以下が表示されるはずです**：

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip クロスネットワークアクセス
Gateway と iOS デバイスが同じローカルネットワーク上にない場合、**Tailscale Serve/Funnel** を使用します：

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

iOS デバイスは Tailscale 経由で Gateway を自動発見します。
:::

### ステップ 2：iOS アプリで接続する

iOS アプリで：

1. **Settings**（設定）を開く
2. **Gateway** セクションを見つける
3. 自動発見された Gateway を選択する（または下部で **Manual Host** を有効にして、手動でホストとポートを入力）

**以下が表示されるはずです**：

- アプリが Gateway に接続しようとする
- ステータスが "Connected" または "Pairing pending" と表示される

::: details 手動でホストを設定する

自動発見に失敗した場合、Gateway アドレスを手動で入力します：

1. **Manual Host** を有効にする
2. Gateway ホストを入力する（例：`192.168.1.100`）
3. ポートを入力する（デフォルト：`18789`）
4. "Connect" をクリックする

:::

### ステップ 3：ペアリングリクエストを承認する

**Gateway ホスト上で**、iOS ノードのペアリングリクエストを承認します：

```bash
# 承認待ちのノードを確認
clawdbot nodes pending

# 特定のノードを承認する（<requestId> を置換）
clawdbot nodes approve <requestId>
```

**以下が表示されるはずです**：

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip ペアリングを拒否する
特定のノードの接続リクエストを拒否する場合：

```bash
clawdbot nodes reject <requestId>
```

:::

**チェックポイント ✅**：Gateway 上でノードステータスを確認します

```bash
clawdbot nodes status
```

iOS ノードが `paired` ステータスで表示されるはずです。

### ステップ 4：ノード接続をテストする

**Gateway からノード通信をテストします**：

```bash
# Gateway 経由でノードコマンドを呼び出す
clawdbot gateway call node.list --params "{}"
```

**以下が表示されるはずです**：

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## ノード機能の使用

### カメラで写真を撮る

iOS ノードはカメラでの写真撮影と動画録画をサポートしています：

```bash
# 写真を撮影する（デフォルト：前面カメラ）
clawdbot nodes camera snap --node "iPhone (iOS)"

# 写真を撮影する（背面カメラ、カスタム解像度）
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# 動画を録画する（5秒）
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**以下が表示されるはずです**：

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning フォアグラウンド要件
カメラコマンドは iOS アプリが**フォアグラウンド**である必要があります。アプリがバックグラウンドの場合、`NODE_BACKGROUND_UNAVAILABLE` エラーが返されます。

:::

**iOS カメラパラメータ**：

| パラメータ | タイプ | デフォルト値 | 説明 |
|--- | --- | --- | ---|
| `facing` | `front\|back` | `front` | カメラの向き |
| `maxWidth` | number | `1600` | 最大幅（ピクセル） |
| `quality` | `0..1` | `0.9` | JPEG 品質（0-1） |
| `durationMs` | number | `3000` | 動画時間（ミリ秒） |
| `includeAudio` | boolean | `true` | 音声を含めるかどうか |

### Canvas 可視化インターフェース

iOS ノードは Canvas 可視化インターフェースを表示できます：

```bash
# URL にナビゲートする
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# JavaScript を実行する
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# スクリーンショットを撮る（JPEG として保存）
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**以下が表示されるはずです**：

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI 自動プッシュ
Gateway が `canvasHost` を設定している場合、iOS ノードは接続時に自動的に A2UI インターフェースにナビゲートします。
:::

### Voice Wake 音声ウェイク

iOS アプリの **Settings** で Voice Wake を有効にします：

1. **Voice Wake** スイッチをオンにする
2. ウェイクワードを設定する（デフォルト："clawd"、"claude"、"computer"）
3. iOS でマイク権限が付与されていることを確認する

::: info グローバルウェイクワード
Clawdbot のウェイクワードは**グローバル設定**で、Gateway によって管理されます。すべてのノード（iOS、Android、macOS）が同じウェイクワードリストを使用します。

ウェイクワードを変更すると、すべてのデバイスに自動的に同期されます。
:::

### Talk Mode 連続会話

Talk Mode を有効にすると、AI は TTS を通じて返信を継続的に読み上げ、音声入力を継続的に監視します：

1. iOS アプリの **Settings** で **Talk Mode** を有効にする
2. AI の返信時に自動的に読み上げが行われる
3. 音声を通じて継続的に会話でき、手動でクリックする必要がない

::: warning バックグラウンドの制限
iOS はバックグラウンドオーディオを一時停止する場合があります。アプリがフォアグラウンドにない場合、音声機能は**ベストエフォート**（尽力型）です。
:::

---

## よくある問題

### ペアリングプロンプトが表示されない

**問題**：iOS アプリが "Connected" と表示されているが、Gateway にペアリングプロンプトが表示されない。

**解決策**：

```bash
# 1. 手動で承認待ちノードを確認
clawdbot nodes pending

# 2. ノードを承認する
clawdbot nodes approve <requestId>

# 3. 接続を確認する
clawdbot nodes status
```

### 接続に失敗する（再インストール後）

**問題**：iOS アプリを再インストールした後、Gateway に接続できない。

**原因**：Keychain のペアリングトークンが削除された。

**解決策**：ペアリングフローを再度実行する（ステップ 3）。

### A2UI_HOST_NOT_CONFIGURED

**問題**：Canvas コマンドが失敗し、`A2UI_HOST_NOT_CONFIGURED` と表示される。

**原因**：Gateway が `canvasHost` URL を設定していない。

**解決策**：

Gateway 設定で Canvas ホストを設定します：

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**問題**：カメラ/Canvas コマンドが失敗し、`NODE_BACKGROUND_UNAVAILABLE` が返される。

**原因**：iOS アプリがフォアグラウンドにない。

**解決策**：iOS アプリをフォアグラウンドに切り替え、コマンドを再試行します。

---

## このレッスンのまとめ

このレッスンで学んだこと：

✅ iOS ノードの概念とアーキテクチャ
✅ Gateway への自動ディスカバリーと接続方法
✅ ペアリング認証フロー
✅ カメラ、Canvas、Voice Wake などの機能の使用方法
✅ よくある問題のトラブルシューティング方法

**重要なポイント**：

- iOS ノードはデバイスのローカル操作機能の提供者であり、Gateway ではない
- すべてのデバイス操作にはユーザー認可とフォアグラウンドステータスが必要
- ペアリングはセキュリティの必須ステップで、承認されたノードのみが信頼される
- Voice Wake と Talk Mode にはマイク権限が必要

## 次のレッスンの予告

> 次のレッスンでは **[Android ノード](../android-node/)** を学習します。
>
> 学ぶ内容：
> - Android ノードを Gateway に接続する方法
> - Android デバイスのカメラ、画面録画、Canvas 機能の使用
> - Android 固有の権限と互換性問題の処理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| iOS アプリエントリー | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas レンダリング | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway 接続 | [`apps/ios/Sources/Gateway/`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/Gateway/) | - |
| ノードプロトコル runner | [`src/node-host/runner.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| ノード設定 | [`src/node-host/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS プラットフォームドキュメント | [`docs/platforms/ios.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/ios.md) | 1-105 |
| ノードシステムドキュメント | [`docs/nodes/index.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md) | 1-306 |

**重要な定数**：
- `GATEWAY_DEFAULT_PORT = 18789`：Gateway デフォルトポート
- `NODE_ROLE = "node"`：ノード接続のロール識別子

**重要なコマンド**：
- `clawdbot nodes pending`：承認待ちノードを一覧表示
- `clawdbot nodes approve <requestId>`：ノードペアリングを承認
- `clawdbot nodes invoke --node <id> --command <cmd>`：ノードコマンドを呼び出す
- `clawdbot nodes camera snap --node <id>`：写真を撮る
- `clawdbot nodes canvas navigate --node <id> --target <url>`：Canvas をナビゲートする

**プロトコルメソッド**：
- `node.invoke.request`：ノードコマンド呼び出しリクエスト
- `node.invoke.result`：ノードコマンド実行結果
- `voicewake.get`：ウェイクワードリストを取得
- `voicewake.set`：ウェイクワードリストを設定
- `voicewake.changed`：ウェイクワード変更イベント

</details>
