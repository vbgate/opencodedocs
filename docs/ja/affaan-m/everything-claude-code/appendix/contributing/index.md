---
title: "コントリビューションガイド: 設定の提出 | Everything Claude Code"
sidebarTitle: "初めての設定を提出する"
subtitle: "コントリビューションガイド: 設定の提出"
description: "Everything Claude Code への設定提出の標準プロセスを学びます。プロジェクトの Fork、ブランチ作成、フォーマット遵守、ローカルテスト、PR 提出の手順をマスターし、コントリビューターになりましょう。"
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# コントリビューションガイド：プロジェクトへの設定、Agent、Skill の貢献方法

## このチュートリアルで学べること

- プロジェクトのコントリビューションプロセスと規約を理解する
- Agents、Skills、Commands、Hooks、Rules、MCP 設定を正しく提出する
- コードスタイルと命名規則に従う
- よくあるコントリビューションの間違いを避ける
- Pull Request を通じてコミュニティと効率的に協力する

## 現在直面している課題

Everything Claude Code に貢献したいけれど、こんな問題に直面していませんか：
- 「どんな内容を貢献すれば価値があるのかわからない」
- 「最初の PR をどう始めればいいかわからない」
- 「ファイルフォーマットや命名規則がわからない」
- 「提出した内容が要件を満たしているか不安」

このチュートリアルでは、理念から実践まで完全なコントリビューションガイドを提供します。

## 核心となる考え方

Everything Claude Code は**コミュニティリソース**であり、一人のプロジェクトではありません。このリポジトリの価値は：

1. **実戦で検証済み** - すべての設定は 10 ヶ月以上の本番環境での使用を経ています
2. **モジュラー設計** - 各 Agent、Skill、Command は独立して再利用可能なコンポーネントです
3. **品質優先** - コードレビューとセキュリティ監査で貢献の品質を確保
4. **オープンコラボレーション** - MIT ライセンス、貢献とカスタマイズを奨励

::: tip なぜ貢献に価値があるのか
- **知識共有**：あなたの経験が他の開発者を助けます
- **影響力**：数百/数千人に使用される設定
- **スキル向上**：プロジェクト構造とコミュニティコラボレーションを学ぶ
- **ネットワーク構築**：Anthropic と Claude Code コミュニティとつながる
:::

## 私たちが求めているもの

### Agents

特定の領域の複雑なタスクを処理する専門化されたサブエージェント：

| タイプ | 例 |
| --- | --- |
| 言語エキスパート | Python, Go, Rust コードレビュー |
| フレームワークエキスパート | Django, Rails, Laravel, Spring |
| DevOps エキスパート | Kubernetes, Terraform, CI/CD |
| ドメインエキスパート | ML パイプライン、データエンジニアリング、モバイル |

### Skills

ワークフロー定義とドメイン知識ベース：

| タイプ | 例 |
| --- | --- |
| 言語ベストプラクティス | Python, Go, Rust コーディング規約 |
| フレームワークパターン | Django, Rails, Laravel アーキテクチャパターン |
| テスト戦略 | ユニットテスト、統合テスト、E2E テスト |
| アーキテクチャガイド | マイクロサービス、イベント駆動、CQRS |
| ドメイン知識 | ML、データ分析、モバイル開発 |

### Commands

クイックワークフローエントリを提供するスラッシュコマンド：

| タイプ | 例 |
| --- | --- |
| デプロイコマンド | Vercel, Railway, AWS へのデプロイ |
| テストコマンド | ユニットテスト、E2E テスト、カバレッジ分析の実行 |
| ドキュメントコマンド | API ドキュメント生成、README 更新 |
| コード生成コマンド | 型生成、CRUD テンプレート生成 |

### Hooks

特定のイベント時にトリガーされる自動化フック：

| タイプ | 例 |
| --- | --- |
| Linting/formatting | コードフォーマット、lint チェック |
| セキュリティチェック | 機密データ検出、脆弱性スキャン |
| 検証フック | Git commit 検証、PR チェック |
| 通知フック | Slack/Email 通知 |

### Rules

コード品質とセキュリティ基準を確保する強制ルール：

