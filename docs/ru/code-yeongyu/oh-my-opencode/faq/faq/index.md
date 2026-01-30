---
title: "Часто задаваемые вопросы: режим ultrawork | oh-my-opencode"
subtitle: "Ответы на часто задаваемые вопросы"
sidebarTitle: "Что делать при проблемах"
description: "Ответы на часто задаваемые вопросы по oh-my-opencode. Включает режим ultrawork, многоагентное взаимодействие, фоновые задачи, Ralph Loop и устранение неполадок конфигурации."
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# Часто задаваемые вопросы

## Чему вы научитесь

Прочитав этот FAQ, вы сможете:

- Быстро находить решения проблем с установкой и настройкой
- Понимать, как правильно использовать режим ultrawork
- Освоить лучшие практики вызова агентов
- Понимать границы и ограничения совместимости с Claude Code
- Избегать распространённых ошибок безопасности и производительности

---

## Установка и настройка

### Как установить oh-my-opencode?

**Самый простой способ**: попросите AI-агента установить за вас.

Отправьте следующий промпт вашему LLM-агенту (Claude Code, AmpCode, Cursor и др.):

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Ручная установка**: см. [Руководство по установке](../start/installation/).

::: tip Почему рекомендуется установка через AI-агента?
Люди часто допускают ошибки при настройке формата JSONC (забывают кавычки, неправильно ставят двоеточия). AI-агент поможет избежать типичных синтаксических ошибок.
:::

### Как удалить oh-my-opencode?

Удаление выполняется в три шага:

**Шаг 1**: Удалите плагин из конфигурации OpenCode

Отредактируйте `~/.config/opencode/opencode.json` (или `opencode.jsonc`), удалив `"oh-my-opencode"` из массива `plugin`.

```bash
# Автоматическое удаление с помощью jq
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Шаг 2**: Удалите файлы конфигурации (опционально)

```bash
# Удаление пользовательской конфигурации
rm -f ~/.config/opencode/oh-my-opencode.json

# Удаление конфигурации проекта (если существует)
rm -f .opencode/oh-my-opencode.json
```

**Шаг 3**: Проверьте удаление

```bash
opencode --version
# Плагин больше не должен загружаться
```

### Где находятся файлы конфигурации?

Файлы конфигурации имеют два уровня:

| Уровень | Расположение | Назначение | Приоритет |
| --- | --- | --- | --- |
| Проект | `.opencode/oh-my-opencode.json` | Настройки проекта | Низкий |
| Пользователь | `~/.config/opencode/oh-my-opencode.json` | Глобальные настройки | Высокий |

**Правило слияния**: Пользовательская конфигурация переопределяет конфигурацию проекта.

Файлы конфигурации поддерживают формат JSONC (JSON with Comments), можно добавлять комментарии и завершающие запятые:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // Это комментарий
  "disabled_agents": [], // Можно использовать завершающую запятую
  "agents": {}
}
```

### Как отключить определённую функцию?

Используйте массивы `disabled_*` в файле конфигурации:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Переключатели совместимости с Claude Code**:

```json
{
  "claude_code": {
    "mcp": false,        // Отключить MCP Claude Code
    "commands": false,    // Отключить Commands Claude Code
    "skills": false,      // Отключить Skills Claude Code
    "hooks": false        // Отключить hooks из settings.json
  }
}
```

---

## Использование

### Что такое ultrawork?

**ultrawork** (или сокращённо `ulw`) — это магическое слово. Включите его в промпт, и все функции активируются автоматически:

- ✅ Параллельные фоновые задачи
- ✅ Все специализированные агенты (Sisyphus, Oracle, Librarian, Explore, Prometheus и др.)
- ✅ Режим глубокого исследования
- ✅ Механизм принудительного завершения Todo

**Пример использования**:

```
ultrawork разработать REST API с JWT-аутентификацией и управлением пользователями
```

Или короче:

```
ulw рефакторинг этого модуля
```

::: info Принцип работы
Hook `keyword-detector` обнаруживает ключевые слова `ultrawork` или `ulw`, затем устанавливает `message.variant` в специальное значение, активируя все расширенные функции.
:::

