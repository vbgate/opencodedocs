---
title: "Спецификация API: Техническая документация интерфейса шлюза Antigravity | antigravity-auth"
sidebarTitle: "Отладка вызовов API"
subtitle: "Спецификация API Antigravity"
description: "Изучите спецификацию API Antigravity, освойте настройку конечных точек унифицированного интерфейса шлюза, аутентификацию OAuth 2.0, форматы запросов и ответов, правила вызова функций и механизмы обработки ошибок."
tags:
  - "API"
  - "Спецификация"
  - "Antigravity"
  - "Техническая документация"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Спецификация API Antigravity

> **⚠️ Важное примечание**: Это **внутренняя спецификация API** Antigravity, а не публичная документация. Данный учебник основан на проверке прямых тестов API и предназначен для разработчиков, которым необходимо глубоко понимать детали API.

Если вы просто хотите использовать плагин, обратитесь к разделам [Быстрый старт](/ru/NoeFabris/opencode-antigravity-auth/start/quick-install/) и [Руководство по настройке](/ru/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## Чему вы научитесь

- Понимать принцип работы унифицированного API шлюза Antigravity
- Освоить форматы запросов/ответов и ограничения JSON Schema
- Узнать, как настроить модели Thinking и вызов функций
- Понять механизмы ограничения скорости и обработки ошибок
- Уметь отлаживать проблемы с вызовами API

---

## Обзор API Antigravity

**Antigravity** — это унифицированный шлюзовой API Google, который через интерфейс в стиле Gemini предоставляет доступ к нескольким моделям искусственного интеллекта, включая Claude и Gemini, обеспечивая единый формат и унифицированную структуру ответов.

::: info Отличие от Vertex AI
Antigravity **не является** прямым API модели Vertex AI. Это внутренний шлюз, предоставляющий:
- Единый формат API (все модели в стиле Gemini)
- Доступ на уровне проекта (через аутентификацию Google Cloud)
- Внутреннюю маршрутизацию к бэкендам моделей (Vertex AI для Claude, Gemini API для Gemini)
- Унифицированный формат ответов (структура `candidates[]`)
:::

**Ключевые особенности**:

| Особенность | Описание |
| --- | --- |
| **Единый формат API** | Все модели используют массив `contents` в стиле Gemini |
| **Доступ на уровне проекта** | Требуется действующий идентификатор проекта Google Cloud |
| **Внутренняя маршрутизация** | Автоматическая маршрутизация к правильному бэкенду (Vertex AI или Gemini API) |
| **Унифицированные ответы** | Все модели возвращают структуру `candidates[]` |
| **Поддержка Thinking** | Claude и Gemini 3 поддерживают расширенные рассуждения |

---

## Конечные точки и пути

### Среды API

| Среда | URL | Статус | Назначение |
| --- | --- | --- | --- |
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Активен | Основная конечная точка (как в CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Активен | Модели Gemini CLI, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ Недоступен | Устарел |

**Расположение исходного кода**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### Пути API

| Действие | Путь | Описание |
| --- | --- | --- |
| Генерация контента | `/v1internal:generateContent` | Непотоковый запрос |
| Потоковая генерация | `/v1internal:streamGenerateContent?alt=sse` | Потоковый запрос (SSE) |
| Загрузка помощника по коду | `/v1internal:loadCodeAssist` | Обнаружение проекта (автоматическое получение Project ID) |
| Онбординг пользователя | `/v1internal:onboardUser` | Онбординг пользователя (обычно не используется) |

---

## Методы аутентификации

### Поток OAuth 2.0

```
URL авторизации: https://accounts.google.com/o/oauth2/auth
URL токена: https://oauth2.googleapis.com/token
```

### Обязательные Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Расположение исходного кода**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Обязательные Headers

#### Конечные точки Antigravity (по умолчанию)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Конечные точки Gemini CLI (модели без суффикса `:antigravity`)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Дополнительный Header для потоковых запросов

```http
Accept: text/event-stream
```

**Расположение исходного кода**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Формат запроса

### Базовая структура

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Массив Contents (обязательно)

::: warning Важное ограничение
Должен использоваться **формат в стиле Gemini**. Массив `messages` в стиле Anthropic **не поддерживается**.
:::

**Правильный формат**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your message here" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Assistant response" }
      ]
    }
  ]
}
```

**Значения Role**:
- `user` - сообщение пользователя/человека
- `model` - ответ модели (**не** `assistant`)

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| Поле | Тип | Описание |
| --- | --- | --- |
| `maxOutputTokens` | number | Максимальное количество токенов в ответе |
| `temperature` | number | Случайность (0.0 - 2.0) |
| `topP` | number | Порог nucleus sampling |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | Триггеры остановки генерации |
| `thinkingConfig` | object | Конфигурация расширенного рассуждения (Thinking модели) |

### System Instructions

::: warning Ограничение формата
System Instruction **должен быть объектом, содержащим `parts`**, **не может** быть простой строкой.
:::

```json
// ✅ Правильно
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ Неправильно - вернет ошибку 400
{
  "systemInstruction": "You are a helpful assistant."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Get weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Правила именования Function

| Правило | Описание |
| --- | --- |
| Первый символ | Должен быть буквой (a-z, A-Z) или подчеркиванием (_) |
| Допустимые символы | `a-zA-Z0-9`, подчеркивание (_), точка (.), двоеточие (:), дефис (-) |
| Максимальная длина | 64 символа |
| Недопустимо | Слэш (/), пробелы, другие специальные символы |

**Примеры**:
- ✅ `get_weather` - допустимо
- ✅ `mcp:mongodb.query` - допустимо (допускается двоеточие и точка)
- ✅ `read-file` - допустимо (допускается дефис)
- ❌ `mcp/query` - недопустимо (не допускается слэш)
- ❌ `123_tool` - недопустимо (должно начинаться с буквы или подчеркивания)

---

## Поддержка JSON Schema

### Поддерживаемые функции

| Функция | Статус | Описание |
| --- | --- | ---|
| `type` | ✅ Поддерживается | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ Поддерживается | Свойства объекта |
| `required` | ✅ Поддерживается | Массив обязательных полей |
| `description` | ✅ Поддерживается | Описание поля |
| `enum` | ✅ Поддерживается | Перечисляемые значения |
| `items` | ✅ Поддерживается | Schema элементов массива |
| `anyOf` | ✅ Поддерживается | Внутренне преобразуется в `any_of` |
| `allOf` | ✅ Поддерживается | Внутренне преобразуется в `all_of` |
| `oneOf` | ✅ Поддерживается | Внутренне преобразуется в `one_of` |
| `additionalProperties` | ✅ Поддерживается | Schema дополнительных свойств |

### Неподдерживаемые функции (вызывают ошибку 400)

::: danger Следующие поля вызовут ошибку 400
- `const` - используйте `enum: [value]` вместо этого
- `$ref` - определяйте schema встроенно
- `$defs` / `definitions` - определяйте встроенно
- `$schema` - удалите эти метаданные
- `$id` - удалите эти метаданные
- `default` - удалите эти документационные поля
- `examples` - удалите эти документационные поля
- `title` (вложенный) - ⚠️ может вызвать проблемы во вложенных объектах
:::

```json
// ❌ Неправильно - вернет ошибку 400
{ "type": { "const": "email" } }

// ✅ Правильно - используйте enum вместо const
{ "type": { "enum": ["email"] } }
```

**Автоматическая обработка плагином**: Плагин автоматически обрабатывает эти преобразования через функцию `cleanJSONSchemaForAntigravity()` в `request-helpers.ts`.

---

## Формат ответа

### Непотоковый ответ

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Response text here" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### Потоковый ответ (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Описание полей ответа

| Поле | Описание |
| --- | ---|
| `response.candidates` | Массив кандидатов ответа |
| `response.candidates[].content.role` | Всегда `"model"` |
| `response.candidates[].content.parts` | Массив частей контента |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | Количество входных токенов |
| `response.usageMetadata.candidatesTokenCount` | Количество выходных токенов |
| `response.usageMetadata.totalTokenCount` | Общее количество токенов |
| `response.usageMetadata.thoughtsTokenCount` | Количество токенов Thinking (Gemini) |
| `response.modelVersion` | Фактически используемая модель |
| `response.responseId` | ID запроса (формат зависит от модели) |
| `traceId` | ID трассировки для отладки |

### Формат Response ID

| Тип модели | Формат | Пример |
| --- | --- | ---|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Стиль Base64 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Стиль Base64 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Ответ Function Call

Когда модель хочет вызвать функцию:

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Предоставление результатов Function

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "What's the weather?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / Расширенные рассуждения

### Конфигурация Thinking

Для моделей с поддержкой Thinking (`*-thinking`):

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning Важное ограничение
`maxOutputTokens` должен быть **больше** чем `thinkingBudget`
:::

### Ответ Thinking (Gemini)

Модели Gemini возвращают thinking с подписью:

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Let me think about this..."
    },
    {
      "text": "The answer is..."
    }
  ]
}
```

### Ответ Thinking (Claude)

Модели Claude thinking могут включать части с `thought: true`:

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Reasoning process...",
      "thoughtSignature": "..."
    },
    {
      "text": "Final answer..."
    }
  ]
}
```