| タイプ | 例 |
| --- | --- |
| セキュリティルール | ハードコードされたキーの禁止、OWASP チェック |
| コードスタイル | イミュータブルパターン、ファイルサイズ制限 |
| テスト要件 | 80%+ カバレッジ、TDD プロセス |
| 命名規則 | 変数命名、ファイル命名 |

### MCP Configurations

外部サービス統合を拡張する MCP サーバー設定：

| タイプ | 例 |
| --- | --- |
| データベース統合 | PostgreSQL, MongoDB, ClickHouse |
| クラウドプロバイダー | AWS, GCP, Azure |
| 監視ツール | Datadog, New Relic, Sentry |
| コミュニケーションツール | Slack, Discord, Email |

## 貢献方法

### ステップ 1：プロジェクトを Fork する

**理由**：元のリポジトリに影響を与えずに変更を行うために、自分のコピーが必要です。

```bash
# 1. https://github.com/affaan-m/everything-claude-code にアクセス
# 2. 右上の "Fork" ボタンをクリック
# 3. あなたの fork を Clone
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. upstream リポジトリを追加（後で同期しやすくするため）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**期待される結果**：ローカルに `everything-claude-code` ディレクトリがあり、完全なプロジェクトファイルが含まれています。

### ステップ 2：機能ブランチを作成する

**理由**：ブランチで変更を分離し、管理とマージを容易にします。

```bash
# 説明的なブランチ名を作成
git checkout -b add-python-reviewer

# またはより具体的な命名を使用
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**ブランチ命名規則**：
- `feature/` - 新機能
- `fix/` - バグ修正
- `docs/` - ドキュメント更新
- `refactor/` - コードリファクタリング

### ステップ 3：貢献を追加する

**理由**：ファイルを正しいディレクトリに配置し、Claude Code が正しく読み込めるようにします。

```bash
# 貢献タイプに応じてディレクトリを選択
agents/           # 新しい Agent
skills/           # 新しい Skill（単一の .md またはディレクトリ）
commands/         # 新しいスラッシュコマンド
rules/            # 新しいルールファイル
hooks/            # Hook 設定（hooks/hooks.json を修正）
mcp-configs/      # MCP サーバー設定（mcp-configs/mcp-servers.json を修正）
```

::: tip ディレクトリ構造
- **単一ファイル**：ディレクトリ直下に配置、例：`agents/python-reviewer.md`
- **複雑なコンポーネント**：サブディレクトリを作成、例：`skills/coding-standards/`（複数ファイルを含む）
:::

### ステップ 4：フォーマット規約に従う

#### Agent フォーマット

**理由**：Front Matter は Agent のメタデータを定義し、Claude Code はこれらの情報に依存して Agent を読み込みます。

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**必須フィールド**：
- `name`: Agent 識別子（小文字ハイフン区切り）
- `description`: 機能説明
- `tools`: 使用可能なツールリスト（カンマ区切り）
- `model`: 優先モデル（`opus` または `sonnet`）

#### Skill フォーマット

**理由**：明確な Skill 定義は再利用と理解を容易にします。

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**推奨セクション**：
- `When to Use`: 使用シナリオ
- `How It Works`: 動作原理
- `Examples`: 例（Good vs Bad）
- `References`: 関連リソース（オプション）

#### Command フォーマット

**理由**：明確なコマンド説明はユーザーが機能を理解するのに役立ちます。

Front Matter（必須）：

```markdown
---
description: Run Python tests with coverage report
---
```

本文内容（オプション）：

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

コマンド例（オプション）：

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**必須フィールド**：
- `description`: 簡潔な機能説明

#### Hook フォーマット

**理由**：Hook には明確なマッチングルールと実行アクションが必要です。

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**必須フィールド**：
- `matcher`: トリガー条件式
- `hooks`: 実行するアクションの配列
- `description`: Hook 機能説明

### ステップ 5：貢献をテストする

**理由**：設定が実際の使用で正常に動作することを確認します。

::: warning 重要
PR を提出する前に、**必ず**ローカル環境で設定をテストしてください。
:::

**テスト手順**：

```bash
# 1. Claude Code 設定にコピー
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Claude Code でテスト
# Claude Code を起動して新しい設定を使用

# 3. 機能を検証
# - Agent は正しく呼び出せるか？
# - Command は正しく実行されるか？
# - Hook は正しいタイミングでトリガーされるか？
```

