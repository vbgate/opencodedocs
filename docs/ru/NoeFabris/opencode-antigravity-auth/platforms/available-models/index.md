---
title: "Доступные модели: Руководство по Claude и Gemini | Antigravity Auth"
sidebarTitle: "Выбор AI модели"
subtitle: "Узнайте обо всех доступных моделях и их вариантах конфигурации"
description: "Изучите конфигурацию моделей Antigravity Auth. Освойте использование Claude Opus 4.5, Sonnet 4.5 и Gemini 3 Pro/Flash с вариантами Thinking."
tags:
  - "Платформы"
  - "Модели"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Узнайте обо всех доступных моделях и их вариантах конфигурации

## Что вы сможете делать после изучения

- Выбирать модель Claude или Gemini, наиболее подходящую для ваших задач
- Понимать разные уровни режима Thinking (low/max или minimal/low/medium/high)
- Понимать два независимых пула квот Antigravity и Gemini CLI
- Использовать параметр `--variant` для динамической настройки бюджета размышлений

## Ваша текущая проблема

Вы только что установили плагин и перед вами длинный список названий моделей, но вы не знаете, какую выбрать:
- В чём разница между `antigravity-gemini-3-pro` и `gemini-3-pro-preview`?
- Что означает `--variant=max`? Что будет, если его не указать?
- Режим thinking в Claude и Gemini работает одинаково?

## Основная концепция

Antigravity Auth поддерживает два основных класса моделей, каждый со своим независимым пулом квот:

1. **Квота Antigravity**: Доступ через Google Antigravity API, включает Claude и Gemini 3
2. **Квота Gemini CLI**: Доступ через Gemini CLI API, включает Gemini 2.5 и Gemini 3 Preview

::: info Система Variant
Система variant в OpenCode позволяет не создавать отдельную модель для каждого уровня thinking. Вместо этого вы указываете конфигурацию через параметр `--variant` во время выполнения. Это делает селектор моделей более компактным, а конфигурацию — более гибкой.
:::

## Модели с квотой Antigravity

Эти модели доступны через префикс `antigravity-` и используют пул квот Antigravity API.

### Серия Gemini 3

#### Gemini 3 Pro
| Название модели | Variants | Уровни Thinking | Описание |
| --- | --- | --- | --- |
| `antigravity-gemini-3-pro` | low, high | low, high | Баланс качества и скорости |

**Примеры конфигурации Variant**:
```bash
# Низкий уровень thinking (быстрее)
opencode run "Быстрый ответ" --model=google/antigravity-gemini-3-pro --variant=low

# Высокий уровень thinking (глубже)
opencode run "Сложное рассуждение" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Название модели | Variants | Уровни Thinking | Описание |
| --- | --- | --- | --- |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Сверхбыстрый ответ, 4 уровня thinking |

**Примеры конфигурации Variant**:
```bash
# Минимальный thinking (самый быстрый)
opencode run "Простая задача" --model=google/antigravity-gemini-3-flash --variant=minimal

# Средний thinking (по умолчанию)
opencode run "Обычная задача" --model=google/antigravity-gemini-3-flash --variant=medium

# Максимальный thinking (самый глубокий)
opencode run "Сложный анализ" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro не поддерживает minimal/medium
`gemini-3-pro` поддерживает только уровни `low` и `high`. Если вы попытаетесь использовать `--variant=minimal` или `--variant=medium`, API вернёт ошибку.
:::

### Серия Claude

#### Claude Sonnet 4.5 (без Thinking)
| Название модели | Variants | Бюджет Thinking | Описание |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5` | — | — | Стандартный режим, без расширенных размышлений |

**Пример использования**:
```bash
# Стандартный режим
opencode run "Повседневный разговор" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Название модели | Variants | Бюджет Thinking (токены) | Описание |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Режим баланса |

**Примеры конфигурации Variant**:
```bash
# Лёгкое thinking (быстрее)
opencode run "Быстрое рассуждение" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Максимальное thinking (глубже всего)
opencode run "Глубокий анализ" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Название модели | Variants | Бюджет Thinking (токены) | Описание |
| --- | --- | --- | --- |
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Максимальные способности к рассуждению |

**Примеры конфигурации Variant**:
```bash
# Лёгкое thinking
opencode run "Высококачественный ответ" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Максимальное thinking (для самых сложных задач)
opencode run "Экспертный анализ" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Различия режимов thinking в Claude и Gemini
- **Claude** использует цифровой thinking budget (токены), например 8192, 32768
- **Gemini 3** использует строковый thinking level (minimal/low/medium/high)
- Оба показывают процесс рассуждений перед ответом, но конфигурируются по-разному
:::

## Модели с квотой Gemini CLI

Эти модели не имеют префикса `antigravity-` и используют отдельный пул квот Gemini CLI API. Они не поддерживают режим thinking.

