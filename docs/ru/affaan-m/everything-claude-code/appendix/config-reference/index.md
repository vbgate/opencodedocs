---
title: "Подробное руководство по конфигурации: Полный справочник settings.json | Everything Claude Code"
sidebarTitle: "Настройка всех параметров"
subtitle: "Подробное руководство по конфигурации: Полный справочник settings.json"
description: "Изучите все параметры конфигурации Everything Claude Code. Освойте автоматизацию Hooks, настройку MCP-серверов и плагинов, быстро решайте конфликты конфигурации."
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# Подробное руководство по конфигурации: Полный справочник settings.json

## Что вы сможете делать после изучения

- Полностью понимать все параметры конфигурации `~/.claude/settings.json`
- Настраивать автоматизированные рабочие процессы с помощью Hooks
- Конфигурировать и управлять MCP-серверами
- Изменять манифесты плагинов и настройки путей
- Решать конфликты и проблемы конфигурации

## Ваши текущие проблемы

Вы уже используете Everything Claude Code, но сталкиваетесь с такими вопросами:
- «Почему определённый Hook не срабатывает?»
- «MCP-сервер не подключается, что не так в конфигурации?»
- «Хочу настроить какую-то функцию, но не знаю, какой файл редактировать?»
- «Несколько конфигурационных файлов перезаписывают друг друга, какой приоритет?»

Это руководство даст вам полный справочник по конфигурации.

## Основная концепция

Система конфигурации Claude Code имеет три уровня, приоритет от высшего к низшему:

1. **Конфигурация проекта** (`.claude/settings.json`) — действует только для текущего проекта
2. **Глобальная конфигурация** (`~/.claude/settings.json`) — действует для всех проектов
3. **Встроенная конфигурация плагина** (настройки по умолчанию Everything Claude Code)

::: tip Приоритет конфигурации
Конфигурации **объединяются**, а не перезаписываются. Конфигурация проекта переопределяет одноимённые параметры глобальной конфигурации, но сохраняет остальные.
:::

Конфигурационные файлы используют формат JSON и соответствуют Claude Code Settings Schema:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

Эта схема обеспечивает автодополнение и валидацию, рекомендуется всегда её включать.

## Структура конфигурационного файла

### Полный шаблон конфигурации

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning Правила синтаксиса JSON
- Все имена ключей и строковые значения должны быть в **двойных кавычках**
- После последней пары ключ-значение **не ставьте запятую**
- Комментарии не являются стандартным синтаксисом JSON, используйте поле `"_comments"` вместо них
:::

## Подробное описание конфигурации Hooks

Hooks — это основной механизм автоматизации Everything Claude Code, определяющий скрипты, которые запускаются при определённых событиях.

### Типы Hook и моменты срабатывания

| Тип Hook | Момент срабатывания | Назначение |
| --- | --- | --- |
| `SessionStart` | При начале сессии Claude Code | Загрузка контекста, определение менеджера пакетов |
| `SessionEnd` | При завершении сессии Claude Code | Сохранение состояния сессии, извлечение паттернов |
| `PreToolUse` | Перед вызовом инструмента | Валидация команд, блокировка опасных операций |
| `PostToolUse` | После вызова инструмента | Форматирование кода, проверка типов |
| `PreCompact` | Перед сжатием контекста | Сохранение снимка состояния |
| `Stop` | После каждого ответа AI | Проверка на console.log и другие проблемы |

### Структура конфигурации Hook

Каждая запись Hook содержит следующие поля:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Описание Hook (опционально)"
}
```

#### Поле matcher

Определяет условие срабатывания, поддерживает следующие переменные:

| Переменная | Значение | Пример |
| --- | --- | --- |
| `tool` | Имя инструмента | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Содержимое Bash-команды | `"npm run dev"` |
| `tool_input.file_path` | Путь к файлу для Write/Edit | `"/path/to/file.ts"` |

**Операторы сопоставления**:

```javascript
// Равенство
tool == "Bash"

// Регулярное выражение
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// Логические операции
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### Массив hooks

Определяет выполняемые действия, поддерживает два типа:

**Тип 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` — переменная корневого каталога плагина
- Команда выполняется в корневом каталоге проекта
- Вывод в стандартном формате JSON передаётся в Claude Code

**Тип 2: prompt** (не используется в данной конфигурации)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### Полный пример конфигурации Hooks

Everything Claude Code предоставляет более 15 предварительно настроенных Hooks, ниже приведено полное описание конфигурации:

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Назначение**: Принудительный запуск dev-сервера в tmux для обеспечения доступа к логам.

**Сопоставляемые команды**:
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**Назначение**: Напоминание об использовании tmux для длительных команд.

**Сопоставляемые команды**:
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**Назначение**: Напоминание о проверке изменений перед push.

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Назначение**: Блокировка создания случайных .md файлов для консолидации документации.

**Разрешённые файлы**:
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Назначение**: Предложение ручного сжатия контекста в логических точках.

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**Назначение**: Загрузка контекста предыдущей сессии и определение менеджера пакетов.

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Назначение**: Логирование URL PR и предоставление команды для ревью после создания PR.

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Назначение**: Автоматическое форматирование JS/TS файлов с помощью Prettier.

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Назначение**: Проверка типов после редактирования TypeScript файлов.

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**Назначение**: Обнаружение и предупреждение о console.log в файлах.

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**Назначение**: Проверка console.log в изменённых файлах.

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**Назначение**: Сохранение состояния перед сжатием контекста.

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**Назначение**: Сохранение состояния сессии.

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**Назначение**: Оценка сессии для извлечения переиспользуемых паттернов.

### Пользовательские Hooks

Вы можете настраивать Hooks следующими способами:

#### Способ 1: Редактирование settings.json

```bash
# Редактирование глобальной конфигурации
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### Способ 2: Переопределение на уровне проекта

Создайте `.claude/settings.json` в корневом каталоге проекта:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip Преимущества конфигурации на уровне проекта
- Не влияет на глобальную конфигурацию
- Действует только в конкретном проекте
- Можно добавить в систему контроля версий
:::

## Подробное описание конфигурации MCP-серверов

MCP (Model Context Protocol) серверы расширяют возможности интеграции Claude Code с внешними сервисами.

### Структура конфигурации MCP

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### Типы MCP-серверов

#### Тип 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**Описание полей**:
- `command`: Команда выполнения, обычно `npx`
- `args`: Массив аргументов, `-y` для автоматического подтверждения установки
- `env`: Объект переменных окружения
- `description`: Текст описания

#### Тип 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**Описание полей**:
- `type`: Должен быть `"http"`
- `url`: URL сервера
- `description`: Текст описания

### Предварительно настроенные MCP-серверы Everything Claude Code

Ниже приведён список всех предварительно настроенных MCP-серверов:

| Имя сервера | Тип | Описание | Требуется настройка |
| --- | --- | --- | --- |
| `github` | npx | Операции GitHub (PR, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | Веб-скрапинг и краулинг | Firecrawl API Key |
| `supabase` | npx | Операции с базой данных Supabase | Project Ref |
| `memory` | npx | Персистентная память между сессиями | Нет |
| `sequential-thinking` | npx | Цепочка рассуждений | Нет |
| `vercel` | http | Развёртывание и управление проектами Vercel | Нет |
| `railway` | npx | Развёртывание Railway | Нет |
| `cloudflare-docs` | http | Поиск по документации Cloudflare | Нет |
| `cloudflare-workers-builds` | http | Сборки Cloudflare Workers | Нет |
| `cloudflare-workers-bindings` | http | Привязки Cloudflare Workers | Нет |
| `cloudflare-observability` | http | Логи и мониторинг Cloudflare | Нет |
| `clickhouse` | http | Аналитические запросы ClickHouse | Нет |
| `context7` | npx | Поиск документации в реальном времени | Нет |
| `magic` | npx | Компоненты Magic UI | Нет |
| `filesystem` | npx | Операции с файловой системой | Настройка путей |

### Добавление MCP-сервера

#### Добавление из предварительно настроенных

1. Скопируйте конфигурацию сервера из `mcp-configs/mcp-servers.json`
2. Вставьте в ваш `~/.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. Замените заполнители `YOUR_*_HERE` на реальные значения

#### Добавление пользовательского MCP-сервера

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### Отключение MCP-серверов

Используйте массив `disabledMcpServers` для отключения определённых серверов:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning Предупреждение о контекстном окне
Включение слишком большого количества MCP-серверов занимает много места в контекстном окне. Рекомендуется включать **менее 10** MCP-серверов.
:::

## Подробное описание конфигурации плагинов

### Структура plugin.json

`.claude-plugin/plugin.json` — это файл манифеста плагина, определяющий метаданные плагина и пути к компонентам.

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### Описание полей

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `name` | string | Да | Имя плагина |
| `description` | string | Да | Описание плагина |
| `author.name` | string | Да | Имя автора |
| `author.url` | string | Нет | URL страницы автора |
| `homepage` | string | Нет | Домашняя страница плагина |
| `repository` | string | Нет | URL репозитория |
| `license` | string | Нет | Лицензия |
| `keywords` | string[] | Нет | Массив ключевых слов |
| `commands` | string | Да | Путь к каталогу команд |
| `skills` | string | Да | Путь к каталогу навыков |

### Изменение путей плагина

Если вам нужно настроить пути к компонентам, измените `plugin.json`:

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## Другие конфигурационные файлы

### package-manager.json

Конфигурация менеджера пакетов, поддерживает уровень проекта и глобальный уровень:

```json
{
  "packageManager": "pnpm"
}
```

**Расположение**:
- Глобальный: `~/.claude/package-manager.json`
- Проект: `.claude/package-manager.json`

### marketplace.json

Манифест маркетплейса плагинов, используется для команды `/plugin marketplace add`:

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

Пример конфигурации строки состояния:

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## Объединение и приоритет конфигурационных файлов

### Стратегия объединения

Конфигурационные файлы объединяются в следующем порядке (последний имеет приоритет):

1. Встроенная конфигурация плагина
2. Глобальная конфигурация (`~/.claude/settings.json`)
3. Конфигурация проекта (`.claude/settings.json`)

**Пример**:

```json
// Встроенная конфигурация плагина
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// Глобальная конфигурация
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// Конфигурация проекта
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// Итоговый результат объединения (приоритет проекта)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C переопределяет A и B
  }
}
```

::: warning Важные замечания
- **Одноимённые массивы полностью перезаписываются**, а не дополняются
- Рекомендуется определять в конфигурации проекта только те части, которые нужно переопределить
- Для просмотра полной конфигурации используйте команду `/debug config`
:::

### Конфигурация переменных окружения

Определение переменных окружения в `settings.json`:

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip Напоминание о безопасности
- Переменные окружения видны в конфигурационном файле
- Не храните конфиденциальную информацию в конфигурационных файлах
- Используйте системные переменные окружения или файлы `.env` для управления секретами
:::

## Устранение распространённых проблем конфигурации

### Проблема 1: Hook не срабатывает

**Возможные причины**:
1. Ошибка в выражении Matcher
2. Неправильный формат конфигурации Hook
3. Конфигурационный файл не сохранён корректно

**Шаги диагностики**:

```bash
# Проверка синтаксиса конфигурации
cat ~/.claude/settings.json | python -m json.tool

# Проверка загрузки Hook
# Выполните в Claude Code
/debug config
```

**Типичные исправления**:

```json
// ❌ Ошибка: одинарные кавычки
{
  "matcher": "tool == 'Bash'"
}

// ✅ Правильно: двойные кавычки
{
  "matcher": "tool == \"Bash\""
}
```

### Проблема 2: Ошибка подключения MCP-сервера

**Возможные причины**:
1. Переменные окружения не настроены
2. Проблемы с сетью
3. Неправильный URL сервера

**Шаги диагностики**:

```bash
# Тестирование MCP-сервера
npx @modelcontextprotocol/server-github --help

# Проверка переменных окружения
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**Типичные исправления**:

```json
// ❌ Ошибка: неправильное имя переменной окружения
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // Должно быть GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ Правильно
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### Проблема 3: Конфликт конфигураций

**Симптомы**: Некоторые параметры конфигурации не применяются

**Причина**: Конфигурация проекта переопределяет глобальную конфигурацию

**Решение**:

```bash
# Просмотр конфигурации проекта
cat .claude/settings.json

# Просмотр глобальной конфигурации
cat ~/.claude/settings.json

# Удаление конфигурации проекта (если не нужна)
rm .claude/settings.json
```

### Проблема 4: Ошибка формата JSON

**Симптомы**: Claude Code не может прочитать конфигурацию

**Инструменты диагностики**:

```bash
# Проверка с помощью jq
cat ~/.claude/settings.json | jq '.'

# Проверка с помощью Python
cat ~/.claude/settings.json | python -m json.tool

# Использование онлайн-инструмента
# https://jsonlint.com/
```

**Типичные ошибки**:

```json
// ❌ Ошибка: запятая в конце
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ Ошибка: одинарные кавычки
{
  "description": 'Hooks configuration'
}

// ❌ Ошибка: комментарии
{
  "hooks": {
    // This is a comment
  }
}

// ✅ Правильно
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## Резюме урока

В этом уроке систематически рассмотрена полная система конфигурации Everything Claude Code:

**Основные концепции**:
- Конфигурация имеет три уровня: проект, глобальный, плагин
- Приоритет конфигурации: проект > глобальный > плагин
- Строгий формат JSON, обратите внимание на двойные кавычки и синтаксис

**Конфигурация Hooks**:
- 6 типов Hook, более 15 предварительно настроенных Hook
- Выражения Matcher определяют условия срабатывания
- Поддержка пользовательских Hook и переопределения на уровне проекта

**MCP-серверы**:
- Два типа: npx и http
- Более 15 предварительно настроенных серверов
- Поддержка отключения и пользовательской настройки

**Конфигурация плагинов**:
- plugin.json определяет метаданные плагина
- Поддержка пользовательских путей к компонентам
- marketplace.json для маркетплейса плагинов

**Другие конфигурации**:
- package-manager.json: конфигурация менеджера пакетов
- statusline.json: конфигурация строки состояния
- environmentVariables: определение переменных окружения

**Распространённые проблемы**:
- Hook не срабатывает → проверьте matcher и формат JSON
- Ошибка подключения MCP → проверьте переменные окружения и сеть
- Конфликт конфигураций → проверьте конфигурации проекта и глобальную
- Ошибка формата JSON → используйте jq или онлайн-инструменты для проверки

## Анонс следующего урока

> В следующем уроке мы изучим **[Полный справочник Rules: Подробное описание 8 наборов правил](../rules-reference/)**.
>
> Вы узнаете:
> - Правила Security: предотвращение утечки конфиденциальных данных
> - Правила Coding Style: стиль кода и лучшие практики
> - Правила Testing: требования к покрытию тестами и TDD
> - Правила Git Workflow: стандарты коммитов и процесс PR
> - Как настроить наборы правил под потребности проекта

---

## Приложение: Справочник исходного кода

<details>
<summary><strong>Нажмите, чтобы развернуть расположение исходного кода</strong></summary>

> Дата обновления: 2026-01-25

| Функция | Путь к файлу | Строки |
| --- | --- | --- |
| Конфигурация Hooks | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Манифест плагина | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Конфигурация MCP-серверов | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Манифест маркетплейса | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**Ключевые скрипты Hook**:
- `session-start.js`: загрузка контекста при начале сессии
- `session-end.js`: сохранение состояния при завершении сессии
- `suggest-compact.js`: предложение ручного сжатия контекста
- `pre-compact.js`: сохранение состояния перед сжатием
- `evaluate-session.js`: оценка сессии для извлечения паттернов

**Ключевые переменные окружения**:
- `CLAUDE_PLUGIN_ROOT`: корневой каталог плагина
- `GITHUB_PERSONAL_ACCESS_TOKEN`: аутентификация GitHub API
- `FIRECRAWL_API_KEY`: аутентификация Firecrawl API

</details>
