---
title: "API: Справочник инструментов | opencode-agent-skills"
sidebarTitle: "Вызов 4 инструментов"
subtitle: "API: Справочник инструментов | opencode-agent-skills"
description: "Изучите использование 4 основных API-инструментов opencode-agent-skills. Освойте настройку параметров, обработку возвращаемых значений и устранение ошибок. Узнайте о поддержке пространств имён и механизмах безопасности, повысьте эффективность разработки с помощью практических примеров."
tags:
  - "API"
  - "Справочник инструментов"
  - "Документация интерфейсов"
prerequisite:
  - "start-installation"
order: 2
---

# Справочник API-инструментов

## Чему вы научитесь

Изучив этот справочник API, вы:

- Узнаете параметры и возвращаемые значения 4 основных инструментов
- Освоите правильные способы вызова инструментов
- Научитесь обрабатывать типичные ошибки

## Обзор инструментов

Плагин OpenCode Agent Skills предоставляет следующие 4 инструмента:

| Название инструмента | Описание функции | Сценарий использования |
| --- | --- | --- |
| `get_available_skills` | Получение списка доступных навыков | Просмотр всех доступных навыков с поддержкой поиска и фильтрации |
| `read_skill_file` | Чтение файла навыка | Доступ к документации, конфигурации и другим вспомогательным файлам навыка |
| `run_skill_script` | Выполнение скрипта навыка | Запуск автоматизированных скриптов в директории навыка |
| `use_skill` | Загрузка навыка | Внедрение содержимого SKILL.md в контекст сессии |

---

## get_available_skills

Получает список доступных навыков с опциональной фильтрацией по поисковому запросу.

### Параметры

| Имя параметра | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `query` | string | Нет | Строка поискового запроса, сопоставляется с названием и описанием навыка (поддерживает подстановочный знак `*`) |

### Возвращаемое значение

Возвращает форматированный список навыков, каждый элемент содержит:

- Название навыка и метку источника (например, `skill-name (project)`)
- Описание навыка
- Список доступных скриптов (при наличии)

**Пример ответа**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Обработка ошибок

- При отсутствии совпадений возвращается информационное сообщение
- При опечатке в параметре запроса возвращаются предложения похожих навыков

### Примеры использования

**Вывод всех навыков**:
```
Ввод пользователя:
Покажи все доступные навыки

Вызов AI:
get_available_skills()
```

**Поиск навыков, содержащих "git"**:
```
Ввод пользователя:
Найди навыки, связанные с git

Вызов AI:
get_available_skills({
  "query": "git"
})
```

**Поиск с подстановочным знаком**:
```
Вызов AI:
get_available_skills({
  "query": "code*"
})

Ответ:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Читает вспомогательные файлы из директории навыка (документацию, конфигурацию, примеры и т.д.).

### Параметры

| Имя параметра | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `skill` | string | Да | Название навыка |
| `filename` | string | Да | Путь к файлу (относительно директории навыка, например `docs/guide.md`, `scripts/helper.sh`) |

### Возвращаемое значение

Возвращает сообщение об успешной загрузке файла.

**Пример ответа**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

Содержимое файла внедряется в контекст сессии в формате XML:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Фактическое содержимое файла]
  </content>
</skill-file>
```

### Обработка ошибок

| Тип ошибки | Сообщение |
| --- | --- |
| Навык не найден | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Небезопасный путь | `Invalid path: cannot access files outside skill directory.` |
| Файл не найден | `File "xxx" not found. Available files: file1, file2, ...` |

### Механизм безопасности

- Проверка безопасности пути: защита от атак обхода директорий (например, `../../../etc/passwd`)
- Доступ ограничен файлами внутри директории навыка

### Примеры использования

**Чтение документации навыка**:
```
Ввод пользователя:
Покажи руководство по использованию навыка code-review

Вызов AI:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Чтение конфигурационного файла**:
```
Вызов AI:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Выполняет исполняемый скрипт в директории навыка.

### Параметры

