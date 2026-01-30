---
title: "Пользовательские Rules: Создание стандартов проекта | Everything Claude Code"
subtitle: "Пользовательские Rules: Создание стандартов проекта"
sidebarTitle: "Научите Claude следовать вашим правилам"
description: "Изучите создание пользовательских файлов Rules. Освойте формат правил, написание чек-листов, настройку правил безопасности и интеграцию с Git-воркфлоу, чтобы Claude автоматически соблюдал стандарты команды."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# Пользовательские Rules: Создание стандартов для вашего проекта

## Чему вы научитесь

- Создавать пользовательские файлы Rules для определения стандартов кодирования проекта
- Использовать чек-листы для обеспечения единообразного качества кода
- Интегрировать командные стандарты в рабочий процесс Claude Code
- Настраивать различные типы правил в соответствии с требованиями проекта

## С какими проблемами вы сталкиваетесь

Знакомы ли вам эти ситуации?

- Стиль кода в команде неоднороден, на code review постоянно указывают на одни и те же проблемы
- У проекта есть особые требования безопасности, о которых Claude не знает
- Каждый раз при написании кода приходится вручную проверять соответствие командным стандартам
- Хотелось бы, чтобы Claude автоматически напоминал о лучших практиках, специфичных для проекта

## Когда применять этот подход

- **При инициализации нового проекта** — определение стандартов кодирования и безопасности
- **При командной работе** — унификация стиля кода и стандартов качества
- **После частых замечаний на code review** — закрепление типичных проблем в виде правил
- **При особых требованиях проекта** — интеграция отраслевых стандартов или правил для конкретного технологического стека

## Основная идея

Rules — это уровень принудительного применения стандартов проекта, заставляющий Claude автоматически соблюдать определённые вами требования.

### Механизм работы Rules

Файлы Rules находятся в директории `rules/`. Claude Code автоматически загружает все правила в начале сессии. При каждой генерации кода или проверке Claude выполняет проверку на соответствие этим правилам.

::: info Различие между Rules и Skills

- **Rules**: обязательные чек-листы, применяемые ко всем операциям (проверки безопасности, стиль кода)
- **Skills**: определения рабочих процессов и предметные знания для конкретных задач (TDD-процесс, проектирование архитектуры)

Rules — это ограничения «обязательно соблюдать», Skills — руководства «как делать».
:::

### Структура файлов Rules

Каждый файл Rule следует стандартному формату:

```markdown
# Название правила

## Категория правила
Описание правила...

### Чек-лист
- [ ] Пункт проверки 1
- [ ] Пункт проверки 2

### Примеры кода
Сравнение правильного/неправильного кода...
```

## Пошаговое руководство

### Шаг 1: Изучите встроенные типы правил

Everything Claude Code предоставляет 8 наборов встроенных правил. Сначала ознакомьтесь с их функциями.

**Зачем**

Понимание встроенных правил поможет определить, что нужно настроить, и избежать изобретения велосипеда.

**Просмотр встроенных правил**

Посмотрите содержимое директории `rules/` в исходном коде:

```bash
ls rules/
```

Вы увидите следующие 8 файлов правил:

| Файл правил | Назначение | Сценарии применения |
| --- | --- | --- |
| `security.md` | Проверки безопасности | API-ключи, пользовательский ввод, операции с БД |
| `coding-style.md` | Стиль кода | Размер функций, организация файлов, иммутабельность |
| `testing.md` | Требования к тестированию | Покрытие тестами, TDD-процесс, типы тестов |
| `performance.md` | Оптимизация производительности | Выбор модели, управление контекстом, стратегии сжатия |
| `agents.md` | Использование Agent | Когда какой agent использовать, параллельное выполнение |
| `git-workflow.md` | Git-воркфлоу | Формат коммитов, процесс PR, управление ветками |
| `patterns.md` | Паттерны проектирования | Repository-паттерн, формат API-ответов, скелетные проекты |
| `hooks.md` | Система Hooks | Типы хуков, автоматическое подтверждение, TodoWrite |

