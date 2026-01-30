---
title: "Диагностика ошибок модели: исправление 400 и MCP | opencode-antigravity-auth"
sidebarTitle: "Модель не найдена"
subtitle: "Устранение ошибок 'Model not found' и 400"
description: "Научитесь диагностировать ошибки моделей Antigravity. Руководство по диагностике и устранению ошибок Model not found, 400 Unknown name parameters, а также проблем совместимости MCP-серверов для быстрого решения проблем."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Устранение ошибок "Model not found" и 400

## Проблемы, с которыми вы столкнулись

При использовании моделей Antigravity могут возникать следующие ошибки:

| Сообщение об ошибке | Типичные симптомы |
|---|---|
| `Model not found` | Указание на отсутствие модели, невозможность отправить запрос |
| `Invalid JSON payload received. Unknown name "parameters"` | Ошибка 400, сбой вызова инструмента |
| Ошибки вызова MCP-сервера | Определённые MCP-инструменты недоступны |

Эти проблемы обычно связаны с конфигурацией, совместимостью MCP-сервера или версией плагина.

## Быстрая диагностика

Перед углубленным анализом убедитесь в следующем:

**macOS/Linux**:
```bash
# Проверка версии плагина
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Проверка файла конфигурации
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:
```powershell
# Проверка версии плагина
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Проверка файла конфигурации
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Проблема 1: Model not found

**Проявление ошибки**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**Причина**: В конфигурации Google-провайдера OpenCode отсутствует поле `npm`.

**Решение**:

Добавьте поле `npm` для провайдера `google` в файл `~/.config/opencode/opencode.json`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Шаги проверки**:

1. Отредактируйте файл `~/.config/opencode/opencode.json`
2. Сохраните файл
3. Повторите попытку вызова модели в OpenCode
4. Проверьте, не появляется ли ошибка "Model not found"

::: tip Подсказка
Если не уверены в расположении файла конфигурации, выполните:
```bash
opencode config path
```
:::

---

## Проблема 2: Ошибка 400 - Unknown name 'parameters'

**Проявление ошибки**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**В чём проблема?**

Модель Gemini 3 использует **строгую проверку protobuf**, а API Antigravity требует определённый формат для инструментов:

```json
// ❌ Неправильный формат (будет отклонён)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← Это поле не принимается
    }
  ]
}

// ✅ Правильный формат
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← Внутри functionDeclarations
        }
      ]
    }
  ]
}
```

Плагин автоматически конвертирует формат, но схемы, возвращаемые некоторыми **MCP-серверами, содержат несовместимые поля** (например, `const`, `$ref`, `$defs`), что приводит к сбою очистки.

### Решение 1: Обновление до последней beta-версии

Последняя beta-версия содержит исправления очистки схем:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:
```powershell
npm install -g opencode-antigravity-auth@beta
```

### Решение 2: Отключение MCP-серверов для поиска причины

Некоторые MCP-серверы возвращают форматы схем, не соответствующие требованиям Antigravity.

**Шаги**:

1. Откройте файл `~/.config/opencode/opencode.json`
2. Найдите конфигурацию `mcpServers`
3. **Отключите все MCP-серверы** (закомментируйте или удалите)
4. Повторите попытку вызова модели
5. Если успешно, **включайте MCP-серверы по одному**, тестируя после каждого
6. Найдя проблемный MCP-сервер, отключите его или сообщите об ошибке разработчикам

