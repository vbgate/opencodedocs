---
title: "互換性: Claude Code 統合 | oh-my-opencode"
sidebarTitle: "Claude Code 設定の再利用"
subtitle: "Claude Code 互換性：Commands、Skills、Agents、MCPs、Hooks の完全サポート"
description: "oh-my-opencode の Claude Code 互換レイヤーを学びましょう。設定の読み込み、優先順位ルール、無効化スイッチを理解し、OpenCode へスムーズに移行できます。"
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code 互換性：Commands、Skills、Agents、MCPs、Hooks の完全サポート

## このレッスンで学べること

- OpenCode で Claude Code の既存設定とプラグインを使用する
- 異なる設定ソースの優先順位ルールを理解する
- 設定スイッチで Claude Code 互換機能の読み込みを制御する
- Claude Code から OpenCode へスムーズに移行する

## 現在の課題

Claude Code から OpenCode に移行するユーザーであれば、`~/.claude/` ディレクトリにカスタム Commands、Skills、MCP サーバーを多数設定しているかもしれません。これらを再設定するのは面倒で、OpenCode でそのまま再利用したいと思うでしょう。

Oh My OpenCode は完全な Claude Code 互換レイヤーを提供し、既存の Claude Code 設定とプラグインを変更なしで使用できます。

## 基本的な考え方

Oh My OpenCode は**自動読み込みメカニズム**により Claude Code の設定形式に対応しています。システムは起動時に Claude Code の標準設定ディレクトリを自動スキャンし、これらのリソースを OpenCode が認識できる形式に変換してシステムに登録します。

互換性は以下の機能をカバーしています：

| 機能 | 互換状態 | 説明 |
| --- | --- | --- |
| **Commands** | ✅ 完全対応 | `~/.claude/commands/` と `.claude/commands/` からスラッシュコマンドを読み込み |
| **Skills** | ✅ 完全対応 | `~/.claude/skills/` と `.claude/skills/` から専門スキルを読み込み |
| **Agents** | ⚠️ 予約済み | インターフェース予約済み、現在は組み込み Agents のみ対応 |
| **MCPs** | ✅ 完全対応 | `.mcp.json` と `~/.claude/.mcp.json` から MCP サーバー設定を読み込み |
| **Hooks** | ✅ 完全対応 | `settings.json` からカスタムライフサイクルフックを読み込み |
| **Plugins** | ✅ 完全対応 | `installed_plugins.json` から Marketplace プラグインを読み込み |

---

## 設定読み込みの優先順位

Oh My OpenCode は複数の場所から設定を読み込み、固定の優先順位でマージします。**優先順位の高い設定が低い設定を上書きします**。

### Commands の読み込み優先順位

Commands は以下の順序で読み込まれます（高い順）：

1. `.opencode/command/` (プロジェクトレベル、最高優先)
2. `~/.config/opencode/command/` (ユーザーレベル)
3. `.claude/commands/` (プロジェクトレベル Claude Code 互換)
4. `~/.claude/commands/` (ユーザーレベル Claude Code 互換)

**ソースコードの場所**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// 4つのディレクトリから Commands を読み込み、優先順位でマージ
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**例**: `.opencode/command/refactor.md` と `~/.claude/commands/refactor.md` の両方に同名のコマンドがある場合、`.opencode/` のコマンドが有効になります。

### Skills の読み込み優先順位

Skills は以下の順序で読み込まれます（高い順）：

1. `.opencode/skills/*/SKILL.md` (プロジェクトレベル、最高優先)
2. `~/.config/opencode/skills/*/SKILL.md` (ユーザーレベル)
3. `.claude/skills/*/SKILL.md` (プロジェクトレベル Claude Code 互換)
4. `~/.claude/skills/*/SKILL.md` (ユーザーレベル Claude Code 互換)

**ソースコードの場所**: `src/features/opencode-skill-loader/loader.ts:206-215`

**例**: プロジェクトレベルの Skills はユーザーレベルの Skills を上書きし、各プロジェクト固有のニーズが優先されます。

### MCPs の読み込み優先順位

MCP 設定は以下の順序で読み込まれます（高い順）：

1. `.claude/.mcp.json` (プロジェクトレベル、最高優先)
2. `.mcp.json` (プロジェクトレベル)
3. `~/.claude/.mcp.json` (ユーザーレベル)

**ソースコードの場所**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**特徴**: MCP 設定は環境変数の展開（例：`${OPENAI_API_KEY}`）をサポートし、`env-expander.ts` で自動解析されます。

**ソースコードの場所**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Hooks の読み込み優先順位

Hooks は `settings.json` の `hooks` フィールドから読み込まれ、以下のパスをサポートします（優先順位順）：

1. `.claude/settings.local.json` (ローカル設定、最高優先)
2. `.claude/settings.json` (プロジェクトレベル)
3. `~/.claude/settings.json` (ユーザーレベル)

