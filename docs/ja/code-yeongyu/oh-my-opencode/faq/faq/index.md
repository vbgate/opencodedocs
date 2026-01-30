---
title: "よくある質問: ultrawork モード | oh-my-opencode"
subtitle: "よくある質問への回答"
sidebarTitle: "問題が発生した場合"
description: "oh-my-opencode のよくある質問の回答を学ぶ。ultrawork モード、マルチエージェント協調、バックグラウンドタスク、Ralph Loop、設定のトラブルシューティングを含む。"
tags:
  - "faq"
  - "トラブルシューティング"
  - "インストール"
  - "設定"
order: 160
---

# よくある質問

## 学習後にできること

この FAQ を読み終えると、以下のことができるようになります：

- インストールや設定の問題の解決策を素早く見つける
- ultrawork モードの正しい使い方を理解する
- エージェント呼び出しのベストプラクティスを習得する
- Claude Code 互換性の境界と制限を理解する
- 一般的なセキュリティとパフォーマンスの落とし穴を避ける

---

## インストールと設定

### oh-my-opencode をインストールするには？

**最も簡単な方法**：AI エージェントにインストールを任せる。

以下のプロンプトを LLM エージェント（Claude Code、AmpCode、Cursor など）に送信してください：

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**手動インストール**：[インストールガイド](../start/installation/) を参照してください。

::: tip AI エージェントにインストールを任せる理由
人間は JSONC 形式の設定時にエラーを起こしやすいです（引用符を忘れる、コロンの位置が間違っているなど）。AI エージェントに処理させることで、一般的な構文エラーを回避できます。
:::

### oh-my-opencode をアンインストールするには？

3 ステップでクリーンアップします：

**ステップ 1**：OpenCode 設定からプラグインを削除

`~/.config/opencode/opencode.json`（または `opencode.jsonc`）を編集し、`plugin` 配列から `"oh-my-opencode"` を削除してください。

```bash
# jq を使用して自動的に削除
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**ステップ 2**：設定ファイルを削除（オプション）

```bash
# ユーザー設定を削除
rm -f ~/.config/opencode/oh-my-opencode.json

# プロジェクト設定を削除（存在する場合）
rm -f .opencode/oh-my-opencode.json
```

**ステップ 3**：削除を確認

```bash
opencode --version
# プラグインがロードされなくなるはずです
```

### 設定ファイルはどこにありますか？

設定ファイルには 2 つのレベルがあります：

| レベル | 場所 | 用途 | 優先度 |
| --- | --- | --- | --- |
| プロジェクトレベル | `.opencode/oh-my-opencode.json` | プロジェクト固有の設定 | 低 |
| ユーザーレベル | `~/.config/opencode/oh-my-opencode.json` | グローバルデフォルト設定 | 高 |

**マージルール**：ユーザーレベルの設定がプロジェクトレベルの設定を上書きします。

設定ファイルは JSONC 形式（コメント付き JSON）をサポートしており、コメントと末尾のカンマを追加できます：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // これはコメントです
  "disabled_agents": [], // 末尾のカンマが可能
  "agents": {}
}
```

### 特定の機能を無効化するには？

設定ファイルで `disabled_*` 配列を使用してください：

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code 互換性スイッチ**：

```json
{
  "claude_code": {
    "mcp": false,        // Claude Code の MCP を無効化
    "commands": false,   // Claude Code の Commands を無効化
    "skills": false,     // Claude Code の Skills を無効化
    "hooks": false       // settings.json フックを無効化
  }
}
```

---

## 使用に関する質問

### ultrawork とは何ですか？

**ultrawork**（または省略形 `ulw`）は魔法の言葉です——プロンプトに含めると、すべての機能が自動的に有効化されます：

- ✅ 並列バックグラウンドタスク
- ✅ すべての専門エージェント（Sisyphus、Oracle、Librarian、Explore、Prometheus など）
- ✅ 深層探索モード
- ✅ Todo 強制完了メカニズム

**使用例**：

```
ultrawork REST API を開発する必要があります。JWT 認証とユーザー管理が必要です
```

またはより簡潔に：

```
ulw このモジュールをリファクタリングする
```

