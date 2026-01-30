---
title: "設定ファイルの例：notifyChildSessions と sounds の説明 | opencode-notify チュートリアル"
sidebarTitle: "カスタム設定ファイル"
subtitle: "設定ファイルの例：notifyChildSessions と sounds の説明"
description: "opencode-notify の完全な設定ファイル例を確認し、notifyChildSessions、sounds、quietHours、terminal などすべての設定フィールドの詳細な注釈、デフォルト値の設定、最小構成例、macOS で利用可能なサウンドエフェクトの完全なリスト、プラグインの無効化方法を学び、更新履歴へのリンクでバージョン履歴と新機能の改善を確認できます。"
tags:
  - "設定"
  - "サンプル"
  - "付録"
order: 140
---

# 設定ファイルの例

## 完全な設定例

以下の内容を `~/.config/opencode/kdco-notify.json` に保存してください：

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
  "terminal": "Ghostty"
}
```

## フィールドの説明

### notifyChildSessions

- **型**：boolean
- **デフォルト値**：`false`
- **説明**：子セッション（サブタスク）を通知するかどうか

デフォルトでは、プラグインは親セッションのみを通知し、サブタスクによる通知ノイズを回避します。すべてのサブタスクの完了状態を追跡する必要がある場合は、`true` に設定してください。

```json
{
  "notifyChildSessions": false  // 親セッションのみ通知（推奨）
}
```

### sounds

サウンドエフェクトの設定で、macOS プラットフォームでのみ有効です。

#### sounds.idle

- **型**：string
- **デフォルト値**：`"Glass"`
- **説明**：タスク完了時のサウンドエフェクト

AI セッションがアイドル状態（タスク完了）になったときに再生されます。

#### sounds.error

- **型**：string
- **デフォルト値**：`"Basso"`
- **説明**：エラー発生時のサウンドエフェクト

AI セッションの実行中にエラーが発生したときに再生されます。

#### sounds.permission

- **型**：string
- **デフォルト値**：`"Submarine"`
- **説明**：権限リクエスト時のサウンドエフェクト

AI が特定の操作を実行するためにユーザーの承認を必要とするときに再生されます。

#### sounds.question

- **型**：string（オプション）
- **デフォルト値**：未設定（permission のサウンドエフェクトを使用）
- **説明**：質問時のサウンドエフェクト

AI がユーザーに質問するときに再生されます。設定しない場合は、`permission` のサウンドエフェクトが使用されます。

### quietHours

サイレント時間帯の設定で、指定した時間帯に通知による中断を避けることができます。

#### quietHours.enabled

- **型**：boolean
- **デフォルト値**：`false`
- **説明**：サイレント時間帯を有効にするかどうか

#### quietHours.start

- **型**：string
- **デフォルト値**：`"22:00"`
- **説明**：サイレント開始時刻（24 時間制、HH:MM 形式）

#### quietHours.end

- **型**：string
- **デフォルト値**：`"08:00"`
- **説明**：サイレント終了時刻（24 時間制、HH:MM 形式）

深夜をまたぐ時間帯をサポートしています。例えば、`"22:00"` から `"08:00"` は、夜 10 時から翌朝 8 時まで通知を送信しないことを意味します。

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **型**：string（オプション）
- **デフォルト値**：未設定（自動検出）
- **説明**：ターミナルタイプを手動で指定し、自動検出結果を上書きします

自動検出が失敗した場合や手動で指定する必要がある場合は、使用しているターミナル名を設定できます。

```json
{
  "terminal": "Ghostty"  // または "iTerm"、"Kitty"、"WezTerm" など
}
```

## macOS で利用可能なサウンドエフェクト一覧

以下は macOS システムに内蔵されている通知サウンドエフェクトで、`sounds` 設定に使用できます：

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## 最小構成例

少数の設定のみを変更したい場合は、変更が必要なフィールドのみを含めることができます。その他のフィールドはデフォルト値が使用されます：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## プラグインの無効化

プラグインを一時的に無効にするには、設定ファイルを削除するだけで、プラグインはデフォルト設定に戻ります。

## 次のレッスンの予告

> 次のレッスンでは **[更新履歴](../changelog/release-notes/)** を学びます。
>
> 学べる内容：
> - バージョン履歴と重要な変更点
> - 新機能と改善の記録
