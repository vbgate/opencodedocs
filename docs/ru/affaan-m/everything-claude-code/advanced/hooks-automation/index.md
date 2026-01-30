---
title: "Hooks автоматизация: 15+ хуков разбор | Everything Claude Code"
sidebarTitle: "Заставьте Claude работать автоматически"
subtitle: "Hooks автоматизация: 15+ хуков глубокий разбор"
description: "Изучите 15+ механизмов автоматических хуков Everything Claude Code. Учебник объясняет 6 типов хуков, 14 основных функций и реализацию скриптов Node.js."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks автоматизация: 15+ хуков глубокий разбор

## Что вы сможете после обучения

- Понять 6 типов хуков Claude Code и их механизмы запуска
- Освоить функции и методы настройки 14 встроенных хуков
- Научиться использовать скрипты Node.js для настройки хуков
- Автоматически сохранять и загружать контекст при начале/окончании сессии
- Реализовать автоматические функции: умное сжатие, автоформатирование кода и др.

## Ваша текущая проблема

Вы хотите, чтобы Claude Code автоматически выполнял определённые действия при определённых событиях, например:
- Автоматически загружать предыдущий контекст при начале сессии
- Автоматически форматировать код после каждого редактирования
- Напоминать проверить изменения перед отправкой кода
- Предлагать сжать контекст в подходящий момент

Но для этих функций требуется ручной запуск или глубокое понимание системы хуков Claude Code. Этот урок поможет вам освоить эти возможности автоматизации.

## Когда использовать этот подход

- Нужно сохранять контекст и рабочее состояние между сессиями
- Хотите автоматически выполнять проверку качества кода (форматирование, проверка TypeScript)
- Хотите получать напоминания перед определёнными операциями (например, проверка изменений перед git push)
- Нужно оптимизировать использование токенов, сжимать контекст в подходящий момент
- Хотите автоматически извлекать повторно используемые паттерны из сессий

## Основная идея

**Что такое Hooks**

**Hooks** — это механизм автоматизации, предоставляемый Claude Code, который может запускать пользовательские скрипты при наступлении определённых событий. Он работает как «слушатель событий», автоматически выполняя заранее определённые операции при выполнении условий.

::: info Принцип работы Hook

```
Действие пользователя → Событие запуска → Проверка Hook → Выполнение скрипта → Результат
       ↓                 ↓                  ↓              ↓              ↓
   Использование     PreToolUse       Совпадение    Скрипт Node.js    Вывод в консоль
```

Например, когда вы используете инструмент Bash для выполнения `npm run dev`:
1. PreToolUse Hook обнаруживает шаблон команды
2. Если не в tmux, автоматически блокирует и выводит подсказку
3. После просмотра подсказки вы используете правильный способ запуска

:::

**6 типов хуков**

Everything Claude Code использует 6 типов хуков:

| Тип хука | Момент запуска | Сценарии использования |
|--- | --- | ---|
| **PreToolUse** | Перед выполнением любого инструмента | Проверка команд, блокировка операций, подсказки |
| **PostToolUse** | После выполнения любого инструмента | Автоформатирование, проверка типов, логирование |
| **PreCompact** | Перед сжатием контекста | Сохранение состояния, запись событий сжатия |
| **SessionStart** | При начале новой сессии | Загрузка контекста, обнаружение пакетного менеджера |
| **SessionEnd** | При окончании сессии | Сохранение состояния, оценка сессии, извлечение паттернов |
| **Stop** | При окончании каждого ответа | Проверка изменённых файлов, напоминание о очистке |

::: tip Порядок выполнения хуков

В полном жизненном цикле сессии хуки выполняются в следующем порядке:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Где `[PreToolUse → PostToolUse]` выполняется повторно при каждом использовании инструмента.

:::

**Правила совпадения хуков**

Каждый хук использует выражение `matcher` для определения необходимости выполнения. Claude Code использует выражения JavaScript, которые могут проверять:

- Тип инструмента: `tool == "Bash"`, `tool == "Edit"`
- Содержимое команды: `tool_input.command matches "npm run dev"`
- Путь к файлу: `tool_input.file_path matches "\\.ts$"`
- Составные условия: `tool == "Bash" && tool_input.command matches "git push"`

**Почему используются скрипты Node.js**

Все хуки Everything Claude Code реализованы с помощью скриптов Node.js, а не скриптов Shell. Причины:

| Преимущество | Shell скрипты | Скрипты Node.js |
|--- | --- | ---|
| **Кроссплатформенность** | ❌ Требуются ветки для Windows/macOS/Linux | ✅ Автоматическая кроссплатформенность |
| **Обработка JSON** | ❌ Требуются дополнительные инструменты (jq) | ✅ Встроенная поддержка |
| **Операции с файлами** | ⚠️ Сложные команды | ✅ Простой fs API |
| **Обработка ошибок** | ❌ Требуется ручная реализация | ✅ Встроенная поддержка try/catch |

## Следуйте за мной

### Шаг 1: Просмотр текущей конфигурации хуков

**Зачем**
Понять существующую конфигурацию хуков, знать, какие функции автоматизации уже включены

```bash
## Просмотр конфигурации hooks.json
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**Вы должны увидеть**: Файл конфигурации JSON, содержащий определения 6 типов хуков

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Шаг 2: Понимание хуков PreToolUse

**Зачем**
PreToolUse — это наиболее часто используемый тип хуков, который может блокировать операции или предоставлять подсказки

Давайте посмотрим на 5 хуков PreToolUse в Everything Claude Code:

#### 1. Блокировка Dev Server вне tmux

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Функция**: Блокирует запуск dev server вне tmux

**Зачем нужно**: Запуск dev server в tmux позволяет отделить сессию, можно продолжать просмотр логов даже после закрытия Claude Code

#### 2. Напоминание перед Git Push

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Функция**: Напоминание проверить изменения перед `git push`

**Зачем нужно**: Избежать случайной отправки непроверенного кода

#### 3. Блокировка случайных MD-файлов

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Функция**: Блокирует создание файлов .md, не относящихся к документации

**Зачем нужно**: Избежать разброса документации, поддерживать чистоту проекта

#### 4. Предложение сжатия

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Функция**: Предлагает сжать контекст при редактировании или записи файлов

**Зачем нужно**: В подходящий момент вручную сжимать контекст, поддерживая его компактность

### Шаг 3: Понимание хуков PostToolUse

**Зачем**
PostToolUse выполняется автоматически после завершения операции, подходит для автоматической проверки качества

Everything Claude Code имеет 4 хука PostToolUse:

#### 1. Автоформатирование

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Функция**: После редактирования файлов .js/.ts/.jsx/.tsx автоматически запускает Prettier для форматирования

**Зачем нужно**: Поддерживать единый стиль кода

#### 2. Проверка TypeScript

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Функция**: После редактирования файлов .ts/.tsx автоматически запускает проверку типов TypeScript

**Зачем нужно**: Раннее обнаружение ошибок типов

#### 3. Предупреждение о console.log

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Функция**: После редактирования файла проверяет наличие операторов console.log

**Зачем нужно**: Избежать отправки отладочного кода

#### 4. Логирование URL PR

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Функция**: После создания PR автоматически выводит URL PR и команду проверки

**Зачем нужно**: Быстрый доступ к вновь созданному PR

### Шаг 4: Понимание хуков жизненного цикла сессии

**Зачем**
Хуки SessionStart и SessionEnd используются для сохранения контекста между сессиями

#### Хук SessionStart

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Функции**:
- Проверка файлов сессии за последние 7 дней
- Проверка изученных skills
- Обнаружение пакетного менеджера
- Вывод информации о загружаемом контексте

**Логика скрипта** (`session-start.js`):

```javascript
// Проверка файлов сессии за последние 7 дней
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Проверка изученных skills
const learnedSkills = findFiles(learnedDir, '*.md');

// Обнаружение пакетного менеджера
const pm = getPackageManager();

