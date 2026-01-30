---
title: "設定ファイル詳解: settings.json 完全リファレンス | Everything Claude Code"
sidebarTitle: "すべての設定をカスタマイズ"
subtitle: "設定ファイル詳解 settings.json 完全リファレンス"
description: "Everything Claude Code の完全な設定オプションを学びます。Hooks 自動化、MCP サーバー、プラグイン設定をマスターし、設定の競合を素早く解決できます。"
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# 設定ファイル詳解：settings.json 完全リファレンス

## このレッスンで習得できること

- `~/.claude/settings.json` のすべての設定オプションを完全に理解できる
- Hooks 自動化ワークフローをカスタマイズできる
- MCP サーバーを設定・管理できる
- プラグインマニフェストとパス設定を変更できる
- 設定の競合やトラブルを解決できる

## 現在の課題

Everything Claude Code を使っていて、こんな問題に遭遇していませんか：
- 「なぜこの Hook がトリガーされないのか？」
- 「MCP サーバーの接続に失敗した、設定のどこが間違っている？」
- 「ある機能をカスタマイズしたいが、どの設定ファイルを変更すればいい？」
- 「複数の設定ファイルが互いに上書きしている、優先順位はどうなっている？」

このチュートリアルでは、完全な設定リファレンスマニュアルを提供します。

## 基本的な考え方

Claude Code の設定システムは3つのレベルに分かれており、優先順位は高い順に：

1. **プロジェクトレベル設定** (`.claude/settings.json`) - 現在のプロジェクトのみ有効
2. **グローバル設定** (`~/.claude/settings.json`) - すべてのプロジェクトで有効
3. **プラグイン内蔵設定** (Everything Claude Code のデフォルト設定)

::: tip 設定の優先順位
設定は**上書き**ではなく**マージ**されます。プロジェクトレベル設定はグローバル設定の同名オプションを上書きしますが、他のオプションは保持されます。
:::

設定ファイルは JSON 形式で、Claude Code Settings Schema に準拠しています：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

この schema は自動補完と検証を提供するため、常に含めることを推奨します。

## 設定ファイルの構造

### 完全な設定テンプレート

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning JSON 構文ルール
- すべてのキー名と文字列値は**ダブルクォート**で囲む必要があります
- 最後のキーバリューペアの後に**カンマを付けない**でください
- コメントは標準 JSON 構文ではありません。代わりに `"_comments"` フィールドを使用してください
:::

## Hooks 設定詳解

Hooks は Everything Claude Code のコア自動化メカニズムで、特定のイベントでトリガーされる自動化スクリプトを定義します。

### Hook タイプとトリガータイミング

| Hook タイプ | トリガータイミング | 用途 |
| --- | --- | --- |
| `SessionStart` | Claude Code セッション開始時 | コンテキストの読み込み、パッケージマネージャーの検出 |
| `SessionEnd` | Claude Code セッション終了時 | セッション状態の保存、パターン抽出の評価 |
| `PreToolUse` | ツール呼び出し前 | コマンドの検証、危険な操作のブロック |
| `PostToolUse` | ツール呼び出し後 | コードのフォーマット、型チェック |
| `PreCompact` | コンテキスト圧縮前 | 状態スナップショットの保存 |
| `Stop` | AI レスポンス終了時 | console.log などの問題チェック |

### Hook 設定構造

各 Hook エントリには以下のフィールドが含まれます：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook の説明（オプション）"
}
```

#### matcher フィールド

トリガー条件を定義し、以下の変数をサポートします：

| 変数 | 意味 | 例 |
| --- | --- | --- |
| `tool` | ツール名 | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash コマンド内容 | `"npm run dev"` |
| `tool_input.file_path` | Write/Edit のファイルパス | `"/path/to/file.ts"` |

**マッチング演算子**：

```javascript
// 等価
tool == "Bash"

// 正規表現マッチ
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// 論理演算
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks 配列

