---
title: "WebChat インターフェース：ブラウザ内の AI アシスタント | Clawdbot チュートリアル"
sidebarTitle: "Web 版 AI を試す"
subtitle: "WebChat インターフェース：ブラウザ内の AI アシスタント"
description: "Clawdbot の WebChat インターフェースを使用して AI アシスタントと対話する方法を学びます。このチュートリアルでは、WebChat のアクセス方法、コア機能（セッション管理、添付ファイルアップロード、Markdown サポート）、リモートアクセス設定（SSH トンネル、Tailscale）を紹介します。追加のポートや設定は不要です。"
tags:
  - "WebChat"
  - "ブラウザインターフェース"
  - "チャット"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat インターフェース：ブラウザ内の AI アシスタント

## このチュートリアルで学べること

このチュートリアルを完了すると、以下のことができるようになります：

- ✅ ブラウザ経由で WebChat インターフェースにアクセスする
- ✅ WebChat でメッセージを送信し、AI の応答を受け取る
- ✅ セッション履歴を管理し、セッションを切り替える
- ✅ 添付ファイル（画像、音声、動画）をアップロードする
- ✅ リモートアクセスを設定する（Tailscale/SSH トンネル）
- ✅ WebChat と他のチャンネルの違いを理解する

## あなたの悩み

既に Gateway を起動しているかもしれませんが、コマンドラインだけでなく、より直感的なグラフィカルインターフェースで AI アシスタントと対話したいと考えているかもしれません。

次のような疑問があるかもしれません：

- "ChatGPT のような Web インターフェースはないの？"
- "WebChat と WhatsApp/Telegram チャンネルの違いは何？"
- "WebChat に別途設定は必要？"
- "リモートサーバーで WebChat を使うにはどうすればいい？"

良いニュースです：**WebChat は Clawdbot に組み込まれたチャットインターフェース**で、別途インストールや設定不要で、Gateway を起動するだけで使用できます。

## この機能を使う場面

以下の場合に使用します：

- 🖥️ **グラフィカルインターフェースでの対話**：コマンドラインではなく、ブラウザ内のチャット体験を好む場合
- 📊 **セッション管理**：履歴を表示し、異なるセッションを切り替える場合
- 🌐 **ローカルアクセス**：同じデバイスで AI と対話する場合
- 🔄 **リモートアクセス**：SSH/Tailscale トンネル経由でリモート Gateway にアクセスする場合
- 💬 **リッチテキスト対話**：Markdown 形式と添付ファイルをサポートする場合

---

## 🎒 開始前の準備

WebChat を使用する前に、以下を確認してください：

### 必須条件

| 条件                     | 確認方法                                        |
| ---------------------- | ------------------------------------------- |
| **Gateway が起動している**   | `clawdbot gateway status` またはプロセスが実行中か確認 |
| **ポートにアクセス可能**       | ポート 18789（またはカスタムポート）が使用されていないことを確認 |
| **AI モデルが設定されている** | `clawdbot models list` で利用可能なモデルがあるか確認      |

::: warning 前提チュートリアル
このチュートリアルでは、以下を完了していることを前提としています：
- [クイックスタート](../../start/getting-started/) - Clawdbot のインストール、設定、起動
- [Gateway の起動](../../start/gateway-startup/) - Gateway の異なる起動モードの理解

まだ完了していない場合は、先にこれらのチュートリアルに戻ってください。
:::

### オプション：認証の設定

WebChat はデフォルトで認証が必要です（ローカルアクセスでも）。これはあなたの AI アシスタントを保護するためです。

簡単な確認：

```bash
## 現在の認証設定を確認
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

設定されていない場合は、先に設定することをお勧めします：

```bash
## token 認証を設定（推奨）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

詳細な説明：[Gateway 認証設定](../../advanced/security-sandbox/)。

---

## コア概念

### WebChat とは

**WebChat** は Clawdbot に組み込まれたチャットインターフェースで、Gateway WebSocket を通じて AI アシスタントと直接対話します。

**主な特徴**：