**Обработка плагином**: Плагин автоматически кэширует подписи thinking для предотвращения ошибок подписи в многораундовых диалогах. Подробнее см. [advanced/session-recovery/](/ru/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/).

---

## Ответы об ошибках

### Структура ошибки

```json
{
  "error": {
    "code": 400,
    "message": "Error description",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### Коды распространенных ошибок

| Code | Status | Описание |
| --- | --- | ---|
| 400 | `INVALID_ARGUMENT` | Неверный формат запроса |
| 401 | `UNAUTHENTICATED` | Недействительный или просроченный токен |
| 403 | `PERMISSION_DENIED` | Нет доступа к ресурсу |
| 404 | `NOT_FOUND` | Модель не найдена |
| 429 | `RESOURCE_EXHAUSTED` | Превышено ограничение скорости |

### Ответ при ограничении скорости

```json
{
  "error": {
    "code": 429,
    "message": "You have exhausted your capacity on this model. Your quota will reset after 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**Обработка плагином**: Плагин автоматически обнаруживает ошибки 429, переключает аккаунты или ожидает время сброса. Подробнее см. [advanced/rate-limit-handling/](/ru/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/).

---

## Неподдерживаемые функции

Следующие функции Anthropic/Vertex AI **не поддерживаются**:

| Функция | Ошибка |
| --- | ---|
| `anthropic_version` | Unknown field |
| Массив `messages` | Unknown field (должен использоваться `contents`) |
| `max_tokens` | Unknown field (должен использоваться `maxOutputTokens`) |
| Строковая `systemInstruction` | Invalid value (должен использоваться формат объекта) |
| `system_instruction` (корневой snake_case) | Unknown field |
| `const` JSON Schema | Unknown field (используйте `enum: [value]` вместо этого) |
| `$ref` JSON Schema | Не поддерживается (определяйте встроенно) |
| `$defs` JSON Schema | Не поддерживается (определяйте встроенно) |
| Имя Tool содержит `/` | Invalid (используйте `_` или `:` вместо этого) |
| Имя Tool начинается с цифры | Invalid (должно начинаться с буквы или подчеркивания) |

---

## Полный пример запроса

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello, how are you?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "You are a helpful assistant." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## Headers ответа

| Header | Описание |
| --- | ---|
| `x-cloudaicompanion-trace-id` | ID трассировки для отладки |
| `server-timing` | Длительность запроса |

---

## Сравнение Antigravity и Vertex AI Anthropic

| Характеристика | Antigravity | Vertex AI Anthropic |
| --- | --- | ---|
| Конечная точка | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Формат запроса | Gemini-стиль `contents` | Anthropic `messages` |
| `anthropic_version` | Не используется | Обязательно |
| Имена моделей | Простые (`claude-sonnet-4-5`) | Версионные (`claude-4-5@date`) |
| Формат ответа | `candidates[]` | Anthropic `content[]` |
| Поддержка нескольких моделей | Да (Claude, Gemini и др.) | Только Anthropic |

---

## Резюме урока

В этом учебнике подробно описана внутренняя спецификация унифицированного шлюзового API Antigravity:

- **Конечные точки**: Три среды (Daily, Production, Autopush), основная конечная точка — Daily Sandbox
- **Аутентификация**: OAuth 2.0 + Bearer Token, обязательные scopes и headers
- **Формат запроса**: Gemini-стиль массива `contents`, поддержка System Instruction и Tools
- **JSON Schema**: Поддержка распространенных функций, но не `const`, `$ref`, `$defs`
- **Формат ответа**: Структура `candidates[]`, поддержка потокового SSE
- **Thinking**: Claude и Gemini 3 поддерживают расширенные рассуждения, требуется `thinkingConfig`
- **Обработка ошибок**: Стандартный формат ошибок, 429 включает задержку повторной попытки

Если вы сталкиваетесь с проблемами при отладке вызовов API, можете использовать режим отладки плагина:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Превью следующего урока

> Это последний раздел приложения. Если вы хотите узнать больше технических деталей, можно обратиться к:
> - [Обзор архитектуры](/ru/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) — узнать о модульной архитектуре плагина и цепочке вызовов
> - [Формат хранения](/ru/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) — узнать о формате файлов хранения аккаунтов
> - [Опции конфигурации](/ru/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) — полный справочник по всем опциям конфигурации

Если вам нужно вернуться к началу, можно начать заново с раздела [Что такое Antigravity Auth](/ru/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/).

---

## Приложение: Ссылки на исходный код

<details>
<summary><strong>Нажмите, чтобы развернуть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Строки |
| --- | --- | ---|
| Константы конечных точек API | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Основная логика преобразования запросов | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| Очистка JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Весь файл |
| Кэширование подписей thinking | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Весь файл |

**Ключевые константы**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Конечная точка Daily Sandbox
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production конечная точка
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - ID проекта по умолчанию
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Сигнальное значение для пропуска проверки подписи thinking

**Ключевые функции**:
- `cleanJSONSchemaForAntigravity(schema)` - Очищает JSON Schema в соответствии с требованиями API Antigravity
- `prepareAntigravityRequest(request)` - Подготавливает и отправляет запрос к API Antigravity
- `createStreamingTransformer()` - Создает трансформатор для потоковых ответов

</details>
