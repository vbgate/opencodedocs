---
title: "ブラウザ自動化ツール：Web制御とUI自動化 | Clawdbotチュートリアル"
sidebarTitle: "5分でブラウザを制御"
subtitle: "ブラウザ自動化ツール：Web制御とUI自動化 | Clawdbotチュートリアル"
description: "Clawdbotのブラウザツールを使用して、Web自動化、スクリーンショット、フォーム操作、UI制御を行う方法を学びます。本チュートリアルは、ブラウザの起動、ページスナップショット、UI操作（click/type/dragなど）、ファイルアップロード、ダイアログ処理、リモートブラウザ制御をカバーします。Chrome拡張リレーモードとスタンドアロンブラウザ設定、iOS/Androidノードでのブラウザ操作実行を含む完全なワークフローを習得できます。"
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# ブラウザ自動化ツール：Web制御とUI自動化

## 学習後にできること

- Clawdbotが管理するブラウザを起動・制御する
- Chrome拡張リレーを使用して既存のChromeタブを制御する
- ページスナップショット（AI/ARIA形式）とスクリーンショット（PNG/JPEG）を撮影する
- UI自動化操作を実行する：クリック、テキスト入力、ドラッグ、選択、フォーム入力
- ファイルアップロードとダイアログ（alert/confirm/prompt）を処理する
- リモートブラウザ制御サーバーを介して分散ブラウザを操作する
- ノードプロキシを使用してiOS/Androidデバイスでブラウザ操作を実行する

## 現在の課題

Gatewayを実行し、AIモデルを設定しましたが、ブラウザツールの使用についてまだ疑問があります：

- AIがWebページの内容にアクセスできず、ページ構造を説明する必要がある？
- AIに自動でフォームを入力やボタンクリックをさせたいが、方法がわからない？
- スクリーンショットやページ保存をしたいが、毎回手動操作が必要？
- 新しいブラウザを起動するのではなく、自分のChromeタブ（ログイン済みセッション）を使用したい？
- iOS/Androidノードなどのリモートデバイスでブラウザ操作を実行したい？

## いつ使うか

**ブラウザツールの使用シナリオ**：

| シナリオ | Action | 例 |
| ---- | ------ | ---- |
| フォーム自動化 | `act` + `fill` | 登録フォーム入力、注文送信 |
| Webスクレイピング | `snapshot` | ページ構造抽出、データ収集 |
| スクリーンショット保存 | `screenshot` | ページスクリーンショット保存、証拠保存 |
| ファイルアップロード | `upload` | 履歴書アップロード、添付ファイルアップロード |
| ダイアログ処理 | `dialog` | alert/confirmの承認/拒否 |
| 既存セッション使用 | `profile="chrome"` | ログイン済みのChromeタブで操作 |
| リモート制御 | `target="node"` | iOS/Androidノードで実行 |

## 🎒 開始前の準備

::: warning 事前チェック

ブラウザツールを使用する前に、以下を確認してください：

1. ✅ Gatewayが起動している（`clawdbot gateway start`）
2. ✅ AIモデルが設定されている（Anthropic / OpenAI / OpenRouterなど）
3. ✅ ブラウザツールが有効になっている（`browser.enabled=true`）
4. ✅ 使用するターゲット（sandbox/host/custom/node）を理解している
5. ✅ Chrome拡張リレーを使用する場合、拡張機能がインストールされ有効になっている

:::

## 核心概念

**ブラウザツールとは？**

ブラウザツールは、Clawdbotに内蔵された自動化ツールで、AIがCDP（Chrome DevTools Protocol）を介してブラウザを制御できます：

- **制御サーバー**：`http://127.0.0.1:18791`（デフォルト）
- **UI自動化**：Playwrightベースの要素特定と操作
- **スナップショット機構**：AI形式またはARIA形式で、ページ構造と要素参照を返す
- **マルチターゲット対応**：sandbox（デフォルト）、host（Chromeリレー）、custom（リモート）、node（デバイスノード）

