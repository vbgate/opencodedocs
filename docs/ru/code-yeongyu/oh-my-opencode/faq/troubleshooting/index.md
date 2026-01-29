---
title: "Диагностика и устранение неполадок: Команда Doctor | oh-my-opencode"
subtitle: "Использование команды Doctor для диагностики конфигурации"
sidebarTitle: "Устранение неполадок"
description: "Изучите методы диагностики команды doctor в oh-my-opencode. Запустите 17+ проверок работоспособности, включая версию, плагины, аутентификацию и модели, для быстрого решения проблем."
tags:
  - "устранение неполадок"
  - "диагностика"
  - "конфигурация"
prerequisite:
  - "start-installation"
order: 150
---

# Диагностика конфигурации и устранение неполадок: Использование команды Doctor для быстрого решения проблем

## Чему вы научитесь

- Запускать `oh-my-opencode doctor` для быстрой диагностики 17+ проверок работоспособности
- Находить и исправлять проблемы, такие как устаревшая версия OpenCode, незарегистрированные плагины, проблемы с конфигурацией Provider
- Понимать механизм разрешения моделей и проверять назначения моделей для агентов и категорий
- Использовать режим verbose для получения полной информации для диагностики проблем

## Ваша текущая задача

После установки oh-my-opencode, что делать, если вы столкнулись с:

- OpenCode сообщает, что плагин не загружен, но файл конфигурации выглядит нормально
- Некоторые AI агенты всегда выдают ошибку "Model not found"
- Хотите убедиться, что все Providers (Claude, OpenAI, Gemini) настроены правильно
- Не уверены, проблема в установке, конфигурации или аутентификации

Устранение неполадок по одному занимает много времени. Вам нужен **инструмент для диагностики в один клик**.

## Основные концепции

**Команда Doctor — это система проверки работоспособности oh-my-opencode**, аналогичная утилите Disk Utility в Mac или диагностическому сканеру автомобиля. Она систематически проверяет вашу среду и сообщает, что работает, а что имеет проблемы.

Логика проверки Doctor полностью основана на реализации исходного кода (`src/cli/doctor/checks/`), включая:
- ✅ **установка**: версия OpenCode, регистрация плагинов
- ✅ **конфигурация**: формат файла конфигурации, валидация Schema
- ✅ **аутентификация**: плагины аутентификации Anthropic, OpenAI, Google
- ✅ **зависимости**: зависимости Bun, Node.js, Git
- ✅ **инструменты**: статус серверов LSP и MCP
- ✅ **обновления**: проверка обновлений версии

## Следуйте инструкциям

### Шаг 1: Запуск базовой диагностики

**Зачем**
Сначала запустите полную проверку, чтобы понять общее состояние работоспособности.

```bash
bunx oh-my-opencode doctor
```

**Вы должны увидеть**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Контрольная точка ✅**:
- [ ] Видите результаты для 6 категорий
- [ ] Каждый элемент имеет маркер ✓ (прошел), ⚠ (предупреждение), ✗ (ошибка)
- [ ] Статистика внизу

### Шаг 2: Интерпретация распространенных проблем

На основе результатов диагностики вы можете быстро найти проблемы. Вот распространенные ошибки и решения:

#### ✗ "OpenCode version too old"

**Проблема**: Версия OpenCode ниже 1.0.150 (минимальное требование)

**Причина**: oh-my-opencode зависит от новых функций OpenCode, которые старые версии не поддерживают

**Решение**:

```bash
# Обновить OpenCode
npm install -g opencode@latest
# Или использовать Bun
bun install -g opencode@latest
```

**Проверка**: Повторно запустите `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**Проблема**: Плагин не зарегистрирован в массиве `plugin` в `opencode.json`

**Причина**: Процесс установки был прерван или файл конфигурации был отредактирован вручную

**Решение**:

```bash
# Повторно запустить установщик
bunx oh-my-opencode install
```

**Основание исходного кода** (`src/cli/doctor/checks/plugin.ts:79-117`):
- Проверяет, находится ли плагин в массиве `plugin` в `opencode.json`
- Поддерживает форматы: `oh-my-opencode` или `oh-my-opencode@version` или путь `file://`

#### ✗ "Configuration has validation errors"

**Проблема**: Файл конфигурации не соответствует определению Schema

**Причина**: Ошибки, возникшие при ручном редактировании (например, опечатки, несоответствие типов)

**Решение**:

1. Используйте `--verbose` для просмотра подробной информации об ошибке:

```bash
bunx oh-my-opencode doctor --verbose
```

2. Распространенные типы ошибок (из `src/config/schema.ts`):

| Сообщение об ошибке | Причина | Исправление |
|--- | --- | ---|
| `agents.sisyphus.mode: Invalid enum value` | `mode` может быть только `subagent`/`primary`/`all` | Измените на `primary` |
| `categories.quick.model: Expected string` | `model` должен быть строкой | Добавьте кавычки: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | Concurrency должен быть числом | Измените на число: `3` |

3. Обратитесь к [Справочнику по конфигурации](../../appendix/configuration-reference/) для проверки определений полей

#### ⚠ "Auth plugin not installed"

**Проблема**: Плагин аутентификации для Provider не установлен

**Причина**: Этот Provider был пропущен при установке или плагин был удален вручную

**Решение**:

