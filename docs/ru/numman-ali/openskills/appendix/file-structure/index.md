---
title: "Структура файлов: Организация каталогов | opencode-openskills"
sidebarTitle: "Где разместить навыки"
subtitle: "Структура файлов: Организация каталогов | opencode-openskills"
description: "Изучите организацию каталогов и файлов OpenSkills. Освойте установочные каталоги навыков, структуру директорий, спецификацию формата AGENTS.md и приоритет поиска."
tags:
  - "Приложение"
  - "Структура файлов"
  - "Организация каталогов"
prerequisite: []
order: 3
---

# Структура файлов

## Обзор

Структура файлов OpenSkills делится на три категории: **каталоги установки навыков**, **структура каталогов навыков** и **файлы синхронизации AGENTS.md**. Понимание этих структур поможет вам эффективнее управлять и использовать навыки.

## Каталоги установки навыков

OpenSkills поддерживает 4 расположения для установки навыков, упорядоченных по приоритету от высокого к низкому:

| Приоритет | Расположение | Описание | Когда использовать |
| --- | --- | --- | ---|
| 1 | `./.agent/skills/` | Локальный режим Universal проекта | Мультиагентные среды, избегая конфликтов с Claude Code |
| 2 | `~/.agent/skills/` | Глобальный режим Universal | Мультиагентные среды + глобальная установка |
| 3 | `./.claude/skills/` | Локальный проект (по умолчанию) | Стандартная установка, навыки специфичные для проекта |
| 4 | `~/.claude/skills/` | Глобальная установка | Навыки, общие для всех проектов |

**Рекомендации по выбору**:
- Одноагентная среда: используйте `.claude/skills/` по умолчанию
- Мультиагентная среда: используйте `.agent/skills/` (флаг `--universal`)
- Навыки между проектами: используйте глобальную установку (флаг `--global`)

## Структура каталогов навыков

Каждый навык — это независимый каталог, содержащий обязательные и опциональные файлы:

```
skill-name/
├── SKILL.md              # Обязательно: главный файл навыка
├── .openskills.json      # Обязательно: метаданные установки (автогенерация)
├── references/           # Опционально: справочная документация
│   └── api-docs.md
├── scripts/             # Опционально: исполняемые скрипты
│   └── helper.py
└── assets/              # Опционально: шаблоны и выходные файлы
    └── template.json
```

### Описание файлов

#### SKILL.md (обязательно)

Главный файл навыка, содержащий frontmatter YAML и инструкции навыка:

```yaml
---
name: my-skill
description: Описание навыка
---

## Заголовок навыка

Содержимое инструкций навыка...
```

**Ключевые моменты**:
- Имя файла должно быть `SKILL.md` (заглавными буквами)
- YAML frontmatter должен содержать `name` и `description`
- Содержимое использует повелительное наклонение (imperative form)

#### .openskills.json (обязательно, автогенерация)

Файл метаданных, автоматически создаваемый OpenSkills, записывает источник установки:

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**Назначение**:
- Поддержка обновлений навыков (`openskills update`)
- Запись временной метки установки
- Отслеживание источника навыка

**Исходное расположение**:
- `src/utils/skill-metadata.ts:29-36` - запись метаданных
- `src/utils/skill-metadata.ts:17-27` - чтение метаданных

#### references/ (опционально)

Хранит справочную документацию и спецификации API:

```
references/
├── skill-format.md      # Спецификация формата навыка
├── api-docs.md         # Документация API
└── best-practices.md   # Лучшие практики
```

**Сценарии использования**:
- Подробная техническая документация (сохраняет SKILL.md кратким)
- Справочник по API
- Примеры кода и шаблоны

#### scripts/ (опционально)

Хранит исполняемые скрипты:

```
scripts/
├── extract_text.py      # Python-скрипт
├── deploy.sh          # Shell-скрипт
└── build.js          # Node.js-скрипт
```

**Сценарии использования**:
- Автоматизированные скрипты, запускаемые при выполнении навыка
- Инструменты обработки и преобразования данных
- Скрипты развёртывания и сборки

#### assets/ (опционально)

Хранит шаблоны и выходные файлы:

```
assets/
├── template.json      # JSON-шаблон
├── config.yaml       # Файл конфигурации
└── output.md        # Пример вывода
```

**Сценарии использования**:
- Шаблоны генерируемого навыком контента
- Примеры конфигурационных файлов
- Примеры ожидаемого вывода

## Структура AGENTS.md

Файл `openskills sync` генерирует AGENTS.md, содержащий описание системы навыков и список доступных навыков:

### Полный формат

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### Описание компонентов

| Компонент | Описание |
|---|---|
| `<skills_system>` | XML-тег, обозначающий раздел системы навыков |
| `<usage>` | Инструкции по использованию навыков (объясняет AI, как вызывать навыки) |
| `<available_skills>` | Список доступных навыков (по одному тегу `<skill>` на навык) |
| `<skill>` | Информация об отдельном навыке (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | Маркер начала (используется для позиционирования при синхронизации) |
| `<!-- SKILLS_TABLE_END -->` | Маркер окончания (используется для позиционирования при синхронизации) |

**Поле location**:
- `project` - локальный навык проекта (`.claude/skills/` или `.agent/skills/`)
- `global` - глобальный навык (`~/.claude/skills/` или `~/.agent/skills/`)

## Приоритет поиска каталогов

OpenSkills выполняет поиск навыков в следующем порядке приоритета:

```typescript
// Исходное расположение: src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. Проект Universal
  join(homedir(), '.agent/skills'),        // 2. Глобальный Universal
  join(process.cwd(), '.claude/skills'),  // 3. Проект Claude
  join(homedir(), '.claude/skills'),       // 4. Глобальный Claude
]
```

**Правила**:
- После нахождения первого совпадающего навыка поиск прекращается
- Локальные навыки проекта имеют приоритет над глобальными
- Режим Universal имеет приоритет над стандартным режимом

**Исходное расположение**: `src/utils/skills.ts:30-64` - реализация поиска всех навыков

## Пример: полная структура проекта

Типичная структура проекта с использованием OpenSkills:

```
my-project/
├── AGENTS.md                    # Синхронизированный список навыков
├── .claude/                     # Конфигурация Claude Code
│   └── skills/                  # Каталог установки навыков
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Каталог режима Universal (опционально)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # Исходный код проекта
├── package.json
└── README.md
```

## Лучшие практики

### 1. Выбор каталога

| Сценарий | Рекомендуемый каталог | Команда |
|---|---|---|
| Навыки специфичные для проекта | `.claude/skills/` | `openskills install repo` |
| Общие для нескольких агентов | `.agent/skills/` | `openskills install repo --universal` |
| Навыки для всех проектов | `~/.claude/skills/` | `openskills install repo --global` |

### 2. Организация навыков

- **Односкилльный репозиторий**: `SKILL.md` в корневом каталоге
- **Мультискилльный репозиторий**: подкаталоги, каждый со своим `SKILL.md`
- **Символические ссылки**: при разработке используйте symlink для ссылки на локальный репозиторий (см. [Поддержка символических ссылок](../../advanced/symlink-support/))

### 3. Контроль версий AGENTS.md

- **Рекомендуется коммитить**: включите `AGENTS.md` в систему контроля версий
- **Синхронизация в CI/CD**: запускайте `openskills sync -y` в CI/CD (см. [Интеграция с CI/CD](../../advanced/ci-integration/))
- **Синхронизация командой**: члены команды запускают `openskills sync` для поддержания консистентности

## Резюме урока

Структура файлов OpenSkills разработана просто и понятно:

- **4 каталога установки**: поддержка локального проекта, глобального, режима Universal
- **Каталог навыков**: обязательный SKILL.md + автоматически генерируемый .openskills.json + опциональные resources/scripts/assets
- **AGENTS.md**: синхронизированный список навыков в формате Claude Code

Понимание этих структур поможет вам эффективнее управлять и использовать навыки.

## Следующий урок

> Следующий урок — **[Глоссарий](../glossary/)**.
>
> Вы узнаете:
> - Ключевые термины OpenSkills и систем навыков ИИ
> - Точные определения профессиональных концепций
> - Значения распространённых аббревиатур

---

## Приложение: Ссылки на исходный код

<details>
<summary><strong>Нажмите для просмотра расположения исходного кода</strong></summary>

> Обновлено: 2026-01-24

| Функция | Путь к файлу | Строки |
|---|---|---|
| Утилита путей каталогов | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| Поиск навыков | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| Управление метаданными | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**Ключевые функции**:
- `getSkillsDir(projectLocal, universal)` - получение пути к каталогу навыков
- `getSearchDirs()` - получение 4 каталогов поиска (по приоритету)
- `findAllSkills()` - поиск всех установленных навыков
- `findSkill(skillName)` - поиск указанного навыка
- `readSkillMetadata(skillDir)` - чтение метаданных навыка
- `writeSkillMetadata(skillDir, metadata)` - запись метаданных навыка

</details>
