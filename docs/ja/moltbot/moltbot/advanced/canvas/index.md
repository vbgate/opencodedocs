---
title: "Canvas可視化インターフェースとA2UI | Clawdbotチュートリアル"
sidebarTitle: "AIのための視覚化インターフェース"
subtitle: "Canvas可視化インターフェースとA2UI"
description: "ClawdbotのCanvas可視化インターフェースの使用方法を学びます。A2UIプッシュメカニズム、Canvas Host設定、ノードCanvas操作を理解し、AIアシスタントのための対話型UIを作成します。本チュートリアルは静的HTMLと動的A2UIの2つの方法を網羅し、canvasツールの完全なコマンドリファレンス、セキュリティメカニズム、設定オプション、トラブルシューティングのヒントを含みます。"
tags:
  - "Canvas"
  - "A2UI"
  - "視覚化インターフェース"
  - "ノード"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Canvas可視化インターフェースとA2UI

## 学習後にできること

このレッスンを完了すると、以下のことができるようになります：

- Canvas Hostを設定し、カスタムHTML/CSS/JSインターフェースをデプロイする
- `canvas`ツールを使用してノードCanvasを制御する（表示、非表示、ナビゲーション、JS実行）
- A2UIプロトコルをマスターし、AIが動的にUI更新をプッシュできるようにする
- CanvasスクリーンショットをキャプチャしてAIコンテキストに使用する
- Canvasセキュリティメカニズムとアクセス制御を理解する

## 現在の課題

AIアシスタントがありますが、テキストでのみやり取りできます。あなたは以下のことを望んでいます：

- AIに視覚的インターフェースを表示させる（表、グラフ、フォームなど）
- モバイルデバイスでAgentが生成した動的UIを確認する
- 「アプリ」のような対話体験を作成し、独立した開発を不要にする

## この手法を使うタイミング

**Canvas + A2UIは以下のシナリオに適しています**：

| シナリオ | 例 |
|--- | ---|
| **データ可視化** | 統計グラフ、プログレスバー、タイムラインの表示 |
| **対話型フォーム** | ユーザーに操作確認やオプション選択をさせる |
| **ステータスパネル** | タスク進行状況やシステム状態をリアルタイム表示 |
| **ゲームとエンターテイメント** | シンプルなミニゲーム、インタラクティブデモ |

::: tip A2UI vs. 静的HTML
- **A2UI**（Agent-to-UI）：AIが動的にUIを生成・更新し、リアルタイムデータに適している
- **静的HTML**：事前に記述されたインターフェースで、固定レイアウトと複雑な対話に適している
:::

## 🎒 開始前の準備

開始する前に、以下が完了していることを確認してください：

- [ ] **Gatewayが起動している**：Canvas HostはデフォルトでGatewayと共に自動起動します（ポート18793）
- [ ] **ノードがペアリングされている**：macOS/iOS/AndroidノードがGatewayに接続されている
- [ ] **ノードがCanvasをサポートしている**：ノードに`canvas`機能があることを確認（`clawdbot nodes list`）

::: warning 前提知識
このチュートリアルでは以下の知識があることを前提としています：
- [ノードペアリングの基礎](../../platforms/android-node/)
- [AIツール呼び出しメカニズム](../tools-browser/)
:::

## コアコンセプト

Canvasシステムには3つのコアコンポーネントが含まれています：

```
┌─────────────────┐
│   Canvas Host  │ ────▶ HTTPサーバー（ポート18793）
│   (Gateway)   │        └── ~/clawd/canvas/ファイルを提供
└─────────────────┘
        │
        │ WebSocket通信
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebViewがCanvasをレンダリング
│ (iOS/Android) │        └── A2UI経由でプッシュを受信
└─────────────────┘
        │
        │ userActionイベント
        │
┌─────────────────┐
│   AI Agent    │ ────▶ canvasツール呼び出し
│  (pi-mono)   │        └── A2UI更新をプッシュ
└─────────────────┘
```

**重要な概念**：

1. **Canvas Host**（Gateway側）
   - 静的ファイルの提供：`http://<gateway-host>:18793/__clawdbot__/canvas/`
   - A2UIホストのホスティング：`http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - ホットリロード対応：ファイル変更後に自動更新

2. **Canvas Panel**（ノード側）
   - macOS/iOS/AndroidノードにWKWebViewが埋め込まれている
   - WebSocket経由でGatewayに接続（リアルタイムリロード、A2UI通信）
   - `eval`によるJS実行、`snapshot`による画面キャプチャをサポート

3. **A2UIプロトコル**（v0.8）
   - AgentがWebSocket経由でUI更新をプッシュ
   - サポート：`beginRendering`、`surfaceUpdate`、`dataModelUpdate`、`deleteSurface`

## 手順に従って実行

### ステップ1：Canvas Hostの状態を確認

**理由**
Canvas Hostが実行されていることを確認して、ノードがCanvasコンテンツを読み込めるようにします。

```bash
# ポート18793がリッスンされているか確認
lsof -i :18793
```

**以下が表示されるはずです**：

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info 設定パス
- **Canvasルートディレクトリ**：`~/clawd/canvas/`（`canvasHost.root`で変更可能）
- **ポート**：`18793` = `gateway.port + 4`（`canvasHost.port`で変更可能）
- **ホットリロード**：デフォルトで有効（`canvasHost.liveReload: false`で無効化）
:::

### ステップ2：最初のCanvasページを作成

**理由**
カスタムHTMLインターフェースを作成し、ノードにコンテンツを表示させます。

```bash
# Canvasルートディレクトリを作成（存在しない場合）
mkdir -p ~/clawd/canvas

