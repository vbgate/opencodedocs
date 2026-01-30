---
title: "opencode-notify 設定リファレンス：完全な設定項目の説明とプラットフォームの違い | チュートリアル"
sidebarTitle: "通知動作のカスタマイズ"
subtitle: "設定リファレンス：完全な設定項目の説明"
description: "opencode-notify の完全な設定項目について学びましょう。サブセッション通知の切り替え、カスタム効果音、ミュート時間帯、ターミナルタイプの上書きなどを含みます。本チュートリアルでは、詳細な設定パラメータの説明、デフォルト値、プラットフォーム間の違い、および完全なサンプルを提供し、通知動作をカスタマイズしてワークフローを最適化し、macOS、Windows、Linux での設定テクニックを習得できます。"
tags:
  - "設定リファレンス"
  - "高度な設定"
prerequisite:
  - "start-quick-start"
order: 70
---

# 設定リファレンス

## 学習後にできること

- ✅ すべての設定可能なパラメータとその意味を理解する
- ✅ ニーズに応じて通知動作をカスタマイズする
- ✅ 特定の時間帯に通知を防ぐためのミュート時間帯を設定する
- ✅ プラットフォームの違いが設定に与える影響を理解する

## 現在の課題

デフォルトの設定でも十分に使えますが、あなたのワークフローには特殊な部分があるかもしれません：
- 夜間も重要な通知を受け取りたいが、普段は邪魔されたくない
- 複数セッションを並行して使用しており、すべてのセッションに通知してほしい
- tmux で作業しており、フォーカス検出が期待通り動作していない
- ある設定項目が何のためにあるのか知りたい

## この機能を使うタイミング

- **通知動作をカスタマイズしたい** - デフォルト設定が作業習慣に合わない場合
- **通知の妨げを減らしたい** - ミュート時間帯やサブセッションの切り替えを設定したい場合
- **プラグイン動作をデバッグしたい** - 各設定項目の役割を理解したい場合
- **複数のプラットフォームで使用する** - プラットフォームの違いが設定に与える影響を知りたい場合

## 基本的な考え方

設定ファイルを使用することで、コードを変更せずにプラグインの動作を調整できます。これはプラグインの「設定メニュー」のようなものです。設定ファイルは JSON 形式で、`~/.config/opencode/kdco-notify.json` に配置します。

**設定の読み込みフロー**：

```
プラグイン起動
    ↓
ユーザーの設定ファイルを読み込む
    ↓
デフォルト設定とマージ（ユーザー設定が優先）
    ↓
マージ後の設定を使用して実行
```

::: info 設定ファイルのパス
`~/.config/opencode/kdco-notify.json`
:::

## 📋 設定項目の説明