**期待される結果**：設定が Claude Code で正常に動作し、エラーや異常がないこと。

### ステップ 6：PR を提出する

**理由**：Pull Request はコミュニティコラボレーションの標準的な方法です。

```bash
# すべての変更を追加
git add .

# コミット（明確なコミットメッセージを使用）
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# あなたの fork にプッシュ
git push origin add-python-reviewer
```

**その後、GitHub で PR を作成**：

1. あなたの fork リポジトリにアクセス
2. "Compare & pull request" をクリック
3. PR テンプレートを記入：

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**期待される結果**：PR が正常に作成され、メンテナーのレビューを待つ状態。

## ガイドライン

### Do（すべきこと）

✅ **設定を焦点を絞ってモジュラーに保つ**
- 各 Agent/Skill は一つのことだけを行う
- 機能の混在を避ける

✅ **明確な説明を含める**
- Front Matter の説明が正確
- コードコメントが役立つ

✅ **提出前にテストする**
- ローカルで設定を検証
- エラーがないことを確認

✅ **既存のパターンに従う**
- 既存ファイルのフォーマットを参照
- コードスタイルの一貫性を保つ

✅ **依存関係をドキュメント化する**
- 外部依存関係をリスト
- インストール要件を説明

### Don't（すべきでないこと）

❌ **機密データを含める**
- API キー、トークン
- ハードコードされたパス
- 個人認証情報

❌ **過度に複雑またはニッチな設定を追加する**
- 汎用性を優先
- 過剰設計を避ける

❌ **テストされていない設定を提出する**
- テストは必須
- テスト手順を提供

❌ **重複機能を作成する**
- 既存の設定を検索
- 車輪の再発明を避ける

❌ **特定の有料サービスに依存する設定を追加する**
- 無料の代替手段を提供
- またはオープンソースツールを使用

## ファイル命名規則

**理由**：統一された命名規則によりプロジェクトの保守が容易になります。

### 命名ルール

| ルール | 例 |
| --- | --- |
| 小文字を使用 | `python-reviewer.md` |
| ハイフンで区切る | `tdd-workflow.md` |
| 説明的な命名 | `django-pattern-skill.md` |
| 曖昧な名前を避ける | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### マッチング原則

ファイル名は Agent/Skill/Command 名と一致させる：

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip 命名のコツ
- 業界用語を使用（例："PEP 8", "TDD", "REST"）
- 略語を避ける（標準的な略語を除く）
- 簡潔だが説明的に保つ
:::

## コントリビューションプロセスチェックリスト

PR を提出する前に、以下の条件を満たしていることを確認：

### コード品質
- [ ] 既存のコードスタイルに従っている
- [ ] 必要な Front Matter を含んでいる
- [ ] 明確な説明とドキュメントがある
- [ ] ローカルテストに合格している

### ファイル規約
- [ ] ファイル名が命名規則に準拠している
- [ ] ファイルが正しいディレクトリにある
- [ ] JSON フォーマットが正しい（該当する場合）
- [ ] 機密データがない

### PR 品質
- [ ] PR タイトルが変更を明確に説明している
- [ ] PR 説明に "What", "Why", "How" が含まれている
- [ ] 関連 issue にリンクしている（該当する場合）
- [ ] テスト手順を提供している

### コミュニティ規約
- [ ] 重複機能がないことを確認
- [ ] 代替手段を提供（有料サービスが関係する場合）
- [ ] レビューコメントに対応
- [ ] 友好的で建設的な議論を維持

## よくある質問

### Q: どんな貢献が価値があるかをどう知ればいいですか？

**A**: 自分のニーズから始めましょう：
- 最近どんな問題に遭遇しましたか？
- どんな解決策を使いましたか？
- その解決策は再利用可能ですか？

プロジェクトの Issues も確認できます：
- 未解決の機能リクエスト
- 改善提案
- バグレポート

### Q: 貢献が拒否されることはありますか？

**A**: あり得ますが、それは正常なことです。よくある理由：
- 機能がすでに存在する
- 設定が規約に準拠していない
- テストが不足している
- セキュリティまたはプライバシーの問題

メンテナーは詳細なフィードバックを提供するので、フィードバックに基づいて修正して再提出できます。

### Q: PR のステータスをどう追跡すればいいですか？

