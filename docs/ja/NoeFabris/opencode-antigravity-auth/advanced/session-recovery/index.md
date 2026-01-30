---
title: "セッション復旧: ツール中断の自動修復 | Antigravity"
sidebarTitle: "ツール中断自動修復"
subtitle: "セッション復旧：ツール呼び出し失敗と中断を自動処理"
description: "セッション復旧メカニズムを学び、ツール中断とエラーを自動処理します。エラー検出、synthetic tool_result 注入、auto_resume 設定をカバーします。"
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# セッション復旧：ツール呼び出し失敗と中断を自動処理

## 学習後にできること

- セッション復旧メカニズムがツール実行中断をどのように自動処理するかを理解する
- session_recovery および auto_resume オプションを設定する
- tool_result_missing および thinking_block_order エラーをトラブルシューティングする
- synthetic tool_result の仕組みを理解する

## 現在の課題

OpenCode を使用していると、以下のような中断シナリオに遭遇する可能性があります：

- ツール実行時に ESC を押して中断し、セッションがフリーズし、手動で再試行する必要がある
- 思考ブロック順序エラー（thinking_block_order）が発生し、AI が生成を続行できない
- 非思考モデルで思考機能を誤用（thinking_disabled_violation）
- 破損したセッション状態を手動で修復するのに時間を浪費する

## この手法を使用するタイミング

セッション復旧は以下のシナリオに適しています：

| シナリオ | エラータイプ | 復旧方法 |
| --- | --- | ---|
| ESC でツールを中断 | `tool_result_missing` | synthetic tool_result を自動注入 |
| 思考ブロック順序エラー | `thinking_block_order` | 空の思考ブロックを自動プリセット |
| 非思考モデルで思考を使用 | `thinking_disabled_violation` | すべての思考ブロックを自動剥離 |
| 上記すべてのエラー | 汎用 | 自動修復 + 自動続行（有効な場合） |

::: warning 前提条件チェック
このチュートリアルを開始する前に、以下が完了していることを確認してください：
- ✅ opencode-antigravity-auth プラグインがインストールされている
- ✅ Antigravity モデルを使用してリクエストを発信できる
- ✅ ツール呼び出しの基本概念を理解している

[クイックインストールチュートリアル](../../start/quick-install/) | [初回リクエストチュートリアル](../../start/first-request/)
:::

## 核心のアイデア

セッション復旧の核心メカニズム：

1. **エラー検出**：3種類の回復可能なエラータイプを自動識別
   - `tool_result_missing`：ツール実行時に結果が欠落
   - `thinking_block_order`：思考ブロック順序エラー
   - `thinking_disabled_violation`：非思考モデルで思考を禁止

2. **自動修復**：エラータイプに基づいて synthetic メッセージを注入
   - synthetic tool_result を注入（内容は「Operation cancelled by user (ESC pressed)」）
   - 空の思考ブロックをプリセット（thinking ブロックはメッセージの先頭に配置する必要がある）
   - すべての思考ブロックを剥離（非思考モデルは思考を許可しない）

3. **自動続行**：`auto_resume` が有効な場合、自動的に continue メッセージを送信して対話を復旧

4. **重複排除処理**：`Set` を使用して同じエラーが重複して処理されるのを防止

::: info synthetic メッセージとは？
Synthetic メッセージは、プラグインが注入する「仮想」メッセージで、破損したセッション状態を修復するために使用されます。例えば、ツールが中断された場合、プラグインは synthetic tool_result を注入し、AI に「このツールはキャンセルされました」と伝え、AI が新しい返答を生成できるようにします。
:::

## 実践手順

### ステップ 1：セッション復旧を有効にする（デフォルトで有効）

**理由**
セッション復旧はデフォルトで有効ですが、以前に手動でオフにしていた場合は再度オンにする必要があります。

**操作**

プラグイン設定ファイルを編集します：

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

以下の設定を確認します：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**確認すべき点**：

1. `session_recovery` が `true`（デフォルト値）
2. `auto_resume` が `false`（手動で continue することを推奨、誤操作を防ぐため）
3. `quiet_mode` が `false`（toast 通知を表示して復旧状態を確認できる）

::: tip 設定項目の説明
- `session_recovery`：セッション復旧機能を有効/無効
- `auto_resume`：「continue」メッセージを自動送信（注意して使用、AI が予期せぬ実行を行う可能性あり）
- `quiet_mode`：toast 通知を非表示（デバッグ時はオフにできる）
:::

