---
title: "Windows プラットフォームガイド：ネイティブ通知、ターミナル検出、設定詳解 | opencode-notify チュートリアル"
sidebarTitle: "Windows で通知を使う"
subtitle: "Windows プラットフォーム機能：ネイティブ通知とターミナル検出"
description: "opencode-notify の Windows プラットフォームでの機能と制限を学びます。Windows ネイティブ通知とターミナル検出機能を習得し、macOS プラットフォームとの機能差異を理解し、最適な通知戦略を設定して効率を向上させ、通知による邪魔を避けて集中した作業状態を維持します。"
tags:
  - "Windows"
  - "プラットフォーム機能"
  - "ターミナル検出"
prerequisite:
  - "start-quick-start"
order: 40
---

# Windows プラットフォーム機能：ネイティブ通知とターミナル検出

## このチュートリアルで学べること

- opencode-notify が Windows プラットフォームでサポートする機能を理解する
- Windows ターミナル検出の仕組みを習得する
- macOS プラットフォームとの機能差異を理解する
- Windows に適した通知戦略を設定する

## 今あなたが抱えている課題

Windows で OpenCode を使用していると、一部の機能が macOS ほどスマートではないことに気づくかもしれません。ターミナルにフォーカスしていても通知が表示され、通知をクリックしてもターミナルウィンドウに戻れません。これは正常な動作でしょうか？Windows プラットフォームにはどのような制限があるのでしょうか？

## こんな時に使おう

**以下のシナリオで Windows プラットフォームの特性を理解しましょう**：
- Windows システムで opencode-notify を使用している
- 一部の macOS 機能が Windows で利用できないことに気づいた
- Windows プラットフォームで利用可能な機能を最大限に活用したい

## 基本コンセプト

opencode-notify は Windows プラットフォームで**基本的な通知機能**を提供しますが、macOS と比較していくつかの機能制限があります。これはオペレーティングシステムの特性によるもので、プラグインの問題ではありません。

::: info なぜ macOS の方が機能が豊富なのか？

macOS はより強力なシステム API を提供しています：
- NSUserNotificationCenter がクリックフォーカスをサポート
- AppleScript でフォアグラウンドアプリを検出可能
- システムサウンド API でカスタムサウンドを設定可能

Windows と Linux のシステム通知 API は比較的基本的で、opencode-notify はこれらのプラットフォームで `node-notifier` を通じてシステムネイティブ通知を呼び出します。
:::

## Windows プラットフォーム機能一覧

| 機能 | Windows | 説明 |
| --- | --- | --- |
| **ネイティブ通知** | ✅ サポート | Windows Toast で通知を送信 |
| **ターミナル検出** | ✅ サポート | 37以上のターミナルエミュレーターを自動認識 |
| **フォーカス検出** | ❌ 非サポート | ターミナルがフォアグラウンドウィンドウかどうかを検出できない |
| **クリックフォーカス** | ❌ 非サポート | 通知をクリックしてもターミナルに切り替わらない |
| **カスタムサウンド** | ❌ 非サポート | システムデフォルトの通知サウンドを使用 |

### Windows 通知メカニズム

opencode-notify は Windows で **Windows Toast** 通知を使用し、`node-notifier` ライブラリを通じてシステムネイティブ API を呼び出します。

**通知トリガーのタイミング**：
- AI タスク完了時（session.idle）
- AI 実行エラー時（session.error）
- AI が権限を必要とする時（permission.updated）
- AI が質問する時（tool.execute.before）

::: tip Windows Toast 通知の特徴
- 通知は画面右下に表示
- 自動的に消える（約5秒）
- システムデフォルトの通知サウンドを使用
- 通知をクリックすると通知センターが開く（ターミナルには切り替わらない）
:::

## ターミナル検出

### ターミナルの自動認識

opencode-notify は `detect-terminal` ライブラリを使用して、使用しているターミナルエミュレーターを自動検出します。