**2つのブラウザモード**：

| モード | Profile | ドライバー | 説明 |
| ---- | ------- | ---- | ---- |
| **スタンドアロンブラウザ** | `clawd`（デフォルト） | clawd | Clawdbotが独立したChrome/Chromiumインスタンスを起動 |
| **Chromeリレー** | `chrome` | extension | 既存のChromeタブを制御（拡張機能のインストールが必要） |

**ワークフロー**：

```
1. ブラウザを起動（start）
   ↓
2. タブを開く（open）
   ↓
3. ページスナップショットを取得（snapshot）→ 要素参照（ref）を取得
   ↓
4. UI操作を実行（act：click/type/fill/drag）
   ↓
5. 結果を検証（screenshot/snapshot）
```

## 手順通りに進める

### ステップ1：ブラウザを起動

**なぜ**

ブラウザツールを初めて使用する際、最初にブラウザ制御サーバーを起動する必要があります。

```bash
# チャットでAIにブラウザ起動を伝える
ブラウザを起動してください

# またはブラウザツールを使用
action: start
profile: clawd  # またはchrome（Chrome拡張リレー）
target: sandbox
```

**次の結果が表示されます**：

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip チェックポイント

- `Browser control server`が表示されれば起動成功です
- デフォルトでは`clawd` profileを使用（スタンドアロンブラウザ）
- Chrome拡張リレーを使用する場合は`profile="chrome"`を使用
- ブラウザウィンドウが自動的に開きます（非ヘッドレスモード）

:::

### ステップ2：Webページを開く

**なぜ**

ターゲットのWebページを開いて、自動化操作の準備をします。

```bash
# チャットで
https://example.comを開いてください

# またはブラウザツールを使用
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**次の結果が表示されます**：

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip 要素参照（targetId）

タブを開くかフォーカスするたびに`targetId`が返されます。このIDは後続の操作（snapshot/act/screenshot）で使用されます。

:::

### ステップ3：ページスナップショットを取得

**なぜ**

スナップショットによりAIがページ構造を理解し、操作可能な要素参照（ref）を取得できます。

```bash
# AI形式スナップショットを取得（デフォルト）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Playwright aria-ref idsを使用（呼び出し間で安定）

# またはARIA形式スナップショットを取得（構造化出力）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**次の結果が表示されます**（AI形式）：

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip スナップショット形式の選択

| 形式 | 用途 | 特徴 |
| ---- | ---- | ---- |
| `ai` | デフォルト、AIが理解 | 可読性が高く、AI解析に適している |
| `aria` | 構造化出力 | 正確な構造が必要なシナリオに適している |
| `refs="aria"` | 呼び出し間で安定 | マルチステップ操作（snapshot → act）におすすめ |

:::

### ステップ4：UI操作を実行（act）

**なぜ**

スナップショットで返された要素参照（ref）を使用して自動化操作を実行します。

