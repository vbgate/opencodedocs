---
title: "Agentトラブルシューティング：診断と修復 | Everything Claude Code"
sidebarTitle: "Agentが動かない時の対処法"
subtitle: "Agentトラブルシューティング：診断と修復"
description: "Everything Claude Code Agentの呼び出し失敗のトラブルシューティング方法を学びます。Agent未読み込み、設定エラー、ツール権限不足、呼び出しタイムアウトなどの一般的な障害の診断と解決をカバーし、体系的なデバッグスキルを習得します。"
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Agent呼び出し失敗のトラブルシューティング

## 直面している問題

Agentを使用する際に困難に遭遇していますか？以下のような状況に遭遇する可能性があります：

- `/plan`や他のコマンドを入力してもAgentが呼び出されない
- エラーメッセージが表示される：「Agent not found」
- Agentの実行がタイムアウトまたはフリーズする
- Agentの出力が期待と異なる
- Agentがルール通りに動作しない

心配しないでください。これらの問題には通常、明確な解決方法があります。このレッスンでは、Agent関連の問題を体系的にトラブルシューティングして修復する方法を学びます。

## 🎒 始める前の準備

::: warning 前提条件の確認
以下を確認してください：
1. ✅ Everything Claude Codeの[インストール](../../start/installation/)が完了している
2. ✅ [Agentsの概念](../../platforms/agents-overview/)と9つの専門化サブエージェントを理解している
3. ✅ Agentの呼び出しを試みたことがある（`/plan`、`/tdd`、`/code-review`など）
:::

---

## よくある問題1：Agentが全く呼び出されない

### 症状
`/plan`や他のコマンドを入力してもAgentがトリガーされず、通常のチャットのみが行われる。

### 考えられる原因

#### 原因A：Agentファイルのパスが間違っている

**問題**：Agentファイルが正しい場所に配置されておらず、Claude Codeが見つけられない。

**解決策**：

Agentファイルの場所が正しいか確認します：

```bash
# 以下のいずれかの場所にあるべき：
~/.claude/agents/              # ユーザーレベル設定（グローバル）
.claude/agents/                 # プロジェクトレベル設定
```

**確認方法**：

```bash
# ユーザーレベル設定を確認
ls -la ~/.claude/agents/

# プロジェクトレベル設定を確認
ls -la .claude/agents/
```

**9つのAgentファイルが表示されるはず**：
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**ファイルが存在しない場合**、Everything Claude Codeプラグインディレクトリからコピーします：

```bash
# プラグインが ~/.claude-plugins/ にインストールされていると仮定
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# またはクローンしたリポジトリからコピー
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### 原因B：Commandファイルが欠落しているかパスが間違っている

**問題**：Commandファイル（`/plan`に対応する`plan.md`など）が存在しないかパスが間違っている。

**解決策**：

Commandファイルの場所を確認します：

```bash
# Commandsは以下のいずれかの場所にあるべき：
~/.claude/commands/             # ユーザーレベル設定（グローバル）
.claude/commands/                # プロジェクトレベル設定
```

**確認方法**：

```bash
# ユーザーレベル設定を確認
ls -la ~/.claude/commands/

# プロジェクトレベル設定を確認
ls -la .claude/commands/
```

**14個のCommandファイルが表示されるはず**：
- `plan.md` → `planner` agentを呼び出す
- `tdd.md` → `tdd-guide` agentを呼び出す
- `code-review.md` → `code-reviewer` agentを呼び出す
- `build-fix.md` → `build-error-resolver` agentを呼び出す
- `e2e.md` → `e2e-runner` agentを呼び出す
- など...

**ファイルが存在しない場合**、Commandファイルをコピーします：

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### 原因C：プラグインが正しく読み込まれていない

**問題**：プラグインマーケット経由でインストールしたが、プラグインが正しく読み込まれていない。

**解決策**：

`~/.claude/settings.json`のプラグイン設定を確認します：

```bash
# プラグイン設定を確認
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**以下が表示されるはず**：

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**有効になっていない場合**、手動で追加します：

