---
title: "Архитектура: Технические принцип | Agent Skills"
sidebarTitle: "Архитектура"
subtitle: "Архитектура: Технические принцип"
description: "Изучите техническую архитектуру Agent Skills, включая процесс сборки, парсер правил и механизм развертывания. Разберитесь в типовой системе и алгоритме обнаружения фреймворков."
tags:
  - "Архитектура"
  - "Процесс сборки"
  - "Парсинг правил"
  - "Типовая система"
prerequisite:
  - "start-getting-started"
---

# Архитектура и детали реализации

## Чему вы научитесь

- Понимать принципы работы цепочки инструментов сборки Agent Skills
- Освоить основную логику парсинга файлов правил
- Понимать типовую систему и дизайн потока данных
- Изучить детали реализации алгоритма обнаружения фреймворков

## Обзор основной архитектуры

Agent Skills состоит из трех основных частей:

**1. Цепочка инструментов сборки** (`packages/react-best-practices-build/`)
- Парсинг файлов правил
- Генерация AGENTS.md
- Извлечение тестовых случаев

**2. Файлы правил** (`skills/react-best-practices/rules/`)
- 57 правил оптимизации производительности React
- Формат Markdown, соответствующий спецификации шаблона

**3. Скрипты развертывания** (`skills/claude.ai/vercel-deploy-claimable/`)
- Развертывание в Vercel одним кликом
- Автоматическое обнаружение фреймворка

::: info Почему нужно понимать архитектуру?
Если вы просто используете Agent Skills, возможно, вам не нужно深入了解 эти детали. Но если вы хотите:
- Разрабатывать пользовательские навыки
- Писать новые правила оптимизации производительности
- Устранять проблемы сборки или развертывания

Понимание архитектуры будет очень полезно.
:::

## Подробное описание процесса сборки

Процесс сборки компилирует разрозненные файлы правил в документ AGENTS.md, читаемый AI-агентом. Процесс разделен на пять этапов:

```mermaid
graph LR
    A[Парсинг файлов правил] --> B[Проверка полноты]
    B --> C[Группировка по section]
    C --> D[Сортировка по title]
    D --> E[Генерация документации]
```

### Этап 1: Парсинг файлов правил (parse)

Каждый файл правил (`.md`) парсится в объект `Rule` через функцию `parseRuleFile()`.

**Последовательность парсинга** (местоположение исходного кода: `parser.ts:18-238`):

1. **Извлечение Frontmatter** (если существует)
   - Парсинг метаданных в формате YAML
   - Поддерживаемые поля: `title`, `impact`, `tags`, `section`, `explanation`, `references`

2. **Извлечение заголовка**
   - Поиск первого заголовка `##` или `###`
   - Если Frontmatter не имеет title, используется содержимое здесь

3. **Извлечение Impact**
   - Сопоставление строк `**Impact:**`
   - Формат: `**Impact:** CRITICAL (2-10× improvement)`
   - Извлечение уровня и описания

4. **Извлечение примеров кода**
   - Поиск меток `**Label:**` (например, `**Incorrect:**`, `**Correct:**`)
   - Сбор последующих блоков кода
   - Захват дополнительных пояснений после блока кода

5. **Извечение литературы**
   - Поиск строк `Reference:` или `References:`
   - Парсинг Markdown-ссылок `[text](url)`

6. **Вывод Section**
   - Извлечение из префикса имени файла (местоположение исходного кода: `parser.ts:201-210`)
   - Таблица отображения:
     - `async-*` → Section 1 (устранение каскадной загрузки)
     - `bundle-*` → Section 2 (оптимизация сборки)
     - `server-*` → Section 3 (производительность сервера)
     - `client-*` → Section 4 (получение данных на клиенте)
     - `rerender-*` → Section 5 (оптимизация повторного рендеринга)
     - `rendering-*` → Section 6 (производительность рендеринга)
     - `js-*` → Section 7 (производительность JavaScript)
     - `advanced-*` → Section 8 (расширенные шаблоны)

### Этап 2: Проверка полноты (validate)

Логика проверки реализована в `validate.ts`, обеспечивающая соответствие файлов правил спецификации.

**Проверяемые элементы**:

| Проверяемый элемент        | Описание                                                   | Вывод при неудаче |
| -------------------------- | ---------------------------------------------------------- | ------------------ |
| Title не пустой             | Должен быть заголовок (Frontmatter или заголовок `##`)              | `Missing or empty title` |
| Хотя бы один пример         | Массив `examples` не пуст                                       | `At least one code example required` |
| Impact легален            | Должен быть допустимым перечислимым значением `ImpactLevel`                    | `Invalid impact level` |
| Code не пуст                 | Каждый пример должен иметь содержимое кода                              | `Empty code block` |

### Этап 3: Группировка по Section (group)

