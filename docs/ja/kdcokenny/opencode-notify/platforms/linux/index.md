---
title: "Linuxプラットフォームガイド：notify-send通知とターミナル検出 | opencode-notifyチュートリアル"
sidebarTitle: "Linuxでも通知を送信"
subtitle: "Linuxプラットフォームの特徴：notify-send通知とターミナル検出"
description: "opencode-notifyのLinuxプラットフォームにおける機能と制限を学びます。Linuxネイティブ通知とターミナル検出機能をマスターし、macOS/Windowsプラットフォームとの機能差異を理解し、Linuxに適した通知戦略を設定して効率を向上させ、通知による妨害を避けながら集中した作業状態を維持し、notify-sendのインストール、通知表示、一般的な設定問題を解決します。"
tags:
  - "Linux"
  - "プラットフォーム機能"
  - "ターミナル検出"
prerequisite:
  - "start-quick-start"
order: 50
---

# Linuxプラットフォームの特徴：notify-send通知とターミナル検出

## 学習後にできること

- opencode-notifyがLinuxプラットフォームでサポートする機能を理解する
- Linuxネイティブ通知とターミナル検出の動作方法をマスターする
- macOS/Windowsプラットフォームとの機能差異を理解する
- Linuxに適した通知戦略を設定する

## あなたの現状

Linux上でOpenCodeを使用していると、macOSほどスマートに機能しないことに気づくかもしれません。ターミナルがフォーカスされているときでも通知がポップアップし、通知をクリックしてもターミナルウィンドウに戻れません。これは正常な動作ですか？Linuxプラットフォームにはどのような制限があるのでしょうか？

## この知識を使うタイミング

**以下のシナリオでLinuxプラットフォームの特徴を理解しましょう**：
- Linuxシステムでopencode-notifyを使用している
- macOSの機能の一部がLinuxで使用できないことに気づいた
- Linuxプラットフォームの使用可能な機能を最大限に活用する方法を知りたい

## 核心的な考え方

opencode-notifyはLinuxプラットフォームで**基本通知機能**を提供しますが、macOSに比べていくつかの機能制限があります。これはオペレーティングシステムの特性によるもので、プラグインの問題ではありません。

::: info なぜmacOSの機能がより豊富なのか？

macOSはより強力なシステムAPIを提供しています：
- NSUserNotificationCenterはクリックによるフォーカスをサポート
- AppleScriptはフォアグラウンドアプリケーションを検出できる
- システムサウンドAPIはカスタム音声を許可

LinuxとWindowsのシステム通知APIは比較的基本的であり、opencode-notifyはこれらのプラットフォームで`node-notifier`を通じてシステムネイティブ通知を呼び出します。
:::

## Linuxプラットフォーム機能一覧

| 機能 | Linux | 説明 |
| --- | --- | --- |
| **ネイティブ通知** | ✅ サポート | notify-send経由で通知を送信 |
| **ターミナル検出** | ✅ サポート | 37以上のターミナルエミュレータを自動認識 |
| **フォーカス検出** | ❌ 非サポート | ターミナルがフォアグラウンドウィンドウかどうかを検出できない |
| **クリックフォーカス** | ❌ 非サポート | 通知をクリックしてもターミナルに切り替わらない |
| **カスタムサウンド** | ❌ 非サポート | システムデフォルト通知音を使用 |

### Linux通知メカニズム

opencode-notifyはLinux上で**notify-send**コマンドを使用してシステム通知を送信し、`node-notifier`ライブラリを通じてシステムネイティブAPIを呼び出します。

**通知トリガータイミング**：
- AIタスク完了時（session.idle）
- AI実行エラー時（session.error）
- AIがパーミッションを必要とする時（permission.updated）
- AIが質問する時（tool.execute.before）

::: tip notify-send通知の特徴
- 通知は画面の右上に表示される（GNOME/Ubuntu）
- 自動的に消える（約5秒）
- システムデフォルト通知音を使用
- 通知をクリックすると通知センターが開く（ターミナルには切り替わらない）
:::

## ターミナル検出

### 自動ターミナル認識

opencode-notifyは`detect-terminal`ライブラリを使用して、使用中のターミナルエミュレータを自動検出します。

**Linuxでサポートされるターミナル**：
- gnome-terminal（GNOMEデスクトップデフォルト）
- konsole（KDEデスクトップ）
- xterm
- lxterminal（LXDEデスクトップ）
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code統合ターミナル
- その他37以上のターミナルエミュレータ

::: details ターミナル検出の原理

プラグイン起動時、`detect-terminal()`はシステムプロセスをスキャンして現在のターミナルタイプを識別します。

ソースコード位置：`src/notify.ts:145-164`

`detectTerminalInfo()`関数は以下を実行します：
1. 設定内の`terminal`フィールドを読み取り（手動で指定されている場合）
2. `detectTerminal()`を呼び出してターミナルタイプを自動検出
3. プロセス名を取得（macOSのフォーカス検出に使用）
4. macOSではbundle IDを取得（クリックフォーカスに使用）