```bash
# ボタンをクリック
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# テキストを入力
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# フォームに入力（複数フィールド）
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 送信ボタンをクリック
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**次の結果が表示されます**：

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip 一般的なUI操作

| 操作 | Kind | パラメータ |
| ---- | ---- | ---- |
| クリック | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| テキスト入力 | `type` | `ref`, `text`, `submit`, `slowly` |
| キー押下 | `press` | `key`, `targetId` |
| ホバー | `hover` | `ref`, `targetId` |
| ドラッグ | `drag` | `startRef`, `endRef`, `targetId` |
| 選択 | `select` | `ref`, `values` |
| フォーム入力 | `fill` | `fields`（配列） |
| 待機 | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| JS実行 | `evaluate` | `fn`, `ref`, `targetId` |

:::

### ステップ5：Webページのスクリーンショットを撮る

**なぜ**

操作結果を検証するか、Webページのスクリーンショットを保存します。

```bash
# 現在のタブをスクリーンショット
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# ページ全体をスクリーンショット
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# 指定要素をスクリーンショット
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # スナップショットのrefを使用
type: jpeg
```

**次の結果が表示されます**：

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip スクリーンショット形式

| 形式 | 用途 |
| ---- | ---- |
| `png` | デフォルト、非可逆圧縮、ドキュメントに適している |
| `jpeg` | 可逆圧縮、ファイルサイズが小さい、保存に適している |

:::

### ステップ6：ファイルアップロードを処理

**なぜ**

フォームのファイルアップロード操作を自動化します。

```bash
# まずファイルセレクタをトリガー（アップロードボタンをクリック）
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# ファイルをアップロード
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # オプション：ファイルセレクタのrefを指定
targetId: tab_abc123
profile: clawd
```

**次の結果が表示されます**：

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning ファイルパスに関する注意

- 絶対パスを使用、相対パスはサポートされません
- ファイルが存在し、読み取り権限があることを確認してください
- 複数ファイルの場合、配列の順序でアップロードされます

:::

### ステップ7：ダイアログを処理

**なぜ**

Webページ内のalert、confirm、promptダイアログを自動処理します。

```bash
# ダイアログを承認（alert/confirm）
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# ダイアログを拒否（confirm）
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# promptダイアログに回答
action: dialog
accept: true
promptText: "ユーザーが入力した回答"
targetId: tab_abc123
profile: clawd
```

**次の結果が表示されます**：

```
✓ Dialog handled: accepted (prompt: "ユーザーが入力した回答")
```

## よくある問題

### ❌ エラー：Chrome拡張リレーが接続されていない

**エラーメッセージ**：
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**原因**：`profile="chrome"`を使用しましたが、タブがアタッチされていません

**解決方法**：

1. Clawdbot Browser Relay拡張機能をインストール（Chrome Web Store）
2. 制御したいタブで拡張機能アイコンをクリック（バッジがON）
3. `action: snapshot profile="chrome"`を再実行

### ❌ エラー：要素参照が期限切れ（stale targetId）

**エラーメッセージ**：
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**原因**：タブが閉じられたか、targetIdが期限切れ

**解決方法**：

```bash
# タブリストを再取得
action: tabs
profile: chrome

# 新しいtargetIdを使用
action: snapshot
targetId: "新しい_targetId"
profile: chrome
```

### ❌ エラー：ブラウザ制御サーバーが起動されていない

**エラーメッセージ**：
```
Browser control server not available. Run action=start first.
```

**原因**：ブラウザ制御サーバーが起動されていません

**解決方法**：

```bash
# ブラウザを起動
action: start
profile: clawd
target: sandbox
```

### ❌ エラー：リモートブラウザ接続タイムアウト

**エラーメッセージ**：
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**原因**：リモートブラウザ接続がタイムアウトしました

**解決方法**：

```bash
# 設定ファイルでタイムアウト時間を増やす
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ エラー：ノードブラウザプロキシが利用できない

**エラーメッセージ**：
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**原因**：ノードブラウザプロキシが無効になっています

**解決方法**：

```bash
# 設定ファイルでノードブラウザを有効にする
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # または "manual"
      }
    }
  }
}
```

## このレッスンのまとめ

このレッスンでは以下を学びました：

✅ **ブラウザ制御**：起動/停止/ステータス確認
✅ **タブ管理**：タブを開く/フォーカス/閉じる
✅ **ページスナップショット**：AI/ARIA形式、要素参照の取得
✅ **UI自動化**：click/type/drag/fill/wait/evaluate
✅ **スクリーンショット機能**：PNG/JPEG形式、ページ全体または要素のスクリーンショット
✅ **ファイルアップロード**：ファイルセレクタの処理、複数ファイル対応
✅ **ダイアログ処理**：accept/reject/alert/confirm/prompt
✅ **Chromeリレー**：`profile="chrome"`を使用して既存のタブを制御
✅ **ノードプロキシ**：`target="node"`を介してデバイスノードで実行

