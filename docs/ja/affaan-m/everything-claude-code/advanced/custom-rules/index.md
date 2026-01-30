---
title: "カスタム Rules: プロジェクト規約の構築 | Everything Claude Code"
subtitle: "カスタム Rules: プロジェクト規約の構築"
sidebarTitle: "Claude に従わせる"
description: "カスタム Rules ファイルの作成方法を学習。Rule フォーマット、チェックリストの記述、セキュリティルールのカスタマイズ、Git ワークフローの統合をマスターし、Claude にチーム標準を自動的に遵守させます。"
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# カスタム Rules：プロジェクト専用規約の構築

## 学習後にできること

- カスタム Rules ファイルを作成し、プロジェクト専用のコーディング規約を定義する
- チェックリストを使用してコード品質の一貫性を確保する
- チーム規約を Claude Code ワークフローに統合する
- プロジェクトのニーズに応じて異なるタイプのルールをカスタマイズする

## 現在の課題

次のような問題に遭遇したことはありませんか？

- チームメンバーのコードスタイルが不統一で、レビュー時に同じ問題を繰り返し指摘する
- プロジェクトに特別なセキュリティ要件があるが、Claude がそれを理解していない
- コードを書くたびに、チーム規約に従っているか手動でチェックする必要がある
- Claude にプロジェクト固有のベストプラクティスを自動的に提案してほしい

## いつこの手法を使うか

- **新規プロジェクト初期化時** - プロジェクト専用のコーディング規約とセキュリティ標準を定義する
- **チーム協働時** - コードスタイルと品質標準を統一する
- **コードレビューで頻繁に問題が見つかった後** - よくある問題をルールとして固定化する
- **プロジェクトに特別な要件がある時** - 業界規約や技術スタック固有のルールを統合する

## 核心的な考え方

Rules はプロジェクト規約の強制実行層であり、Claude に定義した標準を自動的に遵守させます。

### Rules の動作メカニズム

Rules ファイルは `rules/` ディレクトリに配置され、Claude Code はセッション開始時にすべてのルールを自動的にロードします。コードを生成したりレビューを行うたびに、Claude はこれらのルールに基づいてチェックを実行します。

::: info Rules と Skills の違い

- **Rules**：強制的なチェックリストで、すべての操作に適用される（セキュリティチェック、コードスタイルなど）
- **Skills**：ワークフロー定義とドメイン知識で、特定のタスクに適用される（TDD プロセス、アーキテクチャ設計など）

Rules は「遵守しなければならない」制約であり、Skills は「どのように行うか」のガイドです。
:::

### Rules のファイル構造

各 Rule ファイルは標準フォーマットに従います：

```markdown
# ルールタイトル

## ルールカテゴリ
ルール説明文...

### チェックリスト
- [ ] チェック項目 1
- [ ] チェック項目 2

### コード例
正しい/間違ったコードの対比...
```

## 実践

### ステップ 1：組み込みルールタイプを理解する

Everything Claude Code は 8 セットの組み込みルールを提供しています。まずその機能を理解しましょう。

**理由**

組み込みルールを理解することで、カスタマイズが必要な内容を判断でき、車輪の再発明を避けられます。

**組み込みルールを確認**

ソースコードの `rules/` ディレクトリで確認します：

```bash
ls rules/
```

以下の 8 つのルールファイルが表示されます：

| ルールファイル | 用途 | 適用シーン |
| --- | --- | --- |
| `security.md` | セキュリティチェック | API キー、ユーザー入力、データベース操作に関連 |
| `coding-style.md` | コードスタイル | 関数サイズ、ファイル構成、不変パターン |
| `testing.md` | テスト要件 | テストカバレッジ、TDD プロセス、テストタイプ |
| `performance.md` | パフォーマンス最適化 | モデル選択、コンテキスト管理、圧縮戦略 |
| `agents.md` | Agent 使用 | どの agent をいつ使用するか、並列実行 |
| `git-workflow.md` | Git ワークフロー | コミットフォーマット、PR プロセス、ブランチ管理 |
| `patterns.md` | デザインパターン | Repository パターン、API レスポンスフォーマット、スケルトンプロジェクト |
| `hooks.md` | Hooks システム | Hook タイプ、自動承認権限、TodoWrite |

