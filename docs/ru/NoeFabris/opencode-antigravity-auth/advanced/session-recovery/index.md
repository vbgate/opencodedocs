---
title: "Восстановление сессии: автоматическое исправление прерываний инструментов | Antigravity"
sidebarTitle: "Автоисправление прерываний"
subtitle: "Восстановление сессии: автоматическая обработка сбоев и прерываний вызовов инструментов"
description: "Изучите механизм восстановления сессии для автоматической обработки прерываний и ошибок инструментов. Охватывает обнаружение ошибок, внедрение synthetic tool_result и настройку auto_resume."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Восстановление сессии: автоматическая обработка сбоев и прерываний вызовов инструментов

## Чему вы научитесь

- Понимать, как механизм восстановления сессии автоматически обрабатывает прерывания выполнения инструментов
- Настраивать параметры session_recovery и auto_resume
- Устранять ошибки tool_result_missing и thinking_block_order
- Понимать принцип работы synthetic tool_result

## С какими проблемами вы сталкиваетесь

При использовании OpenCode вы можете столкнуться со следующими сценариями прерываний:

- Нажатие ESC во время выполнения инструмента приводит к зависанию сессии и необходимости ручного повтора
- Ошибка порядка блоков размышлений (thinking_block_order) — ИИ не может продолжить генерацию
- Использование функции размышлений в модели без поддержки размышлений (thinking_disabled_violation)
- Необходимость вручную исправлять повреждённое состояние сессии, что отнимает время

## Когда использовать этот подход

Восстановление сессии подходит для следующих сценариев:

| Сценарий | Тип ошибки | Способ восстановления |
| --- | --- | --- |
| Прерывание инструмента по ESC | `tool_result_missing` | Автоматическое внедрение synthetic tool_result |
| Ошибка порядка блоков размышлений | `thinking_block_order` | Автоматическая вставка пустого блока размышлений |
| Размышления в модели без их поддержки | `thinking_disabled_violation` | Автоматическое удаление всех блоков размышлений |
| Все вышеперечисленные ошибки | Общий | Автоисправление + автоматический continue (если включён) |

::: warning Предварительные требования
Перед началом этого руководства убедитесь, что вы:
- ✅ Установили плагин opencode-antigravity-auth
- ✅ Можете отправлять запросы с использованием модели Antigravity
- ✅ Понимаете базовые концепции вызова инструментов

[Руководство по быстрой установке](../../start/quick-install/) | [Руководство по первому запросу](../../start/first-request/)
:::

## Основная идея

Ключевые механизмы восстановления сессии:

1. **Обнаружение ошибок**: автоматическое распознавание трёх типов восстанавливаемых ошибок
   - `tool_result_missing`: отсутствует результат выполнения инструмента
   - `thinking_block_order`: неправильный порядок блоков размышлений
   - `thinking_disabled_violation`: размышления запрещены в модели без их поддержки

2. **Автоматическое исправление**: внедрение synthetic-сообщений в зависимости от типа ошибки
   - Внедрение synthetic tool_result (с содержимым "Operation cancelled by user (ESC pressed)")
   - Вставка пустого блока размышлений (блок thinking должен быть в начале сообщения)
   - Удаление всех блоков размышлений (модели без поддержки размышлений не допускают их)

3. **Автоматическое продолжение**: если включён `auto_resume`, автоматическая отправка сообщения continue для возобновления диалога

4. **Дедупликация**: использование `Set` для предотвращения повторной обработки одной и той же ошибки

::: info Что такое synthetic-сообщение?
Synthetic-сообщение — это «виртуальное» сообщение, внедряемое плагином для исправления повреждённого состояния сессии. Например, когда инструмент прерывается, плагин внедряет synthetic tool_result, сообщая ИИ «этот инструмент был отменён», что позволяет ИИ продолжить генерацию нового ответа.
:::

## Пошаговое руководство

### Шаг 1: Включение восстановления сессии (включено по умолчанию)

**Зачем**
Восстановление сессии включено по умолчанию, но если вы ранее отключали его вручную, необходимо включить снова.

**Действия**

Отредактируйте файл конфигурации плагина:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Убедитесь в наличии следующей конфигурации:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**Ожидаемый результат**:

1. `session_recovery` установлен в `true` (значение по умолчанию)
2. `auto_resume` установлен в `false` (рекомендуется ручной continue для избежания непреднамеренных действий)
3. `quiet_mode` установлен в `false` (отображение toast-уведомлений для отслеживания статуса восстановления)

