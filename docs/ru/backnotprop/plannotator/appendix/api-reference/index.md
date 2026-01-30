---
title: "Справочник API: Документация локального интерфейса | plannotator"
sidebarTitle: "Справочник API"
subtitle: "Справочник API: Документация локального интерфейса | plannotator"
description: "Изучите все API-эндпоинты Plannotator и форматы запросов/ответов. Подробное описание полных спецификаций интерфейсов для проверки планов, проверки кода, загрузки изображений и других функций для удобной интеграции."
tags:
  - "API"
  - "Приложение"
prerequisite:
  - "start-getting-started"
order: 1
---

# Справочник API Plannotator

## Что вы узнаете

- Все API-эндпоинты, предоставляемые локальным сервером Plannotator
- Форматы запросов и ответов для каждого API
- Различия между интерфейсами проверки планов и проверки кода
- Справочная информация для интеграции или расширенной разработки

## Обзор

Plannotator запускает HTTP-сервер локально (используя Bun.serve), предоставляя RESTful API для проверки планов и проверки кода. Все ответы API в формате JSON, аутентификация не требуется (изолированная локальная среда).

**Способы запуска сервера**:
- Случайный порт (локальный режим)
- Фиксированный порт 19432 (удаленный режим/Devcontainer, можно переопределить через `PLANNOTATOR_PORT`)

**Базовый URL API**: `http://localhost:<PORT>/api/`

::: tip Подсказка
Следующие API классифицированы по функциональным модулям, поведение одного и того же пути может отличаться на серверах проверки планов и проверки кода.
:::

## API проверки планов

### GET /api/plan

Получить текущее содержимое плана и связанные метаданные.

**Запрос**: нет

**Пример ответа**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `plan` | string | Содержимое плана в формате Markdown |
| `origin` | string | Идентификатор источника (`"claude-code"` или `"opencode"`) |
| `permissionMode` | string | Текущий режим разрешений (только для Claude Code) |
| `sharingEnabled` | boolean | Включена ли возможность совместного доступа по URL |

---

### POST /api/approve

Утвердить текущий план с возможностью сохранения в приложение для заметок.

**Тело запроса**:

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Примечание при утверждении (только OpenCode)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Пример ответа**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Описание полей**:

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `obsidian` | object | Нет | Конфигурация сохранения в Obsidian |
| `bear` | object | Нет | Конфигурация сохранения в Bear |
| `feedback` | string | Нет | Примечание при утверждении (только OpenCode) |
| `agentSwitch` | string | Нет | Имя агента для переключения (только OpenCode) |
| `permissionMode` | string | Нет | Запрашиваемый режим разрешений (только Claude Code) |
| `planSave` | object | Нет | Конфигурация сохранения плана |

**Поля конфигурации Obsidian**:

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `vaultPath` | string | Да | Путь к файлу хранилища |
| `folder` | string | Нет | Целевая папка (по умолчанию корневая директория) |
| `tags` | string[] | Нет | Автоматически генерируемые теги |
| `plan` | string | Да | Содержимое плана |

---

### POST /api/deny

Отклонить текущий план и предоставить обратную связь.

**Тело запроса**:

```json
{
  "feedback": "Необходимо добавить покрытие модульными тестами",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Пример ответа**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Описание полей**:

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `feedback` | string | Нет | Причина отклонения (по умолчанию "Plan rejected by user") |
| `planSave` | object | Нет | Конфигурация сохранения плана |

---

### GET /api/obsidian/vaults

Обнаружить локально настроенные хранилища Obsidian.

**Запрос**: нет

**Пример ответа**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Пути к файлам конфигурации**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## API проверки кода

### GET /api/diff

Получить текущее содержимое git diff.

**Запрос**: нет

**Пример ответа**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `rawPatch` | string | Патч в унифицированном формате Git diff |
| `gitRef` | string | Используемая ссылка Git |
| `origin` | string | Идентификатор источника |
| `diffType` | string | Текущий тип diff |
| `gitContext` | object | Контекстная информация Git |
| `sharingEnabled` | boolean | Включена ли возможность совместного доступа по URL |

**Описание полей gitContext**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `currentBranch` | string | Имя текущей ветки |
| `defaultBranch` | string | Имя ветки по умолчанию (main или master) |
| `diffOptions` | object[] | Доступные опции типов diff (включая id и label) |

---

### POST /api/diff/switch

Переключиться на другой тип git diff.

**Тело запроса**:

```json
{
  "diffType": "staged"
}
```

**Поддерживаемые типы diff**:

| Тип | Команда Git | Описание |
| --- | --- | --- |
| `uncommitted` | `git diff HEAD` | Незафиксированные изменения (по умолчанию) |
| `staged` | `git diff --staged` | Подготовленные изменения |
| `last-commit` | `git diff HEAD~1..HEAD` | Последний коммит |
| `vs main` | `git diff main..HEAD` | Текущая ветка vs main |

**Пример ответа**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Отправить обратную связь по проверке кода AI-агенту.

**Тело запроса**:

```json
{
  "feedback": "Рекомендуется добавить логику обработки ошибок",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Здесь следует использовать try-catch",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Описание полей**:

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `feedback` | string | Нет | Текстовая обратная связь (LGTM или другое) |
| `annotations` | array | Нет | Массив структурированных аннотаций |
| `agentSwitch` | string | Нет | Имя агента для переключения (только OpenCode) |

**Поля объекта annotation**:

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `id` | string | Да | Уникальный идентификатор |
| `type` | string | Да | Тип: `comment`, `suggestion`, `concern` |
| `filePath` | string | Да | Путь к файлу |
| `lineStart` | number | Да | Номер начальной строки |
| `lineEnd` | number | Да | Номер конечной строки |
| `side` | string | Да | Сторона: `"old"` или `"new"` |
| `text` | string | Нет | Содержимое комментария |
| `suggestedCode` | string | Нет | Предлагаемый код (тип suggestion) |

**Пример ответа**:

```json
{
  "ok": true
}
```

---

## Общие API

### GET /api/image

Получить изображение (локальный путь к файлу или загруженный временный файл).

**Параметры запроса**:

| Параметр | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `path` | string | Да | Путь к файлу изображения |

**Пример запроса**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Ответ**: Файл изображения (PNG/JPEG/WebP)

**Ответы с ошибками**:
- `400` - Отсутствует параметр path
- `404` - Файл не существует
- `500` - Ошибка чтения файла

---

### POST /api/upload

Загрузить изображение во временную директорию, вернуть доступный путь.

**Запрос**: `multipart/form-data`

| Поле | Тип | Обязательно | Описание |
| --- | --- | --- | --- |
| `file` | File | Да | Файл изображения |

**Поддерживаемые форматы**: PNG, JPEG, WebP

**Пример ответа**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Ответы с ошибками**:
- `400` - Файл не предоставлен
- `500` - Ошибка загрузки

::: info Примечание
Загруженные изображения сохраняются в директории `/tmp/plannotator`, автоматическая очистка после закрытия сервера не выполняется.
:::

---

### GET /api/agents

Получить список доступных агентов OpenCode (только OpenCode).

**Запрос**: нет

**Пример ответа**:

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Правила фильтрации**:
- Возвращаются только агенты с `mode === "primary"`
- Исключаются агенты с `hidden === true`

**Ответ с ошибкой**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Обработка ошибок

### HTTP-коды состояния

| Код состояния | Описание |
| --- | --- |
| `200` | Запрос успешен |
| `400` | Ошибка валидации параметров |
| `404` | Ресурс не найден |
| `500` | Внутренняя ошибка сервера |

### Формат ответа с ошибкой

```json
{
  "error": "Описание ошибки"
}
```

### Распространенные ошибки

| Ошибка | Условие возникновения |
| --- | --- |
| `Missing path parameter` | `/api/image` отсутствует параметр `path` |
| `File not found` | `/api/image` указанный файл не существует |
| `No file provided` | `/api/upload` файл не загружен |
| `Missing diffType` | `/api/diff/switch` отсутствует поле `diffType` |
| `Port ${PORT} in use` | Порт уже занят (ошибка запуска сервера) |

---

## Поведение сервера

### Механизм повторных попыток порта

- Максимальное количество повторных попыток: 5
- Задержка повторной попытки: 500 миллисекунд
- Ошибка таймаута: `Port ${PORT} in use after 5 retries`

::: warning Подсказка для удаленного режима
В удаленном режиме/режиме Devcontainer, если порт занят, можно использовать другой порт, установив переменную окружения `PLANNOTATOR_PORT`.
:::

### Ожидание решения

После запуска сервер переходит в состояние ожидания решения пользователя:

**Сервер проверки планов**:
- Ожидает вызова `/api/approve` или `/api/deny`
- После вызова возвращает решение и закрывает сервер

**Сервер проверки кода**:
- Ожидает вызова `/api/feedback`
- После вызова возвращает обратную связь и закрывает сервер

### Откат SPA

Все несопоставленные пути возвращают встроенный HTML (одностраничное приложение):

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

Это обеспечивает нормальную работу фронтенд-маршрутизации.

---

## Переменные окружения

| Переменная | Описание | Значение по умолчанию |
| --- | --- | --- |
| `PLANNOTATOR_REMOTE` | Включить удаленный режим | Не установлено |
| `PLANNOTATOR_PORT` | Фиксированный номер порта | Случайный (локальный) / 19432 (удаленный) |
| `PLANNOTATOR_ORIGIN` | Идентификатор источника | `"claude-code"` или `"opencode"` |
| `PLANNOTATOR_SHARE` | Отключить совместный доступ по URL | Не установлено (включено) |

::: tip Подсказка
Дополнительную информацию о конфигурации переменных окружения см. в разделе [Конфигурация переменных окружения](../../advanced/environment-variables/).
:::

---

## Резюме урока

Plannotator предоставляет полный локальный HTTP API, поддерживающий две основные функции: проверку планов и проверку кода:

- **API проверки планов**: Получение плана, решения об утверждении/отклонении, интеграция с Obsidian/Bear
- **API проверки кода**: Получение diff, переключение типа diff, отправка структурированной обратной связи
- **Общие API**: Загрузка и скачивание изображений, запрос списка агентов
- **Обработка ошибок**: Унифицированные HTTP-коды состояния и формат ошибок

Все API работают локально, данные не загружаются, безопасно и надежно.

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть и просмотреть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-24

| Функция | Путь к файлу | Номера строк |
| --- | --- | --- |
| Точка входа сервера проверки планов | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (проверка планов) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Точка входа сервера проверки кода | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (проверка кода) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Ключевые константы**:
- `MAX_RETRIES = 5`: Максимальное количество повторных попыток запуска сервера (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500`: Задержка повторной попытки порта (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Ключевые функции**:
- `startPlannotatorServer(options)`: Запуск сервера проверки планов (`packages/server/index.ts:91`)
- `startReviewServer(options)`: Запуск сервера проверки кода (`packages/server/review.ts:79`)

</details>