::: info 仕組み
`keyword-detector` フックが `ultrawork` または `ulw` キーワードを検出すると、`message.variant` を特殊な値に設定し、すべての高度な機能をトリガーします。
:::

### 特定のエージェントを呼び出すには？

**方法 1：@ 記号を使用**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**方法 2：delegate_task ツールを使用**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**エージェント権限制限**：

| エージェント | コード書き込み | Bash 実行 | タスク委任 | 説明 |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | メインオーケストレーター |
| Oracle | ❌ | ❌ | ❌ | 読み取り専用アドバイザー |
| Librarian | ❌ | ❌ | ❌ | 読み取り専用調査 |
| Explore | ❌ | ❌ | ❌ | 読み取り専用検索 |
| Multimodal Looker | ❌ | ❌ | ❌ | 読み取り専用メディア分析 |
| Prometheus | ✅ | ✅ | ✅ | プランナー |

### バックグラウンドタスクはどのように動作しますか？

バックグラウンドタスクを使用すると、実際の開発チームのように、複数の AI エージェントを並列で動作させることができます：

**バックグラウンドタスクを開始**：

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**作業を続行...**

**システムが自動的に完了を通知**（`background-notification` フック経由）

**結果を取得**：

```
background_output(task_id="bg_abc123")
```

**並行制御**：

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**優先度**：`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip 並行制御が必要な理由
API レート制限とコストの暴走を回避します。例えば、Claude Opus 4.5 は高コストなので並行数を制限しますが、Haiku は低コストなのでより多くの並行が可能です。
:::

### Ralph Loop はどのように使用しますか？

**Ralph Loop** は自己参照型の開発ループです——タスクが完了するまで継続的に作業します。

**開始**：

```
/ralph-loop "認証機能付きの REST API を構築する"
/ralph-loop "支払いモジュールをリファクタリングする" --max-iterations=50
```

**完了の判断方法**：エージェントが `<promise>DONE</promise>` マーカーを出力します。

**ループをキャンセル**：

```
/cancel-ralph
```

**設定**：

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip ultrawork との違い
`/ralph-loop` は通常モード、`/ulw-loop` は ultrawork モード（すべての高度な機能が有効化）です。
:::

### Categories と Skills とは何ですか？

**Categories**（v3.0 で追加）：モデルの抽象化レイヤーで、タスクタイプに基づいて最適なモデルを自動的に選択します。

**組み込み Categories**：

| Category | デフォルトモデル | Temperature | 用途 |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | フロントエンド、UI/UX、デザイン |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | 高知性推論タスク |
| artistry | google/gemini-3-pro | 0.7 | クリエイティブと芸術的タスク |
| quick | anthropic/claude-haiku-4-5 | 0.1 | 高速、低コストタスク |
| writing | google/gemini-3-flash | 0.1 | ドキュメントとライティングタスク |

**Skills**：特定のドメイン向けにベストプラクティスを注入する専門知識モジュール。

**組み込み Skills**：

| Skill | トリガー条件 | 説明 |
| --- | --- | --- |
| playwright | ブラウザ関連タスク | Playwright MCP ブラウザ自動化 |
| frontend-ui-ux | UI/UX タスク | デザイナーから開発者への転身、美しいインターフェースの構築 |
| git-master | Git 操作（commit、rebase、squash） | Git エキスパート、アトミックコミット、履歴検索 |

**使用例**：

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="このページの UI を設計する")
delegate_task(category="quick", skills=["git-master"], prompt="これらの変更をコミットする")
```

::: info 利点
Categories はコストを最適化します（安価なモデルを使用）、Skills は品質を保証します（専門知識を注入）。
:::

---

## Claude Code 互換性

### Claude Code の設定を使用できますか？

**はい**、oh-my-opencode は**完全な互換レイヤー**を提供します：

**サポートされる設定タイプ**：

| タイプ | 読み込み場所 | 優先度 |
| --- | --- | --- |
| Commands | `~/.claude/commands/`、`.claude/commands/` | 低 |
| Skills | `~/.claude/skills/*/SKILL.md`、`.claude/skills/*/SKILL.md` | 中 |
| Agents | `~/.claude/agents/*.md`、`.claude/agents/*.md` | 高 |
| MCPs | `~/.claude/.mcp.json`、`.claude/.mcp.json` | 高 |
| Hooks | `~/.claude/settings.json`、`.claude/settings.json` | 高 |