### ステップ 2：tool_result_missing 復旧をテスト

**理由**
ツール実行が中断されたときに、セッション復旧メカニズムが正常に動作するか確認します。

**操作**

1. OpenCode を開き、ツール呼び出しをサポートするモデルを選択（例：`google/antigravity-claude-sonnet-4-5`）
2. ツール呼び出しが必要なタスクを入力（例：「現在のディレクトリのファイルを表示して」）
3. ツール実行中に `ESC` を押して中断

**確認すべき点**：

1. OpenCode が直ちにツール実行を停止
2. toast 通知がポップアップ：「Tool Crash Recovery - Injecting cancelled tool results...」
3. AI が自動的に生成を続行し、ツール結果を待たなくなる

::: info tool_result_missing エラーの原理
ESC を押すと、OpenCode はツール実行を中断し、セッション内に `tool_use` は存在するが対応する `tool_result` が欠落する状態になります。Antigravity API はこの不整合を検出し、`tool_result_missing` エラーを返します。プラグインはこのエラーをキャッチし、synthetic tool_result を注入して、セッションを整合性のある状態に復旧させます。
:::

### ステップ 3：thinking_block_order 復旧をテスト

**理由**
思考ブロック順序エラーが発生したときに、セッション復旧メカニズムが自動的に修復できるか確認します。

**操作**

1. OpenCode を開き、思考をサポートするモデルを選択（例：`google/antigravity-claude-opus-4-5-thinking`）
2. 深い思考が必要なタスクを入力
3. 「Expected thinking but found text」または「First block must be thinking」エラーに遭遇

**確認すべき点**：

1. toast 通知がポップアップ：「Thinking Block Recovery - Fixing message structure...」
2. セッションが自動的に修復され、AI が生成を続行できる

::: tip thinking_block_order エラーの原因
このエラーは通常、以下の原因で発生します：
- 思考ブロックが誤って剥離される（他のツール経由など）
- セッション状態が破損する（ディスク書き込み失敗など）
- モデル間移行時にフォーマットの非互換性がある
:::

### ステップ 4：thinking_disabled_violation 復旧をテスト

**理由**
非思考モデルで思考機能を誤用したときに、セッション復旧が自動的に思考ブロックを剥離できるか確認します。

**操作**

1. OpenCode を開き、思考をサポートしないモデルを選択（例：`google/antigravity-claude-sonnet-4-5`）
2. 履歴メッセージに思考ブロックが含まれている場合

**確認すべき点**：

1. toast 通知がポップアップ：「Thinking Strip Recovery - Stripping thinking blocks...」
2. すべての思考ブロックが自動的に削除される
3. AI が生成を続行できる

::: warning 思考ブロックの消失
思考ブロックを剥離すると、AI の思考内容が失われ、回答品質に影響を与える可能性があります。思考モデルで思考機能を使用していることを確認してください。
:::

### ステップ 5：auto_resume を設定する（オプション）

**理由**
auto_resume を有効にすると、セッション復旧完了後に自動的に「continue」が送信され、手動操作が不要になります。

**操作**

`antigravity.json` で設定します：

```json
{
  "auto_resume": true
}
```

ファイルを保存し、OpenCode を再起動します。

**確認すべき点**：

1. セッション復旧完了後、AI が自動的に生成を続行する
2. 手動で「continue」と入力する必要がない

::: danger auto_resume のリスク
自動 continue により、AI が予期せぬツール呼び出しを実行する可能性があります。ツール呼び出しの安全性に懸念がある場合は、`auto_resume: false` を維持し、復旧タイミングを手動で制御することをお勧めします。
:::

## チェックポイント ✅

上記のステップを完了したら、以下ができるはずです：

- [ ] `antigravity.json` で session_recovery 設定を確認する
- [ ] ESC でツールを中断したときに「Tool Crash Recovery」通知が表示される
- [ ] セッションが自動的に復旧し、手動で再試行する必要がない
- [ ] synthetic tool_result の仕組みを理解する
- [ ] いつ auto_resume を有効/無効にするかを知る

## よくある問題と解決策

### セッション復旧がトリガーされない

**症状**：エラーが発生しても自動復旧されない

**原因**：`session_recovery` が無効になっているか、エラータイプが一致していない

**解決策**：

