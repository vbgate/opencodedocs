---
title: "設定例: プロジェクトレベルとユーザーレベルの設定 | Everything Claude Code"
sidebarTitle: "プロジェクト設定を素早く設定"
subtitle: "設定例: プロジェクトレベルとユーザーレベルの設定"
description: "Everything Claude Code の設定ファイルの使用方法を学びます。プロジェクトレベルの CLAUDE.md とユーザーレベル設定の設定、設定階層、重要フィールド、カスタムステータスバー設定の習得、フロントエンド、バックエンド、フルスタックプロジェクトに応じた設定調整、カスタム設定の素早い開始。"
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# 設定例：プロジェクトレベルとユーザーレベルの設定

## 学習後の達成目標

- プロジェクト用の CLAUDE.md ファイルを素早く設定
- ユーザーレベルのグローバル設定を設定して開発効率を向上
- 重要情報を表示するカスタムステータスバー
- プロジェクト要件に応じた設定テンプレートの調整

## 現在の課題

Everything Claude Code の設定ファイルに直面すると、以下のような問題に直面するかもしれません：

- **どこから始めればよいかわからない**：プロジェクトレベルとユーザーレベルの設定の違いは？それぞれどこに配置する？
- **設定ファイルが長すぎる**：CLAUDE.md に何を書けばよい？何が必須？
- **ステータスバーが不十分**：カスタムステータスバーで有用な情報を表示するには？
- **カスタマイズ方法がわからない**：サンプル設定をプロジェクト要件に応じて調整するには？

このドキュメントでは、完全な設定例を提供し、Everything Claude Code を素早く使いこなせるようにします。

---

## 設定階層の概要

Everything Claude Code は 2 種類の設定階層をサポートしています：

| 設定タイプ | 位置 | 適用範囲 | 典型的な用途 |
|--- | --- | --- | ---|
| **プロジェクトレベル設定** | プロジェクトルートディレクトリ `CLAUDE.md` | 現在のプロジェクトのみ | プロジェクト固有のルール、技術スタック、ファイル構造 |
| **ユーザーレベル設定** | `~/.claude/CLAUDE.md` | すべてのプロジェクト | 個人のコーディング設定、汎用ルール、エディター設定 |

::: tip 設定の優先順位

プロジェクトレベルとユーザーレベルの設定が同時に存在する場合：
- **ルールの統合**：両方のルールが有効になります
- **競合の処理**：プロジェクトレベルの設定がユーザーレベルの設定より優先されます
- **推奨される方法**：ユーザーレベル設定には汎用ルール、プロジェクトレベル設定にはプロジェクト固有のルールを配置
:::

---

## 1. プロジェクトレベル設定例

### 1.1 設定ファイルの位置

以下の内容をプロジェクトルートディレクトリの `CLAUDE.md` ファイルに保存します：

```markdown
# プロジェクト名 CLAUDE.md

## Project Overview

[プロジェクトの簡単な説明：何をするものか、使用する技術スタック]

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
src/
|---|
|---|
|---|
|---|
|---|
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Available Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Create implementation plan
- `/code-review` - Review code quality
- `/build-fix` - Fix build errors

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge
```

### 1.2 重要フィールドの説明

#### Project Overview

プロジェクトを簡単に説明し、Claude Code がプロジェクトの背景を理解できるようにします：

```markdown
## Project Overview

Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

これは最も重要な部分で、プロジェクトが従うべきルールを定義します：

| ルールカテゴリ | 説明 | 必須 |
|--- | --- | ---|
| Code Organization | ファイル構成の原則 | はい |
| Code Style | コーディングスタイル | はい |
| Testing | テスト要件 | はい |
| Security | セキュリティ規範 | はい |

#### Key Patterns

プロジェクトでよく使用されるパターンを定義します。Claude Code は自動的にこれを適用します：

```markdown
## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling Pattern

[サンプルコード]
```

---

## 2. ユーザーレベル設定例

### 2.1 設定ファイルの位置

以下の内容を `~/.claude/CLAUDE.md` に保存します：

```markdown
# User-Level CLAUDE.md Example

User-level configs apply globally across all projects. Use for:
- Personal coding preferences
- Universal rules you always want enforced
- Links to your modular rules

---

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security

---

## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
|--- | ---|
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |

---

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose |
|--- | ---|
| planner | Feature implementation planning |
| architect | System design and architecture |
|--- | ---|
| code-reviewer | Code review for quality/security |
| security-reviewer | Security vulnerability analysis |
| build-error-resolver | Build error resolution |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| doc-updater | Documentation updates |

---

## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Always test locally before committing
- Small, focused commits

### Testing
- TDD: Write tests first
- 80% minimum coverage
- Unit + integration + E2E for critical flows