```
┌─────────────────────────────────────────────────────┐
│              WebChat アーキテクチャ                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ブラウザ/クライアント                                │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → メッセージ処理          │
│      ├─ chat.history → セッション履歴を返す         │
│      ├─ chat.inject → システムノートを追加          │
│      └─ イベントストリーム → リアルタイム更新        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**他のチャンネルとの違い**：

| 特性         | WebChat                          | WhatsApp/Telegram など                |
| ------------ | -------------------------------- | ------------------------------ |
| **アクセス方法** | ブラウザから直接 Gateway にアクセス    | サードパーティ APP とログインが必要         |
| **設定要件** | 別途設定不要、Gateway ポートを共有   | チャンネル固有の API Key/Token が必要  |
| **返信ルーティング** | WebChat に決定論的にルーティング   | 対応するチャンネルにルーティング        |
| **リモートアクセス** | SSH/Tailscale トンネル経由       | チャンネルプラットフォームが提供        |
| **セッションモデル** | Gateway のセッション管理を使用     | Gateway のセッション管理を使用        |

### WebChat の動作原理

WebChat は個別の HTTP サーバーやポート設定を必要とせず、Gateway の WebSocket サービスを直接使用します。

**重要ポイント**：
- **共有ポート**：WebChat は Gateway と同じポートを使用します（デフォルト 18789）
- **追加設定不要**：`webchat.*` 設定ブロックはありません
- **リアルタイム同期**：履歴は Gateway からリアルタイムに取得され、ローカルにはキャッシュされません
- **読み取り専用モード**：Gateway に到達できない場合、WebChat は読み取り専用になります

::: info WebChat vs コントロール UI
WebChat はチャット体験に特化しており、**Control UI** は完全な Gateway コントロールパネル（設定、セッション管理、スキル管理など）を提供します。

- WebChat：`http://localhost:18789/chat` または macOS アプリのチャットビュー
- Control UI：`http://localhost:18789/` 完全なコントロールパネル
:::

---

## 実践してみよう

### ステップ 1：WebChat にアクセスする

**なぜ必要か**
WebChat は Gateway に組み込まれたチャットインターフェースで、追加のソフトウェアをインストールする必要はありません。

#### 方法 1：ブラウザでアクセス

ブラウザを開き、以下にアクセスします：

```bash
## デフォルトアドレス（デフォルトポート 18789 使用）
http://localhost:18789

## またはループバックアドレスを使用（より信頼性が高い）
http://127.0.0.1:18789
```

**次のような画面が表示されるはずです**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [セッションリスト]  [設定]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  こんにちは！私はあなたの AI 助手です。   │   │
│  │  何かお手伝いできることはありますか？        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [メッセージを入力...]                  [送信]   │
└─────────────────────────────────────────────┘
```

#### 方法 2：macOS アプリ

Clawdbot macOS メニューバーアプリをインストールしている場合：

1. メニューバーのアイコンをクリック
2. "Open WebChat" を選択するか、チャットアイコンをクリック
3. WebChat が別ウィンドウで開きます

**メリット**：
- ネイティブ macOS 体験
- ショートカットキー対応
- Voice Wake と Talk Mode との統合

#### 方法 3：コマンドラインのショートカット

```bash
## WebChat をブラウザで自動的に開く
clawdbot web
```

**次のようになるはずです**：デフォルトブラウザが自動的に開き、`http://localhost:18789` に移動します

---

### ステップ 2：最初のメッセージを送信する

**なぜ必要か**
WebChat と Gateway の接続が正常であることを検証し、AI アシスタントが正しく応答できることを確認します。

1. 入力ボックスに最初のメッセージを入力
2. "送信" ボタンをクリックするか、`Enter` キーを押す
3. チャットインターフェースの応答を観察

**メッセージの例**：
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**次のような画面が表示されるはずです**：
```
┌─────────────────────────────────────────────┐
│  あなた → AI: Hello! I'm testing...      │
│                                             │
│  AI → あなた: こんにちは！私は Clawdbot AI    │
│  助手です。質問への回答、コードの作成、     │
│  タスクの管理などをサポートできます。      │
│  何かお手伝いできることはありますか？          │
│                                             │
│  [メッセージを入力...]                  [送信]   │
└─────────────────────────────────────────────┘
```

::: tip 認証のヒント
Gateway で認証が設定されている場合、WebChat にアクセスすると token またはパスワードの入力を求められます：