### Как вызвать конкретного агента?

**Способ 1: Использование символа @**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Способ 2: Использование инструмента delegate_task**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Ограничения прав агентов**:

| Агент | Запись кода | Выполнение Bash | Делегирование задач | Описание |
| --- | --- | --- | --- | --- |
| Sisyphus | ✅ | ✅ | ✅ | Главный оркестратор |
| Oracle | ❌ | ❌ | ❌ | Консультант (только чтение) |
| Librarian | ❌ | ❌ | ❌ | Исследователь (только чтение) |
| Explore | ❌ | ❌ | ❌ | Поиск (только чтение) |
| Multimodal Looker | ❌ | ❌ | ❌ | Анализ медиа (только чтение) |
| Prometheus | ✅ | ✅ | ✅ | Планировщик |

### Как работают фоновые задачи?

Фоновые задачи позволяют нескольким AI-агентам работать параллельно, как настоящая команда разработчиков:

**Запуск фоновой задачи**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Продолжайте работу...**

**Система автоматически уведомит о завершении** (через Hook `background-notification`)

**Получение результата**:

```
background_output(task_id="bg_abc123")
```

**Управление параллелизмом**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Приоритет**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip Зачем нужно управление параллелизмом?
Чтобы избежать ограничения скорости API и неконтролируемых расходов. Например, Claude Opus 4.5 дорогой — ограничьте его параллелизм; Haiku дешёвый — можно запускать больше параллельных задач.
:::

### Как использовать Ralph Loop?

**Ralph Loop** — это самореферентный цикл разработки, который продолжает работу до завершения задачи.

**Запуск**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**Как определяется завершение**: Агент выводит маркер `<promise>DONE</promise>`.

**Отмена цикла**:

```
/cancel-ralph
```

**Конфигурация**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Отличие от ultrawork
`/ralph-loop` — обычный режим, `/ulw-loop` — режим ultrawork (все расширенные функции активированы).
:::

### Что такое Categories и Skills?

**Categories** (новое в v3.0): Уровень абстракции моделей, автоматически выбирающий оптимальную модель в зависимости от типа задачи.

**Встроенные Categories**:

| Category | Модель по умолчанию | Temperature | Применение |
| --- | --- | --- | --- |
| visual-engineering | google/gemini-3-pro | 0.7 | Фронтенд, UI/UX, дизайн |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | Задачи с высоким IQ |
| artistry | google/gemini-3-pro | 0.7 | Творческие и художественные задачи |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Быстрые, недорогие задачи |
| writing | google/gemini-3-flash | 0.1 | Документация и написание текстов |

**Skills**: Модули специализированных знаний, внедряющие лучшие практики конкретной области.

**Встроенные Skills**:

| Skill | Условие активации | Описание |
| --- | --- | --- |
| playwright | Задачи с браузером | Автоматизация браузера через Playwright MCP |
| frontend-ui-ux | Задачи UI/UX | От дизайнера к разработчику, создание красивых интерфейсов |
| git-master | Операции Git (commit, rebase, squash) | Эксперт по Git, атомарные коммиты, поиск по истории |

**Пример использования**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="Разработать UI этой страницы")
delegate_task(category="quick", skills=["git-master"], prompt="Закоммитить эти изменения")
```

::: info Преимущества
Categories оптимизируют затраты (используют дешёвые модели), Skills обеспечивают качество (внедряют экспертные знания).
:::

---

## Совместимость с Claude Code

### Можно ли использовать конфигурацию Claude Code?

**Да**, oh-my-opencode обеспечивает **полный уровень совместимости**:

**Поддерживаемые типы конфигурации**:

| Тип | Расположение | Приоритет |
| --- | --- | --- |
| Commands | `~/.claude/commands/`, `.claude/commands/` | Низкий |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Средний |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | Высокий |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | Высокий |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | Высокий |

**Приоритет загрузки конфигурации**:

Конфигурация проекта OpenCode > Пользовательская конфигурация Claude Code

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Отключить конкретный плагин
    }
  }
}
```

### Можно ли использовать подписку Claude Code?

**Технически возможно, но не рекомендуется**.

