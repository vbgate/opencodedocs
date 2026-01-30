---
title: "CLI API: Справочник команд | OpenSkills"
subtitle: "CLI API: Справочник команд | OpenSkills"
sidebarTitle: "Справочник команд"
description: "Изучите полный API командной строки OpenSkills. Просмотрите параметры, опции и примеры использования для всех команд."
tags:
  - "API"
  - "CLI"
  - "Справочник команд"
  - "Описание опций"
prerequisite: []
order: 1
---

# Справочник OpenSkills CLI API

## Чему вы научитесь

- Полное использование всех команд OpenSkills
- Параметры и опции каждой команды
- Комбинирование команд для выполнения задач

## Что это такое

Справочник OpenSkills CLI API предоставляет полную документацию по всем командам, включая параметры, опции и примеры использования. Это справочное руководство, которое вы используете, когда вам нужно подробно изучить конкретную команду.

---

## Обзор

OpenSkills CLI предоставляет следующие команды:

```bash
openskills install <source>   # Установить навык
openskills list                # Список установленных навыков
openskills read <name>         # Читать содержимое навыка
openskills sync                # Синхронизировать с AGENTS.md
openskills update [name...]    # Обновить навыки
openskills manage              # Интерактивное управление навыками
openskills remove <name>       # Удалить навык
```

---

## Команда install

Установка навыков из GitHub, локального пути или частного git-репозитория.

### Синтаксис

```bash
openskills install <source> [options]
```

### Параметры

| Параметр | Тип | Обязательный | Описание |
|--- | --- | --- | ---|
| `<source>` | string | Y | Источник навыка (см. форматы ниже) |

### Опции

| Опция | Сокращение | Тип | По умолчанию | Описание |
|--- | --- | --- | --- | ---|
| `--global` | `-g` | flag | false | Глобальная установка в `~/.claude/skills/` |
| `--universal` | `-u` | flag | false | Установка в `.agent/skills/` (многоагентная среда) |
| `--yes` | `-y` | flag | false | Пропустить интерактивный выбор, установить все найденные навыки |

### Форматы источников

| Формат | Пример | Описание |
|--- | --- | ---|
| Сокращение GitHub | `anthropics/skills` | Из публичного репозитория GitHub |
| Git URL | `https://github.com/owner/repo.git` | Полный Git URL |
| SSH Git URL | `git@github.com:owner/repo.git` | Частный репозиторий SSH |
| Локальный путь | `./my-skill` или `~/dev/skills` | Из локального каталога |

### Примеры

```bash
# Установка из GitHub (интерактивный выбор)
openskills install anthropics/skills

# Установка из GitHub (неинтерактивная)
openskills install anthropics/skills -y

# Глобальная установка
openskills install anthropics/skills --global

# Установка в многоагентной среде
openskills install anthropics/skills --universal

# Установка из локального пути
openskills install ./my-custom-skill

# Установка из частного репозитория
openskills install git@github.com:your-org/private-skills.git
```

### Вывод

После успешной установки отображается:
- Список установленных навыков
- Место установки (project/global)
- Подсказка выполнить `openskills sync`

---

## Команда list

Список всех установленных навыков.

### Синтаксис

```bash
openskills list
```

### Параметры

Нет.

### Опции

Нет.

### Примеры

```bash
openskills list
```

### Вывод

```
Установленные навыки:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Имя навыка        │ Описание                            │ Место    │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Статистика: 3 навыка (2 проектных, 1 глобальный)
```

### Описание местоположения навыков

- **project**: Установлен в `.claude/skills/` или `.agent/skills/`
- **global**: Установлен в `~/.claude/skills/` или `~/.agent/skills/`

---

## Команда read

Чтение содержимого навыка в стандартный вывод (для использования AI-агентом).

### Синтаксис

```bash
openskills read <skill-names...>
```

### Параметры

| Параметр | Тип | Обязательный | Описание |
|--- | --- | --- | ---|
| `<skill-names...>` | string | Y | Имена навыков (список через запятую) |

### Опции

Нет.

### Примеры

```bash
# Чтение одного навыка
openskills read pdf

# Чтение нескольких навыков (через запятую)
openskills read pdf,git-workflow

# Чтение нескольких навыков (через пробел)
openskills read pdf git-workflow
```

### Вывод

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Назначение

Эта команда в основном используется AI-агентом для загрузки содержимого навыка. Пользователи также могут использовать её для просмотра подробного описания навыка.

---

## Команда sync

Синхронизация установленных навыков с AGENTS.md (или другим файлом).

### Синтаксис

```bash
openskills sync [options]
```

### Параметры

Нет.

### Опции

| Опция | Сокращение | Тип | По умолчанию | Описание |
|--- | --- | --- | --- | ---|
| `--output <path>` | `-o` | string | `AGENTS.md` | Путь к выходному файлу |
| `--yes` | `-y` | flag | false | Пропустить интерактивный выбор, синхронизировать все навыки |

### Примеры

