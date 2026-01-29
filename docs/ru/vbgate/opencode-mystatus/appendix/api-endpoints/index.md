---
title: "API интерфейсы: Сводка | opencode-mystatus"
sidebarTitle: "API интерфейсы"
subtitle: "API интерфейсы: Сводка"
description: "Изучите официальные API интерфейсы opencode-mystatus. Включает методы аутентификации, форматы запросов и структуры ответов для OpenAI, Google Cloud, GitHub Copilot и других платформ."
tags:
  - "api"
  - "endpoints"
  - "справочник"
prerequisite:
  - "appendix-data-models"
order: 2
---

# Сводка API интерфейсов

## Что вы научитесь делать

- Поймите все официальные API интерфейсы, вызываемые плагином
- Поймите методы аутентификации каждой платформы (OAuth / API Key)
- Овладейте форматами запросов и структурами данных ответов
- Знайте, как независимо вызывать эти API

## Что такое API интерфейс

API интерфейс (Application Programming Interface) — это мост связи между программами. opencode-mystatus получает данные квоты вашей учётной записи, вызывая официальные API интерфейсы каждой платформы.

::: info Зачем понимать эти интерфейсы?
Понимание этих интерфейсов позволит вам:
1. Проверить источник данных плагина, убедиться в безопасности
2. Вручную вызывать интерфейсы для получения данных, когда плагин недоступен
3. Изучить, как создавать аналогичные инструменты запроса квоты
:::

## Интерфейс OpenAI

### Запрос квоты

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Метод | GET |
| Метод аутентификации | Bearer Token (OAuth) |
| Местоположение исходного кода | `plugin/lib/openai.ts:127-155` |

**Заголовки запроса**:

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // необязательно, для командной учётной записи
```

**Пример ответа**:

```json
{
  "plan_type": "Plus",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9180
    },
    "secondary_window": {
      "used_percent": 5,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 82800
    }
  }
}
```

**Описание полей ответа**:

- `plan_type`: тип подписки (Plus / Team / Pro)
- `rate_limit.primary_window`: лимит основного окна (обычно 3 часа)
- `rate_limit.secondary_window`: лимит вторичного окна (обычно 24 часа)
- `used_percent`: процент использования (0-100)
- `reset_after_seconds`: количество секунд до сброса

---

## Интерфейс 智谱 AI

### Запрос квоты

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Метод | GET |
| Метод аутентификации | API Key |
| Местоположение исходного кода | `plugin/lib/zhipu.ts:62-106` |

**Заголовки запроса**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

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
        "usage": 10000000,
        "currentValue": 500000,
        "percentage": 5,
        "nextResetTime": 1706200000000
      },
      {
        "type": "TIME_LIMIT",
        "usage": 100,
        "currentValue": 10,
        "percentage": 10
      }
    ]
  }
}
```

**Описание полей ответа**:

- `limits[].type`: тип лимита
  - `TOKENS_LIMIT`: лимит Token за 5 часов
  - `TIME_LIMIT`: количество запросов MCP (ежемесячная квота)
- `usage`: общая квота
- `currentValue`: текущее использованное количество
- `percentage`: процент использования (0-100)
- `nextResetTime`: временная метка следующего сброса (действительна только для TOKENS_LIMIT, единица: миллисекунда)

---

## Интерфейс Z.ai

### Запрос квоты

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Метод | GET |
| Метод аутентификации | API Key |
| Местоположение исходного кода | `plugin/lib/zhipu.ts:64, 85-106` |

**Заголовки запроса**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Формат ответа**: аналогично 智谱 AI, см. выше.

---

## Интерфейс Google Cloud

### 1. Обновление Access Token

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://oauth2.googleapis.com/token` |
| Метод | POST |
| Метод аутентификации | OAuth Refresh Token |
| Местоположение исходного кода | `plugin/lib/google.ts:90, 162-184` |

**Заголовки запроса**:

```http
Content-Type: application/x-www-form-urlencoded
```

**Тело запроса**:

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**Пример ответа**:

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**Описание полей**:

- `access_token`: новый Access Token (действителен 1 час)
- `expires_in`: время истечения (секунды)

---

### 2. Запрос квоты доступных моделей

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Метод | POST |
| Метод аутентификации | Bearer Token (OAuth) |
| Местоположение исходного кода | `plugin/lib/google.ts:65, 193-213` |

**Заголовки запроса**:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**Тело запроса**:

```json
{
  "project": "{project_id}"
}
```

**Пример ответа**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.85,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T12:00:00Z"
      }
    }
  }
}
```

**Описание полей ответа**:

- `models`: список моделей (ключ — имя модели)
- `quotaInfo.remainingFraction`: оставшаяся доля (0.0-1.0)
- `quotaInfo.resetTime`: время сброса (формат ISO 8601)

---

## Интерфейс GitHub Copilot

### 1. Публичный Billing API (рекомендуется)

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Метод | GET |
| Метод аутентификации | Fine-grained PAT (Personal Access Token) |
| Местоположение исходного кода | `plugin/lib/copilot.ts:157-177` |

**Заголовки запроса**:

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip Что такое Fine-grained PAT?
Fine-grained PAT (Fine-grained Personal Access Token) — это токен нового поколения от GitHub, поддерживающий более детальный контроль прав. Для запроса квоты Copilot нужно предоставить право чтения "Plan".
:::

**Пример ответа**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "username",
  "usageItems": [
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4",
      "unitType": "request",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3.5-sonnet",
      "unitType": "request",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

**Описание полей ответа**:

- `timePeriod`: временной период (год и месяц)
- `user`: имя пользователя GitHub
- `usageItems`: массив деталей использования
  - `sku`: название SKU (`Copilot Premium Request` означает Premium Requests)
  - `model`: имя модели
  - `grossQuantity`: общее количество запросов (до применения скидки)
  - `netQuantity`: чистое количество запросов (после применения скидки)
  - `limit`: лимит

---

### 2. Внутренний API квоты (старая версия)

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/user` |
| Метод | GET |
| Метод аутентификации | Copilot Session Token |
| Местоположение исходного кода | `plugin/lib/copilot.ts:242-304` |

**Заголовки запроса**:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Пример ответа**:

```json
{
  "copilot_plan": "pro",
  "quota_reset_date": "2026-02-01",
  "quota_snapshots": {
    "premium_interactions": {
      "entitlement": 300,
      "overage_count": 0,
      "overage_permitted": true,
      "percent_remaining": 24,
      "quota_id": "premium_interactions",
      "quota_remaining": 71,
      "remaining": 71,
      "unlimited": false
    },
    "chat": {
      "entitlement": 1000,
      "percent_remaining": 50,
      "quota_remaining": 500,
      "unlimited": false
    },
    "completions": {
      "entitlement": 2000,
      "percent_remaining": 80,
      "quota_remaining": 1600,
      "unlimited": false
    }
  }
}
```

**Описание полей ответа**:

- `copilot_plan`: тип подписки (`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: дата сброса квоты (YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests (основная квота)
- `quota_snapshots.chat`: квота Chat (если рассчитывается отдельно)
- `quota_snapshots.completions`: квота Completions (если рассчитывается отдельно)

---

### 3. Token Exchange API

**Информация об интерфейсе**:

| Проект | Значение |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/v2/token` |
| Метод | POST |
| Метод аутентификации | OAuth Token (получен из OpenCode) |
| Местоположение исходного кода | `plugin/lib/copilot.ts:183-208` |

**Заголовки запроса**:

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Пример ответа**:

```json
{
  "token": "gho_xxx_copilot_session",
  "expires_at": 1706203600,
  "refresh_in": 3600,
  "endpoints": {
    "api": "https://api.github.com"
  }
}
```

**Описание полей ответа**:

- `token`: Copilot Session Token (для вызова внутреннего API)
- `expires_at`: временная метка истечения (секунды)
- `refresh_in`: рекомендуемое время обновления (секунды)

::: warning Внимание
Этот интерфейс применим только для старого процесса аутентификации GitHub OAuth. Официальный процесс партнёрской аутентификации OpenCode нового поколения (с января 2026 года) может потребовать использования Fine-grained PAT.
:::

---

## Сравнение методов аутентификации

| Платформа | Метод аутентификации | Источник учётных данных | Файл учётных данных |
|--- | --- | --- | ---|
| **OpenAI** | OAuth Bearer Token | OAuth OpenCode | `~/.local/share/opencode/auth.json` |
| **智谱 AI** | API Key | Пользователь настраивает вручную | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | Пользователь настраивает вручную | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | Плагин opencode-antigravity-auth | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | Пользователь настраивает вручную или OAuth | `~/.config/opencode/copilot-quota-token.json` 或 `~/.local/share/opencode/auth.json` |

---

## Тайм-аут запросов

Все API запросы имеют ограничение тайм-аута в 10 секунд, чтобы избежать длительного ожидания:

| Конфигурация | Значение | Местоположение исходного кода |
|--- | --- | ---|
| Время тайм-аута | 10 секунд | `plugin/lib/types.ts:114` |
| Реализация тайм-аута | функция `fetchWithTimeout` | `plugin/lib/utils.ts:84-100` |

---

## Безопасность

### Маскировка API Key

Плагин автоматически маскирует API Key при отображении, показывая только первые и последние 2 символа:

```typescript
// Пример: sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**Местоположение исходного кода**: `plugin/lib/utils.ts:130-139`

### Хранение данных

- Все файлы аутентификации только **для чтения**, плагин не изменяет никаких файлов
- Данные ответа API **не кэшируются**、**не хранятся**
- Чувствительная информация (API Key、Token) маскируется в памяти перед отображением

**Местоположение исходного кода**:
- `plugin/mystatus.ts:35-46` (чтение файлов аутентификации)
- `plugin/lib/utils.ts:130-139` (функция маскировки)

---

## Итог урока

В этом уроке представлены все официальные API интерфейсы, вызываемые плагином opencode-mystatus:

| Платформа | Количество API | Метод аутентификации |
|--- | --- | ---|
| OpenAI | 1 | OAuth Bearer Token |
| 智谱 AI | 1 | API Key |
| Z.ai | 1 | API Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

Все интерфейсы — это официальные интерфейсы каждой платформы, гарантируя надёжность и безопасность источников данных. Плагин получает учётные данные через локальные файлы аутентификации только для чтения, не загружая никаких данных.

---

## Приложение: справочник по исходному коду

<details>
<summary><strong>Нажмите для просмотра местоположения исходного кода</strong></summary>

> Время обновления: 2026-01-23

| Функция | Путь к файлу | Номер строки |
|--- | --- | ---|
| API запроса квоты OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| API запроса квоты 智谱 AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| API запроса квоты Z.ai | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64 (общий интерфейс) |
| Обновление OAuth Token Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| API запроса квоты Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| Публичный Billing API GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| Внутренний API квоты GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Token Exchange API GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Функция маскировки API Key | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| Настройка тайм-аута запроса | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**Ключевые константы**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: интерфейс запроса квоты OpenAI
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`: интерфейс запроса квоты 智谱 AI
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`: интерфейс запроса квоты Z.ai
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: интерфейс запроса квоты Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: интерфейс обновления OAuth Token Google Cloud

**Ключевые функции**:

- `fetchOpenAIUsage()`: вызов API квоты OpenAI
- `fetchUsage()`: вызов API квоты 智谱 AI / Z.ai (общий)
- `refreshAccessToken()`: обновление Access Token Google
- `fetchGoogleUsage()`: вызов API квоты Google Cloud
- `fetchPublicBillingUsage()`: вызов публичного Billing API GitHub Copilot
- `fetchCopilotUsage()`: вызов внутреннего API квоты GitHub Copilot
- `exchangeForCopilotToken()`: обмен OAuth Token на Copilot Session Token
- `maskString()`: маскировка API Key

</details>
