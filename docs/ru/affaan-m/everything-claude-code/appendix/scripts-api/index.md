---
title: "Scripts API: Node.js скрипты | Everything Claude Code"
sidebarTitle: "Написание Hook-скриптов"
subtitle: "Scripts API: Node.js скрипты"
description: "Изучите API Scripts в Everything Claude Code. Освойте обнаружение платформ, работу с файлами, API менеджера пакетов и использование Hook-скриптов."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Справочник по Scripts API: интерфейсы Node.js скриптов

## Что вы сможете делать после изучения

- Полностью понимать API скриптов Everything Claude Code
- Использовать функции обнаружения платформ и кроссплатформенные утилиты
- Настраивать и использовать механизм автоматического определения менеджера пакетов
- Писать собственные Hook-скрипты для расширения возможностей автоматизации
- Отлаживать и модифицировать существующие реализации скриптов

## Ваше текущее затруднение

Вы уже знаете, что в Everything Claude Code много скриптов автоматизации, но сталкиваетесь с такими вопросами:

- "Какие API предоставляют эти Node.js скрипты?"
- "Как настроить собственные Hook-скрипты?"
- "Каков приоритет обнаружения менеджера пакетов?"
- "Как обеспечить кроссплатформенную совместимость в скриптах?"

Этот учебник предоставит вам полный справочник по Scripts API.

## Основная концепция

Система скриптов Everything Claude Code делится на две категории:

1. **Общая библиотека утилит** (`scripts/lib/`) — предоставляет кроссплатформенные функции и API
2. **Hook-скрипты** (`scripts/hooks/`) — логика автоматизации, запускаемая при определенных событиях

Все скрипты поддерживают **три основные платформы: Windows, macOS и Linux**, реализованы с использованием нативных модулей Node.js.

### Структура скриптов

```
scripts/
├── lib/
│   ├── utils.js          # Универсальные утилиты
│   └── package-manager.js # Определение менеджера пакетов
├── hooks/
│   ├── session-start.js   # SessionStart Hook
│   ├── session-end.js     # SessionEnd Hook
│   ├── pre-compact.js     # PreCompact Hook
│   ├── suggest-compact.js # PreToolUse Hook
│   └── evaluate-session.js # Stop Hook
└── setup-package-manager.js # Скрипт настройки менеджера пакетов
```

## lib/utils.js — универсальные утилиты

Этот модуль предоставляет кроссплатформенные утилиты, включая обнаружение платформы, работу с файлами, системные команды и т.д.

### Обнаружение платформы

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Функция | Тип | Возвращаемое значение | Описание |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | Является ли текущая платформа Windows |
| `isMacOS` | boolean | `true/false` | Является ли текущая платформа macOS |
| `isLinux` | boolean | `true/false` | Является ли текущая платформа Linux |

**Принцип реализации**: на основе проверки `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Утилиты для работы с директориями

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Получает домашний каталог пользователя (кроссплатформенная совместимость)

**Возвращаемое значение**: `string` — путь к домашнему каталогу пользователя

**Пример**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Получает каталог конфигурации Claude Code

**Возвращаемое значение**: `string` — путь к каталогу `~/.claude`

**Пример**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Получает каталог файлов сессий

**Возвращаемое значение**: `string` — путь к каталогу `~/.claude/sessions`

**Пример**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Получает каталог изученных навыков

**Возвращаемое значение**: `string` — путь к каталогу `~/.claude/skills/learned`

**Пример**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Получает системный временный каталог (кроссплатформенный)

**Возвращаемое значение**: `string` — путь к временному каталогу

**Пример**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Гарантирует существование директории, создает при необходимости

**Параметры**:
- `dirPath` (string) — путь к директории

**Возвращаемое значение**: `string` — путь к директории

**Пример**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// Если директория не существует, она будет создана рекурсивно
```

### Утилиты даты и времени

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Получает текущую дату (формат: YYYY-MM-DD)

**Возвращаемое значение**: `string` — строка даты

**Пример**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Получает текущее время (формат: HH:MM)

**Возвращаемое значение**: `string` — строка времени

**Пример**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Получает текущую дату и время (формат: YYYY-MM-DD HH:MM:SS)

**Возвращаемое значение**: `string` — строка даты и времени

**Пример**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### Операции с файлами

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Ищет файлы, соответствующие шаблону, в директории (кроссплатформенная альтернатива `find`)