**設定読み込み優先度**：

OpenCode プロジェクト設定 > Claude Code ユーザー設定

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 特定のプラグインを無効化
    }
  }
}
```

### Claude Code のサブスクリプションを使用できますか？

**技術的には可能ですが、推奨しません**。

::: warning Claude OAuth アクセス制限
2026年1月時点で、Anthropic は ToS 違反を理由にサードパーティの OAuth アクセスを制限しました。
:::

**公式声明**（README より）：

> Claude Code OAuth リクエスト署名を偽造するコミュニティツールが確かに存在します。これらのツールは技術的に検出不可能かもしれませんが、ユーザーは ToS の影響を認識し、個人的に使用を推奨しません。
>
> **このプロジェクトは、非公式ツールの使用による問題について一切責任を負いません。私たちはこれらの OAuth システムのカスタム実装を持っていません。**

**推奨アプローチ**：既存の AI Provider サブスクリプション（Claude、OpenAI、Gemini など）を使用してください。

### データは互換性がありますか？

**はい**、データストレージ形式は互換性があります：

| データ | 場所 | 形式 | 互換性 |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code 互換 |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code 互換 |

Claude Code と oh-my-opencode の間でシームレスに切り替えることができます。

---

## セキュリティとパフォーマンス

### セキュリティ警告はありますか？

**はい**、README の上部に明確な警告があります：

::: danger 警告：なりすましサイト
**ohmyopencode.com はこのプロジェクトと無関係です。** 私たちはこのウェブサイトを運営または支持していません。
>
> OhMyOpenCode は**無料でオープンソース**です。「公式」を名乗るサードパーティのサイトでインストーラーをダウンロードしたり、支払い情報を入力したりしないでください。
>
> なりすましサイトはペイウォールの後ろにあるため、**その配布内容を検証できません**。そこからのダウンロードを**潜在的に危険**とみなしてください。
>
> ✅ 公式ダウンロード：https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### パフォーマンスを最適化するには？

**戦略 1：適切なモデルを使用する**

- 高速タスク → `quick` category を使用（Haiku モデル）
- UI 設計 → `visual` category を使用（Gemini 3 Pro）
- 複雑な推論 → `ultrabrain` category を使用（GPT 5.2）

**戦略 2：並行制御を有効化する**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Anthropic の並行を制限
      "openai": 5      // OpenAI の並行を増加
    }
  }
}
```

**戦略 3：バックグラウンドタスクを使用する**

軽量モデル（例：Haiku）がバックグラウンドで情報を収集し、メインエージェント（Opus）がコアロジックに集中します。

**戦略 4：不要な機能を無効化する**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Claude Code フックを無効化（使用しない場合）
  }
}
```

### OpenCode のバージョン要件は？

**推奨**：OpenCode >= 1.0.132

::: warning 古いバージョンのバグ
バージョン 1.0.132 またはそれ以前を使用している場合、OpenCode のバグが設定を破損させる可能性があります。
>
> この修正は 1.0.132 の後にマージされました——新しいバージョンを使用してください。
:::

バージョンを確認：

```bash
opencode --version
```

---

## トラブルシューティング

### エージェントが動作しませんか？

**チェックリスト**：

1. ✅ 設定ファイルの形式が正しいか確認（JSONC 構文）
2. ✅ Provider 設定を確認（API Key は有効か？）
3. ✅ 診断ツールを実行：`oh-my-opencode doctor --verbose`
4. ✅ OpenCode ログのエラーメッセージを確認

**一般的な問題**：

| 問題 | 原因 | 解決策 |
| --- | --- | --- |
| エージェントがタスクを拒否する | 権限設定が間違っている | `agents.permission` 設定を確認 |
| バックグラウンドタスクがタイムアウト | 並行制限が厳しすぎる | `providerConcurrency` を増加 |
| Thinking ブロックエラー | モデルが thinking をサポートしていない | thinking をサポートするモデルに切り替え |

### 設定ファイルが有効にならない？

**考えられる原因**：

1. JSON 構文エラー（引用符、カンマを忘れた）
2. 設定ファイルの場所が間違っている
3. ユーザー設定がプロジェクト設定を上書きしていない

**検証ステップ**：

```bash
# 設定ファイルが存在するか確認
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# JSON 構文を検証
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**JSON Schema 検証を使用**：