---

## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled

---

## Success Metrics

You are successful when:
- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met

---

**Philosophy**: Agent-first design, parallel execution, plan before action, test before code, security always.
```

### 2.2 コア設定モジュール

#### Core Philosophy

Claude Code との連携哲学を定義します：

```markdown
## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security
```

#### Modular Rules

モジュール化されたルールファイルにリンクし、設定を簡潔に保ちます：

```markdown
## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
|--- | ---|
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |
```

#### Editor Integration

Claude Code に使用しているエディターとショートカットを伝えます：

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. カスタムステータスバー設定

### 3.1 設定ファイルの位置

以下の内容を `~/.claude/settings.json` に追加します：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 ステータスバーの表示内容

設定後のステータスバーには以下が表示されます：

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| コンポーネント | 意味 | 例 |
|--- | --- | ---|
| `user` | 現在のユーザー名 | `affoon` |
| `path` | 現在のディレクトリ（~ で省略） | `~/projects/myapp` |
| `branch*` | Git ブランチ（* は未コミットの変更があることを示す） | `main*` |
| `ctx:%` | コンテキストウィンドウの残り割合 | `ctx:73%` |
| `model` | 現在使用中のモデル | `sonnet-4.5` |
| `time` | 現在時刻 | `14:30` |
| `todos:N` | Todo アイテムの数 | `todos:3` |

### 3.3 カスタムカラー

ステータスバーは ANSI カラーコードを使用しており、カスタマイズできます：

| カラーコード | 変数 | 用途 | RGB |
|--- | --- | --- | ---|
| 青 | `B` | ディレクトリパス | 30,102,245 |
| 緑 | `G` | Git ブランチ | 64,160,43 |
| 黄 | `Y` | 変更あり状態、時刻 | 223,142,29 |
| マゼンタ | `M` | コンテキスト残り | 136,57,239 |
| シアン | `C` | ユーザー名、Todo | 23,146,153 |
| グレー | `T` | モデル名 | 76,79,105 |

**色を変更する方法**：

```bash
# 色変数の定義を見つける
B='\\033[38;2;30;102;245m'  # 青 RGB 形式
#                    ↓  ↓   ↓
#                   赤 緑 青

# 好きな色に変更
B='\\033[38;2;255;100;100m'  # 赤
```

### 3.4 ステータスバーの簡略化

ステータスバーが長すぎると思われる場合は、簡略化できます：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

簡略化後のステータスバー：

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. 設定カスタマイズガイド

### 4.1 プロジェクトレベル設定のカスタマイズ

プロジェクトタイプに応じて `CLAUDE.md` を調整します：

#### フロントエンドプロジェクト

```markdown
## Project Overview

Next.js E-commerce App with React, Tailwind CSS, and Shopify API.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **API**: Shopify Storefront API, GraphQL
- **Deployment**: Vercel

## Critical Rules

### 1. Component Architecture

- Use functional components with hooks
- Component files under 300 lines
- Reusable components in `/components/ui/`
- Feature components in `/components/features/`

### 2. Styling

- Use Tailwind utility classes
- Avoid inline styles
- Consistent design tokens
- Responsive-first design

### 3. Performance

- Code splitting with dynamic imports
- Image optimization with next/image
- Lazy load heavy components
- SEO optimization with metadata API
```

#### バックエンドプロジェクト

```markdown
## Project Overview

Node.js REST API with Express, MongoDB, and Redis.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Auth**: JWT, bcrypt
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Railway

## Critical Rules

### 1. API Design

- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- API versioning (`/api/v1/`)

### 2. Database

- Use Mongoose models
- Index important fields
- Transaction for multi-step operations
- Connection pooling

### 3. Security

- Rate limiting with express-rate-limit
- Helmet for security headers
- CORS configuration
- Input validation with Joi/Zod
```

#### フルスタックプロジェクト

```markdown
## Project Overview

Full-stack SaaS app with Next.js, Supabase, and OpenAI.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API
- **Testing**: Playwright, Jest, Vitest

## Critical Rules

### 1. Monorepo Structure

```
/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Next.js API routes
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database utilities
│   └── types/            # TypeScript types
└── docs/
```

### 2. API & Frontend Integration

- Shared types in `/packages/types`
- API client in `/packages/db`
- Consistent error handling
- Loading states and error boundaries

### 3. Full-Stack Testing

- Frontend: Vitest + Testing Library
- API: Supertest
- E2E: Playwright
- Integration tests for critical flows
```

### 4.2 ユーザーレベル設定のカスタマイズ

個人の設定に応じて `~/.claude/CLAUDE.md` を調整します：

#### テストカバレッジ要件の調整

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # 90% に調整
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### 個人コーディングスタイル設定の追加

```markdown
## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file
- Prefer explicit return statements over implicit returns
- Use meaningful variable names, not abbreviations
- Add JSDoc comments for complex functions
```

#### Git コミット規範の調整

```markdown
## Git

