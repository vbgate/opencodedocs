---
title: "バックグラウンドタスク: 複数エージェントの並列実行 | oh-my-opencode"
sidebarTitle: "複数のAIを同時に動作させる"
subtitle: "バックグラウンドタスク: 複数エージェントの並列実行 | oh-my-opencode"
description: "oh-my-opencodeのバックグラウンドタスクシステムの並列実行機能を学習します。3段階の並発制御、タスクライフサイクル管理、delegate_taskおよびbackground_outputツールの使用方法を習得します。"
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# バックグラウンド並列タスク：チームのように働く

## 学習成果

- ✅ 複数のバックグラウンドタスクを起動し、異なるAIエージェントを同時に動作させる
- ✅ 並発制限を設定し、API制限とコスト爆発を回避する
- ✅ バックグラウンドタスクの結果を取得し、完了を待つ必要がない
- ✅ タスクをキャンセルし、リソースを解放する

## あなたの現在の課題

**一人だけで作業している？**

このシナリオを想像してください：
- **Explore**エージェントにコードベースの認証実装を探させる必要がある
- 同時に**Librarian**エージェントにベストプラクティスを研究させる
- さらに**Oracle**エージェントにアーキテクチャ設計をレビューさせる

順次実行する場合、合計時間 = 10分 + 15分 + 8分 = **33分**

しかし、並列にできる場合はどうでしょうか？3つのエージェントが同時に動作し、合計時間 = **max(10, 15, 8) = 15分**、**54%**の時間を節約します。

**問題**：デフォルトでは、OpenCodeは一度に1つのセッションしか処理できません。並列実行を実現するには、複数のウィンドウを手動で管理するか、タスクが完了するのを待つ必要があります。

**解決策**：oh-my-opencodeのバックグラウンドタスクシステムは、複数のAIエージェントを同時に実行し、バックグラウンドで進捗を追跡して、他の作業を続行できるようにします。

## いつこのテクニックを使うか

バックグラウンドタスクシステムが効率を向上させるシナリオ：

| シナリオ | 例 | 価値 |
|---|---|---|
| **並列研究** | Exploreで実装を検索 + Librarianでドキュメントを調査 | 研究速度3倍 |
| **複数専門家レビュー** | Oracleでアーキテクチャをレビュー + Momusで計画を検証 | 迅速な多視点フィードバック |
| **非同期タスク** | Gitコミットの提出時に同時にコードレビュー | メインフローをブロックしない |
| **リソース制約** | 並発数を制限してAPI制限を回避 | コストと安定性を管理 |

::: tip Ultraworkモード
プロンプトに`ultrawork`または`ulw`を追加すると、すべての専門エージェントと並列バックグラウンドタスクを含む最大パフォーマンスモードが自動的にアクティブ化されます。手動設定は不要です。
:::

## 🎒 開始前の準備

::: warning 前提条件

本チュートリアルを開始する前に、以下を確認してください：
1. oh-my-opencodeがインストールされている（[インストールチュートリアル](../../start/installation/)を参照）
2. 基本的な設定が完了し、少なくとも1つのAI Providerが使用可能である
3. Sisyphusオーケストレーターの基本用法を理解している（[Sisyphusチュートリアル](../sisyphus-orchestrator/)を参照）

:::

## コアコンセプト

バックグラウンドタスクシステムの動作原理は、3つのコアコンセプトに要約できます：

### 1. 並列実行

バックグラウンドタスクシステムを使用すると、複数のAIエージェントタスクを同時に起動でき、各タスクは独立したセッションで実行されます。これは以下を意味します：

- **Explore**がコードを検索
- **Librarian**がドキュメントを調査
- **Oracle**が設計をレビュー

3つのタスクが並列実行され、合計実行時間は最も遅いタスクの時間に等しくなります。

### 2. 並発制御

同時に開始するタスクが多すぎるとAPI制限に達したりコストが暴走したりするのを防ぐため、システムは3段階の並発制限を提供します：

```
優先順位：Model > Provider > Default

設定例：
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   すべて → 5
```

**ルール**：
- modelレベル制限が指定されている場合は、その制限を使用
- そうでない場合、providerレベル制限が指定されている場合は、その制限を使用
- そうでない場合、デフォルト制限（デフォルト値5）を使用

