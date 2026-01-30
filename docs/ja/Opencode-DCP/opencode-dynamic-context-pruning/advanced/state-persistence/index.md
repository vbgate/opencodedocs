---
title: "状態の永続化：セッションを超えて履歴を保持 | opencode-dynamic-context-pruning"
subtitle: "状態の永続化：セッションを超えて履歴を保持"
sidebarTitle: "再起動後もデータを保持"
description: "opencode-dynamic-context-pruningの状態永続化メカニズムを学びます。セッションを超えてトリミング履歴を保持し、/dcp statsで累積Token節約効果を確認します。"
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "/ja/Opencode-DCP/opencode-dynamic-context-pruning/start/getting-started"
  - "/ja/Opencode-DCP/opencode-dynamic-context-pruning/platforms/auto-pruning"
order: 2
---

# 状態の永続化：セッションを超えてトリミング履歴を保持

## この章でできること

- OpenCodeの再起動をまたいでDCPがトリミング状態を保持する仕組みを理解する
- 永続化ファイルの保存場所と内容形式を把握する
- セッション切り替えとコンテキスト圧縮時の状態管理ロジックを習得する
- `/dcp stats`ですべてのセッションの累積Token節約を確認する

## 今の課題

OpenCodeを閉じて再度開いたら、以前のトリミング記録が消えてしまった？あるいは`/dcp stats`の「すべてのセッション累積節約」がどこから来ているのか知りたい？

DCPの状態永続化メカニズムは、バックグラウンドで自動的にトリミング履歴と統計データを保存し、再起動後も表示できるようにします。

## この機能を使う場面

- セッションを超えて累積的にToken節約を統計したい
- OpenCodeの再起動後にトリミング履歴を継続したい
- 長期的にDCPを使用し、全体効果を確認したい

## コアコンセプト

**状態永続化とは**

**状態永続化**とは、DCPがトリミング履歴と統計データをディスクファイルに保存し、OpenCodeの再起動やセッション切り替え後もそれらの情報が失われないようにすることを指します。

::: info なぜ永続化が必要か？

永続化がない場合、OpenCodeを閉じるたびに：
- トリミングされたツールIDリストが失われる
- Token節約統計がリセットされる
- AIが同じツールを重複してトリミングする可能性がある

永続化により、DCPは以下のことができます：
- どのツールが既にトリミングされたかを記憶する
- すべてのセッションのToken節約を累積する
- 再起動後に以前の作業を続ける
:::

**永続化内容の2つの主要部分**

DCPが保存する状態には2種類の情報が含まれます：

| タイプ | 内容 | 用途 |
|--- | --- | ---|
| **トリミング状態** | トリミング済みツールのIDリスト | 重複トリミングを回避し、セッションを超えて追跡 |
| **統計データ** | Token節約数（現在のセッション + 履歴累積） | DCPの効果を表示し、長期トレンドを分析 |

これらのデータはOpenCodeのセッションIDごとに個別に保存され、各セッションに対応するJSONファイルが1つずつ生成されます。

## データフロー

```mermaid
graph TD
    subgraph "トリミング操作"
        A1[AIがdiscard/extractを呼び出す]
        A2[ユーザーが/dcp sweepを実行]
    end

    subgraph "メモリ状態"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "永続化ストレージ"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|非同期保存| C1
    B2 -->|非同期保存| C1
    C1 --> C2

    C2 -->|セッション切り替え時にロード| B1
    C2 -->|セッション切り替え時にロード| B2

    D[OpenCode summaryメッセージ] -->|キャッシュをクリア| B1
```

## 実践してみよう

### ステップ1：永続化ストレージの場所を理解する

**理由**
データがどこに保存されているかを知ることで、必要に応じて手動で確認や削除ができます

DCPは状態をローカルファイルシステムに保存し、クラウドにはアップロードされません。

```bash
# 永続化ディレクトリの場所
~/.local/share/opencode/storage/plugin/dcp/

# 各セッションに1つのJSONファイル、形式：{sessionId}.json
```

**確認すべきこと**：ディレクトリの下に複数の`.json`ファイルがあり、各ファイルがOpenCodeのセッションに対応していることを確認

::: tip データプライバシー

DCPはトリミング状態と統計データのみをローカルに保存し、機密情報は含まれません。永続化ファイルには以下が含まれます：
- ツールIDリスト（数値識別子）
- Token節約数（統計データ）
- 最終更新時刻（タイムスタンプ）

会話内容、ツールの出力、ユーザー入力は含まれません。
:::

### ステップ2：永続化ファイルの形式を確認する

**理由**
ファイル構造を理解することで、手動での確認や問題のデバッグが容易になります

