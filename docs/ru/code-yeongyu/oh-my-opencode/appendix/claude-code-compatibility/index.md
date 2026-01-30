---
title: "Совместимость: Интеграция Claude Code | oh-my-opencode"
sidebarTitle: "Повторное использование конфигурации Claude Code"
subtitle: "Совместимость с Claude Code: Полная поддержка Commands, Skills, Agents, MCPs и Hooks"
description: "Изучите уровень совместимости oh-my-opencode с Claude Code. Освойте загрузку конфигурации, правила приоритетов и переключатели отключения для плавной миграции на OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Совместимость с Claude Code: Полная поддержка Commands, Skills, Agents, MCPs и Hooks

## Чему вы научитесь

- Использовать существующие конфигурации и плагины Claude Code в OpenCode
- Понимать правила приоритетов различных источников конфигурации
- Управлять загрузкой функций совместимости с Claude Code через переключатели конфигурации
- Плавно мигрировать с Claude Code на OpenCode

## Ваша текущая проблема

Если вы пользователь, мигрирующий с Claude Code на OpenCode, возможно, вы уже настроили множество пользовательских Commands, Skills и MCP-серверов в каталоге `~/.claude/`. Повторная настройка всего этого утомительна, и вы хотите иметь возможность напрямую повторно использовать эти конфигурации в OpenCode.

Oh My OpenCode предоставляет полный уровень совместимости с Claude Code, позволяя использовать существующие конфигурации и плагины Claude Code без каких-либо изменений.

## Основные концепции

Oh My OpenCode обеспечивает совместимость с форматом конфигурации Claude Code через **механизм автоматической загрузки**. Система автоматически сканирует стандартные каталоги конфигурации Claude Code при запуске, преобразует эти ресурсы в формат, распознаваемый OpenCode, и регистрирует их в системе.

Совместимость охватывает следующие функции:

| Функция | Статус совместимости | Описание |
| --- | --- | --- |
| **Commands** | ✅ Полная поддержка | Загрузка слэш-команд из `~/.claude/commands/` и `.claude/commands/` |
| **Skills** | ✅ Полная поддержка | Загрузка профессиональных навыков из `~/.claude/skills/` и `.claude/skills/` |
| **Agents** | ⚠️ Зарезервировано | Зарезервированный интерфейс, в настоящее время поддерживаются только встроенные Agents |
| **MCPs** | ✅ Полная поддержка | Загрузка конфигурации MCP-серверов из `.mcp.json` и `~/.claude/.mcp.json` |
| **Hooks** | ✅ Полная поддержка | Загрузка пользовательских хуков жизненного цикла из `settings.json` |
| **Plugins** | ✅ Полная поддержка | Загрузка плагинов Marketplace из `installed_plugins.json` |

---

## Приоритет загрузки конфигурации

Oh My OpenCode поддерживает загрузку конфигурации из нескольких мест, объединяя их в фиксированном порядке приоритетов. **Конфигурация с более высоким приоритетом переопределяет конфигурацию с более низким приоритетом**.

### Приоритет загрузки Commands

Commands загружаются в следующем порядке (от высокого к низкому):

1. `.opencode/command/` (уровень проекта, наивысший приоритет)
2. `~/.config/opencode/command/` (уровень пользователя)
3. `.claude/commands/` (уровень проекта, совместимость с Claude Code)
4. `~/.claude/commands/` (уровень пользователя, совместимость с Claude Code)

**Расположение в исходном коде**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Загрузка Commands из 4 каталогов, объединение по приоритету
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Пример**: Если команда с одинаковым именем существует как в `.opencode/command/refactor.md`, так и в `~/.claude/commands/refactor.md`, будет использоваться команда из `.opencode/`.

### Приоритет загрузки Skills

Skills загружаются в следующем порядке (от высокого к низкому):

1. `.opencode/skills/*/SKILL.md` (уровень проекта, наивысший приоритет)
2. `~/.config/opencode/skills/*/SKILL.md` (уровень пользователя)
3. `.claude/skills/*/SKILL.md` (уровень проекта, совместимость с Claude Code)
4. `~/.claude/skills/*/SKILL.md` (уровень пользователя, совместимость с Claude Code)

**Расположение в исходном коде**: `src/features/opencode-skill-loader/loader.ts:206-215`

**Пример**: Skills уровня проекта переопределяют Skills уровня пользователя, обеспечивая приоритет специфических требований каждого проекта.

### Приоритет загрузки MCPs

Конфигурация MCP загружается в следующем порядке (от высокого к низкому):

1. `.claude/.mcp.json` (уровень проекта, наивысший приоритет)
2. `.mcp.json` (уровень проекта)
3. `~/.claude/.mcp.json` (уровень пользователя)

**Расположение в исходном коде**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Особенность**: Конфигурация MCP поддерживает расширение переменных окружения (например, `${OPENAI_API_KEY}`), автоматически разрешаемых через `env-expander.ts`.

**Расположение в исходном коде**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Приоритет загрузки Hooks

Hooks загружаются из поля `hooks` в `settings.json`, поддерживая следующие пути (по приоритету):