| Название модели | Описание |
| --- | --- |
| `gemini-2.5-flash` | Gemini 2.5 Flash (быстрый ответ) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (баланс качества и скорости) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (предварительная версия) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (предварительная версия) |

**Примеры использования**:
```bash
# Gemini 2.5 Pro (без thinking)
opencode run "Быстрая задача" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (без thinking)
opencode run "Тест предварительной модели" --model=google/gemini-3-pro-preview
```

::: info Preview модели
Модели `gemini-3-*-preview` — это официальные предварительные версии от Google, которые могут быть нестабильными или измениться в любой момент. Если вам нужна функция Thinking, используйте модели `antigravity-gemini-3-*`.
:::

## Сравнительный обзор моделей

| Характеристика | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | --- |
| **Поддержка Thinking** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Пул квот** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Применение** | Сложные рассуждения, программирование | Универсальные задачи + поиск | Быстрые ответы, простые задачи |

## 🎯 Как выбрать модель

### Claude или Gemini?

- **Выбирайте Claude**: если вам нужна более сильная способность к логическим рассуждениям, более стабильная генерация кода
- **Выбирайте Gemini 3**: если вам нужен Google Search, более быстрая скорость ответа

### Режим Thinking или стандартный?

- **Используйте Thinking**: сложные рассуждения, многоэтапные задачи, необходимость видеть процесс рассуждений
- **Используйте стандартный режим**: простые вопросы-ответы, быстрые ответы, нет необходимости показывать рассуждения

### Какой уровень Thinking выбрать?

| Уровень | Claude (токены) | Gemini 3 | Применение |
| --- | --- | --- | --- |
| **minimal** | — | Только Flash | Сверхбыстрые задачи, например перевод, резюме |
| **low** | 8192 | Pro/Flash | Баланс качества и скорости, подходит для большинства задач |
| **medium** | — | Только Flash | Задачи средней сложности |
| **high/max** | 32768 | Pro/Flash | Самые сложные задачи, например проектирование систем, глубокий анализ |

::: tip Рекомендуемая конфигурация
- **Повседневная разработка**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Сложные рассуждения**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **Быстрые вопросы + поиск**: `antigravity-gemini-3-flash --variant=low` с включённым Google Search
:::

## Пример полной конфигурации

Добавьте следующую конфигурацию в файл `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Копировать конфигурацию
Нажмите кнопку копирования в правом верхнем углу блока кода, затем вставьте в файл `~/.config/opencode/opencode.json`.
:::

## Контрольная точка ✅

Выполните следующие шаги, чтобы убедиться, что вы освоили выбор модели:

- [ ] Понять два независимых пула квот Antigravity и Gemini CLI
- [ ] Знать, что Claude использует thinkingBudget (токены), а Gemini 3 — thinkingLevel (строки)
- [ ] Уметь выбирать подходящий variant под сложность задачи
- [ ] Добавить полную конфигурацию в `opencode.json`

## Краткое содержание урока

Antigravity Auth предоставляет богатый выбор моделей и гибкую конфигурацию variant:

- **Квота Antigravity**: поддерживает Claude 4.5 и Gemini 3 с возможностью Thinking
- **Квота Gemini CLI**: поддерживает Gemini 2.5 и Gemini 3 Preview без возможности Thinking
- **Система Variant**: динамическая настройка уровня thinking через параметр `--variant`, без необходимости определять множество моделей

При выборе модели учитывайте тип задачи (рассуждение vs поиск), сложность (простая vs сложная) и требования к скорости отклика.

## Анонс следующего урока

> В следующем уроке мы изучим **[Подробно о моделях Thinking](../thinking-models/)**.
>
> Вы узнаете:
> - Принципы работы режимов Thinking в Claude и Gemini
> - Как настроить пользовательский бюджет thinking
> - Приёмы сохранения блоков thinking (signature caching)

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы просмотреть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-23

| Функция | Путь к файлу | Номера строк |
| --- | --- | --- |
| Разбор модели и извлечение tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Определение бюджета thinking tier | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Определение уровней thinking Gemini 3 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Сопоставление псевдонимов моделей | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Разбор конфигурации Variant | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Определение типов | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Ключевые константы**:
- `THINKING_TIER_BUDGETS`: Сопоставление бюджетов размышлений для Claude и Gemini 2.5 (low/medium/high → токены)
- `GEMINI_3_THINKING_LEVELS`: Поддерживаемые уровни thinking для Gemini 3 (minimal/low/medium/high)

**Ключевые функции**:
- `resolveModelWithTier(requestedModel)`: Разбор названия модели и конфигурации thinking
- `resolveModelWithVariant(requestedModel, variantConfig)`: Разбор модели из конфигурации variant
- `budgetToGemini3Level(budget)`: Сопоставление бюджета токенов с уровнем Gemini 3

</details>
