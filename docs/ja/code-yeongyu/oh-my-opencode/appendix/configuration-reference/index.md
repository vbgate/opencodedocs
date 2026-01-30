---
title: "設定リファレンス: 完全な設定オプション | oh-my-opencode"
sidebarTitle: "設定完全ガイド"
subtitle: "設定リファレンス: 完全な設定オプション"
description: "oh-my-opencodeの完全な設定オプションとフィールド定義を学習します。エージェント、Categories、Hooks、バックグラウンドタスクなどすべての設定を網羅し、OpenCode開発環境を高度にカスタマイズしてAIコーディングワークフローを最適化できます。"
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# 設定リファレンス: 完全な設定ファイル Schema 説明

本ページでは、oh-my-opencode設定ファイルの完全なフィールド定義と説明を提供します。

::: info 設定ファイルの場所
- プロジェクトレベル: `.opencode/oh-my-opencode.json`
- ユーザーレベル（macOS/Linux）: `~/.config/opencode/oh-my-opencode.json`
- ユーザーレベル（Windows）: `%APPDATA%\opencode\oh-my-opencode.json`

プロジェクトレベルの設定がユーザーレベルの設定より優先されます。
:::

::: tip 自動補完を有効にする
設定ファイルの先頭に `$schema` フィールドを追加すると、IDEの自動補完機能が利用できます:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## ルートレベルフィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `$schema` | string | いいえ | - | JSON Schema リンク、自動補完用 |
| `disabled_mcps` | string[] | いいえ | [] | 無効化された MCP リスト |
| `disabled_agents` | string[] | いいえ | [] | 無効化されたエージェントリスト |
| `disabled_skills` | string[] | いいえ | [] | 無効化されたスキルリスト |
| `disabled_hooks` | string[] | いいえ | [] | 無効化されたフックリスト |
| `disabled_commands` | string[] | いいえ | [] | 無効化されたコマンドリスト |
| `agents` | object | いいえ | - | エージェント上書き設定 |
| `categories` | object | いいえ | - | Category カスタム設定 |
| `claude_code` | object | いいえ | - | Claude Code 互換性設定 |
| `sisyphus_agent` | object | いいえ | - | Sisyphus エージェント設定 |
| `comment_checker` | object | いいえ | - | コメントチェッカー設定 |
| `experimental` | object | いいえ | - | 実験的機能設定 |
| `auto_update` | boolean | いいえ | true | 自動更新チェック |
| `skills` | object\|array | いいえ | - | Skills 設定 |
| `ralph_loop` | object | いいえ | - | Ralph Loop 設定 |
| `background_task` | object | いいえ | - | バックグラウンドタスク並行設定 |
| `notification` | object | いいえ | - | 通知設定 |
| `git_master` | object | いいえ | - | Git Master スキル設定 |
| `browser_automation_engine` | object | いいえ | - | ブラウザ自動化エンジン設定 |
| `tmux` | object | いいえ | - | Tmux セッション管理設定 |

## agents - エージェント設定

組み込みエージェントの設定を上書きします。各エージェントは以下のフィールドをサポートします:

### 共通エージェントフィールド

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `model` | string | いいえ | エージェントで使用するモデルを上書き（非推奨、category の使用を推奨） |
| `variant` | string | いいえ | モデルバリアント |
| `category` | string | いいえ | Category からモデルと設定を継承 |
| `skills` | string[] | いいえ | エージェントプロンプトに注入するスキルリスト |
| `temperature` | number | いいえ | 0-2、ランダム性を制御 |
| `top_p` | number | いいえ | 0-1、nucleus sampling パラメータ |
| `prompt` | string | いいえ | デフォルトシステムプロンプトを完全に上書き |
| `prompt_append` | string | いいえ | デフォルトプロンプトの後に追加 |
| `tools` | object | いいえ | ツール権限上書き（`{toolName: boolean}`） |
| `disable` | boolean | いいえ | このエージェントを無効化 |
| `description` | string | いいえ | エージェント説明 |
| `mode` | enum | いいえ | `subagent` / `primary` / `all` |
| `color` | string | いいえ | Hex カラー（例: `#FF0000`） |
| `permission` | object | いいえ | エージェント権限制限 |

