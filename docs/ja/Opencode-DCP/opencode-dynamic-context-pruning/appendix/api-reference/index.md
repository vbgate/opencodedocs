---
title: "API リファレンス: プラグインインターフェースドキュメント | opencode-dynamic-context-pruning"
sidebarTitle: "プラグイン API リファレンス"
subtitle: "DCP API リファレンス"
description: "OpenCode DCP プラグインの完全な API リファレンスドキュメントを学びます。プラグインエントリ関数、設定インターフェース、ツール定義、フックハンドラ、セッション状態管理インターフェースの詳細な説明を含みます。"
tags:
  - "API"
  - "プラグイン開発"
  - "インターフェースリファレンス"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API リファレンス

## 学習後にできること

本節はプラグイン開発者向けに DCP の完全な API リファレンスを提供し、以下のことができるようになります：

- DCP のプラグインエントリとフックメカニズムを理解する
- 設定インターフェースとすべての設定項目の機能を掌握する
- discard と extract ツールの仕様を理解する
- 状態管理 API を使用してセッション状態を操作する

## コアコンセプト

DCP プラグインは OpenCode Plugin SDK に基づき、フック、ツール、コマンドを登録することでコンテキストプルーニング機能を実現します。

**プラグインライフサイクル**：

```
1. OpenCode がプラグインをロード
    ↓
2. Plugin 関数が実行
    ↓
3. フック、ツール、コマンドを登録
    ↓
4. OpenCode がフックを呼び出してメッセージを処理
    ↓
5. プラグインがプルーニングロジックを実行
    ↓
6. 変更後のメッセージを返す
```

---

## プラグインエントリ API

### Plugin 関数

DCP のメインエントリ関数で、プラグイン設定オブジェクトを返します。

**シグネチャ**：

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // プラグイン初期化ロジック
    return {
        // 登録するフック、ツール、コマンド
    }) satisfies Plugin

export default plugin
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode プラグインコンテキスト。client や directory などの情報を含む |

**戻り値**：

プラグイン設定オブジェクト。以下のフィールドを含む：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | システムプロンプト注入フック |
| `experimental.chat.messages.transform` | `Handler` | メッセージ変換フック |
| `chat.message` | `Handler` | メッセージキャプチャフック |
| `command.execute.before` | `Handler` | コマンド実行フック |
| `tool` | `Record<string, Tool>` | 登録するツールマッピング |
| `config` | `ConfigHandler` | 設定変更フック |

