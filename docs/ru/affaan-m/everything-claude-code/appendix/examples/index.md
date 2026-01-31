---
title: "Примеры конфигурации: проектный и пользовательский уровни | Everything Claude Code"
sidebarTitle: "Быстрая настройка проекта"
subtitle: "Примеры конфигурации: проектный и пользовательский уровни"
description: "Изучите методы настройки конфигурационных файлов Everything Claude Code. Освойте настройку CLAUDE.md на уровне проекта и пользователя, иерархию конфигураций, ключевые поля и кастомизацию строки состояния для фронтенд, бэкенд и фулстек проектов."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# Примеры конфигурации: проектный и пользовательский уровни

## Чему вы научитесь

- Быстро настраивать файл CLAUDE.md для проекта
- Настраивать глобальную конфигурацию на уровне пользователя для повышения эффективности разработки
- Кастомизировать строку состояния для отображения ключевой информации
- Адаптировать шаблоны конфигурации под требования проекта

## Ваши текущие проблемы

При работе с конфигурационными файлами Everything Claude Code вы можете столкнуться с вопросами:

- **С чего начать?**: В чём разница между конфигурацией на уровне проекта и пользователя? Где их размещать?
- **Слишком длинный конфиг**: Что писать в CLAUDE.md? Что обязательно?
- **Строка состояния недостаточна**: Как настроить отображение дополнительной полезной информации?
- **Как кастомизировать?**: Как адаптировать примеры конфигурации под требования проекта?

Этот документ содержит полные примеры конфигурации для быстрого старта с Everything Claude Code.

---

## Обзор уровней конфигурации

Everything Claude Code поддерживает два уровня конфигурации:

| Тип конфигурации | Расположение | Область действия | Типичное применение |
| --- | --- | --- | --- |
| **Уровень проекта** | `CLAUDE.md` в корне проекта | Только текущий проект | Правила проекта, технологический стек, структура файлов |
| **Уровень пользователя** | `~/.claude/CLAUDE.md` | Все проекты | Личные предпочтения кодирования, общие правила, настройки редактора |

::: tip Приоритет конфигурации

При наличии обоих уровней конфигурации:
- **Правила суммируются**: Оба набора правил применяются
- **Разрешение конфликтов**: Конфигурация проекта имеет приоритет над пользовательской
- **Рекомендуемая практика**: Общие правила — в пользовательскую конфигурацию, специфичные для проекта — в проектную
:::

---

## 1. Пример конфигурации уровня проекта

### 1.1 Расположение файла конфигурации

Сохраните следующее содержимое в файл `CLAUDE.md` в корне проекта:

```markdown
# Название проекта CLAUDE.md

## Project Overview

[Краткое описание проекта: назначение, используемый технологический стек]

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

### 1.2 Описание ключевых полей

#### Project Overview

Краткое описание проекта, помогающее Claude Code понять контекст:

```markdown
## Project Overview

 Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

Это самая важная часть, определяющая обязательные правила проекта:

| Категория правил | Описание | Обязательно |
| --- | --- | --- |
| Code Organization | Принципы организации файлов | Да |
| Code Style | Стиль кодирования | Да |
| Testing | Требования к тестированию | Да |
| Security | Стандарты безопасности | Да |

#### Key Patterns

Определение часто используемых паттернов проекта, которые Claude Code будет автоматически применять:

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

[Пример кода]
```

---

## 2. Пример конфигурации уровня пользователя

### 2.1 Расположение файла конфигурации

Сохраните следующее содержимое в `~/.claude/CLAUDE.md`:

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

### 2.2 Основные модули конфигурации

#### Core Philosophy

Определение философии вашего взаимодействия с Claude Code:

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

Ссылки на модульные файлы правил для поддержания компактности конфигурации:

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
| performance.md | Model selection, context management |
```

#### Editor Integration

Информирование Claude Code о вашем редакторе и горячих клавишах:

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. Настройка пользовательской строки состояния

### 3.1 Расположение файла конфигурации