**Параметры**:
- `dir` (string) — директория для поиска
- `pattern` (string) — шаблон файла (например, `"*.tmp"`, `"*.md"`)
- `options` (object, опционально) — опции
  - `maxAge` (number) — максимальный возраст файла в днях
  - `recursive` (boolean) — рекурсивный поиск

**Возвращаемое значение**: `Array<{path: string, mtime: number}>` — список найденных файлов, отсортированных по времени изменения (по убыванию)

**Пример**:
```javascript
// Найти .tmp файлы за последние 7 дней
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Рекурсивный поиск всех .md файлов
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Кроссплатформенная совместимость
Эта функция предоставляет кроссплатформенный поиск файлов, не зависящий от команды Unix `find`, поэтому работает корректно на Windows.
:::

#### readFile(filePath)

Безопасное чтение текстового файла

**Параметры**:
- `filePath` (string) — путь к файлу

**Возвращаемое значение**: `string | null` — содержимое файла, `null` при ошибке чтения

**Пример**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Запись текстового файла

**Параметры**:
- `filePath` (string) — путь к файлу
- `content` (string) — содержимое файла

**Возвращаемое значение**: нет

**Пример**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// Если директория не существует, она будет создана автоматически
```

#### appendFile(filePath, content)

Добавление содержимого в текстовый файл

**Параметры**:
- `filePath` (string) — путь к файлу
- `content` (string) — добавляемое содержимое

**Возвращаемое значение**: нет

**Пример**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Замена текста в файле (кроссплатформенная альтернатива `sed`)

**Параметры**:
- `filePath` (string) — путь к файлу
- `search` (string | RegExp) — искомое содержимое
- `replace` (string) — заменяющее содержимое

**Возвращаемое значение**: `boolean` — успешность замены

**Пример**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: замена успешна
// false: файл не существует или ошибка чтения
```

#### countInFile(filePath, pattern)

Подсчет количества вхождений шаблона в файле

**Параметры**:
- `filePath` (string) — путь к файлу
- `pattern` (string | RegExp) — шаблон для подсчета

**Возвращаемое значение**: `number` — количество совпадений

**Пример**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Поиск шаблона в файле и возврат совпадающих строк с номерами

**Параметры**:
- `filePath` (string) — путь к файлу
- `pattern` (string | RegExp) — искомый шаблон

**Возвращаемое значение**: `Array<{lineNumber: number, content: string}>` — список совпадающих строк

**Пример**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

Чтение JSON-данных из стандартного ввода (для входных данных Hook)

**Возвращаемое значение**: `Promise<object>` — разобранный JSON-объект

**Пример**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Формат входных данных Hook
Claude Code передает Hook входные данные в формате:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

Запись лога в stderr (видимый пользователю)

**Параметры**:
- `message` (string) — сообщение лога

**Возвращаемое значение**: нет

**Пример**:
```javascript
log('[SessionStart] Loading context...');
// Вывод в stderr, видимый в Claude Code
```

#### output(data)

Вывод данных в stdout (возврат в Claude Code)

**Параметры**:
- `data` (object | string) — выводимые данные

**Возвращаемое значение**: нет

**Пример**:
```javascript
// Вывод объекта (автоматическая сериализация JSON)
output({ success: true, message: 'Completed' });

// Вывод строки
output('Hello, Claude');
```

### Системные команды

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

Проверка существования команды в PATH

**Параметры**:
- `cmd` (string) — имя команды

**Возвращаемое значение**: `boolean` — существует ли команда

**Пример**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning Проверка безопасности
Эта функция выполняет валидацию имени команды с помощью регулярного выражения, разрешая только буквы, цифры, подчеркивания, точки и дефисы для предотвращения инъекций команд.
:::

#### runCommand(cmd, options)

Выполнение команды и возврат вывода

**Параметры**:
- `cmd` (string) — выполняемая команда (должна быть доверенной, жестко закодированной)
- `options` (object, опционально) — опции `execSync`

**Возвращаемое значение**: `{success: boolean, output: string}` — результат выполнения

**Пример**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger Предупреждение безопасности
**Используйте эту функцию только для доверенных, жестко закодированных команд**. Не передавайте пользовательский ввод напрямую в эту функцию. Для пользовательского ввода используйте `spawnSync` с массивом аргументов.
:::

#### isGitRepo()

Проверка, является ли текущая директория Git-репозиторием

**Возвращаемое значение**: `boolean` — является ли Git-репозиторием

**Пример**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Получение списка измененных файлов Git

**Параметры**:
- `patterns` (string[], опционально) — массив шаблонов фильтрации

**Возвращаемое значение**: `string[]` — список путей измененных файлов

**Пример**:
```javascript
// Получить все измененные файлы
const allModified = getGitModifiedFiles();

