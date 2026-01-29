---
title: "Интеграция z.ai: подробности границ возможностей | Antigravity-Manager"
sidebarTitle: "Справочник границ z.ai"
subtitle: "Интеграция z.ai: подробности границ возможностей"
description: "Освойте границы интеграции z.ai в Antigravity Tools. Узнайте маршрутизацию запросов, разделение потоков dispatch_mode, сопоставление моделей, стратегию безопасности заголовков, а также обратный прокси и ограничения MCP, избегайте неправильных суждений."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "Границы возможностей"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# Границы возможностей интеграции z.ai (реализовано vs явно не реализовано)

Этот документ рассказывает только о "границах" интеграции z.ai в Antigravity Tools, не о "как подключить". Если вы обнаружите, что какая-то возможность не работает, сначала сравните здесь: она не включена, не настроена, или вообще не реализована.

## Чему вы научитесь

- Определить, стоит ли рассчитывать на z.ai для дела: что "реализовано", что "документ явно не сделал"
- Понять, на какие точки доступа влияет z.ai (и какие точки доступа совсем не затрагиваются)
- Увидеть доказательства исходного кода/документа для каждого вывода (с ссылками на строки GitHub), удобно для вашей собственной проверки

## Ваша текущая проблема

Вы уже открыли z.ai в Antigravity Tools, но при использовании вы столкнулись с этими сомнениями:

- Почему некоторые запросы идут на z.ai, некоторые совсем не идут?
- Можно ли использовать точки доступа MCP как "полный MCP Server"?
- Переключатели, видимые в UI, действительно соответствуют реальной реализации?

## Что такое интеграция z.ai (в этом проекте)?

**Интеграция z.ai** в Antigravity Tools - это необязательный "апстрим провайдер + расширение MCP". Он принимает запросы протокола Claude только при определенных условиях и предоставляет обратный прокси MCP Search/Reader и минимальный встроенный сервер Vision MCP; это не решение полной замены всех протоколов и всех возможностей.

::: info Одно предложение для запоминания
Вы можете рассматривать z.ai как "необязательный апстрим для запросов Claude +一组 переключаемых точек доступа MCP", не считайте это "полностью перенести все возможности z.ai".
:::

## Реализовано: стабильно доступно (основано на исходном коде)

### 1) Только протокол Claude идет на z.ai (/v1/messages + /v1/messages/count_tokens)

Пересылка апстрима Anthropic z.ai происходит только в ветке z.ai Claude handler:

- `POST /v1/messages`: когда `use_zai=true`, вызывает `forward_anthropic_json(...)` для пересылки JSON запроса на точку доступа Anthropic совместимости z.ai
- `POST /v1/messages/count_tokens`: когда z.ai включен, также пересылается; иначе возвращает placeholder `{input_tokens:0, output_tokens:0}`

Доказательства:

- выбор ветки z.ai и точка входа пересылки: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- ветка z.ai count_tokens и возвращение placeholder: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- реализация пересылки Anthropic z.ai: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip Как понимать "потоковый ответ"?
`forward_anthropic_json` вернет тело ответа апстрима клиенту потоково через `bytes_stream()`, не разбирая SSE (см. построение тела ответа в `providers/zai_anthropic.rs`).
:::

### 2) "Реальное значение" режима планирования (dispatch_mode)

`dispatch_mode` определяет, будет ли `/v1/messages` идти на z.ai:

| dispatch_mode | Что произойдет | Доказательство |
| --- | --- | --- |
| `off` | Никогда не использовать z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | Все запросы Claude идут на z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Пул Google недоступен (0 аккаунтов или "нет доступных аккаунтов") тогда идти на z.ai | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | Использовать z.ai как "дополнительный слот" в round-robin (не гарантирует попадание) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Распространенное недопонимание pooled
`pooled` - это не "и z.ai, и пул аккаунтов Google используются, и стабильное разделение по весу". В коде явно написано "no strict guarantees", по сути это слот round-robin (на z.ai идет только когда `slot == 0`).
:::

### 3) Сопоставление моделей: как имена моделей Claude превращаются в glm-* z.ai?

Перед пересылкой на z.ai, если в теле запроса есть поле `model`, оно будет переписано:

1. Точное сопоставление `proxy.zai.model_mapping` (одновременно поддерживает исходную строку и lower-case key)
2. Префикс `zai:<model>`: убрать `zai:` и использовать напрямую
3. `glm-*`: оставить без изменений
4. Не `claude-*`: оставить без изменений
5. `claude-*` и содержит `opus/haiku`: сопоставить с `proxy.zai.models.opus/haiku`; иначе по умолчанию `sonnet`

Доказательство: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Стратегия безопасности заголовков при пересылке (избегать утечки локального ключа прокси)

Пересылка апстрима z.ai не "пронесет все заголовки как есть", а сделала две линии защиты:

- Пропустить только небольшую часть заголовков (например, `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Ввести ключ API z.ai в апстрим (приоритет сохранить метод аутентификации, используемый клиентом: `x-api-key` или `Authorization: Bearer ...`)

Доказательства:

- Белый список заголовков: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Введение z.ai auth: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Реализовано: MCP (обратный прокси Search/Reader + встроенный Vision)

### 1) MCP Search/Reader: обратный прокси к точкам доступа MCP z.ai

Локальные точки доступа и адрес апстрима жестко прописаны:

| Локальная точка доступа | Адрес апстрима | Переключатель | Доказательство |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 не "сетевая проблема"
Пока `proxy.zai.mcp.enabled=false`, или соответствующий `web_search_enabled/web_reader_enabled=false`, эти точки доступа напрямую вернут 404.
:::

Доказательства:

- Общий переключатель MCP и проверка ключа z.ai: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Регистрация маршрутов: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: встроенный сервер "минимальный Streamable HTTP MCP"

Vision MCP - это не обратный прокси, это локальная встроенная реализация:

- Точка доступа: `/mcp/zai-mcp-server/mcp`
- `POST` поддерживает: `initialize`, `tools/list`, `tools/call`
- `GET` возвращает SSE keepalive (требует инициализированную сессию)
- `DELETE` завершает сессию

Доказательства:

- Основная точка входа handler и диспетчеризация методов: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Реализация `initialize`, `tools/list`, `tools/call`: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Позиционирование "минимальной реализации" Vision MCP: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Набор инструментов Vision MCP (8 штук) и ограничение размера файла

Список инструментов из `tool_specs()`:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Доказательство: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Локальные файлы будут прочитаны и закодированы в `data:<mime>;base64,...`, при этом есть жесткое ограничение:

- Верхний предел изображений 5 МБ (`image_source_to_content(..., 5)`)
- Верхний предел видео 8 МБ (`video_source_to_content(..., 8)`)

Доказательство: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## Явно не реализовано / Не ожидайте (основано на заявлениях документа и деталях реализации)

### 1) Мониторинг использования/бюджета z.ai не реализован

`docs/zai/implementation.md` явно написано "not implemented yet". Это означает:

- Вы не можете рассчитывать на Antigravity Tools для предоставления запроса/бюджета z.ai или оповещений
- Управление квотой (Quota Protection) также не будет автоматически считывать данные бюджета/использования z.ai

Доказательство: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP не является полным MCP Server

Vision MCP в настоящее время позиционируется как "минимальная реализация, достаточно для вызова инструментов": prompts/resources, resumability, streamed tool output и т.д. еще не сделаны.

Доказательство: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` не будет отражать реальный список моделей z.ai

Список моделей, возвращаемый этой точкой доступа, поступает из локального встроенного сопоставления и пользовательского сопоставления (`get_all_dynamic_models`), не будет запрашивать `/v1/models` апстрима z.ai.

Доказательства:

- handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- логика генерации списка: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Справочник полей конфигурации (связано с z.ai)

Конфигурация z.ai находится в `ProxyConfig.zai`, включает эти поля:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (точное сопоставление покрытие)
- `models.{opus,sonnet,haiku}` (сопоставление по умолчанию для семейства Claude)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Значения по умолчанию (base_url / модели по умолчанию) также в том же файле:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Доказательство: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Краткий итог урока

- z.ai в настоящее время будет принимать только протокол Claude (`/v1/messages` + `count_tokens`), другие точки доступа протокола не "автоматически идут на z.ai"
- MCP Search/Reader - это обратный прокси; Vision MCP - это локальная минимальная реализация, не полный MCP Server
- Список моделей `/v1/models/claude` поступает из локального сопоставления, не представляет реальные модели апстрима z.ai

---

## Следующий урок预告

> Следующий урок мы изучим **[Версионная эволюция](/ru/lbjlaq/Antigravity-Manager/changelog/release-notes/)**.

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы увидеть местоположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Строки |
| --- | --- | --- |
| Область интеграции z.ai (протокол Claude + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| Режим планирования z.ai и значения по умолчанию моделей | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai base_url по умолчанию / модели по умолчанию | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| Логика выбора, идет ли `/v1/messages` на z.ai | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| Пересылка z.ai `/v1/messages/count_tokens` и возвращение placeholder | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| Пересылка апстрима Anthropic z.ai (пересылка JSON + потоковый возврат ответа) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| Правила сопоставления моделей z.ai (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Белый список заголовков + введение z.ai auth | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| Обратный прокси MCP Search/Reader и переключатели | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Встроенный сервер Vision MCP (GET/POST/DELETE + JSON-RPC) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Позиционирование минимальной реализации Vision MCP (не полный MCP Server) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Список инструментов Vision и ограничения (tool_specs + размер файла + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| Источник списка моделей `/v1/models/claude` (локальное сопоставление, не запрос к апстриму) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Мониторинг использования/бюджета не реализован (заявление документа) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