```bash
# settings.jsonを編集
nano ~/.claude/settings.json

# enabledPluginsフィールドを追加または修正
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Claude Codeを再起動して設定を有効にします**。

---

## よくある問題2：Agent呼び出しで「Agent not found」エラー

### 症状
コマンドを入力すると、エラーメッセージが表示される：「Agent not found」または「Could not find agent: xxx」。

### 考えられる原因

#### 原因A：CommandファイルのAgent名が一致しない

**問題**：Commandファイルの`invokes`フィールドとAgentファイル名が一致しない。

**解決策**：

Commandファイルの`invokes`フィールドを確認します：

```bash
# 特定のCommandファイルを確認
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Commandファイルの構造**（`plan.md`を例に）：

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Agentファイルが存在するか確認**：

Commandファイルで言及されているagent名（`planner`など）は、ファイル`planner.md`に対応している必要があります

```bash
# Agentファイルが存在するか確認
ls -la ~/.claude/agents/planner.md

# 存在しない場合、類似した名前のファイルがあるか確認
ls -la ~/.claude/agents/ | grep -i plan
```

**よくある不一致の例**：

| Command invokes | 実際のAgentファイル名 | 問題 |
| --- | --- | --- |
| `planner` | `planner.md` | ✅ 正しい |
| `planner` | `Planner.md` | ❌ 大文字小文字の不一致（Unixシステムは大文字小文字を区別） |
| `planner` | `planner.md.backup` | ❌ ファイル拡張子が間違っている |
| `tdd-guide` | `tdd_guide.md` | ❌ ハイフン vs アンダースコア |

#### 原因B：Agentファイル名が間違っている

**問題**：Agentファイル名が期待と異なる。

**解決策**：

すべてのAgentファイル名を確認します：

```bash
# すべてのAgentファイルをリスト
ls -la ~/.claude/agents/

# 期待される9つのAgentファイル
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**ファイル名が正しくない場合**、ファイル名を変更します：

```bash
# 例：ファイル名を修正
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## よくある問題3：Agent Front Matterのフォーマットエラー

### 症状
Agentが呼び出されるが、エラーメッセージが表示される：「Invalid agent metadata」または類似のフォーマットエラー。

### 考えられる原因

#### 原因A：必須フィールドが欠落している

**問題**：Agent Front Matterに必須フィールド（`name`、`description`、`tools`）が欠落している。

**解決策**：

Agent Front Matterのフォーマットを確認します：

```bash
# 特定のAgentファイルのヘッダーを確認
head -20 ~/.claude/agents/planner.md
```

**正しいFront Matterフォーマット**：

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**必須フィールド**：
- `name`：Agent名（ファイル名と一致する必要があり、拡張子なし）
- `description`：Agentの説明（Agentの責任を理解するため）
- `tools`：使用を許可するツールのリスト（カンマ区切り）

**オプションフィールド**：
- `model`：優先モデル（`opus`または`sonnet`）

#### 原因B：Toolsフィールドが間違っている

**問題**：`tools`フィールドで間違ったツール名またはフォーマットを使用している。

**解決策**：

`tools`フィールドを確認します：

```bash
# toolsフィールドを抽出
grep "^tools:" ~/.claude/agents/*.md
```

**許可されているツール名**（大文字小文字を区別）：
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**よくあるエラー**：

| 間違った書き方 | 正しい書き方 | 問題 |
| --- | --- | --- |
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ 大文字小文字エラー |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ 末尾のカンマ（YAML構文エラー） |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ 引用符で囲む必要なし |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ カンマ区切りが欠落 |
#### 原因C：YAML構文エラー

**問題**：Front Matter YAMLのフォーマットエラー（インデント、引用符、特殊文字など）。

**解決策**：

YAMLフォーマットを検証します：

```bash
# Pythonを使用してYAMLを検証
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# またはyamllintを使用（インストールが必要）
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**よくあるYAMLエラー**：
- インデントの不一致（YAMLはインデントに敏感）
- コロンの後にスペースがない：`name:planner` → `name: planner`
- 文字列内のエスケープされていない特殊文字（コロン、ハッシュなど）
- Tabインデントの使用（YAMLはスペースのみ受け付ける）

---

## よくある問題4：Agentの実行がタイムアウトまたはフリーズする

### 症状
Agentが実行を開始するが、長時間応答がないかフリーズする。

### 考えられる原因

#### 原因A：タスクの複雑度が高すぎる

**問題**：要求されたタスクが複雑すぎて、Agentの処理能力を超えている。

**解決策**：

**タスクをより小さなステップに分割**：

```
❌ 間違い：一度にAgentにプロジェクト全体を処理させる
「ユーザー認証システム全体をリファクタリングして、すべてのテストとドキュメントを含めてください」

