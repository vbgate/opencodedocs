---
title: "Модели данных: структура и форматы | opencode-mystatus"
sidebarTitle: "Модели данных"
subtitle: "Модели данных: структура и форматы API"
description: "Изучите структуру файлов аутентификации и форматы ответов API для 5 платформ: OpenAI, 智谱 AI, Z.ai, GitHub Copilot, Google Cloud."
tags:
  - "Модели данных"
  - "Файлы аутентификации"
  - "Ответ API"
prerequisite:
  - "start-quick-start"
order: 1
---

# Модели данных: структура файлов аутентификации и форматы ответов API

> 💡 **Это приложение для разработчиков**: Если вы хотите понять, как плагин читает и разбирает файлы аутентификации, или хотите самостоятельно расширить поддержку большего количества платформ, здесь есть полный справочник моделей данных.

## Что вы научитесь делать

- Поймите, какие файлы аутентификации читает плагин
- Поймите форматы ответов API каждой платформы
- Знайте, как расширить плагин для поддержки новых платформ

## Содержание этого приложения

- Структура файлов аутентификации (3 конфигурационных файла)
- Форматы ответов API (5 платформ)
- Внутренние типы данных

---

## Структура файлов аутентификации

### Основной файл аутентификации: `~/.local/share/opencode/auth.json`

Официальное хранилище аутентификации OpenCode, плагин читает отсюда информацию об аутентификации OpenAI、智谱 AI、Z.ai、GitHub Copilot.

```typescript
interface AuthData {
  /** OpenAI OAuth аутентификация */
  openai?: OpenAIAuthData;

  /** API аутентификация 智谱 AI */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** API аутентификация Z.ai */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot OAuth аутентификация */
  "github-copilot"?: CopilotAuthData;
}
```

#### Данные аутентификации OpenAI

```typescript
interface OpenAIAuthData {
  type: string;        // фиксированное значение "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // временная метка истечения (миллисекунды)
}
```

**Источник данных**: официальный процесс аутентификации OAuth OpenCode

#### Данные аутентификации 智谱 AI / Z.ai

```typescript
interface ZhipuAuthData {
  type: string;   // фиксированное значение "api"
  key?: string;    // API Key
}
```

**Источник данных**: API Key, настроенный пользователем в OpenCode

#### Данные аутентификации GitHub Copilot

```typescript
interface CopilotAuthData {
  type: string;        // фиксированное значение "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token (необязательно)
  expires?: number;    // временная метка истечения (миллисекунды)
}
```

**Источник данных**: официальный процесс аутентификации OAuth OpenCode

---

### Конфигурация Copilot PAT: `~/.config/opencode/copilot-quota-token.json`

Опциональная конфигурация Fine-grained PAT (Personal Access Token) пользователя, используемая для запроса квоты через публичный API GitHub (без прав Copilot).

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT (требует права чтения "Plan") */
  token: string;

  /** Имя пользователя GitHub (требуется для вызова API) */
  username: string;

  /** Тип подписки Copilot (определяет ежемесячный лимит квоты) */
  tier: CopilotTier;
}

/** Перечисление типов подписки Copilot */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**Лимиты ежемесячной квоты для каждого типа подписки**:

| tier      | Ежемесячная квота (Premium Requests) |
| --------- | --------------------------- |
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Учётная запись Google Cloud: `~/.config/opencode/antigravity-accounts.json`

Файл учётной записи, созданный плагином `opencode-antigravity-auth`, поддерживает несколько учётных записей.

```typescript
interface AntigravityAccountsFile {
  version: number;               // номер версии формата файла
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Почта Google (для отображения) */
  email?: string;

  /** OAuth Refresh Token (обязательно) */
  refreshToken: string;

  /** Google Project ID (выберите один из двух) */
  projectId?: string;

  /** ID управляемого проекта (выберите один из двух) */
  managedProjectId?: string;

  /** Временная метка добавления учётной записи (миллисекунды) */
  addedAt: number;

  /** Временная метка последнего использования (миллисекунды) */
  lastUsed: number;

  /** Время сброса каждой модели (ключ модели → временная метка) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**Источник данных**: процесс аутентификации OAuth плагина `opencode-antigravity-auth`

---

## Форматы ответов API

### Формат ответа OpenAI

**Конечная точка API**: `GET https://chatgpt.com/backend-api/wham/usage`