### Commit Message Format

Conventional commits with team-specific conventions:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `perf(scope): description` - Performance improvements
- `refactor(scope): description` - Code refactoring
- `docs(scope): description` - Documentation changes
- `test(scope): description` - Test additions/changes
- `chore(scope): description` - Maintenance tasks
- `ci(scope): description` - CI/CD changes

### Commit Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No console.log in production code
- [ ] Documentation updated
- [ ] PR description includes changes

### PR Workflow

- Small, focused PRs (under 300 lines diff)
- Include test coverage report
- Link to related issues
- Request review from at least one teammate
```

### 4.3 ステータスバーのカスタマイズ

#### さらに情報を追加

```bash
# Node.js バージョンを追加
node_version=$(node --version 2>/dev/null || echo '')

# 現在の日付を追加
date=$(date +%Y-%m-%d)

# ステータスバーに表示
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

表示結果：

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### 重要情報のみを表示

```bash
# 最小限のステータスバー
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

表示結果：

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. 一般的な設定シナリオ

### 5.1 新規プロジェクトの素早い開始

::: code-group

```bash [1. プロジェクトレベルテンプレートのコピー]
# プロジェクトレベル CLAUDE.md を作成
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. プロジェクト情報のカスタマイズ]
# 重要情報を編集
vim your-project/CLAUDE.md

# 修正：
# - Project Overview（プロジェクト説明）
# - Tech Stack（技術スタック）
# - File Structure（ファイル構造）
# - Key Patterns（よく使用されるパターン）
```

```bash [3. ユーザーレベル設定の設定]
# ユーザーレベルテンプレートをコピー
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# 個人設定をカスタマイズ
vim ~/.claude/CLAUDE.md
```

```bash [4. ステータスバーの設定]
# ステータスバー設定を追加
# ~/.claude/settings.json を編集
# statusLine 設定を追加
```

:::

### 5.2 複数プロジェクトでの設定の共有

複数のプロジェクトで Everything Claude Code を使用する場合、以下の設定戦略を推奨します：

#### 方案 1：ユーザーレベル基本ルール + プロジェクトレベル固有ルール

```bash
~/.claude/CLAUDE.md           # 汎用ルール（コーディングスタイル、テスト）
~/.claude/rules/security.md    # セキュリティルール（すべてのプロジェクト）
~/.claude/rules/testing.md    # テストルール（すべてのプロジェクト）

project-a/CLAUDE.md          # プロジェクト A 固有の設定
project-b/CLAUDE.md          # プロジェクト B 固有の設定
```

#### 方案 2：シンボリックリンクによるルールの共有

```bash
# 共有ルールディレクトリを作成
mkdir -p ~/claude-configs/rules

# 各プロジェクトでシンボリックリンク
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 チーム設定

#### プロジェクト設定の共有

プロジェクトの `CLAUDE.md` を Git にコミットし、チームメンバーで共有します：

```bash
# 1. プロジェクト設定を作成
vim CLAUDE.md

# 2. Git にコミット
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### チームコーディング規範

プロジェクト `CLAUDE.md` でチーム規範を定義します：

```markdown
## Team Coding Standards

### Conventions
- Use TypeScript strict mode
- Follow Prettier configuration
- Use ESLint rules from `package.json`
- No PRs without test coverage

### File Naming
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase with `I` prefix (`IUser.ts`)

### Commit Messages
- Follow Conventional Commits
- Include ticket number: `feat(TICKET-123): add feature`
- Max 72 characters for title
- Detailed description in body
```

---

## 6. 設定の検証

### 6.1 設定が有効になっているか確認

```bash
# 1. Claude Code を開く
claude

# 2. プロジェクト設定を確認
# Claude Code はプロジェクトルートディレクトリの CLAUDE.md を読み込むはず

# 3. ユーザーレベル設定を確認
# Claude Code は ~/.claude/CLAUDE.md を統合するはず
```

### 6.2 ルール実行の検証

Claude Code に単純なタスクを実行させ、ルールが有効になっているか確認します：

```
ユーザー：
ユーザー設定ファイルコンポーネントを作成してください

Claude Code は以下を行うはず：
1. 不変パターンを使用（オブジェクトを変更する際に新しいオブジェクトを作成）
2. console.log を使用しない
3. ファイルサイズ制限に従う（<800 行）
4. 適切な型定義を追加
```

### 6.3 ステータスバーの検証

ステータスバーが正しく表示されているか確認します：

```
期待される表示：
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