# シンプルなHTMLファイルを作成
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>これは最初のCanvasページです。</p>
<button onclick="alert('ボタンがクリックされました！')">クリックして</button>
EOF
```

**以下が表示されるはずです**：

```text
ファイルが作成されました：~/clawd/canvas/hello.html
```

### ステップ3：ノードでCanvasを表示

**理由**
ノードに作成したページを読み込んで表示させます。

まずノードIDを検索します：

```bash
clawdbot nodes list
```

**以下が表示されるはずです**：

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

次にCanvasを表示します（iOSノードを例とします）：

```bash
# 方法1：CLIコマンドを使用
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**以下が表示されるはずです**：

- iOSデバイスにボーダーレスパネルがポップアップし、HTMLコンテンツが表示されます
- パネルはメニューバーやマウス位置に近い場所に表示されます
- コンテンツは中央揃えで、緑色のタイトルとボタンが表示されます

**AI呼び出しの例**：

```
AI: iOSデバイスでCanvasパネルを開き、ウェルカムページを表示しました。
```

::: tip Canvas URLフォーマット
- **ローカルファイル**：`http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **外部URL**：`https://example.com`（ノードにネットワークアクセス権限が必要）
- **デフォルトに戻る**：`/`または空文字列、組み込みスキャフォールドページを表示
:::

### ステップ4：A2UIで動的UIをプッシュ

**理由**
AIがファイルを変更せずに、Canvasへ直接UI更新をプッシュでき、リアルタイムデータと対話に適しています。

**方法A：高速テキストプッシュ**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**以下が表示されるはずです**：

- Canvasに青色のA2UIインターフェースが表示されます
- テキストが中央に表示されます：`Hello from A2UI`

**方法B：完全なJSONLプッシュ**

A2UI定義ファイルを作成します：

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"A2UIデモ"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"システム状態：実行中"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"テストボタン"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

A2UIをプッシュします：

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**以下が表示されるはずです**：

```
┌────────────────────────────┐
│     A2UIデモ         │
│                        │
│  システム状態：実行中       │
│                        │
│   [ テストボタン ]          │
└────────────────────────────┘
```

::: details A2UI JSONLフォーマットの説明
JSONL（JSON Lines）は各行に1つのJSONオブジェクトを含み、ストリーミング更新に適しています：

```jsonl
{"surfaceUpdate":{...}}   // サーフェースコンポーネントを更新
{"beginRendering":{...}}   // レンダリングを開始
{"dataModelUpdate":{...}} // データモデルを更新
{"deleteSurface":{...}}   // サーフェースを削除
```
:::

### ステップ5：Canvas JavaScriptを実行

**理由**
Canvas内でカスタムJSを実行し、DOMの変更や状態の読み取りを行います。

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**以下が表示されるはずです**：

```text
"Hello from Canvas"
```

::: tip JS実行の例
- 要素の読み取り：`document.querySelector('h1').textContent`
- スタイルの変更：`document.body.style.background = '#333'`
- 値の計算：`innerWidth + 'x' + innerHeight`
- クロージャの実行：`(() => { ... })()`
:::

### ステップ6：Canvasスクリーンショットをキャプチャ

**理由**
AIに現在のCanvas状態を確認させ、コンテキスト理解に使用します。