**A**: 
1. GitHub PR ページでステータスを確認
2. レビューコメントに注目
3. メンテナーのフィードバックに対応
4. 必要に応じて PR を更新

### Q: バグ修正を貢献できますか？

**A**: もちろんです！バグ修正は最も価値のある貢献の一つです：
1. Issues で検索するか新しい issue を作成
2. プロジェクトを Fork してバグを修正
3. テストを追加（必要な場合）
4. PR を提出し、説明で issue を参照

### Q: fork を upstream と同期するにはどうすればいいですか？

**A**:

```bash
# 1. upstream リポジトリを追加（まだの場合）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. upstream の更新を取得
git fetch upstream

# 3. upstream の更新をあなたの main ブランチにマージ
git checkout main
git merge upstream/main

# 4. 更新をあなたの fork にプッシュ
git push origin main

# 5. 最新の main ブランチに基づいてリベース
git checkout your-feature-branch
git rebase main
```

## 連絡先

質問がある場合やヘルプが必要な場合：

- **Issue を開く**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: GitHub 経由で連絡

::: tip 質問のヒント
- まず既存の Issues と Discussions を検索
- 明確なコンテキストと再現手順を提供
- 礼儀正しく建設的に
:::

## このレッスンのまとめ

このレッスンでは、Everything Claude Code のコントリビューションプロセスと規約を体系的に説明しました：

**核心理念**：
- コミュニティリソース、共同構築
- 実戦検証済み、品質優先
- モジュラー設計、再利用が容易
- オープンコラボレーション、知識共有

**貢献タイプ**：
- **Agents**: 専門化されたサブエージェント（言語、フレームワーク、DevOps、ドメインエキスパート）
- **Skills**: ワークフロー定義とドメイン知識ベース
- **Commands**: スラッシュコマンド（デプロイ、テスト、ドキュメント、コード生成）
- **Hooks**: 自動化フック（linting、セキュリティチェック、検証、通知）
- **Rules**: 強制ルール（セキュリティ、コードスタイル、テスト、命名）
- **MCP Configurations**: MCP サーバー設定（データベース、クラウド、監視、コミュニケーション）

**コントリビューションプロセス**：
1. プロジェクトを Fork
2. 機能ブランチを作成
3. 貢献内容を追加
4. フォーマット規約に従う
5. ローカルテスト
6. PR を提出

**フォーマット規約**：
- Agent: Front Matter + 説明 + 指示
- Skill: When to Use + How It Works + Examples
- Command: Description + 使用例
- Hook: Matcher + Hooks + Description

**ガイドライン**：
- **Do**: 焦点を絞る、明確に、テスト、パターンに従う、ドキュメント化
- **Don't**: 機密データ、複雑でニッチ、未テスト、重複、有料依存

**ファイル命名**：
- 小文字 + ハイフン
- 説明的な命名
- Agent/Skill/Command 名と一致

**チェックリスト**：
- コード品質、ファイル規約、PR 品質、コミュニティ規約

## 次のレッスンの予告

> 次のレッスンでは **[設定例：プロジェクトレベルとユーザーレベルの設定](../examples/)** を学びます。
>
> 学べること：
> - プロジェクトレベル設定のベストプラクティス
> - ユーザーレベル設定のパーソナライズ
> - 特定のプロジェクトに合わせた設定のカスタマイズ方法
> - 実際のプロジェクトの設定例

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| コントリビューションガイド | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) | 1-192 |
| Agent 例 | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | - |
| Skill 例 | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | - |
| Command 例 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | - |
| Hook 設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Rule 例 | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | - |
| MCP 設定例 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| 設定例 | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | - |

**主要な Front Matter フィールド**：
- `name`: Agent/Skill/Command 識別子
- `description`: 機能説明
- `tools`: 使用可能なツール（Agent）
- `model`: 優先モデル（Agent、オプション）

**主要なディレクトリ構造**：
- `agents/`: 9 つの専門化されたサブエージェント
- `skills/`: 11 のワークフロー定義
- `commands/`: 14 のスラッシュコマンド
- `rules/`: 8 セットのルール集
- `hooks/`: 自動化フック設定
- `mcp-configs/`: MCP サーバー設定
- `examples/`: 設定例ファイル

**コントリビューション関連リンク**：
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