**Метод аутентификации**: Bearer Token (OAuth Access Token)

```typescript
interface OpenAIUsageResponse {
  /** Тип плана: plus、team、pro и т. д. */
  plan_type: string;

  /** Информация о лимите квоты */
  rate_limit: {
    /** Достигнут ли лимит */
    limit_reached: boolean;

    /** Основное окно (3 часа) */
    primary_window: RateLimitWindow;

    /** Вторичное окно (24 часа, необязательно) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** Информация об окне лимита */
interface RateLimitWindow {
  /** Процент использованного */
  used_percent: number;

  /** Длительность окна лимита (секунды) */
  limit_window_seconds: number;

  /** Количество секунд до сброса */
  reset_after_seconds: number;
}
```

**Пример ответа**:

```json
{
  "plan_type": "team",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9000
    },
    "secondary_window": {
      "used_percent": 23,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 43200
    }
  }
}
```

---

### Формат ответа 智谱 AI / Z.ai

**Конечная точка API**:
- 智谱 AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Метод аутентификации**: Authorization Header (API Key)

```typescript
interface QuotaLimitResponse {
  code: number;   // 200 при успехе
  msg: string;    // сообщение об ошибке ("success" при успехе)
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** Один элемент лимита */
interface UsageLimitItem {
  /** Тип лимита */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** Текущее значение */
  currentValue: number;

  /** Общее значение */
  usage: number;

  /** Процент использования */
  percentage: number;

  /** Временная метка следующего сброса (миллисекунды, действительна только для TOKENS_LIMIT) */
  nextResetTime?: number;
}
```

**Описание типа лимита**:

| type          | Описание               | Период сброса  |
| ------------- | ------------------ | --------- |
| `TOKENS_LIMIT` | лимит Token за 5 часов  | 5 часов   |
| `TIME_LIMIT`   | ежемесячная квота MCP      | 1 месяц   |

**Пример ответа**:

```json
{
  "code": 200,
  "msg": "success",
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "currentValue": 500000,
        "usage": 10000000,
        "percentage": 5,
        "nextResetTime": 1737926400000
      },
      {
        "type": "TIME_LIMIT",
        "currentValue": 120,
        "usage": 2000,
        "percentage": 6
      }
    ]
  }
}
```

---

### Формат ответа GitHub Copilot

Copilot поддерживает два метода запроса API, форматы ответов разные.

#### Способ 1: Внутренний API (требует прав Copilot)

**Конечная точка API**: `GET https://api.github.com/copilot_internal/user`

**Метод аутентификации**: Bearer Token (OAuth или Token после обмена)

```typescript
interface CopilotUsageResponse {
  /** Тип SKU (для различения подписок) */
  access_type_sku: string;

  /** ID аналитического отслеживания */
  analytics_tracking_id: string;

  /** Дата назначения */
  assigned_date: string;

  /** Можно ли зарегистрировать ограниченный план */
  can_signup_for_limited: boolean;

  /** Включён ли чат */
  chat_enabled: boolean;

  /** Тип плана Copilot */
  copilot_plan: string;

  /** Дата сброса квоты (формат: YYYY-MM) */
  quota_reset_date: string;

  /** Снимки квоты */
  quota_snapshots: QuotaSnapshots;
}

/** Снимки квоты */
interface QuotaSnapshots {
  /** Квота чата (необязательно) */
  chat?: QuotaDetail;

  /** Квота дополнений (необязательно) */
  completions?: QuotaDetail;

  /** Premium Interactions (обязательно) */
  premium_interactions: QuotaDetail;
}

/** Детали квоты */
interface QuotaDetail {
  /** Лимит квоты */
  entitlement: number;

  /** Количество сверхлимита */
  overage_count: number;

  /** Разрешено ли превышение */
  overage_permitted: boolean;

  /** Оставшийся процент */
  percent_remaining: number;

  /** ID квоты */
  quota_id: string;

  /** Оставшаяся квота */
  quota_remaining: number;

  /** Оставшееся количество (совпадает с quota_remaining) */
  remaining: number;

  /** Безлимитен ли */
  unlimited: boolean;
}
```

