---
title: "Справочник API: интерфейсы плагина | opencode-dynamic-context-pruning"
sidebarTitle: "Справочник API плагина"
subtitle: "Справочник API DCP"
description: "Полная документация API плагина OpenCode DCP, включая функцию входа плагина, интерфейсы конфигурации, определения инструментов, обработчики хуков и управление состоянием сессии."
tags:
  - "API"
  - "Разработка плагинов"
  - "Справочник интерфейсов"
prerequisite:
  - "start-configuration"
order: 3
---

# Справочник API DCP

## Чему вы научитесь

В этом разделе для разработчиков плагинов представлен полный справочник API DCP, который позволит вам:

- Понять механизм входа плагина и хуков DCP
- Освоить интерфейсы конфигурации и назначение всех параметров
- Изучить спецификации инструментов discard и extract
- Использовать API управления состоянием для операций с состоянием сессии

## Ключевые концепции

Плагин DCP основан на OpenCode Plugin SDK и реализует функцию обрезки контекста путём регистрации хуков, инструментов и команд.

**Жизненный цикл плагина**:

```
1. OpenCode загружает плагин
    ↓
2. Выполняется функция Plugin
    ↓
3. Регистрация хуков, инструментов, команд
    ↓
4. OpenCode вызывает хуки для обработки сообщений
    ↓
5. Плагин выполняет логику обрезки
    ↓
6. Возврат изменённых сообщений
```

---

## API входа плагина

### Функция Plugin

Главная функция входа плагина DCP, возвращающая объект конфигурации плагина.

**Сигнатура**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Логика инициализации плагина
    return {
        // Зарегистрированные хуки, инструменты, команды
    }) satisfies Plugin

export default plugin
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| ctx | `PluginInput` | Контекст плагина OpenCode, содержит информацию о client и directory |

**Возвращаемое значение**:

Объект конфигурации плагина со следующими полями:

| Поле | Тип | Описание |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | Хук внедрения системных промптов |
| `experimental.chat.messages.transform` | `Handler` | Хук преобразования сообщений |
| `chat.message` | `Handler` | Хук перехвата сообщений |
| `command.execute.before` | `Handler` | Хук выполнения команд |
| `tool` | `Record<string, Tool>` | Карта зарегистрированных инструментов |
| `config` | `ConfigHandler` | Хук мутации конфигурации |

**Расположение исходного кода**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## API конфигурации

### Интерфейс PluginConfig

Полное определение типа конфигурации DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Расположение исходного кода**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Подробное описание параметров конфигурации

#### Параметры верхнего уровня