**ソースコードの場所**: `src/hooks/claude-code-hooks/config.ts:46-59`

**特徴**: 複数の設定ファイルの Hooks は上書きではなく自動的にマージされます。

---

## 設定の無効化スイッチ

Claude Code の特定の設定を読み込みたくない場合、`oh-my-opencode.json` の `claude_code` フィールドで細かく制御できます。

### 互換性を完全に無効化

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### 部分的に無効化

特定の機能のみを無効化することもできます：

```jsonc
{
  "claude_code": {
    "mcp": false,         // .mcp.json ファイルを無効化（組み込み MCPs は保持）
    "commands": false,     // ~/.claude/commands/ と .claude/commands/ を無効化
    "skills": false,       // ~/.claude/skills/ と .claude/skills/ を無効化
    "agents": false,       // ~/.claude/agents/ を無効化（組み込み Agents は保持）
    "hooks": false,        // settings.json hooks を無効化
    "plugins": false       // Claude Code Marketplace プラグインを無効化
  }
}
```

**スイッチの説明**:

| スイッチ | 無効化される内容 | 保持される内容 |
| --- | --- | --- |
| `mcp` | `.mcp.json` ファイル | 組み込み MCPs（websearch、context7、grep_app） |
| `commands` | `~/.claude/commands/`、`.claude/commands/` | OpenCode ネイティブ Commands |
| `skills` | `~/.claude/skills/`、`.claude/skills/` | OpenCode ネイティブ Skills |
| `agents` | `~/.claude/agents/` | 組み込み Agents（Sisyphus、Oracle、Librarian など） |
| `hooks` | `settings.json` hooks | Oh My OpenCode 組み込み Hooks |
| `plugins` | Claude Code Marketplace プラグイン | 組み込みプラグイン機能 |

### 特定のプラグインを無効化