```bash
# デフォルトフォーマット（JPEG）
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# PNGフォーマット + 最大幅制限
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# 高品質JPEG
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**以下が表示されるはずです**：

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

ファイルパスはシステムによって自動生成され、通常は一時ディレクトリに保存されます。

### ステップ7：Canvasを非表示にする

**理由**
Canvasパネルを閉じ、画面スペースを解放します。

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**以下が表示されるはずです**：

- iOSデバイス上のCanvasパネルが消えます
- ノードの状態が回復します（以前使用されていた場合）

## チェックポイント ✅

**Canvas機能が正常に動作していることを確認**：

| チェック項目 | 確認方法 |
|--- | ---|
| Canvas Hostが実行中 | `lsof -i :18793`に出力がある |
| ノードのCanvas機能 | `clawdbot nodes list`に`canvas`が表示される |
| ページの読み込み成功 | ノードがHTMLコンテンツを表示する |
| A2UIプッシュ成功 | Canvasに青色のA2UIインターフェースが表示される |
| JS実行が結果を返す | `eval`コマンドが値を返す |
| スクリーンショットが生成 | 一時ディレクトリに`.jpg`または`.png`ファイルがある |

## 注意点

::: warning フォアグラウンド/バックグラウンド制限
- **iOS/Androidノード**：`canvas.*`と`camera.*`コマンドは**フォアグラウンドで実行する必要があります**
- バックグラウンド呼び出しは以下を返します：`NODE_BACKGROUND_UNAVAILABLE`
- 解決方法：デバイスをフォアグラウンドに起動する
:::

::: danger セキュリティ上の注意事項
- **ディレクトリトラバーサル保護**：Canvas URLは`..`による上位ディレクトリアクセスを禁止
- **カスタムスキーム**：`clawdbot-canvas://`はノード内部のみでの使用に制限
- **HTTPS制限**：外部HTTPS URLにはノードのネットワーク権限が必要
- **ファイルアクセス**：Canvas Hostは`canvasHost.root`以下のファイルのみアクセスを許可
:::

::: tip デバッグのヒント
- **Gatewayログの確認**：`clawdbot gateway logs`
- **ノードログの確認**：iOS設定 → Debug Logs、Androidアプリ内ログ
- **URLのテスト**：ブラウザで直接`http://<gateway-host>:18793/__clawdbot__/canvas/`にアクセス
:::

## このレッスンのまとめ

このレッスンでは以下を学びました：

1. **Canvasアーキテクチャ**：Canvas Host、Node App、A2UIプロトコルの関係を理解
2. **Canvas Hostの設定**：ルートディレクトリ、ポート、ホットリロード設定を調整
3. **カスタムページの作成**：HTML/CSS/JSを作成してノードにデプロイ
4. **A2UIの使用**：JSONL経由で動的UI更新をプッシュ
5. **JavaScriptの実行**：Canvas内でコードを実行し、状態を読み取り・変更
6. **スクリーンショットのキャプチャ**：AIに現在のCanvas状態を認識させる

**重要なポイント**：

- Canvas HostはGatewayと共に自動起動し、追加設定は不要
- A2UIはリアルタイムデータに適し、静的HTMLは複雑な対話に適している
- ノードはフォアグラウンドで実行している場合のみCanvas操作が可能
- `canvas snapshot`を使用してUI状態をAIに渡す

## 次のレッスンの予告

> 次のレッスンでは**[音声ウェイクと音声合成](../voice-tts/)**を学びます。
>
> 学習内容：
> - Voice Wakeウェイクワードの設定
> - Talk Modeを使用した継続的な音声対話
> - 複数のTTSプロバイダーの統合（Edge、Deepgram、ElevenLabs）

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Canvas Hostサーバー | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| A2UIプロトコル処理 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Canvasツール定義 | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Canvasパス定数 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**重要な定数**：
- `A2UI_PATH = "/__clawdbot__/a2ui"`：A2UIホストパス
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`：Canvasファイルパス
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`：WebSocketホットリロードパス

**重要な関数**：
- `createCanvasHost()`：Canvas HTTPサーバーを起動（ポート18793）
- `injectCanvasLiveReload()`：HTMLにWebSocketホットリロードスクリプトを挿入
- `handleA2uiHttpRequest()`：A2UIリソースリクエストを処理
- `createCanvasTool()`：`canvas`ツールを登録（present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset）

**サポートされるCanvas Actions**：
- `present`：Canvasを表示（オプションのURL、位置、サイズ）
- `hide`：Canvasを非表示
- `navigate`：URLにナビゲート（ローカルパス/HTTP/file://）
- `eval`：JavaScriptを実行
- `snapshot`：スクリーンショットをキャプチャ（PNG/JPEG、オプションのmaxWidth/quality）
- `a2ui_push`：A2UI更新をプッシュ（JSONLまたはテキスト）
- `a2ui_reset`：A2UI状態をリセット

**設定Schema**：
- `canvasHost.root`：Canvasルートディレクトリ（デフォルト`~/clawd/canvas`）
- `canvasHost.port`：HTTPポート（デフォルト18793）
- `canvasHost.liveReload`：ホットリロードを有効にするか（デフォルトtrue）
- `canvasHost.enabled`：Canvas Hostを有効にするか（デフォルトtrue）

**A2UI v0.8でサポートされるメッセージ**：
- `beginRendering`：指定されたサーフェースのレンダリングを開始
- `surfaceUpdate`：サーフェースコンポーネントを更新（Column、Text、Buttonなど）
- `dataModelUpdate`：データモデルを更新
- `deleteSurface`：指定されたサーフェースを削除

</details>