| Параметр | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включён ли плагин |
| `debug` | `boolean` | `false` | Включён ли режим отладки, логи записываются в `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Режим отображения уведомлений |
| `protectedFilePatterns` | `string[]` | `[]` | Список glob-шаблонов защищённых файлов, соответствующие файлы не будут обрезаны |

#### Конфигурация Commands

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включена ли команда `/dcp` |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Список защищённых инструментов команды, эти инструменты не будут обрезаны командой `/dcp sweep` |

#### Конфигурация TurnProtection

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Включена ли защита по ходам |
| `turns` | `number` | `4` | Количество защищённых ходов, инструменты последних N ходов не будут обрезаны |

#### Конфигурация Tools

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | Включены ли напоминания ИИ |
| `nudgeFrequency` | `number` | `10` | Частота напоминаний — напоминать ИИ об использовании инструментов обрезки каждые N результатов |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Список защищённых инструментов |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включён ли инструмент discard |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включён ли инструмент extract |
| `showDistillation` | `boolean` | `false` | Показывать ли извлечённое содержимое в уведомлениях |

#### Конфигурация Strategies

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включена ли стратегия дедупликации |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Список инструментов, не участвующих в дедупликации |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Включена ли стратегия замещения записи |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Поле | Тип | Значение по умолчанию | Описание |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Включена ли стратегия очистки ошибок |
| `turns` | `number` | `4` | Порог очистки ошибок (количество ходов) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Список инструментов, не участвующих в очистке |

### Функция getConfig

Загружает и объединяет конфигурацию из нескольких уровней.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| ctx | `PluginInput` | Контекст плагина OpenCode |

**Возвращаемое значение**:

Объект объединённой конфигурации с приоритетом от высокого к низкому:

1. Конфигурация проекта (`.opencode/dcp.jsonc`)
2. Конфигурация окружения (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Глобальная конфигурация (`~/.config/opencode/dcp.jsonc`)
4. Конфигурация по умолчанию (определена в коде)

**Расположение исходного кода**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## API инструментов

### createDiscardTool

Создаёт инструмент discard для удаления выполненных задач или шумовых выводов инструментов.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| ctx | `PruneToolContext` | Контекст инструмента, содержит client, state, logger, config, workingDirectory |

**Спецификация инструмента**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `ids` | `string[]` | Первый элемент — причина (`'completion'` или `'noise'`), последующие — числовые ID |

**Расположение исходного кода**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Создаёт инструмент extract для извлечения ключевых находок с последующим удалением исходных выводов инструментов.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| ctx | `PruneToolContext` | Контекст инструмента, содержит client, state, logger, config, workingDirectory |

**Спецификация инструмента**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `ids` | `string[]` | Массив числовых ID |
| `distillation` | `string[]` | Массив извлечённого содержимого, длина совпадает с ids |

**Расположение исходного кода**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## API состояния

### Интерфейс SessionState

Объект состояния сессии, управляющий runtime-состоянием отдельной сессии.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Описание полей**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `sessionId` | `string \| null` | ID сессии OpenCode |
| `isSubAgent` | `boolean` | Является ли сессия подагентом |
| `prune` | `Prune` | Состояние обрезки |
| `stats` | `SessionStats` | Статистика |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Кэш вызовов инструментов (callID → метаданные) |
| `nudgeCounter` | `number` | Счётчик вызовов инструментов (для триггера напоминаний) |
| `lastToolPrune` | `boolean` | Была ли последняя операция обрезкой инструмента |
| `lastCompaction` | `number` | Временная метка последнего сжатия контекста |
| `currentTurn` | `number` | Текущий номер хода |
| `variant` | `string \| undefined` | Вариант модели (например, claude-3.5-sonnet) |

**Расположение исходного кода**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### Интерфейс SessionStats

Статистика обрезки токенов на уровне сессии.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Описание полей**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | Количество обрезанных токенов в текущей сессии (нарастающий итог) |
| `totalPruneTokens` | `number` | Историческое накопленное количество обрезанных токенов |

**Расположение исходного кода**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Интерфейс Prune

Объект состояния обрезки.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Описание полей**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `toolIds` | `string[]` | Список ID вызовов инструментов, отмеченных для обрезки |

**Расположение исходного кода**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### Интерфейс ToolParameterEntry

Кэш метаданных отдельного вызова инструмента.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Описание полей**:

| Поле | Тип | Описание |
| --- | --- | --- |
| `tool` | `string` | Имя инструмента |
| `parameters` | `any` | Параметры инструмента |
| `status` | `ToolStatus \| undefined` | Статус выполнения инструмента |
| `error` | `string \| undefined` | Сообщение об ошибке (при наличии) |
| `turn` | `number` | Номер хода, на котором создан вызов |

**Перечисление ToolStatus**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Расположение исходного кода**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Создаёт новый объект состояния сессии.

```typescript
export function createSessionState(): SessionState
```

**Возвращаемое значение**: Инициализированный объект SessionState

---

## API хуков

### createSystemPromptHandler

Создаёт обработчик хука внедрения системных промптов.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| state | `SessionState` | Объект состояния сессии |
| logger | `Logger` | Экземпляр системы логирования |
| config | `PluginConfig` | Объект конфигурации |

**Поведение**:

- Проверяет, является ли сессия подагентом — если да, пропускает
- Проверяет, является ли внутренним агентом (например, генератором сводок) — если да, пропускает
- Загружает соответствующий шаблон промпта (both/discard/extract) в зависимости от конфигурации
- Внедряет описания инструментов обрезки в системный промпт

**Расположение исходного кода**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Создаёт обработчик хука преобразования сообщений, выполняющий автоматическую логику обрезки.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| client | `any` | Экземпляр клиента OpenCode |
| state | `SessionState` | Объект состояния сессии |
| logger | `Logger` | Экземпляр системы логирования |
| config | `PluginConfig` | Объект конфигурации |

**Процесс обработки**:

1. Проверка состояния сессии (является ли подагентом)
2. Синхронизация кэша инструментов
3. Выполнение автоматических стратегий (дедупликация, замещение записи, очистка ошибок)
4. Обрезка отмеченного содержимого инструментов
5. Внедрение списка `<prunable-tools>`
6. Сохранение снапшота контекста (при наличии конфигурации)

**Расположение исходного кода**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Создаёт обработчик хука выполнения команд, обрабатывающий серию команд `/dcp`.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Параметры**:

| Имя параметра | Тип | Описание |
| --- | --- | --- |
| client | `any` | Экземпляр клиента OpenCode |
| state | `SessionState` | Объект состояния сессии |
| logger | `Logger` | Экземпляр системы логирования |
| config | `PluginConfig` | Объект конфигурации |
| workingDirectory | `string` | Путь к рабочей директории |

**Поддерживаемые команды**:

- `/dcp` — отображение справочной информации
- `/dcp context` — отображение анализа использования токенов текущей сессии
- `/dcp stats` — отображение накопленной статистики обрезки
- `/dcp sweep [n]` — ручная обрезка инструментов (опционально указать количество)

**Расположение исходного кода**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Резюме урока

В этом разделе представлен полный справочник API плагина DCP, охватывающий:

- Функцию входа плагина и механизм регистрации хуков
- Подробное описание интерфейсов конфигурации и всех параметров
- Спецификации и методы создания инструментов discard и extract
- Определения типов состояния сессии, статистики и кэша инструментов
- Обработчики хуков для системных промптов, преобразования сообщений и выполнения команд

Если вам требуется более глубокое понимание внутренней реализации DCP, рекомендуется изучить [обзор архитектуры](/ru/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) и [принципы подсчёта токенов](/ru/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Приложение: Справочник исходного кода

<details>
<summary><strong>Нажмите для просмотра расположения исходного кода</strong></summary>

> Дата обновления: 2026-01-23

| Функция | Путь к файлу | Номера строк |
| --- | --- | --- |
| Функция входа плагина | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Определение интерфейса конфигурации | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| Функция getConfig | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Создание инструмента discard | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| Создание инструмента extract | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Определение типов состояния | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| Хук системных промптов | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Хук преобразования сообщений | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Хук выполнения команд | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Ключевые типы**:
- `Plugin`: Сигнатура функции плагина OpenCode
- `PluginConfig`: Интерфейс конфигурации DCP
- `SessionState`: Интерфейс состояния сессии
- `ToolStatus`: Перечисление статусов инструментов (pending | running | completed | error)

**Ключевые функции**:
- `plugin()`: Функция входа плагина
- `getConfig()`: Загрузка и объединение конфигурации
- `createDiscardTool()`: Создание инструмента discard
- `createExtractTool()`: Создание инструмента extract
- `createSessionState()`: Создание состояния сессии

</details>