実行するアクションを定義し、2つのタイプをサポートします：

**Type 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` はプラグインルートディレクトリの変数
- コマンドはプロジェクトルートディレクトリで実行されます
- 標準 JSON 形式の出力は Claude Code に渡されます

**Type 2: prompt**（この設定では未使用）

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### 完全な Hooks 設定例

Everything Claude Code は 15 以上の事前設定された Hooks を提供しています。以下は完全な設定説明です：

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**用途**：開発サーバーを tmux 内で実行することを強制し、ログへのアクセスを確保します。

**マッチするコマンド**：
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**用途**：長時間実行コマンドに tmux の使用を推奨します。

**マッチするコマンド**：
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**用途**：プッシュ前に変更をレビューするよう促します。

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**用途**：ランダムな .md ファイルの作成をブロックし、ドキュメントを集約します。

**許可されるファイル**：
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**用途**：論理的な間隔で手動コンテキスト圧縮を提案します。

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**用途**：前回のセッションコンテキストを読み込み、パッケージマネージャーを検出します。

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**用途**：PR 作成後に URL を記録し、レビューコマンドを提供します。

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**用途**：Prettier で JS/TS ファイルを自動フォーマットします。

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**用途**：TypeScript ファイル編集後に型チェックを実行します。

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**用途**：ファイル内の console.log 文を検出して警告します。

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**用途**：変更されたファイル内の console.log をチェックします。

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**用途**：コンテキスト圧縮前に状態を保存します。

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**用途**：セッション状態を永続化します。

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**用途**：セッションを評価して再利用可能なパターンを抽出します。

### カスタム Hooks

以下の方法で Hooks をカスタマイズできます：

#### 方法 1：settings.json を編集

```bash
# グローバル設定を編集
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### 方法 2：プロジェクトレベル設定で上書き

プロジェクトルートに `.claude/settings.json` を作成：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip プロジェクトレベル設定の利点
- グローバル設定に影響しない
- 特定のプロジェクトでのみ有効
- バージョン管理にコミット可能
:::

## MCP サーバー設定詳解

MCP（Model Context Protocol）サーバーは Claude Code の外部サービス統合機能を拡張します。

### MCP 設定構造

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### MCP サーバータイプ

#### タイプ 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**フィールド説明**：
- `command`: 実行コマンド、通常は `npx`
- `args`: 引数配列、`-y` は自動インストール確認
- `env`: 環境変数オブジェクト
- `description`: 説明テキスト

#### タイプ 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**フィールド説明**：
- `type`: `"http"` である必要があります
- `url`: サーバー URL
- `description`: 説明テキスト

### Everything Claude Code 事前設定 MCP サーバー

以下は事前設定されたすべての MCP サーバーリストです：

| サーバー名 | タイプ | 説明 | 設定が必要 |
| --- | --- | --- | --- |
| `github` | npx | GitHub 操作（PR、Issues、Repos） | GitHub PAT |
| `firecrawl` | npx | Web スクレイピングとクローリング | Firecrawl API Key |
| `supabase` | npx | Supabase データベース操作 | Project Ref |
| `memory` | npx | クロスセッション永続メモリ | なし |
| `sequential-thinking` | npx | チェーン推論 | なし |
| `vercel` | http | Vercel デプロイとプロジェクト管理 | なし |
| `railway` | npx | Railway デプロイ | なし |
| `cloudflare-docs` | http | Cloudflare ドキュメント検索 | なし |
| `cloudflare-workers-builds` | http | Cloudflare Workers ビルド | なし |
| `cloudflare-workers-bindings` | http | Cloudflare Workers バインディング | なし |
| `cloudflare-observability` | http | Cloudflare ログとモニタリング | なし |
| `clickhouse` | http | ClickHouse 分析クエリ | なし |
| `context7` | npx | リアルタイムドキュメント検索 | なし |
| `magic` | npx | Magic UI コンポーネント | なし |
| `filesystem` | npx | ファイルシステム操作 | パス設定 |