### permission - エージェント権限

| フィールド | 型 | 必須 | 値 | 説明 |
| --- | --- | --- | --- | --- |
| `edit` | string | いいえ | `ask`/`allow`/`deny` | ファイル編集権限 |
| `bash` | string/object | いいえ | `ask`/`allow`/`deny` または per-command | Bash 実行権限 |
| `webfetch` | string | いいえ | `ask`/`allow`/`deny` | Web リクエスト権限 |
| `doom_loop` | string | いいえ | `ask`/`allow`/`deny` | 無限ループ検出上書き権限 |
| `external_directory` | string | いいえ | `ask`/`allow`/`deny` | 外部ディレクトリアクセス権限 |

### 設定可能なエージェントリスト

| エージェント名 | 説明 |
| --- | --- |
| `sisyphus` | 主オーケストレーターエージェント |
| `prometheus` | 戦略プランナーエージェント |
| `oracle` | 戦略アドバイザーエージェント |
| `librarian` | マルチリポジトリ研究専門家エージェント |
| `explore` | 高速コードベース探索専門家エージェント |
| `multimodal-looker` | メディア分析専門家エージェント |
| `metis` | 前プランニング分析エージェント |
| `momus` | プランニングレビュワーエージェント |
| `atlas` | 主オーケストレーターエージェント |
| `sisyphus-junior` | カテゴリー生成のタスクエグゼキューターエージェント |

### 設定例

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Category 設定

Categories（モデル抽象）を定義し、動的エージェント合成に使用します。

### Category フィールド

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `description` | string | いいえ | Category の目的説明（delegate_task プロンプトに表示） |
| `model` | string | いいえ | Category で使用するモデルを上書き |
| `variant` | string | いいえ | モデルバリアント |
| `temperature` | number | いいえ | 0-2、温度 |
| `top_p` | number | いいえ | 0-1、nucleus sampling |
| `maxTokens` | number | いいえ | 最大 Token 数 |
| `thinking` | object | いいえ | Thinking 設定 `{type, budgetTokens}` |
| `reasoningEffort` | enum | いいえ | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | いいえ | `low` / `medium` / `high` |
| `tools` | object | いいえ | ツール権限 |
| `prompt_append` | string | いいえ | プロンプト追加 |
| `is_unstable_agent` | boolean | いいえ | 不安定エージェントとしてマーク（強制バックグラウンドモード） |

### thinking 設定

| フィールド | 型 | 必須 | 値 | 説明 |
| --- | --- | --- | --- | --- |
| `type` | string | はい | `enabled`/`disabled` | Thinking を有効にするか |
| `budgetTokens` | number | いいえ | - | Thinking budget token 数 |

### 組み込み Categories

| Category | デフォルトモデル | Temperature | 説明 |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | フロントエンド、UI/UX、デザインタスク |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | 高知能推論タスク |
| `artistry` | `google/gemini-3-pro` | 0.7 | クリエイティブとアートタスク |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 高速、低コストタスク |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 未指定タイプの中程度タスク |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | 未指定タイプの高品質タスク |
| `writing` | `google/gemini-3-flash` | 0.1 | ドキュメントとライティングタスク |

### 設定例

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Claude Code 互換設定

Claude Code 互換レイヤーの各機能を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | いいえ | - | `.mcp.json` ファイルを読み込むか |
| `commands` | boolean | いいえ | - | Commands を読み込むか |
| `skills` | boolean | いいえ | - | Skills を読み込むか |
| `agents` | boolean | いいえ | - | Agents を読み込むか（予約） |
| `hooks` | boolean | いいえ | - | settings.json hooks を読み込むか |
| `plugins` | boolean | いいえ | - | Marketplace プラグインを読み込むか |
| `plugins_override` | object | いいえ | - | 特定プラグインを無効化（`{pluginName: boolean}`） |

### 設定例

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus エージェント設定

