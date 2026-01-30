---
title: "イベントタイプ解説：OpenCode 通知のトリガータイミング | opencode-notify"
sidebarTitle: "通知のタイミング"
subtitle: "イベントタイプ解説：OpenCode 通知のトリガータイミング"
description: "opencode-notify プラグインが監視する OpenCode イベントタイプを学習し、session.idle、session.error、permission.updated、tool.execute.before のトリガー条件とフィルタリングルールを理解しましょう。"
tags:
  - "付録"
  - "イベントタイプ"
  - "OpenCode"
prerequisite: []
order: 130
---

# イベントタイプ解説：OpenCode 通知のトリガータイミング

このページでは、`opencode-notify` プラグインが監視する **OpenCode イベントタイプ** とそのトリガー条件を説明します。プラグインは 4 種類のイベントを監視します：session.idle、session.error、permission.updated、tool.execute.before。これらのイベントのトリガータイミングとフィルタリングルールを理解することで、通知動作をより適切に設定できます。

## イベントタイプ一覧

| イベントタイプ | トリガータイミング | 通知タイトル | デフォルト音 | 親セッションチェック | ターミナルフォーカスチェック |
| --- | --- | --- | --- | --- | --- |
| `session.idle` | AI セッションがアイドル状態に移行 | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | AI セッションでエラー発生 | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI がユーザー認可を要求 | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI が質問（question ツール） | "Question for you" | Submarine* | ❌ | ❌ |

> *注：question イベントはデフォルトで permission の音を使用しますが、設定でカスタマイズ可能です

## イベント詳細説明

### session.idle

**トリガー条件**：AI セッションがタスク完了後にアイドル状態に移行

**通知内容**：
- タイトル：`Ready for review`
- メッセージ：セッションタイトル（最大 50 文字）

**処理ロジック**：
1. 親セッションかどうかをチェック（`notifyChildSessions=false` の場合）
2. サイレント時間帯かどうかをチェック
3. ターミナルがフォーカスされているかをチェック（フォーカス時は通知を抑制）
4. ネイティブ通知を送信

**ソースコード位置**：`src/notify.ts:249-284`

---

### session.error

**トリガー条件**：AI セッション実行中にエラーが発生

**通知内容**：
- タイトル：`Something went wrong`
- メッセージ：エラー概要（最大 100 文字）

**処理ロジック**：
1. 親セッションかどうかをチェック（`notifyChildSessions=false` の場合）
2. サイレント時間帯かどうかをチェック
3. ターミナルがフォーカスされているかをチェック（フォーカス時は通知を抑制）
4. ネイティブ通知を送信

**ソースコード位置**：`src/notify.ts:286-313`

---

### permission.updated

**トリガー条件**：AI が特定の操作の実行にユーザー認可を要求

**通知内容**：
- タイトル：`Waiting for you`
- メッセージ：`OpenCode needs your input`

**処理ロジック**：
1. **親セッションをチェックしない**（権限リクエストは常に人間の対応が必要）
2. サイレント時間帯かどうかをチェック
3. ターミナルがフォーカスされているかをチェック（フォーカス時は通知を抑制）
4. ネイティブ通知を送信

**ソースコード位置**：`src/notify.ts:315-334`

---

### tool.execute.before

**トリガー条件**：AI がツール実行前、ツール名が `question` の場合

**通知内容**：
- タイトル：`Question for you`
- メッセージ：`OpenCode needs your input`

**処理ロジック**：
1. **親セッションをチェックしない**
2. **ターミナルフォーカスをチェックしない**（tmux ワークフローをサポート）
3. サイレント時間帯かどうかをチェック
4. ネイティブ通知を送信

**特記事項**：このイベントはフォーカス検出を行いません。tmux マルチウィンドウワークフローで正常に通知を受け取れるようにするためです。

**ソースコード位置**：`src/notify.ts:336-351`

## トリガー条件とフィルタリングルール

### 親セッションチェック

デフォルトでは、プラグインは親セッション（ルートセッション）のみに通知し、子タスクからの大量の通知を防ぎます。

**チェックロジック**：
- `client.session.get()` でセッション情報を取得
- セッションに `parentID` がある場合、通知をスキップ

**設定オプション**：
- `notifyChildSessions: false`（デフォルト）- 親セッションのみに通知
- `notifyChildSessions: true` - すべてのセッションに通知

**適用イベント**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌（チェックしない）
- `tool.execute.before` ❌（チェックしない）

### サイレント時間帯チェック

設定されたサイレント時間帯内では、通知は送信されません。

**チェックロジック**：
- `quietHours.enabled`、`quietHours.start`、`quietHours.end` を読み取り
- 深夜をまたぐ時間帯をサポート（例：22:00-08:00）

**適用イベント**：
- すべてのイベント ✅

### ターミナルフォーカスチェック

ユーザーがターミナルを見ている場合、重複した通知を避けるために通知を抑制します。

**チェックロジック**：
- macOS：`osascript` でフォアグラウンドアプリ名を取得
- `frontmostApp` とターミナルの `processName` を比較

**適用イベント**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌（チェックしない、tmux をサポート）

## プラットフォーム差異

| 機能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| ネイティブ通知 | ✅ | ✅ | ✅ |
| ターミナルフォーカス検出 | ✅ | ❌ | ❌ |
| 通知クリックでターミナルにフォーカス | ✅ | ❌ | ❌ |
| カスタム音 | ✅ | ❌ | ❌ |

## 設定の影響

通知動作は設定ファイルでカスタマイズできます：

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
  }
}
```

**関連チュートリアル**：
- [設定リファレンス](../../advanced/config-reference/)
- [サイレント時間帯の詳細](../../advanced/quiet-hours/)

---

## 次のレッスン予告

> 次のレッスンでは **[設定ファイルサンプル](../config-file-example/)** を学びます。
>
> 学習内容：
> - 完全な設定ファイルテンプレート
> - すべての設定フィールドの詳細コメント
> - 設定ファイルのデフォルト値説明

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコード位置を表示</strong></summary>

> 更新日：2026-01-27

| イベントタイプ | ファイルパス | 行番号 | 処理関数 |
| --- | --- | --- | --- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| イベントリスナー設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**主要定数**：
- `DEFAULT_CONFIG` (L56-68)：デフォルト設定、音とサイレント時間帯の設定を含む
- `TERMINAL_PROCESS_NAMES` (L71-84)：ターミナル名から macOS プロセス名へのマッピング

**主要関数**：
- `sendNotification()` (L227-243)：ネイティブ通知を送信、macOS フォーカス機能を処理
- `isParentSession()` (L205-214)：親セッションかどうかをチェック
- `isQuietHours()` (L181-199)：サイレント時間帯かどうかをチェック
- `isTerminalFocused()` (L166-175)：ターミナルがフォーカスされているかをチェック（macOS のみ）

</details>
