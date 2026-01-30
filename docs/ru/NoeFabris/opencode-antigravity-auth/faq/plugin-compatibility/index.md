---
title: "Совместимость плагинов: Решение распространенных конфликтов | Antigravity Auth"
sidebarTitle: "Конфликты плагинов"
subtitle: "Решение проблем совместимости с другими плагинами"
description: "Узнайте, как решать проблемы совместимости Antigravity Auth с плагинами oh-my-opencode, DCP и другими. Настройте правильный порядок загрузки плагинов и отключите конфликтующие методы аутентификации."
tags:
  - "FAQ"
  - "Конфигурация плагинов"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# Решение проблем совместимости с другими плагинами

**Совместимость плагинов** — распространенная проблема при использовании Antigravity Auth. Различные плагины могут конфликтовать друг с другом, вызывая сбои аутентификации, потерю thinking blocks или ошибки формата запросов. Этот учебник поможет вам решить проблемы совместимости с плагинами oh-my-opencode, DCP и другими.

## Что вы сможете сделать после изучения

- Правильно настроить порядок загрузки плагинов, избегая проблем DCP
- Отключить конфликтующие методы аутентификации в oh-my-opencode
- Идентифицировать и удалить ненужные плагины
- Включить смещение PID для сценариев с параллельными агентами

## Распространенные проблемы совместимости

### Проблема 1: Конфликт с oh-my-opencode

**Симптомы**:
- Сбой аутентификации или повторное появление окна авторизации OAuth
- Модель возвращает ошибки 400 или 401
- Конфигурация агент-модели не применяется

**Причина**: oh-my-opencode по умолчанию включает встроенную Google-аутентификацию, которая конфликтует с потоком OAuth Antigravity Auth.

::: warning Ключевая проблема
oh-my-opencode перехватывает все запросы к Google-моделям и использует свой собственный метод аутентификации. Это приводит к тому, что OAuth-токены Antigravity Auth не могут быть использованы.
:::

**Решение**:

Отредактируйте `~/.config/opencode/oh-my-opencode.json`, добавив следующую конфигурацию:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Описание конфигурации**:

| Параметр конфигурации | Значение | Описание |
| --- | --- | --- |
| `google_auth` | `false` | Отключить встроенную Google-аутентификацию oh-my-opencode |
| `agents.<agent-name>.model` | `google/antigravity-*` | Переопределить модель агента на Antigravity-модель |

**Контрольная точка ✅**:

- После сохранения конфигурации перезапустите OpenCode
- Проверьте, использует ли агент Antigravity-модель
- Убедитесь, что окно авторизации OAuth больше не появляется

---

### Проблема 2: Конфликт с DCP (@tarquinen/opencode-dcp)

**Симптомы**:
- Модель Claude Thinking возвращает ошибку: `thinking must be first block in message`
- В истории диалога отсутствуют thinking blocks
- Содержимое мышления не отображается

**Причина**: Синтетические сообщения ассистента, создаваемые DCP, не содержат thinking blocks, что конфликтует с требованиями Claude API.

::: info Что такое synthetic messages?
Synthetic messages — это сообщения, автоматически генерируемые плагином или системой для исправления истории диалога или дополнения недостающих сообщений. DCP в некоторых сценариях создает эти сообщения, но не добавляет thinking blocks.
:::

**Решение**:

Убедитесь, что Antigravity Auth загружается **до** DCP. Отредактируйте `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**Зачем нужен этот порядок**:

- Antigravity Auth обрабатывает и исправляет thinking blocks
- DCP создает synthetic messages (возможно, без thinking blocks)
- Если DCP загружается раньше, Antigravity Auth не может исправить сообщения, созданные DCP

**Контрольная точка ✅**:

- Убедитесь, что `opencode-antigravity-auth` указан перед `@tarquinen/opencode-dcp`
- Перезапустите OpenCode
- Проверьте, отображается ли содержимое мышления в Thinking-модели нормально

---

### Проблема 3: Распределение аккаунтов в сценариях с параллельными агентами

**Симптомы**:
- Несколько параллельных агентов используют один и тот же аккаунт
- При достижении лимита скорости все агенты завершаются ошибкой одновременно
- Низкий уровень использования квоты

**Причина**: По умолчанию несколько параллельных агентов используют одну и ту же логику выбора аккаунта, что может привести к одновременному использованию одного аккаунта.

::: tip Сценарий с параллельными агентами
Когда вы используете функцию параллелизма Cursor (например, одновременно запускаете несколько агентов), каждый агент независимо отправляет запросы к модели. Без правильного распределения аккаунтов они могут "столкнуться" друг с другом.
:::

**Решение**:

Отредактируйте `~/.config/opencode/antigravity.json`, включив смещение PID:

```json
{
  "pid_offset_enabled": true
}
```

**Что такое PID-смещение?**

PID-смещение (Process ID) позволяет каждому параллельному агенту использовать разный начальный индекс аккаунта:

```
Агент 1 (PID 100) → Аккаунт 0
Агент 2 (PID 101) → Аккаунт 1
Агент 3 (PID 102) → Аккаунт 2
```

Так даже при одновременной отправке запросов не будет использован один и тот же аккаунт.

**Предварительные условия**:
- Требуется как минимум 2 аккаунта Google
- Рекомендуется включить `account_selection_strategy: "round-robin"` или `"hybrid"`

**Контрольная точка ✅**:

- Убедитесь, что настроено несколько аккаунтов (выполните `opencode auth list`)
- Включите `pid_offset_enabled: true`
- Проверьте, используют ли параллельные агенты разные аккаунты (просмотрите логи отладки)

---

### Проблема 4: Ненужные плагины

**Симптомы**:
- Конфликты аутентификации или повторная аутентификация
- Сбои загрузки плагинов или предупреждения
- Путаница в конфигурации, неясно какие плагины активны

**Причина**: Установлены плагины с перекрывающейся функциональностью.

::: tip Проверка избыточных плагинов
Регулярно проверяйте список плагинов в `config.json` и удаляйте ненужные плагины, чтобы избежать конфликтов и проблем с производительностью.
:::

**Ненужные плагины**:

| Тип плагина | Примеры | Причина |
| --- | --- | ---|
| **gemini-auth плагины** | `opencode-gemini-auth`, `@username/gemini-auth` | Antigravity Auth уже обрабатывает всю Google OAuth |
| **Claude аутентификация** | `opencode-claude-auth` | Antigravity Auth не использует Claude аутентификацию |

**Решение**:

Удалите эти плагины из `~/.config/opencode/config.json`:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // Удалите эти:
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**Контрольная точка ✅**:

- Просмотрите список плагинов в `~/.config/opencode/config.json`
- Удалите все плагины gemini-auth
- Перезапустите OpenCode, убедитесь в отсутствии конфликтов аутентификации

---

## Распространенные ошибки и их устранение

### Ошибка 1: `thinking must be first block in message`

**Возможные причины**:
- DCP загружается до Antigravity Auth
- Session recovery в oh-my-opencode конфликтует с Antigravity Auth

**Шаги устранения**:

1. Проверьте порядок загрузки плагинов:
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Убедитесь, что Antigravity Auth указан перед DCP

3. Если проблема сохраняется, попробуйте отключить session recovery в oh-my-opencode (если доступно)

### Ошибка 2: `invalid_grant` или сбой аутентификации

**Возможные причины**:
- `google_auth` в oh-my-opencode не отключен
- Несколько плагинов аутентификации одновременно пытаются обработать запрос

**Шаги устранения**:

1. Проверьте конфигурацию oh-my-opencode:
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. Убедитесь, что значение `false`

3. Удалите другие плагины gemini-auth

### Ошибка 3: Параллельные агенты используют один и тот же аккаунт

**Возможные причины**:
- `pid_offset_enabled` не включен
- Количество аккаунтов меньше количества агентов

**Шаги устранения**:

1. Проверьте конфигурацию Antigravity:
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. Убедитесь, что значение `true`

3. Проверьте количество аккаунтов:
   ```bash
   opencode auth list
   ```

4. Если аккаунтов меньше, чем агентов, рекомендуется добавить больше аккаунтов

---

## Примеры конфигурации

### Полный пример конфигурации (с oh-my-opencode)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## Резюме урока

Проблемы совместимости плагинов обычно вызваны конфликтами аутентификации, порядком загрузки плагинов или перекрывающейся функциональностью. Правильная конфигурация позволяет:

- ✅ Отключить встроенную Google-аутентификацию oh-my-opencode (`google_auth: false`)
- ✅ Убедиться, что Antigravity Auth загружается перед DCP
- ✅ Включить PID-смещение для параллельных агентов (`pid_offset_enabled: true`)
- ✅ Удалить избыточные gemini-auth плагины

Эти настройки позволяют избежать большинства проблем совместимости и обеспечивают стабильную работу вашего окружения OpenCode.

## Следующий урок

> В следующем уроке мы изучим **[Руководство по миграции](../migration-guide/)**.
>
> Вы узнаете:
> - Как мигрировать конфигурацию аккаунтов между машинами
> - Как обрабатывать изменения конфигурации при обновлении версий
> - Как создавать резервные копии и восстанавливать данные аккаунтов

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть информацию о расположении исходного кода</strong></summary>

> Последнее обновление: 2026-01-23

| Функциональность | Путь к файлу | Строки |
| --- | --- | --- |
| Обработка thinking blocks | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| Кэш подписей thinking blocks | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | Весь файл |
| Конфигурация PID-смещения | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Восстановление сессий (на основе oh-my-opencode) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | Весь файл |

**Ключевые настройки**:
- `pid_offset_enabled: true`: Включить смещение ID процесса для распределения разных аккаунтов между параллельными агентами
- `account_selection_strategy: "hybrid"`: Интеллектуальная гибридная стратегия выбора аккаунтов

**Ключевые функции**:
- `deepFilterThinkingBlocks()`: Удаляет все thinking blocks (request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()`: Фильтрует thinking blocks на основе кэша подписей (request-helpers.ts:1183)

</details>