::: tip Описание параметров конфигурации
- `session_recovery`: включение/отключение функции восстановления сессии
- `auto_resume`: автоматическая отправка сообщения "continue" (используйте с осторожностью — может привести к непреднамеренному выполнению ИИ)
- `quiet_mode`: скрытие toast-уведомлений (можно отключить при отладке)
:::

### Шаг 2: Тестирование восстановления tool_result_missing

**Зачем**
Проверить, что механизм восстановления сессии работает корректно при прерывании выполнения инструмента.

**Действия**

1. Откройте OpenCode и выберите модель с поддержкой вызова инструментов (например, `google/antigravity-claude-sonnet-4-5`)
2. Введите задачу, требующую вызова инструмента (например: «Покажи файлы в текущей директории»)
3. Нажмите `ESC` во время выполнения инструмента для прерывания

**Ожидаемый результат**:

1. OpenCode немедленно останавливает выполнение инструмента
2. Появляется toast-уведомление: "Tool Crash Recovery - Injecting cancelled tool results..."
3. ИИ автоматически продолжает генерацию, не ожидая результата инструмента

::: info Принцип работы ошибки tool_result_missing
Когда вы нажимаете ESC, OpenCode прерывает выполнение инструмента, что приводит к появлению в сессии `tool_use` без соответствующего `tool_result`. Antigravity API обнаруживает это несоответствие и возвращает ошибку `tool_result_missing`. Плагин перехватывает эту ошибку и внедряет synthetic tool_result, восстанавливая согласованное состояние сессии.
:::

### Шаг 3: Тестирование восстановления thinking_block_order

**Зачем**
Проверить, что механизм восстановления сессии может автоматически исправить ошибку порядка блоков размышлений.

**Действия**

1. Откройте OpenCode и выберите модель с поддержкой размышлений (например, `google/antigravity-claude-opus-4-5-thinking`)
2. Введите задачу, требующую глубокого анализа
3. Если возникает ошибка "Expected thinking but found text" или "First block must be thinking"

**Ожидаемый результат**:

1. Появляется toast-уведомление: "Thinking Block Recovery - Fixing message structure..."
2. Сессия автоматически восстанавливается, ИИ может продолжить генерацию

::: tip Причины ошибки thinking_block_order
Эта ошибка обычно возникает по следующим причинам:
- Блоки размышлений были случайно удалены (например, другим инструментом)
- Повреждение состояния сессии (например, сбой записи на диск)
- Несовместимость форматов при миграции между моделями
:::

### Шаг 4: Тестирование восстановления thinking_disabled_violation

**Зачем**
Проверить, что восстановление сессии может автоматически удалить блоки размышлений при ошибочном использовании функции размышлений в модели без их поддержки.

**Действия**

1. Откройте OpenCode и выберите модель без поддержки размышлений (например, `google/antigravity-claude-sonnet-4-5`)
2. Если история сообщений содержит блоки размышлений

**Ожидаемый результат**:

1. Появляется toast-уведомление: "Thinking Strip Recovery - Stripping thinking blocks..."
2. Все блоки размышлений автоматически удаляются
3. ИИ может продолжить генерацию

::: warning Потеря блоков размышлений
Удаление блоков размышлений приводит к потере содержимого размышлений ИИ, что может повлиять на качество ответа. Убедитесь, что используете функцию размышлений в моделях с её поддержкой.
:::

### Шаг 5: Настройка auto_resume (опционально)

**Зачем**
При включении auto_resume после завершения восстановления сессии автоматически отправляется "continue" без необходимости ручных действий.

**Действия**

Установите в `antigravity.json`:

```json
{
  "auto_resume": true
}
```

Сохраните файл и перезапустите OpenCode.

**Ожидаемый результат**:

1. После завершения восстановления сессии ИИ автоматически продолжает генерацию
2. Не требуется вручную вводить "continue"

::: danger Риски auto_resume
Автоматический continue может привести к непреднамеренному выполнению вызовов инструментов ИИ. Если у вас есть сомнения относительно безопасности вызовов инструментов, рекомендуется оставить `auto_resume: false` и контролировать момент восстановления вручную.
:::

## Контрольный список ✅

После выполнения вышеуказанных шагов вы должны уметь:

- [ ] Видеть конфигурацию session_recovery в `antigravity.json`
- [ ] Видеть уведомление "Tool Crash Recovery" при прерывании инструмента по ESC
- [ ] Сессия автоматически восстанавливается без необходимости ручного повтора
- [ ] Понимать принцип работы synthetic tool_result
- [ ] Знать, когда включать/отключать auto_resume

## Типичные проблемы

### Восстановление сессии не срабатывает

**Симптомы**: при возникновении ошибки автоматическое восстановление не происходит