Все правила группируются по section, каждый section включает:

- `number`: номер главы (1-8)
- `title`: заголовок главы (читается из `_sections.md`)
- `impact`: общий уровень влияния
- `introduction`: введение главы (необязательно)
- `rules[]`: массив включенных правил

(местоположение исходного кода: `build.ts:156-169`)

### Этап 4: Сортировка по Title (sort)

Правила в каждом section сортируются по заголовку в алфавитном порядке.

**Правило сортировки** (местоположение исходного кода: `build.ts:172-175`):
```typescript
section.rules.sort((a, b) =>
  a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
)
```

Используется локаль `en-US` для обеспечения согласованной сортировки в разных средах.

**Присвоение ID** (местоположение исходного кода: `build.ts:178-180`):
```typescript
section.rules.forEach((rule, index) => {
  rule.id = `${section.number}.${index + 1}`
  rule.subsection = index + 1
})
```

После сортировки присваиваются ID, такие как `1.1`, `1.2`...

### Этап 5: Генерация документации (generate)

Функция `generateMarkdown()` преобразует массив `Section[]` в документ Markdown.

**Структура вывода** (местоположение исходного кода: `build.ts:29-126`):

```markdown
# React Best Practices
**Version 1.0**
Vercel Engineering
January 25, 2026

## Abstract
...

## Table of Contents
1. Устранение каскадной загрузки - CRITICAL
   - 1.1 [Параллельные запросы](#11-parallel-requests)
   - 1.2 [Defer Await](#12-defer-await)
...

## 1. Устранение каскадной загрузки
**Impact: CRITICAL**

### 1.1 Параллельные запросы
**Impact: CRITICAL**

**Incorrect:**
```typescript
// код
```
```

## Детали парсера правил

### Парсинг Frontmatter

Frontmatter — это YAML-блок в верхней части файла Markdown:

```markdown
---
title: Параллельные запросы
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, waterfall
---
```

**Логика парсинга** (местоположение исходного кода: `parser.ts:28-41`):
- Обнаружение начала `---` и конца второго `---`
- Разделение пар "ключ: значение" по `:`
- Удаление кавычек
- Сохранение в объект `frontmatter`

### Парсинг примеров кода

Каждое правило включает несколько примеров кода, помеченных `**Label:**`.

**Парсер состояний** (местоположение исходного кода: `parser.ts:66-188`):

```
Начальное состояние → чтение **Label:** → currentExample.label = "метка"
            → чтение ``` → inCodeBlock = true, сбор кода
            → чтение ``` → inCodeBlock = false, currentExample.code = собранный код
            → чтение текста → если afterCodeBlock, сохраняется в additionalText
            → чтение **Reference:** → currentExample отправляется в examples[]
```

**Поддерживаемые типы Label**:
- `Incorrect`: неправильный пример
- `Correct`: правильный пример
- `Example`: общий пример
- `Usage`: пример использования
- `Implementation`: пример реализации

**Захват дополнительных пояснений** (местоположение исходного кода: `parser.ts:182-186`):
```typescript
// Текст после блока кода, или текст в разделе без блока кода
// (например, "When NOT to use this pattern:" с маркированными точками вместо кода)
else if (currentExample && (afterCodeBlock || !hasCodeBlockForCurrentExample)) {
  additionalText.push(line)
}
```

Это поддерживает добавление дополнительных пояснений после блока кода или текстовые примеры (например, списки).

### Парсинг литературы

Литература находится в конце файла, формат:

```markdown
Reference: [React документация](https://react.dev), [Next.js руководство](https://nextjs.org/docs)
```

**Логика парсинга** (местоположение исходного кода: `parser.ts:154-174`):
- Регулярное сопоставление шаблона `[text](url)`
- Извлечение всех URL в массив `references[]`

## Типовая система

Определения типов находятся в `types.ts` (местоположение исходного кода: `types.ts:1-54`).

### Перечисление ImpactLevel

```typescript
export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM-HIGH'
  | 'MEDIUM'
  | 'LOW-MEDIUM'
  | 'LOW'
```

**Описание уровней**:

| Уровень       | Влияние                     | Пример правила                 |
| -------------- | --------------------------- | ----------------------------- |
| CRITICAL      | Критические узкие места, должны быть исправлены      | async-parallel            |
| HIGH          | Важные улучшения, рекомендуются приоритетно      | server-cache-react       |
| MEDIUM-HIGH   | Средне-высокий приоритет              | client-data-fetch        |
| MEDIUM        | Средние улучшения                | rerender-memo           |
| LOW-MEDIUM    | Низко-средний приоритет              | js-use-memo             |
| LOW           | Инкрементные улучшения, необязательно          | advanced-suspense-boundaries |

### Интерфейс Rule