**Что вы должны увидеть**:
- Каждый файл правил имеет чёткий заголовок и категоризацию
- Правила содержат чек-листы и примеры кода
- Правила применимы к конкретным сценариям и техническим требованиям

### Шаг 2: Создайте пользовательский файл правил

Создайте новый файл правил в директории `rules/` вашего проекта.

**Зачем**

Пользовательские правила решают специфические проблемы проекта и заставляют Claude соблюдать командные стандарты.

**Создание файла правил**

Допустим, ваш проект использует Next.js и Tailwind CSS, и нужно определить стандарты для фронтенд-компонентов:

```bash
# Создание файла правил
touch rules/frontend-conventions.md
```

**Редактирование файла правил**

Откройте `rules/frontend-conventions.md` и добавьте следующее содержимое:

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

**Что вы должны увидеть**:
- Файл правил использует стандартный формат Markdown
- Чёткие заголовки и категории (##)
- Сравнение примеров кода (CORRECT vs WRONG)
- Чек-лист (checkbox)
- Краткое и понятное описание правил

### Шаг 3: Определите пользовательские правила безопасности

Если у вашего проекта есть особые требования безопасности, создайте специальные правила безопасности.

**Зачем**

Встроенный `security.md` содержит общие проверки безопасности, но у проекта могут быть специфические требования.

**Создание правил безопасности проекта**

Создайте `rules/project-security.md`:

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

**Что вы должны увидеть**:
- Правила ориентированы на конкретный технологический стек проекта (JWT, Zod)
- Примеры кода демонстрируют правильную и неправильную реализацию
- Чек-лист охватывает все пункты проверки безопасности

### Шаг 4: Определите правила Git-воркфлоу для проекта

Если у команды есть особые требования к Git-коммитам, можно расширить `git-workflow.md` или создать пользовательские правила.

**Зачем**

Встроенный `git-workflow.md` содержит базовый формат коммитов, но у команды могут быть дополнительные требования.

**Создание Git-правил**

Создайте `rules/team-git-workflow.md`:

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
```

**Что вы должны увидеть**:
- Формат Git-коммитов включает пользовательский тип команды (`team`)
- Обязательное требование scope в коммитах
- Чёткие чек-листы для PR
- Правила применимы к процессу командной работы

### Шаг 5: Проверьте загрузку Rules

После создания правил проверьте, правильно ли Claude Code их загружает.

**Зачем**

Убедитесь, что формат файлов правил корректен и Claude может читать и применять правила.

**Метод проверки**

1. Запустите новую сессию Claude Code
2. Попросите Claude проверить загруженные правила:
   ```
   Какие файлы Rules загружены?
   ```

3. Проверьте, работают ли правила:
   ```
   Создай React-компонент, следуя правилам frontend-conventions
   ```

**Что вы должны увидеть**:
- Claude перечисляет все загруженные rules (включая пользовательские)
- Сгенерированный код соответствует определённым вами стандартам
- При нарушении правил Claude предлагает исправления

### Шаг 6: Интеграция в процесс Code Review

Настройте автоматическую проверку пользовательских правил при code review.

**Зачем**

Автоматическое применение правил при code review гарантирует соответствие всего кода стандартам.

**Настройка code-reviewer для использования правил**

Убедитесь, что `agents/code-reviewer.md` ссылается на соответствующие правила:

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

**Что вы должны увидеть**:
- Agent code-reviewer проверяет все соответствующие правила при ревью
- Отчёт категоризирован по степени серьёзности
- Специфичные для проекта стандарты включены в процесс ревью

## Контрольные точки ✅

- [ ] Создан хотя бы один пользовательский файл правил
- [ ] Файл правил следует стандартному формату (заголовок, категории, примеры кода, чек-лист)
- [ ] Правила содержат сравнение правильного/неправильного кода
- [ ] Файл правил находится в директории `rules/`
- [ ] Проверено, что Claude Code корректно загружает правила
- [ ] Agent code-reviewer ссылается на пользовательские правила

## Типичные ошибки

### ❌ Ошибка 1: Некорректное именование файлов правил

**Проблема**: Имя файла правил содержит пробелы или специальные символы, из-за чего Claude не может его загрузить.

**Исправление**:
- ✅ Правильно: `frontend-conventions.md`, `project-security.md`
- ❌ Неправильно: `Frontend Conventions.md`, `project-security(v2).md`

Используйте строчные буквы и дефисы, избегайте пробелов и скобок.

### ❌ Ошибка 2: Слишком общие правила

**Проблема**: Описание правил размыто, невозможно чётко определить соответствие.

**Исправление**: Предоставьте конкретный чек-лист и примеры кода:

```markdown
❌ Размытое правило: Компоненты должны быть лаконичными и читаемыми

✅ Конкретное правило:
- Компонент должен быть <300 строк
- Функция должна быть <50 строк
- Запрещена вложенность более 4 уровней
```

### ❌ Ошибка 3: Отсутствие примеров кода

**Проблема**: Только текстовое описание без демонстрации правильной и неправильной реализации.

**Исправление**: Всегда включайте сравнение примеров кода:

```markdown
CORRECT: Соответствует стандартам
function example() { ... }

WRONG: Нарушает стандарты
function example() { ... }
```

### ❌ Ошибка 4: Неполный чек-лист

**Проблема**: В чек-листе пропущены ключевые пункты проверки, что не позволяет полностью применить правила.

**Исправление**: Охватите все аспекты описания правил:

```markdown
Чек-лист:
- [ ] Пункт проверки 1
- [ ] Пункт проверки 2
- [ ] ... (охватить все ключевые моменты правил)
```

## Итоги урока

Пользовательские Rules — ключ к стандартизации проекта:

1. **Изучите встроенные правила** — 8 стандартных наборов охватывают типичные сценарии
2. **Создайте файлы правил** — используйте стандартный формат Markdown
3. **Определите стандарты проекта** — настройте под технологический стек и требования команды
4. **Проверьте загрузку** — убедитесь, что Claude корректно читает правила
5. **Интегрируйте в процесс ревью** — настройте code-reviewer для автоматической проверки правил

С помощью пользовательских Rules вы можете заставить Claude автоматически соблюдать стандарты проекта, сократить объём работы на code review и повысить единообразие качества кода.

## Анонс следующего урока

> В следующем уроке мы изучим **[Динамическое внедрение контекста: использование Contexts](../dynamic-contexts/)**.
>
> Вы узнаете:
> - Определение и назначение Contexts
> - Как создавать пользовательские Contexts
> - Переключение Contexts в разных режимах работы
> - Различия между Contexts и Rules

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть расположение исходного кода</strong></summary>

> Дата обновления: 2026-01-25

| Функциональность | Путь к файлу | Строки |
| --- | --- | --- |
| Правила безопасности | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Правила стиля кода | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Правила тестирования | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Правила оптимизации производительности | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Правила использования Agent | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Правила Git-воркфлоу | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Правила паттернов проектирования | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Правила системы Hooks | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Ключевые константы**:
- `MIN_TEST_COVERAGE = 80`: минимальное требование к покрытию тестами
- `MAX_FILE_SIZE = 800`: максимальное количество строк в файле
- `MAX_FUNCTION_SIZE = 50`: максимальное количество строк в функции
- `MAX_NESTING_LEVEL = 4`: максимальный уровень вложенности

**Ключевые правила**:
- **Immutability (CRITICAL)**: запрещено прямое изменение объектов, используйте spread-оператор
- **Secret Management**: запрещено хардкодить ключи, используйте переменные окружения
- **TDD Workflow**: требуется сначала писать тесты, затем реализацию, затем рефакторинг
- **Model Selection**: выбор Haiku/Sonnet/Opus в зависимости от сложности задачи

</details>