✅ 正しい：ステップごとに実行
ステップ1：/plan ユーザー認証システムのリファクタリング
ステップ2：/tdd 最初のステップを実装（ログインAPI）
ステップ3：/tdd 2番目のステップを実装（登録API）
...
```

**`/plan`コマンドで先に計画を立てる**：

```
ユーザー：/plan ユーザー認証システムをリファクタリングする必要があります

Agent (planner):
# 実装計画：ユーザー認証システムのリファクタリング

## フェーズ1：現在の実装の監査
- 既存の認証コードをレビュー
- セキュリティ問題を特定
- 依存関係をリスト

## フェーズ2：新システムの設計
- 認証フローを定義
- 認証方法を選択（JWT、OAuthなど）
- APIエンドポイントを設計

## フェーズ3：コア機能の実装
[詳細なステップ...]

**確認待ち**：この計画で進めますか？（yes/no/modify）
```

#### 原因B：モデル選択が不適切

**問題**：タスクの複雑度が高いが、弱いモデル（`opus`ではなく`sonnet`など）を使用している。

**解決策**：

Agentの`model`フィールドを確認します：

```bash
# すべてのAgentが使用しているモデルを確認
grep "^model:" ~/.claude/agents/*.md
```

**推奨設定**：
- **推論集約型タスク**（`planner`、`architect`など）：`opus`を使用
- **コード生成/修正**（`tdd-guide`、`code-reviewer`など）：`opus`を使用
- **シンプルなタスク**（`refactor-cleaner`など）：`sonnet`を使用可能

**モデル設定を変更**：

Agentファイルを編集します：

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # opusを使用して複雑なタスクのパフォーマンスを向上
---
```

#### 原因C：ファイル読み取りが多すぎる

**問題**：Agentが大量のファイルを読み取り、Token制限を超えている。

**解決策**：

**Agentが読み取るファイルの範囲を制限**：

```
❌ 間違い：Agentにプロジェクト全体を読み取らせる
「プロジェクト内のすべてのファイルを読み取って、アーキテクチャを分析してください」

✅ 正しい：関連ファイルを指定
「src/auth/ ディレクトリ下のファイルを読み取って、認証システムのアーキテクチャを分析してください」
```

**Globパターンで正確にマッチング**：

```
ユーザー：パフォーマンスを最適化してください

Agentは以下を実行すべき：
# Globを使用してパフォーマンス重要ファイルを見つける
Glob pattern="**/*.{ts,tsx}" path="src/api"

# 以下ではなく
Glob pattern="**/*" path="."  # すべてのファイルを読み取る
```

---

## よくある問題5：Agentの出力が期待と異なる

### 症状
Agentが呼び出されて実行されるが、出力が期待と異なるか品質が低い。

### 考えられる原因

#### 原因A：タスクの説明が不明確

**問題**：ユーザーのリクエストが曖昧で、Agentが要件を正確に理解できない。

**解決策**：

**明確で具体的なタスクの説明を提供**：

```
❌ 間違い：曖昧なリクエスト
「コードを最適化してください」

✅ 正しい：具体的なリクエスト
「src/api/markets.ts の searchMarkets 関数を最適化して、
クエリパフォーマンスを向上させ、応答時間を500msから100ms以下に削減してください」
```

**以下の情報を含める**：
- 具体的なファイル名または関数名
- 明確な目標（パフォーマンス、セキュリティ、可読性など）
- 制約条件（既存機能を破壊しない、互換性を維持する必要があるなど）

#### 原因B：コンテキストが不足している

**問題**：Agentに必要なコンテキスト情報が不足しており、正しい判断ができない。

**解決策**：

**背景情報を積極的に提供**：

```
ユーザー：テスト失敗を修正してください

❌ 間違い：コンテキストなし
「npm test がエラーになりました、修正してください」

