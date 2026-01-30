---
title: "Формат AGENTS.md: Спецификация скиллов | openskills"
sidebarTitle: "Познакомьте ИИ со своими скиллами"
subtitle: "Спецификация формата AGENTS.md"
description: "Изучите структуру XML-тегов и определение списка скиллов в файле AGENTS.md. Поймите значение полей, механизм генерации и лучшие практики, освоите принципы работы системы скиллов."
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# Спецификация формата AGENTS.md

**AGENTS.md** — это файл описания скиллов, генерируемый OpenSkills, который сообщает ИИ-агентам (таким как Claude Code, Cursor, Windsurf и др.), какие скиллы доступны и как их вызывать.

## Что вы сможете делать после изучения

- Понимать XML-структуру AGENTS.md и значение каждого тега
- Понимать определение полей списка скиллов и ограничения использования
- Знать, как вручную редактировать AGENTS.md (не рекомендуется, но иногда необходимо)
- Понимать, как OpenSkills генерирует и обновляет этот файл

## Полный пример формата

Ниже приведён полный пример файла AGENTS.md:

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## Подробное описание структуры тегов

### Внешний контейнер: `<skills_system>`

```xml
<skills_system priority="1">
  <!-- содержимое скиллов -->
</skills_system>
```

- **priority**: маркер приоритета (фиксированное значение `"1"`), сообщает ИИ-агенту важность этой системы скиллов

::: tip Примечание
Атрибут `priority` в настоящее время зарезервирован для будущих расширений, все AGENTS.md используют фиксированное значение `"1"`.
:::

### Инструкция по использованию: `<usage>`

Тег `<usage>` содержит инструкции для ИИ-агента о том, как использовать скиллы:

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**Ключевые моменты**:
- **Условие срабатывания**: проверять, может ли скилл эффективно выполнить задачу пользователя
- **Способ вызова**: использование команды `npx openskills read <skill-name>`
- **Пакетный вызов**: поддержка нескольких имён скиллов через запятую
- **Базовый каталог**: вывод содержит поле `base_dir` для разрешения ссылок на файлы в скиллах (например, `references/`, `scripts/`, `assets/`)
- **Ограничения использования**:
  - Использовать только скиллы из списка `<available_skills>`
  - Не вызывать скилл, уже загруженный в контекст
  - Каждый вызов скилла не сохраняет состояние

### Список скиллов: `<available_skills>`

`<available_skills>` содержит список всех доступных скиллов, каждый скилл определяется тегом `<skill>`:

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>Описание скилла...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>Описание другого скилла...</description>
<location>global</location>
</skill>

</available_skills>
```

#### Поля тега `<skill>`

Каждый `<skill>` содержит следующие обязательные поля:

| Поле        | Тип     | Возможные значения | Описание                                         |
| --- | --- | --- | --- |
| `<name>`    | string   | -             | Имя скилла (совпадает с именем файла SKILL.md или YAML `name`) |
| `<description>` | string | -             | Описание скилла (из YAML frontmatter файла SKILL.md)        |
| `<location>` | string   | `project` \| `global` | Маркер места установки скилла (для понимания ИИ-агентом источника скилла)         |

**Описание полей**:

- **`<name>`**: уникальный идентификатор скилла, ИИ-агент вызывает скилл по этому имени
- **`<description>`**: подробное описание функций скилла и сценариев использования, помогает ИИ решить, нужно ли использовать этот скилл
- **`<location>`**:
  - `project`: установлен локально в проекте (`.claude/skills/` или `.agent/skills/`)
  - `global`: установлен в глобальном каталоге (`~/.claude/skills/`)

::: info Зачем нужен маркер location?
Маркер `<location>` помогает ИИ-агенту понять видимость скилла:
- `project` скиллы доступны только в текущем проекте
- `global` скиллы доступны во всех проектах
Это влияет на стратегию выбора скиллов ИИ-агентом.
:::

## Способы разметки

AGENTS.md поддерживает два способа разметки, OpenSkills автоматически распознаёт:

### Способ 1: XML-разметка (рекомендуется)

```xml
<skills_system priority="1">
  <!-- содержимое скиллов -->