// Получить только TypeScript файлы
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js — API менеджера пакетов

Этот модуль предоставляет API для автоматического обнаружения и настройки менеджера пакетов.

### Поддерживаемые менеджеры пакетов

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| Менеджер пакетов | lock-файл | команда install | команда run | команда exec |
| --- | --- | --- | --- | --- |
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### Приоритет обнаружения

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

Обнаружение менеджера пакетов выполняется в следующем порядке приоритета (от высокого к низкому):

1. Переменная окружения `CLAUDE_PACKAGE_MANAGER`
2. Конфигурация уровня проекта `.claude/package-manager.json`
3. Поле `packageManager` в `package.json`
4. Обнаружение по lock-файлу
5. Глобальные пользовательские настройки `~/.claude/package-manager.json`
6. Возврат первого доступного менеджера пакетов по приоритету

### Основные функции

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

Получает менеджер пакетов, который должен использоваться в текущем проекте

**Параметры**:
- `options` (object, опционально)
  - `projectDir` (string) — путь к директории проекта, по умолчанию `process.cwd()`
  - `fallbackOrder` (string[]) — порядок запасных вариантов, по умолчанию `['pnpm', 'bun', 'yarn', 'npm']`

**Возвращаемое значение**: `{name: string, config: object, source: string}`