| Имя параметра | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `skill` | string | Да | Название навыка |
| `script` | string | Да | Относительный путь к скрипту (например, `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | Нет | Массив аргументов командной строки для передачи скрипту |

### Возвращаемое значение

Возвращает вывод скрипта.

**Пример ответа**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Обработка ошибок

| Тип ошибки | Сообщение |
| --- | --- |
| Навык не найден | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Скрипт не найден | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Ошибка выполнения | `Script failed (exit 1): error message` |

### Правила обнаружения скриптов

Плагин автоматически сканирует исполняемые файлы в директории навыка:

- Максимальная глубина рекурсии: 10 уровней
- Пропуск скрытых директорий (начинающихся с `.`)
- Пропуск типичных директорий зависимостей (`node_modules`, `__pycache__`, `.git` и т.д.)
- Включаются только файлы с битом исполнения (`mode & 0o111`)

### Среда выполнения

- Рабочая директория (CWD) переключается на директорию навыка
- Скрипт выполняется в контексте директории навыка
- Вывод напрямую возвращается AI

### Примеры использования

**Выполнение скрипта сборки**:
```
Ввод пользователя:
Запусти скрипт сборки проекта

Вызов AI:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Выполнение с аргументами**:
```
Вызов AI:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Загружает содержимое SKILL.md навыка в контекст сессии.

### Параметры

| Имя параметра | Тип | Обязательный | Описание |
| --- | --- | --- | --- |
| `skill` | string | Да | Название навыка (поддерживает префикс пространства имён, например `project:my-skill`, `user:my-skill`) |

### Возвращаемое значение

Возвращает сообщение об успешной загрузке навыка со списком доступных скриптов и файлов.

**Пример ответа**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

Содержимое навыка внедряется в контекст сессии в формате XML:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Маппинг инструментов Claude Code...]
  
  <content>
[Фактическое содержимое SKILL.md]
  </content>
</skill>
```

### Поддержка пространств имён

Используйте префикс пространства имён для точного указания источника навыка:

| Пространство имён | Описание | Пример |
| --- | --- | --- |
| `project:` | Навык OpenCode уровня проекта | `project:my-skill` |
| `user:` | Навык OpenCode уровня пользователя | `user:my-skill` |
| `claude-project:` | Навык Claude уровня проекта | `claude-project:my-skill` |
| `claude-user:` | Навык Claude уровня пользователя | `claude-user:my-skill` |
| Без префикса | Использует приоритет по умолчанию | `my-skill` |

### Обработка ошибок

| Тип ошибки | Сообщение |
| --- | --- |
| Навык не найден | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Функция автоматического внедрения

При загрузке навыка плагин автоматически:

1. Перечисляет все файлы в директории навыка (кроме SKILL.md)
2. Перечисляет все исполняемые скрипты
3. Внедряет маппинг инструментов Claude Code (если навык этого требует)

### Примеры использования

**Загрузка навыка**:
```
Ввод пользователя:
Помоги мне провести код-ревью

Вызов AI:
use_skill({
  "skill": "code-review"
})
```

**Указание источника через пространство имён**:
```
Вызов AI:
use_skill({
  "skill": "user:git-helper"
})
```

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть расположение исходного кода</strong></summary>

> Дата обновления: 2026-01-24

| Инструмент | Путь к файлу | Строки |
| --- | --- | --- |
| Инструмент GetAvailableSkills | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| Инструмент ReadSkillFile | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| Инструмент RunSkillScript | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| Инструмент UseSkill | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Регистрация инструментов | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Определение типа Skill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Определение типа Script | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| Определение типа SkillLabel | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Функция resolveSkill | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Ключевые типы**:
- `Skill`: Полные метаданные навыка (name, description, path, scripts, template и т.д.)
- `Script`: Метаданные скрипта (relativePath, absolutePath)
- `SkillLabel`: Идентификатор источника навыка (project, user, claude-project и т.д.)

**Ключевые функции**:
- `resolveSkill()`: Разрешает название навыка, поддерживает префиксы пространств имён
- `isPathSafe()`: Проверяет безопасность пути, предотвращает обход директорий
- `findClosestMatch()`: Нечёткий поиск для предложений

</details>

---

## Анонс следующего урока

Этот урок завершает справочник API-инструментов OpenCode Agent Skills.

Для получения дополнительной информации обратитесь к:
- [Лучшие практики разработки навыков](../best-practices/) — изучите приёмы и стандарты написания качественных навыков
- [Устранение типичных проблем](../../faq/troubleshooting/) — решение распространённых проблем при использовании плагина
