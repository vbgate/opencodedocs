---
title: "範例配置：專案級與使用者級配置 | Everything Claude Code"
sidebarTitle: "快速搞定專案配置"
subtitle: "範例配置：專案級與使用者級配置"
description: "學習 Everything Claude Code 配置文件的使用方法。掌握專案級 CLAUDE.md 和使用者級配置的設置、配置層級、關鍵欄位和自定義狀態列配置，根據前端、後端、全棧專案調整配置，快速上手自定義配置。"
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: "240"
---

# 範例配置：專案級與使用者級配置

## 學完你能做什麼

- 快速為專案配置 CLAUDE.md 檔案
- 設定使用者級全域配置提升開發效率
- 自定義狀態列顯示關鍵資訊
- 根據專案需求調整配置範本

## 你現在的困境

面對 Everything Claude Code 的配置文件，你可能會：

- **不知道從哪裡開始**：專案級和使用者級配置有什麼區別？分別放在哪裡？
- **配置文件太長**：CLAUDE.md 裡要寫哪些內容？哪些是必須的？
- **狀態列不夠用**：如何自定義狀態列顯示更多有用資訊？
- **不知道怎麼定制**：範例配置如何根據專案需求調整？

這份文件提供了完整的配置範例，幫你快速上手 Everything Claude Code。

---

## 配置層級概覽

Everything Claude Code 支援兩種配置層級：

| 配置類型 | 位置 | 作用範圍 | 典型用途 |
| --- | --- | --- | --- |
| **專案級配置** | 專案根目錄 `CLAUDE.md` | 僅當前專案 | 專案特定規則、技術棧、檔案結構 |
| **使用者級配置** | `~/.claude/CLAUDE.md` | 所有專案 | 個人編碼偏好、通用規則、編輯器設定 |

::: tip 配置優先級

當專案級和使用者級配置同時存在時：
- **規則疊加**：兩套規則都會生效
- **衝突處理**：專案級配置優先於使用者級配置
- **推薦實踐**：使用者級配置放通用規則，專案級配置放專案特定規則
:::

---

## 1. 專案級配置範例

### 1.1 配置文件位置

將以下內容保存到專案根目錄的 `CLAUDE.md` 檔案：

```markdown
# 專案名稱 CLAUDE.md

## Project Overview

[簡要描述專案：做什麼、使用的技術棧]

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

### 1.2 關鍵欄位說明

#### Project Overview

簡要描述專案，幫助 Claude Code 理解專案背景：

```markdown
## Project Overview

Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

這是最重要的部分，定義專案必須遵守的規則：

| 規則類別 | 說明 | 必填 |
| --- | --- | --- |
| Code Organization | 檔案組織原則 | 是 |
| Code Style | 編碼風格 | 是 |
| Testing | 測試要求 | 是 |
| Security | 安全規範 | 是 |

#### Key Patterns

定義專案常用的模式，Claude Code 會自動應用：

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

[範例代碼]
```

---

## 2. 使用者級配置範例

### 2.1 配置文件位置

將以下內容保存到 `~/.claude/CLAUDE.md`：

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
| --- | --- |
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
| --- | --- |
| planner | Feature implementation planning |
| architect | System design and architecture |
| --- | --- |
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

### 2.2 核心配置模組

#### Core Philosophy

定義你和 Claude Code 的協作哲學：

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

連結到模組化規則檔案，保持配置簡潔：

```markdown
## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
| --- | --- |
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management
```

#### Editor Integration

告訴 Claude Code 你使用的編輯器和快捷鍵：

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. 自定義狀態列配置

### 3.1 配置文件位置

將以下內容添加到 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 狀態列顯示內容

配置後的狀態列會顯示：

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| 元件 | 含義 | 範例 |
| --- | --- | --- |
| `user` | 目前使用者名稱 | `affoon` |
| `path` | 目前目錄（~ 縮寫） | `~/projects/myapp` |
| `branch*` | Git 分支（* 表示有未提交變更） | `main*` |
| `ctx:%` | 內容視窗剩餘百分比 | `ctx:73%` |
| `model` | 目前使用的模型 | `sonnet-4.5` |
| `time` | 目前時間 | `14:30` |
| `todos:N` | 待辦事項數量 | `todos:3` |

### 3.3 自定義顏色

狀態列使用 ANSI 顏色碼，可以自定義：

| 顏色代碼 | 變數 | 用途 | RGB |
| --- | --- | --- | --- |
| 藍色 | `B` | 目錄路徑 | 30,102,245 |
| 綠色 | `G` | Git 分支 | 64,160,43 |
| 黃色 | `Y` | 髒狀態、時間 | 223,142,29 |
| 洋紅色 | `M` | 內容剩餘 | 136,57,239 |
| 青色 | `C` | 使用者名稱、代辦 | 23,146,153 |
| 灰色 | `T` | 模型名稱 | 76,79,105 |

**修改顏色的方法**：

```bash
# 找到顏色變數定義
B='\\033[38;2;30;102;245m'  # 藍色 RGB 格式
#                    ↓  ↓   ↓
#                   紅 綠 藍

