---
title: "Справочник API и команд | Учебник по Agent Skills"
sidebarTitle: "Справочник"
subtitle: "Справочник API и команд"
description: "Изучите команды, типы и конфигурации Agent Skills. Включает API, TypeScript определения и шаблоны."
tags:
  - "Справочник"
  - "API"
  - "Командная строка"
  - "Определения типов"
prerequisite: []
---

# Справочник API и команд

Эта страница предоставляет полный справочник API и команд Agent Skills, включая команды цепочки инструментов сборки, определения типов TypeScript, формат шаблона SKILL.md и перечислимые значения уровней влияния.

## Определения типов TypeScript

### ImpactLevel（уровень влияния）

Уровень влияния используется для идентификации степени влияния правил на производительность, есть 6 уровней:

| Значение | Описание | Приемые сценарии |
| -------- | --------- | ---------------- |
| `CRITICAL` | Критические узкие места | Должны быть исправлены, иначе серьезно влияет на пользовательский опыт (например, каскадные запросы, неоптимизированный размер пакета) |
| `HIGH` | Важные улучшения | Значительное повышение производительности (например, кеширование на сервере, устранение повторных props) |
| `MEDIUM-HIGH` | Средне-высокий приоритет | Значительное повышение производительности (например, оптимизация получения данных) |
| `MEDIUM` | Средние улучшения | Измеримое повышение производительности (например, оптимизация Memo, уменьшение Re-render) |
| `LOW-MEDIUM` | Низко-средний приоритет | Легкое повышение производительности (например, оптимизация рендеринга) |
| `LOW` | Инкрементные улучшения | Микрооптимизация (например, стиль кода, расширенные шаблоны) |

**Местоположение исходного кода**: `types.ts:5`

### CodeExample（пример кода）

Структура примеров кода в правилах:

| Поле | Тип | Обязательно | Описание |
| ----- | ---- | ---------- | --------- |
| `label` | string | ✅ | Метка примера (например, "Incorrect", "Correct") |
| `description` | string | ❌ | Описание метки (необязательно) |
| `code` | string | ✅ | Содержимое кода |
| `language` | string | ❌ | Язык кода (по умолчанию 'typescript') |
| `additionalText` | string | ❌ | Дополнительные пояснения (необязательно) |

**Местоположение исходного кода**: `types.ts:7-13`

### Rule（правило）

Полная структура одного правила оптимизации производительности:

| Поле | Тип | Обязательно | Описание |
| ----- | ---- | ---------- | --------- |
| `id` | string | ✅ | ID правила (автоматически генерируется, например, "1.1", "2.3") |
| `title` | string | ✅ | Заголовок правила |
| `section` | number | ✅ | Принадлежащая глава (1-8) |
| `subsection` | number | ❌ | Номер подглавы (автоматически генерируется) |
| `impact` | ImpactLevel | ✅ | Уровень влияния |
| `impactDescription` | string | ❌ | Описание влияния (например, "2-10× improvement") |
| `explanation` | string | ✅ | Описание правила |
| `examples` | CodeExample[] | ✅ | Массив примеров кода (минимум 1) |
| `references` | string[] | ❌ | Ссылки на литературу |
| `tags` | string[] | ❌ | Теги (для поиска) |

**Местоположение исходного кода**: `types.ts:15-26`

### Section（глава）

Структура главы правил:

| Поле | Тип | Обязательно | Описание |
| ----- | ---- | ---------- | --------- |
| `number` | number | ✅ | Номер главы (1-8) |
| `title` | string | ✅ | Заголовок главы |
| `impact` | ImpactLevel | ✅ | Общий уровень влияния |
| `impactDescription` | string | ❌ | Описание влияния |
| `introduction` | string | ❌ | Введение главы |
| `rules` | Rule[] | ✅ | Массив включенных правил |

**Местоположение исходного кода**: `types.ts:28-35`

### GuidelinesDocument（документ руководства）

Полная структура документа руководства:

| Поле | Тип | Обязательно | Описание |
| ----- | ---- | ---------- | --------- |
| `version` | string | ✅ | Номер версии (например, "1.0") |
| `organization` | string | ✅ | Название организации |
| `date` | string | ✅ | Дата |
| `abstract` | string | ✅ | Резюме |
| `sections` | Section[] | ✅ | Массив глав |
| `references` | string[] | ❌ | Литература |