```
┌─────────────────────────────────────────────┐
│          Gateway 認証                     │
│                                             │
│  Token を入力してください:                     │
│  [•••••••••••••]              │
│                                             │
│              [キャンセル]  [ログイン]       │
└─────────────────────────────────────────────┘
```

設定した `gateway.auth.token` または `gateway.auth.password` を入力してください。
:::

---

### ステップ 3：WebChat の機能を使用する

**なぜ必要か**
WebChat は豊富な対話機能を提供しており、これらの機能に慣れることで使用体験が向上します。

#### セッション管理

WebChat はマルチセッション管理をサポートしており、異なるコンテキストで AI と対話できます。

**操作手順**：

1. 左側のセッションリストをクリック（または "新しいセッション" ボタン）
2. セッションを選択または新規作成
3. 新しいセッションで対話を継続

**セッションの特徴**：
- ✅ 独立したコンテキスト：各セッションのメッセージ履歴は分離されています
- ✅ 自動保存：すべてのセッションは Gateway によって管理され、永続化されます
- ✅ クロスプラットフォーム同期：CLI、macOS アプリ、iOS/Android ノードと同じセッションデータを共有

::: info メインセッション
WebChat はデフォルトで Gateway の **メインセッションキー**（`main`）を使用します。これはすべてのクライアント（CLI、WebChat、macOS アプリ、iOS/Android ノード）が同じメインセッション履歴を共有することを意味します。

分離されたコンテキストが必要な場合は、設定で異なるセッションキーを設定できます。
:::

#### 添付ファイルのアップロード

WebChat は画像、音声、動画などの添付ファイルのアップロードをサポートしています。

**操作手順**：

1. 入力ボックスの横の"添付ファイル"アイコンをクリック（通常 📎 または 📎️）
2. アップロードするファイルを選択（またはチャットエリアにファイルをドラッグ＆ドロップ）
3. 関連するテキスト説明を入力
4. "送信" をクリック

**サポートされているフォーマット**：
- 📷 **画像**：JPEG、PNG、GIF
- 🎵 **音声**：MP3、WAV、M4A
- 🎬 **動画**：MP4、MOV
- 📄 **ドキュメント**：PDF、TXT など（Gateway の設定によります）

**次のような画面が表示されるはずです**：
```
┌─────────────────────────────────────────────┐
│  あなた → AI: この画像を分析してください         │
│  [📎 photo.jpg]                         │
│                                             │
│  AI → あなた: この画像が...であることが分かりました        │
│  [分析結果...]                              │
└─────────────────────────────────────────────┘
```

::: warning ファイルサイズの制限
WebChat と Gateway はアップロードされるファイルサイズに制限があります（通常数 MB）。アップロードが失敗する場合、ファイルサイズまたは Gateway のメディア設定を確認してください。
:::

#### Markdown サポート

WebChat は Markdown 形式をサポートしており、メッセージをフォーマットできます。

**例**：

```markdown
# 見出し
## レベル2見出し
- リスト項目 1
- リスト項目 2

**太字** と *斜体*
`コード`
```

**プレビュー効果**：
```
# 見出し
## レベル2見出し
- リスト項目 1
- リスト項目 2

**太字** と *斜体*
`コード`
```

#### コマンドショートカット

WebChat はスラッシュコマンドをサポートしており、特定の操作を素早く実行できます。

**よく使われるコマンド**：

| コマンド             | 機能                         |
| ---------------- | ---------------------------- |
| `/new`          | 新しいセッションを作成                   |
| `/reset`        | 現在のセッションの履歴をリセット           |
| `/clear`        | 現在のセッションのすべてのメッセージをクリア       |
| `/status`       | Gateway とチャンネルのステータスを表示       |
| `/models`       | 利用可能な AI モデルを一覧表示         |
| `/help`         | ヘルプ情報を表示                 |

**使用例**：

```
/new
## 新しいセッションを作成

/reset
## 現在のセッションをリセット
```

---

### ステップ 4（オプション）：リモートアクセスを設定する

**なぜ必要か**
リモートサーバーで Gateway を実行している場合、または他のデバイスから WebChat にアクセスしたい場合、リモートアクセスを設定する必要があります。

#### SSH トンネル経由でアクセス

**適用シナリオ**：Gateway がリモートサーバーにあり、ローカルマシンから WebChat にアクセスしたい場合。

**操作手順**：