### MCP サーバーの追加

#### 事前設定から追加

1. `mcp-configs/mcp-servers.json` からサーバー設定をコピー
2. `~/.claude/settings.json` に貼り付け

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. `YOUR_*_HERE` プレースホルダーを実際の値に置き換え

#### カスタム MCP サーバーの追加

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### MCP サーバーの無効化

`disabledMcpServers` 配列を使用して特定のサーバーを無効化：

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning コンテキストウィンドウの警告
MCP サーバーを多く有効にすると、コンテキストウィンドウを大量に消費します。**10 個未満**の MCP サーバーを有効にすることを推奨します。
:::

## プラグイン設定詳解

### plugin.json 構造

`.claude-plugin/plugin.json` はプラグインマニフェストファイルで、プラグインのメタデータとコンポーネントパスを定義します。

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### フィールド説明

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `name` | string | Y | プラグイン名 |
| `description` | string | Y | プラグインの説明 |
| `author.name` | string | Y | 作者名 |
| `author.url` | string | N | 作者のホームページ URL |
| `homepage` | string | N | プラグインのホームページ |
| `repository` | string | N | リポジトリ URL |
| `license` | string | N | ライセンス |
| `keywords` | string[] | N | キーワード配列 |
| `commands` | string | Y | コマンドディレクトリパス |
| `skills` | string | Y | スキルディレクトリパス |

### プラグインパスの変更

コンポーネントパスをカスタマイズする必要がある場合、`plugin.json` を変更：

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## その他の設定ファイル

### package-manager.json

パッケージマネージャー設定、プロジェクトレベルとグローバルレベルをサポート：

```json
{
  "packageManager": "pnpm"
}
```

**場所**：
- グローバル：`~/.claude/package-manager.json`
- プロジェクト：`.claude/package-manager.json`

### marketplace.json

プラグインマーケットプレイスマニフェスト、`/plugin marketplace add` コマンド用：

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

ステータスバー設定例：

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## 設定ファイルのマージと優先順位

### マージ戦略

設定ファイルは以下の順序でマージされます（後が優先）：

1. プラグイン内蔵設定
2. グローバル設定 (`~/.claude/settings.json`)
3. プロジェクト設定 (`.claude/settings.json`)

**例**：

```json
// プラグイン内蔵
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// グローバル設定
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// プロジェクト設定
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// 最終マージ結果（プロジェクト設定が優先）
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C が A と B を上書き
  }
}
```

::: warning 注意事項
- **同名配列は完全に上書き**され、追加ではありません
- プロジェクト設定では上書きが必要な部分のみ定義することを推奨
- 完全な設定を確認するには `/debug config` コマンドを使用
:::

### 環境変数設定

`settings.json` で環境変数を定義：

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip セキュリティ注意
- 環境変数は設定ファイルに公開されます
- 設定ファイルに機密情報を保存しないでください
- システム環境変数または `.env` ファイルでシークレットを管理してください
:::

## よくある設定問題のトラブルシューティング

### 問題 1: Hook がトリガーされない

**考えられる原因**：
1. Matcher 式のエラー
2. Hook 設定フォーマットのエラー
3. 設定ファイルが正しく保存されていない

**トラブルシューティング手順**：

```bash
# 設定構文をチェック
cat ~/.claude/settings.json | python -m json.tool

# Hook が読み込まれているか確認
# Claude Code で実行
/debug config
```

**よくある修正**：

```json
// ❌ 誤り：シングルクォート
{
  "matcher": "tool == 'Bash'"
}

// ✅ 正しい：ダブルクォート
{
  "matcher": "tool == \"Bash\""
}
```

### 問題 2: MCP サーバー接続失敗

**考えられる原因**：
1. 環境変数が設定されていない
2. ネットワークの問題
3. サーバー URL のエラー

**トラブルシューティング手順**：