✅ 正しい：完全なコンテキストを提供
「npm test を実行すると、searchMarkets テストが失敗しました。
エラーメッセージは：Expected 5 but received 0。
先ほど vectorSearch 関数を修正しましたが、これに関連している可能性があります。
問題を特定して修正してください。」
```

**Skillsを使用してドメイン知識を提供**：

プロジェクトに特定のスキルライブラリ（`~/.claude/skills/`）がある場合、Agentは関連知識を自動的に読み込みます。

#### 原因C：Agentの専門分野が一致しない

**問題**：タスクに不適切なAgentを使用している。

**解決策**：

**タスクタイプに応じて正しいAgentを選択**：

| タスクタイプ | 推奨使用 | Command |
| --- | --- | --- |
| 新機能の実装 | `tdd-guide` | `/tdd` |
| 複雑な機能の計画 | `planner` | `/plan` |
| コードレビュー | `code-reviewer` | `/code-review` |
| セキュリティ監査 | `security-reviewer` | 手動呼び出し |
| ビルドエラーの修正 | `build-error-resolver` | `/build-fix` |
| E2Eテスト | `e2e-runner` | `/e2e` |
| デッドコードのクリーンアップ | `refactor-cleaner` | `/refactor-clean` |
| ドキュメント更新 | `doc-updater` | `/update-docs` |
| システムアーキテクチャ設計 | `architect` | 手動呼び出し |

**[Agent概要](../../platforms/agents-overview/)を参照して、各Agentの責任を理解してください**。

---

## よくある問題6：Agentのツール権限が不足している

### 症状
Agentがツールを使用しようとすると拒否され、エラーが表示される：「Tool not available: xxx」。

### 考えられる原因

#### 原因A：Toolsフィールドにそのツールが欠落している

**問題**：AgentのFront Matterの`tools`フィールドに必要なツールが含まれていない。

**解決策**：

Agentの`tools`フィールドを確認します：

```bash
# Agentが使用を許可されているツールを確認
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**ツールが欠落している場合**、`tools`フィールドに追加します：

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # WriteとEditが含まれていることを確認
model: opus
---
```

**ツールの使用シナリオ**：
- `Read`：ファイル内容を読み取る（ほぼすべてのAgentに必要）
- `Write`：新しいファイルを作成
- `Edit`：既存のファイルを編集
- `Bash`：コマンドを実行（テスト実行、ビルドなど）
- `Grep`：ファイル内容を検索
- `Glob`：ファイルパスを検索

#### 原因B：ツール名のスペルミス

**問題**：`tools`フィールドで間違ったツール名を使用している。

**解決策**：

**ツール名のスペルを検証**（大文字小文字を区別）：

| ✅ 正しい | ❌ 間違い |
| --- | --- |
| `Read` | `read`、`READ` |
| `Write` | `write`、`WRITE` |
| `Edit` | `edit`、`EDIT` |
| `Bash` | `bash`、`BASH` |
| `Grep` | `grep`、`GREP` |
| `Glob` | `glob`、`GLOB` |

---

## よくある問題7：Proactive Agentが自動的にトリガーされない

### 症状
特定のAgentが自動的にトリガーされるはず（コード修正後に`code-reviewer`を自動呼び出しなど）だが、トリガーされない。

### 考えられる原因

#### 原因A：トリガー条件が満たされていない

**問題**：Agentの説明に`Use PROACTIVELY`とマークされているが、トリガー条件が満たされていない。

**解決策**：

Agentの`description`フィールドを確認します：

```bash
# Agent説明を確認
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**例（code-reviewer）**：

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proactiveトリガー条件**：
- ユーザーが明示的にコードレビューを要求
- コードの記述/修正を完了した直後
- コードをコミットする前

**手動トリガー**：

自動トリガーが機能しない場合、手動で呼び出すことができます：

```
ユーザー：先ほどのコードをレビューしてください

またはCommandを使用：
ユーザー：/code-review
```

---

## 診断ツールとテクニック

### Agent読み込み状態の確認

Claude CodeがすべてのAgentを正しく読み込んでいるか確認します：

```bash
# Claude Codeログを確認（利用可能な場合）
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Agentを手動でテスト

Claude Code内でAgent呼び出しを手動でテストします：

```
ユーザー：planner agentを呼び出して新機能を計画してください