1. SSH トンネルを確立し、リモート Gateway ポートをローカルにマッピング：

```bash
## リモートの 18789 ポートをローカルの 18789 ポートにマッピング
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. SSH 接続を開いたままにする（または `-N` パラメータを使用してリモートコマンドを実行しない）

3. ローカルブラウザでアクセス：`http://localhost:18789`

**次のような画面が表示されるはずです**：ローカルアクセスと同じ WebChat インターフェース

::: tip SSH トンネルの維持
SSH トンネルは接続が切断されると無効になります。永続的なアクセスが必要な場合：

- `autossh` を使用して自動再接続
- SSH Config の `LocalForward` を設定
- systemd/launchd を使用してトンネルを自動起動
:::

#### Tailscale 経由でアクセス

**適用シナリオ**：Tailscale を使用してプライベートネットワークを構築し、Gateway とクライアントが同じ tailnet 内にある場合。

**設定手順**：

1. Gateway マシンで Tailscale Serve または Funnel を有効にする：

```bash
## 設定ファイルを編集
clawdbot config set gateway.tailscale.mode serve
## または
clawdbot config set gateway.tailscale.mode funnel
```

2. Gateway を再起動

```bash
## 設定を適用するために Gateway を再起動
clawdbot gateway restart
```

3. Gateway の Tailscale アドレスを取得

```bash
## ステータスを確認（Tailscale URL が表示されます）
clawdbot gateway status
```

4. クライアントデバイス（同じ tailnet）からアクセス：

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**：tailnet 内でのみアクセス可能で、より安全
- **Funnel**：インターネットに公開され、`gateway.auth` による保護が必要

公衆インターネットからアクセスする必要がある場合を除き、Serve モードの使用を推奨します。
:::

#### リモートアクセスの認証

SSH トンネルか Tailscale かに関わらず、Gateway で認証が設定されている場合、token またはパスワードを提供する必要があります。

**認証設定を確認**：

```bash
## 認証モードを確認
clawdbot config get gateway.auth.mode

## token モードの場合、token が設定されているか確認
clawdbot config get gateway.auth.token
```

---

## チェックポイント ✅

上記の手順を完了すると、以下のことができるようになります：

- [ ] ブラウザで WebChat にアクセスする（`http://localhost:18789`）
- [ ] メッセージを送信し、AI の応答を受け取る
- [ ] セッション管理機能を使用する（新規作成、切り替え、リセット）
- [ ] 添付ファイルをアップロードし、AI に分析させる
- [ ] （オプション）SSH トンネル経由でリモートアクセスする
- [ ] （オプション）Tailscale 経由で WebChat にアクセスする

::: tip 接続の検証
WebChat にアクセスできない、またはメッセージの送信が失敗する場合、以下を確認してください：

1. Gateway が実行中か：`clawdbot gateway status`
2. ポートが正しいか：`http://127.0.0.1:18789` にアクセスしていることを確認（`localhost:18789` ではない）
3. 認証が設定されているか：`clawdbot config get gateway.auth.*`
4. 詳細なログを表示：`clawdbot gateway --verbose`
:::

---

## よくある問題

### ❌ Gateway が起動していない

**間違った方法**：
```
直接 http://localhost:18789 にアクセス
## 結果：接続失敗または読み込み不可
```

**正しい方法**：
```bash
## まず Gateway を起動
clawdbot gateway --port 18789

## その後 WebChat にアクセス
open http://localhost:18789
```

::: warning Gateway を先に起動する必要があります
WebChat は Gateway の WebSocket サービスに依存しています。実行中の Gateway がないと、WebChat は正常に動作しません。
:::

### ❌ ポート設定ミス

**間違った方法**：
```
http://localhost:8888 にアクセス
## Gateway は実際に 18789 ポートで実行中
## 結果：接続拒否
```

**正しい方法**：
```bash
## 1. Gateway の実際のポートを確認
clawdbot config get gateway.port

## 2. 正しいポートでアクセス
open http://localhost:<gateway.port>
```

### ❌ 認証設定の見落とし

**間違った方法**：
```
gateway.auth.mode または token を設定していない
## 結果：WebChat で認証エラーが表示される
```

**正しい方法**：
```bash
## token 認証を設定（推奨）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Gateway を再起動
clawdbot gateway restart

## WebChat にアクセスする際に token を入力
```