Sisyphus オーケストレーションシステムの動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | いいえ | false | Sisyphus オーケストレーションシステムを無効化 |
| `default_builder_enabled` | boolean | いいえ | false | OpenCode-Builder エージェントを有効化 |
| `planner_enabled` | boolean | いいえ | true | Prometheus（Planner）エージェントを有効化 |
| `replace_plan` | boolean | いいえ | true | デフォルト plan エージェントを subagent に降格 |

### 設定例

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - バックグラウンドタスク設定

バックグラウンドエージェント管理システムの並行動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | いいえ | - | デフォルト最大並行数 |
| `providerConcurrency` | object | いいえ | - | Provider レベル並行制限（`{providerName: number}`） |
| `modelConcurrency` | object | いいえ | - | Model レベル並行制限（`{modelName: number}`） |
| `staleTimeoutMs` | number | いいえ | 180000 | タイムアウト時間（ミリ秒）、最小 60000 |

### 優先順位

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### 設定例

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master スキル設定

Git Master スキルの動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | いいえ | true | コミットメッセージに "Ultraworked with Sisyphus" footer を追加 |
| `include_co_authored_by` | boolean | いいえ | true | コミットメッセージに "Co-authored-by: Sisyphus" trailer を追加 |

### 設定例

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - ブラウザ自動化設定

ブラウザ自動化プロバイダーを選択します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `provider` | enum | いいえ | `playwright` | ブラウザ自動化プロバイダー |

### provider 選択可能な値

| 値 | 説明 | インストール要件 |
| --- | --- | --- |
| `playwright` | Playwright MCP サーバーを使用 | 自動インストール |

### 設定例

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux セッション設定

Tmux セッション管理の動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | false | Tmux セッション管理を有効にするか |
| `layout` | enum | いいえ | `main-vertical` | Tmux レイアウト |
| `main_pane_size` | number | いいえ | 60 | メインペインサイズ（20-80） |
| `main_pane_min_width` | number | いいえ | 120 | メインペイン最小幅 |
| `agent_pane_min_width` | number | いいえ | 40 | エージェントペイン最小幅 |

### layout 選択可能な値

| 値 | 説明 |
| --- | --- |
| `main-horizontal` | メインペインが上部、エージェントペインが下部にスタック |
| `main-vertical` | メインペインが左側、エージェントペインが右側にスタック（デフォルト） |
| `tiled` | すべてのペインが同じサイズのグリッド |
| `even-horizontal` | すべてのペインが水平に配置 |
| `even-vertical` | すべてのペインが垂直にスタック |

### 設定例

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Ralph Loop 設定

Ralph Loop サイクルワークフローの動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | false | Ralph Loop 機能を有効にするか |
| `default_max_iterations` | number | いいえ | 100 | デフォルト最大イテレーション回数（1-1000） |
| `state_dir` | string | いいえ | - | カスタム状態ファイルディレクトリ（プロジェクトルートからの相対パス） |

### 設定例

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - 通知設定

システム通知の動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `force_enable` | boolean | いいえ | false | 外部通知プラグインが検出されても session-notification を強制的に有効化 |

### 設定例

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - コメントチェッカー設定

コメントチェッカーの動作を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `custom_prompt` | string | いいえ | - | カスタムプロンプト、デフォルト警告メッセージを置換。`{{comments}}` プレースホルダーは検出されたコメントの XML を表す |

### 設定例

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - 実験的機能設定

実験的機能の有効化を制御します。

### フィールド

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `aggressive_truncation` | boolean | いいえ | - | より積極的な切り詰め動作を有効化 |
| `auto_resume` | boolean | いいえ | - | 自動回復を有効化（thinking ブロックエラーや thinking 無効違反からの回復） |
| `truncate_all_tool_outputs` | boolean | いいえ | false | ホワイトリストツールだけでなくすべてのツール出力を切り詰める |
| `dynamic_context_pruning` | object | いいえ | - | 動的コンテキスト修剪設定 |

