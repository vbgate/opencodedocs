---
title: "コマンド: 監視とプルーニング | opencode-dynamic-context-pruning"
sidebarTitle: "トークン監視・手動プルーニング"
subtitle: "DCP コマンド使用ガイド：監視と手動プルーニング"
description: "DCP の 4 つのコマンドで監視と手動プルーニングを学びます。/dcp context でセッション確認、/dcp stats で統計表示、/dcp sweep で手動プルーニングをトリガーする方法を解説。"
tags:
  - "DCP コマンド"
  - "トークン監視"
  - "手動プルーニング"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP コマンド使用ガイド：監視と手動プルーニング

## このレッスンで学べること

- `/dcp context` で現在のセッションのトークン使用分布を確認する
- `/dcp stats` で累計プルーニング統計を表示する
- `/dcp sweep [n]` で手動プルーニングをトリガーする
- 保護対象ツールとファイルの保護メカニズムを理解する
- トークン計算戦略と節約効果を把握する

## 今あなたが直面している課題

長い会話の中で、トークン消費がどんどん増えていきますが、以下のことがわかりません：
- 現在のセッションでトークンはどこに使われているのか？
- DCP は実際にどれくらい節約してくれているのか？
- 不要になったツール出力を手動でクリアするにはどうすればいいのか？
- どのツールが保護され、プルーニングされないのか？

これらの疑問を解決しないと、DCP の最適化効果を十分に活用できず、重要な情報を誤って削除してしまう可能性もあります。

## このテクニックを使うタイミング

以下のような場合に使用します：
- 現在のセッションのトークン構成を把握したいとき
- 会話履歴を素早くクリアしたいとき
- DCP のプルーニング効果を検証したいとき
- 新しいタスクを開始する前にコンテキストを整理したいとき

## 基本的な考え方

DCP は 4 つの Slash コマンドを提供し、トークン使用の監視と制御を支援します：

| コマンド | 用途 | 使用シーン |
| --- | --- | --- |
| `/dcp` | ヘルプを表示 | コマンドを忘れたときに確認 |
| `/dcp context` | 現在のセッションのトークン分布を分析 | コンテキスト構成の把握 |
| `/dcp stats` | 累計プルーニング統計を表示 | 長期的な効果の検証 |
| `/dcp sweep [n]` | 手動でツールをプルーニング | コンテキストサイズの素早い削減 |

**保護メカニズム**：

すべてのプルーニング操作は以下を自動的にスキップします：
- **保護対象ツール**：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- **保護対象ファイル**：設定の `protectedFilePatterns` にマッチするファイルパス

::: info
保護対象ツールと保護対象ファイルの設定は、設定ファイルでカスタマイズできます。詳細は[設定完全ガイド](../../start/configuration/)を参照してください。
:::

## 実践してみよう

### ステップ 1：ヘルプ情報を確認する

OpenCode の対話ボックスで `/dcp` と入力します。

**表示される内容**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**チェックポイント ✅**：3 つのサブコマンドの説明が表示されていることを確認します。

### ステップ 2：現在のセッションのトークン分布を分析する

`/dcp context` と入力して、現在のセッションのトークン使用状況を確認します。

**表示される内容**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**トークン分類の説明**：

| 分類 | 計算方法 | 説明 |
| --- | --- | --- |
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | システムプロンプト |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | ツール呼び出し（プルーニング分を差し引き済み） |
| **User** | `tokenizer(all user messages)` | すべてのユーザーメッセージ |
| **Assistant** | `total - system - user - tools` | AI テキスト出力 + 推論トークン |

**チェックポイント ✅**：各分類のトークン割合と数量が表示されていることを確認します。

### ステップ 3：累計プルーニング統計を確認する

`/dcp stats` と入力して、過去の累計プルーニング効果を確認します。

**表示される内容**：

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**統計の説明**：
- **Session**：現在のセッションのプルーニングデータ（メモリ内）
- **All-time**：すべての過去セッションの累計データ（ディスクに永続化）

**チェックポイント ✅**：現在のセッションと過去の累計プルーニング統計が表示されていることを確認します。

### ステップ 4：手動でツールをプルーニングする

`/dcp sweep` の使い方は 2 通りあります：

#### 方法 1：前回のユーザーメッセージ以降のすべてのツールをプルーニング

`/dcp sweep`（引数なし）と入力します。

**表示される内容**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### 方法 2：最後の N 個のツールをプルーニング

`/dcp sweep 5` と入力して、最後の 5 個のツールをプルーニングします。

**表示される内容**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**保護対象ツールの通知**：