**表示されるべき内容**：
- 各ルールファイルには明確なタイトルと分類がある
- ルールにはチェックリストとコード例が含まれている
- ルールは特定のシーンと技術要件に適用される

### ステップ 2：カスタムルールファイルを作成する

プロジェクトの `rules/` ディレクトリに新しいルールファイルを作成します。

**理由**

カスタムルールはプロジェクト固有の問題を解決し、Claude にチーム規約を遵守させることができます。

**ルールファイルを作成**

プロジェクトが Next.js と Tailwind CSS を使用していると仮定し、フロントエンドコンポーネント規約を定義します：

```bash
# ルールファイルを作成
touch rules/frontend-conventions.md
```

**ルールファイルを編集**

`rules/frontend-conventions.md` を開き、以下の内容を追加します：

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**表示されるべき内容**：
- ルールファイルは標準 Markdown フォーマットを使用
- 明確なタイトルと分類（##）
- コード例の対比（CORRECT vs WRONG）
- チェックリスト（checkbox）
- ルール説明が簡潔明瞭

### ステップ 3：セキュリティ関連のカスタムルールを定義する

プロジェクトに特別なセキュリティ要件がある場合、専用のセキュリティルールを作成します。

**理由**

組み込みの `security.md` には一般的なセキュリティチェックが含まれていますが、プロジェクトには特定のセキュリティニーズがある可能性があります。

**プロジェクトセキュリティルールを作成**

`rules/project-security.md` を作成します：

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**表示されるべき内容**：
- ルールはプロジェクト固有の技術スタック（JWT、Zod）に対応
- コード例は正しい実装と間違った実装を示す
- チェックリストはすべてのセキュリティチェック項目をカバー

### ステップ 4：プロジェクト固有の Git ワークフロールールを定義する

チームに特別な Git コミット規約がある場合、`git-workflow.md` を拡張するか、カスタムルールを作成できます。

**理由**

組み込みの `git-workflow.md` には基本的なコミットフォーマットが含まれていますが、チームには追加の要件がある可能性があります。

**Git ルールを作成**

`rules/team-git-workflow.md` を作成します：

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist
Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**表示されるべき内容**：
- Git コミットフォーマットにチームカスタムタイプ（`team`）が含まれる
- commit scope が必須
- PR に明確なチェックリストがある
- ルールはチーム協働プロセスに適用される

### ステップ 5：Rules の読み込みを検証する

ルールを作成した後、Claude Code が正しく読み込んでいるか検証します。

**理由**

ルールファイルのフォーマットが正しく、Claude がルールを読み取って適用できることを確認します。

**検証方法**

1. 新しい Claude Code セッションを開始
2. Claude に読み込まれたルールを確認させる：
   ```
   どの Rules ファイルが読み込まれていますか？
   ```

3. ルールが有効かテストする：
   ```
   frontend-conventions ルールに従って React コンポーネントを作成してください
   ```

**表示されるべき内容**：
- Claude が読み込まれたすべての rules（カスタムルールを含む）をリストアップ
- 生成されたコードが定義した規約に従っている
- ルールに違反している場合、Claude が修正を提案

### ステップ 6：Code Review プロセスに統合する

カスタムルールをコードレビュー時に自動的にチェックさせます。

**理由**

コードレビュー時にルールを自動的に適用し、すべてのコードが標準に準拠していることを確認します。

**code-reviewer がルールを参照するように設定**

`agents/code-reviewer.md` が関連ルールを参照していることを確認します：

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**表示されるべき内容**：
- code-reviewer agent がレビュー時にすべての関連ルールをチェック
- レポートが重要度別に分類される
- プロジェクト固有の規約がレビュープロセスに組み込まれる

## チェックポイント ✅