Добавьте следующее содержимое в `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 Содержимое строки состояния

После настройки строка состояния будет отображать:

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| Компонент | Значение | Пример |
| --- | --- | --- |
| `user` | Текущее имя пользователя | `affoon` |
| `path` | Текущий каталог (с сокращением ~) | `~/projects/myapp` |
| `branch*` | Git-ветка (* означает незакоммиченные изменения) | `main*` |
| `ctx:%` | Оставшийся процент контекстного окна | `ctx:73%` |
| `model` | Текущая используемая модель | `sonnet-4.5` |
| `time` | Текущее время | `14:30` |
| `todos:N` | Количество задач | `todos:3` |

### 3.3 Настройка цветов

Строка состояния использует ANSI-коды цветов, которые можно настроить:

| Код цвета | Переменная | Назначение | RGB |
| --- | --- | --- | --- |
| Синий | `B` | Путь к каталогу | 30,102,245 |
| Зелёный | `G` | Git-ветка | 64,160,43 |
| Жёлтый | `Y` | Статус изменений, время | 223,142,29 |
| Пурпурный | `M` | Остаток контекста | 136,57,239 |
| Бирюзовый | `C` | Имя пользователя, задачи | 23,146,153 |
| Серый | `T` | Название модели | 76,79,105 |

**Как изменить цвета**:

```bash
# Найдите определение переменной цвета
B='\\033[38;2;30;102;245m'  # Синий в формате RGB
#                    ↓  ↓   ↓
#                   R  G   B

# Измените на предпочитаемый цвет
B='\\033[38;2;255;100;100m'  # Красный
```

### 3.4 Упрощённая строка состояния

Если строка состояния кажется слишком длинной, её можно упростить:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

Упрощённая строка состояния:

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. Руководство по кастомизации конфигурации

### 4.1 Кастомизация конфигурации уровня проекта

Адаптируйте `CLAUDE.md` в зависимости от типа проекта:

#### Фронтенд-проект

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

#### Бэкенд-проект

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

#### Фулстек-проект

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

### 4.2 Кастомизация конфигурации уровня пользователя

Адаптируйте `~/.claude/CLAUDE.md` под личные предпочтения:

#### Изменение требований к покрытию тестами

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # Изменено на 90%
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### Добавление личных предпочтений стиля кода

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

#### Настройка правил Git-коммитов

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

### 4.3 Кастомизация строки состояния

#### Добавление дополнительной информации

```bash
# Добавить версию Node.js
node_version=$(node --version 2>/dev/null || echo '')

# Добавить текущую дату
date=$(date +%Y-%m-%d)

# Отобразить в строке состояния
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

Результат отображения:

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### Отображение только ключевой информации

```bash
# Минималистичная строка состояния
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

Результат отображения:

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. Типичные сценарии конфигурации

### 5.1 Быстрый старт нового проекта

::: code-group

```bash [1. Копирование шаблона проекта]
# Создание CLAUDE.md уровня проекта
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. Настройка информации о проекте]
# Редактирование ключевой информации
vim your-project/CLAUDE.md

# Измените:
# - Project Overview (описание проекта)
# - Tech Stack (технологический стек)
# - File Structure (структура файлов)
# - Key Patterns (ключевые паттерны)
```

```bash [3. Настройка пользовательского уровня]
# Копирование пользовательского шаблона
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# Настройка личных предпочтений
vim ~/.claude/CLAUDE.md
```

```bash [4. Настройка строки состояния]
# Добавление конфигурации строки состояния
# Редактируйте ~/.claude/settings.json
# Добавьте конфигурацию statusLine
```

:::

### 5.2 Общая конфигурация для нескольких проектов

Если вы используете Everything Claude Code в нескольких проектах, рекомендуется следующая стратегия:

#### Вариант 1: Базовые правила на уровне пользователя + специфичные правила проекта

```bash
~/.claude/CLAUDE.md           # Общие правила (стиль кода, тестирование)
~/.claude/rules/security.md    # Правила безопасности (все проекты)
~/.claude/rules/testing.md    # Правила тестирования (все проекты)

project-a/CLAUDE.md          # Специфичная конфигурация проекта A
project-b/CLAUDE.md          # Специфичная конфигурация проекта B
```

#### Вариант 2: Символические ссылки для общих правил

```bash
# Создание каталога общих правил
mkdir -p ~/claude-configs/rules

# Символические ссылки в каждом проекте
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 Командная конфигурация

#### Общая конфигурация проекта

Закоммитьте `CLAUDE.md` проекта в Git для совместного использования командой:

```bash
# 1. Создание конфигурации проекта
vim CLAUDE.md

# 2. Коммит в Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### Командные стандарты кодирования

Определите командные стандарты в `CLAUDE.md` проекта:

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

## 6. Проверка конфигурации

### 6.1 Проверка применения конфигурации

```bash
# 1. Открыть Claude Code
claude

# 2. Проверить конфигурацию проекта
# Claude Code должен прочитать CLAUDE.md из корня проекта

# 3. Проверить пользовательскую конфигурацию
# Claude Code должен объединить ~/.claude/CLAUDE.md
```

### 6.2 Проверка выполнения правил

Попросите Claude Code выполнить простую задачу для проверки применения правил:

```
Пользователь:
Создайте компонент профиля пользователя