### dynamic_context_pruning 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | false | 動的コンテキスト修剪を有効化 |
| `notification` | enum | いいえ | `detailed` | 通知レベル: `off` / `minimal` / `detailed` |
| `turn_protection` | object | いいえ | - | Turn 保護設定 |
| `protected_tools` | string[] | いいえ | - | 絶対に修剪しないツールリスト |
| `strategies` | object | いいえ | - | 修剪戦略設定 |

### turn_protection 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | true | turn 保護を有効化 |
| `turns` | number | いいえ | 3 | 最近 N ターンのツール出力を保護（1-10） |

### strategies 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `deduplication` | object | いいえ | - | 重複除去戦略設定 |
| `supersede_writes` | object | いいえ | - | 書き込み上書き戦略設定 |
| `purge_errors` | object | いいえ | - | エラー清理戦略設定 |

### deduplication 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | true | 重複ツール呼び出しを削除（同じツール + 同じパラメータ） |

### supersede_writes 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | true | 後続読み取り時に書き込み入力を修剪 |
| `aggressive` | boolean | いいえ | false | アグレッシブモード: 任意の後続読み取りで任意の書き込みを修剪 |

### purge_errors 設定

| フィールド | 型 | 必須 | デフォルト値 | 説明 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | いいえ | true | N ターン後にエラーツール入力を修剪 |
| `turns` | number | いいえ | 5 | エラーツール入力を修剪するターン数（1-20） |

### 設定例

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Skills 設定

Skills（専門スキル）の読み込みと動作を設定します。

### 設定フォーマット

Skills は2つのフォーマットをサポートします:

**フォーマット1: 単純配列**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**フォーマット2: オブジェクト設定**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Skill 定義フィールド

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `description` | string | いいえ | Skill 説明 |
| `template` | string | いいえ | Skill テンプレート |
| `from` | string | いいえ | ソース |
| `model` | string | いいえ | 使用するモデル |
| `agent` | string | いいえ | 使用するエージェント |
| `subtask` | boolean | いいえ | サブタスクかどうか |
| `argument-hint` | string | いいえ | 引数ヒント |
| `license` | string | いいえ | ライセンス |
| `compatibility` | string | いいえ | 互換性 |
| `metadata` | object | いいえ | メタデータ |
| `allowed-tools` | string[] | いいえ | 許可されたツールリスト |
| `disable` | boolean | いいえ | この Skill を無効化 |

### 組み込み Skills

| Skill | 説明 |
| --- | --- |
| `playwright` | ブラウザ自動化（デフォルト） |
| `agent-browser` | ブラウザ自動化（Vercel CLI） |
| `frontend-ui-ux` | フロントエンド UI/UX デザイン |
| `git-master` | Git エキスパート |

## 無効リスト

以下のフィールドは特定の機能モジュールを無効化するために使用されます。

### disabled_mcps - 無効化された MCP リスト

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - 無効化されたエージェントリスト

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - 無効化されたスキルリスト

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - 無効化されたフックリスト

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - 無効化されたコマンドリスト

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## 付録: ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時: 2026-01-26

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| 設定 Schema 定義 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| 設定ドキュメント | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**重要な型**:
- `OhMyOpenCodeConfig`: メイン設定型
- `AgentOverrideConfig`: エージェント上書き設定型
- `CategoryConfig`: Category 設定型
- `BackgroundTaskConfig`: バックグラウンドタスク設定型
- `PermissionValue`: 権限値型（`ask`/`allow`/`deny`）

**重要な列挙型**:
- `BuiltinAgentNameSchema`: 組み込みエージェント名列挙型
- `BuiltinSkillNameSchema`: 組み込みスキル名列挙型
- `BuiltinCategoryNameSchema`: 組み込み Category 名列挙型
- `HookNameSchema`: フック名列挙型
- `BrowserAutomationProviderSchema`: ブラウザ自動化プロバイダー列挙型

---

## 次回予告

> 次回は **[組み込み MCP サーバー](../builtin-mcps/)** を学習します。
>
> 学べる内容:
> - 3つの組み込み MCP サーバーの機能と使用方法
> - Exa Websearch、Context7、grep.app の設定とベストプラクティス
> - MCP を使用したドキュメントとコードの検索方法

</details>