### 3. ポーリングメカニズム

システムは2秒ごとにタスクステータスをチェックし、タスクが完了したかどうかを判断します。完了条件：

- **セッションidle**（session.idleイベント）
- **安定性検出**：連続3回のポーリングでメッセージ数が変わらない
- **TODOリストが空**：すべてのタスクが完了

## 実践編

### ステップ1：バックグラウンドタスクを起動

`delegate_task`ツールを使用してバックグラウンドタスクを起動します：

```markdown
並列バックグラウンドタスクを起動：

1. Exploreで認証実装を検索
2. Librarianでベストプラクティスを研究
3. Oracleでアーキテクチャ設計をレビュー

並列実行：
```

**理由**
これはバックグラウンドタスクの最も古典的な使用シナリオをデモンストレーションします。3つのタスクを同時に実行でき、大幅に時間を節約できます。

**表示される内容**
システムは3つのタスクIDを返します：

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: 認証実装を検索
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: ベストプラクティスを研究
Agent: librarian
Status: pending
...
```

::: info タスクステータス説明
- **pending**：並発スロットを待ってキューに入っている
- **running**：実行中
- **completed**：完了
- **error**：エラー
- **cancelled**：キャンセル済み
:::

### ステップ2：タスクステータスを確認

`background_output`ツールを使用してタスクステータスを確認します：

```markdown
bg_abc123のステータスを確認：
```

**理由**
タスクが完了したか、まだ実行中かを把握します。デフォルトでは待機せず、即座にステータスを返します。

**表示される内容**
タスクがまだ実行中の場合：

```
## Task Status

| Field | Value |
|---|---|
| Task ID | `bg_abc123` |
| Description | Explore: 認証実装を検索 |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: 明示的に待機する必要はありません - システムはこのタスクが完了した際に通知します。

## Original Prompt

src/authディレクトリ内の認証実装を検索し、ログイン、登録、トークン管理などを含む
```

タスクが完了した場合：

```
Task Result

Task ID: bg_abc123
Description: Explore: 認証実装を検索
Duration: 5m 32s
Session ID: sess_xyz789

---

3つの認証実装が見つかりました：
1. `src/auth/login.ts` - JWT認証
2. `src/auth/register.ts` - ユーザー登録
3. `src/auth/token.ts` - トークン更新
...
```

### ステップ3：並発制御を設定

`~/.config/opencode/oh-my-opencode.json`を編集します：

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Providerレベル並発制限（推奨設定）
    "providerConcurrency": {
      "anthropic": 3,     // Anthropicモデルは最大同時3つ
      "openai": 2,         // OpenAIモデルは最大同時2つ
      "google": 2          // Googleモデルは最大同時2つ
    },

    // Modelレベル並発制限（最優先）
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Opus 4.5は最大同時2つ
      "gpt-5.2": 2              // GPT 5.2は最大同時2つ
    },

    // デフォルト並発制限（上記が設定されていない場合に使用）
    "defaultConcurrency": 3
  }
}
```

**理由**
並発制御はコスト爆発を回避するための鍵です。制限を設定せずに、10個のOpus 4.5タスクを同時に起動すると、大量のAPIクォータを瞬時に消費してしまう可能性があります。

::: tip 推奨設定
ほとんどのシナリオで推奨される設定：
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**表示される内容**
設定が有効になった後、バックグラウンドタスクを起動する際：
- 並発制限に達している場合、タスクは**pending**状態でキューに入る
- タスクが完了すると、キューに入っているタスクが自動的に起動される

### ステップ4：タスクをキャンセル

`background_cancel`ツールを使用してタスクをキャンセルします：

```markdown
すべてのバックグラウンドタスクをキャンセル：
```

**理由**
タスクがスタックしたり、不要になったりする場合、積極的にキャンセルしてリソースを解放できます。