```bash
# Переустановить и выбрать отсутствующий Provider
bunx oh-my-opencode install
```

**Основание исходного кода** (`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Шаг 3: Проверка разрешения моделей

Разрешение моделей — это основной механизм oh-my-opencode, проверяющий, правильно ли назначены модели для агентов и категорий.

```bash
bunx oh-my-opencode doctor --category configuration
```

**Вы должны увидеть**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Контрольная точка ✅**:
- [ ] Видите назначения моделей для агентов и категорий
- [ ] `○` означает использование механизма отката Provider (не переопределено вручную)
- [ ] `●` означает, что пользователь переопределил модель по умолчанию в конфигурации

**Распространенные проблемы**:

| Проблема | Причина | Решение |
|--- | --- | ---|
| Модель `unknown` | Цепочка отката Provider пуста | Убедитесь, что доступен хотя бы один Provider |
| Модель не используется | Provider не подключен | Запустите `opencode` для подключения Provider |
| Хотите переопределить модель | Используется модель по умолчанию | Установите `agents.<name>.model` в `oh-my-opencode.json` |

**Основание исходного кода** (`src/cli/doctor/checks/model-resolution.ts:129-148`):
- Читает доступные модели из `~/.cache/opencode/models.json`
- Требования к моделям агентов: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Требования к моделям категорий: `CATEGORY_MODEL_REQUIREMENTS`

### Шаг 4: Использование вывода JSON (сценарии)

Если вы хотите автоматизировать диагностику в CI/CD, используйте формат JSON:

```bash
bunx oh-my-opencode doctor --json
```

**Вы должны увидеть**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Сценарии использования**:

```bash
# Сохранить отчет диагностики в файл
bunx oh-my-opencode doctor --json > doctor-report.json

# Проверить состояние работоспособности в CI/CD
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## Распространенные ошибки

### Ошибка 1: Игнорирование предупреждений

**Проблема**: Видите маркеры `⚠` и думаете, что они "необязательны", хотя на самом деле это могут быть важные подсказки

**Решение**:
- Например: предупреждение "using default model" означает, что вы не настроили модели категорий, что может быть неоптимальным
- Используйте `--verbose` для просмотра подробной информации и решения, нужно ли действовать

### Ошибка 2: Ручное редактирование opencode.json

**Проблема**: Прямое изменение `opencode.json` OpenCode, что нарушает регистрацию плагинов

**Решение**:
- Используйте `bunx oh-my-opencode install` для повторной регистрации
- Или редактируйте только `oh-my-opencode.json`, не трогайте файл конфигурации OpenCode

### Ошибка 3: Кэш не обновлен

**Проблема**: Разрешение моделей показывает "cache not found", но Provider настроен

**Решение**:

```bash
# Запустить OpenCode для обновления кэша моделей
opencode

# Или вручную обновить (если существует команда opencode models)
opencode models --refresh
```

## Итог

Команда Doctor — это швейцарский армейский нож oh-my-opencode, помогающий быстро находить проблемы:

| Команда | Назначение | Когда использовать |
|--- | --- | ---|
| `bunx oh-my-opencode doctor` | Полная диагностика | После начальной установки, при возникновении проблем |
| `--verbose` | Подробная информация | Нужно просмотреть детали ошибок |
| `--json` | Вывод JSON | CI/CD, автоматизация сценариев |
| `--category <name>` | Проверка одной категории | Нужно проверить только конкретный аспект |

**Помните**: Всякий раз, когда вы сталкиваетесь с проблемой, сначала запустите `doctor`, четко поймите ошибку, прежде чем действовать.

## Что дальше

> В следующем уроке мы изучим **[Часто задаваемые вопросы](../faq/)**.
>
> Вы узнаете:
> - Различия между oh-my-opencode и другими AI инструментами
> - Как оптимизировать расходы на использование моделей
> - Лучшие практики для управления параллелизмом фоновых задач

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть расположения исходного кода</strong></summary>

> Обновлено: 2026-01-26

| Функция | Путь к файлу | Номера строк |
|--- | --- | ---|
| Точка входа команды Doctor | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| Регистрация всех проверок | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Проверка регистрации плагина | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Проверка валидации конфигурации | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Проверка аутентификации | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Проверка разрешения моделей | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Schema конфигурации | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Определение требований к моделям | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Весь файл |

**Ключевые константы**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: Минимальное требование к версии OpenCode
- `AUTH_PLUGINS`: Сопоставление плагинов аутентификации (Anthropic=built-in, OpenAI/GitHub=plugins)
- `AGENT_MODEL_REQUIREMENTS`: Требования к моделям агентов (цепочка приоритетов каждого агента)
- `CATEGORY_MODEL_REQUIREMENTS`: Требования к моделям категорий (visual, quick и т.д.)

**Ключевые функции**:
- `doctor(options)`: Запуск команды диагностики, возвращает код выхода
- `getAllCheckDefinitions()`: Получить определения всех 17+ проверок
- `checkPluginRegistration()`: Проверить, зарегистрирован ли плагин в opencode.json
- `validateConfig(configPath)`: Проверить, соответствует ли файл конфигурации Schema
- `checkAuthProvider(providerId)`: Проверить статус плагина аутентификации Provider
- `checkModelResolution()`: Проверить разрешение и назначение моделей

</details>