- [ ] 少なくとも 1 つのカスタムルールファイルを作成した
- [ ] ルールファイルが標準フォーマットに従っている（タイトル、分類、コード例、チェックリスト）
- [ ] ルールに正しい/間違ったコードの対比例が含まれている
- [ ] ルールファイルが `rules/` ディレクトリに配置されている
- [ ] Claude Code がルールを正しく読み込んでいることを検証した
- [ ] code-reviewer agent がカスタムルールを参照している

## よくある落とし穴

### ❌ よくある間違い 1：ルールファイル名が不適切

**問題**：ルールファイル名にスペースや特殊文字が含まれており、Claude が読み込めない。

**修正**：
- ✅ 正しい：`frontend-conventions.md`、`project-security.md`
- ❌ 間違い：`Frontend Conventions.md`、`project-security(v2).md`

小文字とハイフンを使用し、スペースと括弧を避けます。

### ❌ よくある間違い 2：ルールが曖昧すぎる

**問題**：ルール説明が曖昧で、準拠しているか明確に判断できない。

**修正**：具体的なチェックリストとコード例を提供します：

```markdown
❌ 曖昧なルール：コンポーネントは簡潔で読みやすくすべき

✅ 具体的なルール：
- コンポーネントは 300 行未満
- 関数は 50 行未満
- 4 層を超えるネストを禁止
```

### ❌ よくある間違い 3：コード例がない

**問題**：テキスト説明のみで、正しい実装と間違った実装を示していない。

**修正**：常にコード例の対比を含めます：

```markdown
CORRECT: 規約に従っている
function example() { ... }

WRONG: 規約に違反している
function example() { ... }
```

### ❌ よくある間違い 4：チェックリストが不完全

**問題**：チェックリストに重要なチェック項目が欠けており、ルールを完全に実行できない。

**修正**：ルール説明のすべての側面をカバーします：

```markdown
チェックリスト：
- [ ] チェック項目 1
- [ ] チェック項目 2
- [ ] ... (すべてのルール要点をカバー)
```

## 本レッスンのまとめ

カスタム Rules はプロジェクト標準化の鍵です：

1. **組み込みルールを理解する** - 8 セットの標準ルールが一般的なシーンをカバー
2. **ルールファイルを作成する** - 標準 Markdown フォーマットを使用
3. **プロジェクト規約を定義する** - 技術スタックとチームのニーズに合わせてカスタマイズ
4. **読み込みを検証する** - Claude がルールを正しく読み取っていることを確認
5. **レビュープロセスに統合する** - code-reviewer にルールを自動的にチェックさせる

カスタム Rules を使用することで、Claude にプロジェクト規約を自動的に遵守させ、コードレビューの作業量を削減し、コード品質の一貫性を向上させることができます。

## 次回の予告

> 次回は **[動的コンテキスト注入：Contexts の使用](../dynamic-contexts/)** を学習します。
>
> 学習内容：
> - Contexts の定義と用途
> - カスタム Contexts の作成方法
> - 異なる作業モードでの Contexts の切り替え
> - Contexts と Rules の違い

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| セキュリティルール | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| コードスタイルルール | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| テストルール | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| パフォーマンス最適化ルール | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Agent 使用ルール | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Git ワークフロールール | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| デザインパターンルール | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks システムルール | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**主要定数**：
- `MIN_TEST_COVERAGE = 80`：最低テストカバレッジ要件
- `MAX_FILE_SIZE = 800`：最大ファイル行数制限
- `MAX_FUNCTION_SIZE = 50`：最大関数行数制限
- `MAX_NESTING_LEVEL = 4`：最大ネストレベル

**主要ルール**：
- **Immutability (CRITICAL)**：オブジェクトの直接変更を禁止し、spread 演算子を使用
- **Secret Management**：ハードコードされたキーを禁止し、環境変数を使用
- **TDD Workflow**：先にテストを書き、実装し、その後リファクタリングすることを要求
- **Model Selection**：タスクの複雑さに応じて Haiku/Sonnet/Opus を選択

</details>