Claude Code должен:
1. Использовать иммутабельные паттерны (создавать новые объекты при изменении)
2. Не использовать console.log
3. Соблюдать ограничение размера файла (<800 строк)
4. Добавить соответствующие определения типов
```

### 6.3 Проверка строки состояния

Проверьте корректность отображения строки состояния:

```
Ожидаемый результат:
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

Контрольный список:
✓ Отображается имя пользователя
✓ Отображается текущий каталог (с сокращением ~)
✓ Отображается Git-ветка (с * при наличии изменений)
✓ Отображается процент контекста
✓ Отображается название модели
✓ Отображается время
✓ Отображается количество задач (если есть)
```

---

## 7. Устранение неполадок

### 7.1 Конфигурация не применяется

**Проблема**: Настроен `CLAUDE.md`, но Claude Code не применяет правила

**Шаги диагностики**:

```bash
# 1. Проверить расположение файла
ls -la CLAUDE.md                          # Должен быть в корне проекта
ls -la ~/.claude/CLAUDE.md                # Пользовательская конфигурация

# 2. Проверить формат файла
file CLAUDE.md                            # Должен быть ASCII text
head -20 CLAUDE.md                        # Должен быть в формате Markdown

# 3. Проверить права доступа
chmod 644 CLAUDE.md                       # Убедиться в читаемости

# 4. Перезапустить Claude Code
# Изменения конфигурации требуют перезапуска
```

### 7.2 Строка состояния не отображается

**Проблема**: Настроен `statusLine`, но строка состояния не отображается

**Шаги диагностики**:

```bash
# 1. Проверить формат settings.json
cat ~/.claude/settings.json | jq '.'

# 2. Проверить синтаксис JSON
jq '.' ~/.claude/settings.json
# При ошибке отобразится parse error

# 3. Протестировать команду
# Вручную выполнить команду statusLine
input=$(cat ...)  # Скопировать полную команду
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 Конфликт конфигураций проекта и пользователя

**Проблема**: Конфликт между конфигурациями проекта и пользователя, неясно какая применяется

**Решение**:

- **Правила суммируются**: Оба набора правил применяются
- **Разрешение конфликтов**: Конфигурация проекта имеет приоритет над пользовательской
- **Рекомендуемая практика**:
  - Пользовательская конфигурация: общие правила (стиль кода, тестирование)
  - Конфигурация проекта: специфичные правила (архитектура, дизайн API)

---

## 8. Лучшие практики

### 8.1 Поддержка конфигурационных файлов

#### Сохраняйте простоту

```markdown
❌ Плохая практика:
CLAUDE.md содержит все детали, примеры, ссылки на туториалы

✅ Хорошая практика:
CLAUDE.md содержит только ключевые правила и паттерны
Детальная информация в отдельных файлах со ссылками
```

#### Контроль версий

```bash
# Конфигурация проекта: коммитить в Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# Пользовательская конфигурация: не коммитить в Git
echo ".claude/" >> .gitignore  # Предотвратить коммит пользовательской конфигурации
```

#### Регулярный аудит

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 Командная работа

#### Документирование изменений конфигурации

Объясняйте причины изменений конфигурации в Pull Request:

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

#### Ревью конфигурации

Изменения командной конфигурации требуют код-ревью:

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## Итоги урока

В этом уроке рассмотрены три основных типа конфигурации Everything Claude Code:

1. **Конфигурация уровня проекта**: `CLAUDE.md` — специфичные правила и паттерны проекта
2. **Конфигурация уровня пользователя**: `~/.claude/CLAUDE.md` — личные предпочтения кодирования и общие правила
3. **Пользовательская строка состояния**: `settings.json` — отображение ключевой информации в реальном времени

**Ключевые моменты**:

- Конфигурационные файлы в формате Markdown, легко редактировать и поддерживать
- Конфигурация проекта имеет приоритет над пользовательской
- Строка состояния использует ANSI-коды цветов, полностью настраиваема
- Командные проекты должны коммитить `CLAUDE.md` в Git

**Следующие шаги**:

- Настройте `CLAUDE.md` под тип вашего проекта
- Настройте пользовательские параметры и личные предпочтения
- Настройте строку состояния для отображения нужной информации
- Закоммитьте конфигурацию в систему контроля версий (конфигурация проекта)

---

## Анонс следующего урока

> В следующем уроке мы изучим **[Журнал изменений: история версий и изменения](../release-notes/)**.
>
> Вы узнаете:
> - Как просматривать историю версий Everything Claude Code
> - О важных изменениях и новых функциях
> - Как выполнять обновление и миграцию версий