# 修改為你喜歡的顏色
B='\\033[38;2;255;100;100m'  # 紅色
```

### 3.4 簡化狀態列

如果覺得狀態列太長，可以簡化：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

簡化後的狀態列：

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. 配置自定義指南

### 4.1 專案級配置自定義

根據專案類型調整 `CLAUDE.md`：

#### 前端專案

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

#### 後端專案

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

#### 全棧專案

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

### 4.2 使用者級配置自定義

根據個人偏好調整 `~/.claude/CLAUDE.md`：

#### 調整測試覆蓋率要求

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # 調整為 90%
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### 添加個人編碼風格偏好

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

#### 調整 Git 提交規範

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

### 4.3 狀態列自定義

#### 添加更多資訊

```bash
# 添加 Node.js 版本
node_version=$(node --version 2>/dev/null || echo '')

# 添加目前日期
date=$(date +%Y-%m-%d)

# 在狀態列中顯示
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

顯示效果：

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### 只顯示關鍵資訊

```bash
# 極簡狀態列
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

顯示效果：

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. 常見配置場景

### 5.1 新專案快速開始

::: code-group

```bash [1. 複製專案級範本]
# 建立專案級 CLAUDE.md
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. 自定義專案資訊]
# 編輯關鍵資訊
vim your-project/CLAUDE.md

# 修改：
# - Project Overview（專案描述）
# - Tech Stack（技術棧）
# - File Structure（檔案結構）
# - Key Patterns（常用模式）
```

```bash [3. 配置使用者級設定]
# 複製使用者級範本
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# 自定義個人偏好
vim ~/.claude/CLAUDE.md
```

```bash [4. 配置狀態列]
# 新增狀態列配置
# 編輯 ~/.claude/settings.json
# 新增 statusLine 配置
```

:::

### 5.2 多專案共享配置

如果你在多個專案中使用 Everything Claude Code，推薦以下配置策略：

#### 方案 1：使用者級基礎規則 + 專案級特定規則

```bash
~/.claude/CLAUDE.md           # 通用規則（編碼風格、測試）
~/.claude/rules/security.md    # 安全規則（所有專案）
~/.claude/rules/testing.md    # 測試規則（所有專案）

project-a/CLAUDE.md          # 專案 A 特定配置
project-b/CLAUDE.md          # 專案 B 特定配置
```

#### 方案 2：符號連結共享規則

```bash
# 建立共享規則目錄
mkdir -p ~/claude-configs/rules

# 在每個專案中符號連結
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 團隊配置

#### 共享專案配置

將專案的 `CLAUDE.md` 提交到 Git，團隊成員共享：

```bash
# 1. 建立專案配置
vim CLAUDE.md

# 2. 提交到 Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### 團隊編碼規範

在專案 `CLAUDE.md` 中定義團隊規範：

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

## 6. 配置驗證

### 6.1 檢查配置是否生效

```bash
# 1. 打開 Claude Code
claude

# 2. 查看專案配置
# Claude Code 應該讀取專案根目錄的 CLAUDE.md

# 3. 查看使用者級配置
# Claude Code 應該合併 ~/.claude/CLAUDE.md
```

### 6.2 驗證規則執行

讓 Claude Code 執行一個簡單任務，驗證規則是否生效：

```
使用者：
請建立一個使用者配置檔案元件