```bash
# MCP サーバーをテスト
npx @modelcontextprotocol/server-github --help

# 環境変数をチェック
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**よくある修正**：

```json
// ❌ 誤り：環境変数名が間違っている
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // GITHUB_PERSONAL_ACCESS_TOKEN であるべき
  }
}

// ✅ 正しい
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### 問題 3: 設定の競合

**症状**：一部の設定項目が有効にならない

**原因**：プロジェクトレベル設定がグローバル設定を上書きしている

**解決策**：

```bash
# プロジェクト設定を確認
cat .claude/settings.json

# グローバル設定を確認
cat ~/.claude/settings.json

# プロジェクト設定を削除（不要な場合）
rm .claude/settings.json
```

### 問題 4: JSON フォーマットエラー

**症状**：Claude Code が設定を読み込めない

**トラブルシューティングツール**：

```bash
# jq で検証
cat ~/.claude/settings.json | jq '.'

# Python で検証
cat ~/.claude/settings.json | python -m json.tool

# オンラインツールを使用
# https://jsonlint.com/
```

**よくあるエラー**：

```json
// ❌ 誤り：末尾のカンマ
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ 誤り：シングルクォート
{
  "description": 'Hooks configuration'
}

// ❌ 誤り：コメント
{
  "hooks": {
    // This is a comment
  }
}

// ✅ 正しい
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## このレッスンのまとめ

このレッスンでは Everything Claude Code の完全な設定体系を体系的に解説しました：

**コア概念**：
- 設定は3つのレベル：プロジェクトレベル、グローバルレベル、プラグインレベル
- 設定の優先順位：プロジェクト > グローバル > プラグイン
- JSON フォーマットは厳格、ダブルクォートと構文に注意

**Hooks 設定**：
- 6種類の Hook タイプ、15以上の事前設定 Hook
- Matcher 式でトリガー条件を定義
- カスタム Hook とプロジェクトレベルの上書きをサポート

**MCP サーバー**：
- 2つのタイプ：npx と http
- 15以上の事前設定サーバー
- 無効化とカスタマイズをサポート

**プラグイン設定**：
- plugin.json でプラグインメタデータを定義
- カスタムコンポーネントパスをサポート
- marketplace.json はプラグインマーケットプレイス用

**その他の設定**：
- package-manager.json：パッケージマネージャー設定
- statusline.json：ステータスバー設定
- environmentVariables：環境変数定義

**よくある問題**：
- Hook がトリガーされない → matcher と JSON フォーマットをチェック
- MCP 接続失敗 → 環境変数とネットワークをチェック
- 設定の競合 → プロジェクトレベルとグローバルレベルの設定を確認
- JSON フォーマットエラー → jq またはオンラインツールで検証

## 次のレッスン予告

> 次のレッスンでは **[Rules 完全リファレンス：8つのルールセット詳解](../rules-reference/)** を学びます。
>
> 学習内容：
> - Security ルール：機密データ漏洩の防止
> - Coding Style ルール：コードスタイルとベストプラクティス
> - Testing ルール：テストカバレッジと TDD 要件
> - Git Workflow ルール：コミット規約と PR フロー
> - プロジェクトニーズに合わせたルールセットのカスタマイズ方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Hooks 設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| プラグインマニフェスト | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| MCP サーバー設定 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| プラグインマーケットプレイスマニフェスト | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**主要な Hook スクリプト**：
- `session-start.js`：セッション開始時にコンテキストを読み込み
- `session-end.js`：セッション終了時に状態を保存
- `suggest-compact.js`：手動コンテキスト圧縮を提案
- `pre-compact.js`：圧縮前に状態を保存
- `evaluate-session.js`：セッションを評価してパターンを抽出

**主要な環境変数**：
- `CLAUDE_PLUGIN_ROOT`：プラグインルートディレクトリ
- `GITHUB_PERSONAL_ACCESS_TOKEN`：GitHub API 認証
- `FIRECRAWL_API_KEY`：Firecrawl API 認証

</details>
