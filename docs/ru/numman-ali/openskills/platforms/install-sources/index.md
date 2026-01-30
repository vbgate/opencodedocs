---
title: "Источники установки: несколько способов установки навыков | openskills"
sidebarTitle: "Три источника на выбор"
subtitle: "Подробное описание источников установки"
description: "Изучите три способа установки навыков OpenSkills. Освойте методы установки из репозиториев GitHub, локальных путей и частных Git-репозиториев, включая аутентификацию SSH/HTTPS и настройку подпутей."
tags:
  - "Интеграция платформы"
  - "Управление навыками"
  - "Установка и настройка"
prerequisite:
  - "start-first-skill"
order: 2
---

# Подробное описание источников установки

## Чему вы научитесь

- Использовать три способа установки навыков: репозитории GitHub, локальные пути, частные Git-репозитории
- Выбирать наиболее подходящий источник установки для конкретной ситуации
- Понимать преимущества и недостатки разных источников
- Освоить форматы GitHub shorthand, относительных путей, URL-адресов частных репозиториев

::: info Предварительные знания

Этот учебник предполагает, что вы уже выполнили [Установку первого навыка](../../start/first-skill/) и знакомы с базовым процессом установки.

:::

---

## Ваша текущая ситуация

Вы, возможно, уже научились устанавливать навыки из официального репозитория, но:

- **Доступен только GitHub?**: Хотите использовать внутренний репозиторий GitLab компании, но не знаете, как настроить
- **Как установить локально разрабатываемые навыки?**: Разрабатываете свой навык и хотите протестировать его на локальном компьютере
- **Хотите указать конкретный навык**: В репозитории много навыков, не хотите каждый раз выбирать через интерактивный интерфейс
- **Как получить доступ к частному репозиторию?**: Репозиторий навыков компании является частным, не знаете, как аутентифицироваться

На самом деле OpenSkills поддерживает множество источников установки. Давайте рассмотрим их один за другим.

---

## Когда использовать этот метод

**Сценарии использования разных источников установки**:

| Источник установки | Сценарий использования | Пример |
|--- | --- | ---|
| **Репозиторий GitHub** | Использование навыков из сообщества с открытым исходным кодом | `openskills install anthropics/skills` |
| **Локальный путь** | Разработка и тестирование собственных навыков | `openskills install ./my-skill` |
| **Частный Git-репозиторий** | Использование внутренних навыков компании | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Рекомендация

- **Навыки с открытым исходным кодом**: Приоритет установки из репозитория GitHub для удобства обновлений
- **Этап разработки**: Установка из локального пути для тестирования изменений в реальном времени
- **Командная работа**: Использование частных Git-репозиториев для унифицированного управления внутренними навыками

:::

---

## Основная концепция: три источника, один механизм

Хотя источники установки различаются, базовый механизм OpenSkills одинаков:

```
[Идентификация типа источника] → [Получение файлов навыка] → [Копирование в .claude/skills/]
```