確認項目：
✓ ユーザー名が表示されている
✓ 現在のディレクトリが表示されている（~ で省略）
✓ Git ブランチが表示されている（変更がある場合は * 付き）
✓ コンテキスト割合が表示されている
✓ モデル名が表示されている
✓ 時刻が表示されている
✓ Todo 数が表示されている（ある場合）
```

---

## 7. トラブルシューティング

### 7.1 設定が有効にならない

**問題**：`CLAUDE.md` を設定したが、Claude Code がルールを適用しない

**トラブルシューティング手順**：

```bash
# 1. ファイル位置を確認
ls -la CLAUDE.md                          # プロジェクトルートディレクトリにあるはず
ls -la ~/.claude/CLAUDE.md                # ユーザーレベル設定

# 2. ファイル形式を確認
file CLAUDE.md                            # ASCII text であるはず
head -20 CLAUDE.md                        # Markdown 形式であるはず

# 3. ファイル権限を確認
chmod 644 CLAUDE.md                       # 読み取り可能であることを確認

# 4. Claude Code を再起動
# 設定の変更は再起動後に有効になります
```

### 7.2 ステータスバーが表示されない

**問題**：`statusLine` を設定したが、ステータスバーが表示されない

**トラブルシューティング手順**：

```bash
# 1. settings.json 形式を確認
cat ~/.claude/settings.json | jq '.'

# 2. JSON 構文を検証
jq '.' ~/.claude/settings.json
# エラーがある場合は parse error が表示されます

# 3. コマンドをテスト
# statusLine コマンドを手動で実行
input=$(cat ...)  # 完全なコマンドをコピー
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 プロジェクトレベルとユーザーレベル設定の競合

**問題**：プロジェクトレベルとユーザーレベル設定に競合があり、どちらが有効かわからない

**解決方法**：

- **ルールの統合**：両方のルールが有効になります
- **競合の処理**：プロジェクトレベルの設定がユーザーレベルの設定より優先されます
- **推奨される方法**：
  - ユーザーレベル設定：汎用ルール（コーディングスタイル、テスト）
  - プロジェクトレベル設定：プロジェクト固有ルール（アーキテクチャ、API 設計）

---

## 8. ベストプラクティス

### 8.1 設定ファイルの保守

#### 簡潔に保つ

```markdown
❌ 悪い方法：
CLAUDE.md にすべての詳細、例、チュートリアルリンクを含める

✅ 良い方法：
CLAUDE.md には重要なルールとパターンのみを含める
詳細は他のファイルに配置し、参照リンクを追加
```

#### バージョン管理

```bash
# プロジェクトレベル設定：Git にコミット
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# ユーザーレベル設定：Git にコミットしない
echo ".claude/" >> .gitignore  # ユーザーレベル設定がコミットされないようにする
```

#### 定期的なレビュー

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 チーム連携

#### 設定変更の文書化

Pull Request で設定変更の理由を説明します：

```markdown
## Changes

Update CLAUDE.md with new testing guidelines

## Reason

- Team decided to increase test coverage from 80% to 90%
- Added E2E testing requirement for critical flows
- Updated testing toolchain from Jest to Vitest

## Impact

- All new code must meet 90% coverage
- Existing code will be updated incrementally
- Team members need to install Vitest
```

#### 設定レビュー

チーム設定の変更にはコードレビューが必要です：

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## 本レッスンのまとめ

このレッスンでは、Everything Claude Code の 3 つのコア設定について学びました：

1. **プロジェクトレベル設定**：`CLAUDE.md` - プロジェクトクト固有のルールとパターン
2. **ユーザーレベル設定**：`~/.claude/CLAUDE.md` - 個人コーディング設定と汎用ルール
3. **カスタムステータスバー**：`settings.json` - 重要情報のリアルタイム表示

**重要なポイント**：

- 設定ファイルは Markdown 形式で、編集と保守が容易
- プロジェクトレベル設定がユーザーレベル設定より優先
- ステータスバーは ANSI カラーコードを使用し、完全にカスタマイズ可能
- チームプロジェクトでは `CLAUDE.md` を Git にコミットすべき

**次のステップ**：

- プロジェクトタイプに応じて `CLAUDE.md` をカスタマイズ
- ユーザーレベル設定と個人設定を設定
- 必要な情報を表示するようにステータスバーをカスタマイズ
- 設定をバージョン管理にコミット（プロジェクトレベル設定）

---

## 次のレッスンの予告

> 次のレッスンでは **[更新ログ：バージョン履歴と変更点](../release-notes/)** を学びます。
>
> 学習内容：
> - Everything Claude Code のバージョン履歴の確認方法
> - 重要な変更点と新機能の理解
> - バージョンアップグレードと移行の方法