保護対象ツールがスキップされた場合、出力に以下が表示されます：

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
保護対象ツール（`write`、`edit` など）と保護対象ファイルパスは自動的にスキップされ、プルーニングされません。
:::

**チェックポイント ✅**：プルーニングされたツールのリストと節約されたトークン数が表示されていることを確認します。

### ステップ 5：プルーニング効果を再確認する

プルーニング後、再度 `/dcp context` と入力して、新しいトークン分布を確認します。

**表示される内容**：
- `Tools` 分類の割合が減少
- `Summary` にプルーニングされたツール数の増加が表示
- `Current context` の合計が減少

**チェックポイント ✅**：トークン使用量が明らかに減少していることを確認します。

## よくある失敗パターン

### ❌ 失敗例：重要なツールを誤って削除

**シナリオ**：`write` ツールで重要なファイルを作成した直後に `/dcp sweep` を実行。

**誤った結果**：`write` ツールがプルーニングされ、AI がファイルの作成を認識できなくなる。

**正しい対処法**：
- `write`、`edit` などのツールはデフォルトで保護されている
- `protectedTools` 設定からこれらのツールを削除しない
- 重要なタスク完了後は数ターン待ってからクリアする

### ❌ 失敗例：不適切なタイミングでのプルーニング

**シナリオ**：会話が始まったばかりで、ツール呼び出しが数回しかない状態で `/dcp sweep` を実行。

**誤った結果**：節約されるトークンが少なく、むしろコンテキストの一貫性に影響を与える可能性がある。

**正しい対処法**：
- 会話がある程度進んでから（例：10 回以上のツール呼び出し後）クリアする
- 新しいタスクを開始する前に、前回のツール出力をクリアする
- `/dcp context` と組み合わせて、クリアする価値があるかどうかを判断する

### ❌ 失敗例：手動プルーニングへの過度な依存

**シナリオ**：毎回の会話で手動で `/dcp sweep` を実行。

**誤った結果**：
- 自動プルーニング戦略（重複排除、上書き書き込み、エラークリア）が無駄になる
- 操作の負担が増加

**正しい対処法**：
- 自動プルーニング戦略をデフォルトで有効にする（設定：`strategies.*.enabled`）
- 手動プルーニングは補助として、必要なときのみ使用する
- `/dcp stats` で自動プルーニングの効果を検証する

## このレッスンのまとめ

DCP の 4 つのコマンドは、トークン使用の監視と制御を支援します：

| コマンド | 主な機能 |
| --- | --- |
| `/dcp` | ヘルプ情報を表示 |
| `/dcp context` | 現在のセッションのトークン分布を分析 |
| `/dcp stats` | 累計プルーニング統計を表示 |
| `/dcp sweep [n]` | 手動でツールをプルーニング |

**トークン計算戦略**：
- System：システムプロンプト（最初のレスポンスから推算）
- Tools：ツールの入出力（プルーニング分を差し引き）
- User：すべてのユーザーメッセージ（推定）
- Assistant：AI 出力 + 推論トークン（残差）

**保護メカニズム**：
- 保護対象ツール：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- 保護対象ファイル：設定された glob パターン
- すべてのプルーニング操作はこれらのコンテンツを自動的にスキップ

**ベストプラクティス**：
- 定期的に `/dcp context` でトークン構成を確認する
- 新しいタスクの前に `/dcp sweep` で履歴をクリアする
- 自動プルーニングに依存し、手動プルーニングは補助として使用する
- `/dcp stats` で長期的な効果を検証する

## 次のレッスンの予告

> 次のレッスンでは **[保護メカニズム](../../advanced/protection/)** を学びます。
>
> 学べる内容：
> - ターン保護が誤プルーニングを防ぐ仕組み
> - 保護対象ツールリストのカスタマイズ方法
> - 保護対象ファイルパターンの設定方法
> - サブエージェントセッションの特別な処理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| /dcp ヘルプコマンド | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context コマンド | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| トークン計算戦略 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats コマンド | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep コマンド | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| 保護対象ツール設定 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| デフォルト保護対象ツールリスト | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**主要な定数**：
- `DEFAULT_PROTECTED_TOOLS`：デフォルトの保護対象ツールリスト

**主要な関数**：
- `handleHelpCommand()`：/dcp ヘルプコマンドを処理
- `handleContextCommand()`：/dcp context コマンドを処理
- `analyzeTokens()`：各カテゴリのトークン数を計算
- `handleStatsCommand()`：/dcp stats コマンドを処理
- `handleSweepCommand()`：/dcp sweep コマンドを処理
- `buildToolIdList()`：ツール ID リストを構築

</details>