```bash
# Синхронизация с AGENTS.md по умолчанию (интерактивная)
openskills sync

# Синхронизация с пользовательским путём
openskills sync -o .ruler/AGENTS.md

# Неинтерактивная синхронизация (CI/CD)
openskills sync -y

# Неинтерактивная синхронизация с пользовательским путём
openskills sync -y -o .ruler/AGENTS.md
```

### Вывод

После завершения синхронизации в указанном файле создаётся следующее содержимое:

```xml
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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## Команда update

Обновление установленных навыков из источника.

### Синтаксис

```bash
openskills update [skill-names...]
```

### Параметры

| Параметр | Тип | Обязательный | Описание |
|--- | --- | --- | ---|
| `[skill-names...]` | string | N | Имена навыков (через запятую), по умолчанию все |

### Опции

Нет.

### Примеры

```bash
# Обновить все установленные навыки
openskills update

# Обновить указанные навыки
openskills update pdf,git-workflow

# Обновить один навык
openskills update pdf
```

### Вывод

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Правила обновления

- Обновляются только навыки с записанными метаданными
- Навыки из локального пути: прямое копирование из исходного пути
- Навыки из Git-репозитория: повторное клонирование и копирование
- Навыки без метаданных: пропускаются с подсказкой переустановить

---

## Команда manage

Интерактивное управление (удаление) установленных навыков.

### Синтаксис

```bash
openskills manage
```

### Параметры

Нет.

### Опции

Нет.

### Примеры

```bash
openskills manage
```

### Интерактивный интерфейс

```
Выберите навыки для удаления:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Действия: [↑/↓] выбор [пробел] переключить [Enter] подтвердить [Esc] отмена
```

### Вывод

```
Удалено 1 навык:
- skill-creator (project)
```

---

## Команда remove

Удаление указанных установленных навыков (скриптовый способ).

### Синтаксис

```bash
openskills remove <skill-name>
```

### Псевдоним

`rm`

### Параметры

| Параметр | Тип | Обязательный | Описание |
|--- | --- | --- | ---|
| `<skill-name>` | string | Y | Имя навыка |

### Опции

Нет.

### Примеры

```bash
# Удалить навык
openskills remove pdf

# Использовать псевдоним
openskills rm pdf
```

### Вывод

```
Удалён навык: pdf (project)
Место: /path/to/.claude/skills/pdf
Источник: anthropics/skills
```

---

## Глобальные опции

Следующие опции применимы ко всем командам:

| Опция | Сокращение | Тип | По умолчанию | Описание |
|--- | --- | --- | --- | ---|
| `--version` | `-V` | flag | - | Показать версию |
| `--help` | `-h` | flag | - | Показать справку |

### Примеры

```bash
# Показать версию
openskills --version

# Показать глобальную справку
openskills --help

# Показать справку по конкретной команде
openskills install --help
```

---

## Приоритет поиска навыков

Когда существует несколько мест установки, навыки ищутся в следующем приоритете (от высокого к низкому):

1. `./.agent/skills/` - проектный уровень universal
2. `~/.agent/skills/` - глобальный уровень universal
3. `./.claude/skills/` - проектный уровень
4. `~/.claude/skills/` - глобальный уровень

**Важно**: Возвращается только первый найденный навык (с наивысшим приоритетом).

---

## Коды выхода

| Код выхода | Описание |
|--- | ---|
| 0 | Успех |
| 1 | Ошибка (ошибка параметров, сбой команды и т.д.) |

---

## Переменные окружения

Текущая версия не поддерживает конфигурацию переменных окружения.

---

## Файлы конфигурации

OpenSkills использует следующие файлы конфигурации:

- **Метаданные навыка**: `.claude/skills/<skill-name>/.openskills.json`
  - Записывает источник установки, временные метки и т.д.
  - Используется командой `update` для обновления навыков

### Пример метаданных

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Предпросмотр следующего урока

> В следующем уроке мы изучим **[Формат AGENTS.md](../agents-md-format/)**.
>
> Вы узнаете:
> - Структуру XML-тегов AGENTS.md и значение каждого тега
> - Определения полей и ограничения списка навыков
> - Как OpenSkills создаёт и обновляет AGENTS.md
> - Способы разметки (XML-теги и HTML-комментарии)

---

## Приложение: Ссылка на исходный код

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-24

| Команда | Путь к файлу | Строки |
|--- | --- | ---|
| Вход CLI | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| Команда install | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| Команда list | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| Команда read | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| Команда sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| Команда update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| Команда manage | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| Команда remove | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| Определения типов | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**Ключевые константы**:
- Нет глобальных констант

**Ключевые типы**:
- `Skill`: Интерфейс информации о навыке (name, description, location, path)
- `SkillLocation`: Интерфейс местоположения навыка (path, baseDir, source)
- `InstallOptions`: Интерфейс опций установки (global, universal, yes)

**Ключевые функции**:
- `program.command()`: Определение команды (commander.js)
- `program.option()`: Определение опции (commander.js)
- `program.action()`: Определение обработчика команды (commander.js)

</details>