### 完全な設定構造

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": ""
}
```

### 項目別の説明

#### notifyChildSessions

| 設定項目 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `notifyChildSessions` | boolean | `false` | サブセッションに通知するかどうか |

**作用**：サブセッション（sub-session）に対して通知を送信するかどうかを制御します。

**サブセッションとは**：
OpenCode のマルチセッション機能を使用している場合、セッションは親セッションと子セッションに分類されます。子セッションは通常、親セッションによって開始される補助タスク（ファイルの読み書き、ネットワークリクエストなど）です。

**デフォルト動作**（`false`）：
- 親セッションの完了、エラー、権限リクエストイベントのみ通知
- 子セッションのイベントは通知しない
- これにより、複数タスクの並行処理時に大量の通知が発生するのを防ぐ

**有効化後**（`true`）：
- すべてのセッション（親セッションと子セッション）に通知
- すべてのサブタスクの進捗を追跡する必要がある場面に適している

::: tip 推奨設定
デフォルトの `false` を維持してください。各サブタスクの状態を追跡する必要がある場合のみ有効にしてください。
:::

#### フォーカス検出（macOS）

プラグインは自動的にターミナルがフォアグラウンドにあるかどうかを検出し、ターミナルが現在のアクティブウィンドウの場合、通知の送信を抑制して重複した通知を避けます。

**動作原理**：
- macOS の `osascript` を使用して現在のフォアグラウンドアプリを検出
- フォアグラウンドアプリのプロセス名とターミナルのプロセス名を比較
- ターミナルがフォアグラウンドの場合、通知を送信しない
- **質問通知は例外**（tmux ワークフローをサポート）

::: info プラットフォームの違い
フォーカス検出機能は macOS でのみ有効です。Windows と Linux ではこの機能はサポートされていません。
:::

#### sounds

| 設定項目 | 型 | デフォルト値 | プラットフォームサポート | 説明 |
| --- | --- | --- | --- | --- |
| `sounds.idle` | string | `"Glass"` | ✅ macOS | タスク完了時の効果音 |
| `sounds.error` | string | `"Basso"` | ✅ macOS | エラー通知時の効果音 |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | 権限リクエスト時の効果音 |
| `sounds.question` | string | 未設定 | ✅ macOS | 質問通知時の効果音（オプション） |

**作用**：異なるタイプの通知に対して異なるシステム効果音を設定します（macOS のみ）。

**使用可能な効果音一覧**：

| 効果音名 | 聴感の特徴 | 推奨シーン |
| --- | --- | --- |
| Glass | 軽快で、クリア | タスク完了（デフォルト） |
| Basso | 低く、警告的 | エラー通知（デフォルト） |
| Submarine | 通知、柔和 | 権限リクエスト（デフォルト） |
| Blow | 力強い | 重要なイベント |
| Bottle | クリア | サブタスク完了 |
| Frog | リラックス | 非公式な通知 |
| Funk | リズミカル | 複数タスク完了 |
| Hero | 壮大 | マイルストーン完了 |
| Morse | モールス信号 | デバッグ関連 |
| Ping | クリア | 軽量な通知 |
| Pop | 短い | クイックタスク |
| Purr | 柔和 | 邪魔にならない通知 |
| Sosumi | 独特 | 特殊なイベント |
| Tink | 清澄 | 小さなタスク完了 |

**question フィールドの説明**：
`question` フィールドは AI が質問する通知に対して使用されます。未設定の場合、`permission` の効果音が使用されます。

::: tip 効果音の設定テクニック
- 成功を軽快な効果音で表現（idle）
- エラーを低い効果音で表現（error）
- 注意が必要なことを柔和な効果音で表現（permission、question）
- 異なる効果音の組み合わせで、通知を見なくても状況を把握できる
:::

::: warning プラットフォームの違い
`sounds` の設定は macOS でのみ有効です。Windows と Linux ではシステムのデフォルト通知音が使用され、カスタマイズできません。
:::

#### quietHours

| 設定項目 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `quietHours.enabled` | boolean | `false` | ミュート時間帯を有効にするかどうか |
| `quietHours.start` | string | `"22:00"` | ミュート開始時刻（HH:MM 形式） |
| `quietHours.end` | string | `"08:00"` | ミュート終了時刻（HH:MM 形式） |

**作用**：指定した時間帯内ですべての通知の送信を抑制します。

**デフォルト動作**（`enabled: false`）：
- ミュート時間帯を有効にしない
- いつでも通知を受け取ることが可能

**有効化後**（`enabled: true`）：
- `start` から `end` の時間帯内では、すべての通知を送信しない
- 午夜をまたぐ時間帯もサポート（例：22:00-08:00）

**時刻形式**：
- 24時間制の `HH:MM` 形式を使用
- 例：`"22:30"` は午後10時30分を表す

**午夜をまたぐ時間帯**：
- `start > end` の場合（例：22:00-08:00）、午夜をまたぐことを示す
- 夜の22:00から翌朝の08:00までがミュート時間帯内

::: info ミュート時間帯の優先度
ミュート時間帯の優先度は最も高いです。他の条件がすべて満たされていても、ミュート時間帯内であれば通知は送信されません。
:::

#### terminal

| 設定項目 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `terminal` | string | 未設定 | 手動でターミナルタイプを指定（自動検出を上書き） |

**作用**：使用しているターミナルエミュレータのタイプを手動で指定し、プラグインの自動検出を上書きします。

**デフォルト動作**（未設定）：
- プラグインは `detect-terminal` ライブラリを使用してターミナルを自動検出
- 37以上のターミナルエミュレータをサポート

**設定後**：
- プラグインは指定されたターミナルタイプを使用
- フォーカス検出とクリックフォーカス機能に使用されます（macOS）

**よく使われるターミナルの値**：

| ターミナルアプリ | 設定値 |
| --- | --- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code 統合ターミナル | `"vscode"` |

::: tip 手動設定が必要な場合
- 自動検出に失敗し、フォーカス検出が動作しない場合
- 複数のターミナルを使用し、特定のターミナルを指定する必要がある場合
- 使用しているターミナルの名前がよく使われるリストにない場合
:::

## プラットフォームの違いのまとめ

異なるプラットフォームでは、設定項目のサポート程度が異なります：

| 設定項目 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| フォーカス検出（ハードコード） | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Windows/Linux ユーザーの注意
`sounds` の設定とフォーカス検出機能は Windows と Linux では無効です。
- Windows/Linux ではシステムのデフォルト通知音が使用されます
- Windows/Linux ではフォーカス検出をサポートしていません（設定で制御できません）
:::

## 設定サンプル

### 基本設定（推奨）

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

この設定はほとんどのユーザーに適しています：
- 親セッションのみ通知し、サブタスクのノイズを回避
- macOS ではターミナルがフォアグラウンドの場合、自動的に通知を抑制（設定不要）
- デフォルトの効果音の組み合わせを使用
- ミュート時間帯を有効にしない

### ミュート時間帯を有効にする

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

夜間に邪魔されないようにしたいユーザーに適しています：
- 夜10時から朝8時までの間は通知を送信しない
- それ以外の時間は通常通り通知

### すべてのサブタスクを追跡

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

すべてのタスクの進捗を追跡する必要があるユーザーに適しています：
- すべてのセッション（親セッションと子セッション）に通知
- 質問通知に独立した効果音を設定（Ping）

### ターミナルを手動で指定

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

自動検出に失敗した場合や、複数のターミナルを使用しているユーザーに適しています：
- Ghostty ターミナルを手動で指定
- フォーカス検出とクリックフォーカス機能が正常に動作することを確認

### Windows/Linux の最小設定

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Windows/Linux ユーザー向け（シンプルな設定）：
- プラットフォームでサポートされている設定項目のみを保持
- `sounds` の設定とフォーカス検出機能は Windows/Linux では無効なので、設定する必要はありません

## 設定ファイルの管理

### 設定ファイルの作成

**macOS/Linux**：

```bash
# 設定ディレクトリを作成（存在しない場合）
mkdir -p ~/.config/opencode