Linuxプラットフォームでは、`bundleId`と`processName`は`null`になります。これはLinuxがこの情報を必要としないためです。
:::

### 手動ターミナル指定

自動検出が失敗した場合、設定ファイルで手動でターミナルタイプを指定できます。

**設定例**：

```json
{
  "terminal": "gnome-terminal"
}
```

**使用可能なターミナル名**：[`detect-terminal`サポートターミナルリスト](https://github.com/jonschlinkert/detect-terminal#supported-terminals)を参照してください。

## プラットフォーム機能比較

| 機能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **ネイティブ通知** | ✅ 通知センター | ✅ トースト | ✅ notify-send |
| **カスタムサウンド** | ✅ システムサウンドリスト | ❌ システムデフォルト | ❌ システムデフォルト |
| **フォーカス検出** | ✅ AppleScript API | ❌ 非サポート | ❌ 非サポート |
| **クリックフォーカス** | ✅ bundleIdアクティベート | ❌ 非サポート | ❌ 非サポート |
| **ターミナル検出** | ✅ 37+ ターミナル | ✅ 37+ ターミナル | ✅ 37+ ターミナル |

### なぜLinuxはフォーカス検出をサポートしないのか？

ソースコードでは、`isTerminalFocused()`関数はLinux上で直接`false`を返します：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linuxは直接falseを返す
	// ... macOSのフォーカス検出ロジック
}
```

**理由**：
- Linuxデスクトップ環境は多様（GNOME、KDE、XFCEなど）で、統一されたフォアグラウンドアプリケーション照会APIが存在しない
- Linux DBusはアクティブウィンドウを取得できるが、実装は複雑でデスクトップ環境に依存する
- 現在のバージョンは安定性を優先し、Linuxのフォーカス検出はまだ実装されていない

### なぜLinuxはクリックフォーカスをサポートしないのか？

ソースコードでは、`sendNotification()`関数はmacOS上でのみ`activate`オプションを設定します：

```typescript
// src/notify.ts:238-240
// macOS特有：通知をクリックしてターミナルにフォーカス
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**理由**：
- notify-sendは`activate`パラメータをサポートしていない
- Linux通知はアプリケーションIDでのみ関連付けられ、動的なターゲットウィンドウ指定ができない
- 通知をクリックすると通知センターが開き、特定のウィンドウにはフォーカスしない

### なぜLinuxはカスタムサウンドをサポートしないのか？

::: details サウンド設定の原理

macOSでは、`sendNotification()`は`sound`パラメータをシステム通知に渡します：

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOSはこのパラメータを受け入れる
	}
	
	// macOS特有：通知をクリックしてターミナルにフォーカス
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-sendはカスタムサウンドパラメータをサポートしていないため、`sounds`設定はLinuxでは無効です。
:::

## Linuxプラットフォームのベストプラクティス

### 設定の推奨事項

Linuxはフォーカス検出をサポートしていないため、通知ノイズを減らすために設定を調整することを推奨します。

**推奨設定**：

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**設定の説明**：
- `notifyChildSessions: false` - 親セッションのみ通知し、子タスクのノイズを回避
- `quietHours.enabled: true` - 静寂時間を有効にし、夜間の妨害を回避

### サポートされていない設定項目

以下の設定項目はLinuxでは無効です：

| 設定項目 | macOS効果 | Linux効果 |
| --- | --- | --- |
| `sounds.idle` | Glassサウンドを再生 | システムデフォルトサウンドを使用 |
| `sounds.error` | Bassoサウンドを再生 | システムデフォルトサウンドを使用 |
| `sounds.permission` | Submarineサウンドを再生 | システムデフォルトサウンドを使用 |

### 使用のヒント

**ヒント 1：手動で通知を閉じる**

ターミナルを表示していて、妨害されたくない場合：

1. 画面右上の通知アイコンをクリック
2. opencode-notifyの通知を閉じる

**ヒント 2：静寂時間を使用する**

作業時間と休憩時間を設定し、非作業時間の妨害を回避：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**ヒント 3：一時的にプラグインを無効化**

通知を完全に無効化する必要がある場合、`quietHours`設定で終日静寂を設定するか、設定ファイルを削除/リネームしてプラグインを無効化することを推奨します。

**ヒント 4：システム通知音を設定**

opencode-notifyはカスタムサウンドをサポートしていませんが、システム設定でデフォルト通知音を変更できます：

- **GNOME**：設定 → サウンド → システム音
- **KDE**：システム設定 → 通知 → デフォルトサウンド
- **XFCE**：設定 → 外観 → 通知 → サウンド

## 実践してみよう

### Linux通知の検証

**ステップ 1：テスト通知をトリガー**

OpenCodeでシンプルなタスクを入力：

```
1+1の結果を計算してください。
```

