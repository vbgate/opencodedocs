---
title: "MCP接続エラーのトラブルシューティング | Everything Claude Code"
sidebarTitle: "MCP接続問題の解決"
subtitle: "MCP接続エラーのトラブルシューティング"
description: "MCPサーバー接続問題のトラブルシューティング方法を学びます。APIキーエラー、コンテキストウィンドウ不足、サーバータイプ設定ミスなど6つの一般的な障害を解決し、体系的な修復フローを習得しましょう。"
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# よくある問題のトラブルシューティング：MCP接続エラー

## 直面している問題

MCPサーバーを設定した後、以下のような問題に遭遇することがあります：

- ❌ Claude Codeが「Failed to connect to MCP server」と表示する
- ❌ GitHub/Supabase関連のコマンドが動作しない
- ❌ コンテキストウィンドウが突然小さくなり、ツール呼び出しが遅くなる
- ❌ Filesystem MCPがファイルにアクセスできない
- ❌ 有効化したMCPサーバーが多すぎてシステムが重くなる

心配しないでください。これらの問題にはすべて明確な解決策があります。このレッスンでは、MCP接続問題を体系的にトラブルシューティングする方法を学びます。

---

## よくある問題1：APIキーが未設定または無効

### 症状

GitHub、FirecrawlなどのMCPサーバーを使用しようとすると、Claude Codeが以下のように表示します：

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

または

```
Failed to connect to MCP server: Authentication failed
```

### 原因

MCP設定ファイル内の`YOUR_*_HERE`プレースホルダーが実際のAPIキーに置き換えられていません。

### 解決策

**ステップ1：設定ファイルを確認する**

`~/.claude.json`を開き、対応するMCPサーバーの設定を確認します：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← ここを確認
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**ステップ2：プレースホルダーを置き換える**

`YOUR_GITHUB_PAT_HERE`を実際のAPIキーに置き換えます：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**ステップ3：一般的なMCPサーバーのキー取得先**

| MCPサーバー | 環境変数名 | 取得先 |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | プロジェクト参照 | Supabase Dashboard → Settings → API |

**期待される結果**：Claude Codeを再起動すると、関連ツールが正常に呼び出せるようになります。

### 注意点

::: danger セキュリティに関する注意
実際のAPIキーを含む設定ファイルをGitリポジトリにコミットしないでください。`~/.claude.json`が`.gitignore`に含まれていることを確認してください。
:::

---

## よくある問題2：コンテキストウィンドウが小さすぎる

### 症状

- ツール呼び出しリストが突然短くなる
- Claudeが「Context window exceeded」と表示する
- 応答速度が明らかに遅くなる

### 原因

有効化したMCPサーバーが多すぎて、コンテキストウィンドウが消費されています。プロジェクトのREADMEによると、**200Kのコンテキストウィンドウは、MCPを有効化しすぎると70Kまで縮小します**。

### 解決策

**ステップ1：有効化されているMCPの数を確認する**

`~/.claude.json`の`mcpServers`セクションを確認し、有効化されているサーバーの数を数えます。

**ステップ2：`disabledMcpServers`で不要なサーバーを無効化する**

プロジェクトレベルの設定（`~/.claude/settings.json`またはプロジェクトの`.claude/settings.json`）に以下を追加します：

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**ステップ3：ベストプラクティスに従う**

READMEの推奨事項に従います：

- 20〜30個のMCPサーバーを設定（設定ファイルで定義）
- プロジェクトごとに有効化するのは10個未満
- アクティブなツールの合計は80未満

**期待される結果**：ツールリストが通常の長さに戻り、応答速度が向上します。

### 注意点

::: tip 経験からのアドバイス
プロジェクトタイプに応じて異なるMCPの組み合わせを有効化することをお勧めします。例：
- Webプロジェクト：GitHub、Firecrawl、Memory、Context7
- データプロジェクト：Supabase、ClickHouse、Sequential-thinking
:::

---

## よくある問題3：サーバータイプの設定ミス

### 症状

```
Failed to start MCP server: Command not found
```

または

```
Failed to connect: Invalid server type
```

### 原因

`npx`と`http`の2種類のMCPサーバータイプを混同しています。

### 解決策

**ステップ1：サーバータイプを確認する**

`mcp-configs/mcp-servers.json`を確認し、2つのタイプを区別します：

**npxタイプ**（`command`と`args`が必要）：
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**httpタイプ**（`url`が必要）：
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**ステップ2：設定を修正する**

| MCPサーバー | 正しいタイプ | 正しい設定 |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**期待される結果**：再起動後、MCPサーバーが正常に起動します。

---

## よくある問題4：Filesystem MCPのパス設定エラー