- `name`: имя менеджера пакетов
- `config`: объект конфигурации менеджера пакетов
- `source`: источник обнаружения (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**Пример**:
```javascript
const pm = getPackageManager();
console.log(pm.name);    // 'pnpm'
console.log(pm.source);  // 'lock-file'
console.log(pm.config);  // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

Устанавливает глобальные предпочтения менеджера пакетов

**Параметры**:
- `pmName` (string) — имя менеджера пакетов (`npm | pnpm | yarn | bun`)

**Возвращаемое значение**: `object` — объект конфигурации

**Пример**:
```javascript
const config = setPreferredPackageManager('pnpm');
// Сохраняется в ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

Устанавливает предпочтения менеджера пакетов уровня проекта

**Параметры**:
- `pmName` (string) — имя менеджера пакетов
- `projectDir` (string) — путь к директории проекта, по умолчанию `process.cwd()`

**Возвращаемое значение**: `object` — объект конфигурации

**Пример**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// Сохраняется в /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

Получает список установленных в системе менеджеров пакетов

**Возвращаемое значение**: `string[]` — массив имен доступных менеджеров пакетов

**Пример**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm'] // если установлены только pnpm и npm
```

#### getRunCommand(script, options = {})

Получает команду для запуска скрипта

**Параметры**:
- `script` (string) — имя скрипта (например, `"dev"`, `"build"`, `"test"`)
- `options` (object, опционально) — опции директории проекта

**Возвращаемое значение**: `string` — полная команда запуска

**Пример**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev' или 'pnpm dev' или 'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build' или 'pnpm build'
```

**Встроенные сокращения для скриптов**:
- `install` → возвращает `installCmd`
- `test` → возвращает `testCmd`
- `build` → возвращает `buildCmd`
- `dev` → возвращает `devCmd`
- другие → возвращает `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

Получает команду для выполнения бинарного файла пакета

**Параметры**:
- `binary` (string) — имя бинарного файла (например, `"prettier"`, `"eslint"`)
- `args` (string, опционально) — строка аргументов
- `options` (object, опционально) — опции директории проекта

**Возвращаемое значение**: `string` — полная команда выполнения

**Пример**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js' или 'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint' или 'bunx eslint'
```

#### getCommandPattern(action)

Генерирует регулярное выражение для сопоставления команд всех менеджеров пакетов

**Параметры**:
- `action` (string) — тип действия (`'dev' | 'install' | 'test' | 'build'` или пользовательское имя скрипта)

**Возвращаемое значение**: `string` — шаблон регулярного выражения

**Пример**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js — скрипт настройки менеджера пакетов

Это исполняемый CLI-скрипт для интерактивной настройки предпочтений менеджера пакетов.

### Использование

```bash
# Обнаружить и отобразить текущий менеджер пакетов
node scripts/setup-package-manager.js --detect

# Установить глобальные предпочтения
node scripts/setup-package-manager.js --global pnpm

# Установить предпочтения проекта
node scripts/setup-package-manager.js --project bun

# Список доступных менеджеров пакетов
node scripts/setup-package-manager.js --list

# Показать справку
node scripts/setup-package-manager.js --help
```

### Параметры командной строки

| Параметр | Описание |
| --- | --- |
| `--detect` | Обнаружить и отобразить текущий менеджер пакетов |
| `--list` | Список всех доступных менеджеров пакетов |
| `--help` | Показать справочную информацию |

### Пример вывода

**Вывод --detect**:
```
=== Package Manager Detection ===

Current selection:
Package Manager: pnpm
Source: lock-file

Detection results:
From package.json: not specified
From lock file: pnpm
Environment var: not set

Available package managers:
✓ pnpm (current)
✓ npm
✗ yarn
✗ bun

Commands:
Install: pnpm install
Run script: pnpm [script-name]
Execute binary: pnpm dlx [binary-name]
```

## Подробное описание Hook-скриптов

### session-start.js — хук начала сессии

**Тип Hook**: `SessionStart`

**Момент срабатывания**: При запуске сессии Claude Code

**Функции**:
- Проверка недавних файлов сессий (за последние 7 дней)
- Проверка файлов изученных навыков
- Обнаружение и отчет о менеджере пакетов
- Если менеджер пакетов определен через fallback, отображается подсказка выбора

**Пример вывода**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js — хук окончания сессии

**Тип Hook**: `SessionEnd`

**Момент срабатывания**: При завершении сессии Claude Code

**Функции**:
- Создание или обновление файла сессии текущего дня
- Запись времени начала и окончания сессии
- Предоставление шаблона состояния сессии (завершено, в процессе, заметки)

**Шаблон файла сессии**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
```
[relevant files]
```
```

### pre-compact.js — хук перед компактизацией

**Тип Hook**: `PreCompact`

**Момент срабатывания**: Перед компактизацией контекста Claude Code

**Функции**:
- Запись события компактизации в файл лога
- Отметка времени компактизации в файле активной сессии

**Пример вывода**:
```
[PreCompact] State saved before compaction
```

**Файл лога**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js — хук рекомендации компактизации

**Тип Hook**: `PreToolUse`

**Момент срабатывания**: После каждого вызова инструмента (обычно Edit или Write)

**Функции**:
- Отслеживание количества вызовов инструментов
- Рекомендация ручной компактизации при достижении порога
- Периодические подсказки о времени компактизации

**Переменные окружения**:
- `COMPACT_THRESHOLD` — порог компактизации (по умолчанию: 50)
- `CLAUDE_SESSION_ID` — ID сессии

**Пример вывода**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip Ручная компактизация vs Автоматическая компактизация
Почему рекомендуется ручная компактизация?
- Автоматическая компактизация обычно срабатывает в середине задачи, что приводит к потере контекста
- Ручная компактизация позволяет сохранить важную информацию при смене логических фаз
- Время компактизации: окончание фазы исследования, начало фазы выполнения, завершение вехи
:::

### evaluate-session.js — хук оценки сессии

**Тип Hook**: `Stop`

**Момент срабатывания**: После каждого ответа AI

**Функции**:
- Проверка длины сессии (на основе количества сообщений пользователя)
- Оценка, содержит ли сессия извлекаемые паттерны
- Подсказка сохранения изученных навыков

**Файл конфигурации**: `skills/continuous-learning/config.json`

**Переменные окружения**:
- `CLAUDE_TRANSCRIPT_PATH` — путь к файлу записи сессии

**Пример вывода**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip Почему используется Stop вместо UserPromptSubmit?
- Stop срабатывает только один раз за ответ (легковесный)
- UserPromptSubmit срабатывает на каждое сообщение (высокая задержка)
:::

## Пользовательские Hook-скрипты

### Создание пользовательского Hook

1. **Создайте скрипт в директории `scripts/hooks/`**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // Ваша логика
  log('[CustomHook] Processing...');

  // Вывод результата
  output({ success: true });

  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // Не блокирует сессию
});
```

2. **Настройте Hook в `hooks/hooks.json`**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **Тестирование Hook**

```bash
# В Claude Code активируйте условие и проверьте вывод
```

### Лучшие практики

#### 1. Обработка ошибок

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // Не блокирует сессию
});
```

#### 2. Использование библиотеки утилит

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. Кроссплатформенные пути

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. Переменные окружения

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## Тестовые скрипты

### Тестирование утилит

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// Тест поиска файлов
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// Тест чтения/записи файлов
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### Тестирование обнаружения менеджера пакетов

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Тестирование Hook-скриптов

```bash
# Запуск Hook-скрипта напрямую (требуются переменные окружения)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## Техники отладки