**Причина**: `session_recovery` отключён или тип ошибки не соответствует

**Решение**:

1. Убедитесь, что `session_recovery: true`:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Проверьте, является ли тип ошибки восстанавливаемым:

```bash
# Включите отладочные логи для просмотра подробной информации об ошибках
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Проверьте наличие ошибок в консоли:

```bash
# Расположение логов
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result не внедряется

**Симптомы**: после прерывания инструмента ИИ всё ещё ожидает результат инструмента

**Причина**: неправильно настроен путь хранения OpenCode

**Решение**:

1. Убедитесь в правильности пути хранения OpenCode:

```bash
# Просмотр конфигурации OpenCode
cat ~/.config/opencode/opencode.json | grep storage
```

2. Проверьте существование директорий хранения сообщений и частей:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. Если директории не существуют, проверьте конфигурацию OpenCode

### Auto Resume срабатывает непреднамеренно

**Симптомы**: ИИ автоматически продолжает в неподходящий момент

**Причина**: `auto_resume` установлен в `true`

**Решение**:

1. Отключите auto_resume:

```json
{
  "auto_resume": false
}
```

2. Контролируйте момент восстановления вручную

### Слишком частые toast-уведомления

**Симптомы**: частые всплывающие уведомления о восстановлении мешают работе

**Причина**: `quiet_mode` не включён

**Решение**:

1. Включите quiet_mode:

```json
{
  "quiet_mode": true
}
```

2. При необходимости отладки можно временно отключить

## Итоги урока

- Механизм восстановления сессии автоматически обрабатывает три типа восстанавливаемых ошибок: tool_result_missing, thinking_block_order, thinking_disabled_violation
- Synthetic tool_result — ключ к исправлению состояния сессии, внедряемое содержимое: "Operation cancelled by user (ESC pressed)"
- session_recovery включён по умолчанию, auto_resume отключён по умолчанию (рекомендуется ручное управление)
- Восстановление блоков размышлений (thinking_block_order) вставляет пустой блок размышлений, позволяя ИИ заново сгенерировать содержимое размышлений
- Удаление блоков размышлений (thinking_disabled_violation) приводит к потере содержимого размышлений — убедитесь, что используете функцию размышлений в моделях с её поддержкой

## Анонс следующего урока

> В следующем уроке мы изучим **[Механизм преобразования запросов](../request-transformation/)**.
>
> Вы узнаете:
> - Различия форматов запросов Claude и Gemini
> - Правила очистки и преобразования Tool Schema
> - Механизм внедрения подписи блоков размышлений
> - Методы настройки Google Search Grounding

---

## Приложение: справочник по исходному коду

<details>
<summary><strong>Нажмите для просмотра расположения исходного кода</strong></summary>

> Дата обновления: 2026-01-23

| Функция | Путь к файлу | Строки |
| --- | --- | --- |
| Основная логика восстановления сессии | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Весь файл |
| Обнаружение типа ошибки | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| Восстановление tool_result_missing | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| Восстановление thinking_block_order | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| Восстановление thinking_disabled_violation | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Утилиты хранилища | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Весь файл |
| Чтение сообщений | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Чтение частей (part) | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Вставка блока размышлений | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Удаление блоков размышлений | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Определения типов | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Весь файл |

**Ключевые константы**:

| Имя константы | Значение | Описание |
| --- | --- | --- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Текст восстановления, отправляемый при Auto Resume |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Набор типов блоков размышлений |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Набор типов метаданных |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Набор типов контента |

**Ключевые функции**:

- `detectErrorType(error: unknown): RecoveryErrorType`: обнаружение типа ошибки, возвращает `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` или `null`
- `isRecoverableError(error: unknown): boolean`: определяет, является ли ошибка восстанавливаемой
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: создание хука восстановления сессии
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: восстановление ошибки tool_result_missing
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: восстановление ошибки thinking_block_order
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: восстановление ошибки thinking_disabled_violation
- `readMessages(sessionID): StoredMessageMeta[]`: чтение всех сообщений сессии
- `readParts(messageID): StoredPart[]`: чтение всех частей (parts) сообщения
- `prependThinkingPart(sessionID, messageID): boolean`: вставка пустого блока размышлений в начало сообщения
- `stripThinkingParts(messageID): boolean`: удаление всех блоков размышлений из сообщения

**Параметры конфигурации** (из schema.ts):

| Параметр | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `session_recovery` | boolean | `true` | Включение функции восстановления сессии |
| `auto_resume` | boolean | `false` | Автоматическая отправка сообщения "continue" |
| `quiet_mode` | boolean | `false` | Скрытие toast-уведомлений |

</details>