**Пример конфигурации**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Временно отключён
    // "github": { ... },       ← Временно отключён
    "brave-search": { ... }     ← Тестируем сначала этот
  }
}
```

### Решение 3: Добавление npm override

Если предыдущие методы не помогли, принудительно используйте `@ai-sdk/google` в конфигурации провайдера `google`:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Проблема 3: Сбои вызова инструментов из-за MCP-серверов

**Проявление ошибки**:

- Определённые инструменты недоступны (например, WebFetch, операции с файлами и т.д.)
- Сообщения об ошибках, связанных со схемой (Schema)
- Другие инструменты работают нормально

**Причина**: JSON Schema, возвращаемая MCP-серверами, содержит поля, не поддерживаемые API Antigravity.

### Несовместимые характеристики схемы

Плагин автоматически очищает следующие несовместимые свойства (исходный код `src/plugin/request-helpers.ts:24-37`):

| Характеристика | Способ преобразования | Пример |
|---|---|---|
| `const` | Преобразование в `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Преобразование в подсказку description | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "См.: Foo" }` |
| `$defs` / `definitions` | Раскрытие в схему | Больше не используется ссылка |
| `minLength` / `maxLength` / `pattern` | Перемещение в description | Добавлено в `description` как подсказка |
| `additionalProperties` | Перемещение в description | Добавлено в `description` как подсказка |

Но если структура схемы слишком сложна (например, многоуровневая вложенность `anyOf`/`oneOf`), очистка может завершиться неудачей.

### Процесс диагностики

```bash
# Включение журналов отладки
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# Перезапуск OpenCode

# Просмотр ошибок преобразования схемы в журналах
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Ключевые слова для поиска в журналах**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Сообщение о проблеме

Если вы определили, что проблема вызвана определённым MCP-сервером, пожалуйста, создайте [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues), включив:

1. **Название и версию MCP-сервера**
2. **Полные журналы ошибок** (из `~/.config/opencode/antigravity-logs/`)
3. **Пример инструмента, вызывающего проблему**
4. **Версию плагина** (выполните `opencode --version`)

---

## Важные предупреждения

::: warning Порядок отключения плагинов

Если вы одновременно используете `opencode-antigravity-auth` и `@tarquinen/opencode-dcp`, **поместите плагин Antigravity Auth перед DCP**:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Должен быть перед DCP
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP создаёт синтетические сообщения assistant без блоков рассуждения, что может привести к ошибкам проверки подписи.
:::

::: warning Ошибка в имени ключа конфигурации

Убедитесь, что используете `plugin` (единственное число), а не `plugins` (множественное):

```json
// ❌ Неправильно
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Правильно
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## Когда обращаться за помощью

Если после попытки всех вышеуказанных методов проблема не устранена:

**Проверка файлов журналов**:
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Сброс аккаунта** (очистка всех состояний):
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Создание GitHub issue**, включив:
- Полное сообщение об ошибке
- Версию плагина (`opencode --version`)
- Конфигурацию `~/.config/opencode/antigravity.json` (**удалите конфиденциальную информацию, например refreshToken**)
- Журналы отладки (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Связанные курсы

- [Руководство по быстрой установке](/ru/NoeFabris/opencode-antigravity-auth/start/quick-install/) — Базовая конфигурация
- [Совместимость плагинов](/ru/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) — Устранение конфликтов с другими плагинами
- [Журналы отладки](/ru/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) — Включение подробных журналов

---

## Приложение: Ссылки на исходный код

<details>
<summary><strong>Нажмите, чтобы развернуть просмотр расположения исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Номер строки |
|---|---|---|
| Основная функция очистки JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| Преобразование const в enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| Преобразование $ref в hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| Раскрытие anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Преобразование формата инструментов Gemini | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Ключевые константы**:
- `UNSUPPORTED_KEYWORDS`: Удаляемые ключевые слова Schema (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: Ограничения, перемещаемые в description (`request-helpers.ts:24-28`)

**Ключевые функции**:
- `cleanJSONSchemaForAntigravity(schema)`: Очистка несовместимого JSON Schema
- `convertConstToEnum(schema)`: Преобразование `const` в `enum`
- `convertRefsToHints(schema)`: Преобразование `$ref` в подсказки description
- `flattenAnyOfOneOf(schema)`: Раскрытие структур `anyOf`/`oneOf`

</details>
