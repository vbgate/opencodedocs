---
title: "Сбой подключения MCP: устранение неполадок конфигурации | Everything Claude Code"
sidebarTitle: "Устранение проблем с подключением MCP"
subtitle: "Сбой подключения MCP: устранение неполадок конфигурации"
description: "Научитесь устранять проблемы с подключением серверов MCP. Решите 6 распространённых проблем, включая ошибки API-ключей, слишком малое контекстное окно, неправильную конфигурацию типа сервера и т. д., с помощью систематического процесса исправления."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Устранение неполадок: сбой подключения MCP

## Ваша текущая проблема

После настройки серверов MCP вы можете столкнуться со следующими проблемами:

- ❌ Claude Code показывает сообщение "Failed to connect to MCP server"
- ❌ Команды GitHub/Supabase не работают
- ❌ Контекстное окно внезапно уменьшилось, вызовы инструментов замедлились
- ❌ MCP файловой системы не может получить доступ к файлам
- ❌ Включено слишком много серверов MCP, система работает медленно

Не волнуйтесь, все эти проблемы имеют чёткие решения. Этот урок поможет вам систематически устранить проблемы с подключением MCP.

---

## Распространённая проблема 1: API-ключ не настроен или недействителен

### Симптомы

Когда вы пытаетесь использовать серверы MCP, такие как GitHub или Firecrawl, Claude Code показывает:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

или

```
Failed to connect to MCP server: Authentication failed
```

### Причина

Заполнитель `YOUR_*_HERE` в файле конфигурации MCP не был заменён на реальный API-ключ.

### Решение

**Шаг 1: Проверьте файл конфигурации**

Откройте `~/.claude.json` и найдите конфигурацию соответствующего сервера MCP:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Проверьте здесь
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Шаг 2: Замените заполнитель**

Замените `YOUR_GITHUB_PAT_HERE` на ваш реальный API-ключ:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Шаг 3: Получение ключей для распространённых серверов MCP**

| MCP-сервер | Имя переменной окружения                | Где получить                                                      |
|--- | --- | ---|
| GitHub     | `GITHUB_PERSONAL_ACCESS_TOKEN`         | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl  | `FIRECRAWL_API_KEY`                    | Firecrawl Dashboard → API Keys                                |
| Supabase   | Ссылка на проект                       | Supabase Dashboard → Settings → API                           |

**Что вы должны увидеть**: После перезапуска Claude Code соответствующие инструменты могут вызываться нормально.

### Предупреждение

::: danger Совет по безопасности
Не отправляйте файл конфигурации с реальными API-ключами в репозиторий Git. Убедитесь, что `~/.claude.json` находится в `.gitignore`.
:::

---

## Распространённая проблема 2: слишком малое контекстное окно

### Симптомы

- Список вызовов инструментов внезапно стал очень коротким
- Claude показывает сообщение "Context window exceeded"
- Скорость ответов значительно снизилась

### Причина

Включено слишком много серверов MCP, что привело к заполнению контекстного окна. Согласно README проекта, **контекстное окно размером 200k может сократиться до 70k из-за включения слишком большого количества MCP**.

### Решение

**Шаг 1: Проверьте количество включённых MCP**

Просмотрите раздел `mcpServers` в `~/.claude.json` и подсчитайте количество включённых серверов.

**Шаг 2: Используйте `disabledMcpServers` для отключения ненужных серверов**

Добавьте в конфигурацию уровня проекта (`~/.claude/settings.json` или `.claude/settings.json`):

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**Шаг 3: Следуйте лучшим практикам**

Согласно рекомендациям в README:

- Настройте 20-30 серверов MCP (определённых в файле конфигурации)
- Включайте < 10 серверов MCP для каждого проекта
- Поддерживайте количество активных инструментов < 80

**Что вы должны увидеть**: Список инструментов восстанавливается до нормальной длины, скорость ответов повышается.

### Предупреждение

::: tip Совет
Рекомендуется включать разные комбинации MCP для разных типов проектов. Например:
- Web-проекты: GitHub, Firecrawl, Memory, Context7
- Проекты данных: Supabase, ClickHouse, Sequential-thinking
:::

---

## Распространённая проблема 3: неправильная конфигурация типа сервера

### Симптомы

```
Failed to start MCP server: Command not found
```

или

```
Failed to connect: Invalid server type
```

### Причина

Смешаны два типа серверов MCP: `npx` и `http`.

### Решение

**Шаг 1: Определите тип сервера**

Проверьте `mcp-configs/mcp-servers.json`, различая два типа:

**Тип npx** (требует `command` и `args`):
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**Тип http** (требует `url`):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Шаг 2: Исправьте конфигурацию**

| MCP-сервер      | Правильный тип | Правильная конфигурация                                                   |
|--- | --- | ---|
| GitHub          | npx            | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel          | http           | `type: "http"`, `url: "https://mcp.vercel.com"`                         |
| Cloudflare Docs | http           | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"`            |
| Memory          | npx            | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**Что вы должны увидеть**: После перезапуска сервер MCP запускается нормально.