**主要操作クイックリファレンス**：

| 操作 | Action | 主要パラメータ |
| ---- | ------ | -------- |
| ブラウザ起動 | `start` | `profile`（clawd/chrome） |
| Webページを開く | `open` | `targetUrl` |
| スナップショット取得 | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI操作 | `act` | `request.kind`, `request.ref` |
| スクリーンショット | `screenshot` | `targetId`, `fullPage`, `ref` |
| ファイルアップロード | `upload` | `paths`, `ref` |
| ダイアログ | `dialog` | `accept`, `promptText` |

## 次のレッスンの予告

> 次のレッスンでは**[コマンド実行ツールと承認](../tools-exec/)**を学びます。
>
> 学ぶ内容：
> - execツールの設定と使用
> - セキュリティ承認メカニズムの理解
> - allowlistを使用して実行可能コマンドを制御
> - サンドボックスを使用してリスク操作を分離

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
| ---- | -------- | ---- |
| Browserツール定義 | [`src/agents/tools/browser-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Actionタイプ定義 | [`src/browser/client-actions-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| ブラウザ設定解析 | [`src/browser/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/config.ts) | 140-231 |
| ブラウザ定数 | [`src/browser/constants.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDPクライアント | [`src/browser/cdp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome実行ファイル検出 | [`src/browser/chrome.executables.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**主要定数**：
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`：デフォルト制御サーバーアドレス（出所：`src/browser/constants.ts:2`）
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`：AIスナップショットのデフォルト最大文字数（出所：`src/browser/constants.ts:6`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`：efficientモードの最大文字数（出所：`src/browser/constants.ts:7`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`：efficientモードの深度（出所：`src/browser/constants.ts:8`）

**主要関数**：
- `createBrowserTool()`：ブラウザツールを作成、すべてのactionsとパラメータ処理を定義
- `browserSnapshot()`：ページスナップショットを取得、AI/ARIA形式をサポート
- `browserScreenshotAction()`：スクリーンショット操作を実行、ページ全体と要素スクリーンショットをサポート
- `browserAct()`：UI自動化操作を実行（click/type/drag/fill/wait/evaluateなど）
- `browserArmFileChooser()`：ファイルアップロードを処理、ファイルセレクタをトリガー
- `browserArmDialog()`：ダイアログを処理（alert/confirm/prompt）
- `resolveBrowserConfig()`：ブラウザ設定を解析、制御サーバーアドレスとポートを返す
- `resolveProfile()`：profile設定を解析（clawd/chrome）

**Browser Actions Kind**（出所：`src/agents/tools/browser-tool.schema.ts:5-17`）：
- `click`：要素をクリック
- `type`：テキストを入力
- `press`：キーを押下
- `hover`：ホバー
- `drag`：ドラッグ
- `select`：ドロップダウンオプションを選択
- `fill`：フォームを入力（複数フィールド）
- `resize`：ウィンドウサイズを調整
- `wait`：待機
- `evaluate`：JavaScriptを実行
- `close`：タブを閉じる

**Browser Tool Actions**（出所：`src/agents/tools/browser-tool.schema.ts:19-36`）：
- `status`：ブラウザステータスを取得
- `start`：ブラウザを起動
- `stop`：ブラウザを停止
- `profiles`：すべてのprofilesを一覧表示
- `tabs`：すべてのタブを一覧表示
- `open`：新しいタブを開く
- `focus`：タブをフォーカス
- `close`：タブを閉じる
- `snapshot`：ページスナップショットを取得
- `screenshot`：スクリーンショットを撮る
- `navigate`：指定URLにナビゲート
- `console`：コンソールメッセージを取得
- `pdf`：ページをPDFとして保存
- `upload`：ファイルをアップロード
- `dialog`：ダイアログを処理
- `act`：UI操作を実行

</details>