#### Способ 2: Публичный Billing API (требует Fine-grained PAT)

**Конечная точка API**: `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**Метод аутентификации**: Bearer Token (Fine-grained PAT, требует права чтения "Plan")

```typescript
interface BillingUsageResponse {
  /** Временной период */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** Имя пользователя */
  user: string;

  /** Список использованных элементов */
  usageItems: BillingUsageItem[];
}

/** Использованный элемент */
interface BillingUsageItem {
  /** Название продукта */
  product: string;

  /** Идентификатор SKU */
  sku: string;

  /** Название модели (необязательно) */
  model?: string;

  /** Тип единицы (например, "requests") */
  unitType: string;

  /** Общее количество запросов (до применения скидки) */
  grossQuantity: number;

  /** Чистое количество запросов (после применения скидки) */
  netQuantity: number;

  /** Лимит квоты (необязательно) */
  limit?: number;
}
```

**Пример ответа**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "octocat",
  "usageItems": [
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4o",
      "unitType": "requests",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3-5-sonnet",
      "unitType": "requests",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

---

### Формат ответа Google Cloud

**Конечная точка API**: `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**Метод аутентификации**: Bearer Token (OAuth Access Token)

**Тело запроса**:

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** Список моделей (ключ — идентификатор модели) */
  models: Record<
    string,
    {
      /** Информация о квоте (необязательно) */
      quotaInfo?: {
        /** Оставшаяся доля (0-1) */
        remainingFraction?: number;

        /** Время сброса (формат ISO 8601) */
        resetTime?: string;
      };
    }
  >;
}
```

**Пример ответа**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 0.83,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.91,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-flash": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T00:00:00Z"
      }
    }
  }
}
```

**Отображаемые 4 модели**:

| Отображаемое имя     | Ключ модели                                  | Альтернативный ключ              |
| ------------ | ----------------------------------------- | --------------------- |
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## Внутренние типы данных

### Тип результата запроса

Все функции запроса платформ возвращают единый формат результата.

```typescript
interface QueryResult {
  /** Успешно ли */
  success: boolean;

  /** Содержимое вывода при успехе */
  output?: string;

  /** Сообщение об ошибке при неудаче */
  error?: string;
}
```

### Константы конфигурации

```typescript
/** Порог предупреждения высокого использования (процент) */
export const HIGH_USAGE_THRESHOLD = 80;

/** Время тайм-аута запроса API (миллисекунды) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## Приложение: справочник по исходному коду

<details>
<summary><strong>Нажмите для просмотра местоположения исходного кода</strong></summary>

> Время обновления: 2026-01-23

| Функция              | Путь к файлу                                                                                              | Номер строки    |
| ----------------- | --------------------------------------------------------------------------------------------------- | ------- |
| Тип данных аутентификации      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| Аутентификация OpenAI       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| Аутентификация 智谱 AI      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Аутентификация Copilot      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Конфигурация Copilot PAT  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Учётная запись Antigravity  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| Формат ответа OpenAI   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| Формат ответа 智谱 AI  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| Внутренний API Copilot   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| Billing API Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Ответ Google Cloud  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**Ключевые константы**:
- `HIGH_USAGE_THRESHOLD = 80`：порог предупреждения высокого использования (types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000`：время тайм-аута запроса API (types.ts:114)

**Ключевые типы**:
- `QueryResult`：тип результата запроса (types.ts:15-19)
- `CopilotTier`：перечисление типа подписки Copilot (types.ts:57)

</details>