### 1. Использование log для вывода

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. Перехват ошибок

```javascript
try {
  // Код, который может вызвать ошибку
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. Проверка путей к файлам

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Просмотр логов выполнения Hook

```bash
# В Claude Code вывод stderr Hook отображается в ответе
# Ищите логи с префиксом [HookName]
```

## Часто задаваемые вопросы

### Q1: Hook-скрипт не выполняется?

**Возможные причины**:
1. Ошибка в конфигурации matcher в `hooks/hooks.json`
2. Неверный путь к скрипту
3. Скрипт не имеет прав на выполнение

**Шаги диагностики**:
```bash
# Проверить путь к скрипту
ls -la scripts/hooks/

# Запустить скрипт вручную для тестирования
node scripts/hooks/session-start.js

# Проверить синтаксис hooks.json
cat hooks/hooks.json | jq '.'
```

### Q2: Ошибки путей на Windows?

**Причина**: Windows использует обратные слеши, а Unix — прямые

**Решение**:
```javascript
// ❌ Неправильно: жестко закодированный разделитель пути
const path = 'C:\\Users\\username\\.claude';

// ✅ Правильно: использование path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: Как отладить входные данные Hook?

**Метод**: Записать входные данные Hook во временный файл

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();

  // Записать в файл отладки
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));

  console.error('[Debug] Input saved to:', debugPath);
}
```

## Резюме урока

Этот урок систематически объяснил Scripts API в Everything Claude Code:

**Основные модули**:
- `lib/utils.js`: кроссплатформенные утилиты (обнаружение платформы, работа с файлами, системные команды)
- `lib/package-manager.js`: API обнаружения и настройки менеджера пакетов
- `setup-package-manager.js`: CLI-инструмент настройки

**Hook-скрипты**:
- `session-start.js`: загрузка контекста при начале сессии
- `session-end.js`: сохранение состояния при окончании сессии
- `pre-compact.js`: сохранение состояния перед компактизацией
- `suggest-compact.js`: рекомендация времени ручной компактизации
- `evaluate-session.js`: оценка сессии для извлечения паттернов

**Лучшие практики**:
- Используйте функции библиотеки утилит для обеспечения кроссплатформенной совместимости
- Hook-скрипты не блокируют сессию (код выхода 0 при ошибках)
- Используйте `log()` для вывода отладочной информации
- Используйте `process.env` для чтения переменных окружения

**Техники отладки**:
- Запускайте скрипты напрямую для тестирования
- Используйте временные файлы для сохранения отладочных данных
- Проверяйте конфигурацию matcher и пути к скриптам

## Анонс следующего урока

> В следующем уроке мы изучим **[Тестовый набор: запуск и настройка](../test-suite/)**.
>
> Вы узнаете:
> - Как запускать тестовый набор
> - Как писать модульные тесты для утилит
> - Как писать интеграционные тесты для Hook-скриптов
> - Как добавлять пользовательские тестовые случаи

---

## Приложение: справочник исходного кода

<details>
<summary><strong>Нажмите, чтобы развернуть местоположение исходного кода</strong></summary>

> Обновлено: 2026-01-25

| Функциональный модуль | Путь к файлу | Номера строк |
| --- | --- | --- |
| Универсальные утилиты | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| API менеджера пакетов | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| Скрипт настройки менеджера пакетов | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**Ключевые константы**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: приоритет обнаружения менеджера пакетов (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: порог рекомендации компактизации (по умолчанию 50, можно переопределить через переменную окружения)

**Ключевые функции**:
- `getPackageManager()`: обнаружение и выбор менеджера пакетов (`scripts/lib/package-manager.js:157`)
- `findFiles()`: кроссплатформенный поиск файлов (`scripts/lib/utils.js:102`)
- `readStdinJson()`: чтение входных данных Hook (`scripts/lib/utils.js:154`)
- `commandExists()`: проверка существования команды (`scripts/lib/utils.js:228`)

**Переменные окружения**:
- `CLAUDE_PACKAGE_MANAGER`: принудительное указание менеджера пакетов
- `CLAUDE_SESSION_ID`: ID сессии
- `CLAUDE_TRANSCRIPT_PATH`: путь к файлу записи сессии
- `COMPACT_THRESHOLD`: порог рекомендации компактизации

**Обнаружение платформы**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