**ソースコード位置**：[`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## 設定 API

### PluginConfig インターフェース

DCP の完全な設定型定義。

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**ソースコード位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### 設定項目の詳細

#### トップレベル設定

| 設定項目 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | プラグインを有効にするかどうか |
| `debug` | `boolean` | `false` | デバッグログを有効にするかどうか。ログは `~/.config/opencode/logs/dcp/` に書き込まれる |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | 通知表示モード |
| `protectedFilePatterns` | `string[]` | `[]` | ファイル保護 glob パターンリスト。一致するファイルはプルーニングされない |

#### Commands 設定

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | `/dcp` コマンドを有効にするかどうか |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | コマンド保護ツールリスト。これらのツールは `/dcp sweep` でプルーニングされない |

#### TurnProtection 設定

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | ターン保護を有効にするかどうか |
| `turns` | `number` | `4` | 保護ターン数。直近 N ターンのツールはプルーニングされない |

#### Tools 設定

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**：

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | AI リマインダーを有効にするかどうか |
| `nudgeFrequency` | `number` | `10` | リマインダー頻度。N 個のツール結果ごとに AI にプルーニングツールの使用をリマインド |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | ツール保護リスト |

**DiscardTool**：

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | discard ツールを有効にするかどうか |

**ExtractTool**：

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | extract ツールを有効にするかどうか |
| `showDistillation` | `boolean` | `false` | 通知に抽出内容を表示するかどうか |

#### Strategies 設定

**Deduplication**：

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 重複除去戦略を有効にするかどうか |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 重複除去に参加しないツールリスト |

**SupersedeWrites**：

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | 上書き書き込み戦略を有効にするかどうか |

**PurgeErrors**：

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| フィールド | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | エラークリア戦略を有効にするかどうか |
| `turns` | `number` | `4` | エラークリア閾値（ターン数） |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | クリアに参加しないツールリスト |

### getConfig 関数

複数階層の設定をロードしてマージします。

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode プラグインコンテキスト |

**戻り値**：

マージ後の設定オブジェクト。優先度は高い順から：

1. プロジェクト設定 (`.opencode/dcp.jsonc`)
2. 環境変数設定 (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. グローバル設定 (`~/.config/opencode/dcp.jsonc`)
4. デフォルト設定（コードで定義）

**ソースコード位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## ツール API

### createDiscardTool

discard ツールを作成。完了したタスクやノイズとなるツール出力を削除するために使用。

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| ctx | `PruneToolContext` | ツールコンテキスト。client、state、logger、config、workingDirectory を含む |

**ツール仕様**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `ids` | `string[]` | 最初の要素は理由（`'completion'` または `'noise'`）、それ以降は数字の ID |

**ソースコード位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

extract ツールを作成。重要な発見を抽出した後、元のツール出力を削除するために使用。

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| ctx | `PruneToolContext` | ツールコンテキスト。client、state、logger、config、workingDirectory を含む |

**ツール仕様**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `ids` | `string[]` | 数字の ID 配列 |
| `distillation` | `string[]` | 抽出内容配列。ids と同じ長さ |

**ソースコード位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## 状態 API

### SessionState インターフェース

セッション状態オブジェクト。単一セッションのランタイム状態を管理。

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**フィールド説明**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `sessionId` | `string \| null` | OpenCode セッション ID |
| `isSubAgent` | `boolean` | サブエージェントセッションかどうか |
| `prune` | `Prune` | プルーニング状態 |
| `stats` | `SessionStats` | 統計データ |
| `toolParameters` | `Map<string, ToolParameterEntry>` | ツール呼び出しキャッシュ（callID → メタデータ） |
| `nudgeCounter` | `number` | 累積ツール呼び出し回数（リマインダー発火用） |
| `lastToolPrune` | `boolean` | 前回の操作がプルーニングツールだったか |
| `lastCompaction` | `number` | 最後のコンテキスト圧縮タイムスタンプ |
| `currentTurn` | `number` | 現在のターン数 |
| `variant` | `string \| undefined` | モデルバリアント（例：claude-3.5-sonnet） |

**ソースコード位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats インターフェース

セッションレベルの Token プルーニング統計。

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**フィールド説明**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | 現在のセッションでプルーニングされた Token 数（累積） |
| `totalPruneTokens` | `number` | 履歴累積プルーニング Token 数 |

**ソースコード位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune インターフェース

プルーニング状態オブジェクト。

```typescript
export interface Prune {
    toolIds: string[]
}
```

**フィールド説明**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `toolIds` | `string[]` | プルーニング対象としてマークされたツール呼び出し ID リスト |

**ソースコード位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry インターフェース

単一ツール呼び出しのメタデータキャッシュ。

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**フィールド説明**：

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `tool` | `string` | ツール名 |
| `parameters` | `any` | ツールパラメータ |
| `status` | `ToolStatus \| undefined` | ツール実行状態 |
| `error` | `string \| undefined` | エラー情報（あれば） |
| `turn` | `number` | この呼び出しを作成したターン数 |

**ToolStatus 列挙型**：

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**ソースコード位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

新しいセッション状態オブジェクトを作成。

```typescript
export function createSessionState(): SessionState
```

**戻り値**：初期化された SessionState オブジェクト

---

## フック API

### createSystemPromptHandler

システムプロンプト注入フックハンドラを作成。

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| state | `SessionState` | セッション状態オブジェクト |
| logger | `Logger` | ログシステムインスタンス |
| config | `PluginConfig` | 設定オブジェクト |

**動作**：

- サブエージェントセッションかどうかをチェック。そうであればスキップ
- 内部エージェント（例：サマリージェネレーター）かどうかをチェック。そうであればスキップ
- 設定に基づいて対応するプロンプトテンプレート（both/discard/extract）をロード
- プルーニングツールの説明をシステムプロンプトに注入

**ソースコード位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

メッセージ変換フックハンドラを作成。自動プルーニングロジックを実行。

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| client | `any` | OpenCode クライアントインスタンス |
| state | `SessionState` | セッション状態オブジェクト |
| logger | `Logger` | ログシステムインスタンス |
| config | `PluginConfig` | 設定オブジェクト |

**処理フロー**：

1. セッション状態をチェック（サブエージェントかどうか）
2. ツールキャッシュを同期
3. 自動戦略を実行（重複除去、上書き書き込み、エラークリア）
4. マークされたツールコンテンツをプルーニング
5. `<prunable-tools>` リストを注入
6. コンテキストスナップショットを保存（設定されていれば）

**ソースコード位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

コマンド実行フックハンドラを作成。`/dcp` シリーズコマンドを処理。

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**パラメータ**：

| パラメータ名 | 型 | 説明 |
| --- | --- | --- |
| client | `any` | OpenCode クライアントインスタンス |
| state | `SessionState` | セッション状態オブジェクト |
| logger | `Logger` | ログシステムインスタンス |
| config | `PluginConfig` | 設定オブジェクト |
| workingDirectory | `string` | 作業ディレクトリパス |

**サポートするコマンド**：

- `/dcp` - ヘルプ情報を表示
- `/dcp context` - 現在のセッション Token 使用分析を表示
- `/dcp stats` - 累積プルーニング統計を表示
- `/dcp sweep [n]` - ツールを手動プルーニング（数量を指定可能）

**ソースコード位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## 本レッスンのまとめ

本節は DCP プラグインの完全な API リファレンスを提供し、以下をカバーしました：

- プラグインエントリ関数とフック登録メカニズム
- 設定インターフェースとすべての設定項目の詳細な説明
- discard と extract ツールの仕様と作成方法
- セッション状態、統計データ、ツールキャッシュの型定義
- システムプロンプト、メッセージ変換、コマンド実行のフックハンドラ

DCP の内部実装の詳細についてさらに深く理解したい場合は、[アーキテクチャ概要](/ja/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/)と[Token 計算原理](/ja/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/)を参照することをお勧めします。

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコード位置を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| プラグインエントリ関数 | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| 設定インターフェース定義 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| getConfig 関数 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| discard ツール作成 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| extract ツール作成 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| 状態型定義 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| システムプロンプトフック | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| メッセージ変換フック | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| コマンド実行フック | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**重要な型**：
- `Plugin`: OpenCode プラグイン関数シグネチャ
- `PluginConfig`: DCP 設定インターフェース
- `SessionState`: セッション状態インターフェース
- `ToolStatus`: ツール状態列挙型（pending | running | completed | error）

**重要な関数**：
- `plugin()`: プラグインエントリ関数
- `getConfig()`: 設定のロードとマージ
- `createDiscardTool()`: discard ツールの作成
- `createExtractTool()`: extract ツールの作成
- `createSessionState()`: セッション状態の作成

</details>