**Windows でサポートされているターミナル**：
- Windows Terminal（推奨）
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code 統合ターミナル

::: details ターミナル検出の原理
プラグイン起動時、`detect-terminal()` がシステムプロセスをスキャンし、現在のターミナルタイプを識別します。

ソースコードの場所：`src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows では bundleId は不要
		processName: null,  // Windows ではプロセス名は不要
	}
}
```
:::

### ターミナルの手動指定

自動検出が失敗した場合、設定ファイルでターミナルタイプを手動で指定できます。

**設定例**：

```json
{
  "terminal": "Windows Terminal"
}
```

**利用可能なターミナル名**：[`detect-terminal` がサポートするターミナルリスト](https://github.com/jonschlinkert/detect-terminal#supported-terminals)を参照してください。

## プラットフォーム機能比較

| 機能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **ネイティブ通知** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **カスタムサウンド** | ✅ システムサウンドリスト | ❌ システムデフォルト | ❌ システムデフォルト |
| **フォーカス検出** | ✅ AppleScript API | ❌ 非サポート | ❌ 非サポート |
| **クリックフォーカス** | ✅ activate bundleId | ❌ 非サポート | ❌ 非サポート |
| **ターミナル検出** | ✅ 37以上のターミナル | ✅ 37以上のターミナル | ✅ 37以上のターミナル |

### なぜ Windows はフォーカス検出をサポートしないのか？

ソースコードでは、`isTerminalFocused()` 関数は Windows で直接 `false` を返します：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux は直接 false を返す
	// ... macOS のフォーカス検出ロジック
}
```

**理由**：
- Windows は macOS の AppleScript のようなフォアグラウンドアプリ照会 API を提供していない
- Windows PowerShell でフォアグラウンドウィンドウを取得できるが、COM インターフェースの呼び出しが必要で実装が複雑
- 現在のバージョンは安定性を優先し、Windows フォーカス検出は未実装

### なぜ Windows はクリックフォーカスをサポートしないのか？

ソースコードでは、`sendNotification()` 関数は macOS でのみ `activate` オプションを設定します：

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**理由**：
- Windows Toast は `activate` パラメータをサポートしていない
- Windows 通知はアプリ ID でのみ関連付けられ、ターゲットウィンドウを動的に指定できない
- 通知をクリックすると通知センターが開き、特定のウィンドウにフォーカスしない

## Windows プラットフォームのベストプラクティス

### 設定の推奨事項

Windows はフォーカス検出をサポートしていないため、通知ノイズを減らすために設定を調整することをお勧めします。

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
- `notifyChildSessions: false` - 親セッションのみ通知し、サブタスクのノイズを回避
- `quietHours.enabled: true` - 静音時間を有効にし、夜間の邪魔を回避

### サポートされていない設定項目

以下の設定項目は Windows では無効です：

| 設定項目 | macOS での効果 | Windows での効果 |
| --- | --- | --- |
| `sounds.idle` | Glass サウンドを再生 | システムデフォルトサウンドを使用 |
| `sounds.error` | Basso サウンドを再生 | システムデフォルトサウンドを使用 |
| `sounds.permission` | Submarine サウンドを再生 | システムデフォルトサウンドを使用 |

### 使用のヒント

**ヒント 1：通知を手動でオフにする**

ターミナルを見ていて邪魔されたくない場合：

1. タスクバーの「アクションセンター」アイコンをクリック（Windows + A）
2. opencode-notify の通知をオフにする

**ヒント 2：静音時間を使用する**

作業時間と休憩時間を設定し、非作業時間の邪魔を避ける：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**ヒント 3：プラグインを一時的に無効にする**

通知を完全に無効にする必要がある場合、設定ファイルを削除するか、静音時間を終日に設定できます：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## 手順

### Windows 通知の確認

**ステップ 1：テスト通知をトリガー**

OpenCode で簡単なタスクを入力します：

```
1+1 の結果を計算してください。
```

**期待される結果**：
- 右下に Windows Toast 通知が表示される
- 通知タイトルは "Ready for review"
- システムデフォルトの通知サウンドが再生される

**ステップ 2：フォーカス抑制のテスト（非サポートの確認）**

ターミナルウィンドウをフォアグラウンドに保ち、再度タスクをトリガーします。

**期待される結果**：
- 通知は引き続き表示される（Windows はフォーカス検出をサポートしていないため）

**ステップ 3：通知クリックのテスト**

表示された通知をクリックします。

**期待される結果**：
- 通知センターが展開され、ターミナルウィンドウには切り替わらない

### 静音時間の設定

**ステップ 1：設定ファイルを作成**

設定ファイルを編集（PowerShell）：

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**ステップ 2：静音時間設定を追加**

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

現在時刻が静音時間に入るのを待ち、タスクをトリガーします。

**期待される結果**：
- 通知が表示されない（静音時間が有効）

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] Windows Toast 通知が正常に表示される
- [ ] 通知に正しいタスクタイトルが表示される
- [ ] 静音時間設定が有効になっている
- [ ] Windows プラットフォームでサポートされていない機能を理解している

## よくある問題と解決策

### よくある問題 1：通知が表示されない

**原因**：Windows 通知権限が付与されていない

**解決方法**：

1. 「設定」→「システム」→「通知」を開く
2. 「アプリやその他の送信者からの通知を取得する」がオンになっていることを確認
3. OpenCode を見つけ、通知権限がオンになっていることを確認

### よくある問題 2：ターミナル検出が失敗する

**原因**：`detect-terminal` がターミナルを認識できない

**解決方法**：

設定ファイルでターミナルタイプを手動で指定：

```json
{
  "terminal": "Windows Terminal"
}
```

### よくある問題 3：カスタムサウンドが機能しない

**原因**：Windows プラットフォームはカスタムサウンドをサポートしていない

**説明**：これは正常な動作です。Windows Toast 通知はシステムデフォルトサウンドを使用し、設定ファイルで変更することはできません。

### よくある問題 4：通知クリックでターミナルにフォーカスしない

**原因**：Windows Toast は `activate` パラメータをサポートしていない

**説明**：これは Windows API の制限です。通知をクリックすると通知センターが開き、手動でターミナルウィンドウに切り替える必要があります。

## このレッスンのまとめ

このレッスンで学んだこと：

- ✅ Windows プラットフォームはネイティブ通知とターミナル検出をサポート
- ✅ Windows はフォーカス検出とクリックフォーカスをサポートしていない
- ✅ Windows はカスタムサウンドをサポートしていない
- ✅ 推奨設定（静音時間、親セッションのみ通知）
- ✅ よくある問題の解決方法

**重要なポイント**：
1. Windows プラットフォームの機能は比較的基本的だが、コア通知機能は完備
2. フォーカス検出とクリックフォーカスは macOS 固有の機能
3. 静音時間設定で通知ノイズを減らせる
4. ターミナル検出は手動指定をサポートし、互換性を向上

## 次のレッスン予告

> 次のレッスンでは **[Linux プラットフォーム機能](../linux/)** を学びます。
>
> 学べること：
> - Linux プラットフォームの通知メカニズム（notify-send）
> - Linux ターミナル検出機能
> - Windows プラットフォームとの機能比較
> - Linux ディストリビューションの互換性問題

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Windows プラットフォーム制限チェック（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows プラットフォーム制限チェック（フォーカス検出） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 固有：クリックフォーカス | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知送信（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| ターミナル検出（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 設定読み込み（クロスプラットフォーム） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**主要な関数**：
- `runOsascript()`：macOS でのみ実行、Windows では null を返す
- `isTerminalFocused()`：Windows では直接 false を返す
- `sendNotification()`：macOS でのみ `activate` パラメータを設定
- `detectTerminalInfo()`：クロスプラットフォームターミナル検出

**プラットフォーム判定**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

</details>