**確認すべきこと**：
- 画面右上にnotify-send通知がポップアップする（GNOME/Ubuntu）
- 通知タイトルは「Ready for review」
- システムデフォルト通知音が再生される

**ステップ 2：フォーカス抑制をテスト（非サポートを検証）**

ターミナルウィンドウをフォアグラウンドに保ったまま、再度タスクをトリガー。

**確認すべきこと**：
- 通知はまだポップアップする（Linuxはフォーカス検出をサポートしていないため）

**ステップ 3：通知をクリックしてテスト**

ポップアップした通知をクリック。

**確認すべきこと**：
- 通知センターが展開され、ターミナルウィンドウには切り替わらない

### 静寂時間の設定

**ステップ 1：設定ファイルを作成**

設定ファイルを編集（bash）：

```bash
nano ~/.config/opencode/kdco-notify.json
```

**ステップ 2：静寂時間設定を追加**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**ステップ 3：保存してテスト**

現在時刻が静寂時間に入るのを待ち、タスクをトリガー。

**確認すべきこと**：
- 通知がポップアップしない（静寂時間が有効）

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] notify-send通知が正常に表示される
- [ ] 通知に正しいタスクタイトルが表示される
- [ ] 静寂時間設定が有効になっている
- [ ] Linuxプラットフォームでサポートされていない機能を理解している

## トラブルシューティング

### よくある問題 1：通知が表示されない

**原因 1**：notify-sendがインストールされていない

**解決方法**：

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**原因 2**：Linux通知パーミッションが付与されていない

**解決方法**：

1. システム設定を開く
2. 「通知」または「プライバシー」→「通知」を探す
3. 「アプリケーションによる通知の送信を許可」が有効になっていることを確認
4. OpenCodeを探し、通知パーミッションが有効になっていることを確認

### よくある問題 2：ターミナル検出に失敗する

**原因**：`detect-terminal`があなたのターミナルを認識できない

**解決方法**：

設定ファイルで手動でターミナルタイプを指定：

```json
{
  "terminal": "gnome-terminal"
}
```

### よくある問題 3：カスタムサウンドが有効にならない

**原因**：Linuxプラットフォームはカスタムサウンドをサポートしていない

**説明**：これは正常な動作です。notify-sendはシステムデフォルトサウンドを使用し、設定ファイルから変更できません。

**解決方法**：システム設定でデフォルト通知音を変更する。

### よくある問題 4：通知をクリックしてもターミナルにフォーカスしない

**原因**：notify-sendは`activate`パラメータをサポートしていない

**説明**：これはLinux APIの制限です。通知をクリックすると通知センターが開き、ターミナルウィンドウに手動で切り替える必要があります。

### よくある問題 5：異なるデスクトップ環境での通知動作の違い

**現象**：異なるデスクトップ環境（GNOME、KDE、XFCE）で、通知の表示位置や動作が異なる場合がある。

**説明**：これは正常です。各デスクトップ環境には独自の通知システム実装があります。

**解決方法**：使用しているデスクトップ環境に応じて、システム設定の通知動作を調整してください。

## レッスンサマリー

このレッスンでは、以下について学びました：

- ✅ Linuxプラットフォームはネイティブ通知とターミナル検出をサポート
- ✅ Linuxはフォーカス検出とクリックフォーカスをサポートしていない
- ✅ Linuxはカスタムサウンドをサポートしていない
- ✅ 推奨設定（静寂時間、親セッションのみ通知）
- ✅ よくある問題の解決方法

**重要ポイント**：
1. Linuxプラットフォーム機能は比較的基本的だが、コア通知機能は完全
2. フォーカス検出とクリックフォーカスはmacOS独自の機能
3. 静寂時間設定を通じて通知ノイズを減らせる
4. ターミナル検出は手動指定をサポートし、互換性を向上
5. notify-sendは事前にインストールが必要（一部のディストリビューションではデフォルトで含まれる）

## 次のレッスンの予告

> 次のレッスンでは**[サポートされるターミナル](../../terminals/)**を学びます。
>
> 学べること：
> - opencode-notifyがサポートする37以上のターミナルリスト
> - 異なるターミナルの検出メカニズム
> - ターミナルタイプの上書き設定方法
> - VS Code統合ターミナルの使用ヒント

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコード位置を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Linuxプラットフォーム制限チェック（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linuxプラットフォーム制限チェック（フォーカス検出） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS固有：クリックフォーカス | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知送信（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| ターミナル検出（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 設定読み込み（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**主要関数**：
- `runOsascript()`：macOSでのみ実行、Linuxではnullを返す
- `isTerminalFocused()`：Linuxでは直接falseを返す
- `sendNotification()`：macOSでのみ`activate`パラメータを設定
- `detectTerminalInfo()`：クロスプラットフォームターミナル検出

**プラットフォーム判定**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

**Linux通知依存関係**：
- 外部依存：`node-notifier` → `notify-send`コマンド
- システム要件：libnotify-binまたは同等のパッケージ

</details>