**Местоположение исходного кода**: `types.ts:37-44`

### TestCase（тестовый случай）

Структура тестовых случаев, извлеченных из правил:

| Поле | Тип | Обязательно | Описание |
| ----- | ---- | ---------- | --------- |
| `ruleId` | string | ✅ | ID правила (например, "1.1") |
| `ruleTitle` | string | ✅ | Заголовок правила |
| `type` | 'bad' \| 'good' | ✅ | Тип примера теста |
| `code` | string | ✅ | Содержимое кода |
| `language` | string | ✅ | Язык кода |
| `description` | string | ❌ | Описание |

**Местоположение исходного кода**: `types.ts:46-53`

## Команды цепочки инструментов сборки

### pnpm build

Собирает документацию правил и извлекает тестовые случаи.

**Команда**:
```bash
pnpm build
```

**Функции**:
1. Парсинг всех файлов правил (`rules/*.md`)
2. Группировка по главам и сортировка
3. Генерация полной документации `AGENTS.md`
4. Извлечение тестовых случаев в `test-cases.json`

**Вывод**:
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**Местоположение исходного кода**: `build.ts`

### pnpm build --upgrade-version

Собирает и автоматически повышает номер версии.

**Команда**:
```bash
pnpm build --upgrade-version
```

**Функции**:
1. Выполнение всех операций `pnpm build`
2. Автоматическое повышение номера версии в `metadata.json`
   - Формат: `0.1.0` → `0.1.1`
   - Увеличивает последнюю цифру

**Местоположение исходного кода**: `build.ts:19-24, 255-273`

### pnpm validate

Проверяет формат и полноту всех файлов правил.

**Команда**:
```bash
pnpm validate
```