### ❌ リモートアクセス未設定

**間違った方法**：
```
ローカルからリモートサーバー IP に直接アクセス
http://remote-server-ip:18789
## 結果：接続タイムアウト（ファイアウォールでブロック）
```

**正しい方法**：
```bash
## SSH トンネルを使用
ssh -L 18789:localhost:18789 user@remote-server.com

## または Tailscale Serve を使用
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## ローカルブラウザからアクセス
http://localhost:18789
```

---

## まとめ

このチュートリアルでは、以下を学びました：

1. ✅ **WebChat の概要**：Gateway WebSocket ベースの組み込みチャットインターフェースで、別途設定不要
2. ✅ **アクセス方法**：ブラウザアクセス、macOS アプリ、コマンドラインショートカット
3. ✅ **コア機能**：セッション管理、添付ファイルアップロード、Markdown サポート、スラッシュコマンド
4. ✅ **リモートアクセス**：SSH トンネルまたは Tailscale 経由でリモート Gateway にアクセス
5. ✅ **認証設定**：Gateway 認証モード（token/password/Tailscale）の理解
6. ✅ **トラブルシューティング**：一般的な問題と解決策

**重要な概念の復習**：

- WebChat は Gateway と同じポートを使用し、個別の HTTP サーバーは不要
- 履歴は Gateway によって管理され、リアルタイムに同期され、ローカルにはキャッシュされない
- Gateway に到達できない場合、WebChat は読み取り専用モードになる
- 返信は WebChat に決定論的にルーティングされ、他のチャンネルとは異なる

**次のステップ**：

- [macOS アプリ](../macos-app/) を探索し、メニューバーコントロールと Voice Wake 機能を理解する
- [iOS ノード](../ios-node/) を学習し、モバイルデバイスでのローカル操作を設定する
- [Canvas ビジュアルインターフェース](../../advanced/canvas/) を理解し、AI 駆動のビジュアルワークスペースを体験する

---

## 次のチュートリアルの予告

> 次のチュートリアルでは **[macOS アプリ](../macos-app/)** を学びます。
>
> 学べること：
> - macOS メニューバーアプリの機能とレイアウト
> - Voice Wake と Talk Mode の使用
> - WebChat と macOS アプリの統合方法
> - デバッグツールとリモート Gateway コントロール

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-27

| 機能                  | ファイルパス                                                                                    | 行番号    |
| ------------------- | ------------------------------------------------------------------------------------------- | ------- |
| WebChat 原理説明     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | 全ファイル   |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | 全ディレクトリ   |
| chat.send メソッド        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| chat.history メソッド     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| chat.inject メソッド      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Web UI エントリーポイント         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Gateway 認証設定     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Tailscale 統合       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 全ファイル   |
| macOS WebChat 統合  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | 全ディレクトリ   |

**重要な定数**：
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 内部メッセージチャンネル識別子（`src/utils/message-channel.ts:17` から）

**重要な設定項目**：
- `gateway.port`：WebSocket ポート（デフォルト 18789）
- `gateway.auth.mode`：認証モード（token/password/tailscale）
- `gateway.auth.token`：Token 認証のトークン値
- `gateway.auth.password`：パスワード認証のパスワード値
- `gateway.tailscale.mode`：Tailscale モード（serve/funnel/disabled）
- `gateway.remote.url`：リモート Gateway の WebSocket アドレス
- `gateway.remote.token`：リモート Gateway 認証トークン
- `gateway.remote.password`：リモート Gateway 認証パスワード

**重要な WebSocket メソッド**：
- `chat.send(message)`：Agent にメッセージを送信（`src/gateway/server-methods/chat.ts` から）
- `chat.history(sessionId)`：セッション履歴を取得（`src/gateway/server-methods/chat.ts` から）
- `chat.inject(message)`：システムノートをセッションに直接注入、Agent を経由しない（`src/gateway/server-methods/chat.ts` から）

**アーキテクチャの特徴**：
- WebChat は個別の HTTP サーバーやポート設定を必要としない
- Gateway と同じポートを使用（デフォルト 18789）
- 履歴は Gateway からリアルタイムに取得され、ローカルにはキャッシュされない
- 返信は WebChat に決定論的にルーティング（他のチャンネルとは異なる）

</details>