**Логика идентификации источника** (исходный код `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Приоритет проверки**:
1. Сначала проверяется, является ли это локальным путём (`isLocalPath`)
2. Затем проверяется, является ли это Git URL (`isGitUrl`)
3. В последнюю очередь обрабатывается как GitHub shorthand (`owner/repo`)

---

## Следуйте инструкциям

### Способ 1: Установка из репозитория GitHub

**Сценарий использования**: Установка навыков из сообщества с открытым исходным кодом, например официальный репозиторий Anthropic, сторонние пакеты навыков.

#### Базовое использование: установка всего репозитория

```bash
npx openskills install owner/repo
```

**Пример**: Установка навыков из официального репозитория Anthropic

```bash
npx openskills install anthropics/skills
```

**Вы должны увидеть**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Расширенное использование: указание подпути (прямая установка конкретного навыка)

Если в репозитории много навыков, вы можете напрямую указать подпуть устанавливаемого навыка, пропустив интерактивный выбор:

```bash
npx openskills install owner/repo/skill-name
```

**Пример**: Прямая установка навыка обработки PDF

```bash
npx openskills install anthropics/skills/pdf
```

**Вы должны увидеть**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Рекомендация

Когда вам нужен только один навык из репозитория, использование формата подпути позволяет пропустить интерактивный выбор, что быстрее.

:::

#### Правила GitHub shorthand (исходный код `install.ts:131-143`)

| Формат | Пример | Результат преобразования |
|--- | --- | ---|
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
|--- | --- | ---|

---

### Способ 2: Установка из локального пути

**Сценарий использования**: Разрабатываете свой навык и хотите протестировать его на локальном компьютере перед публикацией в GitHub.

#### Использование абсолютного пути

```bash
npx openskills install /absolute/path/to/skill
```

**Пример**: Установка из каталога навыков в домашнем каталоге

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Использование относительного пути

```bash
npx openskills install ./local-skills/my-skill
```

**Пример**: Установка из подкаталога `local-skills/` в каталоге проекта

```bash
npx openskills install ./local-skills/web-scraper
```

**Вы должны увидеть**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Важные замечания

Установка из локального пути копирует файлы навыка в `.claude/skills/`, последующие изменения исходных файлов не будут автоматически синхронизироваться. Для обновления необходимо переустановить.

:::

#### Установка локального каталога, содержащего несколько навыков

Если структура вашего локального каталога выглядит так:

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

Вы можете установить весь каталог напрямую:

```bash
npx openskills install ./local-skills
```

Это запустит интерфейс интерактивного выбора, позволяющий выбрать устанавливаемые навыки.

#### Поддерживаемые форматы локальных путей (исходный код `install.ts:25-32`)

| Формат | Описание | Пример |
|--- | --- | ---|
| `/absolute/path` | Абсолютный путь | `/home/user/skills/my-skill` |
| `./relative/path` | Относительный путь от текущего каталога | `./local-skills/my-skill` |
| `../relative/path` | Относительный путь от родительского каталога | `../shared-skills/common` |
| `~/path` | Относительный путь от домашнего каталога | `~/dev/my-skills` |

::: tip Советы по разработке

Использование сокращения `~` позволяет быстро ссылаться на навыки в домашнем каталоге, подходит для среды личной разработки.

:::

---

### Способ 3: Установка из частного Git-репозитория

**Сценарий использования**: Использование внутренних репозиториев GitLab/Bitbucket компании или частных репозиториев GitHub.

#### Метод SSH (рекомендуется)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Пример**: Установка из частного репозитория GitHub

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**Вы должны увидеть**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Настройка аутентификации

Метод SSH требует, чтобы вы уже настроили SSH-ключи. Если клонирование не удалось, проверьте:

```bash
# Тест SSH-подключения
ssh -T git@github.com

# Если отображается "Hi username! You've successfully authenticated...", настройка выполнена правильно
```

:::

#### Метод HTTPS (требуются учётные данные)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning Аутентификация HTTPS

При клонировании частного репозитория методом HTTPS Git запросит имя пользователя и пароль (или Personal Access Token). Если вы используете двухфакторную аутентификацию, необходимо использовать Personal Access Token, а не пароль учётной записи.

:::

#### Другие платформы хостинга Git

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Рекомендация

Для внутренних навыков команды рекомендуется использовать частные Git-репозитории, так как:
- Все участники могут установить из одного источника
- При обновлении навыков достаточно выполнить `openskills update`
- Удобно управление версиями и правами доступа

:::

#### Правила идентификации Git URL (исходный код `install.ts:37-45`)

| Префикс/суффикс | Описание | Пример |
|--- | --- | ---|
| `git@` | Протокол SSH | `git@github.com:owner/repo.git` |
| `git://` | Протокол Git | `git://github.com:owner/repo.git` |
| `http://` | Протокол HTTP | `http://github.com/owner/repo.git` |
| `https://` | Протокол HTTPS | `https://github.com/owner/repo.git` |
| Суффикс `.git` | Git-репозиторий (любой протокол) | `owner/repo.git` |

---

## Контрольная точка ✅

После завершения этого урока, пожалуйста, подтвердите:

- [ ] Знаете, как устанавливать навыки из репозитория GitHub (формат `owner/repo`)
- [ ] Знаете, как напрямую установить конкретный навык из репозитория (формат `owner/repo/skill-name`)
- [ ] Знаете, как устанавливать навыки из локального пути (`./`, `~/` и т. д.)
- [ ] Знаете, как устанавливать навыки из частного Git-репозитория (SSH/HTTPS)
- [ ] Понимаете сценарии использования разных источников установки

---

## Предупреждение о распространённых проблемах

### Проблема 1: Локальный путь не существует

**Симптом**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**Причина**:
- Ошибка в написании пути
- Ошибка вычисления относительного пути

**Решение**:
1. Проверьте, существует ли путь: `ls ./local-skills/my-skill`
2. Используйте абсолютный путь для избежания путаницы с относительными путями

---

### Проблема 2: Ошибка клонирования частного репозитория

**Симптом**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Причина**:
- SSH-ключ не настроен
- Нет доступа к репозиторию
- Ошибка адреса репозитория

**Решение**:
1. Проверьте SSH-подключение: `ssh -T git@github.com`
2. Убедитесь, что у вас есть доступ к репозиторию
3. Проверьте правильность адреса репозитория

::: tip Подсказка

Для частных репозиториев инструмент отображает следующее сообщение (исходный код `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Проблема 3: SKILL.md не найден в подпути

**Симптом**:

```
Error: SKILL.md not found at skills/my-skill
```

**Причина**:
- Ошибка в подпути
- Структура каталогов в репозитории отличается от ожидаемой

**Решение**:
1. Сначала установите весь репозиторий без подпути: `npx openskills install owner/repo`
2. Посмотрите доступные навыки через интерактивный интерфейс
3. Переустановите с правильным подпутем

---

### Проблема 4: Ошибка идентификации GitHub shorthand

**Симптом**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Причина**:
- Формат не соответствует ни одному правилу
- Ошибка в написании (например, пробел между `owner / repo`)

**Решение**:
- Проверьте правильность формата (без пробелов, правильное количество косых черт)
- Используйте полный Git URL вместо shorthand

---

## Итог урока

В этом уроке вы научились:

- **Три источника установки**: репозитории GitHub, локальные пути, частные Git-репозитории
- **GitHub shorthand**: два формата `owner/repo` и `owner/repo/skill-name`
- **Форматы локальных путей**: абсолютный путь, относительный путь, сокращение домашнего каталога
- **Установка частных репозиториев**: два метода SSH и HTTPS, форматы для разных платформ
- **Логика идентификации источников**: как инструмент определяет тип источника установки

**Краткий справочник по основным командам**:

| Команда | Действие |
|--- | ---|
| `npx openskills install owner/repo` | Установка из репозитория GitHub (интерактивный выбор) |
| `npx openskills install owner/repo/skill-name` | Прямая установка конкретного навыка из репозитория |
| `npx openskills install ./local-skills/skill` | Установка из локального пути |
| `npx openskills install ~/dev/my-skills` | Установка из домашнего каталога |
| `npx openskills install git@github.com:owner/private-skills.git` | Установка из частного Git-репозитория |

---

## Объявление следующего урока

> В следующем уроке мы изучим **[Глобальная установка против локальной установки проекта](../global-vs-project/)**.
>
> Вы узнаете:
> - Назначение и расположение флага `--global`
> - Различия между глобальной установкой и локальной установкой проекта
> - Выбор подходящего места установки в зависимости от сценария
> - Лучшие практики для обмена навыками между несколькими проектами

Источник установки — это лишь часть управления навыками, далее нужно понять влияние места установки навыков на проект.

---

## Приложение: Ссылка на исходный код

<details>
<summary><strong>Нажмите для отображения расположения исходного кода</strong></summary>

> Время обновления: 2026-01-24

| Функция | Путь к файлу | Номер строки |
|--- | --- | ---|
| Точка входа команды установки | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Проверка локального пути | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Проверка Git URL | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| Разбор GitHub shorthand | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Установка из локального пути | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Клонирование Git-репозитория | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Сообщение об ошибке частного репозитория | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Ключевые функции**:
- `isLocalPath(source)` — Проверка, является ли путь локальным (строки 25-32)
- `isGitUrl(source)` — Проверка, является ли URL Git URL (строки 37-45)
- `installFromLocal()` — Установка навыков из локального пути (строки 199-226)
- `installSpecificSkill()` — Установка навыка из указанного подпути (строки 272-316)
- `getRepoName()` — Извлечение имени репозитория из Git URL (строки 50-56)

**Ключевая логика**:
1. Приоритет проверки типа источника: локальный путь → Git URL → GitHub shorthand (строки 111-143)
2. GitHub shorthand поддерживает два формата: `owner/repo` и `owner/repo/skill-name` (строки 132-142)
3. При ошибке клонирования частного репозитория выводится подсказка о настройке SSH-ключей или учётных данных (строка 167)

</details>