**Проверяемые элементы**:
- ✅ Заголовок правила не пустой
- ✅ Описание правила не пустое
- ✅ Хотя бы один пример кода
- ✅ Включены примеры Bad/Incorrect и Good/Correct
- ✅ Уровень impact легален (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

**Вывод при успехе**:
```bash
✓ All 57 rules are valid
```

**Вывод при неудаче**:
```bash
✗ Validation failed

  ✖ [async-parallel.md]: Missing or empty title
    rules/async-parallel.md:2

  2 errors found
```

**Местоположение исходного кода**: `validate.ts`

### pnpm extract-tests

Извлекает тестовые случаи из правил.

**Команда**:
```bash
pnpm extract-tests
```

**Функции**:
1. Чтение всех файлов правил
2. Извлечение примеров `Bad/Incorrect` и `Good/Correct`
3. Генерация файла `test-cases.json`

**Вывод**:
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**Местоположение исходного кода**: `extract-tests.ts`

### pnpm dev

Процесс разработки (сборка + проверка).

**Команда**:
```bash
pnpm dev
```

**Функции**:
1. Выполнение `pnpm build`
2. Выполнение `pnpm validate`
3. Обеспечение правильности формата правил при разработке

**Приемлемые сценарии**:
- Проверка после написания новых правил
- Проверка полноты после изменения правил

**Местоположение исходного кода**: `package.json:12`

## Шаблон SKILL.md

### Шаблон определения навыка Claude.ai Skill

Каждый Claude.ai Skill должен включать файл `SKILL.md`:

```markdown
---
name: {имя-навыка}
description: {Одно предложение описывающее, когда использовать этот навык. Включите триггерные фразы, такие как "Deploy my app", "Check logs", и т.д.}
---

# {Заголовок навыка}

{Краткое описание того, что делает навык.}

## How It Works

{Нумерованный список, объясняющий рабочий процесс навыка.}

## Usage

```bash
bash /mnt/skills/user/{имя-навыка}/scripts/{скрипт}.sh [аргументы]
```

**Arguments:**
- `arg1` - Описание (по умолчанию X)

**Examples:**
{Покажите 2-3 общих паттерна использования}

## Output

{Покажите пример вывода, который увидят пользователи.}

## Present Results to User

{Шаблон того, как Claude должен форматировать результаты при представлении пользователям.}

## Troubleshooting

{Общие проблемы и решения, особенно сетевые/разрешения ошибки.}
```

**Местоположение исходного кода**: `AGENTS.md:29-69`

### Описание обязательных полей

| Поле | Описание | Пример |
| ----- | --------- | ------- |
| `name` | Имя навыка (имя каталога) | `vercel-deploy` |
| `description` | Одно предложение описание, включающее триггерные фразы | `Deploy applications to Vercel when user requests "Deploy my app"` |
| `title` | Заголовок навыка | `Vercel Deploy` |
| `How It Works` | Описание рабочего процесса | Нумерованный список, объясняющий 4-6 шагов |
| `Usage` | Метод использования | Включает примеры командной строки и описание параметров |
| `Output` | Пример вывода | Показывает результаты, которые увидят пользователи |
| `Present Results to User` | Шаблон форматирования результатов | Стандартный формат, используемый Claude при представлении результатов |

**Местоположение исходного кода**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Правила отображения уровней влияния

### Префикс имени файла правила → глава → уровень

| Префикс файла | Номер главы | Заголовок главы | Уровень по умолчанию |
| --------------- | ----------- | --------------- | ------------------- |
| `async-` | 1 | Устранение каскадной загрузки | CRITICAL |
| `bundle-` | 2 | Оптимизация сборки | CRITICAL |
| `server-` | 3 | Производительность сервера | HIGH |
| `client-` | 4 | Получение данных на клиенте | MEDIUM-HIGH |
| `rerender-` | 5 | Оптимизация повторного рендеринга | MEDIUM |
| `rendering-` | 6 | Производительность рендеринга | MEDIUM |
| `js-` | 7 | Производительность JavaScript | LOW-MEDIUM |
| `advanced-` | 8 | Расширенные шаблоны | LOW |

### Примеры файлов

| Имя файла | Автоматически выводимая глава | Автоматически выводимый уровень |
| --------- | ------------------------------ | ----------------------------- |
| `async-parallel.md` | 1 (устранение каскадной загрузки) | CRITICAL |
| `bundle-dynamic-imports.md` | 2 (оптимизация сборки) | CRITICAL |
| `server-cache-react.md` | 3 (производительность сервера) | HIGH |
| `rerender-memo.md` | 5 (оптимизация повторного рендеринга) | MEDIUM |

**Местоположение исходного кода**: `parser.ts:201-210`

## Справочник команд развертывания

### bash deploy.sh [path]

Команда скрипта развертывания Vercel.

**Команда**:
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**Параметры**:
- `path` - Каталог развертывания или файл `.tgz` (по умолчанию текущий каталог)

**Примеры**:
```bash
# Развернуть текущий каталог
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# Развернуть указанный проект
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# Развернуть существующий tarball
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**Формат вывода**:
- **Читаемый человеком** (stderr): URL превью и ссылка передачи прав
- **JSON** (stdout): Структурированные данные (включает deploymentId, projectId)

**Местоположение исходного кода**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-25

| Функция              | Путь к файлу                                                                                              | Строки  |
| ----------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| Тип ImpactLevel      | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5        |
| Интерфейс CodeExample | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13     |
| Интерфейс Rule       | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26    |
| Интерфейс Section   | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35    |
| Интерфейс GuidelinesDocument | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44    |
| Интерфейс TestCase  | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53    |
| Параметры командной строки build.ts | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14) | 12-14    |
| Логика повышения версии скрипта сборки | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24) | 19-24    |
| Логика проверки validate.ts | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66    |
| Файл шаблона правил          | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Весь файл |
| Формат шаблона SKILL.md         | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69) | 31-69    |
| Vercel Deploy SKILL            | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | Весь файл |
| Отображение префиксов файлов | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210) | 201-210  |

**Ключевые константы**:
- Перечисление `ImpactLevel`: `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**Ключевые функции**:
- `incrementVersion(version: string)`: повышение номера версии (build.ts)
- `generateMarkdown(sections, metadata)`: генерация AGENTS.md (build.ts)
- `validateRule(rule, file)`: проверка полноты правил (validate.ts)

</details>