`plugins_override` を使用して特定の Claude Code Marketplace プラグインを無効化：

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // claude-mem プラグインを無効化
    }
  }
}
```

**ソースコードの場所**: `src/config/schema.ts:143`

---

## データストレージの互換性

Oh My OpenCode は Claude Code のデータストレージ形式に対応し、セッションとタスクデータの永続化と移行を保証します。

### Todos ストレージ

- **場所**: `~/.claude/todos/`
- **形式**: Claude Code 互換の JSON 形式
- **用途**: タスクリストと To-Do アイテムの保存

**ソースコードの場所**: `src/features/claude-code-session-state/index.ts`

### Transcripts ストレージ

- **場所**: `~/.claude/transcripts/`
- **形式**: JSONL（1行に1つの JSON オブジェクト）
- **用途**: セッション履歴とメッセージ記録の保存

**ソースコードの場所**: `src/features/claude-code-session-state/index.ts`

**メリット**: Claude Code と同じデータディレクトリを共有し、セッション履歴を直接移行できます。

---

## Claude Code Hooks の統合

Claude Code の `settings.json` にある `hooks` フィールドは、特定のイベントポイントで実行されるカスタムスクリプトを定義します。Oh My OpenCode はこれらの Hooks を完全にサポートしています。

### Hook イベントタイプ

| イベント | トリガータイミング | 実行可能な操作 |
| --- | --- | --- |
| **PreToolUse** | ツール実行前 | ツール呼び出しのブロック、入力パラメータの変更、コンテキストの注入 |
| **PostToolUse** | ツール実行後 | 警告の追加、出力の変更、メッセージの注入 |
| **UserPromptSubmit** | ユーザーがプロンプトを送信時 | プロンプトのブロック、メッセージの注入、プロンプトの変換 |
| **Stop** | セッションがアイドル状態になった時 | 後続プロンプトの注入、自動化タスクの実行 |

**ソースコードの場所**: `src/hooks/claude-code-hooks/index.ts`

### Hook 設定の例

以下は典型的な Claude Code Hooks 設定です：

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**フィールドの説明**:

- **matcher**: ツール名のマッチングパターン（ワイルドカード `*` をサポート）
- **type**: Hook タイプ（`command`、`inject` など）
- **command**: 実行するシェルコマンド（`$FILE` などの変数をサポート）
- **content**: 注入するメッセージ内容

### Hook 実行メカニズム

Oh My OpenCode は `claude-code-hooks` Hook を通じてこれらのカスタム Hooks を自動実行します。この Hook はすべてのイベントポイントで Claude Code の設定をチェックして読み込みます。

**ソースコードの場所**: `src/hooks/claude-code-hooks/index.ts:36-401`

**実行フロー**:

1. Claude Code の `settings.json` を読み込み
2. `hooks` フィールドを解析し、現在のイベントにマッチング
3. マッチした Hooks を順番に実行
4. 戻り値に基づいてエージェントの動作を変更（ブロック、注入、警告など）

**例**: PreToolUse Hook が `deny` を返した場合、ツール呼び出しはブロックされ、エージェントはエラーメッセージを受け取ります。

---

## よくある使用シナリオ

### シナリオ 1: Claude Code 設定の移行

Claude Code で Commands と Skills を設定済みの場合、OpenCode でそのまま使用できます：

**手順**:

1. `~/.claude/` ディレクトリが存在し、設定が含まれていることを確認
2. OpenCode を起動すると、Oh My OpenCode がこれらの設定を自動読み込み
3. チャットで `/` を入力して読み込まれた Commands を確認
4. Commands を使用するか Skills を呼び出す

**確認**: Oh My OpenCode の起動ログで読み込まれた設定の数を確認できます。

### シナリオ 2: プロジェクトレベルの設定オーバーライド

特定のプロジェクトで異なる Skills を使用し、他のプロジェクトに影響を与えたくない場合：

**手順**:

1. プロジェクトルートに `.claude/skills/` ディレクトリを作成
2. プロジェクト固有の Skill を追加（例：`./.claude/skills/my-skill/SKILL.md`）
3. OpenCode を再起動
4. プロジェクトレベルの Skill がユーザーレベルの Skill を自動的に上書き

**メリット**: 各プロジェクトが独立した設定を持ち、互いに干渉しません。

### シナリオ 3: Claude Code 互換性の無効化

OpenCode ネイティブ設定のみを使用し、Claude Code の古い設定を読み込みたくない場合：

**手順**:

1. `oh-my-opencode.json` を編集
2. 以下の設定を追加：

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. OpenCode を再起動

**結果**: システムはすべての Claude Code 設定を無視し、OpenCode ネイティブ設定のみを使用します。

---

## よくある落とし穴

### ⚠️ 設定の競合

**問題**: 複数の場所に同名の設定がある場合（例：同じ Command 名が `.opencode/command/` と `~/.claude/commands/` の両方に存在）、予期しない動作が発生する可能性があります。

**解決策**: 読み込み優先順位を理解し、最も優先度の高い設定を最も優先度の高いディレクトリに配置します。

### ⚠️ MCP 設定形式の違い

**問題**: Claude Code の MCP 設定形式は OpenCode と若干異なり、直接コピーしても動作しない場合があります。

**解決策**: Oh My OpenCode は形式を自動変換しますが、公式ドキュメントを参照して設定が正しいことを確認することをお勧めします。

**ソースコードの場所**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Hooks のパフォーマンスへの影響

**問題**: Hooks が多すぎたり、複雑な Hook スクリプトがあると、パフォーマンスが低下する可能性があります。

**解決策**: Hooks の数を制限し、必要な Hooks のみを保持します。`disabled_hooks` で特定の Hooks を無効化できます。

---

## このレッスンのまとめ

Oh My OpenCode は完全な Claude Code 互換レイヤーを提供し、既存の設定をシームレスに移行・再利用できます：

- **設定読み込み優先順位**: プロジェクトレベル > ユーザーレベル > Claude Code 互換の順序で設定を読み込み
- **互換性スイッチ**: `claude_code` フィールドでどの機能を読み込むかを正確に制御
- **データストレージ互換**: `~/.claude/` ディレクトリを共有し、セッションとタスクデータの移行をサポート
- **Hooks 統合**: Claude Code のライフサイクルフックシステムを完全サポート

Claude Code から移行するユーザーにとって、この互換レイヤーにより設定なしで OpenCode を使い始めることができます。

---

## 次のレッスンの予告

> 次のレッスンでは **[設定リファレンス](../configuration-reference/)** を学びます。
>
> 学べる内容：
> - `oh-my-opencode.json` の完全な設定フィールド説明
> - 各フィールドの型、デフォルト値、制約条件
> - よく使う設定パターンとベストプラクティス

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Claude Code Hooks メインエントリ | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks 設定読み込み | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP 設定ローダー | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands ローダー | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills ローダー | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins ローダー | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | 全文 |
| データストレージ互換性 | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | 全文 |
| MCP 設定トランスフォーマー | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | 全文 |
| 環境変数展開 | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | 全文 |

**主要関数**：

- `createClaudeCodeHooksHook()`: Claude Code Hooks 統合 Hook を作成し、すべてのイベント（PreToolUse、PostToolUse、UserPromptSubmit、Stop）を処理
- `loadClaudeHooksConfig()`: Claude Code の `settings.json` 設定を読み込み
- `loadMcpConfigs()`: MCP サーバー設定を読み込み、環境変数展開をサポート
- `loadAllCommands()`: 4つのディレクトリから Commands を読み込み、優先順位でマージ
- `discoverSkills()`: 4つのディレクトリから Skills を読み込み、Claude Code 互換パスをサポート
- `getClaudeConfigDir()`: Claude Code 設定ディレクトリパスを取得（プラットフォーム依存）

**主要定数**：

- 設定読み込み優先順位：`.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook イベントタイプ：`PreToolUse`、`PostToolUse`、`UserPromptSubmit`、`Stop`、`PreCompact`

</details>