```bash
# すべての永続化ファイルを一覧表示
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# 特定のセッションの永続化内容を確認
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**確認すべきこと**：以下のようなJSON構造

```json
{
  "sessionName": "私のセッション名",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**フィールド説明**：

| フィールド | タイプ | 意味 |
|--- | --- | ---|
| `sessionName` | string (オプション) | セッション名、識別用 |
| `prune.toolIds` | string[] | トリミング済みツールのIDリスト |
| `stats.pruneTokenCounter` | number | 現在のセッションで節約したToken数（未アーカイブ） |
| `stats.totalPruneTokens` | number | 履歴累積で節約したToken数 |
| `lastUpdated` | string | ISO 8601形式の最終更新時刻 |

### ステップ3：累積統計を確認する

**理由**
すべてのセッションの累積効果を理解し、DCPの長期的価値を評価する

```bash
# OpenCodeで実行
/dcp stats
```

**確認すべきこと**：統計情報パネル

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**統計データの意味**：

| 統計項目 | ソース | 説明 |
|--- | --- | ---|
| **Session** | 現在のメモリ状態 | 現在のセッションのトリミング効果 |
| **All-time** | すべての永続化ファイル | すべての履歴セッションの累積効果 |

::: info All-time統計の計算方法

DCPは`~/.local/share/opencode/storage/plugin/dcp/`ディレクトリの下にあるすべてのJSONファイルを走査し、以下を累積します：
- `totalPruneTokens`：すべてのセッションで節約されたToken総数
- `toolIds.length`：すべてのセッションでトリミングされたツール総数
- ファイル数：セッション総数

これにより、DCPの長期的な使用における全体効果を確認できます。
:::

### ステップ4：自動保存メカニズムを理解する

**理由**
DCPがいつ状態を保存するかを知ることで、誤操作によるデータ損失を防げます

DCPは以下のタイミングで自動的に状態をディスクに保存します：

| トリガータイミング | 保存内容 | 呼び出し場所 |
|--- | --- | ---|
| AIが`discard`/`extract`ツールを呼び出した後 | 更新されたトリミング状態 + 統計 | `lib/strategies/tools.ts:148-150` |
| ユーザーが`/dcp sweep`コマンドを実行した後 | 更新されたトリミング状態 + 統計 | `lib/commands/sweep.ts:234-236` |
| トリミング操作完了後 | 非同期保存、メインフローをブロックしない | `saveSessionState()` |

**保存フロー**：

```typescript
// 1. メモリ状態を更新
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. 非同期でディスクに保存
await saveSessionState(state, logger)
```

::: tip 非同期保存のメリット

DCPは非同期保存メカニズムを使用し、トリミング操作がディスクI/Oによってブロックされないようにします。保存が失敗した場合（ディスク容量不足など）、現在のセッションのトリミング効果には影響しません。

失敗時には警告ログを`~/.config/opencode/logs/dcp/`に記録します。
:::

### ステップ5：自動ロードメカニズムを理解する

**理由**
DCPがいつ永続化状態をロードするかを知ることで、セッション切り替えの動作を理解できます

DCPは以下のタイミングで自動的に永続化状態をロードします：

| トリガータイミング | ロード内容 | 呼び出し場所 |
|--- | --- | ---|
| OpenCodeの起動時またはセッション切り替え時 | そのセッションの履歴トリミング状態 + 統計 | `lib/state/state.ts:104`（`ensureSessionInitialized`関数内） |

**ロードフロー**：

```typescript
// 1. セッションIDの変化を検出
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. メモリ状態をリセット
resetSessionState(state)
state.sessionId = lastSessionId

// 3. ディスクから永続化状態をロード
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**確認すべきこと**：以前のセッションに切り替えた後、`/dcp stats`に表示される履歴統計データが保持されていることを確認

### ステップ6：コンテキスト圧縮時の状態クリアを理解する

**理由**
OpenCodeが自動的にコンテキストを圧縮するとき、DCPが状態をどのように処理するかを理解します

OpenCodeは会話が長すぎると検出すると、自動的にsummaryメッセージを生成してコンテキストを圧縮します。DCPはこの圧縮を検出し、関連する状態をクリアします。

```typescript
// summaryメッセージ検出時の処理
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // ツールキャッシュをクリア
    state.prune.toolIds = []       // トリミング状態をクリア
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info なぜクリアが必要か

OpenCodeのsummaryメッセージは会話履歴全体を圧縮します。このとき：
- 古いツール呼び出しはsummaryにマージされている
- ツールIDリストを保持しても意味がない（ツールは既に存在しない）
- 状態をクリアすることで無効なツールIDへの参照を回避する

これは設計上のトレードオフ：一部のトリミング履歴を犠牲にして、状態の一貫性を保証する。
:::

## チェックポイント ✅

以下の要点を理解したことを確認してください：

- [ ] DCPの永続化ファイルは`~/.local/share/opencode/storage/plugin/dcp/`に保存される
- [ ] 各セッションに1つの`{sessionId}.json`ファイルが対応する
- [ ] 永続化内容にはトリミング状態と統計データが含まれる
- [ ] `/dcp stats`の「All-time」統計はすべての永続化ファイルの累積に由来する
- [ ] トリミング操作後に自動で非同期保存され、メインフローをブロックしない
- [ ] セッション切り替え時にそのセッションの履歴状態が自動的にロードされる
- [ ] OpenCodeのsummaryメッセージを検出すると、ツールキャッシュとトリミング状態がクリアされる

## トラブルシューティング

### ❌ 誤って永続化ファイルを削除した

**問題**：`~/.local/share/opencode/storage/plugin/dcp/`ディレクトリの下のファイルを手動で削除した

**影響**：
- 履歴トリミング状態が失われる
- 累積統計がリセットされる
- ただし、現在のセッションのトリミング機能には影響しない

**解決策**：再び使用を開始すると、DCPは自動的に新しい永続化ファイルを作成します

### ❌ 子エージェントの状態が見えない

**問題**：子エージェントでツールをトリミングしたが、親エージェントに戻るとそれらのトリミング記録が見えない

**原因**：子エージェントは独立した`sessionId`を持ち、トリミング状態は独立したファイルに永続化されます。ただし、親エージェントに切り戻すとき、親エージェントの`sessionId`が異なるため、子エージェントの永続化状態はロードされません

**解決策**：これは設計上の動作です。子エージェントセッションの状態は独立しており、親エージェントと共有されません。すべてのトリミング記録（子エージェントを含む）を統計したい場合、`/dcp stats`の「All-time」統計を使用できます（すべての永続化ファイルのデータを累積します）

### ❌ ディスク容量不足による保存失敗

**問題**：`/dcp stats`に表示される「All-time」統計が増えない

**原因**：ディスク容量不足により、保存に失敗している可能性があります

**解決策**：ログファイル`~/.config/opencode/logs/dcp/`を確認し、「Failed to save session state」エラーがあるかどうかを確認してください

## この章のまとめ

**状態永続化のコア価値**：

1. **セッションを超えた記憶**：どのツールが既にトリミングされたかを記憶し、重複作業を回避する
2. **累積統計**：DCPのToken節約効果を長期的に追跡する
3. **再起動回復**：OpenCodeの再起動後に以前の作業を継続する

**データフローのまとめ**：

```
トリミング操作 → メモリ状態を更新 → 非同期でディスクに保存
                ↑
セッション切り替え → ディスクからロード → メモリ状態を復元
                ↑
コンテキスト圧縮 → メモリ状態をクリア（ディスクファイルは削除しない）
```

**重要なポイント**：

- 永続化はローカルファイル操作であり、トリミング性能には影響しない
- `/dcp stats`の「All-time」はすべての履歴セッションの累積に由来する
- 子エージェントセッションは永続化されない。これは設計上の動作
- コンテキスト圧縮時にキャッシュがクリアされ、状態の一貫性を保証する

## 次の章の予告

> 次の章では **[プロンプトキャッシュへの影響](/ja/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)** を学びます。
>
> 以下を学びます：
> - DCPのトリミングがPrompt Cachingにどのように影響するか
> - キャッシュヒット率とToken節約をどのようにトレードオフするか
> - Anthropicのキャッシュ課金メカニズムを理解する

---

## 付録：ソースコード参照

<details>
<summary><strong>展開してソースコードの場所を確認</strong></summary>

> 更新時刻：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 永続化インターフェース定義 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| セッション状態の保存 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| セッション状態のロード | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| すべてのセッション統計のロード | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| ストレージディレクトリ定数 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| セッション状態の初期化 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| コンテキスト圧縮の検出 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| 統計コマンドの処理 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| トリミングツールの状態保存 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**重要な定数**：
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`：永続化ファイルの保存ルートディレクトリ

**重要な関数**：
- `saveSessionState(state, logger)`：セッション状態を非同期でディスクに保存
- `loadSessionState(sessionId, logger)`：指定されたセッションの状態をディスクからロード
- `loadAllSessionStats(logger)`：すべてのセッションの統計データを集約
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`：セッションが初期化されていることを確認し、永続化状態をロード

**重要なインターフェース**：
- `PersistedSessionState`：永続化状態の構造定義
- `AggregatedStats`：累積統計データの構造定義

</details>