```typescript
export interface Rule {
  id: string                    // автоматически генерируется, например "1.1"
  title: string                 // заголовок правила
  section: number              // принадлежащая глава (1-8)
  subsection?: number          // номер подглавы
  impact: ImpactLevel          // уровень влияния
  impactDescription?: string  // описание влияния, например "2-10× improvement"
  explanation: string          // описание правила
  examples: CodeExample[]      // массив примеров кода
  references?: string[]        // ссылки на литературу
  tags?: string[]              // теги
}
```

### Интерфейс CodeExample

```typescript
export interface CodeExample {
  label: string              // "Incorrect", "Correct", "Example"
  description?: string       // описание метки (необязательно）
  code: string              // содержимое кода
  language?: string         // язык кода, по умолчанию typescript
  additionalText?: string   // дополнительные пояснения после кода
}
```

### Интерфейс Section

```typescript
export interface Section {
  number: number              // номер главы (1-8)
  title: string              // заголовок главы
  impact: ImpactLevel        // общий уровень влияния
  impactDescription?: string // описание влияния
  introduction?: string      // введение главы
  rules: Rule[]             // включенные правила
}
```

### Интерфейс GuidelinesDocument

```typescript
export interface GuidelinesDocument {
  version: string          // номер версии, например "1.0"
  organization: string     // название организации
  date: string            // дата
  abstract: string        // резюме
  sections: Section[]     // главы
  references?: string[]   // глобальная литература
}
```

### Интерфейс TestCase

Используется для тестовых случаев автоматической оценки LLM.

```typescript
export interface TestCase {
  ruleId: string          // ID правила, например "1.1"
  ruleTitle: string       // заголовок правила
  type: 'bad' | 'good'   // тип примера
  code: string           // содержимое кода
  language: string       // язык кода
  description?: string   // описание
}
```

## Механизм извлечения тестовых случаев

Функция извлечения тестовых случаев преобразует примеры кода в правилах в тестовые случаи, которые можно оценить, для автоматической оценки LLM соблюдения правил.

### Логика извлечения (местоположение исходного кода: `extract-tests.ts:15-38`)

```typescript
function extractTestCases(rule: Rule): TestCase[] {
  const testCases: TestCase[] = []

  rule.examples.forEach((example, index) => {
    const isBad = example.label.toLowerCase().includes('incorrect') ||
                  example.label.toLowerCase().includes('wrong') ||
                  example.label.toLowerCase().includes('bad')
    const isGood = example.label.toLowerCase().includes('correct') ||
                    example.label.toLowerCase().includes('good')

    if (isBad || isGood) {
      testCases.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        type: isBad ? 'bad' : 'good',
        code: example.code,
        language: example.language || 'typescript',
        description: example.description || `${example.label} example for ${rule.title}`
      })
    }
  })

  return testCases
}
```

**Поддерживаемые типы примеров**:
- `Incorrect` / `Wrong` / `Bad` → type = 'bad'
- `Correct` / `Good` → type = 'good'

**Выходной файл**: `test-cases.json`

**Структура данных**:
```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Параллельные запросы",
    "type": "bad",
    "code": "const data = await fetch(url);\nconst result = await process(data);",
    "language": "typescript",
    "description": "Incorrect example for Параллельные запросы"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Параллельные запросы",
    "type": "good",
    "code": "const [data, processed] = await Promise.all([\n  fetch(url),\n  process(data)\n]);",
    "language": "typescript",
    "description": "Correct example for Параллельные запросы"
  }
]
```

**Статистика** (местоположение исходного кода: `extract-tests.ts:68-70`):
```bash
✓ Extracted 120 test cases to test-cases.json
  - Bad examples: 60
  - Good examples: 60
```

## Обнаружение фреймворков скриптов развертывания

Скрипты развертывания Vercel поддерживают автоматическое обнаружение 40+ фреймворков.

### Логика обнаружения (местоположение исходного кода: `deploy.sh:12-156`)

```bash
detect_framework() {
    local pkg_json="$1"
    local content=$(cat "$pkg_json")

    has_dep() {
        echo "$content" | grep -q "\"$1\""
    }

    # Проверка зависимостей, в порядке приоритета
    if has_dep "blitz"; then echo "blitzjs"; return; fi
    if has_dep "next"; then echo "nextjs"; return; fi
    if has_dep "gatsby"; then echo "gatsby"; return; fi
    # ... больше обнаружений фреймворков
}
```

**Порядок обнаружения**:
- От специального к общему
- Проверка `dependencies` и `devDependencies`
- Использование `grep -q` для быстрого сопоставления

### Поддерживаемые фреймворки