設定ファイルの先頭に `$schema` フィールドを追加すると、エディタが自動的にエラーを表示します：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### バックグラウンドタスクが完了しませんか？

**チェックリスト**：

1. ✅ タスクステータスを確認：`background_output(task_id="...")`
2. ✅ 並行制限を確認：利用可能な並行スロットがあるか
3. ✅ ログを確認：API レート制限エラーはないか

**タスクを強制キャンセル**：

```javascript
background_cancel(task_id="bg_abc123")
```

**タスク TTL**：バックグラウンドタスクは 30 分後に自動的にクリーンアップされます。

---

## その他のリソース

### ヘルプはどこで得られますか？

- **GitHub Issues**：https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord コミュニティ**：https://discord.gg/PUwSMR9XNk
- **X (Twitter)**：https://x.com/justsisyphus

### 推奨される読書順序

初心者の場合、以下の順序で読むことをお勧めします：

1. [クイックインストールと設定](../start/installation/)
2. [Sisyphus との出会い：メインオーケストレーター](../start/sisyphus-orchestrator/)
3. [Ultrawork モード](../start/ultrawork-mode/)
4. [設定診断とトラブルシューティング](../troubleshooting/)

### コードへの貢献

Pull Request を歓迎します！プロジェクトのコードの 99% は OpenCode で構築されています。

機能の改善やバグ修正をしたい場合は：

1. リポジトリを Fork する
2. フィーチャーブランチを作成する
3. 変更をコミットする
4. ブランチにプッシュする
5. Pull Request を作成する

---

## レッスンサマリー

この FAQ は oh-my-opencode のよくある質問をカバーしています：

- **インストールと設定**：インストール方法、アンインストール方法、設定ファイルの場所、機能の無効化
- **使用のコツ**：ultrawork モード、エージェント委任、バックグラウンドタスク、Ralph Loop、Categories と Skills
- **Claude Code 互換性**：設定の読み込み、サブスクリプション使用の制限、データ互換性
- **セキュリティとパフォーマンス**：セキュリティ警告、パフォーマンス最適化戦略、バージョン要件
- **トラブルシューティング**：一般的な問題と解決策

これらのキーポイントを覚えておいてください：

- `ultrawork` または `ulw` キーワードを使用してすべての機能を有効化
- 軽量モデルをバックグラウンドで情報収集させ、メインエージェントをコアロジックに集中させる
- 設定ファイルは JSONC 形式をサポートし、コメントを追加可能
- Claude Code 設定はシームレスに読み込めますが、OAuth アクセスには制限があります
- 公式 GitHub リポジトリからダウンロードし、なりすましサイトに注意

## 次のレッスンの予告

> 使用中に具体的な設定の問題に遭遇した場合、**[設定診断とトラブルシューティング](../troubleshooting/)** を確認できます。
>
> 学べること：
> - 設定を確認するための診断ツールの使用方法
> - 一般的なエラーコードの意味と解決策
> - Provider 設定問題のトラブルシューティングのコツ
> - パフォーマンス問題の特定と最適化の推奨事項

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>ソースコードの場所を展開して表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Keyword Detector（ultrawork 検出） | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | ディレクトリ全体 |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | ファイル全体 |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | ファイル全体 |
| Delegate Task（Category & Skill 解析） | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | ファイル全体 |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | ディレクトリ全体 |

**重要な定数**：
- `DEFAULT_MAX_ITERATIONS = 100`：Ralph Loop デフォルト最大反復回数
- `TASK_TTL_MS = 30 * 60 * 1000`：バックグラウンドタスク TTL（30 分）
- `POLL_INTERVAL_MS = 2000`：バックグラウンドタスクポーリング間隔（2 秒）

**重要な設定**：
- `disabled_agents`：無効化されたエージェントリスト
- `disabled_skills`：無効化されたスキルリスト
- `disabled_hooks`：無効化されたフックリスト
- `claude_code`：Claude Code 互換性設定
- `background_task`：バックグラウンドタスク並行設定
- `categories`：Category カスタム設定
- `agents`：エージェント上書き設定

</details>