# 設定ファイルを作成
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**：

```powershell
# 設定ディレクトリを作成（存在しない場合）
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# 設定ファイルを作成
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### 設定ファイルの検証

**ファイルが存在するか確認**：

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**設定が有効になっているか確認**：

1. 設定ファイルを変更
2. OpenCode を再起動（または設定の再読み込みをトリガー）
3. 通知動作が期待通りか観察

### 設定ファイルのエラー処理

設定ファイルの形式がエラーの場合：
- プラグインはエラーの設定ファイルを無視
- デフォルト設定を使用して実行を継続
- OpenCode のログに警告メッセージを出力

**よくある JSON エラー**：

| エラータイプ | 例 | 修正方法 |
| --- | --- | --- |
| カンマの欠落 | `"key1": "value1" "key2": "value2"` | カンマを追加：`"key1": "value1",` |
| 余分なカンマ | `"key1": "value1",}` | 最後のカンマを削除：`"key1": "value1"}` |
| 引用符が閉じていない | `"key": value` | 引用符を追加：`"key": "value"` |
| 単一引用符の使用 | `'key': 'value'` | 二重引用符を使用：`"key": "value"` |
| コメント構文のエラー | `{"key": "value" /* comment */}` | JSON はコメントをサポートしません、コメントを削除 |

::: tip JSON 検証ツールを使用
オンライン JSON 検証ツール（jsonlint.com など）を使用して、設定ファイルの形式が正しいか確認できます。
:::

## 本レッスンのまとめ

本レッスンでは、opencode-notify の完全な設定リファレンスを提供しました：

**主要な設定項目**：

| 設定項目 | 作用 | デフォルト値 | プラットフォームサポート |
| --- | --- | --- | --- |
| `notifyChildSessions` | サブセッション通知の切り替え | `false` | 全プラットフォーム |
| フォーカス検出 | ターミナルフォーカスの抑制（ハードコード） | 設定なし | macOS のみ |
| `sounds.*` | カスタム効果音 | 各フィールドを参照 | macOS のみ |
| `quietHours.*` | ミュート時間帯の設定 | 各フィールドを参照 | 全プラットフォーム |
| `terminal` | ターミナルの手動指定 | 未設定 | 全プラットフォーム |

**設定の原則**：
- **ほとんどのユーザー**：デフォルト設定を使用すれば十分
- **ミュートが必要な場合**：`quietHours` を有効にする
- **サブタスクの追跡が必要な場合**：`notifyChildSessions` を有効にする
- **macOS ユーザー**：`sounds` をカスタマイズし、自動フォーカス検出を利用可能
- **Windows/Linux ユーザー**：設定項目が少ないため、`notifyChildSessions` と `quietHours` に注目

**設定ファイルのパス**：`~/.config/opencode/kdco-notify.json`

## 次のレッスンの予告

> 次のレッスンでは **[ミュート時間帯の詳細](../quiet-hours/)** を学びます。
>
> 学習内容：
> - ミュート時間帯の詳細な動作原理
> - 午夜をまたぐ時間帯の設定方法
> - ミュート時間帯と他の設定の優先度
> - よくある問題と解決策

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行号 |
| --- | --- | --- |
| 設定インターフェース定義 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| デフォルト設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 設定ファイルの読み込み | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| サブセッションチェック | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| ターミナルフォーカスチェック | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| ミュート時間帯チェック | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 効果音設定の使用 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README 設定サンプル | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**設定インターフェース** (NotifyConfig)：

```typescript
interface NotifyConfig {
  /** Notify for child/sub-session events (default: false) */
  notifyChildSessions: boolean
  /** Sound configuration per event type */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" format
    end: string // "HH:MM" format
  }
  /** Override terminal detection (optional) */
  terminal?: string
}
```

**注意**：設定インターフェースには **`suppressWhenFocused`** フィールドはありません。フォーカス検出は macOS プラットフォームのハードコードされた動作であり、ユーザーは設定ファイルで制御できません。

**デフォルト設定** (DEFAULT_CONFIG)：

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // タスク完了時の効果音
    error: "Basso",     // エラー時の効果音
    permission: "Submarine",  // 権限リクエスト時の効果音
  },
  quietHours: {
    enabled: false,     // デフォルトでミュート時間帯を無効
    start: "22:00",    // 夜10時
    end: "08:00",      // 朝8時
  },
}
```