| Категория          | Список фреймворков                                                                 | Ключевые слова обнаружения                    |
| ---------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| React             | Next.js, Gatsby, Create React App, Remix, React Router, Blitz            | `next`, `gatsby`, `remix-run`  |
| Vue               | Nuxt, Vitepress, Vuepress, Gridsome                                      | `nuxt`, `vitepress`            |
| Svelte            | SvelteKit, Svelte, Sapper                                                | `@sveltejs/kit`, `svelte`      |
| Angular           | Angular, Ionic Angular                                                    | `@angular/core`                |
| Node.js Backend   | Express, Hono, Fastify, NestJS, Elysia, h3, Nitro                        | `express`, `hono`, `nestjs`    |
| Инструменты сборки  | Vite, Parcel                                                            | `vite`, `parcel`               |
| Статический HTML   | Нет package.json                                                         | Возврат `null`                    |

### Обработка статических HTML-проектов (местоположение исходного кода: `deploy.sh:192-206`)

Статические HTML-проекты (без `package.json`) требуют специальной обработки:

```bash
if [ ! -f "$PROJECT_PATH/package.json" ]; then
  # Поиск HTML-файлов в корневом каталоге
  HTML_FILES=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f)
  HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo 0)

  # Если только один HTML-файл и не index.html, переименовываем в index.html
  if [ "$HTML_COUNT" -eq 1 ]; then
    HTML_FILE=$(echo "$HTML_FILES" | head -1)
    BASENAME=$(basename "$HTML_FILE")
    if [ "$BASENAME" != "index.html" ]; then
      echo "Renaming $BASENAME to index.html..." >&2
      mv "$HTML_FILE" "$PROJECT_PATH/index.html"
    fi
  fi
fi
```

**Зачем нужно переименование?**
Vercel по умолчанию ищет `index.html` как файл входа статического сайта.

### Процесс развертывания (местоположение исходного кода: `deploy.sh:158-249`)

```bash
# 1. Парсинг параметров
INPUT_PATH="${1:-.}"

# 2. Создание временного каталога
TEMP_DIR=$(mktemp -d)

# 3. Обнаружение фреймворка
FRAMEWORK=$(detect_framework "$PROJECT_PATH/package.json")

# 4. Создание tarball (исключение node_modules и .git)
tar -czf "$TARBALL" -C "$PROJECT_PATH" --exclude='node_modules' --exclude='.git' .

# 5. Загрузка в API
RESPONSE=$(curl -s -X POST "$DEPLOY_ENDPOINT" -F "file=@$TARBALL" -F "framework=$FRAMEWORK")

# 6. Парсинг ответа
PREVIEW_URL=$(echo "$RESPONSE" | grep -o '"previewUrl":"[^"]*"' | cut -d'"' -f4)
CLAIM_URL=$(echo "$RESPONSE" | grep -o '"claimUrl":"[^"]*"' | cut -d'"' -f4)

# 7. Вывод результатов
echo "Preview URL: $PREVIEW_URL"
echo "Claim URL:   $CLAIM_URL"
echo "$RESPONSE"  # формат JSON для использования программами
```

**Обработка ошибок** (местоположение исходного кода: `deploy.sh:224-239`):
```bash
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Error: $ERROR_MSG" >&2
  exit 1
fi

if [ -z "$PREVIEW_URL" ]; then
  echo "Error: Could not extract preview URL from response" >&2
  exit 1
fi
```

## Следующие шаги

После понимания архитектуры вы можете:

- [Разрабатывать пользовательские навыки](../../advanced/skill-development/)
- [Писать правила лучших практик React](../../advanced/rule-authoring/)
- [Просмотреть справочник API и команд](../reference/)

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-25

| Функция                  | Путь к файлу                                                                 | Строки       |
| ------------------------- | --------------------------------------------------------------------------- | ------------ |
| Типовая система              | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts) | 1-54         |
| Конфигурация путей              | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts) | 1-18         |
| Парсер правил            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts) | 18-238       |
| Сценарий сборки              | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts) | 131-287      |
| Извлечение тестовых случаев          | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38        |
| Обнаружение фреймворка скриптов развертывания      | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156       |

**Ключевые константы**:
- Перечислимые значения `ImpactLevel`: CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW (`types.ts:5`)
- `SKILL_DIR`: путь к каталогу навыков (`config.ts:11`)
- `RULES_DIR`: путь к каталогу файлов правил (`config.ts:13`)
- `DEPLOY_ENDPOINT`: `https://claude-skills-deploy.vercel.com/api/deploy` (`deploy.sh:9`)

**Ключевые функции**:
- `parseRuleFile()`: парсинг файла правил Markdown в объект Rule (`parser.ts:18`)
- `extractTestCases()`: извлечение тестовых случаев из правил (`extract-tests.ts:15`)
- `generateMarkdown()`: генерация документа Markdown из массива Section (`build.ts:29`)
- `detect_framework()`: обнаружение фреймворка проекта (`deploy.sh:12`)

</details>