</skills_system>
```

Это способ по умолчанию, использует стандартные XML-теги для маркировки начала и конца системы скиллов.

### Способ 2: HTML-комментарии (режим совместимости)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- инструкции по использованию -->
</usage>

<available_skills>
  <!-- список скиллов -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

Этот формат убирает внешний контейнер `<skills_system>`, используя только HTML-комментарии для маркировки начала и конца области скиллов.

::: tip Логика обработки OpenSkills
Функция `replaceSkillsSection()` (`src/utils/agents-md.ts:67-93`) ищет маркеры в следующем порядке:
1. Сначала ищет XML-маркер `<skills_system>`
2. Если не найден, ищет HTML-комментарий `<!-- SKILLS_TABLE_START -->`
3. Если ничего не найдено, добавляет содержимое в конец файла
:::

## Как OpenSkills генерирует AGENTS.md

При выполнении `openskills sync` OpenSkills выполняет следующие действия:

1. **Находит все установленные скиллы** (`findAllSkills()`)
2. **Интерактивно выбирает скиллы** (если не использован флаг `-y`)
3. **Генерирует XML-содержимое** (`generateSkillsXml()`)
   - Создаёт инструкцию `<usage>`
   - Генерирует тег `<skill>` для каждого скилла
4. **Заменяет часть скиллов в файле** (`replaceSkillsSection()`)
   - Ищет существующий маркер (XML или HTML-комментарий)
   - Заменяет содержимое между маркерами
   - Если маркер отсутствует, добавляет в конец файла

### Расположение исходного кода

| Функция            | Путь к файлу                                                                      | Строки    |
| --- | --- | --- |
| Генерация XML        | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| Замена части скиллов    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| Парсинг существующих скиллов    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18    |
| Определение типа Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6)           | 1-6     |

## Рекомендации по редактированию

::: warning Не рекомендуется редактировать вручную
Хотя AGENTS.md можно редактировать вручную, рекомендуется:
1. Использовать команду `openskills sync` для генерации и обновления
2. Содержимое, отредактированное вручную, будет перезаписано при следующем `sync`
3. Если нужно настроить список скиллов, используйте интерактивный выбор (без флага `-y`)
:::

Если всё же необходимо отредактировать вручную, обратите внимание:

1. **Сохраняйте правильный XML-синтаксис**: убедитесь, что все теги правильно закрыты
2. **Не изменяйте маркеры**: сохраняйте `<skills_system>` или `<!-- SKILLS_TABLE_START -->` и другие маркеры
3. **Полные поля**: каждый `<skill>` должен содержать три поля `<name>`, `<description>`, `<location>`
4. **Без дублирования скиллов**: не добавляйте один и тот же скилл повторно

## Часто задаваемые вопросы

### Q1: Почему в AGENTS.md иногда нет тега `<skills_system>`?

**A**: Это режим совместимости. Если ваш файл использует HTML-комментарии (`<!-- SKILLS_TABLE_START -->`), OpenSkills также их распознаёт. При следующем `sync` автоматически преобразует в XML-разметку.

### Q2: Как удалить все скиллы?

**A**: Выполните `openskills sync` и отмените выбор всех скиллов в интерактивном режиме, или выполните:

```bash
openskills sync -y --output /dev/null
```

Это очистит часть скиллов в AGENTS.md (но сохранит маркеры).

### Q3: Имеет ли поле location реальное влияние на ИИ-агента?

**A**: Это зависит от конкретной реализации ИИ-агента. Обычно:
- `location="project"` означает, что скилл имеет смысл только в контексте текущего проекта
- `location="global"` означает, что скилл — универсальный инструмент, который можно использовать в любом проекте

ИИ-агент может корректировать стратегию загрузки скиллов на основе этой метки, но большинство агентов (например, Claude Code) игнорируют это поле и напрямую вызывают `openskills read`.

### Q4: Какой длины должно быть описание скилла?

**A**: Описание скилла должно:
- **Быть кратким, но полным**: объяснять основные функции скилла и основные сценарии использования
- **Избегать чрезмерной краткости**: однострочное описание затрудняет ИИ понять, когда использовать
- **Избегать избыточной длины**: длинное описание тратит контекст, ИИ не будет внимательно читать

Рекомендуемая длина: **50-150 слов**.

## Лучшие практики

1. **Используйте команду sync**: всегда используйте `openskills sync` для генерации AGENTS.md, а не редактируйте вручную
2. **Регулярно обновляйте**: после установки или обновления скиллов не забудьте выполнить `openskills sync`
3. **Выбирайте подходящие скиллы**: не все установленные скиллы должны быть в AGENTS.md, выбирайте в зависимости от потребностей проекта
4. **Проверяйте формат**: если ИИ-агент не распознаёт скиллы, проверьте правильность XML-тегов в AGENTS.md

## Анонс следующего урока

> Следующий урок — **[Структура файлов](../file-structure/)**.
>
> Вы узнаете:
> - Структуру каталогов и файлов, генерируемых OpenSkills
> - Роль и расположение каждого файла
> - Как понимать и управлять каталогами скиллов

---

## Приложение: Ссылки на исходный код

<details>
<summary><strong>Нажмите, чтобы развернуть исходный код</strong></summary>

> Обновлено: 2026-01-24

| Функция           | Путь к файлу                                                                      | Строки    |
| --- | --- | --- |
| Генерация XML        | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| Замена части скиллов    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| Парсинг существующих скиллов    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18    |
| Определение типа Skill | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6)           | 1-6     |

**Ключевые константы**:
- `priority="1"`: маркер приоритета системы скиллов (фиксированное значение)

**Ключевые функции**:
- `generateSkillsXml(skills: Skill[])`: генерирует список скиллов в формате XML
- `replaceSkillsSection(content: string, newSection: string)`: заменяет или добавляет часть скиллов
- `parseCurrentSkills(content: string)`: парсит имена включённых скиллов из AGENTS.md

</details>