**設定読み込み関数** (loadConfig)：

- パス：`~/.config/opencode/kdco-notify.json`
- `fs.readFile()` を使用して設定ファイルを読み込む
- `DEFAULT_CONFIG` とマージ（ユーザー設定が優先）
- ネストされたオブジェクト（`sounds`、`quietHours`）もマージされる
- 設定ファイルが存在しない、または形式エラーの場合、デフォルト設定を使用

**サブセッションチェック** (isParentSession)：

- `sessionID` に `/` が含まれているかをチェック（サブセッションの識別子）
- `notifyChildSessions` が `false` の場合、サブセッションの通知をスキップ
- 権限リクエスト通知（`permission.updated`）は常に送信され、この制限を受けません

**ターミナルフォーカスチェック** (isTerminalFocused)：

- `osascript` を使用して現在のフォアグラウンドアプリのプロセス名を取得
- ターミナルの `processName` と比較（大文字小文字を区別しない）
- macOS プラットフォームでのみ有効、**設定で無効にできません**
- 質問通知（`question`）はフォーカスチェックを行いません（tmux ワークフローをサポート）

**ミュート時間帯チェック** (isQuietHours)：

- 現在の時刻を分単位に変換（午夜0時から）
- 設定された `start` と `end` と比較
- 午夜をまたぐ時間帯をサポート（例：22:00-08:00）
- `start > end` の場合、午夜をまたぐことを示す

**効果音設定の使用** (sendNotification)：

- 設定から対応するイベントの効果音名を読み込む
- `node-notifier` の `sound` オプションに渡す
- macOS プラットフォームでのみ有効
- `question` イベントに効果音が設定されていない場合、`permission` の効果音を使用

</details>