---

## Распространённая проблема 4: неправильная конфигурация пути MCP файловой системы

### Симптомы

- Инструменты файловой системы не могут получить доступ к файлам
- Показывается сообщение "Path not accessible" или "Permission denied"

### Причина

Параметр пути MCP файловой системы не был заменён на реальный путь к проекту.

### Решение

**Шаг 1: Проверьте конфигурацию**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Шаг 2: Замените на реальный путь**

Замените путь в зависимости от вашей операционной системы:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Шаг 3: Проверьте права доступа**

Убедитесь, что у вас есть права на чтение и запись в настроенный путь.

**Что вы должны увидеть**: Инструменты файловой системы могут нормально получать доступ и работать с файлами в указанном пути.

### Предупреждение

::: warning Примечание
- Не используйте символ `~`, используйте полный путь
- Обратные слэши в путях Windows должны быть экранированы как `\\`
- Убедитесь, что в конце пути нет лишних разделителей
:::

---

## Распространённая проблема 5: ссылка на проект Supabase не настроена

### Симптомы

Сбой подключения MCP Supabase, показывается сообщение "Missing project reference".

### Причина

Параметр `--project-ref` MCP Supabase не настроен.

### Решение

**Шаг 1: Получите ссылку на проект**

В Supabase Dashboard:
1. Перейдите в настройки проекта
2. Найдите раздел "Project Reference" или "API"
3. Скопируйте ID проекта (формат похож на `xxxxxxxxxxxxxxxx`)

**Шаг 2: Обновите конфигурацию**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**Что вы должны увидеть**: Инструменты Supabase могут нормально запрашивать базу данных.

---

## Распространённая проблема 6: команда npx не найдена

### Симптомы

```
Failed to start MCP server: npx: command not found
```

### Причина

Node.js не установлен в системе или npx не находится в PATH.

### Решение

**Шаг 1: Проверьте версию Node.js**

```bash
node --version
```

**Шаг 2: Установите Node.js (если отсутствует)**

Посетите [nodejs.org](https://nodejs.org/) для загрузки и установки последней версии LTS.

**Шаг 3: Проверьте npx**

```bash
npx --version
```

**Что вы должны увидеть**: Версия npx отображается нормально.

---

## Схема устранения неполадок

При возникновении проблем с MCP устраняйте их в следующем порядке:

```
1. Проверьте, настроен ли API-ключ
   ↓ (настроен)
2. Проверьте, что количество включённых MCP < 10
   ↓ (количество в норме)
3. Проверьте тип сервера (npx vs http)
   ↓ (тип правильный)
4. Проверьте параметры пути (Filesystem, Supabase)
   ↓ (путь правильный)
5. Проверьте, доступны ли Node.js и npx
   ↓ (доступны)
Проблема решена!
```

---

## Итоги урока

Большинство проблем с подключением MCP связаны с конфигурацией, запомните следующие моменты:

- ✅ **API-ключи**: замените все заполнители `YOUR_*_HERE`
- ✅ **Управление контекстом**: включайте < 10 MCP, используйте `disabledMcpServers` для отключения ненужных
- ✅ **Тип сервера**: различайте типы npx и http
- ✅ **Конфигурация пути**: Filesystem и Supabase требуют настройки конкретного пути/ссылки
- ✅ **Зависимости среды**: убедитесь, что Node.js и npx доступны

Если проблема всё ещё не решена, проверьте наличие конфликтов между `~/.claude/settings.json` и конфигурацией уровня проекта.

---



## Предварительный просмотр следующего урока

> В следующем уроке мы изучим **[Устранение неполадок вызова Agent](../troubleshooting-agents/)**.
>
> Вы узнаете:
> - Методы устранения неполадок, когда Agent не загружается и неправильно настроен
> - Стратегии решения проблем с недостаточными правами инструментов
> - Диагностику превышения времени ожидания выполнения Agent и несоответствия вывода ожиданиям

---

## Приложение: ссылки на исходный код

<details>
<summary><strong>Нажмите, чтобы развернуть и увидеть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-25

| Функция           | Путь к файлу                                                                                                                    | Строки |
|--- | --- | ---|
| Файл конфигурации MCP   | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91  |
| Предупреждение о контекстном окне | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                                       | 67-75 |

**Ключевые конфигурации**:
- `mcpServers.mcpServers.*.command`: команда запуска сервера типа npx
- `mcpServers.mcpServers.*.args`: параметры запуска
- `mcpServers.mcpServers.*.env`: переменные окружения (API-ключи)
- `mcpServers.mcpServers.*.type`: тип сервера ("npx" или "http")
- `mcpServers.mcpServers.*.url`: URL сервера типа http

**Важные примечания**:
- `mcpServers._comments.env_vars`: замените заполнители `YOUR_*_HERE`
- `mcpServers._comments.disabling`: используйте `disabledMcpServers` для отключения серверов
- `mcpServers._comments.context_warning`: включайте < 10 MCP для сохранения контекстного окна

</details>