### 症状

- Filesystemツールがファイルにアクセスできない
- 「Path not accessible」または「Permission denied」と表示される

### 原因

Filesystem MCPのパスパラメータが実際のプロジェクトパスに置き換えられていません。

### 解決策

**ステップ1：設定を確認する**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**ステップ2：実際のパスに置き換える**

お使いのオペレーティングシステムに応じてパスを置き換えます：

**macOS/Linux**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**ステップ3：権限を確認する**

設定したパスに読み書き権限があることを確認します。

**期待される結果**：Filesystemツールが指定したパス内のファイルに正常にアクセス・操作できるようになります。

### 注意点

::: warning 注意事項
- `~`記号は使用せず、完全なパスを使用してください
- Windowsのパスではバックスラッシュを`\\`でエスケープする必要があります
- パスの末尾に余分な区切り文字がないことを確認してください
:::

---

## よくある問題5：Supabaseプロジェクト参照が未設定

### 症状

Supabase MCPの接続が失敗し、「Missing project reference」と表示されます。

### 原因

Supabase MCPの`--project-ref`パラメータが設定されていません。

### 解決策

**ステップ1：プロジェクト参照を取得する**

Supabase Dashboardで：
1. プロジェクト設定に移動
2. 「Project Reference」または「API」セクションを見つける
3. プロジェクトID（`xxxxxxxxxxxxxxxx`のような形式）をコピー

**ステップ2：設定を更新する**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**期待される結果**：Supabaseツールがデータベースに正常にクエリできるようになります。

---

## よくある問題6：npxコマンドが見つからない

### 症状

```
Failed to start MCP server: npx: command not found
```

### 原因

システムにNode.jsがインストールされていないか、npxがPATHに含まれていません。

### 解決策

**ステップ1：Node.jsのバージョンを確認する**

```bash
node --version
```

**ステップ2：Node.jsをインストールする（不足している場合）**

[nodejs.org](https://nodejs.org/)にアクセスし、最新のLTSバージョンをダウンロードしてインストールします。

**ステップ3：npxを確認する**

```bash
npx --version
```

**期待される結果**：npxのバージョン番号が正常に表示されます。

---

## トラブルシューティングフローチャート

MCP問題に遭遇した場合、以下の順序でトラブルシューティングを行います：

```
1. APIキーが設定されているか確認
   ↓ (設定済み)
2. 有効化されているMCPの数が10未満か確認
   ↓ (数は正常)
3. サーバータイプ（npx vs http）を確認
   ↓ (タイプは正しい)
4. パスパラメータ（Filesystem、Supabase）を確認
   ↓ (パスは正しい)
5. Node.jsとnpxが利用可能か確認
   ↓ (利用可能)
問題解決！
```

---

## このレッスンのまとめ

MCP接続問題のほとんどは設定に関連しています。以下のポイントを覚えておきましょう：

- ✅ **APIキー**：すべての`YOUR_*_HERE`プレースホルダーを置き換える
- ✅ **コンテキスト管理**：有効化するMCPは10個未満、`disabledMcpServers`で不要なものを無効化
- ✅ **サーバータイプ**：npxとhttpタイプを区別する
- ✅ **パス設定**：FilesystemとSupabaseには具体的なパス/参照を設定
- ✅ **環境依存**：Node.jsとnpxが利用可能であることを確認

問題が解決しない場合は、`~/.claude/settings.json`とプロジェクトレベルの設定に競合がないか確認してください。

---



## 次のレッスン予告

> 次のレッスンでは **[Agent呼び出し失敗のトラブルシューティング](../troubleshooting-agents/)** を学びます。
>
> 学べること：
> - Agent未読み込みと設定エラーのトラブルシューティング方法
> - ツール権限不足の解決策
> - Agent実行タイムアウトと出力が期待と異なる場合の診断

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| MCP設定ファイル | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| コンテキストウィンドウ警告 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**主要な設定**：
- `mcpServers.mcpServers.*.command`：npxタイプサーバーの起動コマンド
- `mcpServers.mcpServers.*.args`：起動パラメータ
- `mcpServers.mcpServers.*.env`：環境変数（APIキー）
- `mcpServers.mcpServers.*.type`：サーバータイプ（「npx」または「http」）
- `mcpServers.mcpServers.*.url`：httpタイプサーバーのURL

**重要な注釈**：
- `mcpServers._comments.env_vars`：`YOUR_*_HERE`プレースホルダーを置き換える
- `mcpServers._comments.disabling`：`disabledMcpServers`でサーバーを無効化
- `mcpServers._comments.context_warning`：コンテキストウィンドウを維持するため有効化は10個未満

</details>