1. `session_recovery: true` であることを確認します：

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. エラータイプが回復可能であるか確認します：

```bash
# 詳細なエラー情報を表示するためにデバッグログを有効にする
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. コンソールにエラーログがないか確認します：

```bash
# ログの場所
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result が注入されない

**症状**：ツール中断後、AI が引き続きツール結果を待っている

**原因**：OpenCode のストレージパス設定が間違っている

**解決策**：

1. OpenCode のストレージパスが正しいか確認します：

```bash
# OpenCode 設定を表示
cat ~/.config/opencode/opencode.json | grep storage
```

2. メッセージとパートのストレージディレクトリが存在するか確認します：

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. ディレクトリが存在しない場合、OpenCode の設定を確認してください

### Auto Resume が予期せずトリガーされる

**症状**：AI が不適切なタイミングで自動的に続行する

**原因**：`auto_resume` が `true` に設定されている

**解決策**：

1. auto_resume をオフにします：

```json
{
  "auto_resume": false
}
```

2. 復旧タイミングを手動で制御します

### Toast 通知が頻繁に表示される

**症状**：復旧通知が頻繁にポップアップし、使用体験に影響を与える

**原因**：`quiet_mode` が有効になっていない

**解決策**：

1. quiet_mode を有効にします：

```json
{
  "quiet_mode": true
}
```

2. デバッグが必要な場合は、一時的に無効にできます

## 本レッスンのまとめ

- セッション復旧メカニズムは、tool_result_missing、thinking_block_order、thinking_disabled_violation の3種類の回復可能なエラーを自動処理する
- Synthetic tool_result はセッション状態を修復する鍵であり、注入内容は「Operation cancelled by user (ESC pressed)」
- session_recovery はデフォルトで有効、auto_resume はデフォルトで無効（手動制御を推奨）
- 思考ブロック復旧（thinking_block_order）は空の思考ブロックをプリセットし、AI が思考内容を再生成できるようにする
- 思考ブロック剥離（thinking_disabled_violation）は思考内容を失うため、思考モデルで思考機能を使用することを確認する

## 次回のレッスン予告

> 次回は**[リクエスト変換メカニズム](../request-transformation/)**を学びます。
>
> 学習内容：
> - Claude と Gemini のリクエスト形式の違い
> - Tool Schema のクリーンアップと変換ルール
> - 思考ブロック署名注入メカニズム
> - Google Search Grounding の設定方法

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| セッション復旧メインロジック | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | 全文 |
| エラータイプ検出 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| tool_result_missing 復旧 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order 復旧 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation 復旧 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| ストレージユーティリティ関数 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | 全文 |
| メッセージ読み取り | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| パート（part）読み取り | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| 思考ブロックプリセット | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| 思考ブロック剥離 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| タイプ定義 | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | 全文 |

**重要な定数**：

| 定数名 | 値 | 説明 |
| --- | --- | ---|
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Auto Resume 時に送信される復旧テキスト |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | 思考ブロックタイプのセット |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | メタデータタイプのセット |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | コンテンツタイプのセット |

**重要な関数**：

- `detectErrorType(error: unknown): RecoveryErrorType`：エラータイプを検出し、`"tool_result_missing"`、`"thinking_block_order"`、`"thinking_disabled_violation"`、または `null` を返す
- `isRecoverableError(error: unknown): boolean`：エラーが回復可能かどうかを判定
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`：セッション復旧フックを作成
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`：tool_result_missing エラーを回復
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`：thinking_block_order エラーを回復
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`：thinking_disabled_violation エラーを回復
- `readMessages(sessionID): StoredMessageMeta[]`：セッションのすべてのメッセージを読み取る
- `readParts(messageID): StoredPart[]`：メッセージのすべてのパート（parts）を読み取る
- `prependThinkingPart(sessionID, messageID): boolean`：メッセージの先頭に空の思考ブロックをプリセット
- `stripThinkingParts(messageID): boolean`：メッセージからすべての思考ブロックを削除

**設定項目**（schema.ts より）：

| 設定項目 | タイプ | デフォルト値 | 説明 |
| --- | --- | --- | ---|
| `session_recovery` | boolean | `true` | セッション復旧機能を有効にする |
| `auto_resume` | boolean | `false` | 「continue」メッセージを自動送信する |
| `quiet_mode` | boolean | `false` | toast 通知を非表示にする |

</details>