# Agentが正しく呼び出されるか観察
# 出力が期待通りか確認
```

### Front Matterフォーマットの検証

Pythonを使用してすべてのAgentのFront Matterを検証します：

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << 'PYEOF'
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Front Matterを抽出（---の間）
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # 必須フィールドを確認
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
PYEOF
done
```

`validate-agents.sh`として保存し、実行します：

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## チェックポイント ✅

以下のチェックリストに従って一つずつ確認します：

- [ ] Agentファイルが正しい場所にある（`~/.claude/agents/`または`.claude/agents/`）
- [ ] Commandファイルが正しい場所にある（`~/.claude/commands/`または`.claude/commands/`）
- [ ] Agent Front Matterのフォーマットが正しい（name、description、toolsを含む）
- [ ] Toolsフィールドで正しいツール名を使用している（大文字小文字を区別）
- [ ] Commandの`invokes`フィールドがAgentファイル名と一致している
- [ ] プラグインが`~/.claude/settings.json`で正しく有効になっている
- [ ] タスクの説明が明確で具体的
- [ ] タスクに適したAgentを選択している

---

## ヘルプが必要な場合

上記の方法でも問題が解決しない場合：

1. **診断情報を収集**：
   ```bash
   # 以下の情報を出力
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **GitHub Issuesを確認**：
   - [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)にアクセス
   - 類似の問題を検索

3. **Issueを提出**：
   - 完全なエラーメッセージを含める
   - オペレーティングシステムとバージョン情報を提供
   - 関連するAgentとCommandファイルの内容を添付

---
## 本レッスンのまとめ

Agent呼び出し失敗には通常、以下のいくつかの原因があります：

| 問題タイプ | よくある原因 | クイック診断 |
| --- | --- | --- |
| **全く呼び出されない** | Agent/Commandファイルのパスエラー、プラグイン未読み込み | ファイルの場所を確認、プラグイン設定を検証 |
| **Agent not found** | 名前の不一致（Command invokes vs ファイル名） | ファイル名とinvokesフィールドを検証 |
| **フォーマットエラー** | Front Matterのフィールド欠落、YAML構文エラー | 必須フィールドを確認、YAMLフォーマットを検証 |
| **実行タイムアウト** | タスクの複雑度が高い、モデル選択が不適切 | タスクを分割、opusモデルを使用 |
| **出力が期待と異なる** | タスクの説明が不明確、コンテキスト不足、Agent不一致 | 具体的なタスクを提供、正しいAgentを選択 |
| **ツール権限不足** | Toolsフィールドにツールが欠落、名前のスペルミス | toolsフィールドを確認、ツール名を検証 |

覚えておいてください：ほとんどの問題は、ファイルパスの確認、Front Matterフォーマットの検証、正しいAgentの選択によって解決できます。

---

## 次のレッスンの予告

> 次のレッスンでは **[パフォーマンス最適化のヒント](../performance-tips/)** を学びます。
>
> 学べること：
> - Token使用を最適化する方法
> - Claude Codeの応答速度を向上させる方法
> - コンテキストウィンドウ管理戦略

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| プラグインマニフェスト設定 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Planner Agent | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| TDD Guide Agent | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281 |
| Agent使用ルール | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |

**Front Matter必須フィールド**（すべてのAgentファイル）：
- `name`：Agent識別子（ファイル名と一致する必要があり、`.md`拡張子なし）
- `description`：Agent機能の説明（トリガー条件の説明を含む）
- `tools`：使用を許可するツールのリスト（カンマ区切り：`Read, Grep, Glob`）
- `model`：優先モデル（`opus`または`sonnet`、オプション）

**許可されているツール名**（大文字小文字を区別）：
- `Read`：ファイル内容を読み取る
- `Write`：新しいファイルを作成
- `Edit`：既存のファイルを編集
- `Bash`：コマンドを実行
- `Grep`：ファイル内容を検索
- `Glob`：ファイルパスを検索

**重要な設定パス**：
- ユーザーレベルAgents：`~/.claude/agents/`
- ユーザーレベルCommands：`~/.claude/commands/`
- ユーザーレベルSettings：`~/.claude/settings.json`
- プロジェクトレベルAgents：`.claude/agents/`
- プロジェクトレベルCommands：`.claude/commands/`

**プラグイン読み込み設定**（`~/.claude/settings.json`）：
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