::: warning Ограничения доступа Claude OAuth
По состоянию на январь 2026 года Anthropic ограничила сторонний доступ OAuth, ссылаясь на нарушение ToS.
:::

**Официальное заявление** (из README):

> Действительно существуют некоторые инструменты сообщества, подделывающие подписи OAuth-запросов Claude Code. Эти инструменты могут быть технически необнаруживаемыми, но пользователи должны понимать последствия для ToS, и я лично не рекомендую их использовать.
>
> **Этот проект не несёт ответственности за любые проблемы, возникающие при использовании неофициальных инструментов, мы не реализовывали эти OAuth-системы самостоятельно.**

**Рекомендуемое решение**: Используйте имеющуюся подписку AI-провайдера (Claude, OpenAI, Gemini и др.).

### Совместимы ли данные?

**Да**, формат хранения данных совместим:

| Данные | Расположение | Формат | Совместимость |
| --- | --- | --- | --- |
| Todos | `~/.claude/todos/` | JSON | ✅ Совместимо с Claude Code |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Совместимо с Claude Code |

Вы можете беспрепятственно переключаться между Claude Code и oh-my-opencode.

---

## Безопасность и производительность

### Есть ли предупреждения о безопасности?

**Да**, в верхней части README есть чёткое предупреждение:

::: danger Предупреждение: Поддельные сайты
**ohmyopencode.com не связан с этим проектом.** Мы не управляем этим сайтом и не поддерживаем его.
>
> OhMyOpenCode — **бесплатный и открытый**. Не скачивайте установщики и не вводите платёжную информацию на сторонних сайтах, заявляющих о своей «официальности».
>
> Поскольку поддельный сайт находится за платным доступом, мы **не можем проверить распространяемый контент**. Считайте любые загрузки оттуда **потенциально небезопасными**.
>
> ✅ Официальная загрузка: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### Как оптимизировать производительность?

**Стратегия 1: Используйте подходящую модель**

- Быстрые задачи → используйте категорию `quick` (модель Haiku)
- UI-дизайн → используйте категорию `visual` (Gemini 3 Pro)
- Сложные рассуждения → используйте категорию `ultrabrain` (GPT 5.2)

**Стратегия 2: Включите управление параллелизмом**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Ограничить параллелизм Anthropic
      "openai": 5       // Увеличить параллелизм OpenAI
    }
  }
}
```

**Стратегия 3: Используйте фоновые задачи**

Пусть лёгкие модели (например, Haiku) собирают информацию в фоне, а главный агент (Opus) сосредоточится на основной логике.

**Стратегия 4: Отключите ненужные функции**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Отключить hooks Claude Code (если не используются)
  }
}
```

### Требования к версии OpenCode?

**Рекомендуется**: OpenCode >= 1.0.132

::: warning Баг в старых версиях
Если вы используете версию 1.0.132 или старше, баг в OpenCode может повредить конфигурацию.
>
> Исправление было добавлено после 1.0.132 — используйте более новую версию.
:::

Проверка версии:

```bash
opencode --version
```

---

## Устранение неполадок

### Агент не работает?

**Чек-лист**:

1. ✅ Проверьте правильность формата файла конфигурации (синтаксис JSONC)
2. ✅ Проверьте настройки провайдера (действителен ли API Key)
3. ✅ Запустите диагностику: `oh-my-opencode doctor --verbose`
4. ✅ Проверьте логи OpenCode на наличие ошибок

**Распространённые проблемы**:

| Проблема | Причина | Решение |
| --- | --- | --- |
| Агент отклоняет задачу | Неправильная настройка прав | Проверьте конфигурацию `agents.permission` |
| Таймаут фоновой задачи | Слишком строгий лимит параллелизма | Увеличьте `providerConcurrency` |
| Ошибка блока размышлений | Модель не поддерживает thinking | Переключитесь на модель с поддержкой thinking |

### Конфигурация не применяется?

**Возможные причины**:

1. Синтаксическая ошибка JSON (забыты кавычки, запятые)
2. Неправильное расположение файла конфигурации
3. Пользовательская конфигурация не переопределяет конфигурацию проекта

**Шаги проверки**:

```bash
# Проверьте существование файлов конфигурации
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# Проверьте синтаксис JSON
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**Используйте JSON Schema для валидации**:

Добавьте поле `$schema` в начало файла конфигурации, и редактор автоматически покажет ошибки:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### Фоновая задача не завершается?

**Чек-лист**:

1. ✅ Проверьте статус задачи: `background_output(task_id="...")`
2. ✅ Проверьте лимит параллелизма: есть ли свободные слоты
3. ✅ Проверьте логи: нет ли ошибок ограничения скорости API

**Принудительная отмена задачи**:

```javascript
background_cancel(task_id="bg_abc123")
```

**TTL задачи**: Фоновые задачи автоматически очищаются через 30 минут.

---

## Дополнительные ресурсы

### Где получить помощь?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Сообщество Discord**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### Рекомендуемый порядок чтения

Если вы новичок, рекомендуем читать в следующем порядке:

1. [Быстрая установка и настройка](../start/installation/)
2. [Знакомство с Sisyphus: главный оркестратор](../start/sisyphus-orchestrator/)
3. [Режим Ultrawork](../start/ultrawork-mode/)
4. [Диагностика конфигурации и устранение неполадок](../troubleshooting/)

### Участие в разработке

Pull Request приветствуются! 99% кода проекта создано с помощью OpenCode.

Если вы хотите улучшить функцию или исправить баг:

1. Сделайте форк репозитория
2. Создайте ветку для функции
3. Внесите изменения
4. Отправьте в ветку
5. Создайте Pull Request

---

## Итоги урока

Этот FAQ охватывает часто задаваемые вопросы по oh-my-opencode:

- **Установка и настройка**: как установить, удалить, расположение файлов конфигурации, отключение функций
- **Советы по использованию**: режим ultrawork, вызов агентов, фоновые задачи, Ralph Loop, Categories и Skills
- **Совместимость с Claude Code**: загрузка конфигурации, ограничения подписки, совместимость данных
- **Безопасность и производительность**: предупреждения безопасности, стратегии оптимизации, требования к версии
- **Устранение неполадок**: распространённые проблемы и решения

Запомните ключевые моменты:

- Используйте ключевые слова `ultrawork` или `ulw` для активации всех функций
- Пусть лёгкие модели собирают информацию в фоне, а главный агент сосредоточится на основной логике
- Файлы конфигурации поддерживают формат JSONC, можно добавлять комментарии
- Конфигурация Claude Code загружается без проблем, но доступ OAuth ограничен
- Скачивайте только с официального репозитория GitHub, остерегайтесь поддельных сайтов

## Анонс следующего урока

> Если у вас возникли конкретные проблемы с конфигурацией, см. **[Диагностика конфигурации и устранение неполадок](../troubleshooting/)**.
>
> Вы узнаете:
> - Как использовать диагностические инструменты для проверки конфигурации
> - Значение распространённых кодов ошибок и способы их устранения
> - Методы диагностики проблем с настройкой провайдера
> - Советы по выявлению и оптимизации проблем производительности

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы увидеть расположение исходного кода</strong></summary>

> Дата обновления: 2026-01-26

| Функция | Путь к файлу | Строки |
| --- | --- | --- |
| Keyword Detector (обнаружение ultrawork) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Весь каталог |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Весь файл |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Весь файл |
| Delegate Task (парсинг Category & Skill) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Весь файл |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Весь каталог |

**Ключевые константы**:
- `DEFAULT_MAX_ITERATIONS = 100`: Максимальное количество итераций Ralph Loop по умолчанию
- `TASK_TTL_MS = 30 * 60 * 1000`: TTL фоновой задачи (30 минут)
- `POLL_INTERVAL_MS = 2000`: Интервал опроса фоновых задач (2 секунды)

**Ключевые настройки**:
- `disabled_agents`: Список отключённых агентов
- `disabled_skills`: Список отключённых навыков
- `disabled_hooks`: Список отключённых хуков
- `claude_code`: Настройки совместимости с Claude Code
- `background_task`: Настройки параллелизма фоновых задач
- `categories`: Пользовательские настройки Category
- `agents`: Переопределение настроек агентов

</details>