1. `.claude/settings.local.json` (локальная конфигурация, наивысший приоритет)
2. `.claude/settings.json` (уровень проекта)
3. `~/.claude/settings.json` (уровень пользователя)

**Расположение в исходном коде**: `src/hooks/claude-code-hooks/config.ts:46-59`

**Особенность**: Hooks из нескольких файлов конфигурации автоматически объединяются, а не переопределяют друг друга.

---

## Переключатели отключения конфигурации

Если вы не хотите загружать определенные конфигурации Claude Code, вы можете осуществлять детальный контроль через поле `claude_code` в `oh-my-opencode.json`.

### Полное отключение совместимости

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Частичное отключение

Вы также можете отключить только определенные функции:

```jsonc
{
  "claude_code": {
    "mcp": false,         // Отключить файл .mcp.json (но сохранить встроенные MCPs)
    "commands": false,     // Отключить ~/.claude/commands/ и .claude/commands/
    "skills": false,       // Отключить ~/.claude/skills/ и .claude/skills/
    "agents": false,       // Отключить ~/.claude/agents/ (сохранить встроенные Agents)
    "hooks": false,        // Отключить hooks из settings.json
    "plugins": false       // Отключить плагины Claude Code Marketplace
  }
}
```

**Описание переключателей**:

| Переключатель | Что отключается | Что сохраняется |
| --- | --- | --- |
| `mcp` | Файл `.mcp.json` | Встроенные MCPs (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | Нативные Commands OpenCode |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | Нативные Skills OpenCode |
| `agents` | `~/.claude/agents/` | Встроенные Agents (Sisyphus, Oracle, Librarian и др.) |
| `hooks` | Hooks из `settings.json` | Встроенные Hooks Oh My OpenCode |
| `plugins` | Плагины Claude Code Marketplace | Встроенная функциональность плагинов |

### Отключение конкретных плагинов

Используйте `plugins_override` для отключения конкретных плагинов Claude Code Marketplace:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Отключить плагин claude-mem
    }
  }
}
```

**Расположение в исходном коде**: `src/config/schema.ts:143`

---

## Совместимость хранения данных

Oh My OpenCode совместим с форматом хранения данных Claude Code, обеспечивая сохранение и миграцию данных сессий и задач.

### Хранение Todos

- **Расположение**: `~/.claude/todos/`
- **Формат**: JSON-формат, совместимый с Claude Code
- **Назначение**: Хранение списков задач и элементов TODO

**Расположение в исходном коде**: `src/features/claude-code-session-state/index.ts`

### Хранение Transcripts

- **Расположение**: `~/.claude/transcripts/`
- **Формат**: JSONL (один JSON-объект на строку)
- **Назначение**: Хранение истории сессий и записей сообщений

**Расположение в исходном коде**: `src/features/claude-code-session-state/index.ts`

**Преимущество**: Совместное использование одного каталога данных с Claude Code позволяет напрямую мигрировать историю сессий.

---

## Интеграция Claude Code Hooks

Поле `hooks` в `settings.json` Claude Code определяет пользовательские скрипты, выполняемые в определенных точках событий. Oh My OpenCode полностью поддерживает эти Hooks.

### Типы событий Hook

| Событие | Момент срабатывания | Возможные операции |
| --- | --- | --- |
| **PreToolUse** | Перед выполнением инструмента | Блокировка вызова инструмента, изменение входных параметров, внедрение контекста |
| **PostToolUse** | После выполнения инструмента | Добавление предупреждений, изменение вывода, внедрение сообщений |
| **UserPromptSubmit** | При отправке пользовательского промпта | Блокировка промпта, внедрение сообщений, преобразование промпта |
| **Stop** | При переходе сессии в режим ожидания | Внедрение последующих промптов, выполнение автоматизированных задач |

**Расположение в исходном коде**: `src/hooks/claude-code-hooks/index.ts`

### Пример конфигурации Hook

Ниже приведена типичная конфигурация Claude Code Hooks:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Описание полей**:

- **matcher**: Шаблон соответствия имени инструмента (поддерживает подстановочный знак `*`)
- **type**: Тип Hook (`command`, `inject` и др.)
- **command**: Команда shell для выполнения (поддерживает переменные, такие как `$FILE`)
- **content**: Содержимое сообщения для внедрения

### Механизм выполнения Hook

Oh My OpenCode автоматически выполняет эти пользовательские Hooks через Hook `claude-code-hooks`. Этот Hook проверяет и загружает конфигурацию Claude Code во всех точках событий.

**Расположение в исходном коде**: `src/hooks/claude-code-hooks/index.ts:36-401`

**Процесс выполнения**:

1. Загрузка `settings.json` Claude Code
2. Разбор поля `hooks` и сопоставление с текущим событием
3. Последовательное выполнение соответствующих Hooks
4. Изменение поведения агента на основе возвращаемого результата (блокировка, внедрение, предупреждение и т.д.)

**Пример**: Если PreToolUse Hook возвращает `deny`, вызов инструмента будет заблокирован, и агент получит сообщение об ошибке.

---

## Распространенные сценарии использования

### Сценарий 1: Миграция конфигурации Claude Code

Если вы уже настроили Commands и Skills в Claude Code, вы можете использовать их напрямую в OpenCode:

**Шаги**:

1. Убедитесь, что каталог `~/.claude/` существует и содержит вашу конфигурацию
2. Запустите OpenCode, Oh My OpenCode автоматически загрузит эти конфигурации
3. Введите `/` в чате, чтобы увидеть загруженные Commands
4. Используйте Commands или вызывайте Skills

**Проверка**: Проверьте количество загруженных конфигураций в журналах запуска Oh My OpenCode.

### Сценарий 2: Переопределение конфигурации на уровне проекта

Вы хотите использовать разные Skills для конкретного проекта, не влияя на другие проекты:

**Шаги**:

1. Создайте каталог `.claude/skills/` в корне проекта
2. Добавьте специфичный для проекта Skill (например, `./.claude/skills/my-skill/SKILL.md`)
3. Перезапустите OpenCode
4. Skill уровня проекта автоматически переопределит Skill уровня пользователя

**Преимущество**: Каждый проект может иметь независимую конфигурацию без взаимного влияния.

### Сценарий 3: Отключение совместимости с Claude Code

Вы хотите использовать только нативную конфигурацию OpenCode, не загружая старую конфигурацию Claude Code:

**Шаги**:

1. Отредактируйте `oh-my-opencode.json`
2. Добавьте следующую конфигурацию:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Перезапустите OpenCode

**Результат**: Система будет игнорировать всю конфигурацию Claude Code, используя только нативную конфигурацию OpenCode.

---

## Распространенные ошибки

### ⚠️ Конфликты конфигурации

**Проблема**: Если конфигурация с одинаковым именем существует в нескольких местах (например, одно и то же имя Command появляется в `.opencode/command/` и `~/.claude/commands/`), это может привести к неопределенному поведению.

**Решение**: Понимайте приоритет загрузки, размещайте конфигурацию с наивысшим приоритетом в каталоге с наивысшим приоритетом.

### ⚠️ Различия в формате конфигурации MCP

**Проблема**: Формат конфигурации MCP в Claude Code немного отличается от OpenCode, прямое копирование может не работать.

**Решение**: Oh My OpenCode автоматически преобразует формат, но рекомендуется обратиться к официальной документации для обеспечения правильности конфигурации.

**Расположение в исходном коде**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Влияние Hooks на производительность

**Проблема**: Слишком много Hooks или сложные скрипты Hook могут привести к снижению производительности.

**Решение**: Ограничьте количество Hooks, сохраняя только необходимые. Вы можете отключить конкретные Hooks через `disabled_hooks`.

---

## Резюме урока

Oh My OpenCode предоставляет полный уровень совместимости с Claude Code, позволяя вам беспрепятственно мигрировать и повторно использовать существующие конфигурации:

- **Приоритет загрузки конфигурации**: Конфигурация загружается в порядке: уровень проекта > уровень пользователя > совместимость с Claude Code
- **Переключатели совместимости**: Точный контроль загружаемых функций через поле `claude_code`
- **Совместимость хранения данных**: Совместное использование каталога `~/.claude/`, поддержка миграции данных сессий и задач
- **Интеграция Hooks**: Полная поддержка системы хуков жизненного цикла Claude Code

Если вы пользователь, мигрирующий с Claude Code, этот уровень совместимости позволяет начать использовать OpenCode без какой-либо конфигурации.

---

## Предпросмотр следующего урока

> В следующем уроке мы изучим **[Справочник по конфигурации](../configuration-reference/)**.
>
> Вы узнаете:
> - Полное описание полей конфигурации `oh-my-opencode.json`
> - Типы, значения по умолчанию и ограничения для каждого поля
> - Распространенные шаблоны конфигурации и лучшие практики

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы раскрыть расположения исходного кода</strong></summary>

> Обновлено: 2026-01-26

| Функция | Путь к файлу | Номера строк |
| --- | --- | --- |
| Главная точка входа Claude Code Hooks | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Загрузка конфигурации Hooks | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| Загрузчик конфигурации MCP | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Загрузчик Commands | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Загрузчик Skills | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Загрузчик Plugins | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Полный текст |
| Совместимость хранения данных | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Полный текст |
| Преобразователь конфигурации MCP | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Полный текст |
| Расширение переменных окружения | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Полный текст |

**Ключевые функции**:

- `createClaudeCodeHooksHook()`: Создает Hook интеграции Claude Code Hooks, обрабатывает все события (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Загружает конфигурацию `settings.json` Claude Code
- `loadMcpConfigs()`: Загружает конфигурацию MCP-серверов, поддерживает расширение переменных окружения
- `loadAllCommands()`: Загружает Commands из 4 каталогов, объединяет по приоритету
- `discoverSkills()`: Загружает Skills из 4 каталогов, поддерживает пути совместимости с Claude Code
- `getClaudeConfigDir()`: Получает путь к каталогу конфигурации Claude Code (зависит от платформы)

**Ключевые константы**:

- Приоритет загрузки конфигурации: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Типы событий Hook: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
