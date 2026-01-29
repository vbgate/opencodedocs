---
title: "Сбой аутентификации: устранение ошибки 401 | Antigravity-Manager"
sidebarTitle: "Решить 401 за 3 минуты"
subtitle: "401/Сбой аутентификации: сначала посмотрите auth_mode, затем заголовки"
description: "Научитесь механизму аутентификации прокси Antigravity Tools, устраните ошибки 401. Найдите проблему в порядке auth_mode, api_key, Header, поймите правила режима auto и исключение /healthz, избегайте ошибок приоритета заголовка."
tags:
  - "FAQ"
  - "Аутентификация"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/Сбой аутентификации: сначала посмотрите auth_mode, затем заголовки

## Чему вы научитесь

- За 3 минуты определить, блокируется ли 401 middleware аутентификации Antigravity Tools
- Понять "фактическое эффективное значение" четырех режимов `proxy.auth_mode` (особенно `auto`) при вашей текущей конфигурации
- Использовать правильные заголовки API Key (и избегать ошибок приоритета заголовков), чтобы запрос прошел

## Ваша текущая проблема

Клиент вызывает локальный reverse proxy и получает ошибку `401 Unauthorized`:
- Python/OpenAI SDK: выбрасывает `AuthenticationError`
- curl: возвращает `HTTP/1.1 401 Unauthorized`
- HTTP клиент: код состояния ответа 401

## Что такое 401/Сбой аутентификации?

**401 Unauthorized** в Antigravity Tools чаще всего означает: прокси включил аутентификацию (определяется `proxy.auth_mode`), но запрос не принес правильный API Key или принес неправильный заголовок с более высоким приоритетом, поэтому `auth_middleware()` возвращает 401.

::: info Сначала подтвердите, блокирует ли "прокси"
Апстрим платформы также может вернуть 401, но это FAQ касается только "401, вызванного аутентификацией прокси". Вы можете быстро отличить с помощью `/healthz` ниже.
:::

## Быстрое устранение неполадок (делайте в этом порядке)

### Шаг 1: Используйте `/healthz`, чтобы определить, "блокирует ли аутентификация"

**Зачем**
`all_except_health` пропустит `/healthz`, но заблокирует другие маршруты; это поможет быстро определить, 401 ли от слоя аутентификации прокси.

```bash
 # Без заголовков аутентификации
curl -i http://127.0.0.1:8045/healthz
```

**Вы должны увидеть**
- При `auth_mode=all_except_health` (или `auto` и `allow_lan_access=true`): обычно возвращает `200`
- При `auth_mode=strict`: возвращает `401`

::: tip `/healthz` в слое маршрутов - GET
В маршрутах прокси регистрируется `GET /healthz` (см. `src-tauri/src/proxy/server.rs`).
:::

---

### Шаг 2: Подтвердите "фактическое эффективное значение" `auth_mode` (особенно `auto`)

**Зачем**
`auto` - это не "независимая стратегия", она рассчитывает реальный режим выполнения в зависимости от `allow_lan_access`.

| `proxy.auth_mode` | Дополнительные условия | Фактическое эффективное значение (effective mode) |
|--- | --- | ---|
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**Вы можете проверить в GUI на странице API Proxy**: `Allow LAN Access` и `Auth Mode`.

---

### Шаг 3: Подтвердите, что `api_key` не пуст, и вы используете одно и то же значение

**Зачем**
Когда аутентификация включена, если `proxy.api_key` пуст, `auth_middleware()` сразу отклонит все запросы и запишет ошибку в лог.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**Вы должны увидеть**
- На странице API Proxy вы можете увидеть ключ, начинающийся с `sk-` (значение по умолчанию в `ProxyConfig::default()` будет автоматически сгенерировано)
- После нажатия "Regenerate/редактировать" и сохранения, внешние запросы сразу проверяются по новому ключу (перезапуск не требуется)

---

### Шаг 4: Попробуйте один раз с самым простым заголовком (сначала не используйте сложные SDK)

**Зачем**
Middleware сначала считывает `Authorization`, затем `x-api-key`, наконец `x-goog-api-key`. Если вы отправили несколько заголовков одновременно, и первый неправильный, даже если следующий правильный, он не будет использован.

```bash
 # Рекомендуемый формат: Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**Вы должны увидеть**: `HTTP/1.1 200 OK` (или минимум больше не 401)

::: info Детали совместимости прокси с Authorization
`auth_middleware()` разобьет значение `Authorization` по префиксу `Bearer ` один раз; если нет префикса `Bearer `, все значение будет использовано как ключ для сравнения. В документации все равно рекомендуется `Authorization: Bearer <key>` (более соответствует общепринятым соглашениям SDK).
:::

**Если вы должны использовать `x-api-key`**:

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## Распространенные ошибки (все реально возникают в исходном коде)

| Симптом | Реальная причина | Как изменить |
|--- | --- | ---|
| `auth_mode=auto`, но локальный вызов все равно 401 | `allow_lan_access=true` вызывает `auto` действовать как `all_except_health` | Отключите `allow_lan_access` или попросите клиента принести ключ |
| Вы думаете "я явно принес x-api-key", но все равно 401 | Одновременно принес неправильный `Authorization`, middleware использует его приоритетно | Удалите лишние заголовки, оставьте только тот, который вы уверены правильный |
| `Authorization: Bearer<key>` все равно 401 | После `Bearer` нет пробела, нельзя отделить по префиксу `Bearer ` | Измените на `Authorization: Bearer <key>` |
| Все запросы 401, в логах появляется `api_key is empty` | `proxy.api_key` пуст | В GUI сгенерируйте/настройте непустой ключ снова |

## Краткий итог урока

- Сначала используйте `/healthz`, чтобы определить, 401 ли от слоя аутентификации прокси
- Затем подтвердите `auth_mode` (особенно effective mode `auto`)
- Наконец, принесьте один правильный заголовок для проверки (избегайте ошибок приоритета заголовков)

## Следующий урок预告

> Следующий урок мы изучим **[429/Ошибка емкости: правильные ожидания ротации аккаунтов и заблуждения об исчерпании емкости модели](../429-rotation/)**.
>
> Вы узнаете:
> - 429 - это "недостаток квоты" или "ограничение скорости апстрима"
> - Правильные ожидания ротации аккаунтов (когда автоматически переключается, а когда нет)
> - С помощью конфигурации снизить вероятность 429

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы увидеть местоположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция        | Путь к файлу                                                                                             | Строки    |
|--- | --- | ---|
| Перечисление ProxyAuthMode | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key и значения по умолчанию | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| Разбор режима auto (effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| Middleware аутентификации (извлечение заголовков и приоритет, исключение /healthz, разрешение OPTIONS) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| Регистрация маршрута /healthz и порядок middleware | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| Документация аутентификации (режимы и соглашения клиентов) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**Ключевые перечисления**:
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`: режимы аутентификации

**Ключевые функции**:
- `ProxySecurityConfig::effective_auth_mode()`: разобрать `auto` в реальную стратегию
- `auth_middleware()`: выполнить аутентификацию (включая порядок извлечения заголовков и исключение /healthz)

</details>