**表示される内容**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
|---|---|---|---|
| `bg_abc123` | Explore: 認証実装を検索 | running | `sess_xyz789` |
| `bg_def456` | Librarian: ベストプラクティスを研究 | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: アーキテクチャ設計をレビュー | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: 認証実装を検索)
- `sess_uvwx012` (Librarian: ベストプラクティスを研究)
```

## チェックポイント ✅

以下のポイントを理解していることを確認してください：

- [ ] 複数の並列バックグラウンドタスクを起動できる
- [ ] タスクステータス（pending、running、completed）を理解している
- [ ] 適切な並発制限を設定している
- [ ] タスク結果を確認・取得できる
- [ ] 不要なタスクをキャンセルできる

## 落とし穴リマインダー

### 落とし穴 1：並発制限の設定を忘れる

**症状**：多くのタスクを起動し、APIクォータを瞬時に消費したり、レートリミットに達したりする。

**解決策**：`oh-my-opencode.json`で`providerConcurrency`または`defaultConcurrency`を設定する。

### 落とし穴 2：結果を確認するために頻繁にポーリングする

**症状**：数秒ごとに`background_output`を呼び出してタスクステータスを確認し、不要なオーバーヘッドを増加させる。

**解決策**：システムはタスク完了時に自動的に通知します。実際に中間結果が必要な場合のみ手動で確認してください。

### 落とし穴 3：タスクタイムアウト

**症状**：タスクが30分以上実行されると自動的にキャンセルされる。

**原因**：バックグラウンドタスクには30分のTTL（タイムアウト時間）がある。

**解決策**：長時間のタスクが必要な場合は、複数のサブタスクに分割するか、`delegate_task(background=false)`を使用してフォアグラウンドで実行してください。

### 落とし穴 4：Pendingタスクが起動しない

**症状**：タスクステータスが常に`pending`のままで、`running`にならない。

**原因**：並発制限が一杯で、利用可能なスロットがない。

**解決策**：
- 既存のタスクが完了するのを待つ
- 並発制限の設定を増やす
- 不要なタスクをキャンセルしてスロットを解放する

## 本レッスンのまとめ

バックグラウンドタスクシステムを使用すると、実際のチームのように複数のAIエージェントが並列にタスクを実行できます：

1. **並列タスクを起動**：`delegate_task`ツールを使用
2. **並発を制御**：`providerConcurrency`、`modelConcurrency`、`defaultConcurrency`を設定
3. **結果を取得**：`background_output`ツールを使用（システムは自動的に通知）
4. **タスクをキャンセル**：`background_cancel`ツールを使用

**コアルール**：
- 2秒ごとにタスクステータスをポーリング
- 連続3回安定またはidleでタスク完了
- タスクは30分後に自動タイムアウト
- 優先順位：modelConcurrency > providerConcurrency > defaultConcurrency

## 次のレッスンの予告

> 次のレッスンでは **[LSPとAST-Grep：コードリファクタリングの強力なツール](../lsp-ast-tools/)** を学びます。
>
> 学べる内容：
> - LSPツールを使用したコードナビゲーションとリファクタリング
> - AST-Grepを使用した正確なパターン検索と置換
> - LSPとAST-Grepの組み合わせたベストプラクティス

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
|---|---|---|
| バックグラウンドタスクマネージャー | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1378 |
| 並発制御 | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
| delegate_taskツール | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 51-119 |
| background_outputツール | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 320-384 |
| background_cancelツール | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 386-514 |

**重要な定数**：
- `TASK_TTL_MS = 30 * 60 * 1000`：タスクタイムアウト時間（30分）
- `MIN_STABILITY_TIME_MS = 10 * 1000`：安定性検出開始時間（10秒）
- `DEFAULT_STALE_TIMEOUT_MS = 180_000`：デフォルトタイムアウト時間（3分）
- `MIN_IDLE_TIME_MS = 5000`：早期idleを無視する最小時間（5秒）

**重要なクラス**：
- `BackgroundManager`：バックグラウンドタスクマネージャー、タスクの起動、追跡、ポーリング、完了を担当
- `ConcurrencyManager`：並発制御マネージャー、3段階の優先順位（model > provider > default）を実装

**重要な関数**：
- `BackgroundManager.launch()`：バックグラウンドタスクを起動
- `BackgroundManager.pollRunningTasks()`：2秒ごとにタスクステータスをポーリング（第1182行）
- `BackgroundManager.tryCompleteTask()`：競合状態を防いで安全にタスクを完了（第909行）
- `ConcurrencyManager.getConcurrencyLimit()`：並発制限を取得（第24行）
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()`：並発スロットを取得/解放（第41、71行）

</details>