// Если используется значение по умолчанию, предложить выбор
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### Хук SessionEnd

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Функции**:
- Создание или обновление файла сессии
- Запись времени начала и окончания сессии
- Генерация шаблона сессии (Completed, In Progress, Notes)

**Шаблон файла сессии** (`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

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
[relevant files]
```

`[Session context goes here]` и `[relevant files]` в шаблоне являются заполнителями, вам нужно вручную заполнить фактическое содержимое сессии и соответствующие файлы.

### Шаг 5: Понимание хуков, связанных со сжатием

**Зачем**
Хуки PreCompact и Stop используются для управления контекстом и принятия решений о сжатии

#### Хук PreCompact

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Функции**:
- Запись событий сжатия в лог
- Отметка времени сжатия в активном файле сессии

**Логика скрипта** (`pre-compact.js`):

```javascript
// Запись события сжатия
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// Отметка в файле сессии
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Хук Stop

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Функция**: Проверка наличия console.log во всех изменённых файлах

**Зачем нужно**: Как последняя линия защиты, избежать отправки отладочного кода

### Шаг 6: Понимание хука непрерывного обучения

**Зачем**
Хук Evaluate Session используется для извлечения повторно используемых паттернов из сессий

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Функции**:
- Чтение записи сессии (transcript)
- Подсчёт количества пользовательских сообщений
- Если длина сессии достаточна (по умолчанию > 10 сообщений), предложить оценить извлекаемые паттерны

**Логика скрипта** (`evaluate-session.js`):

```javascript
// Чтение конфигурации
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Подсчёт пользовательских сообщений
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Пропуск коротких сессий
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Предложение оценки
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Шаг 7: Настройка собственных хуков

**Зачем**
Создавайте собственные правила автоматизации в соответствии с потребностями проекта

**Пример: блокировка опасных команд в производственной среде**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Шаги настройки**:

1. Создание собственного скрипта хука:
   ```bash
   # Создание scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. Редактирование `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Перезапуск Claude Code

**Вы должны увидеть**: Информацию вывода при запуске хука

## Контрольная точка ✅

Убедитесь, что вы понимаете следующие моменты:

- [ ] Хуки — это механизм автоматизации на основе событий
- [ ] Claude Code имеет 6 типов хуков
- [ ] PreToolUse запускается перед выполнением инструмента, может блокировать операции
- [ ] PostToolUse запускается после выполнения инструмента, подходит для автоматической проверки
- [ ] SessionStart/SessionEnd используются для сохранения контекста между сессиями
- [ ] Everything Claude Code использует скрипты Node.js для обеспечения кроссплатформенной совместимости
- [ ] Можно настраивать собственные хуки путём изменения `~/.claude/settings.json`

## Остерегайтесь ошибок

### ❌ Ошибки в скриптах хуков приводят к зависанию сессии

**Проблема**: После исключения в скрипте хука он не завершается корректно, что приводит к тайм-ауту ожидания Claude Code

**Причина**: Ошибки в скриптах Node.js не обрабатываются корректно

**Решение**:
```javascript
// Неверный пример
main();  // Если выбрасывает исключение, приведёт к проблеме

// Правильный пример
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Даже при ошибке нормальный выход
});
```

### ❌ Использование Shell-скриптов вызывает проблемы кроссплатформенности

**Проблема**: При работе на Windows Shell-скрипты не выполняются

**Причина**: Shell-команды несовместимы на разных операционных системах

**Решение**: Использовать скрипты Node.js вместо Shell-скриптов

| Функция | Shell-скрипты | Скрипты Node.js |
|--- | --- | ---|
| Чтение файла | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Проверка каталога | `[ -d dir ]` | `fs.existsSync(dir)` |
| Переменные окружения | `$VAR` | `process.env.VAR` |

### ❌ Чрезмерный вывод хуков приводит к расширению контекста

**Проблема**: Каждая операция выводит большой объём отладочной информации, что приводит к быстрому расширению контекста

**Причина**: Скрипты хуков используют слишком много console.log

**Решение**:
- Выводить только необходимую информацию
- Использовать `console.error` для вывода важных подсказок (будет выделено Claude Code)
- Использовать условный вывод, печатать только при необходимости

```javascript
// Неверный пример
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Слишком много вывода

// Правильный пример
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook блокирует необходимые операции

**Проблема**: Правило совпадения хука слишком широкое, неверно блокирует нормальные операции

**Причина**: Выражение matcher не точно совпадает со сценарием

**Решение**:
- Проверить точность выражения matcher
- Добавить больше условий для ограничения области запуска
- Предоставить чёткую информацию об ошибке и предложение решения

```json
// Неверный пример: совпадает со всеми npm командами
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Правильный пример: совпадает только с командой dev
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Итоги урока

**Сводка 6 типов хуков**:

| Тип хука | Момент запуска | Типичное использование | Количество в Everything Claude Code |
|--- | --- | --- | ---|
| PreToolUse | Перед выполнением инструмента | Проверка, блокировка, подсказки | 5 |
| PostToolUse | После выполнения инструмента | Форматирование, проверка, запись | 4 |
| PreCompact | Перед сжатием контекста | Сохранение состояния | 1 |
| SessionStart | Начало новой сессии | Загрузка контекста, обнаружение PM | 1 |
| SessionEnd | Окончание сессии | Сохранение состояния, оценка сессии | 2 |
| Stop | Окончание ответа | Проверка изменений | 1 |

**Ключевые моменты**:

1. **Хуки на основе событий**: Автоматическое выполнение при определённых событиях
2. **Matcher определяет запуск**: Используйте выражения JavaScript для совпадения условий
3. **Реализация скриптов Node.js**: Кроссплатформенная совместимость, избегайте Shell-скриптов
4. **Важна обработка ошибок**: Даже при ошибке скрипт должен нормально завершаться
5. **Вывод должен быть лаконичным**: Избегайте слишком большого количества логов, чтобы предотвратить расширение контекста
6. **Конфигурация в settings.json**: Добавляйте собственные хуки путём изменения `~/.claude/settings.json`

**Лучшие практики**:

```
1. Используйте PreToolUse для проверки опасных операций
2. Используйте PostToolUse для автоматической проверки качества
3. Используйте SessionStart/End для сохранения контекста
4. При настройке собственных хуков сначала протестируйте выражение matcher
5. Используйте try/catch и process.exit(0) в скриптах
6. Выводите только необходимую информацию, избегайте расширения контекста
```

## Предпросмотр следующего урока

> В следующем уроке мы изучим **[Механизм непрерывного обучения](../continuous-learning/)**.
>
> Вы узнаете:
> - Как Continuous Learning автоматически извлекает повторно используемые паттерны
> - Использование команды `/learn` для ручного извлечения паттернов
> - Настройка минимальной длины оценки сессии
> - Управление каталогом learned skills

---

## Приложение: ссылка на исходный код

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-25

| Функция | Путь к файлу | Номер строки |
|--- | --- | ---|
| Главная конфигурация хуков | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Скрипт SessionStart | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| Скрипт SessionEnd | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| Скрипт PreCompact | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Скрипт Suggest Compact | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Скрипт Evaluate Session | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Библиотека инструментов | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Обнаружение пакетного менеджера | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Ключевые константы**:
- Нет (конфигурация загружается динамически)

**Ключевые функции**:
- `getSessionsDir()`: получение пути к каталогу сессий
- `getLearnedSkillsDir()`: получение пути к каталогу learned skills
- `findFiles(dir, pattern, options)`: поиск файлов, поддерживает фильтрацию по времени
- `ensureDir(path)`: обеспечение существования каталога, создаёт при отсутствии
- `getPackageManager()`: обнаружение пакетного менеджера (поддерживает 6 приоритетов)
- `log(message)`: вывод информации лога хука

**Ключевые конфигурации**:
- `min_session_length`: минимальное количество сообщений для оценки сессии (по умолчанию 10)
- `COMPACT_THRESHOLD`: порог количества вызовов инструментов для предложения сжатия (по умолчанию 50)
- `CLAUDE_PLUGIN_ROOT`: переменная окружения корневого каталога плагина

**14 основных хуков**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
