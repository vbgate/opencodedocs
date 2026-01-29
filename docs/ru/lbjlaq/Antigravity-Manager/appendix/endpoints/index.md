---
title: "Справочник по точкам доступа: обзор маршрутов HTTP | Antigravity-Manager"
sidebarTitle: "Мгновенно просмотреть все маршруты"
subtitle: "Справочник по точкам доступа: обзор маршрутов HTTP для внешнего доступа"
description: "Научитесь распределению конечных точек HTTP шлюза Antigravity. С помощью таблицы сопоставьте маршруты OpenAI/Anthropic/Gemini/MCP, освоите использование режима аутентификации и заголовка API Key."
tags:
  - "Справочник по точкам доступа"
  - "Ссылка на API"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# Справочник по точкам доступа: обзор маршрутов HTTP для внешнего доступа

## Чему вы научитесь

- Быстро найти путь к вызываемой точке доступа
- Понять распределение точек доступа разных протоколов
- Узнать специальные правила режима аутентификации и проверки работоспособности

## Обзор точек доступа

Локальный reverse proxy Antigravity Tools предоставляет следующие типы точек доступа:

| Классификация протоколов | Назначение | Типичные клиенты |
|--- | --- | ---|
| **Протокол OpenAI** | Совместимость с общими AI приложениями | OpenAI SDK / Совместимые клиенты |
| **Протокол Anthropic** | Вызовы серии Claude | Claude Code / Anthropic SDK |
| **Протокол Gemini** | Официальный SDK Google | Google Gemini SDK |
| **Точки доступа MCP** | Улучшение вызова инструментов | Клиенты MCP |
| **Внутренние/вспомогательные** | Проверка работоспособности, перехват/внутренние возможности | Автоматизированные скрипты / Мониторинг работоспособности |

---

## Точки доступа протокола OpenAI

Эти точки доступа совместимы с форматом API OpenAI, подходят для большинства клиентов, поддерживающих OpenAI SDK.

| Метод | Путь | Точка входа маршрута (Rust handler) | Примечания |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | Совместимость с OpenAI: список моделей |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | Совместимость с OpenAI: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | Совместимость с OpenAI: Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | Совместимость с OpenAI: запросы Codex CLI (тот же handler, что и `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | Совместимость с OpenAI: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | Совместимость с OpenAI: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | Совместимость с OpenAI: Audio Transcriptions |

::: tip Совместимость
Точка доступа `/v1/responses` специально разработана для Codex CLI, фактически использует ту же логику обработки, что и `/v1/completions`.
:::

---

## Точки доступа протокола Anthropic

Эти точки доступа организованы по пути и формату запросов API Anthropic, для вызовов Claude Code / Anthropic SDK.

| Метод | Путь | Точка входа маршрута (Rust handler) | Примечания |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Совместимость с Anthropic: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Совместимость с Anthropic: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Совместимость с Anthropic: список моделей |

---

## Точки доступа протокола Gemini

Эти точки доступа совместимы с форматом API Google Gemini, можно напрямую использовать официальный SDK Google.

| Метод | Путь | Точка входа маршрута (Rust handler) | Примечания |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Нативный Gemini: список моделей |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Нативный Gemini: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Нативный Gemini: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Нативный Gemini: countTokens |

::: warning Пояснение к пути
`/v1beta/models/:model` одновременно регистрирует GET и POST в одном и том же пути (см. определение маршрута).
:::

---

## Точки доступа MCP

Точки доступа MCP (Model Context Protocol) используются для внешнего предоставления интерфейсов "вызова инструментов" (обрабатываются `handlers::mcp::*`). Включены ли и конкретное поведение зависят от конфигурации; детали см. [Точки доступа MCP](/ru/lbjlaq/Antigravity-Manager/platforms/mcp/).

| Метод | Путь | Точка входа маршрута (Rust handler) | Примечания |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details Пояснение по MCP
Область применения и границы MCP см. в [Границы возможностей интеграции z.ai (реализовано vs явно не реализовано)](../zai-boundaries/).
:::

---

## Внутренние и вспомогательные точки доступа

Эти точки доступа используются для внутренних функций и внешнего мониторинга.

| Метод | Путь | Точка входа маршрута (Rust handler) | Примечания |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Внутренняя точка доступа для прогрева |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Перехват логов телеметрии: напрямую возвращает 200 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Перехват логов телеметрии: напрямую возвращает 200 |
| GET | `/healthz` | `health_check_handler` | Проверка работоспособности: возвращает `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Автоматическое обнаружение модели |

::: tip Бесшумная обработка
Точки доступа логов событий напрямую возвращают `200 OK`, не выполняют реальную обработку, используются для перехвата отчетов телеметрии клиентов.
:::

::: warning Нужно ли этим точкам доступа API Key?
За исключением `GET /healthz`, который может быть освобожден, нужны ли другие маршруты с ключом, решает "эффективный режим" `proxy.auth_mode` (см. ниже "Режим аутентификации" и `auth_middleware` в исходном коде).
:::

---

## Режим аутентификации

Разрешения доступа всех точек доступа управляются `proxy.auth_mode`:

| Режим | Описание | `/healthz` требует аутентификации? | Другие точки доступа требуют аутентификации? |
|--- | --- | --- | ---|
| `off` | Полностью открыт | ❌ Нет | ❌ Нет |
| `strict` | Все требуют аутентификации | ✅ Да | ✅ Да |
| `all_except_health` | Только проверка работоспособности открыта | ❌ Нет | ✅ Да |
| `auto` | Автоматическое определение (по умолчанию) | ❌ Нет | Зависит от `allow_lan_access` |

::: info Логика режима auto
`auto` не является независимой стратегией, а выводится из конфигурации: когда `proxy.allow_lan_access=true` эквивалентно `all_except_health`, иначе эквивалентно `off` (см. `docs/proxy/auth.md`).
:::

**Формат запроса аутентификации**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (стиль OpenAI)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (стиль Gemini)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (стиль OpenAI)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (стиль Gemini)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Краткое итог этого раздела

Antigravity Tools предоставляет полный набор точек доступа совместимости с несколькими протоколами, поддерживая три основных формата API OpenAI, Anthropic, Gemini, а также расширение вызова инструментов MCP.

- **Быстрая интеграция**: приоритетное использование точек доступа протокола OpenAI, самая сильная совместимость
- **Нативные функции**: используйте точки доступа протокола Anthropic, когда нужна полная функциональность Claude Code
- **Экосистема Google**: используйте официальный SDK Google для выбора точек доступа протокола Gemini
- **Безопасная конфигурация**: выберите подходящий режим аутентификации в зависимости от сценария использования (локальный/LAN/публичная сеть)

---

## Следующий урок预告

> Следующий урок мы изучим **[Данные и модели](../storage-models/)**.
>
> Вы узнаете:
> - Структура хранения файлов аккаунтов
> - Структура таблицы базы данных статистики SQLite
> - Определение ключевых полей и стратегия резервного копирования

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы увидеть местоположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Строки |
|--- | --- | ---|
| Регистрация маршрутов (все точки доступа) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Middleware аутентификации (совместимость заголовков + исключение `/healthz` + разрешение OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| Режим auth_mode и правила вывода auto | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| Возвращаемое значение `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Перехват логов телеметрии (silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Ключевые функции**:
- `AxumServer::start()`: Запустить сервер Axum и зарегистрировать маршруты (строки 79-254)
- `health_check_handler()`: Обработка проверки работоспособности (строки 266-272)
- `silent_ok_handler()`: Обработка бесшумного успеха (строки 274-277)

</details>