Claude Code 應該：
1. 使用不可變模式（修改物件時建立新物件）
2. 不使用 console.log
3. 遵循檔案大小限制（<800 行）
4. 新增適當的類型定義
```

### 6.3 驗證狀態列

檢查狀態列是否正確顯示：

```
預期：
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

檢查項：
✓ 使用者名稱顯示
✓ 目前目錄顯示（~ 縮寫）
✓ Git 分支顯示（有變更時帶 *）
✓ 內容百分比顯示
✓ 模型名稱顯示
✓ 時間顯示
✓ 待辦數量顯示（如果有）
```

---

## 7. 故障排除

### 7.1 配置不生效

**問題**：配置了 `CLAUDE.md` 但 Claude Code 沒有應用規則

**排查步驟**：

```bash
# 1. 檢查檔案位置
ls -la CLAUDE.md                          # 應該在專案根目錄
ls -la ~/.claude/CLAUDE.md                # 使用者級配置

# 2. 檢查檔案格式
file CLAUDE.md                            # 應該是 ASCII text
head -20 CLAUDE.md                        # 應該是 Markdown 格式

# 3. 檢查檔案權限
chmod 644 CLAUDE.md                       # 確保可讀

# 4. 重啟 Claude Code
# 配置更改需要重啟才能生效
```

### 7.2 狀態列不顯示

**問題**：配置了 `statusLine` 但狀態列沒有顯示

**排查步驟**：

```bash
# 1. 檢查 settings.json 格式
cat ~/.claude/settings.json | jq '.'

# 2. 驗證 JSON 語法
jq '.' ~/.claude/settings.json
# 如果有錯誤，會顯示 parse error

# 3. 測試命令
# 手動運行 statusLine 命令
input=$(cat ...)  # 複製完整命令
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 專案級和使用者級配置衝突

**問題**：專案級和使用者級配置有衝突，不知道哪個生效

**解決方法**：

- **規則疊加**：兩套規則都會生效
- **衝突處理**：專案級配置優先於使用者級配置
- **推薦實踐**：
  - 使用者級配置：通用規則（編碼風格、測試）
  - 專案級配置：專案特定規則（架構、API 設計）

---

## 8. 最佳實踐

### 8.1 配置文件維護

#### 保持簡潔

```markdown
❌ 不好的做法：
CLAUDE.md 中包含所有細節、範例、教程連結

✅ 好的做法：
CLAUDE.md 只包含關鍵規則和模式
詳細資訊放在其他檔案並透過引用連結
```

#### 版本控制

```bash
# 專案級配置：提交到 Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# 使用者級配置：不提交到 Git
echo ".claude/" >> .gitignore  # 防止使用者級配置被提交
```

#### 定期審查

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 團隊協作

#### 文件化配置變更

在 Pull Request 中說明配置變更的原因：

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

#### 配置審查

團隊配置變更需要程式碼審查：

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## 本課小結

本課介紹了 Everything Claude Code 的三種核心配置：

1. **專案級配置**：`CLAUDE.md` - 專案特定規則和模式
2. **使用者級配置**：`~/.claude/CLAUDE.md` - 個人編碼偏好和通用規則
3. **自定義狀態列**：`settings.json` - 即時顯示關鍵資訊

**關鍵要點**：

- 配置文件採用 Markdown 格式，易於編輯和維護
- 專案級配置優先於使用者級配置
- 狀態列使用 ANSI 顏色碼，可以完全自定義
- 團隊專案應該將 `CLAUDE.md` 提交到 Git

**下一步**：

- 根據你的專案類型自定義 `CLAUDE.md`
- 配置使用者級設定和個人偏好
- 自定義狀態列顯示你需要資訊
- 將配置提交到版本控制（專案級配置）

---

## 下一課預告

> 下一課我們學習 **[更新日誌：版本歷史與變更](../release-notes/)**。
>
> 你會學到：
> - 如何查看 Everything Claude Code 的版本歷史
> - 了解重要變更和新功能
> - 如何進行版本升級和遷移
